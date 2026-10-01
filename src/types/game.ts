/* ──────────────────────────────────────────────────────────────
 * Tipos de dominio del juego. Todo el contenido (niveles, quiz,
 * actividades) es data pura tipada con estas interfaces, de modo
 * que agregar un nivel nuevo = agregar un archivo en /data/levels.
 * ────────────────────────────────────────────────────────────── */

/** Los 9 bloques del Business Model Canvas (también son los slugs de URL). */
export const CANVAS_BLOCK_IDS = [
  'customer-segments',
  'value-propositions',
  'channels',
  'customer-relationships',
  'revenue-streams',
  'key-resources',
  'key-activities',
  'key-partners',
  'cost-structure',
] as const;

export type CanvasBlockId = (typeof CANVAS_BLOCK_IDS)[number];

export const isCanvasBlockId = (value: string): value is CanvasBlockId =>
  (CANVAS_BLOCK_IDS as readonly string[]).includes(value);

export type BusinessId = 'agencia-marketing' | 'estudio-animacion' | 'branding-estudio';

export interface CoreBusiness {
  id: BusinessId;
  name: string;
  tagline: string;
  emoji: string;
  /** Si es false, el negocio aparece pero aún no tiene contenido. */
  available: boolean;
}

/* ─── Fases de un nivel ───────────────────────────────────────── */

export const LEVEL_PHASES = ['theory', 'quiz', 'simulation', 'build'] as const;
export type LevelPhase = (typeof LEVEL_PHASES)[number];
export type BlockPhase = LevelPhase | 'done';

/* ─── Medidores globales de la agencia ────────────────────────── */

export type MeterKey = 'rentabilidad' | 'reputacion';
export type Meters = Record<MeterKey, number>;
export type MeterEffects = Partial<Meters>;

/* ─── Insignias ───────────────────────────────────────────────── */

export type BadgeId =
  | 'cero-rebote'
  | 'habla-idioma'
  | 'flujo-caja'
  | 'nutridor'
  | 'growth-strategist'
  | 'above-the-fold'
  | 'pixel-perfect-fit'
  | 'los-numeros-hablan'
  | 'value-architect'
  | 'cero-404'
  | 'reputacion-intacta'
  | 'user-flow-completo'
  | 'a-prueba-de-algoritmos'
  | 'growth-architect'
  | 'cero-churn'
  | 'primera-impresion'
  | 'malas-noticias'
  | 'servicio-a-la-medida'
  | 'upgrade-desbloqueado'
  | 'retention-master';

export interface Badge {
  id: BadgeId;
  icon: string;
  name: string;
  description: string;
}

/* ─── Fase 1: Teoría ──────────────────────────────────────────── */

export interface TheoryConcept {
  headline: string;
  paragraphs: string[];
  code?: string;
  goldenRule: string;
}

export interface TheoryCard {
  id: string;
  icon: string;
  title: string;
  body: string;
  /** Reverso de la tarjeta: ejemplo aterrizado al Core Business. */
  example: string;
  /** Tarjeta trampa: concepto que conviene evitar (se muestra con advertencia). */
  trap?: boolean;
  /** Etiqueta corta (ej. "Ideal para: plan básico"). */
  tag?: string;
}

export interface FitMapRow {
  /** Necesario si la fila se puede repasar tras reprobar el quiz. */
  id?: string;
  icon: string;
  profileLabel: string;
  profileHint: string;
  profileExample: string;
  valueLabel: string;
  valueExample: string;
}

/** Dos columnas que se conectan fila por fila (ej. perfil ↔ mapa de valor, objetivo ↔ acción). */
export interface FitMapTheory {
  stepLabel: string;
  badge: string;
  intro: string;
  leftTitle: string;
  rightTitle: string;
  revealLabel: string;
  rows: FitMapRow[];
  note?: string;
}

/** Pieza de una frase-plantilla: texto fijo o un espacio en blanco. */
export type FormulaPart = string | { id: string; label: string; placeholder?: string };

export interface FormulaTheory {
  parts: FormulaPart[];
  example: Record<string, string>;
}

/** Recorrido por fases (ej. las 5 fases del canal): cada una con su ejemplo y su "404" típico. */
export interface PhaseItem {
  id: string;
  icon: string;
  label: string;
  question: string;
  example: string;
  fail: string;
}

export interface PhasesTheory {
  intro: string;
  items: PhaseItem[];
}

export interface ComparisonRow {
  situation: string;
  novice: string;
  pro: string;
}

