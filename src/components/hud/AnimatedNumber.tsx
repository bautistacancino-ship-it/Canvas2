'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const display = useTransform(motionValue, (v) => Math.round(v).toLocaleString('es-CL'));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.8, ease: 'easeOut' });
    return () => controls.stop();
  }, [motionValue, value]);

  return <motion.span className="tabular-nums">{display}</motion.span>;
}
