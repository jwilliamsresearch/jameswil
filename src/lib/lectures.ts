/**
 * Lecture decks live in a separate repository deployed at /lectures.
 * This module reads the generated manifest so teaching pages can link to
 * individual sessions without the two builds being coupled.
 *
 * Regenerate after adding or renaming decks:
 *   node scripts/sync-lectures.mjs
 */
import manifest from '../data/lectures.json';

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
