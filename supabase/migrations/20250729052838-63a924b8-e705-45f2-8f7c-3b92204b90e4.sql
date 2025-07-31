-- Populate components table with data center construction components
INSERT INTO components (id, name, category, description, unit, labor_hours, skill_level, vendor_info, lead_time_days, technical_specs, material_waste_factor, installation_notes) VALUES

-- Electrical Infrastructure Components
('elec_001', 'Medium Voltage Switchgear 15kV', 'Electrical Infrastructure', 'Metal-clad switchgear for primary power distribution', 'each', 24, 'expert', '{"preferred_vendor": "Schneider Electric", "part_number": "SM6-24", "contact_info": "power@schneider.com"}', 12, '{"voltage": "15kV", "power_rating": "2000A", "efficiency": "99.5%", "dimensions": "2400x1200x2000mm", "weight": "1500kg", "operating_temp": "-25°C to +40°C"}', 0.02, 'Requires crane for installation. Foundation must be level within 2mm.'),

('elec_002', 'Low Voltage Main Distribution Panel', 'Electrical Infrastructure', 'Main LV distribution panel with metering', 'each', 16, 'intermediate', '{"preferred_vendor": "ABB", "part_number": "MNS-iS", "contact_info": "support@abb.com"}', 8, '{"voltage": "400V", "power_rating": "4000A", "efficiency": "99.8%", "dimensions": "2000x800x600mm", "weight": "800kg", "operating_temp": "-5°C to +40°C"}', 0.03, 'Install in dedicated electrical room with proper ventilation.'),

('elec_003', 'UPS System 500kVA', 'Backup Power', 'Online double conversion UPS system', 'each', 32, 'specialist', '{"preferred_vendor": "Eaton", "part_number": "93E-500", "contact_info": "datacenter@eaton.com"}', 16, '{"voltage": "400V", "power_rating": "500kVA", "efficiency": "96.5%", "dimensions": "1200x800x1900mm", "weight": "1200kg", "redundancy_level": "N+1"}', 0.01, 'Requires dedicated HVAC for cooling. Battery room separate.'),

('elec_004', 'Emergency Diesel Generator 1MW', 'Backup Power', 'Standby diesel generator with auto transfer', 'each', 48, 'specialist', '{"preferred_vendor": "Caterpillar", "part_number": "C32-1000", "contact_info": "power@cat.com"}', 20, '{"power_rating": "1000kW", "efficiency": "45%", "dimensions": "6000x2500x3000mm", "weight": "8000kg", "operating_temp": "-40°C to +50°C"}', 0.01, 'Outdoor installation. Requires concrete pad and fuel system.'),

('elec_005', 'Power Distribution Unit (PDU)', 'Electrical Infrastructure', 'Rack-mounted intelligent PDU', 'each', 2, 'intermediate', '{"preferred_vendor": "APC", "part_number": "AP8959", "contact_info": "datacenter@apc.com"}', 4, '{"voltage": "400V", "power_rating": "32A", "dimensions": "44U rack mount", "weight": "25kg"}', 0.05, 'Mount in server rack. Connect to monitoring system.'),

-- Mechanical Systems
('mech_001', 'Computer Room Air Handler (CRAH) 100kW', 'Mechanical Systems', 'Precision air conditioning unit for data center', 'each', 24, 'expert', '{"preferred_vendor": "Stulz", "part_number": "CyberAir3", "contact_info": "datacenter@stulz.com"}', 12, '{"power_rating": "100kW", "cooling_capacity": "350kW", "dimensions": "2000x1200x2200mm", "weight": "1500kg", "efficiency": "COP 3.5"}', 0.02, 'Requires chilled water connections and condensate drain.'),

