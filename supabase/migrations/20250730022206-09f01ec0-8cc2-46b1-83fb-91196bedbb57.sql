-- Add quality tiers for Civil/Structural components
INSERT INTO quality_tiers (id, component_id, name, unit_cost, description) VALUES

-- Foundation System (cubic yards)
('foundation-system-basic', 'foundation-system', 'Basic', 250.00, 'Standard concrete foundation with basic reinforcement'),
('foundation-system-standard', 'foundation-system', 'Standard', 350.00, 'Reinforced concrete with improved load capacity'),
('foundation-system-premium', 'foundation-system', 'Premium', 500.00, 'High-strength concrete with advanced reinforcement'),

-- Structural Steel (pounds)
('structural-steel-basic', 'structural-steel', 'Basic', 2.50, 'Standard carbon steel beams and columns'),
('structural-steel-standard', 'structural-steel', 'Standard', 3.75, 'High-strength steel with corrosion resistance'),
('structural-steel-premium', 'structural-steel', 'Premium', 5.50, 'Premium alloy steel with enhanced properties'),

-- Precast Concrete (cubic yards)
('precast-concrete-basic', 'precast-concrete', 'Basic', 300.00, 'Standard precast concrete panels'),
('precast-concrete-standard', 'precast-concrete', 'Standard', 425.00, 'Reinforced precast with improved finish'),
('precast-concrete-premium', 'precast-concrete', 'Premium', 600.00, 'High-performance precast with architectural finish'),

-- Metal Roofing (sq ft)
('metal-roofing-basic', 'metal-roofing', 'Basic', 8.00, 'Standard galvanized steel roofing'),
('metal-roofing-standard', 'metal-roofing', 'Standard', 12.00, 'Aluminum roofing with improved coatings'),
('metal-roofing-premium', 'metal-roofing', 'Premium', 18.00, 'Premium metal roofing with 50-year warranty'),

-- Waterproofing (sq ft)
('waterproofing-basic', 'waterproofing', 'Basic', 6.00, 'Basic membrane waterproofing'),
('waterproofing-standard', 'waterproofing', 'Standard', 9.00, 'Modified bitumen waterproofing system'),
('waterproofing-premium', 'waterproofing', 'Premium', 14.00, 'Premium EPDM waterproofing with extended warranty'),

-- Insulation System (sq ft)
('insulation-system-basic', 'insulation-system', 'Basic', 3.50, 'Standard fiberglass insulation R-19'),
('insulation-system-standard', 'insulation-system', 'Standard', 5.25, 'High-performance foam insulation R-25'),
('insulation-system-premium', 'insulation-system', 'Premium', 7.75, 'Spray foam insulation with vapor barrier R-30'),

-- Exterior Cladding (sq ft)
('exterior-cladding-basic', 'exterior-cladding', 'Basic', 12.00, 'Standard metal panel cladding'),
('exterior-cladding-standard', 'exterior-cladding', 'Standard', 18.00, 'Insulated metal panel system'),
('exterior-cladding-premium', 'exterior-cladding', 'Premium', 26.00, 'Architectural panel system with custom finish'),

-- Personnel Door (each)
('personnel-door-basic', 'personnel-door', 'Basic', 1500.00, 'Standard hollow metal door with basic hardware'),
('personnel-door-standard', 'personnel-door', 'Standard', 2200.00, 'Insulated steel door with upgraded hardware'),
('personnel-door-premium', 'personnel-door', 'Premium', 3200.00, 'High-security door with electronic locks'),

-- Overhead Door (each)
('overhead-door-basic', 'overhead-door', 'Basic', 2500.00, 'Standard sectional overhead door'),
('overhead-door-standard', 'overhead-door', 'Standard', 3800.00, 'Insulated overhead door with automatic opener'),
('overhead-door-premium', 'overhead-door', 'Premium', 5500.00, 'High-speed industrial door with safety features'),

-- Dock Leveler (each)
('dock-leveler-basic', 'dock-leveler', 'Basic', 4500.00, 'Mechanical dock leveler with manual operation'),
('dock-leveler-standard', 'dock-leveler', 'Standard', 6500.00, 'Hydraulic dock leveler with push-button control'),
('dock-leveler-premium', 'dock-leveler', 'Premium', 9000.00, 'Premium hydraulic leveler with automatic operation'),

-- Loading Dock (each)
('loading-dock-basic', 'loading-dock', 'Basic', 8000.00, 'Basic concrete loading dock with steel bumpers'),
('loading-dock-standard', 'loading-dock', 'Standard', 12000.00, 'Reinforced dock with hydraulic leveler'),
('loading-dock-premium', 'loading-dock', 'Premium', 18000.00, 'Complete dock system with shelters and seals'),

