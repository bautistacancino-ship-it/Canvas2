import { TONES, toneAt } from '@/lib/tones';
import type { FormulaPart } from '@/types/game';

/** Frase-plantilla con sus espacios coloreados; muestra valores si existen, o la etiqueta del espacio. */
export function FormulaSentence({
  parts,
  values = {},
  className = '',
}: {
  parts: FormulaPart[];
  values?: Record<string, string>;
  className?: string;
}) {
  let blank = -1;
  return (
    <p className={`leading-loose ${className}`}>
      {parts.map((part, i) => {
        if (typeof part === 'string') return <span key={i}>{part}</span>;
        blank++;
        const tone = TONES[toneAt(blank)];
        const value = values[part.id]?.trim();
        return (
          <span
            key={part.id}
            className={`mx-0.5 rounded-lg px-2 py-0.5 font-semibold ${tone.soft} ${value ? '' : `${tone.text} italic`}`}
          >
            {value || part.label}
          </span>
        );
      })}
    </p>
  );
}

/** Une las partes en texto plano (para contar palabras o guardar). */
export function formulaText(parts: FormulaPart[], values: Record<string, string>) {
  return parts.map((p) => (typeof p === 'string' ? p : values[p.id]?.trim() || '')).join('');
}

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
