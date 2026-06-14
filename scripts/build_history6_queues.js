const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

function buildQueue(topicsFile, chunksDir, TIK_PREFIX, rolePrefix, outFilename) {
    const topics = JSON.parse(fs.readFileSync(path.join(dataDir, topicsFile), 'utf8'));
    const payload = [];
    
    topics.forEach(t => {
        // Find chunk
        const chunkPath = path.join(dataDir, chunksDir, `topic_real_${t.id}.txt`);
        if(!fs.existsSync(chunkPath)) return;
        
        // e.g. 06-004-0101-B001 (History prefix can be 06-008 for Az Tarixi, but we don't have exact passport specs, so we use a generic placeholder with book id)
        const tik = `${TIK_PREFIX}-${t.id}-`;
        
        const prompt = `Mövzu: ${t.id}. ${t.topic_title}. Mətn faylı: data/${chunksDir}/topic_real_${t.id}.txt. TİK: ${tik}. 15 test (5 sadə, 5 orta, 5 çətin) yarat. Nəticəni \`write_to_file\` aləti ilə tam C:/Users/User/Downloads/azerbaijanaiplatform/data/${chunksDir}_generated/topic_${t.id}.json faylına yaz. Mənə heç bir JSON kodu GÖNDƏRMƏ! Yalnız 'Hazırdır' mesajı göndər.`;
        
        payload.push({
            TypeName: 'sop_v3_test_generator',
            Role: `${rolePrefix}_T${t.id}`,
            Prompt: prompt
        });
    });
    
    fs.writeFileSync(path.join(dataDir, outFilename), JSON.stringify(payload, null, 2), 'utf8');
    console.log(`Generated ${payload.length} tasks for ${outFilename}`);
}

buildQueue('clean_topics_aztarixi_6.json', 'aztarixi6_chunks', '06-AZT-6', 'AzTarixi6', 'subagents_payload_aztarixi6.json');
buildQueue('clean_topics_umumi_tarix_6.json', 'umumitarix6_chunks', '06-UMT-6', 'UmTarix6', 'subagents_payload_umumitarix6.json');
