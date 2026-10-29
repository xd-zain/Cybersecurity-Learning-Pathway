-- ==============================================================================
-- Cybersecurity Learning Pathway (Security Analyzires) - Supabase Schema
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create Profiles Table (Syncs with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- 2. Create Module Progress Table
CREATE TABLE IF NOT EXISTS public.module_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_module UNIQUE (email, module_id)
);

ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

-- Progress Policies
CREATE POLICY "Users can view their own progress"
  ON public.module_progress FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can insert their own progress"
  ON public.module_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update their own progress"
  ON public.module_progress FOR UPDATE
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = email);


-- 3. Create Certificates Table (Verified Course Completion)
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  average_score NUMERIC(5, 2) NOT NULL,
  total_modules INTEGER DEFAULT 10,
  verification_hash TEXT NOT NULL
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Allow certificate owners to view, and anyone with certificate ID to verify authenticity
CREATE POLICY "Public can view valid certificates for verification"
  ON public.certificates FOR SELECT
  USING (true);

CREATE POLICY "Users can create certificate record"
  ON public.certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = email);


-- 4. Automatic profile creation on new signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
