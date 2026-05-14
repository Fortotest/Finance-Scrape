import YahooFinance from 'yahoo-finance2';
async function test() {
  try {
    const yf = new YahooFinance();
    const res = await yf.quote('AAPL');
    console.log("Yahoo Finance 2:", res.regularMarketPrice);
  } catch (e) {
    console.error(e);
  }
}
test();