-- Security Fencing (linear feet)
('security-fencing-basic', 'security-fencing', 'Basic', 25.00, 'Standard 8-foot chain link with barbed wire'),
('security-fencing-standard', 'security-fencing', 'Standard', 35.00, 'Anti-climb fence with security mesh'),
('security-fencing-premium', 'security-fencing', 'Premium', 50.00, 'High-security fence with sensor integration'),

-- Vehicle Gate (each)
('vehicle-gate-basic', 'vehicle-gate', 'Basic', 3500.00, 'Manual swing gate with basic hardware'),
('vehicle-gate-standard', 'vehicle-gate', 'Standard', 5500.00, 'Automated sliding gate with access control'),
('vehicle-gate-premium', 'vehicle-gate', 'Premium', 8000.00, 'High-security automated gate with biometric access'),

-- Pedestrian Gate (each)
('pedestrian-gate-basic', 'pedestrian-gate', 'Basic', 1200.00, 'Standard swing gate with key lock'),
('pedestrian-gate-standard', 'pedestrian-gate', 'Standard', 1800.00, 'Card reader gate with electronic lock'),
('pedestrian-gate-premium', 'pedestrian-gate', 'Premium', 2800.00, 'Turnstile gate with biometric access'),

-- Excavation (cubic yards)
('excavation-basic', 'excavation', 'Basic', 15.00, 'Standard excavation with basic equipment'),
('excavation-standard', 'excavation', 'Standard', 22.00, 'Precision excavation with GPS guidance'),
('excavation-premium', 'excavation', 'Premium', 32.00, 'Specialized excavation with soil stabilization'),

-- Backfill (cubic yards)
('backfill-basic', 'backfill', 'Basic', 18.00, 'Standard backfill with granular material'),
('backfill-standard', 'backfill', 'Standard', 26.00, 'Engineered backfill with compaction testing'),
('backfill-premium', 'backfill', 'Premium', 38.00, 'Controlled low-strength material backfill'),

-- Grading (sq ft)
('grading-basic', 'grading', 'Basic', 2.50, 'Basic site grading with standard tolerances'),
('grading-standard', 'grading', 'Standard', 3.75, 'Precision grading with laser control'),
('grading-premium', 'grading', 'Premium', 5.50, 'GPS-controlled grading with tight tolerances'),

-- Paving (sq ft)
('paving-basic', 'paving', 'Basic', 6.00, 'Standard asphalt paving 3-inch thick'),
('paving-standard', 'paving', 'Standard', 9.00, 'Reinforced asphalt with base course'),
('paving-premium', 'paving', 'Premium', 14.00, 'Heavy-duty concrete paving for equipment loads'),

-- Landscaping (sq ft)
('landscaping-basic', 'landscaping', 'Basic', 4.00, 'Basic grass seeding and basic plantings'),
('landscaping-standard', 'landscaping', 'Standard', 6.50, 'Sodding with shrubs and irrigation'),
('landscaping-premium', 'landscaping', 'Premium', 10.00, 'Complete landscape design with automated irrigation'),

-- IT Infrastructure components
-- Network Switches (each)
('network-switches-basic', 'network-switches', 'Basic', 2500.00, '24-port managed switch with basic features'),
('network-switches-standard', 'network-switches', 'Standard', 4000.00, '48-port managed switch with advanced features'),
('network-switches-premium', 'network-switches', 'Premium', 6500.00, 'High-density switch with 10G uplinks'),

-- Routers (each)
('routers-basic', 'routers', 'Basic', 3500.00, 'Basic enterprise router with standard throughput'),
('routers-standard', 'routers', 'Standard', 5500.00, 'High-performance router with advanced routing'),
('routers-premium', 'routers', 'Premium', 8500.00, 'Carrier-class router with redundant modules'),

-- Firewalls (each)
('firewalls-basic', 'firewalls', 'Basic', 2000.00, 'Basic firewall with standard features'),
('firewalls-standard', 'firewalls', 'Standard', 3500.00, 'Next-generation firewall with IPS'),
('firewalls-premium', 'firewalls', 'Premium', 6000.00, 'Enterprise firewall with advanced threat protection'),

-- Load Balancers (each)
('load-balancers-basic', 'load-balancers', 'Basic', 4000.00, 'Basic load balancer with SSL offloading'),
('load-balancers-standard', 'load-balancers', 'Standard', 6500.00, 'Advanced load balancer with application optimization'),
('load-balancers-premium', 'load-balancers', 'Premium', 10000.00, 'High-availability load balancer with global server load balancing'),

