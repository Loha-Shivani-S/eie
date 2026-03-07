-- 1. Create the face_descriptors table
CREATE TABLE IF NOT EXISTS public.face_descriptors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_no TEXT NOT NULL,
    type TEXT NOT NULL, -- 'participant' or 'volunteer'
    descriptor FLOAT8[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure one face per roll_no/type combination
    UNIQUE(roll_no, type)
);

-- 2. Enable Row Level Security
ALTER TABLE public.face_descriptors ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy for Public Access (Hackathon Mode)
-- NOTE: In a production app, you would restrict this to authenticated admins
CREATE POLICY "Public Face Access" ON public.face_descriptors
    FOR ALL 
    TO public
    USING (true)
    WITH CHECK (true);

-- 4. Enable Indexes for performance
CREATE INDEX IF NOT EXISTS face_descriptors_roll_no_idx ON public.face_descriptors(roll_no);
CREATE INDEX IF NOT EXISTS face_descriptors_type_idx ON public.face_descriptors(type);
