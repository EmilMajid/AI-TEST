import { ScientificDiscovery } from "@/lib/discoveries-types"

export const MODERN_DISCOVERIES: ScientificDiscovery[] = [
  {
    id: "charles-darwin-natural-selection",
    slug: "charles-darwin-natural-selection-evolutionary-theory",
    category: "biologiya",
    isNobel: false,
    discoveryYear: 1859,
    discoverer: "Çarlz Darvin (Charles Darwin)",
    curriculumSubject: "Biologiya",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Təkamül təlimi, təbii seçmə, yaşamaq uğrunda mübarizə və adaptasiya",
    icon: "TreePine",
    accentColor: "from-emerald-700 to-green-900",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "Çarlz Darvin və Təbii Seçmə Yolu ilə Təkamül",
        summary: "Qalapaqos adalarındakı vürok quşlarının dimdiyindən bütün canlı aləmin ümumi əcdad ağacına: biologiyanı birləşdirən böyük nəzəriyyə.",
        ahaMoment: "Darvin 'Biql' gəmisində 5 illik dünya səyahətində Qalapaqos adalarını ziyarət edəndə gördü ki, bir-birinə çox yaxın adalardakı vürok quşlarının dimdikləri fərqlidir: biri toxum qırmaq üçün qalın və güclü, digəri isə kaktus çiçəyindən həşərat tutmaq üçün uzun və incədir. O başa düşdü: ətraf mühit şəraitinə daha yaxşı uyğunlaşan fərdlər sağ qalır və öz əlamətlərini növbəti nəslə ötürür!",
        howItWorks: "Təbii seçmə dörd əsas sütuna söykənir: 1) İrsi dəyişkənlik (populyasiyadakı fərdlər fərqlidir), 2) Həddən artıq çoxalma və resurs çatışmazlığı, 3) Yaşamaq uğrunda mübarizə, 4) Əlverişli əlamətlərə malik fərdlərin seçici sağ qalması və çoxalması.",
        realWorldImpact: "Təbabətdə antibiotiklərə davamlı bakteriyaların mexanizminin anlaşılması, xərçəng hüceyrələrinin təkamülü, ekologiya və biomüxtəlifliyin qorunması.",
        curriculumConnection: "9-cu və 11-ci sinif Biologiyada 'Təkamülün hərəkətverici qüvvələri (ir性を dəyişkənlik, yaşamaq uğrunda mübarizə, təbii seçmə)' mövzularına tam aiddir.",
        funFacts: [
          "Darvin dini və elmi reaksiyadan çəkindiyi üçün öz nəzəriyyəsini düz 20 il boyunca dərc etməmişdi; yalnız Alfred Uollesin eyni fikrə gəldiyini görəndə kitabını nəşr etdirdi."
        ]
      },
      en: {
        title: "Charles Darwin: Evolution by Natural Selection",
        summary: "Unifying biology by revealing how variation and selective survival sculpt the diversity of life on Earth.",
        ahaMoment: "Observing beak adaptations across Galápagos finches revealed that isolated island environments selectively favor survival traits.",
        howItWorks: "Heritable genetic variations that enhance an organism's survival and reproduction probability proliferate across generations.",
        realWorldImpact: "Antibiotic resistance modeling, cancer clone dynamics, and ecological biodiversity conservation.",
        curriculumConnection: "Core secondary biology: mechanisms of evolution, fitness, and adaptation.",
        funFacts: [
          "Darwin delayed publishing 'On the Origin of Species' for 20 years fearing societal backlash."
        ]
      },
      tr: {
        title: "Charles Darwin ve Doğal Seçilim Yoluyla Evrim",
        summary: "Galapagos ispinozlarından tüm canlılar ağacına: biyolojiyi birleştiren en büyük teori.",
        ahaMoment: "Farklı adalardaki kuşların besin kaynaklarına göre farklı gaga yapıları geliştirdiğini gözlemlemesi.",
        howItWorks: "Çevreye en iyi uyum sağlayan varyasyonların hayatta kalıp genlerini aktarmasıyla türler zamanla değişir.",
        realWorldImpact: "Bakteriyel direnç, kanser evrimi ve ekolojik koruma stratejileri.",
        curriculumConnection: "Biyolojide doğal seçilim, adaptasyon ve kalıtsal varyasyon kazanımlarıyla uyumludur.",
        funFacts: [
          "Darwin tepkilerden çekindiği için teorisini 20 yıl boyunca yayınlamadan çekmecesinde sakladı."
        ]
      },
      ru: {
        title: "Чарльз Дарвин: Теория эволюции и естественный отбор",
        summary: "Объяснение разнообразия жизни через призму наследственной изменчивости и борьбы за выживание.",
        ahaMoment: "Различия в форме клювов вьюрков на Галапагосских островах натолкнули Дарвина на мысль о расхождении признаков от общего предка.",
        howItWorks: "Особи с полезными в данных условиях мутациями имеют преимущество в выживании и размножении, передавая признаки потомству.",
        realWorldImpact: "Понимание устойчивости бактерий к антибиотикам, селекция и эволюционная медицина.",
        curriculumConnection: "Школьный курс биологии: движущие силы эволюции, борьба за существование, естественный отбор, приспособленность.",
        funFacts: [
          "Дарвин откладывал публикацию «Происхождения видов» целых 20 лет из-за страха общественной критики."
        ]
      }
    },
    quiz: [
      {
        id: "dar-q1",
        question: "Darvin təliminə görə təkamülün başlıca istiqamətləndirici hərəkətverici qüvvəsi nədir?",
        options: [
          { id: "A", text: "Təbii seçmə" },
          { id: "B", text: "Orqanizmlərin daxili mükəmməlliyə can atması" },
          { id: "C", text: "Yalnız iqlimin soyuması" },
          { id: "D", text: "Gecə və gündüzün növbələşməsi" }
        ],
        correctOption: "A",
        explanation: "Darvin sübut etdi ki, təkamülün istiqamətini müəyyən edən və adaptasiyaları formalaşdıran əsas amil təbii seçmədir.",
        bloomLevel: "Bilik"
      },
      {
        id: "dar-q2",
        question: "Zərərverici həşəratlara qarşı eyni zəhərli dərmanı (pestisid) illərlə tətbiq etdikdə dərmanın təsirinin itməsinin səbəbi nədir?",
        options: [
          { id: "A", text: "Təbii seçmə nəticəsində zəhərə qarşı davamlı mutasiyaya malik fərdlərin sağ qalaraq çoxalması" },
          { id: "B", text: "Həşəratların zəhəri yeməyi öyrənməsi" },
          { id: "C", text: "Dərmanın öz-özünə şəkərə çevrilməsi" },
          { id: "D", text: "Havanın təzyiqinin düşməsi" }
        ],
        correctOption: "A",
        explanation: "Zəhər həssas fərdləri məhv edir, təsadüfi davamlılıq geni daşıyan nadir fərdlər sağ qalaraq bütün populyasiyanı dözümlü hala gətirir (təbii seçmə).",
        bloomLevel: "Tətbiq"
      },
      {
        id: "dar-q3",
        question: "Aşağıdakılardan hansı yaşamaq uğrunda mübarizənin ən gərgin növüdür?",
        options: [
          { id: "A", text: "Növ daxili mübarizə (eyni növün fərdləri arasında)" },
          { id: "B", text: "Növlərarası mübarizə" },
          { id: "C", text: "Əlverişsiz mühit şəraitinə qarşı mübarizə" },
          { id: "D", text: "Yalnız qış yuxusu" }
        ],
        correctOption: "A",
        explanation: "Eyni növün fərdləri tam eyni qidaya, yaşayış yerinə və cütləşmə partnyoruna ehtiyac duyduğu üçün növdaxili mübarizə ən amansız və gərgindir.",
        bloomLevel: "Anlama"
      }
    ]
  },
  {
    id: "hooke-leeuwenhoek-cell-theory",
    slug: "robert-hooke-leeuwenhoek-cell-theory-microbiology",
    category: "biologiya",
    isNobel: false,
    discoveryYear: 1665,
    discoverer: "Robert Huk və Antoni van Levenhuk",
    curriculumSubject: "Biologiya",
    curriculumGrade: "6-7-ci sinif",
    curriculumTopic: "Hüceyrə nəzəriyyəsi, mikroskop, hüceyrəvi quruluş və birhüceyrəli orqanizmlər",
    icon: "Microscope",
    accentColor: "from-lime-600 to-emerald-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Hüceyrənin Kəşfi və Mikroskopik Canlılar Dünyası",
        summary: "Qapaq mantarının kəsiyindəki 'monax hücrələri'ndən gölməçə suyundakı canlı 'animalcules'ə qədər: biologiyanın təməl daşının qoyulması.",
        ahaMoment: "1665-ci ildə Robert Huk təkmilləşdirdiyi mikroskop altında ağac mantarının nazik kəsiyinə baxanda minlərlə kiçik qutuya bənzər boş otaqlar gördü və onları monaxların qaldığı otaqlara bənzədərək 'cell' (hüceyrə) adlandırdı. Bir neçə il sonra holland parça taciri Levenhuk öz cilaladığı güclü linzalarla bir damla yağış suyunda qaynaşan canlı bakteriya və ibtidailəri görən ilk insan oldu!",
        howItWorks: "Hüceyrə nəzəriyyəsi (Şleydon, Şvann və Virxov) üç əsas postulatı müəyyən edir: 1) Bütün canlı orqanizmlər bir və ya bir neçə hüceyrədən ibarətdir, 2) Hüceyrə həyatın ən kiçik struktur və funksional vahididir, 3) Hər bir yeni hüceyrə yalnız əvvəlki hüceyrənin bölünməsi yolu ilə yaranır ('Omnis cellula e cellula').",
        realWorldImpact: "Tibb, sitologiya, kök hüceyrə terapiyası, orqan transplantasiyası və klonlaşdırma.",
        curriculumConnection: "6-7-ci sinif Biologiyanın ilk dərsi: Hüceyrə orqanoidləri (nüvə, mitoxondri, ribosom), bitki və heyvan hüceyrəsinin fərqləri.",
        funFacts: [
          "Levenhuk dişlərindən ərpi qaşıyıb mikroskop altına qoyanda demişdi: 'Bütün Hollandiya krallığındakı insanlardan daha çox canlı mənim ağzımda yaşayır!'."
        ]
      },
      en: {
        title: "Hooke, Leeuwenhoek and the Cell Theory",
        summary: "Unveiling the microscopic building blocks of all living organisms through early optical lenses.",
        ahaMoment: "Hooke named cork compartments 'cells'; Leeuwenhoek discovered bacteria and protozoa in a drop of rainwater.",
        howItWorks: "Cell Theory dictates all living things are composed of cells, the cell is the unit of life, and all cells arise from pre-existing cells.",
        realWorldImpact: "Cytology, pathology, stem-cell biology, and modern immunology.",
        curriculumConnection: "6th/7th-grade biology foundational topic: organelles, cell division, and microscopic techniques.",
        funFacts: [
          "Leeuwenhoek was an untrained draper who ground his own miniature high-magnification lenses in secret."
        ]
      },
      tr: {
        title: "Hücrenin Keşfi ve Hücre Teorisi",
        summary: "Şişe mantarından damla suyundaki mikroskobik canlılara: yaşamın en küçük biriminin keşfi.",
        ahaMoment: "Hooke mantar kesitindeki odacıklara 'hücre' adını verdi; Leeuwenhoek ilk kez canlı bakterileri mikroskopta gördü.",
        howItWorks: "Tüm canlılar hücrelerden oluşur, hücre yaşamın temel yapı birimidir ve her hücre bir önceki hücrenin bölünmesiyle doğar.",
        realWorldImpact: "Kök hücre tedavileri, doku mühendisliği ve patoloji.",
        curriculumConnection: "Hücre organelleri, bitki ve hayvan hücresi farkları ve mitoz bölünme kazanımları.",
        funFacts: [
          "Leeuwenhoek kendi diş kirini incelediğinde 'Ağzımda tüm krallıktan çok canlı yaşıyor' demiştir."
        ]
      },
      ru: {
        title: "Открытие клетки и клеточная теория",
        summary: "Роберт Гук, Левенгук и постулат «всякая клетка от клетки», объединивший ботанику и зоологию.",
        ahaMoment: "Гук увидел в срезе пробки ячейки и назвал их клетками, а Левенгук открыл мир одноклеточных микроорганизмов.",
        howItWorks: "Клеточная теория Шлейдена и Шванна (с дополнением Вирхова): клетка — элементарная единица живого, новые клетки образуются только делением.",
        realWorldImpact: "Цитология, онкология, клонирование и терапия стволовыми клетками.",
        curriculumConnection: "Школьный курс биологии 6-7 классов: строение клетки, органоиды, отличия растительной и животной клетки.",
        funFacts: [
          "Левенгук был торговцем сукном и создал свои непревзойденные микроскопы как любитель."
        ]
      }
    },
    quiz: [
      {
        id: "cell-q1",
        question: "Hüceyrə nəzəriyyəsinin 'Hər bir hüceyrə əvvəlki hüceyrənin bölünməsindən yaranır' prinsipini kim irəli sürmüşdür?",
        options: [
          { id: "A", text: "Rudolf Virxov" },
          { id: "B", text: "Robert Huk" },
          { id: "C", text: "İsaak Nyuton" },
          { id: "D", text: "Dmitri Mendeleyev" }
        ],
        correctOption: "A",
        explanation: "1858-ci ildə Rudolf Virxov məşhur 'Omnis cellula e cellula' (Hər bir hüceyrə hüceyrədən yaranır) postulatı ilə hüceyrə nəzəriyyəsini tamamlamışdır.",
        bloomLevel: "Bilik"
      },
      {
        id: "cell-q2",
        question: "Bitki hüceyrəsini heyvan hüceyrəsindən fərqləndirən əsas orqanoid və strukturlar hansılardır?",
        options: [
          { id: "A", text: "Sellüloza hüceyrə divarı, xloroplastlar və böyük mərkəzi vakuol" },
          { id: "B", text: "Yalnız mitoxondri və ribosom" },
          { id: "C", text: "Nüvənin olmaması" },
          { id: "D", text: "Qırmızı qan cisimcikləri" }
        ],
        correctOption: "A",
        explanation: "Bitki hüceyrələrində bərk sellüloza divarı, fotosintez edən xloroplastlar və turgor təzyiqi yaradan iri mərkəzi vakuol var ki, bunlar heyvan hüceyrəsində olmur.",
        bloomLevel: "Anlama"
      },
      {
        id: "cell-q3",
        question: "Canlılar aləmində hüceyrəvi quruluşa malik OLMAYAN yeganə qrup hansıdır?",
        options: [
          { id: "A", text: "Viruslar" },
          { id: "B", text: "Bakteriyalar" },
          { id: "C", text: "Göbələklər" },
          { id: "D", text: "Mavi-yaşıl yosunlar" }
        ],
        correctOption: "A",
        explanation: "Viruslar qeyri-hüceyrəvi həyat formasıdır; onların öz sitoplazması, membranı və metabolizmi yoxdur, yalnız başqa hüceyrə daxilində çoxala bilirlər.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "william-harvey-blood-circulation",
    slug: "william-harvey-systemic-blood-circulation-discovery",
    category: "biologiya",
    isNobel: false,
    discoveryYear: 1628,
    discoverer: "Uilyam Harveyd (William Harvey)",
    curriculumSubject: "Biologiya",
    curriculumGrade: "8-ci sinif",
    curriculumTopic: "İnsanın qan-damar sistemi, ürək, böyük və kiçik qan dövranı",
    icon: "HeartPulse",
    accentColor: "from-rose-600 to-red-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Uilyam Harvey və Qan Dövranı: Ürək Canlı Pompadır",
        summary: "Qalenin 1400 illik yanlış fikirlərini təkzib edən mexaniki kəşf: qanın bədəndə qapalı borularla fasiləsiz dövr etməsi.",
        ahaMoment: "Antik həkim Qalen hesab edirdi ki, qan qaraciyərdə fasiləsiz yaranır və orqanlar tərəfindən yanacaq kimi tam yeyilib qurtarır. Harvey ürəyin vurduğu qanın həcmini riyazi olaraq hesabladı: bircə saatda ürək insanın bədən çəkisindən 3 dəfə çox qan vurur! Əgər qaraciyər bu qədər qan yaratsaydı, insan hər saat öz çəkisindən çox yemək yeməli idi. Harvey sübut etdi: qan yeyilib bitmir, eyni qan damarlarda qapalı dairə üzrə fasiləsiz dövr edir!",
        howItWorks: "Ürək dörd kameralı əzələvi nasosdur. Kiçik qan dövranı sağ mədəcikdən başlayıb ağciyərlərdə qanı oksigenlə zənginləşdirir və sol qulaqcığa qayıdır. Böyük qan dövranı sol mədəcikdən (aorta ilə) bütün bədən orqanlarına oksigen və qida daşıyır və sağ qulaqcığa tökülür.",
        realWorldImpact: "Müasir kardiologiya, qan təzyiqinin ölçülməsi, ürək cərrahiyyəsi və süni qan dövranı aparatları.",
        curriculumConnection: "8-ci sinif Biologiya dərsliyinin ürəyi: Ürək tsikli (sistola və diastola), arteriya, vena və kapilyarlar, qan dövranı sxemi.",
        funFacts: [
          "İnsanın ürəyi orta ömür boyunca təxminən 3 milyard dəfə döyünür və 200 milyon litr qan vurur – bu, nəhəng bir supertankeri doldurmağa bəs edər!"
        ]
      },
      en: {
        title: "William Harvey: Systemic Blood Circulation",
        summary: "Proving the heart is a mechanical muscular pump circulating blood through a closed vascular loop.",
        ahaMoment: "Harvey calculated that the heart pumps more blood in an hour than the body's total weight, proving blood must circulate rather than be consumed.",
        howItWorks: "Driven by cardiac ventricular systole: the pulmonary circuit oxygenates blood via the lungs, while systemic circulation feeds peripheral tissues.",
        realWorldImpact: "Cardiology, hemodynamics, blood pressure monitoring, and cardiopulmonary bypass surgery.",
        curriculumConnection: "Core 8th-grade human biology: heart chambers, pulmonary and systemic loops, and valves.",
        funFacts: [
          "Harvey could not see capillaries (discovered later by Malpighi with microscopes), but inferred their existence mathematically."
        ]
      },
      tr: {
        title: "William Harvey ve Kan Dolaşımı Sistemi",
        summary: "Kalbin mekanik bir pompa olduğunu ve kanın kapalı damarlarda sürekli döndüğünü kanıtlayan devrim.",
        ahaMoment: "Kalbin saatte vücut ağırlığından fazla kan pompaladığını hesaplayarak kanın tüketilmeyip döndüğünü kanıtladı.",
        howItWorks: "Küçük dolaşım akciğerlerde kanı temizler; büyük dolaşım sol karıncıktan aortla tüm vücuda oksijen taşır.",
        realWorldImpact: "Modern kardiyoloji, tansiyon ölçümü ve açık kalp ameliyatları.",
        curriculumConnection: "Biyolojide dolaşım sistemi, kalp döngüsü, atardamar ve toplardamar kazanımları.",
        funFacts: [
          "Kılcal damarları o dönem mikroskop yetersiz olduğu için görememiş, ancak varlıklarını mantıksal olarak kanıtlamıştır."
        ]
      },
      ru: {
        title: "Уильям Гарвей и круги кровообращения",
        summary: "Математическое доказательство замкнутого круга кровообращения и механической роли сердца как насоса.",
        ahaMoment: "Гарвей подсчитал, что сердце за час перекачивает массу крови, втрое превышающую вес человека, опровергнув учение Галена.",
        howItWorks: "Малый круг через легкие обогащает кровь кислородом; большой круг через аорту питает все органы и ткани.",
        realWorldImpact: "Кардиология, измерение артериального давления, сосудистая хирургия и аппараты ИВЛ.",
        curriculumConnection: "Школьный курс анатомии 8 класса: большой и малый круги кровообращения, фазы сердечного цикла, вены и артерии.",
        funFacts: [
          "Гарвей предсказал существование капилляров чисто теоретически, до их открытия Мальпиги под микроскопом."
        ]
      }
    },
    quiz: [
      {
        id: "harv-q1",
        question: "Böyük qan dövranı ürəyin hansı kamerasından başlayır?",
        options: [
          { id: "A", text: "Sol mədəcikdən (aorta damarı ilə)" },
          { id: "B", text: "Sağ qulaqcıqdan" },
          { id: "C", text: "Sağ mədəcikdən" },
          { id: "D", text: "Ağciyər venasından" }
        ],
        correctOption: "A",
        explanation: "Böyük qan dövranı sol mədəcikdən ən böyük arterial damar olan aorta vasitəsilə başlayır və sağ qulaqcıqda bitir.",
        bloomLevel: "Bilik"
      },
      {
        id: "harv-q2",
        question: "Kiçik (ağciyər) qan dövranının başlıca bioloji vəzifəsi nədir?",
        options: [
          { id: "A", text: "Venoz qanı ağciyərlərdə karbon qazından təmizləyib oksigenlə zənginləşdirmək" },
          { id: "B", text: "Qlükozanı əzələlərə paylamaq" },
          { id: "C", text: "Sidiyi böyrəklərə aparmaq" },
          { id: "D", text: "Bədənin temperaturunu aşağı salmaq" }
        ],
        correctOption: "A",
        explanation: "Kiçik qan dövranında venoz qan ağciyər alveollarına çatır, qazlar mübadiləsi nəticəsində oksigenlə zənginləşərək arterial qana çevrilir.",
        bloomLevel: "Anlama"
      },
      {
        id: "harv-q3",
        question: "Damarlarda qanın yalnız bir istiqamətdə axmasını və geriyə qayıtmasının qarşısını nə alır?",
        options: [
          { id: "A", text: "Ürəkdə və venalarda olan birtərəfli qapaqlar (taylı və aypara qapaqlar)" },
          { id: "B", text: "Yalnız atmosfer təzyiqi" },
          { id: "C", text: "Qırmızı qan hüceyrələrinin çəkisi" },
          { id: "D", text: "DNT molekulları" }
        ],
        correctOption: "A",
        explanation: "Ürək qulaqcıq-mədəcik taylı qapaqları və magistral damarlardakı aypara qapaqlar qanın yalnız irəli axmasını təmin edir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "claude-shannon-information-theory",
    slug: "claude-shannon-information-theory-digital-bits",
    category: "informatika",
    isNobel: false,
    discoveryYear: 1948,
    discoverer: "Klod Şennon (Claude Shannon)",
    curriculumSubject: "İnformatika",
    curriculumGrade: "7-10-cu sinif",
    curriculumTopic: "İnformasiya miqdarı, bit və bayt, informasiyanın kodlaşdırılması və rabitə kanalları",
    icon: "Binary",
    accentColor: "from-blue-600 to-teal-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Klod Şennon və İnformasiya Nəzəriyyəsi: Bitlərin Doğulması",
        summary: "Qeyri-müəyyənliyin ölçülməsi və rəqəmsal dünyanın təməl vahidi olan 'bit' anlayışı: mətn, səs və videonun 0 və 1-lərə çevrilməsi.",
        ahaMoment: "1948-ci ilə qədər 'informasiya' qeyri-müəyyən fəlsəfi anlayış idi. Klod Şennon aşkar etdi ki, termodinamikadakı entropiya kimi, informasiyanın da dəqiq riyazi ölçüsü var: bərabər ehtimallı iki hadisədən (bəli/xeyr, 1/0) birinin seçilməsi tam 1 vahid informasiyadır! O, bu vahidə 'binaq rəqəm' (binary digit) sözlərinin birləşməsindən 'BIT' adını verdi.",
        howItWorks: "Şennon düsturuna görə ehtimallı hadisələrin informasiya entropiyası H = -Σ p_i * log₂(p_i) ilə hesablanır. O həmçinin sübut etdi ki, küy olan rabitə kanallarında belə xətaları düzəldən kodlarla (məsələn, Hemminq kodları) məlumatı 100% etibarlı ötürmək mümkündür.",
        realWorldImpact: "Bütün rəqəmsal rabitə, 4G/5G mobil şəbəkələri, faylların sıxılması (ZIP, MP3, JPEG) və internet protokolları.",
        curriculumConnection: "7-ci və 8-ci sinif İnformatika dərsliyinin ilk mövzusu: 'İnformasiyanın ölçü vahidləri (Bit, Bayt, KB, MB, GB)', Şennon və Xartli düsturları (N = 2^i).",
        funFacts: [
          "Şennon Bell laboratoriyasının dəhlizlərində təktəkərli velosiped sürərək eyni vaxtda 4 topla hoqqabazlıq (juggling) edən əyləncəli dahi idi.",
          "O, 1950-ci ildə labirintdən çıxış yolunu özü öyrənən 'Tezey' adlı ilk mexaniki elektron siçanı yaratmışdı."
        ]
      },
      en: {
        title: "Claude Shannon: Mathematical Theory of Communication",
        summary: "Defining the fundamental unit of information—the BIT—and laying the mathematical foundations for digital communication.",
        ahaMoment: "Shannon unified communications by framing messages as reduction of probabilistic uncertainty measured in bits.",
        howItWorks: "Information entropy H = -Σ p*log2(p) sets the absolute compression limit, while channel capacity dictates error-free transmission rates.",
        realWorldImpact: "Underpins the Internet, cellular 5G networks, cryptography, Wi-Fi, and data compression (MP3, JPEG).",
        curriculumConnection: "Core 7th/8th-grade informatics: bits, bytes, binary units, and Hartley's formula N = 2^i.",
        funFacts: [
          "Shannon used to ride a unicycle through Bell Labs corridors while juggling balls."
        ]
      },
      tr: {
        title: "Claude Shannon ve Bilgi Teorisi",
        summary: "Dijital çağın temel birimi olan 'Bit' kavramı ve bilginin 0 ve 1'lerle matematiksel ölçümü.",
        ahaMoment: "Belirsizliğin logaritmik olarak ölçülebileceğini kanıtlayarak ikili basamakları (Binary Digit -> BIT) tanımladı.",
        howItWorks: "Shannon entropisi veri sıkıştırma sınırlarını belirlerken kanal kapasitesi teoremi gürültülü hatlarda hatasız iletimi kanıtlar.",
        realWorldImpact: "İnternet, 5G mobil iletişim, veri sıkıştırma (ZIP, MP3) ve dijital şifreleme.",
        curriculumConnection: "Bilişim teknolojilerinde veri ölçü birimleri (Bit, Byte, KB, MB) ve ikili kodlama kazanımları.",
        funFacts: [
          "Shannon boş zamanlarında tek tekerlekli bisiklete binip labirent çözen mekanik robot fareler yapıyordu."
        ]
      },
      ru: {
        title: "Клод Шеннон и математическая теория связи",
        summary: "Рождение бита и математическое определение информации, создавшее цифровую цивилизацию.",
        ahaMoment: "Шеннон связал количество информации с устранением неопределенности, введя формулу информационной энтропии.",
        howItWorks: "Формула Шеннона H = -Σ p*log2(p): 1 бит — это количество информации, уменьшающее неопределенность в два раза.",
        realWorldImpact: "Цифровое вещание, сжатие данных (MP3, JPEG), мобильные сети 5G и криптография.",
        curriculumConnection: "Школьная информатика 7-8 классов: измерение информации, бит, байт, формула Хартли N = 2^i.",
        funFacts: [
          "Термин «бит» (bit) был образован Шенноном от сокращения слов binary digit (двоичная цифра)."
        ]
      }
    },
    quiz: [
      {
        id: "shan-q1",
        question: "Bir simvolun 256 simvollu əlifbadan seçilməsi zamanı daşıdığı informasiya miqdarı neçə bitdir?",
        options: [
          { id: "A", text: "8 bit (1 bayt), çünki 256 = 2^8" },
          { id: "B", text: "256 bit" },
          { id: "C", text: "4 bit" },
          { id: "D", text: "16 bit" }
        ],
        correctOption: "A",
        explanation: "Xartli düsturuna görə N = 2^i. Əgər N = 256 olarsa, i = log₂256 = 8 bit (yəni 1 bayt) təşkil edir.",
        bloomLevel: "Tətbiq"
      },
      {
        id: "shan-q2",
        question: "'Bit' sözünün mənşəyi hansı ingilis sözlərinin birləşməsindən yaranmışdır?",
        options: [
          { id: "A", text: "Binary digit (ikilik rəqəm)" },
          { id: "B", text: "Big internet" },
          { id: "C", text: "Byte item" },
          { id: "D", text: "Basic internal" }
        ],
        correctOption: "A",
        explanation: "Bit termini Klod Şennon tərəfindən 'Binary digIT' (ikilik rəqəm) sözlərinin baş və son hərflərindən ixtisar edilmişdir.",
        bloomLevel: "Bilik"
      },
      {
        id: "shan-q3",
        question: "Qeyri-müəyyənlik nə qədər çox olarsa, alınan xəbərin daşıdığı informasiya miqdarı necə dəyişir?",
        options: [
          { id: "A", text: "İnformasiya miqdarı daha çox olur" },
          { id: "B", text: "İnformasiya sıfır olur" },
          { id: "C", text: "İnformasiya həmişə mənfi olur" },
          { id: "D", text: "Heç bir asılılıq yoxdur" }
        ],
        correctOption: "A",
        explanation: "Şennon nəzəriyyəsinə görə informasiya qeyri-müəyyənliyin aradan qalxması dərəcəsidir; gözlənilməz, ehtimalı az olan hadisə baş verdikdə daha böyük informasiya daşıyır.",
        bloomLevel: "Anlama"
      }
    ]
  },
  {
    id: "tim-berners-lee-world-wide-web",
    slug: "tim-berners-lee-world-wide-web-http-html",
    category: "informatika",
    isNobel: false,
    discoveryYear: 1989,
    discoverer: "Tim Berners-Li (Sir Tim Berners-Lee)",
    curriculumSubject: "İnformatika",
    curriculumGrade: "8-11-ci sinif",
    curriculumTopic: "İnternet və qlobal şəbəkələr, WWW, URL, HTTP protokolu və HTML dili",
    icon: "Globe",
    accentColor: "from-sky-600 to-blue-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Tim Berners-Li və Ümumdünya Hörümçək Toru (WWW)",
        summary: "CERN laboratoriyasındakı alimlərin sənəd paylaşımından bütün bəşəriyyəti bir toxunuşla birləşdirən qlobal veb şəbəkəsinə.",
        ahaMoment: "1989-cu ildə İsveçrədəki CERN fizika laboratoriyasında dünyanın hər yerindən gələn minlərlə alim işləyirdi, lakin onların kompüter sistemləri fərqli olduğu üçün bir-birlərinin məqalələrini oxuya bilmirdilər. Tim Berners-Li hiper-mətn (hiperlink) ideyasını irəli sürdü: mətndəki hər hansı sözə klikləməklə dünyanın o biri başındakı başqa bir sənədə keçmək! O, ilk veb brauzeri, serveri və dili cəmi bir neçə aya təkbaşına yazdı.",
        howItWorks: "WWW üç təməl texnologiya üzərində qurulub: 1) HTML (sənədləri formatlaşdıran hiper-mətn dili), 2) HTTP (müştəri-brauzer ilə server arasında məlumat ötürən protokol), 3) URL (hər səhifənin qlobal unikal internet ünvanı).",
        realWorldImpact: "Müasir internet erası, elektron ticarət, onlayn təhsil, axtarış sistemləri və sosial şəbəkələr.",
        curriculumConnection: "8-9-cu sinif İnformatika dərsliyində 'Qlobal kompüter şəbəkələri', 'Brauzerlər və axtarış sistemləri', 'HTML teqləri və hiperistinadlar' mövzularına birbaşa aiddir.",
        funFacts: [
          "Tim Berners-Li WWW texnologiyasını heç vaxt patentləşdirmədi və heç kimdən qəpik də tələb etmədi; o, interneti bütün bəşəriyyətə təmənnasız hədiyyə etdi.",
          "Dünyada ilk veb sayt 1991-ci ilin avqustunda açılmışdır və həmin səhifə bu gün də CERN serverində fəaliyyət göstərir (info.cern.ch)."
        ]
      },
      en: {
        title: "Tim Berners-Lee: The World Wide Web",
        summary: "Inventing HTTP, HTML, and URLs at CERN to democratize global knowledge sharing.",
        ahaMoment: "To connect physics research across incompatible computer networks, Berners-Lee linked documents via clickable hypertext.",
        howItWorks: "Operates via Hypertext Transfer Protocol (HTTP), HTML markup language, and Uniform Resource Locators (URLs) over TCP/IP.",
        realWorldImpact: "Spawned modern e-commerce, search engines, global digital collaboration, and the modern knowledge economy.",
        curriculumConnection: "Standard 8th/9th-grade computing: network protocols, client-server models, and HTML markup fundamentals.",
        funFacts: [
          "Berners-Lee refused to patent the Web, releasing the code completely royalty-free for humanity."
        ]
      },
      tr: {
        title: "Tim Berners-Lee ve Dünya Çapında Ağ (WWW)",
        summary: "CERN laboratuvarından insanlığı birbirine bağlayan internet ağı: HTML, HTTP ve URL'nin doğuşu.",
        ahaMoment: "Farklı bilgisayarlardaki bilimsel makaleleri birbirine bağlamak için tıklanabilir köprü metin (hypertext) geliştirdi.",
        howItWorks: "HTML ile biçimlendirilen sayfalar HTTP protokolü üzerinden URL adresleri aracılığıyla istemciye iletilir.",
        realWorldImpact: "Küresel bilgiye anında erişim, e-ticaret, sosyal medya ve dijital dönüşüm.",
        curriculumConnection: "Bilişim dersinde internet protokolleri, web tarayıcıları ve temel HTML etiketleri konularının kalbidir.",
        funFacts: [
          "Web'in patentini almayarak teknolojiyi tüm insanlığa ücretsiz hediye etmiştir."
        ]
      },
      ru: {
        title: "Тим Бернерс-Ли и Всемирная паутина (WWW)",
        summary: "Создание HTTP, HTML и URL в ЦЕРНе, объединившее миллиарды людей в единое информационное пространство.",
        ahaMoment: "Чтобы физики могли мгновенно обмениваться отчетами, Бернерс-Ли связал документы гиперссылками.",
        howItWorks: "Стек технологий: язык разметки HTML, протокол передачи гипертекста HTTP и универсальный адрес ресурса URL поверх TCP/IP.",
        realWorldImpact: "Электронная коммерция, поисковые системы, соцсети и глобальная цифровая экономика.",
        curriculumConnection: "Школьная информатика: глобальная сеть Интернет, адресация (URL), веб-серверы и основы гипертекста.",
        funFacts: [
          "Первый в мире веб-сайт (info.cern.ch) был запущен в августе 1991 года и доступен до сих пор."
        ]
      }
    },
    quiz: [
      {
        id: "www-q1",
        question: "İnternetdə hər bir veb səhifənin təkrarolunmaz qlobal ünvanı necə adlanır?",
        options: [
          { id: "A", text: "URL (Uniform Resource Locator)" },
          { id: "B", text: "RAM" },
          { id: "C", text: "CPU" },
          { id: "D", text: "BIOS" }
        ],
        correctOption: "A",
        explanation: "URL (məsələn https://www.testai.az/discoveries) internet şəbəkəsində resursun dəqiq yerini və ona müraciət protokolunu göstərən unikal ünvandır.",
        bloomLevel: "Bilik"
      },
      {
        id: "www-q2",
        question: "İnternet (fiziki şəbəkə infrastrukturu) ilə WWW (Ümumdünya Hörümçək Toru) arasındakı fərq nədir?",
        options: [
          { id: "A", text: "İnternet qlobal kompüterlər şəbəkəsidir, WWW isə bu şəbəkə üzərində işləyən veb səhifələr və hiper-mətn xidmətidir" },
          { id: "B", text: "WWW yalnız kompüter oyunudur" },
          { id: "C", text: "İnternet yalnız telefonlarda işləyir" },
          { id: "D", text: "Heç bir fərq yoxdur" }
        ],
        correctOption: "A",
        explanation: "İnternet kompüterləri birləşdirən qlobal kabel və router şəbəkəsidir (TCP/IP); WWW isə bu şəbəkə üzərində sənədləri oxumağa imkan verən xidmətlərdən biridir.",
        bloomLevel: "Anlama"
      },
      {
        id: "www-q3",
        question: "Brauzerlə server arasında veb səhifələrin ötürülməsini təmin edən əsas rabitə protokolu hansıdır?",
        options: [
          { id: "A", text: "HTTP / HTTPS" },
          { id: "B", text: "MP3" },
          { id: "C", text: "JPEG" },
          { id: "D", text: "PDF" }
        ],
        correctOption: "A",
        explanation: "HTTP (Hypertext Transfer Protocol) və onun təhlükəsiz şifrələnmiş variantı olan HTTPS veb səhifələrin ötürülməsi üçün əsas rabitə protokoludur.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "haber-bosch-ammonia-synthesis",
    slug: "haber-bosch-process-ammonia-synthesis-nobel",
    category: "kimya",
    isNobel: true,
    nobelPrize: {
      year: 1918,
      category: "Kimya",
      laureates: ["Fritz Haber"],
      citation: "Elementlərdən amonyakın sintezinə görə"
    },
    discoveryYear: 1909,
    discoverer: "Frits Haber və Karl Boş (Fritz Haber & Carl Bosch)",
    curriculumSubject: "Kimya",
    curriculumGrade: "9-10-cu sinif",
    curriculumTopic: "Azot yarımqrupu, amonyak sintezi, kimyəvi tarazlıq və Le Şatelye prinsipi",
    icon: "Wheat",
    accentColor: "from-amber-600 to-yellow-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Haber-Boş Prosesi: Havadan Çörək Yaradan Kimya",
        summary: "Atmosferdəki passiv azotu tutaraq kənd təsərrüfatı gübrələrinə çevirən və planetdə 4 milyard insanın həyatını təmin edən sintez.",
        ahaMoment: "20-ci əsrin əvvəlində alimlər xəbərdarlıq edirdilər ki, torpaqda azot ehtiyatları tükənir və tezliklə qlobal aclıq başlayacaq. Havanın 78%-i azot olsa da, iki azot atomu arasındakı üçqat kovalent rabitə (N≡N) o qədər möhkəmdir ki, onu heç bir adi reaksiya qıra bilmirdi. Frits Haber 200 atmosfer təzyiq və 450°C-də dəmir katalizatoru ilə azotu hidrogenlə birləşdirib amonyak (NH3) almağı bacardı!",
        howItWorks: "Reaksiya ekzotermik və həcmin azalması ilə gedir: N₂ + 3H₂ ⇌ 2NH₃ + Q. Le Şatelye prinsipinə görə tarazlığı sağa – amonyakın alınması tərəfinə yönəltmək üçün yüksək təzyiq (150-250 atm) tətbiq olunur, reaksiya sürətini artırmaq üçün isə dəmir katalizatorundan istifadə edilir.",
        realWorldImpact: "Mineral azot gübrələri (amonyak şorası, karbamid). Bu gün dünya əhalisinin qidalanmasının təxminən 50%-i Haber-Boş gübrələri sayəsində təmin olunur.",
        curriculumConnection: "9-cu sinif Kimyada 'Azot və onun birləşmələri', 10-cu sinifdə 'Dönər kimyəvi reaksiyalar və kimyəvi tarazlığın yerdəyişməsi (Le Şatelye prinsipi)' mövzuları.",
        funFacts: [
          "Bu gün insan bədənindəki bütün zülalların tərkibindəki azot atomlarının demək olar ki, yarısı nə vaxtsa bir Haber-Boş zavodunun reaktorundan keçmişdir."
        ]
      },
      en: {
        title: "The Haber-Bosch Process: Synthesizing Bread from Air",
        summary: "Fixing atmospheric nitrogen into ammonia fertilizers to sustain half of the world's population (1918 Nobel Prize).",
        ahaMoment: "Haber cleaved the nearly unbreakable nitrogen triple bond (N≡N) at high pressure over an iron catalyst.",
        howItWorks: "N2(g) + 3H2(g) ⇌ 2NH3(g) (exothermic). Governed by Le Chatelier's principle: high pressures shift equilibrium toward fewer gas moles.",
        realWorldImpact: "Synthetic nitrogen fertilizers feed approximately 4 billion people globally today.",
        curriculumConnection: "Chemical equilibrium, Le Chatelier's principle, reaction thermodynamics, and industrial catalysis.",
        funFacts: [
          "Nearly 50% of the nitrogen atoms in human tissue originated in Haber-Bosch synthesis reactors."
        ]
      },
      tr: {
        title: "Haber-Bosch Yöntemi ve Amonyak Sentezi",
        summary: "Havadaki azottan ekmek üreten kimya: 4 milyar insanın gıdasını sağlayan gübre devrimi ve 1918 Nobel Kimya Ödülü.",
        ahaMoment: "Kırılması neredeyse imkansız olan azot üçlü bağını yüksek basınç ve demir katalizörle kırarak amonyağa dönüştürdü.",
        howItWorks: "N2 + 3H2 ⇌ 2NH3 tepkimesinde Le Chatelier ilkesine göre yüksek basınç dengeyi ürünler yönüne kaydırır.",
        realWorldImpact: "Kimyasal gübre sanayisi, küresel tarım verimliliği ve nüfus artışının beslenmesi.",
        curriculumConnection: "Kimyasal denge, Le Chatelier prensibi, tepkime hızı ve azot bileşikleri müfredatıyla örtüşür.",
        funFacts: [
          "Vücudumuzdaki proteinlerde bulunan azot atomlarının yaklaşık yarısı bir Haber-Bosch fabrikasından geçmiştir."
        ]
      },
      ru: {
        title: "Процесс Габера-Боша: синтез аммиака",
        summary: "Связывание атмосферного азота в минеральные удобрения, спасшее человечество от голода (Нобелевская премия по химии 1918).",
        ahaMoment: "Габер сумел разорвать прочнейшую тройную связь молекулы N2 с помощью высокого давления (200 атм) и железного катализатора.",
        howItWorks: "Реакция N₂ + 3H₂ ⇌ 2NH₃ + Q подчиняется принципу Ле Шателье: повышение давления смещает равновесие в сторону меньшего объема.",
        realWorldImpact: "Производство азотных удобрений, обеспечивающих продовольствием почти половину населения планеты.",
        curriculumConnection: "Школьная химия 9-10 классов: химическое равновесие, принцип Ле Шателье, свойства азота и аммиака.",
        funFacts: [
          "Около половины атомов азота в белках тела каждого из нас были синтезированы на заводах по методу Габера-Боша."
        ]
      }
    },
    quiz: [
      {
        id: "hab-q1",
        question: "Amonyak sintezi reaksiyasında (N₂ + 3H₂ ⇌ 2NH₃ + Q) təzyiqi artırdıqda kimyəvi tarazlıq hansı istiqamətə yönələr?",
        options: [
          { id: "A", text: "Sağa – amonyakın əmələ gəlməsi tərəfinə (həcmin azalması istiqamətinə)" },
          { id: "B", text: "Sola – ilkin qazların parçalanması tərəfinə" },
          { id: "C", text: "Tarazlıq heç dəyişməz" },
          { id: "D", text: "Qazlar dərhal bərkiyər" }
        ],
        correctOption: "A",
        explanation: "Le Şatelye prinsipinə görə təzyiq artdıqda tarazlıq qaz maddələrinin molları sayının (həcminin) az olduğu tərəfə yönəlir (solda 4 mol qaz, sağda 2 mol qaz var).",
        bloomLevel: "Tətbiq"
      },
      {
        id: "hab-q2",
        question: "Azot molekulunun (N₂) adi şəraitdə kimyəvi cəhətdən çox passiv olmasının əsas səbəbi nədir?",
        options: [
          { id: "A", text: "İki azot atomu arasında çox möhkəm üçqat kovalent rabitənin olması (N≡N)" },
          { id: "B", text: "Azotun radioaktiv olması" },
          { id: "C", text: "Azotun yalnız maye halda mövcud olması" },
          { id: "D", text: "Molekulun kütləsinin çox böyük olması" }
        ],
        correctOption: "A",
        explanation: "Azot atomları arasındakı üçqat rabitənin qırılma enerjisi çox yüksəkdir (945 kC/mol), ona görə də azot adi şəraitdə reaksiyaya girmir.",
        bloomLevel: "Anlama"
      },
      {
        id: "hab-q3",
        question: "Haber-Boş prosesi vasitəsilə alınan amonyak sənayedə ən çox hansı məqsədlə istifadə olunur?",
        options: [
          { id: "A", text: "Mineral azot gübrələrinin (şora, karbamid) istehsalı üçün" },
          { id: "B", text: "Avtomobillərdə benzin əvəzi kimi" },
          { id: "C", text: "Şokolad hazırlanması üçün" },
          { id: "D", text: "Plastik qabların yuyulması üçün" }
        ],
        correctOption: "A",
        explanation: "Sintez olunan amonyakın 80%-dən çoxu kənd təsərrüfatı məhsuldarlığını artıran mineral azot gübrələrinin istehsalına yönəldilir.",
        bloomLevel: "Bilik"
      }
    ]
  },
  {
    id: "edwin-hubble-expanding-universe",
    slug: "edwin-hubble-expanding-universe-redshift-law",
    category: "fizika",
    isNobel: false,
    discoveryYear: 1929,
    discoverer: "Edvin Habbl (Edwin Hubble)",
    curriculumSubject: "Fizika / Astronomiya",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Kainatın genişlənməsi, Dopler effekti, spektral qırmızıya sürüşmə və Habbl qanunu",
    icon: "Sparkles",
    accentColor: "from-purple-800 to-indigo-950",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Edvin Habbl və Kainatın Genişlənməsi: Böyük Partlayışın İzi",
        summary: "Qalaktikaların bir-birindən uzaqlaşdığını sübut edən qırmızıya sürüşmə və statik deyil, daim böyüyən Kainat.",
        ahaMoment: "Eynşteyn də daxil olmaqla bütün dünya alimləri Kainatın əbədi və dəyişməz (statik) olduğuna inanırdılar. 1929-cu ildə Edvin Habbl Kaliforniyadakı nəhəng Maunt-Vilson teleskopu ilə uzaq qalaktikaların işıq spektrlərini tədqiq edərkən heyrətamiz qanunauyğunluq aşkar etdi: demək olar ki, bütün qalaktikaların spektral xətləri qırmızı rəng tərəfə sürüşmüşdü və qalaktika nə qədər uzaqdadırsa, bizdən bir o qədər sürətlə qaçır!",
        howItWorks: "İşıq mənbəyi müşahidəçidən uzaqlaşdıqda Dopler effekti nəticəsində dalğa uzunluğu uzanır (qırmızıya sürüşmə, z). Habbl qanununa görə qalaktikanın uzaqlaşma sürəti məsafə ilə düz mütənasibdir: v = H₀ * d. Bu o deməkdir ki, Kainat parça kimi şişir və keçmişə qayıtsaq, hər şey 13.8 milyard il əvvəl tək bir nöqtədən – Böyük Partlayışdan (Big Bang) başlamışdır.",
        realWorldImpact: "Müasir kosmologiyanın, Böyük Partlayış nəzəriyyəsinin əsası və Habbl kosmik teleskopu.",
        curriculumConnection: "11-ci sinif Fizika və Astronomiyada 'Dopler effekti', 'Qırmızıya sürüşmə', 'Kainatın təkamülü və Habbl sabiti (H₀)' mövzuları.",
        funFacts: [
          "Eynşteyn Kainatın genişlənməsinə inanmadığı üçün tənliklərinə 'kosmoloji sabit' əlavə etmişdi; Habblın kəşfindən sonra Eynşteyn bunu 'həyatımın ən böyük səhvi' adlandırdı."
        ]
      },
      en: {
        title: "Edwin Hubble: The Expanding Universe",
        summary: "Measuring galactic redshift to prove galaxies are flying apart, confirming the Big Bang origin of the cosmos.",
        ahaMoment: "Observing Cepheid variables in distant nebulae proved galaxies exist beyond the Milky Way and are receding at speeds proportional to distance.",
        howItWorks: "Cosmological redshift stretches light wavelengths via expanding spacetime metric: Hubble's Law v = H0 * d.",
        realWorldImpact: "Established observational cosmology, Big Bang cosmology, and the cosmic age of the universe (13.8 billion years).",
        curriculumConnection: "Doppler redshift, wave mechanics, cosmological expansion, and astrophysical distance measurements.",
        funFacts: [
          "Einstein called his static-universe cosmological constant the 'biggest blunder of my life' after visiting Hubble's observatory."
        ]
      },
      tr: {
        title: "Edwin Hubble ve Genişleyen Evren",
        summary: "Kızıla kayma ile galaksilerin birbirinden uzaklaştığını ve Büyük Patlama'yı kanıtlayan devrim.",
        ahaMoment: "Uzak galaksilerin spektrumundaki çizgilerin kırmızıya kaydığını ve mesafe arttıkça uzaklaşma hızının arttığını keşfetti.",
        howItWorks: "Hubble yasası v = H0 * d: uzay-zamanın genişlemesi nedeniyle uzak cisimlerin ışığı daha uzun dalga boyuna (kızıla) kayar.",
        realWorldImpact: "Büyük Patlama (Big Bang) teorisinin doğrulanması ve modern kozmolojinin kuruluşu.",
        curriculumConnection: "Fizikte Doppler etkisi, dalga boyu değişimi ve evrenin evrimi kazanımlarıyla tam uyumludur.",
        funFacts: [
          "Einstein durağan evrene inandığı için denklemlerine eklediği sabiti 'hayatımın en büyük hatası' olarak nitelendirmiştir."
        ]
      },
      ru: {
        title: "Эдвин Хаббл и расширение Вселенной",
        summary: "Красное смещение в спектрах галактик, доказавшее динамичность космоса и теорию Большого взрыва.",
        ahaMoment: "Хаббл обнаружил, что линии поглощения далеких галактик смещены в красную сторону спектра пропорционально расстоянию.",
        howItWorks: "Закон Хаббла v = H₀ * d: расширение самого пространства-времени растягивает проходящие световые волны.",
        realWorldImpact: "Создание современной космологии, оценка возраста Вселенной (13.8 млрд лет) и телескоп «Хаббл».",
        curriculumConnection: "Школьный курс: эффект Доплера, спектральный анализ, закон Хаббла, строение Вселенной.",
        funFacts: [
          "После встречи с Хабблом Эйнштейн признал введение космологической постоянной «величайшей ошибкой своей жизни»."
        ]
      }
    },
    quiz: [
      {
        id: "hub-q1",
        question: "Uzaq qalaktikalardan gələn işığın 'qırmızıya sürüşməsi' nəyi göstərir?",
        options: [
          { id: "A", text: "Qalaktikanın bizdən böyük sürətlə uzaqlaşdığını" },
          { id: "B", text: "Qalaktikanın bizə doğru yaxınlaşdığını" },
          { id: "C", text: "Qalaktikanın daxilində yanğın olduğunu" },
          { id: "D", text: "Ulduzların yalnız qırmızı dəmirdən ibarət olduğunu" }
        ],
        correctOption: "A",
        explanation: "Dopler effektinə görə işıq mənbəyi uzaqlaşdıqda dalğa uzunluğu uzanır və spektrin qırmızı tərəfinə meyl edir.",
        bloomLevel: "Anlama"
      },
      {
        id: "hub-q2",
        question: "Habbl qanununa (v = H₀ * d) görə qalaktika bizdən 2 dəfə uzaqdırsa, onun uzaqlaşma sürəti necə fərqlənir?",
        options: [
          { id: "A", text: "Bizdən 2 dəfə daha böyük sürətlə uzaqlaşır" },
          { id: "B", text: "Sürəti 2 dəfə az olur" },
          { id: "C", text: "Sürəti sıfıra bərabər olur" },
          { id: "D", text: "Sürət məsafədən qətiyyən asılı deyil" }
        ],
        correctOption: "A",
        explanation: "Habbl qanununda sürət məsafə ilə düz mütənasibdir (v ~ d). Məsafə 2 dəfə artarsa, uzaqlaşma sürəti də 2 dəfə artar.",
        bloomLevel: "Tətbiq"
      },
      {
        id: "hub-q3",
        question: "Kainatın genişlənməsinin kəşfi hansı fundamental kosmologiya nəzəriyyəsini sübut etdi?",
        options: [
          { id: "A", text: "Böyük Partlayış (Big Bang) nəzəriyyəsini" },
          { id: "B", text: "Geosentrik sistemi" },
          { id: "C", text: "Əbədi dəyişməz statik kainat modelini" },
          { id: "D", text: "Pifaqor nəzəriyyəsini" }
        ],
        correctOption: "A",
        explanation: "Kainat genişlənirsə, deməli, keçmişdə bütün maddə sıx və qaynar tək bir nöqtədə toplanmışdı (Böyük Partlayış modeli).",
        bloomLevel: "Bilik"
      }
    ]
  }
]
