'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FormulaView } from '@/components/canvas/FormulaView';
import { MediaQueryCode } from '@/components/canvas/MediaQueryCode';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { findForbiddenWord } from '@/lib/mediaQuery';
import { TONES, toneAt, type Tone } from '@/lib/tones';
import type { BuildConfig, CanvasEntry, FormulaBuildConfig } from '@/types/game';
import { countWords, formulaText } from '../shared/FormulaSentence';
import { T } from '@/components/glossary/Terms';

const MIN_LENGTH = 3;
/** Velocidad de lectura en voz alta (~210 palabras por minuto). */
const WORDS_PER_SECOND = 3.5;

interface FormulaBuilderProps {
  blockTitle: string;
  blockIcon: string;
  tone: Tone;
  config: FormulaBuildConfig;
  initialValues?: CanvasEntry;
  /** Lo que el jugador escribió en el bloque de referencia (ej. su media query de Segmentos). */
  reference?: { build?: BuildConfig; entry?: CanvasEntry };
  onDraft?: (values: CanvasEntry) => void;
  onSubmit: (values: CanvasEntry) => void;
}

/** Fase 4: la propuesta en una frase (máx. N palabras) + el Fit en 3 líneas. */
export function FormulaBuilder({ blockTitle, blockIcon, tone, config, initialValues = {}, reference, onDraft, onSubmit }: FormulaBuilderProps) {
  const blanks = config.parts.filter((p) => typeof p !== 'string');
  const lineIds = config.lines.flatMap((l) => (l.how ? [l.id, l.how.id] : [l.id]));
  const allIds = [...blanks.map((b) => b.id), ...lineIds];
  const [values, setValues] = useState<CanvasEntry>(() => Object.fromEntries(allIds.map((id) => [id, initialValues[id] ?? ''])));
  const [testing, setTesting] = useState(false);

  const sentence = formulaText(config.parts, values);
  const words = countWords(sentence);
  const readSeconds = words / WORDS_PER_SECOND;
  const forbidden = allIds.map((id) => ({ id, word: findForbiddenWord(values[id] ?? '', config.forbiddenWords) })).find((f) => f.word);
  const missing = allIds.filter((id) => (values[id] ?? '').trim().length < MIN_LENGTH).length;
  const tooLong = words > config.maxWords;
  const isValid = missing === 0 && !tooLong && !forbidden;

  const update = (id: string, value: string) => setValues((v) => ({ ...v, [id]: value }));
  const referenceValue = config.reference && reference?.entry?.[config.reference.fieldId];

  const inputClass = (id: string, extra = '') =>
    `min-w-0 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 ${
      forbidden?.id === id ? 'ring-2 ring-pink-strong' : 'focus:ring-lavender-strong'
    } ${extra}`;

  let blankIndex = -1;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form
        data-tour="build-form"
        className={`${cardClass} space-y-6 p-5 sm:p-7`}
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid) onSubmit(values);
        }}
      >
        <p className="text-ink/75">
          🛠️ <T>{config.intro}</T>
        </p>

        {reference?.entry && reference.build?.kind === 'media-query' && (
          <div className="rounded-3xl bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display font-semibold">📎 Tu media query de Segmentos</p>
              {referenceValue && config.reference && (
                <Button
                  variant="soft"
                  size="sm"
                  onClick={() => {
                    const next = { ...values, [config.reference!.targetId]: referenceValue };
                    setValues(next);
                    onDraft?.(next);
                  }}
                >
                  ↓ {config.reference.label}
                </Button>
              )}
            </div>
            <MediaQueryCode config={reference.build} entry={reference.entry} className="mt-2" />
          </div>
        )}

        {/* 1 · La frase */}
        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-lg font-bold">1 · Tu propuesta en una frase</p>
            <span
              className={`rounded-full px-3 py-1 font-display text-sm font-semibold tabular-nums ${
                tooLong ? 'bg-pink text-pink-strong' : 'bg-lime text-lime-strong'
              }`}
            >
              {words}/{config.maxWords} palabras
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-lg leading-relaxed">
            {config.parts.map((part, i) => {
              if (typeof part === 'string') return <span key={i} className="font-display font-semibold">{part.trim()}</span>;
              blankIndex++;
              const t = TONES[toneAt(blankIndex)];
              return (
                <input
                  key={part.id}
                  value={values[part.id]}
                  onChange={(e) => update(part.id, e.target.value)}
                  onBlur={() => onDraft?.(values)}
                  placeholder={part.placeholder ?? part.label}
                  aria-label={part.label}
                  title={part.label}
                  className={inputClass(part.id, `flex-1 basis-56 ${t.soft} placeholder:text-ink/35`)}
                />
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className={`rounded-full px-3 py-1 font-semibold ${readSeconds <= config.readingSeconds ? 'bg-lime text-lime-strong' : 'bg-pink text-pink-strong'}`}>
              ⏱️ ~{readSeconds.toLocaleString('es-CL', { maximumFractionDigits: 1 })} s de lectura
            </span>
            <Button variant="soft" size="sm" disabled={words < 6} onClick={() => setTesting(true)}>
              Hacer el test de {config.readingSeconds} segundos
            </Button>
          </div>
        </section>

        {/* 2 · El Fit */}
        <section>
          <p className="font-display text-lg font-bold">2 · {config.linesTitle}</p>
          <div className="mt-3 space-y-3">
            {config.lines.map((line) => (
              <div key={line.id}>
                <p className="mb-1 text-sm font-semibold">
                  {line.icon} {line.label}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={values[line.id]}
                    onChange={(e) => update(line.id, e.target.value)}
                    onBlur={() => onDraft?.(values)}
                    placeholder={line.placeholder}
                    aria-label={line.label}
                    className={inputClass(line.id, 'flex-1 basis-56 bg-surface ring-1 ring-line')}
                  />
                  {line.how && (
                    <>
                      <span className="font-display font-bold text-muted">→ cómo</span>
                      <input
                        value={values[line.how.id]}
                        onChange={(e) => update(line.how!.id, e.target.value)}
                        onBlur={() => onDraft?.(values)}
                        placeholder={line.how.placeholder}
                        aria-label={`${line.label}: cómo`}
                        className={inputClass(line.how.id, 'flex-1 basis-56 bg-surface ring-1 ring-line')}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div data-tour="build-forbidden" className={`rounded-2xl p-3 text-sm ${forbidden ? 'bg-pink' : 'bg-surface'}`}>
          <p className="font-semibold">
            ⛔ Palabras prohibidas:{' '}
            {config.forbiddenWords.map((w) => (
              <span key={w} className="mr-1 inline-block rounded-full bg-white px-2 py-0.5 font-display text-xs font-semibold">
                {w}
              </span>
            ))}
          </p>
          {forbidden && (
            <p className="mt-1 text-pink-strong">
              Usaste &ldquo;{forbidden.word}&rdquo;. Si las usas, tu propuesta podría estar en la web de cualquier agencia.
            </p>
          )}
        </div>

        <Button type="submit" variant="gradient" size="lg" disabled={!isValid} className="w-full">
          {missing > 0
            ? `Completa ${missing} espacio${missing === 1 ? '' : 's'}`
            : tooLong
              ? `Recorta: te pasaste por ${words - config.maxWords} palabra${words - config.maxWords === 1 ? '' : 's'}`
              : 'Pegar en mi Canvas 📌'}
        </Button>
      </form>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-muted">Así quedará en tu Canvas</p>
        <motion.div layout className={`-rotate-1 rounded-[28px] p-4 shadow-float ${TONES[tone].soft}`}>
          <div className="mb-1 flex items-center gap-3">
            <IconTile icon={blockIcon} tone={tone} size="sm" className="bg-white!" />
            <p className="font-display text-lg font-bold leading-tight">{blockTitle}</p>
          </div>
          <FormulaView config={config} entry={values} />
        </motion.div>
      </aside>

      <AnimatePresence>
        {testing && <ReadingTest sentence={sentence} seconds={config.readingSeconds} onClose={() => setTesting(false)} />}
      </AnimatePresence>
    </div>
  );
}

/** Test de 5 segundos: la frase aparece en grande con una barra de tiempo; luego, autoevaluación. */
function ReadingTest({ sentence, seconds, onClose }: { sentence: string; seconds: number; onClose: () => void }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDone(true), seconds * 1000);
    return () => window.clearTimeout(id);
  }, [seconds]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
    >
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`${cardClass} w-full max-w-xl p-6 text-center`}>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Léela en voz alta</p>
        <p className="mt-3 font-display text-2xl font-bold leading-snug">{sentence}</p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-[#ffac3a] to-[#ff5fa2]"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: seconds, ease: 'linear' }}
          />
        </div>
        {done ? (
          <div className="mt-5">
            <p className="font-display text-lg font-semibold">¿Alcanzaste a leerla completa, sin tener que explicarla?</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="soft" onClick={onClose}>
                No, la recorto ✂️
              </Button>
              <Button variant="gradient" onClick={onClose}>
                ¡Sí! ✓
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Tienes {seconds} segundos…</p>
        )}
      </motion.div>
    </motion.div>
  );
}
