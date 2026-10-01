'use client';

import { motion } from 'framer-motion';

export type BlobMood = 'happy' | 'excited' | 'sad' | 'thinking';

interface BlobProps {
  color?: string;
  mood?: BlobMood;
  size?: number;
  /** Flota suavemente arriba/abajo. */
  float?: boolean;
  delay?: number;
  className?: string;
}

const INK = '#1b1636';

/** Carita blanca sobre blobs oscuros, tinta sobre blobs claros. */
function faceColorFor(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b < 110 ? '#ffffff' : INK;
}

/** Mascota "nube" con carita, inspirada en las referencias. */
export function Blob({ color = '#ffd23f', mood = 'happy', size = 96, float = true, delay = 0, className = '' }: BlobProps) {
  const face = faceColorFor(color);
  return (
    <motion.svg
      viewBox="0 0 120 110"
      width={size}
      height={(size * 110) / 120}
      className={className}
      animate={float ? { y: [0, -6, 0], rotate: [0, -2, 0] } : undefined}
      transition={float ? { duration: 3, repeat: Infinity, ease: 'easeInOut', delay } : undefined}
      aria-hidden
    >
      <g fill={color}>
        <circle cx="34" cy="52" r="28" />
        <circle cx="62" cy="34" r="30" />
        <circle cx="88" cy="54" r="27" />
        <circle cx="46" cy="78" r="26" />
        <circle cx="78" cy="80" r="25" />
        <circle cx="60" cy="62" r="30" />
      </g>
      <g fill="#fff" opacity="0.35">
        <ellipse cx="48" cy="28" rx="10" ry="5" transform="rotate(-25 48 28)" />
      </g>
      <g fill="#ff8fab" opacity="0.55">
        <ellipse cx="38" cy="70" rx="6" ry="4" />
        <ellipse cx="84" cy="70" rx="6" ry="4" />
      </g>
      <g stroke={face} strokeWidth="4" strokeLinecap="round" fill="none">
        {mood === 'happy' || mood === 'excited' ? (
          <>
            <path d="M42 60 q6 -8 12 0" />
            <path d="M68 60 q6 -8 12 0" />
          </>
        ) : null}
        {mood === 'happy' && <path d="M52 70 q9 9 18 0" />}
        {mood === 'sad' && <path d="M52 78 q9 -8 18 0" />}
        {mood === 'thinking' && <path d="M53 75 h16" />}
      </g>
      {(mood === 'sad' || mood === 'thinking') && (
        <g fill={face}>
          <circle cx="48" cy="60" r="4" />
          <circle cx="74" cy="60" r="4" />
        </g>
      )}
      {mood === 'excited' && <path d="M50 68 q11 16 22 0 z" fill={face} />}
    </motion.svg>
  );
}

export function LoadingBlob({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="grid place-items-center gap-3 py-24 text-muted">
      <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}>
        <Blob size={72} float={false} mood="happy" />
      </motion.div>
      <p className="font-display font-medium">{label}</p>
    </div>
  );
}
