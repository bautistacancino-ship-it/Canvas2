import { clamp, resourceImpact } from '@/lib/scoring';
import type { ActivityOutcome, ActivityResult, BadgeId, BoardCard, JourneyConfig, MeterEffects } from '@/types/game';
import type { PointLine } from './inbox';

/* ──────────────────────────────────────────────────────────────
 * Motor del Journey Board. La UI guarda solo los swipes y las
 * cartas en el tablero; recursos, embudo, eventos y puntaje se
 * derivan aquí (funciones puras, deterministas).
 * ────────────────────────────────────────────────────────────── */

/** swipeCardId → true (derecha: sirve) / false (izquierda: no sirve). */
export type SwipeAnswers = Record<string, boolean>;

export interface JourneyEvent {
  month: number;
  icon: string;
  title: string;
  impact: string;
  tone: 'good' | 'bad' | 'neutral';
}

export interface FunnelStage {
  phaseId: string;
  leads: number;
  /** Leads que se escaparon en esta fase (grieta o 404). */
  lost: number;
  gap: boolean;
  weak: boolean;
}

export interface JourneyEvaluation {
  swipeCorrect: number;
  trapsDiscarded: number;
  totalTraps: number;
  coinsUsed: number;
  hoursUsed: number;
  overBudget: boolean;
  overHours: boolean;
  gaps: string[];
  trapsOnBoard: number;
  awarenessChannels: number;
  funnel: FunnelStage[];
  events: JourneyEvent[];
  clients: number;
  secondSprints: number;
  referrals: number;
  hoursLeft: number;
  coinsLeft: number;
  newCoins: number;
  breakdown: PointLine[];
  points: number;
  badges: BadgeId[];
  outcome: ActivityOutcome;
  meterImpact: MeterEffects;
}

/** Cartas que el jugador puede poner en el tablero: las de proceso + las aprobadas en el swipe. */
export function availableCards(config: JourneyConfig, swipes: SwipeAnswers): BoardCard[] {
  return config.boardCards.filter((c) => !c.swipeId || swipes[c.swipeId] === true);
}

