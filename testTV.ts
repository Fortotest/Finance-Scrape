import puppeteer from 'puppeteer';

async function testTV() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.tradingview.com/symbols/NASDAQ-AAPL/', { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  console.log("TV Title: ", title);
  
  // Scrape price: .tv-symbol-price-quote__value 
  const p = await page.$eval('.js-symbol-last', el => el.textContent).catch(() => null);
  console.log("TV Price (js-symbol-last): ", p);

  const price2 = await page.$eval('span[class*="lastPrice"]', el => el.textContent).catch(() => null);
  console.log("TV Price (lastPrice): ", price2);
  
  await browser.close();
}
testTV();
