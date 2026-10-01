import type { Tone } from '@/lib/tones';
import type { CanvasBlockId } from '@/types/game';

export interface CanvasBlockMeta {
  id: CanvasBlockId;
  /** Orden pedagógico de los niveles (1 = primero en jugarse). */
  order: number;
  title: string;
  question: string;
  icon: string;
  tone: Tone;
  /** Posición en el tablero clásico de 10 columnas × 3 filas (desktop). */
  gridClass: string;
}

export const CANVAS_BLOCKS: CanvasBlockMeta[] = [
  {
    id: 'customer-segments',
    order: 1,
    title: 'Segmentos de Clientes',
    question: '¿Para quién creamos valor?',
    icon: '👥',
    tone: 'sky',
    gridClass: 'lg:col-start-9 lg:col-span-2 lg:row-start-1 lg:row-span-2',
  },
  {
    id: 'value-propositions',
    order: 2,
    title: 'Propuesta de Valor',
    question: '¿Qué problema resolvemos?',
    icon: '💎',
    tone: 'pink',
    gridClass: 'lg:col-start-5 lg:col-span-2 lg:row-start-1 lg:row-span-2',
  },
  {
    id: 'channels',
    order: 3,
    title: 'Canales',
    question: '¿Cómo llegamos a ellos?',
    icon: '📣',
    tone: 'peach',
    gridClass: 'lg:col-start-7 lg:col-span-2 lg:row-start-2',
  },
  {
    id: 'customer-relationships',
    order: 4,
    title: 'Relación con Clientes',
    question: '¿Qué vínculo construimos?',
    icon: '🤝',
    tone: 'lavender',
    gridClass: 'lg:col-start-7 lg:col-span-2 lg:row-start-1',
  },
  {
    id: 'revenue-streams',
    order: 5,
    title: 'Fuentes de Ingreso',
    question: '¿Por qué están dispuestos a pagar?',
    icon: '💰',
    tone: 'lime',
    gridClass: 'lg:col-start-6 lg:col-span-5 lg:row-start-3',
  },
  {
    id: 'key-resources',
    order: 6,
    title: 'Recursos Clave',
    question: '¿Qué necesitamos tener?',
    icon: '🧰',
    tone: 'sun',
    gridClass: 'lg:col-start-3 lg:col-span-2 lg:row-start-2',
  },
  {
    id: 'key-activities',
    order: 7,
    title: 'Actividades Clave',
    question: '¿Qué debemos hacer muy bien?',
    icon: '⚙️',
    tone: 'lavender',
    gridClass: 'lg:col-start-3 lg:col-span-2 lg:row-start-1',
  },
  {
    id: 'key-partners',
    order: 8,
    title: 'Socios Clave',
    question: '¿Con quién nos aliamos?',
    icon: '🔗',
    tone: 'peach',
    gridClass: 'lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2',
  },
  {
    id: 'cost-structure',
    order: 9,
    title: 'Estructura de Costos',
    question: '¿Cuánto nos cuesta operar?',
    icon: '🧾',
    tone: 'pink',
    gridClass: 'lg:col-start-1 lg:col-span-5 lg:row-start-3',
  },
];

export const BLOCKS_BY_ORDER = [...CANVAS_BLOCKS].sort((a, b) => a.order - b.order);

export const getBlockMeta = (id: CanvasBlockId) => CANVAS_BLOCKS.find((b) => b.id === id)!;
