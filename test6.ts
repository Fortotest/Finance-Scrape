import https from 'https';

async function fetchHTML(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
        }).on('error', reject);
    });
}

async function test() {
    const html = await fetchHTML('https://www.google.com/finance/quote/AAPL:NASDAQ');
    // Find the current price
    // Google Finance often puts price in data-last-price="123.45" or similar
    const dataLastPriceMatch = html.match(/data-last-price="([^"]+)"/);
    console.log("data-last-price: ", dataLastPriceMatch ? dataLastPriceMatch[1] : 'not found');
    
    // Check for other common identifiers
    const pzW1pcMatch = html.match(/class="pzW1pc"[^>]*>([^<]+)<\/div>/);
    console.log("pzW1pc: ", pzW1pcMatch ? pzW1pcMatch[1] : 'not found');
    
    // Look at surrounding text of a known price from today (e.g. 290 - 300)
    // We can do a sliding window search
    const matches = [...html.matchAll(/(\$[1-9][0-9]{0,2},?[0-9]{0,3}\.[0-9]{2})/g)];
    const unique = [...new Set(matches.map(m => m[1]))];
    console.log("Prices found: ", unique.slice(0, 10));
}
test();
