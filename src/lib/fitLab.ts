import { resourceImpact, clamp } from '@/lib/scoring';
import type {
  ActivityOutcome,
  ActivityResult,
  BadgeId,
  FitLabConfig,
  HeroOption,
  HeroSlotId,
  MeterEffects,
} from '@/types/game';
import type { PointLine } from './inbox';

/* ──────────────────────────────────────────────────────────────
 * Motor del Fit Lab. Igual que el Inbox: la UI guarda solo las
 * acciones del jugador y todo lo demás se deriva aquí.
 * ────────────────────────────────────────────────────────────── */

export interface FitConnection {
  serviceId: string;
  correct: boolean;
  trap: boolean;
}

export interface FitMapState {
  /** needId → servicio con que se conectó (un solo intento por necesidad). */
  connections: Record<string, FitConnection>;
  /** Servicios enviados a la papelera. */
  trashed: string[];
}

export type HeroPicks = Partial<Record<HeroSlotId, string>>;

export interface FitLabEvaluation {
  correctConnections: number;
  trapsConnected: number;
  trapsTrashed: number;
  totalTraps: number;
  fitPct: number;
  hours: number;
  budget: number;
  chosen: Partial<Record<HeroSlotId, HeroOption>>;
  correctSlots: number;
  headlineCorrect: boolean;
  comprehension: number;
  ctr: number;
  reactions: string[];
  breakdown: PointLine[];
  points: number;
  badges: BadgeId[];
  outcome: ActivityOutcome;
  meterImpact: MeterEffects;
}

export const EMPTY_MAP: FitMapState = { connections: {}, trashed: [] };

export function evaluateFitLab(config: FitLabConfig, map: FitMapState, hero: HeroPicks): FitLabEvaluation {
  const { rewards } = config;
  const connections = Object.values(map.connections);
  const correctConnections = connections.filter((c) => c.correct).length;
  const trapsConnected = connections.filter((c) => c.trap).length;
  const trapIds = config.services.filter((s) => s.trap).map((s) => s.id);
  const trapsTrashed = map.trashed.filter((id) => trapIds.includes(id)).length;
  const fitPct = Math.round((correctConnections / config.needs.length) * 100);

  const chosen: Partial<Record<HeroSlotId, HeroOption>> = {};
  for (const slot of config.slots) {
    const option = slot.options.find((o) => o.id === hero[slot.id]);
    if (option) chosen[slot.id] = option;
  }
  const chosenOptions = Object.values(chosen);
  const correctSlots = chosenOptions.filter((o) => o?.correct).length;
  const headlineCorrect = Boolean(chosen.headline?.correct);
  const row = config.testTable.find((r) => correctSlots >= r.minCorrect) ?? config.testTable[config.testTable.length - 1];
  const { comprehension, ctr } = row;

  const breakdown: PointLine[] = [];
  const badges: BadgeId[] = [];
  if (correctConnections) breakdown.push({ label: `${correctConnections} conexiones de Fit 🧲`, points: correctConnections * rewards.perConnection });
  if (trapsTrashed) breakdown.push({ label: `${trapsTrashed} trampas a la papelera 🧹`, points: trapsTrashed * rewards.perTrashed });
  if (correctConnections === config.needs.length) {
    breakdown.push({ label: 'Medidor de Fit al 100%', points: rewards.fitPerfectBonus });
    if (config.fitPerfectBadgeId) badges.push(config.fitPerfectBadgeId);
  }
  if (correctSlots) breakdown.push({ label: `${correctSlots} slots correctos en el hero`, points: correctSlots * rewards.perSlot });
  for (const option of chosenOptions) {
    if (option?.bonusPoints) breakdown.push({ label: 'Testimonio con métrica 📊', points: option.bonusPoints });
    if (option?.badgeId) badges.push(option.badgeId);
  }

  const hours = Math.max(0, config.initial.hours - trapsConnected * rewards.trapHoursPenalty);
  const budget = config.initial.budget + (ctr >= rewards.ctrThreshold ? rewards.ctrBudgetBonus : 0);

  const total =
    correctConnections === config.needs.length &&
    trapsTrashed === trapIds.length &&
    correctSlots === config.slots.length &&
    comprehension >= config.success.minComprehension &&
    ctr >= config.success.minCtr;
  // "Rebote Total" según el documento, más lo que no alcanza el umbral de éxito parcial.
  const collapse =
    trapsConnected >= config.collapse.minTrapsConnected ||
    !headlineCorrect ||
    comprehension < config.collapse.minComprehension ||
    fitPct < config.partial.minFitPct ||
    correctSlots < config.partial.minSlots;
  const outcome: ActivityOutcome = total ? 'total' : collapse ? 'collapse' : 'partial';
  if (outcome === 'total' && config.completionBadgeId) badges.push(config.completionBadgeId);

  const reactions =
    correctSlots === config.slots.length
      ? [config.happyReaction]
      : [...new Set(chosenOptions.map((o) => o?.reaction).filter((r): r is string => Boolean(r)))];

  return {
    correctConnections,
    trapsConnected,
    trapsTrashed,
    totalTraps: trapIds.length,
    fitPct,
    hours,
    budget,
    chosen,
    correctSlots,
    headlineCorrect,
    comprehension,
    ctr,
    reactions,
    breakdown,
    points: breakdown.reduce((acc, line) => acc + line.points, 0),
    badges,
    outcome,
    meterImpact: {
      rentabilidad: resourceImpact(budget - config.initial.budget, hours - config.initial.hours),
      reputacion: clamp(Math.round((comprehension - 50) / 2), -30, 30),
    },
  };
}

export function toFitLabResult(evaluation: FitLabEvaluation): ActivityResult {
  return {
    kind: 'fit-lab',
    outcome: evaluation.outcome,
    points: evaluation.points,
    badges: evaluation.badges,
    flags: [],
    meterImpact: evaluation.meterImpact,
    highlight: { label: 'Comprensión del hero', value: `${evaluation.comprehension}%` },
  };
}
