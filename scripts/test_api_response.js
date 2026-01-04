const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/textbooks/topics?class=5',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Success:', json.success);
            console.log('Class:', json.class);
            const keys = Object.keys(json.topics);
            console.log('Subjects found keys:', keys);

            // Check specific broken subjects
            const splitCheck = [
                'Azərbaycan dili (Hissə 1)',
                'Azərbaycan dili (Hissə 2)',
                'Riyaziyyat (Hissə 1)',
                'Riyaziyyat (Hissə 2)',
                'Təbiət (Hissə 1)',
                'Təbiət (Hissə 2)',
                // 'Təsviri İncəsənət' // Temporarily removed until I add the book
            ];

            splitCheck.forEach(subj => {
                if (json.topics[subj]) {
                    console.log(`✅ ${subj}: ${json.topics[subj].length} chapters`);
                    const firstChapter = json.topics[subj][0];
                    console.log(`   Sample: ${firstChapter.chapter} - ${firstChapter.topics.length} topics`);
                } else {
                    console.log(`❌ ${subj} NOT FOUND in keys`);
                    // Check if they exist as generic
                    const generic = subj.replace(/ \(Hissə \d+\)/, "");
                    if (json.topics[generic])
                        console.log(`   Found as merged ${generic} (Revert failed?)`);
                }
            });

            // Define API_BASE for the new test function
            const API_BASE = `http://${options.hostname}:${options.port}/api`;

            async function testTopicsAPI() {
                console.log("\nTesting Topics API with subject filtering...");

                // 1. Test Main Foreign Language (Xarici dil)
                console.log("\n--- Track: Xarici dil (Əsas) ---");
                const mainRes = await fetch(`${API_BASE}/textbooks/topics?class=5&subject=${encodeURIComponent("Xarici dil")}`);
                const mainData = await mainRes.json();

                if (mainData.success && mainData.topics) {
                    ["Alman dili", "Fransız dili", "Rus dili", "İngilis dili"].forEach(lang => {
                        const topicGroup = mainData.topics[lang];
                        if (topicGroup) {
                            console.log(`✓ ${lang}: ${topicGroup[0]?.topics[0]?.title || 'No topics'}`);
                        } else {
                            console.log(`✗ ${lang} not found in Xarici dil track`);
                        }
                    });
                }

                // 2. Test Second Foreign Language (İkinci xarici dil)
                console.log("\n--- Track: İkinci xarici dil ---");
                const secondRes = await fetch(`${API_BASE}/textbooks/topics?class=5&subject=${encodeURIComponent("İkinci xarici dil")}`);
                const secondData = await secondRes.json();

                if (secondData.success && secondData.topics) {
                    ["Alman dili", "Fransız dili", "Rus dili"].forEach(lang => {
                        const groups = secondData.topics[lang];
                        if (groups) {
                            const lastGroup = groups[groups.length - 1];
                            const lastTopic = lastGroup.topics[lastGroup.topics.length - 1];
                            const totalTopics = groups.reduce((acc, g) => acc + g.topics.length, 0);
                            console.log(`✓ ${lang}: ${totalTopics} topics total. First: ${groups[0].topics[0].title}, Last: ${lastTopic.title}`);
                        } else {
                            console.log(`✗ ${lang} not found in İkinci xarici dil track`);
                        }
                    });
                }
            }

            testTopicsAPI().catch(err => console.error(err));


        } catch (e) {
            console.error('Error parsing JSON:', e.message);
            console.log('Raw data:', data.substring(0, 500));
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
