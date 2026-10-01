'use client';

import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { MeterGauge } from '@/components/hud/MeterGauge';
import { Blob } from '@/components/ui/Blob';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { EMPTY_MAP, evaluateFitLab, toFitLabResult, type FitMapState, type HeroPicks } from '@/lib/fitLab';
import { formatCoins } from '@/lib/scoring';
import { BLOB_COLORS } from '@/lib/tones';
import type { ActivityResult, FitLabConfig } from '@/types/game';
import { ActivityOutcomeCard } from '../shared/ActivityOutcomeCard';
import { FitMap } from './FitMap';
import { FiveSecondTest } from './FiveSecondTest';
import { HeroBuilder } from './HeroBuilder';
import { T } from '@/components/glossary/Terms';
import { TutorialGate } from '@/components/tutorial/TutorialGate';

type Stage = 'intro' | 'map' | 'hero' | 'test';

const STAGES: { id: Exclude<Stage, 'intro'>; label: string }[] = [
  { id: 'map', label: 'A · Mapa de Fit' },
  { id: 'hero', label: 'B · Hero Builder' },
  { id: 'test', label: 'C · Test de 5 s' },
];

interface FitLabProps {
  config: FitLabConfig;
  onComplete: (result: ActivityResult) => void;
}

/** Fase 3 · Fit Lab: Mapa de Fit → Hero Builder → Test de 5 segundos. */
export function FitLab({ config, onComplete }: FitLabProps) {
  const [stage, setStage] = useState<Stage>('intro');
  const [round, setRound] = useState(0);
  const [map, setMap] = useState<FitMapState>(EMPTY_MAP);
  const [hero, setHero] = useState<HeroPicks>({});
  const [testDone, setTestDone] = useState(false);

  const evaluation = useMemo(() => evaluateFitLab(config, map, hero), [config, map, hero]);
  const onTestDone = useCallback(() => setTestDone(true), []);

  const reset = () => {
    setMap(EMPTY_MAP);
    setHero({});
    setTestDone(false);
    setStage('map');
    setRound((r) => r + 1);
  };

  if (stage === 'intro') {
    return (
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${cardClass} mx-auto max-w-xl overflow-hidden`}>
        <div className="relative h-40 bg-linear-to-b from-lime via-sky to-white">
          <Blob color={BLOB_COLORS.yellow} mood="excited" size={96} className="absolute bottom-0 left-6" />
          <Blob color={BLOB_COLORS.lavender} mood="happy" size={70} delay={0.4} className="absolute right-8 top-6" />
          <span className="absolute bottom-6 right-20 rounded-full bg-white px-3 py-1 font-display text-sm font-bold shadow-soft">🧪 Fit Lab</span>
        </div>
        <div className="p-6 text-center">
          <h3 className="font-display text-2xl font-bold">{config.title}</h3>
          <p className="mt-2 text-ink/75">
            &ldquo;<T>{config.premise}</T>&rdquo;
          </p>
          <ol className="mt-4 grid gap-2 text-left text-sm sm:grid-cols-3">
            {[
              ['🧲', 'Mapa de Fit', 'Conecta necesidades con servicios. Las trampas, a la papelera.'],
              ['🖼️', 'Hero Builder', 'Solo 5 slots above the fold.'],
              ['⏱️', 'Test de 5 s', '10 usuarios ven tu hero. ¿Lo entienden?'],
            ].map(([icon, title, body]) => (
              <li key={title} className="rounded-2xl bg-surface p-3">
                <p className="font-display font-semibold">
                  {icon} {title}
                </p>
                <p className="text-xs text-muted">{body}</p>
              </li>
            ))}
          </ol>
          <Button variant="gradient" size="lg" className="mt-6 w-full" onClick={() => setStage('map')}>
            Entrar al Fit Lab 🧪
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

      <section className={`${cardClass} grid grid-cols-2 gap-x-5 gap-y-3 p-4 md:grid-cols-3`}>
        <MeterGauge label="Fit" icon="🧲" value={evaluation.fitPct} format={(v) => `${v}%`} />
        <MeterGauge label="Horas del equipo" icon="⏱️" value={evaluation.hours} max={config.initial.hours} />
        <MeterGauge
          label="Presupuesto"
          icon="💰"
          value={stage === 'test' && testDone ? evaluation.budget : config.initial.budget}
          max={config.initial.budget}
          format={formatCoins}
        />
      </section>

      <div key={round}>
        {stage === 'map' && (
          <TutorialGate mechanic="nodos">
            {() => <FitMap config={config} state={map} onChange={setMap} onContinue={() => setStage('hero')} />}
          </TutorialGate>
        )}
        {stage === 'hero' && (
          <TutorialGate mechanic="arrastrar">
            {() => (
              <HeroBuilder
                config={config}
                picks={hero}
                onPick={(slot, optionId) => setHero((h) => ({ ...h, [slot]: optionId }))}
                onPublish={() => setStage('test')}
              />
            )}
          </TutorialGate>
        )}
        {stage === 'test' && (
          <div className="space-y-5">
            <TutorialGate mechanic="test5">
              {(paused) => <FiveSecondTest config={config} picks={hero} evaluation={evaluation} paused={paused} onDone={onTestDone} />}
            </TutorialGate>
            {testDone && (
              <ActivityOutcomeCard
                outcome={evaluation.outcome}
                copy={{
                  totalTitle: '¡Hero pixel perfect!',
                  totalBody: 'Fit completo, trampas descartadas y un above the fold que se entiende en 5 segundos.',
                  partialTitle: `Fit ${evaluation.fitPct}% · ${evaluation.correctSlots}/${config.slots.length} slots`,
                  partialBody:
                    'Para el éxito total necesitas las 7 conexiones, las 4 trampas en la papelera y los 5 slots correctos (comprensión ≥ 80% y CTR ≥ 4%).',
                  collapseLabel: '💀 Rebote total',
                  collapseTitle: 'Todos cerraron la pestaña 🫥',
                }}
                stats={[
                  { label: '🧠 Comprensión', value: `${evaluation.comprehension}%` },
                  { label: '🖱️ CTR', value: `${evaluation.ctr.toLocaleString('es-CL')}%` },
                  { label: '🧲 Fit', value: `${evaluation.fitPct}%` },
                  { label: '🪤 Trampas conectadas', value: String(evaluation.trapsConnected) },
                ]}
                breakdown={evaluation.breakdown}
                points={evaluation.points}
                badges={evaluation.badges}
                meterImpact={evaluation.meterImpact}
                hint={config.collapse.hint}
                onRetry={reset}
                onContinue={() => onComplete(toFitLabResult(evaluation))}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
