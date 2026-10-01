import type { BuildConfig, CanvasEntry } from '@/types/game';
import { FormulaView } from './FormulaView';
import { LinesView } from './LinesView';
import { MediaQueryCode } from './MediaQueryCode';

/** Muestra lo que el jugador escribió en un bloque, según el tipo de reto de ese nivel. */
export function CanvasEntryView({ build, entry, labelClass = '' }: { build?: BuildConfig; entry: CanvasEntry; labelClass?: string }) {
  if (build?.kind === 'media-query') return <MediaQueryCode config={build} entry={entry} className="mt-3" />;
  if (build?.kind === 'value-formula') return <FormulaView config={build} entry={entry} className="mt-3" />;
  if (build?.kind === 'lines') return <LinesView config={build} entry={entry} className="mt-3" />;

  const fields = build?.kind === 'fields' ? build.fields : [];
  return (
    <div className="mt-3 space-y-2 text-sm">
      {Object.entries(entry)
        .filter(([, value]) => value.trim())
        .map(([fieldId, value]) => (
          <div key={fieldId} className="rounded-2xl bg-white/75 p-2.5">
            <p className={`text-[10px] font-bold uppercase tracking-wide ${labelClass}`}>{fields.find((f) => f.id === fieldId)?.label ?? fieldId}</p>
            <p className="whitespace-pre-line leading-snug">{value}</p>
          </div>
        ))}
    </div>
  );
}
