
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  referrer text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (anonymous tracking)
CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT TO public WITH CHECK (true);

-- Only authenticated users can read page views
CREATE POLICY "Authenticated users can view page views" ON public.page_views
  FOR SELECT TO public USING (auth.uid() IS NOT NULL);
