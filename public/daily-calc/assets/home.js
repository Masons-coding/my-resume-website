(function () { var q = U.$('#find'), items = U.$$('#calc-grid [data-find]'), none = U.$('#no-match'); if (!q) return;
  U.on(q, 'input', function () { var t = q.value.trim().toLowerCase(), shown = 0; items.forEach(function (el) { var ok = !t || el.getAttribute('data-find').indexOf(t) >= 0; el.hidden = !ok; if (ok) shown++; }); if (none) none.hidden = shown > 0; }); })();
