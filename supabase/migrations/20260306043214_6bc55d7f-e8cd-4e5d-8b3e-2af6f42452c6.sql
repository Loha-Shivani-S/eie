
-- Drop existing attendance_records table and recreate with roll_no + type
DROP TABLE IF EXISTS public.attendance_records;

CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_no TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('participant', 'volunteer')),
  hour INTEGER NOT NULL CHECK (hour >= 1 AND hour <= 12),
  marked_by UUID REFERENCES auth.users(id),
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(roll_no, type, hour)
);

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read attendance" ON public.attendance_records
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert attendance" ON public.attendance_records
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete attendance" ON public.attendance_records
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop the students table since we use hardcoded data for now
DROP TABLE IF EXISTS public.students;
DROP TYPE IF EXISTS public.student_type;
