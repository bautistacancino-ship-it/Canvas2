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
};

export const BADGE_LIST = Object.values(BADGES);
