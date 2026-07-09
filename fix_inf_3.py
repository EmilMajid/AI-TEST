import json

with open('scripts/manual-topics.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

# Manually assemble informatika-3 perfectly
inf_3 = [
    {
        "chapter": "1 İNFORMASİYA",
        "topics": [
            {"title": "İNSAN VƏ İNFORMASİYA", "page": 1, "path": ""},
            {"title": "TƏBİƏTDƏ İNFORMASİYA", "page": 2, "path": ""},
            {"title": "İNFORMASİYA PROSESLƏRİ", "page": 3, "path": ""},
            {"title": "İNFORMASİYANIN ÖTÜRÜLMƏSİ", "page": 4, "path": ""},
            {"title": "İNFORMASİYANIN KODLAŞDIRILMASI", "page": 5, "path": ""},
            {"title": "REBUS", "page": 6, "path": ""},
            {"title": "İNFORMASİYANIN EMALI", "page": 7, "path": ""}
        ]
    },
    {
        "chapter": "2 ALQORİTM",
        "topics": [
            {"title": "OBYEKTLƏR QRUPU", "page": 1, "path": ""},
            {"title": "OBYEKTİN FƏRQLƏNDİRİCİ ƏLAMƏTLƏRİ", "page": 2, "path": ""},
            {"title": "“HAMISI”, “HEÇ BİRİ”, “BƏZİSİ”", "page": 3, "path": ""},
            {"title": "QANUNAUYĞUNLUQ", "page": 4, "path": ""},
            {"title": "ALQORİTM", "page": 5, "path": ""},
            {"title": "XƏTTİ ALQORİTM", "page": 6, "path": ""},
            {"title": "BUDAQLANMA", "page": 7, "path": ""},
            {"title": "MƏQSƏDƏUYĞUN YOLUN SEÇİLMƏSİ", "page": 8, "path": ""},
            {"title": "TƏKRARLANAN HƏRƏKƏTLƏR", "page": 9, "path": ""}
        ]
    },
    {
        "chapter": "3 KOMPÜTER",
        "topics": [
            {"title": "KOMPÜTER VƏ İNFORMASİYA", "page": 1, "path": ""},
            {"title": "İŞ MASASI", "page": 2, "path": ""},
            {"title": "QOVLUQ", "page": 3, "path": ""},
            {"title": "PAINT PROQRAMI", "page": 4, "path": ""},
            {"title": "PALİTRA", "page": 5, "path": ""},
            {"title": "ŞƏKLİN FRAQMENTİ İLƏ İŞ", "page": 6, "path": ""},
            {"title": "ŞƏKİLLƏRİN KOMPÜTERDƏ SAXLANMASI", "page": 7, "path": ""},
            {"title": "WORDPAD PROQRAMI", "page": 8, "path": ""},
            {"title": "MƏTNLƏRLƏ İŞ", "page": 9, "path": ""},
            {"title": "MƏTNƏ ŞƏKLİN ƏLAVƏ EDİLMƏSİ", "page": 10, "path": ""},
            {"title": "MƏTNDƏ SÖZLƏRİN ƏVƏZ OLUNMASI", "page": 11, "path": ""},
            {"title": "KOMPÜTERDƏ HESABLAMALARIN APARILMASI", "page": 12, "path": ""}
        ]
    }
]

db['informatika-3'] = inf_3

with open('scripts/manual-topics.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print("Informatika-3 manually fixed!")
