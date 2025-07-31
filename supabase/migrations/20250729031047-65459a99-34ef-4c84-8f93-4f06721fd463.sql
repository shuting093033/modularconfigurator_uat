-- Create estimates table
CREATE TABLE public.estimates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create estimate_items table
CREATE TABLE public.estimate_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL,
  component_name TEXT NOT NULL,
  quality_tier_id TEXT NOT NULL,
  quality_tier_name TEXT NOT NULL,
  quality_tier_unit_cost DECIMAL(10,2) NOT NULL,
  quality_tier_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit TEXT NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_items ENABLE ROW LEVEL SECURITY;

-- Create policies for estimates
CREATE POLICY "Users can view their own estimates" 
ON public.estimates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own estimates" 
ON public.estimates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own estimates" 
ON public.estimates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own estimates" 
ON public.estimates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for estimate_items
CREATE POLICY "Users can view their own estimate items" 
ON public.estimate_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.estimates 
    WHERE estimates.id = estimate_items.estimate_id 
    AND estimates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own estimate items" 
ON public.estimate_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.estimates 
    WHERE estimates.id = estimate_items.estimate_id 
    AND estimates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own estimate items" 
ON public.estimate_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.estimates 
    WHERE estimates.id = estimate_items.estimate_id 
    AND estimates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own estimate items" 
ON public.estimate_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.estimates 
    WHERE estimates.id = estimate_items.estimate_id 
    AND estimates.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_estimates_updated_at
  BEFORE UPDATE ON public.estimates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_estimates_user_id ON public.estimates(user_id);
CREATE INDEX idx_estimates_created_at ON public.estimates(created_at DESC);
CREATE INDEX idx_estimate_items_estimate_id ON public.estimate_items(estimate_id);