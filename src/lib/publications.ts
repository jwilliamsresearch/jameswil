import { parseBibtex, parseAuthors, type Author } from './bibtex';
import { ORIGIN, SITE } from '../consts';
import { absoluteUrl } from './paths';

/* Astro inlines the .bib at build time, so adding an entry to the file is the
   entire workflow for adding a publication to the site. */
import bibSource from '../data/references.bib?raw';

export type PublicationKind =
  | 'Journal article'
  | 'Conference paper'
  | 'Preprint'
  | 'Dataset'
  | 'Thesis'
  | 'Article';

export interface Publication {
  key: string;
  slug: string;
  type: string;
  kind: PublicationKind;
  title: string;
  authors: Author[];
  authorLine: string;
  year: number;
  month?: string;
  /** Journal, proceedings or institution, whichever applies. */
  venue?: string;
  venueShort?: string;
  publisher?: string;
  address?: string;
  pages?: string;
  volume?: string;
  number?: string;
  school?: string;
  doi?: string;
  doiUrl?: string;
  url?: string;
  externalUrl?: string;
  /** Site-relative path to a PDF in public/assets/papers, when one exists. */
  pdf?: string;
  abstract?: string;
  keywords: string[];
  selected: boolean;
  bibtex: string;
  citation: string;
}

/* PDFs live in public/assets/papers and are named after their citation key,
   so a new paper only needs its file dropped in beside the others. */
const PDF_FILES = new Set(
  Object.keys(import.meta.glob('/public/assets/papers/*.pdf', { eager: false })).map((path) =>
    path.replace('/public/assets/papers/', '').replace(/\.pdf$/i, ''),
  ),
);

const MONTH_INDEX: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9,
  september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

function slugify(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function classify(type: string, fields: Record<string, string>): PublicationKind {
  const howPublished = (fields.howpublished ?? '').toLowerCase();
  const abbr = (fields.abbr ?? '').toLowerCase();

  if (howPublished.includes('preprint') || abbr.includes('preprint') || abbr === 'techrxiv') {
    return 'Preprint';
  }
  if (type === 'phdthesis' || type === 'mastersthesis') return 'Thesis';
  if (type === 'inproceedings' || type === 'conference') return 'Conference paper';
  if (type === 'misc') {
    const url = fields.url ?? '';
    if (/zenodo|figshare|dataverse|dryad/i.test(url)) return 'Dataset';
    return 'Article';
  }
  if (type === 'article') return 'Journal article';
  return 'Article';
}

function buildAuthorLine(authors: Author[]): string {
  if (authors.length === 0) return '';
  if (authors.length === 1) return authors[0].short;
  if (authors.length === 2) return `${authors[0].short} & ${authors[1].short}`;
  return `${authors.slice(0, -1).map((a) => a.short).join(', ')} & ${authors.at(-1)!.short}`;
}

function buildCitation(pub: Omit<Publication, 'citation' | 'bibtex'>): string {
  const bits = [`${pub.authorLine} (${pub.year}).`, `${pub.title}.`];

  if (pub.kind === 'Thesis') {
    bits.push(`${pub.type === 'phdthesis' ? 'PhD thesis' : "Master's thesis"}, ${pub.school ?? ''}.`);
  } else if (pub.venue) {
    let venue = pub.venue;
    if (pub.volume) venue += `, ${pub.volume}`;
    if (pub.number) venue += `(${pub.number})`;
    if (pub.pages) venue += `, ${pub.pages}`;
    bits.push(`${venue}.`);
  }

  if (pub.publisher && pub.kind !== 'Thesis') bits.push(`${pub.publisher}.`);
  if (pub.doiUrl) bits.push(pub.doiUrl);

  return bits.join(' ').replace(/\s+/g, ' ').replace(/\.\./g, '.').trim();
}

function buildBibtex(key: string, type: string, fields: Record<string, string>): string {
  const skip = new Set(['bibtex_show', 'abbr', 'selected']);
  const rows = Object.entries(fields)
    .filter(([name, value]) => !skip.has(name) && value)
    .map(([name, value]) => `  ${name.padEnd(12)} = {${value}}`);
  return `@${type}{${key},\n${rows.join(',\n')}\n}`;
}

function build(): Publication[] {
  const entries = parseBibtex(bibSource);

  const publications = entries.map<Publication>((entry) => {
    const f = entry.fields;
    const authors = parseAuthors(f.author);
    const kind = classify(entry.type, f);

    const venue =
      f.journal ??
      f.booktitle ??
      (kind === 'Thesis' ? f.school : undefined) ??
      (kind === 'Preprint' ? f.abbr : undefined);

    const rawUrl = f.url ?? '';
    const isLocalPdf = rawUrl.startsWith('/assets/papers/');
    const pdfFromUrl = isLocalPdf ? rawUrl : undefined;
    const pdfFromKey = PDF_FILES.has(entry.key) ? `/assets/papers/${entry.key}.pdf` : undefined;

    const doi = f.doi?.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');

    const base = {
      key: entry.key,
      slug: slugify(entry.key),
      type: entry.type,
      kind,
      title: f.title ?? entry.key,
      authors,
      authorLine: buildAuthorLine(authors),
      year: Number.parseInt(f.year ?? '0', 10) || 0,
      month: f.month,
      venue,
      venueShort: f.abbr,
      publisher: f.publisher,
      address: f.address,
      pages: f.pages,
      volume: f.volume,
      number: f.number,
      school: f.school,
      doi,
      doiUrl: doi ? `https://doi.org/${doi}` : undefined,
      url: rawUrl || undefined,
      externalUrl: rawUrl && !isLocalPdf ? rawUrl : undefined,
      pdf: pdfFromKey ?? pdfFromUrl,
      abstract: f.abstract,
      keywords: (f.keywords ?? '')
        .split(/[;,]/)
        .map((k) => k.trim())
        .filter(Boolean),
      selected: f.selected === 'true',
    };

    return {
      ...base,
      citation: buildCitation(base),
      bibtex: buildBibtex(entry.key, entry.type, f),
    };
  });

  return publications.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    const am = MONTH_INDEX[(a.month ?? '').toLowerCase()] ?? 0;
    const bm = MONTH_INDEX[(b.month ?? '').toLowerCase()] ?? 0;
    if (bm !== am) return bm - am;
    return a.title.localeCompare(b.title);
  });
}

