'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { availableCards, type JourneyEvaluation, type SwipeAnswers } from '@/lib/journey';
import { formatCoins } from '@/lib/scoring';
import type { BoardCard, JourneyConfig } from '@/types/game';

interface JourneyBoardProps {
  config: JourneyConfig;
  swipes: SwipeAnswers;
  placed: string[];
  evaluation: JourneyEvaluation;
  onToggle: (cardId: string) => void;
  onLaunch: () => void;
}

/** Etapa B: el user flow en 5 columnas. Cada fase necesita al menos una carta; los recursos son limitados. */
export function JourneyBoard({ config, swipes, placed, evaluation, onToggle, onLaunch }: JourneyBoardProps) {
  const cards = availableCards(config, swipes);
  const blocked = evaluation.overBudget || evaluation.overHours;

  return (
    <div className="space-y-4">
      <section data-tour="journey-resources" className={`${cardClass} grid gap-4 p-4 sm:grid-cols-2`}>
        <ResourceBar icon="💰" label="Presupuesto / mes" used={evaluation.coinsUsed} limit={config.resources.coins} format={formatCoins} />
        <ResourceBar icon="⏱️" label="Horas del equipo / mes" used={evaluation.hoursUsed} limit={config.resources.hours} />
      </section>

      <p className="text-sm text-muted">
        Toca una carta para ponerla en su fase (o sacarla). Una columna vacía es un <b className="text-pink-strong">404</b>: el cliente no puede
        saltarse una fase.
      </p>

      <div className="grid gap-3 lg:grid-cols-5" data-tour="journey-board">
        {config.phases.map((phase, i) => {
          const phaseCards = cards.filter((c) => c.phaseId === phase.id);
          const inColumn = phaseCards.filter((c) => placed.includes(c.id));
          const gap = inColumn.length === 0;
          return (
            <section
              key={phase.id}
              className={`relative flex flex-col rounded-[28px] p-3 ${gap ? 'bg-pink/70 ring-2 ring-pink-strong/40' : 'bg-white shadow-soft ring-1 ring-ink/5'}`}
            >
              <header className="flex items-center justify-between gap-2 px-1">
                <p className="font-display font-bold">
                  {phase.icon} {phase.label}
                </p>
                {gap && (
                  <motion.span
                    animate={{ rotate: [-4, 4, -4] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="rounded-full bg-pink-strong px-2 py-0.5 font-display text-xs font-bold text-white"
                  >
                    🚫 404
                  </motion.span>
                )}
              </header>
              <div className="mt-2 space-y-2">
                {phaseCards.map((card) => (
                  <BoardCardButton key={card.id} card={card} placed={placed.includes(card.id)} onClick={() => onToggle(card.id)} />
                ))}
              </div>
              {i < config.phases.length - 1 && (
                <span className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 text-lg text-muted lg:-right-3 lg:bottom-auto lg:left-auto lg:top-8 lg:translate-x-0">
                  <span className="lg:hidden">↓</span>
                  <span className="hidden lg:inline">→</span>
                </span>
              )}
            </section>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {blocked ? (
          <span className="text-sm font-semibold text-pink-strong">Te pasaste de presupuesto u horas: saca alguna carta.</span>
        ) : evaluation.gaps.length > 0 ? (
          <span className="text-sm text-pink-strong">Hay {evaluation.gaps.length} fase(s) en 404: los leads se van a perder ahí.</span>
        ) : null}
        <Button variant="gradient" size="lg" disabled={blocked} onClick={onLaunch}>
          🚀 Lanzar simulación ({config.simulation.months} meses)
        </Button>
      </div>
    </div>
  );
}

function BoardCardButton({ card, placed, onClick }: { card: BoardCard; placed: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`block w-full rounded-2xl p-2.5 text-left text-sm transition ${
        placed ? 'bg-lavender ring-2 ring-lavender-strong' : 'border-2 border-dashed border-line bg-white/60 text-ink/70 hover:border-lavender-strong/50'
      }`}
    >
      <span className="block font-medium leading-snug">
        {placed ? '✓ ' : '＋ '}
        {card.text}
      </span>
      <span className="mt-1 flex gap-2 text-[11px] font-semibold text-muted">
        <span>💰 {formatCoins(card.coins)}</span>
        <span>⏱️ {card.hours} h</span>
      </span>
    </motion.button>
  );
}

function ResourceBar({
  icon,
  label,
  used,
  limit,
  format = String,
}: {
  icon: string;
  label: string;
  used: number;
  limit: number;
  format?: (n: number) => string;
}) {
  const over = used > limit;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-muted">
          {icon} {label}
        </span>
        <span className={`font-display font-semibold tabular-nums ${over ? 'text-pink-strong' : ''}`}>
          {format(used)} / {format(limit)}
        </span>
      </div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-line">
        <motion.div
          className={`h-full rounded-full ${over ? 'bg-pink-strong' : 'bg-linear-to-r from-sky-strong to-lavender-strong'}`}
          animate={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 20 }}
        />
      </div>
    </div>
  );
}
