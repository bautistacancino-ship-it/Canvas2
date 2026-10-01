'use client';

import { motion } from 'framer-motion';
import { LoadingBlob } from '@/components/ui/Blob';
import { ButtonLink } from '@/components/ui/Button';
import { IconTile } from '@/components/ui/IconTile';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { getBusiness } from '@/data/businesses';
import { CANVAS_BLOCKS } from '@/data/canvasBlocks';
import { getLevel } from '@/data/levels';
import { CanvasEntryView } from './CanvasEntryView';
import { TONES } from '@/lib/tones';
import { useGameStore, useHasHydrated } from '@/store/useGameStore';

/** Tablero final: los 9 bloques en la disposición clásica del Business Model Canvas. */
export function CanvasBoard() {
  const hydrated = useHasHydrated();
  const profile = useGameStore((s) => s.profile);
  const canvas = useGameStore((s) => s.canvas);
  const progress = useGameStore((s) => s.progress);

  if (!hydrated) return <LoadingBlob label="Cargando Canvas…" />;
  if (!profile) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted">Aún no empiezas una partida.</p>
        <ButtonLink href="/" variant="dark" className="mt-4">
          Elegir Core Business
        </ButtonLink>
      </div>
    );
  }

  const completed = CANVAS_BLOCKS.filter((b) => progress[b.id]?.phase === 'done').length;
  const business = getBusiness(profile.businessId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 px-1">
        <div>
          <p className="text-sm text-muted">
            {business?.emoji} {business?.name}
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Mi Canvas<span className="text-pink-strong">.</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 shadow-soft ring-1 ring-ink/5">
          <ProgressRing value={completed / 9} size={44} color="#8b6cff">
            <span className="font-display text-xs">{completed}</span>
          </ProgressRing>
          <span className="font-display font-semibold">{completed}/9 bloques</span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-10 lg:grid-rows-[repeat(2,minmax(14rem,auto))_minmax(10rem,auto)]">
        {CANVAS_BLOCKS.map((block) => {
          const entry = canvas[block.id];
          const isDone = progress[block.id]?.phase === 'done';
          const build = getLevel(profile.businessId, block.id)?.build;
          const tone = TONES[block.tone];

          return (
            <motion.article
              key={block.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: block.order * 0.05 }}
              className={`flex flex-col rounded-[28px] p-4 ${block.gridClass} ${
                isDone ? `${tone.soft} shadow-soft` : 'border-2 border-dashed border-line bg-white/60'
              }`}
              style={{ order: block.order }}
            >
              <header className="flex items-center gap-2.5">
                <IconTile
                  icon={block.icon}
                  tone={block.tone}
                  size="sm"
                  className={isDone ? 'bg-white!' : 'opacity-60 grayscale'}
                />
                <h2 className={`min-w-0 flex-1 font-display text-base font-bold leading-tight ${isDone ? '' : 'text-muted'}`}>
                  {block.title}
                </h2>
                <span className="text-[11px] font-bold text-muted">#{block.order}</span>
              </header>

              {isDone && entry ? (
                <CanvasEntryView build={build} entry={entry} labelClass={tone.text} />
              ) : (
                <p className="mt-3 text-sm text-muted/80">{block.question}</p>
              )}
            </motion.article>
          );
        })}
      </div>

      <div className="mt-8">
        <ButtonLink href="/" variant="dark">
          ← Volver al mapa de niveles
        </ButtonLink>
      </div>
    </div>
  );
}
