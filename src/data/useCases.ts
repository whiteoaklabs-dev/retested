// status 'not-yet-tested' until the Prompt Tester agent records a real run. NEVER fill testedOn/score by hand.
export type ModelTest = { model: 'ChatGPT' | 'Claude' | 'Grok' | 'Muse'; prompt: string; status: 'not-yet-tested' | 'pass' | 'partial' | 'fail'; modelVersion?: string; testedOn?: string; notes?: string };
export type UseCase = {
  slug: string; title: string; category: string; summary: string; published: string; updated: string;
  tests: ModelTest[]; setup: { agent: string; steps: string[]; approvalStep: string; failureModes: string[] };
  toolPicks: { slug: string; why: string; whenNot: string }[]; faq: { q: string; a: string }[];
};
const untested = (prompt: string): ModelTest[] =>
  (['ChatGPT', 'Claude', 'Grok', 'Muse'] as const).map(model => ({ model, prompt, status: 'not-yet-tested' }));

const triagePrompt = `You are my inbox triage assistant for a small business.
For each email below, return a table with: Sender | Subject | Category (Customer request, Sales lead, Invoice/billing, Vendor, Newsletter/promo, Personal, Spam) | Urgency (Today, This week, No action) | Suggested next step (one line).
Rules:
- Treat anything mentioning a payment problem, cancellation, or a deadline within 48 hours as "Today".
- Never invent details not in the email.
- After the table, list the 3 emails I should answer first and draft a 2-sentence reply to each in a friendly, direct tone.
Emails:
[PASTE EMAILS HERE]`;

const leadPrompt = `A new lead just came in. Write a follow-up email I can send within 5 minutes.
Lead details: [NAME], [COMPANY], [WHAT THEY ASKED FOR / FORM MESSAGE], [SOURCE].
My business: [ONE-LINE DESCRIPTION], [MAIN OFFER], [BOOKING LINK].
Requirements:
- Under 120 words, plain text, no buzzwords.
- First line references exactly what they asked for.
- One clear question that helps me qualify them (budget, timeline, or size — pick the most relevant).
- End with the booking link as the single call to action.
Then give me a 1-line SMS version and a day-3 follow-up if they don't reply.`;

const faqPrompt = `You are the customer support agent for [BUSINESS NAME]. Answer only using the help content below.
Rules:
- If the answer is not in the help content, say "I'm not sure — I'll get a teammate to confirm" and output HANDOFF: [one-line summary].
- Never promise refunds, discounts, or delivery dates unless the help content states them.
- Keep answers under 80 words, friendly, and end with a question if a next step is needed.
- If the customer is angry or mentions legal action, output HANDOFF immediately.
Help content:
[PASTE FAQ / POLICIES]
Customer message:
[PASTE MESSAGE]`;

