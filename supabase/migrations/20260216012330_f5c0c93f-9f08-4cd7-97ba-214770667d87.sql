
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own saved content" ON public.saved_content;
DROP POLICY IF EXISTS "Users can insert their own saved content" ON public.saved_content;
DROP POLICY IF EXISTS "Users can delete their own saved content" ON public.saved_content;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Users can view their own saved content"
ON public.saved_content FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved content"
ON public.saved_content FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved content"
ON public.saved_content FOR DELETE
USING (auth.uid() = user_id);
