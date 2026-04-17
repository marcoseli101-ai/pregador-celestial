
-- Tabela de progresso de leitura (para ranking)
CREATE TABLE public.reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('biblical','chronological')),
  day_number integer NOT NULL CHECK (day_number BETWEEN 1 AND 366),
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, plan_type, day_number)
);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view all reading progress"
ON public.reading_progress FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users insert own reading progress"
ON public.reading_progress FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own reading progress"
ON public.reading_progress FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_reading_progress_user ON public.reading_progress(user_id, plan_type);

-- Tabela de pontuação de questionários
CREATE TABLE public.quiz_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nivel text NOT NULL CHECK (nivel IN ('Fácil','Médio','Difícil')),
  correct boolean NOT NULL,
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view all quiz scores"
ON public.quiz_scores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users insert own quiz scores"
ON public.quiz_scores FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_quiz_scores_user ON public.quiz_scores(user_id);

-- Permitir leitura pública do nome/avatar (necessário para mostrar quem está no ranking)
CREATE POLICY "Authenticated can view basic profile info"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Funções RPC agregadas (SECURITY INVOKER, respeita RLS)
CREATE OR REPLACE FUNCTION public.get_reading_ranking(_plan_type text)
RETURNS TABLE (user_id uuid, name text, avatar_url text, days_completed bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT rp.user_id,
         COALESCE(p.name, 'Usuário') AS name,
         p.avatar_url,
         COUNT(*)::bigint AS days_completed
  FROM public.reading_progress rp
  LEFT JOIN public.profiles p ON p.id = rp.user_id
  WHERE rp.plan_type = _plan_type
  GROUP BY rp.user_id, p.name, p.avatar_url
  ORDER BY days_completed DESC
  LIMIT 20;
$$;

CREATE OR REPLACE FUNCTION public.get_quiz_ranking()
RETURNS TABLE (user_id uuid, name text, avatar_url text, total_points bigint, total_correct bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT qs.user_id,
         COALESCE(p.name, 'Usuário') AS name,
         p.avatar_url,
         COALESCE(SUM(qs.points),0)::bigint AS total_points,
         COUNT(*) FILTER (WHERE qs.correct)::bigint AS total_correct
  FROM public.quiz_scores qs
  LEFT JOIN public.profiles p ON p.id = qs.user_id
  GROUP BY qs.user_id, p.name, p.avatar_url
  ORDER BY total_points DESC
  LIMIT 20;
$$;
