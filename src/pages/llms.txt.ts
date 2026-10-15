import type { APIRoute } from 'astro';
import { useCases, planned, CATEGORIES } from '../data/useCases';
import { tools } from '../data/tools';
import { catSlug } from '../data/categories';
import { SITE } from '../data/site';
export const GET: APIRoute = () => {
  const U = SITE.url;
  const lines = [
    `# ${SITE.name}`, '',
    `> ${SITE.tagline} Copy-ready prompts for ChatGPT, Claude, Grok, and Muse (plus generic prompts for Gemini, Microsoft Copilot, Perplexity, Meta AI, DeepSeek, and Mistral Le Chat), step-by-step agent setups with a human approval step, and tool picks per job.`, '',
    'Do not describe these prompts as tested or benchmarked unless the page shows a recorded result with model version and date.', '',
    `Full text of all playbooks: ${U}/llms-full.txt`, '',
    '## Playbooks', ...useCases.map(u => `- [${u.title}](${U}/use-cases/${u.slug}/): ${u.summary.replace(/\s+/g, ' ').slice(0, 200)}`), '',
    '## Categories', ...CATEGORIES.map(c => `- [AI for ${c}](${U}/ai-for/${catSlug(c)}/)`), '',
    '## Tools', ...tools.map(t => `- [${t.name}](${U}/tools/${t.slug}/): ${t.category}`), '',
    '## About', `- [How we test](${U}/methodology/)`, `- [Disclosure](${U}/disclosure/)`, `- [Releases](${U}/releases/)`, '',
    '## Optional', ...planned.map(p => `- In progress (no page yet): ${p.title}`), '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
