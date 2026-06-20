import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

const tasks = [
  { html: 'resume-design.html', pdf: '金承旭_简历_产品设计.pdf', desc: '产品设计版' },
  { html: 'resume-content.html', pdf: '金承旭_简历_内容编辑.pdf', desc: '内容编辑版' },
];

for (const t of tasks) {
  const page = await browser.newPage();
  await page.goto('file:///' + path.join(__dirname, t.html).replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 15000 });
  const outPath = 'C:/Users/14169/Desktop/' + t.pdf;
  await page.pdf({ path: outPath, format: 'A4', margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' }, printBackground: true });
  console.log(`${t.desc}: ${t.pdf}`);
  await page.close();
}

// Also copy content editor version to the Starpath folder
const page = await browser.newPage();
await page.goto('file:///' + path.join(__dirname, 'resume-content.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 15000 });
await page.pdf({ path: 'C:/Users/14169/Desktop/寰球星途笔试材料/金承旭_简历_内容编辑.pdf', format: 'A4', margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' }, printBackground: true });
console.log('Content editor version also copied to 寰球星途 folder');

await browser.close();
console.log('Done!');
