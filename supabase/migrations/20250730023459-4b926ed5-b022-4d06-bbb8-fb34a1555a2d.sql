-- Add missing quality tiers to complete 3-tier system for all components

INSERT INTO quality_tiers (id, component_id, name, unit_cost, description) VALUES
-- cable-tray-ladder-24in (missing Basic tier)
('cable-tray-ladder-24in-basic', 'cable-tray-ladder-24in', 'Basic', 45.00, 'Standard galvanized steel ladder tray, basic finish'),

-- pdu-floor-100a (missing Basic tier)
('pdu-floor-100a-basic', 'pdu-floor-100a', 'Basic', 2800.00, 'Basic floor PDU with standard monitoring'),

-- pdu-rack-basic-30a (missing Basic tier)
('pdu-rack-basic-30a-basic', 'pdu-rack-basic-30a', 'Basic', 380.00, 'Entry-level rack PDU with basic outlets'),

-- pdu-rack-monitored-30a (missing Basic tier)
('pdu-rack-monitored-30a-basic', 'pdu-rack-monitored-30a', 'Basic', 580.00, 'Basic monitored PDU with simple power monitoring'),

-- ups-single-phase-10kva (missing Basic tier)
('ups-single-phase-10kva-basic', 'ups-single-phase-10kva', 'Basic', 1800.00, 'Entry-level single phase UPS with standard battery backup'),

-- ups-three-phase-40kva (missing Basic tier)
('ups-three-phase-40kva-basic', 'ups-three-phase-40kva', 'Basic', 12000.00, 'Basic three phase UPS with standard efficiency'),

-- fire-suppression-clean-agent (missing Basic tier)
('fire-suppression-clean-agent-basic', 'fire-suppression-clean-agent', 'Basic', 8000.00, 'Basic clean agent suppression system with standard coverage'),

-- smoke-detector-aspirating (missing Basic tier)
('smoke-detector-aspirating-basic', 'smoke-detector-aspirating', 'Basic', 1200.00, 'Basic aspirating smoke detector with standard sensitivity'),

-- network-switch-48-port (missing Basic tier)
('network-switch-48-port-basic', 'network-switch-48-port', 'Basic', 800.00, 'Basic 48-port switch with standard features'),

-- server-1u-entry (missing Premium tier)
('server-1u-entry-premium', 'server-1u-entry', 'Premium', 3500.00, 'High-end 1U server with enterprise-grade components and extended warranty'),

-- server-2u-performance (missing Basic tier)
('server-2u-performance-basic', 'server-2u-performance', 'Basic', 2800.00, 'Basic 2U server with standard performance specifications'),

-- crac-unit-20-ton (missing Basic tier)
('crac-unit-20-ton-basic', 'crac-unit-20-ton', 'Basic', 15000.00, 'Basic 20-ton CRAC unit with standard efficiency'),

-- crac-unit-40-ton (missing Basic tier)
('crac-unit-40-ton-basic', 'crac-unit-40-ton', 'Basic', 28000.00, 'Basic 40-ton CRAC unit with standard cooling capacity'),

-- hot-aisle-containment (missing Basic tier)
('hot-aisle-containment-basic', 'hot-aisle-containment', 'Basic', 1800.00, 'Basic hot aisle containment with standard panels'),

-- access-control-door (missing Basic tier)
('access-control-door-basic', 'access-control-door', 'Basic', 800.00, 'Basic access control system with card reader'),

-- surveillance-camera-ip (missing Basic tier)
('surveillance-camera-ip-basic', 'surveillance-camera-ip', 'Basic', 150.00, 'Basic IP camera with standard resolution'),

-- raised-floor-24x24 (missing Basic tier)
('raised-floor-24x24-basic', 'raised-floor-24x24', 'Basic', 25.00, 'Basic raised floor tile with standard load capacity'),

-- server-rack-42u (missing Basic tier)
('server-rack-42u-basic', 'server-rack-42u', 'Basic', 800.00, 'Basic 42U server rack with standard features');