import { BADGES } from '@/data/badges';
import type { BadgeId } from '@/types/game';

export function BadgeChip({ id, locked = false }: { id: BadgeId; locked?: boolean }) {
  const badge = BADGES[id];
  return (
    <span
      title={badge.description}
      className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 font-display text-sm font-semibold ${
        locked ? 'bg-surface text-muted' : 'bg-white text-ink shadow-soft ring-1 ring-sun-strong/40'
      }`}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-full text-base ${
          locked ? 'bg-line grayscale' : 'bg-linear-to-b from-sun to-[#ffe08a]'
        }`}
      >
        {locked ? '🔒' : badge.icon}
      </span>
      {badge.name}
    </span>
  );
}
