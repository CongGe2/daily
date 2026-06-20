import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tasks = [
  { json: 'vr-keyshot.json', out: 'vr-keyshot.png' },
  { json: 'vr-clay.json', out: 'vr-clay.png' },
  { json: 'vr-detail.json', out: 'vr-detail.png' },
];

const imgDir = path.join(__dirname, 'images');
const optDir = path.join(imgDir, 'optimized');
if (!fs.existsSync(optDir)) fs.mkdirSync(optDir, { recursive: true });

for (const t of tasks) {
  const raw = JSON.parse(fs.readFileSync(path.join(imgDir, t.json), 'utf8'));
  const content = raw.choices[0].message.content;
  const match = content.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
  if (!match) { console.log(`No image in ${t.json}`); continue; }

  const pngPath = path.join(imgDir, t.out);
  fs.writeFileSync(pngPath, Buffer.from(match[1], 'base64'));
  console.log(`Extracted: ${t.out} (${(fs.statSync(pngPath).size/1024).toFixed(0)} KB)`);

  // Optimize versions
  const base = path.parse(t.out).name;

  // 4:3 portfolio thumb
  await sharp(pngPath)
    .resize(1200, 900, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 85 })
    .toFile(path.join(optDir, `${base}-thumb.jpg`));
  console.log(`  -> ${base}-thumb.jpg`);

  // Wide hero version
  await sharp(pngPath)
    .resize(1600, 600, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 85 })
    .toFile(path.join(optDir, `${base}-hero.jpg`));
  console.log(`  -> ${base}-hero.jpg`);
}

// Show all optimized file sizes
const files = fs.readdirSync(optDir).filter(f => f.startsWith('vr-'));
console.log('\n=== Optimized files ===');
for (const f of files) {
  const s = fs.statSync(path.join(optDir, f)).size;
  console.log(`${(s/1024).toFixed(0)} KB  ${f}`);
}
