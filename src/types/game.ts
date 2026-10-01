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

export type BadgeId = 'cero-rebote' | 'habla-idioma' | 'flujo-caja' | 'nutridor' | 'growth-strategist';

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
}

export interface ComparisonRow {
  situation: string;
  novice: string;
  pro: string;
}

export interface TheoryConfig {
  title: string;
  concept: TheoryConcept;
  cards: TheoryCard[];
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

export type InboxOutcome = 'total' | 'partial' | 'collapse';

export interface InboxResult {
  outcome: InboxOutcome;
  correctClassifications: number;
  totalLeads: number;
  points: number;
  hours: number;
  budget: number;
  badges: BadgeId[];
  flags: string[];
  meterImpact: MeterEffects;
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

export type BuildConfig = FieldsBuildConfig | MediaQueryBuildConfig;

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
  simulation: InboxConfig;
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
  inbox?: InboxResult;
  completedAt?: string;
}
