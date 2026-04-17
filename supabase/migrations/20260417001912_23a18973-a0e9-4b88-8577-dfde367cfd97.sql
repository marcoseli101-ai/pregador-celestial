
DROP POLICY IF EXISTS "Authenticated can view all reading progress" ON public.reading_progress;
DROP POLICY IF EXISTS "Authenticated can view all quiz scores" ON public.quiz_scores;

CREATE POLICY "Users view own reading progress"
ON public.reading_progress FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users view own quiz scores"
ON public.quiz_scores FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Garantir que as funções RPC continuam acessíveis
GRANT EXECUTE ON FUNCTION public.get_reading_ranking(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_quiz_ranking() TO authenticated, anon;
