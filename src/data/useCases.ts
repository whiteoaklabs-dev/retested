// status 'not-yet-tested' until the Prompt Tester agent records a real run. NEVER fill testedOn/score by hand.
export type ModelTest = { model: string; prompt: string; status: 'not-yet-tested' | 'pass' | 'partial' | 'fail'; modelVersion?: string; testedOn?: string; notes?: string };
export type UseCase = {
  slug: string; title: string; category: string; summary: string; published: string; updated: string;
  tests: ModelTest[]; setup: { agent: string; steps: string[]; approvalStep: string; failureModes: string[] };
  toolPicks: { slug: string; why: string; whenNot: string }[]; faq: { q: string; a: string }[];
  // Content-pipeline fields (optional for hand-written playbooks)
  // Optional: tailored prompts for the 'More AIs' models (Gemini, Microsoft Copilot, Perplexity, Meta AI, DeepSeek, Mistral Le Chat)
  // and a model-neutral genericPrompt. Models without one fall back to the generic prompt plus an adaptation note.
  moreTests?: ModelTest[]; genericPrompt?: string;
  draft?: boolean; persona?: string; job?: string; who?: string; toolCategories?: string[];
};
// Content lives in src/content/playbooks/<slug>.json (one file per playbook, schema: src/content.config.ts).
// Pipeline drafts carry draft: true (shown as DRAFT on cards). Legacy summary markers are stripped.
export const DRAFT_LABEL = 'Draft';
const files = import.meta.glob<UseCase>('../content/playbooks/*.json', { eager: true, import: 'default' });
const HAND_ORDER = ['triage-small-business-inbox', 'follow-up-new-leads-in-5-minutes', 'ai-support-agent-from-help-docs'];
const rank = (s: string) => { const i = HAND_ORDER.indexOf(s); return i < 0 ? 999 : i; };
export const useCases: UseCase[] = Object.values(files)
  .map(u => ({ ...u, summary: u.summary.replace(/^\[Draft[^\]]*\]\s*/, '') }))
  .sort((a, b) => rank(a.slug) - rank(b.slug) || b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug));
const live = new Set(useCases.map(u => u.slug));
export const useCaseBySlug = (s: string) => useCases.find(u => u.slug === s);

// Playbooks in progress: listed honestly as "In progress"; no prompts or tests shown until written.
export type Planned = { slug: string; title: string; category: string; blurb: string };
const plannedAll: Planned[] = [
  { slug: 'draft-support-replies-brand-voice', title: 'Draft replies to customer support emails in your brand voice', category: 'Support', blurb: 'Teach the model your tone once, then get on-brand drafts for every ticket.' },
  { slug: 'qualify-inbound-leads-crm', title: 'Qualify inbound leads and route them to your CRM', category: 'Sales', blurb: 'Score each lead against your criteria and send it to the right pipeline stage.' },
  { slug: 'cold-outreach-not-ai-sounding', title: "Write personalized cold outreach that doesn't sound like AI", category: 'Sales', blurb: 'Specific first lines from real research, with no filler and no fake flattery.' },
  { slug: 'call-notes-to-crm', title: 'Turn sales call notes into CRM updates and next steps', category: 'Sales', blurb: 'Paste messy notes and get clean fields, a summary, and a dated follow-up.' },
  { slug: 'invoices-from-job-notes', title: 'Create and send invoices from emails or job notes', category: 'Finance & admin', blurb: 'Extract line items and amounts into a draft invoice you approve.' },
  { slug: 'chase-overdue-invoices', title: 'Chase overdue invoices politely with an agent', category: 'Finance & admin', blurb: 'A three-step reminder sequence that stays friendly and stops when paid.' },
  { slug: 'categorize-receipts', title: 'Categorize receipts and expenses for bookkeeping', category: 'Finance & admin', blurb: 'Sort receipts into your chart of accounts and flag anything unclear.' },
  { slug: 'weekly-metrics-report', title: 'Summarize weekly business metrics into a one-page report', category: 'Back office', blurb: 'Turn exports from your tools into a short report you will actually read.' },
  { slug: 'appointments-and-reschedules', title: 'Schedule appointments and handle reschedules with an agent', category: 'Back office', blurb: 'Let an agent negotiate times within the rules you set.' },
  { slug: 'sops-from-notes', title: 'Write SOPs from a screen recording or rough notes', category: 'Back office', blurb: 'Turn what is in your head into a checklist someone else can follow.' },
  { slug: 'refunds-with-approval-rules', title: 'Handle refund and return requests with approval rules', category: 'Support', blurb: 'The agent gathers details and applies policy; a human approves any money.' },
  { slug: 'seo-briefs-ai-citations', title: 'Write SEO content briefs that get cited in AI answers', category: 'Marketing & SEO', blurb: 'Briefs built around answer-first structure, sources, and real questions.' },
  { slug: 'optimize-for-ai-overviews', title: 'Optimize a page for AI Overviews and ChatGPT citations', category: 'Marketing & SEO', blurb: 'An audit prompt that checks structure, schema, and quotable answers.' },
  { slug: 'blog-to-social-week', title: 'Turn one blog post into a week of social posts', category: 'Marketing & SEO', blurb: 'One source and seven native posts, each written for its platform.' },
  { slug: 'google-business-profile', title: 'Write Google Business Profile posts and review replies', category: 'Marketing & SEO', blurb: 'Local posts and calm, specific replies to good and bad reviews.' },
  { slug: 'competitor-research-30-min', title: 'Run competitor research for a small business in 30 minutes', category: 'Marketing & SEO', blurb: 'Compare pricing, positioning, and gaps with sources you can check.' },
  { slug: 'newsletter-from-updates', title: 'Write email newsletter campaigns from your latest updates', category: 'Marketing & SEO', blurb: 'Turn a week of changes into one short email worth opening.' },
];
export const planned: Planned[] = plannedAll.filter(p => !live.has(p.slug));
const BASE_CATS = ['Back office', 'Sales', 'Support', 'Finance & admin', 'Marketing & SEO'];
export const CATEGORIES = [...BASE_CATS, ...[...new Set(useCases.map(u => u.category))].filter(c => !BASE_CATS.includes(c)).sort()];
