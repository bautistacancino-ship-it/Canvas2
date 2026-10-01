'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { cardClass } from '@/components/ui/Card';
import type { FitMapTheory } from '@/types/game';
import { T } from '@/components/glossary/Terms';

interface FitMapStepProps {
  fitMap: FitMapTheory;
  revealed: Set<number>;
  onReveal: (index: number) => void;
}

/** Dos columnas (ej. perfil ↔ mapa de valor): el jugador conecta cada fila para revelar el lado derecho. */
export function FitMapStep({ fitMap, revealed, onReveal }: FitMapStepProps) {
  return (
    <div className="space-y-4">
      <section className={`${cardClass} p-5 sm:p-6`}>
        <span className="rounded-full bg-sky px-3 py-1 text-xs font-bold text-sky-strong">{fitMap.badge}</span>
        <p className="mt-3 text-ink/75">
          <T>{fitMap.intro}</T>
        </p>
        <div className="mt-4 hidden grid-cols-[1fr_56px_1fr] gap-2 px-1 text-xs font-bold uppercase tracking-wider text-muted sm:grid">
          <span>{fitMap.leftTitle}</span>
          <span />
          <span>{fitMap.rightTitle}</span>
        </div>
        <div className="mt-2 space-y-3">
          {fitMap.rows.map((row, i) => {
            const open = revealed.has(i);
            return (
              <div key={row.profileLabel} className="grid items-stretch gap-2 sm:grid-cols-[1fr_56px_1fr]">
                <div className="rounded-2xl bg-pink p-3">
                  <p className="font-display font-bold">
                    {row.icon} {row.profileLabel} <span className="text-xs font-semibold text-ink/50">· {row.profileHint}</span>
                  </p>
                  <p className="mt-1 text-sm">
                    <T>{row.profileExample}</T>
                  </p>
                </div>
                <div className="grid place-items-center">
                  <motion.span
                    animate={open ? { scale: [1, 1.3, 1] } : {}}
                    className={`grid h-10 w-10 place-items-center rounded-full text-lg ${open ? 'bg-lime-strong text-white' : 'bg-surface text-muted'}`}
                  >
                    {open ? '🧲' : '→'}
                  </motion.span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded-2xl bg-lime p-3"
                    >
                      <p className="font-display font-bold text-lime-strong">{row.valueLabel}</p>
                      <p className="mt-1 text-sm">
                        <T>{row.valueExample}</T>
                      </p>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="closed"
                      type="button"
                      onClick={() => onReveal(i)}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-2xl border-2 border-dashed border-line p-3 text-left font-display text-sm font-semibold text-muted hover:border-lime-strong hover:text-lime-strong"
                    >
                      {fitMap.revealLabel}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {fitMap.note && (
        <section className="flex items-start gap-3 rounded-[28px] bg-sun p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-2xl">🧲</span>
          <p className="text-ink/80">
            <T>{fitMap.note}</T>
          </p>
        </section>
      )}
    </div>
  );
}
