import type { CanvasEntry, LinesBuildConfig } from '@/types/game';

/** Bloque escrito línea por línea (ej. 1 canal por fase), como se ve en el Canvas. */
export function LinesView({ config, entry, className = '' }: { config: LinesBuildConfig; entry: CanvasEntry; className?: string }) {
  return (
    <div className={`space-y-2 text-sm ${className}`}>
      {config.groups.map((group) => (
        <ul key={group.id} className="space-y-1 rounded-2xl bg-white/75 p-2.5">
          {group.lines.map((line) =>
            entry[line.id]?.trim() ? (
              <li key={line.id} className="leading-snug">
                <span className="mr-1">{line.icon}</span>
                <span className="font-semibold">{line.label}</span> → {entry[line.id]}
              </li>
            ) : null,
          )}
        </ul>
      ))}
    </div>
  );
}
