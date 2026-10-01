import type { CanvasEntry, MediaQueryBuildConfig } from '@/types/game';

/** Las respuestas del segmento secundario se guardan con este prefijo. */
export const SECONDARY_PREFIX = 'sec.';

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Devuelve la primera palabra prohibida encontrada (sin importar tildes ni mayúsculas).
 * Los símbolos en los extremos se ignoran: "360°" también detecta "360".
 */
export function findForbiddenWord(text: string, words: string[]) {
  const haystack = normalize(text);
  return words.find((word) => {
    const core = normalize(word).replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
    return core && new RegExp(`(^|[^a-z0-9])${escapeRegExp(core)}($|[^a-z0-9])`).test(haystack);
  });
}

export function hasSecondary(config: MediaQueryBuildConfig, entry: CanvasEntry) {
  return [...config.conditions, ...config.declarations].some((f) => entry[SECONDARY_PREFIX + f.id]?.trim());
}
