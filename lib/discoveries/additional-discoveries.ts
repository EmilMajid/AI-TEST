import { ScientificDiscovery } from "@/lib/discoveries-types"

export const ADDITIONAL_DISCOVERIES: ScientificDiscovery[] = [
  {
    id: "cryo-electron-microscopy",
    slug: "cryo-electron-microscopy-atomic-resolution-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2017,
      category: "Kimya",
      laureates: ["Jacques Dubochet", "Joachim Frank", "Richard Henderson"],
      citation: "Məhlulda biomolekulların yüksək ayırdetməli struktur təyini üçün krio-elektron mikroskopiyasının inkişafına görə"
    },
    discoveryYear: 2013,
    discoverer: "Dubochet, Frank və Henderson",
    curriculumSubject: "Kimya / Biologiya",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Mikroskopiya növləri, zülalların fəza quruluşu və suyun amorf şüşə halı",
    icon: "Microscope",
    accentColor: "from-sky-500 to-indigo-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Krio-Elektron Mikroskopiyası (Cryo-EM): Həyatın Atom Portreti",
        summary: "Biomolekulları buz kristalı yaratmadan ildırım sürətilə dondurub atom dəqiqliyi ilə 3D formasını çəkən inqilab.",
        ahaMoment: "Elektron mikroskopları o qədər güclüdür ki, bioloji nümunəni elektron şüası dərhal yandırır, vakuum isə suyu buxarlandırıb zülalın formasını dağıdırdı. Jak Düboşe kəşf etdi ki, suyu maye etanda saniyənin mində birində -190°C-yə qədər soyutduqda buz kristalları əmələ gəlmir, su şəffaf 'amorf şüşə'yə çevrilir və zülal olduğu kimi canlı formasında donub qalır!",
        howItWorks: "Dondurulmuş zülalların minlərlə elektron mikroskop kölgə şəkli çəkilir. İntellektual alqoritmlər bu 2D şəkilləri müxtəlif bucaqlardan birləşdirərək zülalın atom səviyyəsində dəqiq 3D modelini bərpa edir.",
        realWorldImpact: "Zika və Koronavirusun (SARS-CoV-2) tikan zülallarının atom xəritəsinin bir neçə həftəyə çıxarılması və hədəfli vaksinlərin yaradılması.",
        curriculumConnection: "10-cu sinif Kimyada 'Maddənin aqreqat halları və amorf maddələr', 10-cu sinif Biologiyada 'Sitologiyanın tədqiqat metodları' mövzularına dərindən bağlıdır.",
        funFacts: [
          "Cryo-EM sayəsində əvvəllər heç vaxt kristallaşmayan ən mürəkkəb membran zülalları və virus qabıqları ilk dəfə atom-atom görüldü."
        ]
      },
      en: {
        title: "Cryo-Electron Microscopy (Cryo-EM)",
        summary: "Vitrifying biomolecules at cryogenic speeds to image molecular machines in atomic resolution (2017 Nobel Prize in Chemistry).",
        ahaMoment: "Dubochet vitrified water into an amorphous glass without ice crystal lattices, preserving protein native architecture.",
        howItWorks: "Rapid plunge-freezing into liquid ethane preserves samples in vitreous ice; automated transmission electron imaging generates 3D density maps.",
        realWorldImpact: "Mapped the SARS-CoV-2 spike protein in weeks, revolutionizing rapid vaccine antigen validation.",
        curriculumConnection: "Amorphous vs crystalline phases, electron microscopy resolution, and protein quaternary structure.",
        funFacts: [
          "Bypasses decades-long crystallization trials needed for traditional X-ray crystallography."
        ]
      },
      tr: {
        title: "Kriyo-Elektron Mikroskopisi (Cryo-EM)",
        summary: "Biyomolekülleri atomik çözünürlükte dondurarak görüntüleyen devrim ve 2017 Nobel Kimya Ödülü.",
        ahaMoment: "Sıvı etan içinde suyu kristalleşmeden cam benzeri amorf buz fazına geçirerek moleküler yapıyı korudular.",
        howItWorks: "Elektron mikroskobuyla binlerce farklı açıdan alınan görüntüler bilgisayar algoritmalarıyla 3 boyutlu atomik modele dönüştürülür.",
        realWorldImpact: "Koronavirüs spike proteininin haftalar içinde haritalanması ve hedefe yönelik ilaç tasarımı.",
        curriculumConnection: "Amorf maddeler, mikroskopi yöntemleri ve proteinlerin üçüncül yapısı kazanımlarıyla uyumludur.",
        funFacts: [
          "Kristalleşmesi imkansız olan devasa protein komplekslerinin ilk kez atomik haritasını çıkardı."
        ]
      },
      ru: {
        title: "Криоэлектронная микроскопия (Cryo-EM)",
        summary: "Мгновенная заморозка биомолекул в аморфном льду для атомного 3D-моделирования (Нобелевская премия по химии 2017).",
        ahaMoment: "Дюбоше предотвратил разрушительную кристаллизацию льда, витрифицировав воду в жидком этане за доли секунды.",
        howItWorks: "Тысячи двумерных крио-снимков собираются алгоритмами вычислительной реконструкции в единую трехмерную структуру.",
        realWorldImpact: "Мгновенная расшифровка спайк-белка коронавируса и прорыв в структурной фармакологии.",
        curriculumConnection: "Школьный курс: кристаллическое и аморфное состояние, методы цитологии, четвертичная структура белка.",
        funFacts: [
          "Позволила заглянуть внутрь рибосом и мембранных каналов в их естественном водном окружении."
        ]
      }
    },
    quiz: [
      {
        id: "cryo-q1",
        question: "Krio-elektron mikroskopiyasında suyun amorf şüşə halına salınmasının başlıca məqsədi nədir?",
        options: [
          { id: "A", text: "Buz kristallarının iti tillərinin zülal molekulunu parçalamasının qarşısını almaq" },
          { id: "B", text: "Suyun dadını dəyişmək" },
          { id: "C", text: "Nümunənin kütləsini artırmaq" },
          { id: "D", text: "Yalnız qızıl atomlarını müşahidə etmək" }
        ],
        correctOption: "A",
        explanation: "Su adi dondurulduqda əmələ gələn iti buz kristalları zülalın formasını dağıdır; amorf şüşələşmə isə molekulu zədələnmədən saxlayır.",
        bloomLevel: "Anlama"
      },
      {
        id: "cryo-q2",
        question: "Cryo-EM metodu hansı qlobal pandemiya zamanı virusun tikan zülalının dərhal xəritələnməsində həlledici rol oynadı?",
        options: [
          { id: "A", text: "COVID-19 (SARS-CoV-2)" },
          { id: "B", text: "Vəba" },
          { id: "C", text: "Qara yara" },
          { id: "D", text: "Çiçək xəstəliyi" }
        ],
        correctOption: "A",
        explanation: "COVID-19 pandemiyası başlayanda Cryo-EM sayəsində virusun S-zülalının 3D forması cəmi bir neçə həftəyə tapıldı və vaksinlərin hazırlanmasına başlandı.",
        bloomLevel: "Bilik"
      },
      {
        id: "cryo-q3",
        question: "Kristallik buz ilə amorf buz arasındakı fərq nədir?",
        options: [
          { id: "A", text: "Amorf buzda nizamlı kristallik qəfəs yoxdur, molekullar mayedəki kimi xaotik düzülüşdə donub qalır" },
          { id: "B", text: "Amorf buz həmişə qaynar olur" },
          { id: "C", text: "Amorf buzda oksigen atomu yoxdur" },
          { id: "D", text: "Kristallik buz cərəyan keçirir" }
        ],
        correctOption: "A",
        explanation: "Amorf maddələrdə uzaq nizam yoxdur; ifrat sürətli soyutma su molekullarına altıbucaqlı kristal şəbəkə qurmağa imkan vermir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "hepatitis-c-virus-discovery",
    slug: "hepatitis-c-virus-discovery-cure-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2020,
      category: "Fiziologiya və ya Tibb",
      laureates: ["Harvey J. Alter", "Michael Houghton", "Charles M. Rice"],
      citation: "Hepatit C virusunun kəşfinə görə"
    },
    discoveryYear: 1989,
    discoverer: "Harvey Alter, Michael Houghton və Charles Rice",
    curriculumSubject: "Biologiya",
    curriculumGrade: "8-10-cu sinif",
    curriculumTopic: "Viruslar, qaraciyər sirrozu, yoluxucu xəstəliklər və qan təhlükəsizliyi",
    icon: "ShieldCheck",
    accentColor: "from-rose-500 to-amber-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Hepatit C Virusunun Kəşfi: Qanla Yayılan Gizli Qatilin Ram Edilməsi",
        summary: "Qan köçürmə zamanı qaraciyəri sakitcə sıradan çıxaran naməlum virusun tapılması və tibb tarixində ilk tam müalicə olunan xroniki virus xəstəliyi.",
        ahaMoment: "Hepatit A və B virusları tapıldıqdan sonra da qan köçürülən xəstələrdə naməlum sirroz və xərçəng halları davam edirdi ('Nə A, Nə B Hepatiti'). 1989-cu ildə Maykl Hoton yeni molekulyar klonlaşdırma ilə cəmi bir neçə mikronluq qan zərdabından naməlum RNT virusunun genetik kodunu oxudu, Çarlz Rays isə bu virusun təkbaşına xəstəlik törətdiyini sübut etdi.",
        howItWorks: "Hepatit C təkzəncirli pozitiv RNT virusudur (Flaviviridae ailəsi). O, qaraciyər hüceyrələrində çoxalaraq illərlə heç bir əlamət vermədən fibroz və sirroz yaradır. Kəşf sayəsində virusun NS5A və NS5B fermentlərini bloklayan birbaşa təsirli antiviral dərmanlar (DAA) yaradıldı.",
        realWorldImpact: "Donor qanının 100% yoxlanılması sayəsində qan köçürmədən yoluxma riski sıfıra endirildi; xəstələrin 95-98%-i cəmi 12 həftəlik həb müalicəsi ilə tam sağalır.",
        curriculumConnection: "8-ci sinif Biologiyada 'Qaraciyər və həzm sistemi xəstəlikləri', 10-cu sinifdə 'Viruslar və onların çoxalma dövrləri' mövzuları.",
        funFacts: [
          "Hepatit C dünyada dərmanla orqanizmdən tamamilə kökü kəsilə bilən ilk xroniki virus infeksiyasıdır."
        ]
      },
      en: {
        title: "Discovery of the Hepatitis C Virus",
        summary: "Tracking down the blood-borne stealth virus causing chronic liver failure (2020 Nobel Prize in Physiology or Medicine).",
        ahaMoment: "Houghton isolated genetic sequences from an elusive blood-borne agent that evaded all classical viral diagnostic culture tests.",
        howItWorks: "Positive-sense single-stranded RNA Flavivirus replication triggers chronic hepatic fibrosis, halted by direct-acting antivirals (DAAs).",
        realWorldImpact: "Eliminated post-transfusion hepatitis worldwide and yielded direct cures achieving 95%+ sustained virologic responses.",
        curriculumConnection: "Viral life cycles, RNA transcription/replication enzymes, and hepatic histology.",
        funFacts: [
          "Hepatitis C is the first chronic viral disease in human history to be rendered curable via pills."
        ]
      },
      tr: {
        title: "Hepatit C Virüsünün Keşfi",
        summary: "Kan nakliyle yayılan sinsi karaciğer virüsünün bulunması ve 2020 Nobel Tıp Ödülü.",
        ahaMoment: "Houghton ve ekibi, klasik mikroskopla görülemeyen virüsün RNA genetik kodunu klonlayarak varlığını kanıtladı.",
        howItWorks: "Karaciğer hücrelerine yerleşen RNA virüsü, proteaz ve polimeraz inhibitörleri ile 12 haftada tamamen yok edilir.",
        realWorldImpact: "Kan nakillerinde virüs bulaşma riskinin sıfıra indirilmesi ve %95 üzeri kalıcı tedavi başarısı.",
        curriculumConnection: "Biyolojide virüslerin yapısı, karaciğer fizyolojisi ve bağışıklık konularıyla tam uyumludur.",
        funFacts: [
          "Tarihte ilaçla tamamen kökü kazınabilen ilk kronik virüs hastalığı olmuştur."
        ]
      },
      ru: {
        title: "Открытие вируса гепатита C",
        summary: "Изоляция скрытого вируса, разрушающего печень, и создание препаратов для полного излечения (Нобелевская премия 2020).",
        ahaMoment: "Хотон выделил вирусную РНК методом молекулярного клонирования из плазмы крови, победив болезнь «ни А, ни В».",
        howItWorks: "РНК-содержащий флавивирус поражает гепатоциты; современные ингибиторы полимеразы блокируют его репликацию за 12 недель.",
        realWorldImpact: "Безопасность донорской крови в мире и излечение более 95% пациентов без интерферонов.",
        curriculumConnection: "Школьный курс: вирусы как неклеточная форма жизни, функции печени, переливание крови.",
        funFacts: [
          "Гепатит C стал первым в истории медицины хроническим вирусным заболеванием, полностью излечимым таблетками."
        ]
      }
    },
    quiz: [
      {
        id: "hepc-q1",
        question: "Hepatit C virusu insan orqanizmində ilk növbədə hansı orqanın hüceyrələrini zədələyir?",
        options: [
          { id: "A", text: "Qaraciyəri (hepatositləri)" },
          { id: "B", text: "Ağciyərləri" },
          { id: "C", text: "Dərini" },
          { id: "D", text: "Sümükləri" },
        ],
        correctOption: "A",
        explanation: "Hepatit C xüsusi olaraq qaraciyər toxumasına tropizm göstərir və uzun illər boyu qaraciyər sirrozu və xərçənginə səbəb olur.",
        bloomLevel: "Bilik"
      },
      {
        id: "hepc-q2",
        question: "Hepatit C virusunun kəşfi ictimai səhiyyədə hansı həyati təhlükəsizlik addımının atılmasına imkan verdi?",
        options: [
          { id: "A", text: "Bütün donor qanlarının bu virusa qarşı yoxlanılaraq qan köçürmə yolu ilə yoluxmanın qarşısının alınmasına" },
          { id: "B", text: "İçməli suyun xlorlanmasının dayandırılmasına" },
          { id: "C", text: "Havanın tərkibinin dəyişdirilməsinə" },
          { id: "D", text: "Yalnız qış aylarında peyvənd vurulmasına" }
        ],
        correctOption: "A",
        explanation: "Kəşfə qədər qan köçürülən milyonlarla insan xəbərsiz yoluxurdu; testlərin tətbiqi ilə donor qanı vasitəsilə yoluxma tam aradan qaldırıldı.",
        bloomLevel: "Anlama"
      },
      {
        id: "hepc-q3",
        question: "Hepatit C virusunun genomu hansı nuklein turşusundan təşkil olunmuşdur?",
        options: [
          { id: "A", text: "Təkzəncirli RNT-dən (RNA)" },
          { id: "B", text: "İkili spiral DNT-dən" },
          { id: "C", text: "Yalnız ATF molekulundan" },
          { id: "D", text: "Qlükogendən" }
        ],
        correctOption: "A",
        explanation: "Hepatit C virusu müsbət zəncirli RNT daşıyan zərflı virusdur.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "cellular-oxygen-sensing-hif1",
    slug: "cellular-oxygen-sensing-hif1-pathway-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2019,
      category: "Fiziologiya və ya Tibb",
      laureates: ["William G. Kaelin Jr.", "Sir Peter J. Ratcliffe", "Gregg L. Semenza"],
      citation: "Hüceyrələrin oksigenin mövcudluğunu necə hiss etməsi və ona necə uyğunlaşması ilə bağlı kəşflərə görə"
    },
    discoveryYear: 1995,
    discoverer: "Semenza, Ratcliffe və Kaelin",
    curriculumSubject: "Biologiya",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Tənəffüs, qanın oksigenlə təminatı, eritrositlər və eritropoetin hormonu",
    icon: "Wind",
    accentColor: "from-sky-500 to-blue-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Hüceyrələrin Oksigen Sensoru (HIF-1): Həyat Qazının Tənzimi",
        summary: "Dağa qalxdıqda və ya qan itirdikdə bədənimizin oksigen çatışmazlığını (hipoksiya) molekulyar səviyyədə hiss edib qan hüceyrələrini artırmaq mexanizmi.",
        ahaMoment: "Oksigen canlılar üçün əvəzolunmazdır, lakin hüceyrə oksigenin azaldığını necə 'bilir'? Qreqq Sementsa aşkar etdi ki, oksigen səviyyəsi düşəndə hüceyrələrdə HIF-1 (Hipoksiya ilə İndukasiya olunan Faktor) adlı xüsusi zülal toplanır və qırmızı qan cisimlərini çoxaldan eritropoetin (EPO) genini dərhal işə salır!",
        howItWorks: "Normal oksigen mühitində prolin hidroksilaza fermentləri HIF-1 zülalına oksigen atomu birləşdirir və VHL zülalı onu proteasomda məhv edir. Oksigen azaldıqda hidroksilləşmə dayanır, HIF-1 salamat qalır, hüceyrə nüvəsinə keçərək yeni qan damarları (angiogenez) və eritrositlər yaradan yüzlərlə geni aktivləşdirir.",
        realWorldImpact: "Anemiya (qanazlığı) xəstələrinin yeni dərmanlarla müalicəsi, infarkt və insultdan sonra toxumaların bərpası, xərçəng şişlərinin damar qidalanmasının qarşısının alınması.",
        curriculumConnection: "9-cu sinif Biologiyada 'Qanın formalaşması və qan qrupları', 'Qırmızı qan cisimcikləri (eritrositlər və hemoqlobin)' mövzularına tam aiddir.",
        funFacts: [
          "Yüksək dağlıq bölgələrə gedən idmançılarda HIF-1 mexanizmi işə düşərək qandakı eritrositlərin sayını artırır – buna görə də bir çox olimpiyaçı dağlarda məşq edir."
        ]
      },
      en: {
        title: "Cellular Oxygen Sensing via the HIF-1 Pathway",
        summary: "How animal cells adapt to oxygen availability, modulating erythropoietin and vascular growth (2019 Nobel Prize).",
        ahaMoment: "Semenza identified HIF-1, a transcription factor switching on erythropoietin genes when cellular oxygen tensions plunge.",
        howItWorks: "Prolyl hydroxylases use oxygen to flag HIF-1 for VHL-mediated ubiquitination; hypoxia prevents degradation, triggering angiogenesis.",
        realWorldImpact: "Treats severe anemia, accelerates wound healing, and inhibits tumor vascularization in oncology.",
        curriculumConnection: "Erythropoiesis, oxygen transport, hemoglobin saturation, and transcriptional adaptation.",
        funFacts: [
          "Altitude training exploits this exact molecular pathway to boost an athlete's red blood cell count naturally."
        ]
      },
      tr: {
        title: "Hücrelerin Oksijen Algılama Mekanizması (HIF-1)",
        summary: "Hücrelerin oksijen azlığını nasıl hissedip alyuvar üretimini artırdığının çözülmesi ve 2019 Nobel Tıp Ödülü.",
        ahaMoment: "Oksijen azaldığında HIF-1 proteininin parçalanmayıp çekirdeğe girerek EPO hormonunu tetiklediği keşfedildi.",
        howItWorks: "Yeterli oksijende VHL proteini HIF-1'i yıkar; hipokside ise HIF-1 yeni damar oluşumunu ve alyuvar üretimini başlatır.",
        realWorldImpact: "Böbrek yetmezliğine bağlı kansızlık tedavisi ve kanserli tümörlerin damarlanmasının engellenmesi.",
        curriculumConnection: "Solunum sistemi, alyuvarlar, eritropoetin hormonu ve doku beslenmesi kazanımları.",
        funFacts: [
          "Olimpiyat sporcularının yüksek rakımlı dağlarda kamp yapması bu mekanizmayı çalıştırmak içindir."
        ]
      },
      ru: {
        title: "Клеточное восприятие кислорода (путь HIF-1)",
        summary: "Молекулярный механизм адаптации клеток к гипоксии и регуляция эритропоэза (Нобелевская премия по медицине 2019).",
        ahaMoment: "Семенза открыл белок HIF-1, который накапливается при нехватке кислорода и запускает синтез эритропоэтина.",
        howItWorks: "При нормальном кислороде ферменты метят HIF-1 для разрушения; при гипоксии он активирует гены ангиогенеза и кроветворения.",
        realWorldImpact: "Лечение тяжелой анемии, восстановление тканей после инфаркта и блокировка роста сосудов в опухолях.",
        curriculumConnection: "Школьный курс: эритроциты, транспорт газов кровью, регуляция дыхания и кроветворения.",
        funFacts: [
          "Высокогорные тренировки альпинистов и марафонцев работают именно благодаря активации фактора HIF-1."
        ]
      }
    },
    quiz: [
      {
        id: "ox-q1",
        question: "Qanda oksigen çatışmazlığı (hipoksiya) yarandıqda orqanizmdə hansı qan hüceyrələrinin istehsalı artır?",
        options: [
          { id: "A", text: "Eritrositlərin (qırmızı qan hüceyrələrinin)" },
          { id: "B", text: "Yalnız leykositlərin" },
          { id: "C", text: "Trombositlərin" },
          { id: "D", text: "Hüceyrələrin sayı azalır" }
        ],
        correctOption: "A",
        explanation: "HIF-1 böyrəklərdə eritropoetin (EPO) sintezini artırır, bu da sümük iliyində oksigen daşıyan eritrositlərin çoxalmasına səbəb olur.",
        bloomLevel: "Anlama"
      },
      {
        id: "ox-q2",
        question: "Eritrositlərdə oksigeni birləşdirib bütün toxumalara daşıyan dəmir tərkibli zülal hansıdır?",
        options: [
          { id: "A", text: "Hemoqlobin" },
          { id: "B", text: "Fibrinogen" },
          { id: "C", text: "İnsulin" },
          { id: "D", text: "Pepsin" }
        ],
        correctOption: "A",
        explanation: "Hemoqlobin zülalında yerləşən Fe²⁺ ionları oksigenlə davamlı olmayan oksihemoqlobin birləşməsi yaradaraq qaz mübadiləsini təmin edir.",
        bloomLevel: "Bilik"
      },
      {
        id: "ox-q3",
        question: "Normal oksigen şəraitində HIF-1 zülalının hüceyrədə toplanmasının qarşısını hansı proses alır?",
        options: [
          { id: "A", text: "Prolin hidroksilləşməsi və proteasomda fasiləsiz parçalanması" },
          { id: "B", text: "Hüceyrədən xaricə atılması" },
          { id: "C", text: "Yağa çevrilməsi" },
          { id: "D", text: "DNT-yə çevrilməsi" }
        ],
        correctOption: "A",
        explanation: "Oksigen olduqda fermentlər HIF-1-i hidroksilləşdirir və VHL zülalı onu proteasomda dərhal həzm edir; yalnız oksigen azaldıqda HIF-1 sağ qalır.",
        bloomLevel: "Təhlil"
      }
    ]
  },
  {
    id: "superconductivity-zero-resistance",
    slug: "superconductivity-zero-electrical-resistance-bcs",
    category: "fizika",
    isNobel: true,
    nobelPrize: {
      year: 1913,
      category: "Fizika",
      laureates: ["Heike Kamerlingh Onnes"],
      citation: "Maddənin aşağı temperaturlardakı xassələrinə və maye heliumun alınmasına görə"
    },
    discoveryYear: 1911,
    discoverer: "Heike Kamerlingh Onnes, Bardeen, Cooper və Schrieffer (BCS)",
    curriculumSubject: "Fizika",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Elektrik müqaviməti, ifratkeçiricilik, Meyssner effekti və Kupr cütləri",
    icon: "Zap",
    accentColor: "from-cyan-500 to-blue-900",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "İfratkeçiricilik: Sıfır Müqavimət və Havada Uçan Maqnitlər",
        summary: "Maye heliumda mütləq sıfıra yaxın soyudulmuş naqillərdə elektrik müqavimətinin tam yox olması və Meyssner levitasiyası.",
        ahaMoment: "1911-ci ildə Leyden Universitetində Kamerlinq Onnes civəni maye heliumla 4.2 Kelvinə (-269°C) qədər soyutdu. O gözləyirdi ki, civənin müqaviməti tədricən azalacaq. Lakin 4.19 K-də qalvanometrin əqrəbi qəfildən sıfıra düşdü: elektrik müqaviməti tamamilə yox olmuşdu! Naqildə başladılan elektrik cərəyanı heç bir batareya olmadan illərlə sönmədən fırlana bilirdi!",
        howItWorks: "Kritik temperaturdan aşağıda elektronlar kristallik qəfəsin rəqsləri (fononlar) vasitəsilə bir-biri ilə birləşərək 'Kuper cütləri' (BCS nəzəriyyəsi) yaradır. Bu cütlər bozon kimi davranaraq kristallik qəfəslə heç bir toqquşma etmədən maneəsiz axır. Bundan əlavə, ifratkeçirici daxilindən maqnit sahəsini tam qovur (Meyssner effekti) və maqnitlər onun üzərində havada asılı qalır.",
        realWorldImpact: "MRT (maqnit-rezonans) aparatlarının ifrat güclü maqnitləri, saatda 600 km sürətlə hərəkət edən Maglev qatarları, Böyük Adron Kollayderi (CERN) və kvant kompüterlərinin ku-bitləri.",
        curriculumConnection: "10-cu sinif Fizika dərsliyində 'Metallarda elektrik müqavimətinin temperaturdan asılılığı', 'İfratkeçiricilik hadisəsi və kritik temperatur (T_k)' bölmələri.",
        funFacts: [
          "Əgər ifratkeçirici halqada elektrik cərəyanı buraxsanız və dövrəni qapasınız, cərəyan heç bir enerji itkisi olmadan min illərlə fırlanmağa davam edər!"
        ]
      },
      en: {
        title: "Superconductivity: Zero Electrical Resistance",
        summary: "Cooling metals near absolute zero to eliminate resistance completely, enabling magnetic levitation (1913 & 1972 Nobel Prizes).",
        ahaMoment: "Kamerlingh Onnes cooled mercury to 4.2 K using liquid helium and watched electrical resistance abruptly drop to absolute zero.",
        howItWorks: "Below critical temperature, electrons bind via lattice phonons into Cooper pairs (BCS theory), gliding through ionic lattices without scattering.",
        realWorldImpact: "MRI superconducting magnets, Maglev bullet trains, CERN particle accelerators, and superconducting quantum qubits.",
        curriculumConnection: "Temperature dependence of metallic resistivity, Ohm's law breakdown, and the Meissner effect.",
        funFacts: [
          "An electrical current induced in a closed superconducting loop can flow indefinitely without any power source."
        ]
      },
      tr: {
        title: "Süperiletkenlik ve Sıfır Elektrik Direnci",
        summary: "Mutlak sıfıra yakın sıcaklıklarda elektrik direncinin sıfırlanması ve havada asılı kalan Maglev trenleri.",
        ahaMoment: "Onnes, sıvı helyumla soğuttuğu cıvanın 4.2 Kelvin'de direncini bir anda sıfıra düşürdüğünü gözlemledi.",
        howItWorks: "BCS teorisine göre elektronlar fononlar aracılığıyla Cooper çiftleri oluşturarak atom kafesine çarpmadan akar.",
        realWorldImpact: "Hastanelerdeki MR cihazları, 600 km/s hız yapan Maglev trenleri ve kuantum bilgisayar çipleri.",
        curriculumConnection: "Direncin sıcaklıkla değişimi, süperiletkenlik ve Meissner etkisi fizik kazanımları.",
        funFacts: [
          "Süperiletken bir halkadaki akım, pil olmadan binlerce yıl hiç sönmeden dönmeye devam edebilir."
        ]
      },
      ru: {
        title: "Сверхпроводимость и эффект Мейснера",
        summary: "Исчезновение электрического сопротивления вблизи абсолютного нуля и магнитная левитация (Нобелевские премии 1913 и 1972).",
        ahaMoment: "Камерлинг-Оннес охладил ртуть жидким гелием до 4.2 К и зафиксировал падение сопротивления строго до нуля.",
        howItWorks: "Теория БКШ: при низких температурах электроны образуют куперовские пары, движущиеся сквозь кристаллическую решетку без трения.",
        realWorldImpact: "Сверхпроводящие магниты МРТ, поезда на магнитной подушке (Maglev), Большой адронный коллайдер.",
        curriculumConnection: "Школьный курс: зависимость сопротивления металлов от температуры, сверхпроводимость, критическая температура.",
        funFacts: [
          "Ток, запущенный в замкнутое сверхпроводящее кольцо, может течь без батарейки миллионы лет."
        ]
      }
    },
    quiz: [
      {
        id: "super-q1",
        question: "İfratkeçiricilik vəziyyətinə keçmiş naqilin elektrik müqaviməti nəyə bərabər olur?",
        options: [
          { id: "A", text: "Dəqiq olaraq sıfıra (R = 0)" },
          { id: "B", text: "Sonsuz böyük olur" },
          { id: "C", text: "Otaq temperaturundakı qiymətə" },
          { id: "D", text: "Mənfi yüzə" }
        ],
        correctOption: "A",
        explanation: "Kritik temperaturdan aşağıda müqavimət tamamilə yox olur və elektrik cərəyanı heç bir Coul istiliyi itkisi olmadan axır.",
        bloomLevel: "Bilik"
      },
      {
        id: "super-q2",
        question: "İfratkeçiricinin xarici maqnit sahəsini öz daxilindən tamamilə sıxışdırıb qovması hadisəsi necə adlanır?",
        options: [
          { id: "A", text: "Meyssner effekti (Meissner effect)" },
          { id: "B", text: "Fotoeffekt" },
          { id: "C", text: "Dopler effekti" },
          { id: "D", text: "Kvant tullanışı" }
        ],
        correctOption: "A",
        explanation: "Meyssner effekti ifratkeçiricinin ideal diamaqnit olduğunu göstərir: daxildə B=0 olur və bu səbəbdən maqnit ifratkeçirici üzərində havada sərbəst asılı qalır (levitasiya).",
        bloomLevel: "Anlama"
      },
      {
        id: "super-q3",
        question: "Xəstəxanalarda istifadə olunan MRT (Maqnit Rezonans Tomoqrafiya) aparatlarında ifratkeçirici dolaqları soyutmaq üçün hansı mayedən istifadə edilir?",
        options: [
          { id: "A", text: "Maye helium (-269°C)" },
          { id: "B", text: "Adi kran suyu" },
          { id: "C", text: "Benzin" },
          { id: "D", text: "Zeytun yağı" }
        ],
        correctOption: "A",
        explanation: "MRT-nin güclü maqnit sahəsi yaradan niob-titan dolaqlarını ifratkeçirici halda saxlamaq üçün təxminən 4 Kelvin temperaturunda maye heliumdan istifadə olunur.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "blue-led-revolution",
    slug: "blue-led-energy-efficient-lighting-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2014,
      category: "Fizika",
      laureates: ["Isamu Akasaki", "Hiroshi Amano", "Shuji Nakamura"],
      citation: "Parlaq və enerjiyə qənaət edən ağ işıq mənbələrini təmin edən səmərəli mavi işıqdiodlarının (LED) ixtirasına görə"
    },
    discoveryYear: 1993,
    discoverer: "Akasaki, Amano və Nakamura",
    curriculumSubject: "Fizika",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "İşıqdiodları (LED), p-n keçidi, yarımkeçiricilər və enerji səmərəliliyi",
    icon: "Lightbulb",
    accentColor: "from-blue-500 to-indigo-600",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Mavi LED İxtirası: Dünyanı Ağ İşıqla Qurtaran Yarımkeçirici",
        summary: "30 il tapıla bilməyən mavi işıqdiodunun kəşfi: qırmızı və yaşıl ilə birləşərək bəşəriyyəti közərmə lampalarından xilas edən ağ LED inqilabı.",
        ahaMoment: "Qırmızı və yaşıl işıqdiodları 1960-cı illərdən məlum idi. Lakin əsl ağ işıq almaq üçün optikada mütləq üç əsas rəng (Qırmızı, Yaşıl, Mavi - RGB) lazımdır. Alimlər 30 il ərzində qallium nitrid (GaN) kristalını böyüdüb mavi işıq almağa çalışdılar, lakin hamı bunun qeyri-mümkün olduğunu düşünərək təslim oldu. Şuci Nakamura kiçik bir yapon şirkətində təkbaşına xüsusi soba düzəldərək yüksək keyfiyyətli GaN kristalı yetişdirdi və 1993-cü ildə parlaq mavi işığı yandırdı!",
        howItWorks: "Mavi LED-də p-n keçidindən cərəyan keçərkən elektronlar deşiklərlə rekombinasiya edir və GaN-ın geniş qadağan olunmuş zonasına uyğun yüksək enerjili mavi fotonlar şüalandırır. Bu mavi işıq sarı fosfor təbəqəsi ilə örtüldükdə gözümüz onu parlaq ağ işıq kimi qəbul edir.",
        realWorldImpact: "Ənənəvi közərmə lampaları enerjinin 90%-ni istiliyə çevirib israf edirdisə, ağ LED-lər 80% daha az enerji sərf edir. Bütün smartfon ekranları, küçə fənərləri və ev lampaları dəyişdirildi.",
        curriculumConnection: "10-cu sinif Fizikada 'Yarımkeçirici cihazlar: diod və işıqdiodu', 11-ci sinifdə 'İşığın dispersiyası və rənglərin toplanması (RGB)' mövzuları.",
        funFacts: [
          "Nobel Komitəsi bəyan etmişdi: 'Tomas Edison 20-ci əsri közərmə lampası ilə işıqlandırdısa, 21-ci əsri bu 3 alim LED ilə işıqlandırdı'."
        ]
      },
      en: {
        title: "The Blue LED: Lighting the 21st Century",
        summary: "Overcoming 30 years of material physics failures to trigger the global energy-efficient solid-state lighting revolution (2014 Nobel Prize).",
        ahaMoment: "Nakamura mastered Gallium Nitride crystal growth, completing the RGB triad required to synthesize white light.",
        howItWorks: "Wide-bandgap GaN semiconductor p-n junctions recombine electrons and holes to release high-energy blue photons, converted to white light via phosphors.",
        realWorldImpact: "Saves massive percentages of global electricity grids, illuminates smartphone displays, and brings solar lighting to off-grid villages.",
        curriculumConnection: "Semiconductor p-n diodes, radiative recombination, and additive color theory.",
        funFacts: [
          "Incandescent bulbs transformed 90% of electricity into wasted heat; blue LEDs convert up to 80% directly into light."
        ]
      },
      tr: {
        title: "Mavi LED Devrimi ve Enerji Tasarrufu",
        summary: "30 yıl çözülemeyen mavi diyot problemini çözerek akkor ampulleri tarihe gömen buluş ve 2014 Nobel Fizik Ödülü.",
        ahaMoment: "Kırmızı ve yeşil LED vardı ama beyaz ışık için mavi şarttı; Nakamura galyum nitrür kristalini saflaştırarak mavi ışığı yaktı.",
        howItWorks: "Geniş bant aralıklı GaN kristalinde elektron-deşik birleşmesi mavi fotonlar yayar; sarı fosforla birleştiğinde beyaz ışık elde edilir.",
        realWorldImpact: "Küresel elektrik tüketiminde devasa tasarruf, cep telefonu ekranları ve LED aydınlatma.",
        curriculumConnection: "Yarı iletken diyotlar, ışığın renk teorisi (RGB) ve enerji verimliliği kazanımları.",
        funFacts: [
          "Nobel Komitesi: '20. yüzyılı akkor ampul aydınlattı, 21. yüzyılı LED aydınlatacak' demiştir."
        ]
      },
      ru: {
        title: "Изобретение синих светодиодов (LED)",
        summary: "Преодоление 30 лет неудач в физике полупроводников и создание энергосберегающего белого света (Нобелевская премия 2014).",
        ahaMoment: "Накамура вырастил совершенный кристалл нитрида галлия (GaN), завершив триаду RGB для получения яркого белого света.",
        howItWorks: "Широкозонный полупроводник GaN испускает кванты синего света при рекомбинации электронов и дырок в p-n переходе.",
        realWorldImpact: "Экраны смартфонов, светодиодные лампы, спасшие тераватты электроэнергии, и фонари в развивающихся странах.",
        curriculumConnection: "Школьный курс: полупроводниковый диод, люминесценция, оптический спектр и теория цвета.",
        funFacts: [
          "Обычные лампы накаливания превращали 90% энергии в тепло; светодиоды превращают ее в полезный свет."
        ]
      }
    },
    quiz: [
      {
        id: "led-q1",
        question: "Ağ işıq almaq üçün hansı 3 əsas rəngin (RGB) birləşməsi tələb olunur?",
        options: [
          { id: "A", text: "Qırmızı, Yaşıl və Mavi (Red, Green, Blue)" },
          { id: "B", text: "Yalnız Qara və Ağ" },
          { id: "C", text: "Sarı, Qəhvəyi və Çəhrayı" },
          { id: "D", text: "Boz və Narıncı" }
        ],
        correctOption: "A",
        explanation: "Optikada işıq şüalarının toplanması (additiv model) ilə ağ işıq almaq üçün üç baza rəngi mütləqdir: Qırmızı, Yaşıl və Mavi.",
        bloomLevel: "Bilik"
      },
      {
        id: "led-q2",
        question: "LED lampalarının ənənəvi közərmə lampalarından başlıca üstünlüyü nədir?",
        options: [
          { id: "A", text: "80-90% daha az elektrik enerjisi sərf etməsi və enerjini istiliyə israf etməməsi" },
          { id: "B", text: "Daha çox qızması" },
          { id: "C", text: "Yalnız bir həftə işləməsi" },
          { id: "D", text: "Heç bir işıq verməməsi" }
        ],
        correctOption: "A",
        explanation: "Közərmə lampası volfram telini qızdıraraq enerjinin 90%-ni istilik kimi itirir; LED isə elektronların birbaşa rekombinasiyası ilə soyuq işıq yaradır.",
        bloomLevel: "Anlama"
      },
      {
        id: "led-q3",
        question: "Parlaq mavi işıqdiodunun hazırlanmasında istifadə olunan əsas yarımkeçirici material hansıdır?",
        options: [
          { id: "A", text: "Qallium nitrid (GaN)" },
          { id: "B", text: "Adi xörək duzu (NaCl)" },
          { id: "C", text: "Saf dəmir" },
          { id: "D", text: "Qurğuşun" }
        ],
        correctOption: "A",
        explanation: "GaN geniş qadağan olunmuş zonaya (3.4 eV) malikdir və yüksək enerjili göy-mavi fotonlar şüalandırmaq üçün ən ideal kristaldır.",
        bloomLevel: "Tətbiq"
      }
    ]
  }
]
