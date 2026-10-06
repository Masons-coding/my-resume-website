// Page shell shared by all five sites. Everything is relative so a site works at its own domain or inside a sub-folder.
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const depthOf = (p) => p.split('/').length - 1;
const relFor = (p) => '../'.repeat(depthOf(p));
const ad = (slot) => `<div class="ad" data-ad="${slot}" hidden aria-label="Advertisement"></div>`;

function head(site, page, rel, cfg) {
  const title = page.home ? `${site.name} - ${site.tag}` : `${page.title} | ${site.name}`;
  const url = cfg.baseUrl ? cfg.baseUrl.replace(/\/$/, '') + '/' + page.path.replace(/index\.html$/, '') : '';
  const ld = page.jsonld ? `<script type="application/ld+json">${JSON.stringify(page.jsonld)}</script>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.desc || site.desc)}">
<meta name="theme-color" content="${site.accent}">
${url ? `<link rel="canonical" href="${esc(url)}">` : ''}
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(page.desc || site.desc)}"><meta property="og:type" content="website">${url ? `<meta property="og:url" content="${esc(url)}">` : ''}
<meta name="twitter:card" content="summary">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='${site.accent}'/><text x='50' y='68' font-size='56' text-anchor='middle'>${site.emoji}</text></svg>`)}">
<link rel="stylesheet" href="${rel}assets/base.css">
<style>:root{--accent:${site.accent};--accent-soft:${site.soft || '#e8efff'}}:root[data-theme="dark"]{--accent:${site.accentDark || site.accent};--accent-soft:${site.softDark || '#1b2540'}}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--accent:${site.accentDark || site.accent};--accent-soft:${site.softDark || '#1b2540'}}}</style>
<script src="${rel}assets/site-config.js"></script>
${ld}
</head>`;
}

function header(site, page, rel) {
  const links = site.nav.map(([label, href]) => `<a href="${rel}${href}"${page.nav === href ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('');
  return `<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="container">
<a class="brand" href="${rel}index.html"><span class="brand-mark" aria-hidden="true">${site.emoji}</span>${esc(site.name)}</a>
<button class="icon-btn menu-btn" id="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Menu">&#9776;</button>
<nav class="nav" id="nav" aria-label="Main">${links}<button class="icon-btn" id="theme-btn" aria-label="Toggle dark mode" title="Toggle dark mode">&#9790;</button></nav>
</div></header>
<main id="main"><div class="container">`;
}

function crumbs(site, page, rel) {
  if (page.home || !page.crumb) return '';
  return `<nav class="crumbs" aria-label="Breadcrumb"><a href="${rel}index.html">Home</a> / ${page.crumb[0] ? `<a href="${rel}${page.crumb[1]}">${esc(page.crumb[0])}</a> / ` : ''}<span>${esc(page.short || page.title)}</span></nav>`;
}

function footer(site, rel) {
  const others = site.others.map((o) => `<li><a href="${esc(o.url)}">${esc(o.name)}</a></li>`).join('');
  return `</div></main>
<footer class="site-footer"><div class="container">
<div class="cols">
<div><h4>${esc(site.name)}</h4><p class="muted">${esc(site.desc)}</p></div>
<div><h4>Explore</h4><ul>${site.nav.slice(0, 6).map(([l, h]) => `<li><a href="${rel}${h}">${esc(l)}</a></li>`).join('')}</ul></div>
<div><h4>More free sites</h4><ul>${others}</ul></div>
<div><h4>Info</h4><ul><li><a href="${rel}about/">About</a></li><li><a href="${rel}privacy/">Privacy policy</a></li><li><a href="${rel}terms/">Terms</a></li><li><a href="${rel}contact/">Contact</a></li><li><a href="#" id="ads-settings">Ad choices</a></li></ul></div>
</div>
<p class="footnote">&copy; <span id="year">${new Date().getFullYear()}</span> ${esc(site.name)} - a Masons-coding project. Free to use. Information is general and not professional advice.</p>
</div></footer>
<div class="consent" id="consent" hidden role="dialog" aria-label="Ad preferences"><div class="inner"><p>We would like to show ads to keep this site free. Ads may use cookies. Your choice is saved only on this device. Nothing ad-related loads unless you accept.</p><div class="row"><button class="btn" id="consent-yes">Accept ads</button><button class="btn ghost" id="consent-no">No thanks</button></div></div></div>
<script src="${rel}assets/core.js"></script>`;
}

function render(site, page, cfg) {
  const rel = relFor(page.path);
  const scripts = (page.scripts || []).map((s) => `<script src="${rel}${s}"></script>`).join('\n');
  const body = typeof page.body === 'function' ? page.body({ rel, ad, esc }) : page.body;
  return head(site, page, rel, cfg) + '\n' + header(site, page, rel) + crumbs(site, page, rel) + body + '\n' + footer(site, rel) + '\n' + scripts + '\n</body></html>\n';
}
module.exports = { render, esc, ad, relFor };
