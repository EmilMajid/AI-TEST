-- Fix profiles table to ensure all columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS father_name VARCHAR(255);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS region VARCHAR(255);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school VARCHAR(255);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS class VARCHAR(2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_type VARCHAR(50);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_profiles_region ON public.profiles(region);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create or replace RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can create profile during signup" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure student_parent_links table exists with proper RLS
CREATE TABLE IF NOT EXISTS public.student_parent_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, parent_id)
);

CREATE INDEX IF NOT EXISTS idx_student_parent_links_student ON public.student_parent_links(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parent_links_parent ON public.student_parent_links(parent_id);

ALTER TABLE public.student_parent_links ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_parent_links
DROP POLICY IF EXISTS "Parents can view their linked students" ON public.student_parent_links;
DROP POLICY IF EXISTS "Students can view their linked parents" ON public.student_parent_links;

CREATE POLICY "Parents can view their linked students" ON public.student_parent_links
  FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = student_id);

CREATE POLICY "Students and parents can manage their links" ON public.student_parent_links
  FOR ALL USING (auth.uid() = parent_id OR auth.uid() = student_id);
