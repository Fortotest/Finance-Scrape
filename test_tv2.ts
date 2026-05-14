async function test() {
  const ticker = 'DXY';
  const url = `https://www.tradingview.com/symbols/${ticker}/`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  
  const lastQuotes = html.match(/"last":([^,}]+)/g);
  const priceMatches = html.match(/class="[^"]*last[^"]*"[^>]*>([^<]+)</g);
  
  console.log('last:', lastQuotes);
  console.log('priceMatches:', priceMatches);
}
test();
