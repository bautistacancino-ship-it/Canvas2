'use client';

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import type { SwipeAnswers } from '@/lib/journey';
import type { SwipeCard } from '@/types/game';
import { T } from '@/components/glossary/Terms';

const SWIPE_THRESHOLD = 110;

interface SwipeDeckProps {
  cards: SwipeCard[];
  answers: SwipeAnswers;
  pointsPerSwipe: number;
  canUndo: boolean;
  onUndo: (cardId: string) => void;
  onSwipe: (cardId: string, fits: boolean) => void;
  onDone: () => void;
}

/** Etapa A: 👉 sirve para mi segmento · 👈 no sirve. */
export function SwipeDeck({ cards, answers, pointsPerSwipe, canUndo, onUndo, onSwipe, onDone }: SwipeDeckProps) {
  const index = cards.findIndex((c) => answers[c.id] === undefined);
  const done = index === -1;
  const current = done ? null : cards[index];
  const last = [...cards].reverse().find((c) => answers[c.id] !== undefined);
  const [direction, setDirection] = useState(0);

  const swipe = (fits: boolean) => {
    if (!current) return;
    setDirection(fits ? 1 : -1);
    onSwipe(current.id, fits);
  };

  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') swipe(true);
      if (e.key === 'ArrowLeft') swipe(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const correct = cards.filter((c) => answers[c.id] !== undefined && answers[c.id] === c.fits).length;

  const undoButton = last && (
    <button
      type="button"
      data-tour="swipe-undo"
      disabled={!canUndo}
      onClick={() => onUndo(last.id)}
      className="rounded-full bg-white px-3 py-1.5 font-display text-sm font-semibold shadow-soft ring-1 ring-ink/5 disabled:opacity-40"
    >
      ↩️ {canUndo ? 'Deshacer (1)' : 'Deshacer usado'}
    </button>
  );

  if (done) {
    return (
      <div className="space-y-4">
        <section className={`${cardClass} p-5`}>
          <p className="font-display text-2xl font-bold">
            {correct}/{cards.length} swipes correctos
          </p>
          <p className="text-sm text-muted">Las cartas que aprobaste pasan al tablero. Las que rechazaste, no.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {cards.map((c) => {
              const ok = answers[c.id] === c.fits;
              return (
                <li key={c.id} className={`rounded-2xl p-3 text-sm ${ok ? 'bg-lime' : 'bg-pink'}`}>
                  <p className="font-semibold">
                    {answers[c.id] ? '👉' : '👈'} {c.text} {c.trap && <span className="text-pink-strong">🪤</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/70">
                    {ok ? '✓' : `✗ Era ${c.fits ? '👉 sirve' : '👈 no sirve'}.`} <T>{c.why}</T>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
        <div className="flex items-center justify-end gap-3">
          {undoButton}
          <Button variant="gradient" onClick={onDone}>
            Armar el Journey Board →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="rounded-full bg-white px-3 py-1 font-display font-semibold shadow-soft ring-1 ring-ink/5">
          Carta {index + 1}/{cards.length}
        </span>
        <span className="rounded-full bg-sun px-3 py-1 font-display font-semibold">
          📡 {correct * pointsPerSwipe} pts
        </span>
      </div>

      <div className="relative h-72" data-tour="swipe-card">
        {/* Cartas de atrás */}
        {cards.slice(index + 1, index + 3).map((c, i) => (
          <div
            key={c.id}
            className={`${cardClass} absolute inset-0`}
            style={{ transform: `translateY(${(i + 1) * 10}px) scale(${1 - (i + 1) * 0.04})`, zIndex: 1 - i, opacity: 0.6 }}
          />
        ))}
        <AnimatePresence custom={direction}>
          {current && <TopCard key={current.id} card={current} onSwipe={swipe} />}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-3" data-tour="swipe-buttons">
        <Button variant="soft" size="lg" onClick={() => swipe(false)}>
          👈 No sirve
        </Button>
        <Button variant="dark" size="lg" onClick={() => swipe(true)}>
          Sirve 👉
        </Button>
      </div>
      <div className="flex items-center justify-center gap-3">
        <p className="text-center text-xs text-muted">Arrastra la carta o usa las flechas ← → del teclado.</p>
        {undoButton}
      </div>

      <AnimatePresence mode="popLayout">
        {last && (
          <motion.p
            key={last.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl p-3 text-sm ${answers[last.id] === last.fits ? 'bg-lime' : 'bg-pink'}`}
          >
            <b>{answers[last.id] === last.fits ? `✓ +${pointsPerSwipe}` : '✗'}</b> «{last.text}»: <T>{last.why}</T>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopCard({ card, onSwipe }: { card: SwipeCard; onSwipe: (fits: boolean) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const yes = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);
  const no = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe(true);
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe(false);
  };

  return (
    <motion.div
      className={`${cardClass} absolute inset-0 z-10 flex cursor-grab flex-col items-center justify-center p-6 text-center active:cursor-grabbing`}
      style={{ x, rotate }}
      drag="x"
      dragSnapToOrigin
      onDragEnd={onDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      variants={{ exit: (dir: number) => ({ x: dir * 420, opacity: 0, rotate: dir * 20, transition: { duration: 0.3 } }) }}
      exit="exit"
    >
      <motion.span style={{ opacity: yes }} className="absolute right-5 top-5 rounded-full bg-lime-strong px-3 py-1 font-display text-sm font-bold text-white">
        SIRVE 👉
      </motion.span>
      <motion.span style={{ opacity: no }} className="absolute left-5 top-5 rounded-full bg-pink-strong px-3 py-1 font-display text-sm font-bold text-white">
        👈 NO SIRVE
      </motion.span>
      <span className="text-4xl">📡</span>
      <p className="mt-3 font-display text-2xl font-bold leading-snug">
        <T>{card.text}</T>
      </p>
      <p className="mt-2 text-sm text-muted">¿Sirve para tu segmento?</p>
    </motion.div>
  );
}
