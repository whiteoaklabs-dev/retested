// Affiliate URLs are placeholders until programs are approved. Never put a real tracking ID here without an approved account.
export type Tool = { slug: string; name: string; category: string; bestFor: string[]; url: string; affiliateUrl: string | null; affiliateProgram: string; featured: boolean };
export const tools: Tool[] = [
  { slug: 'make', name: 'Make', category: 'Automation', bestFor: ['inbox-triage', 'lead-follow-up'], url: 'https://www.make.com', affiliateUrl: null, affiliateProgram: 'Make affiliate (pending signup)', featured: false },
  { slug: 'n8n', name: 'n8n', category: 'Automation / agents', bestFor: ['inbox-triage', 'lead-follow-up', 'support-faq-agent'], url: 'https://n8n.io', affiliateUrl: null, affiliateProgram: 'n8n Cloud affiliate (pending signup)', featured: false },
  { slug: 'hubspot', name: 'HubSpot', category: 'CRM', bestFor: ['lead-follow-up'], url: 'https://www.hubspot.com', affiliateUrl: null, affiliateProgram: 'HubSpot affiliate via Impact (pending signup)', featured: false },
  { slug: 'zapier', name: 'Zapier', category: 'Automation / agents', bestFor: ['inbox-triage', 'lead-follow-up'], url: 'https://zapier.com', affiliateUrl: null, affiliateProgram: 'Not yet verified', featured: false },
  { slug: 'lindy', name: 'Lindy', category: 'AI assistants', bestFor: ['inbox-triage', 'support-faq-agent'], url: 'https://www.lindy.ai', affiliateUrl: null, affiliateProgram: 'Terms unverified', featured: false },
  { slug: 'intercom', name: 'Intercom (Fin)', category: 'Support', bestFor: ['support-faq-agent'], url: 'https://www.intercom.com', affiliateUrl: null, affiliateProgram: 'Not yet verified', featured: false },
];
export const toolBySlug = (s: string) => tools.find(t => t.slug === s);
