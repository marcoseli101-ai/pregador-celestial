
-- Fix 1: Add missing UPDATE policy on saved_content
CREATE POLICY "Users can update their own saved content"
ON public.saved_content
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix 2: Add missing INSERT policy on profiles
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Fix 3: Fix privilege escalation on user_roles
-- Drop the overly permissive ALL policy
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Re-create specific admin policies for INSERT, UPDATE, DELETE
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));
