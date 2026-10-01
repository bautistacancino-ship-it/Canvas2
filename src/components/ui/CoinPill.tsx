'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { AnimatedNumber } from '@/components/hud/AnimatedNumber';
import { LEVEL_COMPLETION_POINTS } from '@/lib/scoring';

/** Píldora de monedas + "¿Cómo ganar?" con las reglas del juego. */
export function CoinPill({ value, showHelp = true }: { value: number; showHelp?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center rounded-full bg-white p-1 ring-1 ring-line">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-sky-strong to-lavender-strong py-1.5 pl-2 pr-3 font-display text-base font-semibold text-white">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-sun-strong text-xs shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]">
          ★
        </span>
        <AnimatedNumber value={value} />
      </span>
      {showHelp && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="hidden px-3 font-display text-sm font-semibold text-sky-strong hover:underline sm:block"
          aria-expanded={open}
        >
          ¿Cómo ganar?
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            className="absolute right-0 top-full z-40 mt-2 w-72 rounded-3xl bg-white p-4 text-sm shadow-float ring-1 ring-ink/5"
          >
            <p className="font-display text-lg font-semibold">Cómo ganar puntos</p>
            <ul className="mt-2 space-y-2 text-muted">
              <li>
                <b className="text-ink">⚡ Quiz:</b> puntos por cada acierto y bono extra si respondes rápido.
              </li>
              <li>
                <b className="text-ink">💬 Actividad:</b> descubre datos del cliente antes de cotizar y clasifica bien tus leads.
              </li>
              <li>
                <b className="text-ink">🏅 Insignias:</b> se ganan con decisiones de CEO, no de agencia novata.
              </li>
              <li>
                <b className="text-ink">🧩 Canvas:</b> +{LEVEL_COMPLETION_POINTS} al completar cada bloque.
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
