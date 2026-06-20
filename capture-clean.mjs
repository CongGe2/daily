import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PDF_PATH = path.join(__dirname, 'references', '时尚設計2_金承旭_1230014532_D2.pdf');
const PDF_BASE64 = fs.readFileSync(PDF_PATH).toString('base64');
const OUT = path.join(__dirname, 'images', 'case-study');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// Only content pages (skip title-only pages 3,6,9,16,18,21,24,29,34, and empties)
const PAGES = [2,4,5,10,11,17,19,22,25,26,30,31,32,33,35,36];

// Write an HTML file that loads the PDF and can render any page
const viewerHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"><\/script>
<style>*{margin:0;padding:0}body{background:#fff}canvas{display:block}</style>
</head><body><script>
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const pdfData = Uint8Array.from(atob('${PDF_BASE64}'), c => c.charCodeAt(0));
window.loadPdf = async () => {
  const task = pdfjsLib.getDocument({data: pdfData});
  window.doc = await task.promise;
  return window.doc.numPages;
};
window.renderPage = async (pageNum, scale) => {
  const pg = await window.doc.getPage(pageNum);
  const vp = pg.getViewport({scale: scale || 2});
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(vp.width);
  canvas.height = Math.floor(vp.height);
  document.body.innerHTML = '';
  document.body.appendChild(canvas);
  await pg.render({canvasContext: canvas.getContext('2d'), viewport: vp}).promise;
  return {width: canvas.width, height: canvas.height};
};
<\/script></body></html>`;

const viewerPath = path.join(__dirname, 'pdf-clean-viewer.html');
fs.writeFileSync(viewerPath, viewerHtml);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();

// Load the viewer page
await page.goto('file:///' + viewerPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 60000 });

// Load PDF
const totalPages = await page.evaluate(() => window.loadPdf());
console.log(`PDF loaded: ${totalPages} pages`);

for (const pageNum of PAGES) {
  if (pageNum > totalPages) { console.log(`Page ${pageNum}: out of range`); continue; }

  const dims = await page.evaluate((pn) => window.renderPage(pn, 2), pageNum);

  // Set viewport to exact canvas size (no extra space)
  await page.setViewport({ width: dims.width, height: dims.height, deviceScaleFactor: 1 });

  const outFile = path.join(OUT, `page-${String(pageNum).padStart(2,'0')}.jpg`);
  await page.screenshot({ path: outFile });
  const size = fs.statSync(outFile).size;
  console.log(`Page ${pageNum}: ${dims.width}x${dims.height}px | ${(size/1024).toFixed(0)} KB`);
}

await browser.close();
fs.unlinkSync(viewerPath);
console.log('Done - all clean exports!');
