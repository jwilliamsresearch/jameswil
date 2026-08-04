/**
 * Replaces each /lectures/<CODE>/ index with a redirect to the matching
 * teaching page, so the module description has one canonical home on the main
 * site. Individual decks at /lectures/<CODE>/sessionN/ are untouched.
 *
 * Only redirects where a teaching entry actually exists; otherwise the
 * standalone listing is left in place so nothing dead-ends.
 */
import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const LECTURES = 'c:/Users/JFLWi/jameswil/lectures_data';
const TEACHING = 'c:/Users/JFLWi/jameswil/jameswil/src/content/teaching';
const SITE = 'https://jameswil.com';

const manifest = JSON.parse(
  await readFile('c:/Users/JFLWi/jameswil/jameswil/src/data/lectures.json', 'utf8'),
);

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

const redirectPage = (label, target) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label}</title>
<link rel="canonical" href="${target}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${target}">
<script>window.location.replace(${JSON.stringify(target)});</script>
<style>
  body { font: 14px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
         background: #0a0a0a; color: #f2f2f2; display: grid; place-items: center;
         min-height: 100vh; margin: 0; text-align: center; padding: 2rem; }
  a { color: #f2f2f2; }
</style>
</head>
<body>
<p>${label} lives on the teaching pages.<br><a href="${target}">Continue to ${target}</a></p>
</body>
</html>
`;

let redirected = 0;
let left = 0;

// The lectures root is not a destination of its own; teaching is.
await writeFile(join(LECTURES, 'index.html'), redirectPage('Lectures', `${SITE}/teaching`), 'utf8');

for (const mod of manifest) {
  const target = `${SITE}/teaching/${mod.slug}`;
  const hasEntry = await exists(join(TEACHING, `${mod.slug}.md`));

  if (!hasEntry) {
    left++;
    continue;
  }

  await writeFile(
    join(LECTURES, mod.code, 'index.html'),
    redirectPage(mod.code, target),
    'utf8',
  );
  redirected++;
}

console.log(`redirected: ${redirected}, left as listings: ${left}`);
