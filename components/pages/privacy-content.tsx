"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"
import { LanguageDropdown, Lang } from "@/components/language-dropdown"

interface PrivacyContentProps {
  initialLang?: Lang
}

export function PrivacyContent({ initialLang = "az" }: PrivacyContentProps) {
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
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Ümumi Müddəalar və Hüquqi Əsas</h2>
                <p>
                  Bu Məxfilik Siyasəti <strong>TESTAI.AZ</strong> (“Platforma”, “Biz”) tərəfindən idarə olunan təhsil və süni intellekt diaqnostika sistemindən istifadə edən istifadəçilərin (şagirdlər, valideynlər, müəllimlər və ziyarətçilər) fərdi məlumatlarının toplanması, işlənməsi və qorunması qaydalarını müəyyən edir.
                </p>
                <p className="mt-2">
                  Məlumatların işlənməsi “Fərdi məlumatlar haqqında” Azərbaycan Respublikasının Qanununa (№ 998-IIIQ), Azərbaycan Respublikasının Təhsil haqqında Qanunvericiliyinə, habelə beynəlxalq məlumat təhlükəsizliyi standartlarına (GDPR və Uşaqların Onlayn Məxfiliyinin Qorunması Qaydaları - COPPA prinsipləri) tam uyğun olaraq həyata keçirilir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Toplanan Məlumatların Kateqoriyaları</h2>
                <p>Platformamız tədris və diaqnostika keyfiyyətini təmin etmək üçün yalnız zəruri məlumatları toplayır:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Şagird Qeydiyyat Göstəriciləri:</strong> Ad, soyad, doğum tarixi / yaş kateqoriyası, təhsil aldığı region (şəhər/rayon), məktəb nömrəsi, tədris sinfi (I–XI siniflər) və unikal Şagird ID kodu (məs: STU-123456).</li>
                  <li><strong>Valideyn Məlumatları:</strong> Əlaqə e-poçtu, telefon nömrəsi və Valideyn Kabineti ilə şagird profili arasındakı təsdiqlənmiş əlaqə açarı.</li>
                  <li><strong>Akademik və Pedaqoji Diaqnostika:</strong> Test və sınaq nəticələri, səhv cavablandırılmış mövzu indeksləri, suallara sərf olunan düşünmə vaxtı və mövzu üzrə zəif/güclü tərəflərin analitikası.</li>
                  <li><strong>Texniki Göstəricilər:</strong> Anonimləşdirilmiş IP ünvanı, cihaz və brauzer tipi, təhlükəsiz seans identifikatorları (JWT tokens).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Uşaqların Məxfiliyi və Valideyn Nəzarəti (COPPA & Milli Standart)</h2>
                <p>
                  Platformamız məktəbyaşlı uşaqlar üçün nəzərdə tutulduğundan, yetkinlik yaşına çatmayanların (18 yaşa qədər, xüsusən 13–16 yaşdan aşağı şagirdlər) qeydiyyatı valideynin və ya qanuni qəyyumun məlumatı və razılığı ilə həyata keçirilir.
                </p>
                <p className="mt-2">
                  Valideynlər <strong>Valideyn Kabineti (Parent Dashboard)</strong> vasitəsilə övladının bütün tədris fəaliyyətini, toplanmış diaqnostik göstəricilərini canlı izləmək, nəzarətdə saxlamaq və istənilən an məlumatların düzəldilməsini və ya silinməsini tələb etmək hüququna malikdirlər.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Süni İntellekt Modelləri və Fərdi Məlumatların Ayrılması</h2>
                <p>
                  TESTAI.AZ sistemində testlərin generasiyası və analizi üçün istifadə edilən RAG və Süni İntellekt alqoritmlərinə <strong>şagirdlərin heç bir fərdi identifikasiya məlumatı (ad, soyad, doğum tarixi, əlaqə vasitəsi) ÖTÜRÜLMÜR</strong>.
                </p>
                <p className="mt-2">
                  Generasiya sorğularında (prompt) yalnız dərslik konteksti və tədris mövzuları istifadə olunur. Süni İntellekt modelləri istifadəçilərin fərdi məlumatları üzərində təlimləndirilmir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Məlumatların Qorunması və Kommersiya Qadağası</h2>
                <p>
                  Bütün məlumatlar beynəlxalq SOC2 və ISO 27001 təhlükəsizlik sertifikatlarına malik bulud bazalarında (Supabase / PostgreSQL mühiti), TLS 1.3 və AES-256 şifrələmə protokolları ilə qorunur.
                </p>
                <p className="mt-2 font-medium text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  Kommersiya Qadağası: TESTAI.AZ istifadəçilərin şəxsi və ya təhsil məlumatlarını heç bir halda kənar şirkətlərə, brokerlərə və ya reklam agentliklərinə SATMIR, İCARƏYƏ VERMİR və kommersiya məqsədilə ötürmür.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">6. Google AdSense və Çərəzlər (Cookies)</h2>
                <p>
                  Platformamızda açıq və pulsuz təhsil resurslarının davamlılığını təmin etmək məqsədilə üçüncü tərəf reklam təminatçısı kimi <strong>Google AdSense</strong> istifadə oluna bilər. Google və onun tərəfdaşları istifadəçilərin bu və digər internet saytlarına əvvəlki ziyarətləri əsasında reklamlar göstərmək üçün çərəzlərdən (cookies) istifadə edə bilərlər.
                </p>
                <p className="mt-2">
                  İstifadəçilər fərdiləşdirilmiş reklamlardan imtina etmək üçün <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Reklam Parametrləri</a> və ya <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">aboutads.info</a> səhifəsini ziyarət edə bilərlər.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">7. İstifadəçi Hüquqları və Məlumatların Silinməsi ("Unudulma Hüququ")</h2>
                <p>
                  Hər bir istifadəçi və ya onun qanuni valideyni öz hesabının, test nəticələrinin və profil qeydlərinin sistemdən tamamilə silinməsini tələb etmək hüququna malikdir. Müraciət əsasında bütün əlaqəli qeydlər <strong>7 iş günü</strong> ərzində bazadan bərpa olunmaz şəkildə xaric edilir.
                </p>
                <p className="mt-2">
                  Silinmə sorğusu üçün profil tənzimləmələrindən və ya rəsmi <strong>aztestai.az@gmail.com</strong> ünvanına Şagird ID-si ilə müraciət göndərmək kifayətdir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">8. Əlaqə və Hüquqi Müraciətlər</h2>
                <p>Məxfilik siyasəti və fərdi məlumatların qorunması üzrə rəsmi əlaqə: <strong>aztestai.az@gmail.com</strong></p>
                <p className="text-xs text-slate-500 mt-1">Sorğular maksimum 48 iş saatı ərzində rəsmi cavablandırılır.</p>
              </section>
            </div>
          )}

          {/* ENGLISH */}
          {lang === "en" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Scope & Legal Framework</h2>
                <p>
                  This Privacy Policy governs the processing and protection of personal and educational data collected by <strong>TESTAI.AZ</strong> ("Platform", "We"). We adhere strictly to the Law of the Republic of Azerbaijan on Personal Data (Law No. 998-IIIQ), applicable national educational standards, the European Union General Data Protection Regulation (GDPR), and the principles of the Children's Online Privacy Protection Act (COPPA).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Categories of Data Collected</h2>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Learner Identity:</strong> Full name, date of birth / age bracket, assigned school, educational grade (Grades 1–11), and a unique algorithmic Student Identifier (e.g. STU-123456).</li>
                  <li><strong>Parent / Guardian Information:</strong> Contact email address, guardian phone reference, and cryptographic link-keys connecting parent dashboards to student profiles.</li>
                  <li><strong>Pedagogical & Diagnostic Telemetry:</strong> Assessment scores, incorrect answer taxonomy indices, granular response times, and topic-specific proficiency tracking.</li>
                  <li><strong>System Logs:</strong> Anonymized IP addresses, browser agent headers, device configurations, and encrypted session authorization tokens (JWT).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Protection of Minors & Parental Supervision (COPPA Compliance)</h2>
                <p>
                  As an educational platform serving primary and secondary school learners, minor accounts are managed with parental knowledge and consent. Parents maintain full continuous oversight through the real-time <strong>Parent Dashboard</strong> and have the right to inspect, correct, or demand total deletion of student data at any time.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. AI Processing & Data Isolation</h2>
                <p>
                  Artificial Intelligence and Retrieval-Augmented Generation (RAG) models utilized by TESTAI.AZ <strong>never receive personally identifiable information (PII)</strong>. Prompts are strictly restricted to textbook syllabus excerpts. User data is never used to train public language models.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Data Security & Commercial Non-Disclosure</h2>
                <p>
                  All data is encrypted in transit (TLS 1.3) and at rest (AES-256) inside SOC2-certified PostgreSQL / Supabase cloud infrastructure.
                </p>
                <p className="mt-2 font-medium text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  Zero-Sale Guarantee: TESTAI.AZ never sells, leases, monetizes, or shares user personal or educational records with third-party marketers or data brokers.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">6. Google AdSense & Cookie Technologies</h2>
                <p>
                  Third-party vendors, including <strong>Google AdSense</strong>, may serve ads to support our open educational access. Google's use of advertising cookies enables it and its partners to serve relevant ads based on visits to this and other sites.
                </p>
                <p className="mt-2">
                  Users may opt out of personalized advertising anytime by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">aboutads.info</a>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">7. Right to Erasure ("Right to be Forgotten")</h2>
                <p>
                  Users and legal guardians retain the absolute right to have accounts and historical performance records permanently deleted. Upon written request submitted via profile settings or to <strong>aztestai.az@gmail.com</strong>, all data is permanently purged within 7 business days.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">8. Contact Information</h2>
                <p>For privacy and data protection inquiries: <strong>aztestai.az@gmail.com</strong></p>
              </section>
            </div>
          )}

          {/* TURKISH */}
          {lang === "tr" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Kapsam ve Yasal Dayanak</h2>
                <p>
                  TESTAI.AZ platformu olarak öğrencilerimizin, velilerimizin ve öğretmenlerimizin kişisel verilerinin korunmasına en üst düzeyde önem veriyoruz. Veri işleme süreçlerimiz Azerbaycan Cumhuriyeti Kişisel Verilerin Korunması Kanunu (No. 998-IIIQ), KVKK ve uluslararası çocuk veri güvenliği (COPPA) prensiplerine tam uyumludur.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Toplanan Veri Türleri</h2>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Öğrenci Verileri:</strong> Ad, soyad, doğum tarihi/yaş, bölge, okul numarası, sınıf düzeyi (1–11. sınıflar) ve Öğrenci ID kodu.</li>
                  <li><strong>Veli Bilgileri:</strong> İletişim e-postası, telefon numarası ve Veli Paneli bağlantı anahtarları.</li>
                  <li><strong>Pedagojik ve Akademik Analiz:</strong> Sınav sonuçları, yanlış cevap analizleri ve konu bazlı başarı oranları.</li>
                  <li><strong>Teknik Veriler:</strong> Anonimleştirilmiş IP adresi, cihaz türü ve güvenli oturum çerezleri.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Çocukların Gizliliği ve Veli Denetimi (COPPA Uyumluluğu)</h2>
                <p>
                  Reşit olmayan öğrencilerin kayıtları veli gözetimi ve onayı esasına dayanır. Veliler, <strong>Veli Paneli</strong> üzerinden çocuklarının gelişimini diledikleri an takip edebilir ve istedikleri takdirde tüm verilerin kalıcı olarak silinmesini talep edebilir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Yapay Zeka ve Veri Güvenliği</h2>
                <p>
                  Soru üretiminde kullanılan yapay zeka sistemlerine hiçbir kişisel veri (isim, e-posta, okul vb.) kesinlikle aktarılmaz. AI modelleri kullanıcı verileriyle eğitilmez.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Veri Güvenliği ve Ticari Satış Yasağı</h2>
                <p>
                  Kullanıcı verileri hiçbir ticari kuruluşa satılmaz, kiralanmaz veya devredilmez. Tüm veriler TLS 1.3 şifreleme protokolüyle güvence altındadır.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">6. Google AdSense ve Çerezler</h2>
                <p>
                  Sitemizde ücretsiz eğitim içeriğinin devamlılığı için <strong>Google AdSense</strong> hizmetleri kullanılabilir. Kullanıcılar kişiselleştirilmiş reklam tercihlerini <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Reklam Ayarları</a> sayfasından yönetebilir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">7. Verilerin Silinmesi Hakkı ("Unutulma Hakkı")</h2>
                <p>
                  Kullanıcılar veya veliler <strong>aztestai.az@gmail.com</strong> adresine yapacakları bildirimle hesaplarının ve tüm sınav geçmişlerinin 7 iş günü içinde kalıcı olarak silinmesini talep edebilirler.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">8. İletişim</h2>
                <p>Gizlilik politikamız ile ilgili tüm sorularınız için: <strong>aztestai.az@gmail.com</strong></p>
              </section>
            </div>
          )}

          {/* RUSSIAN */}
          {lang === "ru" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Область применения и правовые основания</h2>
                <p>
                  Политика конфиденциальности платформы <strong>TESTAI.AZ</strong> определяет порядок сбора, обработки и защиты персональных данных в строгом соответствии с Законом Азербайджанской Республики «О персональных данных» (№ 998-IIIQ), нормами GDPR и стандартами COPPA.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Категории обрабатываемых данных</h2>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Данные учащегося:</strong> Имя и фамилия, дата рождения/возраст, регион, номер школы, класс (1–11 классы), уникальный идентификатор ученика (Student ID).</li>
                  <li><strong>Данные родителей:</strong> Адрес электронной почты, контактные данные, защищенный ключ связки с профилем ребенка.</li>
                  <li><strong>Диагностические метрики:</strong> Результаты тестирований, протоколы ошибок по темам учебников, время решения задач.</li>
                  <li><strong>Технические данные:</strong> Анонимизированный IP-адрес, тип браузера, защищенные сессионные токены (JWT).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Защита данных несовершеннолетних и родительский контроль</h2>
                <p>
                  Регистрация несовершеннолетних осуществляется с согласия родителей. Родители имеют постоянный доступ к результатам через <strong>Кабинет Родителя</strong> и обладают правом запросить изменение или полное удаление данных ребенка в любое время.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Искусственный интеллект и безопасность</h2>
                <p>
                  В запросы к моделям генеративного ИИ <strong>никогда не передаются персональные данные пользователей</strong>. Алгоритмы RAG оперируют исключительно учебным контекстом утвержденных учебников.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Безопасность и запрет на коммерческую передачу</h2>
                <p>
                  Персональные данные пользователей надежно зашифрованы (TLS 1.3 / AES-256) в инфраструктуре Supabase/PostgreSQL (SOC2) и ни при каких обстоятельствах не подлежат продаже, аренде или передаче сторонним организациям.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">6. Google AdSense и файлы cookie</h2>
                <p>
                  Для поддержки бесплатного функционала на платформе могут использоваться рекламные сервисы <strong>Google AdSense</strong>. Пользователи вправе отключить персонализированную рекламу в разделе <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Настройки рекламы Google</a>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">7. Право на удаление данных («Право на забвение»)</h2>
                <p>
                  Пользователь или родитель может в любое время запросить безвозвратное удаление учетной записи и всех результатов, направив запрос на <strong>aztestai.az@gmail.com</strong>. Удаление выполняется в течение 7 рабочих дней.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">8. Контактная информация</h2>
                <p>По вопросам конфиденциальности: <strong>aztestai.az@gmail.com</strong></p>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
