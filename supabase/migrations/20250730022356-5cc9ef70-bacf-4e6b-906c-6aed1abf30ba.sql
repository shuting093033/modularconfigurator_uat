-- Add quality tiers for Civil/Structural components (civil-001 to civil-034)
INSERT INTO quality_tiers (id, component_id, name, unit_cost, description) VALUES

-- civil-001: Foundation System
('civil-001-basic', 'civil-001', 'Basic', 250.00, 'Standard concrete foundation with basic reinforcement'),
('civil-001-standard', 'civil-001', 'Standard', 350.00, 'Reinforced concrete with improved load capacity'),
('civil-001-premium', 'civil-001', 'Premium', 500.00, 'High-strength concrete with advanced reinforcement'),

-- civil-002: Structural Steel
('civil-002-basic', 'civil-002', 'Basic', 2.50, 'Standard carbon steel beams and columns'),
('civil-002-standard', 'civil-002', 'Standard', 3.75, 'High-strength steel with corrosion resistance'),
('civil-002-premium', 'civil-002', 'Premium', 5.50, 'Premium alloy steel with enhanced properties'),

-- civil-003: Precast Concrete
('civil-003-basic', 'civil-003', 'Basic', 300.00, 'Standard precast concrete panels'),
('civil-003-standard', 'civil-003', 'Standard', 425.00, 'Reinforced precast with improved finish'),
('civil-003-premium', 'civil-003', 'Premium', 600.00, 'High-performance precast with architectural finish'),

-- civil-004: Metal Roofing
('civil-004-basic', 'civil-004', 'Basic', 8.00, 'Standard galvanized steel roofing'),
('civil-004-standard', 'civil-004', 'Standard', 12.00, 'Aluminum roofing with improved coatings'),
('civil-004-premium', 'civil-004', 'Premium', 18.00, 'Premium metal roofing with 50-year warranty'),

-- civil-005: Waterproofing
('civil-005-basic', 'civil-005', 'Basic', 6.00, 'Basic membrane waterproofing'),
('civil-005-standard', 'civil-005', 'Standard', 9.00, 'Modified bitumen waterproofing system'),
('civil-005-premium', 'civil-005', 'Premium', 14.00, 'Premium EPDM waterproofing with extended warranty'),

-- civil-006: Insulation System
('civil-006-basic', 'civil-006', 'Basic', 3.50, 'Standard fiberglass insulation R-19'),
('civil-006-standard', 'civil-006', 'Standard', 5.25, 'High-performance foam insulation R-25'),
('civil-006-premium', 'civil-006', 'Premium', 7.75, 'Spray foam insulation with vapor barrier R-30'),

-- civil-007: Exterior Cladding
('civil-007-basic', 'civil-007', 'Basic', 12.00, 'Standard metal panel cladding'),
('civil-007-standard', 'civil-007', 'Standard', 18.00, 'Insulated metal panel system'),
('civil-007-premium', 'civil-007', 'Premium', 26.00, 'Architectural panel system with custom finish'),

-- civil-008: Personnel Door
('civil-008-basic', 'civil-008', 'Basic', 1500.00, 'Standard hollow metal door with basic hardware'),
('civil-008-standard', 'civil-008', 'Standard', 2200.00, 'Insulated steel door with upgraded hardware'),
('civil-008-premium', 'civil-008', 'Premium', 3200.00, 'High-security door with electronic locks'),

-- civil-009: Overhead Door
('civil-009-basic', 'civil-009', 'Basic', 2500.00, 'Standard sectional overhead door'),
('civil-009-standard', 'civil-009', 'Standard', 3800.00, 'Insulated overhead door with automatic opener'),
('civil-009-premium', 'civil-009', 'Premium', 5500.00, 'High-speed industrial door with safety features'),

-- civil-010: Dock Leveler
('civil-010-basic', 'civil-010', 'Basic', 4500.00, 'Mechanical dock leveler with manual operation'),
('civil-010-standard', 'civil-010', 'Standard', 6500.00, 'Hydraulic dock leveler with push-button control'),
('civil-010-premium', 'civil-010', 'Premium', 9000.00, 'Premium hydraulic leveler with automatic operation'),

