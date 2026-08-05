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
 * Manifest path to a real URL. The decks sit at the root of their own host,
 * so the historic /lectures prefix comes off on the way out.
 */
export function deckUrl(path: string): string {
  const bare = path.replace(/^\/lectures/, '');
  return `${LECTURES_ORIGIN}${bare}`;
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
