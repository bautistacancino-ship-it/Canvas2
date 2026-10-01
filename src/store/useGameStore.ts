import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { LEVEL_COMPLETION_POINTS, applyMeterEffects } from '@/lib/scoring';
import type {
  ActivityResult,
  BadgeId,
  BlockPhase,
  BlockProgress,
  BusinessId,
  CanvasBlockId,
  CanvasEntry,
  Meters,
  PlayerProfile,
  QuizResult,
} from '@/types/game';

/* ──────────────────────────────────────────────────────────────
 * Store global del juego (Zustand + persist → localStorage).
 *
 * Reglas anti-farming (refrescar o repetir no regala puntos):
 *  - El quiz puntúa una sola vez por bloque (el primer intento aprobado).
 *  - La actividad práctica (Fase 3) puntúa una sola vez por bloque.
 *  - El bonus de nivel completado se entrega una sola vez.
 * ────────────────────────────────────────────────────────────── */

export const STORAGE_KEY = 'canvaslab:v1';
/** Clave usada antes del cambio de nombre (se migra una vez en StoreHydrator). */
export const LEGACY_STORAGE_KEY = 'canvas-quest:v1';

export const INITIAL_METERS: Meters = { rentabilidad: 50, reputacion: 50 };

export interface ScoreEvent {
  points: number;
  reason: string;
  at: string;
}

interface GameData {
  profile: PlayerProfile | null;
  score: number;
  streak: number;
  bestStreak: number;
  meters: Meters;
  progress: Partial<Record<CanvasBlockId, BlockProgress>>;
  canvas: Partial<Record<CanvasBlockId, CanvasEntry>>;
  badges: BadgeId[];
  /** Marcas narrativas para eventos futuros (ej. 'nurtured-camila'). */
  flags: string[];
  scoreLog: ScoreEvent[];
}

interface GameActions {
  startGame: (businessId: BusinessId, playerName: string) => void;
  registerQuizAnswer: (correct: boolean) => void;
  setPhase: (blockId: CanvasBlockId, phase: BlockPhase) => void;
  completeQuiz: (blockId: CanvasBlockId, result: QuizResult, badges: BadgeId[]) => void;
  completeActivity: (blockId: CanvasBlockId, result: ActivityResult) => void;
  saveCanvasDraft: (blockId: CanvasBlockId, entry: CanvasEntry) => void;
  completeLevel: (blockId: CanvasBlockId, entry: CanvasEntry) => void;
  resetGame: () => void;
}

interface HydrationState {
  hasHydrated: boolean;
}

export type GameStore = GameData & GameActions & HydrationState;

const initialData: GameData = {
  profile: null,
  score: 0,
  streak: 0,
  bestStreak: 0,
  meters: INITIAL_METERS,
  progress: {},
  canvas: {},
  badges: [],
  flags: [],
  scoreLog: [],
};

const MAX_LOG = 50;

function patchProgress(
  progress: GameData['progress'],
  blockId: CanvasBlockId,
  patch: Partial<BlockProgress>,
): GameData['progress'] {
  const current = progress[blockId] ?? { phase: 'theory' };
  return { ...progress, [blockId]: { ...current, ...patch } };
}

function withPoints(state: GameData, points: number, reason: string): Partial<GameData> {
  if (points <= 0) return {};
  return {
    score: state.score + points,
    scoreLog: [{ points, reason, at: new Date().toISOString() }, ...state.scoreLog].slice(0, MAX_LOG),
  };
}

