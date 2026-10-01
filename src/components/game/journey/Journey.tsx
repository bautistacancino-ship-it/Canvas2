'use client';

import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { Blob } from '@/components/ui/Blob';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { evaluateJourney, toJourneyResult, type SwipeAnswers } from '@/lib/journey';
import { formatCoins } from '@/lib/scoring';
import { BLOB_COLORS } from '@/lib/tones';
import type { ActivityResult, JourneyConfig } from '@/types/game';
import { ActivityOutcomeCard } from '../shared/ActivityOutcomeCard';
import { FunnelSimulation } from './FunnelSimulation';
import { JourneyBoard } from './JourneyBoard';
import { SwipeDeck } from './SwipeDeck';

type Stage = 'intro' | 'swipe' | 'board' | 'sim';

const STAGES: { id: Exclude<Stage, 'intro'>; label: string }[] = [
  { id: 'swipe', label: 'A · Swipe de canales' },
  { id: 'board', label: 'B · Journey Board' },
  { id: 'sim', label: 'C · Simulación del embudo' },
];

/** Fase 3 · Journey Board: swipe → tablero con recursos limitados → simulación de 3 meses. */
export function Journey({ config, onComplete }: { config: JourneyConfig; onComplete: (result: ActivityResult) => void }) {
  const [stage, setStage] = useState<Stage>('intro');
  const [round, setRound] = useState(0);
  const [swipes, setSwipes] = useState<SwipeAnswers>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [simDone, setSimDone] = useState(false);

  const evaluation = useMemo(() => evaluateJourney(config, swipes, placed), [config, swipes, placed]);
  const onSimDone = useCallback(() => setSimDone(true), []);

  const reset = () => {
    setSwipes({});
    setPlaced([]);
    setSimDone(false);
    setStage('swipe');
    setRound((r) => r + 1);
  };

  if (stage === 'intro') {
    return (
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${cardClass} mx-auto max-w-xl overflow-hidden`}>
        <div className="relative h-40 bg-linear-to-b from-peach via-sun to-white">
          <Blob color={BLOB_COLORS.sky} mood="excited" size={92} className="absolute bottom-0 left-6" />
          <Blob color={BLOB_COLORS.pink} mood="happy" size={66} delay={0.4} className="absolute right-10 top-5" />
          <span className="absolute bottom-6 right-16 rounded-full bg-white px-3 py-1 font-display text-sm font-bold shadow-soft">
            🎯 Meta: {config.goalClients} clientes
          </span>
        </div>
        <div className="p-6 text-center">
          <h3 className="font-display text-2xl font-bold">{config.title}</h3>
          <p className="mt-2 text-ink/75">&ldquo;{config.premise}&rdquo;</p>
          <ol className="mt-4 grid gap-2 text-left text-sm sm:grid-cols-3">
            {[
              ['👆', 'Swipe', `${config.swipeCards.length} cartas: ¿sirven para tu segmento?`],
              ['🗺️', 'Journey Board', `${formatCoins(config.resources.coins)} monedas y ${config.resources.hours} horas al mes.`],
              ['📊', 'Simulación', `${config.simulation.months} meses de leads en tu embudo.`],
            ].map(([icon, title, body]) => (
              <li key={title} className="rounded-2xl bg-surface p-3">
                <p className="font-display font-semibold">
                  {icon} {title}
                </p>
                <p className="text-xs text-muted">{body}</p>
              </li>
            ))}
          </ol>
          <Button variant="gradient" size="lg" className="mt-6 w-full" onClick={() => setStage('swipe')}>
            Diseñar el recorrido 🛣️
          </Button>
        </div>
      </motion.section>
    );
  }

  const stageIndex = STAGES.findIndex((s) => s.id === stage);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STAGES.map((s, i) => (
          <span
            key={s.id}
            className={`rounded-full px-4 py-1.5 font-display text-sm font-semibold ${
              s.id === stage ? 'bg-ink text-white' : i < stageIndex ? 'bg-lime text-lime-strong' : 'bg-white text-muted ring-1 ring-line'
            }`}
          >
            {i < stageIndex ? '✓ ' : ''}
            {s.label}
          </span>
        ))}
      </div>

      <div key={round}>
        {stage === 'swipe' && (
          <SwipeDeck
            cards={config.swipeCards}
            answers={swipes}
            pointsPerSwipe={config.rewards.perSwipe}
            onSwipe={(id, fits) => setSwipes((s) => ({ ...s, [id]: fits }))}
            onDone={() => setStage('board')}
          />
        )}
        {stage === 'board' && (
          <JourneyBoard
            config={config}
            swipes={swipes}
            placed={placed}
            evaluation={evaluation}
            onToggle={(id) => setPlaced((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
            onLaunch={() => setStage('sim')}
          />
        )}
        {stage === 'sim' && (
          <div className="space-y-5">
            <FunnelSimulation config={config} evaluation={evaluation} onDone={onSimDone} />
            {simDone && (
              <ActivityOutcomeCard
                outcome={evaluation.outcome}
                copy={{
                  totalTitle: '¡User flow sin un solo 404!',
                  totalBody: `${evaluation.clients} clientes nuevos, las 5 fases cubiertas con buenas cartas y al menos 2 canales de conocimiento.`,
                  partialTitle: `${evaluation.clients} clientes nuevos`,
                  partialBody: `Para el éxito total necesitas ${config.success.minClients}+ clientes, cartas buenas en las 5 fases (sin PDF por WhatsApp ni WhatsApp a toda hora), recursos que alcancen y ${config.success.minAwarenessChannels}+ canales de conocimiento.`,
                  collapseLabel: '🚫 Error 404',
                  collapseTitle: 'Tus leads se perdieron en el camino',
                }}
                stats={[
                  { label: '👥 Clientes nuevos', value: String(evaluation.clients) },
                  { label: '🚫 Fases en 404', value: String(evaluation.gaps.length) },
                  { label: '⏱️ Horas restantes', value: String(evaluation.hoursLeft) },
                  { label: '💰 Monedas restantes', value: formatCoins(evaluation.coinsLeft) },
                ]}
                breakdown={evaluation.breakdown}
                points={evaluation.points}
                badges={evaluation.badges}
                meterImpact={evaluation.meterImpact}
                hint={config.collapse.hint}
                onRetry={reset}
                onContinue={() => onComplete(toJourneyResult(evaluation))}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
