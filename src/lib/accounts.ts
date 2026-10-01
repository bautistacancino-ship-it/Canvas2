import { clamp, resourceImpact } from '@/lib/scoring';
import type {
  AccountEventOption,
  AccountsConfig,
  ActivityOutcome,
  ActivityResult,
  BadgeId,
  MeterEffects,
  RelationCard,
} from '@/types/game';
import type { PointLine } from './inbox';

/* ──────────────────────────────────────────────────────────────
 * Motor del Account Health Monitor. El jugador solo produce un
 * `MonthPlan` por mes (respuesta al evento + cartas); el estado
 * de la cartera se obtiene "jugando" esos planes en orden.
 * ────────────────────────────────────────────────────────────── */

export interface MonthPlan {
  eventOptionId?: string;
  /** clientId → cartas de alcance "cliente" asignadas este mes. */
  assignments: Record<string, string[]>;
  /** Cartas globales activadas este mes. */
  globals: string[];
}

export const emptyPlan = (): MonthPlan => ({ assignments: {}, globals: [] });

export interface ClientState {
  health: number;
  fee: number;
  lost: boolean;
}

export interface LineItem {
  label: string;
  delta: number;
}

export interface MonthReport {
  month: number;
  eventText: string;
  eventOutcome: string;
  eventCorrect: boolean;
  clients: Record<string, { start: number; end: number; items: LineItem[]; red: boolean; costAlert: boolean; lost: boolean }>;
  hoursUsed: number;
  hoursAvailable: number;
  energy: number;
  mrr: number;
  notes: string[];
}

export interface AccountsState {
  /** Próximo mes a jugar (1-based). Mayor que `months` = terminado. */
  month: number;
  clients: Record<string, ClientState>;
  energy: number;
  installed: string[]; // "cardId" (global) o "cardId:clientId"
  communityUntil: number;
  hoursDrain: number;
  laterHealth: { month: number; client: string; health: number; note: string }[];
  laterHours: { month: number; hours: number; note: string }[];
  extraSales: string[];
  oneTimeIncome: number;
  correctEvents: number;
  safeMonths: number;
  costAlertMonths: number;
  bonus: PointLine[];
  badges: BadgeId[];
  reports: MonthReport[];
}

export function initialAccounts(config: AccountsConfig): AccountsState {
  return {
    month: 1,
    clients: Object.fromEntries(config.clients.map((c) => [c.id, { health: c.health, fee: c.fee, lost: false }])),
    energy: 100,
    installed: [],
    communityUntil: 0,
    hoursDrain: 0,
    laterHealth: [],
    laterHours: [],
    extraSales: [],
    oneTimeIncome: 0,
    correctEvents: 0,
    safeMonths: 0,
    costAlertMonths: 0,
    bonus: [],
    badges: [],
    reports: [],
  };
}

export const mrrOf = (state: AccountsState) => Object.values(state.clients).reduce((a, c) => a + (c.lost ? 0 : c.fee), 0);

const key = (card: RelationCard, clientId?: string) => (card.scope === 'client' ? `${card.id}:${clientId}` : card.id);

/* ─── Contexto de planificación del mes en curso ──────────────── */

export interface MonthContext {
  event?: AccountsConfig['events'][number];
  option?: AccountEventOption;
  hoursAvailable: number;
  hoursUsed: number;
  /** Horas que cuesta cada asignación de este mes. */
  cardCost: (card: RelationCard, clientId?: string) => number;
  /** ¿Se puede usar la carta (para ese cliente) este mes? Devuelve el motivo si no. */
  blockedReason: (card: RelationCard, clientId?: string) => string | null;
  clientHours: Record<string, number>;
  costAlert: Record<string, boolean>;
  communityActive: boolean;
}