export const useCases: UseCase[] = [
  {
    slug: 'triage-small-business-inbox', title: 'Triage a small-business inbox with an AI agent', category: 'Back office',
    summary: 'Paste or connect your inbox, and the agent sorts each email into categories, flags what needs a reply today, and drafts short replies for the top three. You approve every send. It works with chat assistants (paste mode) or with an automation tool that reads new mail.',
    published: '2026-10-15', updated: '2026-10-15', tests: untested(triagePrompt),
    setup: {
      agent: 'Any chat assistant (paste mode) or n8n / Make / Zapier (connected mode)',
      steps: [
        'Paste mode: copy 10–30 recent emails (sender, subject, body) into the prompt and run it.',
        'Connected mode: create a workflow triggered by "new email" in Gmail or Outlook.',
        'Send the email to your chosen model with the prompt above (one email per run).',
        'Write the category and urgency back as a label or folder.',
        'Save drafted replies as email drafts. Do not auto-send.',
      ],
      approvalStep: 'Replies stay as drafts until you review and send them yourself.',
      failureModes: ['Misreading newsletters as customer requests', 'Over-flagging "urgent" marketing emails', 'Drafts that promise things you did not offer'],
    },
    toolPicks: [
      { slug: 'n8n', why: 'Flexible email + LLM workflows, self-host option.', whenNot: 'You want zero setup.' },
      { slug: 'make', why: 'Visual builder with Gmail/Outlook modules.', whenNot: 'You need code-level control.' },
      { slug: 'lindy', why: 'Prebuilt inbox assistant.', whenNot: 'You want to own the workflow logic.' },
    ],
    faq: [
      { q: 'Is it safe to let an AI read my inbox?', a: 'Use paste mode or a workflow with read-only scopes plus draft creation, and keep auto-send off.' },
      { q: 'Which model is best for inbox triage?', a: 'Not yet tested. Results for ChatGPT, Claude, Grok, and Muse will appear here with the date and model version.' },
    ],
  },
  {
    slug: 'follow-up-new-leads-in-5-minutes', title: 'Follow up on new leads within 5 minutes automatically', category: 'Sales',
    summary: 'When a form or inbound email arrives, an agent drafts a short, specific follow-up email, an SMS version, and a day-3 nudge, using the lead\'s own words. Then it logs the lead in your CRM. Start with approval on, and switch on auto-send only once the drafts are reliably good.',
    published: '2026-10-15', updated: '2026-10-15', tests: untested(leadPrompt),
    setup: {
      agent: 'n8n, Make, or Zapier plus your CRM (e.g. HubSpot)',
      steps: [
        'Trigger: new form submission (website, Typeform, HubSpot form) or a new email with a specific label.',
        'Pass the lead fields and your business description into the prompt.',
        'Create the contact in the CRM and attach the draft as a task or email draft.',
        'Notify yourself (Slack or SMS) with a one-click approve link.',
        'Schedule the day-3 follow-up and cancel it if the lead replies.',
      ],
      approvalStep: 'Every first email waits for your one-click approval until you choose to remove that step.',
      failureModes: ['Generic openers when form data is thin', 'Asking more than one question', 'Sending to test or spam submissions'],
    },
    toolPicks: [
      { slug: 'hubspot', why: 'Free CRM tier plus forms and sequences.', whenNot: 'You already have a CRM you like.' },
      { slug: 'zapier', why: 'Fastest to connect forms to a CRM.', whenNot: 'High volume, where per-task pricing adds up.' },
      { slug: 'make', why: 'Cheaper multi-step flows.', whenNot: 'You need one-click templates.' },
    ],
    faq: [
      { q: 'Should the agent send automatically?', a: 'Not at first. Review drafts for a week, then auto-send only the lead types that are always approved.' },
      { q: 'Does speed really matter?', a: 'We will publish evidence here once we have a sourced figure. Until then, treat speed as a sensible default rather than a proven number.' },
    ],
  },
  {
    slug: 'ai-support-agent-from-help-docs', title: 'Build an AI support agent that answers FAQs from your help docs', category: 'Support',
    summary: 'Give the agent your FAQ and policies, and it answers customer questions only from that content. It hands off to a human when it is unsure, when a customer is angry, or when money is involved. Test it on your real past tickets before letting it reply live.',
    published: '2026-10-15', updated: '2026-10-15', tests: untested(faqPrompt),
    setup: {
      agent: 'Claude Projects / ChatGPT custom GPT (internal) or Intercom Fin / n8n (customer-facing)',
      steps: [
        'Collect your FAQ, refund, shipping, and pricing policies into one document.',
        'Pull 20 real past customer questions with the answers you gave.',
        'Run each through the prompt and compare it with your real answer.',
        'Fix gaps in the help content, not the prompt, and re-run.',
        'Go live in "suggest reply" mode first, then auto-reply for categories that score well.',
      ],
      approvalStep: 'Anything tagged HANDOFF goes to a human queue, and refunds always require a human.',
      failureModes: ['Making up policies when docs are silent', 'Missing the emotional tone of complaints', 'Outdated docs causing wrong answers'],
    },
    toolPicks: [
      { slug: 'intercom', why: 'Native AI agent on top of your help center.', whenNot: 'You are cost-sensitive at low volume.' },
      { slug: 'n8n', why: 'DIY agent across email/chat with your choice of model.', whenNot: 'No technical help available.' },
      { slug: 'lindy', why: 'No-code support assistant.', whenNot: 'You need deep help-desk integration.' },
    ],
    faq: [
      { q: 'How do I stop it from making things up?', a: 'Restrict it to the pasted content, require a HANDOFF when unsure, and test it on past tickets before launch.' },
      { q: 'Which model handles support best?', a: 'Not yet tested. The cross-model results will be posted with dates.' },
    ],
  },
];
export const useCaseBySlug = (s: string) => useCases.find(u => u.slug === s);
