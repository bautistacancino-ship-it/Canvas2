'use client';

import Link from 'next/link';
import { useGameStore, useHasHydrated } from '@/store/useGameStore';
import { useNavItems } from './useNavItems';

/** Navegación inferior en móvil (Inicio · Jugar · Mi Canvas). */
export function BottomNav() {
  const hydrated = useHasHydrated();
  const hasProfile = useGameStore((s) => Boolean(s.profile));
  const nav = useNavItems();

  if (!hydrated || !hasProfile) return null;

  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-3 rounded-[28px] bg-white/95 px-2 py-2 shadow-float ring-1 ring-ink/5 backdrop-blur-xl lg:hidden">
      {nav.map(({ href, label, Icon, active }) => (
        <Link
          key={label}
          href={href}
          className={`flex flex-col items-center gap-0.5 rounded-2xl py-1.5 font-display text-xs font-semibold transition ${
            active ? 'text-sky-strong' : 'text-muted'
          }`}
        >
          <Icon className="h-6 w-6" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
