async function test(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1m`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await res.json();
    console.log(ticker, ":", json.chart.result?.[0]?.meta?.regularMarketPrice);
  } catch (e) {
    console.error(ticker, ": FAILED", e.message);
  }
}
test('XAUUSD'); test('XAUUSD=X'); test('GOLD'); test('GC=F');
