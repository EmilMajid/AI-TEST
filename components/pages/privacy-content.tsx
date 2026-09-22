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
              href="/terms"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              İstifadə Şərtləri
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
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {lang === "az" && "Məxfilik Siyasəti və Fərdi Məlumatların İşlənilməsi Qaydaları"}
                {lang === "en" && "Privacy Policy and Personal Data Processing Terms"}
                {lang === "tr" && "Gizlilik Politikası ve Kişisel Verilerin İşlenmesi İlkeleri"}
                {lang === "ru" && "Политика конфиденциальности и правила обработки персональных данных"}
              </h1>
              <p className="text-xs text-slate-400 mt-1">TESTAI.AZ Educational AI Platform | Updated: 22 September 2026</p>
            </div>
          </div>

          {/* AZERBAIJANI */}
          {lang === "az" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Ümumi müddəalar və Hüquqi Əsas</h2>
                <p>
                  1.1. Bu Məxfilik Siyasəti TESTAI.AZ platformasının (“TESTAI.AZ”, “Platforma”, “biz”) istifadəçiləri, o cümlədən şagirdlər, valideynlər, qanuni nümayəndələr və müəllimlər haqqında fərdi məlumatların toplanılması, işlənilməsi, saxlanılması, mühafizəsi və məhv edilməsi qaydalarını müəyyən edir.
                </p>
                <p className="mt-2">
                  1.2. TESTAI.AZ fərdi məlumatların işlənilməsi və mühafizəsini Azərbaycan Respublikasının qüvvədə olan qanunvericiliyinə, o cümlədən “Fərdi məlumatlar haqqında” Azərbaycan Respublikasının Qanununa (№ 998-IIIQ) uyğun həyata keçirir. Platformanın fəaliyyəti konkret istifadəçi üzrə Avropa İttifaqı rejiminin tətbiq dairəsinə düşdüyü hallarda müvafiq GDPR tələbləri, 13 yaşdan aşağı uşaqlar üzrə isə tətbiq olunduğu hallarda COPPA prinsipləri nəzərə alınır.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Fərdi məlumatların mülkiyyətçisi və operatoru</h2>
                <p>
                  Platformanın fərdi məlumatlar üzrə operatoru TESTAI.AZ Təhsil Texnologiyaları Komandasıdır. Rəsmi əlaqə e-poçtu: <strong>aztestai.az@gmail.com</strong>. Texniki xidmətlərin göstərilməsi üçün cəlb olunan infrastruktur təminatçıları qanunvericiliyin tələblərinə uyğun həcmdə texniki operator funksiyasını yerinə yetirir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Toplanan fərdi məlumatların kateqoriyaları</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Şagird məlumatları:</strong> Ad, soyad, doğum tarixi/yaş qrupu, təhsil aldığı şəhər/rayon, məktəb nömrəsi, tədris sinfi (I–XI siniflər) və unikal Şagird ID-si.</li>
                  <li><strong>Valideyn məlumatları:</strong> E-poçt ünvanı, əlaqə nömrəsi, Valideyn Kabineti ilə şagird hesabı arasındakı təsdiqlənmiş əlaqə açarı və valideyn razılıq qeydləri.</li>
                  <li><strong>Tədris və diaqnostik məlumatlar:</strong> Test və sınaq nəticələri, səhv cavablandırılmış mövzuların analitik indeksləri, sualın cavablandırılmasına sərf olunan müddət və zəif/güclü tərəflərin analitikası.</li>
                  <li><strong>Texniki məlumatlar:</strong> IP ünvanı (tətbiq edildiyi halda adsızlaşdırılmış və ya qismən maskalanmış formatda), brauzer tipi, əməliyyat sistemi, sessiya identifikatorları və autentifikasiya tokenləri (məsələn, JWT).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Məlumatların işlənilməsinin məqsədləri</h2>
                <p>
                  Məlumatlar yalnız istifadəçi hesabının idarə edilməsi, şagird və valideyn hesablarının əlaqələndirilməsi, rəsmi dərsliklər əsasında fərdiləşdirilmiş testlərin təqdim edilməsi, Valideyn Kabinetinə analitikanın çatdırılması və platformanın texniki təhlükəsizliyinin təmin edilməsi məqsədilə işlənilir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Uşaqların və yetkinlik yaşına çatmayanların məlumatlarının qorunması</h2>
                <p>
                  Yetkinlik yaşına çatmayan şəxslərin məlumatlarının işlənilməsi Azərbaycan Respublikasının qanunvericiliyinə uyğun olaraq valideynin və ya qanuni nümayəndənin razılığı ilə həyata keçirilir. Valideynlər <strong>Valideyn Kabineti (Parent Dashboard)</strong> vasitəsilə uşağın bütün tədris nəticələri ilə tanış olmaq, onların düzəldilməsini və ya silinməsini tələb etmək hüququna malikdirlər.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">6. Süni intellekt və RAG sistemləri üzrə təhlükəsizlik</h2>
                <p>
                  Süni intellekt və RAG modellərinə sorğu göndərilərkən şagirdin ad, soyad və əlaqə kimi birbaşa identifikasiyaedici fərdi məlumatlarının ötürülməsinin qarşısını almaq üçün texniki tədbirlər tətbiq edilir. AI promptlarında yalnız dərslik konteksti və tədris mövzusu istifadə olunur. İstifadəçi məlumatları ümumi süni intellekt modellərinin təlimləndirilməsi (training) üçün istifadə edilmir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">7. Məlumatların ötürülməsi və kommersiya qadağası</h2>
                <p>
                  TESTAI.AZ istifadəçilərin fərdi və təhsil məlumatlarını satmır, icarəyə vermir və müstəqil reklam bazası kimi kommersiya məqsədilə monetizasiya etmir. Məlumatlar yalnız xidmətin göstərilməsi üçün zəruri həcmdə texniki infrastruktur təminatçıları (Supabase/PostgreSQL, Vercel) tərəfindən emal edilir. Supabase platforması SOC 2 Type 2 standartlarına uyğunlaşdırılmış və ISO/IEC 27001 sertifikatına malikdir (bu, təminatçının öz infrastrukturuna aiddir).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">8. Google AdSense və Çərəzlər (Cookies)</h2>
                <p>
                  Platformada pulsuz təhsil resurslarının davamlılığını təmin etmək üçün tətbiq olunduğu hallarda Google AdSense xidmətlərindən istifadə edilə bilər. Uşaqlara yönəlmiş xidmətlər üzrə reklamların nümayişi zamanı qanunvericiliyin və təminatçının uşaq məxfiliyinə dair tələbləri nəzərə alınır. İstifadəçilər fərdiləşdirilmiş reklam parametrlərini istənilən vaxt <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Reklam Parametrləri</a> səhifəsindən idarə edə bilərlər.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">9. Məlumatların silinməsi (məhv edilməsi) hüququ</h2>
                <p>
                  İstifadəçi və ya valideyn qanunvericiliklə müəyyən edilmiş qaydada hesabın və fərdi məlumatların silinməsini tələb edə bilər. Təsdiqlənmiş silinmə sorğuları, qanuni saxlama öhdəlikləri nəzərə alınmaqla, bir qayda olaraq <strong>7 iş günü ərzində</strong> icra edilir. Müraciət üçün: <strong>aztestai.az@gmail.com</strong>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">10. Əlaqə və Hüquqi Üstünlük</h2>
                <p>
                  Fərdi məlumatların qorunması ilə bağlı bütün rəsmi sorğular üçün: <strong>aztestai.az@gmail.com</strong>. Müxtəlif dil versiyaları arasında hər hansı fərq yarandıqda, Azərbaycan dilində olan rəsmi mətn əsas hüquqi mətn hesab edilir.
                </p>
              </section>
            </div>
          )}

          {/* ENGLISH */}
          {lang === "en" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Scope & Legal Framework</h2>
                <p>
                  This Privacy Policy sets forth the principles governing the collection, processing, protection, and erasure of personal data on the <strong>TESTAI.AZ</strong> educational platform. We comply with the Law of the Republic of Azerbaijan on Personal Data (Law No. 998-IIIQ). Where applicable, European Union GDPR standards and US COPPA principles regarding children under 13 are observed.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Data Controller & Processor</h2>
                <p>
                  The data operator of TESTAI.AZ is the TESTAI.AZ Educational Technologies Team. Official contact: <strong>aztestai.az@gmail.com</strong>. Vetted infrastructure providers handle hosting and databases strictly as technical service processors under statutory safeguards.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Categories of Data Collected</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Student Data:</strong> Full name, date of birth/age group, district/school, grade tier (Grades 1–11), and algorithmic Student ID.</li>
                  <li><strong>Parent & Guardian Data:</strong> Contact email, phone reference, Parent Dashboard cryptographic link-key, and parental consent records.</li>
                  <li><strong>Diagnostic Telemetry:</strong> Assessment scores, incorrect answer taxonomy analytics, question timings, and academic progression curves.</li>
                  <li><strong>Technical Metrics:</strong> Anonymized/masked IP addresses, browser/OS configurations, and secure session tokens (such as JWT).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Purposes of Processing</h2>
                <p>
                  Personal data is processed strictly for authenticating accounts, linking student and parent portals, rendering curriculum-based diagnostic assessments, delivering insights to parents, and maintaining system security.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Protection of Minors & Parental Supervision</h2>
                <p>
                  Minor data processing requires parental consent under national statutory standards. Parents retain full visibility through the real-time <strong>Parent Dashboard</strong> and possess the right to inspect, update, or demand permanent erasure of their child's educational records.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">6. AI Processing & PII Isolation</h2>
                <p>
                  Technical measures prevent direct identifying personal data (names, emails, schools) from being dispatched to underlying AI language models. AI queries operate strictly on textbook context. User personal data is never utilized to train public AI models.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">7. Non-Disclosure & Subprocessors</h2>
                <p>
                  TESTAI.AZ never sells, leases, or monetizes user personal or educational records. Subprocessors (Supabase/PostgreSQL, Vercel) process data exclusively for technical service delivery. According to official vendor documentation, Supabase holds SOC 2 Type 2 compliance and ISO/IEC 27001 certification (which pertains to the vendor's own infrastructure).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">8. Advertising & Cookie Technologies</h2>
                <p>
                  Google AdSense may serve ads on eligible public sections to sustain free educational tools. Ads comply with applicable child privacy safeguards. Users may manage personalized advertising settings at any time via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Ads Settings</a>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">9. Right to Erasure ("Right to be Forgotten")</h2>
                <p>
                  Users and legal guardians may request account and record deletion by emailing <strong>aztestai.az@gmail.com</strong>. Subject to statutory retention requirements, verified erasure requests are executed, as a rule, within 7 business days.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">10. Contact & Prevailing Language</h2>
                <p>
                  For all data governance inquiries: <strong>aztestai.az@gmail.com</strong>. In the event of discrepancies between translation versions, the Azerbaijani text shall legally prevail.
                </p>
              </section>
            </div>
          )}

          {/* TURKISH */}
          {lang === "tr" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Kapsam ve Yasal Dayanak</h2>
                <p>
                  TESTAI.AZ platformu olarak kişisel verilerin işlenmesi ve korunmasını Azerbaycan Cumhuriyeti’nin “Kişisel Veriler Hakkında” Kanunu’na (No. 998-IIIQ) tam uyumlu şekilde yürütüyoruz. İlgili olduğu ölçüde GDPR ve 13 yaş altı çocuklar için COPPA prensipleri dikkate alınır.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Veri Sorumlusu ve Toplanan Veriler</h2>
                <p>
                  Veri yöneticisi TESTAI.AZ Eğitim Teknolojileri Ekibidir (İletişim: <strong>aztestai.az@gmail.com</strong>). Öğrenci adı, doğum tarihi/yaş grubu, okul, sınıf düzeyi (1–11. sınıflar), veli e-postası, sınav sonuçları ve oturum belirteçleri yalnızca eğitim ve tanı amacıyla işlenir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Çocukların Verilerinin Korunması ve Veli Denetimi</h2>
                <p>
                  Reşit olmayan öğrencilerin kayıtları veli onayı esasına dayanır. Veliler, <strong>Veli Paneli</strong> üzerinden çocuklarının gelişimini diledikleri an takip edebilir, verileri inceleyebilir ve silinmesini talep edebilirler.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Yapay Zekâ ve Veri İzolasyonu</h2>
                <p>
                  Yapay zekâ ve RAG sorgularına öğrencilerin doğrudan kimlik bilgileri kesinlikle aktarılmaz. AI modelleri kullanıcı kişisel verileriyle eğitilmez.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Veri Güvenliği ve Ticari Satış Yasağı</h2>
                <p>
                  Kullanıcı verileri satılmaz, kiralanmaz ve ticari amaçla üçüncü taraflara aktarılmaz. Altyapı sağlayıcısı Supabase, SOC 2 Type 2 ve ISO/IEC 27001 sertifikalarına sahiptir (bu durum sağlayıcının kendi altyapısına aittir).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">6. Google AdSense ve Çerezler</h2>
                <p>
                  Sitemizde ücretsiz eğitim içeriğinin devamlılığı için Google AdSense hizmetleri kullanılabilir. Kullanıcılar kişiselleştirilmiş reklam tercihlerini <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Reklam Ayarları</a> sayfasından yönetebilir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">7. Verilerin Silinmesi ve İletişim</h2>
                <p>
                  Kullanıcılar veya veliler <strong>aztestai.az@gmail.com</strong> adresine yapacakları bildirimle hesaplarının ve sınav geçmişlerinin yasal istisnalar saklı kalmak kaydıyla 7 iş günü içinde silinmesini sağlayabilirler. Çeviriler arasında ihtilaf halinde Azerbaycan dilindeki metin esastır.
                </p>
              </section>
            </div>
          )}

          {/* RUSSIAN */}
          {lang === "ru" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Область применения и правовые основания</h2>
                <p>
                  Политика конфиденциальности платформы <strong>TESTAI.AZ</strong> определяет порядок обработки и защиты персональных данных в соответствии с Законом Азербайджанской Республики «О персональных данных» (№ 998-IIIQ), применимыми нормами GDPR и стандартами COPPA (для детей младше 13 лет).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Оператор данных и категории</h2>
                <p>
                  Оператор данных: Команда образовательных технологий TESTAI.AZ (Email: <strong>aztestai.az@gmail.com</strong>). Обрабатываются: имя учащегося, дата рождения/возраст, номер школы, класс (1–11), email родителя, результаты тестов и сессионные токены.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Защита данных несовершеннолетних</h2>
                <p>
                  Регистрация несовершеннолетних осуществляется с согласия родителей. Родители контролируют процесс обучения через <strong>Кабинет Родителя</strong> и вправе в любое время запросить исправление или удаление данных.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Искусственный интеллект и безопасность</h2>
                <p>
                  В запросы к моделям генеративного ИИ (RAG) не передаются персональные данные учащихся (имена, контакты). Данные пользователей не используются для обучения публичных моделей ИИ.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Безопасность и запрет на продажу данных</h2>
                <p>
                  Персональные данные не подлежат продаже или аренде. Инфраструктура Supabase соответствует SOC 2 Type 2 и ISO/IEC 27001 (относится к инфраструктуре самого провайдера).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">6. Google AdSense и файлы cookie</h2>
                <p>
                  На платформе могут использоваться сервисы Google AdSense. Пользователи вправе управлять параметрами персонализированной рекламы в разделе <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Настройки рекламы Google</a>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">7. Удаление данных и контакты</h2>
                <p>
                  Запрос на удаление данных можно направить на <strong>aztestai.az@gmail.com</strong>. Запросы исполняются в течение 7 рабочих дней при отсутствии законных оснований для хранения. В случае разночтений версий юридическую силу имеет текст на азербайджанском языке.
                </p>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
