import puppeteer from 'puppeteer';

async function testPuppeteer() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.google.com/finance/quote/AAPL:NASDAQ', { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    console.log("Title: ", title);
    
    // Check price
    await page.waitForSelector('.fxKbKc', { timeout: 5000 }).catch(e => console.log('Timeout waiting for .fxKbKc'));
    const price = await page.$eval('.fxKbKc', el => el.textContent).catch(e => null);
    console.log("Price: ", price);
    
    await browser.close();
  } catch (e) {
    console.error(e);
  }
}
testPuppeteer();
