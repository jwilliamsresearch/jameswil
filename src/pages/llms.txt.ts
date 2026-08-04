import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../consts';
import { publications } from '../lib/publications';

/**
 * A plain text map of the site for language models, following the llms.txt
 * convention. Everything here is generated, so it cannot drift from the pages.
 */
export async function GET(context: APIContext) {
  const base = (context.site ?? new URL(SITE.url)).origin;
  const url = (path: string) => `${base}${path}`;

  const [projects, teaching] = await Promise.all([
    getCollection('work', ({ data }) => !data.draft),
    getCollection('teaching', ({ data }) => !data.draft),
  ]);

  const lines: string[] = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} works as ${SITE.roles.slice(0, -1).join(', ')} and ${SITE.roles.at(-1)}, based in ${SITE.location.region}, ${SITE.location.country}. Contact: ${SITE.email}`,
    '',
    '## Pages',
    '',
    `- [Home](${url('/')}): overview, selected work and selected publications.`,
    `- [About](${url('/about')}): background, appointments and education.`,
    `- [Work](${url('/work')}): geospatial data platforms, pipelines and research systems.`,
    `- [Publications](${url('/publications')}): full publication list with abstracts and PDFs.`,
    `- [Teaching](${url('/teaching')}): courses, workshops and supervision.`,
    `- [Contact](${url('/contact')}): how to get in touch.`,
    '',
    '## Publications',
    '',
  ];

  for (const pub of publications) {
    const venue = pub.venue ? `, ${pub.venue}` : '';
    const doi = pub.doi ? `, DOI ${pub.doi}` : '';
    lines.push(
      `- [${pub.title}](${url(`/publications/${pub.slug}`)}): ${pub.kind}, ${pub.year}${venue}${doi}. Authors: ${pub.authors.map((a) => a.full).join(', ')}.`,
    );
  }

  lines.push('', '## Work', '');
  for (const project of projects) {
    lines.push(`- [${project.data.title}](${url(`/work/${project.id}`)}): ${project.data.summary}`);
  }

  lines.push('', '## Teaching', '');
  for (const course of teaching) {
    lines.push(`- [${course.data.title}](${url(`/teaching/${course.id}`)}): ${course.data.summary}`);
  }

  lines.push(
    '',
    '## Optional',
    '',
    `- [RSS feed](${url('/rss.xml')})`,
    `- [Sitemap](${url('/sitemap-index.xml')})`,
    '',
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
