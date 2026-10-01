'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { LeadComputed } from '@/lib/inbox';
import type { LeadFieldMeta } from '@/types/game';
import { FIT_META } from './inboxMeta';
import { T } from '@/components/glossary/Terms';

/** Ficha del lead: se completa solo cuando el jugador hace buenas preguntas. */
export function LeadFiche({ data, fields, compact = false }: { data: LeadComputed; fields: LeadFieldMeta[]; compact?: boolean }) {
  const { lead, unlocked, ficheComplete } = data;
  const fit = FIT_META[lead.fit];

  return (
    <div className={compact ? '' : 'rounded-[28px] bg-white p-4 shadow-soft ring-1 ring-ink/5'}>
      {!compact && (
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-lg font-bold">📋 Ficha del lead</p>
          <span className="rounded-full bg-surface px-2.5 py-0.5 font-display text-xs font-semibold text-muted">
            {unlocked.size}/{fields.length}
          </span>
        </div>
      )}
      <ul className="grid gap-1.5">
        {fields.map((field) => {
          const isOpen = unlocked.has(field.id);
          return (
            <li key={field.id} className={`rounded-2xl px-3 py-2 ${isOpen ? 'bg-surface' : 'bg-surface/60'}`}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                {field.icon} {field.label}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={isOpen ? 'open' : 'locked'}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-sm ${isOpen ? 'font-medium' : 'text-muted/70'}`}
                >
                  {isOpen ? <T>{lead.fiche[field.id]}</T> : '🔒 ???'}
                </motion.p>
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      <div className={`mt-3 rounded-2xl p-3 ${ficheComplete ? fit.soft : 'bg-surface'}`}>
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">🎯 Encaje con el segmento</p>
        {ficheComplete ? (
          <>
            <p className={`font-display text-lg font-bold ${fit.text}`}>{fit.label}</p>
            <p className="text-xs text-ink/70">
              <T>{lead.fitNote}</T>
            </p>
          </>
        ) : (
          <p className="text-sm text-muted">Se revela al completar la ficha.</p>
        )}
      </div>
    </div>
  );
}
