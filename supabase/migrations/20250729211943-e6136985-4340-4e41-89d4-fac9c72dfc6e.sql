-- Add selected quality tier to assembly_components
ALTER TABLE public.assembly_components 
ADD COLUMN selected_quality_tier_id text;

-- Add cost fields to assemblies table
ALTER TABLE public.assemblies 
ADD COLUMN total_material_cost numeric DEFAULT 0,
ADD COLUMN total_labor_cost numeric DEFAULT 0;

-- Add labor rate configuration table for user-specific rates
CREATE TABLE public.user_labor_rates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  labor_rate_per_hour numeric NOT NULL DEFAULT 50.00,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_labor_rates
ALTER TABLE public.user_labor_rates ENABLE ROW LEVEL SECURITY;

-- Create policies for user_labor_rates
CREATE POLICY "Users can view their own labor rates"
ON public.user_labor_rates
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own labor rates"
ON public.user_labor_rates
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own labor rates"
ON public.user_labor_rates
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_labor_rates_updated_at
BEFORE UPDATE ON public.user_labor_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();