-- Create clubs table
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create club_members table
CREATE TABLE public.club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, club_id)
);

-- Add club_id to events table (nullable - some events are public, some are club-only)
ALTER TABLE public.events ADD COLUMN club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clubs (everyone can view clubs)
CREATE POLICY "Anyone can view clubs"
  ON public.clubs
  FOR SELECT
  USING (true);

-- RLS Policies for club_members
CREATE POLICY "Users can view their own memberships"
  ON public.club_members
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join clubs"
  ON public.club_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave clubs"
  ON public.club_members
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create security definer function to check club membership
CREATE OR REPLACE FUNCTION public.is_club_member(_user_id UUID, _club_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.club_members
    WHERE user_id = _user_id AND club_id = _club_id
  )
$$;

-- Update events RLS policy to handle club-restricted events
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;

CREATE POLICY "Anyone can view public events"
  ON public.events
  FOR SELECT
  USING (
    club_id IS NULL 
    OR public.is_club_member(auth.uid(), club_id)
  );

-- Add triggers for updated_at
CREATE TRIGGER update_clubs_updated_at
  BEFORE UPDATE ON public.clubs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample clubs
INSERT INTO public.clubs (name, description, category, icon, member_count) VALUES
  ('Coding Club', 'Learn programming, participate in hackathons, and build amazing projects.', 'Technical', 'Code', 120),
  ('Cultural Club', 'Express yourself through art, dance, drama, and cultural performances.', 'Cultural', 'Palette', 95),
  ('Music Society', 'From classical to contemporary, explore all forms of musical expression.', 'Cultural', 'Music', 78),
  ('Robotics Club', 'Design, build, and program robots for competitions and exhibitions.', 'Technical', 'Cpu', 65),
  ('Literary Society', 'Engage in debates, creative writing, poetry, and book discussions.', 'Academic', 'BookOpen', 88),
  ('Sports Committee', 'Organize tournaments, fitness sessions, and inter-college competitions.', 'Sports', 'Trophy', 142);