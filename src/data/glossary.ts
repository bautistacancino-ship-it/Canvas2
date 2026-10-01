import type { CanvasBlockId, LevelPhase } from '@/types/game';
import raw from './glossary.json';

/* ──────────────────────────────────────────────────────────────
 * Glosario de términos clickeables.
 * Fuente: instrucciones-terminos-y-tutoriales.md (sección 4), copiado tal cual en glossary.json.
 * ────────────────────────────────────────────────────────────── */

export type TermType = 'Inglés' | 'Concepto Canvas' | 'Métrica' | 'Herramienta';
export type GlossaryBlock = 'segmentos' | 'propuesta' | 'canales' | 'relacion';

export interface GlossaryTerm {
  id: string;
  termino: string;
  tipo: TermType;
  traduccion: string | null;
  definicion: string;
  ejemplo: string;
  bloques: GlossaryBlock[];
}

export const GLOSSARY = raw as GlossaryTerm[];
export const getTerm = (id: string) => GLOSSARY.find((t) => t.id === id);

export const TYPE_ICON: Record<TermType, string> = {
  Inglés: '🇬🇧',
  'Concepto Canvas': '🧩',
  Métrica: '📊',
  Herramienta: '🛠️',
};

export const BLOCK_TO_GLOSSARY: Partial<Record<CanvasBlockId, GlossaryBlock>> = {
  'customer-segments': 'segmentos',
  'value-propositions': 'propuesta',
  channels: 'canales',
  'customer-relationships': 'relacion',
};

/**
 * Formas en que cada término aparece en el texto (además de su nombre). El plural (s/es) se acepta solo.
 * Solo se listan los términos cuyo nombre en el glosario no coincide con cómo se escribe en el juego.
 */
const ALIASES: Record<string, string[]> = {
  '404': ['404', 'Error 404'],
  ads: ['Google Ads', 'ads'],
  conversion: ['tasa de conversión', 'conversión'],
  cta: ['CTA', 'Llamado a la acción', 'call to action'],
  dribbble: ['Dribbble', 'Behance'],
  heatmap: ['mapa de calor', 'heatmap'],
  hero: ['hero section', 'hero'],
  landing: ['landing page', 'landing'],
  'media-query': ['media query', 'media queries'],
  'pop-up': ['pop-up', 'popup'],
  ticket: ['ticket promedio'],
  cocreacion: ['co-creación', 'cocreación'],
  ecommerce: ['ecommerce', 'e-commerce'],
};

/** Distinguen mayúsculas (sección 2.1). */
const CASE_SENSITIVE = new Set(['css', 'seo', 'seo-local', 'cro', 'b2b', 'kpi', 'ctr', 'fit', '404']);

export interface TermPattern {
  id: string;
  forms: string[];
  caseSensitive: boolean;
}

export const TERM_PATTERNS: Record<string, TermPattern> = Object.fromEntries(
  GLOSSARY.map((t) => [t.id, { id: t.id, forms: ALIASES[t.id] ?? [t.termino], caseSensitive: CASE_SENSITIVE.has(t.id) }]),
);

/* ─── Términos a marcar por fase (sección 6) ──────────────────── */

type PhaseTerms = Record<LevelPhase, string[]>;

export const TERM_MARKS: Partial<Record<CanvasBlockId, PhaseTerms>> = {
  'customer-segments': {
    theory: ['breakpoint', 'media-query', 'segmentos', 'buyer-persona', 'css', 'responsive', 'masas', 'shopify', 'wordpress', 'nicho', 'seo-local', 'ads', 'ecommerce', 'cro', 'email-automation', 'figma', 'multilateral', 'newsletter', 'b2b', 'landing', 'kpi', 'conversion', 'seo', 'lead'],
    quiz: ['kpi', 'retainer', 'ecommerce', 'shopify', 'conversion', 'ticket', 'cro', 'email-automation', 'flujo-caja', 'newsletter', 'multilateral', 'mockup', 'b2b', 'canvas'],
    simulation: ['lead', 'ecommerce', 'shopify', 'checkout', 'conversion', 'fee', 'partner', 'flujo-caja', 'retainer', 'newsletter', 'pipeline', 'propuesta'],
    build: ['media-query', 'retainer', 'breakpoint'],
  },
  'value-propositions': {
    theory: ['above-the-fold', 'hero', 'landing', 'propuesta', 'design-system', 'ecommerce', 'shopify', 'fee', 'ads', 'aliviadores', 'checkout', 'dashboard', 'conversion', 'creadores', 'fit', 'sprint', 'responsive', 'figma', 'webflow', 'nicho', 'seo'],
    quiz: ['above-the-fold', 'responsive', 'shopify', 'figma', 'webflow', 'conversion', 'sprint', 'fit', 'propuesta', 'ecommerce', 'ads'],
    simulation: ['propuesta', 'landing', 'fit', 'checkout', 'ads', 'dashboard', 'conversion', 'design-system', 'fee', 'parallax', 'shopify', 'wireframe', 'above-the-fold', 'sprint', 'cta', 'mockup', 'hero', 'heatmap', 'ctr', 'lead', 'canales'],
    build: ['above-the-fold', 'media-query', 'fit'],
  },
  channels: {
    theory: ['propuesta', 'canales', 'user-flow', '404', 'newsletter', 'ecommerce', 'conversion', 'dashboard', 'sprint', 'seo', 'partner', 'shopify', 'white-label', 'inbound', 'outbound', 'checkout', 'dribbble', 'lead'],
    quiz: ['ecommerce', 'dribbble', 'shopify', 'partner', 'pop-up', 'checkout', 'dashboard', 'conversion', 'sprint', 'lead', '404'],
    simulation: ['user-flow', 'figma', 'canales', 'lead', '404', 'swipe', 'ecommerce', 'dribbble', 'partner', 'shopify', 'newsletter', 'conversion', 'ads', 'dashboard', 'sprint', 'relacion'],
    build: ['user-flow', 'lead', 'media-query', '404'],
  },
  'customer-relationships': {
    theory: ['onboarding', 'relacion', 'kickoff', 'checklist', 'churn', 'upgrade', 'sprint', 'account-manager', 'shopify', 'conversion', 'ecommerce', 'cocreacion', 'workshop'],
    quiz: ['onboarding', 'kickoff', 'checklist', 'conversion', 'landing', 'cyber', 'ecommerce', 'churn'],
    simulation: ['fee', 'account-manager', 'workshop', 'cocreacion', 'onboarding', 'conversion', 'landing', 'cyber', 'sprint', 'dashboard', 'burnout', 'upgrade', 'fuentes'],
    build: ['media-query', 'burnout'],
  },
};
