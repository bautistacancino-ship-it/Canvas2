import { TONES, type Tone } from '@/lib/tones';

const SIZES = {
  sm: 'h-10 w-10 rounded-xl text-xl',
  md: 'h-14 w-14 rounded-2xl text-3xl',
  lg: 'h-20 w-20 rounded-[26px] text-5xl',
} as const;

/** Ícono emoji sobre un tile pastel con relieve (estilo "app icon" 3D). */
export function IconTile({
  icon,
  tone = 'lavender',
  size = 'md',
  className = '',
}: {
  icon: string;
  tone?: Tone;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center ${TONES[tone].soft} ${SIZES[size]} shadow-[inset_0_-4px_0_rgba(27,22,54,0.06),inset_0_2px_0_rgba(255,255,255,0.9)] ${className}`}
      aria-hidden
    >
      <span className="drop-shadow-[0_3px_2px_rgba(27,22,54,0.2)]">{icon}</span>
    </span>
  );
}
