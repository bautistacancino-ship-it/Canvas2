'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface MeterGaugeProps {
  label: string;
  icon: string;
  value: number;
  compact?: boolean;
  /** Valor que llena la barra (por defecto 100). */
  max?: number;
  format?: (value: number) => string;
}

export const meterColor = (value: number) =>
  value >= 60 ? 'from-[#9be15d] to-lime-strong' : value >= 35 ? 'from-[#ffd76a] to-sun-strong' : 'from-[#ff9bb5] to-pink-strong';

export function MeterGauge({ label, icon, value, compact = false, max = 100, format = String }: MeterGaugeProps) {
  // Patrón "estado derivado de props previas": detecta el delta sin useEffect.
  const [prev, setPrev] = useState(value);
  const [delta, setDelta] = useState(0);
  if (value !== prev) {
    setPrev(value);
    setDelta(value - prev);
  }

  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="min-w-0">
      <div className={`flex items-center justify-between ${compact ? 'text-[11px]' : 'text-sm'}`}>
        <span className="truncate font-semibold text-muted">
          {icon} {label}
        </span>
        <span className="relative font-display font-semibold tabular-nums text-ink">
          {format(value)}
          <AnimatePresence>
            {delta !== 0 && (
              <motion.span
                key={`${value}-${delta}`}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 1, 0], y: -14 }}
                transition={{ duration: 1.6, times: [0, 0.1, 0.7, 1] }}
                className={`absolute -right-1 bottom-full translate-x-full font-bold ${
                  delta > 0 ? 'text-lime-strong' : 'text-pink-strong'
                }`}
              >
                {delta > 0 ? `+${format(delta)}` : format(delta)}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
      <div className={`mt-1 overflow-hidden rounded-full bg-line ${compact ? 'h-1.5' : 'h-2.5'}`}>
        <motion.div
          className={`h-full rounded-full bg-linear-to-r ${meterColor(percent)}`}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>
    </div>
  );
}
