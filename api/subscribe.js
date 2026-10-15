import { guard, readBody, validEmail, rateLimited, upsertContact } from './_lib/common.js';

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  const b = await readBody(req);
  if (b.company) return res.status(200).json({ ok: true }); // honeypot: pretend success
  if (rateLimited(req)) return res.status(429).json({ ok: false, error: 'Too many attempts. Try again in a few minutes.' });
  const email = String(b.email || '').trim().toLowerCase();
  if (!validEmail(email)) return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  const waitlist = b.waitlist === 'prompt-packs' ? 'prompt-packs' : '';
  const r = await upsertContact(email, process.env.RESEND_SEGMENT_ID, waitlist ? { waitlist } : undefined);
  if (!r.ok) { console.error('subscribe failed', r.status); return res.status(502).json({ ok: false, error: 'Could not subscribe right now. Please try again later.' }); }
  return res.status(200).json({ ok: true });
}
