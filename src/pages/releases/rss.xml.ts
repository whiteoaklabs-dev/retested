import { releases } from '../../data/releases';
export function GET() {
  const items = releases.map(r => `<item><title>${r.title}</title><link>https://retested.ai/releases/${r.slug}/</link><pubDate>${new Date(r.date).toUTCString()}</pubDate><description>${r.summary}</description></item>`).join('');
  return new Response(`<?xml version="1.0"?><rss version="2.0"><channel><title>Retested releases</title><link>https://retested.ai/releases/</link><description>AI releases tagged by use case</description>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml' } });
}
