// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeBasePaths } from './src/lib/rehype-base-paths.mjs';

/**
 * The site is served from the jwilliamsresearch/jameswil project repo on the
 * jameswil.com custom domain, so the default build is root-relative. The same
 * source also builds for the project subpath it falls back to without a domain:
 *
 *   SITE_URL=https://jwilliamsresearch.github.io BASE_PATH=/jameswil npm run build
 *
 * Every internal link runs through withBase(), so nothing else has to change.
 */
const SITE_URL = process.env.SITE_URL ?? 'https://jameswil.com';
const BASE_PATH = process.env.BASE_PATH ?? '/';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  integrations: [sitemap()],

  // Built-in asset pipeline. Everything imported through astro:assets gets
  // resized, converted to modern formats and content-hashed at build time.
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  markdown: {
    /* Content is authored with root-relative links. This puts the base back on
       them, so a note can keep saying /work/anythingpoi wherever it is served. */
    rehypePlugins: [rehypeBasePaths],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },

  build: {
    inlineStylesheets: 'auto',
  },
});
