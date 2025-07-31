-- Create estimate_assemblies table for hierarchical estimate structure
CREATE TABLE public.estimate_assemblies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL,
  assembly_id UUID NOT NULL,
  assembly_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_material_cost NUMERIC NOT NULL DEFAULT 0,
  total_labor_cost NUMERIC NOT NULL DEFAULT 0,
  total_labor_hours NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on estimate_assemblies
ALTER TABLE public.estimate_assemblies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for estimate_assemblies
CREATE POLICY "Users can view their own estimate assemblies" 
ON public.estimate_assemblies 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM estimates 
  WHERE estimates.id = estimate_assemblies.estimate_id 
  AND estimates.user_id = auth.uid()
));

CREATE POLICY "Users can create their own estimate assemblies" 
ON public.estimate_assemblies 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM estimates 
  WHERE estimates.id = estimate_assemblies.estimate_id 
  AND estimates.user_id = auth.uid()
));

CREATE POLICY "Users can update their own estimate assemblies" 
ON public.estimate_assemblies 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM estimates 
  WHERE estimates.id = estimate_assemblies.estimate_id 
  AND estimates.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own estimate assemblies" 
ON public.estimate_assemblies 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM estimates 
  WHERE estimates.id = estimate_assemblies.estimate_id 
  AND estimates.user_id = auth.uid()
));

-- Add estimate_assembly_id to estimate_items for hierarchical linking
ALTER TABLE public.estimate_items 
ADD COLUMN estimate_assembly_id UUID REFERENCES public.estimate_assemblies(id) ON DELETE CASCADE;