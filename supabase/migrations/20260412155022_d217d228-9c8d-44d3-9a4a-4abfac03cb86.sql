
-- Enable extensions for cron scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create daily devotional table
CREATE TABLE public.devocional_diario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL UNIQUE,
  titulo TEXT NOT NULL DEFAULT '',
  versiculo_base TEXT NOT NULL DEFAULT '',
  conteudo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.devocional_diario ENABLE ROW LEVEL SECURITY;

-- Everyone can read daily devotionals (public content)
CREATE POLICY "Anyone can read daily devotionals"
  ON public.devocional_diario
  FOR SELECT
  USING (true);

-- Only service role (edge functions) can insert - no direct user inserts
CREATE POLICY "Service role can insert devotionals"
  ON public.devocional_diario
  FOR INSERT
  WITH CHECK (false);

-- Add index on date for fast lookups
CREATE INDEX idx_devocional_diario_data ON public.devocional_diario(data DESC);
