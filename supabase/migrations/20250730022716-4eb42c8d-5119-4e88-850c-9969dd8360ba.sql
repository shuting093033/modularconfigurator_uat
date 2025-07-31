-- Add quality tiers for Security & Controls components (sec-001 to sec-025)
INSERT INTO quality_tiers (id, component_id, name, unit_cost, description) VALUES

-- sec-001: Access Control System
('sec-001-basic', 'sec-001', 'Basic', 1500.00, 'Basic card reader access control'),
('sec-001-standard', 'sec-001', 'Standard', 2500.00, 'Multi-technology access control with audit trail'),
('sec-001-premium', 'sec-001', 'Premium', 4000.00, 'Biometric access control with integration'),

-- sec-002: Surveillance Cameras
('sec-002-basic', 'sec-002', 'Basic', 400.00, 'Basic IP camera with 1080p resolution'),
('sec-002-standard', 'sec-002', 'Standard', 650.00, '4K IP camera with night vision'),
('sec-002-premium', 'sec-002', 'Premium', 1000.00, 'PTZ camera with AI analytics'),

-- sec-003: Video Management
('sec-003-basic', 'sec-003', 'Basic', 2000.00, 'Basic video management software'),
('sec-003-standard', 'sec-003', 'Standard', 3500.00, 'Advanced VMS with analytics'),
('sec-003-premium', 'sec-003', 'Premium', 6000.00, 'Enterprise VMS with AI and cloud integration'),

-- sec-004: Intrusion Detection
('sec-004-basic', 'sec-004', 'Basic', 800.00, 'Basic door and window sensors'),
('sec-004-standard', 'sec-004', 'Standard', 1300.00, 'Advanced sensors with motion detection'),
('sec-004-premium', 'sec-004', 'Premium', 2000.00, 'Intelligent sensors with AI analytics'),

-- sec-005: Motion Sensors
('sec-005-basic', 'sec-005', 'Basic', 150.00, 'Basic PIR motion sensor'),
('sec-005-standard', 'sec-005', 'Standard', 225.00, 'Dual-technology motion sensor'),
('sec-005-premium', 'sec-005', 'Premium', 350.00, 'AI-powered motion sensor with classification'),

-- sec-006: Door Sensors
('sec-006-basic', 'sec-006', 'Basic', 100.00, 'Basic magnetic door sensor'),
('sec-006-standard', 'sec-006', 'Standard', 150.00, 'Wireless door sensor with tamper detection'),
('sec-006-premium', 'sec-006', 'Premium', 225.00, 'Smart door sensor with real-time monitoring'),

-- sec-007: Glass Break Sensors
('sec-007-basic', 'sec-007', 'Basic', 120.00, 'Basic acoustic glass break sensor'),
('sec-007-standard', 'sec-007', 'Standard', 180.00, 'Dual-technology glass break sensor'),
('sec-007-premium', 'sec-007', 'Premium', 275.00, 'Advanced glass break sensor with pattern recognition'),

-- sec-008: Vibration Sensors
('sec-008-basic', 'sec-008', 'Basic', 200.00, 'Basic vibration sensor'),
('sec-008-standard', 'sec-008', 'Standard', 300.00, 'Intelligent vibration sensor with analysis'),
('sec-008-premium', 'sec-008', 'Premium', 450.00, 'Advanced vibration sensor with predictive analytics'),

-- sec-009: Security Control Panel
('sec-009-basic', 'sec-009', 'Basic', 1000.00, 'Basic security control panel'),
('sec-009-standard', 'sec-009', 'Standard', 1700.00, 'Advanced control panel with network connectivity'),
('sec-009-premium', 'sec-009', 'Premium', 2800.00, 'Enterprise control panel with redundancy'),

-- sec-010: Alarm Notification
('sec-010-basic', 'sec-010', 'Basic', 300.00, 'Basic horn and strobe notification'),
('sec-010-standard', 'sec-010', 'Standard', 500.00, 'Voice evacuation with strobe'),
('sec-010-premium', 'sec-010', 'Premium', 800.00, 'Intelligent notification with zone control'),

-- sec-011: Emergency Communication
('sec-011-basic', 'sec-011', 'Basic', 2000.00, 'Basic emergency phone system'),
('sec-011-standard', 'sec-011', 'Standard', 3500.00, 'Advanced emergency communication with paging'),
('sec-011-premium', 'sec-011', 'Premium', 6000.00, 'Integrated emergency communication platform'),

-- sec-012: Mass Notification
('sec-012-basic', 'sec-012', 'Basic', 3000.00, 'Basic mass notification speakers'),
('sec-012-standard', 'sec-012', 'Standard', 5000.00, 'Advanced notification with digital displays'),
('sec-012-premium', 'sec-012', 'Premium', 8000.00, 'Intelligent mass notification with mobile integration'),