export interface TheoryConfig {
  title: string;
  concept: TheoryConcept;
  fitMap?: FitMapTheory;
  phases?: PhasesTheory;
  cards: TheoryCard[];
  /** Nota que acompaña a las tarjetas (ej. "La clave: …"). */
  cardsNote?: string;
  formula?: FormulaTheory;
  comparison?: ComparisonRow[];
}

/* ─── Fase 2: Quiz ────────────────────────────────────────────── */

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  /** Tarjeta de teoría que se repasa si el jugador se equivoca. */
  relatedCardId?: string;
}

export interface QuizConfig {
  title: string;
  timeLimitSec: number;
  correctPoints: number;
  fastBonus: number;
  /** Respuestas correctas antes de este tiempo reciben `fastBonus`. */
  fastWithinSec: number;
  /** Aciertos mínimos para desbloquear la fase siguiente. */
  passThreshold: number;
  shuffleOptions: boolean;
  perfectBadgeId?: BadgeId;
  questions: QuizQuestion[];
}

export interface QuizResult {
  correct: number;
  total: number;
  points: number;
  fastAnswers: number;
  passed: boolean;
  wrongQuestionIds: string[];
}

/* ─── Fase 3: Inbox de Leads ──────────────────────────────────── */

export type LeadField = 'rubro' | 'plataforma' | 'etapa' | 'dolor' | 'decide' | 'pago';

export interface LeadFieldMeta {
  id: LeadField;
  icon: string;
  label: string;
}

export type LeadClass = 'ideal' | 'nurture' | 'discard';
export type FitLevel = 'alto' | 'medio' | 'bajo';

export interface InboxEffects {
  trust?: number;
  hours?: number;
  budget?: number;
}

export interface InboxOption {
  id: string;
  text: string;
  /** Respuesta del cliente (o descripción del evento si `isEvent`). */
  reaction: string;
  isEvent?: boolean;
  effects: InboxEffects;
  unlocks?: LeadField[];
  bonusPoints?: number;
  badgeId?: BadgeId;
  /** Consecuencia corta que se muestra como etiqueta. */
  tag?: string;
  flags?: string[];
}

export interface InboxDecision {
  id: string;
  message: string;
  options: InboxOption[];
}

export interface InboxLead {
  id: string;
  name: string;
  role: string;
  avatar: string;
  fiche: Record<LeadField, string>;
  /** Datos que el lead ya cuenta en su primer mensaje. */
  knownFields: LeadField[];
  fit: FitLevel;
  fitNote: string;
  correctClass: LeadClass;
  decisions: InboxDecision[];
}

export interface InboxConfig {
  kind: 'inbox';
  title: string;
  premise: string;
  initial: { trust: number; hours: number; budget: number };
  fields: LeadFieldMeta[];
  leads: InboxLead[];
  segmentInsight: string;
  rewards: { perField: number; ficheComplete: number; correctClass: number };
  success: { minHours: number; minBudget: number };
  collapse: { budgetBelow: number; flags: string[]; hint: string };
  completionBadgeId?: BadgeId;
}

/* ─── Fase 3: Fit Lab ─────────────────────────────────────────── */

export type FitNeedType = 'dolor' | 'alegria' | 'trabajo';

export interface FitNeed {
  id: string;
  type: FitNeedType;
  text: string;
  /** Servicio que la resuelve. */
  serviceId: string;
}

export interface FitService {
  id: string;
  text: string;
  trap?: boolean;
}

export type HeroSlotId = 'headline' | 'subtitle' | 'proof' | 'cta' | 'visual';
export type HeroArt = 'logos' | 'testimonial' | 'award' | 'abstract3d' | 'dashboard' | 'team';

export interface HeroOption {
  id: string;
  text: string;
  correct?: boolean;
  /** Reacción de los usuarios simulados si se elige esta opción (incorrecta). */
  reaction?: string;
  art?: HeroArt;
  bonusPoints?: number;
  badgeId?: BadgeId;
}

export interface HeroSlot {
  id: HeroSlotId;
  label: string;
  options: HeroOption[];
}

export interface FitLabConfig {
  kind: 'fit-lab';
  title: string;
  premise: string;
  clientName: string;
  initial: { hours: number; budget: number };
  needs: FitNeed[];
  services: FitService[];
  slots: HeroSlot[];
  testUsers: number;
  testSeconds: number;
  /** Tabla de resultados del test según slots correctos (de mayor a menor). */
  testTable: { minCorrect: number; comprehension: number; ctr: number }[];
  happyReaction: string;
  rewards: {
    perConnection: number;
    perTrashed: number;
    trapHoursPenalty: number;
    fitPerfectBonus: number;
    perSlot: number;
    ctrThreshold: number;
    ctrBudgetBonus: number;
  };
  fitPerfectBadgeId?: BadgeId;
  completionBadgeId?: BadgeId;
  success: { minComprehension: number; minCtr: number };
  partial: { minFitPct: number; minSlots: number };
  collapse: { minTrapsConnected: number; minComprehension: number; hint: string };
}

