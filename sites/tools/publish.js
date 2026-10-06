#!/usr/bin/env node
// Publishes the five sites to GitHub (one repo each, served free with GitHub Pages) using the GitHub REST API.
//   node tools/publish.js --yes                 build + create repos (if missing) + upload every file + turn on Pages
//   node tools/publish.js --yes --site eco-steps  only one site
//   node tools/publish.js --data-only           only refresh data/news.json in AI Pulse and Daily Brief (what the news bot does)
// Needs GITHUB_TOKEN in the environment or in ..\.env (a fine-grained token with Contents + Pages + Administration (to create repos) access).
// Nothing is published without --yes. The token is never printed.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..'); const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
function envToken() { if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN; for (const f of [path.join(ROOT, '.env'), path.join(ROOT, '..', '.env')]) { try { const m = /^\s*GITHUB_TOKEN\s*=\s*(.+?)\s*$/m.exec(fs.readFileSync(f, 'utf8')); if (m) return m[1].replace(/^["']|["']$/g, ''); } catch (e) { /* next */ } } return ''; }
const API = (process.env.GITHUB_API || 'https://api.github.com').replace(/\/$/, ''), TOKEN = envToken(), OWNER = CFG.githubUser;
async function gh(method, url, body, okCodes = [200, 201]) {
  const r = await fetch(API + url, { method, headers: { authorization: 'Bearer ' + TOKEN, accept: 'application/vnd.github+json', 'content-type': 'application/json', 'user-agent': 'masons-sites-publisher', 'x-github-api-version': '2022-11-28' }, body: body ? JSON.stringify(body) : undefined });
  const txt = await r.text(); let j = null; try { j = txt ? JSON.parse(txt) : null; } catch (e) { /* not json */ }
  if (!okCodes.includes(r.status) && r.status !== 404) throw new Error(`${method} ${url} -> ${r.status} ${(j && j.message) || txt.slice(0, 120)}`);
  return { status: r.status, json: j };
}
const walk = (d, base = '') => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name), base + e.name + '/') : [base + e.name]);
async function ensureRepo(slug, desc) {
  const r = await gh('GET', `/repos/${OWNER}/${slug}`);
  if (r.status === 200) return false;
  await gh('POST', '/user/repos', { name: slug, description: desc.slice(0, 200), homepage: CFG.sites[slug].url, private: false, auto_init: true, has_issues: true, has_wiki: false }, [201]);
  await new Promise((s) => setTimeout(s, 1500)); return true;
}
async function pushAll(slug) {
  const dir = path.join(ROOT, 'dist', slug); const files = walk(dir).filter((f) => !f.endsWith('.DS_Store'));
  const ref = await gh('GET', `/repos/${OWNER}/${slug}/git/ref/heads/main`); if (ref.status !== 200) throw new Error('main branch not found in ' + slug);
  const parent = ref.json.object.sha, pc = await gh('GET', `/repos/${OWNER}/${slug}/git/commits/${parent}`);
  const tree = [];
  for (const f of files) { const b = await gh('POST', `/repos/${OWNER}/${slug}/git/blobs`, { content: fs.readFileSync(path.join(dir, f)).toString('base64'), encoding: 'base64' }, [201]); tree.push({ path: f, mode: '100644', type: 'blob', sha: b.json.sha }); }
  const t = await gh('POST', `/repos/${OWNER}/${slug}/git/trees`, { tree }, [201]);
  const c = await gh('POST', `/repos/${OWNER}/${slug}/git/commits`, { message: 'Publish site build', tree: t.json.sha, parents: [parent] }, [201]);
  await gh('PATCH', `/repos/${OWNER}/${slug}/git/refs/heads/main`, { sha: c.json.sha, force: false }, [200]);
  return files.length;
}
async function pages(slug) { const r = await gh('POST', `/repos/${OWNER}/${slug}/pages`, { source: { branch: 'main', path: '/' } }, [201, 409, 422]); return r.status; }
async function dataOnly(slug) {
  const f = path.join(ROOT, 'dist', slug, 'data', 'news.json'); if (!fs.existsSync(f)) return 'no data file';
  const cur = await gh('GET', `/repos/${OWNER}/${slug}/contents/data/news.json`); if (cur.status !== 200 && cur.status !== 404) return 'cannot read';
  await gh('PUT', `/repos/${OWNER}/${slug}/contents/data/news.json`, { message: 'Refresh headlines', content: fs.readFileSync(f).toString('base64'), sha: cur.json && cur.json.sha }, [200, 201]); return 'updated';
}
(async () => {
  const a = process.argv.slice(2), yes = a.includes('--yes'), only = a.includes('--site') ? a[a.indexOf('--site') + 1] : null, data = a.includes('--data-only');
  if (!TOKEN) { console.log('No GITHUB_TOKEN found. Put GITHUB_TOKEN=... in .env first (see README).'); process.exit(1); }
  if (!yes && !data) { console.log('Dry run: nothing published. Add --yes to publish (or --data-only to refresh headlines).'); process.exit(0); }
  const slugs = Object.keys(CFG.sites).filter((s) => !only || s === only);
  if (data) { let n = 0; for (const s of slugs.filter((x) => x === 'ai-pulse' || x === 'daily-brief')) { try { console.log(s + ': ' + await dataOnly(s)); n++; } catch (e) { console.log(s + ': ' + e.message); } } console.log(`published headlines for ${n} site(s)`); return; }
  const b = spawnSync(process.execPath, [path.join(ROOT, 'build.js'), ...(only ? [only] : [])], { stdio: 'inherit' }); if (b.status !== 0) { console.log('build failed'); process.exit(1); }
  for (const s of slugs) { try { const created = await ensureRepo(s, require(path.join(ROOT, 'src', s, 'site.js')).desc); const n = await pushAll(s); const p = await pages(s); console.log(`${s}: ${created ? 'created repo, ' : ''}pushed ${n} files, pages ${p === 201 ? 'enabled' : 'already on'} -> ${CFG.sites[s].url}`); } catch (e) { console.log(`${s}: FAILED ${e.message}`); process.exitCode = 1; } }
})().catch((e) => { console.log('publish error: ' + e.message); process.exit(1); });
