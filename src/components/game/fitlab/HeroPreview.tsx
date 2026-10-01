'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { HeroPicks } from '@/lib/fitLab';
import type { FitLabConfig, HeroOption, HeroSlotId } from '@/types/game';

interface HeroPreviewProps {
  config: FitLabConfig;
  picks: HeroPicks;
  activeSlot?: HeroSlotId | null;
  onSlotClick?: (slot: HeroSlotId) => void;
  /** Intensidad del mapa de calor por slot (0–1). Sin valor = sin mapa de calor. */
  heat?: Partial<Record<HeroSlotId, number>>;
  /** Clics simulados sobre el CTA. */
  clicks?: number;
}

/** Wireframe de la landing con los 5 slots above the fold. */
export function HeroPreview({ config, picks, activeSlot, onSlotClick, heat, clicks = 0 }: HeroPreviewProps) {
  const option = (id: HeroSlotId) => config.slots.find((s) => s.id === id)?.options.find((o) => o.id === picks[id]);
  const slotIndex = (id: HeroSlotId) => config.slots.findIndex((s) => s.id === id) + 1;
  const label = (id: HeroSlotId) => config.slots.find((s) => s.id === id)?.label ?? id;

  const slot = (id: HeroSlotId, content: (o: HeroOption) => ReactNode, className = '') => {
    const o = option(id);
    const active = activeSlot === id;
    const intensity = heat?.[id];
    return (
      <button
        type="button"
        disabled={!onSlotClick}
        onClick={() => onSlotClick?.(id)}
        className={`relative block w-full overflow-hidden rounded-2xl text-left transition ${
          o ? 'p-2' : 'border-2 border-dashed border-line p-3'
        } ${active ? 'ring-2 ring-sky-strong ring-offset-2' : onSlotClick ? 'hover:ring-2 hover:ring-lavender-strong/40' : ''} ${className}`}
      >
        {o ? (
          content(o)
        ) : (
          <span className="flex items-center gap-2 font-display text-sm font-semibold text-muted">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-surface text-xs">{slotIndex(id)}</span>
            {label(id)} <span className="ml-auto text-lg">+</span>
          </span>
        )}
        {intensity !== undefined && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 40% 50%, rgba(255,60,40,${0.55 * intensity}) 0%, rgba(255,170,0,${0.4 * intensity}) 40%, rgba(80,160,255,${0.12 + 0.1 * (1 - intensity)}) 75%, transparent 100%)`,
            }}
          />
        )}
      </button>
    );
  };

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-float ring-1 ring-ink/5">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex-1 truncate rounded-full bg-white px-3 py-1 font-mono text-xs text-muted">tuagencia.cl</span>
      </div>
      <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-[1.25fr_1fr] md:items-center">
        <div className="space-y-2.5">
          {slot('headline', (o) => <h3 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{o.text}</h3>)}
          {slot('subtitle', (o) => <p className="text-sm text-ink/70">{o.text}</p>)}
          {slot('proof', (o) => <ProofArt option={o} />)}
          <div className="relative">
            {slot('cta', (o) => (
              <span className="inline-flex rounded-full bg-linear-to-r from-[#ffac3a] to-[#ff5fa2] px-5 py-2.5 font-display text-sm font-semibold text-white shadow-soft">
                {o.text}
              </span>
            ))}
            {Array.from({ length: clicks }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.12 }}
                className="pointer-events-none absolute h-3 w-3 rounded-full bg-pink-strong ring-2 ring-white"
                style={{ left: `${18 + ((i * 37) % 55)}%`, top: `${30 + ((i * 23) % 40)}%` }}
              />
            ))}
          </div>
        </div>
        {slot('visual', (o) => <VisualArt option={o} />, 'md:min-h-56')}
      </div>
    </div>
  );
}

function ProofArt({ option }: { option: HeroOption }) {
  if (option.art === 'logos') {
    return (
      <span className="block">
        <span className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="h-5 rounded-md bg-line" />
          ))}
        </span>
        <span className="mt-1 block text-xs text-muted">{option.text}</span>
      </span>
    );
  }
  if (option.art === 'award') {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-sun px-3 py-1.5 text-sm font-semibold">🏆 {option.text}</span>
    );
  }
  return (
    <span className="flex items-start gap-2 rounded-2xl bg-surface p-2.5 text-sm">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-lg">👩</span>
      <span className="italic text-ink/80">{option.text}</span>
    </span>
  );
}

function VisualArt({ option }: { option: HeroOption }) {
  if (option.art === 'dashboard') {
    return (
      <span className="block rounded-2xl bg-ink p-3 text-white">
        <span className="flex items-center justify-between text-[11px] text-white/60">
          <span>Conversión</span>
          <span className="font-display text-base font-bold text-[#b5f07a]">2,1% ↑</span>
        </span>
        <svg viewBox="0 0 200 80" className="mt-2 w-full">
          <polyline points="0,70 30,64 60,60 90,48 120,40 150,26 180,16 200,10" fill="none" stroke="#b5f07a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {[18, 26, 34, 46, 58].map((h, i) => (
            <rect key={i} x={10 + i * 40} y={80 - h} width="14" height={h} rx="3" fill="rgba(255,255,255,0.12)" />
          ))}
        </svg>
        <span className="mt-1 block text-[11px] text-white/50">{option.text}</span>
      </span>
    );
  }
  if (option.art === 'team') {
    return (
      <span className="block rounded-2xl bg-peach p-4 text-center">
        <span className="text-4xl">👩‍💻🧑‍🎨👨‍💻</span>
        <span className="mt-2 block text-xs text-ink/60">{option.text}</span>
      </span>
    );
  }
  return (
    <span className="relative block h-40 overflow-hidden rounded-2xl bg-linear-to-br from-lavender to-sky">
      <span className="absolute left-6 top-6 h-20 w-20 rounded-full bg-linear-to-br from-lavender-strong to-pink-strong opacity-80 blur-[2px]" />
      <span className="absolute bottom-4 right-8 h-16 w-24 rotate-12 rounded-3xl bg-linear-to-br from-sky-strong to-[#7ee0ff] opacity-80" />
      <span className="absolute bottom-2 left-3 text-[11px] text-ink/50">{option.text}</span>
    </span>
  );
}
