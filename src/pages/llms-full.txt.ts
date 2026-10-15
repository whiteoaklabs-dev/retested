import type { APIRoute } from 'astro';
import { useCases } from '../data/useCases';
import { toolBySlug } from '../data/tools';
import { MORE } from '../data/models';
import { SITE } from '../data/site';
export const GET: APIRoute = () => {
  const out = [`# ${SITE.name}: full playbook text`, '', `> ${SITE.tagline} Source: ${SITE.url}/.`, ''];
  for (const u of useCases) {
    out.push(`## ${u.title}`, '', `URL: ${SITE.url}/use-cases/${u.slug}/`, `Category: ${u.category} | Updated: ${u.updated}`, '', u.summary, '');
    for (const t of u.tests) out.push(`### Prompt for ${t.model} ${t.status === 'not-yet-tested' ? '' : ` (${t.status}, ${t.modelVersion}, ${t.testedOn})`}`, '', '```', t.prompt, '```', '');
    out.push(`### Generic prompt (any AI: ${MORE.filter(m => m.key !== 'generic').map(m => m.name).join(', ')})`, '', '```', u.genericPrompt ?? u.tests[0]?.prompt ?? '', '```', '');
    out.push('### Agent setup', '', `Works with: ${u.setup.agent}`, '', ...u.setup.steps.map((s, i) => `${i + 1}. ${s}`), '', `Human approval step: ${u.setup.approvalStep}`, '', 'Where it usually breaks:', ...u.setup.failureModes.map(f => `- ${f}`), '');
    out.push('### Tool picks', '', ...u.toolPicks.map(p => `- ${toolBySlug(p.slug)?.name ?? p.slug}: ${p.why} Skip if: ${p.whenNot}`), '');
    out.push('### FAQ', '', ...u.faq.flatMap(f => [`Q: ${f.q}`, `A: ${f.a}`, '']));
  }
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
