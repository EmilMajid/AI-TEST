import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Youtube, Mail, MapPin } from "lucide-react"
import { Lang } from "@/components/language-dropdown"
import { DEFAULT_LOCALE } from "@/lib/config"

interface FooterProps {
  lang?: Lang
}

const footerTexts: Record<Lang, {
  footerDesc: string
  quickLinks: string
  home: string
  aboutLink: string
  blogLink: string
  discoveriesLink: string
  openTestsLink: string
  privacy: string
  terms: string
  contact: string
  textbooksAndTests: string
  userSections: string
  studentPanel: string
  parentPanel: string
  analyticsPanel: string
  teacherPanel: string
  contactUs: string
  officialEmail: string
  socialMedia: string
  locationTitle: string
  locationVal: string
  supportText: string
  copyright: string
  tagline: string
}> = {
  az: {
    footerDesc: "Azərbaycan dərslikləri əsasında hazırlanmış süni intellekt dəstəkli fərdiləşdirilmiş test və bilik analiz platforması.",
    quickLinks: "Tez Keçidlər",
    home: "Ana Səhifə",
    aboutLink: "Haqqımızda (Missiyamız)",
    blogLink: "Bloq və Metodologiya",
    discoveriesLink: "Elmi Kəşflər və İxtiralar (50 Kəşf)",
    openTestsLink: "Açıq Sınaqlar (Qeydiyyatsız)",
    privacy: "Məxfilik Siyasəti (Privacy Policy)",
    terms: "İstifadə Şərtləri (Terms of Service)",
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
    locationTitle: "Baş Qərargah:",
    locationVal: "Bakı şəhəri, Azərbaycan",
    supportText: "Təklif və texniki dəstək üçün həftənin hər günü bizimlə əlaqə saxlaya bilərsiniz.",
    copyright: "© 2026 TESTAI.AZ. Bütün hüquqlar qorunur.",
    tagline: "Azərbaycan AI Təhsil Platforması",
  },
  en: {
    footerDesc: "AI-powered educational diagnostic and assessment platform based on official curriculum textbooks.",
    quickLinks: "Quick Links",
    home: "Home",
    aboutLink: "About Us (Haqqımızda)",
    blogLink: "Blog & Methodology",
    discoveriesLink: "Scientific Discoveries & Inventions (50)",
    openTestsLink: "Open Diagnostic Tests",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
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
    locationTitle: "Headquarters:",
    locationVal: "Baku, Azerbaijan",
    supportText: "Available 7 days a week for technical support and inquiries.",
    copyright: "© 2026 TESTAI.AZ. All rights reserved.",
    tagline: "Educational AI Platform",
  },
  tr: {
    footerDesc: "Müfredat ders kitapları temelinde geliştirilmiş yapay zeka destekli eğitim ve teşhis platformu.",
    quickLinks: "Hızlı Bağlantılar",
    home: "Ana Sayfa",
    aboutLink: "Hakkımızda (About Us)",
    blogLink: "Blog ve Metodoloji",
    discoveriesLink: "Bilimsel Keşifler ve İcatlar (50 Keşif)",
    openTestsLink: "Açık Dil Sınavları (Kayıtsız)",
    privacy: "Gizlilik Politikası (Privacy Policy)",
    terms: "Kullanım Şartları (Terms of Service)",
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
    locationTitle: "Genel Merkez:",
    locationVal: "Bakü, Azerbaycan",
    supportText: "Öneri ve teknik destek için haftanın her günü bizimle iletişime geçebilirsiniz.",
    copyright: "© 2026 TESTAI.AZ. Tüm hakları saklıdır.",
    tagline: "Eğitim Yapay Zeka Platformu",
  },
  ru: {
    footerDesc: "Образовательная платформа на базе ИИ для персонализированного тестирования на основе официальных учебников.",
    quickLinks: "Быстрые ссылки",
    home: "Главная страница",
    aboutLink: "О нас (About Us)",
    blogLink: "Блог и методология",
    discoveriesLink: "Научные открытия и изобретения (50)",
    openTestsLink: "Открытые тесты (Без регистрации)",
    privacy: "Политика конфиденциальности (Privacy Policy)",
    terms: "Условия использования (Terms of Service)",
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
    locationTitle: "Штаб-квартира:",
    locationVal: "Баку, Азербайджан",
    supportText: "Техническая поддержка доступна 7 дней в неделю по любым вопросам.",
    copyright: "© 2026 TESTAI.AZ. Все права защищены.",
    tagline: "Образовательная ИИ-платформа",
  },
}

