import fetch from 'node-fetch';
async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/quote/ADKASD');
    const text = await res.text();
    console.log("Response status:", res.status);
    console.log("Response text:", text.substring(0, 500));
  } catch (e) {
    console.error(e);
  }
}
test();
