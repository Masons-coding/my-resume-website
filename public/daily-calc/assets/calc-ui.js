/* Wires a server-rendered calculator form to CALCS (calcs.js). Works with the keyboard, remembers inputs on this device only. */
(function () {
  'use strict';
  var form = U.$('#calc-form'); if (!form || !window.CALCS) return;
  var id = form.getAttribute('data-calc'), spec = CALCS.byId[id], out = U.$('#calc-out'), KEY = 'dc-' + id;
  var curSel = U.$('[name=currency]', form);
  function guessCur() { var l = (navigator.language || 'en-US').toUpperCase(); if (/-CA|CA$/.test(l)) return 'CAD'; if (/-GB|-UK/.test(l)) return 'GBP'; if (/-AU/.test(l)) return 'AUD'; if (/-NZ/.test(l)) return 'NZD'; if (/-IN/.test(l)) return 'INR'; if (/-JP|^JA/.test(l)) return 'JPY'; if (/^(DE|FR|ES|IT|NL|PT)/.test(l) || /-(DE|FR|ES|IT|NL|PT|IE)/.test(l)) return 'EUR'; return 'USD'; }
  if (curSel) curSel.value = U.store.get('dc-currency', guessCur());
  function values() {
    var v = {}; U.$$('[name]', form).forEach(function (el) { v[el.name] = el.type === 'checkbox' ? el.checked : el.value; }); return v;
  }
  function fillUnits() {
    if (id !== 'units') return; var cat = U.$('[name=cat]', form).value, list = Object.keys(spec.units[cat]);
    ['from', 'to'].forEach(function (nm, i) { var sel = U.$('[name=' + nm + ']', form), keep = sel.value; sel.innerHTML = list.map(function (u) { return '<option>' + U.esc(u) + '</option>'; }).join(''); sel.value = list.indexOf(keep) >= 0 ? keep : list[Math.min(i, list.length - 1)]; });
  }
  function show(r) {
    if (r.error) { out.innerHTML = '<p class="err" role="alert">' + U.esc(r.error) + '</p>'; return; }
    var h = '<div class="result" aria-live="polite"><div class="lbl">' + U.esc(r.big.label) + '</div><div class="big">' + U.esc(r.big.text) + '</div>';
    if (r.kv && r.kv.length) h += '<div class="kv">' + r.kv.map(function (p) { return '<div><small>' + U.esc(p[0]) + '</small><b>' + U.esc(p[1]) + '</b></div>'; }).join('') + '</div>';
    h += '</div>';
    if (r.table) h += '<div class="table-wrap"><table><thead><tr>' + r.table.head.map(function (c) { return '<th>' + U.esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' + r.table.rows.map(function (row) { return '<tr>' + row.map(function (c) { return '<td>' + U.esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    if (r.note) h += '<p class="footnote">' + U.esc(r.note) + '</p>';
    out.innerHTML = h;
  }
  var first = true;
  function run() { var v = values(); if (first && id === 'dates' && !v.start) { first = false; out.innerHTML = '<p class="muted">Pick a start date to see the result.</p>'; return; } first = false; U.store.set(KEY, v); if (curSel) U.store.set('dc-currency', curSel.value); try { show(spec.compute(v)); } catch (e) { show({ error: 'Something went wrong with those numbers.' }); } }
  var saved = U.store.get(KEY, null);
  if (saved) U.$$('[name]', form).forEach(function (el) { if (el.name === 'currency' || !(el.name in saved)) return; if (el.type === 'checkbox') el.checked = !!saved[el.name]; else el.value = saved[el.name]; });
  fillUnits(); if (saved && id === 'units') { ['from', 'to'].forEach(function (k) { if (saved[k]) U.$('[name=' + k + ']', form).value = saved[k]; }); }
  U.on(form, 'input', U.debounce(run, 120)); U.on(form, 'change', function (e) { if (e.target.name === 'cat') fillUnits(); run(); });
  U.on(form, 'submit', function (e) { e.preventDefault(); run(); });
  U.$$('[data-preset]', form).forEach(function (b) { U.on(b, 'click', function () { var el = U.$('[name=' + b.getAttribute('data-for') + ']', form); el.value = b.getAttribute('data-preset'); run(); }); });
  U.on(U.$('#calc-reset'), 'click', function () { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } location.reload(); });
  U.on(U.$('#calc-swap'), 'click', function () { var a = U.$('[name=from]', form), b = U.$('[name=to]', form), t = a.value; a.value = b.value; b.value = t; run(); });
  if (id === 'dates' && !(saved && saved.start)) { /* leave start empty so the user picks it */ }
  run();
})();
