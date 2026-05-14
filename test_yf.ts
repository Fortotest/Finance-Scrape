async function test() {
  const ticker = 'AAPL'; // 'DX-Y.NYB' is DXY
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1m`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await res.json();
    console.log(json.chart.result[0].meta.regularMarketPrice);
    console.log(json.chart.result[0].meta.previousClose);
  } catch (e) {
    console.error(e);
  }
}
test();
