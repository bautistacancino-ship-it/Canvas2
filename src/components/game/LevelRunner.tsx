'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Blob, LoadingBlob } from '@/components/ui/Blob';
import { ButtonLink } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { getBlockMeta } from '@/data/canvasBlocks';
import { getLevel } from '@/data/levels';
import { BLOB_COLORS } from '@/lib/tones';
import { selectBlockPhase, useGameStore, useHasHydrated } from '@/store/useGameStore';
import type { CanvasBlockId, CanvasEntry } from '@/types/game';
import { CanvasBlockForm } from './build/CanvasBlockForm';
import { FormulaBuilder } from './build/FormulaBuilder';
import { FitLab } from './fitlab/FitLab';
import { MediaQueryBuilder } from './build/MediaQueryBuilder';
import { LevelComplete } from './LevelComplete';
import { PhaseStepper } from './PhaseStepper';
import { QuizPhase } from './quiz/QuizPhase';
import { InboxSimulator } from './simulation/InboxSimulator';
import { TheoryModule } from './theory/TheoryModule';

const PHASE_KICKERS = {
  theory: 'Fase 1 · Teoría',
  quiz: 'Fase 2 · Quiz',
  simulation: 'Fase 3 · Actividad práctica',
  build: 'Fase 4 · Construcción',
} as const;

/**
 * Orquestador del Core Loop: lee la fase actual del bloque desde el store
 * y monta el componente correspondiente. Cada fase avisa al terminar y
 * el runner persiste el avance.
 */
export function LevelRunner({ blockId }: { blockId: CanvasBlockId }) {
  const hydrated = useHasHydrated();
  const profile = useGameStore((s) => s.profile);
  const phase = useGameStore(selectBlockPhase(blockId));
  const savedEntry = useGameStore((s) => s.canvas[blockId]);
  const blockProgress = useGameStore((s) => s.progress[blockId]);
  const badges = useGameStore((s) => s.badges);
  const completedCount = useGameStore((s) => Object.values(s.progress).filter((p) => p?.phase === 'done').length);
  const canvas = useGameStore((s) => s.canvas);
  const { setPhase, completeQuiz, completeActivity, saveCanvasDraft, completeLevel } = useGameStore.getState();

  if (!hydrated) return <LoadingBlob label="Cargando partida…" />;

  if (!profile) return <Notice title="Primero elige tu Core Business" actionHref="/" actionLabel="Ir al inicio" />;

  const meta = getBlockMeta(blockId);
  const level = getLevel(profile.businessId, blockId);

  if (!level) {
    return (
      <Notice
        title={`${meta.title}: próximamente`}
        body="Este nivel aún no tiene contenido para tu Core Business. ¡Estamos dibujándolo!"
        actionHref="/"
        actionLabel="Volver al mapa"
      />
    );
  }

  if (phase === 'done') {
    return (
      <LevelComplete
        title={meta.title}
        progress={blockProgress}
        completedCount={completedCount}
        badges={badges}
        onEdit={() => setPhase(blockId, 'build')}
      />
    );
  }

  const heading = { kicker: PHASE_KICKERS[phase], title: level[phase].title };

  const buildProps = {
    blockTitle: meta.title,
    blockIcon: meta.icon,
    tone: meta.tone,
    initialValues: savedEntry,
    onDraft: (values: CanvasEntry) => saveCanvasDraft(blockId, values),
    onSubmit: (values: CanvasEntry) => completeLevel(blockId, values),
  };
  const build = level.build;
  const referenceBlock = build.kind === 'value-formula' ? build.reference?.blockId : undefined;
  const renderBuild = () =>
    build.kind === 'media-query' ? (
      <MediaQueryBuilder {...buildProps} config={build} />
    ) : build.kind === 'value-formula' ? (
      <FormulaBuilder
        {...buildProps}
        config={build}
        reference={
          referenceBlock
            ? { build: getLevel(profile.businessId, referenceBlock)?.build, entry: canvas[referenceBlock] }
            : undefined
        }
      />
    ) : (
      <CanvasBlockForm {...buildProps} config={build} />
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className={`${cardClass} mb-4 flex items-center gap-4 p-4`}>
        <IconTile icon={meta.icon} tone={meta.tone} size="lg" />
        <div className="min-w-0">
          <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-muted">Nivel {meta.order}</span>
          <h1 className="mt-1 truncate font-display text-2xl font-bold sm:text-3xl">{level.title}</h1>
          <p className="truncate text-sm text-muted">{level.subtitle}</p>
        </div>
      </div>

      <PhaseStepper current={phase} />

      <AnimatePresence mode="wait">
        <motion.section
          key={phase}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          <p className="px-1 text-xs font-bold uppercase tracking-widest text-lavender-strong">{heading.kicker}</p>
          <h2 className="mb-6 px-1 font-display text-2xl font-bold sm:text-3xl">{heading.title}</h2>

          {phase === 'theory' && <TheoryModule config={level.theory} onComplete={() => setPhase(blockId, 'quiz')} />}

          {phase === 'quiz' && (
            <QuizPhase
              config={level.quiz}
              cards={level.theory.cards}
              onPass={(result, badges) => completeQuiz(blockId, result, badges)}
            />
          )}

          {phase === 'simulation' && (
            (level.simulation.kind === 'inbox' ? (
              <InboxSimulator config={level.simulation} onComplete={(result) => completeActivity(blockId, result)} />
            ) : (
              <FitLab config={level.simulation} onComplete={(result) => completeActivity(blockId, result)} />
            ))
          )}

          {phase === 'build' && renderBuild()}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}

function Notice({ title, body, actionHref, actionLabel }: { title: string; body?: string; actionHref: string; actionLabel: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className={`${cardClass} p-8 text-center`}>
        <div className="flex justify-center">
          <Blob color={BLOB_COLORS.lavender} mood="thinking" size={110} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold">{title}</h1>
        {body && <p className="mt-2 text-muted">{body}</p>}
        <ButtonLink href={actionHref} variant="dark" className="mt-6">
          {actionLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