export function monthContext(config: AccountsConfig, state: AccountsState, plan: MonthPlan): MonthContext {
  const m = state.month;
  const event = config.events.find((e) => e.month === m);
  const option = event?.options.find((o) => o.id === plan.eventOptionId);
  const viaEvent = option?.usesCard ? `${option.usesCard.card}:${option.usesCard.client}` : null;
  const communityActive = state.communityUntil >= m;

  const cardCost = (card: RelationCard, clientId?: string) => {
    const k = key(card, clientId);
    if (k === viaEvent) return 0;
    if ((card.billing === 'install' || card.billing === 'oneshot') && state.installed.includes(k)) return 0;
    if (card.billing === 'quarter' && communityActive) return 0;
    return card.hours;
  };

  const clientHours: Record<string, number> = {};
  let hoursUsed = 0;
  for (const c of config.clients) {
    clientHours[c.id] = 0;
    for (const cardId of plan.assignments[c.id] ?? []) {
      const card = config.cards.find((x) => x.id === cardId)!;
      const h = cardCost(card, c.id);
      clientHours[c.id] += h;
      hoursUsed += h;
    }
  }
  for (const cardId of plan.globals) hoursUsed += cardCost(config.cards.find((x) => x.id === cardId)!);

  const laterHours = state.laterHours.filter((l) => l.month === m).reduce((a, l) => a + l.hours, 0);
  const hoursAvailable =
    config.hoursPerMonth - state.hoursDrain - (option?.hoursDrainFromNow ?? 0) - (option?.hours ?? 0) - laterHours;

  const blockedReason = (card: RelationCard, clientId?: string) => {
    if (clientId && state.clients[clientId]?.lost) return 'Este cliente se fue';
    if (card.onlyClients && clientId && !card.onlyClients.includes(clientId)) return 'No aplica a este cliente';
    if (card.onlyMonths && !card.onlyMonths.includes(m)) return `Solo en el mes ${card.onlyMonths.join(', ')}`;
    const k = key(card, clientId);
    if (k === viaEvent) return 'Ya activada por el evento';
    if (card.billing === 'oneshot' && state.installed.includes(k)) return 'Ya usada';
    if (card.billing === 'install' && state.installed.includes(k)) return 'Ya instalada: actúa sola cada mes';
    if (card.billing === 'quarter' && communityActive) return `Activa hasta el mes ${state.communityUntil}`;
    return null;
  };

  const costAlert = Object.fromEntries(
    config.clients.map((c) => [c.id, clientHours[c.id] * config.hourValue > (state.clients[c.id]?.fee ?? 0)]),
  );

  return { event, option, hoursAvailable, hoursUsed, cardCost, blockedReason, clientHours, costAlert, communityActive };
}

/* ─── Cierre de mes ───────────────────────────────────────────── */

