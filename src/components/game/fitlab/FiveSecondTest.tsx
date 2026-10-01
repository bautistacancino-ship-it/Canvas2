'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { FitLabEvaluation, HeroPicks } from '@/lib/fitLab';
import type { FitLabConfig, HeroSlotId } from '@/types/game';
import { HeroPreview } from './HeroPreview';

const USERS = ['👩', '🧔', '👩‍🦱', '👨‍🦰', '👩‍🦳', '🧑', '👱‍♀️', '👨', '👩‍🦰', '🧑‍🦱'];

interface FiveSecondTestProps {
  config: FitLabConfig;
  picks: HeroPicks;
  evaluation: FitLabEvaluation;
  /** Se llama cuando el test termina (para mostrar el resultado). */
  onDone: () => void;
}

/** Etapa C: usuarios simulados miran el hero 5 segundos → mapa de calor, comprensión, CTR y reacciones. */
export function FiveSecondTest({ config, picks, evaluation, onDone }: FiveSecondTestProps) {
  const [secondsLeft, setSecondsLeft] = useState(config.testSeconds);
  const running = secondsLeft > 0;
  const bounced = evaluation.outcome === 'collapse';
  const users = USERS.slice(0, config.testUsers);

  useEffect(() => {
    if (!running) {
      onDone();
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [running, onDone]);

  // Mapa de calor: los slots correctos concentran la atención; en un rebote total queda vacío.
  const heat = running
    ? undefined
    : (Object.fromEntries(
        config.slots.map((s) => [s.id, bounced ? 0 : evaluation.chosen[s.id]?.correct ? 1 : 0.2]),
      ) as Partial<Record<HeroSlotId, number>>);
  const clicks = running || bounced ? 0 : Math.round(evaluation.ctr);

  return (
    <div className="space-y-4">
      <div className="relative">
        <HeroPreview config={config} picks={picks} heat={heat} clicks={clicks} />
        <AnimatePresence>
          {running && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center rounded-[28px] bg-ink/10 backdrop-blur-[1px]"
            >
              <motion.span
                key={secondsLeft}
                initial={{ scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="grid h-28 w-28 place-items-center rounded-full bg-white font-display text-6xl font-bold text-ink shadow-float"
              >
                {secondsLeft}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Usuarios simulados */}
      <div className="flex flex-wrap justify-center gap-2">
        {users.map((u, i) => (
          <motion.span
            key={i}
            animate={
              running
                ? { y: [0, -4, 0] }
                : bounced
                  ? { opacity: 0.25, scale: 0.8 }
                  : { opacity: 1 }
            }
            transition={running ? { duration: 0.8, repeat: Infinity, delay: i * 0.08 } : { delay: i * 0.08 }}
            className="relative grid h-11 w-11 place-items-center rounded-full bg-white text-2xl shadow-soft"
          >
            {u}
            <span className="absolute -bottom-1 -right-1 text-sm">{running ? '👀' : bounced ? '✕' : i < Math.max(1, Math.round(evaluation.comprehension / 10)) ? '💡' : '❔'}</span>
          </motion.span>
        ))}
      </div>
      {!running && bounced && (
        <p className="text-center text-sm font-semibold text-pink-strong">Todos los usuarios cerraron la pestaña. El mapa de calor quedó vacío.</p>
      )}

      {!running && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Metric label="🧠 Comprensión" value={`${evaluation.comprehension}%`} good={evaluation.comprehension >= config.success.minComprehension} />
            <Metric label="🖱️ CTR del botón" value={`${evaluation.ctr.toLocaleString('es-CL')}%`} good={evaluation.ctr >= config.success.minCtr} />
            <Metric label="🎯 Slots correctos" value={`${evaluation.correctSlots}/${config.slots.length}`} good={evaluation.correctSlots === config.slots.length} />
          </div>
          <div className="space-y-2">
            {evaluation.reactions.map((r, i) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-end gap-2"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xl shadow-soft">{users[i % users.length]}</span>
                <p className="rounded-3xl rounded-bl-lg bg-white px-4 py-2 text-sm shadow-soft">{r}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Metric({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div className={`rounded-3xl p-4 ${good ? 'bg-lime' : 'bg-pink'}`}>
      <p className="text-xs font-semibold text-ink/60">{label}</p>
      <p className={`font-display text-3xl font-bold ${good ? 'text-lime-strong' : 'text-pink-strong'}`}>{value}</p>
    </div>
  );
}
