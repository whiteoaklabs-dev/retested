// IndexNow ping (Bing, Yandex, Seznam, Naver; Bing feeds Copilot and ChatGPT search).
// Usage: node scripts/indexnow.mjs            -> submits every URL in the live sitemap
//        node scripts/indexnow.mjs URL [URL]  -> submits only those URLs
// Free, no account needed. Key file is public/<KEY>.txt (must stay deployed).
const HOST = 'retested.vercel.app';
const KEY = '7fe07905288a42319c6941b8a8b76174';
const ORIGIN = `https://${HOST}`;
async function sitemapUrls() {
  const idx = await (await fetch(`${ORIGIN}/sitemap-index.xml`)).text();
  const maps = [...idx.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  const urls = [];
  for (const m of maps) urls.push(...[...(await (await fetch(m)).text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(x => x[1]));
  return urls;
}
const urlList = process.argv.length > 2 ? process.argv.slice(2) : await sitemapUrls();
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs -> HTTP ${res.status} ${res.statusText}`);
if (res.status >= 300) { console.log(await res.text()); process.exit(1); }
