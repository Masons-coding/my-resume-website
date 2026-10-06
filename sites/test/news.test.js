const test = require('node:test'), assert = require('node:assert'), { parseFeed, decode, clean } = require('../tools/fetch-news.js');
test('parses RSS 2.0 with CDATA, entities and tracking params', () => {
  const xml = `<rss><channel><item><title><![CDATA[AI &amp; the <b>law</b>]]></title><link>https://ex.com/a?utm_source=x&amp;id=5#frag</link><pubDate>Mon, 02 Mar 2026 10:00:00 GMT</pubDate></item><item><title>No link</title></item></channel></rss>`;
  const r = parseFeed(xml); assert.strictEqual(r.length, 1); assert.strictEqual(r[0].title, 'AI & the law'); assert.strictEqual(r[0].url, 'https://ex.com/a?id=5'); assert.strictEqual(r[0].published, '2026-03-02T10:00:00.000Z');
});
test('parses Atom entries using href', () => {
  const xml = `<feed><entry><title>Hello</title><link rel="alternate" href="https://ex.com/p/1"/><updated>2026-01-05T08:00:00Z</updated></entry></feed>`;
  const r = parseFeed(xml); assert.strictEqual(r[0].url, 'https://ex.com/p/1'); assert.strictEqual(r[0].published, '2026-01-05T08:00:00.000Z');
});
test('rejects non-http links and honours max', () => {
  assert.strictEqual(clean('javascript:alert(1)'), ''); const xml = '<rss>' + Array.from({ length: 30 }, (_, i) => `<item><title>t${i}</title><link>https://ex.com/${i}</link></item>`).join('') + '</rss>'; assert.strictEqual(parseFeed(xml, 10).length, 10);
  assert.strictEqual(decode('&#x41;&#66;&hellip;'), 'AB...');
});
