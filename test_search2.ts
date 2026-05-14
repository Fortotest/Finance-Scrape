async function test(query) {
  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${query}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await res.json();
    console.log(query, ":", json.quotes.map(q => q.symbol));
  } catch (e) {
    console.error(query, "FAILED");
  }
}
test("XAUUSD");
test("DXY");
test("GOLD");
