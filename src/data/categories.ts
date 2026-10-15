// Category hubs (/ai-for/<slug>/). Copy targets real search phrasing; no stats or claims beyond what the playbooks contain.
export const catSlug = (c: string) => c.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
type Hub = { audience: string; intro: string; jobs: string };
const HUBS: Record<string, Hub> = {
  'Back office': { audience: 'back-office and operations work', intro: 'Inbox triage, reports, scheduling, and SOPs: the repetitive admin that eats a small-business week.', jobs: 'sorting email, writing weekly reports, scheduling, and documenting processes' },
  'Sales': { audience: 'small-business sales', intro: 'Lead follow-up, qualification, outreach, and CRM updates, with a human approving anything that goes to a prospect.', jobs: 'following up leads fast, qualifying inbound leads, and keeping the CRM current' },
  'Support': { audience: 'customer support', intro: 'Answer customers from your own help docs, draft replies in your voice, and apply refund rules with a human approval step.', jobs: 'answering FAQs from help docs, drafting replies, and handling refunds' },
  'Finance & admin': { audience: 'finance and admin', intro: 'Invoices, overdue reminders, and receipt categorization, where the agent drafts and a person approves anything involving money.', jobs: 'drafting invoices, chasing overdue payments, and categorizing receipts' },
  'Marketing & SEO': { audience: 'marketing and SEO', intro: 'Content briefs, AI-search optimization, social posts, local listings, and newsletters.', jobs: 'writing briefs, repurposing posts, replying to reviews, and newsletters' },
  'Coding & vibe coding': { audience: 'coding and vibe coding', intro: 'Prompts and agent setups for building, debugging, and shipping software with AI coding assistants, with a human reviewing every change.', jobs: 'scaffolding features, debugging, writing tests, and reviewing code' },
};
export const hubFor = (c: string): Hub => HUBS[c] ?? { audience: c.toLowerCase(), intro: `Tested AI playbooks for ${c.toLowerCase()} work.`, jobs: `${c.toLowerCase()} tasks` };
