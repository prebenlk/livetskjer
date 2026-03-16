
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT TO public USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update site settings" ON public.site_settings
  FOR UPDATE TO public USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert site settings" ON public.site_settings
  FOR INSERT TO public WITH CHECK (auth.uid() IS NOT NULL);

-- Seed default values
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_title', 'Verktøy for en bedre hverdag'),
  ('hero_subtitle', 'Velg et tema som passer din situasjon. Kunnskap og øvelser utviklet av fagpersoner – helt tilgjengelig for alle.'),
  ('intro_text', 'Livetskjer.no er en anonym og gratis plattform med mestringsverktøy for deg som ønsker å forstå mer av det du kjenner på. Her finner du videoer og øvelser utviklet av fagpersoner innen psykisk helse.');
