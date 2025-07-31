-- Add RLS policies for quality_tiers table to allow data generation
CREATE POLICY "Authenticated users can insert quality tiers" 
  ON public.quality_tiers 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update quality tiers" 
  ON public.quality_tiers 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete quality tiers" 
  ON public.quality_tiers 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);