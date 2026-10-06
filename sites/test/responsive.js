// node test/responsive.js <slug> [maxPages]  - serves dist/<slug> and checks every page at 8 widths: no horizontal overflow, no console errors,
// no failed requests (external hosts are stubbed), tap targets reachable. Exit 1 on any failure.
const http = require('http'), fs = require('fs'), path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require('/opt/node22/lib/node_modules/playwright'); }
const slug = process.argv[2], max = +process.argv[3] || 999, dir = path.join(__dirname, '..', 'dist', slug);
const W = [320, 375, 768, 1024, 1440, 1920, 2560, 3000];
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'text/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.join(dir, p); if (!f.startsWith(dir) || !fs.existsSync(f)) { r.writeHead(404); return r.end('nf'); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
function pages(d, base = '') { let o = []; for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) { if (e.name !== 'assets' && e.name !== 'data') o = o.concat(pages(path.join(d, e.name), base + e.name + '/')); } else if (e.name === 'index.html') o.push(base); } return o; }
(async () => {
  await new Promise((r) => srv.listen(0, r)); const port = srv.address().port;
  const browser = await pw.chromium.launch({ executablePath: process.env.CHROME || undefined }); let bad = 0, n = 0;
  const list = pages(dir).slice(0, max);
  for (const w of W) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } }), page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push('pageerror ' + e.message)); page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console ' + m.text()); });
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (rt) => { const u = rt.request().url(); if (/hn\.algolia/.test(u)) return rt.fulfill({ json: { hits: [] } }); rt.fulfill({ status: 200, contentType: 'application/json', body: '{}' }); });
    for (const p of list) {
      errs.length = 0; n++;
      try { await page.goto(`http://127.0.0.1:${port}/${p}`, { waitUntil: 'load' }); await page.waitForTimeout(120); } catch (e) { errs.push('nav ' + e.message); }
      const m = await page.evaluate(() => { const de = document.documentElement; const over = de.scrollWidth - de.clientWidth; const wide = [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.right > de.clientWidth + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('.table-wrap,pre,.consent') && r.width > 0; }).slice(0, 3).map((el) => el.tagName + '.' + el.className); const h1 = document.querySelectorAll('h1').length; return { over, wide, h1, title: document.title }; });
      const issues = []; if (m.over > 1) issues.push('horizontal overflow ' + m.over + 'px ' + m.wide.join(',')); if (m.h1 !== 1) issues.push('h1 count ' + m.h1); if (!m.title) issues.push('no title'); issues.push(...errs);
      if (issues.length) { bad++; console.log(`FAIL ${slug}/${p} @${w}: ${issues.join(' ; ')}`); }
    }
    await ctx.close();
  }
  await browser.close(); srv.close(); console.log(`${slug}: ${n} page-checks, ${bad} failing`); process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
