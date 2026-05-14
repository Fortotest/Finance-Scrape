async function testAPI() {
    const res = await fetch('http://localhost:3000/api/quote/AAPL');
    const data = await res.json();
    console.log(data);
}
testAPI();
