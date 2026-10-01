'use client';

import { motion } from 'framer-motion';

interface CircularTimerProps {
  timeLeftMs: number;
  totalMs: number;
  size?: number;
  strokeWidth?: number;
  /** Bajo este umbral (segundos) el reloj late para generar urgencia. */
  dangerThresholdSec?: number;
}

export function CircularTimer({
  timeLeftMs,
  totalMs,
  size = 104,
  strokeWidth = 10,
  dangerThresholdSec = 5,
}: CircularTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.max(0, Math.min(1, timeLeftMs / totalMs));
  const seconds = Math.ceil(timeLeftMs / 1000);
  const isDanger = seconds <= dangerThresholdSec && timeLeftMs > 0;

  const color = ratio > 0.5 ? '#6fae12' : ratio > 0.25 ? '#f5b400' : '#ff4f8b';

  return (
    <motion.div
      className="relative grid place-items-center rounded-full bg-white shadow-soft"
      style={{ width: size, height: size }}
      animate={isDanger ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={isDanger ? { duration: 0.6, repeat: Infinity } : { duration: 0.2 }}
      role="timer"
      aria-label={`${seconds} segundos restantes`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#ebe9f3" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          style={{ transition: 'stroke-dashoffset 100ms linear, stroke 300ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-3xl font-bold tabular-nums" style={{ color }}>
          {seconds}
        </span>
      </div>
    </motion.div>
  );
}
