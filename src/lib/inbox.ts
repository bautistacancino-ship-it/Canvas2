import { clamp, resourceImpact } from '@/lib/scoring';
import type {
  ActivityOutcome,
  ActivityResult,
  BadgeId,
  InboxConfig,
  InboxLead,
  InboxOption,
  LeadClass,
  LeadField,
  MeterEffects,
} from '@/types/game';

/* ──────────────────────────────────────────────────────────────
 * Motor del Inbox de Leads. Todo se DERIVA de las elecciones del
 * jugador (picks), así el estado de la UI es mínimo y el cálculo
 * es puro y fácil de probar.
 * ────────────────────────────────────────────────────────────── */

/** leadId → ids de las opciones elegidas, en orden. */
export type InboxPicks = Record<string, string[]>;
export type InboxClasses = Record<string, LeadClass | undefined>;

export interface PointLine {
  label: string;
  points: number;
}

export interface LeadComputed {
  lead: InboxLead;
  chosen: InboxOption[];
  trust: number;
  unlocked: Set<LeadField>;
  ficheComplete: boolean;
  finished: boolean;
}

export interface InboxComputed {
  leads: Record<string, LeadComputed>;
  hours: number;
  budget: number;
  points: number;
  breakdown: PointLine[];
  badges: BadgeId[];
  flags: string[];
}

export interface InboxEvaluation {
  outcome: ActivityOutcome;
  correctByLead: Record<string, boolean>;
  correctClassifications: number;
  totalLeads: number;
  points: number;
  breakdown: PointLine[];
  hours: number;
  budget: number;
  badges: BadgeId[];
  flags: string[];
  meterImpact: MeterEffects;
}

export function computeInbox(config: InboxConfig, picks: InboxPicks): InboxComputed {
  let hours = config.initial.hours;
  let budget = config.initial.budget;
  const breakdown: PointLine[] = [];
  const badges: BadgeId[] = [];
  const flags: string[] = [];
  const leads: Record<string, LeadComputed> = {};

  for (const lead of config.leads) {
    const chosen = (picks[lead.id] ?? []).map((id, i) => lead.decisions[i].options.find((o) => o.id === id)!);
    const unlocked = new Set<LeadField>(lead.knownFields);
    let trust = config.initial.trust;
    let discovered = 0;

    for (const option of chosen) {
      trust = clamp(trust + (option.effects.trust ?? 0), 0, 100);
      hours += option.effects.hours ?? 0;
      budget += option.effects.budget ?? 0;
      for (const field of option.unlocks ?? []) {
        if (!unlocked.has(field)) {
          unlocked.add(field);
          discovered++;
        }
      }
      if (option.bonusPoints) breakdown.push({ label: `${lead.name}: ${option.tag ?? 'Bonus'}`, points: option.bonusPoints });
      if (option.badgeId) badges.push(option.badgeId);
      flags.push(...(option.flags ?? []));
    }

    if (discovered > 0) {
      breakdown.push({ label: `${lead.name}: ${discovered} datos descubiertos`, points: discovered * config.rewards.perField });
    }
    const ficheComplete = unlocked.size === config.fields.length;
    if (ficheComplete) breakdown.push({ label: `${lead.name}: ficha 100% completa 📋`, points: config.rewards.ficheComplete });

    leads[lead.id] = {
      lead,
      chosen,
      trust,
      unlocked,
      ficheComplete,
      finished: chosen.length === lead.decisions.length,
    };
  }

  return {
    leads,
    hours: Math.max(0, hours),
    budget: Math.max(0, budget),
    points: breakdown.reduce((acc, line) => acc + line.points, 0),
    breakdown,
    badges,
    flags,
  };
}

/** Impacto del pipeline en los medidores globales de la agencia (±30 máx.). */
export function meterImpact(config: InboxConfig, computed: InboxComputed) {
  const trusts = Object.values(computed.leads).map((l) => l.trust - config.initial.trust);
  const avgTrust = trusts.reduce((a, b) => a + b, 0) / Math.max(trusts.length, 1);
  return {
    rentabilidad: resourceImpact(computed.budget - config.initial.budget, computed.hours - config.initial.hours),
    reputacion: clamp(Math.round(avgTrust / 2), -30, 30),
  };
}

export function evaluateInbox(config: InboxConfig, computed: InboxComputed, classes: InboxClasses): InboxEvaluation {
  const correctByLead = Object.fromEntries(config.leads.map((l) => [l.id, classes[l.id] === l.correctClass]));
  const correctCount = Object.values(correctByLead).filter(Boolean).length;

  const collapsed =
    computed.flags.some((f) => config.collapse.flags.includes(f)) || computed.budget < config.collapse.budgetBelow;
  const total =
    !collapsed &&
    Object.values(computed.leads).every((l) => l.ficheComplete) &&
    correctCount === config.leads.length &&
    computed.hours >= config.success.minHours &&
    computed.budget >= config.success.minBudget;
  const outcome: ActivityOutcome = collapsed ? 'collapse' : total ? 'total' : 'partial';

  const breakdown = [...computed.breakdown];
  if (correctCount > 0) {
    breakdown.push({ label: `${correctCount} leads bien clasificados`, points: correctCount * config.rewards.correctClass });
  }
  const badges = [...computed.badges];
  if (outcome === 'total' && config.completionBadgeId) badges.push(config.completionBadgeId);

  return {
    outcome,
    correctByLead,
    correctClassifications: correctCount,
    totalLeads: config.leads.length,
    points: breakdown.reduce((acc, line) => acc + line.points, 0),
    breakdown,
    hours: computed.hours,
    budget: computed.budget,
    badges,
    flags: computed.flags,
    meterImpact: meterImpact(config, computed),
  };
}

export function toActivityResult(evaluation: InboxEvaluation): ActivityResult {
  return {
    kind: 'inbox',
    outcome: evaluation.outcome,
    points: evaluation.points,
    badges: evaluation.badges,
    flags: evaluation.flags,
    meterImpact: evaluation.meterImpact,
    highlight: {
      label: 'Leads bien clasificados',
      value: `${evaluation.correctClassifications}/${evaluation.totalLeads}`,
    },
  };
}
