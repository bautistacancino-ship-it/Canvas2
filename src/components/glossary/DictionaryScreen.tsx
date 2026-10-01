'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { BadgeChip } from '@/components/ui/BadgeChip';
import { LoadingBlob } from '@/components/ui/Blob';
import { ButtonLink } from '@/components/ui/Button';
import { GLOSSARY, TYPE_ICON, type TermType } from '@/data/glossary';
import { TERM_POINTS, useGameStore, useHasHydrated } from '@/store/useGameStore';
import type { BadgeId } from '@/types/game';
import { useGlossary } from './GlossaryProvider';

const TYPES: (TermType | 'Todos')[] = ['Todos', 'Inglés', 'Concepto Canvas', 'Métrica', 'Herramienta'];
const DICTIONARY_BADGES: BadgeId[] = ['primeras-palabras', 'bilingue-digital', 'diccionario-completo'];

/** 📖 Diccionario: todos los términos; los desbloqueados a color, los pendientes en gris con candado. */
export function DictionaryScreen() {
  const hydrated = useHasHydrated();
  const profile = useGameStore((s) => s.profile);
  const unlocked = useGameStore((s) => s.terms);
  const badges = useGameStore((s) => s.badges);
  const glossary = useGlossary();
  const [filter, setFilter] = useState<(typeof TYPES)[number]>('Todos');

  if (!hydrated) return <LoadingBlob label="Abriendo el Diccionario…" />;
  if (!profile) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted">Empieza una partida para coleccionar términos.</p>
        <ButtonLink href="/" variant="dark" className="mt-4">
          Ir al inicio
        </ButtonLink>
      </div>
    );
  }

  const terms = [...GLOSSARY]
    .filter((t) => filter === 'Todos' || t.tipo === filter)
    .sort((a, b) => a.termino.localeCompare(b.termino, 'es'));
  const pct = Math.round((unlocked.length / GLOSSARY.length) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            📖 Diccionario<span className="text-pink-strong">.</span>
          </h1>
          <p className="mt-1 text-muted">
            Toca las palabras con subrayado punteado mientras juegas. Cada término nuevo suma +{TERM_POINTS} Puntos de Conocimiento.
          </p>
        </div>
        <div className="min-w-48 rounded-3xl bg-white p-4 shadow-soft ring-1 ring-ink/5">
          <p className="font-display text-2xl font-bold">
            {unlocked.length}/{GLOSSARY.length}
          </p>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full rounded-full bg-linear-to-r from-sky-strong to-lavender-strong" initial={{ width: 0 }} animate={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {DICTIONARY_BADGES.map((id) => (
          <BadgeChip key={id} id={id} locked={!badges.includes(id)} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-1 rounded-full bg-white p-1 shadow-soft ring-1 ring-ink/5 sm:w-fit">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`rounded-full px-3 py-1.5 font-display text-sm font-semibold transition ${
              filter === t ? 'bg-ink text-white' : 'text-muted hover:text-ink'
            }`}
          >
            {t === 'Todos' ? '🗂️' : TYPE_ICON[t]} {t}
          </button>
        ))}
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {terms.map((term, i) => {
          const isUnlocked = unlocked.includes(term.id);
          return (
            <motion.li key={term.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.015, 0.4) }}>
              <button
                type="button"
                disabled={!isUnlocked}
                onClick={(e) => glossary?.openTerm(term.id, e.currentTarget)}
                className={`flex h-full w-full flex-col rounded-3xl p-3 text-left transition ${
                  isUnlocked ? 'bg-white shadow-soft ring-1 ring-ink/5 hover:-translate-y-0.5 hover:ring-lavender-strong/40' : 'cursor-not-allowed bg-surface text-muted'
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className={`text-xl ${isUnlocked ? '' : 'grayscale'}`}>{TYPE_ICON[term.tipo]}</span>
                  {!isUnlocked && <span aria-label="Bloqueado">🔒</span>}
                </span>
                <span className="mt-1 font-display font-bold leading-tight">{term.termino}</span>
                <span className="mt-0.5 text-xs">{isUnlocked ? term.traduccion ?? term.tipo : 'Aún no lo descubres'}</span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
