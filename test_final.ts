import { GoogleFinanceScraper } from './src/scraper.js';

async function test() {
  const scraper = new GoogleFinanceScraper('DXY');
  const data = await scraper.scrape();
  console.log(data);
}
test();