-- Fiber Optic Cable (linear feet)
('fiber-optic-cable-basic', 'fiber-optic-cable', 'Basic', 3.50, 'Single-mode fiber optic cable'),
('fiber-optic-cable-standard', 'fiber-optic-cable', 'Standard', 5.25, 'Multi-mode fiber with enhanced bandwidth'),
('fiber-optic-cable-premium', 'fiber-optic-cable', 'Premium', 7.50, 'Armored fiber cable with bend-insensitive technology'),

-- Copper Cable (linear feet)
('copper-cable-basic', 'copper-cable', 'Basic', 2.00, 'Category 6 copper cable'),
('copper-cable-standard', 'copper-cable', 'Standard', 3.00, 'Category 6A copper cable with enhanced performance'),
('copper-cable-premium', 'copper-cable', 'Premium', 4.50, 'Category 8 copper cable for high-speed applications'),

-- Patch Panels (each)
('patch-panels-basic', 'patch-panels', 'Basic', 150.00, '24-port Category 6 patch panel'),
('patch-panels-standard', 'patch-panels', 'Standard', 225.00, '48-port Category 6A patch panel'),
('patch-panels-premium', 'patch-panels', 'Premium', 350.00, 'High-density fiber patch panel with management'),

-- Cable Trays (linear feet)
('cable-trays-basic', 'cable-trays', 'Basic', 25.00, 'Standard galvanized cable tray'),
('cable-trays-standard', 'cable-trays', 'Standard', 35.00, 'Aluminum cable tray with dividers'),
('cable-trays-premium', 'cable-trays', 'Premium', 50.00, 'Stainless steel cable tray with advanced management'),

-- Conduit (linear feet)
('conduit-basic', 'conduit', 'Basic', 8.00, 'Standard EMT conduit with fittings'),
('conduit-standard', 'conduit', 'Standard', 12.00, 'Rigid conduit with corrosion protection'),
('conduit-premium', 'conduit', 'Premium', 18.00, 'Stainless steel conduit for harsh environments'),

-- Server Racks (each)
('server-racks-basic', 'server-racks', 'Basic', 800.00, '42U open frame rack'),
('server-racks-standard', 'server-racks', 'Standard', 1200.00, '42U enclosed rack with side panels'),
('server-racks-premium', 'server-racks', 'Premium', 1800.00, '42U seismic rack with advanced cable management'),

-- Rack Accessories (each)
('rack-accessories-basic', 'rack-accessories', 'Basic', 50.00, 'Basic rack accessories and mounting hardware'),
('rack-accessories-standard', 'rack-accessories', 'Standard', 75.00, 'Standard rack accessories with cable management'),
('rack-accessories-premium', 'rack-accessories', 'Premium', 120.00, 'Premium rack accessories with intelligent PDUs'),

-- KVM Switches (each)
('kvm-switches-basic', 'kvm-switches', 'Basic', 300.00, '8-port basic KVM switch'),
('kvm-switches-standard', 'kvm-switches', 'Standard', 500.00, '16-port KVM switch with IP access'),
('kvm-switches-premium', 'kvm-switches', 'Premium', 800.00, '32-port enterprise KVM with virtual media'),

-- Storage Arrays (each)
('storage-arrays-basic', 'storage-arrays', 'Basic', 15000.00, 'Basic storage array with RAID capability'),
('storage-arrays-standard', 'storage-arrays', 'Standard', 25000.00, 'Enterprise storage with advanced features'),
('storage-arrays-premium', 'storage-arrays', 'Premium', 40000.00, 'High-performance all-flash storage array'),

-- Backup Systems (each)
('backup-systems-basic', 'backup-systems', 'Basic', 8000.00, 'Basic tape backup system'),
('backup-systems-standard', 'backup-systems', 'Standard', 12000.00, 'Disk-based backup with deduplication'),
('backup-systems-premium', 'backup-systems', 'Premium', 20000.00, 'Enterprise backup with cloud integration'),

-- Network Monitoring (each)
('network-monitoring-basic', 'network-monitoring', 'Basic', 500.00, 'Basic network monitoring tools'),
('network-monitoring-standard', 'network-monitoring', 'Standard', 1000.00, 'Advanced monitoring with alerting'),
('network-monitoring-premium', 'network-monitoring', 'Premium', 2000.00, 'Enterprise monitoring with AI analytics'),

