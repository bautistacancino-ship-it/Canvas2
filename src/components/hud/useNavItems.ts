'use client';

import { usePathname } from 'next/navigation';
import { GridIcon, HomeIcon, PlayIcon } from '@/components/ui/icons';
import { getCurrentLevel, getLevelStatuses } from '@/lib/progress';
import { useGameStore } from '@/store/useGameStore';

export function useNavItems() {
  const pathname = usePathname();
  const profile = useGameStore((s) => s.profile);
  const progress = useGameStore((s) => s.progress);

  const current = profile ? getCurrentLevel(getLevelStatuses(profile.businessId, progress)) : undefined;
  const playHref = current ? `/play/${current.block.id}` : '/';

  return [
    { href: '/', label: 'Inicio', Icon: HomeIcon, active: pathname === '/' },
    { href: playHref, label: 'Jugar', Icon: PlayIcon, active: pathname.startsWith('/play') },
    { href: '/canvas', label: 'Mi Canvas', Icon: GridIcon, active: pathname === '/canvas' },
  ];
}
