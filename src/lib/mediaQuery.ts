import type { CanvasEntry, MediaQueryBuildConfig } from '@/types/game';

/** Las respuestas del segmento secundario se guardan con este prefijo. */
export const SECONDARY_PREFIX = 'sec.';

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Devuelve la primera palabra prohibida encontrada (sin importar tildes ni mayúsculas). */
export function findForbiddenWord(text: string, words: string[]) {
  const haystack = normalize(text);
  return words.find((word) => new RegExp(`(^|[^a-z0-9])${normalize(word)}($|[^a-z0-9])`).test(haystack));
}

export function hasSecondary(config: MediaQueryBuildConfig, entry: CanvasEntry) {
  return [...config.conditions, ...config.declarations].some((f) => entry[SECONDARY_PREFIX + f.id]?.trim());
}
