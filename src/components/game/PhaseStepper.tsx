'use client';

import { motion } from 'framer-motion';
import { LEVEL_PHASES, type LevelPhase } from '@/types/game';

const PHASES: Record<LevelPhase, { icon: string; label: string; bg: string }> = {
  theory: { icon: '📚', label: 'Teoría', bg: 'bg-lavender' },
  quiz: { icon: '⚡', label: 'Quiz', bg: 'bg-sun' },
  simulation: { icon: '💬', label: 'Chat', bg: 'bg-sky' },
  build: { icon: '🧱', label: 'Canvas', bg: 'bg-peach' },
};

/** Pasos del nivel como chips en píldora (estilo filtros "Survival / Action"). */
export function PhaseStepper({ current }: { current: LevelPhase }) {
  const currentIndex = LEVEL_PHASES.indexOf(current);

  return (
    <ol className="grid grid-cols-4 gap-1.5 rounded-full bg-white p-1.5 shadow-soft ring-1 ring-ink/5">
      {LEVEL_PHASES.map((phase, i) => {
        const status = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'locked';
        const meta = PHASES[phase];
        return (
          <li
            key={phase}
            className={`relative flex min-w-0 items-center justify-center gap-1.5 rounded-full py-1.5 font-display text-sm font-semibold sm:justify-start sm:pl-1.5 ${
              status === 'locked' ? 'text-muted/60' : 'text-ink'
            }`}
          >
            {status === 'active' && (
              <motion.span
                layoutId="phase-pill"
                className="absolute inset-0 rounded-full bg-surface ring-1 ring-line"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-base ${
                status === 'done' ? 'bg-lime text-lime-strong' : status === 'locked' ? 'bg-surface grayscale' : meta.bg
              }`}
            >
              {status === 'done' ? '✓' : meta.icon}
            </span>
            <span className="relative hidden truncate sm:block">{meta.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