export function evaluateJourney(config: JourneyConfig, swipes: SwipeAnswers, placedIds: string[]): JourneyEvaluation {
  const { simulation: sim, rewards } = config;
  const [awarenessPhase, evaluationPhase, purchasePhase, deliveryPhase, postPhase] = config.phases.map((p) => p.id);

  /* ── Swipe ── */
  const swipeCorrect = config.swipeCards.filter((c) => swipes[c.id] !== undefined && swipes[c.id] === c.fits).length;
  const traps = config.swipeCards.filter((c) => c.trap);
  const trapsDiscarded = traps.filter((c) => swipes[c.id] === false).length;

  /* ── Tablero ── */
  const placed = availableCards(config, swipes).filter((c) => placedIds.includes(c.id));
  const inPhase = (phaseId: string) => placed.filter((c) => c.phaseId === phaseId);
  const has = (role: BoardCard['role']) => placed.some((c) => c.role === role);
  const coinsUsed = placed.reduce((a, c) => a + c.coins, 0);
  const hoursUsed = placed.reduce((a, c) => a + c.hours, 0);
  const gaps = config.phases.filter((p) => inPhase(p.id).length === 0).map((p) => p.id);
  const trapsOnBoard = placed.filter((c) => c.quality === 'trap').length;
  const qualifiedAwareness = inPhase(awarenessPhase).filter((c) => c.qualified);
  const awarenessChannels = qualifiedAwareness.length;

  /* ── Simulación del embudo ── */
  const events: JourneyEvent[] = [];
  let hoursPenalty = 0;

  // 1. Conocimiento
  const totalReach = inPhase(awarenessPhase).reduce((a, c) => a + (c.reach ?? 0), 0);
  let qualifiedLeads = qualifiedAwareness.reduce((a, c) => a + (c.reach ?? 0), 0);
  const linkedinOnly = has('linkedin') && awarenessChannels === 1;
  if (has('linkedin')) {
    if (linkedinOnly) qualifiedLeads = Math.round(qualifiedLeads * (1 - sim.linkedinDropPct / 100));
    events.push({
      month: 1,
      icon: '📉',
      title: 'El algoritmo de LinkedIn cambió.',
      impact: linkedinOnly
        ? `LinkedIn era tu único canal de conocimiento: tus leads bajaron un ${sim.linkedinDropPct}%.`
        : `Apenas lo notas: tienes ${awarenessChannels} canales de conocimiento.`,
      tone: linkedinOnly ? 'bad' : 'good',
    });
  }

  // 2. Evaluación
  const evalRate = Math.min(0.35, inPhase(evaluationPhase).reduce((a, c) => a + (c.rate ?? 0), 0));
  const evaluated = Math.round(qualifiedLeads * evalRate);

  // 3. Compra (la mejor carta manda; una carta débil pierde un % de leads)
  const purchaseCards = inPhase(purchasePhase);
  const best = [...purchaseCards].sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))[0];
  let purchaseRate = best?.rate ?? 0;
  const purchaseWeak = best?.quality === 'weak';
  if (purchaseWeak) purchaseRate *= 1 - sim.weakLeadLossPct / 100;
  let signed = Math.round(evaluated * purchaseRate);
  if (has('partners')) {
    if (purchaseCards.length) signed += sim.partnerSigned;
    events.push({
      month: 2,
      icon: '🤝',
      title: `La app de email te refiere ${sim.partnerSigned} clientes.`,
      impact: purchaseCards.length ? `+${sim.partnerSigned} leads directo a la fase de compra.` : 'Llegaron, pero no tenías cómo cerrar la compra (404).',
      tone: purchaseCards.length ? 'good' : 'bad',
    });
  }

  // 4. Entrega
  const deliveryCards = inPhase(deliveryPhase);
  const satisfied = deliveryCards.length ? signed : 0;
  const whatsappOnly = has('whatsapp') && !has('dashboard');
  if (has('whatsapp')) hoursPenalty += Math.round(config.resources.hours * (sim.weakHoursPenaltyPct / 100));
  events.push({
    month: 2,
    icon: '📞',
    title: 'Un cliente pide un informe urgente un viernes en la noche.',
    impact: has('dashboard')
      ? 'Lo ve en el dashboard. Sin impacto.'
      : whatsappOnly
        ? `Se resuelve por WhatsApp: −${sim.urgentReportHours} horas del equipo.`
        : 'No hay canal de entrega: el cliente queda a ciegas.',
    tone: has('dashboard') ? 'good' : 'bad',
  });
  if (whatsappOnly) hoursPenalty += sim.urgentReportHours;

  // 5. Postventa
  const secondSprints = has('results-meeting') ? Math.round(satisfied * sim.secondSprintRate) : 0;
  const referrals = has('referrals') ? Math.round(satisfied * sim.referralRate) : 0;
  const valentina = has('referrals') && satisfied > 0 ? sim.valentinaClients : 0;
  events.push({
    month: 3,
    icon: '🗣️',
    title: 'Valentina te recomienda en un evento.',
    impact: valentina ? `+${valentina} cliente nuevo gracias a tu programa de referidos.` : 'Te recomendó, pero no tenías un sistema para capturar ese referido.',
    tone: valentina ? 'good' : 'bad',
  });
  const clients = signed + valentina;

  const stage = (phaseId: string, leads: number, next: number, weak = false): FunnelStage => ({
    phaseId,
    leads,
    lost: Math.max(0, leads - next),
    gap: gaps.includes(phaseId),
    weak,
  });
  const funnel: FunnelStage[] = [
    stage(awarenessPhase, totalReach, evaluated),
    stage(evaluationPhase, evaluated, signed),
    stage(purchasePhase, signed, satisfied, purchaseWeak),
    stage(deliveryPhase, satisfied, satisfied, whatsappOnly),
    stage(postPhase, referrals + secondSprints, referrals + secondSprints),
  ];

  /* ── Recursos finales ── */
  const hoursLeft = config.resources.hours - hoursUsed - hoursPenalty;
  const coinsLeft = config.resources.coins - coinsUsed;
  const newCoins = clients * rewards.coinsPerClient;

  /* ── Puntaje e insignias ── */
  const breakdown: PointLine[] = [];
  const badges: BadgeId[] = [];
  if (swipeCorrect) breakdown.push({ label: `${swipeCorrect} swipes correctos 📡`, points: swipeCorrect * rewards.perSwipe });
  if (trapsDiscarded) breakdown.push({ label: `${trapsDiscarded} cartas trampa descartadas`, points: trapsDiscarded * rewards.perTrapDiscarded });
  if (trapsDiscarded === traps.length && config.badges.traps) badges.push(config.badges.traps);
  if (gaps.length === 0) {
    breakdown.push({ label: 'Las 5 fases sin un solo 404', points: rewards.noGaps });
    if (config.badges.noGaps) badges.push(config.badges.noGaps);
  }
  if (awarenessChannels >= config.success.minAwarenessChannels) {
    breakdown.push({ label: `${awarenessChannels} canales de conocimiento`, points: rewards.multiAwareness });
    if (config.badges.multiAwareness) badges.push(config.badges.multiAwareness);
  }
  const leftoverUnits = Math.max(0, hoursLeft) + Math.floor(Math.max(0, coinsLeft) / 100);
  if (leftoverUnits) breakdown.push({ label: 'Horas y presupuesto sobrantes', points: leftoverUnits * rewards.perLeftover });
  if (referrals) breakdown.push({ label: `${referrals} referidos en la postventa 🗣️`, points: referrals * rewards.perReferral });

  const weakOnBoard = placed.some((c) => c.quality === 'weak' || c.quality === 'useless');
  const collapse = gaps.length > 0 || trapsOnBoard > 0 || clients < config.collapse.minClients;
  const total =
    !collapse &&
    clients >= config.success.minClients &&
    !weakOnBoard &&
    coinsLeft >= 0 &&
    hoursLeft >= 0 &&
    awarenessChannels >= config.success.minAwarenessChannels;
  const outcome: ActivityOutcome = collapse ? 'collapse' : total ? 'total' : 'partial';
  if (total && config.badges.completion) badges.push(config.badges.completion);

  return {
    swipeCorrect,
    trapsDiscarded,
    totalTraps: traps.length,
    coinsUsed,
    hoursUsed,
    overBudget: coinsUsed > config.resources.coins,
    overHours: hoursUsed > config.resources.hours,
    gaps,
    trapsOnBoard,
    awarenessChannels,
    funnel,
    events,
    clients,
    secondSprints,
    referrals,
    hoursLeft,
    coinsLeft,
    newCoins,
    breakdown,
    points: breakdown.reduce((a, l) => a + l.points, 0),
    badges,
    outcome,
    meterImpact: {
      rentabilidad: resourceImpact(newCoins - coinsUsed, Math.min(0, hoursLeft)),
      reputacion: clamp(referrals * 5 + secondSprints * 2 - trapsOnBoard * 15, -30, 30),
    },
  };
}

export function toJourneyResult(evaluation: JourneyEvaluation): ActivityResult {
  return {
    kind: 'journey',
    outcome: evaluation.outcome,
    points: evaluation.points,
    badges: evaluation.badges,
    flags: [],
    meterImpact: evaluation.meterImpact,
    highlight: { label: 'Clientes nuevos', value: String(evaluation.clients) },
  };
}
