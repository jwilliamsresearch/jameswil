import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Every collection is a folder of markdown. Drop a new .md file in and the
 * listing page, the detail page, the sitemap and the feed all pick it up.
 */

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One or two lines. Shown on the listing and used as the meta description. */
      summary: z.string(),
      /** Free text so ranges like "2024 to present" work. */
      period: z.string(),
      status: z.enum(['Active', 'Complete', 'Archived']).default('Active'),
      role: z.string().optional(),
      tags: z.array(z.string()).default([]),
      links: z.array(linkSchema).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Lower numbers sort first. Ties fall back to period, then title. */
      order: z.number().default(100),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      updated: z.coerce.date().optional(),
    }),
});

const teaching = defineCollection({
  loader: glob({ base: './src/content/teaching', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    /** Academic year, for example "2025/26". Drives the listing order. */
    year: z.string(),
    semester: z.enum(['Semester 1', 'Semester 2', 'Semester 3', 'Full Year']),
    /** Upcoming modules are prepared but not yet delivered. */
    status: z.enum(['Delivered', 'Upcoming']).default('Delivered'),
    code: z.string().optional(),
    credits: z.string().optional(),
    cohort: z.string().optional(),
    institution: z.string().optional(),
    role: z.string().optional(),
    /** Institution wording, for example "Level 5" or "Level 1 undergraduate". */
    level: z.string().optional(),
    /**
     * Student year, stated explicitly because level numbering is not portable:
     * Level 4 is first year under FHEQ but fourth year, and masters level, at
     * Nottingham. Masters covers both the MEng year and MSc conversion.
     */
    stage: z.enum(['1st year', '2nd year', '3rd year', 'Masters']),
    /** Earlier years the same module was taught. */
    history: z
      .array(z.object({ year: z.string(), semester: z.string(), cohort: z.string().optional() }))
      .default([]),
    tags: z.array(z.string()).default([]),
    links: z.array(linkSchema).default([]),
    order: z.number().default(100),
    draft: z.boolean().default(false),
    updated: z.coerce.date().optional(),
  }),
});

/** Long-form prose for standalone pages such as About. */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    label: z.string().optional(),
    lead: z.string().optional(),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { work, teaching, pages };
