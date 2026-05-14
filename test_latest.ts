import { GoogleFinanceScraper } from './src/scraper.js';

async function test(ticker) {
    const scraper = new GoogleFinanceScraper(ticker);
    try {
        const data = await scraper.scrape();
        console.log("Scraped", ticker, ":", data.price);
    } catch(e) {
        console.log("Failed", ticker, e.message);
    }
}

async function main() {
    await test('AAPL');
    await test('XAUUSD');
    await test('DXY');
}

main();
