/**
 * Rebuilds src/data/lectures.json from the deck site itself.
 *
 * This used to scan a local folder, which drifted: the manifest listed three
 * modules that were never published, so 36 links on the teaching pages 404'd,
 * and it missed CMU601, which was live. Crawling the deployment means the
 * teaching pages can only link to decks that actually resolve.
 *
 * Deck file naming is not uniform (session1.html on most modules, week5.html
 * on CMU601), so names are read rather than assumed.
 *
 * Usage:  node scripts/sync-lectures.mjs
 *         node scripts/sync-lectures.mjs https://lectures.jameswil.com
 */
import { writeFileSync } from 'node:fs';

const ORIGIN = (process.argv[2] ?? 'https://lectures.jameswil.com').replace(/\/+$/, '');
const OUT = new URL('../src/data/lectures.json', import.meta.url);

const strip = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

async function get(path) {
  const res = await fetch(`${ORIGIN}${path}`);
  if (!res.ok) throw new Error(`${res.status} on ${path}`);
  return res.text();
}

/** Module codes are the directories linked from the deck site index. */
async function moduleCodes() {
  const html = await get('/');
  return [...new Set([...html.matchAll(/href="([A-Za-z0-9-]+)\/index\.html"/g)].map((m) => m[1]))];
}

/** Every slideshow linked from a module page, in document order. */
async function sessions(code) {
  const html = await get(`/${code}/`);
  const seen = new Map();
  for (const m of html.matchAll(/href="(slideshows\/([^"]+)\.html)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const [, href, file, label] = m;
    if (seen.has(href)) continue;
    seen.set(href, {
      n: Number(file.match(/\d+/)?.[0] ?? seen.size + 1),
      title: strip(label) || file,
      url: `/${code}/${href}`,
    });
  }
  return [...seen.values()].sort((a, b) => a.n - b.n);
}

const modules = [];
for (const code of await moduleCodes()) {
  const list = await sessions(code);
  if (list.length === 0) continue;
  modules.push({ code, slug: code.toLowerCase(), url: `/${code}/`, sessions: list });
  console.log(`${code.padEnd(16)} ${list.length} decks`);
}

modules.sort((a, b) => a.code.localeCompare(b.code));
writeFileSync(OUT, `${JSON.stringify(modules, null, 2)}\n`, 'utf8');
console.log(`wrote ${modules.length} modules to src/data/lectures.json`);
