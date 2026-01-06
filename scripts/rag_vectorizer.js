const fs = require('fs');
const path = require('path');

const CHUNKS_FILE = path.join(__dirname, '../data/textbook-chunks.jsonl');
const INDEX_DIR = path.join(__dirname, '../data/vector_index');
const INDEX_FILE = path.join(INDEX_DIR, 'index_metadata.json');

async function runIndexer() {
    console.log("Loading @xenova/transformers...");
    const { pipeline } = await import('@xenova/transformers');

    console.log("Initializing embedding pipeline (multilingual-MiniLM-L12)...");
    const embedder = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');

    if (!fs.existsSync(CHUNKS_FILE)) {
        console.error(`Error: ${CHUNKS_FILE} not found.`);
        return;
    }

    if (!fs.existsSync(INDEX_DIR)) fs.mkdirSync(INDEX_DIR, { recursive: true });

    const chunks = [];
    const lines = fs.readFileSync(CHUNKS_FILE, 'utf8').split('\n').filter(l => l.trim());

    console.log(`Processing ${lines.length} chunks...`);

    const metadata = [];

    for (let i = 0; i < lines.length; i++) {
        const item = JSON.parse(lines[i]);
        const text = item.text;

        if (i % 50 === 0) console.log(`  - Vectorizing chunk ${i}/${lines.length}...`);

        try {
            // Generate embedding
            const output = await embedder(text, { pooling: 'mean', normalize: true });
            const vector = Array.from(output.data);

            metadata.push({
                grade: item.grade,
                subject: item.subject,
                book_id: item.book_id,
                source: item.source,
                page: item.page,
                text: text,
                vector: vector // We store the vector inside metadata for simplicity in this JS-only setup
            });
        } catch (e) {
            console.error(`Error embedding chunk ${i}:`, e);
        }
    }

    console.log(`Writing index to ${INDEX_FILE}...`);
    fs.writeFileSync(INDEX_FILE, JSON.stringify(metadata, null, 2));

    console.log("\n✅ Node.js Vector Index created successfully!");
}

runIndexer().catch(console.error);
