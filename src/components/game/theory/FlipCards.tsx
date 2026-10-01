'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Blob } from '@/components/ui/Blob';
import { IconTile } from '@/components/ui/IconTile';
import { BLOB_COLORS, TONES, toneAt } from '@/lib/tones';
import type { TheoryCard } from '@/types/game';

const BLOB_CYCLE = [BLOB_COLORS.lavender, BLOB_COLORS.yellow, BLOB_COLORS.pink, BLOB_COLORS.sky];

interface FlipCardsProps {
  cards: TheoryCard[];
  seen: Set<string>;
  onSeen: (id: string) => void;
}

/** Tarjetas que se voltean: frente = concepto, reverso = ejemplo aplicado al negocio. */
export function FlipCards({ cards, seen, onSeen }: FlipCardsProps) {
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    onSeen(id);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => {
        const isFlipped = flipped.has(card.id);
        const tone = card.trap ? 'pink' : toneAt(i);
        return (
          <motion.button
            key={card.id}
            type="button"
            onClick={() => toggle(card.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="h-72 text-left"
            style={{ perspective: 1000 }}
            aria-pressed={isFlipped}
          >
            <motion.div
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              <div
                className={`absolute inset-0 flex flex-col rounded-[28px] p-5 shadow-soft ${TONES[tone].soft} ${
                  card.trap ? 'ring-2 ring-pink-strong ring-offset-2 ring-offset-surface' : 'ring-1 ring-ink/5'
                }`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex items-start justify-between">
                  <IconTile icon={card.icon} tone={tone} size="md" className="bg-white!" />
                  {card.trap ? (
                    <span className="rounded-full bg-pink-strong px-2.5 py-1 text-xs font-bold text-white">🪤 Trampa</span>
                  ) : (
                    seen.has(card.id) && (
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-lime-strong">✓ Vista</span>
                    )
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold leading-tight">{card.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{card.body}</p>
                <span className={`mt-auto font-display text-sm font-semibold ${TONES[tone].text}`}>Ver ejemplo ↻</span>
              </div>

              <div
                className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] bg-white p-5 shadow-soft ring-2 ring-lavender-strong/20"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${TONES[tone].soft} ${TONES[tone].text}`}>
                  {card.trap ? '⚠️ Cuidado' : 'En tu agencia'}
                </span>
                <p className="mt-3 pr-8 text-[15px] font-medium leading-relaxed">{card.example}</p>
                {card.tag && (
                  <span className="mt-2 self-start rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink/70">🎯 {card.tag}</span>
                )}
                <Blob
                  color={BLOB_CYCLE[i % BLOB_CYCLE.length]}
                  mood={card.trap ? 'sad' : 'happy'}
                  size={70}
                  float={false}
                  className="absolute -bottom-3 -right-3"
                />
              </div>
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
