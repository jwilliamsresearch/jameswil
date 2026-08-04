import type { APIContext } from 'astro';
import { SITE } from '../consts';

export function GET(context: APIContext) {
  const base = (context.site ?? new URL(SITE.url)).origin;

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

Sitemap: ${base}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
