import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function mdToPdf(mdFile, pdfFile, title) {
  const md = fs.readFileSync(mdFile, 'utf8');
  // Very simple markdown to HTML conversion
  const bodyHtml = md
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 22mm 20mm; }
  body { font-family: "Noto Serif SC", "STSong", "SimSun", serif; font-size: 12px; line-height: 2.1; color: #1a1a18; max-width: 680px; margin: 0 auto; padding: 40px 0; }
  h1 { font-size: 24px; font-weight: 700; margin-bottom: 24px; text-align: center; }
  h2 { font-size: 17px; font-weight: 600; margin: 32px 0 12px; border-bottom: 1px solid #e4e1dc; padding-bottom: 6px; }
  h3 { font-size: 14px; font-weight: 600; margin: 24px 0 8px; }
  p { margin-bottom: 10px; color: #333; }
  strong { color: #000; }
  li { margin-bottom: 4px; color: #333; }
  hr { border: none; border-top: 1px solid #e4e1dc; margin: 30px 0; }
  .meta { text-align: center; color: #999; font-size: 11px; margin-bottom: 32px; }
</style></head><body>${bodyHtml}</body></html>`;

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.pdf({ path: pdfFile, format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' }, printBackground: true });
  console.log(`PDF: ${path.basename(pdfFile)} (${(fs.statSync(pdfFile).size/1024).toFixed(0)} KB)`);
  await browser.close();
}

const refs = path.join(__dirname, 'references');
const desktop = 'C:/Users/14169/Desktop/寰球星途笔试材料';

await mdToPdf(path.join(refs, 'starpath-article-1.md'), path.join(desktop, '科普文-商业遥感如何改变传统行业.pdf'), '科普文');
await mdToPdf(path.join(refs, 'starpath-article-2.md'), path.join(desktop, '行业分析-中国商业航天爆发点在哪里.pdf'), '行业分析');
console.log('Done!');
