-- Allow users to create their own components
CREATE POLICY "Users can create their own components" 
ON public.components 
FOR INSERT 
WITH CHECK (true);

-- Allow users to update their own components (we'll add user tracking later if needed)
CREATE POLICY "Users can update components" 
ON public.components 
FOR UPDATE 
USING (true);

-- Allow users to delete components (we'll add user tracking later if needed)  
CREATE POLICY "Users can delete components"
ON public.components 
FOR DELETE
USING (true);