/**
 * Puts the deployment base back on root-relative links inside markdown.
 *
 * Content is written with plain paths, "/work/anythingpoi" and
 * "/notes/h3-neighbourhood-radius.svg", because that is what an author should
 * be typing. Astro prefixes its own asset URLs with `base` but leaves authored
 * markdown alone, so under a subpath every one of those links would 404.
 *
 * Runs at build and in dev, so what you click locally is what ships.
 */

const BASE = (process.env.BASE_PATH ?? '/').replace(/\/+$/, '');

/** href and src on anything: links, images, inline SVG, video sources. */
const ATTRS = ['href', 'src', 'poster'];

function prefix(value) {
  if (typeof value !== 'string') return value;
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  if (BASE && (value === BASE || value.startsWith(`${BASE}/`))) return value;
  return `${BASE}${value}`;
}

/* Raw HTML written inside markdown, the <img> figures and inline SVG, never
   becomes an element node, so it needs the same treatment textually. */
const RAW_ATTR = new RegExp(`\\b(${ATTRS.join('|')})="(/[^"]*)"`, 'g');

function walk(node) {
  if (node.type === 'element' && node.properties) {
    for (const attr of ATTRS) {
      if (attr in node.properties) {
        node.properties[attr] = prefix(node.properties[attr]);
      }
    }
  }
  if ((node.type === 'raw' || node.type === 'html') && typeof node.value === 'string') {
    node.value = node.value.replace(RAW_ATTR, (_, attr, value) => `${attr}="${prefix(value)}"`);
  }
  for (const child of node.children ?? []) walk(child);
}

export function rehypeBasePaths() {
  return (tree) => {
    if (BASE) walk(tree);
  };
}
