
-- Create a unified table for all saved content (sermons, devotionals, studies, library, dictionary)
CREATE TABLE public.saved_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'geral',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_content ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own saved content"
  ON public.saved_content FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved content"
  ON public.saved_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved content"
  ON public.saved_content FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast queries
CREATE INDEX idx_saved_content_user_type ON public.saved_content(user_id, content_type);
