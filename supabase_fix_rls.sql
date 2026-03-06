-- Drop foreign key constraints that require a Supabase Auth User ID
ALTER TABLE public.face_descriptors DROP CONSTRAINT IF EXISTS face_descriptors_created_by_fkey;
ALTER TABLE public.attendance_records DROP CONSTRAINT IF EXISTS attendance_records_marked_by_fkey;

-- Drop existing restrictive RLS policies on face_descriptors
DROP POLICY IF EXISTS "Admins can manage face descriptors" ON public.face_descriptors;

-- Create fully open RLS policies for face_descriptors
CREATE POLICY "Allow public read on face_descriptors" ON public.face_descriptors FOR SELECT USING (true);
CREATE POLICY "Allow public insert on face_descriptors" ON public.face_descriptors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on face_descriptors" ON public.face_descriptors FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on face_descriptors" ON public.face_descriptors FOR DELETE USING (true);

-- Drop existing restrictive RLS policies on attendance_records
DROP POLICY IF EXISTS "Admins can read attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Admins can insert attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Admins can delete attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Admins can update attendance" ON public.attendance_records;

-- Create fully open RLS policies for attendance_records
CREATE POLICY "Allow public read on attendance_records" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert on attendance_records" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on attendance_records" ON public.attendance_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on attendance_records" ON public.attendance_records FOR DELETE USING (true);
