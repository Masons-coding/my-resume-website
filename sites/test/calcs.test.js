const test = require('node:test'), assert = require('node:assert'), C = require('../src/daily-calc/assets/calcs.js');
const near = (a, b, e = 0.01) => assert.ok(Math.abs(a - b) <= e, `${a} vs ${b}`);
const run = (id, v) => C.byId[id].compute(v);
test('mortgage: standard payment and zero-rate loan', () => {
  near(run('mortgage', { amount: 350000, rate: 5.25, years: 25, comp: 'monthly' }).raw.payment, 2097.37, 0.05);
  near(run('mortgage', { amount: 100000, rate: 0, years: 10 }).raw.payment, 833.33, 0.01);
  const x = run('mortgage', { amount: 350000, rate: 5.25, years: 25, comp: 'monthly', extra: 200 }); assert.ok(x.raw.months < 300 && x.kv.some((k) => k[0] === 'Interest saved'));
  assert.ok(run('mortgage', { amount: -5, rate: 3, years: 5 }).error); assert.ok(run('mortgage', { amount: '', rate: 3, years: 5 }).error);
  assert.ok(run('mortgage', { amount: 350000, rate: 5.25, years: 25, comp: 'semi' }).raw.payment < run('mortgage', { amount: 350000, rate: 5.25, years: 25, comp: 'monthly' }).raw.payment);
});
test('tip: split and rounding', () => {
  near(run('tip', { bill: 100, tip: 20, people: 4 }).raw.share, 30); near(run('tip', { bill: 86.4, tip: 18, people: 2, round: true }).raw.share, 51);
  assert.ok(run('tip', { bill: -1, tip: 10, people: 1 }).error);
});
test('percent: all modes', () => {
  assert.strictEqual(run('percent', { mode: 'of', x: 15, y: 200 }).raw.v, 30); assert.strictEqual(run('percent', { mode: 'is', x: 30, y: 200 }).raw.v, 15);
  near(run('percent', { mode: 'change', x: 50, y: 75 }).raw.v, 50); near(run('percent', { mode: 'change', x: 100, y: 50 }).raw.v, -50);
  assert.strictEqual(run('percent', { mode: 'up', x: 10, y: 80 }).raw.v, 88); assert.strictEqual(run('percent', { mode: 'down', x: 25, y: 80 }).raw.v, 60);
  assert.ok(run('percent', { mode: 'is', x: 1, y: 0 }).error); assert.ok(run('percent', { mode: 'change', x: 0, y: 5 }).error);
});
test('bmi: metric = imperial and bounds', () => {
  near(run('bmi', { units: 'metric', weight: 70, height: 175 }).raw.bmi, 22.86, 0.01);
  near(run('bmi', { units: 'imperial', weight: 154.324, height: 5, inches: 8.9 }).raw.bmi, 22.86, 0.1);
  assert.ok(run('bmi', { units: 'metric', weight: 70, height: 5 }).error);
});
test('compound: matches closed form for monthly compounding', () => {
  const r = run('compound', { start: 1000, monthly: 0, rate: 12, years: 1, freq: '12' }); near(r.raw.balance, 1000 * Math.pow(1.01, 12), 0.01);
  const z = run('compound', { start: 0, monthly: 100, rate: 0, years: 5, freq: '12' }); near(z.raw.balance, 6000);
  assert.ok(run('compound', { start: 0, monthly: 10, rate: 5, years: 200, freq: '12' }).error);
});
test('units: conversions', () => {
  near(C.convert('length', 1, 'mi', 'km'), 1.609344, 1e-6); near(C.convert('length', 12, 'in', 'ft'), 1, 1e-9); near(C.convert('mass', 1, 'kg', 'lb'), 2.2046226, 1e-6);
  near(C.convert('temperature', 100, 'C', 'F'), 212, 1e-9); near(C.convert('temperature', 0, 'K', 'C'), -273.15, 1e-9); near(C.convert('temperature', -40, 'F', 'C'), -40, 1e-9);
  near(C.convert('volume', 1, 'US gal', 'L'), 3.785411784, 1e-9); near(C.convert('speed', 100, 'km/h', 'mph'), 62.137, 0.001); near(C.convert('time', 1, 'day', 'h'), 24, 1e-9);
});
test('dates: age and leap years', () => {
  const d = run('dates', { start: '2024-02-28', end: '2024-03-01' }); assert.strictEqual(d.raw.days, 2); assert.deepStrictEqual(d.raw.ymd, [0, 0, 2]);
  assert.deepStrictEqual(run('dates', { start: '1990-06-15', end: '2020-06-15' }).raw.ymd, [30, 0, 0]);
  assert.deepStrictEqual(run('dates', { start: '2000-01-31', end: '2000-03-01' }).raw.ymd, [0, 1, 1]);
  assert.ok(run('dates', { start: '', end: '2020-01-01' }).error); assert.ok(run('dates', { start: '2020-02-30', end: '2020-03-01' }).error);
  assert.match(run('dates', { start: '2020-01-05', end: '2020-01-01' }).big.label, /swapped/);
  assert.strictEqual(run('dates', { start: '2024-01-01', end: '2024-01-08' }).kv.find((k) => k[0].startsWith('Working'))[1], '5');
});
test('salary, fuel, discount', () => {
  near(run('salary', { mode: 'hourly', amount: 28, hours: 40, weeks: 52 }).raw.annual, 58240); near(run('salary', { mode: 'annual', amount: 58240, hours: 40, weeks: 52 }).raw.hourly, 28);
  near(run('fuel', { system: 'metric', distance: 100, eff: 8, price: 2 }).raw.cost, 16); near(run('fuel', { system: 'us', distance: 300, eff: 30, price: 4 }).raw.cost, 40); near(run('fuel', { system: 'metric', distance: 100, eff: 8, price: 2, round: true }).raw.cost, 32);
  near(run('discount', { mode: 'sale', price: 120, discount: 25, tax: 13 }).raw.total, 101.7); near(run('discount', { mode: 'untax', price: 113, tax: 13 }).raw.pre, 100);
  assert.ok(run('discount', { mode: 'sale', price: 10, discount: 150, tax: 5 }).error);
});
test('every calculator has a slug, unique id, fields and default values that compute without error', () => {
  const slugs = new Set(); for (const s of C.list) { assert.ok(!slugs.has(s.slug)); slugs.add(s.slug); const v = {}; for (const f of s.fields) v[f.name] = f.value; v.currency = 'CAD'; if (s.id === 'dates') v.start = '2000-01-01'; const r = s.compute(v); assert.ok(!r.error, s.id + ': ' + r.error); assert.ok(r.big && r.big.text); }
});
