'use client';

import { motion } from 'framer-motion';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { STEP_ANCHORS, type Tutorial } from '@/data/tutorials';
import { PRACTICES } from './practices';

/** **negrita** y *cursiva* simples para los textos del documento. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('**') ? (
          <b key={i}>{part.slice(2, -2)}</b>
        ) : part.startsWith('*') && part.length > 2 ? (
          <i key={i}>{part.slice(1, -1)}</i>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Primer elemento VISIBLE con ese anclaje (hay anclajes duplicados entre escritorio y móvil). */
function findAnchor(name: string | null | undefined): HTMLElement | null {
  if (!name) return null;
  const selector = name === 'term' ? '[data-term]' : `[data-tour="${name}"]`;
  return [...document.querySelectorAll<HTMLElement>(selector)].find((el) => el.getBoundingClientRect().width > 0) ?? null;
}

const PAD = 8;
const BUBBLE_W = 360;

interface TutorialOverlayProps {
  tutorial: Tutorial;
  /** `practiced`: el jugador completó la práctica (o no había). */
  onFinish: (how: 'completed' | 'skipped') => void;
}

/** Capa semitransparente sobre la pantalla real: cada paso resalta su elemento y muestra un globo. */
export function TutorialOverlay({ tutorial, onFinish }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const total = tutorial.pasos.length;
  const Practice = PRACTICES[tutorial.mecanica];
  const inPractice = step >= total;
  const anchorName = inPractice ? null : STEP_ANCHORS[tutorial.mecanica]?.[step];

  // Mide el elemento resaltado (y lo sigue si la página se mueve).
  useLayoutEffect(() => {
    const el = findAnchor(anchorName);
    if (!el) {
      setRect(null);
      return;
    }
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    let frame = 0;
    const measure = () => {
      setRect(el.getBoundingClientRect());
      frame = requestAnimationFrame(measure);
    };
    measure();
    const stop = window.setTimeout(() => cancelAnimationFrame(frame), 900);
    const onMove = () => setRect(el.getBoundingClientRect());
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(stop);
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [anchorName]);

  useEffect(() => {
    bubbleRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onFinish('skipped');
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, onFinish]);

  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else if (Practice || tutorial.mecanica === 'terminos') setStep(total);
    else onFinish('completed');
  };

  // Posición del globo: debajo del elemento si cabe, si no arriba; sin elemento, centrado.
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
  const width = Math.min(inPractice ? 440 : BUBBLE_W, vw - 24);
  const centered = !rect || inPractice;
  let bubbleStyle: React.CSSProperties = { width };
  if (!centered && rect) {
    const below = rect.bottom + PAD + 230 < vh;
    bubbleStyle = {
      width,
      left: Math.min(Math.max(12, rect.left + rect.width / 2 - width / 2), vw - width - 12),
      ...(below ? { top: rect.bottom + PAD + 12 } : { bottom: Math.max(12, vh - rect.top + PAD + 12) }),
    };
  }

  return createPortal(
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={tutorial.titulo}>
      {/* Fondo: con foco recortado alrededor del elemento, o atenuado completo */}
      {rect && !inPractice ? (
        <motion.div
          className="pointer-events-none fixed rounded-2xl ring-4 ring-sun-strong"
          animate={{ top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          style={{ boxShadow: '0 0 0 9999px rgba(27, 22, 54, 0.55)' }}
        />
      ) : (
        <div className="fixed inset-0 bg-ink/55" />
      )}

      <div className={centered ? 'pointer-events-none fixed inset-0 grid place-items-center p-3' : ''}>
        <motion.div
          key={step}
          ref={bubbleRef}
          tabIndex={-1}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={bubbleStyle}
          className={`${centered ? 'pointer-events-auto relative' : 'fixed'} max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-5 shadow-float focus:outline-none`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-lavender px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-lavender-strong">
              {tutorial.tipo === 'express' ? '⚡ Tutorial express' : '🎓 Mini tutorial'}
            </span>
            <button type="button" onClick={() => onFinish('skipped')} className="text-xs font-semibold text-muted underline hover:text-ink">
              Saltar tutorial
            </button>
          </div>
          <p className="mt-2 font-display text-lg font-bold leading-tight">{tutorial.titulo.replace(/^Mini Tutorial( Express)? · /, '')}</p>

          {!inPractice ? (
            <>
              {tutorial.ya_conocido && step === 0 && (
                <p className="mt-2 rounded-2xl bg-sky p-2.5 text-xs">✅ {tutorial.ya_conocido}</p>
              )}
              <p className="mt-3 text-[15px] leading-relaxed">
                <Rich text={tutorial.pasos[step]} />
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="flex gap-1">
                  {tutorial.pasos.map((_, i) => (
                    <span key={i} className={`h-1.5 w-5 rounded-full ${i <= step ? 'bg-lavender-strong' : 'bg-line'}`} />
                  ))}
                </span>
                <Button variant="gradient" size="sm" onClick={next} autoFocus>
                  {step < total - 1 ? 'Siguiente →' : Practice ? 'Práctica guiada →' : tutorial.mecanica === 'terminos' ? 'Probar ahora 👆' : '¡Entendido!'}
                </Button>
              </div>
            </>
          ) : tutorial.mecanica === 'terminos' ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm">
                <Rich text={`Práctica: ${tutorial.practica_guiada ?? ''}`} />
              </p>
              <Button variant="gradient" className="w-full" onClick={() => onFinish('completed')}>
                Ir a la primera palabra 👆
              </Button>
            </div>
          ) : Practice ? (
            <div className="mt-3">
              <p className="mb-3 text-xs font-semibold text-muted">🧪 Práctica guiada · no suma ni resta puntos</p>
              <Practice onDone={() => onFinish('completed')} />
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>,
    document.body,
  );
}
