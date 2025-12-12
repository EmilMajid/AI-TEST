const fs = require('fs');
const path = require('path');

// Read manual-topics.json
const manualTopicsPath = path.join(__dirname, 'manual-topics.json');
const manualTopics = JSON.parse(fs.readFileSync(manualTopicsPath, 'utf-8'));

// Calculate topic coverage for each topic
const topicCoverage = {};

// Exclude foreign language textbooks (incorrect topic structure)
const excludedTopics = [
    'alman-dili-esas',
    'alman-dili-ikinci',
    'fransiz-dili-esas',
    'fransiz-dili-ikinci',
    'rus-dili-ikinci'
];

Object.keys(manualTopics).forEach(topicKey => {
    // Skip excluded topics
    if (excludedTopics.includes(topicKey)) {
        console.log(`⏭️  Skipping ${topicKey}: xarici dil (mövzu strukturu düzgün deyil)`);
        return;
    }

    const topicData = manualTopics[topicKey];

    if (!Array.isArray(topicData) || topicData.length === 0) {
        console.log(`Skipping ${topicKey}: no data`);
        return;
    }

    // Calculate metrics
    let totalPages = 0;
    let subtopicCount = 0;

    topicData.forEach(chapter => {
        if (chapter.topics && Array.isArray(chapter.topics)) {
            subtopicCount += chapter.topics.length;

            chapter.topics.forEach(topic => {
                if (topic.page && topic.endPage) {
                    totalPages += (topic.endPage - topic.page + 1);
                } else if (topic.page) {
                    totalPages += 1; // Assume 1 page if no endPage
                }
            });
        }
    });

    // Calculate target questions using formula:
    // targetQuestions = 10 + (pageCount * 0.5) + (subtopicCount * 2)
    // Min: 10, Max: 100
    const calculated = 10 + (totalPages * 0.5) + (subtopicCount * 2);
    const targetQuestions = Math.max(10, Math.min(100, Math.round(calculated)));

    topicCoverage[topicKey] = {
        topicKey,
        topicName: topicKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        targetQuestions,
        currentCount: 0,

        // Distribution percentages (fixed)
        distribution: {
            difficulty: {
                asan: 40,
                orta: 35,
                çətin: 20,
                qarışıq: 5
            },
            bloom: {
                xatırlama: 20,
                anlama: 25,
                tətbiq: 25,
                təhlil: 15,
                qiymətləndirmə: 10,
                yaradıcılıq: 5
            }
        },

        // Current distribution (actual counts)
        current: {
            difficulty: { asan: 0, orta: 0, çətin: 0, qarışıq: 0 },
            bloom: {
                xatırlama: 0,
                anlama: 0,
                tətbiq: 0,
                təhlil: 0,
                qiymətləndirmə: 0,
                yaradıcılıq: 0
            }
        },

        isComplete: false,
        completionPercentage: 0,

        // Metadata
        metrics: {
            totalPages,
            subtopicCount,
            calculatedScore: calculated
        }
    };

    console.log(`${topicKey}: ${subtopicCount} alt-mövzu, ${totalPages} səhifə → ${targetQuestions} sual`);
});

// Write to topic-coverage.json
const outputPath = path.join(__dirname, 'topic-coverage.json');
fs.writeFileSync(outputPath, JSON.stringify(topicCoverage, null, 2), 'utf-8');

console.log(`\n✅ Topic coverage hesablandı: ${Object.keys(topicCoverage).length} mövzu`);
console.log(`📁 Fayl: ${outputPath}`);
