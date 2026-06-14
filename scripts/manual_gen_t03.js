const fs = require('fs');

const tests = [
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-01",
    "question": "Səthlər bir-birinə toxunduqda meydana gələn və cismin hərəkətinin əksinə yönələn qüvvə necə adlanır?",
    "options": {"A": "Ağırlıq qüvvəsi", "B": "Sürtünmə qüvvəsi", "C": "Arximed qüvvəsi", "D": "Maqnit qüvvəsi"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Səthlər toxunduqda meydana gələn və hərəkətin əksinə yönələn qüvvə sürtünmə qüvvəsidir. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-02",
    "question": "Sürtünmə qüvvəsinin yaranmasına səbəb nədir?",
    "options": {"A": "Səthlərin çox isti olması", "B": "Cismin kütləsinin az olması", "C": "Səthlərin hamar olmaması (girintili-çıxıntılı olması)", "D": "Havanın olmaması"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Sürtünmə qüvvəsinin yaranmasının əsas səbəbi səthlərin hamar deyil, girintili-çıxıntılı olmasıdır. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-03",
    "question": "Sürtünmə qüvvəsi həmişə hansı istiqamətdə yönəlir?",
    "options": {"A": "Hərəkət istiqamətində", "B": "Yuxarıya doğru", "C": "Aşağıya doğru", "D": "Hərəkət istiqamətinin əksinə"},
    "answer": "D",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Sürtünmə qüvvəsi həmişə cismin hərəkət istiqamətinin əksinə yönəlir. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-04",
    "question": "Hava və ya su tərəfindən cismə təsir edən sürtünmə qüvvəsi necə adlanır?",
    "options": {"A": "Ağırlıq qüvvəsi", "B": "Müqavimət qüvvəsi", "C": "Cazibə qüvvəsi", "D": "Maqnit qüvvəsi"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Hava və ya su tərəfindən təsir edən sürtünmə qüvvəsi müqavimət qüvvəsi adlanır. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-05",
    "question": "Aşağıdakılardan hansı sürtünmə qüvvəsini azaltmaq üçün istifadə olunmur?",
    "options": {"A": "Zəncir bağlamaq", "B": "Səthləri yağlamaq", "C": "Konkiyə xüsusi yağ sürtmək", "D": "Göz yaşı ilə gözün nəmlənməsi"},
    "answer": "A",
    "difficulty": "sadə",
    "bloom": "anlama",
    "explanation": "Zəncir bağlamaq sürtünmə qüvvəsini artırmaq üçün istifadə edilir, digərləri isə azaltmaq üçündür. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-06",
    "question": "Buzlu yolda ayaqqabıların altının girintili-çıxıntılı hazırlanmasının məqsədi nədir?",
    "options": {"A": "Ayaqqabının daha yüngül olması üçün", "B": "Ayaqları isti saxlamaq üçün", "C": "Sürtünmə qüvvəsini artıraraq sürüşməmək üçün", "D": "Sürtünmə qüvvəsini azaldıb sürətli getmək üçün"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "anlama",
    "explanation": "Buzlu yolda sürüşməmək məqsədilə ayaqqabının altı girintili hazırlanır ki, sürtünmə artsın. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-07",
    "question": "Göz yaşı göz alması ilə göz qapağı arasında hansı funksiyanı yerinə yetirir?",
    "options": {"A": "Sürtünməni artırır", "B": "Nəmləndirici rolunu oynayaraq sürtünməni azaldır", "C": "Havanın müqavimətini artırır", "D": "Ağırlıq qüvvəsini azaldır"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "anlama",
    "explanation": "Göz yaşı göz alması və qapağı arasında nəmləndirici olaraq sürtünmə qüvvəsini azaldır. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-08",
    "question": "Nəyə görə taxta səthə yağ tökdükdən sonra fincanı hərəkətə gətirmək daha asan oldu?",
    "options": {"A": "Yağ səthdəki girinti-çıxıntıları dolduraraq sürtünməni azaltdığı üçün", "B": "Yağ fincanın kütləsini azaltdığı üçün", "C": "Yağ taxtanın ağırlıq qüvvəsini dəyişdiyi üçün", "D": "Fincan yağı emal etdiyi üçün"},
    "answer": "A",
    "difficulty": "orta",
    "bloom": "təhlil",
    "explanation": "Yağ səthdəki boşluqları doldurur, səthi hamarlaşdırır və beləliklə sürtünmə qüvvəsini azaldır. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-09",
    "question": "Eyni hündürlükdən buraxılan bükülmüş kağız ilə açıq kağızdan hansı yerə daha tez düşür və niyə?",
    "options": {"A": "Açıq kağız, çünki ağırlığı çoxdur", "B": "Bükülmüş kağız, çünki havanın müqaviməti ona daha az təsir edir", "C": "Hər ikisi eyni anda düşür", "D": "Açıq kağız, çünki sahəsi böyükdür"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Bükülmüş kağızın səthinin sahəsi kiçik olduğu üçün ona daha az hava müqaviməti təsir edir və yerə daha tez düşür. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-10",
    "question": "Aşağıdakı hansı halda cismə hava müqaviməti daha çox təsir edir?",
    "options": {"A": "Səthinin sahəsi böyük olduqda", "B": "Səthinin sahəsi kiçik olduqda", "C": "Kütləsi kiçik olduqda", "D": "Kütləsi böyük olduqda"},
    "answer": "A",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Səthinin sahəsi böyük olan cisimlərə havanın və ya suyun müqavimət qüvvəsi daha çox təsir edir. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-11",
    "question": "Gəmi və sualtı qayıqların dizaynında suda yaşayan canlıların bədən quruluşuna oxşar formalardan niyə istifadə olunur?",
    "options": {"A": "Onların çəkisini artırmaq üçün", "B": "Suyun müqavimət qüvvəsini artırmaq üçün", "C": "Suyun müqavimət qüvvəsini azaltmaq və sürətlə hərəkət etmək üçün", "D": "Dəniz canlılarını qorxutmamaq üçün"},
    "answer": "C",
    "difficulty": "orta",
    "bloom": "tətbiq",
    "explanation": "Suyun müqavimətini azaltmaq üçün canlıların aerodinamik/hidrodinamik formaları gəmilərə tətbiq edilir. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-12",
    "question": "Qarlı havada avtomobil təkərlərinə zəncir bağlanmasının səbəbini ən yaxşı hansı variant izah edir?",
    "options": {"A": "Təkərlərin donmasının qarşısını almaq üçün", "B": "Toxunan səthlərdə girinti-çıxıntını artırıb sürtünməni artırmaq üçün", "C": "Toxunan səthləri hamarlaşdırıb sürtünməni azaltmaq üçün", "D": "Hava müqavimətini azaltmaq üçün"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Zəncir təkərlə yol arasındakı girinti-çıxıntını artırır ki, sürtünmə artsın və avtomobil sürüşməsin. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-13",
    "question": "Niyə Qapı rəzəsi (məntəşəsi) xaricdən yağlandıqda qapı asan açılır?",
    "options": {"A": "Çünki yağ sürtünməni artırır", "B": "Çünki rəzədəki ağırlıq azalır", "C": "Çünki yağ toxunan səthlərin arasındakı boşluqları doldurur və səthi hamarlayaraq sürtünməni azaldır", "D": "Çünki yağ dəmiri qızdırır"},
    "answer": "C",
    "difficulty": "orta",
    "bloom": "tətbiq",
    "explanation": "Yağlama prosesi metallar arasındakı mikroskopik girinti-çıxıntıları doldurur və qapının asan açılmasını təmin edir. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-14",
    "question": "Cismi yerindən tərpətmək üçün 50 N qüvvə tətbiq edirik, lakin o hərəkət etmir. Bu halda aşağıdakılardan hansı doğrudur?",
    "options": {"A": "Ağırlıq qüvvəsi yoxdur", "B": "Tətbiq edilən qüvvə sürtünmə qüvvəsini üstələmir (sürtünmə 50 N-a bərabərdir)", "C": "Havanın müqaviməti sıfırdır", "D": "Cisim yağa bulanıb"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "təhlil",
    "explanation": "Cisim dartıldığı halda hərəkət etmirsə, tətbiq edilən qüvvəni tarazlaşdıran sükunət sürtünmə qüvvəsi var. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-15",
    "question": "Hansı halda həm havanın müqavimətini azaltmaq, həm də yerlə sürtünməni artırmaq tələb oluna bilər?",
    "options": {"A": "Kosmik gəmidə", "B": "Paraşütlə atlanarkən", "C": "Yarış avtomobilində (Formula 1)", "D": "Qayıqda"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Yarış avtomobilinin dizaynı hava müqavimətini azaltmaq (sürətli getmək üçün), ancaq təkərləri isə asfalta sürtünməni artırmaq (döngələrdə sürüşməmək üçün) üzrə qurulur. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-16",
    "question": "Müqavimət qüvvəsi ilə sürtünmə qüvvəsinin ortaq cəhəti nədir?",
    "options": {"A": "Hər ikisi cismin hərəkətini asanlaşdırır", "B": "Hər ikisi qravitasiya nəticəsində yaranır", "C": "Hər ikisi cismin hərəkət istiqamətinin əksinə yönələrək ona mane olur", "D": "Hər ikisi yalnız havada mövcuddur"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Müqavimət və bərk cisimlər arasındakı sürtünmə qüvvələri hərəkət istiqamətinə əks yönəlir və hərəkəti çətinləşdirir. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-17",
    "question": "İdmançının konki sürərkən asanlıqla hərəkət etməsini necə izah edərdiniz?",
    "options": {"A": "Konkinin səthi geniş olduğu üçün", "B": "Konkinin səthinə yağ sürtülərək sürtünmə azaldıldığı üçün", "C": "Konkidə olan girintilər buza daha yaxşı batdığı üçün", "D": "Buzda hava müqaviməti olmadığı üçün"},
    "answer": "B",
    "difficulty": "çətin",
    "bloom": "tətbiq",
    "explanation": "Konkilərə vurulan yağ və ya mum buzla arasındakı sürtünməni daha da azaldaraq idmançının asan sürüşməsini təmin edir. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-18",
    "question": "Aşağıdakılardan hansı sürtünmənin zərərli olduğu və azaldılmalı olduğu hala nümunədir?",
    "options": {"A": "Avtomobilin əyləci", "B": "Ayaqqabının altının rezin olması", "C": "Mühərrikdəki metal dişlilərin bir-birinə sürtülməsi", "D": "Tabaşirlə lövhədə yazmaq"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "qiymətləndirmə",
    "explanation": "Mühərrik parçalarının bir-birinə sürtünməsi aşınmaya və istiliyə səbəb olur, buna görə yağlanaraq azaldılmalıdır. Əyləc, ayaqqabı isə faydalı sürtünmədir. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-19",
    "question": "Meteoritlər Yer atmosferinə daxil olduqda nə üçün yanmağa başlayırlar?",
    "options": {"A": "Yerin ağırlıq qüvvəsi yüksək olduğu üçün", "B": "Havanın müqavimət (sürtünmə) qüvvəsi çox böyük miqdarda istilik ayırdığı üçün", "C": "Günəşin şüaları atmosferdə cəmləşdiyi üçün", "D": "Havanın olmaması səbəbindən"},
    "answer": "B",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Atmosfer qatındakı yüksək hava müqaviməti və sürtünmə nəticəsində meteoritlər qızır və yanırlar. Təkrar üçün: Dərslik səh. 12-15 (Müqavimət və sürtünmə bölməsi üzərindən məntiq)."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-20",
    "question": "Dinamometri taxta və şüşə səth üzərində dartdıqda hansı səthdə daha çox qüvvə sərf olunur və niyə?",
    "options": {"A": "Şüşə səthdə, çünki şüşə daha ağırdır", "B": "Taxta səthdə, çünki taxtanın səthi şüşəyə nisbətən daha girintili-çıxıntılıdır", "C": "Şüşə səthdə, çünki şəffafdır", "D": "Hər ikisində eynidir"},
    "answer": "B",
    "difficulty": "çətin",
    "bloom": "tətbiq",
    "explanation": "Taxta şüşəyə nisbətən daha kələ-kötürdür (girintili-çıxıntılı), bu da daha çox sürtünmə qüvvəsi yaradır. Təkrar üçün: Dərslik səh. 12-15."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Sürtünmə qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "12-15",
    "passport": "06-003-H1-T03-21",
    "question": "Paraşütçünün yerə sağ-salamat enməsini hansı qüvvə təmin edir?",
    "options": {"A": "Yalnız cazibə qüvvəsi", "B": "Havanın müqavimət qüvvəsi", "C": "Yerin fırlanma qüvvəsi", "D": "Maqnit qüvvəsi"},
    "answer": "B",
    "difficulty": "çətin",
    "bloom": "anlama",
    "explanation": "Paraşütün böyük səthi havanın müqavimət qüvvəsini artırır və beləliklə düşmə sürətini azaldır. Təkrar üçün: Dərslik səh. 12-15."
  }
];

fs.mkdirSync('data/tebiet6_prompts/generated', { recursive: true });
fs.writeFileSync('data/tebiet6_prompts/generated/tebiet-6-h1-t03.json', JSON.stringify(tests, null, 2));

let offline = [];
if (fs.existsSync('data/offline_tests.json')) {
  try { 
      const parsed = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8')); 
      if (Array.isArray(parsed)) offline = parsed;
  } catch(e){}
}
offline.push(...tests);
fs.writeFileSync('data/offline_tests.json', JSON.stringify(offline, null, 2));

let md = `\n## Mövzu: Sürtünmə qüvvəsi\n\n`;
tests.forEach(t => {
  md += `**Sual (${t.passport}):** ${t.question}\n`;
  md += `- A) ${t.options.A}\n`;
  md += `- B) ${t.options.B}\n`;
  md += `- C) ${t.options.C}\n`;
  md += `- D) ${t.options.D}\n`;
  md += `**Doğru Cavab:** ${t.answer}\n`;
  md += `**Çətinlik:** ${t.difficulty} | **Bloom:** ${t.bloom}\n`;
  md += `**İzahat:** ${t.explanation}\n\n`;
});

const deskDir = 'C:\\Users\\User\\OneDrive\\Desktop\\6-cı sinif testləri';
if (!fs.existsSync(deskDir)) fs.mkdirSync(deskDir, {recursive: true});
fs.appendFileSync(deskDir + '\\Təbiət_6_testləri_Fesil1.md', md);

let q = JSON.parse(fs.readFileSync('data/test_generation_queue_tebiet6.json', 'utf8'));
const idx = q.findIndex(x => x.topic_id === 'tebiet-6-h1-t03');
if(idx > -1) {
  q[idx].status = 'done';
  q[idx].generated_count = tests.length;
}
fs.writeFileSync('data/test_generation_queue_tebiet6.json', JSON.stringify(q, null, 2));

console.log('T03 generated successfully.');
