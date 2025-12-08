const fs = require('fs');
const path = require('path');

const manualPath = path.join(process.cwd(), "scripts", "manual-topics.json");
const extractedPath = path.join(process.cwd(), "scripts", "extracted-topics.json");

let extractedData = {};
if (fs.existsSync(extractedPath)) {
    try { extractedData = JSON.parse(fs.readFileSync(extractedPath, "utf-8")); } catch (e) { }
}

function findPageNumber(subject, titlePart) {
    if (!extractedData[subject]) return 1;
    // Normalized search
    const normTitle = titlePart.toLowerCase().replace(/ı/g, 'i').replace(/ə/g, 'e');

    for (const group of extractedData[subject]) {
        for (const topic of group.topics) {
            const topicTitle = topic.title.toLowerCase().replace(/ı/g, 'i').replace(/ə/g, 'e');
            if (topicTitle.includes(normTitle) || normTitle.includes(topicTitle)) {
                return topic.page;
            }
        }
    }
    return 1; // Default
}

const updates = {
    "tesviri-incesenet": [
        {
            "chapter": "TƏSVİRİ SƏNƏTDƏ TARİXİ HADİSƏLƏR VƏ QƏHRƏMANLIQ MÖVZUSU",
            "topics": [
                "Təsviri sənətdə batal və tarixi janrlar",
                "Fransisko Qoyya: rəssamın rəng dünyasına həyat hadisələrinin təsiri",
                "Jak Lui David: tarixi obrazlar",
                "Jan Ogüst Dominik Enqr: xətt incəsənəti",
                "Ejen Delakrua: rəng kontrastının dahi sənətkarı"
            ]
        },
        {
            "chapter": "TƏSVİRİ SƏNƏTDƏ YENİ DÖVRÜN BƏDİİ İFADƏ VASİTƏLƏRİ",
            "topics": [
                "İmpressionizm: təəssüratların poeziyası",
                "Oskar Klod Mone: işıq və rəng vurğunluğu",
                "Eduard Mane: impressionizmdə natürmort",
                "Ogüst Renuar: işığa yeni baxış",
                "Ogüst Roden: heykəltəraşlıqda hərəkət və emosiya",
                "Vinsent Van Qoq: rəng, xətt və formaların emosional təsiri",
                "Pol Qogen: rəng və xətlərin sadələşdirilməsi. Simvolizm",
                "Anri Matis: rəngkarlıqda dekorativlik, forma və rəng"
            ]
        },
        {
            "chapter": "AZƏRBAYCAN SƏNƏTKARLARI",
            "topics": [
                "Böyükağa Mirzəzadə: füsunkar rənglər dünyası",
                "Fuad Əbdürrəhmanov: dəzgah və monumental heykəltəraşlıq",
                "Tokay Məmmədov: monumental heykəltəraşlıqda forma, material və məkan",
                "Sadıq Dadaşov: Azərbaycan memarlığında milli və müasir elementlər",
                "Toğrul Nərimanbəyov: monumental rəngkarlıq",
                "Eldar Mikayılzadə: xalçalarda fəlsəfi fikrin təcəssümü",
                "İdeya, funksiya, rahatlıq: insanın əşyalar aləmi",
                "Dünya muzeyləri: impressionizmin ruhu"
            ]
        }
    ],
    "hayat-bilgisi": [
        {
            "chapter": "TƏBİƏTDƏKİ QANUNAUYĞUNLUQLAR",
            "topics": [
                "Materiya - maddə və sahə",
                "Kainatda baş verən hadisələrin sirri",
                "Ekoloji tarazlıq",
                "Layihə. Ekoloji tarazlığın qorunması və bərpası"
            ]
        },
        {
            "chapter": "CƏMİYYƏT VƏ DÖVLƏT",
            "topics": [
                "Cəmiyyətin inkişafında inteqrasiyanın rolu",
                "Dövlət hakimiyyəti",
                "İnsan hüquqları",
                "İnsan hüquqlarının pozulması",
                "iqtisadiyya"
            ]
        },
        {
            "chapter": "MƏNİM MƏNƏVİ DÜNYAM",
            "topics": [
                "Münasibəti necə qururuq?",
                "İnsanlararası münasibətlər",
                "Vəzifələrimiz və məsuliyyətimiz",
                "Mənim mənəvi borcum",
                "Dini-əxlaqi dəyərlər"
            ]
        },
        {
            "chapter": "TƏHLÜKƏSİZ VƏ SAĞLAM YAŞA",
            "topics": [
                "Sağlam həyat - sağlam ailə",
                "Təhlükəsiz həyat",
                "Təbiətin canlı təhlükələri",
                "Yol hərəkətinin nizamlanması",
                "Bir-birimizə dəstək olaq"
            ]
        }
    ]
};

// Process and update
let manualTopics = {};
if (fs.existsSync(manualPath)) {
    manualTopics = JSON.parse(fs.readFileSync(manualPath, "utf-8"));
}

for (const subject in updates) {
    manualTopics[subject] = updates[subject].map(chapter => ({
        chapter: chapter.chapter,
        topics: chapter.topics.map(title => ({
            title: title,
            page: findPageNumber(subject, title),
            path: "" // Path is less critical for manual
        }))
    }));
}

fs.writeFileSync(manualPath, JSON.stringify(manualTopics, null, 2));
console.log("Updated manual-topics.json with Təsviri incəsənət and Həyat bilgisi.");
