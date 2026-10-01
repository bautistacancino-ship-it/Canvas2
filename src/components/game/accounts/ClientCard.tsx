'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ClientState } from '@/lib/accounts';
import { formatCoins } from '@/lib/scoring';
import type { AccountClient, RelationCard } from '@/types/game';
import { T } from '@/components/glossary/Terms';

interface ClientCardProps {
  client: AccountClient;
  state: ClientState;
  riskThreshold: number;
  hintRevealed: boolean;
  assigned: RelationCard[];
  /** Cartas instaladas que actúan solas sobre este cliente. */
  automatic: RelationCard[];
  hours: number;
  costAlert: boolean;
  /** Si hay una carta seleccionada que se puede asignar aquí. */
  canDrop: boolean;
  dropReason?: string | null;
  /** Cuánto cambiaría la salud con la carta seleccionada (se ve antes de asignarla). */
  dropPreview?: string;
  onDrop?: () => void;
  onRemove?: (cardId: string) => void;
}

export function ClientCard({
  client,
  state,
  riskThreshold,
  hintRevealed,
  assigned,
  automatic,
  hours,
  costAlert,
  canDrop,
  dropReason,
  dropPreview,
  onDrop,
  onRemove,
}: ClientCardProps) {
  const risk = !state.lost && state.health < riskThreshold;
  const barColor = state.health >= 60 ? 'from-[#9be15d] to-lime-strong' : state.health >= riskThreshold ? 'from-[#ffd76a] to-sun-strong' : 'from-[#ff9bb5] to-pink-strong';

  return (
    <motion.article
      animate={risk ? { boxShadow: ['0 0 0 0 rgba(255,79,139,0)', '0 0 0 6px rgba(255,79,139,0.35)', '0 0 0 0 rgba(255,79,139,0)'] } : {}}
      transition={risk ? { duration: 1.2, repeat: Infinity } : {}}
      className={`flex flex-col rounded-[28px] p-4 shadow-soft ring-1 ${
        state.lost ? 'bg-surface opacity-60 ring-line' : risk ? 'bg-pink ring-pink-strong' : 'bg-white ring-ink/5'
      }`}
    >
      <header className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface text-2xl">{client.avatar}</span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold leading-tight">{client.name}</p>
          <p className="truncate text-xs text-muted">
            {client.business} · {client.plan}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 font-display text-xs font-semibold">💰 {formatCoins(state.fee)}</span>
      </header>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-muted">❤️ Salud</span>
          <span className="font-display text-sm tabular-nums">{state.lost ? '0' : state.health}</span>
        </div>
        <div className="mt-1 h-3 overflow-hidden rounded-full bg-line">
          <motion.div
            className={`h-full rounded-full bg-linear-to-r ${barColor}`}
            initial={false}
            animate={{ width: `${state.lost ? 0 : state.health}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
        </div>
        <p className="mt-1 text-[11px] text-muted">Desgaste: −{client.decay} por mes</p>
      </div>

      <AnimatePresence>
        {state.lost && <p className="mt-2 rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-white">👋 Se fue: su fee desapareció.</p>}
        {risk && <p className="mt-2 rounded-xl bg-pink-strong px-3 py-1.5 text-xs font-bold text-white">⚠️ Riesgo de abandono</p>}
        {costAlert && !state.lost && (
          <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-2 rounded-xl bg-sun px-3 py-1.5 text-xs font-bold">
            💸 Este cliente te está costando más de lo que paga ({hours} h)
          </motion.p>
        )}
      </AnimatePresence>

      <p className="mt-3 rounded-2xl bg-surface px-3 py-2 text-xs">
        <span className="font-bold text-ink/60">🔍 Lo que valora: </span>
        {hintRevealed ? <T>{client.values}</T> : <span className="text-muted">??? (se revela después del mes 1)</span>}
      </p>

      {/* Cartas de este mes */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {assigned.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onRemove?.(card.id)}
            className="rounded-full bg-lavender px-2.5 py-1 text-xs font-semibold text-lavender-strong hover:bg-pink hover:text-pink-strong"
            title="Quitar"
          >
            {card.icon} {card.name} ×
          </button>
        ))}
        {automatic.map((card) => (
          <span key={card.id} className="rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-lime-strong">
            {card.icon} {card.name} · auto
          </span>
        ))}
      </div>

      {onDrop && !state.lost && (
        <button
          type="button"
          disabled={!canDrop}
          onClick={onDrop}
          className={`mt-auto rounded-2xl border-2 border-dashed px-3 py-2 pt-2 text-sm font-semibold transition ${
            canDrop ? 'mt-3 border-lavender-strong bg-lavender/40 text-lavender-strong hover:bg-lavender' : 'mt-3 border-line text-muted'
          }`}
        >
          {canDrop ? `＋ Asignar aquí${dropPreview ? ` · ${dropPreview}` : ''}` : dropReason ?? 'Selecciona una carta'}
        </button>
      )}
    </motion.article>
  );
}
