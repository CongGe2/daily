import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WEBSITE_URL = 'jin-chengxu-portfolio.pages.dev';
const htmlPath = path.join(__dirname, 'index.html');
const outPath = 'C:/Users/14169/Desktop/金承旭-作品集-2026-v2.pdf';

console.log('🚀 启动浏览器...');
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();

// 1980×1080 宽屏视图
await page.setViewport({ width: 1980, height: 1080 });

console.log('📄 加载页面...');
await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
  waitUntil: 'networkidle0',
  timeout: 60000,
});

// Wait for fonts and lazy images
console.log('⏳ 等待资源加载...');
await new Promise(r => setTimeout(r, 4000));

// Scroll through entire page to trigger lazy loading
console.log('📜 滚动加载全部图片...');
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let totalHeight = 0;
    const distance = 500;
    const timer = setInterval(() => {
      const scrollHeight = document.body.scrollHeight;
      window.scrollBy(0, distance);
      totalHeight += distance;
      if (totalHeight >= scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, 120);
  });
});

await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 1000));

// Expand collapsed sections
console.log('🔍 展开全部内容...');
await page.evaluate(() => {
  document.querySelectorAll('details').forEach(el => el.setAttribute('open', ''));
});

// Inject print-friendly CSS + reveal elements
console.log('🎨 注入打印样式...');
await page.addStyleTag({
  content: `
    @media print {
      @page {
        size: 1980px 1080px;
        margin: 40px 60px 60px 60px;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .project-card, .exp-card, .skill-card, section {
        page-break-inside: avoid;
      }
      h2, h3, h4 {
        page-break-after: avoid;
      }
    }

    /* Show all reveal animations instantly */
    .reveal {
      opacity: 1 !important;
      transform: none !important;
    }

    /* --- URL watermark on every page --- */
    body::after {
      content: "${WEBSITE_URL}";
      position: fixed;
      bottom: 12px;
      right: 20px;
      font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      font-size: 11px;
      color: rgba(176, 146, 110, 0.5);
      letter-spacing: 0.5px;
      z-index: 9999;
      pointer-events: none;
    }

    /* --- Top-left URL header line --- */
    body::before {
      content: "${WEBSITE_URL}  |  金承旭 · 产品设计作品集";
      position: fixed;
      top: 12px;
      left: 20px;
      font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      font-size: 11px;
      color: rgba(0, 0, 0, 0.25);
      letter-spacing: 0.5px;
      z-index: 9999;
      pointer-events: none;
    }
  `,
});

// Also inject a visible URL strip at the very bottom of the document
console.log('🔗 注入网站链接脚注...');
await page.evaluate((url) => {
  const footer = document.createElement('div');
  footer.id = 'pdf-url-footer';
  footer.innerHTML = `
    <div style="
      margin-top: 60px;
      padding: 20px 0 8px 0;
      border-top: 1px solid rgba(176,146,110,0.3);
      text-align: center;
      font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      font-size: 14px;
      color: #b0926e;
      letter-spacing: 1px;
    ">
      🌐 ${url}  |  金承旭 · 产品设计作品集
    </div>
  `;
  document.body.appendChild(footer);
}, WEBSITE_URL);

console.log('📸 生成 PDF (1980×1080 宽屏)...');
await page.pdf({
  path: outPath,
  width: '1980px',
  height: '1080px',
  margin: { top: '50px', bottom: '50px', left: '60px', right: '60px' },
  printBackground: true,
  displayHeaderFooter: false,
  preferCSSPageSize: false,
});

// Check file size
const stat = fs.statSync(outPath);
console.log(`✅ PDF 已保存到桌面: ${outPath}`);
console.log(`📦 文件大小: ${(stat.size / 1024 / 1024).toFixed(1)} MB`);
console.log(`📄 格式: 1980×1080 宽屏 · 每页标注网站链接`);

await browser.close();
console.log('🎉 完成!');
