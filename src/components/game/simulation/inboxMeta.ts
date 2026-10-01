import type { FitLevel, LeadClass } from '@/types/game';

export const CLASS_META: Record<LeadClass, { icon: string; label: string; soft: string; text: string }> = {
  ideal: { icon: '🟢', label: 'Cliente ideal', soft: 'bg-lime', text: 'text-lime-strong' },
  nurture: { icon: '🟡', label: 'Nutrir', soft: 'bg-sun', text: 'text-sun-strong' },
  discard: { icon: '🔴', label: 'Descartar', soft: 'bg-pink', text: 'text-pink-strong' },
};

export const CLASS_ORDER: LeadClass[] = ['ideal', 'nurture', 'discard'];

export const FIT_META: Record<FitLevel, { label: string; soft: string; text: string }> = {
  alto: { label: 'ALTO', soft: 'bg-lime', text: 'text-lime-strong' },
  medio: { label: 'MEDIO, CON POTENCIAL', soft: 'bg-sun', text: 'text-sun-strong' },
  bajo: { label: 'BAJO', soft: 'bg-pink', text: 'text-pink-strong' },
};
