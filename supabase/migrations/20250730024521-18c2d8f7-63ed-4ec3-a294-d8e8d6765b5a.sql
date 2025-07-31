-- Fix all remaining zero-cost quality tiers
UPDATE quality_tiers SET unit_cost = CASE 
  WHEN name = 'Basic' THEN 15.00
  WHEN name = 'Standard' THEN 25.00  
  WHEN name = 'Premium' THEN 40.00
  ELSE 20.00
END WHERE unit_cost = 0;

-- Now add the constraint to prevent future zero-cost entries  
ALTER TABLE quality_tiers ADD CONSTRAINT check_unit_cost_positive 
CHECK (unit_cost > 0.00);