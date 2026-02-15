
-- Create preachers table
CREATE TABLE public.preachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  church TEXT,
  city TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on preachers
ALTER TABLE public.preachers ENABLE ROW LEVEL SECURITY;

-- Everyone can view active preachers
CREATE POLICY "Anyone can view active preachers"
ON public.preachers FOR SELECT
USING (active = true);

-- Admins can do everything on preachers
CREATE POLICY "Admins can manage preachers"
ON public.preachers FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all sermons
CREATE POLICY "Admins can view all sermons"
ON public.saved_sermons FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete any sermon
CREATE POLICY "Admins can delete any sermon"
ON public.saved_sermons FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all devotionals
CREATE POLICY "Admins can view all devotionals"
ON public.saved_devotionals FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete any devotional
CREATE POLICY "Admins can delete any devotional"
ON public.saved_devotionals FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on preachers
CREATE TRIGGER update_preachers_updated_at
BEFORE UPDATE ON public.preachers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
