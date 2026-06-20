// Quick image optimization - resize large PNGs to manageable sizes
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, statSync } from 'fs';

const src = 'C:/Users/14169/portfolio/images/rift/';
const dst = 'C:/Users/14169/portfolio/images/rift/optimized/';

if (!existsSync(dst)) mkdirSync(dst, { recursive: true });

const files = readdirSync(src).filter(f => f.endsWith('.png'));
console.log(`Optimizing ${files.length} images...\n`);

for (const f of files) {
  const input = src + f;
  const output = dst + f.replace('.png', '.jpg');
  const sizeIn = (statSync(input).size / 1024).toFixed(0);

  await sharp(input)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(output);

  const sizeOut = (statSync(output).size / 1024).toFixed(0);
  console.log(`  ${f}: ${sizeIn} KB → ${sizeOut} KB`);
}

// Also create thumbnails for main portfolio card
await sharp(src + 'rift-hero-shot.png')
  .resize({ width: 800, height: 600, fit: 'cover' })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile('C:/Users/14169/portfolio/images/optimized/rift-speaker-thumb.jpg');

console.log(`\n✅ Done. Thumbnail created.`);
