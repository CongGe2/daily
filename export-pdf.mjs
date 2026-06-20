import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const htmlPath = path.join(__dirname, 'interview-prep.html');
const outPath = 'C:/Users/14169/Desktop/产品设计实习面试通关手册_金承旭.pdf';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();

await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 30000 });

await page.pdf({
  path: outPath,
  format: 'A4',
  margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
  printBackground: true,
  displayHeaderFooter: false,
  preferCSSPageSize: true,
});

console.log(`PDF saved to desktop: ${outPath}`);

// Check file size
import fs from 'fs';
const stat = fs.statSync(outPath);
console.log(`Size: ${(stat.size / 1024 / 1024).toFixed(1)} MB`);

await browser.close();
