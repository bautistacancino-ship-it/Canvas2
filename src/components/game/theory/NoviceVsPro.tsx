'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Toggle } from '@/components/ui/Toggle';
import type { ComparisonRow } from '@/types/game';

interface NoviceVsProProps {
  rows: ComparisonRow[];
  revealed: Set<number>;
  onToggle: (index: number, value: boolean) => void;
  showPro: Set<number>;
}

/** Cada situación muestra a la agencia novata; el toggle revela cómo lo resuelve una exitosa. */
export function NoviceVsPro({ rows, revealed, showPro, onToggle }: NoviceVsProProps) {
  return (
    <div className="grid gap-3">
      {rows.map((row, i) => {
        const pro = showPro.has(i);
        return (
          <motion.div
            key={row.situation}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-[28px] bg-white p-4 shadow-soft ring-1 ring-ink/5"
          >
            <div className="flex items-center gap-3">
              <p className="min-w-0 flex-1 font-display text-lg font-bold">{row.situation}</p>
              <span className={`text-xs font-bold ${pro ? 'text-muted' : 'text-pink-strong'}`}>🐣</span>
              <Toggle checked={pro} onChange={(v) => onToggle(i, v)} label={`Ver versión profesional: ${row.situation}`} />
              <span className={`text-xs font-bold ${pro ? 'text-lime-strong' : 'text-muted'}`}>🏆</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pro ? 'pro' : 'novice'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className={`mt-3 rounded-2xl p-3 ${pro ? 'bg-lime' : 'bg-pink'}`}
              >
                <p className={`text-[11px] font-bold uppercase tracking-wider ${pro ? 'text-lime-strong' : 'text-pink-strong'}`}>
                  {pro ? '🏆 CEO de agencia exitosa' : '🐣 Agencia novata'}
                </p>
                <p className="mt-1 text-[15px]">{pro ? row.pro : row.novice}</p>
              </motion.div>
            </AnimatePresence>
            {!revealed.has(i) && <p className="mt-2 text-xs text-muted">Activa el interruptor para ver cómo lo hace un profesional.</p>}
          </motion.div>
        );
      })}
    </div>
  );
}
