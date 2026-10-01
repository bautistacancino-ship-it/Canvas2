'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Blob } from '@/components/ui/Blob';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { CORE_BUSINESSES } from '@/data/businesses';
import { BLOB_COLORS, toneAt } from '@/lib/tones';
import { useGameStore } from '@/store/useGameStore';
import type { BusinessId } from '@/types/game';

export function BusinessPicker() {
  const startGame = useGameStore((s) => s.startGame);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<BusinessId | null>(null);

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <section className={`${cardClass} overflow-hidden`}>
        {/* Hero con mascotas */}
        <div className="relative h-56 bg-linear-to-b from-sky via-lavender to-white">
          <div className="absolute left-4 top-6 rounded-full bg-white px-3 py-1 font-display text-xs font-semibold text-muted shadow-soft">
            ¡Hola, creativx! 👋
          </div>
          <Blob color={BLOB_COLORS.ink} mood="excited" size={130} className="absolute -left-4 bottom-0" />
          <Blob color={BLOB_COLORS.yellow} mood="happy" size={120} delay={0.6} className="absolute bottom-2 right-6" />
          <Blob color={BLOB_COLORS.pink} mood="happy" size={70} delay={1.1} className="absolute left-1/2 top-8 -translate-x-1/2" />
          <span className="absolute right-10 top-8 text-2xl">✨</span>
          <span className="absolute bottom-24 left-32 text-xl">💬</span>
        </div>

        <div className="px-6 pb-8 pt-2 text-center">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Tu talento,
            <br />
            tu negocio.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-muted">
            Recorre los 9 bloques del Business Model Canvas resolviendo casos reales de clientes.
          </p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre o el de tu estudio"
            className="mt-6 h-14 w-full rounded-full bg-surface px-6 text-center font-medium ring-1 ring-line placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-lavender-strong"
          />
        </div>
      </section>

      <h2 className="mb-3 mt-8 px-2 font-display text-xl font-semibold">Elige tu Core Business</h2>
      <div className="grid gap-3">
        {CORE_BUSINESSES.map((business, i) => {
          const isSelected = selected === business.id;
          return (
            <motion.button
              key={business.id}
              type="button"
              disabled={!business.available}
              onClick={() => setSelected(business.id)}
              whileTap={business.available ? { scale: 0.98 } : undefined}
              className={`flex items-center gap-4 rounded-3xl bg-white p-3 pr-5 text-left shadow-soft transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected ? 'ring-2 ring-sky-strong' : 'ring-1 ring-ink/5 hover:ring-lavender-strong/40'
              }`}
            >
              <IconTile icon={business.emoji} tone={toneAt(i + 3)} size="lg" />
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold leading-tight">{business.name}</span>
                <span className="mt-0.5 block text-sm text-muted">{business.tagline}</span>
              </span>
              {business.available ? (
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                    isSelected ? 'bg-sky-strong text-white' : 'ring-2 ring-line'
                  }`}
                >
                  {isSelected && '✓'}
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">Pronto</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <Button
        variant="dark"
        size="lg"
        disabled={!selected}
        onClick={() => selected && startGame(selected, name)}
        className="mt-8 w-full"
      >
        + Comenzar aventura
      </Button>
    </div>
  );
}
