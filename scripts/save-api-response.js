const fs = require('fs');
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/textbooks/topics?class=8',
    method: 'GET'
};

const req = http.request(options, res => {
    let data = '';

    res.on('data', chunk => {
        data += chunk;
    });

    res.on('end', () => {
        fs.writeFileSync('api-response.json', data);
        console.log('Response saved to api-response.json');
    });
});

req.on('error', error => {
    console.error(error);
});

req.end();
