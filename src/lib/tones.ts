/* Paleta pastel del juego. Las clases están escritas completas para que
 * Tailwind las detecte; `hex` se usa en SVG (anillos, mascotas). */

export type Tone = 'lavender' | 'lime' | 'peach' | 'pink' | 'sky' | 'sun';

export const TONE_ORDER: Tone[] = ['lavender', 'lime', 'peach', 'sky', 'pink', 'sun'];

export const TONES: Record<Tone, { soft: string; strong: string; text: string; ring: string; hex: string }> = {
  lavender: { soft: 'bg-lavender', strong: 'bg-lavender-strong', text: 'text-lavender-strong', ring: 'ring-lavender-strong', hex: '#8b6cff' },
  lime: { soft: 'bg-lime', strong: 'bg-lime-strong', text: 'text-lime-strong', ring: 'ring-lime-strong', hex: '#6fae12' },
  peach: { soft: 'bg-peach', strong: 'bg-peach-strong', text: 'text-peach-strong', ring: 'ring-peach-strong', hex: '#ff8a1f' },
  pink: { soft: 'bg-pink', strong: 'bg-pink-strong', text: 'text-pink-strong', ring: 'ring-pink-strong', hex: '#ff4f8b' },
  sky: { soft: 'bg-sky', strong: 'bg-sky-strong', text: 'text-sky-strong', ring: 'ring-sky-strong', hex: '#2f6bff' },
  sun: { soft: 'bg-sun', strong: 'bg-sun-strong', text: 'text-sun-strong', ring: 'ring-sun-strong', hex: '#f5b400' },
};

export const toneAt = (index: number): Tone => TONE_ORDER[index % TONE_ORDER.length];

/** Colores de las mascotas blob (más saturados que los tonos pastel). */
export const BLOB_COLORS = { yellow: '#ffd23f', sky: '#5fb4ff', pink: '#ff6b8b', lavender: '#9d7bff', ink: '#1b1636' } as const;
