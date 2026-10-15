import { guard, readBody, validEmail, rateLimited, upsertContact, clean, resend } from './_lib/common.js';

const PLANS = ['Directory listing', 'Featured in a category', 'Release spotlight'];

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  const b = await readBody(req);
  if (b.company) return res.status(200).json({ ok: true }); // honeypot
  if (rateLimited(req, 3)) return res.status(429).json({ ok: false, error: 'Too many attempts. Try again in a few minutes.' });
  const email = String(b.email || '').trim().toLowerCase();
  const name = clean(b.name, 100), tool = clean(b.tool, 100), url = clean(b.url, 300), message = clean(b.message, 1000);
  let plan = clean(b.plan, 50);
  if (!validEmail(email)) return res.status(400).json({ ok: false, error: 'Please enter a valid work email.' });
  if (!name || !tool) return res.status(400).json({ ok: false, error: 'Name and tool name are required.' });
  if (!/^https?:\/\/[^\s]+\.[^\s]+$/i.test(url)) return res.status(400).json({ ok: false, error: 'Please enter a valid website URL (https://…).' });
  if (!PLANS.includes(plan)) plan = plan || 'unspecified';

  const r = await upsertContact(email, process.env.RESEND_SPONSOR_SEGMENT_ID, {
    sponsor_name: name, tool_name: tool, tool_url: url, sponsor_plan: plan, sponsor_message: message,
  });
  if (!r.ok) { console.error('sponsor failed', r.status); return res.status(502).json({ ok: false, error: 'Could not send your application right now. Please try again later.' }); }

  // Optional owner notification. Only ever goes to RESEND_NOTIFY_EMAIL (the account owner); never to the applicant.
  const to = process.env.RESEND_NOTIFY_EMAIL;
  if (to && validEmail(to)) {
    await resend('/emails', 'POST', {
      from: 'Retested <onboarding@resend.dev>', to: [to],
      subject: `New sponsor application: ${tool}`,
      text: `Name: ${name}\nEmail: ${email}\nTool: ${tool}\nURL: ${url}\nPlan: ${plan}\n\n${message}`,
    }).catch(() => {});
  }
  return res.status(200).json({ ok: true });
}
