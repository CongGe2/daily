import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'images', 'vr-v2.json'), 'utf8'));
const content = data.choices[0].message.content;

// Extract all base64 images from markdown
const matches = content.matchAll(/data:image\/png;base64,([A-Za-z0-9+/=]+)/g);
let idx = 0;
for (const m of matches) {
  const filename = idx === 0 ? 'vr-device-v2.png' : `vr-device-v2-${idx}.png`;
  fs.writeFileSync(path.join(__dirname, 'images', filename), Buffer.from(m[1], 'base64'));
  console.log(`Saved: ${filename} (${(fs.statSync(path.join(__dirname, 'images', filename)).size / 1024).toFixed(0)} KB)`);
  idx++;
}
if (idx === 0) console.log('No images found. Content:', content.slice(0, 300));
