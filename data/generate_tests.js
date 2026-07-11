const fs = require('fs');

const rawData = [
  {
    topic: "Giriş",
    cat: "Zəfər tarixi 9",
    questions: [
      {
        q: "\"Zəfər tarixi\" fənninin öyrənilməsinin əsas məqsədi nədir?",
        o: ["Vətən müharibəsinin və qələbənin əhəmiyyətini aşılamaq", "Keçmiş sivilizasiyaları öyrənmək", "Antik dövr tariximizi təhlil etmək", "Bütün dünya müharibələrini incələmək", "Təbiət elmlərini inkişaf etdirmək"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "İkinci Qarabağ müharibəsi hansı adla tarixə düşmüşdür?",
        o: ["Vətən müharibəsi", "Çanaqqala savaşı", "Səfəvi-Osmanlı müharibəsi", "Aprel döyüşləri", "Birinci Cahan müharibəsi"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Vətən müharibəsi neçə gün davam etmişdir?",
        o: ["44", "40", "50", "30", "45"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "44 günlük Vətən müharibəsi hansı il və ayda başlamışdır?",
        o: ["2020-ci il 27 sentyabr", "2020-ci il 27 oktyabr", "2016-cı il 2 aprel", "2020-ci il 10 noyabr", "2018-ci il 28 may"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Azərbaycanın ərazi bütövlüyünün bərpası ilə nəticələnən müharibə necə adlanır?",
        o: ["İkinci Qarabağ müharibəsi", "Birinci Qarabağ müharibəsi", "Krım müharibəsi", "Aprel döyüşləri", "Toxmaq döyüşü"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Vətən müharibəsində əldə edilən zəfər kimin rəhbərliyi ilə qazanılmışdır?",
        o: ["Ali Baş Komandan İlham Əliyev", "Şah İsmayıl Xətai", "Heydər Əliyev", "Nəsib bəy Yusifbəyli", "Fətəli xan Xoyski"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Azərbaycan ordusu 44 günlük müharibədə hansı növ müasir hərbi texnologiyalardan geniş istifadə etmişdir?",
        o: ["Pilotsuz uçuş aparatlarından (PUA)", "Sualtı qayıqlardan", "Kosmik gəmilərdən", "Yalnız piyada qüvvələrindən", "Hava şarlarından"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "Zəfər günü Azərbaycanda hansı tarixdə qeyd edilir?",
        o: ["8 noyabr", "27 sentyabr", "10 noyabr", "28 may", "18 oktyabr"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "\"Dəmir yumruq\" əməliyyatı hansı məqsədlə həyata keçirilmişdir?",
        o: ["İşğal altında olan Azərbaycan torpaqlarını azad etmək", "Sərhədləri qorumaq", "Yeni torpaqlar fəth etmək", "Başqa ölkəyə hücum etmək", "Hərbi təlimlər keçirmək"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "Vətən müharibəsi zamanı xalqımızın nümayiş etdirdiyi əsas keyfiyyət nə idi?",
        o: ["Milli birlik və həmrəylik", "Laqeydlik", "Təfriqə", "Səbirsizlik", "Sülhsevərlik"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "\"Zəfər tarixi\" fənninin 9-cu sinifdə tədris edilməsinin gənclər üçün əhəmiyyəti nədir?",
        o: ["Vətənpərvərlik ruhunun yüksəldilməsi", "Qədim dillərin öyrənilməsi", "Xarici ölkələrin tarixinin mənimsənilməsi", "Riyazi biliklərin artırılması", "İqtisadi nəzəriyyələrin öyrənilməsi"],
        bl: "təhlil", diff: "çətin"
      }
    ]
  },
  {
    topic: "§9 Mədəniyyətimizin incisi - Şuşa",
    cat: "Zəfər tarixi 9",
    questions: [
      {
        q: "Şuşa şəhəri nə zaman işğaldan azad edilmişdir?",
        o: ["8 noyabr 2020-ci il", "27 sentyabr 2020-ci il", "10 noyabr 2020-ci il", "9 noyabr 2020-ci il", "20 noyabr 2020-ci il"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Şuşa şəhəri Azərbaycan mədəniyyətində necə tanınır?",
        o: ["Mədəniyyət paytaxtı və musiqi beşiyi kimi", "Yalnız sənaye mərkəzi kimi", "Qədim kənd təsərrüfatı diyarı kimi", "Dəniz limanı kimi", "Dini mərkəz kimi"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "Şuşanın azad edilməsi əməliyyatının unikallığı nədə idi?",
        o: ["Ordumuzun sıldırım qayalara dırmaşaraq yüngül silahlarla şəhərə daxil olmasında", "Ağır artilleriya və tankların köməyilə tam dağıdılaraq alınmasında", "Hərbi aviasiya vasitəsilə havadan desant endirilməsində", "Şəhərin aylarla mühasirədə saxlanılaraq təslim edilməsində", "Sualtı qayıqlardan istifadə olunmasında"],
        bl: "təhlil", diff: "çətin"
      },
      {
        q: "Şuşanın təməli kim tərəfindən qoyulmuşdur?",
        o: ["Pənahəli xan", "İbrahimxəlil xan", "Nadir şah", "Şah Abbas", "Ağa Məhəmməd şah Qacar"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "\"Şuşa bəyannaməsi\" hansı iki dövlət arasında imzalanmışdır?",
        o: ["Azərbaycan və Türkiyə", "Azərbaycan və Rusiya", "Azərbaycan və Pakistan", "Azərbaycan və Gürcüstan", "Türkiyə və Rusiya"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "Şuşa şəhəri həm də hansı tarixi şəxsiyyətlərin vətəni sayılır?",
        o: ["Üzeyir Hacıbəyli, Bülbül, Xan Şuşinski", "Nizami Gəncəvi, Məhsəti Gəncəvi", "Mirzə Fətəli Axundzadə, Həsən bəy Zərdabi", "Şah İsmayıl Xətai, Məhəmməd Füzuli", "Nəsimi, Tusi"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "Şuşanın azad edilməsi tarixi İkinci Qarabağ müharibəsində hansı gün kimi qeyd olunur?",
        o: ["Zəfər Günü", "Silahlı Qüvvələr Günü", "Müstəqillik Günü", "Milli Qurtuluş Günü", "Anım Günü"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Şuşa hansı regionun tacı və ya mirvarisi adlandırılır?",
        o: ["Qarabağın", "Naxçıvanın", "Şirvanın", "Lənkəranın", "Qubanın"],
        bl: "anlama", diff: "asan"
      },
      {
        q: "İşğaldan azad edildikdən sonra Şuşada keçirilən ən mühüm mədəni tədbirlərdən biri hansıdır?",
        o: ["\"Xarıbülbül\" musiqi festivalı", "\"Eurovision\" mahnı müsabiqəsi", "\"Gənclik\" teatr festivalı", "Qış Olimpiya oyunları", "Beynəlxalq Kino Festivalı"],
        bl: "xatırlama", diff: "orta"
      }
    ]
  },
  {
    topic: "Birinci Qarabağ müharibəsi",
    cat: "Zəfər tarixi 9",
    questions: [
      {
        q: "Birinci Qarabağ müharibəsi təxminən hansı illəri əhatə edir?",
        o: ["1988-1994", "1990-1995", "1991-1993", "1985-1990", "2016-2020"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "Birinci Qarabağ müharibəsi zamanı Azərbaycan torpaqlarının təxminən neçə faizi işğal olunmuşdu?",
        o: ["20 faizi", "10 faizi", "30 faizi", "40 faizi", "15 faizi"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Xocalı soyqırımı Birinci Qarabağ müharibəsi dövründə hansı tarixdə baş vermişdir?",
        o: ["1992-ci il fevralın 25-dən 26-na keçən gecə", "1990-cı il 20 yanvar", "1993-cü il 23 iyul", "1994-ci il 12 may", "1991-ci il 18 oktyabr"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Birinci Qarabağ müharibəsində Ermənistanın əsas məqsədi nə idi?",
        o: ["Dağlıq Qarabağı və ətraf rayonları işğal edərək Ermənistana birləşdirmək", "Yalnız mədəni muxtariyyət əldə etmək", "İqtisadi əməkdaşlıq qurmaq", "Siyasi ittifaq yaratmaq", "Xəzər dənizinə çıxış əldə etmək"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "Birinci Qarabağ müharibəsində azərbaycanlıların doğma yurdlarından qovulması hansı terminlə ifadə olunur?",
        o: ["Etnik təmizləmə və deportasiya", "Könüllü köç", "İqtisadi miqrasiya", "Urbanizasiya", "Assimilyasiya"],
        bl: "anlama", diff: "orta"
      }
    ]
  },
  {
    topic: "Atəşkəs",
    cat: "Zəfər tarixi 9",
    questions: [
      {
        q: "Birinci Qarabağ müharibəsində atəşkəs barədə \"Bişkek protokolu\" hansı ildə imzalanmışdır?",
        o: ["1994-cü il", "1992-ci il", "1993-cü il", "1995-ci il", "1991-ci il"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "Atəşkəs dövründə münaqişənin dinc yolla həlli üçün hansı beynəlxalq qurum vasitəçilik edirdi?",
        o: ["ATƏT-in Minsk qrupu", "BMT-nin Təhlükəsizlik Şurası", "Avropa İttifaqı", "NATO", "İslam Əməkdaşlıq Təşkilatı"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "1994-cü ildən 2020-ci ilə qədər davam edən dövr Azərbaycan tarixində necə adlanır?",
        o: ["Atəşkəs dövrü", "İkinci Qarabağ müharibəsi", "Qızıl dövr", "Sülh dövrü", "İnqilablar dövrü"],
        bl: "anlama", diff: "asan"
      },
      {
        q: "Atəşkəs rejiminin Ermənistan tərəfindən kobud şəkildə pozulması ilə 2016-cı ildə baş verən hərbi toqquşma necə adlanır?",
        o: ["Aprel döyüşləri", "Tovuz döyüşləri", "Daşaltı əməliyyatı", "Horadiz əməliyyatı", "Gəncə qiyamı"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "1994-cü ildə atəşkəsin əldə edilməsi Azərbaycana hansı imkanı verdi?",
        o: ["Dövlət quruculuğunu və ordunu inkişaf etdirmək, iqtisadiyyatı dirçəltmək", "Müharibəni dərhal bərpa etmək", "Torpaqların rəsmən verilməsi", "Yalnız xarici siyasətdən təcrid olunmaq", "Mədəniyyəti dondurmaq"],
        bl: "təhlil", diff: "çətin"
      },
      {
        q: "Atəşkəs dövründə Azərbaycanın xarici siyasətində əsas hədəf nə idi?",
        o: ["Münaqişənin ərazi bütövlüyü çərçivəsində dinc yolla həlli", "Müstəqillikdən imtina", "Yeni torpaqlar ələ keçirmək", "Hərbi ittifaqlara qoşulmamaq", "İqtisadi əlaqələri tam kəsmək"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "2020-ci ilin iyul ayında atəşkəsin pozulması nəticəsində hansı istiqamətdə şiddətli döyüşlər baş verdi?",
        o: ["Tovuz istiqamətində", "Cəbrayıl istiqamətində", "Qubadlı istiqamətində", "Naxçıvan istiqamətində", "Lənkəran istiqamətində"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "ATƏT-in Minsk qrupunun həmsədr ölkələri hansılar idi?",
        o: ["ABŞ, Rusiya, Fransa", "Türkiyə, Rusiya, İran", "İngiltərə, Almaniya, İtaliya", "Çin, ABŞ, Rusiya", "Fransa, Almaniya, İspaniya"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "Atəşkəs müqaviləsindən sonra Ermənistanın destruktiv mövqeyi nəyə səbəb oldu?",
        o: ["Sülh danışıqlarının uzanmasına və nəticəsiz qalmasına", "Qısa zamanda sülh müqaviləsinin imzalanmasına", "Torpaqların könüllü qaytarılmasına", "Regionda iqtisadi inkişafın sürətlənməsinə", "Azərbaycanla sıx əməkdaşlığa"],
        bl: "təhlil", diff: "çətin"
      },
      {
        q: "Atəşkəs rejimi Ermənistan tərəfindən pozularkən Azərbaycan ordusunun cavab tədbirləri necə adlandırılırdı?",
        o: ["Düşmənin atəş nöqtələrinin susdurulması, adekvat cavab", "Sükutun qorunması", "Geri çəkilmə", "Təslim olma", "Yalnız diplomatik nota vermə"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "Atəşkəs dövründə (1994-2020) Azərbaycanda ordu quruculuğunda hansı addımlar atıldı?",
        o: ["Ordu ən müasir silahlarla təchiz edildi, hərbi təlimlər gücləndirildi", "Ordu tamamilə ləğv edildi", "Yalnız xarici hərbçilər cəlb edildi", "Köhnə sovet texnikası ilə kifayətlənildi", "Hərbi büdcə azaldıldı"],
        bl: "anlama", diff: "orta"
      }
    ]
  },
  {
    topic: "Ermənistan-Azərbaycan münaqişəsi beynəlxalq müzakirələrdə",
    cat: "Zəfər tarixi 9",
    questions: [
      {
        q: "BMT Təhlükəsizlik Şurası Ermənistan silahlı qüvvələrinin işğal olunmuş Azərbaycan ərazilərindən çıxarılması ilə bağlı neçə qətnamə qəbul etmişdir?",
        o: ["4 qətnamə", "2 qətnamə", "5 qətnamə", "1 qətnamə", "Heç bir qətnamə qəbul etməyib"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "BMT-nin qəbul etdiyi qətnamələrdə əsas tələb nə idi?",
        o: ["İşğalçı qüvvələrin Azərbaycan ərazilərindən dərhal, qeyd-şərtsiz və tam çıxarılması", "Qarabağa müstəqillik verilməsi", "Azərbaycanın ərazini güzəştə getməsi", "Bölgədə xarici hərbi bazaların qurulması", "Sərhədlərin yenidən cızılması"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "Avropa Şurası Parlament Assambleyası (AŞPA) tərəfindən Ermənistanın işğalçı siyasətini pisləyən sənədlər qəbul edilmişdirmi?",
        o: ["Bəli, dəfələrlə müvafiq qətnamə və sənədlər qəbul edilmişdir", "Xeyr, heç bir sənəd qəbul olunmamışdır", "AŞPA yalnız iqtisadi məsələləri müzakirə edib", "AŞPA Ermənistanın mövqeyini dəstəkləyib", "Yalnız bir dəfə xəbərdarlıq edilib"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "İslam Əməkdaşlıq Təşkilatı (İƏT) Ermənistan-Azərbaycan münaqişəsində hansı mövqeni tutmuşdur?",
        o: ["Azərbaycanın ərazi bütövlüyünü birmənalı olaraq dəstəkləmişdir", "Neytral mövqe tutmuşdur", "Ermənistanı dəstəkləmişdir", "Münaqişəni tanımamışdır", "Yalnız iqtisadi embarqo tətbiq etmişdir"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "Beynəlxalq hüquqa əsasən, Dağlıq Qarabağ və ətraf rayonlar kimin ərazisi olaraq tanınır?",
        o: ["Azərbaycan Respublikasının", "Ermənistan Respublikasının", "Müstəqil dövlət", "Rusiya Federasiyasının", "Beynəlxalq idarəetmə zonası"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Nə üçün beynəlxalq təşkilatların qəbul etdiyi qətnamələr uzun illər icra olunmurdu?",
        o: ["Ermənistanın destruktiv siyasəti və beynəlxalq birliyin ikili standartları səbəbindən", "Azərbaycanın bu qətnamələri qəbul etməməsi səbəbindən", "Qətnamələrin hüquqi qüvvəsinin olmaması səbəbindən", "Qətnamələrdə konkret vaxtın göstərilməməsi səbəbindən", "BMT-nin ləğv edilməsi səbəbindən"],
        bl: "təhlil", diff: "çətin"
      },
      {
        q: "Azərbaycan diplomatik müstəvidə nəyi sübut etməyə çalışırdı?",
        o: ["Münaqişənin yalnız Azərbaycanın ərazi bütövlüyü çərçivəsində həll edilməli olduğunu", "Müharibənin tək çıxış yolu olmasını", "Torpaqların Ermənistana satılmasını", "Ərazilərin beynəlxalq icarəyə verilməsini", "Sülhün qeyri-mümkünlüyünü"],
        bl: "anlama", diff: "orta"
      }
    ]
  },
  {
    topic: "Böyük zəfərə doğru",
    cat: "Zəfər tarixi 9",
    questions: [
      {
        q: "\"Böyük zəfərə doğru\" gedən yolda həlledici dönüş nöqtəsi hansı hadisə oldu?",
        o: ["2020-ci il sentyabrın 27-də başlayan əks-hücum əməliyyatları (\"Dəmir yumruq\")", "1994-cü il Bişkek protokolu", "2001-ci il Key-Uest danışıqları", "1992-ci il Xocalı faciəsi", "2010-cu il Həştərxan bəyannaməsi"],
        bl: "təhlil", diff: "çətin"
      }
    ]
  },
  {
    topic: "§7 Qəhrəmanlar unudulmur",
    cat: "Zəfər tarixi 9",
    questions: [
      {
        q: "Vətən müharibəsində şəhid olmuş hərbçilərimizin xatirəsini əbədiləşdirmək üçün Azərbaycanda hansı gün təsis edilmişdir?",
        o: ["27 sentyabr - Anım Günü", "8 noyabr - Zəfər Günü", "20 yanvar - Ümumxalq Hüzn Günü", "26 fevral - Xocalı Soyqırımı Günü", "31 mart - Azərbaycanlıların Soyqırımı Günü"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Şəhidlərin ailə üzvlərinə və qazilərə dövlət dəstəyini təmin etmək məqsədilə hansı fond yaradılmışdır?",
        o: ["\"YAŞAT\" Fondu", "Heydər Əliyev Fondu", "Qarabağ Dirçəliş Fondu", "Neft Fondu", "Gənclər Fondu"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "İkinci Qarabağ müharibəsində böyük şücaət göstərmiş hərbçilərə verilən ən ali fəxri ad hansıdır?",
        o: ["Vətən Müharibəsi Qəhrəmanı", "Milli Qəhrəman", "Əmək Qəhrəmanı", "Şöhrət ordeni", "İstiqlal ordeni"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "Milli Qəhrəman Polad Həşimov hansı döyüşlərdə qəhrəmancasına şəhid olmuşdur?",
        o: ["2020-ci il iyul ayında Tovuz döyüşlərində", "2016-cı il Aprel döyüşlərində", "2020-ci il Vətən müharibəsində Şuşa uğrunda", "1992-ci il Xocalı müdafiəsində", "2020-ci il Hadrut döyüşlərində"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "Vətən müharibəsi şəhidlərinin əziz xatirəsi hər il sentyabrın 27-də saat neçədə bir dəqiqəlik sükutla yad edilir?",
        o: ["Saat 12:00-da", "Saat 10:00-da", "Saat 14:00-da", "Saat 18:00-da", "Saat 09:00-da"],
        bl: "xatırlama", diff: "orta"
      },
      {
        q: "Azərbaycan xalqı Vətən müharibəsi şəhidlərini hansı gülün simvolunda yad edir?",
        o: ["Xarıbülbül", "Qızılgül", "Nərgiz", "Qərənfil", "Lalə"],
        bl: "xatırlama", diff: "asan"
      },
      {
        q: "Qəhrəmanların xatirəsini yaşatmaq üçün dövlət tərəfindən hansı tədbirlər görülür?",
        o: ["Küçələrə, məktəblərə onların adları verilir, xatirə lövhələri və abidələr ucaldılır", "Yalnız ildə bir dəfə adları çəkilir", "Xatirələri məxfi saxlanılır", "Yalnız muzeylərdə guşələr yaradılır, digər yerlərdə adları qeyd edilmir", "Hər hansı xüsusi tədbir görülmür"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "Şuşanın işğaldan azad edilməsi uğrunda gedən döyüşlərdə qəhrəmanlıq göstərən Azərbaycan xüsusi təyinatlılarının ən çox fərqlənən cəhəti nə idi?",
        o: ["Əlbəyaxa və yaxın məsafədən döyüşlərdə yüksək peşəkarlıq və qorxmazlıq", "Yalnız uzaqmənzilli raketlərdən istifadə", "Müttəfiq ölkələrin əsgərlərinin onlara qoşulması", "Kütləvi qırğın silahlarından istifadə", "Havadan ağır bombardmançılarla hücum"],
        bl: "təhlil", diff: "çətin"
      },
      {
        q: "Qazilərə və şəhid ailələrinə cəmiyyətin münasibəti necə xarakterizə olunur?",
        o: ["Dərin ehtiram, sevgi və hərtərəfli qayğı", "Yalnız rəsmi dövlət səviyyəsində münasibət", "Laqeydlik", "Unudulma", "Təcrid olunma"],
        bl: "anlama", diff: "asan"
      },
      {
        q: "Aprel döyüşlərində (2016) qəhrəmanlıq göstərərək Lələtəpə yüksəkliyinin azad olunmasında iştirak edən, Vətən müharibəsində isə şəhidlik zirvəsinə ucalan hərbçilərimiz necə xatırlanır?",
        o: ["Hər iki döyüşün qəhrəmanları kimi ehtiramla yad edilirlər", "Yalnız Aprel döyüşlərinin qəhrəmanları kimi", "Unudulmuş qəhrəmanlar kimi", "Sadəcə vəzifələrini yerinə yetirənlər kimi", "Tarix kitablarında xatırlanmırlar"],
        bl: "anlama", diff: "orta"
      },
      {
        q: "\"Qarabağ Azərbaycandır!\" şüarı kim tərəfindən səsləndirilmiş və xalqın qələbə inamının simvoluna çevrilmişdir?",
        o: ["Ali Baş Komandan İlham Əliyev", "Heydər Əliyev", "Xarici jurnalistlər", "Tarixçilər", "BMT Baş Katibi"],
        bl: "xatırlama", diff: "asan"
      }
    ]
  }
];

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

const outTests = [];
const letters = ["A", "B", "C", "D", "E"];

rawData.forEach(group => {
  group.questions.forEach(qData => {
    // Original correct answer is always at index 0
    const correctText = qData.o[0];
    
    // Shuffle options
    const shuffledOptions = shuffle([...qData.o]);
    
    // Find correct answer letter
    const correctIndex = shuffledOptions.indexOf(correctText);
    const correctAnswerLetter = letters[correctIndex];
    
    const optionsObj = {};
    letters.forEach((l, i) => {
      optionsObj[l] = shuffledOptions[i];
    });

    outTests.push({
      question: qData.q,
      options: optionsObj,
      correctAnswer: correctAnswerLetter,
      explanation: "Sualın doğru cavabı dərslik və tarixi faktlara əsasən müəyyən edilmişdir.",
      difficulty: qData.diff,
      bloom_level: qData.bl,
      topic: group.topic,
      cat: group.cat
    });
  });
});

fs.writeFileSync('C:\\Users\\User\\Downloads\\azerbaijanaiplatform\\data\\gen_missing_9_zefer_tarixi.json', JSON.stringify(outTests, null, 2), 'utf8');
console.log(`Generated ${outTests.length} tests and saved successfully.`);
