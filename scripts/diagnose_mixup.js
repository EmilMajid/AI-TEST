const http = require('http');

async function checkAPI() {
    const options = {
        hostname: '127.0.0.1',
        port: 3000,
        path: '/api/textbooks/topics?class=5&subject=' + encodeURIComponent('İkinci xarici dil'),
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log('API SUCCESS:', json.success);
                    console.log('TOTAL KEYS:', Object.keys(json.topics || {}).length);
                    console.log('KEYS:', Object.keys(json.topics || {}));

                    for (const key in json.topics) {
                        console.log(`\n[${key}]`);
                        json.topics[key].forEach(group => {
                            console.log(`  Chapter: ${group.chapter} (${group.topics.length} topics)`);
                            group.topics.slice(0, 3).forEach(t => console.log(`    - ${t.title}`));

                            // DETECT MIX-UP
                            const issues = group.topics.filter(t => {
                                if (key === 'Alman dili' && (t.title.toLowerCase().includes('leçon') || t.title.toLowerCase().includes('étape'))) return true;
                                if (key === 'Fransız dili' && (t.title.toLowerCase().includes('stunde') || t.title.toLowerCase().includes('lektion'))) return true;
                                return false;
                            });
                            if (issues.length > 0) {
                                console.log('  !!! MIXED TOPICS FOUND:', issues.map(i => i.title));
                            }
                        });
                    }
                    resolve();
                } catch (e) {
                    console.error('Parse error:', e.message);
                    console.log('Raw sample:', data.substring(0, 200));
                    resolve();
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

checkAPI().catch(console.error);
