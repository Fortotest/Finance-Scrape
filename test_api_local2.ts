import fetch from 'node-fetch';
async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/quote/BUMI');
    const json = await res.json();
    console.log("BUMI Price:", json.data?.price);
  } catch (e) {
    console.error(e);
  }
}
test();
