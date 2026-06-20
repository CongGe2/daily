const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Set high-resolution viewport (Retina 2x)
  await page.setViewport({
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
  });

  const url = 'https://rhxl7wxuq3ece.kimi.page';

  console.log('Loading Terrin website...');
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait a bit for any animations to settle
  await new Promise(r => setTimeout(r, 2000));

  // 1. Full page screenshot
  console.log('Taking full-page screenshot...');
  await page.screenshot({
    path: path.join(__dirname, 'images', 'terrin-fullpage.png'),
    fullPage: true,
  });
  console.log('  -> images/terrin-fullpage.png');

  // 2. Hero section (viewport only, top of page)
  console.log('Taking Hero screenshot...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(__dirname, 'images', 'terrin-hero.png'),
  });
  console.log('  -> images/terrin-hero.png');

  // 3. Scroll to middle for product/content section
  console.log('Taking product section screenshot...');
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.8));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(__dirname, 'images', 'terrin-products.png'),
  });
  console.log('  -> images/terrin-products.png');

  await browser.close();
  console.log('Done! All screenshots saved to images/');
})();
