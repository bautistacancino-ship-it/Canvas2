'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Blob } from '@/components/ui/Blob';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { quizAnswerPoints, shuffle } from '@/lib/scoring';
import { BLOB_COLORS, TONES, toneAt } from '@/lib/tones';
import { useGameStore } from '@/store/useGameStore';
import type { QuizConfig, QuizResult } from '@/types/game';
import { CircularTimer } from './CircularTimer';
import { T } from '@/components/glossary/Terms';

const TICK_MS = 100;

type Feedback = { kind: 'correct'; points: number; fast: boolean } | { kind: 'wrong' } | { kind: 'timeout' };

interface TimedQuizProps {
  config: QuizConfig;
  /** Se dispara al cerrar la última pregunta con el resumen del intento. */
  onComplete: (result: QuizResult) => void;
  /** Detiene el reloj (ej. mientras se muestra un tutorial). Abrir un término NO lo detiene. */
  paused?: boolean;
}

export function TimedQuiz({ config, onComplete, paused = false }: TimedQuizProps) {
  const { questions } = config;
  const limitMs = config.timeLimitSec * 1000;
  const fastMs = config.fastWithinSec * 1000;
  const streak = useGameStore((s) => s.streak);
  const registerQuizAnswer = useGameStore((s) => s.registerQuizAnswer);

  // Orden de opciones aleatorio por intento: si la correcta siempre fuera
  // la misma letra, los jugadores lo detectarían en la segunda pregunta.
  const [optionOrder] = useState(() =>
    questions.map((q) => (config.shuffleOptions ? shuffle(q.options) : q.options)),
  );
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(limitMs);
  const [tally, setTally] = useState({ correct: 0, points: 0, fastAnswers: 0, wrong: [] as string[] });

  // El deadline vive en un ref: medimos contra el reloj real (performance.now)
  // para que el contador no "derive" si la pestaña se laguea.
  const deadlineRef = useRef(0);
  const answeredRef = useRef(false);
  const pausedAtRef = useRef<number | null>(null);

  const question = questions[index];
  const options = optionOrder[index];
  const isLast = index === questions.length - 1;

  useEffect(() => {
    deadlineRef.current = performance.now() + limitMs;
    answeredRef.current = false;
  }, [index, limitMs]);

  // Al pausar se congela el reloj; al reanudar, el plazo se corre lo que duró la pausa.
  useEffect(() => {
    if (paused) pausedAtRef.current = performance.now();
    else if (pausedAtRef.current !== null) {
      deadlineRef.current += performance.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
  }, [paused]);

  const resolve = useCallback(
    (optionId: string | null) => {
      if (answeredRef.current) return;
      answeredRef.current = true;

      const remaining = Math.max(0, deadlineRef.current - performance.now());
      const correct = optionId !== null && optionId === question.correctOptionId;
      const { points, fast } = quizAnswerPoints(correct, limitMs - remaining, config);

      setFeedback(correct ? { kind: 'correct', points, fast } : { kind: optionId === null ? 'timeout' : 'wrong' });
      setSelectedId(optionId);
      setTimeLeftMs(remaining);
      setTally((t) => ({
        correct: t.correct + (correct ? 1 : 0),
        points: t.points + points,
        fastAnswers: t.fastAnswers + (fast ? 1 : 0),
        wrong: correct ? t.wrong : [...t.wrong, question.id],
      }));
      registerQuizAnswer(correct);
    },
    [config, limitMs, question, registerQuizAnswer],
  );

  // Loop del temporizador: corre solo mientras se espera respuesta.
  useEffect(() => {
    if (feedback || paused) return;
    const id = window.setInterval(() => {
      const remaining = Math.max(0, deadlineRef.current - performance.now());
      setTimeLeftMs(remaining);
      if (remaining === 0) resolve(null);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [feedback, paused, resolve]);

  const goNext = () => {
    if (isLast) {
      onComplete({
        correct: tally.correct,
        total: questions.length,
        points: tally.points,
        fastAnswers: tally.fastAnswers,
        passed: tally.correct >= config.passThreshold,
        wrongQuestionIds: tally.wrong,
      });
      return;
    }
    setIndex((i) => i + 1);
    setSelectedId(null);
    setFeedback(null);
    setTimeLeftMs(limitMs);
  };

  const bonusLeftMs = fastMs - (limitMs - timeLeftMs);
  const bonusActive = !feedback && bonusLeftMs > 0;
  const isCorrect = feedback?.kind === 'correct';

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className={`${cardClass} relative p-5 sm:p-7`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="rounded-full bg-surface px-3 py-1 font-display text-sm font-semibold text-muted">
              Pregunta {index + 1}/{questions.length} · {question.topic}
            </span>
            <div className="mt-3 flex gap-1.5">
              {questions.map((q, i) => (
                <span
                  key={q.id}
                  className={`h-2 flex-1 rounded-full transition-colors sm:w-8 sm:flex-none ${
                    i < index ? 'bg-lavender-strong' : i === index ? 'bg-lavender-strong/40' : 'bg-line'
                  }`}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sun px-3 py-1 font-display text-sm font-semibold">
                ★ <span className="tabular-nums">{tally.points}</span> pts
              </span>
              <span className="rounded-full bg-lime px-3 py-1 font-display text-sm font-semibold text-lime-strong">
                ✓ {tally.correct} · meta {config.passThreshold}/{questions.length}
              </span>
              {streak > 1 && (
                <span className="rounded-full bg-peach px-3 py-1 font-display text-sm font-semibold text-peach-strong">
                  🔥 ×{streak}
                </span>
              )}
            </div>
          </div>

          <div className="relative shrink-0" data-tour="quiz-timer">
            <CircularTimer timeLeftMs={timeLeftMs} totalMs={limitMs} />
            <AnimatePresence>
              {bonusActive && (
                <motion.span
                  initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 8 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -right-3 -top-3 whitespace-nowrap rounded-full bg-linear-to-r from-[#ffac3a] to-[#ff5fa2] px-2.5 py-1 font-display text-xs font-bold text-white shadow-soft"
                >
                  ⚡ +{config.fastBonus} · {Math.ceil(bonusLeftMs / 1000)}s
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <p className="mb-5 font-display text-xl font-bold leading-snug sm:text-2xl">
              <T>{question.prompt}</T>
            </p>

            <div className="grid gap-2.5" data-tour="quiz-options">
              {options.map((option, i) => {
                const optionCorrect = option.id === question.correctOptionId;
                const isSelected = option.id === selectedId;
                const state = !feedback ? 'idle' : optionCorrect ? 'correct' : isSelected ? 'wrong' : 'dim';
                const tone = toneAt(i);

                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    disabled={Boolean(feedback)}
                    onClick={() => resolve(option.id)}
                    whileHover={!feedback ? { scale: 1.01 } : undefined}
                    whileTap={!feedback ? { scale: 0.98 } : undefined}
                    animate={
                      state === 'correct'
                        ? { scale: [1, 1.03, 1] }
                        : state === 'wrong'
                          ? { x: [0, -10, 10, -6, 6, 0] }
                          : { scale: 1, x: 0 }
                    }
                    transition={{ duration: 0.4 }}
                    className={`flex items-center gap-3 rounded-[22px] p-2 pr-4 text-left font-medium transition-colors ${
                      {
                        idle: 'bg-surface ring-1 ring-line hover:bg-white hover:ring-2 hover:ring-lavender-strong/40',
                        correct: 'bg-lime ring-2 ring-lime-strong',
                        wrong: 'bg-pink ring-2 ring-pink-strong',
                        dim: 'bg-surface text-muted opacity-60',
                      }[state]
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold ${
                        state === 'correct'
                          ? 'bg-lime-strong text-white'
                          : state === 'wrong'
                            ? 'bg-pink-strong text-white'
                            : `bg-white ${TONES[tone].text}`
                      }`}
                    >
                      {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    {option.text}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {feedback?.kind === 'correct' && (
                <motion.div
                  key={`float-${question.id}`}
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 1, 0], y: -90, scale: 1.3 }}
                  transition={{ duration: 1.4, times: [0, 0.15, 0.7, 1] }}
                  className="pointer-events-none absolute inset-x-0 top-1/3 text-center font-display text-5xl font-bold text-lime-strong drop-shadow-[0_6px_0_rgba(255,255,255,1)]"
                >
                  +{feedback.points}
                  {feedback.fast && ' ⚡'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[28px] p-4 pr-5 ${isCorrect ? 'bg-lime' : 'bg-pink'}`}
          >
            <Blob
              color={isCorrect ? BLOB_COLORS.yellow : BLOB_COLORS.lavender}
              mood={isCorrect ? 'excited' : 'sad'}
              size={76}
              className="shrink-0"
            />
            <div className="min-w-0 flex-1 basis-48">
              <p className="font-display text-lg font-bold">
                {feedback.kind === 'correct' &&
                  (feedback.fast
                    ? `¡Correcto y rápido! +${config.correctPoints} +${config.fastBonus} ⚡`
                    : `¡Correcto! +${config.correctPoints}`)}
                {feedback.kind === 'wrong' && 'Ups, no era esa.'}
                {feedback.kind === 'timeout' && '⏰ ¡Se acabó el tiempo! 0 pts'}
              </p>
              <p className="mt-0.5 text-sm text-ink/75">
                💬 <T>{question.explanation}</T>
              </p>
            </div>
            <Button variant="dark" size="sm" onClick={goNext} autoFocus className="w-full shrink-0 sm:w-auto">
              {isLast ? 'Ver resultado' : 'Siguiente'} →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
