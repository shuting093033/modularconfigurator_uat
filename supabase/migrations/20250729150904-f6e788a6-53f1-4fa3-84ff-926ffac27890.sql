-- Add user_id to components table for proper ownership tracking
ALTER TABLE public.components ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can create their own components" ON public.components;
DROP POLICY IF EXISTS "Users can update components" ON public.components;
DROP POLICY IF EXISTS "Users can delete components" ON public.components;

-- Create secure policies that distinguish between system and user components
CREATE POLICY "Users can create their own components" 
ON public.components 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own components" 
ON public.components 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own components" 
ON public.components 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow viewing of all components (system + user components)
-- The existing "Components are viewable by everyone" policy covers this

-- Create index for better performance on user_id queries
CREATE INDEX idx_components_user_id ON public.components(user_id);