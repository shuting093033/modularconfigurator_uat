-- Add user_id column to assemblies table to track ownership
ALTER TABLE public.assemblies ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create RLS policies for assemblies
CREATE POLICY "Users can create their own assemblies" 
ON public.assemblies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assemblies" 
ON public.assemblies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assemblies" 
ON public.assemblies 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add user_id column to assembly_components table  
ALTER TABLE public.assembly_components ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create RLS policies for assembly_components
CREATE POLICY "Users can create assembly components for their assemblies" 
ON public.assembly_components 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.assemblies 
    WHERE assemblies.id = assembly_components.assembly_id 
    AND assemblies.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update assembly components for their assemblies" 
ON public.assembly_components 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.assemblies 
    WHERE assemblies.id = assembly_components.assembly_id 
    AND assemblies.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete assembly components for their assemblies" 
ON public.assembly_components 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.assemblies 
    WHERE assemblies.id = assembly_components.assembly_id 
    AND assemblies.user_id = auth.uid()
  )
);