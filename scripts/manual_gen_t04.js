const fs = require('fs');

const tests = [
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-01",
    "question": "Mayeyə batırılmış cismi maye tərəfindən yuxarı itələyən qüvvə necə adlanır?",
    "options": {"A": "Ağırlıq qüvvəsi", "B": "Sürtünmə qüvvəsi", "C": "Arximed qüvvəsi", "D": "Cazibə qüvvəsi"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Mayeyə batırılan cisimləri maye tərəfindən itələyən qüvvə yunan aliminin şərəfinə Arximed qüvvəsi adlanır. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-02",
    "question": "Arximed qüvvəsi hansı istiqamətdə yönəlir?",
    "options": {"A": "Aşağıya (Yerin mərkəzinə doğru)", "B": "Ağırlıq qüvvəsinin əksinə (yuxarıya doğru)", "C": "Sağa və ya sola", "D": "Suyun axını istiqamətində"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Arximed qüvvəsi həmişə cismə təsir edən ağırlıq qüvvəsinin əksinə, yəni yuxarıya doğru yönəlir. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-03",
    "question": "Arximed qüvvəsinin yaranması hansı mühitlə bağlıdır?",
    "options": {"A": "Yalnız bərk cisimlərlə", "B": "Maqnit sahəsi ilə", "C": "Maye və ya qaz mühiti ilə (mətndə əsasən maye/su qeyd olunur)", "D": "Kosmik boşluqla"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Arximed qüvvəsi mayeyə (və qaza) batırılan cisimlərə həmin mühit tərəfindən göstərilən itələmə qüvvəsidir. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-04",
    "question": "Topu suya tam batırdıqda niyə onu suyun içində saxlamaq çətinləşir?",
    "options": {"A": "Çünki topun kütləsi artır", "B": "Çünki su tərəfindən göstərilən Arximed (itələmə) qüvvəsi artır", "C": "Çünki top daha da kiçilir", "D": "Çünki suyun temperaturu artır"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "anlama",
    "explanation": "Topun suya batan hissəsi artdıqca onu yuxarı itələyən Arximed qüvvəsi də artır. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-05",
    "question": "Cismin mayeyə batan hissəsinin həcmi artdıqca Arximed qüvvəsi necə dəyişir?",
    "options": {"A": "Dəyişmir", "B": "Azalır", "C": "Artır", "D": "Sıfıra bərabər olur"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Dərslikdə qeyd edildiyi kimi, Arximed qüvvəsi cismin mayeyə batan hissəsinin həcmi artdıqca artır. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-06",
    "question": "Bu qüvvə hansı alimin şərəfinə adlandırılmışdır?",
    "options": {"A": "İsaak Nyuton", "B": "Albert Eynşteyn", "C": "Qalileo Qaliley", "D": "Arximed"},
    "answer": "D",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Mayenin itələmə qüvvəsi yunan alimi Arximedin şərəfinə adlandırılmışdır. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-07",
    "question": "Tonlarla kütləsi olan nəhəng gəminin suda batmamasının səbəbi nədir?",
    "options": {"A": "Gəminin yüngül metallardan hazırlanması", "B": "Su tərəfindən gəmiyə təsir edən Arximed (itələmə) qüvvəsi", "C": "Gəminin mühərrikinin çox güclü olması", "D": "Dəniz suyunun çox duzlu olması"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Nəhəng gəminin batmamasına səbəb suyun onu yuxarıya doğru itələyən Arximed qüvvəsidir. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-08",
    "question": "Dinamometrdən asılmış metal cismi suya batırdıqda dinamometrin göstəricisi niyə azalır?",
    "options": {"A": "Cisim suda əriyir", "B": "Su cismi yuxarı doğru itələyərək (Arximed qüvvəsi) çəkisini yüngülləşdirir", "C": "Cismin kütləsi azalır", "D": "Dinamometr suda düzgün işləmir"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "təhlil",
    "explanation": "Metal suya batdıqda su tərəfindən yuxarıya itələnir (Arximed qüvvəsi). Buna görə cismi dartan qüvvə azalır və dinamometrin göstəricisi kiçilir. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-09",
    "question": "Əgər top suyun yarısına qədər batıbsa və sonra tam batırılırsa, Arximed qüvvəsi necə dəyişər?",
    "options": {"A": "İki dəfə azalar", "B": "Dəyişməz", "C": "Artar", "D": "Sıfır olar"},
    "answer": "C",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Arximed qüvvəsi cismin mayeyə batan həcmi ilə düz mütənasib olaraq artır. Cismi tam batırdıqda batan həcm artdığı üçün qüvvə də artır. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-10",
    "question": "Top suya batırıldıqda ona aşağıya doğru hansı qüvvə təsir edir?",
    "options": {"A": "Arximed qüvvəsi", "B": "Sürtünmə qüvvəsi", "C": "Ağırlıq qüvvəsi", "D": "Elastiklik qüvvəsi"},
    "answer": "C",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Arximed qüvvəsi yuxarıya yönəlir. Aşağıya doğru (Yerin mərkəzinə) yönələn isə həmişəki kimi ağırlıq qüvvəsidir. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-11",
    "question": "Nəyə görə Nicat topu suya tam batırıb əlindən buraxdıqda top yuxarı sıçrayır?",
    "options": {"A": "Çünki topun kütləsi sudan çoxdur", "B": "Çünki topa təsir edən Arximed qüvvəsi ağırlıq qüvvəsindən böyükdür", "C": "Çünki havada topa cazibə təsir etmir", "D": "Çünki suyun səthi düz deyil"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "təhlil",
    "explanation": "Əlimizi çəkdikdə yuxarı itələyən qüvvə (Arximed) aşağı dartan qüvvədən (Ağırlıq) böyük olduğu üçün top səthə çıxır. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-12",
    "question": "Akvaryumda hərəkətsiz qalan (üzməyən) balığa hansı qüvvələr təsir edir?",
    "options": {"A": "Yalnız ağırlıq qüvvəsi", "B": "Ağırlıq qüvvəsi və Arximed qüvvəsi", "C": "Ağırlıq, Arximed və suyun müqavimət qüvvəsi", "D": "Yalnız Arximed qüvvəsi"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Balıq hərəkət etmirsə, ona suyun müqaviməti (sürtünmə) təsir etmir. Ona yalnız aşağı dartan ağırlıq və yuxarı itələyən Arximed qüvvəsi təsir edir. Təkrar üçün: Dərslik səh. 16-17 (Venn diaqramı tapşırığı)."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-13",
    "question": "Suda üzən və irəliləyən balığa hansı əlavə qüvvə təsir etməyə başlayır?",
    "options": {"A": "Maqnit qüvvəsi", "B": "Elastiklik qüvvəsi", "C": "Suyun müqavimət qüvvəsi", "D": "Cazibə qüvvəsi yox olur"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "tətbiq",
    "explanation": "Balıq hərəkət etməyə başladıqda ona əlavə olaraq hərəkətin əksinə yönələn suyun müqavimət (sürtünmə) qüvvəsi də təsir etməyə başlayır. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-14",
    "question": "Həcmləri müxtəlif olan (kiçik, orta, böyük) üç top tamamilə suya batırılır. Hansı topa təsir edən Arximed qüvvəsi ən böyükdür?",
    "options": {"A": "Kiçik topa", "B": "Orta topa", "C": "Ən böyük həcmli topa", "D": "Hər üçünə eyni qüvvə təsir edir"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Arximed qüvvəsi cismin mayeyə batan hissəsinin həcmi artdıqca artır. Buna görə ən böyük həcmli top ən çox itələmə qüvvəsinə məruz qalır. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-15",
    "question": "Gəmidəki yükləri boşaltdıqdan sonra gəminin sudakı vəziyyəti və ona təsir edən Arximed qüvvəsi necə dəyişir?",
    "options": {"A": "Gəmi daha çox suya batır, Arximed qüvvəsi artır", "B": "Gəmi yüngülləşib yuxarı qalxır (batan həcmi azalır), Arximed qüvvəsi azalır", "C": "Arximed qüvvəsi gəminin kütləsindən asılı deyil deyə dəyişmir", "D": "Gəmi tamamilə batır"},
    "answer": "B",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Yüklər boşaldıldıqda ağırlıq azalır, gəmi suyun səthinə doğru qalxır. Batan hissənin həcmi azaldığı üçün Arximed qüvvəsi də azalır və yeni tarazlıq yaranır. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-16",
    "question": "Əgər suyun itələmə qüvvəsi cismə təsir edən ağırlıq qüvvəsinə bərabərdirsə, cisim mayedə necə davranar?",
    "options": {"A": "Tamamilə suyun dibinə batar", "B": "Sürətlə yuxarı sıçrayar", "C": "Mayenin daxilində qaldığı yerdə asılı qalar (tarazlıqda olar)", "D": "Cisim həcmini itirər"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "tətbiq",
    "explanation": "İki əks qüvvə (Arximed və ağırlıq) bərabər olduqda cisim olduğu yerdə asılı qalıb hərəkətsiz üzə bilər. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-17",
    "question": "Suyun səthində üzən topu əlimizlə suya doğru sıxıb tam batırsaq, əlimizə təsir edən müqaviməti hiss edərik. Səbəbi nədir?",
    "options": {"A": "Top suya batdıqca Arximed qüvvəsi azalır", "B": "Top suya batdıqca Arximed qüvvəsi artır və əlimizi yuxarı itələyir", "C": "Suyun istiliyi artır", "D": "Top suyun ağırlıq qüvvəsini artırır"},
    "answer": "B",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Batan həcm artdıqca (tam batana qədər) Arximed qüvvəsi də böyüyür və bu, bizim əlimizə yuxarıya doğru bir təzyiq kimi hiss olunur. Təkrar üçün: Dərslik səh. 16-17."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Arximed qüvvəsi",
    "book_id": "tebiet-6-h1",
    "pages": "16-17",
    "passport": "06-003-H1-T04-18",
    "question": "Topun hansı vəziyyətində ona təsir edən Arximed qüvvəsi ən azdır?",
    "options": {"A": "Tam batdıqda", "B": "Yarısına qədər batdıqda", "C": "Çox kiçik bir hissəsi suya dəydikdə (suyun səthində olduqda)", "D": "Suya batırılmaq üçün əlimizdə saxladıqda (suya toxunmadıqda)"},
    "answer": "D",
    "difficulty": "çətin",
    "bloom": "qiymətləndirmə",
    "explanation": "Əgər suya batan hissə yoxdursa və ya çox kiçikdirsə, Arximed qüvvəsi də çox az (və ya yox) olur. Suala cavab olaraq \"ən az batan vəziyyəti\" axtarılır. Təkrar üçün: Dərslik səh. 16-17."
  }
];

fs.mkdirSync('data/tebiet6_prompts/generated', { recursive: true });
fs.writeFileSync('data/tebiet6_prompts/generated/tebiet-6-h1-t04.json', JSON.stringify(tests, null, 2));

let offline = [];
if (fs.existsSync('data/offline_tests.json')) {
  try { 
      const parsed = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8')); 
      if (Array.isArray(parsed)) offline = parsed;
  } catch(e){}
}
offline.push(...tests);
fs.writeFileSync('data/offline_tests.json', JSON.stringify(offline, null, 2));

let md = `\n## Mövzu: Arximed qüvvəsi\n\n`;
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
const idx = q.findIndex(x => x.topic_id === 'tebiet-6-h1-t04');
if(idx > -1) {
  q[idx].status = 'done';
  q[idx].generated_count = tests.length;
}
fs.writeFileSync('data/test_generation_queue_tebiet6.json', JSON.stringify(q, null, 2));

console.log('T04 generated successfully.');
