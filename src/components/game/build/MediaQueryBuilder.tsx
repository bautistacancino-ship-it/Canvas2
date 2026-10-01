'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { MediaQueryCode } from '@/components/canvas/MediaQueryCode';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { Toggle } from '@/components/ui/Toggle';
import { SECONDARY_PREFIX, findForbiddenWord, hasSecondary } from '@/lib/mediaQuery';
import { TONES, type Tone } from '@/lib/tones';
import type { CanvasEntry, MediaQueryBuildConfig, MediaQueryField } from '@/types/game';

const MIN_LENGTH = 3;

interface MediaQueryBuilderProps {
  blockTitle: string;
  blockIcon: string;
  tone: Tone;
  config: MediaQueryBuildConfig;
  initialValues?: CanvasEntry;
  onDraft?: (values: CanvasEntry) => void;
  onSubmit: (values: CanvasEntry) => void;
}

/** Fase 4: el jugador completa los espacios en blanco de la media query de su cliente. */
export function MediaQueryBuilder({ blockTitle, blockIcon, tone, config, initialValues = {}, onDraft, onSubmit }: MediaQueryBuilderProps) {
  const allFields = [...config.conditions, ...config.declarations];
  const [values, setValues] = useState<CanvasEntry>(() =>
    Object.fromEntries(
      allFields.flatMap((f) => [
        [f.id, initialValues[f.id] ?? ''],
        [SECONDARY_PREFIX + f.id, initialValues[SECONDARY_PREFIX + f.id] ?? ''],
      ]),
    ),
  );
  const [secondaryOn, setSecondaryOn] = useState(() => hasSecondary(config, initialValues));

  const prefixes = secondaryOn ? ['', SECONDARY_PREFIX] : [''];
  const checks = prefixes.flatMap((prefix) =>
    allFields.map((field) => {
      const value = (values[prefix + field.id] ?? '').trim();
      const forbidden = findForbiddenWord(value, config.forbiddenWords);
      const filled = field.options ? value.length > 0 : value.length >= MIN_LENGTH;
      return { key: prefix + field.id, field, forbidden, filled };
    }),
  );
  const forbiddenHits = checks.filter((c) => c.forbidden);
  const missing = checks.filter((c) => !c.filled).length;
  const isValid = missing === 0 && forbiddenHits.length === 0;

  /** Lo que se guarda: sin las claves secundarias si el toggle está apagado. */
  const output = (source: CanvasEntry = values): CanvasEntry =>
    Object.fromEntries(Object.entries(source).filter(([k]) => secondaryOn || !k.startsWith(SECONDARY_PREFIX)));
  /** `commit` guarda el borrador de inmediato (para las opciones, que no tienen blur). */
  const update = (key: string, value: string, commit = false) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (commit) onDraft?.(output(next));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form
        className={`${cardClass} space-y-5 p-5 sm:p-7`}
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid) onSubmit(output());
        }}
      >
        <p className="text-ink/75">🛠️ {config.intro}</p>

        <div className="overflow-hidden rounded-3xl bg-ink shadow-float">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs text-white/50">{config.fileName}</span>
          </div>
          <div className="space-y-5 p-4 font-mono text-sm text-white">
            <QueryEditor config={config} prefix="" values={values} checks={checks} onChange={update} onBlur={() => onDraft?.(output())} />
            <AnimatePresence>
              {secondaryOn && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <p className="mb-2 text-white/40">/* Segmento secundario */</p>
                  <QueryEditor
                    config={config}
                    prefix={SECONDARY_PREFIX}
                    values={values}
                    checks={checks}
                    onChange={update}
                    onBlur={() => onDraft?.(output())}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {config.allowSecondary && (
          <div className="flex items-center gap-3 rounded-2xl bg-surface p-3">
            <span className="min-w-0 flex-1 text-sm">
              <span className="font-display font-semibold">➕ Segunda media query</span>
              <span className="block text-xs text-muted">Opcional: agrega tu segmento secundario.</span>
            </span>
            <Toggle checked={secondaryOn} onChange={setSecondaryOn} label="Agregar segmento secundario" />
          </div>
        )}

        <div className={`rounded-2xl p-3 text-sm ${forbiddenHits.length ? 'bg-pink' : 'bg-surface'}`}>
          <p className="font-semibold">
            ⛔ Palabras prohibidas:{' '}
            {config.forbiddenWords.map((w) => (
              <span key={w} className="mr-1 rounded-full bg-white px-2 py-0.5 font-display text-xs font-semibold">
                {w}
              </span>
            ))}
          </p>
          {forbiddenHits.length > 0 && (
            <p className="mt-1 text-pink-strong">
              Usaste &ldquo;{forbiddenHits[0].forbidden}&rdquo; en <b>{forbiddenHits[0].field.prop}</b>. Si las usas, tu agencia sigue sin
              breakpoints.
            </p>
          )}
        </div>

        <Button type="submit" variant="gradient" size="lg" disabled={!isValid} className="w-full">
          {missing > 0 ? `Completa ${missing} espacio${missing === 1 ? '' : 's'} en blanco` : 'Pegar en mi Canvas 📌'}
        </Button>
      </form>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-muted">Así quedará en tu Canvas</p>
        <motion.div layout className={`rotate-1 rounded-[28px] p-4 shadow-float ${TONES[tone].soft}`}>
          <div className="mb-3 flex items-center gap-3">
            <IconTile icon={blockIcon} tone={tone} size="sm" className="bg-white!" />
            <p className="font-display text-lg font-bold leading-tight">{blockTitle}</p>
          </div>
          <MediaQueryCode config={config} entry={output()} />
        </motion.div>
      </aside>
    </div>
  );
}

