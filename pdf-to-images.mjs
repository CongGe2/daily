import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PDF = path.join(__dirname, 'references', '时尚設計2_金承旭_1230014532_D2.pdf');
const OUT = path.join(__dirname, 'images', 'case-study');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// Key pages to extract based on PDF content analysis
const keyPages = [3,4,5,6,9,16,18,21,24,29,30,31,32,33,34,35,36,37];

for (const pageNum of keyPages) {
  try {
    await sharp(PDF, { page: pageNum - 1, density: 200 })
      .jpeg({ quality: 80 })
      .toFile(path.join(OUT, `page-${String(pageNum).padStart(2,'0')}.jpg`));
    const size = fs.statSync(path.join(OUT, `page-${String(pageNum).padStart(2,'0')}.jpg`)).size;
    console.log(`Page ${pageNum}: ${(size/1024).toFixed(0)} KB`);
  } catch (e) {
    console.log(`Page ${pageNum}: FAILED - ${e.message.split('\n')[0]}`);
  }
}
console.log('Done');
