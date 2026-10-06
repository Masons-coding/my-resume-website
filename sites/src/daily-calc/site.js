const path = require('path');
const C = require('./assets/calcs.js'), content = require('./content.js'), { faqHtml, faqLd, card, field, esc } = require('../../lib/ui');
const guides = require('./guides.js');
const ID = { age: 'dates' };
const site = {
  slug: 'daily-calc', name: 'DailyCalc', tag: 'Free everyday calculators', emoji: '🧮', accent: '#0b7a5a', accentDark: '#34d399', soft: '#e3f5ee', softDark: '#10291f',
  desc: 'Free, fast calculators for everyday life: mortgage and loan payments, tips, percentages, BMI, savings growth, unit conversion, dates, salary and more.',
  about: 'DailyCalc is a collection of simple, accurate calculators for the questions people actually have - what will this loan cost, how much should I tip, how long until my birthday. No sign-up, no clutter, and your numbers never leave your device.',
  nav: [['Calculators', 'index.html#calculators'], ['Guides', 'guides/'], ['Mortgage', 'mortgage-calculator/'], ['Tip', 'tip-calculator/'], ['Percentage', 'percentage-calculator/']],
  pages: []
};
const byId = (id) => C.byId[ID[id] || id];
const calcCards = (ids, rel) => ids.map((id) => { const s = byId(id); return card(`${rel}${s.slug}/`, s.emoji, s.title.replace(/ Calculator$/, ''), s.blurb); }).join('');
site.pages.push({ path: 'index.html', home: true, title: 'DailyCalc', nav: 'index.html#calculators', desc: site.desc, scripts: ['assets/home.js'], jsonld: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'DailyCalc', description: site.desc },
  body: ({ rel, ad }) => `<section class="hero"><p class="eyebrow">Free - fast - private</p><h1>Calculators for everyday life</h1><p class="lead">Loan payments, tips, percentages, BMI, savings, units, dates, pay and more. Type your numbers and get the answer instantly. Nothing is uploaded and nothing needs signing up.</p>
<div class="row"><label class="sr-only" for="find">Find a calculator</label><input id="find" type="search" placeholder="Search calculators (try &quot;loan&quot; or &quot;tip&quot;)" autocomplete="off" style="max-width:26rem"></div></section>
${ad('top')}
<section id="calculators" aria-labelledby="h-calcs"><h2 id="h-calcs">All calculators</h2><div class="grid" id="calc-grid">${C.list.map((s) => `<div data-find="${esc((s.title + ' ' + s.blurb).toLowerCase())}">${card(rel + s.slug + '/', s.emoji, s.title.replace(/ Calculator$/, ''), s.blurb)}</div>`).join('')}</div><p class="empty" id="no-match" hidden>No calculator matches that search.</p></section>
${ad('mid')}
<section><h2>Guides to help you decide</h2><div class="grid wide">${guides.map((g) => card(`${rel}guides/${g.slug}/`, g.emoji, g.title, g.desc)).join('')}</div></section>
<section class="prose full"><h2>Why DailyCalc?</h2><p>Most calculator sites bury a simple answer under pop-ups. DailyCalc keeps it plain: a clear form, an instant result, a short explanation of the maths and honest notes on what the number does not include. Every tool works on phones, tablets and large desktop screens, in light or dark mode, and with the keyboard.</p></section>
${ad('bottom')}` });
site.pages.push({ path: 'guides/index.html', title: 'Money & everyday guides', desc: 'Plain-language guides that go with our calculators: paying down a mortgage, tipping, compound interest and percentages.', nav: 'guides/', crumb: ['', ''], short: 'Guides',
  body: ({ rel, ad }) => `<section class="hero"><h1>Guides</h1><p class="lead">Short, practical explainers that pair with our calculators.</p></section>${ad('top')}<div class="grid wide">${guides.map((g) => card(`${rel}guides/${g.slug}/`, g.emoji, g.title, g.desc)).join('')}</div>${ad('bottom')}` });
for (const g of guides) site.pages.push({ path: `guides/${g.slug}/index.html`, title: g.title, desc: g.desc, nav: 'guides/', crumb: ['Guides', 'guides/'], short: g.title, jsonld: { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.desc, dateModified: new Date().toISOString().slice(0, 10) },
  body: ({ rel, ad }) => `<article class="prose"><p class="eyebrow">Guide</p><h1>${esc(g.title)}</h1>${g.html.split('<!--AD-->')[0]}${ad('mid')}${g.html.split('<!--AD-->')[1] || ''}${g.try ? `<p><a class="btn" href="${rel}${byId(g.try).slug}/">Try the ${esc(byId(g.try).title)}</a></p>` : ''}</article>${ad('bottom')}` });
for (const s of C.list) {
  const c = content[s.id], faq = c.faq;
  site.pages.push({ path: `${s.slug}/index.html`, title: s.title, desc: c.intro.slice(0, 155), nav: s.slug + '/', crumb: ['Calculators', 'index.html#calculators'], short: s.title, scripts: ['assets/calcs.js', 'assets/calc-ui.js'], jsonld: faqLd(faq),
    body: ({ rel, ad }) => {
      const money = s.fields.some((f) => f.type === 'money'), form = s.fields.map((f) => field(f)).join('');
      const cur = money ? `<div><label for="f-currency">Currency</label><select id="f-currency" name="currency">${C.CUR.map((x) => `<option>${x}</option>`).join('')}</select></div>` : '';
      const swap = s.id === 'units' ? '<button type="button" class="btn ghost small" id="calc-swap">Swap from / to</button>' : '';
      return `<h1>${esc(c.h1)}</h1><p class="lead">${esc(c.intro)}</p>${ad('top')}
<div class="tool"><form class="panel" id="calc-form" data-calc="${s.id}" novalidate aria-label="${esc(s.title)}"><div class="fields">${cur}${form}</div><div class="row">${swap}<button type="submit" class="btn">Calculate</button><button type="button" class="btn ghost" id="calc-reset">Reset</button></div></form>
<div class="panel" id="calc-out" aria-live="polite"><p class="muted">Your result will appear here.</p></div></div>
<noscript><p class="callout warn">This calculator needs JavaScript. Everything runs in your browser; nothing is sent anywhere.</p></noscript>
<article class="prose full">${c.about[0]}${ad('mid')}${c.about.slice(1).join('')}${faqHtml(faq)}</article>
<section><h2>More calculators</h2><div class="grid">${calcCards(c.related, rel)}</div></section>${ad('bottom')}`;
    } });
}
module.exports = site;
