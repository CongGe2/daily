import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PDF = path.join(__dirname, 'references', '时尚設計2_金承旭_1230014532_D2.pdf');
const OUT = path.join(__dirname, 'images', 'case-study');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

// Key pages to capture
const PAGES = [2,3,4,5,6,9,16,18,21,24,29,30,31,32,33,34,35,36,37];

for (const pageNum of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1132, deviceScaleFactor: 2 });

  // Chrome built-in PDF viewer with page parameter
  const pdfUrl = 'file:///' + PDF.replace(/\\/g, '/') + '#page=' + pageNum;
  await page.goto(pdfUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const outFile = path.join(OUT, `page-${String(pageNum).padStart(2,'0')}.jpg`);
  await page.screenshot({ path: outFile, fullPage: false });
  const size = fs.statSync(outFile).size;
  console.log(`Page ${pageNum}: ${(size/1024).toFixed(0)} KB`);
  await page.close();
}

await browser.close();
console.log('Done!');
