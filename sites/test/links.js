// Static checks on dist/<site>: every internal link/asset resolves, ids are unique, each page has title/description/canonical/h1, no mailto/personal data.
const fs = require('fs'), path = require('path'); const dist = path.join(__dirname, '..', 'dist'); let bad = 0, pages = 0;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const site of fs.readdirSync(dist)) {
  const root = path.join(dist, site); if (!fs.statSync(root).isDirectory()) continue;
  for (const f of walk(root).filter((x) => x.endsWith('.html') && !x.endsWith('404.html'))) {
    pages++; const html = fs.readFileSync(f, 'utf8'), rel = path.relative(root, f), issues = [];
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]); const dup = ids.filter((x, i) => ids.indexOf(x) !== i); if (dup.length) issues.push('duplicate ids: ' + [...new Set(dup)].join(','));
    if (!/<title>[^<]{5,}<\/title>/.test(html)) issues.push('title'); if (!/<meta name="description" content="[^"]{20,}/.test(html)) issues.push('description'); if (!/rel="canonical"/.test(html)) issues.push('canonical');
    if ((html.match(/<h1[\s>]/g) || []).length !== 1) issues.push('h1');
    if (/@gmail|maclarke/i.test(html)) issues.push('personal email present');
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      let u = m[1]; if (/^(https?:|mailto:|data:|#|javascript:)/.test(u)) continue; u = u.split('#')[0].split('?')[0]; if (!u) continue;
      let t = path.resolve(path.dirname(f), u); if (u.endsWith('/')) t = path.join(t, 'index.html'); else if (fs.existsSync(t) && fs.statSync(t).isDirectory()) t = path.join(t, 'index.html');
      if (!fs.existsSync(t)) issues.push('broken link ' + m[1]);
    }
    for (const m of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) if (!/noopener/.test(m[0])) issues.push('target=_blank without noopener');
    if (issues.length) { bad++; console.log(`${site}/${rel}: ${[...new Set(issues)].join('; ')}`); }
  }
}
console.log(`${pages} pages checked, ${bad} with issues`); process.exit(bad ? 1 : 0);