export function Footer({ lang = DEFAULT_LOCALE }: FooterProps) {
  const t = footerTexts[lang] || footerTexts[DEFAULT_LOCALE]

  const homeHref = lang === DEFAULT_LOCALE ? "/" : `/${lang}`
  const aboutHref = lang === DEFAULT_LOCALE ? "/about" : `/${lang}/about`
  const blogHref = lang === DEFAULT_LOCALE ? "/blog" : `/${lang}/blog`
  const discoveriesHref = lang === DEFAULT_LOCALE ? "/discoveries" : `/${lang}/discoveries`
  const openTestsHref = lang === DEFAULT_LOCALE ? "/open-tests" : `/${lang}/open-tests`
  const privacyHref = lang === DEFAULT_LOCALE ? "/privacy" : `/${lang}/privacy`
  const termsHref = lang === DEFAULT_LOCALE ? "/terms" : `/${lang}/terms`
  const contactHref = lang === DEFAULT_LOCALE ? "/contact" : `/${lang}/contact`

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 sm:pt-16 pb-10 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Sütun 1: Brend & Təsvir & Sosial Düymələr */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9">
                <Image
                  src="/logo-sm.webp"
                  alt="TESTAI.AZ Logo"
                  fill
                  sizes="36px"
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
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61594359745552"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Səhifəsi"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Kanalı"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="mailto:aztestai.az@gmail.com"
                aria-label="Email Dəstək"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
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
                <Link href={homeHref} className="hover:text-white transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href={aboutHref} className="hover:text-white transition-colors text-blue-400 font-semibold">
                  {t.aboutLink}
                </Link>
              </li>
              <li>
                <Link href={blogHref} className="hover:text-white transition-colors text-indigo-400 font-semibold">
                  {t.blogLink}
                </Link>
              </li>
              <li>
                <Link href={discoveriesHref} className="hover:text-white transition-colors text-amber-400 font-semibold">
                  {t.discoveriesLink}
                </Link>
              </li>
              <li>
                <Link href={openTestsHref} className="hover:text-white transition-colors text-emerald-400 font-semibold">
                  {t.openTestsLink}
                </Link>
              </li>
              <li>
                <Link href={privacyHref} className="hover:text-white transition-colors">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link href={termsHref} className="hover:text-white transition-colors">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link href={contactHref} className="hover:text-white transition-colors">
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

          {/* Sütun 4: Əlaqə & Dəstək & Baş Qərargah */}
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
                <span className="block text-slate-400 text-xs mb-1">{t.locationTitle}</span>
                <div className="text-white font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{t.locationVal}</span>
                </div>
              </div>
              <div>
                <span className="block text-slate-400 text-xs mb-1">{t.socialMedia}</span>
                <div className="space-y-2.5 pt-0.5">
                  <a
                    href="https://www.instagram.com/testai.az/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-400 transition-colors inline-flex items-center gap-2 py-1 px-0.5"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span>@testai.az</span>
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61594359745552"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors inline-flex items-center gap-2 py-1 px-0.5"
                  >
                    <Facebook className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>TESTAI.AZ (Facebook)</span>
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-400 transition-colors inline-flex items-center gap-2 py-1 px-0.5"
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
  )
}
