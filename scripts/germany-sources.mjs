import { mkdir, writeFile } from 'node:fs/promises';
const base = 'https://www.gesetze-im-internet.de/stvo_2013/';
await mkdir('sources', { recursive: true });
await Promise.all(['anlage_2', 'anlage_3', '__37', '__3', '__5', '__11', '__12', '__13', '__17', '__18', '__20', '__39', '__2', '__10', '__15'].map(async name => {
  const response = await fetch(`${base}${name}.html`, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  await writeFile(`sources/germany-${name}.html`, html);
  if (['anlage_2', '__37'].includes(name)) {
    for (const cell of html.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)) {
      const image = cell[1].match(/<img\b[^>]*src="([^"]+)"/i);
      if (image) console.log(image[1], cell[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 200));
    }
    if (name === '__37') console.log([...html.matchAll(/<img\b[^>]*src="([^"]+)"/gi)].map(m => new URL(m[1], base).href));
  }
}));
