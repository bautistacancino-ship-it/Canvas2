import { TERM_PATTERNS } from '@/data/glossary';

/* Búsqueda de términos en un texto: formas del glosario + plural (s/es), con límites de palabra
 * que respetan tildes y ñ. Si dos coincidencias se pisan, gana la más larga ("SEO local" > "SEO"). */

export type TextSegment = string | { termId: string; text: string };

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cache = new Map<string, RegExp[]>();

function regexesFor(termIds: string[]): { termId: string; re: RegExp }[] {
  return termIds.flatMap((id) => {
    const p = TERM_PATTERNS[id];
    if (!p) return [];
    const key = `${id}`;
    let res = cache.get(key);
    if (!res) {
      res = p.forms.map(
        (form) => new RegExp(`(?<![\\p{L}\\p{N}])${escape(form)}(?:s|es)?(?![\\p{L}\\p{N}])`, p.caseSensitive ? 'gu' : 'giu'),
      );
      cache.set(key, res);
    }
    return res.map((re) => ({ termId: id, re }));
  });
}

/** Encuentra todas las coincidencias (sin solapes) de los términos permitidos. */
export function findTerms(text: string, termIds: string[]) {
  const hits: { termId: string; start: number; end: number }[] = [];
  for (const { termId, re } of regexesFor(termIds)) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) hits.push({ termId, start: m.index!, end: m.index! + m[0].length });
  }
  hits.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  const result: typeof hits = [];
  let cursor = 0;
  for (const h of hits) {
    if (h.start < cursor) continue;
    result.push(h);
    cursor = h.end;
  }
  return result;
}
