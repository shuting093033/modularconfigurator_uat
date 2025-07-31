-- Create some example assemblies showcasing the new datacenter components (with proper UUIDs)
INSERT INTO assemblies (id, name, description, labor_hours) VALUES
(gen_random_uuid(), 'Power Distribution System', 'Complete power distribution assembly with UPS, PDUs, and electrical infrastructure', 35),
(gen_random_uuid(), 'Cooling Infrastructure', 'Complete cooling system with CRAC units and hot aisle containment', 65),
(gen_random_uuid(), 'Standard IT Rack Assembly', 'Complete IT rack with servers, networking, and cable management', 15),
(gen_random_uuid(), 'Fire Protection & Security', 'Fire suppression and security systems for datacenter protection', 25);

-- Get the assembly IDs for component insertion (this will be done via the application)