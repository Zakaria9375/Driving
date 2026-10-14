import { readFile, writeFile, mkdir } from 'node:fs/promises';
const source = 'https://likumi.lv/ta/id/274865-celu-satiksmes-noteikumi';
const html = await readFile('regulations.html', 'utf8');
const text = value => value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/\s+/g, ' ').trim();
const signs = [];
for (const row of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
  const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)];
  if (cells.length !== 3) continue;
  const id = text(cells[0][1]);
  if (!/^[1-8]\d{2}(?:\.\d+)?$/.test(id)) continue;
  const images = [...cells[1][1].matchAll(/<img\b[^>]*src=["']([^"']+)["']/gi)].map(m => new URL(m[1], source).href);
  if (!images.length) continue;
  const nameLv = text(cells[2][1]);
  signs.push({ id, nameLv, images, category: Number(id[0]) });
}
if (signs.length < 300 || new Set(signs.map(s => s.id)).size !== signs.length) throw new Error('Catalogue completeness or duplicate check failed');
await mkdir('src', { recursive: true });
await mkdir('public/signs', { recursive: true });
await writeFile('src/signs.raw.json', JSON.stringify(signs, null, 2));
console.log(`${signs.length} signs extracted`);
console.log(signs.map(s => `${s.id} ${s.nameLv}`).join('\n'));
