-- Continue updating remaining zero-cost components with realistic pricing
-- Update remaining components with more comprehensive patterns

-- Update cable and network components
UPDATE quality_tiers SET unit_cost = 12.50 WHERE component_id LIKE 'cable%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 18.75 WHERE component_id LIKE 'cable%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 28.50 WHERE component_id LIKE 'cable%' AND unit_cost = 0 AND name = 'Premium';

-- Update switch and router components
UPDATE quality_tiers SET unit_cost = 85.00 WHERE component_id LIKE 'switch%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 150.00 WHERE component_id LIKE 'switch%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 275.00 WHERE component_id LIKE 'switch%' AND unit_cost = 0 AND name = 'Premium';

-- Update patch panel components
UPDATE quality_tiers SET unit_cost = 45.00 WHERE component_id LIKE 'patch%' AND unit_cost = 0 AND name = 'Basic';
UPDATE quality_tiers SET unit_cost = 75.00 WHERE component_id LIKE 'patch%' AND unit_cost = 0 AND name = 'Standard';
UPDATE quality_tiers SET unit_cost = 125.00 WHERE component_id LIKE 'patch%' AND unit_cost = 0 AND name = 'Premium';

-- Update general remaining zero-cost components by category patterns
UPDATE quality_tiers SET unit_cost = 5.50 WHERE unit_cost = 0 AND name = 'Basic' AND component_id NOT LIKE 'server%' AND component_id NOT LIKE 'ups%' AND component_id NOT LIKE 'crac%';
UPDATE quality_tiers SET unit_cost = 8.75 WHERE unit_cost = 0 AND name = 'Standard' AND component_id NOT LIKE 'server%' AND component_id NOT LIKE 'ups%' AND component_id NOT LIKE 'crac%';
UPDATE quality_tiers SET unit_cost = 14.25 WHERE unit_cost = 0 AND name = 'Premium' AND component_id NOT LIKE 'server%' AND component_id NOT LIKE 'ups%' AND component_id NOT LIKE 'crac%';