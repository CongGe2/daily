import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dynamic import of pdfjs-dist
const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

const pdfPath = path.join(__dirname, 'references', '时尚設計2_金承旭_1230014532_D2.pdf');
const data = new Uint8Array(fs.readFileSync(pdfPath));

const doc = await pdfjsLib.getDocument({ data }).promise;

console.log(`Total pages: ${doc.numPages}\n`);

for (let i = 30; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const text = content.items.map(item => item.str).join(' ');

  if (text.trim()) {
    console.log(`\n========== Page ${i} ==========`);
    const lines = text.match(/.{1,200}/g) || [text];
    lines.forEach(l => console.log(l));
  }
}
