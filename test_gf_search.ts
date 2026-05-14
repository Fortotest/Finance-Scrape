import https from 'https';

export async function fetchGoogleFinance(ticker: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.google.com',
      path: `/search?q=${ticker}+stock&tbm=fin`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    };

    https.get(options, (res) => {
      let html = '';
      res.on('data', (d) => html += d);
      res.on('end', () => resolve(html));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  const html = await fetchGoogleFinance('DXY');
  // Price
  const titleMatch = /<title>(.*?)<\/title>/gi.exec(html);
  console.log("Title: ", titleMatch ? titleMatch[1] : "not found");
  
  // Since it's a generic google search for finance:
  let priceMatch = html.match(/class="IsqQVc NprOob w8qArf">([^<]+)<\/span>/);
  if(!priceMatch) priceMatch = html.match(/class="Faw5B"[^>]*>([^<]+)</);
  console.log("Price (search result):", priceMatch ? priceMatch[1] : 'not found');
}
run();
