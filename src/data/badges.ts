import type { Badge, BadgeId } from '@/types/game';

export const BADGES: Record<BadgeId, Badge> = {
  'cero-rebote': { id: 'cero-rebote', icon: '⚡', name: 'Cero Rebote', description: '7/7 en el quiz de Segmentos.' },
  'habla-idioma': {
    id: 'habla-idioma',
    icon: '✍️',
    name: 'Habla el idioma del que firma',
    description: 'Le hablaste al decisor con números.',
  },
  'flujo-caja': { id: 'flujo-caja', icon: '🛡️', name: 'Flujo de caja primero', description: 'Rechazaste con elegancia un cliente que no podías sostener.' },
  nutridor: { id: 'nutridor', icon: '🌱', name: 'Nutridor de Leads', description: 'Acompañaste a un lead con potencial sin endeudarlo.' },
  'growth-strategist': {
    id: 'growth-strategist',
    icon: '🎖️',
    name: 'Growth Strategist',
    description: 'Éxito total en el Inbox de Leads.',
  },
  'above-the-fold': { id: 'above-the-fold', icon: '⚡', name: 'Above the Fold', description: '7/7 en el quiz de Propuesta de Valor.' },
  'pixel-perfect-fit': {
    id: 'pixel-perfect-fit',
    icon: '🧩',
    name: 'Pixel Perfect Fit',
    description: 'Conectaste cada necesidad del cliente con lo que la resuelve.',
  },
  'los-numeros-hablan': {
    id: 'los-numeros-hablan',
    icon: '📊',
    name: 'Los números hablan',
    description: 'Elegiste un testimonio con métrica como prueba social.',
  },
  'value-architect': { id: 'value-architect', icon: '🎖️', name: 'Value Architect', description: 'Éxito total en el Fit Lab.' },
  'cero-404': { id: 'cero-404', icon: '⚡', name: 'Cero 404', description: '7/7 en el quiz de Canales.' },
  'reputacion-intacta': {
    id: 'reputacion-intacta',
    icon: '🛡️',
    name: 'Reputación intacta',
    description: 'Descartaste las cartas trampa en el swipe.',
  },
  'user-flow-completo': {
    id: 'user-flow-completo',
    icon: '🗺️',
    name: 'User Flow Completo',
    description: 'Las 5 fases del canal cubiertas, sin un solo 404.',
  },
  'a-prueba-de-algoritmos': {
    id: 'a-prueba-de-algoritmos',
    icon: '🔀',
    name: 'A prueba de algoritmos',
    description: 'Dos o más canales de conocimiento.',
  },
  'growth-architect': { id: 'growth-architect', icon: '🎖️', name: 'Growth Architect', description: 'Éxito total en el Journey Board.' },
  'cero-churn': { id: 'cero-churn', icon: '⚡', name: 'Cero Churn', description: '7/7 en el quiz de Relación con Clientes.' },
  'primera-impresion': { id: 'primera-impresion', icon: '🚀', name: 'Primera Impresión', description: 'Onboarding de 30 días con Tomás en el mes 1.' },
  'malas-noticias': {
    id: 'malas-noticias',
    icon: '📣',
    name: 'Malas noticias, buen manejo',
    description: 'Le avisaste primero a Valentina, con diagnóstico y plan.',
  },
  'servicio-a-la-medida': {
    id: 'servicio-a-la-medida',
    icon: '🎚️',
    name: 'Servicio a la Medida',
    description: '6 meses sin que ningún cliente te costara más de lo que paga.',
  },
  'upgrade-desbloqueado': { id: 'upgrade-desbloqueado', icon: '📈', name: 'Upgrade Desbloqueado', description: 'Valentina contrató un segundo sprint.' },
  'retention-master': { id: 'retention-master', icon: '🎖️', name: 'Retention Master', description: 'Éxito total en el Account Health Monitor.' },
  'primeras-palabras': { id: 'primeras-palabras', icon: '📘', name: 'Primeras Palabras', description: '10 términos desbloqueados en el Diccionario.' },
  'bilingue-digital': {
    id: 'bilingue-digital',
    icon: '🌐',
    name: 'Bilingüe Digital',
    description: 'Todos los términos en inglés de un bloque.',
  },
  'diccionario-completo': { id: 'diccionario-completo', icon: '📚', name: 'Diccionario Completo', description: 'Todos los términos del glosario.' },
};

export const BADGE_LIST = Object.values(BADGES);
