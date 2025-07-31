-- Create some example assemblies showcasing the new datacenter components
INSERT INTO assemblies (id, name, description, labor_hours) VALUES
('power-distribution-assembly', 'Power Distribution System', 'Complete power distribution assembly with UPS, PDUs, and electrical infrastructure', 35),
('cooling-system-assembly', 'Cooling Infrastructure', 'Complete cooling system with CRAC units and hot aisle containment', 65),
('it-rack-assembly', 'Standard IT Rack Assembly', 'Complete IT rack with servers, networking, and cable management', 15),
('fire-security-assembly', 'Fire Protection & Security', 'Fire suppression and security systems for datacenter protection', 25)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  labor_hours = EXCLUDED.labor_hours,
  updated_at = now();

-- Add components to the Power Distribution Assembly
INSERT INTO assembly_components (assembly_id, component_id, quantity, unit, notes) VALUES
('power-distribution-assembly', 'ups-three-phase-40kva', 2, 'each', 'Redundant UPS configuration for N+1 reliability'),
('power-distribution-assembly', 'pdu-floor-100a', 4, 'each', 'Main distribution units for power distribution'),
('power-distribution-assembly', 'pdu-rack-monitored-30a', 8, 'each', 'Rack-level power monitoring and distribution'),
('power-distribution-assembly', 'cable-tray-ladder-24in', 100, 'linear_foot', 'Power cable management and routing')
ON CONFLICT DO NOTHING;

-- Add components to the Cooling System Assembly
INSERT INTO assembly_components (assembly_id, component_id, quantity, unit, notes) VALUES
('cooling-system-assembly', 'crac-unit-40-ton', 2, 'each', 'Primary cooling units for data hall'),
('cooling-system-assembly', 'crac-unit-20-ton', 1, 'each', 'Supplemental cooling for edge areas'),
('cooling-system-assembly', 'hot-aisle-containment', 200, 'linear_foot', 'Hot aisle containment for efficient cooling')
ON CONFLICT DO NOTHING;

-- Add components to the IT Rack Assembly
INSERT INTO assembly_components (assembly_id, component_id, quantity, unit, notes) VALUES
('it-rack-assembly', 'server-rack-42u', 1, 'each', 'Standard 42U server rack with cable management'),
('it-rack-assembly', 'server-2u-performance', 8, 'each', 'High-performance servers for compute workload'),
('it-rack-assembly', 'network-switch-48-port', 2, 'each', 'Top-of-rack networking switches'),
('it-rack-assembly', 'pdu-rack-monitored-30a', 2, 'each', 'Rack power distribution with monitoring')
ON CONFLICT DO NOTHING;

-- Add components to the Fire Protection & Security Assembly
INSERT INTO assembly_components (assembly_id, component_id, quantity, unit, notes) VALUES
('fire-security-assembly', 'fire-suppression-clean-agent', 1000, 'sq_ft', 'Clean agent fire suppression coverage'),
('fire-security-assembly', 'smoke-detector-aspirating', 2, 'zone', 'Very early smoke detection system'),
('fire-security-assembly', 'access-control-door', 4, 'each', 'Secure access control for data hall'),
('fire-security-assembly', 'surveillance-camera-ip', 8, 'each', 'IP cameras for comprehensive surveillance')
ON CONFLICT DO NOTHING;