('mech_002', 'Chilled Water Pump', 'Mechanical Systems', 'High efficiency centrifugal pump for chilled water', 'each', 8, 'intermediate', '{"preferred_vendor": "Grundfos", "part_number": "NK-200", "contact_info": "pumps@grundfos.com"}', 6, '{"power_rating": "75kW", "flow_rate": "500m3/h", "head": "45m", "efficiency": "85%", "weight": "450kg"}', 0.03, 'Install with vibration isolation. Prime before startup.'),

('mech_003', 'Cooling Tower 500kW', 'Mechanical Systems', 'Induced draft cooling tower for heat rejection', 'each', 32, 'expert', '{"preferred_vendor": "BAC", "part_number": "VTI-500", "contact_info": "cooling@spxcooling.com"}', 16, '{"cooling_capacity": "500kW", "dimensions": "6000x3000x4000mm", "weight": "2500kg", "efficiency": "3.5 gpm/ton"}', 0.01, 'Rooftop installation. Requires structural analysis.'),

('mech_004', 'Hot Aisle Containment System', 'Mechanical Systems', 'Modular hot aisle containment with sliding doors', 'linear_meter', 4, 'intermediate', '{"preferred_vendor": "Schneider Electric", "part_number": "NetShelter", "contact_info": "containment@schneider.com"}', 8, '{"dimensions": "ceiling to floor", "weight": "50kg/m", "operating_temp": "up to 40°C"}', 0.05, 'Install after server racks are positioned.'),

-- IT Infrastructure
('it_001', 'Server Rack 42U', 'IT Infrastructure', 'Standard 19-inch server rack with cable management', 'each', 4, 'intermediate', '{"preferred_vendor": "APC", "part_number": "AR3100", "contact_info": "racks@apc.com"}', 3, '{"dimensions": "600x1070x2000mm", "weight": "85kg", "load_capacity": "1500kg"}', 0.02, 'Install on raised floor. Ensure proper grounding.'),

('it_002', 'Network Switch 48-Port', 'IT Infrastructure', 'Managed Gigabit Ethernet switch', 'each', 2, 'intermediate', '{"preferred_vendor": "Cisco", "part_number": "C9300-48P", "contact_info": "datacenter@cisco.com"}', 6, '{"ports": "48x1Gb + 4x10Gb", "power": "120W", "dimensions": "1U rack mount", "weight": "3.5kg"}', 0.03, 'Configure VLANs before deployment.'),

('it_003', 'Fiber Optic Patch Panel', 'IT Infrastructure', '48-port LC duplex fiber patch panel', 'each', 3, 'intermediate', '{"preferred_vendor": "Panduit", "part_number": "FAP12WBLY", "contact_info": "fiber@panduit.com"}', 4, '{"ports": "48 LC duplex", "dimensions": "1U rack mount", "weight": "2kg"}', 0.05, 'Label all connections clearly.'),

-- Fire Protection
('fire_001', 'Clean Agent Fire Suppression System', 'Fire Protection', 'FM-200 clean agent fire suppression for data center', 'sqm', 1.5, 'expert', '{"preferred_vendor": "Kidde", "part_number": "FM200-DC", "contact_info": "fire@kidde.com"}', 10, '{"agent": "FM-200", "coverage": "1 sqm", "discharge_time": "10 seconds"}', 0.01, 'Commission with local fire department.'),

('fire_002', 'Smoke Detection System', 'Fire Protection', 'VESDA aspirating smoke detection system', 'sqm', 0.5, 'expert', '{"preferred_vendor": "Xtralis", "part_number": "VESDA-E", "contact_info": "detection@xtralis.com"}', 8, '{"coverage": "2000 sqm", "sensitivity": "0.001% obscuration/m"}', 0.02, 'Calibrate after installation.'),

-- Security Systems
('sec_001', 'Access Control Panel', 'Security Systems', 'IP-based access control system', 'each', 8, 'intermediate', '{"preferred_vendor": "HID Global", "part_number": "VertX-V100", "contact_info": "access@hidglobal.com"}', 6, '{"doors": "8 doors", "users": "10000", "dimensions": "300x200x80mm", "weight": "2kg"}', 0.03, 'Connect to building management system.'),

