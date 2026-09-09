-- ====================================================================
-- SUPABASE BÜTÜN ADVISOR XƏBƏRDARLIQLARININ HƏLLİ (COMPLETE FIX)
-- Layihə: hkwppwinuyxznjnkdius (testai.az)
-- Bütün 14 Xəbərdarlığı Birdəfəlik Həll Edən Təmizlənmiş Master Skript
-- ====================================================================

-- --------------------------------------------------------------------
-- HİSSƏ 1: KRİTİK XƏTALAR (RLS Disabled & Sensitive Columns Exposed)
-- Hədəf: 'User', 'ParentStudentLink', 'TestResult'
-- --------------------------------------------------------------------

-- 1.1 "User" cədvəli: RLS aktivləşdirilir və kənar anonim giriş bağlanır
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny public anon access to User" ON public."User";
DROP POLICY IF EXISTS "Deny public access to User" ON public."User";
CREATE POLICY "Deny public access to User"
ON public."User"
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 1.2 "ParentStudentLink" cədvəli: RLS aktivləşdirilir
ALTER TABLE public."ParentStudentLink" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny public anon access to ParentStudentLink" ON public."ParentStudentLink";
DROP POLICY IF EXISTS "Deny public access to ParentStudentLink" ON public."ParentStudentLink";
CREATE POLICY "Deny public access to ParentStudentLink"
ON public."ParentStudentLink"
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 1.3 "TestResult" cədvəli: RLS aktivləşdirilir
ALTER TABLE public."TestResult" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny public anon access to TestResult" ON public."TestResult";
DROP POLICY IF EXISTS "Deny public access to TestResult" ON public."TestResult";
CREATE POLICY "Deny public access to TestResult"
ON public."TestResult"
FOR ALL
TO anon
USING (false)
WITH CHECK (false);


-- --------------------------------------------------------------------
-- HİSSƏ 2: AUTH RLS INITIALIZATION PLAN OPTİMİZASİYASI
-- Supabase Xəbərdarlığı: auth.uid() hər sətir üçün təkrar çağırılır.
-- Həll: (SELECT auth.uid()) formasında scalar subquery kimi keşlənir.
-- Hədəf: 'profiles' və 'test_results'
-- --------------------------------------------------------------------

-- 2.1 profiles cədvəli üçün köhnə qaydaları silirik
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can create profile during signup" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- profiles üçün optimallaşdırılmış RLS siyasətləri
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


-- 2.2 test_results cədvəli üçün köhnə qaydaları silirik
DROP POLICY IF EXISTS "Users can view their own results" ON public.test_results;
DROP POLICY IF EXISTS "Users can insert test results" ON public.test_results;
DROP POLICY IF EXISTS "results_select_own" ON public.test_results;
DROP POLICY IF EXISTS "results_insert_own" ON public.test_results;
DROP POLICY IF EXISTS "Users can view own test results" ON public.test_results;
DROP POLICY IF EXISTS "Users can insert own test results" ON public.test_results;

-- test_results üçün optimallaşdırılmış RLS siyasətləri
CREATE POLICY "Users can view own test results" ON public.test_results
  FOR SELECT TO authenticated 
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own test results" ON public.test_results
  FOR INSERT TO authenticated 
  WITH CHECK (user_id = (SELECT auth.uid()));


-- --------------------------------------------------------------------
-- HİSSƏ 3: RLS ENABLED NO POLICY
-- Supabase Xəbərdarlığı: student_parent_links cədvəlində RLS var amma siyasət yoxdur.
-- Hədəf: 'student_parent_links'
-- --------------------------------------------------------------------

ALTER TABLE public.student_parent_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their linked students" ON public.student_parent_links;
DROP POLICY IF EXISTS "Students can view their linked parents" ON public.student_parent_links;
DROP POLICY IF EXISTS "Students and parents can manage their links" ON public.student_parent_links;
DROP POLICY IF EXISTS "Users can view own links" ON public.student_parent_links;
DROP POLICY IF EXISTS "Users can manage own links" ON public.student_parent_links;

CREATE POLICY "Users can view own links" ON public.student_parent_links
  FOR SELECT TO authenticated 
  USING (
    parent_id = (SELECT auth.uid()) OR student_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can manage own links" ON public.student_parent_links
  FOR ALL TO authenticated 
  USING (
    parent_id = (SELECT auth.uid()) OR student_id = (SELECT auth.uid())
  )
  WITH CHECK (
    parent_id = (SELECT auth.uid()) OR student_id = (SELECT auth.uid())
  );


-- --------------------------------------------------------------------
-- HİSSƏ 4: UNINDEXED FOREIGN KEYS (İndekssiz Xarici Açarlar)
-- Supabase Xəbərdarlığı: Cədvəllərdə xarici açarlar indekslənməyib.
-- Hədəf: 'ParentStudentLink', 'TestResult', 'student_parent_links', 'test_results'
-- --------------------------------------------------------------------

-- 4.1 "ParentStudentLink" üçün indekslər
CREATE INDEX IF NOT EXISTS idx_parent_student_link_parent_id 
  ON public."ParentStudentLink"("parentId");

CREATE INDEX IF NOT EXISTS idx_parent_student_link_student_id 
  ON public."ParentStudentLink"("studentId");

-- 4.2 "TestResult" üçün indeks
CREATE INDEX IF NOT EXISTS idx_test_result_user_id 
  ON public."TestResult"("userId");

-- 4.3 "student_parent_links" üçün indekslər
CREATE INDEX IF NOT EXISTS idx_student_parent_links_student_id 
  ON public.student_parent_links(student_id);

CREATE INDEX IF NOT EXISTS idx_student_parent_links_parent_id 
  ON public.student_parent_links(parent_id);

-- 4.4 "test_results" üçün indeks
CREATE INDEX IF NOT EXISTS idx_test_results_user_id 
  ON public.test_results(user_id);
