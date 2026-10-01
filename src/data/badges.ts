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
};

export const BADGE_LIST = Object.values(BADGES);
