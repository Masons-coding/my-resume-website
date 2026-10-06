#!/usr/bin/env node
// Refreshes data/news.json for AI Pulse and Daily Brief from publishers' public RSS/Atom feeds.
// We keep only: headline, link, publisher name, publish time and topic (no article text), and always link back to the publisher.
// Usage: node tools/fetch-news.js [--site ai-pulse|daily-brief] [--out <dir>]   (default writes src/<site>/data and dist/<site>/data if present)
const fs = require('fs'), path = require('path'), https = require('https'), http = require('http');
const FEEDS = {
  'ai-pulse': [
    ['Hugging Face Blog', 'https://huggingface.co/blog/feed.xml', 'ai'], ['OpenAI', 'https://openai.com/news/rss.xml', 'ai'], ['Google DeepMind', 'https://deepmind.google/blog/rss.xml', 'research'], ['Google AI', 'https://blog.google/technology/ai/rss/', 'ai'],
    ['NVIDIA Blog', 'https://blogs.nvidia.com/blog/category/deep-learning/feed/', 'industry'], ['MIT Technology Review', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', 'ai'], ['The Verge', 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', 'industry'],
    ['Ars Technica', 'https://arstechnica.com/ai/feed/', 'industry'], ['arXiv cs.AI', 'https://export.arxiv.org/rss/cs.AI', 'research'], ['arXiv cs.LG', 'https://export.arxiv.org/rss/cs.LG', 'research'], ['BBC Technology', 'https://feeds.bbci.co.uk/news/technology/rss.xml', 'policy']
  ],
  'daily-brief': [
    ['BBC World', 'https://feeds.bbci.co.uk/news/world/rss.xml', 'world'], ['NPR World', 'https://feeds.npr.org/1004/rss.xml', 'world'], ['The Guardian World', 'https://www.theguardian.com/world/rss', 'world'], ['Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml', 'world'], ['DW', 'https://rss.dw.com/rdf/rss-en-all', 'world'], ['CBC World', 'https://www.cbc.ca/webfeed/rss/rss-world', 'world'], ['CBC Top Stories', 'https://www.cbc.ca/webfeed/rss/rss-topstories', 'canada'],
    ['BBC Technology', 'https://feeds.bbci.co.uk/news/technology/rss.xml', 'tech'], ['Ars Technica', 'https://feeds.arstechnica.com/arstechnica/index', 'tech'],
    ['BBC Science & Environment', 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', 'science'], ['NASA', 'https://www.nasa.gov/rss/dyn/breaking_news.rss', 'science'], ['ScienceDaily', 'https://www.sciencedaily.com/rss/top/science.xml', 'science'],
    ['BBC Business', 'https://feeds.bbci.co.uk/news/business/rss.xml', 'business'], ['NPR Economy', 'https://feeds.npr.org/1017/rss.xml', 'business'], ['BBC Health', 'https://feeds.bbci.co.uk/news/health/rss.xml', 'health']
  ]
};
const ent = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '-', mdash: '-', rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"', hellip: '...' };
const decode = (s) => String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&([a-z]+);/gi, (m, n) => ent[n.toLowerCase()] !== undefined ? ent[n.toLowerCase()] : m).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const tag = (block, name) => { const m = new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'i').exec(block); return m ? m[1] : ''; };
const clean = (u) => { try { const x = new URL(decode(u).trim()); if (!/^https?:$/.test(x.protocol)) return ''; [...x.searchParams.keys()].filter((k) => /^(utm_|at_|ocid|cmpid|xtor|ref$|source$)/i.test(k)).forEach((k) => x.searchParams.delete(k)); x.hash = ''; return x.toString(); } catch (e) { return ''; } };
function parseFeed(xml, max = 15) {
  const out = [], items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of items) {
    const title = decode(tag(b, 'title')); let link = clean(tag(b, 'link')); if (!link) { const m = /<link[^>]+href=["']([^"']+)["']/i.exec(b); link = m ? clean(m[1]) : ''; } if (!link) link = clean(tag(b, 'guid'));
    const dt = tag(b, 'pubDate') || tag(b, 'dc:date') || tag(b, 'published') || tag(b, 'updated'), t = Date.parse(decode(dt));
    if (title && /^https?:\/\//.test(link)) out.push({ title: title.slice(0, 220), url: link, published: isFinite(t) ? new Date(t).toISOString() : null });
    if (out.length >= max) break;
  }
  return out;
}
function get(url, ms = 12000, hops = 4) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers: { 'user-agent': 'MasonsSitesNewsBot/1.0 (headline aggregator; contact via GitHub)', accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' }, timeout: ms }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && hops > 0) { res.resume(); return resolve(get(new URL(res.headers.location, url).toString(), ms, hops - 1)); }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
      const chunks = []; let n = 0; res.on('data', (c) => { n += c.length; if (n > 3e6) { req.destroy(new Error('too big')); } else chunks.push(c); }); res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('timeout', () => req.destroy(new Error('timeout'))); req.on('error', reject);
  });
}
async function buildSite(site, feeds) {
  const items = [], sources = [], seen = new Set(); const week = Date.now() - 21 * 864e5;
  await Promise.all(feeds.map(async ([name, url, topic]) => {
    try { const xml = await get(url); const list = parseFeed(xml); sources.push({ name, ok: list.length > 0, n: list.length }); for (const x of list) items.push({ ...x, source: name, topic }); }
    catch (e) { sources.push({ name, ok: false, n: 0, error: String(e.message || e).slice(0, 60) }); }
  }));
  const out = []; items.sort((a, b) => (Date.parse(b.published) || 0) - (Date.parse(a.published) || 0));
  for (const x of items) { const k = x.url.toLowerCase(), t = x.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').slice(0, 70); if (seen.has(k) || seen.has(t)) continue; if (x.published && Date.parse(x.published) < week) continue; seen.add(k); seen.add(t); out.push(x); if (out.length >= 150) break; }
  return { updated: new Date().toISOString(), items: out, sources };
}
async function main() {
  const a = process.argv.slice(2), only = a.includes('--site') ? a[a.indexOf('--site') + 1] : null, outDir = a.includes('--out') ? a[a.indexOf('--out') + 1] : null, root = path.join(__dirname, '..');
  let total = 0, okSites = 0;
  for (const [site, feeds] of Object.entries(FEEDS)) {
    if (only && only !== site) continue; const data = await buildSite(site, feeds);
    const good = data.sources.filter((s) => s.ok).length; console.log(`${site}: ${data.items.length} headlines from ${good}/${data.sources.length} feeds` + (good < data.sources.length ? ' (down: ' + data.sources.filter((s) => !s.ok).map((s) => s.name).join(', ') + ')' : ''));
    if (!data.items.length) { console.log('  nothing fetched - keeping the old data.json'); continue; }
    const dirs = outDir ? [path.join(outDir, site)] : [path.join(root, 'src', site, 'data'), path.join(root, 'dist', site, 'data')].filter((d) => outDir || fs.existsSync(path.dirname(d)));
    for (const d of dirs) { fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, 'news.json'), JSON.stringify(data)); }
    total += data.items.length; okSites++;
  }
  console.log(`done: ${total} headlines, ${okSites} site(s) updated`); process.exit(okSites ? 0 : 1);
}
if (require.main === module) main().catch((e) => { console.error(e); process.exit(2); });
module.exports = { parseFeed, decode, clean, FEEDS };
