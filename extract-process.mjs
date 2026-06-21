import fs from 'fs'; import path from 'path'; import sharp from 'sharp'; import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, 'images'); const optDir = path.join(imgDir, 'optimized');

for (const name of ['rift-process', 'vr-process']) {
  const raw = JSON.parse(fs.readFileSync(path.join(imgDir, `${name}.json`), 'utf8'));
  const m = raw.choices[0].message.content.match(/data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)/);
  if (!m) { console.log(`No image in ${name}`); continue; }
  const ext = m[1] === 'jpeg' ? 'jpg' : 'png';
  fs.writeFileSync(path.join(imgDir, `${name}.${ext}`), Buffer.from(m[2], 'base64'));
  await sharp(path.join(imgDir, `${name}.${ext}`)).resize(1200, 900, { fit: 'cover', position: 'top' }).jpeg({ quality: 85 }).toFile(path.join(optDir, `${name}-thumb.jpg`));
  console.log(`${name}-thumb.jpg: ${(fs.statSync(path.join(optDir,`${name}-thumb.jpg`)).size/1024).toFixed(0)} KB`);
}
console.log('Done');