const union = <T,>(a: T[], b: T[]) => [...new Set([...a, ...b])];

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialData,
      hasHydrated: false,

      startGame: (businessId, playerName) =>
        set({
          ...initialData,
          profile: {
            businessId,
            playerName: playerName.trim() || 'Estudiante',
            startedAt: new Date().toISOString(),
          },
        }),

      registerQuizAnswer: (correct) =>
        set((s) => {
          const streak = correct ? s.streak + 1 : 0;
          return { streak, bestStreak: Math.max(s.bestStreak, streak) };
        }),

      setPhase: (blockId, phase) => set((s) => ({ progress: patchProgress(s.progress, blockId, { phase }) })),

      completeQuiz: (blockId, result, badges) =>
        set((s) => {
          const alreadyScored = Boolean(s.progress[blockId]?.quiz);
          return {
            ...(alreadyScored ? {} : withPoints(s, result.points, `Quiz · ${blockId}`)),
            badges: union(s.badges, badges),
            progress: patchProgress(s.progress, blockId, {
              phase: 'simulation',
              quiz: s.progress[blockId]?.quiz ?? result,
            }),
          };
        }),

      completeActivity: (blockId, result) =>
        set((s) => {
          const alreadyScored = Boolean(s.progress[blockId]?.activity);
          return {
            ...(alreadyScored
              ? {}
              : { ...withPoints(s, result.points, `Actividad · ${blockId}`), meters: applyMeterEffects(s.meters, result.meterImpact) }),
            badges: union(s.badges, result.badges),
            flags: union(s.flags, result.flags),
            progress: patchProgress(s.progress, blockId, {
              phase: 'build',
              activity: s.progress[blockId]?.activity ?? result,
            }),
          };
        }),

      saveCanvasDraft: (blockId, entry) => set((s) => ({ canvas: { ...s.canvas, [blockId]: entry } })),

      completeLevel: (blockId, entry) =>
        set((s) => {
          const alreadyDone = s.progress[blockId]?.phase === 'done';
          return {
            ...(alreadyDone ? {} : withPoints(s, LEVEL_COMPLETION_POINTS, `Nivel completado · ${blockId}`)),
            canvas: { ...s.canvas, [blockId]: entry },
            progress: patchProgress(s.progress, blockId, {
              phase: 'done',
              completedAt: s.progress[blockId]?.completedAt ?? new Date().toISOString(),
            }),
          };
        }),

      resetGame: () => set({ ...initialData }),
    }),
    {
      name: STORAGE_KEY,
      version: 3,
      storage: createJSONStorage(() => localStorage),
      // Rehidratamos manualmente desde <StoreHydrator/> para evitar
      // mismatches entre el HTML del servidor y el estado del cliente.
      skipHydration: true,
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<GameData>;
        // v2: el Nivel 1 cambió por completo (nuevo quiz, Inbox de Leads y media query).
        // Se conserva el perfil y se reinicia el avance.
        if (version < 2) return { ...initialData, profile: old.profile ?? null } as GameStore;
        // v3: el resultado de la Fase 3 pasó de `inbox` a `activity` (genérico para cualquier actividad).
        if (version < 3) {
          type LegacyInbox = { outcome: ActivityResult['outcome']; points: number; badges: BadgeId[]; flags: string[]; meterImpact: ActivityResult['meterImpact']; correctClassifications: number; totalLeads: number };
          const progress = Object.fromEntries(
            Object.entries(old.progress ?? {}).map(([id, p]) => {
              const { inbox, ...rest } = p as BlockProgress & { inbox?: LegacyInbox };
              if (!inbox) return [id, rest];
              const activity: ActivityResult = {
                kind: 'inbox',
                outcome: inbox.outcome,
                points: inbox.points,
                badges: inbox.badges,
                flags: inbox.flags,
                meterImpact: inbox.meterImpact,
                highlight: { label: 'Leads bien clasificados', value: `${inbox.correctClassifications}/${inbox.totalLeads}` },
              };
              return [id, { ...rest, activity }];
            }),
          );
          return { ...(old as GameData), progress } as GameStore;
        }
        return persisted as GameStore;
      },
      partialize: ({ profile, score, streak, bestStreak, meters, progress, canvas, badges, flags, scoreLog }) => ({
        profile,
        score,
        streak,
        bestStreak,
        meters,
        progress,
        canvas,
        badges,
        flags,
        scoreLog,
      }),
      onRehydrateStorage: () => () => {
        useGameStore.setState({ hasHydrated: true });
      },
    },
  ),
);

/* ─── Selectores reutilizables ────────────────────────────────── */

export const useHasHydrated = () => useGameStore((s) => s.hasHydrated);

export const selectBlockPhase =
  (blockId: CanvasBlockId) =>
  (s: GameStore): BlockPhase =>
    s.progress[blockId]?.phase ?? 'theory';
