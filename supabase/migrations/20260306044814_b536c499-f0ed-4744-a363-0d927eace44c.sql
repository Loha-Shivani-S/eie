
CREATE TABLE public.face_descriptors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_no text NOT NULL,
  type text NOT NULL,
  descriptor jsonb NOT NULL,
  photo_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(roll_no, type)
);

ALTER TABLE public.face_descriptors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage face descriptors"
ON public.face_descriptors
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