-- Wireless Access Points (each)
('wireless-access-points-basic', 'wireless-access-points', 'Basic', 200.00, 'Basic 802.11ac access point'),
('wireless-access-points-standard', 'wireless-access-points', 'Standard', 350.00, 'Enterprise access point with advanced features'),
('wireless-access-points-premium', 'wireless-access-points', 'Premium', 550.00, 'Wi-Fi 6E access point with mesh capability'),

-- Wireless Controllers (each)
('wireless-controllers-basic', 'wireless-controllers', 'Basic', 1500.00, 'Basic wireless controller for 25 APs'),
('wireless-controllers-standard', 'wireless-controllers', 'Standard', 2500.00, 'Enterprise controller for 100 APs'),
('wireless-controllers-premium', 'wireless-controllers', 'Premium', 4000.00, 'High-capacity controller for 500+ APs'),

-- Structured Cabling (linear feet)
('structured-cabling-basic', 'structured-cabling', 'Basic', 4.00, 'Basic structured cabling installation'),
('structured-cabling-standard', 'structured-cabling', 'Standard', 6.00, 'Enterprise cabling with testing'),
('structured-cabling-premium', 'structured-cabling', 'Premium', 9.00, 'Premium cabling with 25-year warranty'),

-- Cable Management (linear feet)
('cable-management-basic', 'cable-management', 'Basic', 15.00, 'Basic cable management system'),
('cable-management-standard', 'cable-management', 'Standard', 22.00, 'Organized cable management with labeling'),
('cable-management-premium', 'cable-management', 'Premium', 32.00, 'Intelligent cable management with tracking'),

-- Security & Controls components
-- Access Control System (each)
('access-control-system-basic', 'access-control-system', 'Basic', 1500.00, 'Basic card reader access control'),
('access-control-system-standard', 'access-control-system', 'Standard', 2500.00, 'Multi-technology access control with audit trail'),
('access-control-system-premium', 'access-control-system', 'Premium', 4000.00, 'Biometric access control with integration'),

-- Surveillance Cameras (each)
('surveillance-cameras-basic', 'surveillance-cameras', 'Basic', 400.00, 'Basic IP camera with 1080p resolution'),
('surveillance-cameras-standard', 'surveillance-cameras', 'Standard', 650.00, '4K IP camera with night vision'),
('surveillance-cameras-premium', 'surveillance-cameras', 'Premium', 1000.00, 'PTZ camera with AI analytics'),

-- Video Management (each)
('video-management-basic', 'video-management', 'Basic', 2000.00, 'Basic video management software'),
('video-management-standard', 'video-management', 'Standard', 3500.00, 'Advanced VMS with analytics'),
('video-management-premium', 'video-management', 'Premium', 6000.00, 'Enterprise VMS with AI and cloud integration'),

-- Intrusion Detection (each)
('intrusion-detection-basic', 'intrusion-detection', 'Basic', 800.00, 'Basic door and window sensors'),
('intrusion-detection-standard', 'intrusion-detection', 'Standard', 1300.00, 'Advanced sensors with motion detection'),
('intrusion-detection-premium', 'intrusion-detection', 'Premium', 2000.00, 'Intelligent sensors with AI analytics'),

-- Motion Sensors (each)
('motion-sensors-basic', 'motion-sensors', 'Basic', 150.00, 'Basic PIR motion sensor'),
('motion-sensors-standard', 'motion-sensors', 'Standard', 225.00, 'Dual-technology motion sensor'),
('motion-sensors-premium', 'motion-sensors', 'Premium', 350.00, 'AI-powered motion sensor with classification'),

-- Door Sensors (each)
('door-sensors-basic', 'door-sensors', 'Basic', 100.00, 'Basic magnetic door sensor'),
('door-sensors-standard', 'door-sensors', 'Standard', 150.00, 'Wireless door sensor with tamper detection'),
('door-sensors-premium', 'door-sensors', 'Premium', 225.00, 'Smart door sensor with real-time monitoring'),

-- Glass Break Sensors (each)
('glass-break-sensors-basic', 'glass-break-sensors', 'Basic', 120.00, 'Basic acoustic glass break sensor'),
('glass-break-sensors-standard', 'glass-break-sensors', 'Standard', 180.00, 'Dual-technology glass break sensor'),
('glass-break-sensors-premium', 'glass-break-sensors', 'Premium', 275.00, 'Advanced glass break sensor with pattern recognition'),

-- Vibration Sensors (each)
('vibration-sensors-basic', 'vibration-sensors', 'Basic', 200.00, 'Basic vibration sensor'),
('vibration-sensors-standard', 'vibration-sensors', 'Standard', 300.00, 'Intelligent vibration sensor with analysis'),
('vibration-sensors-premium', 'vibration-sensors', 'Premium', 450.00, 'Advanced vibration sensor with predictive analytics'),

