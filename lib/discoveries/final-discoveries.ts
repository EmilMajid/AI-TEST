import { ScientificDiscovery } from "@/lib/discoveries-types"

export const FINAL_DISCOVERIES: ScientificDiscovery[] = [
  {
    id: "euclid-axiomatic-geometry-primes",
    slug: "euclid-axiomatic-geometry-infinity-of-primes",
    category: "riyaziyyat",
    isNobel: false,
    discoveryYear: "e.ə. 300",
    discoverer: "Evklid (Euclid of Alexandria)",
    curriculumSubject: "Riyaziyyat",
    curriculumGrade: "6-9-cu sinif",
    curriculumTopic: "Həndəsənin aksiomları, paralellik aksiyomu, sadə ədədlər və ƏBOB (Evklid alqoritmi)",
    icon: "Compass",
    accentColor: "from-blue-600 to-indigo-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Evklid: Aksiomatik Həndəsə və Sadə Ədədlərin Sonsuzluğu",
        summary: "Bəşəriyyətə 2300 ildir məntiqi isbatı öyrədən 'Başlanğıclar' kitabı və sadə ədədlərin heç vaxt tükənmədiyinin dahiyanə sübutu.",
        ahaMoment: "Sadə ədədlər (2, 3, 5, 7, 11, ...) böyüdükcə seyrəlir. Bəs nə vaxtsa ən böyük sadə ədəd tapılıb proses dayana bilərmi? Evklid əksini fərz etdi: tutaq ki, sadə ədədlər sonludur və ən böyüyü P-dir. Bütün bu sadə ədədləri bir-birinə vurub üstünə 1 gələk: N = (2*3*5*...*P) + 1. Bu yeni N ədədi əvvəlki heç bir sadə ədədə bölünmür (həmişə 1 qalıq qalır)! Deməli, ya N özü yeni sadə ədəddir, ya da siyahıda olmayan başqa sadə ədədə bölünür! Ziddiyyət! Sadə ədədlər sonsuzdur!",
        howItWorks: "Evklid bütün riyaziyyatı 5 təkzibolunmaz aksiom üzərində qurdu (Evklid həndəsəsi). Onun iki ədədin ən böyük ortaq bölənini (ƏBOB) tapan alqoritmi (bölmə və qalıq metodu) bu gün də kompüterlərdə işləyən ən qədim və sürətli alqoritmdir.",
        realWorldImpact: "Müasir internet bankçılığı və RSA kriptoqrafiyası (yüzlərlə rəqəmli nəhəng sadə ədədlərin hasili ilə şifrələmə), memarlıq və mühəndislik.",
        curriculumConnection: "6-cı sinif Riyaziyyatda 'Sadə və mürəkkəb ədədlər', 'ƏBOB və ƏKOB tapılması', 7-ci sinif Həndəsədə 'Aksiom və teoremlər' bölmələri.",
        funFacts: [
          "Evklidin 'Başlanğıclar' (Elements) kitabı İncildən sonra bəşəriyyət tarixində ən çox nüsxədə nəşr olunan və tərcümə edilən ikinci kitabdır."
        ]
      },
      en: {
        title: "Euclid: Axiomatic Geometry and Prime Infinity",
        summary: "The deductive bedrock of mathematics: proving the infinity of prime numbers and formalizing geometry.",
        ahaMoment: "Euclid's proof by contradiction that assuming a finite list of primes immediately generates a new prime N = (p1*p2*...*pn) + 1.",
        howItWorks: "Built from 5 postulates; Euclidean GCD algorithm efficiently computes the greatest common divisor via successive remainders.",
        realWorldImpact: "RSA public-key cryptography (the backbone of online banking), computer graphics, and architectural surveying.",
        curriculumConnection: "Prime factorisation, GCD/LCM algorithms, parallel line axioms, and geometric proofs.",
        funFacts: [
          "Euclid's 'Elements' is the second most printed and studied book in human history after the Bible."
        ]
      },
      tr: {
        title: "Öklid: Aksiyomatik Geometri ve Asal Sayıların Sonsuzluğu",
        summary: "Matematiğin mantıksal ispat temeli: asal sayıların sonsuz olduğunun dahiyane kanıtı ve 'Elemanlar' kitabı.",
        ahaMoment: "Asal sayıların sonlu olduğunu varsayarak tümünü çarpıp 1 eklediğinde yeni bir asalın doğduğunu gösteren çelişkiyle ispat.",
        howItWorks: "5 temel aksiyom üzerine kurulu geometri ve kalanlı bölmeyle en büyük ortak böleni (EBOB) bulan Öklid algoritması.",
        realWorldImpact: "RSA şifreleme ile internet bankacılığı güvenliği, haritacılık ve inşaat mühendisliği.",
        curriculumConnection: "Asal sayılar, EBOB-EKOK hesaplamaları ve geometride aksiyom/teorem ispatları.",
        funFacts: [
          "Öklid'in 'Elemanlar' kitabı tarihte İncil'den sonra en çok basılan ve okunan ikinci kitaptır."
        ]
      },
      ru: {
        title: "Евклид: аксиоматическая геометрия и бесконечность простых чисел",
        summary: "Фундамент математической логики: доказательство бесконечности простых чисел и алгоритм нахождения НОД.",
        ahaMoment: "Доказательство от противного: число N = (p₁*p₂*...*pₙ) + 1 не делится ни на одно известное простое число, доказывая их бесконечность.",
        howItWorks: "Построение планиметрии на 5 постулатах; алгоритм Евклида для быстрого нахождения наибольшего общего делителя.",
        realWorldImpact: "RSA-шифрование в онлайн-банкинге, архитектура, компьютерная графика и теория чисел.",
        curriculumConnection: "Школьный курс: простые и составные числа, алгоритм Евклида (НОД и НОК), аксиомы геометрии.",
        funFacts: [
          "«Начала» Евклида выдержали более 1000 печатных изданий, уступая по тиражу только Библии."
        ]
      }
    },
    quiz: [
      {
        id: "euc-q1",
        question: "Evklid sadə ədədlərin sonsuz olduğunu hansı məntiqi riyazi metodla sübut etmişdir?",
        options: [
          { id: "A", text: "Əksini fərz etməklə ziddiyyətə gətirmə metodu ilə (Proof by contradiction)" },
          { id: "B", text: "Sadə ədədləri kompasla çəkməklə" },
          { id: "C", text: "Bütün ədədləri təcrübədə tək-tək saymaqla" },
          { id: "D", text: "Kalkulyator vasitəsilə" }
        ],
        correctOption: "A",
        explanation: "Evklid sadə ədədlərin sonlu olduğunu fərz edib onların hasilinə 1 əlavə etdikdə ziddiyyət alındığını göstərmişdir.",
        bloomLevel: "Anlama"
      },
      {
        id: "euc-q2",
        question: "Evklid alqoritmi kompüterlərdə ən çox hansı riyazi əməliyyatı ən qısa yolla tapmaq üçün tətbiq olunur?",
        options: [
          { id: "A", text: "İki ədədin Ən Böyük Ortaq Bölənini (ƏBOB / GCD)" },
          { id: "B", text: "Ədədin kvadrat kökünü" },
          { id: "C", text: "Dairənin sahəsini" },
          { id: "D", text: "Üçbucağın perimetrini" }
        ],
        correctOption: "A",
        explanation: "Evklid alqoritmi ardıcıl qalıqlı bölmə ilə iki ədədin ƏBOB-unu (ən böyük ortaq bölənini) loqarifmik sürətlə tapır.",
        bloomLevel: "Bilik"
      },
      {
        id: "euc-q3",
        question: "Aşağıdakı ədədlərdən hansı sadə ədəddir (yalnız 1-ə və özünə bölünür)?",
        options: [
          { id: "A", text: "29" },
          { id: "B", text: "27 (3*9)" },
          { id: "C", text: "25 (5*5)" },
          { id: "D", text: "21 (3*7)" }
        ],
        correctOption: "A",
        explanation: "29 yalnız 1-ə və 29-a bölünür, digər ədədlər isə mürəkkəbdir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "faraday-laws-of-electrolysis",
    slug: "michael-faraday-laws-of-electrolysis-electrochemistry",
    category: "kimya",
    isNobel: false,
    discoveryYear: 1834,
    discoverer: "Maykl Faradey (Michael Faraday)",
    curriculumSubject: "Kimya / Fizika",
    curriculumGrade: "8-10-cu sinif",
    curriculumTopic: "Elektroliz qanunları, Faradey sabiti (F = 96500 Kl/mol), katod və anod prosesləri",
    icon: "BatteryCharging",
    accentColor: "from-amber-600 to-yellow-600",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Faradeyin Elektroliz Qanunları: Elektriklə Maddənin Əlaqəsi",
        summary: "Elektrik cərəyanı vasitəsilə metalların təmizlənməsi, qızıl suyuna çəkmə və elektronun yükünün ilk dəfə ölçülməsi.",
        ahaMoment: "Faradey duz və turşu məhlullarından elektrik cərəyanı buraxaraq elektrodlarda toplanan maddələri dəqiq çəkdi. O gördü ki, elektrodlarda ayrılan maddənin kütləsi keçən elektrik yükü ilə mütənasibdir: m = k * q = k * I * t. Ən heyrətamizi isə o idi ki, 1 mol 1-valentli maddəni ayırmaq üçün həmişə tam 96 500 Kulon yük tələb olunurdu (Faradey sabiti, F)! Bu, atomların bölünməz bütöv elektrik payları (elektronlar) daşıdığının ilk dolayı sübutu idi!",
        howItWorks: "Elektroliz zamanı müsbət kationlar katoda (mənfi elektroda) tərəf hərəkət edib elektron qəbul edir (reduksiya), mənfi anionlar isə anoda (müsbət elektroda) tərəf gedib elektron verir (oksidləşmə). Faradeyin birləşmiş qanunu: m = (M / nF) * I * t.",
        realWorldImpact: "Sənayedə xam boksitdən təmiz alüminiumun alınması (Hol-Eru prosesi), misin elektrolitik saflaşdırılması və qızıl/xrom örtüklər (qalvanosteqiya).",
        curriculumConnection: "8-10-cu sinif Kimya və Fizikada 'Məhlul və ərintilərin elektrolizi', 'Faradeyin I və II elektroliz qanunları', 'Elektrokimyəvi ekvivalent' mövzuları.",
        funFacts: [
          "Faradey bu gün kimyada işlətdiyimiz 'ion', 'katod', 'anod', 'elektrod' və 'elektrolit' sözlərini ilk dəfə elmə gətirən şəxsdir."
        ]
      },
      en: {
        title: "Michael Faraday: The Laws of Electrolysis",
        summary: "Quantifying electrochemical deposition and uncovering the quantized nature of electrical charge (Faraday Constant F=96,500 C/mol).",
        ahaMoment: "Faraday proved the mass deposited at electrodes is strictly proportional to total electric charge: m = (M/zF) * I * t.",
        howItWorks: "Cations reduce at the cathode by acquiring electrons; anions oxidize at the anode by shedding electrons, transferring charge via ions.",
        realWorldImpact: "Industrial Hall-Héroult aluminum smelting, copper electro-refining, and protective chrome electroplating.",
        curriculumConnection: "Electrolysis stoichiometry, oxidation-reduction half-reactions, and Faraday's constant calculations.",
        funFacts: [
          "Faraday invented the terms 'ion', 'cathode', 'anode', and 'electrode'."
        ]
      },
      tr: {
        title: "Faraday'ın Elektroliz Yasaları",
        summary: "Elektrik akımıyla saf metallerin ayrıştırılması ve elektron yükünün ilk kanıtı (F = 96500 C/mol).",
        ahaMoment: "Elektrotlarda toplanan madde miktarının devreden geçen elektrik yüküyle doğru orantılı olduğunu formüle etti.",
        howItWorks: "Katotta indirgenme, anotta yükseltgenme gerçekleşir: m = (M / nF) * I * t formülüyle kütle hesaplanır.",
        realWorldImpact: "Endüstriyel alüminyum üretimi, bakır saflaştırma ve galvanik altın/krom kaplama.",
        curriculumConnection: "Kimyada elektroliz, Faraday sabitleri, katot-anot tepkimeleri ve elektrokimyasal eşdeğer.",
        funFacts: [
          "Bugün kullandığımız 'iyon', 'katot', 'anot' ve 'elektrot' terimlerini Faraday türetmiştir."
        ]
      },
      ru: {
        title: "Законы электролиза Майкла Фарадея",
        summary: "Количественная электрохимия, промышленное получение алюминия и постоянная Фарадея (F = 96500 Кл/моль).",
        ahaMoment: "Фарадей установил, что масса выделившегося вещества строго пропорциональна прошедшему электрическому заряду: m = k * I * t.",
        howItWorks: "Восстановление катионов на катоде и окисление анионов на аноде; объединенный закон: m = (M/nF) * I * t.",
        realWorldImpact: "Электролитическая выплавка алюминия, рафинирование меди и гальванические покрытия (хромирование, золочение).",
        curriculumConnection: "Школьный курс: электролиз расплавов и растворов, постоянная Фарадея, расчет массы продуктов электролиза.",
        funFacts: [
          "Фарадей лично придумал термины «ион», «катод», «анод» и «электролит»."
        ]
      }
    },
    quiz: [
      {
        id: "far-e-q1",
        question: "Elektroliz zamanı katodda hansı elektrokimyəvi proses baş verir?",
        options: [
          { id: "A", text: "Müsbət kationların elektron qəbul edərək reduksiya olunması" },
          { id: "B", text: "Anionların elektron verərək oksidləşməsi" },
          { id: "C", text: "Suyun dərhal donması" },
          { id: "D", text: "Nüvə reaksiyası" }
        ],
        correctOption: "A",
        explanation: "Katod mənfi elektrod olduğu üçün müsbət ionlar ora axır və elektron qəbul edərək neytral atoma reduksiya olunur.",
        bloomLevel: "Anlama"
      },
      {
        id: "far-e-q2",
        question: "Faradey sabiti (F ≈ 96500 Kl/mol) fiziki mahiyyətinə görə nəyi ifadə edir?",
        options: [
          { id: "A", text: "1 mol elektronun daşıdığı ümumi elektrik yükünü (e * N_A)" },
          { id: "B", text: "Bir litr suyun kütləsini" },
          { id: "C", text: "İşığın vakuumdakı sürətini" },
          { id: "D", text: "Bir batareyanın gərginliyini" }
        ],
        correctOption: "A",
        explanation: "F = e * N_A = (1.602*10^-19 Kl) * (6.022*10^23 mol^-1) ≈ 96485 Kl/mol – 1 mol elektronun cəmi yüküdür.",
        bloomLevel: "Bilik"
      },
      {
        id: "far-e-q3",
        question: "Sənayedə boksit filizindən təmiz metal alüminium (Al) hansı üsulla alınır?",
        options: [
          { id: "A", text: "Alüminium oksidinin (Al₂O₃) kriolit ərintisində elektrolizi ilə" },
          { id: "B", text: "Sadə kömürlə yandırmaqla" },
          { id: "C", text: "Süzgəcdən süzməklə" },
          { id: "D", text: "Dondurmaqla" }
        ],
        correctOption: "A",
        explanation: "Alüminium çox aktiv metal olduğundan adi kömürlə reduksiya olunmur; onu yalnız Hol-Eru elektroliz üsulu ilə alırlar.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "staudinger-polymers-plastics",
    slug: "hermann-staudinger-macromolecules-synthetic-polymers-nobel",
    category: "kimya",
    isNobel: true,
    nobelPrize: {
      year: 1953,
      category: "Kimya",
      laureates: ["Hermann Staudinger"],
      citation: "Makromolekulyar kimya sahəsindəki kəşflərinə görə"
    },
    discoveryYear: 1920,
    discoverer: "Hermann Ştaudinger və Leo Bakeland",
    curriculumSubject: "Kimya",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Yüksəkmolekullu birləşmələr (polimerlər), polimerləşmə və polikondensləşmə, sintetik plastiklər",
    icon: "Boxes",
    accentColor: "from-amber-600 to-rose-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Ştaudinger və Makromolekullar: Sintetik Polimerlər və Plastik Əsri",
        summary: "Minlərlə atomun bir zəncirə düzülməsi: DNT-dən polietilenə, neylondan təbii kauçuka qədər dünyanı dəyişən polimer kimyası.",
        ahaMoment: "1920-ci illərə qədər aparıcı kimyaçılar iddia edirdilər ki, 100 000-dən çox molekulyar çəkiyə malik böyük molekullar mövcud ola bilməz; kauçuk və zülallar sadəcə kiçik molekulların zəif fiziki yığıntısıdır (kolloid kolleksiyası). Hermann Ştaudinger hamının istehzasına qarşı çıxaraq sübut etdi ki, polimerlər möhkəm kovalent rabitələrlə bağlanmış minlərlə manqadan ibarət nəhəng 'makromolekullardır'!",
        howItWorks: "Monomerlər iki üsulla polimerləşir: 1) Polimerləşmə reaksiyası (ikiqat rabitələrin qırılması ilə, yan məhsulsuz: n CH₂=CH₂ → (-CH₂-CH₂-)_n), 2) Polikondensləşmə reaksiyası (kiçik molekulların, məsələn suyun ayrılması ilə, məsələn neylon və ya lavsan sintezi).",
        realWorldImpact: "Bütün sintetik plastiklər, teflon, neylon parçalar, kompozit təyyarə qanadları, tibbi protezlər və süni damarlar.",
        curriculumConnection: "10-11-ci sinif Üzvi Kimyada 'Yüksəkmolekullu birləşmələr', 'Polimerləşmə dərəcəsi (n)', 'Struktur vahidi və monomer' bölmələri.",
        funFacts: [
          "Leo Bakeland 1907-ci ildə ilk tam sintetik plastik olan 'Bakelit'i ixtira edəndə onu 'Min bir istifadəsi olan material' adlandırmışdı."
        ]
      },
      en: {
        title: "Hermann Staudinger: Macromolecules and Polymers",
        summary: "Proving that natural and synthetic plastics consist of giant covalent molecular chains (1953 Nobel Prize in Chemistry).",
        ahaMoment: "Defying the colloidal consensus of the 1920s, Staudinger proved that rubber and cellulose are giant covalent macromolecules.",
        howItWorks: "Monomers link via addition polymerization (cleaving double bonds without byproducts) or condensation polymerization (releasing small water molecules).",
        realWorldImpact: "Nylon, polyethylene, Teflon, Kevlar body armor, carbon fiber composites, and biomedical implants.",
        curriculumConnection: "Addition vs condensation polymerization, degree of polymerization (n), and polymer architectures.",
        funFacts: [
          "Colleagues told Staudinger: 'Leave the concept of large molecules alone; there are no organic molecules with weights over 5,000!'"
        ]
      },
      tr: {
        title: "Hermann Staudinger ve Polimer Devrimi",
        summary: "Dev kovalent makromoleküllerin keşfi ve plastik çağının doğuşu (1953 Nobel Kimya Ödülü).",
        ahaMoment: "Kauçuk ve selülozun küçük molekül kümesi değil, binlerce atomluk dev kovalent zincirler olduğunu kanıtladı.",
        howItWorks: "Monomerlerin katılma veya polikondenzasyon tepkimeleriyle uzun zincirler halinde bağlanması.",
        realWorldImpact: "Polietilen, naylon kumaşlar, teflon tava kaplamaları ve kompozit uçak gövdeleri.",
        curriculumConnection: "Organik kimyada polimerleşme tepkimeleri, monomer, mer ve polimerleşme derecesi kazanımları.",
        funFacts: [
          "Dönemin profesörleri Staudinger'e 'Büyük molekülleri unut, 5000'den büyük organik molekül olamaz' diye gülmüşlerdi."
        ]
      },
      ru: {
        title: "Герман Штаудингер и химия полимеров",
        summary: "Доказательство существования гигантских макромолекул и рождение полимерных материалов (Нобелевская премия 1953).",
        ahaMoment: "Вопреки мнению академиков, Штаудингер доказал, что каучук состоит не из коллоидных ассоциатов, а из истинных ковалентных цепей.",
        howItWorks: "Реакции полимеризации (раскрытие кратных связей) и поликонденсации (с выделением воды или аммиака): n CH2=CH2 → (-CH2-CH2-)n.",
        realWorldImpact: "Полиэтилен, нейлон, тефлон, кевлар, медицинские протезы и углепластики.",
        curriculumConnection: "Школьный курс органической химии: высокомолекулярные соединения, мономер, полимер, степень полимеризации.",
        funFacts: [
          "Коллеги убеждали Штаудингера прекратить опыты, утверждая, что молекул тяжелее 5000 углеродных единиц не существует в природе."
        ]
      }
    },
    quiz: [
      {
        id: "stau-q1",
        question: "Polietilenin alınması reaksiyası (n CH₂=CH₂ → (-CH₂-CH₂-)_n) hansı kimyəvi reaksiya növünə aiddir?",
        options: [
          { id: "A", text: "Polimerləşmə reaksiyasına" },
          { id: "B", text: "Polikondensləşmə reaksiyasına" },
          { id: "C", text: "Neytrallaşma reaksiyasına" },
          { id: "D", text: "Parçalanma reaksiyasına" }
        ],
        correctOption: "A",
        explanation: "İkiqat rabitənin qırılması hesabına heç bir yan məhsul ayrılmadan birbaşa zəncir uzanması polimerləşmə adlanır.",
        bloomLevel: "Anlama"
      },
      {
        id: "stau-q2",
        question: "Polikondensləşmə reaksiyasının polimerləşmədən başlıca fərqi nədir?",
        options: [
          { id: "A", text: "Reaksiya zamanı polimerlə yanaşı kiçik molekullu yan maddənin (məsələn, suyun) ayrılması" },
          { id: "B", text: "Heç vaxt istilik ayrılmaması" },
          { id: "C", text: "Yalnız qazların iştirak etməsi" },
          { id: "D", text: "Plastik alınmaması" }
        ],
        correctOption: "A",
        explanation: "Polikondensləşmədə funksional qruplar (məs. -OH və -COOH) birləşərkən mütləq su (H₂O) kimi kiçikmolekullu maddə ayrılır.",
        bloomLevel: "Bilik"
      },
      {
        id: "stau-q3",
        question: "Hermann Ştaudingerin kimya elminə gətirdiyi ən inqilabi anlayış hansı idi?",
        options: [
          { id: "A", text: "Makromolekul (minlərlə atomdan ibarət kovalent zəncir) anlayışı" },
          { id: "B", text: "Atomun bölünməzliyi" },
          { id: "C", text: "Molekulların yalnız 4 atomdan ibarət olması" },
          { id: "D", text: "Suyun qeyri-üzvi olması" }
        ],
        correctOption: "A",
        explanation: "Ştaudinger sübut etdi ki, polimerlər zəif yığıntı deyil, güclü kovalent rabitələrlə birləşmiş nəhəng vahid makromolekullardır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "alexander-graham-bell-telephone",
    slug: "alexander-graham-bell-telephone-voice-transmission",
    category: "fizika",
    isNobel: false,
    discoveryYear: 1876,
    discoverer: "Aleksandr Qrem Bell (Alexander Graham Bell)",
    curriculumSubject: "Fizika / İnformatika",
    curriculumGrade: "8-10-cu sinif",
    curriculumTopic: "Səs dalğaları, mikrofon və dinamik, elektromaqnit induksiyası və analoq siqnallar",
    icon: "PhoneCall",
    accentColor: "from-amber-600 to-emerald-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Aleksandr Qrem Bell və Telefon: İnsan Səsinin Naqillərlə Səyahəti",
        summary: "'Mister Uatson, buraya gəlin, siz mənə lazımsınız!' – məsafələri yox edən ilk səsli rabitə ixtirası.",
        ahaMoment: "Köhnə teleqraf yalnız Morze əlifbasının quru 'taqqıltılarını' nöqtə və tirelərlə daşıyırdı. Qrem Bell karlar məktəbində akustika müəllimi işləyirdi və bilirdi ki, insan səsi mürəkkəb hava təzyiqi dalğasıdır. 1876-cı ilin martında o, nazik metal membranı maqnit sarğacının qarşısında yerləşdirdi: səs dalğası membranı titrədəndə sarğacda səsin tezliyinə tam uyğun dəyişən elektrik cərəyanı yarandı!",
        howItWorks: "Telefon iki hissədən ibarətdir: 1) Mikrofon (səs dalğasının mexaniki rəqslərini elektrik cərəyanının rəqslərinə çevirir), 2) Dinamik (qəbuledici tərəfdə dəyişən elektrik siqnalını elektromaqnit vasitəsilə yenidən membranın mexaniki titrəməsinə və səs dalğasına çevirir).",
        realWorldImpact: "Qlobal telekommunikasiya şəbəkəsi, mobil telefonlar, çağrı mərkəzləri və beynəlxalq rabitə infrastrukturu.",
        curriculumConnection: "8-ci və 9-cu sinif Fizikada 'Mexaniki səs dalğaları və onların xarakteristikaları (ucalıq, ton, tezlik)', 10-cu sinifdə 'Elektromaqnit rəqsləri və cərəyanın çevrilməsi' mövzuları.",
        funFacts: [
          "Qrem Bellin anası və həyat yoldaşı tamamilə kar idilər; Bell bütün ömrünü eşitmə qüsurlu insanlara kömək etmək üçün akustika araşdırmalarına həsr etmişdi."
        ]
      },
      en: {
        title: "Alexander Graham Bell and the Electric Telephone",
        summary: "Transmitting human vocal acoustics over copper wires via electromagnetic modulation (1876).",
        ahaMoment: "Bell recognized that a vibrating diaphragm could induce an undulating electric current replicating vocal timbre and pitch.",
        howItWorks: "Microphone diaphragms transduce acoustic pressure waves into proportional electrical currents; receiver electromagnets reverse the process.",
        realWorldImpact: "Global landline telephony, cellular voice protocols, acoustic transducer engineering, and modern voice telecoms.",
        curriculumConnection: "Sound wave acoustics, electromagnetic transduction, and audio signal processing.",
        funFacts: [
          "Both Bell's mother and wife were deaf, inspiring his lifelong dedication to hearing and acoustic science."
        ]
      },
      tr: {
        title: "Alexander Graham Bell ve Telefonun İcadı",
        summary: "'Bay Watson, buraya gelin, size ihtiyacım var!' sözüyle başlayan sesli iletişim çağı.",
        ahaMoment: "İnce metal bir zarın ses dalgasıyla titreşerek bobinde değişken elektrik akımı üretebileceğini keşfetti.",
        howItWorks: "Mikrofon ses titreşimini elektrik akımına, ahizedeki hoparlör ise elektrik akımını tekrar sese dönüştürür.",
        realWorldImpact: "Küresel telefon ağları, mobil iletişim ve telekomünikasyon endüstrisi.",
        curriculumConnection: "Fizikte ses dalgaları, titreşim, rezonans ve elektromanyetik indüksiyon kazanımları.",
        funFacts: [
          "Bell'in annesi ve eşi işitme engelliydi; hayatını ses bilimine adaması bu sevgiden kaynaklanıyordu."
        ]
      },
      ru: {
        title: "Александр Белл и изобретение телефона",
        summary: "Превращение звуковых колебаний речи в электрический сигнал: первая передача человеческого голоса по проводам.",
        ahaMoment: "Белл понял, что мембрана, колеблющаяся в такт звукам голоса, может индуцировать переменный ток в катушке магнита.",
        howItWorks: "Микрофон преобразует звуковую волну в электрический сигнал, а динамик приемника превращает ток обратно в колебания воздуха.",
        realWorldImpact: "Всемирная телефонная сеть, голосовая связь, сотовые телефоны и телекоммуникации.",
        curriculumConnection: "Школьный курс: звуковые волны (громкость, высота тона), электромагнитная индукция, микрофон и динамик.",
        funFacts: [
          "Мать и жена Белла были глухими, что вдохновило его на глубокое изучение акустики."
        ]
      }
    },
    quiz: [
      {
        id: "bell-q1",
        question: "Telefon mikrofonunun əsas vəzifəsi hansı fiziki çevrilməni həyata keçirməkdir?",
        options: [
          { id: "A", text: "Havanın səs rəqslərini analoq elektrik cərəyanı rəqslərinə çevirmək" },
          { id: "B", text: "Səsi birbaşa işığa çevirmək" },
          { id: "C", text: "Cərəyanı söndürmək" },
          { id: "D", text: "Yalnız temperaturu ölçmək" }
        ],
        correctOption: "A",
        explanation: "Mikrofonda membran səsin təsirindən titrəyir və mexaniki akustik dalğanı uyğun elektrik siqnalına çevirir.",
        bloomLevel: "Anlama"
      },
      {
        id: "bell-q2",
        question: "İnsan qulağının eşidə bildiyi səs dalğalarının tezlik diapazonu hansı hüdudlardadır?",
        options: [
          { id: "A", text: "16 Hs - 20 000 Hs (20 kHs)" },
          { id: "B", text: "0 - 5 Hs" },
          { id: "C", text: "100 000 Hs - 1 000 000 Hs" },
          { id: "D", text: "Yalnız 100 Hs" }
        ],
        correctOption: "A",
        explanation: "16-20 Hs-dən aşağı infrasəs, 20 000 Hs-dən yuxarı ultrasəs adlanır; insan qulağı yalnız 16 ilə 20 000 Hs arasını eşidir.",
        bloomLevel: "Bilik"
      },
      {
        id: "bell-q3",
        question: "Qəbuledici tərəfdə (dinamikdə) elektrik siqnalını yenidən səsə çevirən əsas komponent hansıdır?",
        options: [
          { id: "A", text: "Elektromaqnit və elastik membran (diffuzor)" },
          { id: "B", text: "Termometr" },
          { id: "C", text: "Şüşə linza" },
          { id: "D", text: "Akkumulyator turşusu" }
        ],
        correctOption: "A",
        explanation: "Dəyişən cərəyan sarğacdan keçərkən elektromaqnit sahəsi membranı cəzb edib buraxır və membran havanı titrədərək səs yaradır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "nikola-tesla-ac-induction-motor",
    slug: "nikola-tesla-alternating-current-polyphase-induction-motor",
    category: "fizika",
    isNobel: false,
    discoveryYear: 1888,
    discoverer: "Nikola Tesla",
    curriculumSubject: "Fizika",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Dəyişən cərəyan, fırlanan maqnit sahəsi, asinxron mühərrik və transformatorlar",
    icon: "Zap",
    accentColor: "from-blue-600 to-violet-800",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "Nikola Tesla və Dəyişən Cərəyan: Fırlanan Maqnit Sahəsi",
        summary: "Tomas Edisonun sabit cərəyanına qarşı 'Cərəyanlar Müharibəsi'nin qalibi: minlərlə kilometrə elektrik ötürən çoxfazalı AC sistemi və asinxron mühərrik.",
        ahaMoment: "Edisonun sabit cərəyanı (DC) enerjini cəmi 1-2 kilometr məsafəyə ötürə bilirdi, çünki qalın naqillərdə böyük Coul istiliyi itkisi yaranırdı və gərginliyi qaldırmaq olmurdu. Tesla Budapeşt parkında gəzərkən Qötenin 'Faust' əsərini əzbərdən oxuduğu an qəfil dayandı və qumun üstünə budaqla bir diaqram çəkdi: fırlanan maqnit sahəsi! O kəşf etdi ki, iki və ya üç faza dəyişən cərəyan heç bir sürtünən kollektor olmadan mühərriki fırlada bilər!",
        howItWorks: "Dəyişən cərəyan (AC) transformator vasitəsilə yüz minlərlə volta qaldırılır (yüksək gərginlikdə naqildən keçən cərəyan şiddəti azalır və itki sıfıra enir: Q = I²Rt). Şəhərə çatanda isə gərginlik təhlükəsiz 220V-a endirilir. Teslanın asinxron mühərrikində stator dolaqları fırlanan maqnit sahəsi yaradır və rotorda cərəyan induksiyalayaraq onu fırladır.",
        realWorldImpact: "Bütün dünya elektrik şəbəkələri, su elektrik stansiyaları (Niagara şəlaləsi SES), sənaye fabrikləri, ventilyatorlar, qatarlar və Tesla elektromobilləri.",
        curriculumConnection: "11-ci sinif Fizika dərsliyində 'Dəyişən cərəyan dövrəsi', 'Transformatorlar və elektrik enerjisinin uzaq məsafəyə ötürülməsi', 'Asinxron mühərrikin iş prinsipi' mövzuları.",
        funFacts: [
          "Tesla təbiətdəki 3 rəqəminə pərəstiş edirdi; o, binalara girməzdən əvvəl onların ətrafında mütləq 3 dəfə dolanardı.",
          "Beynəlxalq Vahidlər Sistemində (SI) maqnit sahəsinin induksiya vahidi onun şərəfinə 'Tesla' (T) adlandırılmışdır."
        ]
      },
      en: {
        title: "Nikola Tesla: Alternating Current and the Induction Motor",
        summary: "Winning the 'War of the Currents' against Edison to power civilization via polyphase AC transmission and rotating magnetic fields.",
        ahaMoment: "Tesla visualized the rotating magnetic field while reciting Goethe's Faust in a Budapest park, drawing the design in the dirt with a stick.",
        howItWorks: "AC voltages step up via transformers to hundreds of kilovolts for low-loss long-distance transmission (P_loss = I^2*R), stepping down for consumer safety.",
        realWorldImpact: "Global electrical grids, hydroelectric dams (Niagara Falls), industrial induction motors, and electric locomotives.",
        curriculumConnection: "AC circuit parameters, step-up/step-down transformers, power transmission losses, and rotational induction.",
        funFacts: [
          "The SI unit of magnetic flux density is named the Tesla (T) in his honor."
        ]
      },
      tr: {
        title: "Nikola Tesla ve Alternatif Akım Devrimi",
        summary: "Edison'a karşı Akımlar Savaşı'nı kazanan dahi: dönen manyetik alan, çok fazlı AC sistemi ve indüksiyon motoru.",
        ahaMoment: "Budapeşte'de parkta yürürken kuma bir sopayla çizdiği şema ile sürtünmesiz fırçasız indüksiyon motorunu tasarladı.",
        howItWorks: "Alternatif akım transformatörlerle yüz binlerce volta yükseltilerek ısı kaybı olmadan binlerce kilometre taşınır.",
        realWorldImpact: "Küresel elektrik şebekesi, hidroelektrik santralleri ve tüm sanayi elektrik motorları.",
        curriculumConnection: "Fizikte alternatif akım, transformatörler, enerji iletiminde kayıplar ve indüksiyon motoru.",
        funFacts: [
          "Manyetik alan şiddetinin SI birimi onun onuruna Tesla (T) olarak adlandırılmıştır."
        ]
      },
      ru: {
        title: "Никола Тесла: переменный ток и асинхронный двигатель",
        summary: "Победа в «войне токов» над Эдисоном и создание глобальной энергосистемы переменного тока (AC).",
        ahaMoment: "Тесла начертил палочкой на песке принцип вращающегося магнитного поля, озаривший его во время прогулки по парку.",
        howItWorks: "Трансформаторы повышают напряжение до сотен киловольт, снижая потери на нагрев проводов (Q = I²Rt), и понижают его у потребителя.",
        realWorldImpact: "Все электросети мира, Ниагарская ГЭС, асинхронные двигатели поездов, насосов и станков.",
        curriculumConnection: "Школьный курс: переменный электрический ток, трансформатор, передача электроэнергии на расстояние.",
        funFacts: [
          "В честь Теслы названа единица магнитной индукции в системе СИ — Тесла (Тл)."
        ]
      }
    },
    quiz: [
      {
        id: "tes-q1",
        question: "Elektrik enerjisini uzaq məsafələrə ötürərkən naqillərdə enerji itkisini (Coul istiliyini) azaltmaq üçün nə edilir?",
        options: [
          { id: "A", text: "Transformatorla gərginlik yüz minlərlə volta qaldırılır, bununla da naqildəki cərəyan şiddəti (I) azaldılır" },
          { id: "B", text: "Naqilləri su ilə soyudurlar" },
          { id: "C", text: "Naqilləri torpağın altına basdırırlar" },
          { id: "D", text: "Elektriyi yalnız gecələr ötürürlər" }
        ],
        correctOption: "A",
        explanation: "Coul-Lens qanununa görə istilik itkisi cərəyan şiddətinin kvadratından asılıdır (Q = I²Rt). Gərginlik artdıqda cərəyan azalır və itki kəskin düşür.",
        bloomLevel: "Anlama"
      },
      {
        id: "tes-q2",
        question: "Teslanın kəşf etdiyi asinxron mühərrikin rotorunu fırladan əsas amil nədir?",
        options: [
          { id: "A", text: "Stator dolaqlarında yaranan fırlanan maqnit sahəsi" },
          { id: "B", text: "Daxili yanma mühərriki" },
          { id: "C", text: "Külək enerjisi" },
          { id: "D", text: "Kömür buxarı" }
        ],
        correctOption: "A",
        explanation: "Çoxfazalı dəyişən cərəyan stator dolaqlarında fəzada fırlanan maqnit sahəsi yaradır və rotorda cərəyan induksiyalayaraq onu arxasınca fırladır.",
        bloomLevel: "Bilik"
      },
      {
        id: "tes-q3",
        question: "Transformator hansı cərəyan növünün gərginliyini dəyişmək üçün işləyir?",
        options: [
          { id: "A", text: "Yalnız Dəyişən cərəyanın (AC)" },
          { id: "B", text: "Yalnız Sabit cərəyanın (DC)" },
          { id: "C", text: "Hər iki cərəyanın eyni dərəcədə" },
          { id: "D", text: "Yalnız akkumulyatordan gələn cərəyanın" }
        ],
        correctOption: "A",
        explanation: "Transformator elektromaqnit induksiyası ilə işləyir; induksiya yalnız maqnit seli dəyişdikdə baş verdiyi üçün transformator yalnız dəyişən cərəyanda işləyir.",
        bloomLevel: "Tətbiq"
      }
    ]
  }
]
