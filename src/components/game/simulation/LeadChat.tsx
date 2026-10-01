'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BadgeChip } from '@/components/ui/BadgeChip';
import { Button } from '@/components/ui/Button';
import type { LeadComputed } from '@/lib/inbox';
import { formatCoins, shuffle } from '@/lib/scoring';
import type { InboxOption, LeadClass, LeadFieldMeta } from '@/types/game';
import { CLASS_META, CLASS_ORDER, FIT_META } from './inboxMeta';
import { LeadFiche } from './LeadFiche';
import { T } from '@/components/glossary/Terms';

type Item =
  | { key: string; kind: 'client' | 'player' | 'event'; text: string }
  | { key: string; kind: 'outcome'; option: InboxOption };

interface LeadChatProps {
  data: LeadComputed;
  fields: LeadFieldMeta[];
  classification?: LeadClass;
  onChoose: (optionId: string) => void;
  onClassify: (value: LeadClass) => void;
  onBack: () => void;
}

/** Transcripción derivada de las elecciones: mensaje → respuesta → reacción → consecuencias. */
function buildItems(data: LeadComputed): Item[] {
  const items: Item[] = [];
  data.lead.decisions.forEach((decision, i) => {
    if (i > data.chosen.length) return;
    items.push({ key: `${decision.id}-msg`, kind: 'client', text: decision.message });
    const option = data.chosen[i];
    if (!option) return;
    items.push({ key: `${decision.id}-me`, kind: 'player', text: option.text });
    items.push({ key: `${decision.id}-re`, kind: option.isEvent ? 'event' : 'client', text: option.reaction });
    items.push({ key: `${decision.id}-fx`, kind: 'outcome', option });
  });
  return items;
}

function delayFor(item: Item) {
  if (item.kind === 'player') return 120;
  if (item.kind === 'outcome') return 350;
  return 700 + Math.min(item.text.length * 14, 1300);
}

export function LeadChat({ data, fields, classification, onChoose, onClassify, onBack }: LeadChatProps) {
  const { lead } = data;
  const items = useMemo(() => buildItems(data), [data]);
  // Al volver a una conversación ya iniciada, se muestra completa; si es nueva, se "escribe".
  const [visible, setVisible] = useState(() => (data.chosen.length > 0 ? items.length : 0));
  const [showFiche, setShowFiche] = useState(false);
  // Las opciones se presentan en orden aleatorio (la buena no siempre es la del medio).
  const [optionOrder] = useState(() => Object.fromEntries(lead.decisions.map((d) => [d.id, shuffle(d.options)])));
  const scrollRef = useRef<HTMLDivElement>(null);

  const pending = visible < items.length ? items[visible] : null;
  const isTyping = pending?.kind === 'client' || pending?.kind === 'event';
  const caughtUp = visible >= items.length;
  const currentDecision = lead.decisions[data.chosen.length];
  const canChoose = caughtUp && Boolean(currentDecision);
  const showEnd = caughtUp && data.finished;

  useEffect(() => {
    if (!pending) return;
    const id = window.setTimeout(() => setVisible((v) => v + 1), delayFor(pending));
    return () => window.clearTimeout(id);
  }, [pending]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [visible, showEnd, classification]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] bg-white shadow-soft ring-1 ring-ink/5">
      <header className="bg-linear-to-b from-sky via-lavender to-white px-3 pb-3 pt-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white font-bold text-muted shadow-soft lg:hidden"
            aria-label="Volver a la bandeja"
          >
            ←
          </button>
          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-2xl shadow-soft ring-4 ring-white">
            {lead.avatar}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-lime-strong ring-2 ring-white" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-bold leading-tight">{lead.name}</p>
            <p className="truncate text-xs text-ink/60">
              {isTyping ? <span className="font-semibold text-lime-strong">escribiendo…</span> : lead.role}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFiche((s) => !s)}
            className="shrink-0 rounded-full bg-white px-3 py-1.5 font-display text-xs font-semibold shadow-soft lg:hidden"
          >
            📋 {data.unlocked.size}/{fields.length} {showFiche ? '▴' : '▾'}
          </button>
        </div>
        <AnimatePresence>
          {showFiche && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-3 max-h-64 overflow-y-auto rounded-2xl bg-white p-2">
                <LeadFiche data={data} fields={fields} compact />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-surface px-3 py-4 sm:px-4" aria-live="polite">
        {items.slice(0, visible).map((item) => (
          <ChatItem key={item.key} item={item} fields={fields} />
        ))}
        <AnimatePresence>{isTyping && <TypingIndicator key="typing" />}</AnimatePresence>

        {showEnd && (
          <EndCard data={data} fields={fields} classification={classification} onClassify={onClassify} onBack={onBack} />
        )}
      </div>

      {canChoose && currentDecision && (
        <footer className="max-h-[50%] shrink-0 overflow-y-auto border-t border-line bg-white p-3">
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-widest text-muted">Elige tu respuesta</p>
          <div className="space-y-2">
            {optionOrder[currentDecision.id].map((option, i) => (
              <motion.button
                key={option.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChoose(option.id)}
                className="flex w-full items-center gap-3 rounded-[20px] bg-surface p-2 pr-4 text-left text-sm ring-1 ring-line transition hover:bg-white hover:ring-2 hover:ring-sky-strong/50"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white font-display font-bold text-sky-strong">
                  {String.fromCharCode(65 + i)}
                </span>
                {option.text}
              </motion.button>
            ))}
          </div>
        </footer>
      )}
    </div>
  );
}

