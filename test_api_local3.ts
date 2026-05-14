import fetch from 'node-fetch';
async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/quote/ADKASD');
    const json = await res.json();
    console.log("Response ADKASD:", json);
  } catch (e) {
    console.error(e);
  }
}
test();
