import { ScientificDiscovery } from "@/lib/discoveries-types"

export const NOBEL_DISCOVERIES: ScientificDiscovery[] = [
  {
    id: "alphafold-protein-ai",
    slug: "alphafold-protein-structure-prediction-ai",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2024,
      category: "Kimya",
      laureates: ["Demis Hassabis", "John Jumper", "David Baker"],
      citation: "Hesablama zülal dizaynı və zülalların 3D strukturunun süni intellektlə proqnozlaşdırılmasına görə"
    },
    discoveryYear: 2020,
    discoverer: "Demis Hassabis, John Jumper (Google DeepMind) və David Baker",
    curriculumSubject: "Biologiya / Kimya",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Zülalların biosintezi, birincili və fəza (üçüncülü) quruluşu",
    icon: "Dna",
    accentColor: "from-amber-500 to-rose-600",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "AlphaFold və Zülalların Fəza Quruluşunun Süni İntellektlə Həlli",
        summary: "Biologiyanın 50 illik ən böyük tapmacası – amin turşusu ardıcıllığından zülalın mürəkkəb 3D fəza strukturunu bir neçə dəqiqəyə 99% dəqiqliklə tapan süni intellekt inqilabı.",
        ahaMoment: "1972-ci ildə kimya üzrə Nobel laureatı Kristian Anfinsen bəyan etmişdi ki, zülalın bütün 3D forması onun amin turşusu ardıcıllığında gizlidir. Lakin 50 il ərzində rentgen-struktur analizi ilə bircə zülalın formasını tapmaq üçün alimlər illər və yüz minlərlə dollar xərcləyirdilər. 2020-ci ildə CASP14 yarışmasında DeepMind komandasının AlphaFold2 modeli elan ediləndə biologiya tarixində yeni dövr başladı.",
        howItWorks: "AlphaFold konvolyusiya və xüsusi 'Evoformer' transformator arxitekturasından istifadə edərək təkamül boyu qorunub saxlanmış amin turşusu cütlərinin fəza məsafələrini və bucaqlarını eyni vaxtda hesablayır. Zülalların qatlanmasında hidrofob rabitələr, hidrogen rabitələri və disulfid körpüləri nəzərə alınaraq 200 milyondan çox zülalın dəqiq 3D modeli yaradılmışdır.",
        realWorldImpact: "Yeni dərman preparatlarının dizaynı 10 ildən bir neçə aya endirildi; plastik tullantıları parçalayan mutant fermentlər modelləşdirildi və xərçəng hüceyrələrinin reseptorları atom səviyyəsində öyrənildi.",
        curriculumConnection: "9-10-cu sinif Biologiya dərsliyində 'Zülalların quruluşu və funksiyaları' mövzusunda öyrənilən birincili (peptid rabitə), ikincili (spiral/qatlı), üçüncülü (qlobula) və dördüncülü strukturlar AlphaFold-un əsas iş bazasıdır. İmtahanlarda zülalın denaturasiyası və fəza konfiqurasiyası sualları birbaşa bu mexanizmlə əlaqəlidir.",
        funFacts: [
          "Təbiətdəki məlum olan təxminən bütün 200 milyon zülalın 3D strukturu artıq pulsuz açıq bazaya (AlphaFold DB) yerləşdirilib.",
          "Əvvəllər bir zülal strukturunu təyin etmək üçün Ph.D tələbəsi 4-5 il vaxt sərf edirdi; AlphaFold bunu bir neçə dəqiqəyə yerinə yetirir.",
          "2024-cü ildə Nobel Komitəsi kompüter elmləri və süni intellekt sahəsini birbaşa Kimya Nobel Mükafatı ilə təltif edərək tarixi presedent yaratdı."
        ]
      },
      en: {
        title: "AlphaFold and AI-Driven Protein 3D Structure Prediction",
        summary: "Solving biology's 50-year-old grand challenge: predicting the 3D atomic structure of proteins directly from amino acid sequences in minutes using deep neural networks.",
        ahaMoment: "Christian Anfinsen postulated in 1972 that amino acid sequence dictates 3D conformation. For 50 years, experimental crystallography took years per protein. In 2020, AlphaFold solved the folding problem at atomic accuracy.",
        howItWorks: "AlphaFold pairs evolutionary conservation data across homologous species with spatial attention transformers (Evoformer) to iteratively refine residue coordinate geometry.",
        realWorldImpact: "Accelerates targeted drug discovery, enables rational enzyme design for plastic recycling, and resolves disease-causing protein misfolding anomalies.",
        curriculumConnection: "Directly relates to Secondary Biology curricula covering primary peptide chains, secondary alpha-helices, and tertiary globular protein conformations.",
        funFacts: [
          "AlphaFold predicted the 3D structures of nearly all 200 million cataloged proteins across living species.",
          "Awarded the 2024 Nobel Prize in Chemistry to Demis Hassabis, John Jumper, and David Baker."
        ]
      },
      tr: {
        title: "AlphaFold ve Yapay Zeka ile Protein Yapısı Tahmini",
        summary: "Biyolojinin 50 yıllık protein katlanma probleminin yapay zeka ile çözülmesi ve 2024 Nobel Kimya Ödülü.",
        ahaMoment: "Amino asit diziliminden 3 boyutlu atomik yapıyı çözmek eskiden yıllar alırken, AlphaFold bunu dakikalar içinde başardı.",
        howItWorks: "Evoformer mimarisi ve evrimsel dizilim korelasyonları ile amino asit çiftleri arasındaki mesafe matrislerini optimize eder.",
        realWorldImpact: "Kişiselleştirilmiş tıp, kanser tedavisi ve plastik parçalayan enzimlerin sentezinde devrim yarattı.",
        curriculumConnection: "Ortaöğretim Biyoloji derslerindeki proteinlerin birincil, ikincil ve üçüncül yapısı kazanımlarıyla doğrudan bağlantılıdır.",
        funFacts: [
          "200 milyondan fazla protein yapısı artık tüm insanlığın araştırmalarına ücretsiz olarak açıktır."
        ]
      },
      ru: {
        title: "AlphaFold: революция ИИ в предсказании 3D-структуры белков",
        summary: "Решение 50-летней биологической загадки сворачивания белков с помощью искусственного интеллекта (Нобелевская премия по химии 2024).",
        ahaMoment: "Рентгеноструктурный анализ одного белка занимал годы труда ученых. AlphaFold научился моделировать конформацию за минуты.",
        howItWorks: "Нейросеть Evoformer анализирует эволюционные сопряжения аминокислот и предсказывает пространственные координаты атомов.",
        realWorldImpact: "Ускорение разработки лекарств от рака, создание искусственных ферментов для экологии и понимание генетических мутаций.",
        curriculumConnection: "Связано с курсом биологии 9-10 классов: первичная, вторичная и третичная структуры белковых молекул.",
        funFacts: [
          "База данных AlphaFold содержит 3D-модели практически всех известных науке белков биосферы."
        ]
      }
    },
    quiz: [
      {
        id: "af-q1",
        question: "Zülalın fəza (üçüncülü) quruluşunu əsasən müəyyən edən başlıca amil nədir?",
        options: [
          { id: "A", text: "Hüceyrə qılafının qalınlığı və xarici temperatur" },
          { id: "B", text: "Polipeptid zəncirindəki amin turşularının növü və ardıcıllığı" },
          { id: "C", text: "Yalnız hüceyrə daxilindəki suyun osmotik təzyiqi" },
          { id: "D", text: "Zülalın sintez edildiyi ribosomun fiziki ölçüsü" }
        ],
        correctOption: "B",
        explanation: "Zülalların fəza quruluşu polipeptid zəncirindəki amin turşusu qalıqlarının təbiəti (hidrofob, hidrofil, yüklü qruplar) və onların ardıcıllığı ilə müəyyən olunur (Anfinsen hipotezi).",
        bloomLevel: "Anlama"
      },
      {
        id: "af-q2",
        question: "AlphaFold sisteminin ən böyük elmi nailiyyəti hansı alternativdə düzgün göstərilmişdir?",
        options: [
          { id: "A", text: "Hüceyrələrdə DNT replikasiyasını tam dayandırması" },
          { id: "B", text: "Zülalın 3D konfiqurasiyasını amin turşusu ardıcıllığından yüksək dəqiqliklə modelləşdirməsi" },
          { id: "C", text: "Bütün virusları kimyəvi yolla bir saniyədə məhv etməsi" },
          { id: "D", text: "Ribosomların hüceyrədən kənarda fotosintez aparmasını təmin etməsi" }
        ],
        correctOption: "B",
        explanation: "AlphaFold 50 illik 'protein folding' problemini həll edərək amin turşusu ardıcıllığından atom dəqiqliyi ilə 3D konfiqurasiyanı proqnozlaşdırmışdır.",
        bloomLevel: "Bilik"
      },
      {
        id: "af-q3",
        question: "Zülalın denaturasiyası zamanı adətən hansı quruluş səviyyəsi toxunulmaz qalır?",
        options: [
          { id: "A", text: "Yalnız dördüncülü struktur" },
          { id: "B", text: "Yalnız üçüncülü qlobulyar forma" },
          { id: "C", text: "Birincili struktur (peptid rabitələri)" },
          { id: "D", text: "İkincili spiral struktur" }
        ],
        correctOption: "C",
        explanation: "Denaturasiya zamanı zəif hidrogen, hidrofob və ion rabitələri qırılaraq 2-ci, 3-cü və 4-cü strukturlar dağılır, lakin güclü kovalent peptid rabitələri (birincili struktur) saxlanılır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "neural-networks-physics",
    slug: "artificial-neural-networks-hopfield-hinton-physics-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2024,
      category: "Fizika",
      laureates: ["John J. Hopfield", "Geoffrey E. Hinton"],
      citation: "Süni neyron şəbəkələri ilə maşın öyrənməsini təmin edən fundamental kəşf və ixtiralara görə"
    },
    discoveryYear: 1982,
    discoverer: "John Hopfield və Geoffrey Hinton",
    curriculumSubject: "Fizika / İnformatika",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Statistik fizika, maqnetizm (spin sistemləri), alqoritmlər və maşın öyrənməsi",
    icon: "BrainCircuit",
    accentColor: "from-blue-600 to-violet-700",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "Süni Neyron Şəbəkələri və Statistik Fizika (Hopfield və Hinton)",
        summary: "Fizikanın maqnit spin sistemləri və statistik termodinamika qanunları əsasında müasir süni intellektin, dərin öyrənmənin (Deep Learning) bünövrəsinin qoyulması.",
        ahaMoment: "Con Hopfild atomların maqnit spinlərinin bir-birinə təsirini təsvir edən İzinq modelini araşdırarkən kəşf etdi ki, neyronların oyanma və tormozlanma vəziyyətləri də eynilə maqnit spinləri kimi minimum enerji nöqtəsinə doğru hərəkət edir. Ceffri Hinton isə Lüdviq Bolsmanın statistik paylanma düsturunu neyron şəbəkələrinə tətbiq edərək 'Bolsman maşını'nı yaratdı.",
        howItWorks: "Hopfild şəbəkəsi assosiativ yaddaş kimi işləyir: ona natamam və ya küyə məruz qalmış şəkil veriləndə sistem enerji landşaftında ən yaxın minimuma enərək yadda saxlanmış orijinal obrazı bərpa edir. Hintonun tətbiq etdiyi əks-yayılma (backpropagation) və ehtimal paylanması isə şəbəkəyə verilənlərdəki gizli qanunauyğunluqları aşkar etməyə imkan verir.",
        realWorldImpact: "Bugünkü ChatGPT, avtonom idarəolunan avtomobillər, təsvirlərin tanınması və səs köməkçilərinin riyazi və fiziki təməli məhz bu kəşflərə söykənir.",
        curriculumConnection: "10-11-ci sinif Fizikada 'Maddənin maqnit xassələri', 'Sistemin daxili enerjisi və dayanıqlı tarazlıq halı', İnformatikada isə 'Qraf strukturları, neyron modelləri və alqoritmlər' mövzularına tam inteqrasiya olunur.",
        funFacts: [
          "Kompüter elmləri üzrə çalışan iki alimə Fizika üzrə Nobel mükafatı verilməsi elmlərarası inteqrasiyanın ən parlaq nümunəsi oldu.",
          "Hopfild şəbəkəsinin riyaziyyatı ilə soyuyan ferromaqnitin kristallik nizamı tam eyni tənliklərlə təsvir olunur.",
          "Ceffri Hinton Corc Bulun (Bul cəbrinin banisi) kötücəsidir."
        ]
      },
      en: {
        title: "Artificial Neural Networks and Statistical Physics (Hopfield & Hinton)",
        summary: "How atomic spin physics and Boltzmann statistical thermodynamics laid the foundation for modern machine learning, earning the 2024 Nobel Prize in Physics.",
        ahaMoment: "Hopfield realized that collections of neurons seeking associative memory behave identically to physical particles relaxing into minimum energy states.",
        howItWorks: "Associative memory networks navigate complex multidimensional energy landscapes to reconstruct clean patterns from corrupted input data.",
        realWorldImpact: "Powers contemporary generative AI, computer vision, natural language transformers, and real-time medical imaging diagnostics.",
        curriculumConnection: "Directly bridges secondary physics topics of potential energy minimization and magnetic spin orientations with computer science network architectures.",
        funFacts: [
          "Physics principles like the Ising model directly inspired the architectures powering modern Large Language Models.",
          "Hinton is the great-great-grandson of mathematician George Boole, founder of Boolean logic."
        ]
      },
      tr: {
        title: "Yapay Sinir Ağları ve İstatiksel Fizik (Hopfield ve Hinton)",
        summary: "Atomik spin fiziği ve Boltzmann dağılımının modern makine öğreniminin temeline dönüşmesi ve 2024 Nobel Fizik Ödülü.",
        ahaMoment: "Manyetik spinlerin enerjiyi minimize etme davranışı ile insan beynindeki çağrışımsal hafıza mekanizmasının eşleştiği anlaşıldı.",
        howItWorks: "Ağ, eksik veya bozuk girdi aldığında enerji peyzajındaki en yakın çukura inerek orijinal veriyi hatırlar.",
        realWorldImpact: "ChatGPT, otonom araçlar ve yüz tanıma sistemleri dahil tüm derin öğrenme devriminin teorik omurgasıdır.",
        curriculumConnection: "Fizikteki kararlı denge ve potansiyel enerji minimumu ile bilişimdeki yapay zeka modelleri arasında köprü kurar.",
        funFacts: [
          "Bilgisayar bilimcilerine Fizik Nobeli verilmesi bilim dünyasında tarihi bir disiplinlerarası başarı olarak kayıtlara geçti."
        ]
      },
      ru: {
        title: "Искусственные нейросети и статистическая физика (Хопфилд и Хинтон)",
        summary: "Как статистическая термодинамика и физика спиновых стекол создали фундамент современного глубокого обучения (Нобелевская премия по физике 2024).",
        ahaMoment: "Хопфилд объединил модель Изинга для ферромагнетиков с принципом ассоциативной памяти биологических нейронов.",
        howItWorks: "Сеть находит глобальные и локальные минимумы энергетической функции, восстанавливая зашумленные образы и паттерны.",
        realWorldImpact: "Фундамент всех современных больших языковых моделей (LLM), компьютерного зрения и систем распознавания речи.",
        curriculumConnection: "Школьная физика: принцип минимума потенциальной энергии, устойчивое равновесие, намагничивание тел.",
        funFacts: [
          "Джеффри Хинтон — праправнук Джорджа Буля, создателя булевой алгебры."
        ]
      }
    },
    quiz: [
      {
        id: "nn-q1",
        question: "Hopfild şəbəkəsi natamam bir şəkli bərpa edərkən hansı fiziki prinsipə əsaslanır?",
        options: [
          { id: "A", text: "Kinetik enerjinin maksimuma çatdırılmasına" },
          { id: "B", text: "Sistemin enerji funksiyasının lokal və ya qlobal minimumuna enməsinə" },
          { id: "C", text: "Havanın rütubətinin dəyişməsinə" },
          { id: "D", text: "Optik şüaların sınma bucağının artmasına" }
        ],
        correctOption: "B",
        explanation: "Fiziki sistemlər təbii olaraq dayanıqlı tarazlıq halına – minimum enerji vəziyyətinə can atır. Hopfild şəbəkəsi də hər addımda enerjini azaldaraq ən yaxın yadda saxlanmış obraza çatır.",
        bloomLevel: "Anlama"
      },
      {
        id: "nn-q2",
        question: "2024-cü il Fizika üzrə Nobel mükafatı hansı iki alimə verilmişdir?",
        options: [
          { id: "A", text: "Albert Eynşteyn və Nils Bor" },
          { id: "B", text: "Con Hopfild və Ceffri Hinton" },
          { id: "C", text: "Stiven Hokinq və Rocer Penrouz" },
          { id: "D", text: "Ceyms Uatson və Frensis Krik" }
        ],
        correctOption: "B",
        explanation: "2024-cü il Fizika üzrə Nobel mükafatı süni neyron şəbəkələrinin əsasını qoyan Con Hopfild və Ceffri Hintona verilmişdir.",
        bloomLevel: "Bilik"
      },
      {
        id: "nn-q3",
        question: "Ceffri Hintonun yaratdığı 'Bolsman maşını' fizikanın hansı sahəsindən bəhrələnmişdir?",
        options: [
          { id: "A", text: "Statistik termodinamika və ehtimal paylanması" },
          { id: "B", text: "Arximed qanunu və hidrostatika" },
          { id: "C", text: "Geometrik optika və linzalar" },
          { id: "D", text: "Nyutonun birinci hərəkət qanunu" }
        ],
        correctOption: "A",
        explanation: "Hinton Lüdviq Bolsmanın statistik fizikasındakı termal dalğalanmalar və ehtimal paylanması qanunlarını neyron düyünlərinə tətbiq etmişdir.",
        bloomLevel: "Təhlil"
      }
    ]
  },
  {
    id: "microrna-gene-regulation",
    slug: "microrna-post-transcriptional-gene-regulation-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2024,
      category: "Fiziologiya və ya Tibb",
      laureates: ["Victor Ambros", "Gary Ruvkun"],
      citation: "MikroRNT-nin və onun transkripsiyadan sonrakı gen tənzimlənməsindəki rolunun kəşfinə görə"
    },
    discoveryYear: 1993,
    discoverer: "Victor Ambros və Gary Ruvkun",
    curriculumSubject: "Biologiya",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Genetik kod, RNT növləri, genlərin ekspressiyası və tənzimlənməsi",
    icon: "Microscope",
    accentColor: "from-emerald-500 to-teal-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "MikroRNT (microRNA) və Genlərin Fəaliyyətinin Gizli Sükanı",
        summary: "Bədənimizdəki hər hüceyrə eyni DNT-yə malik olduğu halda niyə əzələ, sinir və dəri hüceyrələrimiz fərqlidir? Genləri söndürüb-yandıran mikroskopik tənzimləyici molekulların kəşfi.",
        ahaMoment: "Alimlər onilliklər boyu inanırdılar ki, genlərin tənzimlənməsi yalnız DNT-yə bağlanan böyük zülallarla (transkripsiya faktorları) baş verir. 1993-cü ildə Viktori Ambros və Qari Ruvkun mikroskopik C. elegans qurdu üzərində işləyərkən lin-4 adlı heç bir zülal kodlaşdırmayan cəmi 22 nukleotidlik kiçik bir RNT parçası aşkar etdilər. Bu kiçik molekul başqa bir genin mRNT-sinə yapışaraq onun zülala çevrilməsinin qarşısını alırdı.",
        howItWorks: "MikroRNT-lər (miRNA) hüceyrə nüvəsində transkripsiya olunur, Dicer fermenti tərəfindən qısaldılır və RISC kompleksinə birləşir. RISC hədəf mRNT-nin komplementar hissəsinə bağlanaraq ya onu parçalayır, ya da ribosomda translasiyanı dayandırır. Beləliklə, gen transkripsiya olunsa belə, lazımsız zülalın istehsalı bloklanır.",
        realWorldImpact: "Xərçəng hüceyrələrində mikroRNT balansının pozulduğu aşkar edilmişdir. İndi mikroRNT biomarker kimi xərçəngin ilkin diaqnostikasında və gen terapiyasında inqilabi hədəfdir.",
        curriculumConnection: "10-cu sinif Biologiya dərsliyində 'Genetik məlumatın ötürülməsi', 'Transkripsiya və Translasiya' mövzularına birbaşa aiddir. İmtahanlarda gen ekspressiyası və RNT növləri (mRNT, nRNT, tRNT) suallarının dərin elmi davamıdır.",
        funFacts: [
          "İnsan orqanizmində 1000-dən çox müxtəlif mikroRNT növü var və onlar genlərimizin 60%-dən çoxunun fəaliyyətinə nəzarət edir.",
          "İlk kəşf edildikdə digər alimlər bunu 'yalnız mikroskopik qurdların qəribə xüsusiyyəti' hesab etmişdilər; 7 il sonra insanın da eyni mexanizmlə işlədiyi sübut olundu."
        ]
      },
      en: {
        title: "microRNA and Post-Transcriptional Gene Regulation",
        summary: "The discovery of tiny RNA molecules governing how genes are switched on and off in multicellular life (2024 Nobel Prize in Physiology or Medicine).",
        ahaMoment: "Ambros and Ruvkun discovered that lin-4 produced not a protein, but an ultra-short non-coding RNA that silenced target messenger RNAs.",
        howItWorks: "miRNAs integrate into the RISC complex and bind complementarily to target mRNAs, either degrading them or preventing translation.",
        realWorldImpact: "Crucial for cancer biomarker diagnostics, cardiovascular research, and novel oligonucleotide-based therapeutics.",
        curriculumConnection: "Deepens high school biology lessons on genetic code, protein synthesis, and transcriptional regulation.",
        funFacts: [
          "Controls more than 60% of all protein-coding genes in the human genome."
        ]
      },
      tr: {
        title: "mikroRNA ve Gen İfadesinin Post-Transkripsiyonel Düzenlenmesi",
        summary: "Hücrelerin genleri nasıl susturduğunu açıklayan minik RNA moleküllerinin keşfi ve 2024 Nobel Tıp Ödülü.",
        ahaMoment: "Protein kodlamayan sadece 22 nükleotidlik bir RNA parçasının hedef mRNA'yı susturabildiğinin ilk kez C. elegans'ta kanıtlanması.",
        howItWorks: "Dicer ve RISC kompleksi ile hedef mesajcı RNA'ya bağlanarak protein sentezini bloke eder.",
        realWorldImpact: "Kanser erken teşhisinde biyobelirteçler ve genetik tedavi protokolleri.",
        curriculumConnection: "Lise Biyoloji müfredatındaki transkripsiyon, translasyon ve gen düzenleme konularıyla doğrudan ilgilidir.",
        funFacts: [
          "İnsan genomundaki genlerin yarısından fazlası mikroRNA'lar tarafından regüle edilmektedir."
        ]
      },
      ru: {
        title: "МикроРНК и посттранскрипционная регуляция генов",
        summary: "Открытие крошечных молекул РНК, контролирующих работу генов у многоклеточных организмов (Нобелевская премия по медицине 2024).",
        ahaMoment: "Амброс и Равкун обнаружили, что ген lin-4 кодирует не белок, а 22-нуклеотидную РНК, избирательно выключающую трансляцию.",
        howItWorks: "В составе комплекса RISC микроРНК связывается с комплементарным участком мРНК и блокирует синтез белка на рибосоме.",
        realWorldImpact: "Диагностика онкологических заболеваний на ранней стадии и разработка РНК-интерференционной терапии.",
        curriculumConnection: "Школьный курс биологии: биосинтез белка, виды РНК, регуляция экспрессии генов.",
        funFacts: [
          "МикроРНК регулируют активность более 60% генов человека."
        ]
      }
    },
    quiz: [
      {
        id: "mrna-q1",
        question: "MikroRNT molekulları hüceyrədə genlərin fəaliyyətini əsasən hansı mərhələdə tənzimləyir?",
        options: [
          { id: "A", text: "DNT replikasiyasından dərhal əvvəl" },
          { id: "B", text: "Transkripsiyadan sonra, mRNT-nin translasiyası mərhələsində" },
          { id: "C", text: "Hüceyrə membranı parçalanarkən" },
          { id: "D", text: "Yalnız qlikoliz prosesi baş verəndə" }
        ],
        correctOption: "B",
        explanation: "MikroRNT-lər transkripsiya olunmuş mRNT molekuluna bağlanaraq onun zülala çevrilməsinə (translasiyaya) mane olur və ya mRNT-ni parçalayır.",
        bloomLevel: "Anlama"
      },
      {
        id: "mrna-q2",
        question: "MikroRNT-lərin digər məlumat RNT-lərindən başlıca fərqi nədir?",
        options: [
          { id: "A", text: "Heç bir zülal kodlaşdırmayan qısa qeyri-kodlaşdırıcı zəncir olmaları" },
          { id: "B", text: "Tərkibində urasil əvəzinə timin saxlamaları" },
          { id: "C", text: "Yalnız mitoxondrinin daxilində sintez olunmaları" },
          { id: "D", text: "Ribosomların ən böyük struktur vahidini təşkil etmələri" }
        ],
        correctOption: "A",
        explanation: "MikroRNT-lər zülal sintezi üçün kod daşımır (qeyri-kodlaşdırıcıdır); onların əsas vəzifəsi tənzimləmə və hədəf mRNT-ni susdurmaqdır.",
        bloomLevel: "Bilik"
      },
      {
        id: "mrna-q3",
        question: "Bütün somatik hüceyrələrimizdə eyni genetik kod olduğu halda onların müxtəlif toxumalara çevrilməsi nəyin nəticəsidir?",
        options: [
          { id: "A", text: "Müxtəlif hüceyrələrdə xromosom sayının fərqli olmasının" },
          { id: "B", text: "Diferensial gen ekspressiyasının və tənzimləyici mexanizmlərin (məs. mikroRNT)" },
          { id: "C", text: "Hər toxumanın fərqli aminturşulardan təşkil olunmasının" },
          { id: "D", text: "DNT-nin yalnız qaraciyər hüceyrələrində mövcud olmasının" }
        ],
        correctOption: "B",
        explanation: "Bütün hüceyrələrdə genlər eynidir, lakin müxtəlif toxumalarda yalnız spesifik genlər aktivləşir, qalanları isə tənzimləyici faktorlar və mikroRNT vasitəsilə susdurulur.",
        bloomLevel: "Təhlil"
      }
    ]
  },
  {
    id: "quantum-dots-nanotechnology",
    slug: "quantum-dots-nanotechnology-chemistry-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2023,
      category: "Kimya",
      laureates: ["Moungi Bawendi", "Louis Brus", "Aleksey Ekimov"],
      citation: "Kvant nöqtələrinin kəşfi və sintezinə görə"
    },
    discoveryYear: 1981,
    discoverer: "Aleksey Ekimov, Louis Brus və Moungi Bawendi",
    curriculumSubject: "Kimya / Fizika",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Nanotexnologiya, atomun kvant quruluşu, yarımkeçiricilər və optik xassələr",
    icon: "Sparkles",
    accentColor: "from-cyan-500 to-blue-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Kvant Nöqtələri (Quantum Dots) və Rənglərin Kvant İdarəsi",
        summary: "Bir maddənin tərkibini dəyişmədən, sadəcə onun ölçüsünü bir neçə nanometr kiçiltməklə rəngini və xassələrini dəyişmək mümkündürmü? Kvant fizikasının kimyada təcəssümü.",
        ahaMoment: "Klassik kimyada maddənin rəngi onun atom tərkibindən asılıdır: qızıl həmişə sarıdır. Lakin 1980-ci illərin əvvəlində Ekimov və Brus aşkar etdilər ki, yarımkeçirici kristalları bir neçə nanometr ölçüyə qədər kiçildəndə elektronlar dar fəzaya sıxılır ('kvant məhdudiyyəti') və eyni maddə ölçüsündən asılı olaraq mavi, yaşıl və ya qırmızı rəngdə parıldayır!",
        howItWorks: "Kvant nöqtəsi cəmi bir neçə min atomdan ibarət nanoölçülü yarımkeçirici kristaldır. Kristal kiçildikcə qadağan olunmuş zonanın eni (bandgap) artır. Bu səbəbdən kiçik nöqtələr daha yüksək enerjili göy/bənövşəyi işıq, daha böyük nöqtələr isə qırmızı işıq şüalandırır.",
        realWorldImpact: "QLED televizor və monitorların heyrətamiz rəng dəqiqliyi, tibbi cərrahiyyədə şiş toxumalarının parlaq işıqlandırılması və yeni nəsil günəş panelləri.",
        curriculumConnection: "10-11-ci sinif Fizika və Kimyada 'Maddənin dalğa-zərrəcik ikiliyi', 'İşıq şüalanması və udulması', 'Yarımkeçiricilər' mövzularına tam cavab verir.",
        funFacts: [
          "Bir kvant nöqtəsinin futbol topuna olan nisbəti, futbol topunun Yer kürəsinə olan nisbəti kimidir.",
          "Qədim dövrlərdə rəngli vitraj şüşələri hazırlayan ustalar bilmədən qızıl və gümüş kvant nöqtələrindən istifadə edirdilər."
        ]
      },
      en: {
        title: "Quantum Dots: Controlling Color via Size",
        summary: "Nanometer-scale semiconductor crystals whose optical properties depend purely on size due to quantum confinement (2023 Nobel Prize in Chemistry).",
        ahaMoment: "Physicists discovered that shrinking a semiconductor below the de Broglie wavelength confines electrons, transforming its emitted light spectrum.",
        howItWorks: "Quantum confinement widens the electronic bandgap as particle diameter decreases, shifting emission from red to vibrant blue.",
        realWorldImpact: "QLED displays, tumor resection bio-imaging, and high-efficiency photovoltaic solar cells.",
        curriculumConnection: "Illustrates particle-in-a-box quantum mechanics and semiconductor physics in high school STEM courses.",
        funFacts: [
          "A quantum dot is to a soccer ball what a soccer ball is to planet Earth."
        ]
      },
      tr: {
        title: "Kuantum Noktaları: Boyuta Bağlı Renkler",
        summary: "Maddeyi değiştirmeden sadece boyutunu küçülterek ışık rengini değiştiren nano kristaller ve 2023 Nobel Kimya Ödülü.",
        ahaMoment: "Aynı kimyasal bileşimin sadece nanometre boyutu değiştirilerek kırmızıdan maviye tüm spektrumda ışıma yapabildiği keşfedildi.",
        howItWorks: "Kuantum hapsolma etkisi band aralığını genişletir ve foton dalga boyunu doğrudan parçacık boyutuna bağlar.",
        realWorldImpact: "QLED televizyonlar, kanserli hücrelerin floresan haritalanması ve gelişmiş güneş panelleri.",
        curriculumConnection: "Yarı iletkenler, foton enerjisi ve nano teknoloji müfredatıyla tam uyumludur.",
        funFacts: [
          "Ortaçağ kiliselerinin renkli cam pencerelerinde ustalar farkında olmadan kuantum noktaları oluşturmuştu."
        ]
      },
      ru: {
        title: "Квантовые точки и нанотехнологии",
        summary: "Наноразмерные полупроводники, чьи оптические и электрические свойства определяются размером из-за квантового ограничения (Нобелевская премия по химии 2023).",
        ahaMoment: "Екимов и Брус доказали, что размер кристалла напрямую диктует цвет его свечения без изменения химической формулы.",
        howItWorks: "Квантово-размерный эффект: чем меньше частица, тем шире запрещенная зона и короче длина волны излучаемого света.",
        realWorldImpact: "QLED-экраны, биомедицинская визуализация опухолей и фотовольтаика.",
        curriculumConnection: "Школьный курс физики и химии: полупроводники, квантовые постулаты, строение атома.",
        funFacts: [
          "Размер квантовой точки составляет от 2 до 10 нанометров (всего несколько тысяч атомов)."
        ]
      }
    },
    quiz: [
      {
        id: "qd-q1",
        question: "Kvant nöqtələrinin ölçüsü kiçildikcə onların şüalandırdığı işığın rəngi və enerjisi necə dəyişir?",
        options: [
          { id: "A", text: "Qırmızıya doğru sürüşür və enerji azalır" },
          { id: "B", text: "Göy/bənövşəyiyə doğru sürüşür və foton enerjisi artır" },
          { id: "C", text: "Tamamilə şəffaflaşır və heç bir işıq yaymır" },
          { id: "D", text: "Yalnız infraqırmızı istilik şüalanması verir" }
        ],
        correctOption: "B",
        explanation: "Ölçü kiçildikcə kvant məhdudiyyəti nəticəsində qadağan olunmuş zona genişlənir, keçid zamanı buraxılan fotonun enerjisi artır (dalğa uzunluğu qısalır, mavi tərəfə sürüşür).",
        bloomLevel: "Tətbiq"
      },
      {
        id: "qd-q2",
        question: "Kvant nöqtələri gündəlik həyatımızda ən çox hansı cihazlarda geniş istifadə olunur?",
        options: [
          { id: "A", text: "QLED monitor və televizor ekranlarında" },
          { id: "B", text: "Sadə civəli termometrlərdə" },
          { id: "C", text: "Mexaniki qol saatlarında" },
          { id: "D", text: "Dəmiryol relslərinin bərkidilməsində" }
        ],
        correctOption: "A",
        explanation: "Müasir QLED (Quantum Dot Light Emitting Diode) televizor və displeyləri təmiz və zəngin rənglər əldə etmək üçün məhz kvant nöqtələrindən istifadə edir.",
        bloomLevel: "Bilik"
      },
      {
        id: "qd-q3",
        question: "Kvant nöqtələrinin xassələrini klassik bütöv kristaldan fərqləndirən əsas hadisə hansıdır?",
        options: [
          { id: "A", text: "Arximed qaldırıcı qüvvəsi" },
          { id: "B", text: "Kvant ölçü effekti (məhdudiyyəti)" },
          { id: "C", text: "Molekulyar diffuziya sürətinin sıfır olması" },
          { id: "D", text: "Suyun qaynama temperaturunun düşməsi" }
        ],
        correctOption: "B",
        explanation: "Ölçü de Broyl dalğa uzunluğu tərtibinə çatdıqda elektronların dalğa xassələri məhdud fəzada kvantlaşır və bu hadisə kvant ölçü effekti adlanır.",
        bloomLevel: "Təhlil"
      }
    ]
  },
  {
    id: "attosecond-light-pulses",
    slug: "attosecond-light-pulses-electron-dynamics-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2023,
      category: "Fizika",
      laureates: ["Pierre Agostini", "Ferenc Krausz", "Anne L'Huillier"],
      citation: "Maddədə elektron dinamikasının öyrənilməsi üçün atto-saniyəlik işıq impulsları yaradan eksperimental metodlara görə"
    },
    discoveryYear: 2001,
    discoverer: "Anne L'Huillier, Pierre Agostini və Ferenc Krausz",
    curriculumSubject: "Fizika",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Elektromaqnit dalğaları, lazerlər, atom fizikası və elektronların hərəkəti",
    icon: "Zap",
    accentColor: "from-purple-600 to-indigo-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Attosaniyəlik İşıq İmpulsları və Elektronların Sürətli Dünyası",
        summary: "Saniyənin milyardda birinin milyardda biri (10^-18 saniyə)! Atom daxilində ildırım sürətilə hərəkət edən elektronları dondurub seyr etməyə imkan verən dünyanın ən sürətli kamerası.",
        ahaMoment: "Sürətlə qanad çalan kolibrinin şəklini çəkmək üçün fotoaparatın çəkiliş sürəti (ekspozisiyası) qanadın hərəkətindən daha qısa olmalıdır. Bəs atom ətrafında saniyənin yüzlərlə attosaniyəsində fırlanan elektronların şəklini necə çəkmək olar? 2023-cü il Nobel laureatları ifrat qısa lazer şüalanmalarını qaz atomlarına yönəldərək saniyənin 10^-18 hissəsi qədər davam edən inanılmaz qısa işıq parıltıları yaratmağı bacardılar.",
        howItWorks: "Güclü lazer sahəsi atomdakı elektronu qoparıb sürətləndirir və lazerin elektrik sahəsi istiqamətini dəyişəndə elektronu yenidən ana nüvəyə çırpır. Bu rekombinasiya zamanı ifrat yüksək tezlikli harmonikalar (yüksək enerjili rentgen fotonları) yaranır və onlar attosaniyəlik impulslar şəklində toplanır.",
        realWorldImpact: "Molekulyar kimyəvi reaksiyalarda elektronların necə sıçradığını canlı izləmək, ifrat sürətli kvant prosessorları yaratmaq və qan nümunələrində molekulyar dəyişiklikləri xərçəng yaranmamışdan qeydə almaq.",
        curriculumConnection: "11-ci sinif Fizika dərsliyində 'Elektromaqnit şüalanması şkalası', 'Kvant fizikası' və 'Atomun Bor modeli' mövzularının ən müasir eksperimental tətbiqidir.",
        funFacts: [
          "Bir attosaniyənin (10^-18 s) 1 saniyəyə nisbəti, 1 saniyənin Kainatın bütün yaş dövrünə (13.8 milyard il) nisbəti qədərdir!",
          "Anne L'Huillier Fizika üzrə Nobel mükafatı alan tarixdəki cəmi 5 qadından biridir."
        ]
      },
      en: {
        title: "Attosecond Physics: Capturing Electron Motion",
        summary: "Generating billionths of a billionth of a second light pulses to observe electron dynamics inside atoms (2023 Nobel Prize in Physics).",
        ahaMoment: "To freeze the ultra-fast motion of electrons, pulses shorter than their orbital timescales were needed. Attosecond flashes achieved this milestone.",
        howItWorks: "High-harmonic generation via laser field electron ionization, acceleration, and parent core recombination releases extreme UV attosecond bursts.",
        realWorldImpact: "Enables next-generation petahertz electronics, real-time chemical bond formation tracking, and early blood cancer screening.",
        curriculumConnection: "Exemplifies electromagnetic spectrum wave interference and Bohr electron orbit dynamics.",
        funFacts: [
          "One attosecond is to a second what one second is to the entire age of the universe (13.8 billion years)."
        ]
      },
      tr: {
        title: "Attosaniye Fiziği: Elektronların Hızlı Dünyası",
        summary: "Elektronların atom içi hareketlerini dondurup görüntüleyen 10^-18 saniyelik ışık parlamaları ve 2023 Nobel Fizik Ödülü.",
        ahaMoment: "Elektronlar femtosaniyeden çok daha hızlı hareket eder; onların fotoğrafını çekmek için evrenin en kısa ışık flaşları üretildi.",
        howItWorks: "Yüksek harmonik üretimiyle gaz atomlarından saçılan elektronların yeniden birleşmesi attosaniye süreli foton patlamaları oluşturur.",
        realWorldImpact: "Moleküler elektron transferinin doğrudan izlenmesi, ultra hızlı kuantum mantık kapıları ve erken kanser teşhisi.",
        curriculumConnection: "Fizikte dalga optiği, lazer fiziği ve atom teorisi konularıyla doğrudan örtüşür.",
        funFacts: [
          "Bir attosaniyenin bir saniyeye oranı, bir saniyenin evrenin yaşına oranına eşittir."
        ]
      },
      ru: {
        title: "Аттосекундные импульсы света и динамика электронов",
        summary: "Создание вспышек света длительностью в миллиардные доли миллиардной доли секунды для наблюдения за электронами (Нобелевская премия по физике 2023).",
        ahaMoment: "Электроны в атомах меняют состояние за сотни аттосекунд. Исследователи создали импульсы света короче периода их обращения.",
        howItWorks: "Генерация высоких гармоник: отрыв электрона полем лазера, его разгон и обратная рекомбинация с испусканием сверхкороткого импульса.",
        realWorldImpact: "Сверхбыстрая электроника петагерцового диапазона и наблюдение разрыва химических связей в реальном времени.",
        curriculumConnection: "Школьная физика: электромагнитные волны, спектроскопия, планетарная модель атома.",
        funFacts: [
          "Одна аттосекунда относится к секунде так же, как одна секунда ко всему возрасту Вселенной."
        ]
      }
    },
    quiz: [
      {
        id: "atto-q1",
        question: "Bir attosaniyə riyazi olaraq saniyənin hansı hissəsini təşkil edir?",
        options: [
          { id: "A", text: "10^-6 saniyə (mikrosaniyə)" },
          { id: "B", text: "10^-9 saniyə (nanosaniyə)" },
          { id: "C", text: "10^-15 saniyə (femtosaniyə)" },
          { id: "D", text: "10^-18 saniyə" }
        ],
        correctOption: "D",
        explanation: "Attosaniyə 10^-18 saniyəyə bərabərdir (saniyənin milyardda birinin milyardda biri).",
        bloomLevel: "Bilik"
      },
      {
        id: "atto-q2",
        question: "Attosaniyəlik işıq impulslarının əsas elmi tətbiq sahəsi nədir?",
        options: [
          { id: "A", text: "Atom və molekullarda elektronların hərəkət dinamikasını izləmək" },
          { id: "B", text: "Dəniz dibində su axınlarının sürətini ölçmək" },
          { id: "C", text: "Avtomobil təkərlərinin təzyiqini tənzimləmək" },
          { id: "D", text: "Bitkilərdə kök təzyiqini artırmaq" }
        ],
        correctOption: "A",
        explanation: "Elektronlar atom daxilində məhz attosaniyə şkalasında yer dəyişdiyi üçün yalnız bu cür qısa impulslar onların hərəkətini dondurub öyrənməyə imkan verir.",
        bloomLevel: "Anlama"
      },
      {
        id: "atto-q3",
        question: "Elektronun lazer şüalanması ilə nüvədən qopub yenidən qayıdarkən enerji buraxması hansı hadisə adlanır?",
        options: [
          { id: "A", text: "Yüksək harmonikaların generasiyası və rekombinasiya" },
          { id: "B", text: "Kütlənin itməsi" },
          { id: "C", text: "Mexaniki rezonans" },
          { id: "D", text: "Elektromaqnit induksiyası" }
        ],
        correctOption: "A",
        explanation: "Güclü sahədə sürətlənən elektron nüvə ilə yenidən toqquşaraq rekombinasiya edir və artıq kinetik enerjisini yüksək harmonikalı attosaniyəlik foton şəklində şüalandırır.",
        bloomLevel: "Təhlil"
      }
    ]
  },
  {
    id: "mrna-vaccine-technology",
    slug: "mrna-vaccines-modified-nucleosides-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2023,
      category: "Fiziologiya və ya Tibb",
      laureates: ["Katalin Karikó", "Drew Weissman"],
      citation: "COVID-19-a qarşı effektiv mRNT peyvəndlərinin hazırlanmasına imkan verən nukleozid modifikasiyalarına görə"
    },
    discoveryYear: 2005,
    discoverer: "Katalin Karikó və Drew Weissman",
    curriculumSubject: "Biologiya",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "İmmunitet, vaksinlər, nuklein turşuları və zülal biosintezi",
    icon: "ShieldAlert",
    accentColor: "from-rose-500 to-red-700",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "mRNT Vaksinləri və Modifikasiya Olunmuş Nukleozidlər",
        summary: "Bədənimizi öz daxilində virusun zərərsiz zülalını sintez edən təbii fabrikə çevirən və bəşəriyyəti pandemiyadan xilas edən texnologiya.",
        ahaMoment: "Katalin Kariko onilliklər boyu sübut etməyə çalışırdı ki, laboratoriyada sintez olunmuş mRNT xəstəlikləri müalicə edə bilər. Lakin sintetik mRNT bədənə daxil olanda immunitet sistemi onu dərhal xarici düşmən sayıb məhv edir və güclü iltihab yaradırdı. 2005-ci ildə Kariko və Vaysman uridin nukleozidini 'psevdouridin' ilə əvəzləyərək mRNT-ni immun sistemin radarından gizlətməyi bacardılar!",
        howItWorks: "Dəyişdirilmiş mRNT lipid nanohissəciklərinə (yağ damcılarına) bükülərək əzələ hüceyrələrinə ötürülür. Hüceyrənin ribosomları bu mRNT-ni oxuyaraq virusun zərərsiz 'S-zülalını' (tikan zülalını) sintez edir. İmmun sistemi bu zülala qarşı antitel və yaddaş hüceyrələri hazırlayır, mRNT isə bir neçə günə tam parçalanır və genoma daxil olmur.",
        realWorldImpact: "Tarixdə ən qısa müddətdə hazırlanan COVID-19 peyvəndləri (Pfizer-BioNTech və Moderna), indi isə xərçəng və fərdiləşdirilmiş melanoma vaksinləri.",
        curriculumConnection: "9-cu sinif Biologiyada 'Süni və təbii immunitet', 10-cu sinifdə 'Nuklein turşuları və biosintez' mövzularına dərindən bağlıdır.",
        funFacts: [
          "Kariko illərlə universitetdə qrant ala bilmədiyi üçün vəzifəsi aşağı salınmışdı, lakin o təslim olmadı və nəticədə Nobel aldı.",
          "mRNT peyvəndi bədənə heç bir canlı və ya zəiflədilmiş virus daxil etmir, hüceyrənin DNT-sinə toxunmur."
        ]
      },
      en: {
        title: "mRNA Vaccine Technology and Modified Nucleosides",
        summary: "How nucleoside base modifications enabled mRNA vaccines to save millions during COVID-19 (2023 Nobel Prize in Physiology or Medicine).",
        ahaMoment: "Replacing uridine with pseudouridine prevented severe inflammatory reactions while massively boosting protein translation.",
        howItWorks: "Lipid nanoparticle delivery guides synthetic mRNA into ribosomes to produce viral spike antigens, priming adaptive immune memory.",
        realWorldImpact: "Historic pandemic suppression and groundbreaking ongoing clinical trials for personalized cancer immunotherapy.",
        curriculumConnection: "Essential context for teaching adaptive immunity, translation, and nucleic acid biochemistry.",
        funFacts: [
          "mRNA does not enter the cell nucleus and completely degrades after translation."
        ]
      },
      tr: {
        title: "mRNA Aşı Teknolojisi ve Modifiye Nükleozitler",
        summary: "Hücreleri kendi aşısını üreten bir fabrikaya dönüştüren devrim ve 2023 Nobel Tıp Ödülü.",
        ahaMoment: "Karikó ve Weissman, uridini psödouridin ile değiştirerek yapay mRNA'nın bağışıklık alarmını tetiklemesini engellediler.",
        howItWorks: "Lipit nanoparçacıkları ile hücreye iletilen mRNA, ribozomda antijeni sentezletir ve antikor cevabı oluşturur.",
        realWorldImpact: "Milyonlarca hayatı kurtaran aşılar ve kişiye özel kanser aşıları.",
        curriculumConnection: "Hücresel bağışıklık, aşı tipleri ve translasyon mekanizması müfredatına tam uyum.",
        funFacts: [
          "Katalin Karikó yıllarca üniversitede fon bulamadığı için kadrosu düşürülmüştü."
        ]
      },
      ru: {
        title: "Технология мРНК-вакцин и модифицированные нуклеозиды",
        summary: "Модификация нуклеозидов, позволившая создать эффективные вакцины против COVID-19 (Нобелевская премия по медицине 2023).",
        ahaMoment: "Замена уридина на псевдоуридин устранила воспалительную реакцию и увеличила трансляцию защитного белка.",
        howItWorks: "Липидные наночастицы доставляют матричную РНК в цитоплазму, где рибосомы собирают вирусный спайк-белок для выработки антител.",
        realWorldImpact: "Спасение миллионов жизней во время пандемии и переход к разработке мРНК-вакцин против рака.",
        curriculumConnection: "Школьный курс биологии: приобретенный иммунитет, антигены и антитела, синтез белка.",
        funFacts: [
          "мРНК не проникает в ядро клетки и не способна изменить ДНК человека."
        ]
      }
    },
    quiz: [
      {
        id: "mrna-v-q1",
        question: "Kariko və Vaysmanın sintetik mRNT-də tətbiq etdiyi əsas ixtira nə idi?",
        options: [
          { id: "A", text: "DNT-ni hüceyrədən tam çıxarmaq" },
          { id: "B", text: "Uridin nukleotidini modifikasiya edərək immun sistemin kəskin iltihabını önləmək" },
          { id: "C", text: "Hüceyrələri radioaktiv şüalandırmaq" },
          { id: "D", text: "Vaksinə antibiotik əlavə etmək" }
        ],
        correctOption: "B",
        explanation: "Təbii olmayan mRNT iltihab yaradırdı. Psevdouridin modifikasiyası mRNT-nin orqanizm tərəfindən rədd edilmədən zülal sintez etməsini təmin etdi.",
        bloomLevel: "Anlama"
      },
      {
        id: "mrna-v-q2",
        question: "mRNT peyvəndi yeridildikdən sonra insanın hüceyrə DNT-sinə necə təsir edir?",
        options: [
          { id: "A", text: "DNT zəncirini kəsir və dəyişdirir" },
          { id: "B", text: "Heç bir təsir göstərmir, çünki nüvəyə daxil olmur və sitoplazmada parçalanır" },
          { id: "C", text: "DNT-ni ikiqat sürətlə çoxaldır" },
          { id: "D", text: "Bütün xromosomları birləşdirir" }
        ],
        correctOption: "B",
        explanation: "mRNT yalnız sitoplazmada ribosomlar tərəfindən oxunur, hüceyrə nüvəsinə və genoma qətiyyən daxil olmur və qısa müddətdə təbii fermentlərlə parçalanır.",
        bloomLevel: "Tətbiq"
      },
      {
        id: "mrna-v-q3",
        question: "Vaksinasiya nəticəsində orqanizmdə hansı qazanılmış immunitet növü formalaşır?",
        options: [
          { id: "A", text: "Təbii anadangəlmə immunitet" },
          { id: "B", text: "Süni fəal (aktiv) immunitet" },
          { id: "C", text: "Süni qeyri-fəal (passiv) zərdab immuniteti" },
          { id: "D", text: "Qazanılmamış növ immuniteti" }
        ],
        correctOption: "B",
        explanation: "Vaksin vurulduqda bədən özü antitel və yaddaş hüceyrələri hazırladığı üçün bu, süni fəal (aktiv) immunitet sayılır.",
        bloomLevel: "Bilik"
      }
    ]
  },
  {
    id: "crispr-cas9-gene-editing",
    slug: "crispr-cas9-genetic-scissors-chemistry-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2020,
      category: "Kimya",
      laureates: ["Emmanuelle Charpentier", "Jennifer A. Doudna"],
      citation: "Genomun redaktə edilməsi metodunun (genetik qayçıların) işlənib hazırlanmasına görə"
    },
    discoveryYear: 2012,
    discoverer: "Emmanuelle Charpentier və Jennifer Doudna",
    curriculumSubject: "Biologiya",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Gen mühəndisliyi, biotexnologiya, bakteriofaqlar və mutasiyalar",
    icon: "Scissors",
    accentColor: "from-pink-500 to-rose-700",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "CRISPR-Cas9 Genetik Qayçıları: Həyat Kodunun Yenidən Yazılması",
        summary: "Bakteriyaların viruslara qarşı qədim immun müdafiəsindən ilhamlanaraq DNT-nin istənilən hərfini molekulyar dəqiqliklə kəsib dəyişdirən inqilab.",
        ahaMoment: "Bakteriyaların virus hücumundan qorunmaq üçün onların DNT parçalarını öz genomunda 'kitabxana' kimi saxladığı məlum idi. Şarpentye və Dudna aşkar etdilər ki, Cas9 fermentinə istənilən bələdçi RNT (gRNA) verməklə onu istənilən orqanizmin genomunda hədəf nöqtəyə yönəldib DNT-ni zərgər dəqiqliyi ilə kəsmək olar.",
        howItWorks: "Sistem iki hissədən ibarətdir: kəsiləcək ünvanı axtaran bələdçi RNT və kəsimi icra edən Cas9 endonukleaz fermenti. DNT kəsildikdən sonra hüceyrə öz təbii bərpa mexanizmi ilə ya qüsurlu geni söndürür, ya da daxil edilmiş yeni sağlam şablon DNT-ni kəsilmiş yerə yapışdırır.",
        realWorldImpact: "Oraqvari hüceyrə anemiyasının tam müalicəsi (Casgevy preparatı FDA tərəfindən təsdiqləndi), kənd təsərrüfatında quraqlığa dözümlü bitkilərin yaradılması və irsi xəstəliklərin aradan qaldırılması.",
        curriculumConnection: "11-ci sinif Biologiya dərsliyində 'Gen mühəndisliyi və Biotexnologiya', 'Mutasiyalar və onların korreksiyası' mövzularına birbaşa aiddir.",
        funFacts: [
          "Tarixdə ilk dəfə iki qadın alim eyni vaxtda birgə Kimya üzrə Nobel mükafatına layiq görüldü.",
          "CRISPR texnologiyası ilə müalicə olunmuş ilk xəstə Viktoriya Qrey ömürlük oraqvari anemiya ağrılarından tam azad oldu."
        ]
      },
      en: {
        title: "CRISPR-Cas9: Molecular Genetic Scissors",
        summary: "A revolutionary genome-editing tool borrowed from bacterial immune systems (2020 Nobel Prize in Chemistry).",
        ahaMoment: "Programming Cas9 with custom guide RNAs allowed molecular precision cutting anywhere in a living genome.",
        howItWorks: "Guide RNA directs Cas9 to target nucleotide sequences, inducing double-strand DNA breaks repaired by cellular mechanisms.",
        realWorldImpact: "Cured sickle cell disease (Casgevy), creates drought-resilient crops, and eradicates genetic blindness.",
        curriculumConnection: "Key application of genetic engineering and cellular repair pathways.",
        funFacts: [
          "First science Nobel shared exclusively between two women: Charpentier and Doudna."
        ]
      },
      tr: {
        title: "CRISPR-Cas9 Genetik Makas Devrimi",
        summary: "DNA'nın istenen harfini değiştirebilen moleküler hassas düzenleme ve 2020 Nobel Kimya Ödülü.",
        ahaMoment: "Bakteriyel savunma sisteminin rehber RNA ile programlanarak her canlıda gen düzenleyebileceği kanıtlandı.",
        howItWorks: "Rehber RNA hedef geni bulur, Cas9 enzimi DNA'yı keser ve hücre tamir mekanizması geni düzeltir.",
        realWorldImpact: "Orak hücre anemisi tedavisi, dayanıklı tarım ürünleri ve kalıtsal hastalıkların önlenmesi.",
        curriculumConnection: "Gen mühendisliği ve biyoteknoloji kazanımlarının zirve noktasıdır.",
        funFacts: [
          "İlk kez iki kadın bilim insanı Nobel Kimya Ödülü'nü birlikte paylaştı."
        ]
      },
      ru: {
        title: "Генетические ножницы CRISPR-Cas9",
        summary: "Революция геномного редактирования на основе бактериального иммунитета (Нобелевская премия по химии 2020).",
        ahaMoment: "Шарпантье и Дудна запрограммировали фермент Cas9 гидовой РНК, создав инструмент точечного разрезания ДНК.",
        howItWorks: "Гид-РНК находит комплементарный участок ДНК, а Cas9 вносит двунитевой разрыв, запускающий репарацию.",
        realWorldImpact: "Первое излечение серповидноклеточной анемии, новые сорта растений и терапия наследственных патологий.",
        curriculumConnection: "Школьный курс: генная инженерия, биотехнология, репарация ДНК.",
        funFacts: [
          "Впервые Нобелевскую премию по химии разделили исключительно две женщины-ученые."
        ]
      }
    },
    quiz: [
      {
        id: "crispr-q1",
        question: "CRISPR-Cas9 sistemində hədəf DNT ardıcıllığını dəqiq tapan komponent hansıdır?",
        options: [
          { id: "A", text: "Bələdçi RNT (guide RNA)" },
          { id: "B", text: "Hüceyrə membranı" },
          { id: "C", text: "Qlükoza molekulu" },
          { id: "D", text: "ATPaza fermenti" }
        ],
        correctOption: "A",
        explanation: "Bələdçi RNT hədəf DNT sahəsi ilə komplementar cütləşərək Cas9 qayçısını məhz həmin kəsim nöqtəsinə gətirir.",
        bloomLevel: "Anlama"
      },
      {
        id: "crispr-q2",
        question: "CRISPR sistemi təbiətdə ilkin olaraq hansı canlılarda müdafiə mexanizmi kimi yaranmışdır?",
        options: [
          { id: "A", text: "Bakteriyalarda (bakteriofaq viruslarına qarşı)" },
          { id: "B", text: "Məməli heyvanların qanında" },
          { id: "C", text: "İynəyarpaqlı ağacların qabığında" },
          { id: "D", text: "Göbələklərin mitselisində" }
        ],
        correctOption: "A",
        explanation: "CRISPR bakteriyaların virus hücumlarına qarşı adaptiv immunitet sistemidir; bakteriya keçmiş virus DNT-lərini yadda saxlayaraq sonrakı hücumda onları kəsir.",
        bloomLevel: "Bilik"
      },
      {
        id: "crispr-q3",
        question: "CRISPR texnologiyasının ənənəvi gen mühəndisliyi metodlarından başlıca üstünlüyü nədir?",
        options: [
          { id: "A", text: "Mikroskop tələb etməməsi" },
          { id: "B", text: "Yüksək hədəfləmə dəqiqliyi, ucuzluğu və proqramlaşdırıla bilməsi" },
          { id: "C", text: "Yalnız bitkilərdə işləməsi" },
          { id: "D", text: "DNT-ni deyil, yalnız lipidləri dəyişdirməsi" }
        ],
        correctOption: "B",
        explanation: "Əvvəlki metodlar aylar çəkir və təsadüfi yerlərə yapışırdı; CRISPR isə sintetik RNT ilə bir neçə günə istənilən dəqiq koda yönəldilə bilir.",
        bloomLevel: "Təhlil"
      }
    ]
  },
  {
    id: "quantum-entanglement-bell",
    slug: "quantum-entanglement-bell-inequality-physics-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2022,
      category: "Fizika",
      laureates: ["Alain Aspect", "John Clauser", "Anton Zeilinger"],
      citation: "Dolaşıq fotonlarla eksperimentlərə, Bell bərabərsizliyinin pozulmasının sübutuna və kvant informasiya elminə görə"
    },
    discoveryYear: 1982,
    discoverer: "Alain Aspect, John Clauser və Anton Zeilinger",
    curriculumSubject: "Fizika",
    curriculumGrade: "11-ci sinif",
    curriculumTopic: "Kvant fizikası, fotonlar, işığın dalğa-zərrəcik təbiəti və Bell teoremi",
    icon: "Atom",
    accentColor: "from-blue-500 to-indigo-900",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "Kvant Dolaşıqlığı (Quantum Entanglement) və Eynşteynin 'Kabusvari' Şübhəsi",
        summary: "Kainatın iki əks qütbündə olan zərrəciklərin bir-birindən anında xəbərdar olması və kvant kompüterlərinin əsası.",
        ahaMoment: "Albert Eynşteyn kvant mexanikasını tənqid edərək demişdi ki, zərrəciklərin işıq sürətindən sürətli əlaqə qurması qeyri-mümkündür və bunu 'məsafədən qorxunc/kabusvari təsir' (spooky action at a distance) adlandırmışdı. 2022-ci il Nobel laureatları apardıqları misilsiz təcrübələrlə sübut etdilər ki, Eynşteyn yanılırdı: kvant dolaşıqlığı realdır və lokal realizm pozulur!",
        howItWorks: "İki dolaşıq foton yaradıldıqda onların kvant halları (məsələn, polyarizasiyası) vahid dalğa funksiyası ilə təsvir olunur. Biri ölçülən kimi digərinin halı məsafədən asılı olmayaraq anında kollaps edir.",
        realWorldImpact: "Qırılması qeyri-mümkün olan kvant kriptoqrafiyası (QKD), kvant teleportasiyası və superkompüterləri qabaqlayan kvant prosessorları.",
        curriculumConnection: "11-ci sinif Fizikada 'Kvant postulatları', 'Fotoeffekt və fotonların xassələri' mövzularının ən ali fəlsəfi və eksperimental zirvəsidir.",
        funFacts: [
          "Zeilingerin komandası Kanar adaları arasında 144 km məsafədə fotonların kvant dolaşıqlığını təsdiqləmişdir.",
          "Eynşteyn bu hadisəni rədd etmək üçün EPR paradoksunu irəli sürmüşdü, lakin nəticədə paradoks kvant inqilabına yol açdı."
        ]
      },
      en: {
        title: "Quantum Entanglement and Bell Inequality Violation",
        summary: "Proving Einstein's 'spooky action at a distance' is real, launching quantum computing (2022 Nobel Prize in Physics).",
        ahaMoment: "Clauser, Aspect, and Zeilinger closed experimental loopholes, definitively violating Bell's inequalities.",
        howItWorks: "Entangled particle pairs share an interconnected state where measuring one instantly collapses the other, defying local realism.",
        realWorldImpact: "Quantum key distribution (unhackable encryption), quantum teleportation, and quantum supercomputing.",
        curriculumConnection: "Culmination of quantum mechanics and photon polarization curricula.",
        funFacts: [
          "Einstein called it 'spooky action at a distance' believing local hidden variables existed."
        ]
      },
      tr: {
        title: "Kuantum Dolanıklığı ve Bell Eşitsizlikleri",
        summary: "Evrenin yerel gerçekçilik ilkesini ihlal eden dolanık fotonlar ve 2022 Nobel Fizik Ödülü.",
        ahaMoment: "Einstein'ın 'uzaktan hayaletsi etki' diyerek reddettiği fenomenin deneysel olarak kanıtlanması.",
        howItWorks: "Dolanık iki fotondan birinin durumu ölçüldüğü anda aradaki mesafeden bağımsız diğeri belirlenir.",
        realWorldImpact: "Kuantum kriptografi, kuantum internet ve yeni nesil kuantum bilgisayarlar.",
        curriculumConnection: "Fizik dersindeki foton özellikleri ve modern kuantum teorisiyle uyumludur.",
        funFacts: [
          "Kanarya adaları arasında 144 kilometrelik mesafede kuantum ışınlanması gerçekleştirildi."
        ]
      },
      ru: {
        title: "Квантовая запутанность и нарушение неравенств Белла",
        summary: "Доказательство реальности «жуткого дальнодействия» и рождение квантовой информатики (Нобелевская премия по физике 2022).",
        ahaMoment: "Эксперименты Аспека, Клаузера и Цайлингера опровергли теорию локального реализма Эйнштейна.",
        howItWorks: "Измерение состояния одной запутанной частицы мгновенно определяет состояние второй на любом расстоянии.",
        realWorldImpact: "Квантовая криптография, защищенные каналы связи и квантовые процессоры.",
        curriculumConnection: "Школьный курс: квантовая теория, фотоны, поляризация света.",
        funFacts: [
          "Эйнштейн не верил в запутанность до конца жизни, считая квантовую механику неполной."
        ]
      }
    },
    quiz: [
      {
        id: "qe-q1",
        question: "Albert Eynşteyn kvant dolaşıqlığı hadisəsini necə adlandırmışdı?",
        options: [
          { id: "A", text: "Məsafədən qorxunc/kabusvari təsir (spooky action at a distance)" },
          { id: "B", text: "Termodinamik soyuma" },
          { id: "C", text: "Klassik qravitasiya körpüsü" },
          { id: "D", text: "İşıq şüasının sınması" }
        ],
        correctOption: "A",
        explanation: "Eynşteyn məsafədən ani təsirin nisbilik nəzəriyyəsinə zidd olduğunu düşünərək bunu 'spooky action at a distance' adlandırmışdı.",
        bloomLevel: "Bilik"
      },
      {
        id: "qe-q2",
        question: "Bell bərabərsizliyinin eksperimentlərdə pozulması nəyi sübut etdi?",
        options: [
          { id: "A", text: "Kainatın lokal realizmə tabe olmadığını və kvant dolaşıqlığının həqiqət olduğunu" },
          { id: "B", text: "İşığın vakuumda sürətinin sıfır olduğunu" },
          { id: "C", text: "Bütün atomların bölünməz olduğunu" },
          { id: "D", text: "Elektronların kütləsinin olmadığını" }
        ],
        correctOption: "A",
        explanation: "Bell bərabərsizliyinin pozulması təbiətdə 'gizli lokal dəyişənlərin' olmadığını, kvant hallarının qeyri-lokal əlaqədə olduğunu təsdiqlədi.",
        bloomLevel: "Təhlil"
      },
      {
        id: "qe-q3",
        question: "Kvant dolaşıqlığı prinsipinə əsaslanan rabitənin başlıca üstünlüyü nədir?",
        options: [
          { id: "A", text: "İstənilən dinləmə cəhdi dalğa funksiyasını pozduğu üçün sındırılması qeyri-mümkün olan şifrələmə" },
          { id: "B", text: "Elektrik enerjisinə ehtiyac duymaması" },
          { id: "C", text: "Yalnız radio dalğaları ilə işləməsi" },
          { id: "D", text: "Su altında heç bir siqnal ötürə bilməməsi" }
        ],
        correctOption: "A",
        explanation: "Kvant kriptoqrafiyasında üçüncü şəxs fotonu ölçməyə cəhd edən kimi dolaşıqlıq dağılır və informasiya sızması dərhal aşkar edilir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "click-chemistry-bioorthogonal",
    slug: "click-chemistry-bioorthogonal-reactions-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2022,
      category: "Kimya",
      laureates: ["Carolyn R. Bertozzi", "Morten Meldal", "K. Barry Sharpless"],
      citation: "Klik-kimyası və bioortoqonal kimyanın inkişafına görə"
    },
    discoveryYear: 2001,
    discoverer: "Barry Sharpless, Morten Meldal və Carolyn Bertozzi",
    curriculumSubject: "Kimya",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Üzvi kimya, kovalent rabitələr, biopolimerlər və reaksiyaların selektivliyi",
    icon: "Boxes",
    accentColor: "from-amber-600 to-yellow-500",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Klik-Kimyası və Bioortoqonal Reaksiyalar: Molekulyar Lego",
        summary: "Mürəkkəb molekulları arzuolunmaz yan məhsul olmadan kəmər toqqası kimi 'şıqqıltı' (klik) ilə birləşdirən zərif kimya.",
        ahaMoment: "Ənənəvi üzvi sintezdə iki böyük molekulu birləşdirmək həmişə çoxlu zəhərli yan maddələr yaradırdı. Barri Şarpless 'Lego' blokları kimi bir-birini dərhal tapan sadə reaksiyaları təklif etdi. Kerolin Bertozzi isə bu reaksiyaları canlı hüceyrə daxilində hüceyrənin öz həyat fəaliyyətinə heç bir zərər vurmadan həyata keçirən 'bioortoqonal' kimyanı yaratdı.",
        howItWorks: "Azid və alkin qrupları mis katalizatoru (və ya Bertozinin gərgin halqa metodu) vasitəsilə triazol halqası yaradaraq 100% dəqiqliklə birləşir. Hüceyrədə bu qruplarla başqa heç bir təbii maddə reaksiyaya girmir.",
        realWorldImpact: "Xərçəng hüceyrələrini dəqiq hədəfləyən 'ağıllı dərmanlar' (ADC preparatları), şiş qlikanlarının floresan işıqlandırılması.",
        curriculumConnection: "10-11-ci sinif Üzvi Kimyada 'Doymamış karbohidrogenlər', 'Funksional qruplar və birləşmə reaksiyaları' mövzuları ilə bağlıdır.",
        funFacts: [
          "Barri Şarpless tarixdə iki dəfə Kimya üzrə Nobel mükafatı alan cəmi iki alimdən biridir (digəri Frederik Sengerdir).",
          "Klik-kimyası təbiətdə milyon illərə başa gələn molekulyar quruculuğu bir neçə dəqiqəyə otaq temperaturunda icra edir."
        ]
      },
      en: {
        title: "Click Chemistry and Bioorthogonal Reactions",
        summary: "Snapping molecular building blocks together inside living cells like Lego bricks (2022 Nobel Prize in Chemistry).",
        ahaMoment: "Sharpless and Meldal discovered copper-catalyzed azide-alkyne cycloaddition; Bertozzi removed copper to operate safely inside living cells.",
        howItWorks: "Azides and alkynes react cleanly to form stable triazole linkages without interfering with native cellular biology.",
        realWorldImpact: "Targeted antibody-drug conjugates (ADCs) for cancer therapy and cellular glycan mapping.",
        curriculumConnection: "Directly relates to organic reaction functional groups and covalent bonding.",
        funFacts: [
          "Barry Sharpless is one of only two people to win two Nobel Prizes in Chemistry."
        ]
      },
      tr: {
        title: "Klik Kimyası ve Biyoortogonal Reaksiyonlar",
        summary: "Molekülleri canlı hücrelerde Lego gibi birbirine kenetleyen kimya ve 2022 Nobel Kimya Ödülü.",
        ahaMoment: "Bertozzi, bakır toksisitesi olmadan canlı hücre içi hedeflere kilitlenen reaksiyonlar geliştirdi.",
        howItWorks: "Azit ve alkin grupları hücrenin doğal kimyasına karışmadan birbirine bağlanarak triazol halkası kurar.",
        realWorldImpact: "Hedefe yönelik kanser kemoterapisi ve hücresel glikan haritalaması.",
        curriculumConnection: "Organik kimyada fonksiyonel gruplar ve katılma tepkimeleriyle tam örtüşür.",
        funFacts: [
          "Barry Sharpless iki kez Nobel Kimya Ödülü kazanan ikinci bilim insanıdır."
        ]
      },
      ru: {
        title: "Клик-химия и биоортогональные реакции",
        summary: "Сборка сложных молекул как кубиков Лего прямо внутри живых клеток (Нобелевская премия по химии 2022).",
        ahaMoment: "Бертоцци адаптировала реакцию Шарплесса для живых организмов, избавившись от токсичной меди с помощью циклического натяжения.",
        howItWorks: "Азиды и алкины селективно соединяются с образованием триазольного кольца, игнорируя окружающие белки и воду.",
        realWorldImpact: "Таргетные противоопухолевые препараты и визуализация углеводной оболочки раковых клеток.",
        curriculumConnection: "Курс органической химии: функциональные группы, реакции присоединения, полимеризация.",
        funFacts: [
          "Барри Шарплесс — один из двух ученых в истории, дважды удостоенных Нобелевской премии по химии."
        ]
      }
    },
    quiz: [
      {
        id: "click-q1",
        question: "Klik-kimyasının başlıca fəlsəfəsi və üstünlüyü nədir?",
        options: [
          { id: "A", text: "Molekulların yüksək təzyiqdə partladılması" },
          { id: "B", text: "Molekulyar blokların yan məhsul vermədən yüksək çıxımla bir-birinə 'şıqqıltı' ilə birləşməsi" },
          { id: "C", text: "Bütün üzvi maddələrin qeyri-üzvi duzlara çevrilməsi" },
          { id: "D", text: "Yalnız qızıl və platin katalizatorlarının tələb olunması" }
        ],
        correctOption: "B",
        explanation: "Klik-kimyası lego parçaları kimi bir-birinə asanlıqla bağlanan, arzuolunmaz yan məhsul yaratmayan və otaq temperaturunda gedən reaksiyalardır.",
        bloomLevel: "Anlama"
      },
      {
        id: "click-q2",
        question: "'Bioortoqonal reaksiya' anlayışı nəyi ifadə edir?",
        options: [
          { id: "A", text: "Canlı hüceyrə daxilində hüceyrənin təbii proseslərinə mane olmadan baş verən kimyəvi reaksiyanı" },
          { id: "B", text: "Fotosintez zamanı oksigenin ayrılmasını" },
          { id: "C", text: "Bakteriyaların antibiotikə qarşı müqavimətini" },
          { id: "D", text: "Qanın laxtalanmasını tam dayandıran prosesi" }
        ],
        correctOption: "A",
        explanation: "Bioortoqonal reaksiyalar hüceyrə mühitindəki zülal, su və lipidlərlə qarşılıqlı təsirə girmədən yalnız bir-biri ilə reaksiya verən zərərsiz reaksiyalardır.",
        bloomLevel: "Bilik"
      },
      {
        id: "click-q3",
        question: "Klassik klik reaksiyasında bir-biri ilə birləşən iki əsas funksional qrup hansılardır?",
        options: [
          { id: "A", text: "Azid və alkin" },
          { id: "B", text: "Yalnız xlor və flüor" },
          { id: "C", text: "Karboksil və spirt" },
          { id: "D", text: "Natrium və kükürd" }
        ],
        correctOption: "A",
        explanation: "Klassik Şarpless-Meldal klik reaksiyasında azid (-N3) və alkin (-C≡C-) qrupları birləşərək davamlı triazol halqası əmələ gətirir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "paleogenomics-ancient-dna",
    slug: "paleogenomics-neanderthal-ancient-dna-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2022,
      category: "Fiziologiya və ya Tibb",
      laureates: ["Svante Pääbo"],
      citation: "Nəsli kəsilmiş homininlərin genomları və insanın təkamülü ilə bağlı kəşflərə görə"
    },
    discoveryYear: 2010,
    discoverer: "Svante Pääbo",
    curriculumSubject: "Biologiya",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "İnsanın mənşəyi (Antropogenez), DNT ardıcıllığı və təkamül amilləri",
    icon: "Dna",
    accentColor: "from-stone-600 to-amber-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Paleogenomika: Neandertal DNT-si və İnsanın Əsl Əcdadları",
        summary: "On min illər əvvəl yaşamış neandertalların sümüklərindən DNT çıxararaq müasir insanın təkamül xəritəsini yenidən cızan elm sahəsi.",
        ahaMoment: "Alimlər hesab edirdilər ki, 40 000 illik sümüklərdə DNT tam parçalanır və bakteriya çirklənməsi səbəbindən onu oxumaq qeyri-mümkündür. Svante Pääbo xüsusi təmiz otaqlar və yeni sekvensiya metodları yaradaraq Neandertalın bütöv genomunu oxudu və sübut etdi ki, müasir Avrasiya insanlarının DNT-sinin 1-2%-i neandertallardan miras qalıb!",
        howItWorks: "Qədim sümüklərdən mikroqramlarla əldə edilən fraqmentlənmiş DNT təmizlənir, zədələnmiş sitozin-urasil mutasiyaları bioinformatik alqoritmlərlə düzəldilir və müasir insan genomu ilə müqayisə olunur.",
        realWorldImpact: "Denisov insanı adlı tamamilə yeni insan növü kəşf edildi. İmmunitet sistemimizin viruslara reaksiyası və yüksək dağlıq ərazilərdə yaşamaq genlərimizin (EPAS1) qədim insanlardan gəldiyi aşkarlandı.",
        curriculumConnection: "11-ci sinif Biologiyada 'Antropogenez: İnsanın təkamül mərhələləri' mövzusunun ən müasir elmi izahıdır.",
        funFacts: [
          "Svante Pääbonun atası Sune Berqström də 1982-ci ildə Nobel Tibb Mükafatı almışdı.",
          "Altay dağlarındakı Denisova mağarasında tapılan bircə kiçik uşaq barmaq sümüyü bəşəriyyət tarixinə yeni qardaş insan növü əlavə etdi."
        ]
      },
      en: {
        title: "Paleogenomics: Ancient DNA and Human Evolution",
        summary: "Sequencing Neanderthal and Denisovan genomes to uncover our evolutionary origins (2022 Nobel Prize in Physiology or Medicine).",
        ahaMoment: "Pääbo overcame extreme contamination to sequence 40,000-year-old Neanderthal DNA, proving ancient interbreeding with modern humans.",
        howItWorks: "Ultra-clean extraction protocols and computational deamination correction map highly fragmented ancient sequences.",
        realWorldImpact: "Discovered the Denisovans and revealed how archaic genes still influence human immunity and high-altitude adaptation.",
        curriculumConnection: "Crucial for teaching evolutionary biology, fossil records, and anthropogenesis.",
        funFacts: [
          "Most people of non-African descent carry 1-2% Neanderthal DNA."
        ]
      },
      tr: {
        title: "Paleogenomik: Neandertal DNA'sı ve İnsanın Kökeni",
        summary: "Antik kemiklerden DNA dizileyerek insan evrimini aydınlatan keşif ve 2022 Nobel Tıp Ödülü.",
        ahaMoment: "Pääbo, binlerce yıllık kemiklerden Neandertal genomunu çıkararak modern insanlarla melezleştiklerini kanıtladı.",
        howItWorks: "Bakteriyel kontaminasyonu filtreleyen biyoenformatik yöntemlerle fosil DNA parçaları birleştirildi.",
        realWorldImpact: "Denisova insanının keşfi ve bağışıklık sistemimizdeki antik gen mirasının anlaşılması.",
        curriculumConnection: "Biyoloji dersindeki evrim teorisi ve insanın kökeni kazanımlarıyla tam uyumludur.",
        funFacts: [
          "Svante Pääbo'nun babası da 1982'de Nobel Tıp Ödülü kazanmıştı."
        ]
      },
      ru: {
        title: "Палеогеномика: Древняя ДНК неандертальцев",
        summary: "Секвенирование генома вымерших гоминин и доказательство скрещивания с кроманьонцами (Нобелевская премия по медицине 2022).",
        ahaMoment: "Паабо разработал методику очистки разрушенной древней ДНК и прочитал геном неандертальца возрастом 40 000 лет.",
        howItWorks: "Ультрачистые лаборатории и биоинформатическая реконструкция фрагментов поврежденных нитей ДНК.",
        realWorldImpact: "Открытие денисовского человека и объяснение адаптаций людей к высокогорью и инфекциям.",
        curriculumConnection: "Школьный курс: антропогенез, эволюция человека, генетический анализ.",
        funFacts: [
          "1–2% генома современных европейцев и азиатов унаследовано от неандертальцев."
        ]
      }
    },
    quiz: [
      {
        id: "paleo-q1",
        question: "Svante Pääbonun tədqiqatları müasir insanlarla neandertallar haqqında hansı tarixi həqiqəti sübut etdi?",
        options: [
          { id: "A", text: "Neandertalların və müasir insanların tamamilə fərqli planetlərdən gəldiyini" },
          { id: "B", text: "Müasir qeyri-Afrika mənşəli insanların genomunda 1-2% Neandertal geninin olduğunu və onların qarışdığını" },
          { id: "C", text: "Neandertalların heç vaxt Yer üzündə yaşamadığını" },
          { id: "D", text: "DNT-nin sümük daxilində heç vaxt saxlanmadığını" }
        ],
        correctOption: "B",
        explanation: "Pääbonun sekvensiyası sübut etdi ki, Homo sapiens Afrikadan çıxdıqdan sonra Avrasiyada neandertallarla çarpazlaşmış və genetik iz saxlamışdır.",
        bloomLevel: "Anlama"
      },
      {
        id: "paleo-q2",
        question: "Qədim sümüklərdən DNT çıxarılarkən alimlərin qarşılaşdığı ən böyük çətinlik nə idi?",
        options: [
          { id: "A", text: "DNT-nin ifrat fraqmentləşməsi və müasir bakteriya/insan DNT-si ilə çirklənmə" },
          { id: "B", text: "Sümüklərin çox ağır olması" },
          { id: "C", text: "Rentgen şüalarının tapılmaması" },
          { id: "D", text: "DNT-nin yalnız maye halında mövcud olması" }
        ],
        correctOption: "A",
        explanation: "Min illər ərzində DNT qısa parçalara bölünür və ətrafdakı mikrobların DNT-si nümunənin 99%-ni təşkil edir.",
        bloomLevel: "Bilik"
      },
      {
        id: "paleo-q3",
        question: "Denisova mağarasında tapılmış barmaq sümüyünün genom analizindən hansı yeni növ aşkarlandı?",
        options: [
          { id: "A", text: "Avstralopitek" },
          { id: "B", text: "Denisov insanı (Denisovans)" },
          { id: "C", text: "Pitekantrop" },
          { id: "D", text: "Sinantrop" }
        ],
        correctOption: "B",
        explanation: "DNT analizi göstərdi ki, bu sümük nə Neandertala, nə də Homo sapiensə aiddir; tamamilə yeni insan qolu olan Denisov insanıdır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "climate-modeling-complex-systems",
    slug: "climate-modeling-complex-systems-physics-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2021,
      category: "Fizika",
      laureates: ["Syukuro Manabe", "Klaus Hasselmann", "Giorgio Parisi"],
      citation: "Yerin iqliminin fiziki modelləşdirilməsi və mürəkkəb nizamsız fiziki sistemlərin riyazi həllinə görə"
    },
    discoveryYear: 1967,
    discoverer: "Syukuro Manabe, Klaus Hasselmann və Giorgio Parisi",
    curriculumSubject: "Fizika / Coğrafiya",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Termodinamika, istilik balansı, istixana effekti və iqlim dəyişiklikləri",
    icon: "CloudSun",
    accentColor: "from-emerald-600 to-sky-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Yerin İqliminin Fiziki Modelləşdirilməsi və Mürəkkəb Sistemlər",
        summary: "Atmosferdə xaos və nizamsızlığın içində dəqiq fiziki qanunların tapılması: qlobal istiləşmənin riyazi sübutu.",
        ahaMoment: "Hava proqnozları bir neçə gündən sonra xaotikləşir. Bəs onilliklər sonrakı iqlimi necə proqnozlaşdırmaq olar? Syukuro Manabe 1960-cı illərdə ilk dəfə atmosferin şaquli hava axınlarını və radiasiya balansını birləşdirən kompüter modeli qurdu və sübut etdi ki, CO2 qatılığı iki dəfə artarsa, qlobal temperatur 2°C-dən çox yüksələcək.",
        howItWorks: "Hasselman təsadüfi hava dalğalanmalarını iqlim dəyişikliyindən ayıran stoxastik modellər qurdu; Parisi isə atom səviyyəsində nizamsız spin şüşələrində gizli nizamı riyazi tənliklərlə ifadə etdi.",
        realWorldImpact: "BMT İqlim Paneli (IPCC) hesabatlarının və bəşəriyyətin karbon emissiyasını azaltmaq qərarlarının elmi dayağı.",
        curriculumConnection: "9-cu sinif Coğrafiya və Fizikada 'Atmosferin istilik balansı', 'İstixana effekti' və 'Termodinamikanın qanunları' mövzularına daxildir.",
        funFacts: [
          "Manabenin 1967-ci ildə cəmi yarım meqabayt yaddaşlı primitiv kompüterdə qurduğu modelin nəticələri bugünkü superkompüterlərin nəticələri ilə demək olar ki, eynidir."
        ]
      },
      en: {
        title: "Earth's Climate Modeling and Complex Physical Systems",
        summary: "Physical modeling of Earth's climate and discovering hidden order in disorder (2021 Nobel Prize in Physics).",
        ahaMoment: "Manabe demonstrated that increasing atmospheric CO2 concentration directly increases Earth's surface temperature.",
        howItWorks: "Coupling radiative heat balance with vertical convective air currents in numerical thermodynamic models.",
        realWorldImpact: "Forms the scientific cornerstone of international climate policy and global warming assessments.",
        curriculumConnection: "Directly relates to secondary physics thermodynamics and environmental science.",
        funFacts: [
          "Manabe's 1967 calculations on early computers match modern multi-million-dollar supercomputer simulations."
        ]
      },
      tr: {
        title: "Dünya İkliminin Fiziksel Modellenmesi ve Karmaşık Sistemler",
        summary: "Kaosun içindeki düzen: küresel ısınmanın fiziksel kanıtı ve 2021 Nobel Fizik Ödülü.",
        ahaMoment: "Manabe, atmosferdeki karbondioksit artışının yüzey sıcaklığını nasıl artıracağını ilk kez formüle etti.",
        howItWorks: "Işınım dengesi ile dikey konveksiyon hava hareketlerini termodinamik denklemlerle simüle etti.",
        realWorldImpact: "Küresel iklim anlaşmalarının ve IPCC raporlarının bilimsel omurgası.",
        curriculumConnection: "Fizikte ısı transferi, sera etkisi ve açık sistemler müfredatıyla uyumludur.",
        funFacts: [
          "1967'deki ilk iklim modeli günümüzün devasa süper bilgisayarlarıyla neredeyse aynı tahminleri yapmıştı."
        ]
      },
      ru: {
        title: "Физическое моделирование климата Земли и сложные системы",
        summary: "Математическое доказательство глобального потепления и скрытые законы хаоса (Нобелевская премия по физике 2021).",
        ahaMoment: "Манабе доказал, что удвоение концентрации CO2 в атмосфере неизбежно приводит к росту глобальной температуры на 2+ градуса.",
        howItWorks: "Объединение уравнений лучистого теплообмена и конвекции воздушных масс в единую гидродинамическую модель.",
        realWorldImpact: "Научная база международных климатических соглашений и моделей устойчивого развития.",
        curriculumConnection: "Школьный курс: теплообмен, парниковый эффект, законы термодинамики.",
        funFacts: [
          "Модель Манабе 1967 года использовала компьютер с памятью всего 500 килобайт."
        ]
      }
    },
    quiz: [
      {
        id: "clim-q1",
        question: "İstixana effektinin fiziki mexanizmi nəyə əsaslanır?",
        options: [
          { id: "A", text: "Yer səthinin buraxdığı infraqırmızı istilik şüalarının atmosfer qazları tərəfindən udulub saxlanmasına" },
          { id: "B", text: "Günəş işığının atmosferdə tamamilə əks olunaraq kosmosa qayıtmasına" },
          { id: "C", text: "Okean suyunun sıxlığının artmasına" },
          { id: "D", text: "Ayın cazibə qüvvəsinin zəifləməsinə" }
        ],
        correctOption: "A",
        explanation: "Qısa dalğalı günəş şüaları atmosferdən keçib yeri qızdırır, lakin qızmış yerin buraxdığı uzun dalğalı infraqırmızı şüalar istixana qazları (CO2, H2O, CH4) tərəfindən tutulur.",
        bloomLevel: "Anlama"
      },
      {
        id: "clim-q2",
        question: "Syukuro Manabenin 1960-cı illərdə qurduğu modelin ən mühüm töhfəsi nə idi?",
        options: [
          { id: "A", text: "CO2 artımının atmosferin istilik balansına təsirini ilk dəfə dəqiq hesablaması" },
          { id: "B", text: "Kosmik gəmilər üçün yeni yanacaq kəşf etməsi" },
          { id: "C", text: "Zəlzələlərin dəqiq saatını deməsi" },
          { id: "D", text: "Qütb parıltısının səbəbini tapması" }
        ],
        correctOption: "A",
        explanation: "Manabe radiasiya və konveksiya balansını birləşdirərək CO2 artımının səth istiliyini necə qaldırdığını riyazi sübut etdi.",
        bloomLevel: "Bilik"
      },
      {
        id: "clim-q3",
        question: "Havanın gündəlik proqnozu ilə iqlim arasındakı başlıca fərq nədir?",
        options: [
          { id: "A", text: "Hava qısamüddətli xaotik dəyişikliklərdir, iqlim isə uzunmüddətli statistik orta göstəricidir" },
          { id: "B", text: "Hava yalnız qışda, iqlim isə yayda ölçülür" },
          { id: "C", text: "İqlim yalnız bir şəhəri əhatə edir" },
          { id: "D", text: "Heç bir fərq yoxdur" }
        ],
        correctOption: "A",
        explanation: "Hasselmann sübut etdi ki, qısamüddətli hava xaosu fonunda uzunmüddətli iqlim tendensiyaları dayanıqlı fiziki qanunlarla idarə olunur.",
        bloomLevel: "Təhlil"
      }
    ]
  },
  {
    id: "asymmetric-organocatalysis",
    slug: "asymmetric-organocatalysis-greener-chemistry-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2021,
      category: "Kimya",
      laureates: ["Benjamin List", "David W.C. MacMillan"],
      citation: "Asimmetrik orqanokatalizin inkişafına görə"
    },
    discoveryYear: 2000,
    discoverer: "Benjamin List və David MacMillan",
    curriculumSubject: "Kimya",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Katalizatorlar, kiral molekullar (enantiomerlər) və yaşıl kimya",
    icon: "FlaskConical",
    accentColor: "from-teal-600 to-green-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Asimmetrik Orqanokataliz: Təbiətdən İlhamlanan Yaşıl Kimya",
        summary: "Ağır və zəhərli metallara ehtiyac duymadan, sadə üzvi molekullarla kiral güzgü əksi olan dərman molekullarını sintez etmək.",
        ahaMoment: "İllər boyu kimyaçılar inanırdılar ki, katalizatorlar yalnız iki növdür: metallar və fermentlər. Metallar çox vaxt zəhərli və bahalı idi, fermentlər isə çox böyük və kövrək. 2000-ci ildə List və Makmillan bir-birindən xəbərsiz kəşf etdilər ki, adi prolin kimi kiçik üzvi amin turşuları mükəmməl katalizator kimi işləyir və molekulun yalnız bir güzgü tayını (lazımi enantiomeri) yaradır!",
        howItWorks: "Karbon karkasından ibarət kiçik kiral üzvi molekullar reaksiyaya girən maddələrlə müvəqqəti iminium ionları və ya enaminlər yaradaraq fəzada hücumu yalnız bir tərəfdən mümkün edir.",
        realWorldImpact: "Dərman preparatlarının istehsalında zəhərli ağır metallardan imtina edildi, sintez mərhələləri 10 dəfə qısaldı və yaşıl kimya erası başladı.",
        curriculumConnection: "10-cu sinif Kimya dərsliyində 'Kimyəvi reaksiyanın sürəti və katalizatorlar', 11-ci sinifdə 'Optik izomerlik və kiral karbon atomu' mövzularına dərindən inteqrasiya olunur.",
        funFacts: [
          "Talidomid faciəsi zamanı bir güzgü əksi sakitləşdirici, digəri isə şikəstlik yaradan molekul idi; asimmetrik kataliz məhz bu cür fəlakətlərin qarşısını alır."
        ]
      },
      en: {
        title: "Asymmetric Organocatalysis: Greener Molecular Construction",
        summary: "Using small organic molecules instead of toxic metals to build chiral pharmaceuticals (2021 Nobel Prize in Chemistry).",
        ahaMoment: "List and MacMillan independently proved that simple organic amino acids like proline drive asymmetric catalysis.",
        howItWorks: "Chiral organic catalysts reversibly activate substrates via iminium or enamine intermediates, steering stereo-selectivity.",
        realWorldImpact: "Dramatically reduces toxic heavy metal waste in pharmaceutical manufacturing and streamlines multistep drug synthesis.",
        curriculumConnection: "Perfect illustration of reaction kinetics, catalysis, and optical isomerism.",
        funFacts: [
          "Eliminates the danger of producing harmful enantiomers, solving the historical dilemma seen in the thalidomide tragedy."
        ]
      },
      tr: {
        title: "Asimetrik Organokataliz: Yeşil Kimya Devrimi",
        summary: "Zehirli metaller yerine küçük organik moleküllerle ayna görüntüsü kiral molekül sentezi ve 2021 Nobel Kimya Ödülü.",
        ahaMoment: "Prolin gibi basit bir amino asidin karmaşık enzimler gibi kusursuz bir kiral katalizör olabileceği kanıtlandı.",
        howItWorks: "Organik katalizör substratla geçici kovalent bağ kurarak reaksiyonu sadece tek bir optik izomer yönüne yönlendirir.",
        realWorldImpact: "Çevre dostu ilaç üretimi ve toksik metal atıklarının ortadan kaldırılması.",
        curriculumConnection: "Katalizör mekanizmaları, tepkime hızı ve optik izomerlik müfredatıyla tam uyumludur.",
        funFacts: [
          "Talidomid gibi ayna görüntüsü zehirli olan ilaçların güvenli üretilmesini sağlar."
        ]
      },
      ru: {
        title: "Асимметричный органокатализ",
        summary: "Создание зеркальных молекул с помощью безвредных органических катализаторов (Нобелевская премия по химии 2021).",
        ahaMoment: "Лист и Макмиллан доказали, что обычные аминокислоты способны работать эффективнее токсичных тяжелых металлов.",
        howItWorks: "Хиральная органическая молекула направляет присоединение строго с одной стороны, образуя нужный энантиомер.",
        realWorldImpact: "Экологичный синтез лекарств и предотвращение трагедий, связанных с токсичными оптическими изомерами.",
        curriculumConnection: "Школьный курс химии: скорость реакций, катализ, оптическая изомерия и хиральность.",
        funFacts: [
          "Исключает риск образования вредного энантиомера, как это произошло в печально известной талидомидовой трагедии."
        ]
      }
    },
    quiz: [
      {
        id: "organo-q1",
        question: "Asimmetrik sintezin əsas məqsədi nədir?",
        options: [
          { id: "A", text: "Molekulun iki güzgü əksindən (enantiomerindən) yalnız bir arzuolunan formasını almaq" },
          { id: "B", text: "Bütün molekulları qaz halına salmaq" },
          { id: "C", text: "Reaksiyanın temperaturunu 1000 dərəcəyə çatdırmaq" },
          { id: "D", text: "Katalizatoru tam məhv etmək" }
        ],
        correctOption: "A",
        explanation: "Kiral molekulların güzgü əksləri canlı orqanizmdə fərqli təsir göstərir; asimmetrik kataliz yalnız faydalı enantiomeri sintez edir.",
        bloomLevel: "Anlama"
      },
      {
        id: "organo-q2",
        question: "Orqanokatalizatorların ənənəvi metal katalizatorlardan üstünlüyü nədir?",
        options: [
          { id: "A", text: "Zəhərli ağır metal qalıqları buraxmaması və ucuz, yaşıl kimyaya uyğun olması" },
          { id: "B", text: "Yalnız qızıldan hazırlanması" },
          { id: "C", text: "Reaksiyanı 100 dəfə zəiflətməsi" },
          { id: "D", text: "Havanı dərhal çirkləndirməsi" }
        ],
        correctOption: "A",
        explanation: "Sadə üzvi molekullar (məs. karbon, azot, hidrogen əsaslı) təbiətdə bol tapılır, toksik deyil və ətraf mühitə zərər vermir.",
        bloomLevel: "Bilik"
      },
      {
        id: "organo-q3",
        question: "Kimyəvi reaksiyalarda katalizatorun rolu hansı variantda düzgün ifadə edilib?",
        options: [
          { id: "A", text: "Reaksiyanın aktivləşmə enerjisini azaldaraq onu sürətləndirir, özü isə sərf olunmur" },
          { id: "B", text: "Reaksiya məhsullarının kütləsini iki dəfə artırır" },
          { id: "C", text: "Sistemdə istiliyi tamamilə yox edir" },
          { id: "D", text: "Reaksiyanın getməsinə mane olur" }
        ],
        correctOption: "A",
        explanation: "Katalizator alternativ aşağı enerjili reaksiya yolu yaradır, aktivləşmə enerjisini endirir və reaksiya sonunda dəyişməz qalır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "temperature-touch-receptors",
    slug: "temperature-touch-receptors-trpv1-piezo-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2021,
      category: "Fiziologiya və ya Tibb",
      laureates: ["David Julius", "Ardem Patapoutian"],
      citation: "Temperatur və toxunma reseptorlarının kəşfinə görə"
    },
    discoveryYear: 1997,
    discoverer: "David Julius və Ardem Patapoutian",
    curriculumSubject: "Biologiya",
    curriculumGrade: "8-9-cu sinif",
    curriculumTopic: "Sinir sistemi, duyğu orqanları, ion kanalları və qıcıqlanma",
    icon: "Flame",
    accentColor: "from-orange-500 to-red-600",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "İstilik, Soyuq və Toxunma Reseptorları (TRPV1 və Piezo)",
        summary: "Acı istiotun yandırma hissi və dərinin toxunuşu: bədənimizin dünyanı hiss etməsini təmin edən molekulyar açarlar.",
        ahaMoment: "Acı qırmızı bibər yeyəndə dilimiz niyə qaynar çay içmiş kimi yanır? Devid Culyus bibərdəki kapsaisin maddəsindən istifadə edərək 43°C-dən yuxarı zərərli istiliyə cavab verən TRPV1 ion kanalını kəşf etdi! Ardem Pataputian isə hüceyrəyə təzyiq edildikdə açılan Piezo1 və Piezo2 mexaniki reseptorlarını tapdı.",
        howItWorks: "İstilik və ya mexaniki təzyiq ion kanalının zülal konfiqurasiyasını dəyişir. Kanal açılır, hüceyrəyə kalsium və natrium ionları axır, sinir impulsu yaranır və beyinə 'isti' və ya 'toxunuş' siqnalı çatır.",
        realWorldImpact: "Xroniki ağrıların yeni nəsil asılılıq yaratmayan dərmanlarla müalicəsi, təzyiqin tənzimlənməsi və iflic xəstələri üçün hissiyatlı protez əllərin yaradılması.",
        curriculumConnection: "8-ci sinif Biologiyada 'Duyğu orqanları və Dəri analizatoru', 'Sinir impulsu və refleks qövsü' mövzularına tam uyğundur.",
        funFacts: [
          "Nanənin verdiyi sərinlik hissi də mentolun TRPM8 adlı soyuq reseptorunu aldatması nəticəsində baş verir.",
          "Piezo kanalları sidik kisəmizin dolduğunu və ya qan damarlarımızın nə dərəcədə gərildiyini də beynimizə xəbər verir."
        ]
      },
      en: {
        title: "Temperature and Touch Receptors: TRPV1 and Piezo",
        summary: "Discovering the molecular sensors that enable us to feel heat, cold, and mechanical pressure (2021 Nobel Prize in Physiology or Medicine).",
        ahaMoment: "Julius used chili pepper capsaicin to clone TRPV1; Patapoutian poked cells with micropipettes to discover pressure-activated Piezo channels.",
        howItWorks: "Heat or force mechanically flexes ion channel gates, allowing calcium and sodium influx that sparks action potentials.",
        realWorldImpact: "Revolutionizes non-opioid chronic pain treatments and bionic touch-sensitive prosthetic limbs.",
        curriculumConnection: "Core sensory biology, cutaneous receptors, and nerve impulse generation.",
        funFacts: [
          "Menthol feels cold because it binds to the same TRPM8 receptor activated by freezing temperatures."
        ]
      },
      tr: {
        title: "Sıcaklık ve Dokunma Reseptörleri: TRPV1 ve Piezo",
        summary: "Acı biberin yakıcılığından dokunma hissine: çevremizi algılayan moleküler sensörler ve 2021 Nobel Tıp Ödülü.",
        ahaMoment: "Kapsaisin molekülüyle ısı kanalı TRPV1 bulundu; mikropipetle basınca duyarlı Piezo kanalları keşfedildi.",
        howItWorks: "Fiziksel gerilim veya ısı iyon kanalını açar, sodyum/kalsiyum akışı aksiyon potansiyeli başlatır.",
        realWorldImpact: "Bağımlılık yapmayan ağrı kesiciler ve hissettiren biyonik protezler.",
        curriculumConnection: "Duyu organları, deri duyusu ve nöronlarda impuls iletimi kazanımlarıyla uyumludur.",
        funFacts: [
          "Nanenin serinlik vermesi, mentolün soğuk reseptörü TRPM8'i kandırmasından kaynaklanır."
        ]
      },
      ru: {
        title: "Рецепторы температуры и осязания: TRPV1 и Piezo",
        summary: "Как нервная система преобразует тепло, холод и механическое давление в электрические импульсы (Нобелевская премия по медицине 2021).",
        ahaMoment: "Джулиус выделил рецептор тепла с помощью капсаицина из жгучего перца, а Патапутян нашел каналы реакции на механическое давление.",
        howItWorks: "Температура или сжатие открывают пору ионного канала, вызывая деполяризацию мембраны и нервный импульс.",
        realWorldImpact: "Лечение хронической боли без опиоидов и создание чувствительных бионических протезов.",
        curriculumConnection: "Школьный курс: анализаторы, рецепторы кожи, проведение нервного импульса.",
        funFacts: [
          "Мята кажется холодной потому, что ментол активирует тот же рецептор TRPM8, что и реальный мороз."
        ]
      }
    },
    quiz: [
      {
        id: "trp-q1",
        question: "Acı bibər yediyimiz zaman yaranan yanma hissi hansı səbəbdən baş verir?",
        options: [
          { id: "A", text: "Bibərdəki kapsaisin maddəsinin yüksək temperatura cavabdeh olan TRPV1 reseptorunu aktivləşdirməsi" },
          { id: "B", text: "Dildə həqiqi alovun yaranması" },
          { id: "C", text: "Tüpürcək vəzilərinin tam quruması" },
          { id: "D", text: "Mədə turşusunun qana qarışması" }
        ],
        correctOption: "A",
        explanation: "Kapsaisin kimyəvi olaraq 43°C-dən yuxarı istiliyə həssas olan TRPV1 ion kanalına bağlanaraq beyinə yalançı yanma xəbərdarlığı göndərir.",
        bloomLevel: "Anlama"
      },
      {
        id: "trp-q2",
        question: "Dəriyə mexaniki toxunuş və təzyiq hissini təmin edən Piezo kanalları hüceyrədə hansı funksiyanı yerinə yetirir?",
        options: [
          { id: "A", text: "Hüceyrə membranında mexaniki gərilmə zamanı ionların keçidinə yol açan qapı kimi açılır" },
          { id: "B", text: "Zülalları amin turşularına parçalayır" },
          { id: "C", text: "Fotosintez aparır" },
          { id: "D", text: "Yalnız qırmızı qan hüceyrələrində oksigen daşıyır" }
        ],
        correctOption: "A",
        explanation: "Piezo zülalları qüvvə təsirindən formalarını dəyişir və mexaniki enerjini elektrik ion axınına çevirir.",
        bloomLevel: "Bilik"
      },
      {
        id: "trp-q3",
        question: "Reseptorlar tərəfindən qəbul edilən xarici qıcıq sinir sistemində nəyə çevrilir?",
        options: [
          { id: "A", text: "Elektrik (sinir) impulsuna" },
          { id: "B", text: "İşıq dalğasına" },
          { id: "C", text: "Mexaniki səsə" },
          { id: "D", text: "Hüceyrə nüvəsinə" }
        ],
        correctOption: "A",
        explanation: "Bütün reseptorların əsas vəzifəsi xarici qıcığı (istilik, işıq, mexaniki təzyiq) sinir uclarında elektrik fəaliyyət potensialına çevirməkdir.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "black-holes-relativity",
    slug: "black-hole-formation-general-relativity-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2020,
      category: "Fizika",
      laureates: ["Roger Penrose", "Reinhard Genzel", "Andrea Ghez"],
      citation: "Qara dəliklərin yaranmasının ümumi nisbilik nəzəriyyəsinin birbaşa nəticəsi olduğunu sübut etdiyinə və qalaktikamızın mərkəzində ifrat kütləli qara dəliyin kəşfinə görə"
    },
    discoveryYear: 1965,
    discoverer: "Roger Penrose, Reinhard Genzel və Andrea Ghez",
    curriculumSubject: "Fizika / Astronomiya",
    curriculumGrade: "9-11-ci sinif",
    curriculumTopic: "Ümumdünya cazibə qanunu, qravitasiya sahəsi, işıq sürəti və astrofizika",
    icon: "Orbit",
    accentColor: "from-violet-900 to-slate-900",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "Qara Dəliklər və Ümumi Nisbilik Nəzəriyyəsi",
        summary: "Kainatın heç nəyin, hətta işığın belə qaça bilmədiyi ən sirli cazibə canavarları və Süd Yolu qalaktikamızın qəlbindəki gizli nəhəng.",
        ahaMoment: "Albert Eynşteyn özü belə qara dəliklərin real fiziki obyekti deyil, sadəcə nəzəri riyazi anomaliya olduğuna inanırdı. 1965-ci ildə Rocer Penrouz yeni topoloji riyaziyyat yaradaraq sübut etdi ki, kütləvi ulduz sönəndə qara dəliklərin yaranması qaçılmazdır. Qenzel və Gez isə 30 il ərzində qalaktikamızın mərkəzindəki ulduzları izləyərək orada 4 milyon Günəş kütləsində bir qara dəliyin olduğunu faktiki sübut etdilər!",
        howItWorks: "Hədsiz sıxılmış maddə fəza-zamanı o dərəcədə əyir ki, hadisələr üfüqü daxilində ikinci kosmik sürət işıq sürətini (300 000 km/s) aşır. Mərkəzdə isə cazibə qüvvəsinin sonsuzluğa çatdığı qravitasiya sinqulyarlığı yaranır.",
        realWorldImpact: "Fəza-zamanın təbiətinin anlaşılması, kosmik naviqasiya və kvant qravitasiyası nəzəriyyələrinin sınağı.",
        curriculumConnection: "9-cu sinif Fizikada 'Ümumdünya cazibə qanunu', 'Kosmik sürətlər' və 11-ci sinifdə 'Nisbilik nəzəriyyəsinin əsasları' mövzularına tam aiddir.",
        funFacts: [
          "Əgər Yer kürəsini qara dəliyə çevirmək istəsəydik, onun bütün kütləsini cəmi 9 millimetrlik noxud dənəsi boyda sıxmaq lazım gələrdi.",
          "Andrea Ghez Fizika üzrə Nobel mükafatı qazanan dördüncü qadın alimdir."
        ]
      },
      en: {
        title: "Black Hole Formation and Galactic Centers",
        summary: "Proving black holes are a robust prediction of general relativity and discovering the monster at our galaxy's center (2020 Nobel Prize in Physics).",
        ahaMoment: "Penrose proved singularity formation is inevitable; Genzel and Ghez tracked star orbits around Sagittarius A* for decades.",
        howItWorks: "Extreme mass density curves spacetime beyond the escape threshold of light, generating an event horizon and central singularity.",
        realWorldImpact: "Validates extreme gravitational physics, drives astronomical infrared imaging, and advances quantum gravity models.",
        curriculumConnection: "Directly extends Newton's gravity, escape velocities, and relativistic physics.",
        funFacts: [
          "To turn Earth into a black hole, you would have to compress it to the size of a marble (9 mm)."
        ]
      },
      tr: {
        title: "Kara Deliklerin Oluşumu ve Galaksi Merkezleri",
        summary: "Genel göreliliğin en uç tahmini ve Samanyolu'nun merkezindeki süper kütleli kara delik (2020 Nobel Fizik Ödülü).",
        ahaMoment: "Penrose tekillik teoremini geliştirdi; Ghez ve Genzel Samanyolu merkezindeki Sagittarius A*'nın varlığını kanıtladı.",
        howItWorks: "Maddenin aşırı yoğunlaşması uzay-zamanı bükerek kaçış hızının ışık hızını aştığı olay ufkunu doğurur.",
        realWorldImpact: "Astrofizik gözlem teknolojisi ve yerçekimi dalgası araştırmalarına temel oluşturdu.",
        curriculumConnection: "Kütleçekim kanunu, kaçış hızı ve genel görelilik kazanımlarıyla tam uyumludur.",
        funFacts: [
          "Dünya bir kara delik olsaydı çapı yalnızca 9 milimetre olurdu."
        ]
      },
      ru: {
        title: "Образование черных дыр и центр галактики",
        summary: "Доказательство неизбежности черных дыр в теории относительности и открытие монстра в центре Млечного Пути (Нобелевская премия по физике 2020).",
        ahaMoment: "Пенроуз математически доказал неизбежность сингулярности, а Гензель и Гез 30 лет отслеживали орбиты звезд вокруг Стрельца А*.",
        howItWorks: "Сверхмассивная плотность искривляет пространство-время так, что вторая космическая скорость превышает скорость света.",
        realWorldImpact: "Проверка пределов общей теории относительности и понимание эволюции галактик.",
        curriculumConnection: "Школьный курс: закон всемирного тяготения, космические скорости, теория относительности.",
        funFacts: [
          "Чтобы Земля стала черной дырой, ее нужно сжать до размера шарика диаметром 9 миллиметров."
        ]
      }
    },
    quiz: [
      {
        id: "bh-q1",
        question: "Qara dəliyin 'hadisələr üfüqü' (event horizon) nəyi bildirir?",
        options: [
          { id: "A", text: "Qara dəliyin qaz buludunu" },
          { id: "B", text: "Artıq heç bir maddənin və işığın qaça bilmədiyi geri dönüşü olmayan sərhədi" },
          { id: "C", text: "Ulduzun partladığı anı" },
          { id: "D", text: "Yalnız infraqırmızı işığın keçdiyi şüşəni" }
        ],
        correctOption: "B",
        explanation: "Hadisələr üfüqünün daxilində cazibədən qurtulmaq üçün tələb olunan sürət işıq sürətindən böyük olduğu üçün heç bir siqnal kənara çıxa bilmir.",
        bloomLevel: "Anlama"
      },
      {
        id: "bh-q2",
        question: "Qalaktikamızın (Süd Yolu) mərkəzində yerləşən ifrat kütləli qara dəliyin adı nədir?",
        options: [
          { id: "A", text: "Sagittarius A* (Oxatan A*)" },
          { id: "B", text: "Andromeda X" },
          { id: "C", text: "Sirius B" },
          { id: "D", text: "Betelgeyze" }
        ],
        correctOption: "A",
        explanation: "Süd Yolunun mərkəzində təxminən 4 milyon Günəş kütləsinə bərabər olan superkütləli qara dəlik Sagittarius A* adlanır.",
        bloomLevel: "Bilik"
      },
      {
        id: "bh-q3",
        question: "Qara dəliklərin yaxınlığında zamanın axışı müşahidəçiyə nəzərən necə dəyişir?",
        options: [
          { id: "A", text: "Güclü qravitasiya sahəsində zaman ləngiyir (yavaşlayır)" },
          { id: "B", text: "Zaman sonsuz sürətlə irəli gedir" },
          { id: "C", text: "Zaman geriyə axmağa başlayır" },
          { id: "D", text: "Heç bir dəyişiklik baş vermir" }
        ],
        correctOption: "A",
        explanation: "Eynşteynin ümumi nisbilik nəzəriyyəsinə görə qravitasiya potensialı nə qədər güclüdürsə, həmin nöqtədə zaman kənar müşahidəçiyə nəzərən bir o qədər yavaş axır.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "lithium-ion-battery-revolution",
    slug: "lithium-ion-battery-revolution-chemistry-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2019,
      category: "Kimya",
      laureates: ["John B. Goodenough", "M. Stanley Whittingham", "Akira Yoshino"],
      citation: "Litium-ion batareyalarının inkişafına görə"
    },
    discoveryYear: 1985,
    discoverer: "Goodenough, Whittingham və Yoshino",
    curriculumSubject: "Kimya / Fizika",
    curriculumGrade: "8-10-cu sinif",
    curriculumTopic: "Elektrokimya, oksidləşmə-reduksiya, qalvanik elementlər və akkumulyatorlar",
    icon: "BatteryCharging",
    accentColor: "from-lime-500 to-emerald-700",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Litium-İon Batareyaları: Simsiz və Daşına Bilən Dünya",
        summary: "Smartfonlarımızı, noutbuklarımızı və elektromobilləri hərəkətə gətirən təkrar doldurulan enerji möcüzəsi.",
        ahaMoment: "1970-ci illərin neft böhranı dövründə Uittinqhem litiumun ən yüngül metal olaraq böyük elektrokimyəvi potensiala malik olduğunu göstərdi. Qudenaf katod kimi kobalt oksidini istifadə edərək gərginliyi ikiqat artırdı (4V), Yoşino isə partlama təhlükəsi olan metal litium əvəzinə təhlükəsiz neft koksundan (karbon) anod yaradaraq ilk ticarət batareyasını düzəltdi.",
        howItWorks: "Doldurulma zamanı litium ionları katoddan anoda axır və karbon layları arasında toplanır (interkalyasiya). Boşalma zamanı isə ionlar geriyə, katoda qayıdır və xarici dövrəyə elektronlar axaraq elektrik cərəyanı yaradır.",
        realWorldImpact: "Fosil yanacaqlardan asılılığın azaldılması, elektrikli avtomobillər (Tesla və s.), günəş və külək enerjisinin saxlanması.",
        curriculumConnection: "8-9-cu sinif Kimyada 'Oksidləşmə-reduksiya reaksiyaları', 'Qalvanik elementlər', 8-ci sinif Fizikada 'Elektrik cərəyanı mənbələri' mövzularına birbaşa aiddir.",
        funFacts: [
          "Con Qudenaf 97 yaşında Nobel mükafatı alaraq tarixin ən yaşlı Nobel laureatı oldu.",
          "Litium o qədər yüngül metaldır ki, adi suda belə batmır, üzür (sıxlığı 0.53 q/sm³)."
        ]
      },
      en: {
        title: "Lithium-Ion Batteries: Powering the Wireless World",
        summary: "Developing rechargeable lightweight batteries that power portable electronics and electric vehicles (2019 Nobel Prize in Chemistry).",
        ahaMoment: "Whittingham pioneered intercalation; Goodenough doubled cell voltage using cobalt oxide; Yoshino made it safe with carbonaceous anodes.",
        howItWorks: "Lithium ions shuttle reversibly between anode and cathode lattices without destructive chemical phase changes.",
        realWorldImpact: "Drives smartphones, laptops, energy grids, and the global electric vehicle transition.",
        curriculumConnection: "Core redox electrochemistry, galvanic cells, and rechargeable storage systems.",
        funFacts: [
          "John Goodenough received the Nobel Prize at 97, becoming the oldest laureate in history."
        ]
      },
      tr: {
        title: "Lityum İyon Piller: Kablosuz Dünyanın Enerjisi",
        summary: "Akıllı telefonları ve elektrikli araçları mümkün kılan şarj edilebilir batarya devrimi ve 2019 Nobel Kimya Ödülü.",
        ahaMoment: "Metalik lityumun patlama riskini petrol koku kullanarak çözen Yoshino, Goodenough'un yüksek voltajlı katodunu ticarileştirdi.",
        howItWorks: "Lityum iyonları şarj ve deşarj sırasında anot ve katot atom kafesleri arasında ileri geri akar (interkalasyon).",
        realWorldImpact: "Fosil yakıtsız toplum vizyonu, elektrikli araçlar ve yenilenebilir enerji depolaması.",
        curriculumConnection: "Kimyadaki redoks tepkimeleri ve elektrokimyasal piller kazanımlarıyla birebir örtüşür.",
        funFacts: [
          "John Goodenough 97 yaşında Nobel alarak tarihin en yaşlı Nobel kazananı oldu."
        ]
      },
      ru: {
        title: "Литий-ионные аккумуляторы",
        summary: "Создание перезаряжаемых батарей, изменивших мир портативной электроники и электромобилей (Нобелевская премия по химии 2019).",
        ahaMoment: "Гуденаф использовал оксид кобальта, удвоив напряжение до 4 Вольт, а Ёсино заменил взрывоопасный чистый литий углеродом.",
        howItWorks: "Ионы лития обратимо внедряются в кристаллическую решетку графита и оксида металла без деградации электродов.",
        realWorldImpact: "Смартфоны, ноутбуки, безуглеродный транспорт и аккумуляция солнечной энергии.",
        curriculumConnection: "Школьный курс: окислительно-восстановительные реакции, гальванические элементы, химические источники тока.",
        funFacts: [
          "Джон Гуденаф получил Нобелевскую премию в возрасте 97 лет — абсолютный рекорд в истории."
        ]
      }
    },
    quiz: [
      {
        id: "li-q1",
        question: "Litium-ion batareyasının doldurulması zamanı litium ionları hansı istiqamətdə hərəkət edir?",
        options: [
          { id: "A", text: "Katoddan anoda doğru" },
          { id: "B", text: "Anoddan katoda doğru" },
          { id: "C", text: "Hərəkət etmir, yerində donur" },
          { id: "D", text: "Qaz halına keçib batareyadan çıxır" }
        ],
        correctOption: "A",
        explanation: "Batareya doldurulan zaman xarici gərginlik hesabına litium ionları katoddan ayrılaraq anodun qrafit qatlarına daxil olur.",
        bloomLevel: "Anlama"
      },
      {
        id: "li-q2",
        question: "Niyə batareyalarda digər metallar əvəzinə məhz litium metaldan istifadə edilir?",
        options: [
          { id: "A", text: "Ən yüngül metal olduğu və yüksək elektrokimyəvi potensiala malik olduğu üçün" },
          { id: "B", text: "Ən ağır və ən ucuz metal olduğu üçün" },
          { id: "C", text: "Yalnız qaranlıqda işlədiyi üçün" },
          { id: "D", text: "Heç vaxt elektrik keçirmədiyi üçün" }
        ],
        correctOption: "A",
        explanation: "Litium ən yüngül metaldır (dövri cədvəldə 3-cü element) və elektronunu ən asan verən yüksək enerjili elementdir.",
        bloomLevel: "Bilik"
      },
      {
        id: "li-q3",
        question: "Qalvanik elementdə boşalma zamanı anodda hansı proses baş verir?",
        options: [
          { id: "A", text: "Oksidləşmə (elektronların verilməsi)" },
          { id: "B", text: "Reduksiya (elektronların qəbulu)" },
          { id: "C", text: "Nüvə parçalanması" },
          { id: "D", text: "Fotosintez" }
        ],
        correctOption: "A",
        explanation: "Boşalma zamanı anod mənfi qütbdür və orada maddə oksidləşərək elektronlarını xarici dövrəyə ötürür.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "gravitational-waves-ligo",
    slug: "gravitational-waves-spacetime-ripples-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2017,
      category: "Fizika",
      laureates: ["Rainer Weiss", "Barry C. Barish", "Kip S. Thorne"],
      citation: "LIGO detektoru və qravitasiya dalğalarının qeydə alınmasına həlledici töhfələrə görə"
    },
    discoveryYear: 2015,
    discoverer: "LIGO kollaborasiyası (Weiss, Barish, Thorne)",
    curriculumSubject: "Fizika",
    curriculumGrade: "10-11-ci sinif",
    curriculumTopic: "Dalğa fizikası, interferensiya, lazerlər və fəza-zaman əyilməsi",
    icon: "Radio",
    accentColor: "from-blue-700 to-indigo-950",
    readTime: "7 dəq",
    translations: {
      az: {
        title: "Qravitasiya Dalğaları: Fəza-Zaman Qırışlarının Eşidilməsi",
        summary: "Eynşteynin 100 il əvvəlki nəzəri proqnozunun təsdiqi: iki nəhəng qara dəliyin toqquşmasından yaranan fəza dalğalarının Yer kürəsində tutulması.",
        ahaMoment: "1916-cı ildə Eynşteyn fəza-zamanın elastik parça kimi dalğalana biləcəyini hesablamış, lakin bu dalğaların atom nüvəsindən min dəfə kiçik titrəmə yaradacağı üçün heç vaxt ölçülə bilməyəcəyini düşünmüşdü. 14 sentyabr 2015-ci ildə 4 kilometrlik lazer interferometri (LIGO) 1.3 milyard işıq ili uzaqlıqda toqquşan iki qara dəliyin fəzada yaratdığı qırışı proton radiusundan 10 000 dəfə kiçik dəqiqliklə qeydə aldı!",
        howItWorks: "L-şəkilli 4 km-lik iki vakuum borusu boyu lazer şüaları buraxılır. Qravitasiya dalğası keçəndə qolların birini sıxır, digərini uzadır. Şüalar yenidən qovuşduqda interferensiya mənzərəsi dəyişir və dalğa qeydə alınır.",
        realWorldImpact: "Astronomiyada 'qravitasiya qulağı' açıldı: elektromaqnit şüalanması buraxmayan qara dəliklər və neyron ulduzları artıq birbaşa eşidilir.",
        curriculumConnection: "10-cu sinif Fizikada 'Mexaniki və elektromaqnit dalğalar', 11-ci sinifdə 'İşığın interferensiyası və Maykelson interferometri' mövzularına dərindən bağlıdır.",
        funFacts: [
          "Toqquşan iki qara dəlik cəmi saniyənin onda birində 3 Günəş kütləsinə bərabər saf enerjini qravitasiya dalğalarına çevirdi – bu, həmin an bütün Kainatdakı ulduzların ümumi parlaqlığından çox idi!"
        ]
      },
      en: {
        title: "Gravitational Waves: Ripples in Spacetime",
        summary: "First observation of gravitational waves from colliding black holes 1.3 billion light-years away (2017 Nobel Prize in Physics).",
        ahaMoment: "Einstein predicted spacetime ripples in 1916 but doubted they could ever be measured. LIGO measured displacements smaller than a proton.",
        howItWorks: "Laser interferometry measures differential arm length changes caused by passing tensor spacetime perturbations.",
        realWorldImpact: "Inaugurated gravitational wave astronomy, allowing direct observation of black hole and neutron star mergers.",
        curriculumConnection: "Exemplifies wave propagation, laser interferometry, and relativistic astrophysics.",
        funFacts: [
          "LIGO measured a stretch and squeeze smaller than 1/10,000th the width of a proton."
        ]
      },
      tr: {
        title: "Kütleçekim Dalgaları: Uzay-Zaman Dalgalanmaları",
        summary: "1.3 milyar ışık yılı uzaktaki kara delik çarpışmasının Dünya'da lazerlerle duyulması ve 2017 Nobel Fizik Ödülü.",
        ahaMoment: "Einstein'ın 100 yıllık tahmininin proton çapının on binde biri hassasiyetindeki lazer interferometresiyle kanıtlanması.",
        howItWorks: "LIGO'nun 4 kilometrelik kolları arasından geçen dalga uzayı bükerek lazer girişim desenini değiştirir.",
        realWorldImpact: "Elektromanyetik dalgalarla görülemeyen karanlık evren olaylarının 'dinlenmesini' sağlayan yeni astronomi çağı.",
        curriculumConnection: "Dalga teorisi, ışık girişimi ve Michelson interferometresi kazanımlarıyla birebir örtüşür.",
        funFacts: [
          "İki kara deliğin birleşme anında yaydığı enerji, o anda tüm evrendeki yıldızların ışığından daha büyüktü."
        ]
      },
      ru: {
        title: "Гравитационные волны: рябь пространства-времени",
        summary: "Первая регистрация гравитационных волн от слияния черных дыр детектором LIGO (Нобелевская премия по физике 2017).",
        ahaMoment: "Спустя 100 лет после предсказания Эйнштейна физики измерили колебания детектора величиной менее 1/10 000 диаметра протона.",
        howItWorks: "Лазерный интерферометр фиксирует микроскопические изменения длины 4-километровых плеч при прохождении гравитационной волны.",
        realWorldImpact: "Рождение гравитационно-волновой астрономии: ученые научились «слышать» космические катастрофы во Вселенной.",
        curriculumConnection: "Школьный курс: волновая оптика, интерференция света, гравитационное поле.",
        funFacts: [
          "В момент слияния мощность гравитационного излучения превышала светимость всех звезд наблюдаемой Вселенной."
        ]
      }
    },
    quiz: [
      {
        id: "gw-q1",
        question: "Qravitasiya dalğaları nədir və onlar hansı sürətlə yayılır?",
        options: [
          { id: "A", text: "Fəza-zaman qırışlarıdır və vakuumda işıq sürəti ilə yayılır" },
          { id: "B", text: "Sadə səs dalğalarıdır və havanın sürəti ilə yayılır" },
          { id: "C", text: "Yalnız su dalğalarıdır" },
          { id: "D", text: "Sonsuz sürətlə anında yayılan maqnit qütbləridir" }
        ],
        correctOption: "A",
        explanation: "Qravitasiya dalğaları kütlələrin təcilli hərəkəti nəticəsində fəza-zaman həndəsəsində yaranan dalğalanmalardır və vakuumda c=300 000 km/s sürətlə hərəkət edir.",
        bloomLevel: "Anlama"
      },
      {
        id: "gw-q2",
        question: "LIGO rəsədxanasında qravitasiya dalğasını qeydə almaq üçün hansı optik hadisədən istifadə olunur?",
        options: [
          { id: "A", text: "Lazer şüalarının interferensiyası" },
          { id: "B", text: "İşığın tam daxili qayıtması" },
          { id: "C", text: "İstiliyin konveksiyası" },
          { id: "D", text: "Güzgünün buxarlanması" }
        ],
        correctOption: "A",
        explanation: "Maykelson interferometri prinsipində işləyən LIGO lazer şüalarını iki perpendikulyar qola bölür; qolun uzunluğu dəyişəndə şüaların interferensiyasında faza fərqi yaranır.",
        bloomLevel: "Bilik"
      },
      {
        id: "gw-q3",
        question: "LIGO tərəfindən qeydə alınan ilk siqnal hansı kosmik hadisə nəticəsində yaranmışdı?",
        options: [
          { id: "A", text: "İki qara dəliyin toqquşaraq birləşməsi" },
          { id: "B", text: "Ayın Günəşin qarşısını kəsməsi" },
          { id: "C", text: "Kometa partlayışı" },
          { id: "D", text: "Yerin öz oxu ətrafında fırlanması" }
        ],
        correctOption: "A",
        explanation: "İlk siqnal (GW150914) 29 və 36 Günəş kütləli iki qara dəliyin 1.3 milyard işıq ili məsafədə toqquşması nəticəsində qeydə alınmışdı.",
        bloomLevel: "Tətbiq"
      }
    ]
  },
  {
    id: "graphene-2d-carbon",
    slug: "graphene-two-dimensional-carbon-nobel",
    category: "nobel",
    isNobel: true,
    nobelPrize: {
      year: 2010,
      category: "Fizika",
      laureates: ["Andre Geim", "Konstantin Novoselov"],
      citation: "İkiölçülü qrafen materialı ilə bağlı qabaqcıl eksperimentlərə görə"
    },
    discoveryYear: 2004,
    discoverer: "Andre Geim və Konstantin Novoselov",
    curriculumSubject: "Fizika / Kimya",
    curriculumGrade: "8-11-ci sinif",
    curriculumTopic: "Karbonun allotropik şəkildəyişmələri, elektrik keçiriciliyi və kristallik qəfəs",
    icon: "Layers",
    accentColor: "from-slate-700 to-cyan-800",
    readTime: "6 dəq",
    translations: {
      az: {
        title: "Qrafen: Cəmi Bir Atom Qalınlığında Möcüzə Material",
        summary: "Adi skoç lenti və qələm qrafitindən poladdan 200 dəfə möhkəm, misdən daha yaxşı cərəyan keçirən 2D materialın kəşfi.",
        ahaMoment: "Nəzəri fiziklər hesab edirdilər ki, ikiölçülü (tək atom qalınlığında) kristallar təbiətdə mövcud ola bilməz, çünki istilik rəqsləri onları dərhal parçalamalıdır. 2004-cü ildə Mançester Universitetində Qeym və Novoselov adi yapışqan lentlə (skoç) qrafit parçasından qat-qat təmizləyərək cəmi bir karbon atomu qalınlığında möhkəm təbəqə – qrafen əldə etdilər!",
        howItWorks: "Qrafendə karbon atomları sp² hibridləşməsi ilə altıbucaqlı arı şanı şəbəkəsində düzülüb. Elektronlar qrafenin daxilində sanki kütləsiz zərrəciklər kimi (relyativistik Dirak fermionları) saniyədə 1000 km sürətlə maneəsiz hərəkət edir.",
        realWorldImpact: "Ultra-sürətli tranzistorlar, elastik və qatlanan ekranlar, suyun duzsuzlaşdırılması üçün nano-filtrlər və yüngül zirehli jiletlər.",
        curriculumConnection: "8-ci sinif Kimyada 'Karbon və onun allotropiyası (almaz, qrafit, fulleren)', 10-cu sinif Fizikada 'Metallarda və yarımkeçiricilərdə elektrik cərəyanı' mövzularına tam cavab verir.",
        funFacts: [
          "Qrafendən hazırlanmış bir kvadrat metrlik 'həsir' cəmi bir pişik tükü çəkisində olardı, lakin 4 kq-lıq canlı pişiyi yırtılmadan saxlaya bilərdi.",
          "Andre Qeym həm Fizika üzrə Nobel mükafatı, həm də canlı qurbağanı maqnit sahəsində havada uçurtduğuna görə Şnobil (Ig Nobel) mükafatı alan yeganə alimdir."
        ]
      },
      en: {
        title: "Graphene: Two-Dimensional Carbon Wonder",
        summary: "Isolating single-atom-thick carbon sheets with Scotch tape, creating the world's strongest and most conductive material (2010 Nobel Prize in Physics).",
        ahaMoment: "Geim and Novoselov used simple adhesive tape to peel monolayers of graphene from bulk graphite.",
        howItWorks: "Carbon atoms in a 2D honeycomb lattice exhibit relativistic Dirac cone dispersion, allowing electrons to glide at 1/300 the speed of light without scattering.",
        realWorldImpact: "Flexible electronics, ballistic armor composites, desalination membranes, and ultrafast photodetectors.",
        curriculumConnection: "Connects carbon allotropes, sp2 hybridization, and condensed matter physics.",
        funFacts: [
          "Graphene is 200 times stronger than steel and conducts electricity better than copper."
        ]
      },
      tr: {
        title: "Grafen: Tek Atom Kalınlığında Mucize",
        summary: "Yapışkan bantla kurşun kalem grafidinden ayrıştırılan 2 boyutlu süper malzeme ve 2010 Nobel Fizik Ödülü.",
        ahaMoment: "Teorik olarak imkansız sanılan iki boyutlu kristal tabaka adi selobant yardımıyla soyularak izole edildi.",
        howItWorks: "Bal peteği örgüsündeki sp2 karbon bağları elektronların kütlesiz parçacıklar gibi aşırı hızlı akmasını sağlar.",
        realWorldImpact: "Bükülebilir ekranlar, yüksek kapasiteli bataryalar ve su arıtma zarları.",
        curriculumConnection: "Karbonun allotropları, hibritleşme ve katıhal fiziği kazanımlarıyla tam uyumludur.",
        funFacts: [
          "Çelikten 200 kat daha güçlüdür ve ısıyı elmastan daha iyi iletir."
        ]
      },
      ru: {
        title: "Графен: двумерный углеродный кристалл",
        summary: "Выделение слоя углерода толщиной в один атом с помощью клейкой ленты (Нобелевская премия по физике 2010).",
        ahaMoment: "Гейм и Новоселов применили обычный скотч для последовательного отшелушивания слоев графита до монослоя.",
        howItWorks: "Гексагональная решетка с sp2-гибридизацией, где электроны движутся без сопротивления как безмассовые дираковские фермионы.",
        realWorldImpact: "Гибкие дисплеи, сверхбыстрые транзисторы, фильтры для опреснения воды и легкие композиты.",
        curriculumConnection: "Школьный курс: аллотропия углерода, типы кристаллических решеток, электропроводность.",
        funFacts: [
          "Андрей Гейм — единственный в мире лауреат одновременно Нобелевской и Шнобелевской (за левитирующую лягушку) премий."
        ]
      }
    },
    quiz: [
      {
        id: "gr-q1",
        question: "Qrafenin qalınlığı neçə atom təbəqəsindən ibarətdir?",
        options: [
          { id: "A", text: "Cəmi 1 atom qalınlığında ikiölçülü (2D) təbəqədir" },
          { id: "B", text: "10 000 atom qalınlığında silindrdir" },
          { id: "C", text: "Yalnız mikroskopla görünməyən mayedir" },
          { id: "D", text: "1 millimetr qalınlığında təbəqədir" }
        ],
        correctOption: "A",
        explanation: "Qrafen sp² hibridləşmiş karbon atomlarından təşkil olunmuş bir atom qalınlığında ikiölçülü altıbucaqlı kristal şəbəkədir.",
        bloomLevel: "Bilik"
      },
      {
        id: "gr-q2",
        question: "Qrafenin qrafitdən fərqli olaraq fövqəladə möhkəm olmasının səbəbi nədir?",
        options: [
          { id: "A", text: "Karbon atomları arasındakı möhkəm kovalent rabitələrin tək müstəvidə qırılmadan paylanması" },
          { id: "B", text: "Tərkibində dəmir atomlarının olması" },
          { id: "C", text: "Sıxlığının sudan çox olması" },
          { id: "D", text: "Heç bir rabitənin olmaması" }
        ],
        correctOption: "A",
        explanation: "Qrafitdə laylar arasında zəif Van-der-Vaals qüvvələri var və asanlıqla sürüşür; tək qrafen qatında isə atomlar güclü kovalent rabitələrlə sıx bağlıdır.",
        bloomLevel: "Anlama"
      },
      {
        id: "gr-q3",
        question: "Karbonun hansı allotropik şəkildəyişməsi qrafenin spiral şəkildə bükülmüş boru formasıdır?",
        options: [
          { id: "A", text: "Karbon nanoboruları (Carbon nanotubes)" },
          { id: "B", text: "Təbii almaz" },
          { id: "C", text: "Ağ fosfor" },
          { id: "D", text: "Karbid" }
        ],
        correctOption: "A",
        explanation: "Qrafen müstəvisinin silindr formasında bükülməsi karbon nanoborularını əmələ gətirir.",
        bloomLevel: "Tətbiq"
      }
    ]
  }
]
