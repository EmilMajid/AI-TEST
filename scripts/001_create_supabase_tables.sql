-- Create users profile table linked to Supabase auth
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  father_name text,
  account_type text check (account_type in ('student', 'parent')),
  role text check (role in ('parent', 'teacher', 'director')),
  class text check (class in ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11')),
  region text,
  school text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  last_login timestamp with time zone
);

alter table public.profiles enable row level security;

-- Users can view and update their own profile
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Parent-student links
create table if not exists public.parent_student_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references auth.users(id) on delete cascade,
  student_id uuid references auth.users(id) on delete cascade,
  relationship_type text,
  status text default 'active' check (status in ('active', 'pending', 'inactive')),
  approved_at timestamp with time zone,
  linked_at timestamp with time zone default timezone('utc'::text, now()),
  unique(parent_id, student_id)
);

alter table public.parent_student_links enable row level security;

-- Parents can see their linked students
create policy "links_select_parent" on public.parent_student_links 
  for select using (auth.uid() = parent_id);

-- Test results
create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  textbook text,
  topic text,
  class text,
  score integer check (score >= 0 and score <= 100),
  time_spent integer,
  answers jsonb,
  completed_at timestamp with time zone,
  saved_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.test_results enable row level security;

-- Users can only see their own test results
create policy "results_select_own" on public.test_results 
  for select using (auth.uid() = user_id);

-- Users can insert their own test results
create policy "results_insert_own" on public.test_results 
  for insert with check (auth.uid() = user_id);

-- Audit logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text,
  entity text,
  entity_id uuid,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.audit_logs enable row level security;

-- Only admins can view audit logs
create policy "audit_logs_admin_only" on public.audit_logs 
  for select using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'director'
    )
  );

-- Create trigger for auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