('sec_002', 'CCTV Camera System', 'Security Systems', '4K IP security camera with analytics', 'each', 3, 'intermediate', '{"preferred_vendor": "Axis", "part_number": "P3245-V", "contact_info": "video@axis.com"}', 5, '{"resolution": "4K", "storage": "edge recording", "dimensions": "dome mount", "weight": "1.2kg"}', 0.02, 'Configure analytics and alerts.'),

-- Foundation & Structural
('found_001', 'Raised Floor System', 'Foundation Systems', 'Anti-static raised floor with pedestals', 'sqm', 1.2, 'intermediate', '{"preferred_vendor": "Kingspan", "part_number": "RMG-600", "contact_info": "floors@kingspan.com"}', 8, '{"height": "600mm", "load_capacity": "1500kg/sqm", "dimensions": "600x600mm panels"}', 0.03, 'Ensure level installation within 1mm tolerance.'),

('found_002', 'Cable Tray System', 'Foundation Systems', 'Perforated cable tray for power and data', 'linear_meter', 0.8, 'intermediate', '{"preferred_vendor": "Legrand", "part_number": "CT-300", "contact_info": "cable@legrand.com"}', 4, '{"width": "300mm", "load_capacity": "50kg/m", "material": "galvanized steel"}', 0.05, 'Support every 2 meters maximum.'),

-- Additional Components
('hvac_001', 'Building Management System (BMS)', 'Monitoring & Controls', 'Integrated building automation system', 'each', 40, 'specialist', '{"preferred_vendor": "Johnson Controls", "part_number": "Metasys", "contact_info": "bms@jci.com"}', 12, '{"points": "5000", "protocols": "BACnet/IP", "redundancy_level": "N+1"}', 0.01, 'Commission with all connected systems.'),

('net_001', 'Structured Cabling Cat6A', 'IT Infrastructure', 'Category 6A UTP cable for 10Gb networks', 'meter', 0.1, 'intermediate', '{"preferred_vendor": "CommScope", "part_number": "760155436", "contact_info": "cable@commscope.com"}', 2, '{"category": "6A", "bandwidth": "500MHz", "length": "100m max"}', 0.08, 'Test all links after installation.'),

('power_001', 'Automatic Transfer Switch (ATS)', 'Electrical Infrastructure', 'Automatic transfer switch for generator backup', 'each', 16, 'expert', '{"preferred_vendor": "ASCO", "part_number": "7000-Series", "contact_info": "transfer@asco.com"}', 10, '{"rating": "2000A", "voltage": "400V", "transfer_time": "< 10 seconds", "weight": "600kg"}', 0.02, 'Test transfer sequences during commissioning.');

-- Insert quality tiers for electrical components
INSERT INTO quality_tiers (id, component_id, name, unit_cost, description) VALUES
-- Medium Voltage Switchgear
('elec_001_basic', 'elec_001', 'Standard', 85000, 'Basic metal-clad switchgear with standard protection'),
('elec_001_premium', 'elec_001', 'Premium', 125000, 'Advanced switchgear with digital protection and monitoring'),
('elec_001_enterprise', 'elec_001', 'Enterprise', 165000, 'High-end switchgear with full automation and redundancy'),

-- LV Distribution Panel
('elec_002_basic', 'elec_002', 'Standard', 15000, 'Standard distribution panel with basic metering'),
('elec_002_premium', 'elec_002', 'Premium', 22000, 'Enhanced panel with power quality monitoring'),
('elec_002_enterprise', 'elec_002', 'Enterprise', 32000, 'Smart panel with advanced analytics and remote monitoring'),

-- UPS System
('elec_003_basic', 'elec_003', 'Standard', 185000, 'Online UPS with basic monitoring'),
('elec_003_premium', 'elec_003', 'Premium', 245000, 'High-efficiency UPS with advanced battery management'),
('elec_003_enterprise', 'elec_003', 'Enterprise', 325000, 'Modular UPS with hot-swappable components and predictive analytics'),

