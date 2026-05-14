import puppeteer from 'puppeteer';

async function testTVNews() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36');
    await page.goto('https://www.tradingview.com/symbols/AAPL/', { waitUntil: 'domcontentloaded' });
    
    // Find all links containing text that looks like news
    const links = await page.$$eval('a', anchors => {
        return anchors.map(a => ({href: a.href, text: a.textContent?.trim()})).filter(a => a.href && a.href.includes('/news/'));
    });
    console.log("TV News Links: ", links.slice(0, 5));
  } finally {
    await browser.close();
  }
}
testTVNews();
