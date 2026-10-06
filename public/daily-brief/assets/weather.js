/* Weather widget using the free Open-Meteo API (no key). Location is chosen by the visitor (search or device location) and kept only in this browser. */
(function () {
  'use strict';
  var box = U.$('#wx'); if (!box) return;
  var compact = box.hasAttribute('data-compact'), KEY = 'db-loc', UKEY = 'db-units';
  var WMO = { 0: ['Clear sky', '☀️'], 1: ['Mostly clear', '🌤️'], 2: ['Partly cloudy', '⛅'], 3: ['Overcast', '☁️'], 45: ['Fog', '🌫️'], 48: ['Freezing fog', '🌫️'], 51: ['Light drizzle', '🌦️'], 53: ['Drizzle', '🌦️'], 55: ['Heavy drizzle', '🌧️'], 56: ['Freezing drizzle', '🌧️'], 57: ['Freezing drizzle', '🌧️'], 61: ['Light rain', '🌦️'], 63: ['Rain', '🌧️'], 65: ['Heavy rain', '🌧️'], 66: ['Freezing rain', '🌧️'], 67: ['Freezing rain', '🌧️'], 71: ['Light snow', '🌨️'], 73: ['Snow', '❄️'], 75: ['Heavy snow', '❄️'], 77: ['Snow grains', '❄️'], 80: ['Rain showers', '🌦️'], 81: ['Rain showers', '🌧️'], 82: ['Violent showers', '⛈️'], 85: ['Snow showers', '🌨️'], 86: ['Heavy snow showers', '❄️'], 95: ['Thunderstorm', '⛈️'], 96: ['Thunderstorm, hail', '⛈️'], 99: ['Thunderstorm, hail', '⛈️'] };
  function wmo(c) { return WMO[c] || ['Unknown', '🌡️']; }
  var loc = U.store.get(KEY, null), units = U.store.get(UKEY, (navigator.language || '').toUpperCase().indexOf('-US') >= 0 ? 'f' : 'c');
  var ui = compact ? '' : '<form id="wx-form" class="row" role="search" style="margin-bottom:1rem"><label class="sr-only" for="wx-q">City</label><input id="wx-q" type="search" placeholder="Search a city (e.g. Toronto)" autocomplete="off" style="max-width:20rem"><button class="btn" type="submit">Search</button><button class="btn ghost" type="button" id="wx-geo">Use my location</button><button class="btn ghost" type="button" id="wx-units" aria-label="Switch units"></button></form><div id="wx-pick"></div>';
  box.innerHTML = ui + '<div id="wx-out" aria-live="polite"><p class="loading">' + (loc ? 'Loading the forecast...' : (compact ? 'Add your city to see the weather.' : 'Search for a city to see the forecast.')) + '</p></div>' + (compact ? '<p><a href="weather/">Change location / 7-day forecast</a></p>' : '');
  function setUnitsLabel() { var b = U.$('#wx-units'); if (b) b.textContent = units === 'c' ? 'Show °F' : 'Show °C'; }
  function load() {
    var out = U.$('#wx-out'); if (!loc) { return; }
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat + '&longitude=' + loc.lon + '&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=7&temperature_unit=' + (units === 'f' ? 'fahrenheit' : 'celsius') + '&wind_speed_unit=' + (units === 'f' ? 'mph' : 'kmh');
    out.innerHTML = '<p class="loading">Loading the forecast...</p>';
    U.fetchJSON(url, 9000).then(function (j) {
      var c = j.current, d = j.daily, deg = units === 'f' ? '°F' : '°C', ws = units === 'f' ? 'mph' : 'km/h', w = wmo(c.weather_code);
      var h = '<div class="result"><div class="lbl">' + U.esc(loc.name) + '</div><div class="big">' + w[1] + ' ' + Math.round(c.temperature_2m) + deg + '</div><div>' + U.esc(w[0]) + ' - feels like ' + Math.round(c.apparent_temperature) + deg + '</div><div class="kv"><div><small>Wind</small><b>' + Math.round(c.wind_speed_10m) + ' ' + ws + '</b></div><div><small>Humidity</small><b>' + Math.round(c.relative_humidity_2m) + '%</b></div><div><small>Today</small><b>' + Math.round(d.temperature_2m_min[0]) + '° / ' + Math.round(d.temperature_2m_max[0]) + '°</b></div><div><small>Rain chance</small><b>' + (d.precipitation_probability_max[0] == null ? '-' : d.precipitation_probability_max[0] + '%') + '</b></div></div></div>';
      if (!compact) h += '<div class="table-wrap" style="margin-top:1rem"><table><thead><tr><th>Day</th><th></th><th>Conditions</th><th>Low</th><th>High</th><th>Rain</th></tr></thead><tbody>' + d.time.map(function (t, i) { var dd = new Date(t + 'T12:00:00'); var wc = wmo(d.weather_code[i]); return '<tr><td>' + U.esc(i === 0 ? 'Today' : dd.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })) + '</td><td>' + wc[1] + '</td><td>' + U.esc(wc[0]) + '</td><td>' + Math.round(d.temperature_2m_min[i]) + deg + '</td><td>' + Math.round(d.temperature_2m_max[i]) + deg + '</td><td>' + (d.precipitation_probability_max[i] == null ? '-' : d.precipitation_probability_max[i] + '%') + '</td></tr>'; }).join('') + '</tbody></table></div><p class="footnote">Forecast data by <a href="https://open-meteo.com/" rel="noopener">Open-Meteo.com</a> (CC BY 4.0). Forecasts can change.</p>';
      out.innerHTML = h;
    }, function () { out.innerHTML = '<p class="err">Could not load the forecast right now. Please try again in a moment.</p>'; });
  }
  function search(q) {
    var pick = U.$('#wx-pick'); pick.innerHTML = '<p class="loading">Searching...</p>';
    U.fetchJSON('https://geocoding-api.open-meteo.com/v1/search?count=6&language=en&format=json&name=' + encodeURIComponent(q), 8000).then(function (j) {
      var r = j.results || []; if (!r.length) { pick.innerHTML = '<p class="empty">No place found - try a nearby larger city.</p>'; return; }
      pick.innerHTML = '<div class="chips" role="group" aria-label="Matching places">' + r.map(function (p, i) { return '<button type="button" class="chip" data-i="' + i + '">' + U.esc(p.name + (p.admin1 ? ', ' + p.admin1 : '') + (p.country_code ? ' (' + p.country_code + ')' : '')) + '</button>'; }).join('') + '</div>';
      U.$$('#wx-pick .chip').forEach(function (b) { U.on(b, 'click', function () { var p = r[+b.getAttribute('data-i')]; loc = { name: p.name + (p.country_code ? ', ' + p.country_code : ''), lat: p.latitude, lon: p.longitude }; U.store.set(KEY, loc); pick.innerHTML = ''; load(); }); });
      if (r.length === 1) U.$('#wx-pick .chip').click();
    }, function () { pick.innerHTML = '<p class="err">Place search is unavailable right now.</p>'; });
  }
  U.on(U.$('#wx-form'), 'submit', function (e) { e.preventDefault(); var q = U.$('#wx-q').value.trim(); if (q) search(q); });
  U.on(U.$('#wx-geo'), 'click', function () { if (!navigator.geolocation) { U.$('#wx-pick').innerHTML = '<p class="err">Your browser cannot share its location.</p>'; return; } navigator.geolocation.getCurrentPosition(function (p) { loc = { name: 'Your location', lat: Math.round(p.coords.latitude * 100) / 100, lon: Math.round(p.coords.longitude * 100) / 100 }; U.store.set(KEY, loc); load(); }, function () { U.$('#wx-pick').innerHTML = '<p class="err">Location permission was denied. Search for a city instead.</p>'; }, { timeout: 8000 }); });
  U.on(U.$('#wx-units'), 'click', function () { units = units === 'c' ? 'f' : 'c'; U.store.set(UKEY, units); setUnitsLabel(); load(); });
  setUnitsLabel(); if (loc) load();
})();
