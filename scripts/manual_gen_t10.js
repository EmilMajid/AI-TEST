const fs = require('fs');

const tests = [
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-01",
    "question": "Nəfəs aldığımız zaman diafraqma necə hərəkət edir?",
    "options": {"A": "Yuxarıya doğru hərəkət edir", "B": "Yastılaşır", "C": "Daralır", "D": "Genişlənir"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Nəfəs aldığımız zaman diafraqma yastılaşır və döş qəfəsi genişlənir ki, hava ağciyərlərə daxil ola bilsin. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-02",
    "question": "Burnumuzla nəfəs aldığımız hava ilk olaraq hansı boruya keçir?",
    "options": {"A": "Bronxiollara", "B": "Alveollara", "C": "Nəfəs borusuna (traxeyaya)", "D": "Aortaya"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Nəfəs aldığımız hava ilk növbədə nəfəs borusuna (traxeyaya) daxil olur. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-03",
    "question": "Traxeyadan ayrılan iki şaxə necə adlanır?",
    "options": {"A": "Bronxlar", "B": "Alveollar", "C": "Venalar", "D": "Qulaqcıqlar"},
    "answer": "A",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Nəfəs borusundan (traxeyadan) sağ və sol ağciyərlərə gedən iki şaxə bronxlar adlanır. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-04",
    "question": "Ağciyərlərin içindəki nazik divarlı kiçik qovuqcuqlar nə adlanır?",
    "options": {"A": "Bronxlar", "B": "Traxeya", "C": "Alveollar", "D": "Mədəciklər"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Bronxiolların uclarında olan nazik divarlı qovuqcuqlara alveollar deyilir. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-05",
    "question": "Qazlar mübadiləsi zamanı qandan alveollara hansı qaz keçir?",
    "options": {"A": "Oksigen", "B": "Karbon qazı", "C": "Azot", "D": "Hemoqlobin"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Qazlar mübadiləsində oksigen alveollardan qana, karbon qazı isə qandan alveollara keçir. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-06",
    "question": "Alveolların səthini hansı növ qan damarları örtür?",
    "options": {"A": "Qalın arteriyalar", "B": "Böyük venalar", "C": "Sıx kapilyar toru", "D": "Aorta"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Hər bir alveol sıx kapilyar toru ilə örtülmüşdür ki, qazlar mübadiləsi asanlıqla baş verə bilsin. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-07",
    "question": "Sakit halda ortayaşlı sağlam insanda tənəffüsün sayı təqribən nə qədərdir?",
    "options": {"A": "60-100 dəqiqədə", "B": "16-20 dəqiqədə", "C": "1-5 dəqiqədə", "D": "120-150 dəqiqədə"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Sakit halda ortayaşlı sağlam insanlarda tənəffüsün sayı dəqiqədə 16-20 dəfədir. Təkrar üçün: Dərslik 'Öyrəndiklərinizi tətbiq edin' hissəsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-08",
    "question": "İdman edərkən (qaçarkən) nəbz və tənəffüs tezliyində hansı dəyişiklik baş verir?",
    "options": {"A": "Hər ikisi azalır", "B": "Nəbz azalır, tənəffüs artır", "C": "Hər ikisi artır (sürətlənir)", "D": "Dəyişmir"},
    "answer": "C",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "İdman zamanı əzələlərin oksigenə tələbatı artdığı üçün həm tənəffüs tezliyi, həm də ürək döyüntüsü (nəbz) artır. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-09",
    "question": "Alveolların ümumi səthinin çox böyük (bədən səthindən təxminən 40 dəfə böyük) olmasının orqanizmə faydası nədir?",
    "options": {"A": "Ağciyərlərin həcmini kiçiltmək", "B": "Daha çox oksigen və karbon qazı mübadiləsini eyni vaxtda sürətlə həyata keçirmək", "C": "Qan damarlarını azaltmaq", "D": "Sümükləri möhkəmləndirmək"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Səth sahəsinin böyük olması (təqribən 70 kv metr) daha çox kapilyarla təmas yaradır və beləliklə qazlar mübadiləsini çox səmərəli edir. Təkrar üçün: Dərslik 'Bilirsinizmi?' hissəsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-10",
    "question": "Nəfəs verdikdə diafraqma yuxarıya doğru hərəkət edir. Bu zaman ağciyərlərdə nə baş verir?",
    "options": {"A": "Ağciyərlər genişlənir və hava daxil olur", "B": "Ağciyərlər kiçilir və hava (karbon qazlı) xaricə qovulur", "C": "Ağciyərlər fəaliyyətini dayandırır", "D": "Alveollar yox olur"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Nəfəsvermə zamanı diafraqma yuxarı qalxaraq döş qəfəsinin həcmini kiçildir, ağciyərlər sıxılır və havanı bayıra qovur. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-11",
    "question": "Nəfəs aldığımız havada oksigenin miqdarı 21%, karbon qazı isə çox azdır (0.04%). Nəfəs verdiyimiz havada oksigenin və karbon qazının nisbəti necə dəyişir?",
    "options": {"A": "Oksigen çoxalır, karbon qazı azalır", "B": "Hər ikisi çoxalır", "C": "Oksigen 21%-dən aşağı düşür, karbon qazı isə artır", "D": "Dəyişiklik olmur"},
    "answer": "C",
    "difficulty": "orta",
    "bloom": "təhlil",
    "explanation": "Bədən oksigenin bir hissəsini mənimsəyir və tullantı olan karbon qazını xaric edir. Buna görə də xaric edilən havada oksigen azalır, karbon qazı artır. Təkrar üçün: Dərslik 'Öyrəndiklərinizi tətbiq edin' hissəsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-12",
    "question": "Hüceyrələr oksigen və qida maddələrindən istifadə edərək enerji əldə etdikdə son parçalanma məhsulu kimi nə əmələ gəlir?",
    "options": {"A": "Oksigen", "B": "Karbon qazı", "C": "Alveol", "D": "Bronx"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "bilik",
    "explanation": "Hüceyrələrdə qida maddələri oksigen vasitəsilə parçalandıqda enerji ilə yanaşı karbon qazı tullantısı yaranır. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-13",
    "question": "Havanın ağciyərlərə daxil olma ardıcıllığını doğru seçin:",
    "options": {"A": "Burn -> Traxeya -> Bronxlar -> Bronxiollar -> Alveollar", "B": "Burn -> Alveollar -> Bronxlar -> Traxeya", "C": "Alveollar -> Bronxiollar -> Bronxlar -> Traxeya", "D": "Traxeya -> Burn -> Bronxlar -> Alveollar"},
    "answer": "A",
    "difficulty": "orta",
    "bloom": "tətbiq",
    "explanation": "Hava burun, nəfəs borusu (traxeya), bronxlar, bronxiollar və nəhayət alveollara keçir. Təkrar üçün: Dərslik 'Öyrəndiklərinizi yoxlayın' hissəsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-14",
    "question": "Ağciyərlər hansı iki sistem arasında mühüm körpü rolunu oynayır?",
    "options": {"A": "Həzm və sümük", "B": "Tənəffüs və qan dövranı", "C": "Əzələ və sinir", "D": "Qan dövranı və həzm"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "təhlil",
    "explanation": "Ağciyərlər (tənəffüs sistemi) qana (qan dövranı sisteminə) oksigen verir və ondan karbon qazını alır, yəni bu iki sistem arasında körpüdür. Təkrar üçün: Dərslik 'Düşün, Müzakirə et' hissəsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-15",
    "question": "Ümumiləşdirici tapşırıqlardakı qrafikə əsasən, əgər insanın ürək döyüntüsünün sayı qəfildən 140-a qalxıbsa və bir neçə dəqiqə yüksək qalıbsa, bu hansı fəaliyyət ola bilər?",
    "options": {"A": "Yatmaq", "B": "Kitab oxumaq", "C": "Qaçış", "D": "Oturmaq"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "tətbiq",
    "explanation": "Ürək döyüntüsünün və tənəffüsün kəskin artması idman (qaçış) kimi fiziki aktivliklər zamanı baş verir. Təkrar üçün: Dərslik 'Ümumiləşdirici tapşırıqlar' hissəsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-16",
    "question": "Qəfil yüksək səsdən qorxma zamanı ürək döyüntüsünün qrafiki necə görünəcək?",
    "options": {"A": "Yavaş-yavaş artacaq", "B": "Dəyişməz qalacaq", "C": "Qəfil, anidən çox yüksələcək (pik edəcək) və tez bir zamanda da aşağı düşəcək", "D": "Sıfıra düşəcək"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Qorxu anında adrenalin ifrazı nəbzi ani olaraq sıçradır, lakin qaçışdan fərqli olaraq qısa müddət sonra bərpa olunur. Təkrar üçün: Dərslik 'Ümumiləşdirici tapşırıqlar' hissəsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-17",
    "question": "Əgər idmandan sonra istirahət etsəniz, təqribən 10 dəqiqə sonra nəbziniz və tənəffüsünüz necə olar?",
    "options": {"A": "Daha da sürətlənər", "B": "Məşqdən əvvəlki (sakitlik) halına qayıdar", "C": "Dayanar", "D": "Bədən hərarəti maksimuma çatar"},
    "answer": "B",
    "difficulty": "çətin",
    "bloom": "anlama",
    "explanation": "Məşq bitdikdən bir müddət sonra bədənin əlavə oksigenə ehtiyacı azalır və göstəricilər əvvəlki (norma) vəziyyətinə qayıdır. Təkrar üçün: Dərslik 'Fəaliyyət' hissəsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-18",
    "question": "Alveollarda və hüceyrələrdə qazlar mübadiləsi zamanı qanın tərkibində dəyişən (azalıb çoxalan) əsas hissəcik və ya zülal nədir?",
    "options": {"A": "Ağ qan hüceyrələri", "B": "Qan lövhəcikləri", "C": "Hemoqlobin (oksigenlə birləşən)", "D": "Plazmanın suyu"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Qazlar mübadiləsi zamanı hemoqlobin oksigeni özünə birləşdirir (ağciyərdə) və ya hüceyrələrdə onu təhvil verib karbon qazının mənimsənilməsində rol oynayır. Təkrar üçün: Dərslik 'Qanın tərkibi və Tənəffüs' mövzularının əlaqəsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-19",
    "question": "Karbon qazının orqanizmdən xaric olması üçün keçdiyi yolların düzgün ardıcıllığı hansıdır?",
    "options": {"A": "Hüceyrə -> Kapilyar qan -> Alveol -> Bronxiol -> Bronx -> Traxeya -> Burun", "B": "Burun -> Traxeya -> Alveol -> Hüceyrə", "C": "Alveol -> Qan -> Hüceyrə", "D": "Ürək -> Traxeya -> Mədə"},
    "answer": "A",
    "difficulty": "çətin",
    "bloom": "tətbiq",
    "explanation": "Karbon qazı hüceyrədən qana keçir, qan onu ağciyərlərə (alveollara) gətirir. Sonra alveoldan geriyə (tənəffüs yolları ilə) xaric olur. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-20",
    "question": "Ağciyərlərdən və bütün digər orqanlardan qayıdan qan (Bölmə 2-nin ümumiləşdirici tapşırığına əsasən) ürəyin hansı şöbələrinə tökülür?",
    "options": {"A": "Mədəciklərə", "B": "Aortaya", "C": "Qulaqcıqlara", "D": "Kapilyarlara"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Ağciyərlərdən (oksigenli qan) və bədəndən (karbon qazlı qan) ürəyə qayıdan qan həmişə əvvəlcə ürəyin yuxarı şöbələrinə (qulaqcıqlara) tökülür. Təkrar üçün: Dərslik 'Ümumiləşdirici tapşırıqlar' hissəsi."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Ağciyərlərdə qazlar mübadiləsi",
    "book_id": "tebiet-6-h1",
    "pages": "N/A",
    "passport": "06-003-H1-T10-21",
    "question": "Qan dövranı sistemi ilə tənəffüs sistemi arasındakı ortaq və ən sıx əlaqə hansı mikroskopik strukturların ətrafında baş verir?",
    "options": {"A": "Traxeyanın", "B": "Mədəciklərin", "C": "Qan kapilyarları ilə alveolların təmas səthində", "D": "Dərinin səthində"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Hər iki sistemin fəaliyyətinin kəsişmə nöqtəsi alveollar və onları sıx örtən kapilyar şəbəkəsidir ki, burada qazlar mübadiləsi gedir. Təkrar üçün: Dərslik 'Ağciyərlərdə qazlar mübadiləsi' bölməsi."
  }
];

fs.mkdirSync('data/tebiet6_prompts/generated', { recursive: true });
fs.writeFileSync('data/tebiet6_prompts/generated/tebiet-6-h1-t10.json', JSON.stringify(tests, null, 2));

let offline = [];
if (fs.existsSync('data/offline_tests.json')) {
  try { 
      const parsed = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8')); 
      if (Array.isArray(parsed)) offline = parsed;
  } catch(e){}
}
offline.push(...tests);
fs.writeFileSync('data/offline_tests.json', JSON.stringify(offline, null, 2));

let md = '\\n## Mövzu: Ağciyərlərdə qazlar mübadiləsi\\n\\n';
tests.forEach(t => {
  md += '**Sual (' + t.passport + '):** ' + t.question + '\\n';
  md += '- A) ' + t.options.A + '\\n';
  md += '- B) ' + t.options.B + '\\n';
  md += '- C) ' + t.options.C + '\\n';
  md += '- D) ' + t.options.D + '\\n';
  md += '**Doğru Cavab:** ' + t.answer + '\\n';
  md += '**Çətinlik:** ' + t.difficulty + ' | **Bloom:** ' + t.bloom + '\\n';
  md += '**İzahat:** ' + t.explanation + '\\n\\n';
});

const deskDir = 'C:\\\\Users\\\\User\\\\OneDrive\\\\Desktop\\\\6-cı sinif testləri';
if (!fs.existsSync(deskDir)) fs.mkdirSync(deskDir, {recursive: true});
fs.appendFileSync(deskDir + '\\\\Təbiət_6_testləri_Fesil2.md', md);

let q = JSON.parse(fs.readFileSync('data/test_generation_queue_tebiet6.json', 'utf8'));
const idx = q.findIndex(x => x.topic_id === 'tebiet-6-h1-t10');
if(idx > -1) {
  q[idx].status = 'done';
  q[idx].generated_count = tests.length;
}
fs.writeFileSync('data/test_generation_queue_tebiet6.json', JSON.stringify(q, null, 2));

console.log('T10 generated successfully.');
