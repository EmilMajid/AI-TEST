"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Instagram,
  Facebook,
  Mail,
  ArrowRight,
  Youtube,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Shield,
  Users,
  BarChart3,
} from "lucide-react"
import { LanguageDropdown, Lang } from "@/components/language-dropdown"

const CONTENT = {
  az: {
    aboutLink: "Haqqımızda (About Us)",
    login: "Giriş",
    register: "Qeydiyyat",
    heroBadge: "Rəsmi Dərslik Əsaslı Təhsil və Diaqnostika Platforması",
    heroTitle: "AI ilə Öyrən, Test Et, İnkişaf Et",
    heroDesc:
      "Azərbaycan Respublikası Elm və Təhsil Nazirliyinin təsdiq etdiyi rəsmi dərsliklər əsasında hazırlanmış süni intellekt təhsil və diaqnostika platforması. Seçdiyiniz mövzuya uyğun testlər alın və bilik səviyyənizi yoxlayın.",
    startBtn: "İndi Başla",
    aboutBtn: "Platforma Haqqında Ətraflı",
    aboutSectionBadge: "HAQQIMIZDA VƏ PEDAQOJİ MİSSİYA",
    aboutSectionTitle: "TESTAI.AZ Nədir və Necə Kömək Edir?",
    aboutSectionP1:
      "TESTAI.AZ — rəsmi dərsliklər (e-derslik.edu.az) əsasında fəaliyyət göstərən ilk dərslik əsaslı süni intellekt təhsil və diaqnostika platformasıdır. RAG arxitekturası sayəsində sistem kənar və ya tədris olunmamış mövzulardan sual tərtib etmir.",
    aboutSectionP2:
      "Valideyn Kabineti sayəsində valideynlər saatlarla uşaqla məşğul olub əsəb gərginliyi yaşamır; sistem bir neçə dəqiqə ərzində uşağın zəif və güclü mövzularını analiz edib valideynə çatdırır.",
    aboutSectionReadMore: "Tam Haqqımızda səhifəsini oxuyun",
    features: [
      {
        title: "Rəsmi Dərsliklər",
        desc: "e-derslik.edu.az portalından götürülmüş rəsmi dövlət dərs kitabları ilə 100% uyğunluq",
      },
      {
        title: "AI Test Yaradıcısı",
        desc: "Süni intellekt vasitəsilə mövzuya tam uyğun test sualları (SİTG Standartı)",
      },
      {
        title: "Fərdi Valideyn Paneli",
        desc: "Məktəb, sinif və fənn üzrə şagirdin real inkişaf analitikası",
      },
      {
        title: "Nəticə və Səhv Təhlili",
        desc: "Cavablarınızın təfsilatlı pedaqoji təhlili və zəif mövzuların gücləndirilməsi",
      },
    ],
    howItWorksTitle: "Necə İşləyir?",
    steps: [
      {
        num: "1",
        title: "Qeydiyyatdan Keç",
        desc: "Ad, soyad, məktəb və sinif məlumatlarını daxil edərək profil açın",
      },
      {
        num: "2",
        title: "Mövzu Seç",
        desc: "Dərslik və öyrənmək, təkrar etmək istədiyiniz fənni/mövzunu seçin",
      },
      {
        num: "3",
        title: "Test Et və İnkişaf Et",
        desc: "AI tərəfindən yaradılan testləri həll edin və dərhal nəticəni görün",
      },
    ],
    communityBadge: "RƏSMİ ŞƏBƏKƏLƏRİMİZ",
    communityTitle: "Bizi Sosial Şəbəkələrdə İzləyin",
    communityDesc:
      "Yeniliklərdən, açıq sınaq imtahanlarından, yeni test tapşırıqlarından, video dərslərdən və təhsil xəbərlərindən ilk siz xəbərdar olun.",
    socialFollow: "Bizi İzləyin",
    socialVisit: "Səhifəyə Keçin",
    socialSubscribe: "Abunə Olun",
    socialWrite: "Bizə Yazın",
    footerDesc:
      "Azərbaycan dərslikləri əsasında hazırlanmış süni intellekt dəstəkli fərdiləşdirilmiş test və bilik analiz platforması.",
    quickLinks: "Tez Keçidlər",
    home: "Ana Səhifə",
    privacy: "Məxfilik Siyasəti (Privacy Policy)",
    contact: "Bizimlə Əlaqə (Contact Us)",
    textbooksAndTests: "Dərsliklər və Sınaqlar",
    userSections: "İstifadəçi Bölmələri",
    studentPanel: "🎓 Şagird Paneli",
    parentPanel: "👨‍👩‍👧‍👦 Valideyn Nəzarəti",
    analyticsPanel: "📊 Nəticələrin Təhlili",
    teacherPanel: "👨‍🏫 Müəllim Kabineti (Tezliklə)",
    contactUs: "Bizimlə Əlaqə",
    officialEmail: "Rəsmi E-poçt:",
    socialMedia: "Sosial Şəbəkələr:",
    supportText: "Təklif və texniki dəstək üçün həftənin hər günü bizimlə əlaqə saxlaya bilərsiniz.",
    copyright: "© 2025 TESTAI.AZ. Bütün hüquqlar qorunur.",
    tagline: "Azərbaycan AI Təhsil Platforması",
  },
  en: {
    aboutLink: "About Us (Haqqımızda)",
    login: "Sign In",
    register: "Sign Up",
    heroBadge: "Official Curriculum-Aligned Educational & Diagnostic Platform",
    heroTitle: "Learn, Test & Excel with AI",
    heroDesc:
      "AI-powered educational testing and diagnostic assessment platform built directly upon official curriculum textbooks approved by the Ministry of Science and Education (e-derslik.edu.az). Practice topic-aligned tests and elevate your academic performance.",
    startBtn: "Get Started Now",
    aboutBtn: "Learn More About Us",
    aboutSectionBadge: "PEDAGOGICAL MISSION & PURPOSE",
    aboutSectionTitle: "What is TESTAI.AZ and How Does It Help?",
    aboutSectionP1:
      "TESTAI.AZ is the premier AI-powered educational testing and diagnostic platform built directly upon official curriculum textbooks (e-derslik.edu.az). Leveraging advanced RAG architecture, it guarantees zero artificial hallucination.",
    aboutSectionP2:
      "Through real-time Parent Dashboards, parents do not have to struggle through study sessions under nervous tension; the system analyzes topic-specific strengths and weaknesses in minutes and delivers the findings directly to the parent.",
    aboutSectionReadMore: "Read Full About Us Page",
    features: [
      {
        title: "Official Textbooks",
        desc: "100% aligned with authorized curriculum textbooks from e-derslik.edu.az",
      },
      {
        title: "AI Test Generator",
        desc: "Curriculum-aligned diagnostic tests powered by SITG standards with zero hallucination",
      },
      {
        title: "Personalized Parent Dashboard",
        desc: "Objective academic trajectory tailored by grade, school, and learning pace",
      },
      {
        title: "Deep Analytical Diagnostics",
        desc: "Comprehensive breakdown of strengths, weaknesses, and pedagogical guidance",
      },
    ],
    howItWorksTitle: "How It Works",
    steps: [
      {
        num: "1",
        title: "Create Account",
        desc: "Enter basic student details, school, and current grade level",
      },
      {
        num: "2",
        title: "Select Subject & Topic",
        desc: "Choose the textbook unit and topic you wish to master",
      },
      {
        num: "3",
        title: "Practice & Progress",
        desc: "Solve AI-generated questions and receive immediate diagnostic feedback",
      },
    ],
    communityBadge: "OUR OFFICIAL CHANNELS",
    communityTitle: "Follow Us on Social Media",
    communityDesc:
      "Stay updated on open mock exams, new test units, video explanations, and educational announcements.",
    socialFollow: "Follow Us",
    socialVisit: "Visit Page",
    socialSubscribe: "Subscribe",
    socialWrite: "Contact Us",
    footerDesc:
      "AI-powered educational diagnostic and assessment platform based on official curriculum textbooks.",
    quickLinks: "Quick Links",
    home: "Home",
    privacy: "Privacy Policy",
    contact: "Contact Us",
    textbooksAndTests: "Textbooks & Practice",
    userSections: "Portals",
    studentPanel: "🎓 Student Portal",
    parentPanel: "👨‍👩‍👧‍👦 Parent Monitoring",
    analyticsPanel: "📊 Performance Analytics",
    teacherPanel: "👨‍🏫 Teacher Portal (Coming Soon)",
    contactUs: "Contact Us",
    officialEmail: "Official Email:",
    socialMedia: "Social Media:",
    supportText: "Available 7 days a week for technical support and inquiries.",
    copyright: "© 2025 TESTAI.AZ. All rights reserved.",
    tagline: "Educational AI Platform",
  },
  tr: {
    aboutLink: "Hakkımızda (About Us)",
    login: "Giriş Yap",
    register: "Kayıt Ol",
    heroBadge: "Resmi Müfredat Tabanlı Eğitim ve Teşhis Platformu",
    heroTitle: "Yapay Zeka ile Öğren, Test Et, Geliş",
    heroDesc:
      "Azerbaycan Cumhuriyeti Bilim ve Eğitim Bakanlığı onaylı resmi ders kitapları (e-derslik.edu.az) temelinde geliştirilmiş yapay zeka eğitim ve teşhis platformu. Konulara uygun testler çözün ve bilgi seviyenizi ölçün.",
    startBtn: "Hemen Başla",
    aboutBtn: "Platform Hakkında Bilgi",
    aboutSectionBadge: "PEDAGOJİK MİSYONUMUZ",
    aboutSectionTitle: "TESTAI.AZ Nedir ve Nasıl Yardımcı Olur?",
    aboutSectionP1:
      "TESTAI.AZ, resmi ders kitapları (e-derslik.edu.az) temelinde çalışan yapay zeka eğitim ve teşhis platformudur. RAG yapay zeka mimarisi sayesinde müfredat dışı ve yanıltıcı içerikler tamamen engellenir.",
    aboutSectionP2:
      "Gelişmiş Veli Paneli sayesinde aileler çocukla ders çalışırken sinir gerginliği yaşamaz; sistem birkaç dakika içinde öğrencinin eksik ve güçlü olduğu konuları analiz ederek doğrudan veliye ulaştırır.",
    aboutSectionReadMore: "Hakkımızda Sayfasının Tamamını Oku",
    features: [
      {
        title: "Resmi Ders Kitapları",
        desc: "e-derslik.edu.az portalındaki resmi ders kitaplarıyla %100 uyumlu",
      },
      {
        title: "Yapay Zeka Test Üretimi",
        desc: "SİTG standartlarında müfredat dışına çıkmayan akıllı soru üretimi",
      },
      {
        title: "Öğrenci & Veli Paneli",
        desc: "Okul, sınıf ve öğrenim düzeyine göre kişiselleştirilmiş analizler",
      },
      {
        title: "Detaylı Sonuç Analizi",
        desc: "Cevapların analitik incelemesi ve konu eksikliklerini giderme rehberi",
      },
    ],
    howItWorksTitle: "Nasıl Çalışır?",
    steps: [
      {
        num: "1",
        title: "Kayıt Olun",
        desc: "Öğrenci, okul ve sınıf bilgilerini girerek profilinizi oluşturun",
      },
      {
        num: "2",
        title: "Konu Seçin",
        desc: "Çalışmak ve pekiştirmek istediğiniz ders konusunu belirleyin",
      },
      {
        num: "3",
        title: "Test Çözün & İlerleyin",
        desc: "Yapay zeka testlerini çözün ve anında ayrıntılı analiz alın",
      },
    ],
    communityBadge: "RESMİ KANALLARIMIZ",
    communityTitle: "Bizi Sosyal Medyada Takip Edin",
    communityDesc:
      "Deneme sınavları, yeni test setleri, video çözümleri ve eğitim haberlerinden ilk siz haberdar olun.",
    socialFollow: "Takip Edin",
    socialVisit: "Sayfayı Ziyaret Edin",
    socialSubscribe: "Abone Olun",
    socialWrite: "Bize Yazın",
    footerDesc:
      "Müfredat ders kitapları temelinde geliştirilmiş yapay zeka destekli eğitim ve teşhis platformu.",
    quickLinks: "Hızlı Bağlantılar",
    home: "Ana Sayfa",
    privacy: "Gizlilik Politikası (Privacy Policy)",
    contact: "İletişim (Contact Us)",
    textbooksAndTests: "Ders Kitapları ve Sınavlar",
    userSections: "Kullanıcı Bölümleri",
    studentPanel: "🎓 Öğrenci Paneli",
    parentPanel: "👨‍👩‍👧‍👦 Veli Kontrolü",
    analyticsPanel: "📊 Performans Analitiği",
    teacherPanel: "👨‍🏫 Öğretmen Kabini (Yakında)",
    contactUs: "İletişim",
    officialEmail: "Resmi E-posta:",
    socialMedia: "Sosyal Medya:",
    supportText: "Öneri ve teknik destek için haftanın her günü bizimle iletişime geçebilirsiniz.",
    copyright: "© 2025 TESTAI.AZ. Tüm hakları saklıdır.",
    tagline: "Eğitim Yapay Zeka Platformu",
  },
  ru: {
    aboutLink: "О нас (About Us)",
    login: "Войти",
    register: "Регистрация",
    heroBadge: "Образовательная ИИ-платформа тестирования и диагностики",
    heroTitle: "Обучение, тестирование и развитие с ИИ",
    heroDesc:
      "Образовательная ИИ-платформа тестирования и диагностики на основе официальных учебников Министерства науки и образования (e-derslik.edu.az). Проходите тесты по темам и развивайте академические навыки.",
    startBtn: "Начать сейчас",
    aboutBtn: "Подробнее о платформе",
    aboutSectionBadge: "ПЕДАГОГИЧЕСКАЯ МИССИЯ",
    aboutSectionTitle: "Что такое TESTAI.AZ и в чем его польза?",
    aboutSectionP1:
      "TESTAI.AZ — передовая образовательная платформа на базе искусственного интеллекта, разработанная в полном соответствии с официальными учебниками (e-derslik.edu.az). Архитектура RAG полностью исключает ложные факты.",
    aboutSectionP2:
      "Благодаря Личному кабинету родителя взрослые не испытывают нервного напряжения, занимаясь уроками с ребенком; система за считанные минуты анализирует сильные и слабые темы ученика и напрямую предоставляет аналитику родителю.",
    aboutSectionReadMore: "Читать полностью страницу О нас",
    features: [
      {
        title: "Официальные учебники",
        desc: "100% соответствие учебникам с официального портала e-derslik.edu.az",
      },
      {
        title: "ИИ-генератор тестов",
        desc: "Генерация проверочных вопросов строго по темам без ложных фактов (Стандарт SITG)",
      },
      {
        title: "Профиль ученика и родителя",
        desc: "Индивидуальная образовательная траектория с учетом класса и школы",
      },
      {
        title: "Глубокая аналитика результатов",
        desc: "Детальный разбор ответов, выявление пробелов и рекомендации",
      },
    ],
    howItWorksTitle: "Как это работает?",
    steps: [
      {
        num: "1",
        title: "Регистрация",
        desc: "Укажите имя, фамилию, школу и текущий класс учащегося",
      },
      {
        num: "2",
        title: "Выбор темы",
        desc: "Выберите учебник и тему, которую необходимо закрепить",
      },
      {
        num: "3",
        title: "Тестирование и рост",
        desc: "Решайте задания ИИ и мгновенно получайте объективную оценку знаний",
      },
    ],
    communityBadge: "НАШИ ОФИЦИАЛЬНЫЕ КАНАЛЫ",
    communityTitle: "Следите за нами в социальных сетях",
    communityDesc:
      "Узнавайте первыми об открытых пробных экзаменах, новых тестах, видеоуроках и новостях образования.",
    socialFollow: "Подписаться",
    socialVisit: "Перейти на страницу",
    socialSubscribe: "Смотреть канал",
    socialWrite: "Написать нам",
    footerDesc:
      "Образовательная платформа на базе ИИ для персонализированного тестирования на основе официальных учебников.",
    quickLinks: "Быстрые ссылки",
    home: "Главная страница",
    privacy: "Политика конфиденциальности (Privacy Policy)",
    contact: "Контакты (Contact Us)",
    textbooksAndTests: "Учебники и тесты",
    userSections: "Разделы пользователей",
    studentPanel: "🎓 Панель ученика",
    parentPanel: "👨‍👩‍👧‍👦 Родительский контроль",
    analyticsPanel: "📊 Аналитика успеваемости",
    teacherPanel: "👨‍🏫 Кабинет учителя (Скоро)",
    contactUs: "Контакты",
    officialEmail: "Официальный e-mail:",
    socialMedia: "Социальные сети:",
    supportText: "Техническая поддержка доступна 7 дней в неделю по любым вопросам.",
    copyright: "© 2025 TESTAI.AZ. Все права защищены.",
    tagline: "Образовательная ИИ-платформа",
  },
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("az")
  const t = CONTENT[lang]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10">
      {/* Header */}
      <header className="bg-white shadow-xs sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 gap-2">
            {/* Logo + Haqqımızda (About Us) birbaşa loqodan sonra */}
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <Link href="/" className="flex items-center group">
                <div className="relative h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-2.5 transition-transform group-hover:scale-105">
                  <Image
                    src="/logo.jpg"
                    alt="TESTAI.AZ Logo"
                    fill
                    className="object-contain rounded-md"
                    priority
                  />
                </div>
                <span className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  TESTAI.AZ
                </span>
              </Link>

              {/* Haqqımızda (About Us) keçidi — Loqo və addan dərhal sonra */}
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 transition-all shadow-sm"
                title="TESTAI.AZ Haqqında və Pedaqoji Missiyamız"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{t.aboutLink}</span>
              </Link>
            </div>

            {/* Sağ Tərəf: Açılıb-Yığılan Dil Seçici + Giriş / Qeydiyyat */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Açılıb-yığılan Language Dropdown */}
              <LanguageDropdown currentLang={lang} onSelectLang={setLang} />

              <Link href="/login">
                <button className="px-2.5 sm:px-3.5 py-1.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                  {t.login}
                </button>
              </Link>
              <Link href="/register">
                <button className="px-3 sm:px-4 py-1.5 bg-primary text-white rounded-xl text-xs sm:text-sm font-medium hover:opacity-90 shadow-sm transition-all cursor-pointer">
                  {t.register}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200/50">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.heroBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-5 px-2 tracking-tight">
            {t.heroTitle}
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2 leading-relaxed">
            {t.heroDesc}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <Link href="/register">
              <button className="text-sm sm:text-base px-6 sm:px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 shadow-md transition-all cursor-pointer">
                {t.startBtn}
              </button>
            </Link>
            <Link href="/about">
              <button className="text-sm sm:text-base px-5 sm:px-7 py-3 bg-white text-gray-800 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 shadow-xs transition-all cursor-pointer flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>{t.aboutBtn}</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Haqqımızda və Pedaqoji Missiya — Əsas Səhifədə Seçilmiş Dildə İnformasiya Bloku */}
        <div className="mb-14 bg-white rounded-2xl border border-blue-100 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                {t.aboutSectionBadge}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {t.aboutSectionTitle}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {t.aboutSectionP1}
              </p>
              <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200/50">
                💡 {t.aboutSectionP2}
              </p>
            </div>
            <Link
              href="/about"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <span>{t.aboutSectionReadMore}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="rounded-2xl border border-slate-200 bg-white text-center p-6 shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-2 text-slate-900">{t.features[0].title}</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t.features[0].desc}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white text-center p-6 shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-2 text-slate-900">{t.features[1].title}</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t.features[1].desc}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white text-center p-6 shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-2 text-slate-900">{t.features[2].title}</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t.features[2].desc}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white text-center p-6 shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-2 text-slate-900">{t.features[3].title}</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t.features[3].desc}</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-10 mb-16">
          <h3 className="text-xl sm:text-3xl font-extrabold text-center mb-8 text-slate-900">
            {t.howItWorksTitle}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {t.steps.map((step) => (
              <div key={step.num} className="text-center p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="bg-primary/10 text-primary rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  {step.num}
                </div>
                <h4 className="text-base sm:text-lg font-bold mb-2 text-slate-900">{step.title}</h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bizi Sosial Şəbəkələrdə İzləyin (Community Section) */}
        <div className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 rounded-2xl border border-primary/20 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold mb-3">
              {t.communityBadge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              {t.communityTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t.communityDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Instagram Kartı */}
            <a
              href="https://www.instagram.com/testai.az/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full group-hover:bg-pink-100 transition-colors">
                    @testai.az
                  </span>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
                  Instagram
                </h4>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  {lang === "az" && "Gündəlik test sualları, dərslik izahları və interaktiv viktorinalar."}
                  {lang === "en" && "Daily test questions, curriculum insights, and interactive stories."}
                  {lang === "tr" && "Günlük test soruları, ders kitabı özetleri ve mini sınavlar."}
                  {lang === "ru" && "Ежедневные тесты, разборы учебных тем и викторины."}
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-pink-600 group-hover:translate-x-1 transition-transform">
                <span>{t.socialFollow}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </a>

            {/* Facebook Kartı */}
            <a
              href="https://www.facebook.com/profile.php?id=61594359745552"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                    TESTAI.AZ
                  </span>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Facebook
                </h4>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  {lang === "az" && "Təhsil xəbərləri, rəsmi elanlar, valideyn və müəllimlər üçün bələdçilər."}
                  {lang === "en" && "Educational news, official announcements, and parent guides."}
                  {lang === "tr" && "Eğitim haberleri, duyurular ve veli rehberleri."}
                  {lang === "ru" && "Новости образования, объявления и полезные руководства для родителей."}
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>{t.socialVisit}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </a>

            {/* YouTube Kartı */}
            <a
              href="https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full group-hover:bg-red-100 transition-colors">
                    YouTube
                  </span>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                  YouTube
                </h4>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  {lang === "az" && "Video dərslər, sınaq testlərinin video izahları və təhsil bələdçiləri."}
                  {lang === "en" && "Video tutorials, mock exam walkthroughs, and learning guides."}
                  {lang === "tr" && "Video dersler, test çözümleri ve eğitim ipuçları."}
                  {lang === "ru" && "Видеоуроки, подробные видеоразборы тестов и советы."}
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-red-600 group-hover:translate-x-1 transition-transform">
                <span>{t.socialSubscribe}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </a>

            {/* Email / Dəstək Kartı */}
            <a
              href="mailto:aztestai.az@gmail.com"
              className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full group-hover:bg-emerald-100 transition-colors">
                    {lang === "az" && "Dəstək"}
                    {lang === "en" && "Support"}
                    {lang === "tr" && "Destek"}
                    {lang === "ru" && "Поддержка"}
                  </span>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  {t.officialEmail}
                </h4>
                <p className="text-xs text-gray-500 mb-4 break-all leading-relaxed">
                  aztestai.az@gmail.com
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                <span>{t.socialWrite}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* Müasir Responsive Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-12 sm:pt-16 pb-10 mt-16 sm:mt-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
            {/* Sütun 1: Brend & Təsvir & Sosial Düymələr */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9">
                  <Image
                    src="/logo.jpg"
                    alt="TESTAI.AZ Logo"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">TESTAI.AZ</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t.footerDesc}
              </p>
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href="https://www.instagram.com/testai.az/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Səhifəsi"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61594359745552"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Səhifəsi"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Kanalı"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="mailto:aztestai.az@gmail.com"
                  aria-label="Email Dəstək"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Sütun 2: Tez Keçidlər */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {t.quickLinks}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    {t.home}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors text-blue-400 font-semibold">
                    {t.aboutLink}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    {t.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    {t.contact}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    {t.textbooksAndTests}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sütun 3: İstifadəçi Kabinetləri */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {t.userSections}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    {t.studentPanel}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    {t.parentPanel}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    {t.analyticsPanel}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors text-slate-400">
                    {t.teacherPanel}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sütun 4: Əlaqə & Dəstək */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {t.contactUs}
              </h4>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="block text-slate-400 text-xs mb-1">{t.officialEmail}</span>
                  <a
                    href="mailto:aztestai.az@gmail.com"
                    className="text-white hover:text-primary transition-colors font-medium break-all flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>aztestai.az@gmail.com</span>
                  </a>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs mb-1">{t.socialMedia}</span>
                  <div className="space-y-1">
                    <a
                      href="https://www.instagram.com/testai.az/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-pink-400 transition-colors flex items-center gap-1.5"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      <span>@testai.az</span>
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=61594359745552"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                    >
                      <Facebook className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>TESTAI.AZ (Facebook)</span>
                    </a>
                    <a
                      href="https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                    >
                      <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>TESTAI.AZ (YouTube)</span>
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  {t.supportText}
                </p>
              </div>
            </div>
          </div>

          {/* Alt Hissə (Copyright) */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3 text-center sm:text-left">
            <p>{t.copyright}</p>
            <p className="text-slate-400">{t.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
