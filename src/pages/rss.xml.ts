import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../consts';
import { publications } from '../lib/publications';

export async function GET(context: APIContext) {
  const [projects, teaching] = await Promise.all([
    getCollection('work', ({ data }) => !data.draft),
    getCollection('teaching', ({ data }) => !data.draft),
  ]);

  const items = [
    ...publications.map((pub) => ({
      title: pub.title,
      description: pub.abstract ?? pub.citation,
      link: `/publications/${pub.slug}`,
      pubDate: new Date(Date.UTC(pub.year || 1970, 0, 1)),
      categories: ['Publication', pub.kind, ...pub.keywords],
    })),
    ...projects.map((project) => ({
      title: project.data.title,
      description: project.data.summary,
      link: `/work/${project.id}`,
      pubDate: project.data.updated ?? new Date(),
      categories: ['Work', ...project.data.tags],
    })),
    ...teaching.map((course) => ({
      title: course.data.title,
      description: course.data.summary,
      link: `/teaching/${course.id}`,
      pubDate: course.data.updated ?? new Date(),
      categories: ['Teaching', ...course.data.tags],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: '<language>en</language>',
  });
}
