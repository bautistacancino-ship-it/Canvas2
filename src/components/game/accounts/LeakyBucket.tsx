'use client';

import { motion } from 'framer-motion';

/** "Balde roto": el agua se escapa por los agujeros con los clientes perdidos flotando. */
export function LeakyBucket({ lost }: { lost: { name: string; avatar: string }[] }) {
  return (
    <div className="relative mx-auto h-56 w-64">
      <svg viewBox="0 0 200 180" className="absolute inset-0 h-full w-full">
        <defs>
          <clipPath id="bucket">
            <path d="M30 40 L170 40 L150 165 L50 165 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#bucket)">
          <motion.rect
            x="0"
            width="200"
            fill="#5fb4ff"
            initial={{ y: 50, height: 130 }}
            animate={{ y: 150, height: 30 }}
            transition={{ duration: 3, ease: 'easeIn' }}
          />
        </g>
        <path d="M30 40 L170 40 L150 165 L50 165 Z" fill="none" stroke="#1b1636" strokeWidth="5" strokeLinejoin="round" />
        <path d="M30 40 Q100 0 170 40" fill="none" stroke="#1b1636" strokeWidth="4" />
        {[60, 100, 140].map((x, i) => (
          <circle key={x} cx={x} cy={120 + (i % 2) * 20} r="5" fill="#1b1636" />
        ))}
      </svg>
      {/* Gotas que se escapan */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="absolute h-2.5 w-2.5 rounded-full bg-sky-strong"
          style={{ left: `${30 + (i % 3) * 20}%`, top: '70%' }}
          animate={{ y: [0, 60], opacity: [1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
      {lost.map((c, i) => (
        <motion.span
          key={c.name}
          className="absolute grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-float"
          style={{ left: `${20 + i * 30}%`, top: '55%' }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: [0, 80, 120], x: [0, (i - 0.5) * 30], opacity: [1, 1, 0.2], rotate: [0, 25] }}
          transition={{ duration: 3, delay: 0.5 + i * 0.4, repeat: Infinity, repeatDelay: 1 }}
          title={c.name}
        >
          {c.avatar}
        </motion.span>
      ))}
    </div>
  );
}
