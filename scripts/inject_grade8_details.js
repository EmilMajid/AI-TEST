const fs = require('fs');
const path = require('path');

const manualTopicsPath = path.join(__dirname, 'manual-topics.json');
const manualTopics = JSON.parse(fs.readFileSync(manualTopicsPath, 'utf8'));

const grade8Restoration = {
    "azerbaycan-tarixi-8": [
        {
            "chapter": "AZƏRBAYCAN XVI ƏSRİN İKİNCİ YARISI-XVII ƏSRDƏ",
            "topics": [
                { "title": "Azərbaycan ərazilərinin Osmanlılar tərəfindən işğalı" },
                { "title": "Şah I Abbasın islahatları" },
                { "title": "Cəlalilər hərəkatı. Şah I Abbasın hərbi uğurları" },
                { "title": "XVI əsrin ikinci yarısı - XVII əsrdə sosial-iqtisadi və ictimai həyat" },
                { "title": "Azərbaycan beynəlxalq ticarət əlaqələrində" },
                { "title": "XVII əsrdə Azərbaycan mədəniyyəti" }
            ]
        },
        {
            "chapter": "AZƏRBAYCAN XVIII ƏSRİN BİRİNCİ YARISINDA",
            "topics": [
                { "title": "XVIII əsrin əvvəllərində Azərbaycanda iqtisadi və siyasi vəziyyət" },
                { "title": "Rusiyanın Xəzər dənizi hövzəsinə yürüşə hazırlaşması" },
                { "title": "Azərbaycan torpaqlarının iki imperiya tərəfindən bölüşdürülməsi" },
                { "title": "Azərbaycan torpaqları Rusiya və Osmanlı dövlətlərinin hakimiyyəti altında" },
                { "title": "Azərbaycan torpaqlarının azad edilməsi" },
                { "title": "Əfşar imperiyasının yaranması" },
                { "title": "XVIII əsrin 30-40-cı illərində üsyanlar" },
                { "title": "Əfşar imperiyasının süqutu" }
            ]
        },
        {
            "chapter": "AZƏRBAYCAN XVIII ƏSRİN İKİNCİ YARISINDA",
            "topics": [
                { "title": "Azərbaycanda ilk müstəqil xanlıq" },
                { "title": "Azərbaycanın cənub xanlıqları" },
                { "title": "Şimal-Şərqi Azərbaycan dövləti - Quba xanlığı" },
                { "title": "Quba xanlığının birləşdirmə siyasətinin ikinci mərhələsi" },
                { "title": "Qarabağ - bəylərbəyilikdən xanlığa" },
                { "title": "Qərbi Azərbaycan xanlıqları" },
                { "title": "İkihakimiyyətli xanlıqlar" },
                { "title": "Bakı, Lənkəran və Dərbənd xanlıqları" },
                { "title": "Camaatlıq, sultanlıqlar və məlikliklər" },
                { "title": "Ağa Məhəmməd xan Qacarın birləşdirmə siyasəti" },
                { "title": "XVIII əsrin ikinci yarısında Azərbaycanda ictimai həyat" },
                { "title": "İqtisadi vəziyyət. Sənətkarlıq. Ticarət" }
            ]
        },
        {
            "chapter": "AZƏRBAYCAN XIX ƏSRİN ƏVVƏLLƏRİNDƏ",
            "topics": [
                { "title": "Rusiyanın Azərbaycan torpaqlarının işğalına başlaması" },
                { "title": "Car-Balakənin və Gəncə xanlığının Rusiya tərəfindən işğalı" },
                { "title": "Qarabağ, Şəki və Şamaxı xanlıqlarının Rusiya tərəfindən işğalı" },
                { "title": "Bakı, Dərbənd və Quba xanlıqlarının işğalı" },
                { "title": "Gülüstan müqaviləsi" },
                { "title": "Rusiyanın Azərbaycanda müstəmləkə rejimi yaratması" },
                { "title": "Naxçıvan və İrəvan xanlıqlarının işğalı" },
                { "title": "Türkmənçay müqaviləsi" }
            ]
        }
    ],
    "informatika-8": [
        {
            "chapter": "I BÖLMƏ. İNFORMASİYA",
            "topics": [
                { "title": "İnformasiyanın kodlaşdırılması" },
                { "title": "2-lik, 8-lik, 16-lıq say sistemləri" },
                { "title": "Bir say sistemindən başqasına keçid" },
                { "title": "İnformasiyanın ölçülməsi" }
            ]
        },
        {
            "chapter": "II BÖLMƏ. MULTİMEDİA",
            "topics": [
                { "title": "Multimedia qurğuları" },
                { "title": "Elektron təqdimatda animasiya" },
                { "title": "Təqdimatda səs və video" },
                { "title": "Mədəniyyət Mərkəzi-ŞUŞA! adlı təqdimatın hazırlanması" }
            ]
        },
        {
            "chapter": "III BÖLMƏ. PROQRAMLAŞDIRMA",
            "topics": [
                { "title": "Proqram necə hazırlanır" },
                { "title": "Python dilində ilk proqram" },
                { "title": "Proqramlarda kəmiyyətlər" },
                { "title": "Şərt operatoru" },
                { "title": "Proqramda dövr" }
            ]
        },
        {
            "chapter": "IV BÖLMƏ. KOMPÜTER",
            "topics": [
                { "title": "İş masasının nizamlanması" },
                { "title": "İnformasiya modelinin ağac forması" },
                { "title": "Faylların axtarışı" },
                { "title": "Məsələ həlli" }
            ]
        },
        {
            "chapter": "V BÖLMƏ. TƏTBİQİ PROQRAMLAR",
            "topics": [
                { "title": "Üçölçülü qrafika" },
                { "title": "Tillər və üzlər" },
                { "title": "Üçölçülü modellərin qurulması" },
                { "title": "Mətn redaktorunun obyektləri" },
                { "title": "Elektron cədvəl" },
                { "title": "Düsturlarla iş" }
            ]
        }
    ],
    "umumi-tarix-8": [
        {
            "chapter": "I. XVII—XVIII ƏSRLƏRDƏ ŞƏRQDƏ NƏLƏR BAŞ VERDİ?",
            "topics": [
                { "title": "Azərbaycan Səfəvi imperiyası yeni dövrün astanasında" },
                { "title": "Nadir şah Əfşar imperiyası" },
                { "title": "Qacarlar imperiyasının yaranması" },
                { "title": "Böyük Moğol imperiyasının parçalanması" },
                { "title": "Çin — «Qapalı ölkə»" },
                { "title": "«Gündoğan ölkə»" },
                { "title": "Yeni dövrə köhnə qaydalarla daxil olan imperiya" },
                { "title": "Osmanlı dövlətinin beynəlxalq nüfuzunun zəifləməsi" },
                { "title": "Avropa dövlətlərinin Osmanlı imperiyasını bölüşdürmək planları" },
                { "title": "Mərkəzi Asiya xanlıqları" },
                { "title": "Volqaboyu, Ural və Sibir türkləri" },
                { "title": "Şimali Qafqaz yeni dövrün astanasında" },
                { "title": "Cənubi Qafqaz məkrli planların hədəfində" },
                { "title": "Türk və Qafqaz xalqlarının mədəniyyəti" }
            ]
        },
        {
            "chapter": "II. AVROPA VƏ AMERİKA XVII—XVIII ƏSRLƏRDƏ",
            "topics": [
                { "title": "İngiltərə burjua inqilabı və vətəndaş müharibəsi" },
                { "title": "İngiltərədə parlamentli monarxiyanın qurulması" },
                { "title": "Sənaye çevrilişi" },
                { "title": "Avropalılar Şimali Amerikada" },
                { "title": "Amerika Birləşmiş Ştatlarının yaranması" },
                { "title": "Fransa inqilab ərəfəsində" },
                { "title": "İnqilabın başlanması və inkişafı" },
                { "title": "İnqilabın Avropa ölkələrinə təsiri" },
                { "title": "Rusiya I Pyotrun islahatları dövründə" },
                { "title": "Maarifçilik, təhsil, elm" },
                { "title": "Ədəbiyyat, memarlıq və incəsənət" }
            ]
        }
    ]
};

Object.assign(manualTopics, grade8Restoration);

fs.writeFileSync(manualTopicsPath, JSON.stringify(manualTopics, null, 2));
console.log("✅ Grade 8 (History & Informatics) injection complete.");
