'use client';

import type { MonthContext } from '@/lib/accounts';
import type { RelationCard } from '@/types/game';

const BILLING_LABEL: Record<RelationCard['billing'], string> = {
  monthly: 'cada mes',
  install: 'una vez · actúa sola',
  oneshot: 'una vez',
  quarter: 'por trimestre',
};

interface CardHandProps {
  cards: RelationCard[];
  selected: string | null;
  activeGlobals: string[];
  ctx: MonthContext;
  hoursLeft: number;
  onSelect: (cardId: string | null) => void;
  onToggleGlobal: (cardId: string) => void;
}

/** Las cartas de relación del mes: las de cliente se seleccionan y se asignan; las globales se activan. */
export function CardHand({ cards, selected, activeGlobals, ctx, hoursLeft, onSelect, onToggleGlobal }: CardHandProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const isGlobal = card.scope === 'global';
        const active = isGlobal && activeGlobals.includes(card.id);
        const blocked = isGlobal ? ctx.blockedReason(card) : null;
        const cost = isGlobal ? ctx.cardCost(card) : card.hours;
        const tooExpensive = !active && cost > hoursLeft;
        const disabled = (Boolean(blocked) && !active) || tooExpensive;
        const isSelected = selected === card.id;

        return (
          <button
            key={card.id}
            type="button"
            disabled={disabled}
            onClick={() => (isGlobal ? onToggleGlobal(card.id) : onSelect(isSelected ? null : card.id))}
            className={`flex flex-col rounded-2xl p-3 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-45 ${
              active ? 'bg-lime ring-2 ring-lime-strong' : isSelected ? 'bg-lavender ring-2 ring-lavender-strong' : 'bg-white shadow-soft ring-1 ring-ink/5 hover:ring-lavender-strong/40'
            }`}
          >
            <span className="flex items-start justify-between gap-2">
              <span className="font-display font-semibold leading-tight">
                {card.icon} {card.name}
              </span>
              <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-display text-xs font-semibold">⏱️ {card.hours} h</span>
            </span>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {isGlobal ? '🌐 Todos los clientes' : '👤 Un cliente'} · {BILLING_LABEL[card.billing]}
            </span>
            {card.note && <span className="mt-1 text-xs text-ink/60">{card.note}</span>}
            {isGlobal && (
              <span className="mt-2 text-xs font-semibold">
                {active ? '✓ Activa este mes (toca para quitar)' : blocked ? `🔒 ${blocked}` : tooExpensive ? 'No te alcanzan las horas' : 'Toca para activar'}
              </span>
            )}
            {!isGlobal && isSelected && <span className="mt-2 text-xs font-semibold text-lavender-strong">Ahora toca un cliente ↓</span>}
          </button>
        );
      })}
    </div>
  );
}
