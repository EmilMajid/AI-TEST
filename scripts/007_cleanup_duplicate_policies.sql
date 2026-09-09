-- ====================================================================
-- SUPABASE XƏBƏRDARLIQLARININ (WARNINGS) TAM TƏMİZLƏNMƏSİ
-- Layihə: hkwppwinuyxznjnkdius (testai.az)
-- Hədəf: Təkrar siyasətləri (Multiple Permissive Policies) silmək və
--       bütün RLS qaydalarını (SELECT auth.uid()) ilə optimallaşdırmaq.
-- ====================================================================

-- 1. PROFILES CƏDVƏLİ: Təkrar INSERT siyasətlərinin təmizlənməsi
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can create profile during signup" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Yalnız tək və optimal qaydalar:
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated 
  USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated 
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated 
  WITH CHECK (id = (SELECT auth.uid()));


-- 2. TEST_RESULTS CƏDVƏLİ: Təkrar INSERT siyasətlərinin təmizlənməsi
DROP POLICY IF EXISTS "Users can insert results" ON public.test_results;
DROP POLICY IF EXISTS "Users can insert own test results" ON public.test_results;
DROP POLICY IF EXISTS "Users can insert test results" ON public.test_results;
DROP POLICY IF EXISTS "results_insert_own" ON public.test_results;
DROP POLICY IF EXISTS "Users can view results" ON public.test_results;
DROP POLICY IF EXISTS "Users can view their own results" ON public.test_results;
DROP POLICY IF EXISTS "Users can view own test results" ON public.test_results;
DROP POLICY IF EXISTS "results_select_own" ON public.test_results;

-- Yalnız tək və optimal qaydalar:
CREATE POLICY "Users can view own test results" ON public.test_results
  FOR SELECT TO authenticated 
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own test results" ON public.test_results
  FOR INSERT TO authenticated 
  WITH CHECK (user_id = (SELECT auth.uid()));


-- 3. STUDENT_PARENT_LINKS: Təkrar SELECT siyasətinin aradan qaldırılması
-- "FOR ALL" artıq SELECT-i əhatə etdiyi üçün ayrıca "view own links" təkrar sayılırdı
DROP POLICY IF EXISTS "Parents can view their linked students" ON public.student_parent_links;
DROP POLICY IF EXISTS "Students can view their linked parents" ON public.student_parent_links;
DROP POLICY IF EXISTS "Students and parents can manage their links" ON public.student_parent_links;
DROP POLICY IF EXISTS "Users can view own links" ON public.student_parent_links;
DROP POLICY IF EXISTS "Users can manage own links" ON public.student_parent_links;

-- Yalnız tək və optimal idarəetmə qaydası (SELECT, INSERT, UPDATE, DELETE hər birini tək siyasətlə qoruyur):
CREATE POLICY "Users can manage own links" ON public.student_parent_links
  FOR ALL TO authenticated 
  USING (
    parent_id = (SELECT auth.uid()) OR student_id = (SELECT auth.uid())
  )
  WITH CHECK (
    parent_id = (SELECT auth.uid()) OR student_id = (SELECT auth.uid())
  );
