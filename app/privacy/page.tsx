"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Globe, ArrowLeft } from "lucide-react"

type Lang = "az" | "en" | "tr" | "ru"

export default function PrivacyPage() {
  const [lang, setLang] = useState<Lang>("az")

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
            <ArrowLeft className="w-5 h-5" />
            <span>TESTAI.AZ</span>
          </Link>

          {/* Dil Seçici (Language Switcher) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-4 h-4 ml-2 mr-1 text-slate-500" />
            {(["az", "en", "tr", "ru"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg uppercase transition-all cursor-pointer ${
                  lang === l ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-10 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {lang === "az" && "Məxfilik Siyasəti"}
                {lang === "en" && "Privacy Policy"}
                {lang === "tr" && "Gizlilik Politikası"}
                {lang === "ru" && "Политика конфиденциальности"}
              </h1>
              <p className="text-xs text-slate-400 mt-1">TESTAI.AZ Educational AI Platform | Updated: 2026</p>
            </div>
          </div>

          {/* AZERBAIJANI */}
          {lang === "az" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Ümumi Müddəalar</h2>
                <p>
                  TESTAI.AZ platforması istifadəçilərin məxfiliyinə tam hörmət edir. Bu siyasət saytımızdan istifadə edərkən toplanan məlumatların növlərini və onların qorunma prinsiplərini əks etdirir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Google AdSense və Çərəzlər (Cookies)</h2>
                <p>
                  Platformamızda üçüncü tərəf reklam təminatçısı kimi <strong>Google AdSense</strong> istifadə oluna bilər. Google və onun tərəfdaşları istifadəçilərin bu və digər internet saytlarına əvvəlki ziyarətləri əsasında reklamlar göstərmək üçün çərəzlərdən (cookies) istifadə edirlər.
                </p>
                <p className="mt-2">
                  İstifadəçilər fərdiləşdirilmiş reklamlardan imtina etmək üçün <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Reklam Parametrləri</a> səhifəsini ziyarət edə bilərlər.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Şagird Məlumatlarının Təhlükəsizliyi</h2>
                <p>
                  Şagirdlərin sınaq nəticələri və tədris analitikası yalnız valideyn və şagirdin fərdi inkişafı məqsədilə qorunur və heç bir halda kənar şəxslərə satılmır və ötürülmür.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Əlaqə</h2>
                <p>Məxfilik siyasəti üzrə rəsmi əlaqə: <strong>aztestai.az@gmail.com</strong></p>
              </section>
            </div>
          )}

          {/* ENGLISH */}
          {lang === "en" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Introduction & Scope</h2>
                <p>
                  TESTAI.AZ is dedicated to protecting the privacy rights of all learners, parents, and educators. This Privacy Policy details our data governance practices and third-party advertising compliance.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Google AdSense & Cookie Technologies</h2>
                <p>
                  Third-party vendors, including <strong>Google</strong>, use cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites across the Internet.
                </p>
                <p className="mt-2">
                  Users may opt out of personalized advertising at any time by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Ads Settings</a> or by reviewing <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">aboutads.info</a>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Educational Data Protection</h2>
                <p>
                  Assessment outcomes, diagnostic metrics, and study behaviors are kept strictly confidential, encrypted, and processed exclusively to advance educational learning objectives.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Contact Information</h2>
                <p>For any privacy-related questions, contact our compliance team: <strong>aztestai.az@gmail.com</strong></p>
              </section>
            </div>
          )}

          {/* TURKISH */}
          {lang === "tr" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Genel Bakış</h2>
                <p>
                  TESTAI.AZ eğitim platformu olarak ziyaretçilerimizin, öğrenci ve velilerimizin gizlilik haklarını korumayı taahhüt ediyoruz.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Google AdSense ve Reklam Çerezleri</h2>
                <p>
                  Sitemizde üçüncü taraf reklam sağlayıcısı olarak <strong>Google AdSense</strong> hizmetleri kullanılabilir. Google dahil olmak üzere üçüncü taraf tedarikçiler, kullanıcıların web sitemize veya diğer web sitelerine yaptığı önceki ziyaretlere dayalı olarak reklam yayınlamak için çerezleri (cookies) kullanır.
                </p>
                <p className="mt-2">
                  Kişiselleştirilmiş reklam tercihlerini değiştirmek veya devre dışı bırakmak için <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Reklam Ayarları</a> sayfasını ziyaret edebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Öğrenci Verilerinin Güvenliği</h2>
                <p>
                  Öğrenci sınav sonuçları ve pedagojik analizler yalnızca eğitim gelişimini takip etmek amacıyla saklanır, ticari amaçla üçüncü şahıslara satılmaz.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. İletişim</h2>
                <p>Gizlilik politikamız ile ilgili tüm sorularınız için: <strong>aztestai.az@gmail.com</strong></p>
              </section>
            </div>
          )}

          {/* RUSSIAN */}
          {lang === "ru" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Введение и область применения</h2>
                <p>
                  Образовательная платформа TESTAI.AZ обеспечивает высокий уровень безопасности и защиты персональных данных всех пользователей, учащихся и родителей.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Google AdSense и использование файлов cookie</h2>
                <p>
                  Сторонние поставщики, включая компанию <strong>Google</strong>, используют файлы cookie для показа объявлений с учетом предыдущих посещений нашего или других веб-сайтов. Использование рекламных файлов cookie позволяет Google и партнерам показывать релевантные объявления.
                </p>
                <p className="mt-2">
                  Пользователи могут отказаться от персонализированной рекламы в разделе <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Настройки рекламных предпочтений Google</a>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Защита учебных данных учащихся</h2>
                <p>
                  Результаты диагностических тестирований и успеваемости надежно защищены и используются исключительно в образовательных целях.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Контактная информация</h2>
                <p>По вопросам конфиденциальности обращайтесь на официальный адрес: <strong>aztestai.az@gmail.com</strong></p>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
