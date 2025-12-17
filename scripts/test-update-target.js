const http = require('http');

function request(method, path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data ? Buffer.byteLength(data) : 0
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

        if (data) req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log('Starting Target Update Tests...');

    // Test 1: Update target to 150
    try {
        console.log('\nTest 1: Update \'informatika\' target to 150');
        const data1 = JSON.stringify({
            topicKey: 'informatika',
            targetQuestions: 150
        });
        const res1 = await request('PATCH', '/api/test-bank/coverage', data1);
        console.log('Result:', JSON.stringify(res1, null, 2));
    } catch (e) {
        console.error('Test 1 failed:', e);
    }

    // Test 2: Revert target to 90
    try {
        console.log('\nTest 2: Revert \'informatika\' target to 90');
        const data2 = JSON.stringify({
            topicKey: 'informatika',
            targetQuestions: 90
        });
        const res2 = await request('PATCH', '/api/test-bank/coverage', data2);
        console.log('Result:', JSON.stringify(res2, null, 2));
    } catch (e) {
        console.error('Test 2 failed:', e);
    }
}

runTests();
