'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AnimatedNumber } from '@/components/hud/AnimatedNumber';
import { cardClass } from '@/components/ui/Card';
import type { FunnelStage, JourneyEvaluation } from '@/lib/journey';
import { formatCoins } from '@/lib/scoring';
import type { JourneyConfig } from '@/types/game';
import { T } from '@/components/glossary/Terms';

const STEP_MS = 1100;
/** Mes en que se "vive" cada fase del embudo (para mostrar los eventos en el momento justo). */
const MONTH_BY_STAGE = [1, 1, 2, 2, 3];

interface FunnelSimulationProps {
  config: JourneyConfig;
  evaluation: JourneyEvaluation;
  onDone: () => void;
  /** Mientras un tutorial está abierto, la simulación espera. */
  paused?: boolean;
}

/** Etapa C: los leads avanzan fase por fase; en las grietas y los 404 se escapan. */
export function FunnelSimulation({ config, evaluation, onDone, paused = false }: FunnelSimulationProps) {
  const stages = evaluation.funnel;
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState<1 | 2>(1);
  /** Eventos que el jugador ya leyó: cuando aparece uno nuevo, la simulación se pausa. */
  const [acknowledged, setAcknowledged] = useState(0);
  const finished = step >= stages.length;

  const month = finished ? config.simulation.months : MONTH_BY_STAGE[step] ?? 1;
  const visibleEvents = evaluation.events.filter((e) => e.month <= month);
  const pendingEvent = visibleEvents.length > acknowledged ? visibleEvents[acknowledged] : null;

  // Un paso por fase. Depende de `step` para programar el siguiente; espera en pausas y eventos.
  useEffect(() => {
    if (paused || pendingEvent) return;
    if (finished) {
      onDone();
      return;
    }
    const id = window.setTimeout(() => setStep((s) => s + 1), STEP_MS / speed);
    return () => window.clearTimeout(id);
  }, [step, finished, onDone, paused, pendingEvent, speed]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: config.simulation.months }, (_, i) => (
          <span
            key={i}
            className={`rounded-full px-3 py-1 font-display text-sm font-semibold transition ${
              i + 1 <= month ? 'bg-ink text-white' : 'bg-white text-muted ring-1 ring-line'
            }`}
          >
            Mes {i + 1}
          </span>
        ))}
        {!finished && (
          <span className="text-sm text-muted">{pendingEvent ? '⏸ Pausado: lee el evento' : paused ? '⏸ En pausa' : 'Simulando…'}</span>
        )}
        <button
          type="button"
          data-tour="funnel-speed"
          onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
          className={`ml-auto rounded-full px-3 py-1 font-display text-sm font-semibold ${speed === 2 ? 'bg-ink text-white' : 'bg-white ring-1 ring-line'}`}
        >
          ⏩ x2
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-5" data-tour="funnel">
        {stages.map((stage, i) => (
          <StageColumn key={stage.phaseId} config={config} stage={stage} index={i} active={i < step} isPost={i === stages.length - 1} evaluation={evaluation} />
        ))}
      </div>

      <div className="space-y-2" data-tour="funnel-events">
        <AnimatePresence>
          {visibleEvents.slice(0, acknowledged).map((e) => (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-3 rounded-2xl p-3 text-sm ${e.tone === 'good' ? 'bg-lime' : e.tone === 'bad' ? 'bg-pink' : 'bg-surface'}`}
            >
              <span className="text-xl">{e.icon}</span>
              <span>
                <span className="text-xs font-bold uppercase tracking-wide text-ink/50">Mes {e.month} · Evento</span>
                <span className="block font-semibold">
                  <T>{e.title}</T>
                </span>
                <span className="block text-ink/70">
                  <T>{e.impact}</T>
                </span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {pendingEvent && (
          <motion.button
            type="button"
            key={`pending-${pendingEvent.title}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setAcknowledged((a) => a + 1)}
            className="flex w-full items-start gap-3 rounded-3xl bg-white p-4 text-left text-sm shadow-float ring-2 ring-sun-strong"
          >
            <span className="text-2xl">🔔</span>
            <span className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wide text-ink/50">Mes {pendingEvent.month} · Nuevo evento</span>
              <span className="block font-display text-base font-bold">{pendingEvent.title}</span>
              <span className="block text-ink/70">{pendingEvent.impact}</span>
              <span className="mt-2 inline-block rounded-full bg-ink px-3 py-1 font-display text-xs font-semibold text-white">Continuar ▶</span>
            </span>
          </motion.button>
        )}
      </div>

      {finished && !pendingEvent && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="👥 Clientes nuevos" value={`${evaluation.clients}`} sub={`meta ${config.goalClients}`} good={evaluation.clients >= config.goalClients} />
          <Stat label="🔁 Segundo sprint" value={`${evaluation.secondSprints}`} good={evaluation.secondSprints > 0} />
          <Stat label="🗣️ Referidos" value={`${evaluation.referrals}`} good={evaluation.referrals > 0} />
          <Stat label="💰 Monedas nuevas" value={`+${formatCoins(evaluation.newCoins)}`} good={evaluation.newCoins > 0} />
        </motion.section>
      )}
    </div>
  );
}

