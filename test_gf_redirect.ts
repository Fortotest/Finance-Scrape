import https from 'https';

export async function fetchGoogleFinance(ticker: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.google.com',
      path: `/finance/quote/${ticker}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    };

    https.get(options, (res) => {
      if (res.statusCode === 302 && res.headers.location) {
        const path = new URL(res.headers.location, 'https://www.google.com').pathname;
        options.path = path;
        https.get(options, (res2) => {
          let html = '';
          res2.on('data', (d) => html += d);
          res2.on('end', () => resolve(html));
          res2.on('error', reject);
        }).on('error', reject);
      } else {
        let html = '';
        res.on('data', (d) => html += d);
        res.on('end', () => resolve(html));
        res.on('error', reject);
      }
    }).on('error', reject);
  });
}

async function run() {
  const html = await fetchGoogleFinance('DXY');
  // Price
  let priceMatch = html.match(/class="YMlKec fxKbKc">\$?([^<]+)<\/div>/);
  if (!priceMatch) {
      priceMatch = html.match(/class="N6SYTe"[^>]*>.*?<span>\$?([0-9,]+\.[0-9]{2})<\/span>/i);
  }
  console.log("Price:", priceMatch ? priceMatch[1] : 'not found');
}
run();
