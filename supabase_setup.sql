-- Copy and run this script in the Supabase SQL Editor to create the students table

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

-- Enable RLS (Row Level Security) and add policy to allow public read access
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to students" 
ON public.students 
FOR SELECT 
USING (true);

-- Allow public insert/update if you plan to manually insert rows via an admin dashboard or directly.
CREATE POLICY "Allow public insert to students"
ON public.students
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update to students"
ON public.students
FOR UPDATE
USING (true);

-- Insert sample data based on your requirements to test the setup
INSERT INTO public.students (roll_no, name, phone_number, department, year, team_name, type)
VALUES 
('123456', 'John Doe', '123-456-7890', 'EIE', 'II', 'TEAM ALPHA', 'participant'),
('22EI050', 'Kavitha R', '9876543220', 'EIE', 'IV', NULL, 'volunteer');
