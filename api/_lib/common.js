// Shared helpers for Vercel functions. No secrets live here; they come from env vars.
const RESEND = 'https://api.resend.com';
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const hits = new Map(); // best-effort per-instance rate limit

export function validEmail(e) { return typeof e === 'string' && e.length <= 254 && EMAIL_RE.test(e); }
export function clean(v, max = 500) { return typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : ''; }

export function rateLimited(req, limit = 5, windowMs = 10 * 60 * 1000) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > limit;
}

export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return Object.fromEntries(new URLSearchParams(req.body)); } }
  return {};
}

export async function resend(path, method = 'POST', body) {
  const r = await fetch(RESEND + path, {
    method,
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null; try { data = await r.json(); } catch {}
  return { ok: r.ok, status: r.status, data };
}

// Create contact in segment; if it already exists, update props and add it to the segment.
export async function upsertContact(email, segmentId, properties) {
  const body = { email, unsubscribed: false, segments: [{ id: segmentId }] };
  if (properties) body.properties = properties;
  let r = await resend('/contacts', 'POST', body);
  if (r.ok) return r;
  const msg = JSON.stringify(r.data || '').toLowerCase();
  if (r.status === 409 || msg.includes('exist')) {
    if (properties) await resend(`/contacts/${encodeURIComponent(email)}`, 'PATCH', { properties });
    return resend(`/contacts/${encodeURIComponent(email)}/segments/${segmentId}`, 'POST');
  }
  return r;
}

export function guard(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.status(405).json({ ok: false, error: 'Method not allowed' }); return false; }
  const origin = req.headers.origin;
  if (origin && !/^https:\/\/retested(-[a-z0-9-]+)?\.vercel\.app$/.test(origin) && !/^http:\/\/localhost(:\d+)?$/.test(origin)) {
    res.status(403).json({ ok: false, error: 'Forbidden' }); return false;
  }
  if (!process.env.RESEND_API_KEY) { res.status(503).json({ ok: false, error: 'Signup is temporarily unavailable.' }); return false; }
  return true;
}
