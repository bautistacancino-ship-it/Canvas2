import { SECONDARY_PREFIX, hasSecondary } from '@/lib/mediaQuery';
import type { CanvasEntry, MediaQueryBuildConfig } from '@/types/game';

/** Muestra la media query del jugador como código legible (Canvas y vista previa). */
export function MediaQueryCode({ config, entry, className = '' }: { config: MediaQueryBuildConfig; entry: CanvasEntry; className?: string }) {
  const blocks = [{ prefix: '', label: 'Segmento principal' }];
  if (hasSecondary(config, entry)) blocks.push({ prefix: SECONDARY_PREFIX, label: 'Segmento secundario' });

  return (
    <div className={`space-y-2 ${className}`}>
      {blocks.map(({ prefix, label }) => (
        <div key={label} className="rounded-2xl bg-ink p-3 font-mono text-[12px] leading-relaxed text-white">
          <p className="text-white/40">/* {label} */</p>
          <p>
            <span className="text-[#ff8fb8]">@media</span>{' '}
            {config.conditions.map((c, i) => (
              <span key={c.id}>
                {i > 0 && <span className="text-[#ff8fb8]"> and </span>}
                <span className="text-white/50">(</span>
                <span className="text-[#9ec5ff]">{c.prop}</span>
                <span className="text-white/50">: </span>
                <span className="text-[#b5f07a]">{entry[prefix + c.id] || '…'}</span>
                <span className="text-white/50">)</span>
              </span>
            ))}{' '}
            <span className="text-white/50">{'{'}</span>
          </p>
          {config.declarations.map((d) => (
            <p key={d.id} className="pl-4">
              <span className="text-[#9ec5ff]">{d.prop}</span>
              <span className="text-white/50">: </span>
              <span className="text-[#b5f07a]">{entry[prefix + d.id] || '…'}</span>
              <span className="text-white/50">;</span>
            </p>
          ))}
          <p className="text-white/50">{'}'}</p>
        </div>
      ))}
    </div>
  );
}
