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
  | 'value-architect';

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
}

export interface FitMapRow {
  icon: string;
  profileLabel: string;
  profileHint: string;
  profileExample: string;
  valueLabel: string;
  valueExample: string;
}

export interface FitMapTheory {
  intro: string;
  exampleClient: string;
  rows: FitMapRow[];
  note: string;
}

/** Pieza de una frase-plantilla: texto fijo o un espacio en blanco. */
export type FormulaPart = string | { id: string; label: string; placeholder?: string };

export interface FormulaTheory {
  parts: FormulaPart[];
  example: Record<string, string>;
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
  cards: TheoryCard[];
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

export type SimulationConfig = InboxConfig | FitLabConfig;

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

export type BuildConfig = FieldsBuildConfig | MediaQueryBuildConfig | FormulaBuildConfig;

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
