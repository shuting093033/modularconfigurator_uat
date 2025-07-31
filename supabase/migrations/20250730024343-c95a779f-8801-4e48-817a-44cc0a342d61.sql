-- Fix zero-cost quality tiers with realistic pricing
-- Phase 2: Update zero-cost components with appropriate pricing

-- Update Electrical Infrastructure components with zero cost
UPDATE quality_tiers SET unit_cost = 2.50 WHERE component_id LIKE 'conduit%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 3.75 WHERE component_id LIKE 'conduit%' AND unit_cost = 0 AND name = 'Standard';  
UPDATE quality_tiers SET unit_cost = 5.25 WHERE component_id LIKE 'conduit%' AND unit_cost = 0 AND name = 'Premium';

UPDATE quality_tiers SET unit_cost = 1.50 WHERE component_id LIKE 'wire%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 2.25 WHERE component_id LIKE 'wire%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 3.50 WHERE component_id LIKE 'wire%' AND unit_cost = 0 AND name = 'Premium';

UPDATE quality_tiers SET unit_cost = 8.50 WHERE component_id LIKE 'outlet%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 12.75 WHERE component_id LIKE 'outlet%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 18.50 WHERE component_id LIKE 'outlet%' AND unit_cost = 0 AND name = 'Premium';

UPDATE quality_tiers SET unit_cost = 3.25 WHERE component_id LIKE 'fitting%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 4.75 WHERE component_id LIKE 'fitting%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 7.25 WHERE component_id LIKE 'fitting%' AND unit_cost = 0 AND name = 'Premium';

-- Update Mechanical Systems components
UPDATE quality_tiers SET unit_cost = 25.00 WHERE component_id LIKE 'duct%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 35.00 WHERE component_id LIKE 'duct%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 50.00 WHERE component_id LIKE 'duct%' AND unit_cost = 0 AND name = 'Premium';

UPDATE quality_tiers SET unit_cost = 15.00 WHERE component_id LIKE 'pipe%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 22.50 WHERE component_id LIKE 'pipe%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 32.00 WHERE component_id LIKE 'pipe%' AND unit_cost = 0 AND name = 'Premium';

-- Update Safety & Security components
UPDATE quality_tiers SET unit_cost = 45.00 WHERE component_id LIKE 'sensor%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 75.00 WHERE component_id LIKE 'sensor%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 120.00 WHERE component_id LIKE 'sensor%' AND unit_cost = 0 AND name = 'Premium';

-- Update Structural components
UPDATE quality_tiers SET unit_cost = 12.50 WHERE component_id LIKE 'bracket%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 18.75 WHERE component_id LIKE 'bracket%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 28.50 WHERE component_id LIKE 'bracket%' AND unit_cost = 0 AND name = 'Premium';

UPDATE quality_tiers SET unit_cost = 35.00 WHERE component_id LIKE 'mounting%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 55.00 WHERE component_id LIKE 'mounting%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 85.00 WHERE component_id LIKE 'mounting%' AND unit_cost = 0 AND name = 'Premium';

-- Add constraint to prevent future zero-cost entries (except for free items)
ALTER TABLE quality_tiers ADD CONSTRAINT check_unit_cost_positive 
CHECK (unit_cost >= 0.01 OR name ILIKE '%free%' OR name ILIKE '%included%');