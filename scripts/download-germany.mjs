import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { germanyCards } from '../src/germany.js';
const base = 'https://www.gesetze-im-internet.de/stvo_2013/';
const imageMap = new Map();
for (const appendix of [2, 3]) {
  const html = await readFile(`sources/germany-anlage_${appendix}.html`, 'utf8');
  for (const cell of html.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)) {
    const number = cell[1].match(/Zeichen\s+(\d+(?:\.\d+)?)(?=\s|<)/);
    const image = cell[1].match(/<img\b[^>]*src="([^"]+)"/i);
    if (number && image) imageMap.set(number[1], new URL(image[1], base).href);
  }
}
imageMap.set('721', new URL('../normengrafiken/bgbl1_2020/j0814-1_0010.jpg', base).href);
await mkdir('public/signs/germany', { recursive: true });
const jobs = germanyCards.filter(c => c.image);
let next = 0;
const manifest = [];
await Promise.all(Array.from({ length: 5 }, async () => {
  while (next < jobs.length) {
    const card = jobs[next++];
    const url = card.asset ? new URL(card.asset, base).href : imageMap.get(card.signNumber);
    if (!url) throw new Error(`No official image for ${card.id}`);
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Invalid image response: ${url}`);
    await writeFile(`public${card.image}`, new Uint8Array(await response.arrayBuffer()));
    manifest.push({ id: card.id, localPath: card.image, source: url });
  }
}));
await writeFile('sources/germany-images.json', JSON.stringify(manifest.sort((a, b) => a.id.localeCompare(b.id)), null, 2));
console.log(`Downloaded ${manifest.length} official German images for ${germanyCards.length} difference cards.`);