-- civil-011: Loading Dock
('civil-011-basic', 'civil-011', 'Basic', 8000.00, 'Basic concrete loading dock with steel bumpers'),
('civil-011-standard', 'civil-011', 'Standard', 12000.00, 'Reinforced dock with hydraulic leveler'),
('civil-011-premium', 'civil-011', 'Premium', 18000.00, 'Complete dock system with shelters and seals'),

-- civil-012: Security Fencing
('civil-012-basic', 'civil-012', 'Basic', 25.00, 'Standard 8-foot chain link with barbed wire'),
('civil-012-standard', 'civil-012', 'Standard', 35.00, 'Anti-climb fence with security mesh'),
('civil-012-premium', 'civil-012', 'Premium', 50.00, 'High-security fence with sensor integration'),

-- civil-013: Vehicle Gate
('civil-013-basic', 'civil-013', 'Basic', 3500.00, 'Manual swing gate with basic hardware'),
('civil-013-standard', 'civil-013', 'Standard', 5500.00, 'Automated sliding gate with access control'),
('civil-013-premium', 'civil-013', 'Premium', 8000.00, 'High-security automated gate with biometric access'),

-- civil-014: Pedestrian Gate
('civil-014-basic', 'civil-014', 'Basic', 1200.00, 'Standard swing gate with key lock'),
('civil-014-standard', 'civil-014', 'Standard', 1800.00, 'Card reader gate with electronic lock'),
('civil-014-premium', 'civil-014', 'Premium', 2800.00, 'Turnstile gate with biometric access'),

-- civil-015: Excavation
('civil-015-basic', 'civil-015', 'Basic', 15.00, 'Standard excavation with basic equipment'),
('civil-015-standard', 'civil-015', 'Standard', 22.00, 'Precision excavation with GPS guidance'),
('civil-015-premium', 'civil-015', 'Premium', 32.00, 'Specialized excavation with soil stabilization'),

-- civil-016: Backfill
('civil-016-basic', 'civil-016', 'Basic', 18.00, 'Standard backfill with granular material'),
('civil-016-standard', 'civil-016', 'Standard', 26.00, 'Engineered backfill with compaction testing'),
('civil-016-premium', 'civil-016', 'Premium', 38.00, 'Controlled low-strength material backfill'),

-- civil-017: Grading
('civil-017-basic', 'civil-017', 'Basic', 2.50, 'Basic site grading with standard tolerances'),
('civil-017-standard', 'civil-017', 'Standard', 3.75, 'Precision grading with laser control'),
('civil-017-premium', 'civil-017', 'Premium', 5.50, 'GPS-controlled grading with tight tolerances'),

-- civil-018: Paving
('civil-018-basic', 'civil-018', 'Basic', 6.00, 'Standard asphalt paving 3-inch thick'),
('civil-018-standard', 'civil-018', 'Standard', 9.00, 'Reinforced asphalt with base course'),
('civil-018-premium', 'civil-018', 'Premium', 14.00, 'Heavy-duty concrete paving for equipment loads'),

-- civil-019: Landscaping
('civil-019-basic', 'civil-019', 'Basic', 4.00, 'Basic grass seeding and basic plantings'),
('civil-019-standard', 'civil-019', 'Standard', 6.50, 'Sodding with shrubs and irrigation'),
('civil-019-premium', 'civil-019', 'Premium', 10.00, 'Complete landscape design with automated irrigation'),

-- civil-020 through civil-034 (additional civil components)
('civil-020-basic', 'civil-020', 'Basic', 35.00, 'Standard concrete barrier'),
('civil-020-standard', 'civil-020', 'Standard', 52.00, 'Reinforced concrete barrier with steel posts'),
('civil-020-premium', 'civil-020', 'Premium', 75.00, 'High-security concrete barrier with integrated lighting'),

('civil-021-basic', 'civil-021', 'Basic', 180.00, 'Basic concrete pad'),
('civil-021-standard', 'civil-021', 'Standard', 270.00, 'Reinforced concrete pad with proper drainage'),
('civil-021-premium', 'civil-021', 'Premium', 400.00, 'High-strength concrete pad with vibration isolation'),

