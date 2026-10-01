'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { TUTORIALS, type MechanicId } from '@/data/tutorials';
import { useGameStore } from '@/store/useGameStore';
import { TutorialOverlay } from './TutorialOverlay';

/** Resalta la primera palabra clickeable (práctica guiada del tutorial de términos). */
function coachFirstTerm() {
  const el = [...document.querySelectorAll<HTMLElement>('[data-term]')].find((x) => x.getBoundingClientRect().width > 0);
  if (!el) return;
  el.classList.add('term-coach');
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

interface TutorialGateProps {
  mechanic: MechanicId;
  /** `paused` es true mientras el tutorial está abierto (para detener relojes y simulaciones). */
  children: (paused: boolean) => ReactNode;
}

/**
 * Muestra el tutorial de una mecánica la PRIMERA vez que el jugador se la encuentra
 * (según `mechanicsSeen`, sin importar el bloque) y deja el botón ❓ para repetirlo.
 */
export function TutorialGate({ mechanic, children }: TutorialGateProps) {
  const markSeen = useGameStore((s) => s.markMechanicSeen);
  const [open, setOpen] = useState(() => !useGameStore.getState().mechanicsSeen.includes(mechanic));

  const finish = useCallback(
    (how: 'completed' | 'skipped') => {
      markSeen(mechanic);
      setOpen(false);
      if (mechanic === 'terminos' && how === 'completed') setTimeout(coachFirstTerm, 50);
    },
    [markSeen, mechanic],
  );

  return (
    <>
      {children(open)}
      {open && <TutorialOverlay tutorial={TUTORIALS[mechanic]} onFinish={finish} />}
      {!open &&
        typeof document !== 'undefined' &&
        createPortal(
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Ver tutorial: ${TUTORIALS[mechanic].titulo}`}
            title="Ver el tutorial de esta mecánica"
            className="fixed bottom-28 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-white font-display text-xl font-bold shadow-float ring-1 ring-ink/10 hover:bg-lavender lg:bottom-6"
          >
            ❓
          </button>,
          document.body,
        )}
    </>
  );
}
