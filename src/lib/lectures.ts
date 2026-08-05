/**
 * Lecture decks live in a separate repository, served from its own host at
 * lectures.jameswil.com. The manifest stores host-relative paths, so teaching
 * pages link through `deckUrl` and the two builds stay uncoupled.
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
 * Manifest paths are already relative to the deck host, so this only adds the
 * origin. Regenerate the manifest with scripts/sync-lectures.mjs, which reads
 * the deployment rather than a local folder, so a link can only exist here if
 * it resolves there.
 */
export function deckUrl(path: string): string {
  return `${LECTURES_ORIGIN}${path}`;
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
