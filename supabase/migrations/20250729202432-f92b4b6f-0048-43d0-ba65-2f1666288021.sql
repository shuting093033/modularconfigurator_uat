-- Add comprehensive datacenter component library to database
-- First, let's add the missing categories that exist in the component library

INSERT INTO categories (name, description, category_type, sort_order) VALUES
('Electrical Infrastructure', 'Power distribution, UPS systems, electrical panels and infrastructure', 'datacenter', 1),
('Mechanical Systems', 'HVAC, cooling systems, air handling and mechanical infrastructure', 'datacenter', 2),
('IT Infrastructure', 'Servers, network equipment, storage systems', 'datacenter', 3),
('Fire Protection', 'Fire suppression systems, detection and safety equipment', 'datacenter', 4),
('Security Systems', 'Access control, surveillance and security infrastructure', 'datacenter', 5),
('Structural Systems', 'Raised flooring, cable management, structural components', 'datacenter', 6),
('Environmental Controls', 'Environmental monitoring, sensors and control systems', 'datacenter', 7),
('Cable Management', 'Cable trays, conduits, fiber management systems', 'datacenter', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert comprehensive component library
-- Power Distribution Units (PDUs)
INSERT INTO components (id, name, category, description, unit, labor_hours, skill_level, vendor_info, lead_time_days, technical_specs, material_waste_factor, installation_notes) VALUES
('pdu-rack-basic-30a', 'Rack PDU - Basic 30A', 'Electrical Infrastructure', 'Single-phase rack-mounted power distribution unit', 'each', 2, 'intermediate', '{"preferred_vendor": "APC by Schneider Electric", "part_number": "AP7921", "contact_info": "apc.com"}', 14, '{"voltage": "120V/208V", "power_rating": "30A", "outlet_count": "24", "dimensions": "1.75\" H x 17.24\" W x 1.65\" D", "weight": "8.8 lbs", "mounting": "Rack-mount (1U)"}', 0.02, 'Requires proper grounding and circuit protection'),

('pdu-rack-monitored-30a', 'Rack PDU - Monitored 30A', 'Electrical Infrastructure', 'Monitored rack PDU with remote power monitoring', 'each', 3, 'intermediate', '{"preferred_vendor": "APC by Schneider Electric", "part_number": "AP8941", "contact_info": "apc.com"}', 14, '{"voltage": "120V/208V", "power_rating": "30A", "outlet_count": "24", "dimensions": "1.75\" H x 17.24\" W x 1.65\" D", "weight": "8.8 lbs", "monitoring": "Remote power monitoring", "mounting": "Rack-mount (1U)"}', 0.02, 'Requires network connection for monitoring capabilities'),

('pdu-floor-100a', 'Floor PDU - 100A', 'Electrical Infrastructure', 'High-capacity floor-mounted power distribution unit', 'each', 6, 'expert', '{"preferred_vendor": "Server Technology", "part_number": "CW-24V1F", "contact_info": "servertech.com"}', 21, '{"voltage": "480V/277V", "power_rating": "100A", "outlet_count": "24", "dimensions": "84\" H x 24\" W x 12\" D", "weight": "180 lbs", "mounting": "Floor-standing"}', 0.03, 'Requires electrical permit and professional installation'),

-- UPS Systems
('ups-single-phase-10kva', 'UPS - Single Phase 10kVA', 'Electrical Infrastructure', 'Single-phase uninterruptible power supply system', 'each', 8, 'expert', '{"preferred_vendor": "APC by Schneider Electric", "part_number": "SUA10000", "contact_info": "apc.com"}', 28, '{"power_rating": "10kVA/8kW", "voltage": "120V", "runtime": "15 minutes at full load", "dimensions": "15\" H x 17\" W x 22\" D", "weight": "170 lbs", "efficiency": "95%"}', 0.02, 'Requires dedicated electrical circuit and proper ventilation'),

('ups-three-phase-40kva', 'UPS - Three Phase 40kVA', 'Electrical Infrastructure', 'Three-phase UPS system for critical power protection', 'each', 16, 'expert', '{"preferred_vendor": "Eaton", "part_number": "9PX40K", "contact_info": "eaton.com"}', 42, '{"power_rating": "40kVA/36kW", "voltage": "480V/208V", "runtime": "10 minutes at full load", "dimensions": "78\" H x 24\" W x 32\" D", "weight": "850 lbs", "efficiency": "96%"}', 0.03, 'Professional installation required, includes battery cabinet'),

-- HVAC and Cooling Systems
('crac-unit-20-ton', 'CRAC Unit - 20 Ton', 'Mechanical Systems', 'Computer Room Air Conditioning unit for precision cooling', 'each', 24, 'expert', '{"preferred_vendor": "Liebert", "part_number": "DS020", "contact_info": "vertiv.com"}', 56, '{"cooling_capacity": "20 tons", "power_consumption": "18kW", "airflow": "6800 CFM", "dimensions": "84\" H x 30\" W x 30\" D", "weight": "950 lbs", "refrigerant": "R410A"}', 0.05, 'Requires refrigerant lines, condensate drain, and electrical connections'),

('crac-unit-40-ton', 'CRAC Unit - 40 Ton', 'Mechanical Systems', 'High-capacity CRAC unit for large data centers', 'each', 32, 'expert', '{"preferred_vendor": "Liebert", "part_number": "DS040", "contact_info": "vertiv.com"}', 56, '{"cooling_capacity": "40 tons", "power_consumption": "35kW", "airflow": "13600 CFM", "dimensions": "84\" H x 48\" W x 30\" D", "weight": "1600 lbs", "refrigerant": "R410A"}', 0.05, 'Requires crane for installation, refrigerant lines, and dedicated electrical'),

('hot-aisle-containment', 'Hot Aisle Containment System', 'Mechanical Systems', 'Complete hot aisle containment solution', 'linear_foot', 4, 'intermediate', '{"preferred_vendor": "Eaton", "part_number": "HAC-42U", "contact_info": "eaton.com"}', 35, '{"height": "12 feet", "width": "Adjustable", "material": "Aluminum frame with polycarbonate panels", "weight": "15 lbs/linear foot"}', 0.08, 'Custom sizing required, professional measurement recommended'),

-- IT Infrastructure
('server-1u-entry', '1U Server - Entry Level', 'IT Infrastructure', 'Entry-level 1U rack server for basic computing needs', 'each', 1, 'basic', '{"preferred_vendor": "Dell", "part_number": "PowerEdge R230", "contact_info": "dell.com"}', 21, '{"form_factor": "1U", "cpu": "Intel Xeon E3", "memory": "8GB DDR4", "storage": "1TB SATA", "power": "250W", "network": "2x 1GbE"}', 0.02, 'Basic rack installation, standard power and network connections'),

('server-2u-performance', '2U Server - High Performance', 'IT Infrastructure', 'High-performance 2U server for demanding applications', 'each', 2, 'intermediate', '{"preferred_vendor": "HPE", "part_number": "ProLiant DL380", "contact_info": "hpe.com"}', 28, '{"form_factor": "2U", "cpu": "Dual Intel Xeon Silver", "memory": "64GB DDR4", "storage": "4x 1TB SSD", "power": "800W", "network": "4x 1GbE"}', 0.02, 'Requires proper cable management and redundant power connections'),

('network-switch-48-port', '48-Port Network Switch', 'IT Infrastructure', 'Managed 48-port Gigabit Ethernet switch', 'each', 2, 'intermediate', '{"preferred_vendor": "Cisco", "part_number": "Catalyst 2960-X", "contact_info": "cisco.com"}', 14, '{"ports": "48x 1GbE + 4x 10GbE SFP+", "form_factor": "1U", "power": "124W", "switching_capacity": "176 Gbps", "management": "Web-based"}', 0.02, 'Requires network configuration and proper cable management'),

-- Fire Protection Systems
('fire-suppression-clean-agent', 'Clean Agent Fire Suppression System', 'Fire Protection', 'Environmentally safe clean agent fire suppression', 'sq_ft', 0.5, 'expert', '{"preferred_vendor": "Ansul", "part_number": "INERGEN", "contact_info": "ansul.com"}', 42, '{"agent_type": "Inergen", "coverage": "Per square foot", "discharge_time": "60 seconds", "safety_margin": "NFPA 2001 compliant"}', 0.10, 'Requires professional design and installation, permits required'),

('smoke-detector-aspirating', 'Aspirating Smoke Detection System', 'Fire Protection', 'Very early smoke detection using air sampling', 'zone', 8, 'expert', '{"preferred_vendor": "Xtralis", "part_number": "VESDA-E", "contact_info": "xtralis.com"}', 35, '{"coverage": "2000 sq ft per detector", "sensitivity": "0.005% obscuration/ft", "response_time": "Under 10 seconds"}', 0.05, 'Requires sampling pipe network and specialized programming'),

-- Security Systems
('access-control-door', 'Door Access Control System', 'Security Systems', 'Card reader and magnetic lock for door security', 'each', 4, 'intermediate', '{"preferred_vendor": "HID Global", "part_number": "iCLASS SE", "contact_info": "hidglobal.com"}', 21, '{"reader_type": "Proximity card", "lock_type": "Magnetic", "holding_force": "1200 lbs", "power": "12VDC"}', 0.03, 'Requires low-voltage wiring and access control panel integration'),

('surveillance-camera-ip', 'IP Security Camera', 'Security Systems', 'High-definition IP surveillance camera', 'each', 2, 'intermediate', '{"preferred_vendor": "Axis", "part_number": "M3067-P", "contact_info": "axis.com"}', 14, '{"resolution": "2MP 1080p", "lens": "2.8mm fixed", "night_vision": "IR illumination", "power": "PoE+", "storage": "Network attached"}', 0.02, 'Requires network connection and mounting hardware'),

-- Structural Systems
('raised-floor-24x24', 'Raised Floor Panel 24"x24"', 'Structural Systems', 'Standard raised floor panel for data center flooring', 'sq_ft', 0.25, 'basic', '{"preferred_vendor": "Tate", "part_number": "ConCore", "contact_info": "tateaccessfloors.com"}', 21, '{"size": "24\" x 24\"", "thickness": "1.5\"", "load_rating": "1250 lbs", "material": "Steel with concrete core"}', 0.05, 'Requires pedestal grid system and proper leveling'),

('cable-tray-ladder-24in', 'Ladder Cable Tray - 24" Wide', 'Cable Management', 'Heavy-duty ladder-style cable tray for power and data', 'linear_foot', 1, 'intermediate', '{"preferred_vendor": "B-Line", "part_number": "A24-120-10A", "contact_info": "cooperbline.com"}', 14, '{"width": "24 inches", "depth": "4 inches", "material": "Aluminum", "load_capacity": "75 lbs/ft", "finish": "Mill finish"}', 0.08, 'Requires proper support brackets and grounding'),

('server-rack-42u', '42U Server Rack', 'Structural Systems', 'Standard 42U height server rack with doors', 'each', 4, 'intermediate', '{"preferred_vendor": "APC", "part_number": "AR3100", "contact_info": "apc.com"}', 28, '{"height": "42U (73.5\")", "width": "24\"", "depth": "42\"", "weight_capacity": "3000 lbs", "features": "Perforated doors, cable management"}', 0.02, 'Requires proper anchoring to raised floor or concrete')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  unit = EXCLUDED.unit,
  labor_hours = EXCLUDED.labor_hours,
  skill_level = EXCLUDED.skill_level,
  vendor_info = EXCLUDED.vendor_info,
  lead_time_days = EXCLUDED.lead_time_days,
  technical_specs = EXCLUDED.technical_specs,
  material_waste_factor = EXCLUDED.material_waste_factor,
  installation_notes = EXCLUDED.installation_notes,
  updated_at = now();

-- Insert quality tiers for the new components
INSERT INTO quality_tiers (id, component_id, name, unit_cost, description) VALUES
-- PDU Quality Tiers
('pdu-rack-basic-30a-standard', 'pdu-rack-basic-30a', 'Standard', 450.00, 'Basic rack PDU with standard outlets'),
('pdu-rack-basic-30a-premium', 'pdu-rack-basic-30a', 'Premium', 650.00, 'Enhanced PDU with better build quality and warranty'),

('pdu-rack-monitored-30a-standard', 'pdu-rack-monitored-30a', 'Standard', 850.00, 'Monitored PDU with basic remote capabilities'),
('pdu-rack-monitored-30a-premium', 'pdu-rack-monitored-30a', 'Premium', 1200.00, 'Advanced monitoring with detailed power analytics'),

('pdu-floor-100a-industrial', 'pdu-floor-100a', 'Industrial', 3500.00, 'Heavy-duty floor PDU for high-power applications'),
('pdu-floor-100a-enterprise', 'pdu-floor-100a', 'Enterprise', 4800.00, 'Enterprise-grade with advanced monitoring and redundancy'),

-- UPS Quality Tiers
('ups-single-phase-10kva-standard', 'ups-single-phase-10kva', 'Standard', 2800.00, 'Basic UPS with standard battery backup'),
('ups-single-phase-10kva-extended', 'ups-single-phase-10kva', 'Extended Runtime', 4200.00, 'UPS with extended battery runtime capacity'),

('ups-three-phase-40kva-standard', 'ups-three-phase-40kva', 'Standard', 18500.00, 'Three-phase UPS with standard configuration'),
('ups-three-phase-40kva-redundant', 'ups-three-phase-40kva', 'Redundant', 28000.00, 'Redundant UPS configuration for maximum uptime'),

-- HVAC Quality Tiers
('crac-unit-20-ton-standard', 'crac-unit-20-ton', 'Standard Efficiency', 28000.00, 'Standard efficiency CRAC unit'),
('crac-unit-20-ton-high-eff', 'crac-unit-20-ton', 'High Efficiency', 35000.00, 'High efficiency unit with variable speed drives'),

('crac-unit-40-ton-standard', 'crac-unit-40-ton', 'Standard Efficiency', 45000.00, 'Standard efficiency high-capacity unit'),
('crac-unit-40-ton-premium', 'crac-unit-40-ton', 'Premium Efficiency', 62000.00, 'Premium efficiency with advanced controls'),

('hot-aisle-containment-basic', 'hot-aisle-containment', 'Basic', 85.00, 'Standard containment panels and framework'),
('hot-aisle-containment-premium', 'hot-aisle-containment', 'Premium', 125.00, 'Premium materials with enhanced aesthetics'),

-- IT Infrastructure Quality Tiers
('server-1u-entry-basic', 'server-1u-entry', 'Basic Configuration', 1200.00, 'Entry-level server with minimal specifications'),
('server-1u-entry-enhanced', 'server-1u-entry', 'Enhanced Configuration', 1800.00, 'Enhanced specs with better processor and memory'),

('server-2u-performance-standard', 'server-2u-performance', 'Standard Configuration', 4500.00, 'High-performance server with standard specs'),
('server-2u-performance-maxed', 'server-2u-performance', 'Maximum Configuration', 8500.00, 'Fully loaded with maximum CPU, memory, and storage'),

('network-switch-48-port-standard', 'network-switch-48-port', 'Standard Features', 2200.00, 'Managed switch with standard feature set'),
('network-switch-48-port-advanced', 'network-switch-48-port', 'Advanced Features', 3400.00, 'Advanced features with enhanced security and QoS'),

-- Fire Protection Quality Tiers
('fire-suppression-clean-agent-basic', 'fire-suppression-clean-agent', 'Basic System', 12.00, 'Standard clean agent system coverage'),
('fire-suppression-clean-agent-premium', 'fire-suppression-clean-agent', 'Premium System', 18.00, 'Enhanced system with advanced detection integration'),

('smoke-detector-aspirating-standard', 'smoke-detector-aspirating', 'Standard Sensitivity', 2800.00, 'Standard aspirating smoke detection'),
('smoke-detector-aspirating-high-sens', 'smoke-detector-aspirating', 'High Sensitivity', 4200.00, 'Ultra-high sensitivity for critical applications'),

-- Security Quality Tiers
('access-control-door-basic', 'access-control-door', 'Basic System', 650.00, 'Standard card reader and magnetic lock'),
('access-control-door-advanced', 'access-control-door', 'Advanced System', 950.00, 'Advanced reader with biometric capability'),

('surveillance-camera-ip-standard', 'surveillance-camera-ip', 'Standard Resolution', 320.00, 'Standard 1080p IP camera'),
('surveillance-camera-ip-4k', 'surveillance-camera-ip', '4K Ultra HD', 580.00, '4K resolution with advanced analytics'),

-- Structural Quality Tiers
('raised-floor-24x24-standard', 'raised-floor-24x24', 'Standard Load', 18.00, 'Standard 1250 lb load rating'),
('raised-floor-24x24-heavy-duty', 'raised-floor-24x24', 'Heavy Duty', 28.00, 'Heavy duty 2000 lb load rating'),

('cable-tray-ladder-24in-aluminum', 'cable-tray-ladder-24in', 'Aluminum', 24.00, 'Standard aluminum construction'),
('cable-tray-ladder-24in-stainless', 'cable-tray-ladder-24in', 'Stainless Steel', 38.00, 'Corrosion-resistant stainless steel'),

('server-rack-42u-standard', 'server-rack-42u', 'Standard', 850.00, 'Standard server rack with basic features'),
('server-rack-42u-premium', 'server-rack-42u', 'Premium', 1350.00, 'Premium rack with enhanced cable management and security')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  unit_cost = EXCLUDED.unit_cost,
  description = EXCLUDED.description;