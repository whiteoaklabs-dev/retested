// Post-build: render a 1200x630 Open Graph PNG for every built HTML page into dist/og/<slug>.png.
// Slug = path with "/" -> "--" (home = "home"); matches og:image in src/layouts/Base.astro. Zero runtime cost.
import fs from 'node:fs'; import path from 'node:path';
import satori from 'satori'; import { Resvg } from '@resvg/resvg-js';
const DIST = 'dist';
const font = f => fs.readFileSync(`node_modules/@fontsource/inter/files/inter-latin-${f}-normal.woff`);
const fonts = [{ name: 'Inter', data: font(400), weight: 400 }, { name: 'Inter', data: font(700), weight: 700 }];
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []);
const dec = s => s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const h = (type, style, children) => ({ type, props: { style, children } });
fs.mkdirSync(`${DIST}/og`, { recursive: true });
let n = 0;
for (const file of walk(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  const route = '/' + path.relative(DIST, path.dirname(file)).split(path.sep).join('/');
  if (route.startsWith('/og')) continue;
  const slug = route.replace(/^\/|\/$/g, '').replace(/\//g, '--') || 'home';
  let title = dec((html.match(/<title>(.*?)<\/title>/s) || [])[1] || 'Retested').replace(/ \| Retested$/, '');
  if (slug === 'home') title = 'Stop guessing what to do with AI. Copy a tested playbook.';
  const eyebrow = route.startsWith('/use-cases/') && route !== '/use-cases/' ? 'PLAYBOOK' : route.startsWith('/ai-for/') ? 'CATEGORY' : route.startsWith('/tools/') ? 'TOOLS' : route.startsWith('/releases/') ? 'RELEASES' : 'RETESTED';
  const node = h('div', { width: 1200, height: 630, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', background: 'linear-gradient(135deg,#08090b 0%,#14122a 60%,#0b1f1d 100%)', color: '#ecedef', fontFamily: 'Inter' }, [
    h('div', { width: '100%', display: 'flex', alignItems: 'center', gap: '16px', fontSize: 30, fontWeight: 700 }, [
      h('div', { width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#8b7cff,#3dd6c6)', display: 'flex' }, []), 'Retested',
      h('div', { marginLeft: 'auto', fontSize: 20, letterSpacing: 3, color: '#3dd6c6' }, eyebrow)]),
    h('div', { width: '100%', display: 'flex', flexWrap: 'wrap', fontSize: title.length > 70 ? 54 : 64, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1.5, maxWidth: 1056 }, title),
    h('div', { width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#9aa0aa' }, [
      'Prompts for ChatGPT · Claude · Grok · Muse · +6 more', h('div', { color: '#8b7cff' }, 'retested.vercel.app')])]);
  const svg = await satori(node, { width: 1200, height: 630, fonts });
  fs.writeFileSync(`${DIST}/og/${slug}.png`, new Resvg(svg).render().asPng()); n++;
}
console.log(`og: rendered ${n} images`);
