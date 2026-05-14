import https from 'https';

async function testFetch() {
  const options = {
    hostname: 'www.google.com',
    path: '/finance/quote/AAPL:NASDAQ',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
      'Cookie': 'CONSENT=YES+cb.20230101-00-p0.en+FX+414;'
    }
  };
  https.get(options, (res) => {
    let ht = '';
    res.on('data', d => ht += d);
    res.on('end', () => {
      console.log('Class fxKbKc exists: ', ht.includes('fxKbKc'));
      console.log('YMlKec exists: ', ht.includes('YMlKec'));
      if(ht.includes('YMlKec')) {
          const match = ht.match(/class="YMlKec fxKbKc"[^>]*>([^<]+)<\/div>/);
          console.log(match);
      }
    });
  });
}
testFetch();
