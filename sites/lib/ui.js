const { esc } = require('./layout');
const faqHtml = (faq) => faq && faq.length ? `<section><h2>Frequently asked questions</h2>${faq.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${a}</p></details>`).join('')}</section>` : '';
const faqLd = (faq) => faq && faq.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: String(a).replace(/<[^>]+>/g, '') } })) } : null;
const card = (href, emoji, title, text) => `<a class="card" href="${href}"><span class="emoji" aria-hidden="true">${emoji}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></a>`;
function field(f, selectedUnitsHtml) {
  const id = 'f-' + f.name, lab = `<label for="${id}">${esc(f.label)}</label>`;
  if (f.type === 'checkbox') return `<div class="check"><input type="checkbox" id="${id}" name="${f.name}"${f.value ? ' checked' : ''}><label for="${id}">${esc(f.label)}</label></div>`;
  if (f.type === 'select') return `<div>${lab}<select id="${id}" name="${f.name}">${f.options.map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(f.value) ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></div>`;
  if (f.type === 'unit') return `<div>${lab}<select id="${id}" name="${f.name}"><option>${esc(f.value)}</option></select></div>`;
  if (f.type === 'date') return `<div>${lab}<input id="${id}" name="${f.name}" type="date" value="${esc(f.value)}"></div>`;
  const pre = f.presets ? `<div class="chips" role="group" aria-label="Presets">${f.presets.map((p) => `<button type="button" class="chip" data-for="${f.name}" data-preset="${p}">${p}%</button>`).join('')}</div>` : '';
  return `<div>${lab}<input id="${id}" name="${f.name}" type="number" inputmode="decimal" value="${esc(f.value)}"${f.step ? ` step="${f.step}"` : ''}${f.min != null ? ` min="${f.min}"` : ''}${f.max != null ? ` max="${f.max}"` : ''}>${pre}</div>`;
}
module.exports = { faqHtml, faqLd, card, field, esc };
