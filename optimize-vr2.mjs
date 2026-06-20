import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT = path.join(__dirname, 'images', 'vr-device-v2.png');
const OUT_DIR = path.join(__dirname, 'images', 'optimized');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// 4:3 portfolio card
await sharp(INPUT).resize(1200, 900, { fit: 'cover', position: 'top' }).jpeg({ quality: 85 }).toFile(path.join(OUT_DIR, 'vr-device-v2-thumb.jpg'));
console.log('vr-device-v2-thumb.jpg:', (fs.statSync(path.join(OUT_DIR, 'vr-device-v2-thumb.jpg')).size / 1024).toFixed(0), 'KB');

// Wide hero for case study page
await sharp(INPUT).resize(1600, 600, { fit: 'cover', position: 'top' }).jpeg({ quality: 85 }).toFile(path.join(OUT_DIR, 'vr-device-v2-hero.jpg'));
console.log('vr-device-v2-hero.jpg:', (fs.statSync(path.join(OUT_DIR, 'vr-device-v2-hero.jpg')).size / 1024).toFixed(0), 'KB');

console.log('Done');
