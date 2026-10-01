'use client';

import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { TYPE_ICON, getTerm, type GlossaryTerm } from '@/data/glossary';
import { TERM_POINTS, useGameStore } from '@/store/useGameStore';

interface GlossaryContextValue {
  openTerm: (termId: string, anchor: HTMLElement) => void;
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null);
export const useGlossary = () => useContext(GlossaryContext);

/** Quita el resaltado de "práctica guiada" del tutorial de términos. */
export const clearTermCoach = () => document.querySelectorAll('.term-coach').forEach((el) => el.classList.remove('term-coach'));

const MOBILE_QUERY = '(max-width: 639px)';

/** Ficha de términos global: tarjeta flotante en escritorio, hoja inferior en móvil. */
export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<{ term: GlossaryTerm; anchor: HTMLElement; isNew: boolean } | null>(null);
  const unlockTerm = useGameStore((s) => s.unlockTerm);
  const hasProfile = useGameStore((s) => Boolean(s.profile));

  const openTerm = useCallback(
    (termId: string, anchor: HTMLElement) => {
      const term = getTerm(termId);
      if (!term) return;
      const isNew = hasProfile && !useGameStore.getState().terms.includes(termId);
      if (hasProfile) unlockTerm(termId);
      clearTermCoach();
      setOpen({ term, anchor, isNew });
    },
    [hasProfile, unlockTerm],
  );

  const close = useCallback(() => {
    setOpen((current) => {
      current?.anchor.focus({ preventScroll: true });
      return null;
    });
  }, []);

  return (
    <GlossaryContext.Provider value={{ openTerm }}>
      {children}
      <AnimatePresence>{open && <TermCard key={open.term.id} term={open.term} anchor={open.anchor} isNew={open.isNew} onClose={close} />}</AnimatePresence>
    </GlossaryContext.Provider>
  );
}

function TermCard({ term, anchor, isNew, onClose }: { term: GlossaryTerm; anchor: HTMLElement; isNew: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Posición junto a la palabra (escritorio), recalculada al hacer scroll o cambiar el tamaño.
  useLayoutEffect(() => {
    const place = () => {
      setMobile(window.matchMedia(MOBILE_QUERY).matches);
      const r = anchor.getBoundingClientRect();
      const card = ref.current?.getBoundingClientRect();
      const w = card?.width ?? 340;
      const h = card?.height ?? 220;
      const below = r.bottom + 10 + h < window.innerHeight;
      setPos({
        top: below ? r.bottom + 10 : Math.max(10, r.top - h - 10),
        left: Math.min(Math.max(10, r.left + r.width / 2 - w / 2), window.innerWidth - w - 10),
      });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [anchor]);

  // Foco al abrir; cierre con Esc o clic fuera.
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node) && !anchor.contains(e.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [anchor, onClose]);

  const speak = () => {
    const u = new SpeechSynthesisUtterance(term.termino);
    u.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };
  const canSpeak = term.tipo === 'Inglés' && typeof window !== 'undefined' && 'speechSynthesis' in window;

  const content = (
    <>
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lavender text-2xl">{TYPE_ICON[term.tipo]}</span>
        <div className="min-w-0 flex-1">
          <p id={`term-${term.id}`} className="font-display text-xl font-bold leading-tight">
            {term.termino}
          </p>
          <p className="text-xs font-semibold text-muted">
            {term.tipo}
            {term.traduccion && <span className="text-ink/70"> · {term.traduccion}</span>}
          </p>
        </div>
        {canSpeak && (
          <button type="button" onClick={speak} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface hover:bg-lavender" aria-label={`Escuchar ${term.termino}`}>
            🔊
          </button>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed">{term.definicion}</p>
      <p className="mt-2 rounded-2xl bg-surface p-3 text-sm">💡 Ejemplo: {term.ejemplo}</p>
      {isNew && (
        <p className="mt-2 text-xs font-bold text-lime-strong">
          📖 Nuevo en tu Diccionario · +{TERM_POINTS} Puntos de Conocimiento
        </p>
      )}
    </>
  );

  if (mobile) {
    return (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-ink/30" />
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`term-${term.id}`}
          tabIndex={-1}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_: unknown, info: PanInfo) => info.offset.y > 80 && onClose()}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          className="fixed inset-x-0 bottom-0 z-[61] max-h-[40vh] overflow-y-auto rounded-t-[28px] bg-white p-5 pt-3 shadow-float focus:outline-none"
        >
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-line" aria-hidden />
          {content}
        </motion.div>
      </>
    );
  }

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-labelledby={`term-${term.id}`}
      tabIndex={-1}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
      className="fixed z-[61] w-[340px] rounded-3xl bg-white p-4 shadow-float ring-1 ring-ink/10 focus:outline-none"
    >
      {content}
    </motion.div>
  );
}
