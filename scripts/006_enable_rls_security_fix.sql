-- ====================================================================
-- SUPABASE TƏHLÜKƏSİZLİK DÜZƏLİŞİ (SECURITY ADVISOR FIX)
-- Layihə: hkwppwinuyxznjnkdius (testai.az)
-- Təhlükə: rls_disabled_in_public & sensitive_columns_exposed
-- Hədəf: 'User', 'ParentStudentLink', 'TestResult' və digər açıq cədvəllərdə
--       Row-Level Security (RLS) aktivləşdirərək anonim/kənar şəxslərin
--       məlumatları oxumasını, dəyişməsini və silməsini tam dayandırmaq.
-- ====================================================================

-- 1. "User" cədvəli: Şifrələr və fərdi məlumatlar açıqdır
ALTER TABLE IF EXISTS public."User" ENABLE ROW LEVEL SECURITY;

-- Anonim kənar şəxslər üçün bütün birbaşa API sorğularını bloklayırıq
DROP POLICY IF EXISTS "Deny public anon access to User" ON public."User";
CREATE POLICY "Deny public anon access to User"
ON public."User"
FOR ALL
TO anon
USING (false)
WITH CHECK (false);


-- 2. "ParentStudentLink" cədvəli: Valideyn-şagird əlaqələri
ALTER TABLE IF EXISTS public."ParentStudentLink" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny public anon access to ParentStudentLink" ON public."ParentStudentLink";
CREATE POLICY "Deny public anon access to ParentStudentLink"
ON public."ParentStudentLink"
FOR ALL
TO anon
USING (false)
WITH CHECK (false);


-- 3. "TestResult" cədvəli: Şagirdlərin imtahan nəticələri və cavabları
ALTER TABLE IF EXISTS public."TestResult" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny public anon access to TestResult" ON public."TestResult";
CREATE POLICY "Deny public anon access to TestResult"
ON public."TestResult"
FOR ALL
TO anon
USING (false)
WITH CHECK (false);


-- 4. Əlavə ehtiyat cədvəllərində də RLS-in təmin olunması
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_parent_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platform_logs ENABLE ROW LEVEL SECURITY;

-- platform_settings üçün anon yalnız oxuya bilsin (dəyişə bilməsin)
DROP POLICY IF EXISTS "Allow anon read platform_settings" ON public.platform_settings;
CREATE POLICY "Allow anon read platform_settings"
ON public.platform_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- profiles üçün yalnız daxil olmuş istifadəçi öz məlumatını görə bilsin
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- test_results üçün yalnız daxil olmuş istifadəçi öz testini görə bilsin
DROP POLICY IF EXISTS "Users can view own test results" ON public.test_results;
CREATE POLICY "Users can view own test results"
ON public.test_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ====================================================================
-- QEYD:
-- Bizim Next.js backend sistemimiz (app/api/... və lib/user-store.ts)
-- 'service_role' açarından istifadə edir.
-- PostgreSQL-də 'service_role' avtomatik olaraq 'BYPASSRLS' hüququna
-- malikdir, ona görə də bu düzəlişdən sonra saytın işində heç bir
-- fasilə və ya xəta yaranmayacaq, lakin kənar hakerlər tam bloklanacaq.
-- ====================================================================