/* ─── Sub-componentes ─────────────────────────────────────────── */

function ChatItem({ item, fields }: { item: Item; fields: LeadFieldMeta[] }) {
  if (item.kind === 'outcome') return <OutcomeChips option={item.option} fields={fields} />;

  if (item.kind === 'event') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-[90%] rounded-3xl bg-ink px-4 py-3 text-center text-white">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/60">⏳ Evento simulado</p>
        <p className="mt-0.5 text-sm">
          <T>{item.text.replace(/^Evento simulado:\s*/i, '')}</T>
        </p>
      </motion.div>
    );
  }

  const isClient = item.kind === 'client';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex ${isClient ? 'justify-start' : 'justify-end'}`}
    >
      <p
        className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed ${
          isClient
            ? 'rounded-bl-lg bg-white text-ink shadow-soft'
            : 'rounded-br-lg bg-linear-to-br from-sky-strong to-lavender-strong text-white shadow-[0_10px_20px_-12px_rgba(47,107,255,0.8)]'
        }`}
      >
        <T>{item.text}</T>
      </p>
    </motion.div>
  );
}

function OutcomeChips({ option, fields }: { option: InboxOption; fields: LeadFieldMeta[] }) {
  const { trust, hours, budget } = option.effects;
  const chips: { label: string; good: boolean }[] = [];
  if (trust) chips.push({ label: `🤝 Confianza ${trust > 0 ? '+' : ''}${trust}`, good: trust > 0 });
  if (hours) chips.push({ label: `⏱️ Horas ${hours > 0 ? '+' : ''}${hours}`, good: hours > 0 });
  if (budget) chips.push({ label: `💰 ${budget > 0 ? '+' : ''}${formatCoins(budget)}`, good: budget > 0 });
  if (option.bonusPoints) chips.push({ label: `★ +${option.bonusPoints} pts`, good: true });
  const unlockedLabels = (option.unlocks ?? []).map((id) => fields.find((f) => f.id === id)?.label).filter(Boolean);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-1.5">
      {option.tag && (
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/70 shadow-soft">
          <T>{option.tag}</T>
        </span>
      )}
      {unlockedLabels.length > 0 && (
        <span className="rounded-full bg-lavender px-3 py-1 text-xs font-bold text-lavender-strong">
          🔓 Ficha: {unlockedLabels.join(', ')}
        </span>
      )}
      <div className="flex flex-wrap justify-center gap-1.5">
        {chips.map((chip) => (
          <span
            key={chip.label}
            className={`rounded-full px-2.5 py-0.5 font-display text-xs font-semibold ${
              chip.good ? 'bg-lime text-lime-strong' : 'bg-pink text-pink-strong'
            }`}
          >
            {chip.label}
          </span>
        ))}
      </div>
      {option.badgeId && (
        <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <BadgeChip id={option.badgeId} />
        </motion.div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex">
      <div className="flex gap-1 rounded-3xl rounded-bl-lg bg-white px-4 py-3.5 shadow-soft">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-lavender-strong/60"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function EndCard({
  data,
  fields,
  classification,
  onClassify,
  onBack,
}: {
  data: LeadComputed;
  fields: LeadFieldMeta[];
  classification?: LeadClass;
  onClassify: (value: LeadClass) => void;
  onBack: () => void;
}) {
  const fit = FIT_META[data.lead.fit];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-ink/5">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-muted">Fin de la conversación</p>
      <div className={`mt-2 rounded-2xl p-3 text-center ${data.ficheComplete ? fit.soft : 'bg-surface'}`}>
        {data.ficheComplete ? (
          <>
            <p className={`font-display text-xl font-bold ${fit.text}`}>🎯 Encaje: {fit.label}</p>
            <p className="text-sm text-ink/70">
              <T>{data.lead.fitNote}</T>
            </p>
          </>
        ) : (
          <>
            <p className="font-display text-xl font-bold text-muted">🎯 Encaje: ???</p>
            <p className="text-sm text-ink/70">
              Te faltan datos ({data.unlocked.size}/{fields.length}). No puedes segmentar a un cliente del que no sabes nada.
            </p>
          </>
        )}
      </div>

      <p className="mt-4 text-center font-display font-semibold">¿Cómo clasificas este lead?</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {CLASS_ORDER.map((value) => {
          const meta = CLASS_META[value];
          const active = classification === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onClassify(value)}
              className={`rounded-2xl px-2 py-2.5 font-display text-sm font-semibold transition ${
                active ? `${meta.soft} ring-2 ring-ink/80` : 'bg-surface ring-1 ring-line hover:bg-white'
              }`}
            >
              <span className="block text-lg">{meta.icon}</span>
              {meta.label}
            </button>
          );
        })}
      </div>
      {classification && (
        <Button variant="dark" size="sm" className="mt-3 w-full" onClick={onBack}>
          Guardar y volver a la bandeja ✓
        </Button>
      )}
    </motion.div>
  );
}
