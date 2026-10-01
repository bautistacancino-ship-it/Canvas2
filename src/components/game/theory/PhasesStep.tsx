'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { cardClass } from '@/components/ui/Card';
import type { PhasesTheory } from '@/types/game';

interface PhasesStepProps {
  phases: PhasesTheory;
  revealed: Set<string>;
  onReveal: (id: string) => void;
}

/** Las fases del recorrido como un user flow: cada pantalla muestra su ruta buena y su 404 típico. */
export function PhasesStep({ phases, revealed, onReveal }: PhasesStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-ink/75">{phases.intro}</p>
      <ol className="grid gap-3 lg:grid-cols-5">
        {phases.items.map((item, i) => {
          const showFail = revealed.has(item.id);
          return (
            <li key={item.id} className="relative">
              <div className={`${cardClass} flex h-full flex-col p-4`}>
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-1 font-display text-lg font-bold">{item.label}</p>
                <p className="text-xs font-semibold text-muted">{item.question}</p>
                <p className="mt-3 rounded-2xl bg-lime p-3 text-sm">✅ {item.example}</p>
                <AnimatePresence initial={false}>
                  {showFail && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 overflow-hidden rounded-2xl bg-pink p-3 text-sm"
                    >
                      🚫 <b>404:</b> {item.fail}
                    </motion.p>
                  )}
                </AnimatePresence>
                {!showFail && (
                  <button
                    type="button"
                    onClick={() => onReveal(item.id)}
                    className="mt-auto pt-3 text-left font-display text-sm font-semibold text-pink-strong hover:underline"
                  >
                    Ver el 404 típico →
                  </button>
                )}
              </div>
              {i < phases.items.length - 1 && (
                <span className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 text-lg text-muted lg:-right-3 lg:bottom-auto lg:left-auto lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2">
                  <span className="lg:hidden">↓</span>
                  <span className="hidden lg:inline">→</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
