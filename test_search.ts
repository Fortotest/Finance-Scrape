async function test(query) {
  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${query}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await res.json();
    console.log(query, ":", json.quotes[0]?.symbol);
  } catch (e) {
    console.error(query, "FAILED");
  }
}
test("BBRI");
test("BUMI");
test("ANTAM");
test("AAPL");
test("XAUUSD");
test("TAI");
test("TOLOL");
