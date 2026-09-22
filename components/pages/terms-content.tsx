"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, ArrowLeft } from "lucide-react"
import { LanguageDropdown, Lang } from "@/components/language-dropdown"

interface TermsContentProps {
  initialLang?: Lang
}

export function TermsContent({ initialLang = "az" }: TermsContentProps) {
  const [lang, setLang] = useState<Lang>(initialLang)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span>TESTAI.AZ</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Məxfilik
            </Link>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Bloq
            </Link>
            <LanguageDropdown currentLang={lang} onSelectLang={setLang} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-10 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {lang === "az" && "İstifadə Şərtləri və Qaydaları"}
                {lang === "en" && "Terms of Service & User Agreement"}
                {lang === "tr" && "Kullanım Şartları ve Kullanıcı Sözleşmesi"}
                {lang === "ru" && "Условия использования платформы"}
              </h1>
              <p className="text-xs text-slate-400 mt-1">TESTAI.AZ Educational AI Platform | Updated: 22 September 2026</p>
            </div>
          </div>

          {/* AZERBAIJANI */}
          {lang === "az" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Ümumi müddəalar və Şərtlərin qəbulu</h2>
                <p>
                  1.1. Bu İstifadə Şərtləri (“Şərtlər”) <strong>TESTAI.AZ</strong> platformasından istifadə qaydalarını və istifadəçilərin (şagirdlər, valideynlər, müəllimlər) hüquq və öhdəliklərini tənzimləyir.
                </p>
                <p className="mt-2">
                  1.2. Platformada qeydiyyatdan keçməklə hər bir istifadəçi bu Şərtləri və <Link href="/privacy" className="text-blue-600 underline">Məxfilik Siyasətini</Link> qəbul etdiyini təsdiqləyir. Yetkinlik yaşına çatmayanların qeydiyyatı valideynin və ya qanuni nümayəndənin məlumatı və razılığı ilə həyata keçirilir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Xidmətin mahiyyəti və Rəsmi Attestasiya İmtinası</h2>
                <p>
                  2.1. TESTAI.AZ rəsmi tədris dərslikləri əsasında süni intellekt (RAG) dəstəkli fərdiləşdirilmiş testlər və diaqnostika təqdim edən təhsil köməkçisidir.
                </p>
                <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
                  Hüquqi Bəyannamə: TESTAI.AZ platformasında toplanan xallar və diaqnostik göstəricilər şagirdin fərdi inkişafı və boşluqların aşkar edilməsi məqsədi daşıyır. Bu nəticələr rəsmi dövlət imtahanı (DİM), məktəb qiyməti, rəsmi attestasiya və ya dövlət təhsil sənədi xarakteri DAŞIMIR.
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. İstifadəçi öhdəlikləri</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Qeydiyyat zamanı məlumatları (sinif, region, məktəb) dürüst daxil etmək;</li>
                  <li>Hesabın məxfiliyini qorumaq və Şagird ID-ni kənar şəxslərə verməmək;</li>
                  <li>Avtomatlaşdırılmış botlar vasitəsilə testləri kütləvi yükləməmək (scraping qadağandır);</li>
                  <li>Platformanın sabit fəaliyyətinə və təhlükəsizliyinə xələl gətirməmək.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Əqli mülkiyyət</h2>
                <p>
                  TESTAI.AZ proqram təminatı, SİTG metodologiyası, brend nişanları və analitik alqoritmlər platformanın əqli mülkiyyətidir və qanunvericiliklə qorunur. İstifadə edilən dərslik materiallarının müəllif hüquqları aidiyyəti dövlət təhsil qurumlarına və dərslik müəlliflərinə aiddir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Tətbiq edilən hüquq və Əlaqə</h2>
                <p>
                  Bu Şərtlər Azərbaycan Respublikasının qanunvericiliyinə tabedir. Bütün sual və müraciətlər üçün rəsmi əlaqə: <strong>aztestai.az@gmail.com</strong>.
                </p>
              </section>
            </div>
          )}

          {/* ENGLISH */}
          {lang === "en" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
                <p>
                  By accessing or registering on <strong>TESTAI.AZ</strong>, users agree to be bound by these Terms of Service and our <Link href="/en/privacy" className="text-blue-600 underline">Privacy Policy</Link>. Minor registrations are conditioned upon parental/guardian knowledge and consent.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Nature of Services & Educational Disclaimer</h2>
                <p>
                  TESTAI.AZ provides supplementary diagnostic assessments and analytics based on authorized curriculum textbooks.
                </p>
                <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
                  Legal Disclaimer: Assessment scores, metrics, and topic diagnostic evaluations generated by TESTAI.AZ are supplementary educational aids and DO NOT constitute official state diplomas, school grade reports, or Ministry attestations.
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. User Responsibilities & Acceptable Use</h2>
                <p>
                  Users must safeguard account credentials. Automated scraping, data extraction bots, and technical tampering are strictly prohibited.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Governing Law & Inquiries</h2>
                <p>
                  These Terms are governed by the laws of the Republic of Azerbaijan. For official support: <strong>aztestai.az@gmail.com</strong>.
                </p>
              </section>
            </div>
          )}

          {/* TURKISH */}
          {lang === "tr" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Şartların Kabulü</h2>
                <p>
                  <strong>TESTAI.AZ</strong> platformasını kullanan veya kayıt olan tüm kullanıcılar bu Kullanım Şartlarını ve <Link href="/tr/privacy" className="text-blue-600 underline">Gizlilik Politikasını</Link> kabul etmiş sayılır.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Hizmet Niteliği ve Yasal Beyan</h2>
                <p>
                  TESTAI.AZ resmi ders kitapları doğrultusunda tanı testleri sunar. Platformdaki sınav sonuçları resmi devlet diploması veya okul notu niteliği taşımaz; bireysel gelişim amaçlıdır.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. İletişim</h2>
                <p>Sorularınız için: <strong>aztestai.az@gmail.com</strong>.</p>
              </section>
            </div>
          )}

          {/* RUSSIAN */}
          {lang === "ru" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Принятие условий</h2>
                <p>
                  Регистрируясь на <strong>TESTAI.AZ</strong>, пользователи принимают настоящие Условия и <Link href="/ru/privacy" className="text-blue-600 underline">Политику конфиденциальности</Link>. Регистрация несовершеннолетних осуществляется с согласия родителей.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Отказ от официальной аттестации</h2>
                <p>
                  Результаты тестирования на TESTAI.AZ носят исключительно вспомогательный диагностический характер и не являются официальной государственной аттестацией или школьными оценками.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Контакты</h2>
                <p>Для обращений: <strong>aztestai.az@gmail.com</strong>.</p>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
