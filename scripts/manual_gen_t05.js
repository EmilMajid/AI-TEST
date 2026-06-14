const fs = require('fs');

const tests = [
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-01",
    "question": "Cismə tətbiq olunan qüvvələrin ədədi qiymətləri bərabər, istiqamətləri isə əks olarsa, bu qüvvələr necə adlanır?",
    "options": {"A": "Sürtünmə qüvvələri", "B": "Tarazlaşan qüvvələr", "C": "Tarazlaşmayan qüvvələr", "D": "Cazibə qüvvələri"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Qiymətləri bərabər, istiqamətləri əks olan qüvvələr bir-birini tarazlaşdırdığı üçün tarazlaşan qüvvələr adlanır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-02",
    "question": "Hərəkətsiz cismə tarazlaşan qüvvələr təsir etdikdə o necə davranır?",
    "options": {"A": "Sürəti artır", "B": "Sürəti azalır", "C": "Hərəkətə başlayır", "D": "Əvvəlki hərəkətsiz vəziyyətində qalır"},
    "answer": "D",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Tarazlaşan qüvvələr cismin hərəkət vəziyyətini dəyişmir, ona görə də hərəkətsiz cisim əvvəlki vəziyyətində qalır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-03",
    "question": "Rəfdəki kitaba aşağı doğru təsir edən ağırlıq qüvvəsini yuxarı doğru hansı qüvvə tarazlaşdırır?",
    "options": {"A": "Arximed qüvvəsi", "B": "Sürtünmə qüvvəsi", "C": "Dayağın reaksiya qüvvəsi", "D": "Havanın müqavimət qüvvəsi"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Rəfdəki kitabı yerə düşməkdən qoruyan və ağırlıq qüvvəsini tarazlaşdıran qüvvə dayağın reaksiya qüvvəsidir. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-04",
    "question": "Tarazlaşan qüvvələr hərəkət edən cismə təsir etdikdə onun sürətində hansı dəyişiklik baş verir?",
    "options": {"A": "Sürəti sürətlə artır", "B": "Sürəti yavaş-yavaş azalır", "C": "Sürəti sıfıra düşür", "D": "Sürəti nə artır, nə də azalır (dəyişmir)"},
    "answer": "D",
    "difficulty": "sadə",
    "bloom": "anlama",
    "explanation": "Tarazlaşan qüvvələr hərəkət vəziyyətini dəyişmədiyi üçün hərəkət edən cismin sürəti sabit qalır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-05",
    "question": "Cismə tətbiq olunan iki əks qüvvənin qiymətləri fərqli olarsa, bu qüvvələr necə adlanır?",
    "options": {"A": "Tarazlaşan", "B": "Tarazlaşmayan", "C": "Ekvivalent", "D": "Neytral"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Ədədi qiymətləri fərqli olan qüvvələr bir-birini tarazlaşdıra bilmir və tarazlaşmayan qüvvələr adlanır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-06",
    "question": "İpçəkmə yarışında sağ komanda 100 N, sol komanda isə 100 N qüvvə tətbiq edərsə, ip necə hərəkət edər?",
    "options": {"A": "Sağa doğru", "B": "Sola doğru", "C": "Hərəkət etməz", "D": "Yuxarıya doğru"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "anlama",
    "explanation": "Hər iki qüvvə 100 N olmaqla bərabər və əks istiqamətdə olduğu üçün tarazlaşırlar və ip hərəkət etmir. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-07",
    "question": "Suyun səthində asılı qalıb üzən (batmayan) gəmidə hansı iki qüvvə bir-birini tarazlaşdırır?",
    "options": {"A": "Sürtünmə və hava müqaviməti", "B": "Ağırlıq və Arximed qüvvələri", "C": "Maqnit və elektrik qüvvələri", "D": "Ağırlıq və sürtünmə qüvvələri"},
    "answer": "B",
    "difficulty": "sadə",
    "bloom": "anlama",
    "explanation": "Gəmini aşağı çəkən ağırlıq qüvvəsi suyun onu yuxarı itələyən Arximed qüvvəsi ilə tarazlaşdığı üçün batmır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-08",
    "question": "Hərəkətsiz olan cismə tarazlaşmayan qüvvələr təsir etdikdə nə baş verir?",
    "options": {"A": "Hərəkətsiz qalmağa davam edir", "B": "Parçalanır", "C": "Hərəkətə başlayır və sürəti artır", "D": "Daha da ağırlaşır"},
    "answer": "C",
    "difficulty": "sadə",
    "bloom": "bilik",
    "explanation": "Tarazlaşmayan qüvvələr nəticəsində əvəzləyici qüvvə sıfırdan fərqli olur, buna görə cisim hərəkətə gəlir və sürəti artır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-09",
    "question": "İpçəkmə yarışında sağ komanda 120 N, sol komanda isə 90 N qüvvə tətbiq edir. Nəticədə nə baş verəcək?",
    "options": {"A": "İp sağa doğru hərəkət edəcək", "B": "İp sola doğru hərəkət edəcək", "C": "İp qopacaq", "D": "İp yerində qalacaq"},
    "answer": "A",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Tarazlaşmayan qüvvələrin təsiri altında cisim qiyməti böyük olan qüvvə istiqamətində (yəni sağa) hərəkət edir. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-10",
    "question": "Hərəkətdə olan oyuncaq maşına hərəkət istiqamətində 15 N, hərəkətin əksi istiqamətində isə 5 N qüvvə təsir edir. Maşının sürəti necə dəyişəcək?",
    "options": {"A": "Azalacaq", "B": "Dəyişməyəcək", "C": "Artacaq", "D": "Sıfır olacaq"},
    "answer": "C",
    "difficulty": "orta",
    "bloom": "tətbiq",
    "explanation": "Hərəkət istiqamətindəki qüvvə (15 N) əks qüvvədən (5 N) böyük olduğu üçün tarazlaşmayan əvəzləyici qüvvə maşını sürətləndirəcək. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-11",
    "question": "Hərəkətdə olan cismə təsir edən tarazlaşmayan qüvvələrdə əks istiqamətdəki qüvvə daha böyük olarsa, cismin sürəti necə dəyişər?",
    "options": {"A": "Artar", "B": "Dəyişməz", "C": "Azalar", "D": "Birdən-birə ikiqat artar"},
    "answer": "C",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Hərəkətin əksi istiqamətində təsir edən qüvvə böyük olarsa, maşının sürəti azalar. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-12",
    "question": "Stəkanın içinə atılan metal kürə niyə suyun dibinə batır?",
    "options": {"A": "Cazibə qüvvəsi yoxdur", "B": "Ağırlıq qüvvəsi Arximed qüvvəsindən böyük olduğu üçün (tarazlaşmayan qüvvələr)", "C": "Sürtünmə qüvvəsi çox olduğuna görə", "D": "Metal kürənin kütləsi sıfırdır"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "təhlil",
    "explanation": "Metal kürəyə təsir edən ağırlıq qüvvəsi onu yuxarı itələyən Arximed qüvvəsindən böyükdür (qüvvələr tarazlaşmır), buna görə kürə batır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-13",
    "question": "Masanın üzərində hərəkətsiz dayanan vazaya hansı qüvvələr təsir edir və onlar hansı vəziyyətdədir?",
    "options": {"A": "Yalnız ağırlıq qüvvəsi", "B": "Ağırlıq və Arximed qüvvələri; onlar tarazlaşmır", "C": "Ağırlıq və dayağın reaksiya qüvvəsi; onlar bir-birini tarazlaşdırır", "D": "Sürtünmə və hava müqaviməti; onlar tarazlaşır"},
    "answer": "C",
    "difficulty": "orta",
    "bloom": "anlama",
    "explanation": "Hərəkətsiz qalan cisimlər üçün aşağı çəkən ağırlıqla yuxarı itələyən (dayağın) reaksiya qüvvəsi bir-birini tarazlaşdırır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-14",
    "question": "Avtomobil düz yolda daimi olaraq 80 km/saat sürətlə hərəkət edir. Bu halda avtomobilə təsir edən qüvvələr haqqında nə demək olar?",
    "options": {"A": "Tarazlaşmayan qüvvələrin təsiri altındadır", "B": "Mühərrikin qüvvəsi sürtünmədən böyükdür", "C": "Təsir edən bütün qüvvələr bir-birini tarazlaşdırır", "D": "Sürtünmə qüvvəsi mühərrikin qüvvəsindən çoxdur"},
    "answer": "C",
    "difficulty": "orta",
    "bloom": "tətbiq",
    "explanation": "Sürətin dəyişməməsi (sabit qalması) o deməkdir ki, avtomobilə təsir edən qüvvələr (irəli itələyən və geri çəkən sürtünmə) bir-birini tarazlaşdırır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-15",
    "question": "Nicat və Nigar eyni markalı alış-veriş arabasını yan-yana duraraq hərəsi 30 N qüvvə ilə irəli itələyirlər. Əgər arabanın təkərlərindəki sürtünmə cəmi 40 N-dursa, araba necə hərəkət edər?",
    "options": {"A": "Sürətlənərək irəli hərəkət edər", "B": "Hərəkətsiz qalar", "C": "Sabit sürətlə irəli gedər", "D": "Geri hərəkət edər"},
    "answer": "A",
    "difficulty": "çətin",
    "bloom": "tətbiq",
    "explanation": "İrəli yönələn ümumi qüvvə 30+30=60 N. Sürtünmə 40 N-dur. İrəli qüvvə böyük olduğu üçün tarazlaşmayan qüvvə (20 N) yaranır və araba sürətlənir. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-16",
    "question": "Bir cismə şimal istiqamətində 40 N, cənub istiqamətində isə 40 N qüvvə təsir edir. Cisim hərəkətdə idisə (məsələn, şimala doğru 5 m/s), onun sonrakı hərəkəti necə olacaq?",
    "options": {"A": "Dərhal dayanacaq", "B": "Şimala doğru 5 m/s sürətlə bərabər hərəkətini davam etdirəcək", "C": "Şimala doğru sürətlənəcək", "D": "Cənuba doğru hərəkətə başlayacaq"},
    "answer": "B",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Qüvvələr bərabər və əks olduğundan tarazlaşır. Tarazlaşan qüvvələr cismin mövcud hərəkət vəziyyətini (sürətini) dəyişdirmir, beləliklə o eyni sürətlə hərəkətə davam edir. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-17",
    "question": "Arximed qüvvəsi və ağırlıq qüvvəsinin ədədi qiymətləri bərabər olan cisim suyun daxilində sərbəst buraxılarsa, nə müşahidə olunar?",
    "options": {"A": "Su üzünə qalxar", "B": "Suyun dibinə çökər", "C": "Olduğu yerdə (su daxilində) hərəkətsiz qalar", "D": "Parçalanar"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Hər iki qüvvə eyni ölçüdə (tarazlaşan) və əks istiqamətli olduğu üçün əvəzləyici qüvvə sıfır olur və cisim hərəkətsiz asılı qalır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-18",
    "question": "Səmaya qalxan raketi sürətləndirən nədir?",
    "options": {"A": "Ağırlıq qüvvəsinin sıfıra bərabər olması", "B": "Raketin mühərrik qüvvəsinin ağırlıq qüvvəsini tarazlaşdırması", "C": "Raketin mühərrikinin yuxarı itələmə qüvvəsinin ağırlıq qüvvəsindən daha böyük olması (tarazlaşmayan qüvvələr)", "D": "Raketin kütləsinin artması"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "qiymətləndirmə",
    "explanation": "Sürətlənərək yuxarı qalxması üçün yuxarı yönəlmiş qüvvə (mühərrik) aşağı yönəlmiş qüvvədən (ağırlıq) mütləq böyük olmalıdır ki, tarazlaşmayan qüvvə yaransın. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-19",
    "question": "Qravitasiyadan və hər hansı başqa qüvvələrdən kənar kosmik fəzada düzxətli hərəkət edən cismin sürətini artırmaq üçün nə etmək lazımdır?",
    "options": {"A": "Cismi öz halına buraxmaq", "B": "Hərəkət istiqamətində tarazlaşmayan qüvvə tətbiq etmək", "C": "Hərəkətin əksi istiqamətində qüvvə tətbiq etmək", "D": "Tarazlaşan iki qüvvə tətbiq etmək"},
    "answer": "B",
    "difficulty": "çətin",
    "bloom": "tətbiq",
    "explanation": "Sürəti dəyişdirmək (artırmaq) üçün həmişə mövcud hərəkət istiqamətində yönəlmiş tarazlaşmayan qüvvə lazımdır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-20",
    "question": "Paraşütçü tullanıb çətirini açdıqdan bir müddət sonra sabit sürətlə yerə enməyə başlayır. Bu zaman paraşütçüyə təsir edən qüvvələr hansı vəziyyətdə olur?",
    "options": {"A": "Ağırlıq qüvvəsi hava müqavimətindən çoxdur", "B": "Hava müqaviməti ağırlıq qüvvəsindən çoxdur", "C": "Hava müqaviməti ağırlıq qüvvəsini tarazlaşdırır", "D": "Cazibə qüvvəsi sıfır olur"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Sabit sürət varsa, demək, cismin sürətini dəyişdirən qüvvə yoxdur. Aşağı çəkən ağırlıq və yuxarı itələyən hava müqaviməti tarazlaşmışdır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-21",
    "question": "Cismin hərəkətinin dəyişməsi (sürətlənməsi, yavaşlaması) nəyin nəticəsidir?",
    "options": {"A": "Həmişə tarazlaşan qüvvələrin", "B": "Tarazlaşmayan qüvvələrin (qüvvələrin əvəzləyicisinin sıfırdan fərqli olmasının)", "C": "Sürtünmənin heç olmamasının", "D": "Cismin kütləsinin çox böyük olmasının"},
    "answer": "B",
    "difficulty": "çətin",
    "bloom": "anlama",
    "explanation": "Hərəkətin xarakterinin dəyişməsi (yəni sürətin artması və ya azalması) həmişə tarazlaşmayan qüvvələrin təsiri ilə baş verir. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-22",
    "question": "Dinamometrlərlə təcrübə zamanı A və B dinamometrləri fərqli qüvvələr göstərirsə, ortadakı dəftər hansı istiqamətə və necə hərəkət edər?",
    "options": {"A": "Daha az qüvvə tətbiq edilən tərəfə yavaşca", "B": "Böyük qüvvə göstərən dinamometr tərəfə sürətlənərək", "C": "Hərəkətsiz qalar", "D": "Mərkəzə doğru"},
    "answer": "B",
    "difficulty": "orta",
    "bloom": "tətbiq",
    "explanation": "Qüvvələr fərqli olduqda əşya böyük qüvvənin təsiri istiqamətində hərəkətə başlayır və sürətlənir. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-23",
    "question": "Bərabərsürətli hərəkət nədir və hansı qüvvələrin nəticəsidir?",
    "options": {"A": "Sürətin davamlı artmasıdır; tarazlaşmayan qüvvələrin", "B": "Sürətin davamlı azalmasıdır; ağırlıq qüvvəsinin", "C": "Sürətin dəyişməməsidir; tarazlaşan qüvvələrin", "D": "Cismin yerində qalmasıdır; cazibənin"},
    "answer": "C",
    "difficulty": "çətin",
    "bloom": "təhlil",
    "explanation": "Tarazlaşan qüvvələr cismin hərəkətini dəyişməz saxlayır (bərabərsürətli), yəni sürəti artmır və azalmır. Təkrar üçün: Dərslik səh. 18-23."
  },
  {
    "grade": 6,
    "subject": "Təbiət",
    "topic": "Tarazlaşan və tarazlaşmayan qüvvələr",
    "book_id": "tebiet-6-h1",
    "pages": "18-23",
    "passport": "06-003-H1-T05-24",
    "question": "Təyyarə uçuş zolağında sürətini artıraraq havaya qalxmağa hazırlaşır. Bu zaman ona təsir edən irəli itələmə (mühərrik) və hava müqaviməti/sürtünmə qüvvələri arasındakı əlaqə necədir?",
    "options": {"A": "Mühərrik qüvvəsi > sürtünmə və müqavimət (tarazlaşmayan)", "B": "Mühərrik qüvvəsi = sürtünmə və müqavimət (tarazlaşan)", "C": "Mühərrik qüvvəsi < sürtünmə və müqavimət", "D": "Ağırlıq qüvvəsi yoxa çıxır"},
    "answer": "A",
    "difficulty": "çətin",
    "bloom": "tətbiq",
    "explanation": "Sürəti artırmaq (sürətlənmək) üçün irəliyə doğru olan qüvvə geri çəkən qüvvədən çox olmalıdır (tarazlaşmayan qüvvələr). Təkrar üçün: Dərslik səh. 18-23."
  }
];

fs.mkdirSync('data/tebiet6_prompts/generated', { recursive: true });
fs.writeFileSync('data/tebiet6_prompts/generated/tebiet-6-h1-t05.json', JSON.stringify(tests, null, 2));

let offline = [];
if (fs.existsSync('data/offline_tests.json')) {
  try { 
      const parsed = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8')); 
      if (Array.isArray(parsed)) offline = parsed;
  } catch(e){}
}
offline.push(...tests);
fs.writeFileSync('data/offline_tests.json', JSON.stringify(offline, null, 2));

let md = `\n## Mövzu: Tarazlaşan və tarazlaşmayan qüvvələr\n\n`;
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
const idx = q.findIndex(x => x.topic_id === 'tebiet-6-h1-t05');
if(idx > -1) {
  q[idx].status = 'done';
  q[idx].generated_count = tests.length;
}
fs.writeFileSync('data/test_generation_queue_tebiet6.json', JSON.stringify(q, null, 2));

console.log('T05 generated successfully.');
