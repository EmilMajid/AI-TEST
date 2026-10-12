import { ScientificDiscovery } from "@/lib/discoveries-types"

export const FUNDAMENTAL_DISCOVERIES: ScientificDiscovery[] = [
  {
    id: "galileo-telescope-heliocentrism",
    slug: "galileo-galilei-telescope-heliocentric-cosmos",
    category: "fizika",
    isNobel: false,
    discoveryYear: 1609,
    discoverer: "Qalileo Qaliley (Galileo Galilei)",
    curriculumSubject: "Fizika / Astronomiya",
    curriculumGrade: "7-9-cu sinif",
    curriculumTopic: "Astronomiya əsasları, Günəş sistemi, Yupiterin peykləri və sərbəstdüşmə",
    icon: "Telescope",
    accentColor: "from-sky-600 to-indigo-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Qaliley Teleskopu və Günəş Mərkəzli Kainat",
        summary: "Kainatın mərkəzində Yerin deyil, Günəşin dayandığını sübut edən ilk teleskopik müşahidələr və müasir elmi metodun doğulması.",
        ahaMoment: "1609-cu ildə Qaliley holland eynək ustalarının linzaları birləşdirərək uzağı yaxınlaşdırdığını eşitdi. O, özü 30 dəfə böyüdən teleskop düzəldərək onu gecə səmasına tuşladı. Ayın hamar deyil, dağlıq olduğunu, Süd Yolunun saysız ulduzlardan ibarət olduğunu və ən əsası Yupiterin ətrafında fırlanan 4 peyki gördü! Bu sübut etdi ki, hər şey Yer ətrafında fırlanmır!",
        howItWorks: "Qaliley teleskopu iki linzadan ibarətdir: toplayıcı qabarıq obyektiv və səpici çökük okulyar. Şüalar paralel qırılaraq gözün torlu qişasında böyüdülmüş düz xəyalı formalaşdırır.",
        realWorldImpact: "Elmdə kilsə ehkamlarının dağılması, müşahidəyə və eksperimentə əsaslanan müasir fizikanın bünövrəsi, kosmik rəsədxanalar.",
        curriculumConnection: "7-ci sinif Fizikada 'Linzalar və optik cihazlar', 9-cu sinifdə 'Günəş sistemi və planetlərin hərəkəti' mövzularına tam aiddir.",
        funFacts: [
          "Qaliley teleskopla birbaşa Günəş ləkələrini müşahidə etdiyi üçün ömrünün sonlarında görmə qabiliyyətini itirmişdi.",
          "Yupiterin ən böyük 4 peyki (İo, Avropa, Qanimed, Kallisto) bu gün də 'Qaliley peykləri' adlanır."
        ]
      },
      en: {
        title: "Galileo Galilei: The Telescope and Heliocentrism",
        summary: "Turning lenses to the heavens to shatter Earth-centric cosmology and establish experimental science.",
        ahaMoment: "Observing four moons orbiting Jupiter proved conclusively that not all celestial bodies circle Earth.",
        howItWorks: "A converging objective lens paired with a diverging eyepiece focuses distant celestial light onto the retina.",
        realWorldImpact: "Founded observational astronomy, validated Kepler and Copernicus, and birthed modern physics.",
        curriculumConnection: "Optical refraction, convex and concave lenses, and Solar System planetary orbital mechanics.",
        funFacts: [
          "Jupiter's four largest moons are still termed the Galilean satellites."
        ]
      },
      tr: {
        title: "Galileo Teleskobu ve Güneş Merkezli Evren",
        summary: "Dünya'nın evrenin merkezinde olmadığını teleskopla kanıtlayan gözlemler ve modern bilimin doğuşu.",
        ahaMoment: "Jüpiter'in etrafında dönen 4 uyduyu gören Galileo, her şeyin Dünya etrafında dönmediğini ispatladı.",
        howItWorks: "İnce ve kalın kenarlı merceklerin kırılma geometrisi gök cisimlerinin büyütülmüş görüntüsünü oluşturur.",
        realWorldImpact: "Gözlemsel astronomi, modern teleskoplar ve deneysel bilimsel yöntemin zaferi.",
        curriculumConnection: "Fizikte mercekler, kırılma ve Güneş sistemi yörüngeleri kazanımlarıyla uyumludur.",
        funFacts: [
          "Güneş lekelerini doğrudan teleskopla incelediği için ömrünün son yıllarında kör olmuştur."
        ]
      },
      ru: {
        title: "Телескоп Галилея и гелиоцентрическая система",
        summary: "Первые телескопические наблюдения, доказавшие правоту Коперника и изменившие картину мира.",
        ahaMoment: "Обнаружив 4 спутника Юпитера, Галилей доказал: небесные тела не обязаны вращаться вокруг Земли.",
        howItWorks: "Сочетание собирающей линзы объектива и рассеивающей линзы окуляра формирует прямое увеличенное изображение.",
        realWorldImpact: "Рождение наблюдательной астрономии, экспериментального метода в физике и космических телескопов.",
        curriculumConnection: "Школьный курс: линзы, оптические приборы, строение Солнечной системы.",
        funFacts: [
          "Спутники Юпитера Ио, Европа, Ганимед и Каллисто до сих пор называют «галилеевыми»."
        ]
      }
    },
    quiz: [
      {
        id: "gal-q1",
        question: "Qalileyin Yupiter ətrafında etdiyi kəşf niyə geosentrik (Yer mərkəzli) modeli darmadağın etdi?",
        options: [
          { id: "A", text: "Çünki göy cisimlərinin hamısının Yer ətrafında deyil, başqa bir planet ətrafında da fırlana bildiyini sübut etdi" },
          { id: "B", text: "Çünki Yupiterin bərk cisim olduğunu göstərdi" },
          { id: "C", text: "Çünki teleskopun linzası sındı" },
          { id: "D", text: "Çünki Yupiter Günəşdən böyük çıxdı" }
        ],
        correctOption: "A",
        explanation: "Əgər Yupiterin ətrafında peyklər fırlanırsa, deməli, Kainatdakı hər bir cismin Yerin ətrafında fırlanması fikri səhvdir.",
        bloomLevel: "Anlama"
      },
      {
        id: "gal-q2",
        question: "Qaliley teleskopunda okulyar kimi hansı növ linzadan istifadə olunurdu?",
        options: [
          { id: "A", text: "Səpici (çökük) linzadan" },
          { id: "B", text: "Düz güzgüdən" },
          { id: "C", text: "Qırmızı filtrdən" },
          { id: "D", text: "Parabolik antenadan" }
        ],
        correctOption: "A",
        explanation: "Qaliley sistemində obyektiv toplayıcı, okulyar isə səpici linzadır; bu, düz (tərsinə çevrilməmiş) xəyal verir.",
        bloomLevel: "Bilik"
      },
      {
        id: "gal-q3",
        question: "Qaliley Piza qülləsindən ağır və yüngül güllələri ataraq hansı fiziki həqiqəti kəşf etdi?",
        options: [
          { id: "A", text: "Havanın müqaviməti nəzərə alınmadıqda bütün cisimlər eyni sərbəstdüşmə təcili ilə (g) düşür" },
          { id: "B", text: "Ağır cisimlər həmişə 10 dəfə tez düşür" },
          { id: "C", text: "Yüngül cisimlər göyə uçur" },
          { id: "D", text: "Qravitasiya qüvvəsi yalnız qızıldan asılıdır" }
        ],
        correctOption: "A",
        explanation: "Aristotelin 'ağır cisim tez düşər' yanılmasını təkzib edən Qaliley sübut etdi ki, vakuumda kütləsindən asılı olmayaraq bütün cisimlər eyni sürətlə düşür.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "roentgen-x-rays",
    slug: "wilhelm-roentgen-x-rays-medical-imaging-nobel",
    category: "fizika",
    isNobel: true,
    nobelPrize: {
      year: 1901,
      category: "Fizika",
      laureates: ["Wilhelm Conrad Röntgen"],
      citation: "Möhtəşəm rentgen şüalarının kəşfinə görə (Tarixdə ilk Fizika üzrə Nobel Mükafatı)"
    },
    discoveryYear: 1895,
    discoverer: "Vilhelm Konrad Rentgen",
    curriculumSubject: "Fizika",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Elektromaqnit şüalanması şkalası, rentgen şüaları və atom quruluşu",
    icon: "Scan",
    accentColor: "from-emerald-600 to-teal-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Vilhelm Rentgen və X-Şüaları: Bədənin Şəffaf Möcüzəsi",
        summary: "Qara kağızdan keçib sümükləri göstərən sirli şüalar: tarixdə ilk Fizika Nobel Mükafatını qazandıran tibbi inqilab.",
        ahaMoment: "1895-ci ilin noyabrında Rentgen qaranlıq laboratoriyada katod borusu ilə işləyirdi. Borunun üstü qara kartonla örtülsə də, masanın o biri küncündə barium duzu hopdurulmuş ekranın yaşıl rəngdə parıldadığını gördü. O, əlini boru ilə ekran arasına tutduqda öz əl sümüklərinin və həyat yoldaşının barmağındakı nikah üzüyünün kölgəsini ekranda gördü!",
        howItWorks: "Yüksək gərginlikdə sürətləndirilmiş elektronlar ağır metal anoda (məsələn, volfram) çırpıldıqda qəfil tormozlanır (tormozlanma rentgen şüalanması) və ya daxili elektronları qoparıb xarakterik rentgen fotonları buraxır. Bu şüalar yumşaq ət toxumasından keçir, lakin sıx sümük toxuması tərəfindən udulur.",
        realWorldImpact: "Rentgenoqrafiya, kompüter tomoqrafiyası (KT), aeroportlarda təhlükəsizlik skanerləri və kristalların struktur təyini.",
        curriculumConnection: "11-ci sinif Fizikada 'Elektromaqnit dalğaları şkalası', 'Rentgen şüalanmasının xassələri və dalğa uzunluğu (10^-8 - 10^-12 m)' mövzularına aiddir.",
        funFacts: [
          "Rentgen kəşf etdiyi şüanın nə olduğunu bilmədiyi üçün riyaziyyatdakı məchul 'X' hərfindən istifadə edərək 'X-rays' adlandırdı.",
          "O, kəşfini patentləşdirməkdən imtina etdi və bildirdi ki, bu kəşf bütün bəşəriyyətə aiddir."
        ]
      },
      en: {
        title: "Wilhelm Röntgen and X-Rays Discovery",
        summary: "The invisible electromagnetic radiation penetrating flesh to image living bone (1901 First Physics Nobel Prize).",
        ahaMoment: "Röntgen shielded a cathode tube in dark cardboard and observed a distant fluorescent screen still glowing.",
        howItWorks: "High-energy electrons slamming into a metal anode decelerate abruptly (Bremsstrahlung), releasing high-frequency X-ray photons.",
        realWorldImpact: "Medical radiography, CT scans, airport baggage security, and X-ray crystallography.",
        curriculumConnection: "Electromagnetic spectrum wavelengths, atomic braking radiation, and differential tissue attenuation.",
        funFacts: [
          "Röntgen named them 'X-rays' because X signifies an unknown variable in mathematics."
        ]
      },
      tr: {
        title: "Wilhelm Röntgen ve X-Işınları",
        summary: "İnsan vücudunun içini gösteren ilk görünmez ışınlar ve tarihteki ilk Nobel Fizik Ödülü (1901).",
        ahaMoment: "Siyah kartonla kaplı tüpün yaydığı ışınların eşinin el kemiklerini ekranda belirmesiyle tıp tarihinin değişmesi.",
        howItWorks: "Hızlandırılmış elektronların ağır metal anotta frenlenmesiyle yüksek enerjili kısa dalga boylu fotonlar üretilir.",
        realWorldImpact: "Röntgen filmleri, bilgisayarlı tomografi (BT) ve havalimanı güvenlik tarayıcıları.",
        curriculumConnection: "Fizik dersindeki elektromanyetik dalga tayfı ve X-ışını özellikleri kazanımlarıyla uyumludur.",
        funFacts: [
          "Bilinmeyen bir ışın olduğu için matematikteki bilinmeyen 'X' harfini vermiştir."
        ]
      },
      ru: {
        title: "Открытие рентгеновских лучей",
        summary: "Невидимые лучи, проникающие сквозь ткани тела (Первая в истории Нобелевская премия по физике 1901 года).",
        ahaMoment: "Рентген заметил свечение флуоресцентного экрана при работающей экранированной трубке и сделал первый в мире снимок кисти жены.",
        howItWorks: "Тормозное и характеристическое излучение при соударении быстрых электронов с металлическим анодом.",
        realWorldImpact: "Медицинская диагностика, компьютерная томография, рентгеноструктурный анализ кристаллов.",
        curriculumConnection: "Школьный курс: шкала электромагнитных волн, рентгеновское излучение, поглощение излучения веществом.",
        funFacts: [
          "Рентген принципиально отказался патентовать лучи, считая их достоянием человечества."
        ]
      }
    },
    quiz: [
      {
        id: "roen-q1",
        question: "Rentgen şüaları elektromaqnit dalğalar şkalasında hansı diapazonda yerləşir?",
        options: [
          { id: "A", text: "Ultrabənövşəyi şüalarla qamma şüaları arasında" },
          { id: "B", text: "Görünən işıqla infraqırmızı şüalar arasında" },
          { id: "C", text: "Radio dalğalarından sonra" },
          { id: "D", text: "Səs dalğaları ilə eyni diapazonda" }
        ],
        correctOption: "A",
        explanation: "Rentgen şüaları yüksək tezlikli (qısa dalğalı) şüalardır və şkalada ultrabənövşəyi şüalardan sonra, qamma şüalarından əvvəl gəlir.",
        bloomLevel: "Bilik"
      },
      {
        id: "roen-q2",
        question: "Niyə rentgen şəkillərində sümüklər aydın ağ rəngdə, əzələ toxuması isə qaranlıq görünür?",
        options: [
          { id: "A", text: "Sümüklərdə kalsium kimi ağır elementlər şüaları güclü udur, yumşaq toxumalar isə asanlıqla buraxır" },
          { id: "B", text: "Sümüklər özləri işıq şüalandırır" },
          { id: "C", text: "Əzələ toxuması maqnit xassəlidir" },
          { id: "D", text: "Sümüklər soyuq olduğu üçün" }
        ],
        correctOption: "A",
        explanation: "Rentgen şüalarının udulması atom nömrəsindən (Z) çox asılıdır. Kalsiumun Z-i yüksək olduğundan şüaları udur və fotolentdə kölgə salır.",
        bloomLevel: "Anlama"
      },
      {
        id: "roen-q3",
        question: "Vilhelm Rentgenin elmi nailiyyətinə görə aldığı ilk tarixi mükafat hansı olmuşdur?",
        options: [
          { id: "A", text: "Tarixdə ilk təqdim olunan Fizika üzrə Nobel Mükafatı (1901)" },
          { id: "B", text: "Oskar mükafatı" },
          { id: "C", text: "Filds medalı" },
          { id: "D", text: "Türinq mükafatı" }
        ],
        correctOption: "A",
        explanation: "1901-ci ildə Alfred Nobelin vəsiyyəti ilə ilk dəfə təsis edilmiş Nobel mükafatları içərisində ilk Fizika mükafatı Vilhelm Rentgenə verilmişdir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "marie-curie-radioactivity",
    slug: "marie-curie-becquerel-radioactivity-polonium-radium",
    category: "fizika",
    isNobel: true,
    nobelPrize: {
      year: 1903,
      category: "Fizika",
      laureates: ["Marie Curie", "Pierre Curie", "Henri Becquerel"],
      citation: "Radioaktivlik hadisəsinin birgə tədqiqinə görə (Mariya Küri həmçinin 1911 Kimya Nobeli alıb)"
    },
    discoveryYear: 1898,
    discoverer: "Mariya Sklodovska-Küri, Pyer Küri və Anri Bekkerel",
    curriculumSubject: "Fizika / Kimya",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Radioaktiv çevrilmələr, alfa, betta, qamma şüaları və yarımparçalanma dövrü",
    icon: "Radiation",
    accentColor: "from-green-600 to-lime-800",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "Mariya Küri və Radioaktivlik: İki Nobel Qazanan İlk Qadın",
        summary: "Tonlarla uran filizindən qaranlıqda mavi parıldayan yeni elementlərin (Polonium və Radium) çıxarılması və atom nüvəsinin açılması.",
        ahaMoment: "Anri Bekkerel uran duzunun qaranlıqda foto-plastinkanı qaraltdığını görmüşdü. Mariya Küri bu hadisəni 'radioaktivlik' adlandırdı və fərz etdi ki, filizin tərkibində urandan qat-qat güclü şüalanan naməlum elementlər var. O və yoldaşı Pyer illərlə soyuq anbarda tonlarla qatran filizini əlləri ilə qaynadaraq iki yeni element – vətəni şərəfinə Polonium və möcüzəvi Radium kəşf etdilər!",
        howItWorks: "Qeyri-sabit ağır atom nüvələri təbii olaraq parçalanaraq daha yüngül və dayanıqlı nüvələrə çevrilir. Bu zaman üç növ şüalanma ayrılır: alfa (helium nüvələri, müsbət), betta (sürətli elektronlar, mənfi) və qamma (yüksək enerjili fotonlar, neytral).",
        realWorldImpact: "Nüvə enerjisi, radioterapiya ilə xərçəng müalicəsi, arxeologiyada radiokarbon (C-14) tarixləndirmə metodu.",
        curriculumConnection: "10-cu sinif Kimyada 'İzotoplar və radioaktivlik', 11-ci sinif Fizikada 'Nüvə reaksiyaları, Soddinin yerdəyişmə qanunu və Yarımparçalanma dövrü (T)' mövzuları.",
        funFacts: [
          "Mariya Küri tarixdə iki fərqli elm sahəsində (Fizika və Kimya) Nobel mükafatı alan yeganə insandır.",
          "Onun laboratoriya dəftərləri bu gün də radioaktivdir və xüsusi qurğuşun qutularda saxlanılır."
        ]
      },
      en: {
        title: "Marie Curie and the Discovery of Radioactivity",
        summary: "Isolating polonium and radium to reveal the energy locked inside atomic nuclei (1903 & 1911 Nobel Laureate).",
        ahaMoment: "Pitchblende ore emitted far more radiation than pure uranium, hinting at undiscovered super-radioactive elements.",
        howItWorks: "Unstable atomic nuclei undergo spontaneous radioactive decay emitting alpha (helium nuclei), beta (electrons), or gamma rays.",
        realWorldImpact: "Nuclear energy, cancer radiotherapy, radiometric dating in archeology, and nuclear medicine.",
        curriculumConnection: "Alpha, beta, and gamma decay laws, half-life decay kinetics, and Soddy displacement rules.",
        funFacts: [
          "Curie remains the only individual ever honored with Nobel Prizes in two distinct scientific disciplines."
        ]
      },
      tr: {
        title: "Marie Curie ve Radyoaktivitenin Keşfi",
        summary: "Polonyum ve radyumu keşfederek iki farklı bilim dalında Nobel kazanan tek dahi bilim insanı.",
        ahaMoment: "Uranyum filizinin saf uranyumdan çok daha güçlü ışıma yapmasından yola çıkarak tonlarca cevheri elle işledi.",
        howItWorks: "Kararsız çekirdeklerin alfa, beta parçacıkları ve gama ışınları yayarak kararlı izotoplara kendiliğinden dönüşmesi.",
        realWorldImpact: "Nükleer santraller, radyoterapi ile tümör tedavisi ve karbon-14 yaş tayini.",
        curriculumConnection: "Fizik ve kimyada radyoaktif bozunma, yarı ömür ve nükleer tepkimeler kazanımları.",
        funFacts: [
          "Marie Curie'nin el yazması not defterleri bugün bile kurşun korumalı kasalarda tutulmaktadır."
        ]
      },
      ru: {
        title: "Мария Кюри и радиоактивность",
        summary: "Открытие полония и радия, положившее начало ядерной физике (дважды лауреат Нобелевской премии).",
        ahaMoment: "Урановая смоляная руда излучала сильнее чистого урана, что навело Кюри на мысль о существовании сверхмощных элементов.",
        howItWorks: "Самопроизвольный распад нестабильных атомных ядер с испусканием альфа-, бета- и гамма-лучей.",
        realWorldImpact: "Ядерная энергетика, радиотерапия злокачественных опухолей и радиоизотопная датировка.",
        curriculumConnection: "Школьный курс: виды радиоактивного излучения, закон радиоактивного распада, период полураспада.",
        funFacts: [
          "Мария Кюри — единственный человек, получивший Нобелевские премии по двум разным естественным наукам (физика и химия)."
        ]
      }
    },
    quiz: [
      {
        id: "curie-q1",
        question: "Radioaktiv şüalanma zamanı qamma (γ) şüalanması fiziki təbiətinə görə nədir?",
        options: [
          { id: "A", text: "Yüksək tezlikli elektromaqnit foton şüalanmasıdır" },
          { id: "B", text: "Müsbət yüklü helium nüvələridir" },
          { id: "C", text: "Mənfi elektronlar selidir" },
          { id: "D", text: "Su buxarıdır" }
        ],
        correctOption: "A",
        explanation: "Alfa şüaları He²⁺ nüvəsi, betta şüaları elektronlar, qamma şüaları isə kütləsiz və yüksək enerjili elektromaqnit kvantlarıdır (fotonlardır).",
        bloomLevel: "Bilik"
      },
      {
        id: "curie-q2",
        question: "Radioaktiv elementin yarımparçalanma dövrü (T) nəyi göstərir?",
        options: [
          { id: "A", text: "İlkin radioaktiv atomların sayının iki dəfə azalması üçün lazım olan müddəti" },
          { id: "B", text: "Elementin tamamilə yoxa çıxması vaxtını" },
          { id: "C", text: "Suyun qaynama temperaturunu" },
          { id: "D", text: "Cərəyanın şiddətini" }
        ],
        correctOption: "A",
        explanation: "Yarımparçalanma dövrü radioaktiv nüvələrin yarısının parçalanması üçün keçən sabit zaman müddətidir: N(t) = N₀ * 2^(-t/T).",
        bloomLevel: "Anlama"
      },
      {
        id: "curie-q3",
        question: "Atom nüvəsi bir alfa-parçalanmaya məruz qaldıqda onun yükü və kütlə ədədi necə dəyişir?",
        options: [
          { id: "A", text: "Kütlə ədədi 4 vahid, yükü (proton sayı) 2 vahid azalır" },
          { id: "B", text: "Kütlə ədədi dəyişmir, yükü 1 vahid artır" },
          { id: "C", text: "Hər ikisi iki dəfə artır" },
          { id: "D", text: "Nüvə neytrona çevrilir" }
        ],
        correctOption: "A",
        explanation: "Alfa hissəcik ⁴₂He nüvəsi olduğundan Soddi yerdəyişmə qanununa əsasən ana nüvənin kütləsi 4 vahid, sıra nömrəsi (yükü) 2 vahid azalır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "rutherford-atomic-nucleus",
    slug: "ernest-rutherford-atomic-nucleus-gold-foil-experiment",
    category: "fizika",
    isNobel: true,
    nobelPrize: {
      year: 1908,
      category: "Kimya",
      laureates: ["Ernest Rutherford"],
      citation: "Elementlərin parçalanması və radioaktiv maddələrin kimyası sahəsindəki tədqiqatlarına görə"
    },
    discoveryYear: 1911,
    discoverer: "Ernest Rezerford (Ernest Rutherford)",
    curriculumSubject: "Fizika / Kimya",
    curriculumGrade: "8-9-cu sinif",
    curriculumTopic: "Atomun quruluşu, nüvə və elektron örtüyü, Rezerford təcrübəsi",
    icon: "Atom",
    accentColor: "from-amber-600 to-rose-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Rezerford Təcrübəsi və Atomun Nüvə Modeli",
        summary: "Atomun bərk kürə deyil, 99.9999%-nin boşluq olduğunu sübut edən qızıl folqa təcrübəsi.",
        ahaMoment: "O dövrdə Tomsonun 'kişmişli piroq' modelinə görə, atom müsbət yüklü bircins kütlə və içində səpələnmiş elektronlardan ibarət idi. Rezerford qızıl folqanı sürətli müsbət alfa hissəciklərlə bombardman edəndə gözlənilmədən bir neçə zərrəcik geri qayıtdı! Rezerford heyrətini belə ifadə etmişdi: 'Bu, kağız salfetə atılan top mərmisinin geri qayıdıb səni vurması qədər inanılmaz idi!'.",
        howItWorks: "Zərrəciklərin 99%-i folqadan maneəsiz keçirdi, çünki atom əsasən boşluqdur. Lakin mərkəzdə atomun demək olar ki, bütün kütləsini cəmləşdirən çox kiçik, müsbət yüklü kompakt nüvə yerləşir; ona yaxınlaşan alfa zərrəcikləri güclü Kulon itələməsi ilə geriyə sıçrayır.",
        realWorldImpact: "Nüvə fizikasının, kvant mexanikasının əsasının qoyulması və protonun kəşfi.",
        curriculumConnection: "8-ci sinif Kimyada və 9-cu sinif Fizikada 'Atomun planetar modeli', 'Nüvənin ölçüsü və kütləsi' mövzularına tam cavab verir.",
        funFacts: [
          "Əgər atomu böyük bir futbol stadionu boyda böyütsək, onun nüvəsi stadionun mərkəzindəki kiçik qarışqa boyda olardı!"
        ]
      },
      en: {
        title: "Rutherford's Gold Foil Experiment and the Atomic Nucleus",
        summary: "Proving atoms are 99.999% empty space with a dense, positively charged central nucleus.",
        ahaMoment: "Alpha particles rebounding from thin gold foil shocked Rutherford, shattering the Thomson plum pudding model.",
        howItWorks: "Coulomb repulsion deflects fast positively charged alpha particles when they closely approach tiny concentrated nuclear charges.",
        realWorldImpact: "Established the planetary atomic model, leading to quantum mechanics and nuclear energy.",
        curriculumConnection: "Planetary atomic structure, nuclear density, and Coulomb electrostatic scattering.",
        funFacts: [
          "If an atom were the size of a cathedral, the nucleus would be no bigger than a fly in the center."
        ]
      },
      tr: {
        title: "Rutherford Altın Levha Deneyi ve Atom Çekirdeği",
        summary: "Maddenin büyük kısmının boşluk olduğunu kanıtlayan ve çekirdekli atom modelini kuran tarihi deney.",
        ahaMoment: "Altın yaprağa çarpan bazı alfa taneciklerinin geri sekmesi, 'kağıda atılan top mermisinin geri dönmesi' gibi bir şok yarattı.",
        howItWorks: "Atomun kütlesinin %99.9'u pozitif yüklü mikroskobik merkezde toplanmıştır; alfa parçacıkları Coulomb kuvvetiyle sapar.",
        realWorldImpact: "Çekirdek fiziğinin doğuşu, protonun keşfi ve kuantum fiziğinin temelleri.",
        curriculumConnection: "Fizik ve kimyada atom modelleri (Thomson, Rutherford, Bohr) kazanımlarıyla tam uyumludur.",
        funFacts: [
          "Atom bir futbol sahası büyüklüğünde olsaydı, çekirdeği sahanın ortasındaki küçük bir bilye kadar olurdu."
        ]
      },
      ru: {
        title: "Опыт Резерфорда и ядерная модель атома",
        summary: "Доказательство существования атомного ядра и планетарной структуры микромира.",
        ahaMoment: "Отскок некоторых альфа-частиц назад от золотой фольги показал, что масса атома сосредоточена в крошечном центре.",
        howItWorks: "Кулоновское отталкивание тяжелых положительных альфа-частиц плотным положительно заряженным ядром атома.",
        realWorldImpact: "Создание ядерной физики, открытие протона и переход к квантовой теории Бора.",
        curriculumConnection: "Школьный курс: модели строения атома (Резерфорд, Томсон), рассеяние частиц, планетарная модель.",
        funFacts: [
          "Если бы атом был размером со стадион, то ядро было бы размером с горошину в центре поля."
        ]
      }
    },
    quiz: [
      {
        id: "ruth-q1",
        question: "Rezerford təcrübəsində alfa hissəciklərin böyük əksəriyyətinin qızıl təbəqədən meyl etmədən keçməsi nəyi sübut edirdi?",
        options: [
          { id: "A", text: "Atomun daxilinin böyük ölçüdə boşluq olduğunu" },
          { id: "B", text: "Qızılın atomlarının olmadığını" },
          { id: "C", text: "Bütün hissəciklərin maqnit olduğunu" },
          { id: "D", text: "Elektronların kütləsinin nüvədən böyük olduğunu" }
        ],
        correctOption: "A",
        explanation: "Zərrəciklərin demək olar ki, hamısı sərbəst keçirdi; bu, atom həcminin 99.99%-dən çoxunun boş fəza olduğunu göstərdi.",
        bloomLevel: "Anlama"
      },
      {
        id: "ruth-q2",
        question: "Alfa hissəciklərin çox az hissəsinin (təxminən 8000-dən birinin) geriyə sıçramasının səbəbi nə idi?",
        options: [
          { id: "A", text: "Atomun mərkəzində müsbət yüklü və kütləvi kiçik nüvəyə rast gəlməsi" },
          { id: "B", text: "Folqanın paslanması" },
          { id: "C", text: "Hissəciklərin işıq şüasına çevrilməsi" },
          { id: "D", text: "Havanın rütubəti" }
        ],
        correctOption: "A",
        explanation: "Eyni adlı müsbət yüklü alfa hissəcik atomun mərkəzindəki konsentrasiyalı müsbət nüvəyə yaxınlaşdıqda güclü itələmə qüvvəsi ilə geri qayıdır.",
        bloomLevel: "Bilik"
      },
      {
        id: "ruth-q3",
        question: "Rezerfordun təklif etdiyi atom modeli hansı astronomik sistemə bənzədildiyi üçün 'planetar model' adlanır?",
        options: [
          { id: "A", text: "Günəş sisteminə (planetlərin Günəş ətrafında fırlandığı kimi elektronların nüvə ətrafında fırlanmasına)" },
          { id: "B", text: "Qara dəliyə" },
          { id: "C", text: "Qütb ulduzuna" },
          { id: "D", text: "Ayın fazalarına" }
        ],
        correctOption: "A",
        explanation: "Rezerford modelində mərkəzdə müsbət nüvə Günəşi, onun ətrafında orbitlər üzrə hərəkət edən mənfi elektronlar isə planetləri təmsil edir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "niels-bohr-quantized-atoms",
    slug: "niels-bohr-quantized-atomic-energy-levels-nobel",
    category: "fizika",
    isNobel: true,
    nobelPrize: {
      year: 1922,
      category: "Fizika",
      laureates: ["Niels Bohr"],
      citation: "Atomların quruluşunun və onlardan çıxan şüalanmanın tədqiqinə görə"
    },
    discoveryYear: 1913,
    discoverer: "Nils Bor (Niels Bohr)",
    curriculumSubject: "Fizika / Kimya",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Bor postulatları, stasionar hallar, xətti spektrlər və enerji səviyyələri",
    icon: "Orbit",
    accentColor: "from-cyan-600 to-blue-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Nils Bor və Atomun Kvant Səviyyələri",
        summary: "Klassik elektrodinamikanın çıxılmaz vəziyyətindən kvant həllinə: elektronlar niyə nüvənin üstünə düşmür?",
        ahaMoment: "Klassik fizikaya görə, təcillə fırlanan elektron davamlı olaraq elektromaqnit dalğası şüalandırmalı, enerjisini itirərək saniyənin yüz milyardda birində nüvənin üstünə düşüb məhv olmalı idi! Bəs dünya niyə dağılmır? 1913-cü ildə Nils Bor iki cəsarətli postulat irəli sürdü: elektronlar yalnız müəyyən diskret stasionar orbitlərdə hərəkət edərkən enerji şüalandırmır!",
        howItWorks: "1-ci postulat: Atom yalnız stasionar energetik hallarda ola bilər və bu hallarda enerji şüalandırmır. 2-ci postulat: Atom bir stasionar haldan digərinə keçdikdə foton şüalandırır və ya udur: hν = E_m - E_n. Bu keçidlər hidrogen atomunun xətti spektrlərini (Balmer, Layman seriyaları) riyazi dəqiqliklə izah etdi.",
        realWorldImpact: "Lazer texnologiyası, flüoresan işıqlandırma, ulduzların kimyəvi tərkibinin spektral analizi.",
        curriculumConnection: "11-ci sinif Fizikada 'Bor postulatları', 'Foton şüalanması və udulması', 'Atomun xətti spektrləri' bölmələri.",
        funFacts: [
          "Nils Bor gəncliyində Danimarkanın milli futbol komandasında peşəkar qapıçı kimi çıxış etmişdi."
        ]
      },
      en: {
        title: "Niels Bohr: Quantized Atomic Energy Levels",
        summary: "Rescuing atomic stability by quantizing electron orbits (1922 Nobel Prize in Physics).",
        ahaMoment: "Classical electrodynamics dictated orbiting electrons should radiate continuously and collapse into nuclei within nanoseconds.",
        howItWorks: "Electrons reside in stationary quantum orbits without radiation. Photon emission/absorption occurs only during quantum leaps: hf = Em - En.",
        realWorldImpact: "Spectroscopy, laser physics, fluorescent lighting, and quantum mechanics.",
        curriculumConnection: "Core 11th-grade physics: Bohr's postulates, stationary energy states, and hydrogen spectral lines.",
        funFacts: [
          "Bohr was a star goalkeeper for a top Danish football club before becoming a quantum pioneer."
        ]
      },
      tr: {
        title: "Niels Bohr ve Atomun Kuantum Seviyeleri",
        summary: "Elektronların neden çekirdeğe düşmediğini açıklayan kuantum sıçramaları ve 1922 Nobel Fizik Ödülü.",
        ahaMoment: "Klasik fiziğe göre atomun anında çökmesi gerekirdi; Bohr belirli sabit yörüngelerde ışıma yapılmadığını öne sürdü.",
        howItWorks: "Elektron bir üst enerji seviyesinden alt seviyeye geçerken fark kadar foton yayar: hf = E2 - E1.",
        realWorldImpact: "Lazer teknolojisi, spektral analiz ve yıldızların kimyasal içeriğinin belirlenmesi.",
        curriculumConnection: "Bohr atom modeli, uyarılma, emisyon ve hidrojen spektrumu kazanımlarıyla örtüşür.",
        funFacts: [
          "Niels Bohr gençliğinde Danimarka'nın ünlü bir futbol takımının kalecisiydi."
        ]
      },
      ru: {
        title: "Постулаты Бора и квантовые уровни атома",
        summary: "Спасение стабильности атома квантованием электронных орбит (Нобелевская премия по физике 1922).",
        ahaMoment: "Бор объединил планетарную модель Резерфорда с квантами Планка, объяснив линейчатый спектр водорода.",
        howItWorks: "Электрон не излучает на стационарных орбитах; квант света испускается только при квантовом скачке: hν = Em - En.",
        realWorldImpact: "Лазерная физика, спектроскопия далеких звезд, люминесцентные лампы.",
        curriculumConnection: "Школьная физика 11 класса: постулаты Бора, энергетические уровни атома, спектры излучения.",
        funFacts: [
          "В юности Нильс Бор играл вратарем за известный датский футбольный клуб."
        ]
      }
    },
    quiz: [
      {
        id: "bohr-q1",
        question: "Borun ikinci postulatına görə atom nə vaxt foton şüalandırır?",
        options: [
          { id: "A", text: "Elektron daha yüksək enerji səviyyəsindən daha aşağı səviyyəyə keçdikdə" },
          { id: "B", text: "Elektron nüvə ətrafında sabit orbitdə fırlandıqda" },
          { id: "C", text: "Atom soyuq suya salındıqda" },
          { id: "D", text: "Nüvədə neytron sayı artdıqda" }
        ],
        correctOption: "A",
        explanation: "Yüksək enerjili haldan aşağı enerjili hala keçdikdə enerji fərqi qədər foton şüalanır: hν = E_m - E_n.",
        bloomLevel: "Anlama"
      },
      {
        id: "bohr-q2",
        question: "Bor postulatlarının klassik fizikadan ən fundamental fərqi nə idi?",
        options: [
          { id: "A", text: "Elektronların stasionar hallarda enerji şüalandırmadığını qəbul etməsi" },
          { id: "B", text: "Elektronların kütləsini sıfır sayması" },
          { id: "C", text: "Bütün atomları kub formasında təsəvvür etməsi" },
          { id: "D", text: "İşıq sürətini sonsuz qəbul etməsi" }
        ],
        correctOption: "A",
        explanation: "Klassik fizika fırlanan yükün şüalanmasını tələb edirdi; Bor isə diskret stasionar hallarda şüalanmanın olmadığını postulat kimi irəli sürdü.",
        bloomLevel: "Bilik"
      },
      {
        id: "bohr-q3",
        question: "Enerjisi E₁ olan əsas haldan E₃ halına keçmək üçün atom hansı enerjili fotonu udmalıdır?",
        options: [
          { id: "A", text: "E₃ - E₁ enerjili fotonu" },
          { id: "B", text: "E₃ + E₁ enerjili fotonu" },
          { id: "C", text: "Yalnız sıfır enerjili fotonu" },
          { id: "D", text: "E₁ / E₃ enerjili fotonu" }
        ],
        correctOption: "A",
        explanation: "Enerjinin saxlanması qanununa görə udulan fotonun enerjisi tam olaraq iki səviyyə arasındakı fərqə bərabər olmalıdır: hν = E₃ - E₁.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "lavoisier-conservation-of-mass",
    slug: "antoine-lavoisier-conservation-of-mass-modern-chemistry",
    category: "kimya",
    isNobel: false,
    discoveryYear: 1789,
    discoverer: "Antuan Loran Lavuazye (Antoine Lavoisier)",
    curriculumSubject: "Kimya",
    curriculumGrade: "7-ci sinif",
    curriculumTopic: "Kütlənin saxlanması qanunu, kimyəvi tənliklər və yanma reaksiyaları",
    icon: "Scale",
    accentColor: "from-blue-600 to-indigo-800",
    readTime: "5 dəq",
    translations: {
      az: {
        title: "Antuan Lavuazye və Kütlənin Saxlanması Qanunu",
        summary: "'Təbiətdə heç nə yoxdan var olmur və heç nə izsiz yox olmur' – müasir kimyanın doğulması.",
        ahaMoment: "Qədim əlkimyaçılar inanırdılar ki, ağac yananda onun içindəki 'floqiston' adlı yanar ruh uçub gedir və çəkisi azalır. Lavuazye qapalı şüşə qabda qalay və civəni yandıraraq reaksiyadan əvvəlki və sonrakı çəkini həssas tərəzi ilə ölçdü: ümumi çəki zərrə qədər də dəyişməmişdi! O sübut etdi ki, yanma floqistonun ayrılması deyil, havadakı oksigenlə birləşmədir.",
        howItWorks: "Kimyəvi reaksiyaya daxil olan maddələrin kütlələrinin cəmi reaksiya nəticəsində alınan maddələrin kütlələrinin cəminə bərabərdir: Σm_əvvəl = Σm_sonra. Çünki kimyəvi reaksiyalarda atomlar məhv olmur və yenidən yaranmır, sadəcə yenidən qruplaşır.",
        realWorldImpact: "Bütün sənaye kimyəvi sintezlərinin kütləvi hesablama bünövrəsi (stexiometriya).",
        curriculumConnection: "7-ci sinif Kimyanın ilk və ən başlıca qanunu: Kimyəvi reaksiyaların əmsallaşdırılması və maddə kütlələrinin hesablanması.",
        funFacts: [
          "Lavuazye Fransa İnqilabı zamanı gilyotində edam edilmişdi; riyaziyyatçı Laqranj demişdi: 'Onun başını kəsmək üçün bircə an bəs etdi, lakin belə bir beynin yetişməsi üçün yüz il bəs etməyəcək'."
        ]
      },
      en: {
        title: "Antoine Lavoisier: Conservation of Mass",
        summary: "Demolishing phlogiston with precision balances to establish the foundational law of chemistry.",
        ahaMoment: "Weighing closed vessels before and after combustion proved that burning is oxygen combination, with total mass completely unchanged.",
        howItWorks: "Matter can neither be created nor destroyed in chemical reactions; atoms simply rearrange into new chemical combinations: Σm_reactants = Σm_products.",
        realWorldImpact: "Stoichiometry, chemical industrial mass balance, and quantitative chemical engineering.",
        curriculumConnection: "Balancing chemical equations and stoichiometric molar conversions in 7th-grade science.",
        funFacts: [
          "Lavoisier was executed during the French Revolution; mathematician Lagrange mourned that such a head takes a century to produce again."
        ]
      },
      tr: {
        title: "Lavoisier ve Kütlenin Korunumu Yasası",
        summary: "'Hiçbir şey yoktan var olmaz, vardan yok olmaz' ilkesiyle modern kimyayı başlatan devrim.",
        ahaMoment: "Kapalı kapta yakılan maddelerin tartılmasıyla yanmanın oksijenle birleşme olduğu ve kütlenin gramı gramına korunduğu kanıtlandı.",
        howItWorks: "Kimyasal tepkimelerde atomlar yok olmaz, sadece yeni bağlar kurarak yeniden düzenlenir: Girenler = Ürünler.",
        realWorldImpact: "Kimyasal denklemlerin denkleştirilmesi ve endüstriyel kimyasal üretim hesapları.",
        curriculumConnection: "7. sınıf kimya müfredatının temeli: tepkime denklemleri ve kütle dengesi.",
        funFacts: [
          "Fransız İhtilali'nde giyotinle idam edildiğinde matematikçi Lagrange 'O kafayı bir saniyede kestiler ama yenisi yüzyılda gelmez' demiştir."
        ]
      },
      ru: {
        title: "Закон сохранения массы Антуана Лавуазье",
        summary: "Опровержение теории флогистона и создание количественной научной химии.",
        ahaMoment: "Взвешивание запаянных реторт до и после прокаливания металлов доказало: масса реагентов в точности равна массе продуктов.",
        howItWorks: "Атомы в химических реакциях не исчезают и не возникают из ничего, а лишь перераспределяются: масса до реакции равна массе после реакции.",
        realWorldImpact: "Стехиометрия, расчет выхода реакций в промышленности и химическая технология.",
        curriculumConnection: "Школьный курс химии 7 класса: закон сохранения массы, расстановка коэффициентов в уравнениях реакций.",
        funFacts: [
          "Лагранж сказал после казни Лавуазье: «Потребовалось лишь мгновение, чтобы отрубить эту голову, но, быть может, и столетия не хватит, чтобы создать такую же»."
        ]
      }
    },
    quiz: [
      {
        id: "lav-q1",
        question: "Kütlənin saxlanması qanununa görə 12 qram karbon tam yandıqda 32 qram oksigen sərf olunarsa, neçə qram karbon qazı (CO2) alınar?",
        options: [
          { id: "A", text: "44 qram (12 + 32 = 44 q)" },
          { id: "B", text: "20 qram" },
          { id: "C", text: "24 qram" },
          { id: "D", text: "56 qram" }
        ],
        correctOption: "A",
        explanation: "Reaksiyaya daxil olan maddələrin kütlələri cəmi (12 q + 32 q = 44 q) məhsulun kütləsinə bərabərdir.",
        bloomLevel: "Tətbiq"
      },
      {
        id: "lav-q2",
        question: "Açıq qabda odun yandıqda külün kütləsinin ilkin odundan az olmasının elmi səbəbi nədir?",
        options: [
          { id: "A", text: "Kütlənin bir hissəsinin tüstü və qazlar (CO₂, su buxarı) şəklində havaya uçması" },
          { id: "B", text: "Kütlənin məhv olması" },
          { id: "C", text: "Qravitasiyanın azalması" },
          { id: "D", text: "Yalnız temperaturun artması" }
        ],
        correctOption: "A",
        explanation: "Reaksiya açıq sistemdə getdiyi üçün uçucu qazlar çıxıb gedir; əgər proses qapalı qabda aparılsaydı, ümumi kütlə tam sabit qalardı.",
        bloomLevel: "Anlama"
      },
      {
        id: "lav-q3",
        question: "Lavuazye yanma prosesinin hansı qazla qarşılıqlı təsir olduğunu sübut etdi?",
        options: [
          { id: "A", text: "Oksigen (O₂)" },
          { id: "B", text: "Azot (N₂)" },
          { id: "C", text: "Helium (He)" },
          { id: "D", text: "Xlor (Cl₂)" }
        ],
        correctOption: "A",
        explanation: "Lavuazye havadakı oksigeni kəşf edərək yanmanın maddələrin oksigenlə sürətli oksidləşmə reaksiyası olduğunu sübut etdi.",
        bloomLevel: "Bilik"
      }
    ]
  },
  {
    id: "avogadro-law-molar-volume",
    slug: "amedeo-avogadro-law-molar-volume-gases",
    category: "kimya",
    isNobel: false,
    discoveryYear: 1811,
    discoverer: "Amedeo Avoqadro (Amedeo Avogadro)",
    curriculumSubject: "Kimya",
    curriculumGrade: "8-ci sinif",
    curriculumTopic: "Avoqadro qanunu, mol anlayışı, Avoqadro sabiti (6.02*10^23) və qazların molyar həcmi (22.4 l)",
    icon: "Atom",
    accentColor: "from-teal-500 to-cyan-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Amedeo Avoqadro Qanunu və Molyar Həcm",
        summary: "Eyni temperatur və təzyiqdə bütün qazların bərabər həcmlərində eyni sayda molekul var: kimyanın möcüzəvi 22.4 litri.",
        ahaMoment: "Gey-Lüssak müşahidə etmişdi ki, 2 həcm hidrogen qazı ilə 1 həcm oksigen qazı birləşəndə 2 həcm su buxarı alınır (2:1 nisbəti). Bu tam ədəd nisbətlərini izah etmək üçün Avoqadro 1811-ci ildə dahi fərziyyə irəli sürdü: qaz molekullarının ölçüsündən və növündən asılı olmayaraq, eyni şəraitdə bərabər həcmdə qazlar eyni sayda molekula malikdir!",
        howItWorks: "Normal şəraitdə (0°C və 1 atm təzyiqdə) istənilən qazın 1 molunda (6.022 * 10²³ ədəd molekul) həcm həmişə eynidir: V_m = 22.4 litr/mol. Bu, qaz molekulları arasındakı məsafənin molekulların öz ölçülərindən minlərlə dəfə böyük olması ilə izah olunur.",
        realWorldImpact: "Bütün qaz tənliklərinin hesablanması (Mendeleyev-Klapeyron tənliyi: PV = nRT), avtomobil təhlükəsizlik yastıqları, qaz balonları.",
        curriculumConnection: "8-ci sinif Kimya imtahanlarının ən populyar hesab məsələləri: Mol (n = m/M = V/V_m = N/N_A).",
        funFacts: [
          "Avoqadro sabiti (6.02 * 10²³) o qədər böyük rəqəmdir ki, əgər bu sayda noxud dənəsini Yer kürəsinə səpsəydik, bütün planet 1 kilometr qalınlığında noxud qatı ilə örtülərdi!"
        ]
      },
      en: {
        title: "Avogadro's Law and Molar Gas Volume",
        summary: "Equal volumes of gases at identical temperature and pressure contain equal numbers of molecules (Vm = 22.4 L).",
        ahaMoment: "Avogadro resolved Gay-Lussac's combining gas volumes by realizing gas spacing vastly exceeds individual molecular sizes.",
        howItWorks: "One mole of any ideal gas occupies precisely 22.4 liters at standard temperature and pressure (STP) and contains 6.022 x 10^23 particles.",
        realWorldImpact: "Gas stoichiometry, airbag deployment physics, and the ideal gas equation PV=nRT.",
        curriculumConnection: "Standard 8th-grade chemistry calculations: moles, molar volume, and Avogadro's constant.",
        funFacts: [
          "If you had Avogadro's number of pennies, you could cover the entire surface of Earth in a stack 400 meters high."
        ]
      },
      tr: {
        title: "Avogadro Yasası ve Gazların Molar Hacmi",
        summary: "Aynı koşullardaki tüm gazların eşit hacimlerinde eşit sayıda tanecik vardır: Kimyanın sihirli 22.4 litresi.",
        ahaMoment: "Gaz molekülleri arasındaki mesafenin molekülün kendi boyutundan katbekat büyük olduğunu anlayarak gaz hacimlerini eşitledi.",
        howItWorks: "Normal şartlar altında (0°C, 1 atm) 1 mol ideal gaz tam 22.4 litre hacim kaplar ve 6.02x10^23 tanecik içerir.",
        realWorldImpact: "İdeal gaz denklemi (PV=nRT), hava yastığı kimyasal hesaplamaları ve gaz analizleri.",
        curriculumConnection: "Kimyadaki mol kavramı, Avogadro sayısı ve gaz hacmi hesaplamalarının temelidir.",
        funFacts: [
          "Avogadro sayısı kadar pirinç tanesi olsaydı tüm dünyayı kilometrelerce kalınlıkta pirinç kaplardı."
        ]
      },
      ru: {
        title: "Закон Авогадро и молярный объем газов",
        summary: "В равных объемах различных газов при одинаковых условиях содержится одинаковое число молекул.",
        ahaMoment: "Авогадро объяснил простые объемные отношения Гей-Люссака, постулировав двухатомность простых газов (H2, O2, N2).",
        howItWorks: "При нормальных условиях (0°C, 101.3 кПа) 1 моль любого газа занимает объем 22.4 литра и содержит 6.022 * 10^23 молекул.",
        realWorldImpact: "Уравнение Менделеева-Клапейрона (PV = nRT), расчет газовых баллонов и пневматических систем.",
        curriculumConnection: "Школьная химия 8 класса: количество вещества (моль), молярный объем, число Авогадро.",
        funFacts: [
          "Число Авогадро настолько велико, что превышает количество песчинок на всех пляжах Земли."
        ]
      }
    },
    quiz: [
      {
        id: "avo-q1",
        question: "Normal şəraitdə (n.ş.) 2 mol oksigen qazı neçə litr həcm tutur?",
        options: [
          { id: "A", text: "44.8 litr (2 * 22.4 l)" },
          { id: "B", text: "22.4 litr" },
          { id: "C", text: "11.2 litr" },
          { id: "D", text: "67.2 litr" }
        ],
        correctOption: "A",
        explanation: "Normal şəraitdə 1 mol qaz 22.4 litr həcm tutur. 2 mol üçün V = 2 * 22.4 = 44.8 litrdir.",
        bloomLevel: "Tətbiq"
      },
      {
        id: "avo-q2",
        question: "Avoqadro sabiti (N_A) hansı kəmiyyəti ifadə edir?",
        options: [
          { id: "A", text: "1 mol maddədə olan struktur zərrəciklərin (atom və ya molekulların) sayını (6.02 * 10²³)" },
          { id: "B", text: "Bir qram suyun həcmini" },
          { id: "C", text: "Havanın sıxlığını" },
          { id: "D", text: "Elektronun sürətini" }
        ],
        correctOption: "A",
        explanation: "1 mol istənilən maddədə tam olaraq 6.022 * 10²³ sayda zərrəcik mövcuddur.",
        bloomLevel: "Bilik"
      },
      {
        id: "avo-q3",
        question: "Niyə fərqli qazlar (məsələn, yüngül Hidrogen və ağır Oksigen) eyni şəraitdə eyni mol həcminə (22.4 l) malik olur?",
        options: [
          { id: "A", text: "Çünki qazlarda molekullar arasındakı məsafə molekulların öz ölçülərindən qat-qat böyükdür" },
          { id: "B", text: "Çünki onların kütlələri eynidir" },
          { id: "C", text: "Çünki hər ikisi bərk maddədir" },
          { id: "D", text: "Çünki cazibə qüvvəsi qazlara təsir etmir" }
        ],
        correctOption: "A",
        explanation: "Qazın həcmini molekulların öz fiziki ölçüsü deyil, onların arasındakı termal xaotik məsafə müəyyən edir.",
        bloomLevel: "Anlama"
      }
    ]
  },
  {
    id: "gregor-mendel-genetics",
    slug: "gregor-mendel-laws-of-inheritance-classical-genetics",
    category: "biologiya",
    isNobel: false,
    discoveryYear: 1865,
    discoverer: "Qreqor Mendel (Gregor Mendel)",
    curriculumSubject: "Biologiya",
    curriculumGrade: "9-10-cu sinif",
    curriculumTopic: "İrsiyyət və dəyişkənlik, Mendelin I, II və III qanunları, monohibrid çarpazlaşma",
    icon: "Sprout",
    accentColor: "from-emerald-600 to-green-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Qreqor Mendel və İrsiyyət Qanunları: Genetikanın Atası",
        summary: "Monastır bağçasındakı noxud bitkilərindən nəsildən-nəslə ötürülən irsi əlamətlərin riyazi qanunauyğunluqlarının kəşfi.",
        ahaMoment: "O dövrdə hamı inanırdı ki, valideynlərin əlamətləri uşaqlarda boya kimi bir-birinə qarışır (məsələn, qara və ağ qarışanda boz olur). Mendel 8 il ərzində 28 000 noxud bitkisini süni tozlandıraraq çarpazlaşdırdı və gördü ki, sarı və yaşıl noxudu çarpazlaşdırdıqda birinci nəsildə yaşıl rəng yox olur (hamısı sarı olur), lakin ikinci nəsildə yaşıl rəng heç nə olmamış kimi 3:1 nisbətində yenidən üzə çıxır!",
        howItWorks: "Əlamətlər qarışmayan diskret vahidlərlə (genlərlə) ötürülür. Mendel 3 qanun formalaşdırdı: 1) Birinci nəslin eyniliyi (dominantlıq) qanunu, 2) Əlamətlərin parçalanması qanunu (F2-də fenotipə görə 3:1 parçalanma), 3) Əlamətlərin sərbəst paylanması qanunu (dihibrid çarpazlaşmada 9:3:3:1).",
        realWorldImpact: "Seleksiya, kənd təsərrüfatı bitki və heyvan cinslərinin yaxşılaşdırılması, irsi xəstəliklərin (hemofiliya, daltonizm) irsiyyət riskinin hesablanması.",
        curriculumConnection: "9-10-cu sinif Biologiyanın ən vacib bölməsi: Allel genlər, homoziqot və heteroziqot orqanizmlər, Pennet barmaqlığı.",
        funFacts: [
          "Mendelin işi 35 il ərzində heç kim tərəfindən başa düşülmədi və unuduldu; yalnız 1900-cü ildə üç fərqli alim eyni vaxtda Mendelin haqlı olduğunu yenidən kəşf etdi."
        ]
      },
      en: {
        title: "Gregor Mendel: The Laws of Inheritance",
        summary: "Counting pea plants in a monastery garden to establish the discrete mathematical rules of genetics.",
        ahaMoment: "Breeding yellow and green peas revealed recessive traits do not blend or vanish; they reappear in precise 3:1 ratios in F2 generations.",
        howItWorks: "Inheritance operates via discrete paired factors (alleles) following the Laws of Segregation and Independent Assortment.",
        realWorldImpact: "Agricultural crop breeding, human genetic counseling, pedigree analysis, and gene mapping.",
        curriculumConnection: "Core 9th/10th grade biology: Punnett squares, dominant vs recessive alleles, and phenotypic ratios.",
        funFacts: [
          "Mendel's groundbreaking paper was ignored for 35 years until rediscovered independently in 1900."
        ]
      },
      tr: {
        title: "Gregor Mendel ve Kalıtım Yasaları",
        summary: "Manastır bahçesindeki bezelyelerden genetiğin temellerini atan deha.",
        ahaMoment: "Sarı ve yeşil bezelyeler melezlendiğinde yeşil rengin kaybolmayıp ikinci nesilde 3:1 oranında geri döndüğünü kanıtladı.",
        howItWorks: "Karakterler ayrışım ve bağımsız açılım yasalarına göre aktarılan baskın (dominant) ve çekinik (resesif) alellerle belirlenir.",
        realWorldImpact: "Tarımsal ıslah çalışmaları ve kalıtsal hastalıkların aile ağacı analizleri.",
        curriculumConnection: "Biyolojide monohibrit/dihibrit çaprazlama, Punnett karesi ve alel genler kazanımları.",
        funFacts: [
          "Mendel'in makalesi 35 yıl boyunca kütüphanelerde unutulmuş, 1900 yılında yeniden keşfedilmiştir."
        ]
      },
      ru: {
        title: "Законы наследственности Грегора Менделя",
        summary: "Опыты с горохом в монастырском саду, заложившие основы дискретной генетики.",
        ahaMoment: "Мендель показал, что признаки не «смешиваются», а передаются неделимыми факторами: во втором поколении рецессивный признак возрождается в соотношении 3:1.",
        howItWorks: "Три закона Менделя: закон единообразия гибридов первого поколения, закон расщепления (3:1) и закон независимого наследования (9:3:3:1).",
        realWorldImpact: "Селекция растений и животных, медико-генетическое консультирование семей.",
        curriculumConnection: "Школьный курс биологии 9-10 классов: аллельные гены, фенотип и генотип, решетка Пеннета.",
        funFacts: [
          "Труд Менделя оставался незамеченным 35 лет, пока не был переоткрыт тремя учеными независимо в 1900 году."
        ]
      }
    },
    quiz: [
      {
        id: "men-q1",
        question: "İki heteroziqot sarı noxud (Aa x Aa) çarpazlaşdırıldıqda nəsildə fenotipə görə hansı parçalanma nisbəti alınar?",
        options: [
          { id: "A", text: "3 sarı : 1 yaşıl (3:1)" },
          { id: "B", text: "1 sarı : 1 yaşıl" },
          { id: "C", text: "Hamısı yaşıl" },
          { id: "D", text: "9:3:3:1" }
        ],
        correctOption: "A",
        explanation: "Pennet cədvəlinə görə: AA (sarı), Aa (sarı), Aa (sarı), aa (yaşıl). Fenotipə görə 3 dominant (sarı) və 1 resessiv (yaşıl) – 3:1 nisbəti alınır.",
        bloomLevel: "Tətbiq"
      },
      {
        id: "men-q2",
        question: "Mendelin birinci qanunu necə adlanır?",
        options: [
          { id: "A", text: "Birinci nəsil hibridlərinin eyniliyi (dominantlıq) qanunu" },
          { id: "B", text: "Sərbəst paylanma qanunu" },
          { id: "C", text: "Təbii seçmə qanunu" },
          { id: "D", text: "Enerjinin saxlanması qanunu" }
        ],
        correctOption: "A",
        explanation: "Homoziqot dominant (AA) ilə homoziqot resessiv (aa) fərdlər çarpazlaşdıqda F1 nəslinin hamısı eyni fenotip və heteroziqot (Aa) genotipə malik olur.",
        bloomLevel: "Bilik"
      },
      {
        id: "men-q3",
        question: "Resessiv genin fenotipdə (xarici görünüşdə) üzə çıxması üçün orqanizm hansı vəziyyətdə olmalıdır?",
        options: [
          { id: "A", text: "Homoziqot resessiv vəziyyətdə (aa)" },
          { id: "B", text: "Heteroziqot vəziyyətdə (Aa)" },
          { id: "C", text: "Homoziqot dominant vəziyyətdə (AA)" },
          { id: "D", text: "Yalnız qocalıq dövründə" }
        ],
        correctOption: "A",
        explanation: "Resessiv əlamət dominant genin (A) iştirakı ilə maskalanır; ona görə də o, yalnız hər iki allel resessiv (aa) olduqda xaricdə təzahür edir.",
        bloomLevel: "Anlama"
      }
    ]
  },
  {
    id: "pythagorean-theorem-geometry",
    slug: "pythagorean-theorem-right-triangle-geometry",
    category: "riyaziyyat",
    isNobel: false,
    discoveryYear: "e.ə. 500",
    discoverer: "Pifaqor (Pythagoras)",
    curriculumSubject: "Riyaziyyat",
    curriculumGrade: "8-ci sinif",
    curriculumTopic: "Düzbucaqlı üçbucaq, katetlər və hipotenuz, Pifaqor teoremi (a² + b² = c²)",
    icon: "Triangle",
    accentColor: "from-blue-700 to-indigo-900",
    readTime: "5 dəq",
    translations: {
      az: {
        title: "Pifaqor Teoremi: Həndəsənin Ən Məşhur Tənliyi",
        summary: "a² + b² = c²: Düzbucaqlı üçbucağın tərəfləri arasındakı əbədi qanunauyğunluq və məsafə anlayışının riyazi təməli.",
        ahaMoment: "Qədim Misir inşaatçıları ehramları tikərkən düz bucaq (90°) qurmaq üçün 12 bərabər hissəyə bölünmüş iplərdən istifadə edirdilər (3-4-5 misir üçbucağı). Pifaqor isə bunu ümumiləşdirərək sübut etdi ki, istənilən düzbucaqlı üçbucaqda katetlər üzərində qurulmuş kvadratların sahələrinin cəmi hipotenuz üzərində qurulmuş kvadratın sahəsinə tam bərabərdir!",
        howItWorks: "Düzbucaqlı üçbucaqda katetlərin kvadratları cəmi hipotenuzun kvadratına bərabərdir: a² + b² = c². Buradan hipotenuz c = √(a² + b²) düsturu ilə tapılır.",
        realWorldImpact: "GPS naviqasiya xəritələri, kompüter qrafikası və 3D oyun mühərrikləri, memarlıq və inşaat.",
        curriculumConnection: "8-ci sinif Həndəsə dərsliyinin və bütün riyaziyyat imtahanlarının mütləq sualı: Düzbucaqlı üçbucağın həlli və Pifaqor ədədləri (3-4-5, 5-12-13, 8-15-17).",
        funFacts: [
          "Pifaqor teoreminin dünyada 370-dən çox fərqli riyazi isbatı mövcuddur; isbat edənlərdən biri hətta ABŞ prezidenti Ceyms Qarfild olmuşdur!"
        ]
      },
      en: {
        title: "The Pythagorean Theorem",
        summary: "a² + b² = c²: The foundational relationship in Euclidean geometry connecting right triangle legs to the hypotenuse.",
        ahaMoment: "Ancient Egyptian ropestretchers used 3-4-5 triangles; Pythagoras generalized it into a universal geometric theorem.",
        howItWorks: "In any right triangle, the area of the square on the hypotenuse equals the sum of squares on the other two sides: a^2 + b^2 = c^2.",
        realWorldImpact: "Cartesian coordinate distance formulas, GPS triangulation, architectural survey, and 3D computer rendering.",
        curriculumConnection: "Essential 8th-grade geometry: right triangles, Pythagorean triples, and trigonometry basics.",
        funFacts: [
          "Over 370 distinct proofs exist, including one discovered by US President James A. Garfield."
        ]
      },
      tr: {
        title: "Pisagor Teoremi ve Dik Üçgen Geometrisi",
        summary: "a² + b² = c²: Geometrinin en bilinen eşitliği ve mesafenin matematiksel tanımı.",
        ahaMoment: "Eski Mısırlıların 3-4-5 ipleriyle kurduğu dik açıları genel bir geometrik teorem olarak tüm üçgenlere kanıtladı.",
        howItWorks: "Bir dik üçgende dik kenarların karelerinin toplamı hipotenüsün karesine eşittir.",
        realWorldImpact: "GPS haritalama, inşaat mühendisliği, 3D bilgisayar grafikleri ve oyun motorları.",
        curriculumConnection: "8. sınıf matematik kazanımlarının omurgası: Pisagor bağıntısı ve özel üçgenler.",
        funFacts: [
          "Teoremin 370'den fazla farklı ispatı vardır; birini ABD Başkanı James Garfield yapmıştır."
        ]
      },
      ru: {
        title: "Теорема Пифагора",
        summary: "a² + b² = c²: Фундаментальная теорема геометрии, связывающая катеты и гипотенузу прямоугольного треугольника.",
        ahaMoment: "Пифагор доказал, что сумма площадей квадратов, построенных на катетах, в точности равна площади квадрата на гипотенузе.",
        howItWorks: "В прямоугольном треугольнике квадрат длины гипотенузы равен сумме квадратов длин катетов: a² + b² = c².",
        realWorldImpact: "Формула расстояния в декартовых координатах, GPS-навигация, 3D-графика и архитектура.",
        curriculumConnection: "Школьный курс геометрии 8 класса: прямоугольные треугольники, пифагоровы тройки (3-4-5, 5-12-13).",
        funFacts: [
          "Существует более 370 различных доказательств этой теоремы, включая доказательство президента США Гарфилда."
        ]
      }
    },
    quiz: [
      {
        id: "pyt-q1",
        question: "Katetləri 6 sm və 8 sm olan düzbucaqlı üçbucağın hipotenuzu neçə santimetrdir?",
        options: [
          { id: "A", text: "10 sm (√(6² + 8²) = √(36 + 64) = 10)" },
          { id: "B", text: "14 sm" },
          { id: "C", text: "12 sm" },
          { id: "D", text: "48 sm" }
        ],
        correctOption: "A",
        explanation: "Pifaqor teoreminə görə c² = a² + b² = 6² + 8² = 36 + 64 = 100. c = √100 = 10 sm.",
        bloomLevel: "Tətbiq"
      },
      {
        id: "pyt-q2",
        question: "Düzbucaqlı üçbucaqda düz bucağın qarşısında duran ən böyük tərəf necə adlanır?",
        options: [
          { id: "A", text: "Hipotenuz" },
          { id: "B", text: "Katet" },
          { id: "C", text: "Median" },
          { id: "D", text: "Bissiktrisa" }
        ],
        correctOption: "A",
        explanation: "Düzbucaqlı üçbucaqda düz bucağı (90°) əmələ gətirən tərəflər katetlər, düz bucağın qarşısındakı ən böyük tərəf isə hipotenuz adlanır.",
        bloomLevel: "Bilik"
      },
      {
        id: "pyt-q3",
        question: "Aşağıdakı ədəd üçlüklərindən hansı Pifaqor üçlüyü (misir üçbucağı tərəfləri) TƏŞKİL ETMİR?",
        options: [
          { id: "A", text: "4, 5, 6" },
          { id: "B", text: "3, 4, 5" },
          { id: "C", text: "5, 12, 13" },
          { id: "D", text: "6, 8, 10" }
        ],
        correctOption: "A",
        explanation: "4² + 5² = 16 + 25 = 41 ≠ 6² (36). Ona görə 4, 5, 6 Pifaqor üçlüyü deyil. Digər bütün variantlarda a² + b² = c² ödənilir.",
        bloomLevel: "Anlama"
      }
    ]
  }
]
