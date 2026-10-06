const test = require('node:test'), assert = require('node:assert'), T = require('../src/dev-pocket/assets/tools.js');
test('json format/minify/errors', () => {
  assert.strictEqual(T.jsonFormat('{"b":1,"a":2}', 2, true).out, '{\n  "a": 2,\n  "b": 1\n}'); assert.strictEqual(T.jsonMinify('{ "a": [1, 2] }').out, '{"a":[1,2]}');
  const e = T.jsonFormat('{\n "a":1,\n}'); assert.strictEqual(e.ok, false); assert.match(e.error, /line 3/); assert.strictEqual(T.jsonFormat('  ').ok, false);
});
test('base64 utf8 roundtrip, url-safe, invalid', () => {
  for (const s of ['', 'a', 'ab', 'abc', 'héllo ✓ 😀', 'The quick brown fox']) assert.strictEqual(T.b64dec(T.b64enc(s)).out, s);
  assert.strictEqual(T.b64enc('hi?>>', true), 'aGk_Pj4'); assert.strictEqual(T.b64dec('aGk_Pj4').out, 'hi?>>'); assert.strictEqual(T.b64enc('hello'), Buffer.from('hello').toString('base64')); assert.strictEqual(T.b64dec('@@@').ok, false);
});
test('url encode/decode/query', () => {
  assert.strictEqual(T.urlEnc('a b&c/d').out, 'a%20b%26c%2Fd'); assert.strictEqual(T.urlEnc('http://x.io/a b', true).out, 'http://x.io/a%20b'); assert.strictEqual(T.urlDec('a%20b').out, 'a b'); assert.strictEqual(T.urlDec('100%').ok, false); assert.strictEqual(T.urlDec('a+b', true).out, 'a b');
  assert.deepStrictEqual(T.parseQuery('https://x.io/?q=dev%20tools&flag&n=1#top'), [['q', 'dev tools'], ['flag', ''], ['n', '1']]);
});
test('uuid v4 shape and uniqueness; validator', () => {
  const s = new Set(); for (let i = 0; i < 500; i++) { const u = T.uuid(); assert.ok(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(u)); s.add(u); } assert.strictEqual(s.size, 500);
  assert.ok(T.isUuid('123e4567-e89b-42d3-a456-426614174000')); assert.ok(!T.isUuid('nope'));
});
test('hashes match known vectors', async () => {
  assert.strictEqual(await T.hash('SHA-256', 'abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'); assert.strictEqual(await T.hash('SHA-1', 'abc'), 'a9993e364706816aba3e25717850c26c9cd0d89d');
  assert.strictEqual((await T.hash('SHA-512', '')).slice(0, 16), 'cf83e1357eefb8bd');
});
test('timestamps: seconds, ms, ISO, junk', () => {
  const now = Date.parse('2023-11-14T22:15:00Z'); const a = T.tsConvert('1700000000', now); assert.strictEqual(a.iso, '2023-11-14T22:13:20.000Z'); assert.strictEqual(a.unit, 'seconds'); assert.match(a.rel, /minutes ago|2 minutes/);
  assert.strictEqual(T.tsConvert('1700000000000', now).iso, a.iso); assert.strictEqual(T.tsConvert('2023-11-14T22:13:20Z', now).seconds, 1700000000); assert.strictEqual(T.tsConvert('banana').ok, false); assert.strictEqual(T.tsConvert('').ok, false);
});
test('regex tester', () => {
  const r = T.regexTest('(\\w+)@(\\w+)\\.com', 'i', 'a@b.com x C@D.COM'); assert.strictEqual(r.matches.length, 2); assert.deepStrictEqual(r.matches[0].groups, ['a', 'b']);
  assert.strictEqual(T.regexTest('(', '', 'x').ok, false); assert.strictEqual(T.regexTest('a*', '', 'bbb').matches.length, 4); // empty matches advance
  assert.strictEqual(T.regexTest('(?<y>\\d{4})', '', '2024').matches[0].named.y, '2024');
});
test('colors and contrast', () => {
  const c = T.colorInfo('#1e90ff'); assert.strictEqual(c.rgbStr, 'rgb(30, 144, 255)'); assert.strictEqual(c.hslStr, 'hsl(210, 100%, 56%)'); assert.strictEqual(T.colorInfo('#fff').hex, '#ffffff'); assert.strictEqual(T.colorInfo('hsl(0,100%,50%)').hex, '#ff0000'); assert.strictEqual(T.colorInfo('rgb(300,0,0)').ok, false); assert.strictEqual(T.colorInfo('blue?').ok, false);
  assert.ok(Math.abs(T.contrast({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }) - 21) < 1e-9);
});
test('text stats and case conversion', () => {
  const s = T.textStats('Hello world. How are you?\n\nFine.'); assert.strictEqual(s.words, 6); assert.strictEqual(s.sentences, 3); assert.strictEqual(s.paragraphs, 2);
  assert.strictEqual(T.caseConvert('hello_world-fooBar baz', 'camel'), 'helloWorldFooBarBaz'); assert.strictEqual(T.caseConvert('Hello World', 'snake'), 'hello_world'); assert.strictEqual(T.caseConvert('Hello World', 'kebab'), 'hello-world'); assert.strictEqual(T.caseConvert('hello world', 'constant'), 'HELLO_WORLD'); assert.strictEqual(T.caseConvert('hELLO. wORLD', 'sentence'), 'Hello. World'); assert.strictEqual(T.caseConvert('the cat-in', 'title'), 'The Cat-In');
});
test('password generator honours sets, length, and entropy', () => {
  for (let i = 0; i < 200; i++) { const p = T.password(12, { lower: true, upper: true, digits: true, symbols: true }); assert.strictEqual(p.out.length, 12); assert.ok(/[a-z]/.test(p.out) && /[A-Z]/.test(p.out) && /[0-9]/.test(p.out) && /[^A-Za-z0-9]/.test(p.out)); assert.ok(!/[lIO01]/.test(p.out)); }
  assert.strictEqual(T.password(10, {}).ok, false); assert.ok(T.password(100, { lower: true }).out.length === 100); assert.ok(T.password(500, { lower: true }).out.length === 128);
  const d = new Set(); for (let i = 0; i < 100; i++) d.add(T.password(16, { lower: true, digits: true }).out); assert.strictEqual(d.size, 100);
});
test('randInt is unbiased enough and in range', () => { const c = [0, 0, 0]; for (let i = 0; i < 30000; i++) { const v = T.randInt(3); assert.ok(v >= 0 && v < 3); c[v]++; } assert.ok(c.every((x) => x > 9000 && x < 11000)); });
test('number bases incl. big and prefixes', () => {
  assert.deepStrictEqual(T.baseConvert('ff', 16), { ok: true, dec: '255', hex: 'ff', bin: '11111111', oct: '377' }); assert.strictEqual(T.baseConvert('0b1010', 2).dec, '10'); assert.strictEqual(T.baseConvert('-10', 10).hex, '-a'); assert.strictEqual(T.baseConvert('123456789012345678901234567890', 10).hex, '18ee90ff6c373e0ee4e3f0ad2'); assert.strictEqual(T.baseConvert('12', 2).ok, false);
});
test('lorem has requested paragraphs', () => { assert.strictEqual(T.lorem(4, false).split('\n\n').length, 4); assert.ok(T.lorem(1, true).startsWith('Lorem ipsum dolor sit amet, consectetur')); });