export function closeMonth(config: AccountsConfig, prev: AccountsState, plan: MonthPlan): AccountsState {
  const m = prev.month;
  const ctx = monthContext(config, prev, plan);
  const state: AccountsState = structuredClone(prev);
  const items: Record<string, LineItem[]> = Object.fromEntries(config.clients.map((c) => [c.id, []]));
  const start = Object.fromEntries(config.clients.map((c) => [c.id, prev.clients[c.id].health]));
  const notes: string[] = [];
  const add = (clientId: string, label: string, delta: number) => {
    if (!delta || state.clients[clientId].lost) return;
    items[clientId].push({ label, delta });
    state.clients[clientId].health += delta;
  };

  // 1. Evento del mes
  const option = ctx.option;
  if (option) {
    if (option.correct) state.correctEvents++;
    for (const [clientId, delta] of Object.entries(option.health ?? {})) add(clientId, 'Evento del mes', delta ?? 0);
    if (option.hoursDrainFromNow) state.hoursDrain += option.hoursDrainFromNow;
    state.laterHealth.push(...(option.later ?? []));
    state.laterHours.push(...(option.laterHours ?? []));
    if (option.feeChange) state.clients[option.feeChange.client].fee = option.feeChange.fee;
    if (option.oneTimeIncome) state.oneTimeIncome += option.oneTimeIncome;
    if (option.extraSale) state.extraSales.push(option.extraSale);
    if (option.bonusPoints) state.bonus.push({ label: option.outcome, points: option.bonusPoints });
    if (option.badgeId) state.badges.push(option.badgeId);
    if (option.usesCard) {
      const card = config.cards.find((c) => c.id === option.usesCard!.card)!;
      state.installed.push(`${card.id}:${option.usesCard.client}`);
      if (card.bonusPoints && m === 1) state.bonus.push({ label: `${card.name} en el mes 1`, points: card.bonusPoints });
      if (card.badgeId) state.badges.push(card.badgeId);
    }
  }

  // 2. Efectos diferidos de meses anteriores
  for (const later of prev.laterHealth.filter((l) => l.month === m)) {
    add(later.client, later.note, later.health);
    notes.push(later.note);
  }
  for (const later of prev.laterHours.filter((l) => l.month === m)) notes.push(`${later.note} (−${later.hours} h)`);

  // 3. Cartas de este mes
  for (const c of config.clients) {
    for (const cardId of plan.assignments[c.id] ?? []) {
      const card = config.cards.find((x) => x.id === cardId)!;
      const k = key(card, c.id);
      if (card.billing === 'install' || card.billing === 'oneshot') {
        if (!state.installed.includes(k)) {
          state.installed.push(k);
          if (card.bonusPoints && m === 1) state.bonus.push({ label: `${card.name} en el mes 1`, points: card.bonusPoints });
          if (card.badgeId) state.badges.push(card.badgeId);
          if (card.billing === 'oneshot') add(c.id, card.name, card.effects[c.id] ?? 0);
        }
      } else {
        add(c.id, card.name, card.effects[c.id] ?? 0);
      }
    }
  }
  for (const cardId of plan.globals) {
    const card = config.cards.find((x) => x.id === cardId)!;
    if (card.billing === 'install' && !state.installed.includes(card.id)) state.installed.push(card.id);
    if (card.billing === 'quarter' && !ctx.communityActive) state.communityUntil = m + 2;
    if (card.billing === 'monthly') {
      for (const c of config.clients) add(c.id, card.name, card.effects[c.id] ?? 0);
      if (card.energyPerMonth) state.energy = Math.max(0, state.energy - card.energyPerMonth);
    }
  }

  // 4. Cartas instaladas y trimestrales que actúan solas
  for (const card of config.cards) {
    if (card.billing === 'install') {
      for (const c of config.clients) {
        if (state.installed.includes(key(card, c.id))) add(c.id, `${card.name} (automático)`, card.effects[c.id] ?? 0);
      }
    }
    if (card.billing === 'quarter' && state.communityUntil >= m) {
      for (const c of config.clients) add(c.id, card.name, card.effects[c.id] ?? 0);
    }
  }

  // 5. Desgaste mensual, límites y abandono
  const lostNow: string[] = [];
  for (const c of config.clients) {
    add(c.id, 'Desgaste del mes', -c.decay);
    const cs = state.clients[c.id];
    if (cs.lost) continue;
    cs.health = clamp(cs.health, 0, 100);
    if (cs.health <= 0) {
      cs.lost = true;
      lostNow.push(c.name);
      notes.push(`${c.avatar} ${c.name} se fue: su fee desaparece del ingreso mensual.`);
    }
  }

  // 6. Métricas del mes
  const anyRed = config.clients.some((c) => !state.clients[c.id].lost && state.clients[c.id].health < config.riskThreshold);
  if (!anyRed && lostNow.length === 0) state.safeMonths++;
  const anyCostAlert = Object.values(ctx.costAlert).some(Boolean);
  if (anyCostAlert) state.costAlertMonths++;

  state.reports.push({
    month: m,
    eventText: ctx.event?.text ?? '',
    eventOutcome: option?.outcome ?? '',
    eventCorrect: Boolean(option?.correct),
    clients: Object.fromEntries(
      config.clients.map((c) => [
        c.id,
        {
          start: start[c.id],
          end: state.clients[c.id].health,
          items: items[c.id],
          red: !state.clients[c.id].lost && state.clients[c.id].health < config.riskThreshold,
          costAlert: ctx.costAlert[c.id],
          lost: state.clients[c.id].lost,
        },
      ]),
    ),
    hoursUsed: ctx.hoursUsed,
    hoursAvailable: ctx.hoursAvailable,
    energy: state.energy,
    mrr: mrrOf(state),
    notes,
  });
  state.month = m + 1;
  return state;
}

