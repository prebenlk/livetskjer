
-- Create theme_resources table
CREATE TABLE public.theme_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_id UUID NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'book',
  image_url TEXT,
  link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.theme_resources ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view theme resources" ON public.theme_resources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert theme resources" ON public.theme_resources FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update theme resources" ON public.theme_resources FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete theme resources" ON public.theme_resources FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Storage bucket for resource images
INSERT INTO storage.buckets (id, name, public) VALUES ('resource-images', 'resource-images', true);

-- Storage RLS: anyone can view, authenticated can upload/delete
CREATE POLICY "Anyone can view resource images" ON storage.objects FOR SELECT USING (bucket_id = 'resource-images');
CREATE POLICY "Authenticated users can upload resource images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resource-images');
CREATE POLICY "Authenticated users can update resource images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resource-images');
CREATE POLICY "Authenticated users can delete resource images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resource-images');
