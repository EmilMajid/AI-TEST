import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Mail, ArrowRight, Youtube } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3.5 sm:py-6">
            <div className="flex items-center">
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3">
                <Image
                  src="/logo.jpg"
                  alt="TESTAI.AZ Logo"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">TESTAI.AZ</h1>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <Link href="/login">
                <button className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  Giriş
                </button>
              </Link>
              <Link href="/register">
                <button className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-primary text-white rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 shadow-sm cursor-pointer">
                  Qeydiyyat
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 px-2">AI ilə Öyrən, Test Et, İnkişaf Et</h2>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            Azərbaycan dərslikləri əsasında hazırlanmış AI test platforması. Seçdiyiniz mövzuya uyğun testlər alın və
            bilik səviyyənizi yoxlayın.
          </p>
          <Link href="/register">
            <button className="text-base sm:text-lg px-7 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 shadow-md cursor-pointer">
              İndi Başla
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="rounded-lg border bg-white text-center p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary rounded-md mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Rəsmi Dərsliklər</h3>
            <p className="text-gray-600 text-sm">e-derslik.edu.az portalından götürülmüş rəsmi dərs kitabları</p>
          </div>

          <div className="rounded-lg border bg-white text-center p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary rounded-md mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Test Yaradıcısı</h3>
            <p className="text-gray-600 text-sm">Süni intellekt vasitəsilə mövzuya uyğun test sualları</p>
          </div>

          <div className="rounded-lg border bg-white text-center p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary rounded-md mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Şəxsi Profil</h3>
            <p className="text-gray-600 text-sm">Məktəb, sinif və ərazi məlumatları ilə fərdi təcrübə</p>
          </div>

          <div className="rounded-lg border bg-white text-center p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary rounded-md mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nəticə Təhlili</h3>
            <p className="text-gray-600 text-sm">Cavablarınızın təfsilatlı təhlili və tövsiyələr</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Necə İşləyir?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Qeydiyyatdan Keç</h4>
              <p className="text-gray-600">Ad, soyad, məktəb və sinif məlumatlarını daxil et</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Mövzu Seç</h4>
              <p className="text-gray-600">Dərslik və öyrənmək istədiyiniz mövzunu seçin</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Test Et</h4>
              <p className="text-gray-600">AI tərəfindən yaradılan testləri həll edin və nəticəni görün</p>
            </div>
          </div>
        </div>

        {/* Bizi Sosial Şəbəkələrdə İzləyin (Community Section) */}
        <div className="mt-14 sm:mt-20 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 rounded-2xl border border-primary/20 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold mb-3">
              RƏSMİ ŞƏBƏKƏLƏRİMİZ
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Bizi Sosial Şəbəkələrdə İzləyin
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Yeniliklərdən, açıq sınaq imtahanlarından, yeni test tapşırıqlarından, video dərslərdən və təhsil xəbərlərindən ilk siz xəbərdar olun.
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
                  Gündəlik test sualları, dərslik izahları və interaktiv viktorinalar.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-pink-600 group-hover:translate-x-1 transition-transform">
                <span>Bizi İzləyin</span>
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
                  Facebook Səhifəmiz
                </h4>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Təhsil xəbərləri, rəsmi elanlar, valideyn və müəllimlər üçün bələdçilər.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>Səhifəyə Keçin</span>
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
                  YouTube Kanalımız
                </h4>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Video dərslər, sınaq testlərinin video izahları və təhsil bələdçiləri.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-red-600 group-hover:translate-x-1 transition-transform">
                <span>Abunə Olun</span>
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
                    Dəstək
                  </span>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  Rəsmi E-poçt
                </h4>
                <p className="text-xs text-gray-500 mb-4 break-all leading-relaxed">
                  aztestai.az@gmail.com
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                <span>Bizə Yazın</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* Müasir 4 Sütunlu Responsive Footer */}
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
                Azərbaycan dərslikləri əsasında hazırlanmış süni intellekt dəstəkli fərdiləşdirilmiş test və bilik analiz platforması.
              </p>
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href="https://www.instagram.com/testai.az/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Səhifəsi"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61594359745552"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Səhifəsi"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Kanalı"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="mailto:aztestai.az@gmail.com"
                  aria-label="Email Dəstək"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Sütun 2: Tez Keçidlər */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Tez Keçidlər
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Ana Səhifə
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Haqqımızda (About Us)
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Məxfilik Siyasəti (Privacy Policy)
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Əlaqə (Contact Us)
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Dərsliklər və Sınaqlar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sütun 3: İstifadəçi Kabinetləri */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-4">
                İstifadəçi Bölmələri
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    🎓 Şagird Paneli
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    👨‍👩‍👧‍👦 Valideyn Nəzarəti
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    📊 Nəticələrin Təhlili
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors text-slate-400">
                    👨‍🏫 Müəllim Kabineti (Tezliklə)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sütun 4: Əlaqə & Dəstək */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Bizimlə Əlaqə
              </h4>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="block text-slate-400 text-xs mb-1">Rəsmi E-poçt:</span>
                  <a
                    href="mailto:aztestai.az@gmail.com"
                    className="text-white hover:text-primary transition-colors font-medium break-all flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>aztestai.az@gmail.com</span>
                  </a>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs mb-1">Sosial Şəbəkələr:</span>
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
                  Təklif və texniki dəstək üçün həftənin hər günü bizimlə əlaqə saxlaya bilərsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Alt Hissə (Copyright) */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3 text-center sm:text-left">
            <p>&copy; 2025 TESTAI.AZ. Bütün hüquqlar qorunur.</p>
            <p className="text-slate-400">Azərbaycan AI Təhsil Platforması</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