export const playMonths = (config: AccountsConfig, plans: MonthPlan[]) =>
  plans.reduce((state, plan) => closeMonth(config, state, plan), initialAccounts(config));

/* ─── Evaluación final ────────────────────────────────────────── */

export interface AccountsEvaluation {
  retained: number;
  avgHealth: number;
  mrr: number;
  initialMrr: number;
  energy: number;
  extraSales: string[];
  breakdown: PointLine[];
  points: number;
  badges: BadgeId[];
  outcome: ActivityOutcome;
  meterImpact: MeterEffects;
  lostClients: string[];
}

export function evaluateAccounts(config: AccountsConfig, state: AccountsState): AccountsEvaluation {
  const { rewards, success } = config;
  const active = config.clients.filter((c) => !state.clients[c.id].lost);
  const lostClients = config.clients.filter((c) => state.clients[c.id].lost);
  const avgHealth = active.length ? Math.round(active.reduce((a, c) => a + state.clients[c.id].health, 0) / active.length) : 0;
  const initialMrr = config.clients.reduce((a, c) => a + c.fee, 0);
  const mrr = mrrOf(state);

  const breakdown: PointLine[] = [];
  const badges: BadgeId[] = [...state.badges];
  if (state.correctEvents) breakdown.push({ label: `${state.correctEvents} eventos bien resueltos 💚`, points: state.correctEvents * rewards.perCorrectEvent });
  if (state.safeMonths) breakdown.push({ label: `${state.safeMonths} meses sin clientes en rojo`, points: state.safeMonths * rewards.perSafeMonth });
  breakdown.push(...state.bonus);
  if (state.costAlertMonths === 0) {
    breakdown.push({ label: 'Atención proporcional al plan (sin alertas 💸)', points: rewards.proportionalBonus });
    if (config.badges.proportional) badges.push(config.badges.proportional);
  }
  if (lostClients.length) breakdown.push({ label: `${lostClients.length} cliente(s) perdido(s)`, points: -lostClients.length * rewards.lostClientPenalty });

  const collapse = lostClients.length > 0 || state.energy <= 0;
  const total =
    !collapse &&
    active.every((c) => state.clients[c.id].health >= success.minHealth) &&
    state.energy >= success.minEnergy &&
    state.extraSales.length >= success.minExtraSales &&
    mrr >= success.minMrr;
  const outcome: ActivityOutcome = collapse ? 'collapse' : total ? 'total' : 'partial';
  if (total && config.badges.completion) badges.push(config.badges.completion);

  return {
    retained: active.length,
    avgHealth,
    mrr,
    initialMrr,
    energy: state.energy,
    extraSales: state.extraSales,
    breakdown,
    points: Math.max(0, breakdown.reduce((a, l) => a + l.points, 0)),
    badges: [...new Set(badges)],
    outcome,
    lostClients: lostClients.map((c) => c.name),
    meterImpact: {
      rentabilidad: resourceImpact(mrr - initialMrr + state.oneTimeIncome, 0),
      reputacion: clamp(Math.round((avgHealth - 60) / 2) - lostClients.length * 10, -30, 30),
    },
  };
}

export function toAccountsResult(evaluation: AccountsEvaluation): ActivityResult {
  return {
    kind: 'accounts',
    outcome: evaluation.outcome,
    points: evaluation.points,
    badges: evaluation.badges,
    flags: [],
    meterImpact: evaluation.meterImpact,
    highlight: { label: 'Clientes retenidos', value: `${evaluation.retained}/${evaluation.retained + evaluation.lostClients.length}` },
  };
}
