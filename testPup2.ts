import puppeteer from 'puppeteer';

async function testPuppeteer() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.google.com/finance/quote/AAPL:NASDAQ', { waitUntil: 'load' });
    
    // Dump an element that contains $ and the price.
    // Price usually starts with $
    const html = await page.content();
    console.log("HTML length:", html.length);
    
    // Try to find the price directly by evaluating elements
    const elements = await page.$$eval('div', divs => {
        return divs.filter(d => d.textContent && d.textContent.includes('298.')).slice(0, 5).map(d => ({
            text: d.textContent,
            className: d.className
        }));
    });
    console.log("Elements containing price:", elements);
    
    await browser.close();
  } catch (e) {
    console.error(e);
  }
}
testPuppeteer();
