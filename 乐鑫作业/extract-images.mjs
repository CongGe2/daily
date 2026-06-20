import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const imgDir = path.join(__dirname, 'images');
const optDir = path.join(imgDir, 'optimized');
if (!fs.existsSync(optDir)) fs.mkdirSync(optDir, { recursive: true });

const tasks = [
  { json: 'mascot.json', name: 'mascot' },
  { json: 'package-spicy.json', name: 'package-spicy' },
  { json: 'poster.json', name: 'poster' },
  { json: 'package-garlic.json', name: 'package-garlic' },
  { json: 'pack-herb.json', name: 'package-herb' },
  { json: 'coldchain.json', name: 'coldchain' },
  { json: 'takeout-bag.json', name: 'takeout-bag' },
];

for (const t of tasks) {
  const jp = path.join(imgDir, t.json);
  if (!fs.existsSync(jp)) { console.log(`Skip ${t.json} - not found`); continue; }

  const raw = JSON.parse(fs.readFileSync(jp, 'utf8'));
  const content = raw.choices[0].message.content;
  const match = content.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
  if (!match) { console.log(`No image in ${t.json}`); continue; }

  // Save PNG
  const pngPath = path.join(imgDir, `${t.name}.png`);
  fs.writeFileSync(pngPath, Buffer.from(match[1], 'base64'));
  console.log(`${t.name}.png: ${(fs.statSync(pngPath).size/1024).toFixed(0)} KB`);

  // Optimize thumb
  await sharp(pngPath).resize(1200, 900, { fit: 'cover', position: 'top' }).jpeg({ quality: 85 }).toFile(path.join(optDir, `${t.name}-thumb.jpg`));
  // Hero wide
  await sharp(pngPath).resize(1600, 600, { fit: 'cover', position: 'top' }).jpeg({ quality: 85 }).toFile(path.join(optDir, `${t.name}-hero.jpg`));

  console.log(`  -> ${t.name}-thumb.jpg + hero.jpg`);
}

// Show sizes
const files = fs.readdirSync(optDir);
console.log('\n=== Optimized ===');
for (const f of files) console.log(`${(fs.statSync(path.join(optDir, f)).size/1024).toFixed(0)} KB  ${f}`);
