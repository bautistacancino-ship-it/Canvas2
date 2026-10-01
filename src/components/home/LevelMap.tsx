'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { BadgeChip } from '@/components/ui/BadgeChip';
import { BADGE_LIST } from '@/data/badges';
import { buttonClass } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { CoinPill } from '@/components/ui/CoinPill';
import { IconTile } from '@/components/ui/IconTile';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { meterColor } from '@/components/hud/MeterGauge';
import { getBusiness } from '@/data/businesses';
import { getCurrentLevel, getLevelStatuses, isPlayable, type LevelStatusItem } from '@/lib/progress';
import { TONES, type Tone } from '@/lib/tones';
import { useGameStore } from '@/store/useGameStore';
import type { BlockPhase } from '@/types/game';

type Filter = 'all' | 'done' | 'pending';

const FILTERS: { id: Filter; label: string; icon: string }[] = [
  { id: 'all', label: 'Todos', icon: '🗺️' },
  { id: 'done', label: 'Completados', icon: '✅' },
  { id: 'pending', label: 'Pendientes', icon: '⏳' },
];

const PHASE_LABEL: Record<BlockPhase, string> = {
  theory: 'Teoría',
  quiz: 'Quiz',
  simulation: 'Simulación',
  build: 'Construcción',
  done: 'Completado',
};

export function LevelMap() {
  const profile = useGameStore((s) => s.profile)!;
  const progress = useGameStore((s) => s.progress);
  const score = useGameStore((s) => s.score);
  const bestStreak = useGameStore((s) => s.bestStreak);
  const meters = useGameStore((s) => s.meters);
  const badges = useGameStore((s) => s.badges);
  const resetGame = useGameStore((s) => s.resetGame);
  const [filter, setFilter] = useState<Filter>('all');

  const business = getBusiness(profile.businessId);
  const items = getLevelStatuses(profile.businessId, progress);
  const doneCount = items.filter((i) => i.status === 'done').length;
  const current = getCurrentLevel(items);
  const overall = items.reduce((acc, i) => acc + i.fraction, 0) / items.length;

  const visible = items.filter((i) =>
    filter === 'all' ? true : filter === 'done' ? i.status === 'done' : i.status !== 'done',
  );

  return (
    <div className="mx-auto grid max-w-5xl gap-5 px-4 py-6 lg:grid-cols-[1fr_1.1fr] lg:py-10">
      {/* ─── Perfil + Estadísticas ─── */}
      <section className="self-start rounded-[32px] bg-linear-to-b from-lavender via-sky to-white p-5 shadow-soft ring-1 ring-ink/5">
        <div className="flex items-center gap-4">
          <Avatar size={76} />
          <div className="min-w-0">
            <p className="truncate font-display text-2xl font-bold">{profile.playerName}</p>
            <p className="truncate text-sm text-muted">
              {business?.emoji} {business?.name}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <CoinPill value={score} />
        </div>

        <h2 className="mt-6 text-center font-display text-2xl font-bold">Estadísticas</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatTile tone="lavender" icon="🏆" label="Puntaje" value={score.toLocaleString('es-CL')} />
          <StatTile tone="lime" icon="🧩" label="Bloques" value={`${doneCount}/9`} />
          <MeterTile tone="peach" icon="💰" label="Rentabilidad" value={meters.rentabilidad} />
          <MeterTile tone="pink" icon="⭐" label="Reputación" value={meters.reputacion} />
        </div>
        <h3 className="mt-6 font-display text-lg font-bold">
          Insignias <span className="text-sm font-semibold text-muted">{badges.length}/{BADGE_LIST.length}</span>
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {BADGE_LIST.map((badge) => (
            <BadgeChip key={badge.id} id={badge.id} locked={!badges.includes(badge.id)} />
          ))}
        </div>

        {bestStreak > 1 && (
          <p className="mt-4 text-center text-sm text-muted">
            Mejor racha: <span className="font-display font-semibold text-peach-strong">🔥 {bestStreak} seguidas</span>
          </p>
        )}
      </section>

      <div className="space-y-5">
        {/* ─── Continuar nivel ─── */}
        {current && <ContinueCard item={current} overall={overall} />}

        {/* ─── Ruta de niveles ─── */}
        <section>
          <h2 className="px-1 font-display text-2xl font-bold">Ruta del Canvas</h2>
          <div className="mt-3 flex gap-1 rounded-full bg-white p-1 shadow-soft ring-1 ring-ink/5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 font-display text-sm font-semibold transition ${
                  filter === f.id ? 'bg-surface text-ink ring-1 ring-line' : 'text-muted hover:text-ink'
                }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          <ol className="mt-3 grid gap-2.5">
            {visible.map((item, i) => (
              <motion.li
                key={item.block.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="min-w-0"
              >
                {isPlayable(item.status) ? (
                  <Link href={`/play/${item.block.id}`} className="block">
                    <LevelRow item={item} />
                  </Link>
                ) : (
                  <LevelRow item={item} />
                )}
              </motion.li>
            ))}
            {visible.length === 0 && (
              <li className="rounded-3xl bg-white p-6 text-center text-sm text-muted ring-1 ring-ink/5">
                Nada por aquí todavía.
              </li>
            )}
          </ol>
        </section>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Borrar todo tu progreso y empezar de nuevo?')) resetGame();
          }}
          className="px-1 text-xs font-semibold text-muted underline hover:text-pink-strong"
        >
          Reiniciar partida
        </button>
      </div>
    </div>
  );
}

