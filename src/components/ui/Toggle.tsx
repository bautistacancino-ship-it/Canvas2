'use client';

import { motion } from 'framer-motion';

/** Interruptor en píldora (como los toggles naranjos de las referencias). */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${checked ? 'bg-peach-strong' : 'bg-line'}`}
    >
      <motion.span
        className="absolute top-1 h-6 w-6 rounded-full bg-white shadow"
        animate={{ left: checked ? 28 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      />
    </button>
  );
}
