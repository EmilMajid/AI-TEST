const fs = require('fs');
const path = require('path');

const INDEX_FILE = path.join(__dirname, '../data/vector_index/index_metadata.json');

function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function testSearch(query, grade, subject) {
    console.log(`\nTesting RAG search for: "${query}" (Grade ${grade}, Subject: ${subject})`);

    const { pipeline } = await import('@xenova/transformers');
    const embedder = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');

    const index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
    console.log(`Index loaded with ${index.length} chunks.`);

    // Embed the query
    const queryEnriched = `${grade} sinif ${subject} fənni: ${query}`;
    const output = await embedder(queryEnriched, { pooling: 'mean', normalize: true });
    const queryVector = Array.from(output.data);

    // Calculate similarities and filter
    const results = index
        .filter(item => item.grade == grade && (subject === 'all' || item.subject.toLowerCase() === subject.toLowerCase()))
        .map(item => ({
            ...item,
            score: cosineSimilarity(queryVector, item.vector)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    console.log("\nTop Results:");
    results.forEach((r, i) => {
        console.log(`${i + 1}. [Score: ${r.score.toFixed(4)}] ${r.source} (Page ${r.page})`);
        console.log(`   Text: ${r.text.substring(0, 150)}...`);
        console.log('---');
    });
}

// Default test queries
const runTests = async () => {
    try {
        await testSearch("Voleybol oyununun qaydaları", 5, "Fiziki tərbiyə"); // Corrected subject name
        await testSearch("İnformasiya nədir?", 5, "İnformatika"); // EPUB test
        await testSearch("Окружающий мир: природа и человек", 5, "Xarici dil"); // Using correct subject category
    } catch (e) {
        console.error(e);
    }
};

if (require.main === module) {
    runTests();
}
