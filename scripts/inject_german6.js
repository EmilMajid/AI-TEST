const fs = require('fs');
const path = require('path');

const MANUAL_PATH = path.join(process.cwd(), 'scripts', 'manual-topics.json');
const manualData = JSON.parse(fs.readFileSync(MANUAL_PATH, 'utf8'));

// Alman dili 6 (əsas) - Transcribed from PDF images
const german6Updates = {
    "alman-dili-6": [
        {
            "chapter": "Mövzular",
            "topics": [
                { "title": "LEKTION 1: Guten Tag/Hallo (Wiederholung)", "page": 8, "path": "" },
                { "title": "Lesezauber (Lektion 1)", "page": 18, "path": "" },
                { "title": "LEKTION 2: Reisen macht Spaß", "page": 22, "path": "" },
                { "title": "Lesezauber (Lektion 2)", "page": 34, "path": "" },
                { "title": "LEKTION 3: Mein Tagesablauf", "page": 39, "path": "" },
                { "title": "Lesezauber (Lektion 3)", "page": 48, "path": "" },
                { "title": "LEKTION 4: Einkaufen", "page": 52, "path": "" },
                { "title": "Lesezauber (Lektion 4)", "page": 67, "path": "" },
                { "title": "LEKTION 5: Schule, Schulsystem", "page": 71, "path": "" },
                { "title": "Lesezauber (Lektion 5)", "page": 84, "path": "" },
                { "title": "LEKTION 6: Freundschaft, Gefühle", "page": 88, "path": "" },
                { "title": "Lesezauber (Lektion 6)", "page": 104, "path": "" },
                { "title": "LEKTION 7: Lust auf Sport", "page": 109, "path": "" },
                { "title": "Lesezauber (Lektion 7)", "page": 125, "path": "" },
                { "title": "LEKTION 8: Baku-Berlin", "page": 129, "path": "" },
                { "title": "Wortschatz", "page": 136, "path": "" },
                { "title": "Grammatikübersicht", "page": 146, "path": "" },
                { "title": "Modelltest für Fit in Deutsch 1", "page": 156, "path": "" },
                { "title": "Transkripte zum Hören", "page": 167, "path": "" }
            ]
        }
    ]
};

// Merge
Object.assign(manualData, german6Updates);

fs.writeFileSync(MANUAL_PATH, JSON.stringify(manualData, null, 2), 'utf8');
console.log('Successfully injected Alman dili 6 (əsas) topics!');
