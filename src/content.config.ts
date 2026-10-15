// Schema for one-file-per-playbook content (src/content/playbooks/*.json).
// Pages read these through src/data/useCases.ts (import.meta.glob); this collection adds build-time validation.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const test = z.object({ model: z.enum(['ChatGPT', 'Claude', 'Grok', 'Muse']), prompt: z.string().min(80), status: z.enum(['not-yet-tested', 'pass', 'partial', 'fail']), modelVersion: z.string().optional(), testedOn: z.string().optional(), notes: z.string().optional() });
const playbooks = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/playbooks' }),
  schema: z.object({
    slug: z.string(), title: z.string(), category: z.string(), summary: z.string(), published: z.string(), updated: z.string(),
    tests: z.array(test).length(4),
    setup: z.object({ agent: z.string(), steps: z.array(z.string()).min(4), approvalStep: z.string(), failureModes: z.array(z.string()).min(3) }),
    toolPicks: z.array(z.object({ slug: z.string(), why: z.string(), whenNot: z.string() })),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(2),
    draft: z.boolean().optional(), persona: z.string().optional(), job: z.string().optional(), who: z.string().optional(), toolCategories: z.array(z.string()).optional(),
    example: z.object({ scenario: z.string(), input: z.string(), output: z.string(), notes: z.string().optional() }).optional(), related: z.array(z.string()).optional(),
  }),
});
export const collections = { playbooks };
