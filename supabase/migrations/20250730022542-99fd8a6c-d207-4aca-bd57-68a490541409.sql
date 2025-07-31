-- Add quality tiers for IT Infrastructure components (it-001 to it-033)
INSERT INTO quality_tiers (id, component_id, name, unit_cost, description) VALUES

-- it-001: Network Switches
('it-001-basic', 'it-001', 'Basic', 2500.00, '24-port managed switch with basic features'),
('it-001-standard', 'it-001', 'Standard', 4000.00, '48-port managed switch with advanced features'),
('it-001-premium', 'it-001', 'Premium', 6500.00, 'High-density switch with 10G uplinks'),

-- it-002: Routers
('it-002-basic', 'it-002', 'Basic', 3500.00, 'Basic enterprise router with standard throughput'),
('it-002-standard', 'it-002', 'Standard', 5500.00, 'High-performance router with advanced routing'),
('it-002-premium', 'it-002', 'Premium', 8500.00, 'Carrier-class router with redundant modules'),

-- it-003: Firewalls
('it-003-basic', 'it-003', 'Basic', 2000.00, 'Basic firewall with standard features'),
('it-003-standard', 'it-003', 'Standard', 3500.00, 'Next-generation firewall with IPS'),
('it-003-premium', 'it-003', 'Premium', 6000.00, 'Enterprise firewall with advanced threat protection'),

-- it-004: Load Balancers
('it-004-basic', 'it-004', 'Basic', 4000.00, 'Basic load balancer with SSL offloading'),
('it-004-standard', 'it-004', 'Standard', 6500.00, 'Advanced load balancer with application optimization'),
('it-004-premium', 'it-004', 'Premium', 10000.00, 'High-availability load balancer with global server load balancing'),

-- it-005: Fiber Optic Cable
('it-005-basic', 'it-005', 'Basic', 3.50, 'Single-mode fiber optic cable'),
('it-005-standard', 'it-005', 'Standard', 5.25, 'Multi-mode fiber with enhanced bandwidth'),
('it-005-premium', 'it-005', 'Premium', 7.50, 'Armored fiber cable with bend-insensitive technology'),

-- it-006: Copper Cable
('it-006-basic', 'it-006', 'Basic', 2.00, 'Category 6 copper cable'),
('it-006-standard', 'it-006', 'Standard', 3.00, 'Category 6A copper cable with enhanced performance'),
('it-006-premium', 'it-006', 'Premium', 4.50, 'Category 8 copper cable for high-speed applications'),

-- it-007: Patch Panels
('it-007-basic', 'it-007', 'Basic', 150.00, '24-port Category 6 patch panel'),
('it-007-standard', 'it-007', 'Standard', 225.00, '48-port Category 6A patch panel'),
('it-007-premium', 'it-007', 'Premium', 350.00, 'High-density fiber patch panel with management'),

-- it-008: Cable Trays
('it-008-basic', 'it-008', 'Basic', 25.00, 'Standard galvanized cable tray'),
('it-008-standard', 'it-008', 'Standard', 35.00, 'Aluminum cable tray with dividers'),
('it-008-premium', 'it-008', 'Premium', 50.00, 'Stainless steel cable tray with advanced management'),

-- it-009: Conduit
('it-009-basic', 'it-009', 'Basic', 8.00, 'Standard EMT conduit with fittings'),
('it-009-standard', 'it-009', 'Standard', 12.00, 'Rigid conduit with corrosion protection'),
('it-009-premium', 'it-009', 'Premium', 18.00, 'Stainless steel conduit for harsh environments'),

-- it-010: Server Racks
('it-010-basic', 'it-010', 'Basic', 800.00, '42U open frame rack'),
('it-010-standard', 'it-010', 'Standard', 1200.00, '42U enclosed rack with side panels'),
('it-010-premium', 'it-010', 'Premium', 1800.00, '42U seismic rack with advanced cable management'),

-- it-011: Rack Accessories
('it-011-basic', 'it-011', 'Basic', 50.00, 'Basic rack accessories and mounting hardware'),
('it-011-standard', 'it-011', 'Standard', 75.00, 'Standard rack accessories with cable management'),
('it-011-premium', 'it-011', 'Premium', 120.00, 'Premium rack accessories with intelligent PDUs'),

-- it-012: KVM Switches
('it-012-basic', 'it-012', 'Basic', 300.00, '8-port basic KVM switch'),
('it-012-standard', 'it-012', 'Standard', 500.00, '16-port KVM switch with IP access'),
('it-012-premium', 'it-012', 'Premium', 800.00, '32-port enterprise KVM with virtual media'),

-- it-013: Storage Arrays
('it-013-basic', 'it-013', 'Basic', 15000.00, 'Basic storage array with RAID capability'),
('it-013-standard', 'it-013', 'Standard', 25000.00, 'Enterprise storage with advanced features'),
('it-013-premium', 'it-013', 'Premium', 40000.00, 'High-performance all-flash storage array'),

-- it-014: Backup Systems
('it-014-basic', 'it-014', 'Basic', 8000.00, 'Basic tape backup system'),
('it-014-standard', 'it-014', 'Standard', 12000.00, 'Disk-based backup with deduplication'),
('it-014-premium', 'it-014', 'Premium', 20000.00, 'Enterprise backup with cloud integration'),

-- it-015: Network Monitoring
('it-015-basic', 'it-015', 'Basic', 500.00, 'Basic network monitoring tools'),
('it-015-standard', 'it-015', 'Standard', 1000.00, 'Advanced monitoring with alerting'),
('it-015-premium', 'it-015', 'Premium', 2000.00, 'Enterprise monitoring with AI analytics'),