-- sec-013: Environmental Monitoring
('sec-013-basic', 'sec-013', 'Basic', 500.00, 'Basic temperature and humidity sensors'),
('sec-013-standard', 'sec-013', 'Standard', 800.00, 'Multi-parameter environmental monitoring'),
('sec-013-premium', 'sec-013', 'Premium', 1300.00, 'Intelligent environmental monitoring with analytics'),

-- sec-014: Building Management System
('sec-014-basic', 'sec-014', 'Basic', 5000.00, 'Basic BMS with HVAC control'),
('sec-014-standard', 'sec-014', 'Standard', 8500.00, 'Advanced BMS with energy management'),
('sec-014-premium', 'sec-014', 'Premium', 15000.00, 'Intelligent BMS with AI optimization'),

-- sec-015: Control Workstations
('sec-015-basic', 'sec-015', 'Basic', 2000.00, 'Basic control workstation'),
('sec-015-standard', 'sec-015', 'Standard', 3200.00, 'Advanced workstation with multiple displays'),
('sec-015-premium', 'sec-015', 'Premium', 5000.00, 'Enterprise workstation with redundant systems'),

-- sec-016: Network Time Protocol
('sec-016-basic', 'sec-016', 'Basic', 800.00, 'Basic NTP server'),
('sec-016-standard', 'sec-016', 'Standard', 1300.00, 'Redundant NTP server with GPS'),
('sec-016-premium', 'sec-016', 'Premium', 2000.00, 'Enterprise NTP with atomic clock synchronization'),

-- sec-017: Communication Backbone
('sec-017-basic', 'sec-017', 'Basic', 12.00, 'Basic communication backbone cabling'),
('sec-017-standard', 'sec-017', 'Standard', 18.00, 'Redundant backbone with fiber'),
('sec-017-premium', 'sec-017', 'Premium', 26.00, 'High-availability backbone with diverse routing'),

-- sec-018: Industrial Ethernet
('sec-018-basic', 'sec-018', 'Basic', 8.00, 'Basic industrial Ethernet cable'),
('sec-018-standard', 'sec-018', 'Standard', 12.00, 'Shielded industrial Ethernet for harsh environments'),
('sec-018-premium', 'sec-018', 'Premium', 18.00, 'Armored industrial Ethernet with advanced protection'),

-- sec-019: Control System Integration
('sec-019-basic', 'sec-019', 'Basic', 3000.00, 'Basic system integration services'),
('sec-019-standard', 'sec-019', 'Standard', 5000.00, 'Advanced integration with testing'),
('sec-019-premium', 'sec-019', 'Premium', 8000.00, 'Complete integration with commissioning and training'),

-- sec-020 through sec-025 (additional security components)
('sec-020-basic', 'sec-020', 'Basic', 1200.00, 'Basic biometric scanner'),
('sec-020-standard', 'sec-020', 'Standard', 1900.00, 'Multi-modal biometric scanner'),
('sec-020-premium', 'sec-020', 'Premium', 2800.00, 'Enterprise biometric scanner with liveness detection'),

('sec-021-basic', 'sec-021', 'Basic', 850.00, 'Basic intercom system'),
('sec-021-standard', 'sec-021', 'Standard', 1350.00, 'IP-based intercom with video'),
('sec-021-premium', 'sec-021', 'Premium', 2000.00, 'Enterprise intercom with mobile integration'),

('sec-022-basic', 'sec-022', 'Basic', 450.00, 'Basic proximity reader'),
('sec-022-standard', 'sec-022', 'Standard', 700.00, 'Multi-technology proximity reader'),
('sec-022-premium', 'sec-022', 'Premium', 1100.00, 'Secure proximity reader with encryption'),

('sec-023-basic', 'sec-023', 'Basic', 2200.00, 'Basic turnstile'),
('sec-023-standard', 'sec-023', 'Standard', 3500.00, 'Full-height turnstile with access control'),
('sec-023-premium', 'sec-023', 'Premium', 5200.00, 'Security turnstile with biometric integration'),

('sec-024-basic', 'sec-024', 'Basic', 320.00, 'Basic security lighting'),
('sec-024-standard', 'sec-024', 'Standard', 480.00, 'Motion-activated security lighting'),
('sec-024-premium', 'sec-024', 'Premium', 720.00, 'Smart security lighting with network control'),

('sec-025-basic', 'sec-025', 'Basic', 1800.00, 'Basic security monitoring'),
('sec-025-standard', 'sec-025', 'Standard', 2800.00, 'Advanced security monitoring with analytics'),
('sec-025-premium', 'sec-025', 'Premium', 4200.00, 'AI-powered security monitoring with predictive alerts');