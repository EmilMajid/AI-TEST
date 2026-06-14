const https = require('https');

https.get('https://www.e-derslik.edu.az/books/780/units/unit-1/page8.xhtml', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    if(res.statusCode === 200) {
        console.log('Success! Length:', data.length);
        console.log('Sample:', data.substring(0, 500));
    }
  });
});
