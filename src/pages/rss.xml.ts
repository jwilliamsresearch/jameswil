import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../consts';
import { withBase } from '../lib/paths';
import { publications } from '../lib/publications';

export async function GET(context: APIContext) {
  const [projects, teaching, notes] = await Promise.all([
    getCollection('work', ({ data }) => !data.draft),
    getCollection('teaching', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft),
  ]);

  const items = [
    ...notes.map((note) => ({
      title: note.data.title,
      /* Notes are short, so the feed carries the whole thing. */
      description: note.body ?? note.data.title,
      link: withBase(`/notes/${note.id}`),
      pubDate: note.data.date,
      categories: ['Note', ...note.data.tags],
    })),
    ...publications.map((pub) => ({
      title: pub.title,
      description: pub.abstract ?? pub.citation,
      link: withBase(`/publications/${pub.slug}`),
      pubDate: new Date(Date.UTC(pub.year || 1970, 0, 1)),
      categories: ['Publication', pub.kind, ...pub.keywords],
    })),
    ...projects.map((project) => ({
      title: project.data.title,
      description: project.data.summary,
      link: withBase(`/work/${project.id}`),
      pubDate: project.data.updated ?? new Date(),
      categories: ['Work', ...project.data.tags],
    })),
    ...teaching.map((course) => ({
      title: course.data.title,
      description: course.data.summary,
      link: withBase(`/teaching/${course.id}`),
      pubDate: course.data.updated ?? new Date(),
      categories: ['Teaching', ...course.data.tags],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: SITE.name,
    description: SITE.description,
    /* Channel link is the site root as served. Item links already carry the
       base, so they survive URL resolution against it. */
    site: SITE.url,
    items,
    customData: '<language>en</language>',
  });
}
