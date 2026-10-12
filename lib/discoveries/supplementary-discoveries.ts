import { ScientificDiscovery } from "@/lib/discoveries-types"

export const SUPPLEMENTARY_DISCOVERIES: ScientificDiscovery[] = [
  {
    id: "optical-fibers-charles-kao",
    slug: "optical-fibers-fiber-optics-broadband-nobel",
    category: "fizika",
    isNobel: true,
    nobelPrize: {
      year: 2009,
      category: "Fizika",
      laureates: ["Charles K. Kao"],
      citation: "İşıq rabitəsi üçün liflərdə işığın ötürülməsi sahəsində qabaqcıl nailiyyətlərə görə"
    },
    discoveryYear: 1966,
    discoverer: "Çarlz Kao (Charles K. Kao)",
    curriculumSubject: "Fizika / İnformatika",
    curriculumGrade: "8-11-ci sinif",
    curriculumTopic: "İşığın tam daxili qayıtması, optik liflər və qlobal internet şəbəkəsi",
    icon: "Network",
    accentColor: "from-cyan-600 to-blue-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Optik Liflər və Fiber-Optik İnternet: Şüşə İp Üzərində İşıq Sürəti",
        summary: "Okeanların dibi ilə qitələri birləşdirən saç tükü qalınlığında şəffaf şüşə liflər: qlobal internetin fiziki magistralı.",
        ahaMoment: "1960-cı illərdə hamı düşünürdü ki, şüşə liflərdən işıq ötürmək səmərəsizdir, çünki bir neçə metrdən sonra işıq sönürdü. Çarlz Kao sübut etdi ki, problem şüşənin təbiətində deyil, onun tərkibindəki mikroskopik dəmir çirklərindədir. Əgər təmiz kvars şüşəsi hazırlansa, işıq heç bir itki olmadan yüz kilometrlərlə məsafəyə siqnal apara bilər!",
        howItWorks: "Optik lif iki qatdan ibarətdir: yüksək sındırma əmsallı daxili nüvə və aşağı sındırma əmsallı xarici örtük. İşıq şüası nüvəyə daxil olduqda tam daxili qayıtma bucağı ilə kənara çıxmadan ziqzaq şəklində şüşənin içində qalaraq işıq sürəti ilə irəliləyir.",
        realWorldImpact: "Qlobal genişzolaqlı internet, qitələrarası sualtı optik kabellər, tibbi endoskopiya və laparoskopik cərrahiyyə.",
        curriculumConnection: "8-ci və 11-ci sinif Geometrik Optikada 'İşığın tam daxili qayıtması hadisəsi', 'Hüdud bucağı (sin α₀ = 1/n)' və 'Optik liflər' mövzularına tam aiddir.",
        funFacts: [
          "Yer kürəsini saran sualtı fiber-optik kabellərin ümumi uzunluğu 1.4 milyon kilometrdən çoxdur – bu, Yeri ekvator boyunca 35 dəfə dolanmağa bəs edir!"
        ]
      },
      en: {
        title: "Optical Fibers and the Fiber-Optic Revolution",
        summary: "Harnessing total internal reflection inside ultra-pure glass to carry the world's internet traffic (2009 Nobel Prize in Physics).",
        ahaMoment: "Kao proved glass transparency loss was caused by chemical impurities, not intrinsic scattering, clearing the path for long-distance optical fiber telecommunications.",
        howItWorks: "Total internal reflection traps laser light inside a high-index silica core surrounded by a lower-index cladding.",
        realWorldImpact: "Submarine transoceanic internet backbones, 5G fiber backhaul, and minimally invasive medical endoscopy.",
        curriculumConnection: "Core optics curriculum: total internal reflection, critical angle, and refractive index.",
        funFacts: [
          "Over 1.4 million kilometers of undersea fiber optic cables link the continents today."
        ]
      },
      tr: {
        title: "Fiber Optik Kablolar ve Işık Hızında İnternet",
        summary: "Tam iç yansıma ile okyanusların altından kıtaları birbirine bağlayan cam teller ve 2009 Nobel Fizik Ödülü.",
        ahaMoment: "Charles Kao, saf silika camında ışığın kilometrelerce hiç sönmeden ilerleyebileceğini kanıtladı.",
        howItWorks: "Işık, kırılma indisi yüksek cam çekirdek içinde tam iç yansıma yaparak bükülse bile dışarı kaçmadan ilerler.",
        realWorldImpact: "Küresel yüksek hızlı internet omurgası, kıtalararası veri hatları ve tıbbi endoskopi.",
        curriculumConnection: "Fizikte tam yansıma, sınır açısı ve ışığın kırılması kazanımlarıyla tam uyumludur.",
        funFacts: [
          "Bugün okyanus tabanlarında 1.4 milyon kilometreden fazla fiber kablo döşelidir."
        ]
      },
      ru: {
        title: "Оптоволокно и революция оптической связи",
        summary: "Передача терабит информации по тончайшим стеклянным нитям с помощью полного внутреннего отражения (Нобелевская премия по физике 2009).",
        ahaMoment: "Чарльз Као доказал, что затухание света вызвано примесями, а не свойствами стекла, создав основу оптоволоконной связи.",
        howItWorks: "Явление полного внутреннего отражения запирает луч лазера внутри сердцевины с высоким показателем преломления.",
        realWorldImpact: "Всемирный высокоскоростной Интернет, подводные трансокеанские магистрали и медицинские эндоскопы.",
        curriculumConnection: "Школьная оптика: закон преломления света, предельный угол, полное внутреннее отражение.",
        funFacts: [
          "Общая длина подводных оптоволоконных кабелей на дне океанов превышает 1.4 миллиона километров."
        ]
      }
    },
    quiz: [
      {
        id: "opt-q1",
        question: "Optik lif daxilində işıq şüasının kənara çıxmadan irəliləməsini təmin edən optik hadisə hansıdır?",
        options: [
          { id: "A", text: "İşığın tam daxili qayıtması" },
          { id: "B", text: "İşığın polyarizasiyası" },
          { id: "C", text: "Fotoeffekt" },
          { id: "D", text: "İşığın difraksiyası" }
        ],
        correctOption: "A",
        explanation: "Şüa optik sıx mühitdən az sıx mühit sərhədinə hüdud bucağından böyük bucaq altında düşdükdə tamamilə əks olunur və lifin içində qalır.",
        bloomLevel: "Anlama"
      },
      {
        id: "opt-q2",
        question: "Tam daxili qayıtmanın baş verməsi üçün şüa hansı mühitdən hansına keçməyə çalışmalıdır?",
        options: [
          { id: "A", text: "Optik sıx mühitdən optik seyrək mühitə (böyük sındırma əmsalından kiçiyə)" },
          { id: "B", text: "Seyrək mühitdən sıx mühitə" },
          { id: "C", text: "Yalnız vakuumdan havaya" },
          { id: "D", text: "Eyni sındırma əmsallı iki maddə arasında" }
        ],
        correctOption: "A",
        explanation: "Tam daxili qayıtma yalnız şüa optik sıxlığı böyük olan mühitdən (məs. şüşə n=1.5) kiçik olan mühitə (hava n=1.0) keçəndə baş verir.",
        bloomLevel: "Bilik"
      },
      {
        id: "opt-q3",
        question: "Fiber-optik rabitənin ənənəvi mis kabellərlə müqayisədə başlıca üstünlüyü nədir?",
        options: [
          { id: "A", text: "Nəhəng ötürmə zolağı (yüksək sürət), zəif siqnal itkisi və elektromaqnit parazitlərə qarşı mütləq dözümlülük" },
          { id: "B", text: "Elektrik cərəyanı vurma təhlükəsi" },
          { id: "C", text: "Daha ağır və qalın olması" },
          { id: "D", text: "Yalnız səsləri ötürməsi" }
        ],
        correctOption: "A",
        explanation: "Optik liflər işıq dalğaları ilə işlədiyi üçün radio-küyə həssas deyil, paslanmır və saniyədə terabitlərlə məlumat daşıyır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "mri-nuclear-magnetic-resonance",
    slug: "mri-magnetic-resonance-imaging-medicine-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2003,
      category: "Fiziologiya və ya Tibb",
      laureates: ["Paul C. Lauterbur", "Sir Peter Mansfield"],
      citation: "Maqnit-rezonans tomoqrafiyası ilə bağlı kəşflərə görə"
    },
    discoveryYear: 1973,
    discoverer: "Paul Lauterbur və Peter Mansfield",
    curriculumSubject: "Fizika / Biologiya",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Nüvə maqnit rezonansı, hidrogen atomunun spini, maqnit sahəsi və tibbi tomoqrafiya",
    icon: "Activity",
    accentColor: "from-blue-700 to-indigo-900",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Maqnit Rezonans Tomoqrafiyası (MRT): Zərərsiz Daxili Baxış",
        summary: "Heç bir zərərli rentgen şüalanması olmadan, sadəcə bədənimizdəki su molekullarının maqnit rəqsi ilə daxili orqanların kəsiyini çəkən möcüzə.",
        ahaMoment: "Bədənimizin 70%-i sudan (H2O) ibarətdir və hər su molekulunda iki hidrogen nüvəsi – fırlanan balaca proton maqnitlər var. Pol Loterbur kəşf etdi ki, güclü maqnit sahəsinə maqnit qradiyenti əlavə etsək, müxtəlif toxumalardakı protonlar fərqli tezliklərdə rezonans verər və onların dəqiq 2D/3D anatomik şəklini almaq olar!",
        howItWorks: "MRT aparatının ifratkeçirici maqniti bədəndəki protonların spinlərini bir istiqamətə düzür. Radiotezlikli impuls verildikdə protonlar enerjini udub meyl edir. İmpuls kəsildikdə protonlar ilkin vəziyyətinə qayıdarkən (relaksasiya) radio siqnal yayır. Yumşaq toxumalar (beyin, əzələ, bağlar) fərqli su sıxlığına malik olduğundan ekranda fövqəladə aydın təsvir yaranır.",
        realWorldImpact: "Baş beyin və onurğa beyni xəstəliklərinin, insultun, şişlərin və idman zədələrinin rentgen şüalanması olmadan 100% təhlükəsiz diaqnostikası.",
        curriculumConnection: "10-cu sinif Fizikada 'Maqnit sahəsinin induksiyası', 11-ci sinifdə 'Nüvə maqnit xassələri və rezonans hadisəsi' bölmələri.",
        funFacts: [
          "MRT aparatı işləyərkən eşidilən bərk taqqıltı səsi qradiyent maqnit dolaqlarının güclü Lorens qüvvəsindən mexaniki titrəməsidir."
        ]
      },
      en: {
        title: "Magnetic Resonance Imaging (MRI)",
        summary: "Mapping internal organs without ionizing radiation using proton nuclear spin precession (2003 Nobel Prize in Physiology or Medicine).",
        ahaMoment: "Lauterbur introduced magnetic field gradients to spatially encode nuclear magnetic resonance signals into 2D tomographic slices.",
        howItWorks: "Superconducting magnets align water proton spins. Radiofrequency pulses excite them, and relaxometry radio signals construct detailed soft-tissue contrast images.",
        realWorldImpact: "Essential diagnostic modality for neurological brain tumors, spinal trauma, ischemic stroke, and musculoskeletal injuries.",
        curriculumConnection: "Nuclear spin magnetism, resonance phenomena, and RF electromagnetic waves.",
        funFacts: [
          "The loud thumping sound during an MRI scan is caused by magnetic Lorentz forces vibrating the gradient coils."
        ]
      },
      tr: {
        title: "Manyetik Rezonans Görüntüleme (MRG/Emar)",
        summary: "Radyasyonsuz, sadece vücuttaki su moleküllerinin manyetik titreşimiyle iç organları tarayan mucize ve 2003 Nobel Tıp Ödülü.",
        ahaMoment: "Manyetik alan gradyanları kullanarak hidrojen çekirdeklerinin rezonans frekansından 3 boyutlu anatomik görüntü ürettiler.",
        howItWorks: "Güçlü mıknatıs proton spinlerini hizalar; radyo frekansı darbesi kesilince dokulardan yayılan sinyaller haritalanır.",
        realWorldImpact: "Beyin tümörleri, fıtıklar, inme ve yumuşak doku hasarlarının sıfır radyasyonla teşhisi.",
        curriculumConnection: "Manyetik alan, rezonans olayı ve çekirdek fiziği kazanımlarıyla tam uyumludur.",
        funFacts: [
          "MR cihazının yüksek tıkırtı sesi, gradyan bobinlerine etki eden devasa Lorentz kuvvetinin titreşimidir."
        ]
      },
      ru: {
        title: "Магнитно-резонансная томография (МРТ)",
        summary: "Безопасная визуализация мягких тканей с помощью ядерного магнитного резонанса (Нобелевская премия по медицине 2003).",
        ahaMoment: "Лотербур применил градиент магнитного поля, связав частоту прецессии протонов с их координатами в теле.",
        howItWorks: "Протоны молекул воды ориентируются в поле магнита; после радиочастотного импульса сигналы релаксации преобразуются в 3D-томограмму.",
        realWorldImpact: "Золотой стандарт диагностики инсультов, опухолей мозга, патологий суставов и позвоночника.",
        curriculumConnection: "Школьный курс: магнитный резонанс, спин ядра, электромагнитные волны радиодиапазона.",
        funFacts: [
          "Громкий стук томографа возникает из-за вибраций катушек под действием силы Лоренца."
        ]
      }
    },
    quiz: [
      {
        id: "mri-q1",
        question: "MRT müayinəsinin Kompüter Tomoqrafiyasından (KT) və rentgendən ən başlıca üstünlüyü nədir?",
        options: [
          { id: "A", text: "Zərərli ionlaşdırıcı rentgen şüalanmasından istifadə etməməsi və tam təhlükəsiz olması" },
          { id: "B", text: "Daha ucuz olması" },
          { id: "C", text: "Yalnız sümükləri göstərməsi" },
          { id: "D", text: "Heç bir elektrik tələb etməməsi" }
        ],
        correctOption: "A",
        explanation: "MRT-də zərərli rentgen şüası yoxdur; o, güclü maqnit sahəsi və zərərsiz radio dalğaları əsasında işləyir.",
        bloomLevel: "Anlama"
      },
      {
        id: "mri-q2",
        question: "MRT cihazı insan bədənində ən çox hansı elementin atom nüvələrinin rezonans siqnalını qeydə alır?",
        options: [
          { id: "A", text: "Hidrogen atomlarının (suyun tərkibindəki protonların)" },
          { id: "B", text: "Qızıl atomlarının" },
          { id: "C", text: "Yalnız dəmirin" },
          { id: "D", text: "Qurğuşunun" }
        ],
        correctOption: "A",
        explanation: "İnsan bədəninin böyük hissəsi sudur (H2O) və hidrogen nüvələri (tək protonlar) ən güclü maqnit rezonans siqnalı verən nüvələrdir.",
        bloomLevel: "Bilik"
      },
      {
        id: "mri-q3",
        question: "Niyə MRT otağına heç bir metal əşya (açarlar, dəmir alətlər) ilə daxil olmaq olmaz?",
        options: [
          { id: "A", text: "Aparatın nəhəng maqnit sahəsi metal əşyaları böyük güclə özünə cəzb edərək zədə vura bilər" },
          { id: "B", text: "Metallar dərhal əriyir" },
          { id: "C", text: "Otağın havası zəhərlənir" },
          { id: "D", text: "Şəkillər qara-ağ çıxır" }
        ],
        correctOption: "A",
        explanation: "MRT maqnitinin sahəsi Yerin maqnit sahəsindən on minlərlə dəfə güclüdür və ferromaqnit cisimləri mərmi sürətilə cəzb edir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "fullerenes-carbon-allotrope",
    slug: "fullerenes-carbon-buckyballs-nanomaterials-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 1996,
      category: "Kimya",
      laureates: ["Robert F. Curl Jr.", "Sir Harold W. Kroto", "Richard E. Smalley"],
      citation: "Fullerenlərin kəşfinə görə"
    },
    discoveryYear: 1985,
    discoverer: "Kroto, Smalley və Curl",
    curriculumSubject: "Kimya",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Karbonun allotropiyası, fullerenlər (C60), nanoborular və nano-kimya",
    icon: "Boxes",
    accentColor: "from-amber-600 to-stone-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Fullerenlər (C60): Futbol Topu Şəkilli Molekullar",
        summary: "Karbonun almaz və qrafitdən sonrakı üçüncü forması: 60 karbon atomundan ibarət kürəvi nano-qəfəs və nanoboruların başlanğıcı.",
        ahaMoment: "Alimlər ulduzlararası fəzada karbon molekullarını lazerlə buxarlandırarkən təsadüfən aşkar etdilər ki, kütlə spektrometrində həmişə tam 60 karbon atomundan ibarət qeyri-adi sabit bir pik yaranır! Harrold Kroto və Riçard Smolli anladılar ki, bu 60 atom arxitektor Bakminster Fullerin qübbələri və adi futbol topu kimi 12 beşbucaqlı və 20 altıbucaqlıdan təşkil olunmuş içi boş mükəmməl kürə əmələ gətirir!",
        howItWorks: "Fulleren (Bakminsterfulleren - C60) karbonun molekulyar allotropik formasıdır. İçi boş qəfəs quruluşu sayəsində onun daxilinə digər atomları (məsələn, radioaktiv atomları və ya dərman molekullarını) həbs etmək mümkündür (endohedral fullerenlər).",
        realWorldImpact: "Karbon nanoborularının və qrafenin kəşfinə təkan verdi; xərçəng dərmanlarının hədəf hüceyrəyə daşınması, üzvi günəş batareyaları və sürtkü yağları.",
        curriculumConnection: "9-cu sinif Kimyada 'Karbonun allotropik şəkildəyişmələri (Almaz, qrafit, karbin, fulleren)', 10-cu sinifdə 'Bərk cisimlərin qəfəs tipləri' mövzuları.",
        funFacts: [
          "C60 molekulunun diametri cəmi 0.7 nanometrdir – yəni adi futbol topundan təxminən 300 milyon dəfə kiçikdir!"
        ]
      },
      en: {
        title: "Fullerenes: Carbon Buckyballs (C60)",
        summary: "Discovering a hollow spherical cage of 60 carbon atoms shaped like a soccer ball (1996 Nobel Prize in Chemistry).",
        ahaMoment: "Laser vaporization of graphite revealed an ultra-stable 60-carbon cluster forming a truncated icosahedron.",
        howItWorks: "60 sp2-hybridized carbon atoms link into 12 pentagons and 20 hexagons, forming an aromatic hollow molecular cage.",
        realWorldImpact: "Inaugurated carbon nanotechnology, paved the way for nanotubes/graphene, and enables targeted drug delivery cages.",
        curriculumConnection: "Carbon allotropes, covalent network vs molecular crystals, and nanotechnology basics.",
        funFacts: [
          "Named Buckminsterfullerene after architect Buckminster Fuller, famous for geodesic domes."
        ]
      },
      tr: {
        title: "Fullerenler (C60) ve Nanoteknoloji",
        summary: "Futbol topu şeklinde 60 karbon atomundan oluşan içi boş moleküller ve 1996 Nobel Kimya Ödülü.",
        ahaMoment: "Kroto ve Smalley, lazerle buharlaştırılan grafitten tam 60 atomluk süper kararlı bir küre oluştuğunu buldular.",
        howItWorks: "12 beşgen ve 20 altıgenden oluşan kesik ikosaedron geometrisi, içine başka atomların hapsedilebildiği bir kafestir.",
        realWorldImpact: "Karbon nanotüplerin keşfi, hedefe ilaç taşıyan nano kapsüller ve organik güneş pilleri.",
        curriculumConnection: "Karbonun allotropları, moleküler kristal yapıları ve nanoteknoloji kazanımları.",
        funFacts: [
          "C60 molekülü gerçek bir futbol topundan 300 milyon kat daha küçüktür."
        ]
      },
      ru: {
        title: "Фуллерены: углеродные бакиболы (C60)",
        summary: "Открытие полой сферы из 60 атомов углерода в форме футбольного мяча (Нобелевская премия по химии 1996).",
        ahaMoment: "Испарение графита лазером показало пик массы ровно в 60 атомов, образующих идеальный усеченный икосаэдр.",
        howItWorks: "Полый молекулярный каркас из 12 пятиугольников и 20 шестиугольников с сопряженными sp2 связями.",
        realWorldImpact: "Рождение углеродной нанотехнологии, создание нанотрубок и адресная доставка лекарств внутри углеродных капсул.",
        curriculumConnection: "Школьная химия 9 класса: аллотропные видоизменения углерода (алмаз, графит, фуллерен).",
        funFacts: [
          "Молекула C60 названа в честь архитектора Ричарда Бакминстера Фуллера, строившего геодезические купола."
        ]
      }
    },
    quiz: [
      {
        id: "ful-q1",
        question: "Ən məşhur və dayanıqlı fulleren molekulu neçə karbon atomundan ibarətdir?",
        options: [
          { id: "A", text: "60 karbon atomundan (C60)" },
          { id: "B", text: "12 karbon atomundan" },
          { id: "C", text: "1000 karbon atomundan" },
          { id: "D", text: "Yalnız 4 karbon atomundan" }
        ],
        correctOption: "A",
        explanation: "Kroto və Smalley tərəfindən kəşf edilmiş ən simmetrik və dayanıqlı fulleren C60 molekuludur.",
        bloomLevel: "Bilik"
      },
      {
        id: "ful-q2",
        question: "Almaz və qrafitdən fərqli olaraq fullerenin kristal qəfəsi hansı xarakterə malikdir?",
        options: [
          { id: "A", text: "Molekulyar kristal qəfəsinə (ayrı-ayrı C60 molekullarından təşkil olunub)" },
          { id: "B", text: "İon qəfəsinə" },
          { id: "C", text: "Metal qəfəsinə" },
          { id: "D", text: "Qəfəsi yoxdur, mayedir" }
        ],
        correctOption: "A",
        explanation: "Almaz və qrafit atom kristallik şəbəkəyə malikdir (sonsuz karkasdır); fulleren isə bərk halda molekulyar qəfəs əmələ gətirir və üzvi həlledicilərdə həll olur.",
        bloomLevel: "Anlama"
      },
      {
        id: "ful-q3",
        question: "C60 molekulunun fəza həndəsəsi hansı idman avadanlığına bənzəyir?",
        options: [
          { id: "A", text: "Klassik futbol topuna (12 beşbucaqlı və 20 altıbucaqlı paneldən ibarət kəsilmiş ikosaedr)" },
          { id: "B", text: "Reqbi topuna" },
          { id: "C", text: "Bilyard şarına" },
          { id: "D", text: "Şahmat taxtasına" }
        ],
        correctOption: "A",
        explanation: "Fullerenin həndəsi forması kəsilmiş ikosaedrdir və klassik dəri futbol topunun tikişlərini 100% təkrarlayır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "laser-stimulated-emission",
    slug: "laser-stimulated-emission-coherent-light-nobel",
    category: "fizika",
    isNobel: true,
    nobelPrize: {
      year: 1964,
      category: "Fizika",
      laureates: ["Charles H. Townes", "Nikolay G. Basov", "Aleksandr M. Prokhorov"],
      citation: "Lazer-mazer prinsipinə əsaslanan generator və gücləndiricilərin yaradılmasına gətirib çıxaran fundamental kvant elektronikası işlərinə görə"
    },
    discoveryYear: 1960,
    discoverer: "Townes, Basov, Prokhorov və Theodore Maiman",
    curriculumSubject: "Fizika",
    curriculumGrade: "11-ci sinif",
    curriculumTopic: "Kvant elektronikası, məcburi şüalanma, koherent işıq və lazerlər",
    icon: "Zap",
    accentColor: "from-rose-600 to-red-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Lazer və Məcburi Şüalanma: İntizamlı İşıq Süngüsü",
        summary: "Eynşteynin nəzəriyyəsindən doğan monoxromatik, koherent və dar paralel şüa: cərrahiyyədən kosmosa qədər tətbiq olunan işıq silahı.",
        ahaMoment: "Adi lampa işığı bütün rənglərdə və xaotik istiqamətlərdə yayılır – bu, izdihamlı küçədəki qarışıq kütlə kimidir. 1917-ci ildə Eynşteyn hesablamışdı ki, əgər həyəcanlanmış atoma həmin enerjili foton dəysə, atom məcburi olaraq onunla tam eyni fazada, eyni rəngdə və eyni istiqamətdə əkiz ikinci foton buraxacaq! 1960-cı ildə Teodor Meyman yaqut kristalından ilk lazer şüasını yandırdı: ordu kimi intizamlı bir istiqamətə addımlayan fotonlar seli!",
        howItWorks: "Lazer üç hissədən ibarətdir: 1) Aktiv mühit (məsələn, yaqut və ya yarımkeçirici), 2) Qidalanma/həyəcanlandırma mənbəyi (optik nasoslama ilə invers məskunlaşma yaradılır), 3) Optik rezonator (iki paralel güzgü; biri yarımşəffaf). Fotonlar güzgülər arasında minlərlə dəfə gedib-gələrək məcburi şüalanma ilə çoxalır və yarımşəffaf güzgüdən güclü dar şüa kimi çıxır.",
        realWorldImpact: "Göz və xərçəng cərrahiyyəsi, metalların lazerlə kəsilməsi, barkod skanerləri, lazer məsafəölçənləri və lazer rabitəsi.",
        curriculumConnection: "11-ci sinif Fizikada 'Lazerlərin iş prinsipi', 'Spontan və məcburi şüalanma', 'Koherentlik və monoxromatiklik' mövzuları.",
        funFacts: [
          "LASER sözü akronimdir: 'Light Amplification by Stimulated Emission of Radiation' (Şüalanmanın Məcburi Emissiyası ilə İşığın Gücləndirilməsi)."
        ]
      },
      en: {
        title: "The Laser and Stimulated Emission",
        summary: "Transforming Einstein's stimulated emission into coherent monochromatic beams (1964 Nobel Prize in Physics).",
        ahaMoment: "Einstein predicted stimulated emission in 1917; Maiman realized it physically in 1960 using a synthetic ruby crystal and flashlamp.",
        howItWorks: "Population inversion pumps atoms to upper energy levels; resonant cavity mirrors trigger exponential stimulated emission cascade.",
        realWorldImpact: "Ophthalmic eye surgery, industrial metal cutting, barcode scanners, fiber-optic transmitters, and LIDAR navigation.",
        curriculumConnection: "Stimulated vs spontaneous emission, optical resonators, and monochromatic coherence.",
        funFacts: [
          "LASER is an acronym for Light Amplification by Stimulated Emission of Radiation."
        ]
      },
      tr: {
        title: "Lazer ve Uyarılmış Işıma",
        summary: "Işığın tek dalga boyunda disiplinli bir ışına dönüştürülmesi ve 1964 Nobel Fizik Ödülü.",
        ahaMoment: "Einstein'ın uyarılmış emisyon teorisinin yakut kristali ve aynalar kullanılarak pratik bir ışık jeneratörüne dönüştürülmesi.",
        howItWorks: "Tersine dağılım ile uyarılan atomlar tam aynı faz ve frekansta foton yayarak aynalar arasında katlanarak güçlenir.",
        realWorldImpact: "Göz ameliyatları, lazerli metal kesim, barkod okuyucular ve LIDAR sensörleri.",
        curriculumConnection: "Fizikte lazerin çalışma prensibi, uyarılmış emisyon ve koherent ışık özellikleri.",
        funFacts: [
          "Lazer ilk icat edildiğinde 'bir çözüm arayan problem' olarak anılmıştı; bugün her teknolojinin kalbindedir."
        ]
      },
      ru: {
        title: "Лазеры и вынужденное излучение",
        summary: "Создание квантовых генераторов когерентного монохроматического света (Нобелевская премия по физике 1964).",
        ahaMoment: "Басов, Прохоров и Таунс создали квантовые усилители, а Майман запустил первый оптический рубиновый лазер.",
        howItWorks: "Инверсная заселенность уровней и оптический резонатор: фотон индуцирует испускание абсолютно тождественного фотона-близнеца.",
        realWorldImpact: "Лазерная хирургия сетчатки глаза, резка металлов, считыватели штрихкодов и лидары беспилотных авто.",
        curriculumConnection: "Школьная физика 11 класса: спонтанное и вынужденное излучение, свойства лазерного луча.",
        funFacts: [
          "Слово LASER — аббревиатура: Light Amplification by Stimulated Emission of Radiation."
        ]
      }
    },
    quiz: [
      {
        id: "las-q1",
        question: "Lazer şüalanmasını adi közərmə lampasının işığından fərqləndirən əsas xüsusiyyətlər hansılardır?",
        options: [
          { id: "A", text: "Monoxromatik (tək tezlikli), koherent (eyni fazalı) və ciddi bir istiqamətə yönəlmiş olması" },
          { id: "B", text: "Bütün rəngləri eyni vaxtda yayması" },
          { id: "C", text: "Yalnız qaranlıqda işləməsi" },
          { id: "D", text: "İstiliyi heç vaxt ötürməməsi" }
        ],
        correctOption: "A",
        explanation: "Lazer şüası ciddi monoxromatikdir (tək dalğa uzunluğu), bütün fotonlar eyni fazadadır (koherent) və demək olar ki, səpilmədən düz yayılır.",
        bloomLevel: "Anlama"
      },
      {
        id: "las-q2",
        question: "Lazerin işləməsi üçün aktiv mühitdə hansı vacib fiziki vəziyyət (şərt) yaradılmalıdır?",
        options: [
          { id: "A", text: "İnvers məskunlaşma (yuxarı enerji səviyyəsindəki atomların sayının aşağıdakından çox olması)" },
          { id: "B", text: "Temperaturun mütləq sıfıra endirilməsi" },
          { id: "C", text: "Aktiv mühitin maye olması" },
          { id: "D", text: "Mühitin vakuumda saxlanması" }
        ],
        correctOption: "A",
        explanation: "Məcburi şüalanmanın udulmadan üstün olması üçün həyəcanlanmış atomların sayı əsas haldakı atomların sayından çox olmalıdır (invers məskunlaşma).",
        bloomLevel: "Bilik"
      },
      {
        id: "las-q3",
        question: "Lazer rezonatorunda istifadə olunan iki güzgünün rolu nədir?",
        options: [
          { id: "A", text: "Fotonları aktiv mühitdən dəfələrlə keçirərək şüalanmanı sel kimi gücləndirmək" },
          { id: "B", text: "Otağı bəzəmək" },
          { id: "C", text: "İşığı söndürmək" },
          { id: "D", text: "Lazerin çəkisini azaltmaq" }
        ],
        correctOption: "A",
        explanation: "Güzgülər müsbət əks-əlaqə yaradır: fotonlar mühit boyu geri və irəli qayıdaraq yeni atomları məcbur edir və şüanı qat-qat gücləndirir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "dna-fingerprinting-alec-jeffreys",
    slug: "dna-fingerprinting-forensic-genetics-alec-jeffreys",
    category: "biologiya",
    isNobel: false,
    discoveryYear: 1984,
    discoverer: "Ser Alek Ceffris (Sir Alec Jeffreys)",
    curriculumSubject: "Biologiya",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "DNT profilləşdirməsi, tandem təkrarlar (VNTR/STR), elektroforez və məhkəmə tibbi ekspertizası",
    icon: "Fingerprint",
    accentColor: "from-blue-600 to-indigo-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "DNT Daktiloskopiyası: Genetik Barmaq İzi",
        summary: "Bircə damla qandan və ya saç telindən cinayətkarları və qohumluq əlaqələrini 99.999% dəqiqliklə tapan genetik barkod.",
        ahaMoment: "1984-cü ilin bir bazar ertəsi səhəri Lester Universitetində Alek Ceffris rentgen plyonkasına baxanda qəfil heyrətləndi: plyonkada insan DNT-sinin kəsilmiş parçaları ştrix-kod (barkod) kimi zolaqlar əmələ gətirmişdi! O gördü ki, hər bir insanın bu zolaq naxışı təkrarolunmazdır, lakin uşağın zolaqlarının yarısı anaya, yarısı isə ataya məxsusdur!",
        howItWorks: "İnsan genomunun 99.9%-i hamıda eynidir, lakin zülal kodlaşdırmayan hissələrdə qısa təkrar ardıcıllıqlar (VNTR və STR) var. Bu təkrar sayı hər fərddə unikaldır. Restriktaza fermentləri DNT-ni kəsir, gel-elektroforez vasitəsilə parçalar ölçüsünə görə ayrılır və hər insana xas genetik barmaq izi alınır.",
        realWorldImpact: "Cinayətlərin açılması, günahsız məhkumların bəraət alması (Innocence Project), atalıq testləri və qədim qəbirlərin şəxsiyyət təyini.",
        curriculumConnection: "10-cu sinif Biologiyada 'Genetik kod və genom müxtəlifliyi', 11-ci sinifdə 'Biotexnologiya və DNT analizi metodları' mövzuları.",
        funFacts: [
          "Tarixdə DNT analizi ilə həll olunan ilk cinayət işi 1986-cı ildə İngiltərədə Koli Pitsforkun həbs edilməsi və günahsız bir şübhəlinin azadlığa buraxılması oldu."
        ]
      },
      en: {
        title: "Alec Jeffreys: DNA Fingerprinting",
        summary: "Developing forensic DNA profiling to uniquely identify individuals from tiny biological traces.",
        ahaMoment: "Jeffreys realized hypervariable minisatellite repeat patterns form an individual-specific genetic barcode.",
        howItWorks: "Restriction fragment length polymorphisms and short tandem repeats (STRs) separated by gel electrophoresis reveal unique banding profiles.",
        realWorldImpact: "Forensic crime scene investigation, paternity testing, mass disaster victim identification, and exoneration of wrongfully convicted prisoners.",
        curriculumConnection: "Non-coding DNA repeats, restriction enzymes, gel electrophoresis, and human genetics.",
        funFacts: [
          "Colin Pitchfork was the first murderer convicted via DNA evidence in history (1987)."
        ]
      },
      tr: {
        title: "DNA Parmak İzi ve Adli Genetik",
        summary: "Bir damla kandan suçluları ve babalık bağını %99.999 kesinlikle belirleyen genetik barkod.",
        ahaMoment: "Alec Jeffreys, tekrarlayan DNA parçalarının jel üzerindeki bantlarının her insana özel bir barkod oluşturduğunu gördü.",
        howItWorks: "Kodlama yapmayan bölgelerdeki STR ve VNTR tekrar sayıları restriksiyon enzimleri ve elektroforez ile ayrıştırılarak haritalanır.",
        realWorldImpact: "Adli tıp suç aydınlatmaları, babalık testleri ve masum mahkumların aklanması.",
        curriculumConnection: "Genetik mühendisliği, jel elektroforezi ve insan genom varyasyonları kazanımları.",
        funFacts: [
          "Tarihte DNA testiyle yakalanan ilk katil 1987 yılında Colin Pitchfork olmuştur."
        ]
      },
      ru: {
        title: "Генетическая дактилоскопия Алека Джеффриса",
        summary: "Идентификация личности по ДНК: от криминалистики до установления отцовства.",
        ahaMoment: "Джеффрис увидел, что минисателлитные повторы ДНК образуют уникальный штрихкод полос на рентгеновской пленке.",
        howItWorks: "Фрагменты тандемных повторов (STR) разделяются гель-электрофорезом по размеру, создавая индивидуальный профиль человека.",
        realWorldImpact: "Раскрытие нераскрытых преступлений, установление родства и оправдание невинно осужденных.",
        curriculumConnection: "Школьный курс: геном человека, некодирующая ДНК, рестрикция и электрофорез.",
        funFacts: [
          "Первым преступником, осужденным по ДНК в истории, стал Колин Питчфорк в 1987 году."
        ]
      }
    },
    quiz: [
      {
        id: "dna-f-q1",
        question: "DNT daktiloskopiyasında fərdləri bir-birindən fərqləndirən əsas amil nədir?",
        options: [
          { id: "A", text: "Qeyri-kodlaşdırıcı hissələrdəki tandem təkrarların (STR/VNTR) sayının hər insanda fərqli olması" },
          { id: "B", text: "Bütün insanlarda fərqli amin turşularının olması" },
          { id: "C", text: "Qanın rənginin fərqli olması" },
          { id: "D", text: "Xromosomların sayının fərqli olması" }
        ],
        correctOption: "A",
        explanation: "İnsanlarda zülal kodlayan genlər 99.9% eynidir; fərdilik təkrarlanan 'mikrosatellit' ardıcıllıqlarının sayındadır.",
        bloomLevel: "Anlama"
      },
      {
        id: "dna-f-q2",
        question: "Uşağın DNT zolaqları valideynlərin DNT zolaqları ilə necə uyğunlaşmalıdır?",
        options: [
          { id: "A", text: "Zolaqların yarısı ananın, digər yarısı isə bioloji atanın zolaqları ilə tam üst-üstə düşməlidir" },
          { id: "B", text: "Valideynlərlə heç bir ortaq zolaq olmamalıdır" },
          { id: "C", text: "Yalnız qardaşın zolaqları ilə uyğunlaşmalıdır" },
          { id: "D", text: "Zolaqlar hər il dəyişməlidir" }
        ],
        correctOption: "A",
        explanation: "Uşaq xromosomlarının yarısını anadan, yarısını atadan aldığı üçün onun DNT profilindəki hər bir zolaq mütləq ya anada, ya da atada mövcud olmalıdır.",
        bloomLevel: "Tətbiq"
      },
      {
        id: "dna-f-q3",
        question: "Aşağıdakı insan cütlüklərindən hansının DNT profili (barmaq izi) 100% bir-birinə tam bərabərdir?",
        options: [
          { id: "A", text: "Biryumurta (monozikot) əkizlərinin" },
          { id: "B", text: "Ayrıyumurta əkizlərinin" },
          { id: "C", text: "Ata və oğulun" },
          { id: "D", text: "Bacı və qardaşın" }
        ],
        correctOption: "A",
        explanation: "Biryumurta əkizləri tək mayalanmış ziqotdan yarandığı üçün onların DNT-si 100% eynidir (yalnız barmaq izi naxışları bətndəki təzyiqdən fərqlənir).",
        bloomLevel: "Bilik"
      }
    ]
  },
  {
    id: "louis-pasteur-germ-theory",
    slug: "louis-pasteur-germ-theory-pasteurization-rabies",
    category: "biologiya",
    isNobel: false,
    discoveryYear: 1862,
    discoverer: "Lui Paster (Louis Pasteur)",
    curriculumSubject: "Biologiya",
    curriculumGrade: "7-8-ci sinif",
    curriculumTopic: "Mikrobiologiyanın əsasları, mikroorqanizmlər, pasterizasiya və quduzluq peyvəndi",
    icon: "ShieldAlert",
    accentColor: "from-teal-600 to-emerald-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Lui Paster: Mikroblar Nəzəriyyəsi və Pasterizasiya",
        summary: "Çürümə və xəstəliklərin gözəgörünməz mikroorqanizmlərdən qaynaqlandığını sübut edən və öz-özünə yaranma mifini darmadağın edən alim.",
        ahaMoment: "İnsanlar min illər boyu inanırdılar ki, qurdlar çürük ətdən, siçanlar isə çirkli samandan öz-özünə yaranır (öz-özünə törənmə nəzəriyyəsi). Paster məşhur 'qu quşu boyunlu' əyri borulu kolbada bulyonu qaynatdı: hava içəri girsə də, toz və mikroblar əyri boruda ilişib qalırdı və bulyon aylarla xarab olmadan tərtəmiz qaldı! O sübut etdi: həyat yalnız həyatdan törəyir!",
        howItWorks: "Paster kəşf etdi ki, süd və şərabın qıcqırması mikrobların fəaliyyətidir. Mayeni 60-70°C-yə qədər qızdırıb dərhal soyutmaqla dadını pozmadan xəstəlik törədən mikrobları məhv etmək mümkündür (pasterizasiya). O həmçinin zəiflədilmiş patogenlərdən quduzluq və qarayara peyvəndlərini yaratdı.",
        realWorldImpact: "Xəstəxanalarda cərrahi alətlərin antiseptik dezinfeksiyası, süd və qida məhsullarının pasterizasiyası, quduzluqdan xilas.",
        curriculumConnection: "7-ci və 8-ci sinif Biologiyada 'Bakteriyaların çoxalması və spor əmələ gətirməsi', 'Qıcqırma prosesi', 'İnfeksion xəstəliklər və peyvəndlər' mövzuları.",
        funFacts: [
          "Paster quduzluq peyvəndini ilk dəfə quduz it tərəfindən 14 yerindən dişlənmiş 9 yaşlı Cozef Mayster adlı uşaq üzərində tətbiq edərək onu ölümdən xilas etdi."
        ]
      },
      en: {
        title: "Louis Pasteur: Germ Theory of Disease",
        summary: "Disproving spontaneous generation with swan-neck flasks to launch modern microbiology and pasteurization.",
        ahaMoment: "Broth boiled in swan-neck flasks stayed completely sterile indefinitely, proving microbes come from airborne contaminants.",
        howItWorks: "Heating liquids to 60-70°C eliminates vegetative pathogenic bacteria without degrading nutritional properties; attenuation creates vaccines.",
        realWorldImpact: "Antiseptic surgical hygiene, pasteurized milk, and rabies/anthrax vaccination.",
        curriculumConnection: "Bacterial reproduction, fermentation pathways, sterilisation protocols, and active immunity.",
        funFacts: [
          "Pasteur cured 9-year-old Joseph Meister, who was mauled by a rabid dog, with the world's first rabies vaccine."
        ]
      },
      tr: {
        title: "Louis Pasteur: Mikrop Teorisi ve Pastörizasyon",
        summary: "Kendiliğinden türeme safsatasını yıkarak mikropların hastalık yaptığını kanıtlayan devrim.",
        ahaMoment: "Kuğu boyunlu cam balonda kaynattığı et suyunun aylarca bozulmadığını göstererek yaşamın sadece yaşamdan doğduğunu ispatladı.",
        howItWorks: "Sıvıların kontrollü ısıtılmasıyla zararlı patojenler öldürülür (pastörizasyon); zayıflatılmış mikroplarla aşı üretilir.",
        realWorldImpact: "Cerrahi sterilizasyon, pastörize süt, kuduz ve şarbon aşıları.",
        curriculumConnection: "Mikrobiyoloji, fermantasyon, bakterilerin sporlanması ve bağışıklık kazanımları.",
        funFacts: [
          "Kuduz aşısını ilk kez kuduz bir köpeğin 14 yerinden ısırdığı küçük bir çocuk üzerinde deneyerek onu kurtardı."
        ]
      },
      ru: {
        title: "Луи Пастер: микробная теория и пастеризация",
        summary: "Окончательное опровержение теории самозарождения жизни и рождение вакцинации против бешенства.",
        ahaMoment: "Опыт с колбами с S-образным горлом доказал: бульон остается стерильным, если бактерии из воздуха не могут в него упасть.",
        howItWorks: "Нагрев жидкостей до 60–70°C уничтожает бактерии без кипячения (пастеризация); аттенуация микробов создает вакцины.",
        realWorldImpact: "Пастеризация продуктов, асептика и антисептика в хирургии, ликвидация бешенства и сибирской язвы.",
        curriculumConnection: "Школьный курс: бактерии, спорообразование, брожение, стерилизация, приобретенный иммунитет.",
        funFacts: [
          "Пастер спас 9-летнего Жозефа Мейстера, искусанного бешеной собакой, впервые применив антирабическую вакцину."
        ]
      }
    },
    quiz: [
      {
        id: "pas-q1",
        question: "Lui Pasterin 'qu quşu boyunlu' kolba ilə apardığı təcrübə hansı yanlış nəzəriyyəni birdəfəlik təkzib etdi?",
        options: [
          { id: "A", text: "Canlıların cansız maddələrdən öz-özünə törənməsi (spontan yaranma) nəzəriyyəsini" },
          { id: "B", text: "Qravitasiya nəzəriyyəsini" },
          { id: "C", text: "Kütlənin saxlanması qanununu" },
          { id: "D", text: "Hüceyrə nəzəriyyəsini" }
        ],
        correctOption: "A",
        explanation: "Paster sübut etdi ki, həyat yalnız əvvəlki həyatdan yaranır; qorunan steril bulyonda heç vaxt öz-özünə mikrob əmələ gəlmir.",
        bloomLevel: "Anlama"
      },
      {
        id: "pas-q2",
        question: "Pasterizasiya prosesinin qaynatmadan (sterilizasiyadan) əsas fərqi nədir?",
        options: [
          { id: "A", text: "Məhsulun 60-70°C-yə qədər qızdırılması sayəsində qidanın vitamin və dadının qorunması" },
          { id: "B", text: "Məhsulun dondurulması" },
          { id: "C", text: "Yalnız quru maddələrə tətbiq olunması" },
          { id: "D", text: "Heç bir mikrobun ölməməsi" }
        ],
        correctOption: "A",
        explanation: "Qaynatma zamanı südün dadı və vitaminləri pozulur; pasterizasiya isə mülayim temperaturda patogenləri məhv edir, qidanı təbii saxlayır.",
        bloomLevel: "Bilik"
      },
      {
        id: "pas-q3",
        question: "Paster tərəfindən hazırlanmış ilk həyati vaksinlərdən biri hansı təhlükəli xəstəliyə qarşı idi?",
        options: [
          { id: "A", text: "Quduzluq (Rabies)" },
          { id: "B", text: "Şəkərli diabet" },
          { id: "C", text: "Hipertoniya" },
          { id: "D", text: "Skolioz" }
        ],
        correctOption: "A",
        explanation: "Lui Paster quduzluq virusunun onurğa beynində zəiflədilməsi yolu ilə ilk uğurlu quduzluq peyvəndini yaratmışdır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "edward-jenner-smallpox-vaccine",
    slug: "edward-jenner-smallpox-first-vaccine-immunology",
    category: "biologiya",
    isNobel: false,
    discoveryYear: 1796,
    discoverer: "Edvard Cenner (Edward Jenner)",
    curriculumSubject: "Biologiya",
    curriculumGrade: "8-9-cu sinif",
    curriculumTopic: "İmmunitet növləri, vaksinasiya tarixi, antitellər və çiçək xəstəliyi",
    icon: "ShieldPlus",
    accentColor: "from-emerald-500 to-teal-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Edvard Cenner və Dünyada İlk Vaksin: Çiçək Xəstəliyinə Qələbə",
        summary: "Süd sağan qızların inək çiçəyindən qorunmasından bəşəriyyətin yer üzündən tamamilə sildiyi ilk dəhşətli xəstəlik.",
        ahaMoment: "Qara çiçək (təbii çiçək) əsrlər boyu yüz milyonlarla insanın üzünü eybəcərləşdirir və öldürürdü. Edvard Cenner fikir verdi ki, inəkləri sağan südçü qadınlar bu xəstəliyə heç vaxt tutulmur; onlar yalnız inəklərdən keçən yüngül 'inək çiçəyi' keçirirlər. 1796-cı ildə Cenner südçü qadının əlindəki qabarcıqdan maye götürərək 8 yaşlı Ceyms Fippsə vurdu və uşaq sonradan əsl çiçək xəstəliyinə tam davamlı oldu!",
        howItWorks: "İnək çiçəyi virusu insan çiçəyi virusuna çox bənzəyir, lakin insanda zəif xəstəlik törədir. İmmunitet sistemi inək virusunun səthindəki zülallara qarşı yaddaş hüceyrələri hazırlayır. Real qara çiçək virusu bədənə düşdükdə antitellər onu dərhal tanıyıb zərərsizləşdirir. Latınca inək 'vacca' deməkdir – 'vaksin' sözü buradan yaranmışdır.",
        realWorldImpact: "1980-ci ildə Ümumdünya Səhiyyə Təşkilatı (ÜST) elan etdi ki, bəşəriyyət tarixində ilk dəfə qara çiçək xəstəliyi Yer kürəsindən tamamilə silinmişdir (eradikasiya).",
        curriculumConnection: "8-ci və 9-cu sinif Biologiyada 'Qazanılmış süni immunitet', 'Vaksinlər və müalicə zərdabları', 'İmmun yaddaşı' mövzularına birbaşa aiddir.",
        funFacts: [
          "Cennerin kəşfi sayəsində tarixdə ilk dəfə bir infeksion xəstəlik planetimizdən tamamilə yox edildi; bu gün heç kimə çiçək peyvəndi vurulmur, çünki xəstəlik təbiətdə qalmayıb."
        ]
      },
      en: {
        title: "Edward Jenner and the Smallpox Vaccine",
        summary: "Using cowpox inoculation to eradicate humanity's most lethal plague, coining the term 'vaccine'.",
        ahaMoment: "Dairymaids exposed to mild cowpox were notoriously immune to deadly smallpox epidemics.",
        howItWorks: "Antigenic cross-reactivity: benign cowpox virus antigens prime adaptive B-cell memory against lethal variola virus.",
        realWorldImpact: "Eradicated smallpox globally by 1980, saving an estimated 5 million lives per year.",
        curriculumConnection: "Active acquired immunity, cross-reactive antigens, memory lymphocytes, and public health immunology.",
        funFacts: [
          "The word 'vaccine' originates from 'vacca', the Latin word for cow."
        ]
      },
      tr: {
        title: "Edward Jenner ve İlk Çiçek Aşısı",
        summary: "Süt sağan kızlardan ilham alarak insanlık tarihinin ilk aşısını geliştiren doktor ve çiçek hastalığının yok edilmesi.",
        ahaMoment: "İnek çiçeği geçiren sütçülerin ölümcül kara çiçek hastalığına yakalanmadığını fark ederek ilk aşı denemesini yaptı.",
        howItWorks: "Zararsız inek çiçeği virüsü antijenleri, bağışıklık sisteminde çapraz antikor üreterek gerçek virüse karşı koruma sağlar.",
        realWorldImpact: "1980'de çiçek hastalığının dünyadan tamamen silinmesi ve modern immünolojinin doğuşu.",
        curriculumConnection: "Biyolojide yapay aktif bağışıklık, antijen-antikor ilişkisi ve aşı kazanımları.",
        funFacts: [
          "Aşı anlamına gelen 'vaksin' kelimesi Latince inek anlamına gelen 'vacca' sözcüğünden türetilmiştir."
        ]
      },
      ru: {
        title: "Эдвард Дженнер и первая в мире вакцина",
        summary: "Победа над натуральной оспой с помощью коровьей оспы, давшая миру термин «вакцинация».",
        ahaMoment: "Дженнер заметил, что доярки, переболевшие легкой коровьей оспой, никогда не заражаются смертельной черной оспой.",
        howItWorks: "Антигенное перекрестное реагирование: легкий вирус формирует пул B-лимфоцитов памяти против опасного возбудителя.",
        realWorldImpact: "Полная ликвидация натуральной оспы на планете к 1980 году — первый триумф медицины такого масштаба.",
        curriculumConnection: "Школьный курс: виды иммунитета (естественный и искусственный), вакцины и лечебные сыворотки.",
        funFacts: [
          "Слово «вакцина» происходит от латинского vacca — корова."
        ]
      }
    },
    quiz: [
      {
        id: "jen-q1",
        question: "'Vaksin' sözünün tarixi etimologiyası hansı mənanı ifadə edir?",
        options: [
          { id: "A", text: "Latınca 'vacca' (inək) sözündən yaranıb, çünki ilk peyvənd inək çiçəyindən hazırlanmışdı" },
          { id: "B", text: "Yunan dilində 'iynə' deməkdir" },
          { id: "C", text: "Ərəbcə 'şəfa' sözündəndir" },
          { id: "D", text: "Mikroskopun markasıdır" }
        ],
        correctOption: "A",
        explanation: "Edvard Cenner ilk peyvəndi inəklərdə olan zərərsiz çiçək virusundan hazırladığı üçün bu üsul 'vaksinasiya' (inəkləşdirmə) adlandırıldı.",
        bloomLevel: "Bilik"
      },
      {
        id: "jen-q2",
        question: "Vaksinasiya sayəsində Yer kürəsindən tamamilə silinmiş (heç bir insanda qalmayan) ilk xəstəlik hansıdır?",
        options: [
          { id: "A", text: "Qara çiçək (Təbii çiçək)" },
          { id: "B", text: "Qrip" },
          { id: "C", text: "Suçiçəyi" },
          { id: "D", text: "Malyariya" }
        ],
        correctOption: "A",
        explanation: "1980-ci ildə ÜST rəsmən elan etdi ki, kütləvi vaksinasiya nəticəsində təbii çiçək xəstəliyi bütün planetdə tam məhv edilmişdir.",
        bloomLevel: "Anlama"
      },
      {
        id: "jen-q3",
        question: "İnək çiçəyi keçirmiş insanın əsl çiçək xəstəliyinə yoluxmamasının bioloji mexanizmi nədir?",
        options: [
          { id: "A", text: "Hər iki virusun antigenlərinin oxşar olması və bədəndə qoruyucu yaddaş hüceyrələrinin yaranması" },
          { id: "B", text: "Dərinin qalınlaşması" },
          { id: "C", text: "Qanın tərkibində duzun artması" },
          { id: "D", text: "Virusların bir-birini yeməsi" }
        ],
        correctOption: "A",
        explanation: "Çapraz immunitet sayəsində inək çiçəyinə qarşı yaranan antitel və T-yaddaş hüceyrələri oxşar təbii çiçək virusunu dərhal neytrallaşdırır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "maxwell-electromagnetic-equations",
    slug: "james-clerk-maxwell-electromagnetism-equations-light",
    category: "fizika",
    isNobel: false,
    discoveryYear: 1865,
    discoverer: "Ceyms Klerk Maksvel (James Clerk Maxwell)",
    curriculumSubject: "Fizika",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Elektromaqnit sahəsi nəzəriyyəsi, burulğanlı elektrik sahəsi və işığın elektromaqnit təbiəti",
    icon: "Radio",
    accentColor: "from-blue-700 to-indigo-900",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "Maksvel Tənlikləri: Elektrik, Maqnetizm və İşığın Vahidliyi",
        summary: "Fizikanın dörd möhtəşəm tənliyi: dəyişən elektrik sahəsinin maqnit sahəsi yaratması və işığın elektromaqnit dalğası olduğunun sübutu.",
        ahaMoment: "Faradey bilirdi ki, dəyişən maqnit sahəsi elektrik sahəsi yaradır. Maksvel simmetriya axtararaq dahi hipotez irəli sürdü: bəs dəyişən elektrik sahəsi də maqnit sahəsi yaradırmı? O, 'yerdəyişmə cərəyanı' anlayışını tənliklərə əlavə edərək elektromaqnit dalğasının vakuumda yayılma sürətini hesabladı: düz 300 000 km/s! Maksvel heyrətlə yazdı: 'Bu, işığın sürəti ilə tam üst-üstə düşür. Deməli, işıq özü elektromaqnit dalğasıdır!'.",
        howItWorks: "Maksvelin 4 tənliyi: 1) Qauss qanunu (elektrik yükləri elektrik sahəsi mənbəyidir), 2) Maqnit sahəsi üçün Qauss qanunu (təbiətdə maqnit yükləri / monopol yoxdur), 3) Faradeyin induksiya qanunu, 4) Maksvel-Amper qanunu (cərəyan və dəyişən elektrik sahəsi burulğanlı maqnit sahəsi doğurur).",
        realWorldImpact: "Radio, televiziya, Wi-Fi, radar, mobil rabitə və bütün simsiz texnologiyalar.",
        curriculumConnection: "11-ci sinif Fizika dərsliyində 'Elektromaqnit dalğaları', 'Maksvel nəzəriyyəsinin əsas müddəaları' və 'Elektromaqnit şüalanması' mövzuları.",
        funFacts: [
          "Albert Eynşteynin kabinetinin divarında cəmi üç alimin portreti asılmışdı: Nyuton, Faradey və Maksvel."
        ]
      },
      en: {
        title: "Maxwell's Equations and the Electromagnetic Nature of Light",
        summary: "Unifying electricity, magnetism, and optics into four partial differential equations revealing light is an EM wave.",
        ahaMoment: "Calculating electromagnetic wave propagation speed from permittivity and permeability constants matched the measured speed of light.",
        howItWorks: "Interlocking oscillating electric and magnetic vector fields self-propagate through vacuum at c = 1/√(ε0*μ0) = 300,000 km/s.",
        realWorldImpact: "Direct foundation of radio broadcasting, Wi-Fi, radar, satellite communications, and microwave antennas.",
        curriculumConnection: "Electric displacement currents, electromagnetic waves, Poynting vectors, and light propagation.",
        funFacts: [
          "Einstein kept only three portraits on his office study wall: Newton, Faraday, and Maxwell."
        ]
      },
      tr: {
        title: "Maxwell Denklemleri ve Işığın Elektromanyetik Doğası",
        summary: "Elektrik, manyetizma ve optiği birleştiren 4 denklem: ışığın elektromanyetik bir dalga olduğunun kanıtı.",
        ahaMoment: "Dalga yayılma hızını temel elektrik ve manyetizma sabitlerinden hesapladığında tam ışık hızını (300.000 km/s) buldu.",
        howItWorks: "Değişen elektrik alanı manyetik alan, değişen manyetik alan da elektrik alanı doğurarak uzayda ışık hızında yayılır.",
        realWorldImpact: "Radyo, televizyon, Wi-Fi, radar ve tüm kablosuz iletişim teknolojileri.",
        curriculumConnection: "Fizikte elektromanyetik dalgaların özellikleri, yer değiştirme akımı ve dalga denklemleri.",
        funFacts: [
          "Einstein çalışma masasının karşısına sadece üç fizikçinin resmini asmıştı: Newton, Faraday ve Maxwell."
        ]
      },
      ru: {
        title: "Уравнения Максвелла и электромагнитная природа света",
        summary: "Великое объединение электричества, магнетизма и оптики в четырех фундаментальных дифференциальных уравнениях.",
        ahaMoment: "Максвелл ввел понятие тока смещения и вычислил скорость электромагнитной волны, совпавшую со скоростью света.",
        howItWorks: "Вихревое электрическое и магнитное поля непрерывно порождают друг друга, распространяясь в вакууме со скоростью c = 300 000 км/с.",
        realWorldImpact: "Радиосвязь, телевидение, Wi-Fi, радары, микроволновые печи и мобильные сети.",
        curriculumConnection: "Школьный курс физики 11 класса: теория Максвелла, электромагнитные волны, шкала излучений.",
        funFacts: [
          "В кабинете Эйнштейна висели портреты всего трех физиков: Ньютона, Фарадея и Максвелла."
        ]
      }
    },
    quiz: [
      {
        id: "max-q1",
        question: "Maksvel nəzəriyyəsinə görə fəzada dəyişən elektrik sahəsi nə yaradır?",
        options: [
          { id: "A", text: "Burulğanlı maqnit sahəsi" },
          { id: "B", text: "Sabit qravitasiya sahəsi" },
          { id: "C", text: "Yalnız istilik" },
          { id: "D", text: "Heç bir sahə yaratmır" }
        ],
        correctOption: "A",
        explanation: "Maksvelin əsas postulatına görə istənilən dəyişən elektrik sahəsi ətraf fəzada burulğanlı maqnit sahəsi doğurur.",
        bloomLevel: "Anlama"
      },
      {
        id: "max-q2",
        question: "Elektromaqnit dalğasında elektrik (E) və maqnit (B) sahə vektorları dalğanın yayılma istiqamətinə nəzərən necə yönəlir?",
        options: [
          { id: "A", text: "Həm bir-birinə, həm də dalğanın yayılma istiqamətinə perpendikulyardır (eninə dalğadır)" },
          { id: "B", text: "Yayılma istiqaməti boyunca paraleldir (uzununa dalğadır)" },
          { id: "C", text: "İstiqamətləri xaotik dəyişir" },
          { id: "D", text: "Yalnız qütblərə doğru yönəlir" }
        ],
        correctOption: "A",
        explanation: "Elektromaqnit dalğaları eninə dalğalardır: E və B vektorları bir-birinə perpendikulyar rəqs edir və hər ikisi yayılma sürətinə perpendikulyardır.",
        bloomLevel: "Bilik"
      },
      {
        id: "max-q3",
        question: "Maksvelin hesabladığı elektromaqnit dalğasının vakuumda yayılma sürəti hansı təbiət kəmiyyətinə tam bərabər çıxdı?",
        options: [
          { id: "A", text: "İşığın vakuumdakı sürətinə (c = 300 000 km/s)" },
          { id: "B", text: "Havada səsin sürətinə (340 m/s)" },
          { id: "C", text: "Yerin fırlanma sürətinə" },
          { id: "D", text: "Sıfıra" }
        ],
        correctOption: "A",
        explanation: "Maksvel tənliklərindən çıxan sürət c = 1/√(ε₀μ₀) dəqiq olaraq 300 000 km/s oldu; bu da işığın elektromaqnit dalğası olduğunu isbat etdi.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "kepler-laws-planetary-motion",
    slug: "johannes-kepler-laws-of-planetary-motion-ellipses",
    category: "fizika",
    isNobel: false,
    discoveryYear: 1609,
    discoverer: "İohann Kepler (Johannes Kepler)",
    curriculumSubject: "Fizika / Astronomiya",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Keplerin I, II və III qanunları, planet orbitləri, ellips və orbital period",
    icon: "Orbit",
    accentColor: "from-indigo-600 to-purple-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "İohann Kepler və Planetlərin Hərəkət Qanunları",
        summary: "Minillik 'mükəmməl dairəvi orbitlər' ehkamını yıxan kəşf: planetlərin ellips üzrə fırlanması və kosmik naviqasiyanın əsası.",
        ahaMoment: "Kopernik də daxil olmaqla bütün astronomlar inanırdılar ki, planetlər Günəş ətrafında mütləq ideal çevrələr üzrə hərəkət etməlidir. Lakin Tixo Brahenin Marsın hərəkəti ilə bağlı apardığı illərlə dəqiq müşahidələr çevrə modelinə 8 qövs dəqiqəsi qədər uyğun gəlmirdi. Kepler bu 8 dəqiqəlik fərqə görə çevrədən imtina etdi və kəşf etdi: planetlər ellips üzrə hərəkət edir və Günəş bu ellipsin fokuslarından birində yerləşir!",
        howItWorks: "Keplerin 3 qanunu: 1) Planetlərin orbitləri fokuslarından birində Günəş olan ellipslərdir. 2) Planetin radius-vektoru bərabər zaman fasilələrində bərabər sahələr cızır (perihelidə sürət artır, afelidə azalır). 3) Planetlərin dolanma dövrlərinin kvadratları nisbəti onların böyük yarımoxlarının kubları nisbətinə bərabərdir: T₁² / T₂² = a₁³ / a₂³.",
        realWorldImpact: "Süni peyklərin orbitlərinin hesablanması, GPS peyk hərəkətləri, Marsa və digər planetlərə göndərilən kosmik aparatların trayektoriyaları.",
        curriculumConnection: "9-cu sinif Astronomiyada və 10-cu sinif Fizikada 'Planetlərin hərəkəti və Kepler qanunları', 'Süni peyklərin sürəti və dövrü' mövzuları.",
        funFacts: [
          "Kepler planetlərin hərəkət qanunlarını kəşf edərkən optika elminə də böyük töhfə vermiş və müasir eynək linzalarının iş prinsipini izah etmişdir."
        ]
      },
      en: {
        title: "Johannes Kepler: Laws of Planetary Motion",
        summary: "Shattering circular celestial dogmas by establishing elliptical planetary mechanics.",
        ahaMoment: "A tiny 8-arcminute discrepancy in Tycho Brahe's Mars orbital data led Kepler to abandon circles for ellipses.",
        howItWorks: "Three laws: 1) Elliptical orbits with the Sun at one focus, 2) Equal areal velocity sweep, 3) Harmonic law T^2 proportional to a^3.",
        realWorldImpact: "Satellite orbital insertion, interplanetary space probe Hohmann transfers, and GPS constellation geometry.",
        curriculumConnection: "Gravitational orbits, ellipse geometry, angular momentum conservation, and orbital periods.",
        funFacts: [
          "Newton later derived his universal law of gravitation directly from Kepler's third law."
        ]
      },
      tr: {
        title: "Kepler Yasaları ve Gezegen Hareketleri",
        summary: "Kusursuz daire dogmasını yıkarak gezegenlerin elips yörüngelerde döndüğünü kanıtlayan devrim.",
        ahaMoment: "Mars yörüngesindeki 8 yay dakikalık küçük hatayı görmezden gelmeyerek daire yerine elipsi keşfetti.",
        howItWorks: "1) Elips yörüngeler, 2) Eşit zamanlarda eşit alanlar süpürme (hız değişimi), 3) Periyotlar kanunu T² / a³ = sabit.",
        realWorldImpact: "Yapay uyduların yörünge hesaplamaları ve gezegenler arası uzay sondalarının rotaları.",
        curriculumConnection: "Fizik ve astronomide kütleçekim, eliptik yörüngeler ve açısal momentumun korunumu.",
        funFacts: [
          "Newton evrensel kütleçekim kanununu doğrudan Kepler'in üçüncü kanunundan türetmiştir."
        ]
      },
      ru: {
        title: "Законы движения планет Иоганна Кеплера",
        summary: "Отказ от идеальных круговых орбит и открытие эллиптического движения планет Солнечной системы.",
        ahaMoment: "Несоответствие данных Тихо Браге по орбите Марса всего на 8 угловых минут заставило Кеплера перейти к эллипсам.",
        howItWorks: "Три закона: 1) Эллиптические орбиты, 2) Закон площадей (сохранение момента импульса), 3) Гармонический закон T₁²/T₂² = a₁³/a₂³.",
        realWorldImpact: "Баллистика космических аппаратов, расчет орбит спутников связи и межпланетных перелетов.",
        curriculumConnection: "Школьный курс: законы Кеплера, параметры орбит, период обращения планет и спутников.",
        funFacts: [
          "Именно законы Кеплера послужили для Ньютона фундаментом при выводе закона всемирного тяготения."
        ]
      }
    },
    quiz: [
      {
        id: "kep-q1",
        question: "Keplerin birinci qanununa görə planetlər Günəş ətrafında hansı həndəsi trayektoriya üzrə hərəkət edir?",
        options: [
          { id: "A", text: "Fokuslarından birində Günəş olan ellips üzrə" },
          { id: "B", text: "Dəqiq mərkəzində Günəş olan çevrə üzrə" },
          { id: "C", text: "Düz xətt üzrə" },
          { id: "D", text: "Spiral üzrə" }
        ],
        correctOption: "A",
        explanation: "Planetlərin orbitləri çevrə deyil, ellipsdir və Günəş bu ellipsin mərkəzində deyil, fokus nöqtələrindən birində yerləşir.",
        bloomLevel: "Bilik"
      },
      {
        id: "kep-q2",
        question: "Planet Günəşə ən yaxın nöqtədən (periheli) keçərkən onun orbital hərəkət sürəti necə dəyişir?",
        options: [
          { id: "A", text: "Maksimal qiymətə çatır (ən böyük sürətlə hərəkət edir)" },
          { id: "B", text: "Minimuma enir" },
          { id: "C", text: "Sıfır olur və dayanır" },
          { id: "D", text: "Heç dəyişmir" }
        ],
        correctOption: "A",
        explanation: "Keplerin 2-ci qanununa (sahələr qanununa) görə planet Günəşə yaxınlaşdıqda radius-vektor qısalır və sahənin sabit qalması üçün xətti sürət artır.",
        bloomLevel: "Anlama"
      },
      {
        id: "kep-q3",
        question: "Əgər bir planetin Günəşdən orta məsafəsi digərindən 4 dəfə böyükdürsə, Keplerin 3-cü qanununa görə onun dolanma dövrü neçə dəfə böyük olar?",
        options: [
          { id: "A", text: "8 dəfə (T² ~ a³, ona görə T ~ √(4³) = √64 = 8)" },
          { id: "B", text: "4 dəfə" },
          { id: "C", text: "16 dəfə" },
          { id: "D", text: "2 dəfə" }
        ],
        correctOption: "A",
        explanation: "Keplerin 3-cü qanununa əsasən T² ~ a³. a dörd dəfə artdıqda a³ = 64 olur, dövr T = √64 = 8 dəfə artar.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "euler-identity-graph-theory",
    slug: "leonhard-euler-identity-graph-theory-konigsberg",
    category: "riyaziyyat",
    isNobel: false,
    discoveryYear: 1736,
    discoverer: "Leonard Eyler (Leonhard Euler)",
    curriculumSubject: "Riyaziyyat / İnformatika",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Qraflar nəzəriyyəsi, topologiya, Eyler eyniliyi və kompleks ədədlər",
    icon: "Network",
    accentColor: "from-violet-600 to-indigo-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Leonard Eyler: Körpülər Tapmacasından Qraflar Nəzəriyyəsinə",
        summary: "Könisberqin 7 körpüsü məsələsindən müasir kompüter şəbəkələrinin, GPS xəritələrinin və riyaziyyatın ən gözəl düsturunun (e^(iπ)+1=0) doğulması.",
        ahaMoment: "Könisberq şəhərinin sakinləri çay üzərindəki 7 körpünün hər birindən yalnız bircə dəfə keçməklə şəhəri gəzib başlanğıc nöqtəyə qayıtmağın mümkün olub-olmadığını düşünürdülər. 1736-cı ildə Eyler xəritənin dəqiq ölçülərini kənara qoyub quru parçalarını nöqtələr (təpələr), körpüləri isə xətlər (tillər) kimi çəkdi: o sübut etdi ki, əgər təklərə ayrılan təpələrin sayı ikidən çoxdursa, belə bir marşrut qeyri-mümkündür! Beləliklə, Qraflar Nəzəriyyəsi yarandı!",
        howItWorks: "Eyler qraflarda təpələrin dərəcəsini (təpəyə birləşən tillərin sayını) tədqiq etdi: qapalı Eyler dövrəsi yalnız bütün təpələrin dərəcəsi cüt olduqda mövcuddur. Kompleks analizdə isə Eyler riyaziyyatın 5 ən mühüm sabitini (e, i, π, 1, 0) vahid tənlikdə birləşdirdi: e^(iπ) + 1 = 0.",
        realWorldImpact: "Google Xəritələr və Waze naviqasiya alqoritmləri (ən qısa yol), sosial şəbəkələrdə dostluq qrafları, internet marşrutlaşdırması və elektrik dövrələri.",
        curriculumConnection: "9-cu sinif İnformatikada 'Qraf modelləri, təpələr və tillər, qonşuluq matrisi', 11-ci sinif Riyaziyyatda 'Kompleks ədədlər və Eyler düsturu' mövzuları.",
        funFacts: [
          "Riyaziyyatçılar arasında keçirilən sorğuda e^(iπ) + 1 = 0 tənliyi 'Bəşəriyyət tarixinin ən gözəl riyazi formulu' seçilmişdir."
        ]
      },
      en: {
        title: "Leonhard Euler: Graph Theory and Euler's Identity",
        summary: "Solving the Königsberg bridges puzzle to birth graph theory, alongside the most beautiful equation in mathematics: e^(iπ)+1=0.",
        ahaMoment: "Euler abstracted geography into vertices and edges, proving walking across all seven bridges exactly once is mathematically impossible.",
        howItWorks: "An Eulerian path exists if and only if a connected graph has zero or exactly two odd-degree vertices. Euler's identity unifies analysis, geometry, and arithmetic.",
        realWorldImpact: "GPS shortest-path routing (Dijkstra), social network graphs, telecommunication network switching, and circuit layout design.",
        curriculumConnection: "Discrete mathematics graphs, adjacency matrices, and complex exponential trigonometry.",
        funFacts: [
          "Voted 'the most beautiful theorem in mathematics' for uniting e, i, pi, 1, and 0 in a single equation."
        ]
      },
      tr: {
        title: "Leonhard Euler: Çizge Teorisi ve Euler Özdeşliği",
        summary: "Königsberg'in 7 köprüsü bilmecesinden bilgisayar ağlarına ve matematiğin en güzel denklemine: e^(iπ)+1=0.",
        ahaMoment: "Adaları noktalara, köprüleri çizgilere dönüştürerek her köprüden bir kez geçmenin imkansız olduğunu kanıtladı.",
        howItWorks: "Bir çizgede Euler turu olabilmesi için tüm düğümlerin derecesinin çift olması gerekir; Euler özdeşliği ise 5 temel sabiti birleştirir.",
        realWorldImpact: "Google Haritalar rota bulma algoritmaları, sosyal ağ bağlantıları ve internet yönlendiricileri.",
        curriculumConnection: "Bilişimde çizge (graf) modelleri ve matematikte karmaşık sayılar kazanımları.",
        funFacts: [
          "Matematikçiler e^(iπ)+1=0 formülünü tarihin en zarif denklemi seçmiştir."
        ]
      },
      ru: {
        title: "Леонард Эйлер: теория графов и тождество Эйлера",
        summary: "От задачи о семи мостах Кёнигсберга до алгоритмов навигации и прекраснейшей формулы математики e^(iπ)+1=0.",
        ahaMoment: "Эйлер отбросил масштаб карты, представив берега вершинами, а мосты ребрами, доказав топологическую невозможность маршрута.",
        howItWorks: "Эйлеров цикл существует тогда и только тогда, когда степени всех вершин графа четные.",
        realWorldImpact: "Поиск кратчайшего пути в навигаторах (GPS/Яндекс.Карты), анализ соцсетей, маршрутизация трафика в Интернете.",
        curriculumConnection: "Школьный курс: графы в информатике, степени вершин, комплексные числа в математике.",
        funFacts: [
          "Формула Эйлера объединяет 5 ключевых констант математики: e, i, π, 1 и 0."
        ]
      }
    },
    quiz: [
      {
        id: "eul-q1",
        question: "Qraflar nəzəriyyəsində hər bir tildən (körpüdən) yalnız bircə dəfə keçən qapalı dövrə hansı şərt ödəndikdə mövcud olur?",
        options: [
          { id: "A", text: "Qrafın bütün təpələrinin dərəcələri cüt ədəd olduqda" },
          { id: "B", text: "Bütün təpələrin dərəcələri tək ədəd olduqda" },
          { id: "C", text: "Qrafda yalnız 3 təpə olduqda" },
          { id: "D", text: "Qraf kvadrat formasında olduqda" }
        ],
        correctOption: "A",
        explanation: "Əgər hər təpəyə daxil olub çıxmaq lazımdırsa, hər təpəyə birləşən xətlərin sayı mütləq cüt olmalıdır (Eyler teoremi).",
        bloomLevel: "Anlama"
      },
      {
        id: "eul-q2",
        question: "Eyler eyniliyində (e^(iπ) + 1 = 0) i hərfi hansı riyazi anlayışı ifadə edir?",
        options: [
          { id: "A", text: "Xəyali vahidi (kvadratı -1-ə bərabər olan ədədi: i² = -1)" },
          { id: "B", text: "İnformasiya bitini" },
          { id: "C", text: "İşıq sürətini" },
          { id: "D", text: "İmpuls kəmiyyətini" }
        ],
        correctOption: "A",
        explanation: "i riyaziyyatda xəyali vahiddir (imaginary unit) və i = √(-1) kimi müəyyən olunur.",
        bloomLevel: "Bilik"
      },
      {
        id: "eul-q3",
        question: "Müasir GPS naviqasiya proqramlarında iki məntəqə arasındakı ən qısa yolu tapan alqoritmlər hansı riyazi modelə əsaslanır?",
        options: [
          { id: "A", text: "Çəkili istiqamətlənmiş qraf modellərinə (məsələn, Deykstra alqoritminə)" },
          { id: "B", text: "Yalnız Pifaqor teorminə" },
          { id: "C", text: "Nyutonun cazibə qanununa" },
          { id: "D", text: "Mendel qanunlarına" }
        ],
        correctOption: "A",
        explanation: "Yol xəritələri yolayrıcıların təpə, yolların isə tıxac və məsafə çəkili tillər olduğu qraf kimi təsvir olunur və qraf alqoritmləri ilə həll edilir.",
        bloomLevel: "Tətbiq"
      }
    ]
  }
]