interface Check {
  key: string;
  field: MediaQueryField;
  forbidden?: string;
  filled: boolean;
}

function QueryEditor({
  config,
  prefix,
  values,
  checks,
  onChange,
  onBlur,
}: {
  config: MediaQueryBuildConfig;
  prefix: string;
  values: CanvasEntry;
  checks: Check[];
  onChange: (key: string, value: string, commit?: boolean) => void;
  onBlur: () => void;
}) {
  const stateOf = (id: string) => checks.find((c) => c.key === prefix + id);

  const input = (field: MediaQueryField) => {
    const state = stateOf(field.id);
    const key = prefix + field.id;
    if (field.options) {
      return (
        <span className="flex flex-wrap gap-1.5">
          {field.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(key, opt, true)}
              className={`rounded-lg px-2.5 py-1 font-sans text-xs font-semibold transition ${
                values[key] === opt ? 'bg-[#b5f07a] text-ink' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {opt}
            </button>
          ))}
        </span>
      );
    }
    return (
      <input
        value={values[key] ?? ''}
        onChange={(e) => onChange(key, e.target.value)}
        onBlur={onBlur}
        placeholder={field.placeholder}
        aria-label={field.prop}
        className={`min-w-0 flex-1 basis-44 rounded-lg bg-white/10 px-2 py-1 text-[#b5f07a] placeholder:text-white/25 focus:outline-none focus:ring-2 ${
          state?.forbidden ? 'ring-2 ring-pink-strong' : 'focus:ring-lavender-strong'
        }`}
      />
    );
  };

  return (
    <div className="space-y-2">
      {config.conditions.map((field, i) => (
        <div key={field.id} className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${i > 0 ? 'pl-4' : ''}`}>
          <span className="text-[#ff8fb8]">{i === 0 ? '@media' : 'and'}</span>
          <span className="text-white/50">(</span>
          <span className="text-[#9ec5ff]">{field.prop}:</span>
          {input(field)}
          <span className="text-white/50">
            ){i === config.conditions.length - 1 ? ' {' : ''}
          </span>
        </div>
      ))}
      {config.declarations.map((field) => (
        <div key={field.id} className="pl-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[#9ec5ff]">{field.prop}:</span>
            {input(field)}
            <span className="text-white/50">;</span>
          </div>
          {field.hint && <p className="mt-0.5 text-xs text-white/35">/* {field.hint} */</p>}
        </div>
      ))}
      <p className="text-white/50">{'}'}</p>
    </div>
  );
}
