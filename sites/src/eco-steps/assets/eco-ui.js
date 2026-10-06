(function () {
  'use strict';
  var root = U.$('[data-eco]'); if (!root) return; var id = root.getAttribute('data-eco');
  function vals(f) { var v = {}; U.$$('[name]', f).forEach(function (el) { v[el.name] = el.type === 'checkbox' ? el.checked : el.value; }); return v; }
  function persist(f, key) { var s = U.store.get(key, null); if (s) U.$$('[name]', f).forEach(function (el) { if (!(el.name in s)) return; if (el.type === 'checkbox') el.checked = !!s[el.name]; else el.value = s[el.name]; }); U.on(f, 'input', function () { U.store.set(key, vals(f)); }); U.on(f, 'change', function () { U.store.set(key, vals(f)); }); }
  var init = {
    footprint: function () {
      var f = U.$('#f'), out = U.$('#out'); persist(f, 'es-fp');
      function run() { var r = ECO.footprint(vals(f)), max = Math.max.apply(null, r.parts.map(function (p) { return p[1]; })) || 1;
        out.innerHTML = '<div class="result"><div class="lbl">Your estimated footprint</div><div class="big">' + U.fmt(r.total, 1) + ' tonnes CO2e / year</div><div class="kv"><div><small>vs. world average (about 4.7 t)</small><b>' + U.fmt(r.vsGlobal * 100, 0) + '%</b></div><div><small>vs. a 1.5 degree-compatible target (about 2.3 t)</small><b>' + U.fmt(r.vsTarget * 100, 0) + '%</b></div><div><small>Biggest slice</small><b>' + U.esc(r.biggest[0]) + '</b></div><div><small>Trees needed to absorb it (rough)</small><b>' + U.fmt(r.treesToOffset, 0) + ' / yr</b></div></div></div>' +
          '<h3>Where it comes from</h3><div class="bars">' + r.parts.map(function (p) { return '<div class="bar"><span>' + U.esc(p[0]) + '</span><i style="width:' + Math.max(2, p[1] / max * 100) + '%"></i><b>' + U.fmt(p[1], 2) + ' t</b></div>'; }).join('') + '</div><p class="footnote">An estimate based on rounded averages. Real figures depend on your vehicle, home, and where your food and goods come from.</p>'; }
      U.on(f, 'input', U.debounce(run, 120)); U.on(f, 'change', run); U.on(f, 'submit', function (e) { e.preventDefault(); run(); }); run();
    },
    appliance: function () {
      var f = U.$('#f'), out = U.$('#out'); persist(f, 'es-ap');
      function run() { var v = vals(f), r = ECO.applianceCost(v), cur = v.cur || '$'; out.innerHTML = '<div class="result"><div class="lbl">Running cost per year</div><div class="big">' + U.esc(cur) + U.fmt(r.costYear, 2) + '</div><div class="kv"><div><small>Per month</small><b>' + U.esc(cur) + U.fmt(r.costMonth, 2) + '</b></div><div><small>Energy per year</small><b>' + U.fmt(r.kwhYear, 0) + ' kWh</b></div><div><small>CO2 per year</small><b>' + U.fmt(r.kgYear, 0) + ' kg</b></div></div></div>'; }
      U.on(f, 'input', U.debounce(run, 120)); U.on(f, 'change', run); U.on(f, 'submit', function (e) { e.preventDefault(); run(); });
      U.$$('[data-w]', root).forEach(function (b) { U.on(b, 'click', function () { U.$('[name=watts]', f).value = b.getAttribute('data-w'); U.$('[name=hours]', f).value = b.getAttribute('data-h'); U.$('[name=standby]', f).value = b.getAttribute('data-s') || 0; run(); }); }); run();
    },
    recycle: function () {
      var q = U.$('#rq'), rows = U.$$('#rt tbody tr'), none = U.$('#rn'); U.on(q, 'input', function () { var t = q.value.trim().toLowerCase(), n = 0; rows.forEach(function (r) { var hay = r.getAttribute('data-q'), ok = !t || hay.indexOf(t) >= 0 || (t.length > 4 && hay.indexOf(t.slice(0, t.length - 2)) >= 0); r.hidden = !ok; if (ok) n++; }); none.hidden = n > 0; });
    },
    checklist: function () {
      var key = 'es-' + root.getAttribute('data-key'), done = U.store.get(key, {}), boxes = U.$$('input[type=checkbox][data-i]', root), prog = U.$('#prog'), bar = U.$('#progbar');
      function upd() { var n = boxes.filter(function (b) { return b.checked; }).length; if (prog) prog.textContent = n + ' of ' + boxes.length + ' done'; if (bar) bar.style.width = (boxes.length ? n / boxes.length * 100 : 0) + '%'; }
      boxes.forEach(function (b) { b.checked = !!done[b.getAttribute('data-i')]; U.on(b, 'change', function () { done[b.getAttribute('data-i')] = b.checked; U.store.set(key, done); upd(); }); });
      U.on(U.$('#reset'), 'click', function () { done = {}; U.store.set(key, done); boxes.forEach(function (b) { b.checked = false; }); upd(); }); U.on(U.$('#print'), 'click', function () { window.print(); }); upd();
    }
  };
  if ((id === 'footprint' || id === 'appliance') && !window.ECO) return;
  if (init[id]) init[id]();
})();