/* ─── Fase 3: Journey Board ───────────────────────────────────── */

export interface SwipeCard {
  id: string;
  text: string;
  /** ¿Sirve para el segmento? (swipe derecha). */
  fits: boolean;
  trap?: boolean;
  why: string;
}

export type BoardCardQuality = 'good' | 'balanced' | 'weak' | 'useless' | 'trap';

export interface BoardCard {
  id: string;
  phaseId: string;
  text: string;
  coins: number;
  hours: number;
  quality: BoardCardQuality;
  /** Si viene del swipe, solo aparece cuando el jugador la aprobó. */
  swipeId?: string;
  /** Conocimiento: leads que trae (solo los `qualified` siguen el embudo). */
  reach?: number;
  qualified?: boolean;
  /** Evaluación / compra: tasa de conversión que aporta. */
  rate?: number;
  /** Rol especial en la simulación. */
  role?: 'linkedin' | 'partners' | 'dashboard' | 'whatsapp' | 'results-meeting' | 'referrals';
}

export interface JourneyPhase {
  id: string;
  icon: string;
  label: string;
}

export interface JourneyConfig {
  kind: 'journey';
  title: string;
  premise: string;
  goalClients: number;
  swipeCards: SwipeCard[];
  phases: JourneyPhase[];
  boardCards: BoardCard[];
  resources: { coins: number; hours: number };
  simulation: {
    months: number;
    leadsLabel: string;
    weakLeadLossPct: number;
    weakHoursPenaltyPct: number;
    linkedinDropPct: number;
    partnerSigned: number;
    urgentReportHours: number;
    valentinaClients: number;
    secondSprintRate: number;
    referralRate: number;
  };
  rewards: {
    perSwipe: number;
    perTrapDiscarded: number;
    noGaps: number;
    multiAwareness: number;
    perLeftover: number;
    coinsPerClient: number;
    perReferral: number;
  };
  badges: { traps?: BadgeId; noGaps?: BadgeId; multiAwareness?: BadgeId; completion?: BadgeId };
  success: { minClients: number; minAwarenessChannels: number };
  collapse: { minClients: number; hint: string };
}

/* ─── Fase 3: Account Health Monitor ──────────────────────────── */

export interface AccountClient {
  id: string;
  name: string;
  avatar: string;
  business: string;
  plan: string;
  fee: number;
  health: number;
  decay: number;
  /** Lo que valora (se revela como pista después del primer mes). */
  values: string;
}

export type RelationCardScope = 'client' | 'global';
/**
 * monthly: se paga y actúa cada mes que se usa · install: se paga una vez y actúa todos los meses ·
 * oneshot: se paga y actúa una sola vez · quarter: se paga al activarla y actúa 3 meses.
 */
export type RelationCardBilling = 'monthly' | 'install' | 'oneshot' | 'quarter';

export interface RelationCard {
  id: string;
  icon: string;
  name: string;
  hours: number;
  scope: RelationCardScope;
  billing: RelationCardBilling;
  /** Efecto en la salud de cada cliente (por mes en que actúa). */
  effects: Partial<Record<string, number>>;
  note?: string;
  /** Solo para estos clientes / meses. */
  onlyClients?: string[];
  onlyMonths?: number[];
  energyPerMonth?: number;
  /** Bonus al usarla (ej. onboarding en el mes 1). */
  bonusPoints?: number;
  badgeId?: BadgeId;
}

export interface AccountEventOption {
  id: string;
  text: string;
  correct?: boolean;
  /** Efecto inmediato en la salud de clientes. */
  health?: Partial<Record<string, number>>;
  hours?: number;
  /** Horas que se pierden cada mes desde este en adelante. */
  hoursDrainFromNow?: number;
  /** Efecto diferido: { mes, cliente, salud }. */
  later?: { month: number; client: string; health: number; note: string }[];
  /** Horas extra que se pierden en meses futuros. */
  laterHours?: { month: number; hours: number; note: string }[];
  feeChange?: { client: string; fee: number };
  oneTimeIncome?: number;
  /** Cuenta como venta adicional (para el reporte de retención). */
  extraSale?: string;
  /** Aplica una carta sin costo de horas (ej. el onboarding). */
  usesCard?: { card: string; client: string };
  bonusPoints?: number;
  badgeId?: BadgeId;
  outcome: string;
}

