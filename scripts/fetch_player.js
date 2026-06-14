const https = require('https');
const fs = require('fs');

https.get('https://www.e-derslik.edu.az/player/index3.php?book_id=780', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('temp_index.html', data);
    console.log('Saved temp_index.html. Length:', data.length);
  });
});
