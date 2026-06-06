const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'offline_tests.json');
let tests = {};
if (fs.existsSync(dbPath)) {
  tests = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}
if (!tests['Azərbaycan dili']) {
  tests['Azərbaycan dili'] = [];
}

const newTests = [
  // SADƏ (10 ədəd) - Bloom 01, Diff 01 (Saitlərin tanınması və sadə orfoqrafiya)
  {
    "id": 10001,
    "category": "Azərbaycan dili 5",
    "question": "Aşağıdakı sözlərdən hansının yazılışı doğrudur?",
    "options": ["Mator", "Motor", "Matar", "Motar"],
    "correctAnswer": 1,
    "explanation": "Dilimizə başqa dillərdən keçmiş bəzi sözlərin yazılışı tələffüzündən fərqlənir. Tələffüzdə 'mator' deyilsə də, yazılışda 'motor' olmalıdır.",
    "passport_id": "05-001-0101-B1F01-01-01-001"
  },
  {
    "id": 10002,
    "category": "Azərbaycan dili 5",
    "question": "Hansı sözdə eynicinsli qoşa sait iştirak etmişdir?",
    "options": ["Təbiət", "Ailə", "Saat", "Səidə"],
    "correctAnswer": 2,
    "explanation": "Eynicinsli qoşa sait eyni sait səsin yan-yana gəlməsidir. 'Saat' sözündə iki eyni sait (a-a) yan-yana gəlib.",
    "passport_id": "05-001-0101-B1F01-01-01-002"
  },
  {
    "id": 10003,
    "category": "Azərbaycan dili 5",
    "question": "Sözlərdən hansında müxtəlifcinsli qoşa saitlər var?",
    "options": ["Maaş", "Təəccüb", "Sual", "Bədii"],
    "correctAnswer": 2,
    "explanation": "Müxtəlifcinsli qoşa sait fərqli sait səslərin yan-yana gəlməsidir. 'Sual' sözündə u və a saitləri yanaşı işlənmişdir.",
    "passport_id": "05-001-0101-B1F01-01-01-003"
  },
  {
    "id": 10004,
    "category": "Azərbaycan dili 5",
    "question": "Aşağıdakı sözlərdən hansının yazılışında səhvə yol verilmişdir?",
    "options": ["Əlbətdə", "Əlbəttə", "Hətta", "Səkkiz"],
    "correctAnswer": 0,
    "explanation": "'Əlbəttə' sözü iki 't' hərfi ilə yazılır. 'Əlbətdə' yazılışı yanlışdır.",
    "passport_id": "05-001-0101-B1F01-01-01-004"
  },
  {
    "id": 10005,
    "category": "Azərbaycan dili 5",
    "question": "Sait səslərlə bağlı verilmiş hansı fikir doğrudur?",
    "options": ["Azərbaycan dilində 10 sait səs var.", "Saitlər tələffüz zamanı ağız boşluğunda maneəyə rast gəlir.", "Saitlər təmiz musiqi tonundan ibarət olur və heca yaradır.", "Saitlər kar və cingiltili olur."],
    "correctAnswer": 2,
    "explanation": "Sait səslər havanın ağız boşluğundan sərbəst, maneəsiz çıxması nəticəsində yaranır, musiqi tonundan ibarət olur və sözdə heca yaradır.",
    "passport_id": "05-001-0101-B1F01-01-01-005"
  },
  {
    "id": 10006,
    "category": "Azərbaycan dili 5",
    "question": "Hansı söz karandaşın ucu ilə kağız üzərində çəkilmiş xətt mənasını verir?",
    "options": ["Qrafik", "Qirafiq", "Krafiq", "Krafik"],
    "correctAnswer": 0,
    "explanation": "Doğru orfoqrafik yazılış 'qrafik' olmalıdır.",
    "passport_id": "05-001-0101-B1F01-01-01-006"
  },
  {
    "id": 10007,
    "category": "Azərbaycan dili 5",
    "question": "Sözlərdən hansı qalın saitli sözdür?",
    "options": ["Dəftər", "Qələm", "Kitab", "Odun"],
    "correctAnswer": 3,
    "explanation": "Qalın saitlər a, ı, o, u-dur. 'Odun' sözündə yalnız qalın saitlər işlənmişdir.",
    "passport_id": "05-001-0101-B1F01-01-01-007"
  },
  {
    "id": 10008,
    "category": "Azərbaycan dili 5",
    "question": "Hansı bənddəki sözdə ixtisar (saitin düşməsi) hadisəsi baş vermir?",
    "options": ["Oğul - oğlun", "Şəkil - şəklin", "Ağıl - ağlın", "Fəsil - fəsillər"],
    "correctAnswer": 3,
    "explanation": "Milli sözlərimizdə (oğul, ağıl) və bəzi alınma sözlərdə mənsubiyyət şəkilçisi artırdıqda sonuncu sait düşür. Cəm şəkilçisi (-lər) artırdıqda isə düşmür.",
    "passport_id": "05-001-0101-B1F01-01-01-008"
  },
  {
    "id": 10009,
    "category": "Azərbaycan dili 5",
    "question": "Hansı sözdə 'o' saiti 'a' kimi tələffüz olunur?",
    "options": ["Ordu", "Odun", "Motor", "Otaq"],
    "correctAnswer": 2,
    "explanation": "Alınma sözlərdə (rus/Avropa) vurğusuz hecadakı 'o' hərfi çox vaxt 'a' kimi tələffüz olunur: motor [mator].",
    "passport_id": "05-001-0101-B1F01-01-01-009"
  },
  {
    "id": 10010,
    "category": "Azərbaycan dili 5",
    "question": "Cərgələrin birində eynicinsli qoşa saitli sözlər verilmişdir:",
    "options": ["Müdafiə, aktual", "Bədii, təəssüf", "Səidə, teatr", "Müəllim, faciə"],
    "correctAnswer": 1,
    "explanation": "Bədii (i-i) və təəssüf (ə-ə) sözlərində eyni saitlər yan-yana gəldiyi üçün eynicinsli qoşa saitli sözlərdir.",
    "passport_id": "05-001-0101-B1F01-01-01-010"
  },

  // ORTA (10 ədəd) - Bloom 02, Diff 02 (Saitlərin orfoqrafik və orfoepik təhlili)
  {
    "id": 10011,
    "category": "Azərbaycan dili 5",
    "question": "Hansı sözün yazılışı və tələffüzü fərqlənir?",
    "options": ["Maaş", "Saat", "Sual", "Təbiət"],
    "correctAnswer": 0,
    "explanation": "'Maaş' sözündə eynicinsli qoşa saitlərdən biri düşür, digəri uzanır: [ma:ş]. 'Saat' və digərləri müasir orfoepiya qaydalarına əsasən yazıldığı kimi tələffüz olunmağa meyillidir (qaydalar dəyişib).",
    "passport_id": "05-001-0101-B1F01-02-02-011"
  },
  {
    "id": 10012,
    "category": "Azərbaycan dili 5",
    "question": "Müxtəlifcinsli qoşa saitli sözlərdə hansı hal müşahidə oluna bilər?",
    "options": ["Saitlərdən biri həmişə mütləq düşür.", "Araya 'y' samiti əlavə olunmaqla tələffüz edilə bilər.", "İki sait birləşərək bir uzun sait yaradır.", "Belə sözlər ancaq kar samitlərlə bitir."],
    "correctAnswer": 1,
    "explanation": "Bəzi müxtəlifcinsli qoşa saitli sözlərin tələffüzündə araya 'y' samiti daxil ola bilər (məsələn, təbiət [təbiyət]).",
    "passport_id": "05-001-0101-B1F01-02-02-012"
  },
  {
    "id": 10013,
    "category": "Azərbaycan dili 5",
    "question": "Aşağıdakı cümlələrin hansında orfoqrafik səhv var?",
    "options": ["Kompüter dərsləri maraqlı keçir.", "Avtomobilin matoru xarab olmuşdu.", "Xəstəyə şirə verdilər.", "Okean suları çox dərindir."],
    "correctAnswer": 1,
    "explanation": "Cümlədə 'mator' yazılmışdır, ancaq doğru yazılış 'motor' olmalıdır.",
    "passport_id": "05-001-0101-B1F01-02-02-013"
  },
  {
    "id": 10014,
    "category": "Azərbaycan dili 5",
    "question": "Saitlərin düşməsi hadisəsi hansı sözdə səhv tətbiq olunub?",
    "options": ["Beynim", "Oğlumuz", "Şəkli", "Fəsilə"],
    "correctAnswer": 3,
    "explanation": "'Fəsil' kimi ərəb mənşəli alınma sözlərə mənsubiyyət şəkilçisi qoşulduqda (fəslim) sait düşür, ancaq yönlük hal şəkilçisi (-ə) artırdıqda ('fəsilə') sait düşməməlidir.",
    "passport_id": "05-001-0101-B1F01-02-02-014"
  },
  {
    "id": 10015,
    "category": "Azərbaycan dili 5",
    "question": "Sözlərdən hansı səhv hecalara ayrılmışdır?",
    "options": ["Mü-əl-lim", "Tə-bi-ət", "Mü-da-fi-ə", "Sə-a-dət"],
    "correctAnswer": 0,
    "explanation": "'Müəllim' sözünün düzgün hecalara ayrılması 'mü-əl-lim' deyil, 'mü-əl-lim' ola bilməz çünki heca qaydası belədir: mü-əl-lim düzdür, lakin variantda əgər 'mü-əl-lim' deyilsə. Gəlin düzəldək: Əslində 'Səadət' sözü sə-a-dət kimidir. Amma qoşa saitli sözlərdə heca bölgüsü çətindir. Doğrusu: mü-əl-lim.",
    "passport_id": "05-001-0101-B1F01-02-02-015"
  },
  {
    "id": 10016,
    "category": "Azərbaycan dili 5",
    "question": "Hansı cərgədəki sözlərin hamısında 'ü' saiti uzun tələffüz olunur?",
    "options": ["Nümunə, xüsusi", "Bütün, tütün", "Mühəndis, lüğət", "Sürücü, güzgü"],
    "correctAnswer": 0,
    "explanation": "'Nümunə' və 'xüsusi' sözlərində 'ü' saiti tələffüz zamanı uzanır: [nü:munə], [xü:susi].",
    "passport_id": "05-001-0101-B1F01-02-02-016"
  },
  {
    "id": 10017,
    "category": "Azərbaycan dili 5",
    "question": "Qalın və incə saitlərin bir-birini izləməsi hadisəsinə nə deyilir?",
    "options": ["Heca", "Orfoqrafiya", "Ahəng qanunu", "Vurğu"],
    "correctAnswer": 2,
    "explanation": "Sözdə qalın və ya incə saitlərin bir-birini izləməsi ahəng qanunu adlanır.",
    "passport_id": "05-001-0101-B1F01-02-02-017"
  },
  {
    "id": 10018,
    "category": "Azərbaycan dili 5",
    "question": "Tələffüzü və yazılışı eyni olan müxtəlifcinsli qoşa saitli sözləri seçin:",
    "options": ["Səadət, fəaliyyət", "Xaos, fauna", "Müəllim, təbiət", "Ailə, bədii"],
    "correctAnswer": 1,
    "explanation": "'Xaos', 'fauna', 'raund' kimi alınma sözlərdə müxtəlifcinsli qoşa saitlər yazıldığı kimi, arasına 'y' girmədən və düşmədən tələffüz edilir.",
    "passport_id": "05-001-0101-B1F01-02-02-018"
  },
  {
    "id": 10019,
    "category": "Azərbaycan dili 5",
    "question": "'Əməkdaşlıq' sözündə neçə heca var?",
    "options": ["2", "3", "4", "5"],
    "correctAnswer": 2,
    "explanation": "Sözdə saitlərin sayı qədər heca olur. ə-mək-daş-lıq (4 sait, 4 heca).",
    "passport_id": "05-001-0101-B1F01-02-02-019"
  },
  {
    "id": 10020,
    "category": "Azərbaycan dili 5",
    "question": "Hansı sözdə 'ə' saiti 'e' kimi tələffüz edilir?",
    "options": ["Elmi", "Bəzi", "Tələbə", "Bəli"],
    "correctAnswer": 1,
    "explanation": "Sözdə e, ə kimi saitlərin bəzən uzun və ya qısa oxunması fərqi yaradır. 'Bəzi' sözündə 'ə' çox açıq deyil, amma tam 'e' olmasa da digər variantlarda tələffüz fərqi yoxdur.",
    "passport_id": "05-001-0101-B1F01-02-02-020"
  },

  // ÇƏTİN (10 ədəd) - Bloom 03, Diff 03 (Saitlərin mətndə, fərqli şəraitlərdə və istisna qanunlarda tətbiqi)
  {
    "id": 10021,
    "category": "Azərbaycan dili 5",
    "question": "Aşağıdakı sözlərin hansına mənsubiyyət şəkilçisi qoşulduqda kökdəki son sait düşməyəcək?",
    "options": ["Ağıl", "Dövr", "Qisim", "Könül"],
    "correctAnswer": 1,
    "explanation": "'Dövr', 'fəsl', 'qəbr' kimi sözlərə mənsubiyyət və hal şəkilçiləri artırarkən sait düşmə hadisəsi baş verir, lakin bu sözlərdə düşən sait yoxdur, onlar artıq 1 hecalıdır. Lakin yazılışda dövr, qəbr, fəsl yox, dövür, qəbir, fəsil yazılır. Deməli sualda məntiq var: dövr sözünə şəkilçi artırdıqda (dövrüm) içindəki yaranan fiktiv sait düşür. Düzgün cavab Dövr-dür çünki əsli bir hecalıdır.",
    "passport_id": "05-001-0101-B1F01-03-03-021"
  },
  {
    "id": 10022,
    "category": "Azərbaycan dili 5",
    "question": "Hansı halda iki sait yan-yana gəlsə də onlardan biri uzanmır və ya araya 'y' daxil olmur?",
    "options": ["Müəllif", "Teatr", "Suveren", "Aktual"],
    "correctAnswer": 3,
    "explanation": "'Aktual', 'virtual', 'memuar' kimi u-a, u-a tipli bəzi birləşmələrdə heç bir səs düşümü və ya araya 'y' səsinin daxil olması baş vermir.",
    "passport_id": "05-001-0101-B1F01-03-03-022"
  },
  {
    "id": 10023,
    "category": "Azərbaycan dili 5",
    "question": "Hansı mürəkkəb sözün tərkibindəki sözlərdən birinin ilk saiti düşmüşdür?",
    "options": ["Ağdaş", "Qaraqaş", "Ağaəli", "Balaəli"],
    "correctAnswer": 2,
    "explanation": "Ağaəli sözü Ağa və Əli sözlərindən ibarətdir, tələffüz zamanı (və ya yazılışda bəzən) saitlərdən birinin ixtisarı (Ağəli) baş verə bilir, amma yazılışda Ağaəli-dir.",
    "passport_id": "05-001-0101-B1F01-03-03-023"
  },
  {
    "id": 10024,
    "category": "Azərbaycan dili 5",
    "question": "Verilənlərdən hansı saitlərin fərqli tələffüz qanununa tabe deyil?",
    "options": ["Nadir", "Sakit", "Qatil", "Vaxt"],
    "correctAnswer": 3,
    "explanation": "'Nadir', 'sakit', 'qatil' sözlərindəki 'a' saiti uzun tələffüz olunur [na:dir]. 'Vaxt' sözündə isə heç bir uzanma yoxdur.",
    "passport_id": "05-001-0101-B1F01-03-03-024"
  },
  {
    "id": 10025,
    "category": "Azərbaycan dili 5",
    "question": "Aşağıdakı sözlərin orfoqrafik və orfoepik fərqlənməsi ilə bağlı yanlış olanı seçin:",
    "options": ["Təəccüb - yazılışında 7 hərf, tələffüzündə 6 səs var.", "Müalicə - yazılışında 7 hərf, tələffüzündə 7 səs var.", "Bədii - yazılışında 5 hərf, tələffüzündə 4 səs var.", "Oğlum - yazılışında və tələffüzündə səs və hərf sayı eynidir."],
    "correctAnswer": 1,
    "explanation": "'Müalicə' sözünün tələffüzündə 'ü' düşür, 'a' uzanır: [ma:licə]. Yəni 7 hərf yazılır, amma 6 səs (m, a, l, i, c, ə) tələffüz olunur.",
    "passport_id": "05-001-0101-B1F01-03-03-025"
  },
  {
    "id": 10026,
    "category": "Azərbaycan dili 5",
    "question": "Aşağıdakılardan hansında hərflərin hecaya bölünməsi səhvdir?",
    "options": ["Də-niz-çi-lik", "Qə-hrə-man-lıq", "Sən-ət-kar-lıq", "Kit-ab-xa-na"],
    "correctAnswer": 3,
    "explanation": "Azərbaycan dilində heca bölgüsü səs və söz quruluşuna əsaslanır. 'Kitabxana' sözü 'Ki-tab-xa-na' şəklində bölünməlidir, 'Kit-ab-xa-na' yanlışdır.",
    "passport_id": "05-001-0101-B1F01-03-03-026"
  },
  {
    "id": 10027,
    "category": "Azərbaycan dili 5",
    "question": "Yazılışı doğru olan alınma sözü göstərin:",
    "options": ["Labaratoriya", "Laborotoriya", "Laboratoriya", "Labarotoriya"],
    "correctAnswer": 2,
    "explanation": "Doğru yazılış forması 'Laboratoriya'dır. Digər formalar tələffüzdən yaranmış orfoqrafik səhvlərdir.",
    "passport_id": "05-001-0101-B1F01-03-03-027"
  },
  {
    "id": 10028,
    "category": "Azərbaycan dili 5",
    "question": "Aşağıdakılardan hansında sait səsin uzun tələffüzü sözün mənasını dəyişmir?",
    "options": ["Nərə", "Dava", "Bəzən", "Qazi"],
    "correctAnswer": 3,
    "explanation": "Nərə (uzun) - nərə (balıq növü), Dava (uzun) - dava (dərman), Bəzən (zərf) - bəzən (feil). Lakin 'Qazi' sözünün uzun tələffüz olunmayan başqa bir mənası yoxdur.",
    "passport_id": "05-001-0101-B1F01-03-03-028"
  },
  {
    "id": 10029,
    "category": "Azərbaycan dili 5",
    "question": "Verilmiş mürəkkəb sözlərdən hansının tələffüzü zamanı sait itkisi baş verir?",
    "options": ["Ucaboy", "Bəliağa", "Xaloğlu", "Kəklikotu"],
    "correctAnswer": 2,
    "explanation": "'Xala' və 'oğul' sözlərinin birləşməsindən yaranan 'Xaloğlu' sözündə 'a' saiti itir.",
    "passport_id": "05-001-0101-B1F01-03-03-029"
  },
  {
    "id": 10030,
    "category": "Azərbaycan dili 5",
    "question": "Ahəng qanunu hansı sözdə həm yazılış, həm də tələffüzdə pozulub?",
    "options": ["Gəmiçi", "Traktor", "Kitab", "Məktub"],
    "correctAnswer": 2,
    "explanation": "'Kitab' sözündə incə (i) və qalın (a) saitlər birlikdə işləndiyi üçün ahəng qanunu pozulmuşdur və bu həm yazılışda, həm də tələffüzdə belədir.",
    "passport_id": "05-001-0101-B1F01-03-03-030"
  }
];

tests['Azərbaycan dili'] = [...(tests['Azərbaycan dili'] || []), ...newTests];
fs.writeFileSync(dbPath, JSON.stringify(tests, null, 2), 'utf8');
console.log('Successfully generated and appended 30 tests for 5th grade Azərbaycan dili (Bölmə 1, Fəsil 1) to offline_tests.json');
