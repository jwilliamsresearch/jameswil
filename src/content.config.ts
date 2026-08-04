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
      /** Caption printed under the cover. Earns the image its place. */
      coverCaption: z.string().optional(),
      /** Project wordmark, shown above the title. The project's brand, not the site's. */
      logo: image().optional(),

      /**
       * The band directly under the hero. Four entries reads best; the grid
       * drops to two columns then one, so three or five will not orphan.
       * `value` carries the number, `label` says what it counts, `note` gives
       * the comparison that makes it mean something.
       */
      metrics: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
            note: z.string().optional(),
          }),
        )
        .default([]),

      /** Numbered pipeline stages. Rendered as a guided walkthrough. */
      steps: z
        .array(
          z.object({
            title: z.string(),
            body: z.string(),
            /** Optional technical aside, set in mono under the body. */
            detail: z.string().optional(),
          }),
        )
        .default([]),

      /**
       * Annotated figures. Each one needs a caption that explains the claim.
       * Supply `video` for a screen recording: `src` then acts as the poster
       * and the clip plays only while it is on screen. Animated GIFs must be
       * converted first, because a 14 MB GIF is not a figure, it is a page
       * weight problem. `wide` spans the full grid for detail-heavy interfaces.
       */
      figures: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string(),
            label: z.string().optional(),
            wide: z.boolean().default(false),
            video: z
              .object({ mp4: z.string(), webm: z.string().optional() })
              .optional(),
          }),
        )
        .default([]),

      /** What changed because the work existed. Evidence, not adjectives. */
      outcomes: z
        .array(z.object({ title: z.string(), body: z.string() }))
        .default([]),

      /** Grouped tooling, so the stack is scannable rather than a tag soup. */
      stack: z
        .array(z.object({ group: z.string(), items: z.array(z.string()) }))
        .default([]),

      /**
       * Funders, partners and data providers, each with its actual role.
       * `logo` is optional: funder marks carry real credibility and several
       * grants require display, so they are shown on a white plate that keeps
       * them legible in both themes without breaking the monochrome elsewhere.
       */
      sponsors: z
        .array(
          z.object({
            name: z.string(),
            role: z.string().optional(),
            href: z.string().optional(),
            logo: image().optional(),
          }),
        )
        .default([]),

      /** Formal acknowledgement, printed verbatim. Grant terms usually fix the wording. */
      funding: z.string().optional(),

      /** Named collaborators, with affiliation. Signals the work was not solo. */
      team: z
        .array(z.object({ name: z.string(), affiliation: z.string().optional() }))
        .default([]),

      /**
       * Internal links out to the papers and sibling projects this work sits
       * beside. Keeps a reader inside the site instead of ending the page at a
       * dead stop, and gives the publications pages inbound links from prose
       * rather than from a bare index.
       */
      related: z
        .array(
          z.object({
            label: z.string(),
            href: z.string(),
            /** What it is: "PhD thesis, 2025", "Project", "Conference paper, 2023". */
            note: z.string().optional(),
          }),
        )
        .default([]),

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
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      label: z.string().optional(),
      lead: z.string().optional(),
      description: z.string().optional(),
      /** Headline numbers, shown above the prose. Same band as the project pages. */
      metrics: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
            note: z.string().optional(),
          }),
        )
        .default([]),
      /** Institutions and funders, shown as marks on a white plate. */
      affiliations: z
        .array(
          z.object({
            name: z.string(),
            href: z.string().optional(),
            logo: image(),
          }),
        )
        .default([]),
      updated: z.coerce.date().optional(),
    }),
});

export const collections = { work, teaching, pages };
