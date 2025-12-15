const http = require('http');

function postRequest(data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/test-bank/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve(body);
                    }
                } else {
                    reject(`Status ${res.statusCode}: ${body}`);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log('Starting API Tests...');

    // Test 1: Pending
    try {
        console.log('\nTest 1: AutoApprove = false (Expected: Pending)');
        const data1 = JSON.stringify({
            topicKey: 'informatika',
            difficulty: 'orta',
            bloomLevel: 'anlama',
            count: 1,
            autoApprove: false
        });
        const res1 = await postRequest(data1);
        console.log('Result:', JSON.stringify(res1, null, 2));
    } catch (e) {
        console.error('Test 1 failed:', e);
    }

    // Test 2: Active
    try {
        console.log('\nTest 2: AutoApprove = true (Expected: Active)');
        const data2 = JSON.stringify({
            topicKey: 'informatika',
            difficulty: 'orta',
            bloomLevel: 'anlama',
            count: 1,
            autoApprove: true
        });
        const res2 = await postRequest(data2);
        console.log('Result:', JSON.stringify(res2, null, 2));
    } catch (e) {
        console.error('Test 2 failed:', e);
    }
}

runTests();