export const publications: Publication[] = build();

export const selectedPublications = publications.filter((p) => p.selected);

export function publicationsByYear(): Array<{ year: number; items: Publication[] }> {
  const groups = new Map<number, Publication[]>();
  for (const pub of publications) {
    const list = groups.get(pub.year) ?? [];
    list.push(pub);
    groups.set(pub.year, list);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }));
}

export function getPublication(slug: string): Publication | undefined {
  return publications.find((p) => p.slug === slug);
}

/** Trimmed abstract for meta descriptions, cut on a word boundary. */
export function metaDescription(pub: Publication, limit = 158): string {
  const source = pub.abstract ?? `${pub.title}. ${pub.authorLine} (${pub.year}).`;
  if (source.length <= limit) return source;
  const cut = source.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/** Highwire Press tags. This is what Google Scholar actually indexes. */
export function scholarMeta(pub: Publication): Array<{ name: string; content: string }> {
  const tags: Array<{ name: string; content: string }> = [
    { name: 'citation_title', content: pub.title },
  ];

  for (const author of pub.authors) {
    tags.push({ name: 'citation_author', content: `${author.family}, ${author.given}`.trim() });
  }

  if (pub.year) tags.push({ name: 'citation_publication_date', content: String(pub.year) });
  if (pub.kind === 'Journal article' && pub.venue) {
    tags.push({ name: 'citation_journal_title', content: pub.venue });
  }
  if (pub.kind === 'Conference paper' && pub.venue) {
    tags.push({ name: 'citation_conference_title', content: pub.venue });
  }
  if (pub.kind === 'Thesis' && pub.school) {
    tags.push({ name: 'citation_dissertation_institution', content: pub.school });
  }
  if (pub.publisher) tags.push({ name: 'citation_publisher', content: pub.publisher });
  if (pub.volume) tags.push({ name: 'citation_volume', content: pub.volume });
  if (pub.number) tags.push({ name: 'citation_issue', content: pub.number });
  if (pub.pages) {
    const [first, last] = pub.pages.split(/[-–—]+/);
    if (first) tags.push({ name: 'citation_firstpage', content: first.trim() });
    if (last) tags.push({ name: 'citation_lastpage', content: last.trim() });
  }
  if (pub.doi) tags.push({ name: 'citation_doi', content: pub.doi });
  if (pub.pdf) tags.push({ name: 'citation_pdf_url', content: absoluteUrl(ORIGIN, pub.pdf) });

  return tags;
}
