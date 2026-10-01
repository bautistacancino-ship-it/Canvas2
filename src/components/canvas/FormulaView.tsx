import { FormulaSentence } from '@/components/game/shared/FormulaSentence';
import type { CanvasEntry, FormulaBuildConfig } from '@/types/game';

/** Propuesta de valor como se ve en el Canvas: la frase y las líneas de Fit. */
export function FormulaView({ config, entry, className = '' }: { config: FormulaBuildConfig; entry: CanvasEntry; className?: string }) {
  return (
    <div className={`space-y-2 text-sm ${className}`}>
      <div className="rounded-2xl bg-white/80 p-3">
        <FormulaSentence parts={config.parts} values={entry} className="leading-relaxed" />
      </div>
      {config.lines.map((line) =>
        entry[line.id]?.trim() ? (
          <p key={line.id} className="rounded-2xl bg-white/60 px-3 py-2">
            <span className="mr-1">{line.icon}</span>
            {entry[line.id]}
            {line.how && entry[line.how.id]?.trim() && <span className="text-ink/60"> → {entry[line.how.id]}</span>}
          </p>
        ) : null,
      )}
    </div>
  );
}
