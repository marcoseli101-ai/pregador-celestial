
-- Create saved_devotionals table
CREATE TABLE public.saved_devotionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  date_label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_devotionals ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own devotionals"
  ON public.saved_devotionals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devotionals"
  ON public.saved_devotionals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own devotionals"
  ON public.saved_devotionals FOR DELETE
  USING (auth.uid() = user_id);
