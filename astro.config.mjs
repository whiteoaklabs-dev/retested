import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
// lastmod: playbooks use their own "updated" date; everything else uses the newest playbook update.
const dir = './src/content/playbooks';
const pb = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8'))) : [];
const newest = pb.map(p => p.updated).sort().pop() || new Date().toISOString().slice(0, 10);
const catSlug = c => c.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const liveCats = new Set(pb.map(p => catSlug(p.category)));
const NOINDEX = ['/releases/feed-placeholder/', '/get-featured/thanks/'];
export default defineConfig({
  site: 'https://retested.vercel.app', trailingSlash: 'always',
  integrations: [sitemap({
    filter: page => { if (NOINDEX.some(p => page.endsWith(p))) return false; const c = page.match(/\/ai-for\/([^/]+)\/$/); return !c || liveCats.has(c[1]); },
    serialize(item) {
      const m = item.url.match(/\/use-cases\/([^/]+)\/$/);
      const p = m && pb.find(x => x.slug === m[1]);
      item.lastmod = new Date(p ? p.updated : newest).toISOString();
      return item;
    },
  })],
});
