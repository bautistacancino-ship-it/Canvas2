'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { CanvasEntryView } from '@/components/canvas/CanvasEntryView';
import { LinesView } from '@/components/canvas/LinesView';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { findForbiddenWord } from '@/lib/mediaQuery';
import { TONES, type Tone } from '@/lib/tones';
import type { BuildConfig, CanvasEntry, LinesBuildConfig } from '@/types/game';
import { countWords } from '../shared/FormulaSentence';

const MIN_LENGTH = 3;
const SEPARATOR = ', ';

interface LinesBuilderProps {
  blockTitle: string;
  blockIcon: string;
  tone: Tone;
  config: LinesBuildConfig;
  initialValues?: CanvasEntry;
  reference?: { build?: BuildConfig; entry?: CanvasEntry };
  onDraft?: (values: CanvasEntry) => void;
  onSubmit: (values: CanvasEntry) => void;
}

/** Fase 4 por líneas: una respuesta concreta por línea, con límite de palabras y respuestas prohibidas. */
export function LinesBuilder({ blockTitle, blockIcon, tone, config, initialValues = {}, reference, onDraft, onSubmit }: LinesBuilderProps) {
  const lines = config.groups.flatMap((g) => g.lines);
  const [values, setValues] = useState<CanvasEntry>(() => Object.fromEntries(lines.map((l) => [l.id, initialValues[l.id] ?? ''])));

  const forbiddenWords = config.forbidden.map((f) => f.word);
  const checks = lines.map((line) => {
    const value = (values[line.id] ?? '').trim();
    const words = line.options ? 0 : countWords(value);
    const forbidden = findForbiddenWord(value, forbiddenWords);
    return {
      line,
      words,
      tooLong: Boolean(line.maxWords && words > line.maxWords),
      empty: line.options ? value.length === 0 : value.length < MIN_LENGTH,
      forbidden: forbidden ? config.forbidden.find((f) => f.word === forbidden) : undefined,
    };
  });
  const firstForbidden = checks.find((c) => c.forbidden);
  const missing = checks.filter((c) => c.empty).length;
  const tooLong = checks.filter((c) => c.tooLong).length;
  const isValid = missing === 0 && tooLong === 0 && !firstForbidden;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form
        className={`${cardClass} space-y-6 p-5 sm:p-7`}
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid) onSubmit(values);
        }}
      >
        <p className="text-ink/75">🛠️ {config.intro}</p>

        {reference?.entry && config.reference && (
          <div className="rounded-3xl bg-surface p-4">
            <p className="font-display font-semibold">📎 {config.reference.label}</p>
            <CanvasEntryView build={reference.build} entry={reference.entry} />
          </div>
        )}

        {config.groups.map((group) => (
          <section key={group.id}>
            <p className="font-display text-lg font-bold">{group.title}</p>
            <div className="mt-3 space-y-3">
              {group.lines.map((line) => {
                const c = checks.find((x) => x.line.id === line.id)!;
                return (
                  <label key={line.id} className="block">
                    <span className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                      <span className="font-semibold">
                        {line.icon} {line.label}
                      </span>
                      {line.maxWords && !line.options && (
                        <span
                          className={`rounded-full px-2 py-0.5 font-display text-xs font-semibold tabular-nums ${
                            c.tooLong ? 'bg-pink text-pink-strong' : 'bg-surface text-muted'
                          }`}
                        >
                          {c.words}/{line.maxWords} palabras
                        </span>
                      )}
                    </span>
                    {line.options ? (
                      <span className="flex flex-wrap gap-2">
                        {line.options.map((opt) => {
                          const chosen = (values[line.id] ?? '').split(SEPARATOR).filter(Boolean);
                          const on = chosen.includes(opt);
                          const full = !on && chosen.length >= (line.maxSelect ?? Infinity);
                          return (
                            <button
                              key={opt}
                              type="button"
                              disabled={full}
                              onClick={() => {
                                const next = { ...values, [line.id]: (on ? chosen.filter((x) => x !== opt) : [...chosen, opt]).join(SEPARATOR) };
                                setValues(next);
                                onDraft?.(next);
                              }}
                              className={`rounded-full px-3 py-1.5 font-display text-sm font-semibold transition disabled:opacity-40 ${
                                on ? 'bg-ink text-white' : 'bg-surface ring-1 ring-line hover:ring-lavender-strong/40'
                              }`}
                            >
                              {on ? '✓ ' : ''}
                              {opt}
                            </button>
                          );
                        })}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="font-display font-bold text-muted">→</span>
                        <input
                          value={values[line.id]}
                          onChange={(e) => setValues((v) => ({ ...v, [line.id]: e.target.value }))}
                          onBlur={() => onDraft?.(values)}
                          placeholder={line.placeholder}
                          className={`min-w-0 flex-1 rounded-xl bg-surface px-3 py-2 ring-1 focus:bg-white focus:outline-none focus:ring-2 ${
                            c.forbidden || c.tooLong ? 'ring-2 ring-pink-strong' : 'ring-line focus:ring-lavender-strong'
                          }`}
                        />
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        ))}

        {config.checkNote && (
          <p className="flex items-start gap-2 rounded-2xl bg-sky p-3 text-sm">
            <span>🔎</span>
            <span>
              <b>Revisa:</b> {config.checkNote}
            </span>
          </p>
        )}

        <div className={`rounded-2xl p-3 text-sm ${firstForbidden ? 'bg-pink' : 'bg-surface'}`}>
          <p className="font-semibold">⛔ Respuestas prohibidas:</p>
          <ul className="mt-1 space-y-0.5">
            {config.forbidden.map((f) => (
              <li key={f.word} className={firstForbidden?.forbidden?.word === f.word ? 'font-semibold text-pink-strong' : 'text-ink/70'}>
                <span className="rounded-full bg-white px-2 py-0.5 font-display text-xs font-semibold">&ldquo;{f.word}&rdquo;</span> {f.reason}
              </li>
            ))}
          </ul>
        </div>

        <Button type="submit" variant="gradient" size="lg" disabled={!isValid} className="w-full">
          {missing > 0
            ? `Completa ${missing} ítem${missing === 1 ? '' : 's'}`
            : tooLong > 0
              ? `Recorta ${tooLong} línea${tooLong === 1 ? '' : 's'} demasiado larga${tooLong === 1 ? '' : 's'}`
              : firstForbidden
                ? `Cambia "${firstForbidden.forbidden!.word}"`
                : 'Pegar en mi Canvas 📌'}
        </Button>
      </form>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-muted">Así quedará en tu Canvas</p>
        <motion.div layout className={`rotate-1 rounded-[28px] p-4 shadow-float ${TONES[tone].soft}`}>
          <div className="mb-1 flex items-center gap-3">
            <IconTile icon={blockIcon} tone={tone} size="sm" className="bg-white!" />
            <p className="font-display text-lg font-bold leading-tight">{blockTitle}</p>
          </div>
          <LinesView config={config} entry={values} />
        </motion.div>
      </aside>
    </div>
  );
}
