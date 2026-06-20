import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
const pdfPath = path.join(__dirname, 'references', '时尚設計2_金承旭_1230014532_D2.pdf');
const data = new Uint8Array(fs.readFileSync(pdfPath));
const doc = await pdfjsLib.getDocument({ data }).promise;

// Scan all 37 pages - show page number + first 150 chars of text
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const text = content.items.map(item => item.str).join(' ').trim();
  const preview = text.slice(0, 120) || '(empty)';
  console.log(`P${String(i).padStart(2,'0')}: ${preview}`);
}