function StageColumn({
  config,
  stage,
  index,
  active,
  isPost,
  evaluation,
}: {
  config: JourneyConfig;
  stage: FunnelStage;
  index: number;
  active: boolean;
  isPost: boolean;
  evaluation: JourneyEvaluation;
}) {
  const phase = config.phases[index];
  const leaky = stage.gap || stage.weak;
  const dots = Math.min(20, Math.ceil(stage.leads / 5));
  const escaping = leaky ? Math.min(8, Math.max(2, Math.ceil(stage.lost / 5))) : 0;

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] p-4 transition ${
        !active ? 'bg-white/50 ring-1 ring-line' : stage.gap ? 'bg-pink ring-2 ring-pink-strong' : stage.weak ? 'bg-sun ring-2 ring-sun-strong' : `${cardClass}`
      }`}
    >
      <p className="font-display font-bold">
        {phase.icon} {phase.label}
      </p>
      <p className="font-display text-4xl font-bold tabular-nums">{active ? <AnimatedNumber value={stage.leads} /> : '—'}</p>
      <p className="text-xs text-muted">
        {isPost && active ? `${evaluation.referrals} referidos · ${evaluation.secondSprints} sprints` : index === 0 ? config.simulation.leadsLabel : 'leads'}
      </p>

      {/* Partículas de luz: cada punto ≈ 5 leads */}
      <div className="mt-3 flex min-h-8 flex-wrap gap-1">
        {active &&
          Array.from({ length: dots }, (_, d) => (
            <motion.span
              key={d}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: d * 0.03 }}
              className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-[#ffd76a] to-peach-strong shadow-[0_0_8px_rgba(255,170,0,0.8)]"
            />
          ))}
      </div>

      {active && leaky && (
        <>
          <p className="mt-2 font-display text-sm font-bold text-pink-strong">{stage.gap ? '🚫 404: sin ruta' : '⚡ Grieta: carta débil'}</p>
          {Array.from({ length: escaping }, (_, d) => (
            <motion.span
              key={d}
              className="absolute bottom-6 h-2 w-2 rounded-full bg-pink-strong"
              style={{ left: `${15 + d * 10}%` }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 60, opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.3 + d * 0.15, repeat: Infinity, repeatDelay: 0.6 }}
            />
          ))}
        </>
      )}
    </section>
  );
}

function Stat({ label, value, sub, good }: { label: string; value: string; sub?: string; good: boolean }) {
  return (
    <div className={`rounded-3xl p-4 ${good ? 'bg-lime' : 'bg-pink'}`}>
      <p className="text-xs font-semibold text-ink/60">{label}</p>
      <p className={`font-display text-3xl font-bold ${good ? 'text-lime-strong' : 'text-pink-strong'}`}>{value}</p>
      {sub && <p className="text-xs text-ink/50">{sub}</p>}
    </div>
  );
}
