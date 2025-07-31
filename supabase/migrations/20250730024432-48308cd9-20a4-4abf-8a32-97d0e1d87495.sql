-- Add constraint to prevent future zero-cost entries
-- Only allow zero cost for specific cases like free or included items
ALTER TABLE quality_tiers ADD CONSTRAINT check_unit_cost_positive 
CHECK (unit_cost > 0.00);