import type { APIContext } from 'astro';
import { ORIGIN, SITE } from '../consts';
import { absoluteUrl } from '../lib/paths';

export function GET(context: APIContext) {
  const origin = (context.site ?? new URL(ORIGIN)).origin;

  const body = `# ${SITE.name}
User-agent: *
Allow: /

# Research assistants and answer engines are welcome. Structured summaries of
# the whole site live at /llms.txt
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${absoluteUrl(origin, '/sitemap-index.xml')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
