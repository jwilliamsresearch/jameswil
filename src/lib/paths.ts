/**
 * Every internal link is authored root-relative ("/notes"), because that is
 * what the content is written in and what a custom domain wants. GitHub Pages
 * serves this repo from a subpath instead, so the base has to be added at the
 * point the href is produced.
 *
 * `import.meta.env.BASE_URL` is whatever `base` in astro.config is set to,
 * normalised by Astro to a trailing slash. Set BASE_PATH=/ to build for a
 * custom domain and every one of these calls becomes a no-op.
 */

/** "/jameswil" or "" for a root deployment. Never a trailing slash. */
export const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/**
 * Prefix an internal path with the base. Absolute URLs, protocol-relative
 * URLs, mailto: and anchors pass through untouched, so this is safe to apply
 * to link lists that mix internal and external hrefs.
 */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) return path;
  return `${BASE}${path}`;
}

/** Absolute URL for canonicals, feeds and JSON-LD. Base included. */
export function absoluteUrl(origin: string, path: string): string {
  return `${origin.replace(/\/+$/, '')}${withBase(path)}`;
}
