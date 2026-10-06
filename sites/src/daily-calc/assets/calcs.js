/* DailyCalc: every calculator is a spec {id,title,fields,compute}. The same file renders the forms at build time and computes in the browser,
   and is unit-tested in Node (test/calcs.test.js). compute(values) returns {error} or {big:{label,text},kv:[[label,text]],table:{head,rows},note}. */
(function (root, factory) { var api = factory(); if (typeof module === 'object' && module.exports) module.exports = api; else root.CALCS = api; })(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var CUR = ['CAD', 'USD', 'EUR', 'GBP', 'AUD', 'NZD', 'INR', 'JPY'];
  function n(v) { var x = parseFloat(String(v == null ? '' : v).replace(/,/g, '')); return isFinite(x) ? x : NaN; }
  function fmt(x, dp) { if (!isFinite(x)) return '-'; try { return new Intl.NumberFormat('en-US', { maximumFractionDigits: dp == null ? 2 : dp, minimumFractionDigits: 0 }).format(x); } catch (e) { return String(Math.round(x * 100) / 100); } }
  function money(x, cur) { if (!isFinite(x)) return '-'; try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur || 'USD', maximumFractionDigits: cur === 'JPY' ? 0 : 2, minimumFractionDigits: cur === 'JPY' ? 0 : 2 }).format(x); } catch (e) { return (Math.round(x * 100) / 100).toFixed(2); } }
  function yrs(months) { var y = Math.floor(months / 12), m = Math.round(months - y * 12); if (m === 12) { y++; m = 0; } return (y ? y + (y === 1 ? ' year' : ' years') : '') + (y && m ? ' ' : '') + (m || !y ? m + (m === 1 ? ' month' : ' months') : ''); }
  function need(v, names) { for (var i = 0; i < names.length; i++) if (!isFinite(n(v[names[i]]))) return { error: 'Please enter a number for "' + names[i].replace(/_/g, ' ') + '".' }; return null; }
  var C = { list: [], byId: {}, util: { n: n, fmt: fmt, money: money, yrs: yrs } };
  function add(spec) { C.list.push(spec); C.byId[spec.id] = spec; }

  /* 1 Mortgage / loan payment */
  function monthlyRate(rate, comp) { var a = rate / 100; if (a === 0) return 0; if (comp === 'semi') return Math.pow(1 + a / 2, 1 / 6) - 1; return a / 12; }
  function payment(P, r, N) { return r === 0 ? P / N : P * r / (1 - Math.pow(1 + r, -N)); }
  function amortize(P, r, pay, extra) { var bal = P, months = 0, interest = 0, yearly = [], yi = 0, yp = 0; while (bal > 0.005 && months < 1200) { var i = bal * r, p = Math.min(bal, pay + extra - i); if (p <= 0) return null; bal -= p; interest += i; yi += i; yp += p; months++; if (months % 12 === 0 || bal <= 0.005) { yearly.push([Math.ceil(months / 12), yp, yi, Math.max(0, bal)]); yi = 0; yp = 0; } } return { months: months, interest: interest, yearly: yearly }; }
  add({ id: 'mortgage', title: 'Mortgage & Loan Payment Calculator', slug: 'mortgage-calculator', emoji: '🏠', blurb: 'Monthly payment, total interest and payoff time for a mortgage, car loan or personal loan.',
    fields: [{ name: 'amount', label: 'Loan amount', value: 350000, type: 'money', step: 1000, min: 0 }, { name: 'rate', label: 'Interest rate (% per year)', value: 5.25, step: 0.01, min: 0, max: 40 }, { name: 'years', label: 'Term (years)', value: 25, step: 1, min: 1, max: 50 }, { name: 'comp', label: 'Compounding', type: 'select', options: [['monthly', 'Monthly (US style)'], ['semi', 'Semi-annual (Canadian mortgages)']], value: 'monthly' }, { name: 'extra', label: 'Extra payment each month (optional)', value: 0, type: 'money', step: 50, min: 0 }],
    compute: function (v) { var e = need(v, ['amount', 'rate', 'years']); if (e) return e; var P = n(v.amount), rate = n(v.rate), Y = n(v.years), x = Math.max(0, n(v.extra) || 0); if (P <= 0 || Y <= 0 || rate < 0) return { error: 'Amount and term must be above zero and the rate cannot be negative.' };
      var r = monthlyRate(rate, v.comp), N = Math.round(Y * 12), pay = payment(P, r, N), base = amortize(P, r, pay, 0), withX = x > 0 ? amortize(P, r, pay, x) : null;
      var used = withX || base, kv = [['Total interest', money(used.interest, v.currency)], ['Total paid', money(P + used.interest, v.currency)], ['Payoff time', yrs(used.months)]];
      if (withX) kv.push(['Interest saved', money(base.interest - withX.interest, v.currency)], ['Time saved', yrs(base.months - withX.months)]);
      return { big: { label: x > 0 ? 'Monthly payment (before extra)' : 'Monthly payment', text: money(pay, v.currency) }, kv: kv, table: { head: ['Year', 'Principal paid', 'Interest paid', 'Balance'], rows: used.yearly.map(function (y) { return [String(y[0]), money(y[1], v.currency), money(y[2], v.currency), money(y[3], v.currency)]; }) }, note: 'Estimate only: real loans may add fees, insurance, property tax or different compounding rules.', raw: { payment: pay, interest: used.interest, months: used.months } }; } });

  /* 2 Tip */
  add({ id: 'tip', title: 'Tip & Bill Split Calculator', slug: 'tip-calculator', emoji: '🍽️', blurb: 'Work out the tip and split the bill evenly between friends.',
    fields: [{ name: 'bill', label: 'Bill (before tip)', value: 86.4, type: 'money', step: 0.01, min: 0 }, { name: 'tip', label: 'Tip (%)', value: 18, step: 1, min: 0, max: 100, presets: [10, 15, 18, 20, 25] }, { name: 'people', label: 'Split between', value: 2, step: 1, min: 1, max: 100 }, { name: 'round', label: 'Round each share up to a whole amount', type: 'checkbox', value: false }],
    compute: function (v) { var e = need(v, ['bill', 'tip', 'people']); if (e) return e; var b = n(v.bill), t = n(v.tip), p = Math.max(1, Math.floor(n(v.people))); if (b < 0 || t < 0) return { error: 'Bill and tip cannot be negative.' };
      var tip = b * t / 100, total = b + tip, share = total / p; if (v.round === true || v.round === 'true' || v.round === 'on') { share = Math.ceil(share - 1e-9); total = share * p; tip = total - b; }
      return { big: { label: 'Each person pays', text: money(share, v.currency) }, kv: [['Tip total', money(tip, v.currency)], ['Total with tip', money(total, v.currency)], ['People', String(p)], ['Tip per person', money(tip / p, v.currency)]], raw: { share: share, tip: tip, total: total } }; } });

  /* 3 Percentage */
  add({ id: 'percent', title: 'Percentage Calculator', slug: 'percentage-calculator', emoji: '％', blurb: 'Percent of a number, percent change, what percent is X of Y, and increase or decrease by a percent.',
    fields: [{ name: 'mode', label: 'What do you want to know?', type: 'select', value: 'of', options: [['of', 'What is X% of Y?'], ['is', 'X is what % of Y?'], ['change', '% change from X to Y'], ['up', 'Increase Y by X%'], ['down', 'Decrease Y by X%']] }, { name: 'x', label: 'X', value: 15, step: 'any' }, { name: 'y', label: 'Y', value: 200, step: 'any' }],
    compute: function (v) { var e = need(v, ['x', 'y']); if (e) return e; var x = n(v.x), y = n(v.y), m = v.mode || 'of';
      if (m === 'of') return { big: { label: x + '% of ' + fmt(y), text: fmt(x / 100 * y, 6) }, kv: [['Formula', 'X / 100 x Y']], raw: { v: x / 100 * y } };
      if (m === 'is') { if (y === 0) return { error: 'Y cannot be zero.' }; return { big: { label: fmt(x) + ' as a percent of ' + fmt(y), text: fmt(x / y * 100, 6) + '%' }, kv: [['Formula', 'X / Y x 100']], raw: { v: x / y * 100 } }; }
      if (m === 'change') { if (x === 0) return { error: 'The starting value X cannot be zero.' }; var c = (y - x) / Math.abs(x) * 100; return { big: { label: 'Change from ' + fmt(x) + ' to ' + fmt(y), text: (c > 0 ? '+' : '') + fmt(c, 6) + '%' }, kv: [['Difference', fmt(y - x, 6)], ['Direction', c > 0 ? 'Increase' : c < 0 ? 'Decrease' : 'No change']], raw: { v: c } }; }
      if (m === 'up') return { big: { label: fmt(y) + ' increased by ' + fmt(x) + '%', text: fmt(y * (1 + x / 100), 6) }, kv: [['Amount added', fmt(y * x / 100, 6)]], raw: { v: y * (1 + x / 100) } };
      return { big: { label: fmt(y) + ' decreased by ' + fmt(x) + '%', text: fmt(y * (1 - x / 100), 6) }, kv: [['Amount removed', fmt(y * x / 100, 6)]], raw: { v: y * (1 - x / 100) } }; } });

  /* 4 BMI */
  add({ id: 'bmi', title: 'BMI Calculator', slug: 'bmi-calculator', emoji: '⚖️', blurb: 'Body mass index for adults in metric or imperial units, with the healthy weight range for your height.',
    fields: [{ name: 'units', label: 'Units', type: 'select', value: 'metric', options: [['metric', 'Metric (kg, cm)'], ['imperial', 'Imperial (lb, ft + in)']] }, { name: 'weight', label: 'Weight (kg or lb)', value: 70, step: 0.1, min: 1 }, { name: 'height', label: 'Height (cm, or feet if imperial)', value: 175, step: 0.1, min: 1 }, { name: 'inches', label: 'Extra inches (imperial only)', value: 0, step: 0.1, min: 0, max: 11.9 }],
    compute: function (v) { var e = need(v, ['weight', 'height']); if (e) return e; var imp = v.units === 'imperial', kg = imp ? n(v.weight) * 0.45359237 : n(v.weight), m = imp ? (n(v.height) * 12 + (n(v.inches) || 0)) * 0.0254 : n(v.height) / 100;
      if (!(kg > 0) || !(m > 0.5) || m > 2.8 || kg > 700) return { error: 'Please check the numbers - weight and height look out of range.' };
      var b = kg / (m * m), cat = b < 18.5 ? 'Underweight' : b < 25 ? 'Healthy range' : b < 30 ? 'Overweight' : 'Obesity range', lo = 18.5 * m * m, hi = 24.9 * m * m, u = imp ? 'lb' : 'kg', f = imp ? 2.2046226 : 1;
      return { big: { label: 'Your BMI', text: fmt(b, 1) }, kv: [['Category (WHO adult)', cat], ['Healthy weight range', fmt(lo * f, 1) + ' - ' + fmt(hi * f, 1) + ' ' + u]], note: 'BMI is a rough screening number. It ignores muscle, age, sex and body shape, and it is not a diagnosis. Talk to a doctor about your health.', raw: { bmi: b } }; } });

  /* 5 Compound interest */
  add({ id: 'compound', title: 'Compound Interest & Savings Calculator', slug: 'compound-interest-calculator', emoji: '📈', blurb: 'See how savings or an investment can grow with regular deposits and compound interest.',
    fields: [{ name: 'start', label: 'Starting balance', value: 5000, type: 'money', step: 100, min: 0 }, { name: 'monthly', label: 'Deposit each month', value: 300, type: 'money', step: 25, min: 0 }, { name: 'rate', label: 'Annual return (%)', value: 6, step: 0.1, min: -50, max: 100 }, { name: 'years', label: 'Years', value: 20, step: 1, min: 1, max: 80 }, { name: 'freq', label: 'Compounded', type: 'select', value: '12', options: [['12', 'Monthly'], ['365', 'Daily'], ['4', 'Quarterly'], ['1', 'Yearly']] }],
    compute: function (v) { var e = need(v, ['start', 'monthly', 'rate', 'years']); if (e) return e; var s = n(v.start), d = n(v.monthly), a = n(v.rate) / 100, Y = Math.round(n(v.years)), f = n(v.freq) || 12; if (s < 0 || d < 0 || Y < 1 || Y > 80) return { error: 'Use zero or more for money and 1-80 years.' };
      var r = Math.pow(1 + a / f, f / 12) - 1, bal = s, put = s, rows = [];
      for (var m = 1; m <= Y * 12; m++) { bal = bal * (1 + r) + d; put += d; if (m % 12 === 0) rows.push([String(m / 12), money(put, v.currency), money(bal - put, v.currency), money(bal, v.currency)]); }
      return { big: { label: 'Balance after ' + Y + (Y === 1 ? ' year' : ' years'), text: money(bal, v.currency) }, kv: [['You put in', money(put, v.currency)], ['Interest earned', money(bal - put, v.currency)], ['Growth multiple', fmt(put ? bal / put : 0, 2) + 'x']], table: { head: ['Year', 'Total deposited', 'Interest so far', 'Balance'], rows: rows }, note: 'Returns are not guaranteed and real investments go up and down. Fees and taxes are not included.', raw: { balance: bal, deposited: put } }; } });

  /* 6 Unit converter */
  var U = {
    length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
    mass: { kg: 1, g: 0.001, mg: 1e-6, lb: 0.45359237, oz: 0.028349523125, st: 6.35029318, t: 1000 },
    volume: { L: 1, mL: 0.001, 'US gal': 3.785411784, 'UK gal': 4.54609, 'US cup': 0.2365882365, 'US fl oz': 0.0295735295625, tbsp: 0.01478676478, tsp: 0.00492892159 },
    speed: { 'm/s': 1, 'km/h': 1 / 3.6, mph: 0.44704, knot: 0.514444 },
    area: { 'm2': 1, 'km2': 1e6, ha: 1e4, acre: 4046.8564224, 'ft2': 0.09290304, 'yd2': 0.83612736, 'mi2': 2589988.110336 },
    temperature: { C: 1, F: 1, K: 1 }, time: { s: 1, min: 60, h: 3600, day: 86400, week: 604800, year: 31557600 }
  };
  function temp(x, a, b) { var c = a === 'C' ? x : a === 'F' ? (x - 32) * 5 / 9 : x - 273.15; return b === 'C' ? c : b === 'F' ? c * 9 / 5 + 32 : c + 273.15; }
  function convert(cat, x, a, b) { if (cat === 'temperature') return temp(x, a, b); return x * U[cat][a] / U[cat][b]; }
  add({ id: 'units', title: 'Unit Converter', slug: 'unit-converter', emoji: '📏', blurb: 'Convert length, weight, volume, speed, area, temperature and time - metric and imperial.',
    fields: [{ name: 'cat', label: 'Type', type: 'select', value: 'length', options: Object.keys(U).map(function (k) { return [k, k[0].toUpperCase() + k.slice(1)]; }) }, { name: 'value', label: 'Value', value: 1, step: 'any' }, { name: 'from', label: 'From', type: 'unit', value: 'mi' }, { name: 'to', label: 'To', type: 'unit', value: 'km' }], units: U,
    compute: function (v) { var e = need(v, ['value']); if (e) return e; var cat = v.cat || 'length'; if (!U[cat]) return { error: 'Unknown type.' }; var from = U[cat][v.from] ? v.from : Object.keys(U[cat])[0], to = U[cat][v.to] ? v.to : Object.keys(U[cat])[1], x = n(v.value), out = convert(cat, x, from, to);
      return { big: { label: fmt(x, 8) + ' ' + from + ' =', text: fmt(out, 8) + ' ' + to }, kv: Object.keys(U[cat]).filter(function (k) { return k !== from; }).map(function (k) { return [k, fmt(convert(cat, x, from, k), 6)]; }), raw: { v: out } }; } });

  /* 7 Date difference / age */
  function parseD(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '')); if (!m) return null; var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); return d.getUTCMonth() === +m[2] - 1 ? d : null; }
  function today() { var d = new Date(); return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); }
  function addMonths(a, k) { var y = a.getUTCFullYear(), m = a.getUTCMonth() + k, yy = y + Math.floor(m / 12), mm = ((m % 12) + 12) % 12, last = new Date(Date.UTC(yy, mm + 1, 0)).getUTCDate(); return new Date(Date.UTC(yy, mm, Math.min(a.getUTCDate(), last))); }
  function diffYMD(a, b) { var k = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + b.getUTCMonth() - a.getUTCMonth(); while (k > 0 && addMonths(a, k) > b) k--; var d = Math.round((b - addMonths(a, k)) / 864e5); return [Math.floor(k / 12), k % 12, d]; }
  function bizDays(a, b) { var c = 0, t = a.getTime(); while (t < b.getTime()) { var w = new Date(t).getUTCDay(); if (w !== 0 && w !== 6) c++; t += 864e5; } return c; }
  add({ id: 'dates', title: 'Age & Date Difference Calculator', slug: 'age-date-calculator', emoji: '📅', blurb: 'Exact age, or the time between two dates in years, months, days, weeks and working days.',
    fields: [{ name: 'start', label: 'Start date (or birth date)', type: 'date', value: '' }, { name: 'end', label: 'End date (leave empty for today)', type: 'date', value: '' }],
    compute: function (v) { var a = parseD(v.start), b = v.end ? parseD(v.end) : today(); if (!a) return { error: 'Please pick a start date.' }; if (!b) return { error: 'The end date is not valid.' }; var flip = a > b; if (flip) { var t = a; a = b; b = t; }
      var ymd = diffYMD(a, b), days = Math.round((b - a) / 864e5), next = null;
      var kv = [['Total days', fmt(days, 0)], ['Weeks', fmt(Math.floor(days / 7), 0) + ' w ' + (days % 7) + ' d'], ['Months (approx.)', fmt(ymd[0] * 12 + ymd[1], 0)], ['Working days (Mon-Fri)', fmt(bizDays(a, b), 0)], ['Hours', fmt(days * 24, 0)]];
      return { big: { label: flip ? 'Time between (dates swapped)' : 'Time between', text: ymd[0] + ' y ' + ymd[1] + ' m ' + ymd[2] + ' d' }, kv: kv, raw: { days: days, ymd: ymd } }; } });

  /* 8 Salary / hourly */
  add({ id: 'salary', title: 'Hourly to Salary Calculator', slug: 'hourly-to-salary-calculator', emoji: '💼', blurb: 'Convert hourly pay to annual, monthly, weekly and daily pay - or the other way round.',
    fields: [{ name: 'mode', label: 'I know my', type: 'select', value: 'hourly', options: [['hourly', 'Hourly rate'], ['annual', 'Annual salary']] }, { name: 'amount', label: 'Amount', value: 28, type: 'money', step: 0.01, min: 0 }, { name: 'hours', label: 'Hours per week', value: 40, step: 0.5, min: 1, max: 100 }, { name: 'weeks', label: 'Paid weeks per year', value: 52, step: 1, min: 1, max: 52 }],
    compute: function (v) { var e = need(v, ['amount', 'hours', 'weeks']); if (e) return e; var a = n(v.amount), h = n(v.hours), w = n(v.weeks); if (a < 0 || h <= 0 || w <= 0) return { error: 'Use positive numbers.' }; var annual = v.mode === 'annual' ? a : a * h * w, hourly = annual / (h * w);
      return { big: { label: v.mode === 'annual' ? 'Hourly rate' : 'Annual pay (before tax)', text: money(v.mode === 'annual' ? hourly : annual, v.currency) }, kv: [['Annual', money(annual, v.currency)], ['Monthly', money(annual / 12, v.currency)], ['Bi-weekly', money(annual / 26, v.currency)], ['Weekly', money(annual / w, v.currency)], ['Daily (5-day week)', money(h * hourly / 5, v.currency)], ['Hourly', money(hourly, v.currency)]], note: 'Before tax and deductions. Paid vacation is included when you keep paid weeks at 52.', raw: { annual: annual, hourly: hourly } }; } });

  /* 9 Fuel / trip cost */
  add({ id: 'fuel', title: 'Fuel Cost & Trip Calculator', slug: 'fuel-cost-calculator', emoji: '⛽', blurb: 'What a road trip will cost in fuel, and the cost per person - metric (L/100 km) or imperial (mpg).',
    fields: [{ name: 'system', label: 'Units', type: 'select', value: 'metric', options: [['metric', 'Metric (km, L/100 km, price per L)'], ['us', 'US (miles, mpg, price per gallon)']] }, { name: 'distance', label: 'Distance (km or miles)', value: 480, step: 1, min: 0 }, { name: 'eff', label: 'Fuel use (L/100 km or mpg)', value: 8.2, step: 0.1, min: 0.1 }, { name: 'price', label: 'Fuel price (per L or per gallon)', value: 1.65, type: 'money', step: 0.01, min: 0 }, { name: 'round', label: 'Round trip (double the distance)', type: 'checkbox', value: false }, { name: 'people', label: 'People sharing', value: 1, step: 1, min: 1, max: 20 }],
    compute: function (v) { var e = need(v, ['distance', 'eff', 'price']); if (e) return e; var d = n(v.distance) * ((v.round === true || v.round === 'true' || v.round === 'on') ? 2 : 1), eff = n(v.eff), p = n(v.price), ppl = Math.max(1, Math.floor(n(v.people) || 1)); if (d < 0 || eff <= 0 || p < 0) return { error: 'Use positive numbers (fuel use must be above zero).' };
      var us = v.system === 'us', fuel = us ? d / eff : d * eff / 100, cost = fuel * p, ul = us ? 'gal' : 'L', ud = us ? 'mile' : 'km';
      return { big: { label: 'Fuel cost for the trip', text: money(cost, v.currency) }, kv: [['Fuel needed', fmt(fuel, 1) + ' ' + ul], ['Cost per ' + ud, money(d ? cost / d : 0, v.currency)], ['Per person (' + ppl + ')', money(cost / ppl, v.currency)], ['Distance counted', fmt(d, 1) + ' ' + (us ? 'mi' : 'km')]], raw: { cost: cost, fuel: fuel } }; } });

  /* 10 Discount & sales tax */
  add({ id: 'discount', title: 'Discount & Sales Tax Calculator', slug: 'discount-sales-tax-calculator', emoji: '🏷️', blurb: 'Sale price after a discount and tax - or take tax back out of a total.',
    fields: [{ name: 'mode', label: 'What do you want?', type: 'select', value: 'sale', options: [['sale', 'Price after discount + tax'], ['untax', 'Remove tax from a total']] }, { name: 'price', label: 'Price', value: 120, type: 'money', step: 0.01, min: 0 }, { name: 'discount', label: 'Discount (%)', value: 25, step: 0.5, min: 0, max: 100 }, { name: 'tax', label: 'Sales tax (%)', value: 13, step: 0.01, min: 0, max: 40 }],
    compute: function (v) { var e = need(v, ['price', 'tax']); if (e) return e; var p = n(v.price), t = n(v.tax), d = isFinite(n(v.discount)) ? n(v.discount) : 0; if (p < 0 || t < 0 || d < 0 || d > 100) return { error: 'Use zero or more; the discount must be 0-100%.' };
      if (v.mode === 'untax') { var pre = p / (1 + t / 100); return { big: { label: 'Price before tax', text: money(pre, v.currency) }, kv: [['Tax inside the total', money(p - pre, v.currency)], ['Total you entered', money(p, v.currency)]], raw: { pre: pre } }; }
      var off = p * d / 100, after = p - off, tax = after * t / 100, total = after + tax; return { big: { label: 'You pay', text: money(total, v.currency) }, kv: [['You save', money(off, v.currency)], ['Price after discount', money(after, v.currency)], ['Sales tax', money(tax, v.currency)], ['Effective discount on final price', fmt(p ? (1 - total / (p * (1 + t / 100))) * 100 : 0, 1) + '%']], raw: { total: total, off: off } }; } });

  C.CUR = CUR; C.convert = convert; C.payment = payment; C.monthlyRate = monthlyRate;
  return C;
});
