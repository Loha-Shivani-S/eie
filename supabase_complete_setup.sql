-- ============================================================
-- COMPLETE SUPABASE SETUP - Run this ONCE in your new project
-- ============================================================

-- 1. Create attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_no TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('participant', 'volunteer')),
  hour INTEGER NOT NULL CHECK (hour >= 1 AND hour <= 12),
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(roll_no, type, hour)
);

-- 2. Create face_descriptors table
CREATE TABLE IF NOT EXISTS public.face_descriptors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_no text NOT NULL,
  type text NOT NULL,
  descriptor jsonb NOT NULL,
  photo_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(roll_no, type)
);

-- 3. Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_no text NOT NULL,
  name text NOT NULL,
  phone_number text NOT NULL,
  department text NOT NULL,
  year text NOT NULL,
  team_name text,
  type text NOT NULL CHECK (type IN ('participant', 'volunteer')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_descriptors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Drop any old restrictive policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can read attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Admins can insert attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Admins can delete attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Admins can manage face descriptors" ON public.face_descriptors;

-- ============================================================
-- Create fully open RLS policies (no Supabase Auth required)
-- ============================================================

-- attendance_records: allow everything publicly
CREATE POLICY "Allow public read on attendance_records" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert on attendance_records" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on attendance_records" ON public.attendance_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on attendance_records" ON public.attendance_records FOR DELETE USING (true);

-- face_descriptors: allow everything publicly
CREATE POLICY "Allow public read on face_descriptors" ON public.face_descriptors FOR SELECT USING (true);
CREATE POLICY "Allow public insert on face_descriptors" ON public.face_descriptors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on face_descriptors" ON public.face_descriptors FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on face_descriptors" ON public.face_descriptors FOR DELETE USING (true);

-- students: allow everything publicly
CREATE POLICY "Allow public read on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert on students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on students" ON public.students FOR UPDATE USING (true);
