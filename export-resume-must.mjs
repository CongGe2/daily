import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const htmlPath = path.join(__dirname, 'resume.html');
const outPath = 'C:/Users/14169/Desktop/金承旭_简历_澳门科技大学.pdf';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();

await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
  waitUntil: 'networkidle0',
  timeout: 30000,
});

await page.pdf({
  path: outPath,
  format: 'A4',
  margin: { top: '12mm', bottom: '12mm', left: '14mm', right: '14mm' },
  printBackground: true,
  displayHeaderFooter: false,
  preferCSSPageSize: true,
});

console.log(`PDF saved to: ${outPath}`);

import fs from 'fs';
const stat = fs.statSync(outPath);
console.log(`File size: ${(stat.size / 1024).toFixed(0)} KB`);

await browser.close();
console.log('Done!');