export interface AccountEvent {
  month: number;
  icon: string;
  text: string;
  options: AccountEventOption[];
}

export interface AccountsConfig {
  kind: 'accounts';
  title: string;
  premise: string;
  months: number;
  hoursPerMonth: number;
  /** Valor de una hora del equipo, para la alerta "te cuesta más de lo que paga". */
  hourValue: number;
  riskThreshold: number;
  clients: AccountClient[];
  cards: RelationCard[];
  events: AccountEvent[];
  rewards: {
    perCorrectEvent: number;
    perSafeMonth: number;
    proportionalBonus: number;
    lostClientPenalty: number;
  };
  badges: { proportional?: BadgeId; completion?: BadgeId };
  success: { minHealth: number; minEnergy: number; minExtraSales: number; minMrr: number };
  collapse: { hint: string };
}

export type SimulationConfig = InboxConfig | FitLabConfig | JourneyConfig | AccountsConfig;

/* ─── Resultado común de cualquier actividad de la Fase 3 ─────── */

export type ActivityOutcome = 'total' | 'partial' | 'collapse';

export interface ActivityResult {
  kind: SimulationConfig['kind'];
  outcome: ActivityOutcome;
  points: number;
  badges: BadgeId[];
  flags: string[];
  meterImpact: MeterEffects;
  /** Dato principal para la pantalla de nivel completado. */
  highlight: { label: string; value: string };
}

/* ─── Fase 4: Construcción del Canvas ─────────────────────────── */

export interface BuildField {
  id: string;
  label: string;
  helper: string;
  placeholder?: string;
  kind: 'textarea' | 'select';
  options?: string[];
  minLength?: number;
}

export interface FieldsBuildConfig {
  kind: 'fields';
  title: string;
  intro: string;
  fields: BuildField[];
}

export interface MediaQueryField {
  id: string;
  /** Nombre de la "propiedad CSS" que ve el jugador. */
  prop: string;
  hint?: string;
  placeholder: string;
  options?: string[];
}

export interface MediaQueryBuildConfig {
  kind: 'media-query';
  title: string;
  intro: string;
  fileName: string;
  conditions: MediaQueryField[];
  declarations: MediaQueryField[];
  allowSecondary: boolean;
  forbiddenWords: string[];
}

export interface FormulaLine {
  id: string;
  icon: string;
  label: string;
  placeholder: string;
  /** Segundo campo "→ cómo" (opcional). */
  how?: { id: string; placeholder: string };
}

export interface FormulaBuildConfig {
  kind: 'value-formula';
  title: string;
  intro: string;
  parts: FormulaPart[];
  maxWords: number;
  readingSeconds: number;
  linesTitle: string;
  lines: FormulaLine[];
  forbiddenWords: string[];
  /** Trae un dato escrito en otro bloque como referencia (y para autocompletar). */
  reference?: { blockId: CanvasBlockId; fieldId: string; targetId: string; label: string };
}

export interface LinesBuildConfig {
  kind: 'lines';
  title: string;
  intro: string;
  groups: {
    id: string;
    title: string;
    lines: {
      id: string;
      icon: string;
      label: string;
      placeholder: string;
      maxWords?: number;
      /** Si existe, se elige con chips (hasta `maxSelect`) en vez de escribir. */
      options?: string[];
      maxSelect?: number;
    }[];
  }[];
  checkNote?: string;
  forbidden: { word: string; reason: string }[];
  /** Bloque anterior que se muestra como referencia. */
  reference?: { blockId: CanvasBlockId; label: string };
}

export type BuildConfig = FieldsBuildConfig | MediaQueryBuildConfig | FormulaBuildConfig | LinesBuildConfig;

/** Respuestas de un bloque: fieldId → texto. */
export type CanvasEntry = Record<string, string>;

/* ─── Nivel completo ──────────────────────────────────────────── */

export interface LevelConfig {
  id: string;
  businessId: BusinessId;
  blockId: CanvasBlockId;
  title: string;
  subtitle: string;
  theory: TheoryConfig;
  quiz: QuizConfig;
  simulation: SimulationConfig;
  build: BuildConfig;
}

/* ─── Progreso del jugador ────────────────────────────────────── */

export interface PlayerProfile {
  playerName: string;
  businessId: BusinessId;
  startedAt: string;
}

export interface BlockProgress {
  phase: BlockPhase;
  quiz?: QuizResult;
  activity?: ActivityResult;
  completedAt?: string;
}