-- Diesel Generator
('elec_004_basic', 'elec_004', 'Standard', 485000, 'Standard diesel generator with basic controls'),
('elec_004_premium', 'elec_004', 'Premium', 625000, 'Enhanced generator with advanced monitoring and fuel management'),
('elec_004_enterprise', 'elec_004', 'Enterprise', 785000, 'Premium generator with remote monitoring and predictive maintenance'),

-- PDU
('elec_005_basic', 'elec_005', 'Standard', 2500, 'Basic rack PDU with monitoring'),
('elec_005_premium', 'elec_005', 'Premium', 3800, 'Intelligent PDU with outlet-level monitoring'),
('elec_005_enterprise', 'elec_005', 'Enterprise', 5200, 'Smart PDU with environmental monitoring and switching'),

-- CRAH Unit
('mech_001_basic', 'mech_001', 'Standard', 125000, 'Standard precision cooling unit'),
('mech_001_premium', 'mech_001', 'Premium', 165000, 'High-efficiency unit with variable speed drives'),
('mech_001_enterprise', 'mech_001', 'Enterprise', 225000, 'Premium unit with advanced controls and redundancy'),

-- Chilled Water Pump
('mech_002_basic', 'mech_002', 'Standard', 28000, 'Standard centrifugal pump'),
('mech_002_premium', 'mech_002', 'Premium', 38000, 'High-efficiency pump with VFD'),
('mech_002_enterprise', 'mech_002', 'Enterprise', 52000, 'Premium pump with smart controls and condition monitoring'),

-- Cooling Tower
('mech_003_basic', 'mech_003', 'Standard', 185000, 'Standard induced draft cooling tower'),
('mech_003_premium', 'mech_003', 'Premium', 245000, 'High-efficiency tower with variable speed fans'),
('mech_003_enterprise', 'mech_003', 'Enterprise', 325000, 'Premium tower with advanced controls and monitoring'),

-- Hot Aisle Containment
('mech_004_basic', 'mech_004', 'Standard', 850, 'Basic containment panels'),
('mech_004_premium', 'mech_004', 'Premium', 1200, 'Enhanced panels with better sealing'),
('mech_004_enterprise', 'mech_004', 'Enterprise', 1650, 'Premium panels with integrated monitoring'),

-- Server Rack
('it_001_basic', 'it_001', 'Standard', 1200, 'Standard 42U rack'),
('it_001_premium', 'it_001', 'Premium', 1800, 'Enhanced rack with improved cable management'),
('it_001_enterprise', 'it_001', 'Enterprise', 2500, 'Premium rack with environmental monitoring'),

-- Network Switch
('it_002_basic', 'it_002', 'Standard', 8500, 'Standard managed switch'),
('it_002_premium', 'it_002', 'Premium', 12500, 'Enhanced switch with advanced features'),
('it_002_enterprise', 'it_002', 'Enterprise', 18500, 'Enterprise switch with full stack capabilities'),

-- Fiber Patch Panel
('it_003_basic', 'it_003', 'Standard', 450, 'Standard fiber patch panel'),
('it_003_premium', 'it_003', 'Premium', 650, 'Enhanced panel with better cable management'),
('it_003_enterprise', 'it_003', 'Enterprise', 950, 'Premium panel with integrated testing capabilities'),

-- Fire Suppression
('fire_001_basic', 'fire_001', 'Standard', 185, 'Basic FM-200 system per sqm'),
('fire_001_premium', 'fire_001', 'Premium', 245, 'Enhanced system with zone control'),
('fire_001_enterprise', 'fire_001', 'Enterprise', 325, 'Advanced system with pre-action capabilities'),

