import type { TheoryCard, TheoryConfig } from '@/types/game';

/** Tarjetas que se pueden repasar tras reprobar el quiz: tipos + fases del recorrido + filas de pares. */
export function reviewCards(theory: TheoryConfig): TheoryCard[] {
  const phases: TheoryCard[] = (theory.phases?.items ?? []).map((p) => ({
    id: p.id,
    icon: p.icon,
    title: `Fase: ${p.label}`,
    body: `${p.question} 🚫 404 típico: ${p.fail}`,
    example: p.example,
  }));
  const pairs: TheoryCard[] = (theory.fitMap?.rows ?? [])
    .filter((r) => r.id)
    .map((r) => ({ id: r.id!, icon: r.icon, title: r.profileLabel, body: r.profileExample, example: r.valueExample }));
  return [...theory.cards, ...phases, ...pairs];
}
