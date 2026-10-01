'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { TheoryConfig } from '@/types/game';
import { ConceptCard } from './ConceptCard';
import { FitMapStep } from './FitMapStep';
import { FlipCards } from './FlipCards';
import { FormulaStep } from './FormulaStep';
import { NoviceVsPro } from './NoviceVsPro';

type Step = 'concept' | 'fit' | 'cards' | 'formula' | 'compare';

/** Fase 1 por pasos: concepto → (encaje) → tarjetas → (fórmula) → novato vs. profesional. */
export function TheoryModule({ config, onComplete }: { config: TheoryConfig; onComplete: () => void }) {
  const steps: { id: Step; label: string }[] = [
    { id: 'concept', label: 'Concepto' },
    ...(config.fitMap ? [{ id: 'fit' as const, label: 'El Encaje' }] : []),
    { id: 'cards', label: `${config.cards.length} tipos` },
    ...(config.formula ? [{ id: 'formula' as const, label: 'La fórmula' }] : []),
    ...(config.comparison?.length ? [{ id: 'compare' as const, label: 'Novato vs. Pro' }] : []),
  ];
  const [step, setStep] = useState<Step>('concept');
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [showPro, setShowPro] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [fitRevealed, setFitRevealed] = useState<Set<number>>(new Set());

  const stepIndex = steps.findIndex((s) => s.id === step);
  const isLast = stepIndex === steps.length - 1;
  const canAdvance =
    step === 'concept' ||
    step === 'formula' ||
    (step === 'fit' && fitRevealed.size === (config.fitMap?.rows.length ?? 0)) ||
    (step === 'cards' && seen.size === config.cards.length) ||
    (step === 'compare' && revealed.size === (config.comparison?.length ?? 0));

  const next = () => (isLast ? onComplete() : setStep(steps[stepIndex + 1].id));

  const hint =
    step === 'fit'
      ? `Conecta cada fila (${fitRevealed.size}/${config.fitMap?.rows.length ?? 0})`
      : step === 'cards'
      ? `Toca cada tarjeta para ver el ejemplo (${seen.size}/${config.cards.length})`
      : step === 'compare'
        ? `Activa cada interruptor (${revealed.size}/${config.comparison?.length ?? 0})`
        : '';

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            disabled={i > stepIndex}
            onClick={() => setStep(s.id)}
            className={`rounded-full px-4 py-1.5 font-display text-sm font-semibold transition ${
              s.id === step
                ? 'bg-ink text-white'
                : i < stepIndex
                  ? 'bg-lime text-lime-strong'
                  : 'bg-white text-muted ring-1 ring-line'
            }`}
          >
            {i < stepIndex ? '✓ ' : `${i + 1}. `}
            {s.label}
          </button>
        ))}
        {hint && <span className="ml-auto text-sm text-muted">{hint}</span>}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
          {step === 'concept' && <ConceptCard concept={config.concept} />}
          {step === 'fit' && config.fitMap && (
            <FitMapStep
              fitMap={config.fitMap}
              revealed={fitRevealed}
              onReveal={(i) => setFitRevealed((prev) => new Set(prev).add(i))}
            />
          )}
          {step === 'formula' && config.formula && <FormulaStep formula={config.formula} />}
          {step === 'cards' && (
            <FlipCards cards={config.cards} seen={seen} onSeen={(id) => setSeen((prev) => new Set(prev).add(id))} />
          )}
          {step === 'compare' && config.comparison && (
            <NoviceVsPro
              rows={config.comparison}
              showPro={showPro}
              revealed={revealed}
              onToggle={(i, value) => {
                setShowPro((prev) => {
                  const nextSet = new Set(prev);
                  if (value) nextSet.add(i);
                  else nextSet.delete(i);
                  return nextSet;
                });
                if (value) setRevealed((prev) => new Set(prev).add(i));
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-end">
        <Button variant="gradient" size="lg" disabled={!canAdvance} onClick={next}>
          {isLast ? '¡Listo! Ir al quiz ⚡' : 'Siguiente →'}
        </Button>
      </div>
    </div>
  );
}