-- it-016: Wireless Access Points
('it-016-basic', 'it-016', 'Basic', 200.00, 'Basic 802.11ac access point'),
('it-016-standard', 'it-016', 'Standard', 350.00, 'Enterprise access point with advanced features'),
('it-016-premium', 'it-016', 'Premium', 550.00, 'Wi-Fi 6E access point with mesh capability'),

-- it-017: Wireless Controllers
('it-017-basic', 'it-017', 'Basic', 1500.00, 'Basic wireless controller for 25 APs'),
('it-017-standard', 'it-017', 'Standard', 2500.00, 'Enterprise controller for 100 APs'),
('it-017-premium', 'it-017', 'Premium', 4000.00, 'High-capacity controller for 500+ APs'),

-- it-018: Structured Cabling
('it-018-basic', 'it-018', 'Basic', 4.00, 'Basic structured cabling installation'),
('it-018-standard', 'it-018', 'Standard', 6.00, 'Enterprise cabling with testing'),
('it-018-premium', 'it-018', 'Premium', 9.00, 'Premium cabling with 25-year warranty'),

-- it-019: Cable Management
('it-019-basic', 'it-019', 'Basic', 15.00, 'Basic cable management system'),
('it-019-standard', 'it-019', 'Standard', 22.00, 'Organized cable management with labeling'),
('it-019-premium', 'it-019', 'Premium', 32.00, 'Intelligent cable management with tracking'),

-- it-020 through it-033 (additional IT components)
('it-020-basic', 'it-020', 'Basic', 2200.00, 'Basic network appliance'),
('it-020-standard', 'it-020', 'Standard', 3500.00, 'Advanced network appliance with redundancy'),
('it-020-premium', 'it-020', 'Premium', 5500.00, 'Enterprise network appliance with clustering'),

('it-021-basic', 'it-021', 'Basic', 1800.00, 'Basic UPS system'),
('it-021-standard', 'it-021', 'Standard', 2800.00, 'Online UPS with monitoring'),
('it-021-premium', 'it-021', 'Premium', 4200.00, 'Redundant UPS with advanced management'),

('it-022-basic', 'it-022', 'Basic', 85.00, 'Basic power distribution'),
('it-022-standard', 'it-022', 'Standard', 135.00, 'Monitored power distribution'),
('it-022-premium', 'it-022', 'Premium', 200.00, 'Intelligent power distribution with analytics'),

('it-023-basic', 'it-023', 'Basic', 1200.00, 'Basic console server'),
('it-023-standard', 'it-023', 'Standard', 1900.00, 'Advanced console server with remote access'),
('it-023-premium', 'it-023', 'Premium', 2800.00, 'Enterprise console server with automation'),

('it-024-basic', 'it-024', 'Basic', 650.00, 'Basic network tap'),
('it-024-standard', 'it-024', 'Standard', 1000.00, 'Advanced network tap with filtering'),
('it-024-premium', 'it-024', 'Premium', 1500.00, 'High-speed network tap with load balancing'),

('it-025-basic', 'it-025', 'Basic', 3500.00, 'Basic application delivery controller'),
('it-025-standard', 'it-025', 'Standard', 5500.00, 'Advanced ADC with SSL acceleration'),
('it-025-premium', 'it-025', 'Premium', 8500.00, 'Enterprise ADC with global load balancing'),

('it-026-basic', 'it-026', 'Basic', 450.00, 'Basic network analyzer'),
('it-026-standard', 'it-026', 'Standard', 700.00, 'Advanced network analyzer with reporting'),
('it-026-premium', 'it-026', 'Premium', 1100.00, 'Enterprise network analyzer with AI insights'),

('it-027-basic', 'it-027', 'Basic', 280.00, 'Basic media converter'),
('it-027-standard', 'it-027', 'Standard', 420.00, 'Managed media converter with SNMP'),
('it-027-premium', 'it-027', 'Premium', 650.00, 'Enterprise media converter with redundancy'),

('it-028-basic', 'it-028', 'Basic', 95.00, 'Basic network extender'),
('it-028-standard', 'it-028', 'Standard', 145.00, 'Managed network extender'),
('it-028-premium', 'it-028', 'Premium', 220.00, 'High-performance network extender with PoE'),

('it-029-basic', 'it-029', 'Basic', 1600.00, 'Basic network security appliance'),
('it-029-standard', 'it-029', 'Standard', 2500.00, 'Advanced security appliance with UTM'),
('it-029-premium', 'it-029', 'Premium', 3800.00, 'Enterprise security appliance with AI threat detection'),

('it-030-basic', 'it-030', 'Basic', 750.00, 'Basic VPN concentrator'),
('it-030-standard', 'it-030', 'Standard', 1200.00, 'Advanced VPN concentrator with high availability'),
('it-030-premium', 'it-030', 'Premium', 1850.00, 'Enterprise VPN concentrator with global optimization'),

('it-031-basic', 'it-031', 'Basic', 320.00, 'Basic protocol converter'),
('it-031-standard', 'it-031', 'Standard', 480.00, 'Advanced protocol converter with management'),
('it-031-premium', 'it-031', 'Premium', 720.00, 'Enterprise protocol converter with redundancy'),

('it-032-basic', 'it-032', 'Basic', 180.00, 'Basic network bridge'),
('it-032-standard', 'it-032', 'Standard', 270.00, 'Managed network bridge with VLAN support'),
('it-032-premium', 'it-032', 'Premium', 410.00, 'High-performance network bridge with QoS'),

('it-033-basic', 'it-033', 'Basic', 2800.00, 'Basic network management system'),
('it-033-standard', 'it-033', 'Standard', 4200.00, 'Advanced NMS with automation'),
('it-033-premium', 'it-033', 'Premium', 6500.00, 'Enterprise NMS with AI-driven optimization');