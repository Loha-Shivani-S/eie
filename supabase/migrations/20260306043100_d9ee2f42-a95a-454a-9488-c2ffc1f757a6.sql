
-- Create enum for student types
CREATE TYPE public.student_type AS ENUM ('participant', 'volunteer');

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_no TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  type student_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(roll_no, type)
);

-- Create attendance records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  hour INTEGER NOT NULL CHECK (hour >= 1 AND hour <= 12),
  marked_by UUID REFERENCES auth.users(id),
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, hour)
);

-- Create admin roles table
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Create face photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('face-photos', 'face-photos', true);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Students: admins can read, insert, update
CREATE POLICY "Admins can read students" ON public.students
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert students" ON public.students
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update students" ON public.students
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Attendance records: admins can CRUD
CREATE POLICY "Admins can read attendance" ON public.attendance_records
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert attendance" ON public.attendance_records
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete attendance" ON public.attendance_records
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only readable by the user themselves
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Storage policies for face photos
CREATE POLICY "Admins can upload face photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'face-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view face photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'face-photos');

CREATE POLICY "Admins can delete face photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'face-photos' AND public.has_role(auth.uid(), 'admin'));

-- Insert placeholder students (participants)
INSERT INTO public.students (roll_no, name, phone, type) VALUES
  ('23EIE01', 'Arun Kumar', '9876543210', 'participant'),
  ('23EIE02', 'Priya Sharma', '9876543211', 'participant'),
  ('23EIE03', 'Karthik Raja', '9876543212', 'participant'),
  ('23EIE04', 'Divya Lakshmi', '9876543213', 'participant'),
  ('23EIE05', 'Surya Prakash', '9876543214', 'participant'),
  ('23EIE06', 'Meena Kumari', '9876543215', 'participant'),
  ('23EIE07', 'Rahul Dev', '9876543216', 'participant'),
  ('23EIE08', 'Swetha Rajan', '9876543217', 'participant'),
  ('23EIE09', 'Vijay Anand', '9876543218', 'participant'),
  ('23EIE10', 'Nithya Sri', '9876543219', 'participant');

-- Insert placeholder students (volunteers)
INSERT INTO public.students (roll_no, name, phone, type) VALUES
  ('24EIE01', 'Loha Shivani S', '9871234560', 'volunteer'),
  ('24EIE02', 'Rishikeshwaran M', '9871234561', 'volunteer'),
  ('24EIE03', 'Deepak Raj', '9871234562', 'volunteer'),
  ('24EIE04', 'Kavitha Devi', '9871234563', 'volunteer'),
  ('24EIE05', 'Santhosh Kumar', '9871234564', 'volunteer');

-- Trigger to auto-assign admin role on signup for specific emails
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IN ('lohashivanis.24eie@kongu.edu', 'rishikeshwaranm.23eie@kongu.edu') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_signup();
