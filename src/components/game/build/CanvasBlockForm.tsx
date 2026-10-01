'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { TONES, type Tone } from '@/lib/tones';
import type { CanvasEntry, FieldsBuildConfig } from '@/types/game';

interface CanvasBlockFormProps {
  blockTitle: string;
  blockIcon: string;
  tone: Tone;
  config: FieldsBuildConfig;
  initialValues?: CanvasEntry;
  /** Guardado de borrador al salir de un campo (persistencia en localStorage). */
  onDraft?: (values: CanvasEntry) => void;
  onSubmit: (values: CanvasEntry) => void;
}

const inputClass =
  'mt-2 w-full rounded-2xl bg-surface px-4 py-3 text-ink ring-1 ring-line placeholder:text-muted/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lavender-strong';

export function CanvasBlockForm({
  blockTitle,
  blockIcon,
  tone,
  config,
  initialValues,
  onDraft,
  onSubmit,
}: CanvasBlockFormProps) {
  const [values, setValues] = useState<CanvasEntry>(() =>
    Object.fromEntries(config.fields.map((f) => [f.id, initialValues?.[f.id] ?? ''])),
  );

  const fieldIsValid = (id: string) => {
    const field = config.fields.find((f) => f.id === id)!;
    const value = values[id]?.trim() ?? '';
    if (field.kind === 'select') return value.length > 0;
    return value.length >= (field.minLength ?? 0);
  };
  const isValid = config.fields.every((f) => fieldIsValid(f.id));
  const doneCount = config.fields.filter((f) => fieldIsValid(f.id) && values[f.id]?.trim()).length;

  const update = (id: string, value: string) => setValues((v) => ({ ...v, [id]: value }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form
        data-tour="build-form"
        className={`${cardClass} space-y-5 p-5 sm:p-7`}
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid) onSubmit(values);
        }}
      >
        <p className="text-ink/70">{config.intro}</p>

        {config.fields.map((field) => {
          const value = values[field.id];
          const min = field.minLength ?? 0;
          const ok = fieldIsValid(field.id);
          return (
            <label key={field.id} className="block">
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-display text-lg font-semibold">{field.label}</span>
                {field.kind === 'textarea' && min > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 font-display text-xs font-semibold tabular-nums ${
                      ok ? 'bg-lime text-lime-strong' : 'bg-surface text-muted'
                    }`}
                  >
                    {ok ? '✓' : `${value.trim().length}/${min}`}
                  </span>
                )}
              </span>
              <span className="block text-xs text-muted">{field.helper}</span>

              {field.kind === 'select' ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {field.options?.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        const next = { ...values, [field.id]: opt };
                        setValues(next);
                        onDraft?.(next);
                      }}
                      className={`rounded-full px-4 py-2 font-display text-sm font-semibold transition ${
                        value === opt ? 'bg-ink text-white' : 'bg-surface text-ink ring-1 ring-line hover:ring-lavender-strong/40'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={value}
                  rows={3}
                  placeholder={field.placeholder}
                  onChange={(e) => update(field.id, e.target.value)}
                  onBlur={() => onDraft?.(values)}
                  className={`${inputClass} resize-y`}
                />
              )}
            </label>
          );
        })}

        <Button type="submit" variant="gradient" size="lg" disabled={!isValid} className="w-full">
          Pegar en mi Canvas 📌
        </Button>
      </form>

      {/* Vista previa tipo sticker */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-muted">Vista previa</p>
        <motion.div layout className={`rotate-1 rounded-[28px] p-5 shadow-float ${TONES[tone].soft}`}>
          <div className="flex items-center gap-3">
            <IconTile icon={blockIcon} tone={tone} size="sm" className="bg-white!" />
            <p className="font-display text-lg font-bold leading-tight">{blockTitle}</p>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {config.fields.map((field) =>
              values[field.id]?.trim() ? (
                <div key={field.id} className="rounded-2xl bg-white/70 p-3">
                  <p className={`text-[11px] font-bold uppercase tracking-wide ${TONES[tone].text}`}>{field.label}</p>
                  <p className="mt-0.5 whitespace-pre-line">{values[field.id]}</p>
                </div>
              ) : null,
            )}
            {doneCount === 0 && <p className="italic text-ink/50">Empieza a escribir…</p>}
          </div>
        </motion.div>
      </aside>
    </div>
  );
}
