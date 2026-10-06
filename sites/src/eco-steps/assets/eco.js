/* EcoSteps calculators. Factors are rounded, widely published averages - results are estimates for awareness, not an audit. Unit-tested. */
(function (root, factory) { var api = factory(); if (typeof module === 'object' && module.exports) module.exports = api; else root.ECO = api; })(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var E = {};
  var GRID = { ca: ['Canada (average grid)', 0.13], us: ['United States', 0.37], uk: ['United Kingdom', 0.21], eu: ['European Union', 0.25], au: ['Australia', 0.65], in: ['India', 0.71], world: ['World average', 0.45], clean: ['Mostly renewable / hydro supply', 0.03] };
  var DIET = { vegan: ['Vegan', 1.5], veg: ['Vegetarian', 1.7], low: ['Low meat (a few times a week)', 2.2], avg: ['Average meat-eater', 2.6], high: ['Meat at most meals', 3.3] };
  var CAR_KG_PER_L = 2.31, GAS_KG_PER_KWH = 0.18, SHORT_T = 0.25, LONG_T = 1.6, WASTE_T = 0.4, TRANSIT_KG_PER_KM = 0.08;
  E.GRID = GRID; E.DIET = DIET;
  function num(x, d) { var n = parseFloat(x); return isFinite(n) && n >= 0 ? n : (d == null ? 0 : d); }
  E.footprint = function (v) {
    var kmWeek = num(v.carKm), lper100 = num(v.carL, 8), transitKm = num(v.transitKm), kwh = num(v.kwh), gasKwh = num(v.gasKwh), shortF = num(v.short), longF = num(v.long), people = Math.max(1, Math.floor(num(v.people, 1))), grid = GRID[v.grid] || GRID.world, diet = DIET[v.diet] || DIET.avg, recycle = v.recycle === true || v.recycle === 'true' || v.recycle === 'on';
    var parts = [
      ['Car', kmWeek * 52 * lper100 / 100 * CAR_KG_PER_L / 1000],
      ['Public transit', transitKm * 52 * TRANSIT_KG_PER_KM / 1000],
      ['Home electricity', kwh * 12 * grid[1] / 1000 / people],
      ['Home heating (gas)', gasKwh * 12 * GAS_KG_PER_KWH / 1000 / people],
      ['Flights', shortF * SHORT_T + longF * LONG_T],
      ['Food', diet[1]],
      ['Waste & goods', recycle ? WASTE_T * 0.8 : WASTE_T]
    ].map(function (p) { return [p[0], Math.round(p[1] * 100) / 100]; });
    var total = Math.round(parts.reduce(function (a, p) { return a + p[1]; }, 0) * 100) / 100;
    var biggest = parts.slice().sort(function (a, b) { return b[1] - a[1]; })[0];
    return { total: total, parts: parts, biggest: biggest, treesToOffset: Math.round(total * 1000 / 21), vsGlobal: total / 4.7, vsTarget: total / 2.3 };
  };
  E.applianceCost = function (v) {
    var w = num(v.watts), h = num(v.hours), d = num(v.days, 365), p = num(v.price), standbyW = num(v.standby), standbyH = 24 - Math.min(24, h);
    var kwhYear = (w * h + standbyW * standbyH) * d / 1000, cost = kwhYear * p, kg = kwhYear * (GRID[v.grid] || GRID.world)[1];
    return { kwhYear: kwhYear, costYear: cost, costMonth: cost / 12, kgYear: kg };
  };
  return E;
});
