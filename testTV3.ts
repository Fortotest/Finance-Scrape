import puppeteer from 'puppeteer';

async function testTV() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36');
    await page.goto('https://www.tradingview.com/symbols/XAUUSD/', { waitUntil: 'domcontentloaded' });
    
    const price = await page.$eval('.js-symbol-last', el => el.textContent).catch(() => null);
    const changePer = await page.$eval('.js-symbol-change-pt', el => el.textContent).catch(() => null);
    
    console.log("XAUUSD: ", { price, changePer });
  } finally {
    await browser.close();
  }
}
testTV();