function StatTile({ tone, icon, label, value }: { tone: Tone; icon: string; label: string; value: string }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5">
      <div
        className={`grid h-20 place-items-center ${TONES[tone].soft}`}
        style={{
          backgroundImage:
            'repeating-conic-gradient(from 0deg at 50% 110%, rgba(255,255,255,0.55) 0deg 7deg, transparent 7deg 14deg)',
        }}
      >
        <span className="text-5xl drop-shadow-[0_6px_4px_rgba(27,22,54,0.2)]">{icon}</span>
      </div>
      <div className="px-3 py-3 text-center">
        <p className="text-xs font-semibold text-muted">{label}</p>
        <p className={`font-display text-3xl font-bold ${TONES[tone].text}`}>{value}</p>
      </div>
    </div>
  );
}

function MeterTile({ tone, icon, label, value }: { tone: Tone; icon: string; label: string; value: number }) {
  return (
    <div className={`rounded-3xl p-4 ${TONES[tone].soft}`}>
      <p className="text-xs font-semibold text-ink/70">
        {icon} {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold">{value}%</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
        <motion.div
          className={`h-full rounded-full bg-linear-to-r ${meterColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
        />
      </div>
    </div>
  );
}

function ContinueCard({ item, overall }: { item: LevelStatusItem; overall: number }) {
  const { block, phase } = item;
  return (
    <section className={`${cardClass} p-5`}>
      <div className="flex items-center gap-3">
        <Avatar size={36} />
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-[#ffd76a] to-peach-strong"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(overall * 100, 4)}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          />
        </div>
        <span className="font-display text-sm font-semibold text-muted">{Math.round(overall * 100)}%</span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
            <span className="h-2 w-2 rounded-full bg-pink-strong" />
            Nivel {block.order} · {phase ? PHASE_LABEL[phase] : 'Nuevo'}
          </p>
          <p className="mt-1 font-display text-2xl font-bold leading-tight">{block.title}</p>
        </div>
        <IconTile icon={block.icon} tone={block.tone} size="md" />
      </div>

      <Link href={`/play/${block.id}`} className={buttonClass('gradient', 'md', 'mt-5 w-full')}>
        {phase ? 'Continuar nivel' : 'Empezar nivel'} →
      </Link>
    </section>
  );
}

function LevelRow({ item }: { item: LevelStatusItem }) {
  const { block, status, fraction } = item;
  const faded = status === 'locked' || status === 'soon';

  return (
    <div
      className={`flex items-center gap-3 rounded-3xl bg-white p-2.5 pr-4 shadow-soft ring-1 ring-ink/5 transition ${
        faded ? 'opacity-55' : 'hover:-translate-y-0.5 hover:ring-lavender-strong/30'
      }`}
    >
      <IconTile icon={block.icon} tone={block.tone} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-semibold">{block.title}</p>
        <p className="truncate text-xs text-muted">
          Nivel {block.order} · {block.question}
        </p>
      </div>

      {status === 'done' && (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime font-bold text-lime-strong">✓</span>
      )}
      {status === 'in-progress' && <ProgressRing value={fraction} color={TONES[block.tone].hex} />}
      {status === 'available' && <span className={buttonClass('gradient', 'sm', 'shrink-0')}>Jugar</span>}
      {status === 'locked' && (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-sm">🔒</span>
      )}
      {status === 'soon' && (
        <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">Pronto</span>
      )}
    </div>
  );
}
