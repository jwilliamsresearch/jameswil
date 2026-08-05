/**
 * Lecture decks live in a separate repository, served from its own host at
 * lectures.jameswil.com. The manifest stores paths as /lectures/CODE/sessionN/,
 * which is where they sat when the decks were a subdirectory, so this module
 * rewrites them onto the deck host. Teaching pages link through `deckUrl` and
 * the two builds stay uncoupled.
 *
 * Moving the decks again means changing LECTURES_ORIGIN and nothing else.
 *
 * Regenerate after adding or renaming decks:
 *   node scripts/sync-lectures.mjs
 */
import manifest from '../data/lectures.json';

/** Deck host, no trailing slash. Empty string serves them from this site. */
export const LECTURES_ORIGIN = 'https://lectures.jameswil.com';

/**
 * Manifest path to a real URL. The manifest records sessions as
 * /lectures/CODE/sessionN/, which is neither where nor how the decks are
 * served: they sit at the root of their own host, one HTML file per session
 * under a slideshows directory. Verified against the live deployment.
 */
export function deckUrl(path: string): string {
  const session = path.match(/^\/lectures\/([^/]+)\/session(\d+)\/?$/);
  if (session) {
    const [, code, n] = session;
    return `${LECTURES_ORIGIN}/${code}/slideshows/session${n}.html`;
  }
  return `${LECTURES_ORIGIN}${path.replace(/^\/lectures/, '')}`;
}

export interface LectureSession {
  n: number;
  title: string;
  url: string;
}

export interface LectureModule {
  code: string;
  slug: string;
  url: string;
  sessions: LectureSession[];
}

export const lectureModules = manifest as LectureModule[];

/** Matched on the module code in a teaching entry's frontmatter. */
export function lecturesFor(code: string | undefined): LectureModule | undefined {
  if (!code) return undefined;
  const wanted = code.trim().toLowerCase();
  return lectureModules.find((m) => m.code.toLowerCase() === wanted);
}

export function sessionCount(code: string | undefined): number {
  return lecturesFor(code)?.sessions.length ?? 0;
}
