'use client';

import { createContext, useContext, useId, useRef, type ReactNode } from 'react';
import { findTerms, type TextSegment } from '@/lib/terms';
import { useGlossary } from './GlossaryProvider';

/* ──────────────────────────────────────────────────────────────
 * Marcado de términos: <TermScope> define qué términos se marcan
 * en una fase; <T> marca la PRIMERA aparición de cada uno dentro
 * de esa fase (el primer texto que lo "reclama" se queda con él).
 * ────────────────────────────────────────────────────────────── */

interface Scope {
  segment: (text: string, owner: string) => TextSegment[];
}

const ScopeContext = createContext<Scope | null>(null);

export function TermScope({ termIds, children }: { termIds: string[]; children: ReactNode }) {
  // termId → id del texto que lo marcó primero (estable entre renders).
  const claims = useRef(new Map<string, string>());

  const segment = (text: string, owner: string): TextSegment[] => {
    const out: TextSegment[] = [];
    const usedHere = new Set<string>();
    let cursor = 0;
    for (const hit of findTerms(text, termIds)) {
      const holder = claims.current.get(hit.termId);
      if ((holder && holder !== owner) || usedHere.has(hit.termId)) continue;
      claims.current.set(hit.termId, owner);
      usedHere.add(hit.termId);
      if (hit.start > cursor) out.push(text.slice(cursor, hit.start));
      out.push({ termId: hit.termId, text: text.slice(hit.start, hit.end) });
      cursor = hit.end;
    }
    if (cursor < text.length) out.push(text.slice(cursor));
    return out;
  };

  return <ScopeContext.Provider value={{ segment }}>{children}</ScopeContext.Provider>;
}

/** Texto de cuerpo con términos clickeables. Fuera de un TermScope, se muestra tal cual. */
export function T({ children }: { children: string }) {
  const scope = useContext(ScopeContext);
  const owner = useId();
  if (!scope) return <>{children}</>;
  return (
    <>
      {scope.segment(children, owner).map((seg, i) =>
        typeof seg === 'string' ? seg : <TermButton key={i} termId={seg.termId} text={seg.text} />,
      )}
    </>
  );
}

export function TermButton({ termId, text }: { termId: string; text: string }) {
  const glossary = useGlossary();
  return (
    <button
      type="button"
      data-term={termId}
      onClick={(e) => {
        e.stopPropagation();
        glossary?.openTerm(termId, e.currentTarget);
      }}
      onKeyDown={(e) => e.stopPropagation()}
      className="inline cursor-help rounded-md px-0.5 font-[inherit] text-inherit underline decoration-lavender-strong/70 decoration-dotted decoration-2 underline-offset-4 transition hover:bg-lavender/70 focus-visible:bg-lavender focus-visible:outline-none"
    >
      {text}
    </button>
  );
}
