import type { MeterEffects, Meters, QuizConfig } from '@/types/game';

/* ──────────────────────────────────────────────────────────────
 * Reglas de puntaje comunes. Los valores específicos de cada nivel
 * (puntos por acierto, bonos, umbrales) viven en su LevelConfig.
 * ────────────────────────────────────────────────────────────── */

export const LEVEL_COMPLETION_POINTS = 250;

export function quizAnswerPoints(correct: boolean, elapsedMs: number, config: QuizConfig) {
  if (!correct) return { points: 0, fast: false };
  const fast = elapsedMs < config.fastWithinSec * 1000;
  return { points: config.correctPoints + (fast ? config.fastBonus : 0), fast };
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function applyMeterEffects(meters: Meters, effects: MeterEffects): Meters {
  return {
    rentabilidad: clamp(meters.rentabilidad + (effects.rentabilidad ?? 0), 0, 100),
    reputacion: clamp(meters.reputacion + (effects.reputacion ?? 0), 0, 100),
  };
}

/** Impacto en Rentabilidad según monedas y horas ganadas/perdidas en una actividad (máx. ±30). */
export const resourceImpact = (budgetDelta: number, hoursDelta: number) =>
  clamp(Math.round(budgetDelta / 200 + hoursDelta / 5), -30, 30);

export const formatCoins = (value: number) => value.toLocaleString('es-CL');

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
