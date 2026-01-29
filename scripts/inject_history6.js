const fs = require('fs');
const path = require('path');

const MANUAL_PATH = path.join(process.cwd(), 'scripts', 'manual-topics.json');
const manualData = JSON.parse(fs.readFileSync(MANUAL_PATH, 'utf8'));

// Ümumi tarix 6 - 24 full topics based on official curriculum
const history6Updates = {
    "umumi-tarix-6": [
        {
            "chapter": "I İBTİDAİ DÖVR",
            "topics": [
                { "title": "1. İbtidai icma quruluşunun yaranması və inkişafı", "page": 1, "path": "" },
                { "title": "2. İbtidai icma quruluşunun dağılması", "page": 1, "path": "" }
            ]
        },
        {
            "chapter": "II QƏDİM MİSİR VƏ ÖN ASİYA",
            "topics": [
                { "title": "3. Qədim Misir dövləti", "page": 1, "path": "" },
                { "title": "4. Qədim Misirdə mədəniyyət", "page": 1, "path": "" },
                { "title": "5. Qədim şumerlilər", "page": 1, "path": "" },
                { "title": "6. Babil dövləti", "page": 1, "path": "" },
                { "title": "7. Finikiya", "page": 1, "path": "" },
                { "title": "8. Assur dövləti", "page": 1, "path": "" },
                { "title": "9. Midiya dövləti", "page": 1, "path": "" },
                { "title": "10. Əhəmənilər dövləti", "page": 1, "path": "" },
                { "title": "11. Parfiya dövləti", "page": 1, "path": "" }
            ]
        },
        {
            "chapter": "III QƏDİM TÜRKLƏR. QƏDİM ÇİN VƏ HİNDİSTAN",
            "topics": [
                { "title": "12. Qədim türklər", "page": 1, "path": "" },
                { "title": "13. İskit dövlətləri", "page": 1, "path": "" },
                { "title": "14. Böyük Hun dövləti", "page": 1, "path": "" },
                { "title": "15. Qədim Çin", "page": 1, "path": "" },
                { "title": "16. Qədim Hindistan", "page": 1, "path": "" }
            ]
        },
        {
            "chapter": "IV QƏDİM YUNANISTAN",
            "topics": [
                { "title": "17. Avropada ən qədim dövlət. Qədim yunan şəhər-dövlətləri", "page": 1, "path": "" },
                { "title": "18. Yunanlar işğalçılara qarşı. Afina quldarlıq demokratiyası", "page": 1, "path": "" },
                { "title": "19. Qədim Yunanıstan mədəniyyəti", "page": 1, "path": "" },
                { "title": "20. Yunan şəhər-dövlətlərinin tənəzzülü. Makedoniya dövlətinin güclənməsi", "page": 1, "path": "" }
            ]
        },
        {
            "chapter": "V QƏDİM ROMA",
            "topics": [
                { "title": "21. Qədim Roma respublikasının yaranması", "page": 1, "path": "" },
                { "title": "22. Respublikanın sonu. Roma imperiyasının yaranması və süqutu", "page": 1, "path": "" },
                { "title": "23. Qədim Roma mədəniyyəti", "page": 1, "path": "" },
                { "title": "24. Erkən orta əsrlərdə xristian kilsəsi", "page": 1, "path": "" }
            ]
        }
    ]
};

// Merge
Object.assign(manualData, history6Updates);

fs.writeFileSync(MANUAL_PATH, JSON.stringify(manualData, null, 2), 'utf8');
console.log('Successfully injected Ümumi tarix 6 subjects!');
