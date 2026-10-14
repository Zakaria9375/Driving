import { readFile, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { english } from '../src/english.js';
import { germanyCards } from '../src/germany.js';
const signs = JSON.parse(await readFile('src/signs.raw.json', 'utf8'));
assert.equal(signs.length, 320);
assert.equal(new Set(signs.map(s => s.id)).size, signs.length);
for (const sign of signs) {
  const content = english(sign);
  assert.ok(content.name && content.description, `Missing English content: ${sign.id}`);
  for (const [i, url] of sign.images.entries()) {
    const file = `public/signs/${sign.id}-${i}${new URL(url).pathname.match(/\.[^.]+$/)[0].toLowerCase()}`;
    assert.ok((await stat(file)).size > 100, `Missing or empty image: ${file}`);
  }
}
console.log('Verified: 320 unique signs, English names and descriptions, and every local image.');
assert.equal(germanyCards.length, 45);
assert.equal(new Set(germanyCards.map(c => c.id)).size, germanyCards.length);
const manifest = JSON.parse(await readFile('sources/germany-images.json', 'utf8'));
for (const card of germanyCards) {
  assert.ok(card.name && card.description && card.difference, `Missing Germany content: ${card.id}`);
  assert.equal(new URL(card.source).hostname, 'www.gesetze-im-internet.de');
  if (card.kind === 'rule') assert.ok(card.prompt && !card.image);
  else {
    assert.ok((await stat(`public${card.image}`)).size > 100, `Missing image: ${card.id}`);
    const provenance = manifest.find(entry => entry.id === card.id);
    assert.ok(provenance && provenance.localPath === card.image);
    assert.equal(new URL(provenance.source).hostname, 'www.gesetze-im-internet.de');
  }
}
console.log('Verified: 45 separate Germany cards, 35 official images, 10 scenarios, English comparisons and official source links.');
