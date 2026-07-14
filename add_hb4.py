import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

tests = [
    {
        "topic": "I BÖLMƏ. CANLI HƏYAT",
        "question": "Hansı orqanımız qanı bütün bədənimizə vuraraq qan dövranını təmin edir?",
        "options": ["Ürək", "Ağciyər", "Mədə", "Qaraciyər"],
        "correctAnswer": 0,
        "explanation": "Ürək əzələli orqan olub, nasos kimi fəaliyyət göstərərək qanı damarlarla bütün bədənə qovur.",
        "difficulty": "asan"
    },
    {
        "topic": "I BÖLMƏ. CANLI HƏYAT",
        "question": "Bitkilər qidalanma prosesi zamanı havaya hansı qazı xaric edərək onu təmizləyir və bizim nəfəs almağımızı təmin edir?",
        "options": ["Karbon qazı", "Azot", "Oksigen", "Dəm qazı"],
        "correctAnswer": 2,
        "explanation": "Bitkilər fotosintez prosesində havadakı karbon qazını udaraq özlərinə qida hazırlayır və ətraf mühitə oksigen qazı xaric edirlər.",
        "difficulty": "orta"
    },
    {
        "topic": "I BÖLMƏ. CANLI HƏYAT",
        "question": "Mühit amillərindən biri olan işığın çatışmazlığı bitkilərin böyüməsinə necə təsir göstərir?",
        "options": ["Yarpaqlar saralır və bitkinin inkişafı zəifləyir", "Bitki daha sürətlə boy atır", "Çiçək açması sürətlənir", "Kök sistemi normadan artıq güclənir"],
        "correctAnswer": 0,
        "explanation": "İşıq fotosintez üçün vacibdir. İşıq az olduqda bitki kifayət qədər qida maddəsi yarada bilmir, bu səbəbdən yarpaqlar saralır və böyümə ləngiyir.",
        "difficulty": "çətin"
    },
    {
        "topic": "II BÖLMƏ. FƏRD, AİLƏ VƏ CƏMİYYƏT",
        "question": "Cəmiyyətin ən kiçik və əsas hüceyrəsi hansı hesab olunur?",
        "options": ["Məktəb", "Ailə", "Dövlət", "Şəhər"],
        "correctAnswer": 1,
        "explanation": "Cəmiyyət ailələrdən təşkil olunur. Ailə cəmiyyətin formalaşmasında təməl rolunu oynayan ən kiçik sosial qrupdur.",
        "difficulty": "asan"
    },
    {
        "topic": "II BÖLMƏ. FƏRD, AİLƏ VƏ CƏMİYYƏT",
        "question": "Aşağıdakı davranışlardan hansı düzgün ünsiyyət mədəniyyətinə ziddir?",
        "options": ["Diqqətlə dinləmək", "Nəzakətli sözlərdən istifadə etmək", "Başqasının sözünü kəsmək", "Fikrini aydın və səlis ifadə etmək"],
        "correctAnswer": 2,
        "explanation": "Ünsiyyət zamanı başqasının sözünü kəsmək dinləmə mədəniyyətinin pozulmasıdır və ünsiyyətə mənfi təsir göstərir.",
        "difficulty": "orta"
    },
    {
        "topic": "II BÖLMƏ. FƏRD, AİLƏ VƏ CƏMİYYƏT",
        "question": "İnsanın cəmiyyət və öz vicdanı qarşısında hiss etdiyi daxili məsuliyyət hissi necə adlanır?",
        "options": ["Vətəndaşlıq", "Hüquq", "Mənəvi borc", "Qanun"],
        "correctAnswer": 2,
        "explanation": "Mənəvi borc insanın düzgün və ədalətli davranmaq üçün daxilən hiss etdiyi məsuliyyət və vəzifədir.",
        "difficulty": "çətin"
    },
    {
        "topic": "III BÖLMƏ. DÖVLƏT VƏ HÜQUQ",
        "question": "Azərbaycan Respublikasının milli pul vahidi nədir?",
        "options": ["Manat", "Dollar", "Avro", "Lirə"],
        "correctAnswer": 0,
        "explanation": "Azərbaycanın rəsmi milli pul vahidi manatdır.",
        "difficulty": "asan"
    },
    {
        "topic": "III BÖLMƏ. DÖVLƏT VƏ HÜQUQ",
        "question": "Dövlət büdcəsi əsas etibarilə hansı mənbələrdən formalaşır?",
        "options": ["Vətəndaşların və müəssisələrin ödədiyi vergilərdən", "Digər ölkələrin verdiyi borclardan", "Məktəblilərin topladığı vəsaitlərdən", "Yalnız neftin satışından"],
        "correctAnswer": 0,
        "explanation": "Dövlət büdcəsinin əsas gəlir mənbəyi fiziki və hüquqi şəxslərin dövlətə ödədiyi müxtəlif növ vergilərdir.",
        "difficulty": "orta"
    },
    {
        "topic": "III BÖLMƏ. DÖVLƏT VƏ HÜQUQ",
        "question": "Azərbaycan Respublikasında qanunların qəbul edilməsi və ləğv olunması funksiyasını hansı dövlət orqanı həyata keçirir?",
        "options": ["Nazirlər Kabineti", "Milli Məclis (Parlament)", "Ali Məhkəmə", "Bələdiyyə"],
        "correctAnswer": 1,
        "explanation": "Qanunverici hakimiyyəti Azərbaycan Respublikasının Milli Məclisi həyata keçirir və qanunların qəbulu onun səlahiyyətindədir.",
        "difficulty": "çətin"
    },
    {
        "topic": "IV BÖLMƏ. SAĞLAMLIQ VƏ TƏHLÜKƏSİZLİK",
        "question": "Piyadalar üçün işıqforun hansı rəngi yandığı zaman yolu keçmək tam təhlükəsizdir?",
        "options": ["Sarı", "Qırmızı", "Narıncı", "Yaşıl"],
        "correctAnswer": 3,
        "explanation": "İşıqforun yaşıl işığı hərəkətə icazə verir, piyadalar məhz bu işıq yanarkən yolu keçməlidirlər.",
        "difficulty": "asan"
    },
    {
        "topic": "IV BÖLMƏ. SAĞLAMLIQ VƏ TƏHLÜKƏSİZLİK",
        "question": "Hər hansı bir bədən xəsarəti zamanı qanaxmanı dayandırmaq üçün ilk növbədə hansı addım atılmalıdır?",
        "options": ["Qanayan yeri təmiz su ilə uzun müddət yumaq", "Qanayan yerə təmiz sarğı qoyub sıxmaq", "Xəstəyə çoxlu isti su içirtmək", "Yaranın üzərinə torpaq tökmək"],
        "correctAnswer": 1,
        "explanation": "Qanaxmanı dayandırmaq üçün ilk yardım kimi yaranın üzərinə təmiz bint və ya parça ilə təzyiq etmək lazımdır.",
        "difficulty": "orta"
    },
    {
        "topic": "IV BÖLMƏ. SAĞLAMLIQ VƏ TƏHLÜKƏSİZLİK",
        "question": "Ərazinin, məsələn, məktəb həyətinin planını kağız üzərində çəkərkən obyektlərin həqiqi ölçülərinin neçə dəfə kiçildildiyini göstərən riyazi kəmiyyət necə adlanır?",
        "options": ["Kompas", "Xəritə", "Miqyas", "Ekvator"],
        "correctAnswer": 2,
        "explanation": "Miqyas, planda və ya xəritədə uzunluqların həqiqi ölçülərə nisbətən neçə dəfə kiçildildiyini göstərən kəsrdir.",
        "difficulty": "çətin"
    },
    {
        "topic": "V. HƏRƏKƏT VƏ ENERJİ",
        "question": "Fiziki xəritələrdə dağlıq ərazilər adətən hansı rəngin çalarları ilə təsvir olunur?",
        "options": ["Mavi", "Yaşıl", "Sarı", "Qəhvəyi"],
        "correctAnswer": 3,
        "explanation": "Xəritədə qəhvəyi rəng və onun tündlüyü dağları və relyefin yüksəkliyini bildirmək üçün istifadə edilir.",
        "difficulty": "asan"
    },
    {
        "topic": "V. HƏRƏKƏT VƏ ENERJİ",
        "question": "Aşağıdakılardan hansı təbiətdəki tükənən və bərpa olunmayan təbii ehtiyatlara aid edilir?",
        "options": ["Külək enerjisi", "Neft və qaz", "Günəş enerjisi", "Axar su"],
        "correctAnswer": 1,
        "explanation": "Neft, qaz və kömür kimi faydalı qazıntılar istifadə olunduqca tükənir və insan ömrü miqyasında yenidən bərpa oluna bilmirlər.",
        "difficulty": "orta"
    },
    {
        "topic": "V. HƏRƏKƏT VƏ ENERJİ",
        "question": "Yer kürəsində ekvatordan qütblərə doğru irəlilədikcə təbii zonaların dəyişməsinin (qurşaqlığın) əsas səbəbi nədir?",
        "options": ["Yerin relyefinin eyni qalması", "İnsanların fəaliyyəti", "İqlim şəraitinin (istilik və rütubətin) dəyişməsi", "Yalnız bitkilərin və heyvanların fərqli olması"],
        "correctAnswer": 2,
        "explanation": "Ekvatordan qütblərə doğru Günəş şüalarının düşmə bucağı azalır, bu da iqlimin (temperatur və yağıntı) dəyişməsinə, nəticədə təbii zonaların bir-birini əvəz etməsinə səbəb olur.",
        "difficulty": "çətin"
    }
]

# Randomize options positions
for t in tests:
    corr_val = t['options'][t['correctAnswer']]
    random.shuffle(t['options'])
    t['correctAnswer'] = t['options'].index(corr_val)
    t['id'] = random.randint(550000000, 559999999)
    t['passport_id'] = f"04-HB-{random.randint(1000,9999)}-GEN"
    t['category'] = "Həyat bilgisi 4"

if 'Həyat bilgisi 4' not in db:
    db['Həyat bilgisi 4'] = []

db['Həyat bilgisi 4'].extend(tests)

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("Added successfully!")
