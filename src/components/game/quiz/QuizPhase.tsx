'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { BadgeChip } from '@/components/ui/BadgeChip';
import { Blob } from '@/components/ui/Blob';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { BLOB_COLORS, toneAt } from '@/lib/tones';
import type { BadgeId, QuizConfig, QuizResult, TheoryCard } from '@/types/game';
import { TimedQuiz } from './TimedQuiz';
import { T } from '@/components/glossary/Terms';

interface QuizPhaseProps {
  config: QuizConfig;
  /** Tarjetas de teoría para el repaso cuando no se alcanza el umbral. */
  cards: TheoryCard[];
  onPass: (result: QuizResult, badges: BadgeId[]) => void;
  /** Mientras un tutorial está abierto, el reloj no corre. */
  paused?: boolean;
}

/** Intentos del quiz: aprobar desbloquea la fase 3; reprobar lleva a repasar y reintentar. */
export function QuizPhase({ config, cards, onPass, paused = false }: QuizPhaseProps) {
  const [attempt, setAttempt] = useState(1);
  const [result, setResult] = useState<QuizResult | null>(null);

  if (!result) return <TimedQuiz key={attempt} config={config} paused={paused} onComplete={setResult} />;

  const perfect = result.correct === result.total;
  const badges: BadgeId[] = perfect && config.perfectBadgeId ? [config.perfectBadgeId] : [];

  if (result.passed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${cardClass} mx-auto max-w-xl p-6 text-center sm:p-8`}>
        <div className="flex justify-center">
          <Blob color={BLOB_COLORS.yellow} mood="excited" size={110} />
        </div>
        <p className="mt-3 font-display text-5xl font-bold text-lime-strong">
          {result.correct}/{result.total}
        </p>
        <h3 className="mt-1 font-display text-2xl font-bold">{perfect ? '¡Perfecto!' : '¡Aprobado!'}</h3>
        <p className="mt-2 text-muted">Desbloqueaste el Inbox de Leads.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-sun px-4 py-1.5 font-display font-semibold">★ {result.points} pts</span>
          <span className="rounded-full bg-peach px-4 py-1.5 font-display font-semibold text-peach-strong">
            ⚡ {result.fastAnswers} respuestas rápidas
          </span>
        </div>
        {badges.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Nueva insignia</p>
            <BadgeChip id={badges[0]} />
          </div>
        )}
        <Button variant="gradient" size="lg" className="mt-6 w-full" onClick={() => onPass(result, badges)}>
          Abrir el Inbox de Leads →
        </Button>
      </motion.div>
    );
  }

  // No alcanzó el umbral: repasa las tarjetas relacionadas con sus errores.
  const wrongQuestions = config.questions.filter((q) => result.wrongQuestionIds.includes(q.id));
  const reviewIds = [...new Set(wrongQuestions.map((q) => q.relatedCardId).filter(Boolean))];
  const reviewCards = cards.filter((c) => reviewIds.includes(c.id));

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <section className="flex flex-wrap items-center gap-4 rounded-[28px] bg-pink p-5">
        <Blob color={BLOB_COLORS.lavender} mood="sad" size={84} className="shrink-0" />
        <div className="min-w-0 flex-1 basis-56">
          <p className="font-display text-2xl font-bold">
            {result.correct}/{result.total}: te faltan {config.passThreshold - result.correct}
          </p>
          <p className="text-ink/70">
            Necesitas {config.passThreshold} de {result.total} para avanzar. Repasa estas tarjetas y vuelve a intentarlo.
          </p>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {reviewCards.map((card, i) => (
          <div key={card.id} className={`${cardClass} p-5`}>
            <div className="flex items-center gap-3">
              <IconTile icon={card.icon} tone={toneAt(i)} size="sm" />
              <p className="font-display text-lg font-bold leading-tight">{card.title}</p>
            </div>
            <p className="mt-3 text-sm text-ink/75">
              <T>{card.body}</T>
            </p>
            <p className="mt-3 rounded-2xl bg-surface p-3 text-sm">
              <span className="font-bold text-lavender-strong">En tu agencia: </span>
              <T>{card.example}</T>
            </p>
          </div>
        ))}
      </div>

      <section className={`${cardClass} p-5`}>
        <p className="font-display text-lg font-bold">Las que fallaste</p>
        <ul className="mt-2 space-y-2 text-sm">
          {wrongQuestions.map((q) => (
            <li key={q.id} className="rounded-2xl bg-surface p-3">
              <span className="font-semibold">{q.topic}:</span> <span className="text-ink/70">
                <T>{q.explanation}</T>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Button
        variant="gradient"
        size="lg"
        className="w-full"
        onClick={() => {
          setResult(null);
          setAttempt((a) => a + 1);
        }}
      >
        Reintentar quiz (intento {attempt + 1}) ↻
      </Button>
    </div>
  );
}
