'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import type { HeroPicks } from '@/lib/fitLab';
import { shuffle } from '@/lib/scoring';
import type { FitLabConfig, HeroSlotId } from '@/types/game';
import { HeroPreview } from './HeroPreview';

interface HeroBuilderProps {
  config: FitLabConfig;
  picks: HeroPicks;
  onPick: (slot: HeroSlotId, optionId: string) => void;
  onPublish: () => void;
}

/** Etapa B: 5 slots above the fold, un módulo por slot. El espacio es el recurso escaso. */
export function HeroBuilder({ config, picks, onPick, onPublish }: HeroBuilderProps) {
  const firstEmpty = config.slots.find((s) => !picks[s.id])?.id ?? config.slots[0].id;
  const [active, setActive] = useState<HeroSlotId>(firstEmpty);
  const [optionOrder] = useState(() => Object.fromEntries(config.slots.map((s) => [s.id, shuffle(s.options)])));

  const filled = config.slots.filter((s) => picks[s.id]).length;
  const activeSlot = config.slots.find((s) => s.id === active)!;
  const activeIndex = config.slots.findIndex((s) => s.id === active);

  const choose = (optionId: string) => {
    onPick(active, optionId);
    const nextEmpty = config.slots.find((s, i) => i > activeIndex && !picks[s.id]) ?? config.slots.find((s) => s.id !== active && !picks[s.id]);
    if (nextEmpty) setActive(nextEmpty.id);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 font-display text-sm font-semibold shadow-soft ring-1 ring-ink/5">
            🖼️ Above the fold: {filled}/{config.slots.length} slots
          </span>
          <span className="text-xs text-muted">No caben más de {config.slots.length} módulos en la primera pantalla.</span>
        </div>
        <HeroPreview config={config} picks={picks} activeSlot={active} onSlotClick={setActive} />
      </div>

      <aside className={`${cardClass} self-start p-4 lg:sticky lg:top-28`}>
        <div className="flex flex-wrap gap-1.5">
          {config.slots.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`rounded-full px-3 py-1 font-display text-xs font-semibold transition ${
                s.id === active ? 'bg-ink text-white' : picks[s.id] ? 'bg-lime text-lime-strong' : 'bg-surface text-muted'
              }`}
            >
              {picks[s.id] && s.id !== active ? '✓' : i + 1} {s.label}
            </button>
          ))}
        </div>

        <p className="mt-4 font-display text-lg font-bold">
          Slot {activeIndex + 1} · {activeSlot.label}
        </p>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="mt-2 space-y-2">
            {optionOrder[active].map((option) => {
              const selected = picks[active] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choose(option.id)}
                  className={`block w-full rounded-2xl p-3 text-left text-sm transition ${
                    selected ? 'bg-sky ring-2 ring-sky-strong' : 'bg-surface ring-1 ring-line hover:bg-white hover:ring-lavender-strong/40'
                  }`}
                >
                  {option.text}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <Button variant="gradient" className="mt-5 w-full" disabled={filled < config.slots.length} onClick={onPublish}>
          {filled < config.slots.length ? `Completa los ${config.slots.length} slots` : 'Publicar y correr el test 🚀'}
        </Button>
      </aside>
    </div>
  );
}