-- Security Control Panel (each)
('security-control-panel-basic', 'security-control-panel', 'Basic', 1000.00, 'Basic security control panel'),
('security-control-panel-standard', 'security-control-panel', 'Standard', 1700.00, 'Advanced control panel with network connectivity'),
('security-control-panel-premium', 'security-control-panel', 'Premium', 2800.00, 'Enterprise control panel with redundancy'),

-- Alarm Notification (each)
('alarm-notification-basic', 'alarm-notification', 'Basic', 300.00, 'Basic horn and strobe notification'),
('alarm-notification-standard', 'alarm-notification', 'Standard', 500.00, 'Voice evacuation with strobe'),
('alarm-notification-premium', 'alarm-notification', 'Premium', 800.00, 'Intelligent notification with zone control'),

-- Emergency Communication (each)
('emergency-communication-basic', 'emergency-communication', 'Basic', 2000.00, 'Basic emergency phone system'),
('emergency-communication-standard', 'emergency-communication', 'Standard', 3500.00, 'Advanced emergency communication with paging'),
('emergency-communication-premium', 'emergency-communication', 'Premium', 6000.00, 'Integrated emergency communication platform'),

-- Mass Notification (each)
('mass-notification-basic', 'mass-notification', 'Basic', 3000.00, 'Basic mass notification speakers'),
('mass-notification-standard', 'mass-notification', 'Standard', 5000.00, 'Advanced notification with digital displays'),
('mass-notification-premium', 'mass-notification', 'Premium', 8000.00, 'Intelligent mass notification with mobile integration'),

-- Environmental Monitoring (each)
('environmental-monitoring-basic', 'environmental-monitoring', 'Basic', 500.00, 'Basic temperature and humidity sensors'),
('environmental-monitoring-standard', 'environmental-monitoring', 'Standard', 800.00, 'Multi-parameter environmental monitoring'),
('environmental-monitoring-premium', 'environmental-monitoring', 'Premium', 1300.00, 'Intelligent environmental monitoring with analytics'),

-- Building Management System (each)
('building-management-system-basic', 'building-management-system', 'Basic', 5000.00, 'Basic BMS with HVAC control'),
('building-management-system-standard', 'building-management-system', 'Standard', 8500.00, 'Advanced BMS with energy management'),
('building-management-system-premium', 'building-management-system', 'Premium', 15000.00, 'Intelligent BMS with AI optimization'),

-- Control Workstations (each)
('control-workstations-basic', 'control-workstations', 'Basic', 2000.00, 'Basic control workstation'),
('control-workstations-standard', 'control-workstations', 'Standard', 3200.00, 'Advanced workstation with multiple displays'),
('control-workstations-premium', 'control-workstations', 'Premium', 5000.00, 'Enterprise workstation with redundant systems'),

-- Network Time Protocol (each)
('network-time-protocol-basic', 'network-time-protocol', 'Basic', 800.00, 'Basic NTP server'),
('network-time-protocol-standard', 'network-time-protocol', 'Standard', 1300.00, 'Redundant NTP server with GPS'),
('network-time-protocol-premium', 'network-time-protocol', 'Premium', 2000.00, 'Enterprise NTP with atomic clock synchronization'),

-- Communication Backbone (linear feet)
('communication-backbone-basic', 'communication-backbone', 'Basic', 12.00, 'Basic communication backbone cabling'),
('communication-backbone-standard', 'communication-backbone', 'Standard', 18.00, 'Redundant backbone with fiber'),
('communication-backbone-premium', 'communication-backbone', 'Premium', 26.00, 'High-availability backbone with diverse routing'),

-- Industrial Ethernet (linear feet)
('industrial-ethernet-basic', 'industrial-ethernet', 'Basic', 8.00, 'Basic industrial Ethernet cable'),
('industrial-ethernet-standard', 'industrial-ethernet', 'Standard', 12.00, 'Shielded industrial Ethernet for harsh environments'),
('industrial-ethernet-premium', 'industrial-ethernet', 'Premium', 18.00, 'Armored industrial Ethernet with advanced protection'),

-- Control System Integration (each)
('control-system-integration-basic', 'control-system-integration', 'Basic', 3000.00, 'Basic system integration services'),
('control-system-integration-standard', 'control-system-integration', 'Standard', 5000.00, 'Advanced integration with testing'),
('control-system-integration-premium', 'control-system-integration', 'Premium', 8000.00, 'Complete integration with commissioning and training');