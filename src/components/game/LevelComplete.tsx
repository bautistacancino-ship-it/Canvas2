'use client';

import { motion } from 'framer-motion';
import { Blob } from '@/components/ui/Blob';
import { Button, ButtonLink } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { BadgeChip } from '@/components/ui/BadgeChip';
import { BLOB_COLORS } from '@/lib/tones';
import type { BadgeId, BlockProgress } from '@/types/game';

/** Pantalla de "¡Felicitaciones!" al completar un bloque. */
export function LevelComplete({
  title,
  progress,
  completedCount,
  badges,
  onEdit,
}: {
  title: string;
  progress?: BlockProgress;
  completedCount: number;
  badges: BadgeId[];
  onEdit: () => void;
}) {
  const activity = progress?.activity;

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <motion.section
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="overflow-hidden rounded-[32px] bg-linear-to-b from-sun to-peach p-2 shadow-float"
      >
        <div className={`${cardClass} overflow-hidden`}>
          <div className="relative h-52 bg-linear-to-b from-sun to-white">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 font-display text-xs font-semibold shadow-soft ring-1 ring-ink/10"
            >
              ¡Lo lograste! 🎉
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute right-5 top-9 rounded-full bg-white px-3 py-1 font-display text-xs font-semibold shadow-soft ring-1 ring-ink/10"
            >
              ¿Siguiente nivel? 👀
            </motion.span>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center -space-x-6">
              <Blob color={BLOB_COLORS.sky} mood="happy" size={92} />
              <Blob color={BLOB_COLORS.yellow} mood="excited" size={118} delay={0.3} className="relative z-10" />
              <Blob color={BLOB_COLORS.pink} mood="happy" size={92} delay={0.6} />
              <Blob color={BLOB_COLORS.lavender} mood="excited" size={84} delay={0.9} />
            </div>
          </div>

          <div className="px-6 pb-6 pt-4 text-center">
            <h1 className="font-display text-3xl font-bold">¡Felicitaciones!</h1>
            <p className="mt-2 text-sm text-muted">
              Completaste <b className="text-ink">{title}</b> y tu bloque ya está pegado en el Canvas.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <MiniStat label="Quiz" value={`${progress?.quiz?.correct ?? 0}/${progress?.quiz?.total ?? 0}`} bg="bg-lavender" />
              <MiniStat label={activity?.highlight.label ?? 'Actividad'} value={activity?.highlight.value ?? '—'} bg="bg-sky" />
              <MiniStat label="Bloques" value={`${completedCount}/9`} bg="bg-lime" />
            </div>

            {badges.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Tus insignias</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {badges.map((id) => (
                    <BadgeChip key={id} id={id} />
                  ))}
                </div>
              </div>
            )}

            <ButtonLink href="/canvas" variant="gradient" size="md" className="mt-6 w-full">
              Ver mi Canvas
            </ButtonLink>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <ButtonLink href="/" variant="soft" size="sm">
                Volver al mapa
              </ButtonLink>
              <Button variant="soft" size="sm" onClick={onEdit}>
                Editar bloque
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function MiniStat({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div className={`rounded-2xl px-2 py-3 ${bg}`}>
      <p className="font-display text-xl font-bold">{value}</p>
      <p className="text-[11px] font-semibold leading-tight text-ink/60">{label}</p>
    </div>
  );
}
