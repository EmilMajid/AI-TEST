# testai.az - Valideyn-Şagird İnteqrasiyası və E-mail Bildiriş Sistemi İcra Planı

**Tarix:** 2026-09-04  
**Status:** Təsdiq Gözləyir  
**Məsul:** QA & Full-Stack Mühəndis  

---

## 1. Məqsəd və Xülasə
Bu icra planının məqsədi `testai.az` platformasında:
1. Valideyn qeydiyyatı və valideynin şagirdi qeydiyyata alması prosesini təkmilləşdirmək;
2. Bu profillərin qarşılıqlı bağlanmasını daimi və təhlükəsiz etmək;
3. Şagirdin verdiyi **real imtahan nəticələrinin** valideyn panelində əks olunmasını təmin etmək (`Math.random()` əvəzinə);
4. İmtahan bitdikdə nəticələrin valideynin qeydiyyatdan keçdiyi e-mail ünvanına avtomatik və peşəkar HTML hesabat şəklində göndərilməsini təmin etmək;
5. Valideynin yaratdığı şagird üçün giriş şifrəsi və istifadəçi adı verərək şagirdin müstəqil imtahan verməsinə şərait yaratmaq.

---

## 2. Cari Vəziyyət və Aşkar Edilən Əsas Çatışmazlıqlar

1. **Nəticələrin Saxta (Random) Olması:**
   - `/api/students/results/route.ts` faylında şagirdin real test nəticələri oxunmur, `Math.random()` ilə generasiya olunan rəqəmlər göstərilir.
2. **E-mail Bildirişlərinin Olmaması:**
   - Şagird testi bitirdikdə (`/api/save-test-result` və ya `/api/tests/submit`) valideynə heç bir e-mail göndərilmir.
   - Layihədə poçt servisi (Nodemailer və ya Resend) və SMTP konfiqurasiyası qurulmayıb.
3. **Şagird Giriş Təminatının Zəifliyi:**
   - Valideyn şagird əlavə edərkən şagird üçün şifrə təyin edilmir, nəticədə şagird fərdi şəkildə sistemə daxil olub test işləyə bilmir.
4. **Demo Rejim və Məlumat İtkisi Riski:**
   - Kodda `isDemoMode = true` sərt kodlaşdırılıb və PostgreSQL bazası kənarda qalıb.

---

## 3. İcra Mərhələləri və Texniki Tapşırıqlar

### Mərhələ 1: Real Test Nəticələrinin Valideyn Panelinə İnteqrasiyası
- **Hədəf Fayl:** `app/api/students/results/route.ts`
  - `Math.random()` hesablamaları ləğv edilir.
  - Şagirdin sistemdə saxlanılmış real test nəticələri (`testai_test_results.json` / Prisma `TestResult`) sorğulanır.
  - Orta bal, fənlər üzrə faizlər, son fəaliyyətlər və zəif mövzular şagirdin həqiqi imtahan cavablarına əsasən hesablanır.
  - Şagird hələ test işləməyibsə, ekranda *"Şagird hələ heç bir test tamamlamayıb"* bildirişi əks olunur.
- **Hədəf Fayl:** `app/api/save-test-result/route.ts` & `app/api/tests/submit/route.ts`
  - Test tamamlandıqda nəticə şagirdin ID-si və unikal kodu ilə qeyd edilir və dərhal valideyn bildiriş servisinə ötürülür.

### Mərhələ 2: E-mail Bildiriş Xidmətinin Qurulması (SMTP / Resend)
- **Yeni Fayl:** `lib/email-service.ts`
  - `nodemailer` əsasında e-mail göndərmə modulu.
  - `.env` faylından `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` oxunur.
  - Əgər SMTP ayarları təyin edilməyibsə, sistem təhlükəsiz rejimdə loq yazır və xəta vermədən davam edir.
- **Yeni Fayl:** `lib/email-templates/test-result-email.ts`
  - Valideyn üçün xüsusi dizayn edilmiş **HTML İmtahan Hesabatı**:
    - Şagirdin Adı, Soyadı, Sinfi və Məktəbi;
    - Fənn və Mövzu adı;
    - Toplanan Bal və Uğur Faizi (vizual rəng indikatoru ilə);
    - Düzgün, səhv və boş sualların sayı;
    - Zəif və təkrar edilməsi tövsiyə olunan mövzular;
    - Birbaşa `testai.az` valideyn panelinə keçid düyməsi.
- **Tətikləmə (Trigger):**
  - Şagird testi bitirib təhvil verdiyi anda arxa fonda valideynin e-mailinə avtomatik məktub göndərilir.

### Mərhələ 3: Şagird Giriş Təminatı və Şifrə Mexanizmi
- **Hədəf Fayl:** `app/api/students/link/route.ts`
  - Valideyn yeni şagird əlavə etdikdə:
    - Şagird üçün standart başlanğıc şifrəsi (`Test@2026`) və unikal `@id` təyin edilir.
    - Şagirdin giriş məlumatları qeydiyyata alınır.
- **Hədəf Fayl:** `app/parent-dashboard/page.tsx`
  - Şagird əlavə edildikdə açılan dialoq pəncərəsində şagirdin giriş məlumatları (İstifadəçi ID və Şifrə) valideynə kart şəklində göstərilir.
  - Valideyn panelində hər şagird üçün **"Nəticələri E-mailə Göndər"** düyməsi əlavə olunur.

### Mərhələ 4: Sınaq və Keyfiyyətə Nəzarət (QA Verification)
- `npm run build` komandası ilə bütün layihənin xətasız kompayl olunması.
- Şagird hesabı ilə test işləmək və nəticənin valideyn panelində real vaxt rejimində əks olunmasını yoxlamaq.
- Valideynin e-mail ünvanına test nəticəsinin çatmasını sınaqdan keçirmək.

---

## 4. Tələb Olunan Konfiqurasiya (.env)
```env
# E-mail Bildirişləri üçün SMTP Parametrləri
SMTP_HOST=smtp.gmail.com # və ya mail.testai.az
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@testai.az
SMTP_PASS=parol_buraya
EMAIL_FROM="testai.az Təhsil Portalı <info@testai.az>"
```