-- Smoke Detection
('fire_002_basic', 'fire_002', 'Standard', 125, 'Standard aspirating detection per sqm'),
('fire_002_premium', 'fire_002', 'Premium', 165, 'Enhanced detection with analytics'),
('fire_002_enterprise', 'fire_002', 'Enterprise', 225, 'Advanced detection with predictive capabilities'),

-- Access Control
('sec_001_basic', 'sec_001', 'Standard', 3500, 'Basic access control panel'),
('sec_001_premium', 'sec_001', 'Premium', 5200, 'Enhanced panel with biometric support'),
('sec_001_enterprise', 'sec_001', 'Enterprise', 7500, 'Enterprise panel with advanced analytics'),

-- CCTV System
('sec_002_basic', 'sec_002', 'Standard', 1200, 'Standard 4K camera'),
('sec_002_premium', 'sec_002', 'Premium', 1800, 'Enhanced camera with advanced analytics'),
('sec_002_enterprise', 'sec_002', 'Enterprise', 2650, 'Premium camera with AI-powered features'),

-- Raised Floor
('found_001_basic', 'found_001', 'Standard', 125, 'Standard raised floor per sqm'),
('found_001_premium', 'found_001', 'Premium', 185, 'Enhanced floor with improved airflow'),
('found_001_enterprise', 'found_001', 'Enterprise', 265, 'Premium floor with integrated monitoring'),

-- Cable Tray
('found_002_basic', 'found_002', 'Standard', 85, 'Standard perforated tray per meter'),
('found_002_premium', 'found_002', 'Premium', 125, 'Enhanced tray with better load capacity'),
('found_002_enterprise', 'found_002', 'Enterprise', 185, 'Premium tray with integrated cable management'),

-- BMS
('hvac_001_basic', 'hvac_001', 'Standard', 125000, 'Standard building management system'),
('hvac_001_premium', 'hvac_001', 'Premium', 185000, 'Enhanced BMS with advanced analytics'),
('hvac_001_enterprise', 'hvac_001', 'Enterprise', 265000, 'Enterprise BMS with AI and predictive capabilities'),

-- Structured Cabling
('net_001_basic', 'net_001', 'Standard', 8.5, 'Standard Cat6A cable per meter'),
('net_001_premium', 'net_001', 'Premium', 12.5, 'Enhanced cable with better performance'),
('net_001_enterprise', 'net_001', 'Enterprise', 18.5, 'Premium cable with extended warranty'),

-- ATS
('power_001_basic', 'power_001', 'Standard', 45000, 'Standard automatic transfer switch'),
('power_001_premium', 'power_001', 'Premium', 65000, 'Enhanced ATS with power quality monitoring'),
('power_001_enterprise', 'power_001', 'Enterprise', 95000, 'Premium ATS with advanced protection and analytics');

-- Update categories table with data center specific categories
INSERT INTO categories (id, name, description, category_type, sort_order, is_active) VALUES
('cat_elec', 'Electrical Infrastructure', 'Power distribution, UPS, generators, and electrical systems', 'datacenter', 1, true),
('cat_mech', 'Mechanical Systems', 'HVAC, cooling, pumps, and environmental control systems', 'datacenter', 2, true),
('cat_it', 'IT Infrastructure', 'Servers, networking, storage, and computing equipment', 'datacenter', 3, true),
('cat_fire', 'Fire Protection', 'Fire suppression, detection, and safety systems', 'datacenter', 4, true),
('cat_sec', 'Security Systems', 'Access control, surveillance, and physical security', 'datacenter', 5, true),
('cat_found', 'Foundation Systems', 'Raised floors, cable management, and structural elements', 'datacenter', 6, true),
('cat_power', 'Backup Power', 'UPS systems, generators, and power backup solutions', 'datacenter', 7, true),
('cat_monitor', 'Monitoring & Controls', 'Building management, monitoring, and control systems', 'datacenter', 8, true)
ON CONFLICT (id) DO NOTHING;