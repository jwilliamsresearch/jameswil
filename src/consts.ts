/**
 * Single source of truth for identity, navigation and SEO defaults.
 * Change it here, it changes everywhere.
 */

/** Origin only, no path. Comes from `site` in astro.config. */
export const ORIGIN = (import.meta.env.SITE ?? 'https://jameswil.com').replace(/\/+$/, '');

/** Where the site is actually served from, base path included. */
const SITE_URL = `${ORIGIN}${(import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '')}`;

export const SITE = {
  url: SITE_URL,
  /** Legal name. Used for SEO, schema and citations, never shortened. */
  name: 'James Williams',
  /** How the name is set in the masthead and hero. */
  displayName: 'J Williams',
  shortName: 'jameswil.com',
  initials: 'JW',
  email: 'james@jameswil.com',
  /** Used verbatim as the hero line. Kept to one sentence: the numbers do
      their work on the About and Work pages, not here. */
  tagline:
    'I build the data infrastructure underneath spatial systems, where millions of records from dozens of sources have to agree before anyone can ask a question.',
  description:
    'James Williams is a geospatial data developer building production ETL, spatial platforms and geocoding infrastructure at national and global scale. Python, SQL, PostGIS, DuckDB, Spark, H3, FastAPI, Docker and AWS.',
  roles: ['Geospatial Data Developer', 'Data Engineer', 'Research Scientist'],
  location: {
    region: 'Ontario',
    country: 'Canada',
  },
  /** Feeds Person JSON-LD sameAs, the footer and the hero link row. */
  profiles: [
    { label: 'Email', href: 'mailto:james@jameswil.com', sameAs: false },
    { label: 'CV', href: '/cv.pdf', sameAs: false },
    { label: 'GitHub', href: 'https://github.com/jwilliamsresearch', sameAs: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jameswilliamssci', sameAs: true },
  ],
} as const;

/**
 * Six items, held deliberately. Home is not among them because the wordmark
 * already goes there, which is the convention and buys the slot back.
 */
export const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Publications', href: '/publications' },
  { label: 'Notes', href: '/notes' },
  { label: 'Teaching', href: '/teaching' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Source image for social cards, resized through astro:assets at build time. */
export const OG_SOURCE = 'cn-tower-view.jpg';
