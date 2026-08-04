// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jameswil.com',
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
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },

  build: {
    inlineStylesheets: 'auto',
  },
});
