import { cardClass } from '@/components/ui/Card';
import type { TheoryConcept } from '@/types/game';
import { CodeBlock } from './CodeBlock';

export function ConceptCard({ concept }: { concept: TheoryConcept }) {
  return (
    <div className="space-y-4">
      <section className={`${cardClass} p-6 sm:p-8`}>
        <span className="rounded-full bg-lavender px-3 py-1 text-xs font-bold text-lavender-strong">🧠 El concepto, en tu idioma</span>
        <h3 className="mt-4 font-display text-2xl font-bold leading-snug sm:text-3xl">{concept.headline}</h3>
        <div className="mt-4 space-y-3 text-ink/75">
          {concept.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {concept.code && <CodeBlock code={concept.code} className="mt-6" />}
      </section>

      <section className="flex items-start gap-3 rounded-[28px] bg-sun p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-2xl">💡</span>
        <div>
          <p className="font-display text-lg font-bold">Regla de oro</p>
          <p className="text-ink/75">{concept.goldenRule}</p>
        </div>
      </section>
    </div>
  );
}
