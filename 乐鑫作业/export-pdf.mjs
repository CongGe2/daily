import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();

await page.goto('file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 30000 });

// A3 landscape — wide enough to show packaging rows side by side, tall enough for content flow
await page.pdf({
  path: 'C:/Users/14169/Desktop/潜江虾局_品牌包装设计_金乐鑫.pdf',
  format: 'A3',
  landscape: true,
  printBackground: true,
  displayHeaderFooter: false,
  margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
});

const fs = await import('fs');
const stat = fs.statSync('C:/Users/14169/Desktop/潜江虾局_品牌包装设计_金乐鑫.pdf');
console.log(`PDF: ${(stat.size/1024/1024).toFixed(1)} MB`);
await browser.close();
console.log('Done!');
