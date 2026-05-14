import puppeteer from 'puppeteer';

async function testGF() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto('https://www.google.com/finance/quote/AAPL', { waitUntil: 'domcontentloaded' });
    const url = page.url();
    console.log("GF Redirected URL: ", url);
    // News articles:
    const news = await page.$$eval('.yY3Lee', els => els.map(el => {
        const headline = el.querySelector('.Yfwt5')?.textContent;
        return headline;
    }).filter(Boolean));
    console.log("GF News: ", news.slice(0, 2));
  } finally {
    await browser.close();
  }
}
testGF();
