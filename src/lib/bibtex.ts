/**
 * A small, dependency-free BibTeX reader.
 *
 * Handles the parts that actually appear in real .bib files: nested braces,
 * quoted values, bare numbers, trailing commas, comments, and the LaTeX
 * escaping conventions used for accents and special characters.
 */

export interface BibEntry {
  key: string;
  type: string;
  fields: Record<string, string>;
}

/* ------------------------------------------------------------------ text -- */

/**
 * Repairs UTF-8 bytes that were decoded as Windows-1252 somewhere upstream,
 * which is how "en dash" becomes the three-character sequence you often see
 * pasted out of reference managers.
 */
function repairEncoding(input: string): string {
  if (!/[ÃÂâ€]/.test(input)) return input;
  try {
    const bytes = new Uint8Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const code = input.charCodeAt(i);
      if (code > 0xff) return input; // Genuine non-Latin1 text, leave alone.
      bytes[i] = code;
    }
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return input;
  }
}

const LATEX_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\\%/g, '%'],
  [/\\&/g, '&'],
  [/\\\$/g, '$'],
  [/\\#/g, '#'],
  [/\\_/g, '_'],
  [/\\textendash\s*/g, '–'],
  [/\\textemdash\s*/g, '—'],
  [/``/g, '“'],
  [/''/g, '”'],
  [/~/g, ' '],
  [/\\,/g, ' '],
  [/\\\s/g, ' '],
];

/** Accented characters written the LaTeX way, for example \'{e} or \"o. */
const ACCENTS: Record<string, Record<string, string>> = {
  "'": { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', y: 'ý', c: 'ć', n: 'ń', s: 'ś', z: 'ź', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú' },
  '`': { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', A: 'À', E: 'È', I: 'Ì', O: 'Ò', U: 'Ù' },
  '"': { a: 'ä', e: 'ë', i: 'ï', o: 'ö', u: 'ü', y: 'ÿ', A: 'Ä', E: 'Ë', I: 'Ï', O: 'Ö', U: 'Ü' },
  '^': { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û', A: 'Â', E: 'Ê', I: 'Î', O: 'Ô', U: 'Û' },
  '~': { a: 'ã', n: 'ñ', o: 'õ', A: 'Ã', N: 'Ñ', O: 'Õ' },
  c: { c: 'ç', s: 'ş', C: 'Ç', S: 'Ş' },
  v: { c: 'č', s: 'š', z: 'ž', r: 'ř', C: 'Č', S: 'Š', Z: 'Ž' },
  u: { g: 'ğ', G: 'Ğ' },
};

function decodeLatex(input: string): string {
  let out = repairEncoding(input);

  out = out.replace(/\\(['`"^~cvu])\{?(\w)\}?/g, (match, accent: string, letter: string) => {
    return ACCENTS[accent]?.[letter] ?? match;
  });

  for (const [pattern, replacement] of LATEX_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }

  // Braces in BibTeX only protect capitalisation. They are not content.
  out = out.replace(/[{}]/g, '');

  return out.replace(/\s+/g, ' ').trim();
}

/* ----------------------------------------------------------------- parse -- */

export function parseBibtex(source: string): BibEntry[] {
  const text = repairEncoding(source);
  const entries: BibEntry[] = [];
  let i = 0;

  const isSpace = (c: string) => c === ' ' || c === '\t' || c === '\n' || c === '\r';
  const skipSpace = () => {
    while (i < text.length && isSpace(text[i])) i++;
  };

  while (i < text.length) {
    if (text[i] !== '@') {
      i++;
      continue;
    }
    i++; // past '@'

    let type = '';
    while (i < text.length && /[A-Za-z]/.test(text[i])) type += text[i++];
    type = type.toLowerCase();

    skipSpace();
    if (text[i] !== '{') continue;
    i++; // past '{'

    // @string, @comment and @preamble are not publications.
    if (type === 'string' || type === 'comment' || type === 'preamble') continue;

    let key = '';
    while (i < text.length && text[i] !== ',' && text[i] !== '}') key += text[i++];
    key = key.trim();
    if (text[i] === ',') i++;

    const fields: Record<string, string> = {};

    while (i < text.length) {
      skipSpace();
      if (text[i] === '}') {
        i++;
        break;
      }
      if (text[i] === ',') {
        i++;
        continue;
      }

      let name = '';
      while (i < text.length && /[A-Za-z0-9_-]/.test(text[i])) name += text[i++];
      skipSpace();
      if (text[i] !== '=') {
        i++;
        continue;
      }
      i++; // past '='
      skipSpace();

      let raw = '';
      if (text[i] === '{') {
        let depth = 0;
        do {
          if (text[i] === '{') depth++;
          else if (text[i] === '}') depth--;
          if (depth > 0) raw += text[i];
          i++;
        } while (i < text.length && depth > 0);
      } else if (text[i] === '"') {
        i++;
        while (i < text.length && text[i] !== '"') raw += text[i++];
        i++;
      } else {
        while (i < text.length && text[i] !== ',' && text[i] !== '}') raw += text[i++];
      }

      const clean = decodeLatex(raw);
      if (name && clean) fields[name.toLowerCase()] = clean;
    }

    if (key) entries.push({ key, type, fields });
  }

  return entries;
}

/* --------------------------------------------------------------- authors -- */

export interface Author {
  given: string;
  family: string;
  full: string;
  /** Rendered as "Family, G." for reference lists. */
  short: string;
}

export function parseAuthors(field: string | undefined): Author[] {
  if (!field) return [];

  return field
    .split(/\s+and\s+/i)
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => {
      let given = '';
      let family = '';

      if (name.includes(',')) {
        const [last, rest = ''] = name.split(',');
        family = last.trim();
        given = rest.trim();
      } else {
        const parts = name.split(/\s+/);
        family = parts.pop() ?? '';
        given = parts.join(' ');
      }

      const initials = given
        .split(/[\s.-]+/)
        .filter(Boolean)
        .map((part) => `${part[0].toUpperCase()}.`)
        .join(' ');

      return {
        given,
        family,
        full: given ? `${given} ${family}` : family,
        short: initials ? `${family}, ${initials}` : family,
      };
    });
}
