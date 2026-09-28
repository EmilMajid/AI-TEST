-- ============================================================
-- TestAI.az — DB Constraints & New Tables
-- Supabase SQL Editor-dən icra edin
-- ============================================================

-- 0.2a: Öz-özünə bağlanma qadağası
ALTER TABLE "ParentStudentLink"
ADD CONSTRAINT "no_self_parent_link"
CHECK ("parentId" <> "studentId");

-- 0.2b: Eyni şagirdə eyni tip valideyn ikinci dəfə bağlanmasın
ALTER TABLE "ParentStudentLink"
ADD CONSTRAINT "unique_student_relationship"
UNIQUE ("studentId", "relationshipType");

-- 0.3: NotificationLog cədvəli
CREATE TABLE IF NOT EXISTS "NotificationLog" (
  id                SERIAL PRIMARY KEY,
  "studentId"       INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
  "parentId"        INTEGER REFERENCES "User"(id) ON DELETE SET NULL,
  "eventType"       TEXT NOT NULL,
  -- 'sent_to_parent' | 'blocked_self' | 'third_party_attempt' | 'parent_blocked'
  "targetEmailMasked" TEXT,
  "thirdPartyLabel"   TEXT,
  "resolvedAt"      TIMESTAMPTZ,
  "resolvedBy"      INTEGER REFERENCES "User"(id),
  "createdAt"       TIMESTAMPTZ DEFAULT NOW()
);

-- 0.4: ParentInvite cədvəli
CREATE TABLE IF NOT EXISTS "ParentInvite" (
  id                 SERIAL PRIMARY KEY,
  "studentId"        INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
  "parentEmail"      TEXT NOT NULL,
  "relationshipType" TEXT NOT NULL,
  -- 'father' | 'mother' | 'guardian' | 'other'
  "inviteToken"      TEXT UNIQUE NOT NULL,
  "status"           TEXT DEFAULT 'pending',
  -- 'pending' | 'accepted' | 'rejected' | 'expired'
  "expiresAt"        TIMESTAMPTZ NOT NULL,
  "acceptedAt"       TIMESTAMPTZ,
  "rejectedAt"       TIMESTAMPTZ,
  "createdAt"        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 0.5: Supabase Data API Access (Oct 30 Rule Compliance)
-- ============================================================

-- NotificationLog üçün icazələr
GRANT SELECT ON public."NotificationLog" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."NotificationLog" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."NotificationLog" TO service_role;

-- ParentInvite üçün icazələr
GRANT SELECT ON public."ParentInvite" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."ParentInvite" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."ParentInvite" TO service_role;

-- SERIAL id ardıcıllıqları üçün icazələr
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

