(function () {
  var box = U.$('#hist'); if (!box || !window.NEWS) return; var limit = +box.getAttribute('data-limit') || 12;
  NEWS.fetchWikiDay().then(function (j) {
    var ev = ((j.onthisday || []).filter(function (x) { return x.text && x.year != null; }) || []).sort(function (a, b) { return a.year - b.year; });
    if (!ev.length) throw new Error('none'); var pick = ev.length > limit ? ev.filter(function (x, i) { return i % Math.ceil(ev.length / limit) === 0; }).slice(0, limit) : ev;
    box.innerHTML = '<ul class="timeline">' + pick.map(function (x) { var p = (x.pages || [])[0], u = p && p.content_urls && p.content_urls.desktop && p.content_urls.desktop.page; return '<li><strong>' + U.esc(x.year) + '</strong> - ' + (u ? '<a href="' + U.esc(u) + '" rel="noopener noreferrer" target="_blank">' + U.esc(x.text) + '</a>' : U.esc(x.text)) + '</li>'; }).join('') + '</ul><p class="footnote">From Wikipedia (CC BY-SA 4.0).</p>';
    var tfa = j.tfa, t = U.$('#tfa'); if (t && tfa && tfa.titles) t.innerHTML = '<h3><a href="' + U.esc(tfa.content_urls.desktop.page) + '" rel="noopener noreferrer" target="_blank">' + U.esc(tfa.titles.normalized) + '</a></h3><p>' + U.esc((tfa.description || '') + (tfa.extract ? ' - ' + tfa.extract.slice(0, 200) + (tfa.extract.length > 200 ? '...' : '') : '')) + '</p><p class="footnote">Today\'s featured article on Wikipedia (CC BY-SA 4.0).</p>';
  }).catch(function () { box.innerHTML = '<p class="empty">Could not load today\'s history right now.</p>'; });
})();
