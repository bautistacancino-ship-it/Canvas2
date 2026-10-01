'use client';

import { motion } from 'framer-motion';
import { BadgeChip } from '@/components/ui/BadgeChip';
import { Blob } from '@/components/ui/Blob';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import type { PointLine } from '@/lib/inbox';
import { BLOB_COLORS } from '@/lib/tones';
import type { ActivityOutcome, BadgeId, MeterEffects } from '@/types/game';
import { T } from '@/components/glossary/Terms';

export interface OutcomeCopy {
  totalTitle: string;
  totalBody: string;
  partialTitle: string;
  partialBody: string;
  collapseLabel: string;
  collapseTitle: string;
}

interface ActivityOutcomeCardProps {
  outcome: ActivityOutcome;
  copy: OutcomeCopy;
  stats: { label: string; value: string }[];
  breakdown: PointLine[];
  points: number;
  badges: BadgeId[];
  meterImpact: MeterEffects;
  hint: string;
  onRetry: () => void;
  onContinue: () => void;
}

/** Resultado de una actividad de Fase 3: éxito total, parcial o colapso (con reintento obligatorio). */
export function ActivityOutcomeCard({
  outcome,
  copy,
  stats,
  breakdown,
  points,
  badges,
  meterImpact,
  hint,
  onRetry,
  onContinue,
}: ActivityOutcomeCardProps) {
  if (outcome === 'collapse') {
    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="overflow-hidden rounded-[32px] bg-linear-to-br from-pink-strong to-peach-strong p-6 text-center text-white shadow-float"
      >
        <div className="flex justify-center">
          <Blob color={BLOB_COLORS.ink} mood="sad" size={100} />
        </div>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/80">{copy.collapseLabel}</p>
        <h3 className="font-display text-3xl font-bold">{copy.collapseTitle}</h3>
        <div className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/20 p-3">
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="text-xs">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-4 max-w-md rounded-2xl bg-white/15 p-3 font-medium">💡 Pista: <T>{hint}</T></p>
        <Button variant="dark" size="lg" className="mt-5" onClick={onRetry}>
          Reintentar ↻
        </Button>
      </motion.section>
    );
  }

  const total = outcome === 'total';
  const { rentabilidad = 0, reputacion = 0 } = meterImpact;
  const signed = (n: number) => (n > 0 ? `+${n}` : String(n));

  return (
    <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${cardClass} overflow-hidden`}>
      <div className={`flex flex-wrap items-center gap-4 p-5 ${total ? 'bg-lime' : 'bg-sun'}`}>
        <Blob color={total ? BLOB_COLORS.yellow : BLOB_COLORS.sky} mood={total ? 'excited' : 'thinking'} size={84} className="shrink-0" />
        <div className="min-w-0 flex-1 basis-56">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/60">{total ? '🏆 Éxito total' : '⚠️ Éxito parcial'}</p>
          <h3 className="font-display text-2xl font-bold">{total ? copy.totalTitle : copy.partialTitle}</h3>
          <p className="text-sm text-ink/70">
            <T>{total ? copy.totalBody : copy.partialBody}</T>
          </p>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div>
          <p className="font-display font-bold">Puntos de la actividad</p>
          <ul className="mt-2 space-y-1 text-sm">
            {breakdown.map((line) => (
              <li key={line.label} className="flex justify-between gap-3 rounded-xl bg-surface px-3 py-1.5">
                <span className="text-ink/75">{line.label}</span>
                <span className="font-display font-semibold">+{line.points}</span>
              </li>
            ))}
            <li className="flex justify-between gap-3 rounded-xl bg-sun px-3 py-1.5 font-display font-bold">
              <span>Total</span>
              <span>★ {points}</span>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-display font-bold">Estado de la agencia</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-surface p-3">
                  <p className="text-xs text-muted">{s.label}</p>
                  <p className="font-display text-xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              Impacto en tus medidores: Rentabilidad {signed(rentabilidad)} · Reputación {signed(reputacion)}
            </p>
          </div>
          {badges.length > 0 && (
            <div>
              <p className="font-display font-bold">Insignias ganadas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {badges.map((id) => (
                  <BadgeChip key={id} id={id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-line p-4">
        {!total && (
          <Button variant="soft" onClick={onRetry}>
            Reintentar para el éxito total ↻
          </Button>
        )}
        <Button variant="gradient" onClick={onContinue}>
          Continuar al reto final →
        </Button>
      </div>
    </motion.section>
  );
}
