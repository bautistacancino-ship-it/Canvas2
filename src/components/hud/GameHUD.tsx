'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { CoinPill } from '@/components/ui/CoinPill';
import { useGameStore, useHasHydrated } from '@/store/useGameStore';
import { MeterGauge } from './MeterGauge';
import { useNavItems } from './useNavItems';

/** Barra superior flotante tipo "píldora": logo, navegación, medidores y monedas. */
export function GameHUD() {
  const hydrated = useHasHydrated();
  const profile = useGameStore((s) => s.profile);
  const score = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);
  const meters = useGameStore((s) => s.meters);
  const nav = useNavItems();

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex max-w-6xl items-center gap-3 rounded-full bg-white/85 py-2 pl-5 pr-2 shadow-soft ring-1 ring-ink/5 backdrop-blur-xl">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          canvas<span className="text-pink-strong">lab</span>
        </Link>

        {hydrated && profile && (
          <>
            <nav className="ml-4 hidden items-center gap-1 lg:flex">
              {nav.map(({ href, label, active }) => (
                <Link
                  key={label}
                  href={href}
                  className={`rounded-full px-4 py-2 font-display text-sm font-semibold transition ${
                    active ? 'bg-ink text-white' : 'text-muted hover:bg-surface hover:text-ink'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <div className="mr-2 hidden w-40 gap-1 md:grid">
                <MeterGauge label="Rentabilidad" icon="💰" value={meters.rentabilidad} compact />
                <MeterGauge label="Reputación" icon="⭐" value={meters.reputacion} compact />
              </div>
              {streak > 1 && (
                <span className="rounded-full bg-peach px-3 py-1.5 font-display text-sm font-semibold text-peach-strong">
                  🔥 {streak}
                </span>
              )}
              <CoinPill value={score} />
              <Avatar size={40} className="hidden sm:inline-grid" />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
