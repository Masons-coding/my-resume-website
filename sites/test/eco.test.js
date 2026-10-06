const test = require('node:test'), assert = require('node:assert'), E = require('../src/eco-steps/assets/eco.js');
test('footprint adds up and car math is right', () => {
  const r = E.footprint({ carKm: 200, carL: 8, kwh: 0, gasKwh: 0, short: 0, long: 0, diet: 'avg', grid: 'ca', people: 1 });
  const car = r.parts.find((p) => p[0] === 'Car')[1]; assert.ok(Math.abs(car - 200 * 52 * 0.08 * 2.31 / 1000) < 0.01);
  assert.ok(Math.abs(r.total - r.parts.reduce((a, p) => a + p[1], 0)) < 0.011);
});
test('household sharing divides home energy; flights add; diet matters', () => {
  const a = E.footprint({ kwh: 900, gasKwh: 1500, grid: 'us', people: 1, diet: 'vegan' }), b = E.footprint({ kwh: 900, gasKwh: 1500, grid: 'us', people: 3, diet: 'vegan' });
  assert.ok(b.total < a.total); assert.ok(E.footprint({ long: 2 }).total > E.footprint({ long: 0 }).total + 3);
  assert.ok(E.footprint({ diet: 'high' }).total > E.footprint({ diet: 'vegan' }).total);
});
test('bad input never produces NaN', () => { const r = E.footprint({ carKm: 'abc', kwh: -5, diet: 'zzz', grid: 'zzz' }); assert.ok(Number.isFinite(r.total)); });
test('appliance cost', () => {
  const r = E.applianceCost({ watts: 100, hours: 10, days: 365, price: 0.2, standby: 0, grid: 'world' }); assert.ok(Math.abs(r.kwhYear - 365) < 1e-9); assert.ok(Math.abs(r.costYear - 73) < 1e-9);
  assert.ok(E.applianceCost({ watts: 100, hours: 1, standby: 5, price: 0.2 }).kwhYear > E.applianceCost({ watts: 100, hours: 1, standby: 0, price: 0.2 }).kwhYear);
});
