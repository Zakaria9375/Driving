import { readFile, writeFile, mkdir } from 'node:fs/promises';
const signs = JSON.parse(await readFile('src/signs.raw.json', 'utf8'));
await mkdir('public/signs', { recursive: true });
const jobs = signs.flatMap(s => s.images.map((url, i) => ({ url, file: `public/signs/${s.id}-${i}${new URL(url).pathname.match(/\.[^.]+$/)[0].toLowerCase()}` })));
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (next < jobs.length) {
    const job = jobs[next++];
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(job.url, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`${response.status} ${job.url}`);
        if (!response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Not an image: ${job.url}`);
        await writeFile(job.file, new Uint8Array(await response.arrayBuffer()));
        break;
      } catch (error) {
        if (attempt === 2) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
}));
console.log(`Downloaded ${jobs.length} official images for ${signs.length} signs.`);
