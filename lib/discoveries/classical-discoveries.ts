import { ScientificDiscovery } from "@/lib/discoveries-types"

export const CLASSICAL_DISCOVERIES: ScientificDiscovery[] = [
  {
    id: "photoelectric-effect-einstein",
    slug: "einstein-photoelectric-effect-photons-nobel",
    category: "fizika",
    isNobel: true,
    nobelPrize: {
      year: 1921,
      category: "Fizika",
      laureates: ["Albert Einstein"],
      citation: "Nəzəri fizikaya xidmətlərinə və xüsusilə fotoeffekt qanununun kəşfinə görə"
    },
    discoveryYear: 1905,
    discoverer: "Albert Eynşteyn və Maks Plank",
    curriculumSubject: "Fizika",
    curriculumGrade: "11-ci sinif",
    curriculumTopic: "Fotoeffekt qanunları, foton enerjisi (E=hν) və çıxış işi",
    icon: "Sun",
    accentColor: "from-amber-500 to-yellow-600",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Fotoeffekt Hadisəsi və Fotonlar: İşıq Həm Dalğadır, Həm Zərrəcik",
        summary: "Eynşteynə Nisbilik nəzəriyyəsinə görə deyil, işığın diskret kvantlardan (fotonlardan) ibarət olduğunu sübut etdiyinə görə verilən Nobel kəşfi.",
        ahaMoment: "Klassik dalğa fizikasına görə, metalı zəif qırmızı işıqla kifayət qədər uzun müddət işıqlandırdıqda elektronlar enerji toplayıb metaldan qopmalı idi. Lakin eksperimentlər göstərdi ki, işığın parlaqlığından asılı olmayaraq, tezliyi qırmızı sərhəddən aşağıdırsa, heç vaxt fotoelektron qopmur! Eynşteyn 1905-ci ildə cəsarətlə elan etdi: işıq davamlı dalğa deyil, porsiyalarla – fotonlarla yayılır və udulur.",
        howItWorks: "Hər bir foton E = hν enerjisi daşıyır. Metalın səthindəki elektron yalnız bir foton udur. Əgər fotonun enerjisi elektronun metaldan çıxış işindən (A) böyükdürsə, qalan enerji elektronun kinetik enerjisinə çevrilir: hν = A + mv²/2 (Eynşteyn tənliyi).",
        realWorldImpact: "Günəş panelləri, rəqəmsal kameraların matrisləri (CCD/CMOS), gecəgörmə cihazları və fotosellər bu qanunla işləyir.",
        curriculumConnection: "11-ci sinif Fizika buraxılış və qəbul imtahanlarının ən populyar bölməsidir: Fotoeffektin qırmızı sərhədi (ν₀ = A/h), Doyma cərəyanı və ləngidici gərginlik məsələləri.",
        funFacts: [
          "Çoxları elə bilir ki, Eynşteyn Nisbilik Nəzəriyyəsinə görə Nobel alıb, amma o bu mükafatı məhz Fotoeffektin kəşfinə görə almışdır.",
          "Fotoeffekt sayəsində işığın həm dalğa, həm də zərrəcik xassəsinə malik olduğu (korpuskulyar-dalğa dualizmi) sübut olundu."
        ]
      },
      en: {
        title: "Einstein's Photoelectric Effect and Photons",
        summary: "Proving light behaves as discrete packets of energy (photons), earning Albert Einstein the 1921 Nobel Prize in Physics.",
        ahaMoment: "Classical wave theory failed to explain why dim blue light ejects electrons while intense red light cannot.",
        howItWorks: "Photons carry quantized energy E=hf. Absorbing a single photon imparts energy to overcome work function (W), with excess becoming kinetic energy.",
        realWorldImpact: "Solar photovoltaic cells, smartphone camera sensors, and night vision photomultipliers.",
        curriculumConnection: "Standard 11th-grade physics topic: cutoff frequency, work function, and Einstein's photoelectric equation.",
        funFacts: [
          "Einstein won his sole Nobel Prize for the photoelectric effect, not relativity."
        ]
      },
      tr: {
        title: "Einstein ve Fotoelektrik Olayı",
        summary: "Işığın foton adı verilen enerji paketlerinden oluştuğunu kanıtlayan ve 1921 Nobel Fizik Ödülü'nü getiren keşif.",
        ahaMoment: "Kırmızı ışık ne kadar parlak olursa olsun elektron koparamazken, zayıf mavi ışığın anında elektron koparması.",
        howItWorks: "Foton enerjisi metalin bağlanma enerjisini (bağlanma işi) aştığında fotoelektronlar fırlar: hf = W + Ek.",
        realWorldImpact: "Güneş pilleri, dijital kamera sensörleri ve fotoseller.",
        curriculumConnection: "Lise fizik müfredatının temel kuantum konusu: eşik frekansı ve Einstein denklemi.",
        funFacts: [
          "Einstein teorik görelilik için değil, fotoelektrik olayı için Nobel kazanmıştır."
        ]
      },
      ru: {
        title: "Фотоэффект Эйнштейна и кванты света",
        summary: "Доказательство корпускулярной природы света и квантовой структуры излучения (Нобелевская премия по физике 1921).",
        ahaMoment: "Эйнштейн объяснил, почему красная лампа любой мощности не выбивает электроны, а слабый ультрафиолет выбивает их мгновенно.",
        howItWorks: "Уравнение Эйнштейна hν = A + mv²/2: энергия фотона расходуется на преодоление работы выхода и сообщение кинетической энергии электрону.",
        realWorldImpact: "Солнечные батареи, матрицы цифровых фотоаппаратов, датчики движения и фотоэлементы.",
        curriculumConnection: "Школьный курс: красная граница фотоэффекта, уравнение Эйнштейна, квантовая природа света.",
        funFacts: [
          "Эйнштейн получил свою единственную Нобелевскую премию именно за фотоэффект, а не за теорию относительности."
        ]
      }
    },
    quiz: [
      {
        id: "pe-q1",
        question: "Fotoeffekt zamanı qopan elektronların maksimal kinetik enerjisi nədən asılıdır?",
        options: [
          { id: "A", text: "Düşən işığın tezliyindən (dalğa uzunluğundan) və metalın çıxış işindən" },
          { id: "B", text: "Yalnız düşən işığın intensivliyindən (parlaqlığından)" },
          { id: "C", text: "Metala qoşulan naqilin qalınlığından" },
          { id: "D", text: "Otağın havasının rütubətindən" }
        ],
        correctOption: "A",
        explanation: "Fotoelektronların kinetik enerjisi yalnız udulan fotonun tezliyindən (E=hν) asılıdır. İşıq selinin parlaqlığı isə qopan elektronların sayına (doyma cərəyanına) təsir edir.",
        bloomLevel: "Anlama"
      },
      {
        id: "pe-q2",
        question: "Fotoeffektin 'qırmızı sərhədi' nə deməkdir?",
        options: [
          { id: "A", text: "Fotoeffekt hadisəsinin baş verə biləcəyi ən kiçik tezlik (və ya ən böyük dalğa uzunluğu)" },
          { id: "B", text: "İşığın yalnız qırmızı rəngdə şüalanması" },
          { id: "C", text: "Metaldan qopan elektronların qırmızı olması" },
          { id: "D", text: "Metalın paslanma həddi" }
        ],
        correctOption: "A",
        explanation: "Fotonun enerjisi çıxış işinə bərabər olduqda (hν₀ = A) elektron güclə qopur. ν < ν₀ olduqda fotoeffekt qətiyyən baş vermir.",
        bloomLevel: "Bilik"
      },
      {
        id: "pe-q3",
        question: "Əgər metala düşən işığın parlaqlığı iki dəfə artırılarsa, lakin tezliyi dəyişməzsə, hansı kəmiyyət iki dəfə artar?",
        options: [
          { id: "A", text: "Vahid zamanda qopan elektronların sayı (doyma foto cərəyanı)" },
          { id: "B", text: "Hər bir elektronun maksimal kinetik enerjisi" },
          { id: "C", text: "Metalın çıxış işi" },
          { id: "D", text: "Plank sabiti" }
        ],
        correctOption: "A",
        explanation: "İşıqlanma intensivliyinin artması vahid zamanda səthə düşən fotonların sayını artırır, bu da daha çox elektronun qopmasına səbəb olur.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "penicillin-antibiotics-fleming",
    slug: "alexander-fleming-penicillin-antibiotics-nobel",
    category: "biologiya",
    isNobel: true,
    nobelPrize: {
      year: 1945,
      category: "Fiziologiya və ya Tibb",
      laureates: ["Alexander Fleming", "Ernst Boris Chain", "Howard Florey"],
      citation: "Penisillinin kəşfinə və onun müxtəlif yoluxucu xəstəliklərdə müalicəvi təsirinə görə"
    },
    discoveryYear: 1928,
    discoverer: "Alexander Fleming, Howard Florey və Ernst Chain",
    curriculumSubject: "Biologiya",
    curriculumGrade: "7-9-cu sinif",
    curriculumTopic: "Bakteriyalar, kifs göbələkləri, orqanizmlərarası simbioz və antibiotiklər",
    icon: "ShieldAlert",
    accentColor: "from-teal-600 to-emerald-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Penisillinin Kəşfi: Təsadüfi Kif Göbələyindən Milyonların Xilasına",
        summary: "Bir çirkli laboratoriya qabından bəşəriyyətin yoluxucu xəstəliklərə qarşı ən güclü silahı – ilk antibiotikin doğulması.",
        ahaMoment: "1928-ci ildə Aleksandr Fleminq tətilə gedərkən laboratoriyasında stafilokokk bakteriyası ilə dolu Petri qablarını yumağı unutmuşdu. Qayıdanda o gördü ki, açıq qablardan birinə göy kifs göbələyi (Penicillium notatum) düşüb və həmin kifin ətrafındakı bütün bakteriyalar əriyib yox olub!",
        howItWorks: "Penisillin bakteriya hüceyrə divarının əsasını təşkil edən murein (peptidoqlikan) sintezində iştirak edən transpeptidaza fermentini bloklayır. Bakteriya bölünəndə zəif divar daxili osmotik təzyiqə tab gətirmir və partlayır. İnsan hüceyrələrində isə murein divar olmadığı üçün penisillin insan üçün təhlükəsizdir.",
        realWorldImpact: "Əvvəllər adi bir cızıq və ya pnevmoniyadan ölən yüz milyonlarla insanın həyatı xilas edildi; İkinci Dünya Müharibəsində yaralıların infeksiyadan ölməsinin qarşısı alındı.",
        curriculumConnection: "7-ci sinif Biologiyada 'Bakteriyaların quruluşu və murein örtüyü', 8-ci sinifdə 'Mikroorqanizmlər və Kif göbələkləri' mövzularına birbaşa inteqrasiya olunur.",
        funFacts: [
          "Fleminq kəşfini patentləşdirməkdən imtina etdi ki, dərman bütün bəşəriyyət üçün pulsuz və əlçatan olsun.",
          "Hazırda antibiotiklərin həddən artıq və yersiz istifadəsi 'superbakteriyaların' (dərmana dözümlü ştammların) yaranmasına gətirib çıxarır."
        ]
      },
      en: {
        title: "Discovery of Penicillin and Antibiotics",
        summary: "How a forgotten moldy petri dish launched the antibiotic era and saved hundreds of millions of lives (1945 Nobel Prize).",
        ahaMoment: "Fleming noticed a clear halo around Penicillium mold where staphylococci bacteria had completely lysed.",
        howItWorks: "Penicillin inhibits transpeptidase enzymes required for peptidoglycan bacterial cell wall cross-linking, causing osmotic cell lysis.",
        realWorldImpact: "Eliminated lethal bacterial epidemics like pneumonia, syphilis, and sepsis; underpinning modern surgery.",
        curriculumConnection: "Fundamental to bacterial cell wall structure vs mammalian plasma membranes.",
        funFacts: [
          "Fleming refused to patent penicillin so it could be manufactured freely worldwide."
        ]
      },
      tr: {
        title: "Penisilinin Keşfi ve Antibiyotik Çağı",
        summary: "Unutulan bir petri kabındaki küf mantarından insanlık tarihini değiştiren ilk antibiyotiğin doğuşu (1945 Nobel Tıp Ödülü).",
        ahaMoment: "Fleming, tatil dönüşü küf mantarının çevresindeki stafilokok bakterilerinin eridiğini fark etti.",
        howItWorks: "Bakteri hücre duvarındaki peptidoglikan sentezini engelleyerek bakterinin ozmotik basınçla patlamasına yol açar.",
        realWorldImpact: "Zatürre, kangren ve verem gibi öldürücü enfeksiyonların tedavisinde dönüm noktası.",
        curriculumConnection: "Bakteri anatomisi, hücre duvarı yapısı ve mantarların biyolojisi ile birebir örtüşür.",
        funFacts: [
          "Fleming, ilacın herkese ucuz ulaşabilmesi için penisilinin patentini almayı reddetti."
        ]
      },
      ru: {
        title: "Открытие пенициллина Александром Флемингом",
        summary: "Случайная плесень в лабораторной чашке Петри, положившая начало эре антибиотиков (Нобелевская премия по медицине 1945).",
        ahaMoment: "Флеминг заметил зону лизиса бактерий вокруг колонии плесневого гриба Penicillium notatum.",
        howItWorks: "Блокирует синтез пептидогликана клеточной стенки бактерий, вызывая их осмотический разрыв при делении.",
        realWorldImpact: "Спасение сотен миллионов жизней от пневмонии, сепсиса, раневых инфекций и туберкулеза.",
        curriculumConnection: "Школьный курс: строение бактериальной клетки (муреин), плесневые грибы, иммунитет.",
        funFacts: [
          "Флеминг отказался патентовать пенициллин, чтобы он производился свободно по всему миру."
        ]
      }
    },
    quiz: [
      {
        id: "pen-q1",
        question: "Penisillin antibiotiki bakteriyaları hansı mexanizmlə məhv edir?",
        options: [
          { id: "A", text: "Bakteriyanın hüceyrə divarının (murein) sintezini pozaraq onun parçalanmasına səbəb olur" },
          { id: "B", text: "Bakteriyanın hərəkət qamçısını kəsir" },
          { id: "C", text: "Hüceyrənin daxilindəki suyu dondurur" },
          { id: "D", text: "Bakteriyanı virusa çevirir" }
        ],
        correctOption: "A",
        explanation: "Penisillin bakteriyanın hüceyrə divarını təşkil edən peptidoqlikan (murein) bağlarını bloklayır, nəticədə bakteriya osmotik təzyiqdən partlayır.",
        bloomLevel: "Anlama"
      },
      {
        id: "pen-q2",
        question: "Niyə antibiotiklər virus xəstəliklərinə (məsələn, qrip və ya soyuqdəymə) qarşı təsirsizdir?",
        options: [
          { id: "A", text: "Çünki virusların hüceyrəvi quruluşu və murein divarı yoxdur" },
          { id: "B", text: "Çünki viruslar antibiotiki yeyirlər" },
          { id: "C", text: "Çünki viruslar yalnız yayda aktivləşir" },
          { id: "D", text: "Çünki antibiotiklər yalnız bitkilərdə işləyir" }
        ],
        correctOption: "A",
        explanation: "Viruslar qeyri-hüceyrəvi həyat formasıdır; onların murein divarı, öz ribosomları və metabolizmi olmadığı üçün antibiotiklər onlara heç bir təsir göstərmir.",
        bloomLevel: "Bilik"
      },
      {
        id: "pen-q3",
        question: "Antibiotikləri həkim təyinatı olmadan yarımçıq və ya yersiz qəbul etmək hansı təhlükəyə yol açır?",
        options: [
          { id: "A", text: "Antibiotiklərə davamlı (rezistent) güclü bakteriya ştammlarının yaranmasına" },
          { id: "B", text: "İnsanın çəkisinin anında ikiqat artmasına" },
          { id: "C", text: "Qanın tamamilə qırmızı rəngini itirməsinə" },
          { id: "D", text: "Hüceyrələrin bitkiyə çevrilməsinə" }
        ],
        correctOption: "A",
        explanation: "Düzgün dozada qəbul edilmədikdə sağ qalan bakteriyalarda mutasiyalar toplanır və onlar gələcəkdə həmin antibiotikə reaksiya verməyən dözümlü ştammlara çevrilir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "dna-double-helix-watson-crick",
    slug: "dna-double-helix-molecular-structure-nobel",
    category: "biologiya",
    isNobel: true,
    nobelPrize: {
      year: 1962,
      category: "Fiziologiya və ya Tibb",
      laureates: ["James Watson", "Francis Crick", "Maurice Wilkins"],
      citation: "Nuklein turşularının molekulyar quruluşu və onun canlı maddədə informasiya ötürülməsindəki əhəmiyyətinin kəşfinə görə"
    },
    discoveryYear: 1953,
    discoverer: "James Watson, Francis Crick və Rosalind Franklin",
    curriculumSubject: "Biologiya / Kimya",
    curriculumGrade: "9-10-cu sinif",
    curriculumTopic: "DNT-nin ikili spiral quruluşu, Çarqaff qaydası və komplementarlıq prinsipi",
    icon: "Dna",
    accentColor: "from-blue-600 to-cyan-500",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "DNT-nin İkili Spiral Quruluşu: Həyatın Sirr Kodu",
        summary: "Rozalind Franklinin tarixi rentgen şəkli və Uatson-Krikin həyatın genetik kopyalama mexanizmini dünyaya açan modeli.",
        ahaMoment: "Rozalind Franklin tərəfindən çəkilmiş məşhur 'Foto 51' rentgenoqramması DNT-nin xarakterik X formasında spiral olduğunu sübut etdi. 1953-cü ilin fevralında Kembricdə Frensis Krik laboratoriyadan pivəxanaya qaçaraq qışqırdı: 'Biz həyatın sirrini tapdıq!'. Çünki iki zəncirin bir-birinə qarşı durması DNT-nin özünü necə kopyaladığını anında aydınlaşdırırdı.",
        howItWorks: "DNT iki antiparalel zəncirdən ibarətdir. Karbohidrat-fosfat karkası xaricdə, azotlu əsaslar isə daxildə yerləşir. Əsaslar komplementarlıq prinsipi ilə cütləşir: Adenin yalnız Timinlə (2 hidrogen rabitəsi), Quanin isə Sitozinlə (3 hidrogen rabitəsi) birləşir (A=T, Q≡S).",
        realWorldImpact: "Məhkəmə genetikasında DNT testi, atalıq analizi, irsi xəstəliklərin sekvensiyası və müasir biotexnologiya.",
        curriculumConnection: "9-10-cu sinif Biologiya qəbul imtahanlarının ən fundamental mövzusudur: Çarqaff qaydası (A+Q = T+S), hidrogen rabitələrinin sayı və replikasiya məsələləri.",
        funFacts: [
          "İnsan bədənindəki bütün hüceyrələrin DNT-sini uc-uca calasaq, uzunluğu Günəşə gedib qayıtmaq məsafəsindən (təxminən 20 milyard km) çox olar!",
          "Rozalind Franklin Nobel mükafatı verilməmişdən əvvəl xərçəngdən vəfat etdiyi üçün mükafata daxil edilmədi (Nobel yalnız yaşayanlara verilir)."
        ]
      },
      en: {
        title: "The DNA Double Helix Discovery",
        summary: "Watson, Crick, and Franklin unravelling the complementary spiral geometry encoding all life (1962 Nobel Prize).",
        ahaMoment: "Rosalind Franklin's 'Photo 51' X-ray diffraction clearly proved a helical structure with bases paired inside.",
        howItWorks: "Antiparallel sugar-phosphate backbones flank complementary nitrogenous base pairs held by hydrogen bonds (A=T, G≡C).",
        realWorldImpact: "Forensic DNA profiling, whole-genome sequencing, gene therapy, and molecular medicine.",
        curriculumConnection: "Core curriculum: Chargaff's rules, hydrogen bond quantification, and semiconservative replication.",
        funFacts: [
          "Unwound DNA from all cells in an adult human would stretch to Pluto and back."
        ]
      },
      tr: {
        title: "DNA Çift Sarmal Modeli",
        summary: "Watson, Crick ve Rosalind Franklin'in yaşamın genetik şifresini çözen tarihi keşfi ve 1962 Nobel Tıp Ödülü.",
        ahaMoment: "Fotoğraf 51'deki X-ışını kırınımı sayesinde bazların birbirini tamamlayan çift sarmal oluşturduğu çözüldü.",
        howItWorks: "Antiparalel zincirler, hidrojen bağlarıyla birbirine bağlanan tamamlayıcı baz çiftlerinden (A=T, G≡C) oluşur.",
        realWorldImpact: "Adli tıp DNA testleri, genetik hastalık haritaları ve biyoteknolojik ilaç üretimi.",
        curriculumConnection: "Biyoloji müfredatının en önemli konusu: Chargaff kuralı, nükleotit yapısı ve replikasyon.",
        funFacts: [
          "Tek bir insan vücudundaki tüm DNA'lar uç uca eklense Güneş sistemini aşacak uzunluğa ulaşır."
        ]
      },
      ru: {
        title: "Двойная спираль ДНК",
        summary: "Открытие пространственной структуры ДНК Уотсоном, Криком и Франклинд, раскрывшее тайну копирования жизни (Нобелевская премия 1962).",
        ahaMoment: "Знаменитая «Фотография 51» рентгеноструктурного анализа показала крестообразный дифракционный рисунок спирали.",
        howItWorks: "Две антипараллельные полинуклеотидные цепи связаны водородными связями по принципу комплементарности: А=Т и Г≡Ц.",
        realWorldImpact: "ДНК-дактилоскопия, расшифровка генома человека, синтетическая биология.",
        curriculumConnection: "Школьный курс: правило Чаргаффа, нуклеотиды, репликация ДНК, водородные связи.",
        funFacts: [
          "Если распутать молекулы ДНК всех клеток одного человека, их длина превысит расстояние от Земли до Плутона."
        ]
      }
    },
    quiz: [
      {
        id: "dna-q1",
        question: "DNT molekulunda Quanin və Sitozin nukleotidləri arasında neçə hidrogen rabitəsi yaranır?",
        options: [
          { id: "A", text: "3 hidrogen rabitəsi" },
          { id: "B", text: "2 hidrogen rabitəsi" },
          { id: "C", text: "1 kovalent rabitə" },
          { id: "D", text: "4 ion rabitəsi" }
        ],
        correctOption: "A",
        explanation: "Komplementarlıq qaydasına görə Adeninlə Timin arasında 2, Quaninlə Sitozin arasında isə 3 hidrogen rabitəsi mövcuddur.",
        bloomLevel: "Bilik"
      },
      {
        id: "dna-q2",
        question: "DNT zəncirində Adenin nukleotidlərinin sayı 200, Quanin nukleotidlərinin sayı 300 olarsa, cəmi neçə nukleotid var?",
        options: [
          { id: "A", text: "1000 nukleotid (A=T=200, Q=S=300)" },
          { id: "B", text: "500 nukleotid" },
          { id: "C", text: "1500 nukleotid" },
          { id: "D", text: "2000 nukleotid" }
        ],
        correctOption: "A",
        explanation: "Çarqaff qaydasına görə A=T=200, Q=S=300. Cəmi nukleotid sayı = 200 + 200 + 300 + 300 = 1000 təşkil edir.",
        bloomLevel: "Tətbiq"
      },
      {
        id: "dna-q3",
        question: "Rozalind Franklinin DNT-nin kəşfindəki həlledici eksperimental töhfəsi nə idi?",
        options: [
          { id: "A", text: "Foto 51 adlı məşhur rentgen-struktur difraksiya şəklini çəkməsi" },
          { id: "B", text: "İlk klonlaşdırılmış qoyunu yaratması" },
          { id: "C", text: "Bütün xromosomları rəngləməsi" },
          { id: "D", text: "DNT-ni hüceyrədən kənarda sintez etməsi" }
        ],
        correctOption: "A",
        explanation: "Franklinin kristallaşmış DNT üzərində çəkdiyi 'Foto 51' spiralın diametrini və qatlarının bucağını göstərən əsas sübut oldu.",
        bloomLevel: "Anlama"
      }
    ]
  },
  {
    id: "mendeleev-periodic-table",
    slug: "mendeleev-periodic-law-chemical-elements",
    category: "kimya",
    isNobel: false,
    discoveryYear: 1869,
    discoverer: "Dmitri Mendeleyev",
    curriculumSubject: "Kimya",
    curriculumGrade: "7-8-ci sinif",
    curriculumTopic: "Dövri qanun, elementlərin dövri sistemi, qruplar və dövrlər",
    icon: "TableProperties",
    accentColor: "from-blue-500 to-indigo-600",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "D.İ. Mendeleyevin Dövri Qanunu və Elementlərin Cədvəli",
        summary: "Kainatın bütün maddələrini bir nizamda birləşdirən və hələ kəşf olunmamış elementləri əvvəlcədən proqnozlaşdıran kimyanın ana xəritəsi.",
        ahaMoment: "Mendeleyev kartlara 63 məlum elementin xassələrini yazıb masasının üstündə saatlarla 'solityor' oynayırdı. O gördü ki, elementləri atom çəkilərinin artması sırası ilə düzdükdə onların kimyəvi xassələri müəyyən intervalla dövri olaraq təkrarlanır. Ən böyük dahilik isə o idi ki, cədvəldə bəzi yerləri boş qoyaraq bəyan etdi: 'Bura hələ tapılmamış elementlər gələcək' (məs. eka-alüminium/qallium və eka-silisium/germanium).",
        howItWorks: "Elementlərin və onların birləşmələrinin forma və xassələri atom nüvələrinin yükünün (proton sayının) artmasından dövri asılıdır. Cədvəldə dövrlər elektron təbəqələrinin sayını, əsas yarımqruplar isə xarici energetik səviyyədəki valent elektronların sayını göstərir.",
        realWorldImpact: "Yeni ərintilərin yaradılması, yarımkeçiricilərin tapılması və sintetik radioaktiv elementlərin (118-ci Oqanesona qədər) proqnozlaşdırılması.",
        curriculumConnection: "7-ci və 8-ci sinif Kimya dərsliklərinin təməl sütunu: Dövr və qruplar üzrə metallıq/qeyri-metallıq, elektromənfilik və atom radiusunun dəyişməsi qanunauyğunluqları.",
        funFacts: [
          "Mendeleyevin qabaqcadan təsvir etdiyi 'eka-alüminium' bir neçə il sonra fransız kimyaçı Lekok de Buabodran tərəfindən kəşf edildi və 'Qallium' adlandırıldı – onun xassələri Mendeleyevin yazdığı ilə 100% üst-üstə düşdü!",
          "101-ci kimyəvi element onun şərəfinə 'Mendeleyevium' (Md) adlandırılmışdır."
        ]
      },
      en: {
        title: "Mendeleev's Periodic Law and Table of Elements",
        summary: "The organizing roadmap of chemistry that brought order to elements and accurately predicted undiscovered matter.",
        ahaMoment: "Mendeleev arranged elements by atomic weights and noticed repeating periodic valencies, boldly leaving gaps for future elements.",
        howItWorks: "Chemical properties recur periodically based on atomic nuclear charge (atomic number Z) and valence electron configurations.",
        realWorldImpact: "Guides all materials science, drug design, semiconductor engineering, and nuclear chemistry.",
        curriculumConnection: "Core 8th-grade chemistry: electronegativity trends, ionization energy, and atomic radius variations across periods and groups.",
        funFacts: [
          "He accurately predicted the boiling points, densities, and oxide formulas of gallium and germanium before their discovery."
        ]
      },
      tr: {
        title: "Mendeleyev'in Periyodik Tablosu",
        summary: "Tüm kimyasal elementleri kusursuz bir düzene sokan ve keşfedilmemiş elementleri önceden tahmin eden ana harita.",
        ahaMoment: "Mendeleyev bilinen 63 elementi atom ağırlıklarına göre dizerken tablosunda boşluklar bırakıp geleceğin elementlerini tarif etti.",
        howItWorks: "Elementlerin özellikleri çekirdek yükünün (proton sayısı) artışına ve değerlik elektron dizilimine periyodik olarak bağlıdır.",
        realWorldImpact: "Yeni alaşımlar, yarı iletkenler ve sentetik elementlerin keşfedilmesine rehberlik eder.",
        curriculumConnection: "Kimya müfredatının temeli: periyot ve gruplarda elektronegatiflik, iyonlaşma enerjisi ve atom yarıçapı değişimleri.",
        funFacts: [
          "Henüz bulunmamışken tarif ettiği 'Eka-alüminyum' daha sonra Galyum olarak keşfedildi ve tüm özellikleri tuttu."
        ]
      },
      ru: {
        title: "Периодический закон Д.И. Менделеева",
        summary: "Фундаментальный закон природы, систематизировавший все химические элементы и предсказавший неизвестные вещества.",
        ahaMoment: "Менделеев заметил периодичность химических свойств и оставил пустые клетки в таблице, предсказав галлий, скандий и германий.",
        howItWorks: "Свойства элементов зависят от заряда атомного ядра, определяющего конфигурацию внешних валентных электронов.",
        realWorldImpact: "Основа современного материаловедения, металлургии, фармацевтики и физики полупроводников.",
        curriculumConnection: "Школьный курс: периоды, группы, закономерности изменения радиуса атома, электроотрицательности и металлических свойств.",
        funFacts: [
          "Элемент №101 назван в его честь менделевием."
        ]
      }
    },
    quiz: [
      {
        id: "mend-q1",
        question: "Dövr üzrə soldan sağa doğru getdikcə elementlərin atom radiusu və elektromənfiliyi necə dəyişir?",
        options: [
          { id: "A", text: "Atom radiusu azalır, elektromənfilik isə artır" },
          { id: "B", text: "Hər ikisi artır" },
          { id: "C", text: "Hər ikisi azalır" },
          { id: "D", text: "Heç bir dəyişiklik baş vermir" }
        ],
        correctOption: "A",
        explanation: "Dövr üzrə nüvə yükü artdıqca elektronlar nüvəyə daha güclü cəzb olunur (radius kiçilir), xarici elektronları cəzbetmə qabiliyyəti (elektromənfilik) isə yüksəlir.",
        bloomLevel: "Anlama"
      },
      {
        id: "mend-q2",
        question: "Dövri cədvəldə qrup nömrəsi əsas yarımqrup elementləri üçün nəyi göstərir?",
        options: [
          { id: "A", text: "Xarici energetik səviyyədəki valent elektronlarının sayını" },
          { id: "B", text: "Elementin atom çəkisini" },
          { id: "C", text: "Nüvədəki neytronların sayını" },
          { id: "D", text: "Elektron təbəqələrinin sayını" }
        ],
        correctOption: "A",
        explanation: "Əsas yarımqruplarda qrup nömrəsi xarici elektronların (valent elektronlarının) sayına bərabərdir. Elektron təbəqələrinin sayını isə dövrün nömrəsi göstərir.",
        bloomLevel: "Bilik"
      },
      {
        id: "mend-q3",
        question: "Mendeleyevin dövri cədvəli tərtib edərkən atdığı ən cəsarətli və dahi addım nə idi?",
        options: [
          { id: "A", text: "Cədvəldə hələ kəşf olunmamış elementlər üçün boş yerlər qoyaraq onların xassələrini əvvəlcədən təsvir etməsi" },
          { id: "B", text: "Bütün metalları cədvəldən çıxarması" },
          { id: "C", text: "Yalnız qaz halında olan maddələri yazması" },
          { id: "D", text: "Elementlərin adlarını gizlətməsi" }
        ],
        correctOption: "A",
        explanation: "Mendeleyev bəzi yerləri boş qoyaraq onların atom kütləsini və xassələrini dəqiqliklə proqnozlaşdırdı; sonralar kəşf edilən qallium və germanium onun haqlı olduğunu sübut etdi.",
        bloomLevel: "Təhlil"
      }
    ]
  },
  {
    id: "archimedes-principle-buoyancy",
    slug: "archimedes-principle-hydrostatic-buoyancy",
    category: "fizika",
    isNobel: false,
    discoveryYear: "e.ə. 250",
    discoverer: "Arximed (Archimedes)",
    curriculumSubject: "Fizika",
    curriculumGrade: "7-ci sinif",
    curriculumTopic: "Maye və qazlarda təzyiq, Arximed qaldırıcı qüvvəsi və cisimlərin üzmə şərtləri",
    icon: "Waves",
    accentColor: "from-sky-500 to-blue-700",
    readTime: "5 dəq",
    translations: {
      az: {
        title: "Arximed Qanunu və Qaldırıcı Qüvvə: 'Evrika!'",
        summary: "Vannadan küçəyə qaçan antik dahinin kəşfi: min tonluq polad gəmilərin suda necə üzdüyünün fiziki sirri.",
        ahaMoment: "Sirakuza çarı Hieron Arximedə qızıl tacının təmiz qızıldan, yoxsa gümüş qarışıqlı olduğunu taca zərər vurmadan yoxlamağı tapşırmışdı. Su ilə dolu vannaya girəndə suyun daşdığını görən Arximed başa düşdü: bədənin həcmi sıxışdırılıb çıxarılan suyun həcminə bərabərdir! O, sevincindən 'Evrika!' (Tapdım!) qışqıraraq küçəyə qaçmışdı.",
        howItWorks: "Mayeyə (və ya qaza) batırılmış cismə maye tərəfindən şaquli yuxarı yönəlmiş qaldırıcı qüvvə təsir edir. Bu qüvvə cismin batmış hissəsinin sıxışdırıb çıxardığı mayenin ağırlığına bərabərdir: F_A = ρ_maye * g * V_batan.",
        realWorldImpact: "Nəhəng yük gəmiləri, sualtı qayıqlar, hava şarları və hidrometrlər.",
        curriculumConnection: "7-ci sinif Fizika dərsliyinin ən vacib bölməsi: Cisimlərin üzmə şərtləri (ρ_cisim < ρ_maye olduqda üzür, bərabər olduqda asılı qalır, böyük olduqda batır).",
        funFacts: [
          "Poladın sıxlığı sudan təxminən 8 dəfə çoxdur, lakin gəminin içi hava ilə dolu olduğundan onun orta sıxlığı suyun sıxlığından az olur və gəmi batmır."
        ]
      },
      en: {
        title: "Archimedes' Principle and Buoyancy",
        summary: "The legendary 'Eureka!' discovery revealing why multi-ton steel ocean liners float.",
        ahaMoment: "Stepping into a bath, Archimedes realized the displaced water volume equaled the submerged body's volume.",
        howItWorks: "Any object immersed in a fluid experiences an upward buoyant force equal to the weight of fluid displaced: F = ρ * g * V.",
        realWorldImpact: "Naval architecture, cargo ships, submarines, hot-air balloons, and hydrometers.",
        curriculumConnection: "Fundamental 7th-grade physics: floating, sinking, and neutral buoyancy criteria.",
        funFacts: [
          "Solid steel sinks, but a hollow steel ship hull floats because its average density is lower than water."
        ]
      },
      tr: {
        title: "Arşimet Kanunu ve Sıvıların Kaldırma Kuvveti",
        summary: "Hamamdan 'Evreka!' diyerek koşan antik dehanın keşfi: dev çelik gemilerin yüzme sırrı.",
        ahaMoment: "Kralın tacındaki hileyi bulmak için küvete giren Arşimet, taşan suyun hacminin batan hacme eşit olduğunu gördü.",
        howItWorks: "Sıvı içine batan cisme, taşırdığı sıvının ağırlığı kadar yukarı doğru bir kaldırma kuvveti etki eder: F = d * g * V.",
        realWorldImpact: "Gemi inşa sanayisi, denizaltılar, zeplinler ve sıcak hava balonları.",
        curriculumConnection: "Ortaokul 7. sınıf fizik: yüzme, batma ve askıda kalma koşulları.",
        funFacts: [
          "Çeliğin yoğunluğu sudan 8 kat fazla olmasına rağmen içi hava dolu gemiler rahatlıkla yüzer."
        ]
      },
      ru: {
        title: "Закон Архимеда и выталкивающая сила",
        summary: "Легендарное открытие «Эврика!», объясняющее, почему плавают многотонные стальные корабли.",
        ahaMoment: "Погрузившись в ванну, Архимед понял, что объем вытесненной воды равен объему погруженного тела.",
        howItWorks: "На тело, погруженное в жидкость или газ, действует выталкивающая сила, равная весу вытесненного объема жидкости: F = ρ * g * V.",
        realWorldImpact: "Судостроение, подводные лодки, аэростаты и ареометры.",
        curriculumConnection: "Курс физики 7 класса: сила Архимеда, условия плавания тел, плотность веществ.",
        funFacts: [
          "Сталь тонет в воде, но стальной корабль с воздушным объемом имеет среднюю плотность меньше плотности воды."
        ]
      }
    },
    quiz: [
      {
        id: "arch-q1",
        question: "Arximed qaldırıcı qüvvəsinin düsturu hansı variantda düzgün göstərilmişdir?",
        options: [
          { id: "A", text: "F_A = ρ_maye * g * V_batan" },
          { id: "B", text: "F_A = m * a" },
          { id: "C", text: "F_A = k * x" },
          { id: "D", text: "F_A = G * m1 * m2 / r²" }
        ],
        correctOption: "A",
        explanation: "Arximed qüvvəsi mayenin sıxlığı (ρ_maye), sərbəstdüşmə təcili (g) və cismin mayeyə batmış həcminin (V_batan) hasilinə bərabərdir.",
        bloomLevel: "Bilik"
      },
      {
        id: "arch-q2",
        question: "Cismin mayedə üzməsi (batmaması) üçün onun sıxlığı ilə mayenin sıxlığı arasında hansı münasibət olmalıdır?",
        options: [
          { id: "A", text: "Cismin sıxlığı mayenin sıxlığından kiçik olmalıdır (ρ_cisim < ρ_maye)" },
          { id: "B", text: "Cismin sıxlığı mayenin sıxlığından iki dəfə böyük olmalıdır" },
          { id: "C", text: "Mayenin temperaturu 0 dərəcə olmalıdır" },
          { id: "D", text: "Yalnız vakuumda olmalıdır" }
        ],
        correctOption: "A",
        explanation: "Əgər cismin sıxlığı mayenin sıxlığından kiçikdirsə, ağırlıq qüvvəsi qaldırıcı qüvvədən az olur və cisim maye səthinə qalxaraq üzür.",
        bloomLevel: "Anlama"
      },
      {
        id: "arch-q3",
        question: "Sualtı qayıq suyun dibinə enmək və ya səthə qalxmaq üçün hansı mexanizmdən istifadə edir?",
        options: [
          { id: "A", text: "Ballast çənlərinə su dolduraraq orta sıxlığını artırır və ya suyu hava ilə sıxışdırıb yüngülləşir" },
          { id: "B", text: "Qayıq pervanesini tərsinə fırladır" },
          { id: "C", text: "Qayığın ölçüsünü kiçildir" },
          { id: "D", text: "Suyun kimyəvi tərkibini dəyişir" }
        ],
        correctOption: "A",
        explanation: "Qayıq çənlərə su yığdıqda onun ümumi kütləsi və orta sıxlığı suyun sıxlığından çox olur və batır; suyu hava ilə çıxardıqda isə yüngülləşib səthə qalxır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "newton-laws-gravitation",
    slug: "newton-laws-of-motion-universal-gravitation",
    category: "fizika",
    isNobel: false,
    discoveryYear: 1687,
    discoverer: "Ser İsaak Nyuton",
    curriculumSubject: "Fizika",
    curriculumGrade: "7-9-cu sinif",
    curriculumTopic: "Nyutonun hərəkət qanunları, qüvvə, impuls və Ümumdünya cazibə qanunu",
    icon: "Apple",
    accentColor: "from-red-500 to-rose-700",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "Nyutonun Hərəkət Qanunları və Ümumdünya Cazibəsi",
        summary: "Alma ağacından düşən almadan planetlərin orbitinə qədər: klassik mexanikanın təməlini qoyan dahi qanunlar.",
        ahaMoment: "Vəba epidemiyası zamanı Kembric Universitetindən kənd evinə çəkilən 23 yaşlı Nyuton bağda ağacdan almanın yerə düşməsini seyr edərkən düşündü: almanı yerə çəkən qüvvə niyə uzaqdakı Aya da təsir etməsin? O hesabladı ki, almanı yerə salan cazibə qüvvəsi ilə Ayı Yerin ətrafında saxlayan qüvvə tam eyni riyazi cazibə qanunudur!",
        howItWorks: "Klassik mexanika üç qanuna söykənir: 1) Ətalət qanunu, 2) Dinamikanın əsas qanunu (F = ma), 3) Təsir və əks-təsir qanunu (F₁ = -F₂). Ümumdünya cazibə qanununa görə iki cisim kütlələrinin hasili ilə düz, aralarındakı məsafənin kvadratı ilə tərs mütənasib qüvvə ilə bir-birini cəzb edir: F = G * m₁m₂ / r².",
        realWorldImpact: "Raketlərin kosmosa buraxılması, süni peyklərin orbitləri, körpü və göydələnlərin mühəndislik hesablamaları.",
        curriculumConnection: "7-9-cu sinif Fizikanın onurğa sütunu: Mexanika, Dinamika, Təcil, İmpuls və Ağırlıq qüvvəsi məsələləri.",
        funFacts: [
          "Nyuton cazibə qanununu tam formalaşdırmaq üçün bu gün bütün dünyada istifadə olunan 'Diferensial və İnteqral Hesabını' (Riyazi analizi) özü icad etməli olmuşdu."
        ]
      },
      en: {
        title: "Newton's Laws of Motion and Universal Gravitation",
        summary: "From a falling apple to planetary orbits: the foundational laws of classical mechanics.",
        ahaMoment: "Quarantined during the Great Plague, young Newton realized the force pulling an apple downwards also binds the Moon in orbit.",
        howItWorks: "Governed by inertia, F=ma, action-reaction, and universal gravitational attraction F = G * m1*m2 / r^2.",
        realWorldImpact: "Orbital mechanics, space travel, civil structural engineering, and automotive safety.",
        curriculumConnection: "The bedrock of secondary physics: kinematics, dynamics, free-fall, and satellite velocity.",
        funFacts: [
          "Newton had to invent calculus from scratch to mathematically prove planetary orbital motions."
        ]
      },
      tr: {
        title: "Newton'un Hareket Yasaları ve Evrensel Çekim",
        summary: "Düşen elmadan gezegenlerin yörüngesine: klasik mekaniğin kurucu yasaları.",
        ahaMoment: "Veba karantinasında elmanın yere düşüşünü izleyen Newton, Ay'ı yörüngede tutan kuvvetin aynı çekim olduğunu fark etti.",
        howItWorks: "Eylemsizlik, F=ma, etki-tepki ve kütleçekim yasası: F = G * m1*m2 / r².",
        realWorldImpact: "Roket fırlatmaları, yapay uydular, köprü mühendisliği ve otomotiv güvenliği.",
        curriculumConnection: "Fizik dersinin omurgası: dinamik, ivme, serbest düşme ve yerçekimi problemleri.",
        funFacts: [
          "Newton çekim yasasını kanıtlayabilmek için kalkülüsü (türev ve integrali) sıfırdan icat etti."
        ]
      },
      ru: {
        title: "Законы движения и тяготения Ньютона",
        summary: "От падающего яблока до орбит планет: фундамент классической механики.",
        ahaMoment: "Во время чумного карантина Ньютон осознал, что сила, притягивающая яблоко к земле, удерживает и Луну на орбите.",
        howItWorks: "Три закона Ньютона (инерция, F=ma, действие-противодействие) и закон всемирного тяготения F = G * m1*m2 / r².",
        realWorldImpact: "Космонавтика, расчет траекторий ракет и спутников, строительная механика.",
        curriculumConnection: "Основа школьной физики 7-9 классов: кинематика, динамика, импульс, ускорение свободного падения.",
        funFacts: [
          "Чтобы доказать законы тяготения, Ньютону пришлось самостоятельно создать дифференциальное и интегральное исчисление."
        ]
      }
    },
    quiz: [
      {
        id: "newt-q1",
        question: "Nyutonun üçüncü qanununa (təsir və əks-təsir) görə iki qarşılıqlı təsirdə olan qüvvə necə xarakterizə olunur?",
        options: [
          { id: "A", text: "Modulca bərabər, istiqamətcə əksdir və fərqli cisimlərə tətbiq olunur" },
          { id: "B", text: "Həmişə eyni cismə tətbiq olunur və bir-birini sıfırlayır" },
          { id: "C", text: "Biri həmişə digərindən iki dəfə böyük olur" },
          { id: "D", text: "Yalnız cisimlər sükunətdə olanda yaranır" }
        ],
        correctOption: "A",
        explanation: "Nyutonun 3-cü qanununa görə qüvvələr həmişə cüt yaranır, modulları bərabər, istiqamətləri əksdir (F₁ = -F₂) və fərqli cisimlərə tətbiq olunur.",
        bloomLevel: "Anlama"
      },
      {
        id: "newt-q2",
        question: "İki cisim arasındakı məsafə 3 dəfə artırılarsa, onların arasındakı qravitasiya cazibə qüvvəsi necə dəyişər?",
        options: [
          { id: "A", text: "9 dəfə azalar" },
          { id: "B", text: "3 dəfə azalar" },
          { id: "C", text: "9 dəfə artar" },
          { id: "D", text: "Dəyişməz qalar" }
        ],
        correctOption: "A",
        explanation: "Ümumdünya cazibə qanununda qüvvə məsafənin kvadratı ilə tərs mütənasibdir (F ~ 1/r²). Məsafə 3 dəfə artdıqda qüvvə 3² = 9 dəfə azalar.",
        bloomLevel: "Tətbiq"
      },
      {
        id: "newt-q3",
        question: "Cismə təsir edən əvəzləyici qüvvə sıfıra bərabər olduqda cisim hansı hərəkəti edir?",
        options: [
          { id: "A", text: "Ya sükunətdə qalar, ya da düzxətli bərabərsürətli hərəkət edər (Nyutonun 1-ci qanunu)" },
          { id: "B", text: "Bərabərtəcilli sürətlənən hərəkət edər" },
          { id: "C", text: "Dairəvi fırlanma hərəkəti edər" },
          { id: "D", text: "Dərhal parçalanar" }
        ],
        correctOption: "A",
        explanation: "Nyutonun 1-ci qanununa (ətalət prinsipi) görə xarici qüvvə təsir etmədikdə və ya qüvvələr bərabərləşdikdə cisim öz ilkin sükunət və ya bərabərsürətli hərəkət halını saxlayır.",
        bloomLevel: "Bilik"
      }
    ]
  },
  {
    id: "faraday-electromagnetic-induction",
    slug: "faraday-electromagnetic-induction-electric-generators",
    category: "fizika",
    isNobel: false,
    discoveryYear: 1831,
    discoverer: "Maykl Faradey (Michael Faraday)",
    curriculumSubject: "Fizika",
    curriculumGrade: "8-11-ci sinif",
    curriculumTopic: "Elektromaqnit induksiyası, maqnit seli, Lents qaydası və generatorlar",
    icon: "Zap",
    accentColor: "from-amber-600 to-yellow-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Maykl Faradey və Elektromaqnit İnduksiyası: İşıqlı Sivilizasiya",
        summary: "Maqnit hərəkətindən elektrik cərəyanı almaq: müasir elektrik stansiyalarının və elektrik mühərriklərinin anası olan kəşf.",
        ahaMoment: "Ersted aşkar etmişdi ki, elektrik cərəyanı maqnit əqrəbini tərpədir (cərəyan maqnit sahəsi yaradır). Faradey 10 il düşündü: əgər elektrikdən maqnetizm yaranırsa, maqnitdən də elektrik almaq olarmı? 1831-ci ildə o, sarğacın içinə maqniti daxil edib-çıxararkən qalvanometrin əqrəbinin tərpəndiyini gördü: hərəkət edən maqnit naqildə elektrik cərəyanı doğururdu!",
        howItWorks: "Qapalı keçirici konturdan keçən maqnit seli zamana görə dəyişdikdə konturda induksiya elektrik hərəkət qüvvəsi (EHQ) yaranır: ε = -ΔΦ / Δt. Lents qaydasına görə induksiya cərəyanı elə istiqamətlənir ki, onun yaratdığı maqnit sahəsi onu doğuran maqnit selinin dəyişməsinə əks təsir göstərir.",
        realWorldImpact: "Su, istilik və atom elektrik stansiyalarının generatorları, transformatorlar, induksiya plitələri və elektromobillərin mühərrikləri.",
        curriculumConnection: "8-ci və 11-ci sinif Fizika proqramının ən vacib mövzusu: Faradey qanunu, Maqnit seli (Φ = BScosα) və Dəyişən cərəyan generatoru.",
        funFacts: [
          "Böyük Britaniyanın Maliyyə naziri Faradeydən soruşanda ki, 'Bu kəşfiniz nəyə faydalıdır?', dahi alim cavab vermişdi: 'Ser, tezliklə siz bundan vergi yığacaqsınız!'."
        ]
      },
      en: {
        title: "Michael Faraday and Electromagnetic Induction",
        summary: "Generating electricity from magnetic motion: the foundation of power grids and electric dynamos.",
        ahaMoment: "Faraday inverted Oersted's discovery, showing a moving magnet inside a copper wire coil induces electric current.",
        howItWorks: "Changing magnetic flux induces electromotive force (EMF) according to Faraday's Law: ε = -dΦ/dt, governed by Lenz's rule.",
        realWorldImpact: "Hydroelectric and nuclear turbine generators, transformers, induction cooktops, and electric motors.",
        curriculumConnection: "Crucial secondary physics topic: magnetic flux, induced EMF, and alternating current production.",
        funFacts: [
          "When asked about the practical value of induction, Faraday famously replied: 'One day, sir, you may tax it!'"
        ]
      },
      tr: {
        title: "Faraday ve Elektromanyetik İndüksiyon",
        summary: "Mıknatıs hareketinden elektrik üretmek: modern elektrik santrallerinin ve jeneratörlerin doğuşu.",
        ahaMoment: "Faraday, bir bobinin içine mıknatıs sokup çıkardığında telden elektrik akımı geçtiğini kanıtladı.",
        howItWorks: "Manyetik akı değişimi devrede indüksiyon elektromotor kuvveti (EMK) oluşturur: ε = -ΔΦ / Δt.",
        realWorldImpact: "Tüm baraj ve nükleer santral jeneratörleri, elektrik motorları ve transformatörler.",
        curriculumConnection: "Fizik müfredatında manyetik akı, Faraday yasası ve Lenz kuralı kazanımlarının temelidir.",
        funFacts: [
          "İngiliz Maliye Bakanı bu keşfin ne işe yarayacağını sorduğunda Faraday 'Bir gün bundan vergi alacaksınız' demiştir."
        ]
      },
      ru: {
        title: "Электромагнитная индукция Майкла Фарадея",
        summary: "Превращение магнетизма в электричество: рождение электрогенераторов и современной энергетической цивилизации.",
        ahaMoment: "Фарадей обнаружил, что при движении постоянного магнита внутри проволочной катушки в цепи возникает электрический ток.",
        howItWorks: "Закон Фарадея: ЭДС индукции прямо пропорциональна скорости изменения магнитного потока через контур (ε = -ΔΦ/Δt).",
        realWorldImpact: "Все гидро- и турбогенераторы электростанций мира, трансформаторы, электромоторы и индукционные плиты.",
        curriculumConnection: "Школьный курс: магнитный поток, закон Фарадея, правило Ленца, переменный ток.",
        funFacts: [
          "На вопрос министра о практической пользе Фарадей ответил: «Сэр, очень скоро вы будете облагать это налогом!»."
        ]
      }
    },
    quiz: [
      {
        id: "far-q1",
        question: "Qapalı konturda induksiya cərəyanının yaranması üçün hansı başlıca şərt ödənməlidir?",
        options: [
          { id: "A", text: "Konturdan keçən maqnit selinin zamana görə dəyişməsi" },
          { id: "B", text: "Maqnitin qızdırılaraq əridilməsi" },
          { id: "C", text: "Naqilin mütləq gümüşdən hazırlanması" },
          { id: "D", text: "Otağın tam qaranlıq olması" }
        ],
        correctOption: "A",
        explanation: "İnduksiya cərəyanı yalnız maqnit seli dəyişdikdə (ΔΦ ≠ 0) yaranır. Maqnit hərəkətsiz qalarsa, heç bir cərəyan yaranmaz.",
        bloomLevel: "Anlama"
      },
      {
        id: "far-q2",
        question: "Lents qaydası induksiya cərəyanının hansı xüsusiyyətini təyin edir?",
        options: [
          { id: "A", text: "İnduksiya cərəyanının istiqamətini" },
          { id: "B", text: "Yalnız naqilin kütləsini" },
          { id: "C", text: "İşıq sürətini" },
          { id: "D", text: "Elektronların yükünün işarəsini" }
        ],
        correctOption: "A",
        explanation: "Lents qaydası induksiya cərəyanının istiqamətini müəyyən edir: o, özünün yaratdığı maqnit sahəsi ilə xarici seli dəyişməyə qoymamağa çalışır.",
        bloomLevel: "Bilik"
      },
      {
        id: "far-q3",
        question: "Bütün su və istilik elektrik stansiyalarında generatorların iş prinsipi hansı qanuna əsaslanır?",
        options: [
          { id: "A", text: "Faradeyin elektromaqnit induksiyası qanununa" },
          { id: "B", text: "Arximed qanununa" },
          { id: "C", text: "Paskal qanununa" },
          { id: "D", text: "Boyl-Mariott qanununa" }
        ],
        correctOption: "A",
        explanation: "Generatorlarda turbin maqnit sahəsində böyük sarğacları fırladır və Faradey qanununa əsasən fırlanma mexaniki enerjisi elektrik cərəyanına çevrilir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "turing-machine-computation",
    slug: "alan-turing-turing-machine-computability-informatics",
    category: "informatika",
    isNobel: false,
    discoveryYear: 1936,
    discoverer: "Alan Türinq (Alan Turing)",
    curriculumSubject: "İnformatika / Riyaziyyat",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Alqoritm anlayışı, icraçılar, universal kompüter modeli və Türinq testi",
    icon: "Cpu",
    accentColor: "from-blue-600 to-cyan-700",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "Alan Türinq və Türinq Maşını: Kompüter Əsrinin Doğulması",
        summary: "Hələ ilk elektron kompüter mövcud olmadan əvvəl, istənilən riyazi alqoritmi həll edə bilən universal maşının nəzəri kəşfi.",
        ahaMoment: "1936-cı ildə 24 yaşlı Alan Türinq riyaziyyatçı Hilbertin 'Qərarvermə problemi'ni (Entscheidungsproblem) həll etmək üçün xəyali bir cihaz düşündü: sonsuz lent, simvolları oxuyub-yazan başlıq və daxili hallar cədvəli. O sübut etdi ki, əgər bir problem alqoritmik yolla həll oluna bilirsə, onu bu sadə maşınla hesablamaq mümkündür!",
        howItWorks: "Türinq maşını diskret addımlarla işləyir: lentdəki cari simvolu oxuyur, qaydalar cədvəlinə əsasən yeni simvol yazır, başlığı sola və ya sağa hərəkət etdirir və yeni daxili hala keçir. Universal Türinq Maşını (UTM) proqramı və verilənləri eyni yaddaşda saxlayan bütün müasir kompüterlərin (Fon Neyman arxitekturasının) riyazi prototipidir.",
        realWorldImpact: "Müasir proqramlaşdırma dilləri, əməliyyat sistemləri, İkinci Dünya Müharibəsində Eniqma şifrəsinin qırılması və Süni İntellekt (Türinq Testi).",
        curriculumConnection: "9-11-ci sinif İnformatika dərsliyində 'Alqoritm və onun xassələri (diskretlik, müəyyənlik, kütləvilik, nəticəvilik)' mövzusunun ən yüksək elmi təməlidir.",
        funFacts: [
          "Türinqin 'Bomba' adlı elektro-mexaniki maşını nasist Almaniyasının 'Eniqma' hərbi şifrəsini qıraraq İkinci Dünya Müharibəsini 2 il qısaltdı və 14 milyon insanın həyatını xilas etdi.",
          "Kompüter elmləri üzrə ən ali beynəlxalq mükafat 'Türinq Mükafatı' (Kompüter elmlərinin Nobeli) adlanır."
        ]
      },
      en: {
        title: "Alan Turing and the Universal Turing Machine",
        summary: "Conceiving the theoretical foundations of modern computer science and artificial intelligence before hardware existed.",
        ahaMoment: "Turing proved mathematically what can and cannot be computed using a simple infinite tape and read-write head.",
        howItWorks: "Processes symbols across discrete computational states, proving algorithmic equivalence for all modern computing machines.",
        realWorldImpact: "Underpins all software, programming languages, the Enigma codebreak, and the Turing Test for AI cognition.",
        curriculumConnection: "Core computer science curricula: algorithm properties, computational complexity, and automation.",
        funFacts: [
          "Turing's codebreaking at Bletchley Park shortened World War II by an estimated two years, saving millions of lives."
        ]
      },
      tr: {
        title: "Alan Turing ve Evrensel Turing Makinesi",
        summary: "Henüz hiçbir elektronik bilgisayar yokken modern bilişimin ve yapay zekanın temellerini atan matematiksel deha.",
        ahaMoment: "Sonsuz bir şerit ve okuma kafasıyla tüm algoritmik problemlerin çözülebileceğini matematiksel olarak kanıtladı.",
        howItWorks: "Sembolleri kurallar tablosuna göre adım adım işleyerek modern programlanabilir bilgisayarların modelini kurdu.",
        realWorldImpact: "Yazılım dilleri, Enigma şifresinin kırılması ve yapay zeka Turing Testi.",
        curriculumConnection: "Bilişim dersindeki algoritma kavramı, yürütücüler ve işlem adımları kazanımlarıyla örtüşür.",
        funFacts: [
          "Bletchley Park'ta Enigma şifresini kırarak İkinci Dünya Savaşı'nı iki yıl kısalttığı tahmin edilmektedir."
        ]
      },
      ru: {
        title: "Машина Тьюринга и теория алгоритмов",
        summary: "Математическая модель универсального компьютера, созданная Аланом Тьюрингом задолго до появления микросхем.",
        ahaMoment: "Тьюринг доказал принципиальные границы вычислимости с помощью воображаемой бесконечной ленты и считывающей головки.",
        howItWorks: "Автомат считывает и перезаписывает символы по таблице состояний, моделируя любой исполнимый алгоритм.",
        realWorldImpact: "Архитектура современных ЭВМ, языки программирования, взлом шифра «Энигма» и тест Тьюринга для ИИ.",
        curriculumConnection: "Школьная информатика: понятие алгоритма, свойства (дискретность, детерминированность), теория автоматов.",
        funFacts: [
          "Взлом «Энигмы» командой Тьюринга сократил Вторую мировую войну минимум на два года."
        ]
      }
    },
    quiz: [
      {
        id: "tur-q1",
        question: "Türinq maşınının kompüter elmindəki başlıca əhəmiyyəti nədir?",
        options: [
          { id: "A", text: "İstənilən alqoritmin icra oluna biləcəyini göstərən universal riyazi hesablama modeli olması" },
          { id: "B", text: "Yalnız qrafik oyunlar oynamaq üçün aparat olması" },
          { id: "C", text: "İnternet kabelinin diametrini təyin etməsi" },
          { id: "D", text: "Kompüterin soyudulması üçün ventilyator olması" }
        ],
        correctOption: "A",
        explanation: "Türinq maşını nəzəri informatikanın təməlidir: əgər bir məsələ Türinq maşınında həll oluna bilmirsə, onu heç bir superkompüter də həll edə bilməz.",
        bloomLevel: "Anlama"
      },
      {
        id: "tur-q2",
        question: "Süni intellektin insan kimi düşünə bildiyini yoxlamaq üçün təklif olunan klassik sınaq necə adlanır?",
        options: [
          { id: "A", text: "Türinq Testi" },
          { id: "B", text: "Rentgen testi" },
          { id: "C", text: "Plank sabiti sınağı" },
          { id: "D", text: "Binar axtarış" }
        ],
        correctOption: "A",
        explanation: "1950-ci ildə Alan Türinq tərəfindən təklif edilən Türinq Testində hakim mətn vasitəsilə insanla və kompüterlə danışır; əgər maşını insandan ayıra bilmirsə, sistem 'düşünən' sayılır.",
        bloomLevel: "Bilik"
      },
      {
        id: "tur-q3",
        question: "Aşağıdakılardan hansı alqoritmin mütləq dörd əsas xassəsindən biridir?",
        options: [
          { id: "A", text: "Müəyyənlik (Determiniklik)" },
          { id: "B", text: "Mütləq rəngli olması" },
          { id: "C", text: "Yalnız ingilis dilində yazılması" },
          { id: "D", text: "Sonsuz addımlardan ibarət olması" }
        ],
        correctOption: "A",
        explanation: "Alqoritmin 4 əsas xassəsi var: Diskretlik, Müəyyənlik (hər addımın təkqiymətli olması), Kütləvilik və Nəticəvilik (sonlu sayda addımdan sonra başa çatması).",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "transistor-semiconductor-revolution",
    slug: "transistor-silicon-semiconductor-revolution-nobel",
    category: "fizika",
    isNobel: true,
    nobelPrize: {
      year: 1956,
      category: "Fizika",
      laureates: ["William Shockley", "John Bardeen", "Walter Brattain"],
      citation: "Yarımkeçiricilər üzərində tədqiqatlara və tranzistor effektinin kəşfinə görə"
    },
    discoveryYear: 1947,
    discoverer: "Bardeen, Brattain və Shockley (Bell Labs)",
    curriculumSubject: "Fizika / İnformatika",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Yarımkeçiricilərdə elektrik cərəyanı, p-n keçidi və mikroprosessorlar",
    icon: "Cpu",
    accentColor: "from-indigo-600 to-purple-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Tranzistor və Yarımkeçirici İnqilabı: Rəqəmsal Dünyanın Hüceyrəsi",
        summary: "Böyük, qızan və tez sıradan çıxan vakuum lampalarından kiçik silisium çiplərinə: müasir kompüterlərin ən mühüm kəşfi.",
        ahaMoment: "Köhnə kompüterlər (məsələn ENIAC) bütöv bir binanı tutur və minlərlə qızmar vakuum lampası ilə işləyirdi. 1947-ci ildə Bell laboratoriyasında Bardin, Bratteyn və Şokli aşkar etdilər ki, germanium və silisium kimi yarımkeçiricilərə xüsusi aşqarlar qatdıqda kiçik elektrik siqnalı ilə böyük cərəyanı idarə edən və gücləndirən möhkəm 'bərk cisim açarı' – tranzistor düzəltmək olar!",
        howItWorks: "Tranzistorda p-tipli (deşik keçiriciliyi) və n-tipli (elektron keçiriciliyi) yarımkeçirici laylar birləşdirilir. Baza (və ya qapı - gate) elektroduna verilən kiçik gərginlik p-n keçidindəki potensial çəpərini aradan qaldıraraq emitterdən kollektora güclü elektron axınını açır və ya bağlayır (1 və 0 rəqəmsal məntiqi).",
        realWorldImpact: "Bütün smartfonlar, kompüterlər, internet, peyklər və rəqəmsal elektronika. Müasir tək bir mikroprosessorda on milyardlarla tranzistor var!",
        curriculumConnection: "10-cu sinif Fizika dərsliyində 'Yarımkeçiricilər, aşqar keçiriciliyi (donor və akseptor)', 'Elektron-deşik keçidi (p-n keçid)' mövzularına tam cavab verir.",
        funFacts: [
          "Con Bardin iki dəfə Fizika üzrə Nobel mükafatı alan yeganə alimdir (biri tranzistora, digəri isə ifratkeçiricilik nəzəriyyəsinə görə).",
          "Müasir çiplərdəki tranzistorların ölçüsü cəmi 2-3 nanometrdir – yəni insan tükündən 30 000 dəfə nazikdir!"
        ]
      },
      en: {
        title: "The Transistor and Semiconductor Revolution",
        summary: "Replacing fragile vacuum tubes with solid-state silicon switches to spark the computer age (1956 Nobel Prize in Physics).",
        ahaMoment: "Bell Labs physicists discovered that semiconductor junctions can amplify and switch electrical signals without glowing filaments.",
        howItWorks: "A small gate voltage modulates the depletion zone across p-n junctions, controlling large current flows between source and drain.",
        realWorldImpact: "Microprocessors, mobile smartphones, the global internet, and digital automation.",
        curriculumConnection: "Core 10th-grade physics: semiconductor physics, doping (p-type and n-type), and p-n junction rectification.",
        funFacts: [
          "John Bardeen remains the only person to win two Nobel Prizes in Physics.",
          "Modern processors pack over 50 billion transistors onto a chip the size of a fingernail."
        ]
      },
      tr: {
        title: "Transistör ve Yarı İletken Devrimi",
        summary: "Hantal vakum tüplerini tarihe gömüp modern mikroişlemcilerin önünü açan buluş ve 1956 Nobel Fizik Ödülü.",
        ahaMoment: "Germanyum kristaline uygulanan küçük bir elektrik sinyalinin büyük akımları anahtarlayıp yükselttiği kanıtlandı.",
        howItWorks: "p-n eklemindeki potansiyel bariyerini kontrol ederek 0 ve 1 ikili mantık sinyallerini nanosaniyelerde üretir.",
        realWorldImpact: "Akıllı telefonlar, bilgisayarlar, internet ve tüm tüketici elektroniği.",
        curriculumConnection: "Fizik dersindeki yarı iletkenler, p-tipi/n-tipi katkılama ve p-n eklemi kazanımlarıyla tam uyumludur.",
        funFacts: [
          "John Bardeen iki kez Fizik Nobeli kazanan tek bilim insanıdır."
        ]
      },
      ru: {
        title: "Транзистор и полупроводниковая революция",
        summary: "Замена электронных ламп полупроводниковыми кристаллами, породившая микропроцессоры (Нобелевская премия по физике 1956).",
        ahaMoment: "Ученые Bell Labs создали твердотельный переключатель на кристалле германия, усиливающий электрический сигнал.",
        howItWorks: "Управление потенциальным барьером p-n перехода малым током базы, коммутирующим мощный поток электронов.",
        realWorldImpact: "Смартфоны, суперкомпьютеры, цифровые сети связи и искусственный интеллект.",
        curriculumConnection: "Школьная физика 10 класса: проводимость полупроводников, примеси (доноры и акцепторы), p-n переход.",
        funFacts: [
          "Джон Бардин — единственный физик в истории, получивший две Нобелевские премии по физике."
        ]
      }
    },
    quiz: [
      {
        id: "tran-q1",
        question: "Tranzistorun rəqəmsal elektronika və kompüterlərdəki başlıca rolu nədir?",
        options: [
          { id: "A", text: "Elektrik siqnalını gücləndirən və saniyədə milyardlarla dəfə açılıb-bağlanan elektron açar (0 və 1)" },
          { id: "B", text: "Yalnız qızdırıcı element kimi otağı qızdırmaq" },
          { id: "C", text: "Suyu təmizləmək" },
          { id: "D", text: "Mexaniki təkəri fırlatmaq" }
        ],
        correctOption: "A",
        explanation: "Tranzistorlar ikilik say sistemindəki '0' (qapalı) və '1' (açıq) vəziyyətlərini təmsil edərək bütün məntiqi və hesab əməliyyatlarını həyata keçirir.",
        bloomLevel: "Anlama"
      },
      {
        id: "tran-q2",
        question: "Təmiz silisiuma (Si) donor aşqarı (məsələn, fosfor) daxil edildikdə hansı növ keçiricilik yaranır?",
        options: [
          { id: "A", text: "Elektron keçiriciliyi (n-tipli)" },
          { id: "B", text: "Deşik keçiriciliyi (p-tipli)" },
          { id: "C", text: "İon keçiriciliyi" },
          { id: "D", text: "İfratkeçiricilik" }
        ],
        correctOption: "A",
        explanation: "5-valentli fosfor atomu 4-valentli silisiumla rabitə qurduqda bir artıq elektron qalır və n-tipli (mənfi yüklü elektron keçiriciliyi) yaranır.",
        bloomLevel: "Bilik"
      },
      {
        id: "tran-q3",
        question: "Tranzistorların vakuum lampaları ilə müqayisədə ən həlledici üstünlüyü nə idi?",
        options: [
          { id: "A", text: "Mikroskopik ölçü, dözümlülük, ifrat aşağı enerji sərfiyyatı və qızma filamentinin olmaması" },
          { id: "B", text: "Yalnız şüşədən hazırlanması" },
          { id: "C", text: "Daha böyük və ağır olması" },
          { id: "D", text: "Mütləq su altında işləməsi" }
        ],
        correctOption: "A",
        explanation: "Vakuum lampaları tez yanır, çox qızır və böyük idi; tranzistorlar isə miniatürləşməyə və mikroçiplərin yaranmasına imkan verdi.",
        bloomLevel: "Təhlil"
      }
    ]
  }
]