('civil-022-basic', 'civil-022', 'Basic', 12.00, 'Standard concrete walkway'),
('civil-022-standard', 'civil-022', 'Standard', 18.00, 'Reinforced walkway with non-slip surface'),
('civil-022-premium', 'civil-022', 'Premium', 26.00, 'Decorative concrete walkway with lighting'),

('civil-023-basic', 'civil-023', 'Basic', 45.00, 'Basic drainage system'),
('civil-023-standard', 'civil-023', 'Standard', 68.00, 'Advanced drainage with filtration'),
('civil-023-premium', 'civil-023', 'Premium', 95.00, 'Smart drainage system with monitoring'),

('civil-024-basic', 'civil-024', 'Basic', 28.00, 'Standard retaining wall'),
('civil-024-standard', 'civil-024', 'Standard', 42.00, 'Engineered retaining wall with drainage'),
('civil-024-premium', 'civil-024', 'Premium', 62.00, 'Architectural retaining wall with integrated features'),

('civil-025-basic', 'civil-025', 'Basic', 85.00, 'Basic site utilities'),
('civil-025-standard', 'civil-025', 'Standard', 130.00, 'Complete utility installation'),
('civil-025-premium', 'civil-025', 'Premium', 185.00, 'Smart utility infrastructure with monitoring'),

('civil-026-basic', 'civil-026', 'Basic', 155.00, 'Standard site lighting'),
('civil-026-standard', 'civil-026', 'Standard', 235.00, 'LED lighting system with controls'),
('civil-026-premium', 'civil-026', 'Premium', 340.00, 'Smart lighting system with sensors and automation'),

('civil-027-basic', 'civil-027', 'Basic', 75.00, 'Basic signage'),
('civil-027-standard', 'civil-027', 'Standard', 115.00, 'Professional signage with lighting'),
('civil-027-premium', 'civil-027', 'Premium', 165.00, 'Digital signage with smart features'),

('civil-028-basic', 'civil-028', 'Basic', 125.00, 'Standard flagpole'),
('civil-028-standard', 'civil-028', 'Standard', 190.00, 'Commercial flagpole with lighting'),
('civil-028-premium', 'civil-028', 'Premium', 275.00, 'Premium flagpole with automated controls'),

('civil-029-basic', 'civil-029', 'Basic', 450.00, 'Basic generator pad'),
('civil-029-standard', 'civil-029', 'Standard', 675.00, 'Reinforced generator pad with utilities'),
('civil-029-premium', 'civil-029', 'Premium', 950.00, 'Complete generator foundation with isolation'),

('civil-030-basic', 'civil-030', 'Basic', 320.00, 'Standard equipment foundation'),
('civil-030-standard', 'civil-030', 'Standard', 480.00, 'Reinforced equipment foundation'),
('civil-030-premium', 'civil-030', 'Premium', 685.00, 'Precision equipment foundation with vibration control'),

('civil-031-basic', 'civil-031', 'Basic', 95.00, 'Basic site access road'),
('civil-031-standard', 'civil-031', 'Standard', 145.00, 'Improved access road with proper drainage'),
('civil-031-premium', 'civil-031', 'Premium', 205.00, 'Heavy-duty access road with traffic management'),

('civil-032-basic', 'civil-032', 'Basic', 135.00, 'Standard parking area'),
('civil-032-standard', 'civil-032', 'Standard', 200.00, 'Marked parking with proper drainage'),
('civil-032-premium', 'civil-032', 'Premium', 285.00, 'Smart parking system with monitoring'),

('civil-033-basic', 'civil-033', 'Basic', 55.00, 'Basic site security'),
('civil-033-standard', 'civil-033', 'Standard', 85.00, 'Enhanced site security with monitoring'),
('civil-033-premium', 'civil-033', 'Premium', 120.00, 'Advanced security system with AI monitoring'),

('civil-034-basic', 'civil-034', 'Basic', 225.00, 'Standard site preparation'),
('civil-034-standard', 'civil-034', 'Standard', 340.00, 'Complete site preparation with utilities'),
('civil-034-premium', 'civil-034', 'Premium', 485.00, 'Premium site preparation with smart infrastructure');