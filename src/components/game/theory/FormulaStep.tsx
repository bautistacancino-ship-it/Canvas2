import { cardClass } from '@/components/ui/Card';
import type { FormulaTheory } from '@/types/game';
import { FormulaSentence } from '../shared/FormulaSentence';

export function FormulaStep({ formula }: { formula: FormulaTheory }) {
  return (
    <div className="space-y-4">
      <section className={`${cardClass} p-6 sm:p-8`}>
        <span className="rounded-full bg-lavender px-3 py-1 text-xs font-bold text-lavender-strong">🧪 La fórmula (para copiar)</span>
        <FormulaSentence parts={formula.parts} className="mt-4 font-display text-xl sm:text-2xl" />
      </section>
      <section className="rounded-[28px] bg-white/70 p-6 ring-1 ring-ink/5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Ejemplo</p>
        <FormulaSentence parts={formula.parts} values={formula.example} className="mt-2 text-lg" />
      </section>
    </div>
  );
}
