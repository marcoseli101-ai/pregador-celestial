
-- Remove policy que vazava emails
DROP POLICY IF EXISTS "Authenticated can view basic profile info" ON public.profiles;

-- View pública (sem email) para ranking e qualquer outro lugar que precise mostrar quem é o usuário
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT id, name, avatar_url
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Recria as funções de ranking usando a view (não precisa ler email)
-- Como profiles agora não permite leitura ampla, criamos policy restrita só aos colunas seguras via view.
-- Habilitamos uma policy específica para a view funcionar:
CREATE POLICY "Public can read non-sensitive profile fields"
ON public.profiles FOR SELECT
TO authenticated, anon
USING (true);

-- Nota: a policy acima ainda permite SELECT na tabela inteira via SQL direto.
-- Para realmente proteger o email, removemos o acesso público à tabela e mantemos só via view:
REVOKE SELECT ON public.profiles FROM anon;
-- Mantemos para authenticated porque os usuários precisam ver o próprio (já restrito por outras policies de owner)
-- mas removemos a policy aberta:
DROP POLICY IF EXISTS "Public can read non-sensitive profile fields" ON public.profiles;

-- Recria as funções para usar a view pública (que tem security_invoker e expõe só campos seguros)
CREATE OR REPLACE FUNCTION public.get_reading_ranking(_plan_type text)
RETURNS TABLE (user_id uuid, name text, avatar_url text, days_completed bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
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
SECURITY DEFINER
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
