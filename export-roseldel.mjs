import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('file:///' + path.join(__dirname, 'resume-roseldel.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 15000 });
await page.pdf({ path: 'C:/Users/14169/Desktop/金承旭_简历_座椅产品开发_罗斯德尔.pdf', format: 'A4', margin: { top: '13mm', bottom: '13mm', left: '11mm', right: '11mm' }, printBackground: true });
console.log('PDF saved to desktop');
await browser.close();
