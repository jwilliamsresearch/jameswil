/**
 * Scans the lecture decks and writes a manifest the Astro site consumes, so
 * the teaching pages can list sessions without the two repos being coupled.
 * Re-run this whenever decks are added or renamed.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const LECTURES = 'c:/Users/JFLWi/jameswil/lectures_data';
const OUT = 'c:/Users/JFLWi/jameswil/jameswil/src/data/lectures.json';

const strip = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const entries = await readdir(LECTURES, { withFileTypes: true });
const courses = entries
  .filter((e) => e.isDirectory() && e.name !== 'libs')
  .map((e) => e.name)
  .sort();

const modules = [];

for (const code of courses) {
  const dirs = (await readdir(join(LECTURES, code), { withFileTypes: true }))
    .filter((e) => e.isDirectory() && /^session\d+$/.test(e.name))
    .map((e) => Number.parseInt(e.name.replace('session', ''), 10))
    .sort((a, b) => a - b);

  if (!dirs.length) continue;

  const sessions = [];

  for (const n of dirs) {
    const html = await readFile(join(LECTURES, code, `session${n}`, 'index.html'), 'utf8');

    // Module names are not reliable here: some decks put the module in h1,
    // others put the session topic there. Titles come from the teaching
    // content collection instead, which a human maintains.
    const bar = html.match(/<span class="jw-session">([\s\S]*?)<\/span>/i);
    const h2 = html.match(/<h2[^>]*>\s*Session\s*\d+\s*:\s*([\s\S]*?)<\/h2>/i);
    const label = strip(bar?.[1] ?? h2?.[1] ?? `Session ${n}`);

    sessions.push({ n, title: label, url: `/lectures/${code}/session${n}/` });
  }

  modules.push({
    code,
    slug: code.toLowerCase(),
    url: `/lectures/${code}/`,
    sessions,
  });
}

await writeFile(OUT, `${JSON.stringify(modules, null, 2)}\n`, 'utf8');

console.log(modules.map((m) => `${m.code.padEnd(16)} ${m.sessions.length}  ${m.title}`).join('\n'));
