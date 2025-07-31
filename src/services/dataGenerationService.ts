import { supabase } from "@/integrations/supabase/client";

// 500 True Building Material Components for Datacenter Construction
const dataCenterComponents = {
  "Electrical Infrastructure": [
    // Conduits & Fittings (25 components)
    { id: "el-001", name: "EMT Conduit 1/2 inch", unit: "linear feet", basePrice: 3.25, laborHours: 0.15 },
    { id: "el-002", name: "EMT Conduit 3/4 inch", unit: "linear feet", basePrice: 4.50, laborHours: 0.18 },
    { id: "el-003", name: "EMT Conduit 1 inch", unit: "linear feet", basePrice: 6.75, laborHours: 0.20 },
    { id: "el-004", name: "EMT Conduit 2 inch", unit: "linear feet", basePrice: 12.25, laborHours: 0.25 },
    { id: "el-005", name: "EMT Conduit 3 inch", unit: "linear feet", basePrice: 18.50, laborHours: 0.30 },
    { id: "el-006", name: "PVC Conduit 1/2 inch", unit: "linear feet", basePrice: 2.85, laborHours: 0.12 },
    { id: "el-007", name: "PVC Conduit 3/4 inch", unit: "linear feet", basePrice: 3.95, laborHours: 0.15 },
    { id: "el-008", name: "PVC Conduit 1 inch", unit: "linear feet", basePrice: 5.25, laborHours: 0.18 },
    { id: "el-009", name: "Rigid Steel Conduit 1 inch", unit: "linear feet", basePrice: 14.75, laborHours: 0.35 },
    { id: "el-010", name: "Rigid Steel Conduit 2 inch", unit: "linear feet", basePrice: 24.50, laborHours: 0.45 },
    { id: "el-011", name: "90° Elbow 1/2 inch", unit: "each", basePrice: 2.15, laborHours: 0.10 },
    { id: "el-012", name: "90° Elbow 3/4 inch", unit: "each", basePrice: 2.85, laborHours: 0.12 },
    { id: "el-013", name: "90° Elbow 1 inch", unit: "each", basePrice: 3.75, laborHours: 0.15 },
    { id: "el-014", name: "Coupling 1/2 inch", unit: "each", basePrice: 1.25, laborHours: 0.05 },
    { id: "el-015", name: "Coupling 3/4 inch", unit: "each", basePrice: 1.65, laborHours: 0.06 },
    { id: "el-016", name: "Coupling 1 inch", unit: "each", basePrice: 2.25, laborHours: 0.08 },
    { id: "el-017", name: "Connector 1/2 inch", unit: "each", basePrice: 0.95, laborHours: 0.03 },
    { id: "el-018", name: "Connector 3/4 inch", unit: "each", basePrice: 1.35, laborHours: 0.04 },
    { id: "el-019", name: "Connector 1 inch", unit: "each", basePrice: 1.85, laborHours: 0.05 },
    { id: "el-020", name: "Bushing 1/2 inch", unit: "each", basePrice: 0.35, laborHours: 0.02 },
    { id: "el-021", name: "Bushing 3/4 inch", unit: "each", basePrice: 0.45, laborHours: 0.02 },
    { id: "el-022", name: "Locknut 1/2 inch", unit: "each", basePrice: 0.25, laborHours: 0.02 },
    { id: "el-023", name: "Locknut 3/4 inch", unit: "each", basePrice: 0.35, laborHours: 0.02 },
    { id: "el-024", name: "Conduit Strap 1/2 inch", unit: "each", basePrice: 0.75, laborHours: 0.05 },
    { id: "el-025", name: "Conduit Strap 3/4 inch", unit: "each", basePrice: 0.95, laborHours: 0.06 },

    // Wire & Cable (20 components)
    { id: "el-026", name: "THWN Wire 12 AWG", unit: "linear feet", basePrice: 0.65, laborHours: 0.03 },
    { id: "el-027", name: "THWN Wire 10 AWG", unit: "linear feet", basePrice: 0.95, laborHours: 0.04 },
    { id: "el-028", name: "THWN Wire 8 AWG", unit: "linear feet", basePrice: 1.45, laborHours: 0.05 },
    { id: "el-029", name: "THWN Wire 6 AWG", unit: "linear feet", basePrice: 2.25, laborHours: 0.06 },
    { id: "el-030", name: "THWN Wire 4 AWG", unit: "linear feet", basePrice: 3.75, laborHours: 0.08 },
    { id: "el-031", name: "XHHW Cable 2/0 AWG", unit: "linear feet", basePrice: 8.25, laborHours: 0.12 },
    { id: "el-032", name: "XHHW Cable 4/0 AWG", unit: "linear feet", basePrice: 12.50, laborHours: 0.15 },
    { id: "el-033", name: "XHHW Cable 500 MCM", unit: "linear feet", basePrice: 22.75, laborHours: 0.20 },
    { id: "el-034", name: "Control Cable 14 AWG", unit: "linear feet", basePrice: 1.85, laborHours: 0.05 },
    { id: "el-035", name: "Cat6 Network Cable", unit: "linear feet", basePrice: 0.45, laborHours: 0.03 },
    { id: "el-036", name: "Fiber Optic Cable", unit: "linear feet", basePrice: 2.25, laborHours: 0.08 },
    { id: "el-037", name: "Coax Cable RG6", unit: "linear feet", basePrice: 0.75, laborHours: 0.04 },
    { id: "el-038", name: "Cable Lug 4/0 AWG", unit: "each", basePrice: 8.50, laborHours: 0.15 },
    { id: "el-039", name: "Cable Lug 2/0 AWG", unit: "each", basePrice: 6.25, laborHours: 0.12 },
    { id: "el-040", name: "Wire Nut Small", unit: "each", basePrice: 0.15, laborHours: 0.02 },
    { id: "el-041", name: "Wire Nut Large", unit: "each", basePrice: 0.25, laborHours: 0.02 },
    { id: "el-042", name: "Cable Pulling Lubricant", unit: "gallon", basePrice: 18.50, laborHours: 0.05 },
    { id: "el-043", name: "Cable Tray 12 inch", unit: "linear feet", basePrice: 24.75, laborHours: 0.25 },
    { id: "el-044", name: "Cable Tray Support", unit: "each", basePrice: 12.50, laborHours: 0.20 },
    { id: "el-045", name: "Cable Management Panel", unit: "each", basePrice: 45.25, laborHours: 0.75 },

    // Boxes & Panels (15 components)
    { id: "el-046", name: "Junction Box 4x4", unit: "each", basePrice: 3.25, laborHours: 0.25 },
    { id: "el-047", name: "Junction Box 6x6", unit: "each", basePrice: 5.75, laborHours: 0.35 },
    { id: "el-048", name: "Outlet Box Single Gang", unit: "each", basePrice: 1.85, laborHours: 0.20 },
    { id: "el-049", name: "Outlet Box Double Gang", unit: "each", basePrice: 2.75, laborHours: 0.25 },
    { id: "el-050", name: "Panel Box 100A", unit: "each", basePrice: 125.50, laborHours: 2.5 },
    { id: "el-051", name: "Panel Box 200A", unit: "each", basePrice: 185.75, laborHours: 3.5 },
    { id: "el-052", name: "Enclosure NEMA 1", unit: "each", basePrice: 65.25, laborHours: 1.0 },
    { id: "el-053", name: "Enclosure NEMA 4", unit: "each", basePrice: 125.50, laborHours: 1.5 },
    { id: "el-054", name: "Box Cover Blank", unit: "each", basePrice: 2.25, laborHours: 0.05 },
    { id: "el-055", name: "Box Cover with Knockout", unit: "each", basePrice: 3.75, laborHours: 0.08 },
    { id: "el-056", name: "Cable Entry Gland", unit: "each", basePrice: 8.25, laborHours: 0.15 },
    { id: "el-057", name: "Knockout Plug 1/2 inch", unit: "each", basePrice: 0.35, laborHours: 0.02 },
    { id: "el-058", name: "Knockout Plug 3/4 inch", unit: "each", basePrice: 0.45, laborHours: 0.02 },
    { id: "el-059", name: "Weatherproof Cover", unit: "each", basePrice: 12.75, laborHours: 0.20 },
    { id: "el-060", name: "Panel Schedule Label", unit: "each", basePrice: 2.50, laborHours: 0.05 },

    // Breakers & Switches (20 components)
    { id: "el-061", name: "Circuit Breaker 15A Single Pole", unit: "each", basePrice: 12.50, laborHours: 0.25 },
    { id: "el-062", name: "Circuit Breaker 20A Single Pole", unit: "each", basePrice: 14.75, laborHours: 0.25 },
    { id: "el-063", name: "Circuit Breaker 30A Single Pole", unit: "each", basePrice: 18.25, laborHours: 0.30 },
    { id: "el-064", name: "Circuit Breaker 20A Double Pole", unit: "each", basePrice: 25.50, laborHours: 0.35 },
    { id: "el-065", name: "Circuit Breaker 30A Double Pole", unit: "each", basePrice: 32.75, laborHours: 0.40 },
    { id: "el-066", name: "Circuit Breaker 50A Double Pole", unit: "each", basePrice: 48.25, laborHours: 0.50 },
    { id: "el-067", name: "GFCI Breaker 20A", unit: "each", basePrice: 65.50, laborHours: 0.45 },
    { id: "el-068", name: "AFCI Breaker 20A", unit: "each", basePrice: 75.25, laborHours: 0.45 },
    { id: "el-069", name: "Disconnect Switch 30A", unit: "each", basePrice: 85.75, laborHours: 1.0 },
    { id: "el-070", name: "Disconnect Switch 60A", unit: "each", basePrice: 125.50, laborHours: 1.5 },
    { id: "el-071", name: "Contactor 30A", unit: "each", basePrice: 95.25, laborHours: 1.25 },
    { id: "el-072", name: "Contactor 60A", unit: "each", basePrice: 165.75, laborHours: 1.75 },
    { id: "el-073", name: "Motor Starter 30A", unit: "each", basePrice: 185.50, laborHours: 2.0 },
    { id: "el-074", name: "Relay 8-Pin", unit: "each", basePrice: 18.25, laborHours: 0.25 },
    { id: "el-075", name: "Relay 11-Pin", unit: "each", basePrice: 24.75, laborHours: 0.30 },
    { id: "el-076", name: "Timer Relay", unit: "each", basePrice: 65.50, laborHours: 0.75 },
    { id: "el-077", name: "Fuse 15A", unit: "each", basePrice: 2.25, laborHours: 0.05 },
    { id: "el-078", name: "Fuse 30A", unit: "each", basePrice: 4.75, laborHours: 0.08 },
    { id: "el-079", name: "Fuse Holder", unit: "each", basePrice: 8.50, laborHours: 0.15 },
    { id: "el-080", name: "Emergency Stop Switch", unit: "each", basePrice: 45.25, laborHours: 0.75 },

    // Hardware & Fasteners (15 components)
    { id: "el-081", name: "Machine Bolt 1/4-20 x 1", unit: "each", basePrice: 0.35, laborHours: 0.02 },
    { id: "el-082", name: "Machine Bolt 3/8-16 x 2", unit: "each", basePrice: 0.65, laborHours: 0.03 },
    { id: "el-083", name: "Machine Bolt 1/2-13 x 3", unit: "each", basePrice: 1.25, laborHours: 0.05 },
    { id: "el-084", name: "Hex Screw #10-24 x 1", unit: "each", basePrice: 0.15, laborHours: 0.01 },
    { id: "el-085", name: "Hex Screw #12-24 x 1.5", unit: "each", basePrice: 0.25, laborHours: 0.02 },
    { id: "el-086", name: "Concrete Anchor 1/4", unit: "each", basePrice: 0.85, laborHours: 0.08 },
    { id: "el-087", name: "Concrete Anchor 3/8", unit: "each", basePrice: 1.35, laborHours: 0.10 },
    { id: "el-088", name: "Beam Clamp 1/4-20", unit: "each", basePrice: 3.25, laborHours: 0.15 },
    { id: "el-089", name: "Beam Clamp 3/8-16", unit: "each", basePrice: 4.75, laborHours: 0.20 },
    { id: "el-090", name: "Conduit Bracket", unit: "each", basePrice: 2.85, laborHours: 0.12 },
    { id: "el-091", name: "Panel Support Bracket", unit: "each", basePrice: 12.50, laborHours: 0.50 },
    { id: "el-092", name: "Equipment Bracket", unit: "each", basePrice: 8.75, laborHours: 0.35 },
    { id: "el-093", name: "Threaded Rod 1/4-20", unit: "linear feet", basePrice: 1.85, laborHours: 0.05 },
    { id: "el-094", name: "Threaded Rod 3/8-16", unit: "linear feet", basePrice: 2.75, laborHours: 0.08 },
    { id: "el-095", name: "Unistrut Channel", unit: "linear feet", basePrice: 4.25, laborHours: 0.15 },

    // Grounding Materials (10 components)
    { id: "el-096", name: "Ground Rod 8ft Copper", unit: "each", basePrice: 85.50, laborHours: 1.5 },
    { id: "el-097", name: "Ground Rod 10ft Copper", unit: "each", basePrice: 125.75, laborHours: 2.0 },
    { id: "el-098", name: "Ground Wire #6 AWG", unit: "linear feet", basePrice: 2.85, laborHours: 0.08 },
    { id: "el-099", name: "Ground Wire #4 AWG", unit: "linear feet", basePrice: 4.25, laborHours: 0.10 },
    { id: "el-100", name: "Bonding Jumper #6 AWG", unit: "each", basePrice: 8.50, laborHours: 0.15 },
    { id: "el-101", name: "Ground Bar 12 Position", unit: "each", basePrice: 24.75, laborHours: 0.50 },
    { id: "el-102", name: "Ground Bar 20 Position", unit: "each", basePrice: 35.25, laborHours: 0.75 },
    { id: "el-103", name: "Grounding Clamp Water Pipe", unit: "each", basePrice: 12.50, laborHours: 0.25 },
    { id: "el-104", name: "Grounding Clamp Structural", unit: "each", basePrice: 18.75, laborHours: 0.35 },
    { id: "el-105", name: "Exothermic Weld Cartridge", unit: "each", basePrice: 15.25, laborHours: 0.50 },

    // Labels & Identification (10 components)
    { id: "el-106", name: "Wire Label Vinyl", unit: "each", basePrice: 0.25, laborHours: 0.02 },
    { id: "el-107", name: "Cable Label Wrap-Around", unit: "each", basePrice: 0.45, laborHours: 0.03 },
    { id: "el-108", name: "Panel Label Engraved", unit: "each", basePrice: 3.75, laborHours: 0.05 },
    { id: "el-109", name: "Conduit Marker", unit: "each", basePrice: 1.25, laborHours: 0.03 },
    { id: "el-110", name: "Safety Sign Danger", unit: "each", basePrice: 12.50, laborHours: 0.15 },
    { id: "el-111", name: "Safety Sign Warning", unit: "each", basePrice: 8.75, laborHours: 0.10 },
    { id: "el-112", name: "Arc Flash Label", unit: "each", basePrice: 4.25, laborHours: 0.05 },
    { id: "el-113", name: "Voltage Label", unit: "each", basePrice: 2.50, laborHours: 0.03 },
    { id: "el-114", name: "Equipment Tag", unit: "each", basePrice: 1.85, laborHours: 0.03 },
    { id: "el-115", name: "Phase Tape Set", unit: "each", basePrice: 6.25, laborHours: 0.08 },

    // Testing & Commissioning (10 components)
    { id: "el-116", name: "Continuity Testing", unit: "hours", basePrice: 95.00, laborHours: 1.0 },
    { id: "el-117", name: "Insulation Testing", unit: "hours", basePrice: 125.00, laborHours: 1.0 },
    { id: "el-118", name: "Ground Fault Testing", unit: "hours", basePrice: 145.00, laborHours: 1.0 },
    { id: "el-119", name: "Load Testing", unit: "hours", basePrice: 165.00, laborHours: 1.0 },
    { id: "el-120", name: "Power Quality Analysis", unit: "hours", basePrice: 185.00, laborHours: 1.0 },
    { id: "el-121", name: "Calibration Services", unit: "hours", basePrice: 145.00, laborHours: 1.0 },
    { id: "el-122", name: "Test Report Documentation", unit: "hours", basePrice: 85.00, laborHours: 1.0 },
    { id: "el-123", name: "Commissioning Checklist", unit: "hours", basePrice: 75.00, laborHours: 1.0 },
    { id: "el-124", name: "System Startup", unit: "hours", basePrice: 165.00, laborHours: 1.0 },
    { id: "el-125", name: "Performance Verification", unit: "hours", basePrice: 185.00, laborHours: 1.0 },
  ],
  
  "Mechanical Systems": [
    // Piping Materials (30 components)
    { id: "mech-001", name: "Steel Pipe 2 inch", unit: "linear feet", basePrice: 18.50, laborHours: 0.75 },
    { id: "mech-002", name: "Steel Pipe 4 inch", unit: "linear feet", basePrice: 28.75, laborHours: 1.0 },
    { id: "mech-003", name: "Steel Pipe 6 inch", unit: "linear feet", basePrice: 42.25, laborHours: 1.25 },
    { id: "mech-004", name: "Steel Pipe 8 inch", unit: "linear feet", basePrice: 58.50, laborHours: 1.5 },
    { id: "mech-005", name: "Copper Pipe 1 inch", unit: "linear feet", basePrice: 12.75, laborHours: 0.5 },
    { id: "mech-006", name: "Copper Pipe 2 inch", unit: "linear feet", basePrice: 24.50, laborHours: 0.75 },
    { id: "mech-007", name: "PVC Pipe 2 inch", unit: "linear feet", basePrice: 6.25, laborHours: 0.35 },
    { id: "mech-008", name: "PVC Pipe 4 inch", unit: "linear feet", basePrice: 12.75, laborHours: 0.5 },
    { id: "mech-009", name: "Pipe Elbow 90° 2 inch", unit: "each", basePrice: 8.50, laborHours: 0.25 },
    { id: "mech-010", name: "Pipe Elbow 90° 4 inch", unit: "each", basePrice: 18.75, laborHours: 0.35 },
    { id: "mech-011", name: "Pipe Tee 2 inch", unit: "each", basePrice: 12.50, laborHours: 0.40 },
    { id: "mech-012", name: "Pipe Tee 4 inch", unit: "each", basePrice: 24.75, laborHours: 0.60 },
    { id: "mech-013", name: "Pipe Coupling 2 inch", unit: "each", basePrice: 6.25, laborHours: 0.20 },
    { id: "mech-014", name: "Pipe Coupling 4 inch", unit: "each", basePrice: 12.50, laborHours: 0.30 },
    { id: "mech-015", name: "Pipe Flange 2 inch", unit: "each", basePrice: 28.50, laborHours: 0.75 },
    { id: "mech-016", name: "Pipe Flange 4 inch", unit: "each", basePrice: 48.75, laborHours: 1.0 },
    { id: "mech-017", name: "Flange Gasket 2 inch", unit: "each", basePrice: 3.25, laborHours: 0.10 },
    { id: "mech-018", name: "Flange Gasket 4 inch", unit: "each", basePrice: 6.50, laborHours: 0.15 },
    { id: "mech-019", name: "Flange Bolt Set 2 inch", unit: "each", basePrice: 4.75, laborHours: 0.15 },
    { id: "mech-020", name: "Flange Bolt Set 4 inch", unit: "each", basePrice: 8.25, laborHours: 0.20 },
    { id: "mech-021", name: "Pipe Hanger 2 inch", unit: "each", basePrice: 12.50, laborHours: 0.35 },
    { id: "mech-022", name: "Pipe Hanger 4 inch", unit: "each", basePrice: 18.75, laborHours: 0.50 },
    { id: "mech-023", name: "Pipe Support Clamp 2 inch", unit: "each", basePrice: 8.25, laborHours: 0.25 },
    { id: "mech-024", name: "Pipe Support Clamp 4 inch", unit: "each", basePrice: 14.50, laborHours: 0.35 },
    { id: "mech-025", name: "Pipe Wrap Insulation 2 inch", unit: "linear feet", basePrice: 4.75, laborHours: 0.15 },
    { id: "mech-026", name: "Pipe Wrap Insulation 4 inch", unit: "linear feet", basePrice: 8.50, laborHours: 0.25 },
    { id: "mech-027", name: "Pipe Cutting Oil", unit: "gallon", basePrice: 24.75, laborHours: 0.05 },
    { id: "mech-028", name: "Pipe Threading Compound", unit: "tube", basePrice: 8.25, laborHours: 0.02 },
    { id: "mech-029", name: "Welding Rod E6011", unit: "pound", basePrice: 4.50, laborHours: 0.25 },
    { id: "mech-030", name: "Welding Rod E7018", unit: "pound", basePrice: 5.25, laborHours: 0.30 },

    // Valves & Controls (25 components)
    { id: "mech-031", name: "Ball Valve 1 inch", unit: "each", basePrice: 42.50, laborHours: 0.75 },
    { id: "mech-032", name: "Ball Valve 2 inch", unit: "each", basePrice: 85.75, laborHours: 1.0 },
    { id: "mech-033", name: "Ball Valve 4 inch", unit: "each", basePrice: 165.50, laborHours: 1.5 },
    { id: "mech-034", name: "Gate Valve 2 inch", unit: "each", basePrice: 125.75, laborHours: 1.25 },
    { id: "mech-035", name: "Gate Valve 4 inch", unit: "each", basePrice: 245.50, laborHours: 1.75 },
    { id: "mech-036", name: "Check Valve 2 inch", unit: "each", basePrice: 95.25, laborHours: 1.0 },
    { id: "mech-037", name: "Check Valve 4 inch", unit: "each", basePrice: 185.75, laborHours: 1.5 },
    { id: "mech-038", name: "Control Valve 2 inch", unit: "each", basePrice: 485.50, laborHours: 2.5 },
    { id: "mech-039", name: "Control Valve 4 inch", unit: "each", basePrice: 785.25, laborHours: 3.5 },
    { id: "mech-040", name: "Butterfly Valve 6 inch", unit: "each", basePrice: 325.75, laborHours: 2.0 },
    { id: "mech-041", name: "Butterfly Valve 8 inch", unit: "each", basePrice: 485.50, laborHours: 2.5 },
    { id: "mech-042", name: "Actuator Electric 2 inch", unit: "each", basePrice: 285.50, laborHours: 2.0 },
    { id: "mech-043", name: "Actuator Pneumatic 4 inch", unit: "each", basePrice: 385.75, laborHours: 2.5 },
    { id: "mech-044", name: "Pressure Sensor", unit: "each", basePrice: 125.50, laborHours: 1.5 },
    { id: "mech-045", name: "Temperature Sensor", unit: "each", basePrice: 85.25, laborHours: 1.0 },
    { id: "mech-046", name: "Flow Sensor", unit: "each", basePrice: 285.75, laborHours: 2.0 },
    { id: "mech-047", name: "Thermostat Digital", unit: "each", basePrice: 165.50, laborHours: 1.5 },
    { id: "mech-048", name: "Pressure Gauge 2 inch", unit: "each", basePrice: 45.25, laborHours: 0.5 },
    { id: "mech-049", name: "Temperature Gauge", unit: "each", basePrice: 38.75, laborHours: 0.5 },
    { id: "mech-050", name: "Flow Meter", unit: "each", basePrice: 485.50, laborHours: 3.0 },
    { id: "mech-051", name: "Pressure Relief Valve", unit: "each", basePrice: 125.75, laborHours: 1.5 },
    { id: "mech-052", name: "Strainer Y-Type 2 inch", unit: "each", basePrice: 85.50, laborHours: 1.0 },
    { id: "mech-053", name: "Strainer Y-Type 4 inch", unit: "each", basePrice: 145.25, laborHours: 1.5 },
    { id: "mech-054", name: "Balancing Valve 2 inch", unit: "each", basePrice: 185.75, laborHours: 1.5 },
    { id: "mech-055", name: "Isolation Valve 6 inch", unit: "each", basePrice: 385.50, laborHours: 2.5 },

    // Insulation Materials (15 components)
    { id: "mech-056", name: "Pipe Insulation Fiberglass 1 inch", unit: "linear feet", basePrice: 3.25, laborHours: 0.12 },
    { id: "mech-057", name: "Pipe Insulation Fiberglass 2 inch", unit: "linear feet", basePrice: 4.75, laborHours: 0.15 },
    { id: "mech-058", name: "Pipe Insulation Foam 1 inch", unit: "linear feet", basePrice: 2.85, laborHours: 0.10 },
    { id: "mech-059", name: "Pipe Insulation Foam 2 inch", unit: "linear feet", basePrice: 4.25, laborHours: 0.12 },
    { id: "mech-060", name: "Duct Insulation R-6", unit: "square feet", basePrice: 1.85, laborHours: 0.08 },
    { id: "mech-061", name: "Duct Insulation R-8", unit: "square feet", basePrice: 2.45, laborHours: 0.10 },
    { id: "mech-062", name: "Vapor Barrier 6 mil", unit: "square feet", basePrice: 0.85, laborHours: 0.05 },
    { id: "mech-063", name: "Vapor Barrier 10 mil", unit: "square feet", basePrice: 1.25, laborHours: 0.06 },
    { id: "mech-064", name: "Insulation Adhesive", unit: "gallon", basePrice: 24.75, laborHours: 0.05 },
    { id: "mech-065", name: "Insulation Tape", unit: "roll", basePrice: 8.50, laborHours: 0.03 },
    { id: "mech-066", name: "Insulation Jacket Aluminum", unit: "square feet", basePrice: 3.75, laborHours: 0.10 },
    { id: "mech-067", name: "Insulation Jacket PVC", unit: "square feet", basePrice: 2.85, laborHours: 0.08 },
    { id: "mech-068", name: "Insulation Band", unit: "each", basePrice: 1.45, laborHours: 0.05 },
    { id: "mech-069", name: "Insulation Wire", unit: "linear feet", basePrice: 0.25, laborHours: 0.02 },
    { id: "mech-070", name: "Weather Barrier Tape", unit: "roll", basePrice: 12.50, laborHours: 0.05 },

    // HVAC Ductwork (20 components)
    { id: "mech-071", name: "Sheet Metal Duct 12x12", unit: "linear feet", basePrice: 18.50, laborHours: 0.75 },
    { id: "mech-072", name: "Sheet Metal Duct 18x18", unit: "linear feet", basePrice: 24.75, laborHours: 1.0 },
    { id: "mech-073", name: "Sheet Metal Duct 24x24", unit: "linear feet", basePrice: 32.50, laborHours: 1.25 },
    { id: "mech-074", name: "Duct Elbow 90° 12x12", unit: "each", basePrice: 28.75, laborHours: 0.75 },
    { id: "mech-075", name: "Duct Elbow 90° 18x18", unit: "each", basePrice: 38.50, laborHours: 1.0 },
    { id: "mech-076", name: "Duct Tee 12x12", unit: "each", basePrice: 42.25, laborHours: 1.25 },
    { id: "mech-077", name: "Duct Tee 18x18", unit: "each", basePrice: 58.75, laborHours: 1.5 },
    { id: "mech-078", name: "Duct Reducer 18x12", unit: "each", basePrice: 24.50, laborHours: 0.75 },
    { id: "mech-079", name: "Duct Reducer 24x18", unit: "each", basePrice: 32.75, laborHours: 1.0 },
    { id: "mech-080", name: "Damper Volume Control", unit: "each", basePrice: 125.50, laborHours: 2.0 },
    { id: "mech-081", name: "Damper Fire Smoke", unit: "each", basePrice: 285.75, laborHours: 3.0 },
    { id: "mech-082", name: "Diffuser Ceiling 12x12", unit: "each", basePrice: 45.25, laborHours: 1.0 },
    { id: "mech-083", name: "Diffuser Ceiling 18x18", unit: "each", basePrice: 62.50, laborHours: 1.25 },
    { id: "mech-084", name: "Grille Return Air 12x12", unit: "each", basePrice: 32.75, laborHours: 0.75 },
    { id: "mech-085", name: "Grille Return Air 18x18", unit: "each", basePrice: 45.50, laborHours: 1.0 },
    { id: "mech-086", name: "Register Floor 4x12", unit: "each", basePrice: 24.75, laborHours: 0.5 },
    { id: "mech-087", name: "Register Wall 6x12", unit: "each", basePrice: 28.50, laborHours: 0.75 },
    { id: "mech-088", name: "Duct Hanger", unit: "each", basePrice: 8.25, laborHours: 0.25 },
    { id: "mech-089", name: "Duct Support Bracket", unit: "each", basePrice: 12.75, laborHours: 0.35 },
    { id: "mech-090", name: "Duct Sealant", unit: "tube", basePrice: 6.50, laborHours: 0.05 },

    // Pumps & Motors (15 components)
    { id: "mech-091", name: "Centrifugal Pump 5 HP", unit: "each", basePrice: 2850.00, laborHours: 12.0 },
    { id: "mech-092", name: "Centrifugal Pump 10 HP", unit: "each", basePrice: 4250.00, laborHours: 16.0 },
    { id: "mech-093", name: "Centrifugal Pump 25 HP", unit: "each", basePrice: 7850.00, laborHours: 24.0 },
    { id: "mech-094", name: "Motor 5 HP 3-Phase", unit: "each", basePrice: 1850.00, laborHours: 8.0 },
    { id: "mech-095", name: "Motor 10 HP 3-Phase", unit: "each", basePrice: 2650.00, laborHours: 12.0 },
    { id: "mech-096", name: "Motor 25 HP 3-Phase", unit: "each", basePrice: 4850.00, laborHours: 16.0 },
    { id: "mech-097", name: "Coupling Flexible", unit: "each", basePrice: 285.50, laborHours: 2.0 },
    { id: "mech-098", name: "Pump Base Grouted", unit: "each", basePrice: 485.75, laborHours: 4.0 },
    { id: "mech-099", name: "Mechanical Seal", unit: "each", basePrice: 185.50, laborHours: 3.0 },
    { id: "mech-100", name: "Bearing Set", unit: "each", basePrice: 125.75, laborHours: 2.0 },
    { id: "mech-101", name: "Impeller", unit: "each", basePrice: 385.50, laborHours: 4.0 },
    { id: "mech-102", name: "Shaft", unit: "each", basePrice: 285.75, laborHours: 3.0 },
    { id: "mech-103", name: "Gasket Set", unit: "each", basePrice: 45.25, laborHours: 0.5 },
    { id: "mech-104", name: "Pump Lubricant", unit: "gallon", basePrice: 24.75, laborHours: 0.25 },
    { id: "mech-105", name: "Vibration Pad", unit: "each", basePrice: 65.50, laborHours: 1.0 },

    // Fire Protection Materials (10 components)
    { id: "mech-106", name: "Sprinkler Head Pendant", unit: "each", basePrice: 12.50, laborHours: 0.5 },
    { id: "mech-107", name: "Sprinkler Head Upright", unit: "each", basePrice: 14.75, laborHours: 0.5 },
    { id: "mech-108", name: "Sprinkler Pipe 2 inch", unit: "linear feet", basePrice: 15.25, laborHours: 0.75 },
    { id: "mech-109", name: "Sprinkler Pipe 4 inch", unit: "linear feet", basePrice: 24.50, laborHours: 1.0 },
    { id: "mech-110", name: "Sprinkler Fitting Tee", unit: "each", basePrice: 18.75, laborHours: 0.5 },
    { id: "mech-111", name: "Sprinkler Hanger", unit: "each", basePrice: 8.25, laborHours: 0.25 },
    { id: "mech-112", name: "Flow Switch", unit: "each", basePrice: 185.50, laborHours: 2.0 },
    { id: "mech-113", name: "Pressure Switch", unit: "each", basePrice: 125.75, laborHours: 1.5 },
    { id: "mech-114", name: "Fire Alarm Horn", unit: "each", basePrice: 65.25, laborHours: 1.0 },
    { id: "mech-115", name: "Fire Alarm Strobe", unit: "each", basePrice: 85.75, laborHours: 1.5 },

    // Hardware & Fasteners (10 components)
    { id: "mech-116", name: "Hex Bolt 1/2-13 x 2", unit: "each", basePrice: 0.85, laborHours: 0.03 },
    { id: "mech-117", name: "Hex Bolt 5/8-11 x 3", unit: "each", basePrice: 1.45, laborHours: 0.05 },
    { id: "mech-118", name: "Carriage Bolt 3/8-16 x 2", unit: "each", basePrice: 0.65, laborHours: 0.03 },
    { id: "mech-119", name: "Socket Screw 1/4-20 x 1", unit: "each", basePrice: 0.25, laborHours: 0.02 },
    { id: "mech-120", name: "Lag Screw 1/2 x 4", unit: "each", basePrice: 2.25, laborHours: 0.08 },
    { id: "mech-121", name: "Anchor Bolt 5/8 x 8", unit: "each", basePrice: 3.75, laborHours: 0.15 },
    { id: "mech-122", name: "U-Bolt 1/2 inch", unit: "each", basePrice: 4.25, laborHours: 0.10 },
    { id: "mech-123", name: "Pipe Clamp 2 inch", unit: "each", basePrice: 6.50, laborHours: 0.15 },
    { id: "mech-124", name: "Equipment Bracket Heavy", unit: "each", basePrice: 18.75, laborHours: 0.75 },
    { id: "mech-125", name: "Anti-Vibration Mount", unit: "each", basePrice: 25.50, laborHours: 0.50 },
  ],

  "Site Development": [
    // Excavation & Earthwork (20 components)
    { id: "site-001", name: "Excavation Common Earth", unit: "cubic yards", basePrice: 8.50, laborHours: 0.25 },
    { id: "site-002", name: "Excavation Rock", unit: "cubic yards", basePrice: 24.75, laborHours: 0.75 },
    { id: "site-003", name: "Backfill Compacted", unit: "cubic yards", basePrice: 12.25, laborHours: 0.35 },
    { id: "site-004", name: "Select Fill Granular", unit: "cubic yards", basePrice: 18.50, laborHours: 0.15 },
    { id: "site-005", name: "Grading Fine", unit: "square yards", basePrice: 2.85, laborHours: 0.08 },
    { id: "site-006", name: "Grading Rough", unit: "square yards", basePrice: 1.75, laborHours: 0.05 },
    { id: "site-007", name: "Compaction Test", unit: "each", basePrice: 125.00, laborHours: 2.0 },
    { id: "site-008", name: "Soil Stabilization Lime", unit: "square yards", basePrice: 4.25, laborHours: 0.10 },
    { id: "site-009", name: "Geotextile Fabric", unit: "square yards", basePrice: 2.15, laborHours: 0.05 },
    { id: "site-010", name: "French Drain", unit: "linear feet", basePrice: 18.75, laborHours: 0.75 },
    { id: "site-011", name: "Trenching 2ft Deep", unit: "linear feet", basePrice: 6.50, laborHours: 0.25 },
    { id: "site-012", name: "Trenching 4ft Deep", unit: "linear feet", basePrice: 12.75, laborHours: 0.50 },
    { id: "site-013", name: "Dewatering Wellpoint", unit: "each", basePrice: 285.50, laborHours: 4.0 },
    { id: "site-014", name: "Erosion Control Blanket", unit: "square yards", basePrice: 3.25, laborHours: 0.08 },
    { id: "site-015", name: "Silt Fence", unit: "linear feet", basePrice: 4.75, laborHours: 0.12 },
    { id: "site-016", name: "Temporary Roadway", unit: "square yards", basePrice: 8.50, laborHours: 0.20 },
    { id: "site-017", name: "Site Access Matting", unit: "square feet", basePrice: 2.85, laborHours: 0.05 },
    { id: "site-018", name: "Surveying Stake", unit: "each", basePrice: 3.25, laborHours: 0.15 },
    { id: "site-019", name: "Survey Monument", unit: "each", basePrice: 125.50, laborHours: 2.0 },
    { id: "site-020", name: "As-Built Survey", unit: "hours", basePrice: 95.00, laborHours: 1.0 },

    // Concrete Materials (25 components)
    { id: "site-021", name: "Portland Cement Type I", unit: "tons", basePrice: 185.50, laborHours: 0.25 },
    { id: "site-022", name: "Portland Cement Type III", unit: "tons", basePrice: 225.75, laborHours: 0.25 },
    { id: "site-023", name: "Aggregate 3/4 inch", unit: "tons", basePrice: 28.50, laborHours: 0.10 },
    { id: "site-024", name: "Aggregate 1/2 inch", unit: "tons", basePrice: 32.75, laborHours: 0.10 },
    { id: "site-025", name: "Sand Concrete", unit: "tons", basePrice: 24.25, laborHours: 0.08 },
    { id: "site-026", name: "Rebar #4", unit: "tons", basePrice: 1850.00, laborHours: 16.0 },
    { id: "site-027", name: "Rebar #5", unit: "tons", basePrice: 1750.00, laborHours: 14.0 },
    { id: "site-028", name: "Rebar #6", unit: "tons", basePrice: 1650.00, laborHours: 12.0 },
    { id: "site-029", name: "Welded Wire Mesh 6x6", unit: "square feet", basePrice: 1.85, laborHours: 0.05 },
    { id: "site-030", name: "Concrete Form Plywood", unit: "square feet", basePrice: 3.25, laborHours: 0.15 },
    { id: "site-031", name: "Concrete Form Lumber 2x8", unit: "linear feet", basePrice: 4.75, laborHours: 0.10 },
    { id: "site-032", name: "Form Release Agent", unit: "gallon", basePrice: 18.50, laborHours: 0.02 },
    { id: "site-033", name: "Concrete Curing Compound", unit: "gallon", basePrice: 24.75, laborHours: 0.05 },
    { id: "site-034", name: "Expansion Joint Material", unit: "linear feet", basePrice: 6.25, laborHours: 0.15 },
    { id: "site-035", name: "Concrete Sealer", unit: "gallon", basePrice: 32.50, laborHours: 0.08 },
    { id: "site-036", name: "Concrete Admixture", unit: "gallon", basePrice: 15.75, laborHours: 0.02 },
    { id: "site-037", name: "Vapor Barrier 6 mil", unit: "square feet", basePrice: 0.45, laborHours: 0.02 },
    { id: "site-038", name: "Concrete Anchor Bolts", unit: "each", basePrice: 8.25, laborHours: 0.25 },
    { id: "site-039", name: "Grout Non-Shrink", unit: "bags", basePrice: 18.75, laborHours: 0.50 },
    { id: "site-040", name: "Concrete Crack Repair", unit: "linear feet", basePrice: 12.50, laborHours: 0.75 },
    { id: "site-041", name: "Concrete Testing Cylinder", unit: "each", basePrice: 8.50, laborHours: 0.25 },
    { id: "site-042", name: "Concrete Placement Labor", unit: "cubic yards", basePrice: 45.00, laborHours: 2.0 },
    { id: "site-043", name: "Concrete Finishing", unit: "square feet", basePrice: 2.85, laborHours: 0.08 },
    { id: "site-044", name: "Concrete Sawcut", unit: "linear feet", basePrice: 4.25, laborHours: 0.15 },
    { id: "site-045", name: "Concrete Removal", unit: "cubic yards", basePrice: 35.50, laborHours: 1.5 },

    // Utilities (25 components)
    { id: "site-046", name: "Water Line PVC 6 inch", unit: "linear feet", basePrice: 18.75, laborHours: 0.75 },
    { id: "site-047", name: "Water Line PVC 8 inch", unit: "linear feet", basePrice: 28.50, laborHours: 1.0 },
    { id: "site-048", name: "Sewer Pipe PVC 8 inch", unit: "linear feet", basePrice: 24.75, laborHours: 0.85 },
    { id: "site-049", name: "Sewer Pipe PVC 12 inch", unit: "linear feet", basePrice: 38.25, laborHours: 1.25 },
    { id: "site-050", name: "Storm Pipe 18 inch", unit: "linear feet", basePrice: 65.50, laborHours: 1.75 },
    { id: "site-051", name: "Storm Pipe 24 inch", unit: "linear feet", basePrice: 85.75, laborHours: 2.25 },
    { id: "site-052", name: "Electrical Conduit 4 inch", unit: "linear feet", basePrice: 12.50, laborHours: 0.50 },
    { id: "site-053", name: "Gas Line Steel 2 inch", unit: "linear feet", basePrice: 32.75, laborHours: 1.25 },
    { id: "site-054", name: "Gas Line Steel 4 inch", unit: "linear feet", basePrice: 58.25, laborHours: 2.0 },
    { id: "site-055", name: "Manhole Standard", unit: "each", basePrice: 2850.00, laborHours: 24.0 },
    { id: "site-056", name: "Manhole Deep", unit: "each", basePrice: 4250.00, laborHours: 32.0 },
    { id: "site-057", name: "Catch Basin", unit: "each", basePrice: 1850.00, laborHours: 16.0 },
    { id: "site-058", name: "Water Meter 2 inch", unit: "each", basePrice: 485.50, laborHours: 4.0 },
    { id: "site-059", name: "Water Valve 6 inch", unit: "each", basePrice: 285.75, laborHours: 3.0 },
    { id: "site-060", name: "Fire Hydrant", unit: "each", basePrice: 2450.00, laborHours: 12.0 },
    { id: "site-061", name: "Utility Pole", unit: "each", basePrice: 1250.00, laborHours: 8.0 },
    { id: "site-062", name: "Transformer Pad", unit: "each", basePrice: 850.00, laborHours: 6.0 },
    { id: "site-063", name: "Junction Box Underground", unit: "each", basePrice: 125.50, laborHours: 2.0 },
    { id: "site-064", name: "Utility Tracer Wire", unit: "linear feet", basePrice: 0.85, laborHours: 0.02 },
    { id: "site-065", name: "Utility Marking Tape", unit: "linear feet", basePrice: 0.25, laborHours: 0.01 },
    { id: "site-066", name: "Bedding Sand", unit: "tons", basePrice: 28.50, laborHours: 0.15 },
    { id: "site-067", name: "Pipe Bedding Stone", unit: "tons", basePrice: 32.75, laborHours: 0.20 },
    { id: "site-068", name: "Utility Crossing Sleeve", unit: "linear feet", basePrice: 45.25, laborHours: 1.5 },
    { id: "site-069", name: "Thrust Block Concrete", unit: "cubic yards", basePrice: 185.50, laborHours: 3.0 },
    { id: "site-070", name: "Utility As-Built", unit: "linear feet", basePrice: 2.85, laborHours: 0.05 },

    // Paving & Surfaces (20 components)
    { id: "site-071", name: "Asphalt Binder Course", unit: "tons", basePrice: 125.50, laborHours: 0.75 },
    { id: "site-072", name: "Asphalt Surface Course", unit: "tons", basePrice: 135.75, laborHours: 0.85 },
    { id: "site-073", name: "Concrete Pavement 6 inch", unit: "square yards", basePrice: 45.25, laborHours: 1.5 },
    { id: "site-074", name: "Concrete Pavement 8 inch", unit: "square yards", basePrice: 58.75, laborHours: 2.0 },
    { id: "site-075", name: "Base Course Aggregate", unit: "tons", basePrice: 28.50, laborHours: 0.25 },
    { id: "site-076", name: "Subbase Course", unit: "tons", basePrice: 24.75, laborHours: 0.20 },
    { id: "site-077", name: "Pavement Striping", unit: "linear feet", basePrice: 0.85, laborHours: 0.02 },
    { id: "site-078", name: "Pavement Marking Symbols", unit: "each", basePrice: 25.50, laborHours: 0.25 },
    { id: "site-079", name: "Asphalt Sealer", unit: "gallon", basePrice: 18.75, laborHours: 0.05 },
    { id: "site-080", name: "Crack Sealer", unit: "linear feet", basePrice: 2.25, laborHours: 0.08 },
    { id: "site-081", name: "Joint Sealer", unit: "linear feet", basePrice: 3.75, laborHours: 0.12 },
    { id: "site-082", name: "Pavement Saw Cut", unit: "linear feet", basePrice: 4.25, laborHours: 0.15 },
    { id: "site-083", name: "Pavement Removal", unit: "square yards", basePrice: 12.50, laborHours: 0.75 },
    { id: "site-084", name: "Curb and Gutter", unit: "linear feet", basePrice: 18.75, laborHours: 0.85 },
    { id: "site-085", name: "Sidewalk 4 inch", unit: "square feet", basePrice: 6.25, laborHours: 0.25 },
    { id: "site-086", name: "Sidewalk 6 inch", unit: "square feet", basePrice: 8.50, laborHours: 0.35 },
    { id: "site-087", name: "Wheel Stops", unit: "each", basePrice: 65.50, laborHours: 1.0 },
    { id: "site-088", name: "Speed Bumps", unit: "linear feet", basePrice: 28.75, laborHours: 0.75 },
    { id: "site-089", name: "Pavement Patching", unit: "square feet", basePrice: 8.25, laborHours: 0.50 },
    { id: "site-090", name: "Traffic Control Setup", unit: "hours", basePrice: 85.00, laborHours: 1.0 },

    // Landscaping (15 components)
    { id: "site-091", name: "Topsoil", unit: "cubic yards", basePrice: 35.50, laborHours: 0.25 },
    { id: "site-092", name: "Seed Grass", unit: "pounds", basePrice: 4.25, laborHours: 0.05 },
    { id: "site-093", name: "Sod Installation", unit: "square feet", basePrice: 1.85, laborHours: 0.08 },
    { id: "site-094", name: "Mulch Hardwood", unit: "cubic yards", basePrice: 28.50, laborHours: 0.50 },
    { id: "site-095", name: "Shrubs Small", unit: "each", basePrice: 18.75, laborHours: 0.75 },
    { id: "site-096", name: "Shrubs Large", unit: "each", basePrice: 45.25, laborHours: 1.5 },
    { id: "site-097", name: "Trees Deciduous 2 inch", unit: "each", basePrice: 185.50, laborHours: 3.0 },
    { id: "site-098", name: "Trees Evergreen 6 ft", unit: "each", basePrice: 125.75, laborHours: 2.5 },
    { id: "site-099", name: "Irrigation Sprinkler Head", unit: "each", basePrice: 12.50, laborHours: 0.75 },
    { id: "site-100", name: "Irrigation Pipe 1 inch", unit: "linear feet", basePrice: 2.85, laborHours: 0.15 },
    { id: "site-101", name: "Irrigation Controller", unit: "each", basePrice: 485.50, laborHours: 4.0 },
    { id: "site-102", name: "Drainage French Drain", unit: "linear feet", basePrice: 18.75, laborHours: 1.0 },
    { id: "site-103", name: "Retaining Wall Block", unit: "square feet", basePrice: 24.75, laborHours: 1.25 },
    { id: "site-104", name: "Landscape Fabric", unit: "square feet", basePrice: 0.85, laborHours: 0.03 },
    { id: "site-105", name: "Fertilizer Organic", unit: "bags", basePrice: 15.25, laborHours: 0.25 },

    // Site Furnishings (10 components)
    { id: "site-106", name: "Chain Link Fence 6 ft", unit: "linear feet", basePrice: 18.75, laborHours: 0.75 },
    { id: "site-107", name: "Security Fence 8 ft", unit: "linear feet", basePrice: 32.50, laborHours: 1.25 },
    { id: "site-108", name: "Gate Chain Link 12 ft", unit: "each", basePrice: 485.50, laborHours: 4.0 },
    { id: "site-109", name: "Gate Security 12 ft", unit: "each", basePrice: 1250.00, laborHours: 8.0 },
    { id: "site-110", name: "Site Lighting Pole", unit: "each", basePrice: 1850.00, laborHours: 8.0 },
    { id: "site-111", name: "Site Lighting LED", unit: "each", basePrice: 485.50, laborHours: 3.0 },
    { id: "site-112", name: "Sign Post", unit: "each", basePrice: 85.50, laborHours: 1.5 },
    { id: "site-113", name: "Identification Sign", unit: "each", basePrice: 125.75, laborHours: 1.0 },
    { id: "site-114", name: "Parking Bumper", unit: "each", basePrice: 65.25, laborHours: 1.0 },
    { id: "site-115", name: "Bollard Removable", unit: "each", basePrice: 285.50, laborHours: 2.0 },

    // Drainage (10 components)
    { id: "site-116", name: "Catch Basin Grate", unit: "each", basePrice: 185.50, laborHours: 1.0 },
    { id: "site-117", name: "Storm Drain Inlet", unit: "each", basePrice: 285.75, laborHours: 2.0 },
    { id: "site-118", name: "Area Drain", unit: "each", basePrice: 85.25, laborHours: 1.5 },
    { id: "site-119", name: "French Drain Pipe", unit: "linear feet", basePrice: 12.50, laborHours: 0.50 },
    { id: "site-120", name: "Drainage Stone", unit: "tons", basePrice: 35.75, laborHours: 0.25 },
    { id: "site-121", name: "Retention Pond Liner", unit: "square feet", basePrice: 3.25, laborHours: 0.15 },
    { id: "site-122", name: "Culvert Pipe 18 inch", unit: "linear feet", basePrice: 58.50, laborHours: 1.5 },
    { id: "site-123", name: "Headwall Concrete", unit: "each", basePrice: 485.50, laborHours: 8.0 },
    { id: "site-124", name: "Riprap Stone", unit: "tons", basePrice: 45.25, laborHours: 1.0 },
    { id: "site-125", name: "Drainage Swale", unit: "linear feet", basePrice: 8.50, laborHours: 0.35 },
  ],

  "Building Shell": [
    // Foundation Materials (25 components)
    { id: "shell-001", name: "Concrete Mix 3000 PSI", unit: "cubic yards", basePrice: 125.50, laborHours: 1.5 },
    { id: "shell-002", name: "Concrete Mix 4000 PSI", unit: "cubic yards", basePrice: 145.75, laborHours: 1.5 },
    { id: "shell-003", name: "Concrete Mix 5000 PSI", unit: "cubic yards", basePrice: 165.25, laborHours: 1.75 },
    { id: "shell-004", name: "Foundation Rebar #4", unit: "tons", basePrice: 1850.00, laborHours: 16.0 },
    { id: "shell-005", name: "Foundation Rebar #6", unit: "tons", basePrice: 1750.00, laborHours: 14.0 },
    { id: "shell-006", name: "Foundation Rebar #8", unit: "tons", basePrice: 1650.00, laborHours: 12.0 },
    { id: "shell-007", name: "Foundation Forms Plywood", unit: "square feet", basePrice: 4.25, laborHours: 0.20 },
    { id: "shell-008", name: "Foundation Forms Steel", unit: "square feet", basePrice: 8.75, laborHours: 0.15 },
    { id: "shell-009", name: "Waterproofing Membrane", unit: "square feet", basePrice: 3.85, laborHours: 0.12 },
    { id: "shell-010", name: "Waterproofing Liquid", unit: "gallon", basePrice: 28.50, laborHours: 0.08 },
    { id: "shell-011", name: "Vapor Barrier 10 mil", unit: "square feet", basePrice: 0.85, laborHours: 0.03 },
    { id: "shell-012", name: "Vapor Barrier 20 mil", unit: "square feet", basePrice: 1.45, laborHours: 0.04 },
    { id: "shell-013", name: "Foundation Anchor Bolts", unit: "each", basePrice: 12.50, laborHours: 0.35 },
    { id: "shell-014", name: "Foundation Dowels", unit: "each", basePrice: 8.25, laborHours: 0.25 },
    { id: "shell-015", name: "Footing Drain Pipe", unit: "linear feet", basePrice: 8.75, laborHours: 0.35 },
    { id: "shell-016", name: "Drainage Stone", unit: "tons", basePrice: 32.50, laborHours: 0.25 },
    { id: "shell-017", name: "Insulation Board 2 inch", unit: "square feet", basePrice: 2.85, laborHours: 0.08 },
    { id: "shell-018", name: "Insulation Board 4 inch", unit: "square feet", basePrice: 4.75, laborHours: 0.10 },
    { id: "shell-019", name: "Foundation Sealant", unit: "tube", basePrice: 8.50, laborHours: 0.05 },
    { id: "shell-020", name: "Expansion Joint Foam", unit: "linear feet", basePrice: 3.25, laborHours: 0.08 },
    { id: "shell-021", name: "Foundation Coating", unit: "gallon", basePrice: 24.75, laborHours: 0.10 },
    { id: "shell-022", name: "Termite Treatment", unit: "linear feet", basePrice: 2.85, laborHours: 0.05 },
    { id: "shell-023", name: "Foundation Repair Crack", unit: "linear feet", basePrice: 18.75, laborHours: 1.0 },
    { id: "shell-024", name: "Underpinning Steel", unit: "linear feet", basePrice: 125.50, laborHours: 4.0 },
    { id: "shell-025", name: "Foundation Testing", unit: "each", basePrice: 285.50, laborHours: 4.0 },

    // Structural Steel (20 components)
    { id: "shell-026", name: "Steel Beam W12x26", unit: "linear feet", basePrice: 45.25, laborHours: 0.75 },
    { id: "shell-027", name: "Steel Beam W16x31", unit: "linear feet", basePrice: 58.75, laborHours: 1.0 },
    { id: "shell-028", name: "Steel Beam W18x40", unit: "linear feet", basePrice: 72.50, laborHours: 1.25 },
    { id: "shell-029", name: "Steel Column W8x31", unit: "linear feet", basePrice: 38.75, laborHours: 0.85 },
    { id: "shell-030", name: "Steel Column W10x39", unit: "linear feet", basePrice: 48.25, laborHours: 1.0 },
    { id: "shell-031", name: "Steel Column W12x53", unit: "linear feet", basePrice: 62.75, laborHours: 1.25 },
    { id: "shell-032", name: "Steel Joist 16K4", unit: "linear feet", basePrice: 18.50, laborHours: 0.50 },
    { id: "shell-033", name: "Steel Joist 20K5", unit: "linear feet", basePrice: 24.75, laborHours: 0.65 },
    { id: "shell-034", name: "Steel Deck 20 Gauge", unit: "square feet", basePrice: 4.25, laborHours: 0.15 },
    { id: "shell-035", name: "Steel Deck 18 Gauge", unit: "square feet", basePrice: 5.75, laborHours: 0.18 },
    { id: "shell-036", name: "Structural Bolts A325", unit: "each", basePrice: 2.85, laborHours: 0.15 },
    { id: "shell-037", name: "Structural Bolts A490", unit: "each", basePrice: 4.25, laborHours: 0.18 },
    { id: "shell-038", name: "Welding Rod E7018", unit: "pound", basePrice: 4.75, laborHours: 0.35 },
    { id: "shell-039", name: "Welding Wire ER70S-6", unit: "pound", basePrice: 3.85, laborHours: 0.25 },
    { id: "shell-040", name: "Steel Primer", unit: "gallon", basePrice: 32.50, laborHours: 0.25 },
    { id: "shell-041", name: "Steel Paint Finish", unit: "gallon", basePrice: 38.75, laborHours: 0.35 },
    { id: "shell-042", name: "Fire Protection Coating", unit: "square feet", basePrice: 2.85, laborHours: 0.12 },
    { id: "shell-043", name: "Steel Connection Plate", unit: "pound", basePrice: 3.25, laborHours: 0.25 },
    { id: "shell-044", name: "Base Plate", unit: "pound", basePrice: 4.75, laborHours: 0.50 },
    { id: "shell-045", name: "Steel Erection Labor", unit: "tons", basePrice: 485.50, laborHours: 16.0 },

    // Masonry Materials (20 components)
    { id: "shell-046", name: "CMU Block 8 inch", unit: "each", basePrice: 3.25, laborHours: 0.25 },
    { id: "shell-047", name: "CMU Block 12 inch", unit: "each", basePrice: 4.75, laborHours: 0.35 },
    { id: "shell-048", name: "CMU Block Split Face", unit: "each", basePrice: 5.85, laborHours: 0.40 },
    { id: "shell-049", name: "Mortar Type N", unit: "bags", basePrice: 8.50, laborHours: 0.25 },
    { id: "shell-050", name: "Mortar Type S", unit: "bags", basePrice: 9.25, laborHours: 0.25 },
    { id: "shell-051", name: "Grout Fine", unit: "bags", basePrice: 12.50, laborHours: 0.35 },
    { id: "shell-052", name: "Grout Coarse", unit: "bags", basePrice: 11.75, laborHours: 0.30 },
    { id: "shell-053", name: "Masonry Rebar #4", unit: "linear feet", basePrice: 1.85, laborHours: 0.08 },
    { id: "shell-054", name: "Masonry Rebar #5", unit: "linear feet", basePrice: 2.45, laborHours: 0.10 },
    { id: "shell-055", name: "Wall Ties", unit: "each", basePrice: 0.85, laborHours: 0.05 },
    { id: "shell-056", name: "Joint Reinforcement", unit: "linear feet", basePrice: 1.25, laborHours: 0.03 },
    { id: "shell-057", name: "Control Joint", unit: "linear feet", basePrice: 2.85, laborHours: 0.12 },
    { id: "shell-058", name: "Masonry Sealer", unit: "gallon", basePrice: 28.50, laborHours: 0.15 },
    { id: "shell-059", name: "Lintel Steel", unit: "linear feet", basePrice: 18.75, laborHours: 0.50 },
    { id: "shell-060", name: "Flashing Aluminum", unit: "linear feet", basePrice: 4.25, laborHours: 0.15 },
    { id: "shell-061", name: "Weep Holes", unit: "each", basePrice: 0.75, laborHours: 0.03 },
    { id: "shell-062", name: "Masonry Anchors", unit: "each", basePrice: 2.85, laborHours: 0.08 },
    { id: "shell-063", name: "Tuckpointing", unit: "square feet", basePrice: 4.75, laborHours: 0.35 },
    { id: "shell-064", name: "Brick Common", unit: "each", basePrice: 0.65, laborHours: 0.08 },
    { id: "shell-065", name: "Brick Face", unit: "each", basePrice: 1.25, laborHours: 0.12 },

    // Roofing Materials (25 components)
    { id: "shell-066", name: "TPO Membrane 60 mil", unit: "square feet", basePrice: 3.85, laborHours: 0.15 },
    { id: "shell-067", name: "EPDM Membrane 60 mil", unit: "square feet", basePrice: 4.25, laborHours: 0.18 },
    { id: "shell-068", name: "Modified Bitumen", unit: "square feet", basePrice: 3.25, laborHours: 0.20 },
    { id: "shell-069", name: "Roof Insulation 2 inch", unit: "square feet", basePrice: 2.85, laborHours: 0.08 },
    { id: "shell-070", name: "Roof Insulation 4 inch", unit: "square feet", basePrice: 4.75, laborHours: 0.12 },
    { id: "shell-071", name: "Roof Insulation 6 inch", unit: "square feet", basePrice: 6.25, laborHours: 0.15 },
    { id: "shell-072", name: "Roof Deck Steel", unit: "square feet", basePrice: 5.75, laborHours: 0.25 },
    { id: "shell-073", name: "Roof Deck Concrete", unit: "square feet", basePrice: 8.50, laborHours: 0.35 },
    { id: "shell-074", name: "Roof Fasteners", unit: "each", basePrice: 0.45, laborHours: 0.02 },
    { id: "shell-075", name: "Roof Adhesive", unit: "gallon", basePrice: 24.75, laborHours: 0.05 },
    { id: "shell-076", name: "Roof Sealant", unit: "tube", basePrice: 8.50, laborHours: 0.08 },
    { id: "shell-077", name: "Flashing Membrane", unit: "linear feet", basePrice: 3.25, laborHours: 0.12 },
    { id: "shell-078", name: "Flashing Metal", unit: "linear feet", basePrice: 6.75, laborHours: 0.20 },
    { id: "shell-079", name: "Roof Drain 4 inch", unit: "each", basePrice: 185.50, laborHours: 3.0 },
    { id: "shell-080", name: "Roof Drain 6 inch", unit: "each", basePrice: 245.75, laborHours: 4.0 },
    { id: "shell-081", name: "Scupper 4 inch", unit: "each", basePrice: 125.50, laborHours: 2.0 },
    { id: "shell-082", name: "Roof Hatch", unit: "each", basePrice: 485.50, laborHours: 4.0 },
    { id: "shell-083", name: "Skylight Curb", unit: "each", basePrice: 285.75, laborHours: 3.0 },
    { id: "shell-084", name: "Roof Penetration Seal", unit: "each", basePrice: 28.50, laborHours: 0.50 },
    { id: "shell-085", name: "Parapet Cap", unit: "linear feet", basePrice: 18.75, laborHours: 0.75 },
    { id: "shell-086", name: "Edge Trim", unit: "linear feet", basePrice: 8.25, laborHours: 0.25 },
    { id: "shell-087", name: "Roof Coating", unit: "gallon", basePrice: 32.50, laborHours: 0.15 },
    { id: "shell-088", name: "Vapor Retarder", unit: "square feet", basePrice: 1.85, laborHours: 0.05 },
    { id: "shell-089", name: "Roof Walkway Pad", unit: "square feet", basePrice: 12.50, laborHours: 0.25 },
    { id: "shell-090", name: "Lightning Protection", unit: "linear feet", basePrice: 8.75, laborHours: 0.35 },

    // Exterior Wall Materials (20 components)
    { id: "shell-091", name: "Metal Panel System", unit: "square feet", basePrice: 12.50, laborHours: 0.50 },
    { id: "shell-092", name: "Precast Panel", unit: "square feet", basePrice: 28.75, laborHours: 1.25 },
    { id: "shell-093", name: "EIFS System", unit: "square feet", basePrice: 8.25, laborHours: 0.85 },
    { id: "shell-094", name: "Curtain Wall Glazing", unit: "square feet", basePrice: 45.25, laborHours: 2.0 },
    { id: "shell-095", name: "Wall Insulation R-13", unit: "square feet", basePrice: 1.85, laborHours: 0.08 },
    { id: "shell-096", name: "Wall Insulation R-19", unit: "square feet", basePrice: 2.45, laborHours: 0.10 },
    { id: "shell-097", name: "Air Barrier", unit: "square feet", basePrice: 2.85, laborHours: 0.12 },
    { id: "shell-098", name: "Weather Barrier", unit: "square feet", basePrice: 1.25, laborHours: 0.05 },
    { id: "shell-099", name: "Wall Sealant", unit: "tube", basePrice: 8.50, laborHours: 0.15 },
    { id: "shell-100", name: "Expansion Joint", unit: "linear feet", basePrice: 12.75, laborHours: 0.50 },
    { id: "shell-101", name: "Window Frame", unit: "linear feet", basePrice: 18.75, laborHours: 0.75 },
    { id: "shell-102", name: "Door Frame", unit: "each", basePrice: 185.50, laborHours: 2.0 },
    { id: "shell-103", name: "Wall Anchors", unit: "each", basePrice: 3.25, laborHours: 0.15 },
    { id: "shell-104", name: "Wall Ties", unit: "each", basePrice: 1.85, laborHours: 0.08 },
    { id: "shell-105", name: "Louver Wall", unit: "square feet", basePrice: 24.75, laborHours: 1.0 },
    { id: "shell-106", name: "Wall Coping", unit: "linear feet", basePrice: 28.50, laborHours: 0.85 },
    { id: "shell-107", name: "Soffit Panel", unit: "square feet", basePrice: 8.75, laborHours: 0.35 },
    { id: "shell-108", name: "Wall Coating", unit: "gallon", basePrice: 28.50, laborHours: 0.25 },
    { id: "shell-109", name: "Joint Sealant", unit: "linear feet", basePrice: 2.85, laborHours: 0.12 },
    { id: "shell-110", name: "Wall Flashing", unit: "linear feet", basePrice: 6.25, laborHours: 0.25 },

    // Interior Materials (15 components)
    { id: "shell-111", name: "Drywall 1/2 inch", unit: "square feet", basePrice: 1.85, laborHours: 0.12 },
    { id: "shell-112", name: "Drywall 5/8 inch", unit: "square feet", basePrice: 2.25, laborHours: 0.15 },
    { id: "shell-113", name: "Metal Studs 3-5/8", unit: "linear feet", basePrice: 2.85, laborHours: 0.15 },
    { id: "shell-114", name: "Metal Studs 6", unit: "linear feet", basePrice: 3.75, laborHours: 0.18 },
    { id: "shell-115", name: "Ceiling Grid", unit: "square feet", basePrice: 3.25, laborHours: 0.20 },
    { id: "shell-116", name: "Ceiling Tile", unit: "square feet", basePrice: 2.85, laborHours: 0.10 },
    { id: "shell-117", name: "Joint Compound", unit: "gallon", basePrice: 18.50, laborHours: 0.25 },
    { id: "shell-118", name: "Drywall Tape", unit: "roll", basePrice: 8.25, laborHours: 0.05 },
    { id: "shell-119", name: "Paint Primer", unit: "gallon", basePrice: 24.75, laborHours: 0.25 },
    { id: "shell-120", name: "Paint Finish", unit: "gallon", basePrice: 32.50, laborHours: 0.35 },
    { id: "shell-121", name: "Flooring VCT", unit: "square feet", basePrice: 3.85, laborHours: 0.15 },
    { id: "shell-122", name: "Flooring Epoxy", unit: "square feet", basePrice: 6.25, laborHours: 0.25 },
    { id: "shell-123", name: "Base Trim", unit: "linear feet", basePrice: 4.75, laborHours: 0.20 },
    { id: "shell-124", name: "Door Trim", unit: "linear feet", basePrice: 6.25, laborHours: 0.25 },
    { id: "shell-125", name: "Acoustic Sealant", unit: "tube", basePrice: 12.50, laborHours: 0.08 },
  ],
};
// Project types and their characteristics
const projectTypes = [
  { type: "datacenter", multiplier: 1.2, description: "New data center construction with full infrastructure" },
  { type: "infrastructure", multiplier: 1.0, description: "Critical infrastructure upgrade and modernization" },
  { type: "renovation", multiplier: 0.9, description: "Existing facility renovation and improvement" },
  { type: "expansion", multiplier: 0.8, description: "Facility expansion and capacity addition" }
];

// US regions with cost multipliers
const regions = [
  { name: "Northern Virginia", code: "US-VA-N", multiplier: 1.15 },
  { name: "Northern California", code: "US-CA-N", multiplier: 1.35 },
  { name: "Oregon", code: "US-OR", multiplier: 1.05 },
  { name: "Texas", code: "US-TX", multiplier: 0.95 },
  { name: "Georgia", code: "US-GA", multiplier: 0.90 },
  { name: "Illinois", code: "US-IL", multiplier: 1.10 },
  { name: "North Carolina", code: "US-NC", multiplier: 0.85 },
  { name: "Arizona", code: "US-AZ", multiplier: 0.92 },
  { name: "Ohio", code: "US-OH", multiplier: 0.88 },
  { name: "New York", code: "US-NY", multiplier: 1.25 }
];

// Assembly templates - 500+ comprehensive assemblies for complete data center construction
const assemblyTemplates = [
  // =============== PHASE 1: ELECTRICAL INFRASTRUCTURE ASSEMBLIES (125) ===============
  
  // Power Distribution Assemblies (35)
  {
    name: "Primary Service Entrance Assembly",
    category: "Electrical Infrastructure", 
    description: "Main electrical service entrance with transformers, switchgear, and metering",
    components: ["el-001", "el-002", "el-003", "el-007", "el-008", "el-009", "el-014", "el-015", "el-018", "el-071", "el-072", "el-073"],
    basePrice: 2500000,
    laborHours: 1200
  },
  {
    name: "Medium Voltage Distribution Assembly",
    category: "Electrical Infrastructure",
    description: "Medium voltage distribution panels, switches, and cables for primary distribution",
    components: ["el-004", "el-005", "el-010", "el-011", "el-019", "el-020", "el-074", "el-075", "el-076"],
    basePrice: 1800000,
    laborHours: 800
  },
  {
    name: "Low Voltage Distribution Assembly", 
    category: "Electrical Infrastructure",
    description: "Low voltage distribution panels, breakers, and feeders for secondary distribution",
    components: ["el-006", "el-012", "el-013", "el-016", "el-017", "el-021", "el-022", "el-077", "el-078"],
    basePrice: 1200000,
    laborHours: 600
  },
  {
    name: "Emergency Power Distribution Assembly",
    category: "Electrical Infrastructure",
    description: "Emergency power distribution with transfer switches and emergency panels",
    components: ["el-023", "el-024", "el-025", "el-029", "el-030", "el-079", "el-080", "el-081"],
    basePrice: 850000,
    laborHours: 450
  },
  {
    name: "Branch Circuit Assembly - Server Rooms",
    category: "Electrical Infrastructure",
    description: "Branch circuits for server room power distribution with conduit, wire, and outlets",
    components: ["el-026", "el-027", "el-028", "el-031", "el-032", "el-033", "el-082", "el-083"],
    basePrice: 180000,
    laborHours: 320
  },
  {
    name: "Branch Circuit Assembly - Mechanical Equipment",
    category: "Electrical Infrastructure", 
    description: "Branch circuits for mechanical equipment power distribution",
    components: ["el-026", "el-027", "el-028", "el-034", "el-035", "el-036", "el-084", "el-085"],
    basePrice: 220000,
    laborHours: 380
  },
  {
    name: "Branch Circuit Assembly - Lighting Systems",
    category: "Electrical Infrastructure",
    description: "Branch circuits for lighting systems throughout the facility",
    components: ["el-026", "el-027", "el-028", "el-037", "el-038", "el-039", "el-086", "el-087"],
    basePrice: 160000,
    laborHours: 280
  },
  {
    name: "Branch Circuit Assembly - Support Areas",
    category: "Electrical Infrastructure",
    description: "Branch circuits for office areas, break rooms, and support spaces",
    components: ["el-026", "el-027", "el-028", "el-040", "el-041", "el-042", "el-088", "el-089"],
    basePrice: 120000,
    laborHours: 240
  },
  {
    name: "Branch Circuit Assembly - Exterior Systems",
    category: "Electrical Infrastructure",
    description: "Branch circuits for exterior lighting, security, and site systems",
    components: ["el-026", "el-027", "el-028", "el-043", "el-044", "el-045", "el-090", "el-091"],
    basePrice: 140000,
    laborHours: 260
  },
  {
    name: "Power Factor Correction Assembly",
    category: "Electrical Infrastructure",
    description: "Power factor correction equipment with capacitors and automatic controllers",
    components: ["el-046", "el-047", "el-048", "el-092", "el-093", "el-094"],
    basePrice: 380000,
    laborHours: 200
  },
  {
    name: "Grounding & Bonding Assembly",
    category: "Electrical Infrastructure",
    description: "Complete grounding system with ground rods, conductors, and bonding connections",
    components: ["el-049", "el-050", "el-051", "el-052", "el-095", "el-096", "el-097"],
    basePrice: 250000,
    laborHours: 350
  },
  {
    name: "Lightning Protection Assembly",
    category: "Electrical Infrastructure",
    description: "Lightning protection system with air terminals, conductors, and surge protection",
    components: ["el-053", "el-054", "el-055", "el-056", "el-098", "el-099", "el-100"],
    basePrice: 320000,
    laborHours: 280
  },
  {
    name: "Power Quality Assembly - UPS Systems",
    category: "Electrical Infrastructure",
    description: "Uninterruptible power supply systems with batteries and monitoring",
    components: ["el-057", "el-058", "el-059", "el-060", "el-101", "el-102", "el-103"],
    basePrice: 1800000,
    laborHours: 600
  },
  {
    name: "Power Quality Assembly - Power Conditioning",
    category: "Electrical Infrastructure",
    description: "Power conditioning equipment with filters and voltage regulators",
    components: ["el-061", "el-062", "el-063", "el-104", "el-105", "el-106"],
    basePrice: 480000,
    laborHours: 240
  },
  {
    name: "Generator Fuel System Assembly",
    category: "Electrical Infrastructure",
    description: "Fuel storage and delivery system for emergency generators",
    components: ["el-064", "el-065", "el-066", "el-067", "el-107", "el-108", "el-109"],
    basePrice: 420000,
    laborHours: 320
  },
  {
    name: "Generator Control Assembly",
    category: "Electrical Infrastructure",
    description: "Generator control systems with automatic start and monitoring",
    components: ["el-068", "el-069", "el-070", "el-110", "el-111", "el-112"],
    basePrice: 180000,
    laborHours: 160
  },
  {
    name: "Motor Control Center Assembly",
    category: "Electrical Infrastructure",
    description: "Motor control center with starters, contactors, and overload protection",
    components: ["el-113", "el-114", "el-115", "el-116", "el-117", "el-118"],
    basePrice: 320000,
    laborHours: 200
  },
  {
    name: "Variable Frequency Drive Assembly",
    category: "Electrical Infrastructure",
    description: "Variable frequency drives for motor speed control and energy efficiency",
    components: ["el-119", "el-120", "el-121", "el-122", "el-123"],
    basePrice: 280000,
    laborHours: 160
  },
  {
    name: "Power Monitoring Assembly",
    category: "Electrical Infrastructure",
    description: "Power monitoring and metering systems for energy management",
    components: ["el-124", "el-125", "el-076", "el-077", "el-078"],
    basePrice: 150000,
    laborHours: 120
  },
  {
    name: "Backup Generator Assembly",
    category: "Electrical Infrastructure",
    description: "Standby diesel generator with automatic transfer switches",
    components: ["el-022", "el-023", "el-024", "el-025", "el-027", "el-064", "el-065"],
    basePrice: 1400000,
    laborHours: 800
  },
  {
    name: "Electrical Panels Assembly - Main Distribution",
    category: "Electrical Infrastructure",
    description: "Main electrical distribution panels and load centers",
    components: ["el-012", "el-013", "el-016", "el-017", "el-018", "el-019"],
    basePrice: 280000,
    laborHours: 300
  },
  {
    name: "Electrical Panels Assembly - Sub-Distribution",
    category: "Electrical Infrastructure",
    description: "Sub-distribution panels for facility zones",
    components: ["el-020", "el-021", "el-082", "el-083", "el-084", "el-085"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Conduit and Wiring Assembly - Power",
    category: "Electrical Infrastructure",
    description: "Power conduit and wiring installation",
    components: ["el-026", "el-027", "el-028", "el-031", "el-032", "el-033"],
    basePrice: 320000,
    laborHours: 600
  },
  {
    name: "Conduit and Wiring Assembly - Control",
    category: "Electrical Infrastructure",
    description: "Control and instrumentation wiring systems",
    components: ["el-034", "el-035", "el-036", "el-086", "el-087", "el-088"],
    basePrice: 220000,
    laborHours: 450
  },
  {
    name: "Electrical Testing Assembly",
    category: "Electrical Infrastructure",
    description: "Electrical testing and commissioning equipment",
    components: ["el-124", "el-125", "el-101", "el-102"],
    basePrice: 85000,
    laborHours: 200
  },
  {
    name: "Electrical Room Ventilation Assembly",
    category: "Electrical Infrastructure",
    description: "Ventilation and cooling for electrical rooms",
    components: ["el-037", "el-038", "el-039", "mech-015", "mech-016"],
    basePrice: 120000,
    laborHours: 160
  },
  {
    name: "Cable Management Assembly",
    category: "Electrical Infrastructure",
    description: "Cable trays, conduits, and management systems",
    components: ["el-115", "el-116", "el-117", "el-118", "el-119"],
    basePrice: 180000,
    laborHours: 320
  },
  {
    name: "Surge Protection Assembly",
    category: "Electrical Infrastructure",
    description: "Comprehensive surge protection for sensitive equipment",
    components: ["el-098", "el-099", "el-100", "el-104", "el-105"],
    basePrice: 95000,
    laborHours: 120
  },
  {
    name: "Power Quality Monitoring Assembly",
    category: "Electrical Infrastructure",
    description: "Power quality monitoring and analysis systems",
    components: ["el-106", "el-124", "el-125", "el-076", "el-077"],
    basePrice: 125000,
    laborHours: 140
  },
  {
    name: "Electrical Safety Assembly",
    category: "Electrical Infrastructure",
    description: "Electrical safety systems including arc flash protection",
    components: ["el-049", "el-050", "el-051", "el-095", "el-096"],
    basePrice: 160000,
    laborHours: 200
  },
  {
    name: "Critical Power Assembly",
    category: "Electrical Infrastructure",
    description: "Critical power distribution for mission-critical loads",
    components: ["el-057", "el-058", "el-059", "el-105", "el-106", "el-107"],
    basePrice: 850000,
    laborHours: 400
  },
  {
    name: "Utility Coordination Assembly",
    category: "Electrical Infrastructure",
    description: "Utility service coordination and interconnection",
    components: ["el-001", "el-002", "el-003", "el-071", "el-072"],
    basePrice: 220000,
    laborHours: 300
  },
  {
    name: "Load Bank Testing Assembly",
    category: "Electrical Infrastructure",
    description: "Load bank testing for generators and UPS systems",
    components: ["el-068", "el-069", "el-070", "el-124", "el-125"],
    basePrice: 95000,
    laborHours: 160
  },
  {
    name: "Emergency Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "Emergency and egress lighting with battery backup systems",
    components: ["el-040", "el-041", "el-089", "el-090", "el-091"],
    basePrice: 120000,
    laborHours: 180
  },
  {
    name: "Exit Sign Assembly",
    category: "Electrical Infrastructure",
    description: "LED exit signs with battery backup and mounting hardware",
    components: ["el-042", "el-092", "el-093", "el-094"],
    basePrice: 45000,
    laborHours: 80
  },
  
  // Lighting & Controls Assemblies (25)
  {
    name: "Interior LED Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "LED lighting system for interior spaces with controls and dimming",
    components: ["el-037", "el-038", "el-039", "el-086", "el-087", "el-088"],
    basePrice: 280000,
    laborHours: 400
  },
  {
    name: "High Bay Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "High-efficiency LED high bay fixtures for warehouse and data halls",
    components: ["el-037", "el-038", "el-086", "el-087", "el-124"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Exterior Site Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "Exterior LED lighting for parking, walkways, and building perimeter",
    components: ["el-043", "el-044", "el-045", "el-095", "el-096", "el-097"],
    basePrice: 220000,
    laborHours: 320
  },
  {
    name: "Security Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "High-intensity security lighting with motion sensors and controls",
    components: ["el-043", "el-044", "el-098", "el-099", "el-100"],
    basePrice: 160000,
    laborHours: 200
  },
  {
    name: "Lighting Control Panel Assembly",
    category: "Electrical Infrastructure",
    description: "Centralized lighting control system with automated scheduling",
    components: ["el-101", "el-102", "el-103", "el-104", "el-105"],
    basePrice: 85000,
    laborHours: 120
  },
  {
    name: "Daylight Harvesting Assembly",
    category: "Electrical Infrastructure",
    description: "Automatic daylight harvesting system with photosensors",
    components: ["el-106", "el-107", "el-108", "el-109"],
    basePrice: 95000,
    laborHours: 140
  },
  {
    name: "Occupancy Sensor Assembly",
    category: "Electrical Infrastructure",
    description: "Motion and occupancy sensors for automatic lighting control",
    components: ["el-110", "el-111", "el-112", "el-113"],
    basePrice: 65000,
    laborHours: 100
  },
  {
    name: "Task Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "Under-cabinet and task lighting for work areas",
    components: ["el-114", "el-115", "el-116", "el-117"],
    basePrice: 55000,
    laborHours: 90
  },
  {
    name: "Architectural Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "Decorative and architectural lighting features",
    components: ["el-037", "el-038", "el-043", "el-044"],
    basePrice: 125000,
    laborHours: 200
  },
  {
    name: "Sports Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "High-intensity lighting for outdoor sports and recreation areas",
    components: ["el-043", "el-044", "el-045", "el-097"],
    basePrice: 280000,
    laborHours: 350
  },
  {
    name: "Parking Lot Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "LED lighting for parking areas with photocells and timers",
    components: ["el-043", "el-044", "el-106", "el-107"],
    basePrice: 150000,
    laborHours: 220
  },
  {
    name: "Walkway Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "Pedestrian walkway and pathway lighting",
    components: ["el-045", "el-108", "el-109", "el-110"],
    basePrice: 85000,
    laborHours: 140
  },
  {
    name: "Landscape Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "Low-voltage landscape and accent lighting",
    components: ["el-111", "el-112", "el-113", "el-114"],
    basePrice: 75000,
    laborHours: 120
  },
  {
    name: "Flood Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "High-intensity flood lighting for large area illumination",
    components: ["el-043", "el-044", "el-095", "el-096"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Specialty Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "Specialty lighting for unique applications and aesthetics",
    components: ["el-115", "el-116", "el-117", "el-118"],
    basePrice: 95000,
    laborHours: 160
  },
  {
    name: "Lighting Automation Assembly",
    category: "Electrical Infrastructure",
    description: "Automated lighting control with scheduling and sensors",
    components: ["el-119", "el-120", "el-121", "el-122"],
    basePrice: 120000,
    laborHours: 180
  },
  {
    name: "Energy Efficient Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "High-efficiency LED lighting with energy management",
    components: ["el-123", "el-124", "el-125", "el-037"],
    basePrice: 200000,
    laborHours: 280
  },
  {
    name: "Maintenance Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "Maintenance and service lighting for equipment areas",
    components: ["el-038", "el-039", "el-088", "el-089"],
    basePrice: 65000,
    laborHours: 100
  },
  {
    name: "Code Compliance Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "Code-compliant lighting for all building areas",
    components: ["el-090", "el-091", "el-092", "el-093"],
    basePrice: 180000,
    laborHours: 300
  },
  {
    name: "Lighting Retrofit Assembly",
    category: "Electrical Infrastructure",
    description: "Retrofit existing lighting to LED technology",
    components: ["el-094", "el-037", "el-038", "el-124"],
    basePrice: 150000,
    laborHours: 250
  },
  {
    name: "Smart Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "IoT-enabled smart lighting with wireless controls",
    components: ["el-119", "el-120", "el-124", "el-125"],
    basePrice: 220000,
    laborHours: 320
  },
  {
    name: "Photocell Control Assembly",
    category: "Electrical Infrastructure",
    description: "Automatic lighting control based on ambient light levels",
    components: ["el-106", "el-107", "el-108", "el-125"],
    basePrice: 45000,
    laborHours: 80
  },
  {
    name: "Dimming Control Assembly",
    category: "Electrical Infrastructure",
    description: "Advanced dimming controls for energy savings and ambiance",
    components: ["el-109", "el-110", "el-111", "el-112"],
    basePrice: 95000,
    laborHours: 140
  },
  {
    name: "Stadium Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "High-intensity stadium and arena lighting systems",
    components: ["el-043", "el-044", "el-095", "el-124"],
    basePrice: 850000,
    laborHours: 600
  },
  {
    name: "Industrial Lighting Assembly",
    category: "Electrical Infrastructure",
    description: "Heavy-duty industrial lighting for harsh environments",
    components: ["el-037", "el-038", "el-096", "el-097"],
    basePrice: 280000,
    laborHours: 400
  },
  
  // Communications & Security Assemblies (35)
  {
    name: "Structured Cabling Backbone Assembly",
    category: "Electrical Infrastructure",
    description: "Main telecommunications backbone cabling system",
    components: ["el-118", "el-119", "el-120", "el-121", "el-122"],
    basePrice: 450000,
    laborHours: 600
  },
  {
    name: "Horizontal Cabling Assembly",
    category: "Electrical Infrastructure",
    description: "Horizontal distribution cabling to work areas",
    components: ["el-118", "el-119", "el-123", "el-124", "el-125"],
    basePrice: 320000,
    laborHours: 480
  },
  {
    name: "Fiber Optic Backbone Assembly",
    category: "Electrical Infrastructure",
    description: "High-speed fiber optic backbone for data center connectivity",
    components: ["el-120", "el-121", "el-122", "el-123"],
    basePrice: 280000,
    laborHours: 350
  },
  {
    name: "Network Equipment Room Assembly",
    category: "Electrical Infrastructure",
    description: "Complete network equipment room with racks, power, and cooling",
    components: ["el-124", "el-125", "el-118", "el-119", "el-076"],
    basePrice: 380000,
    laborHours: 400
  },
  {
    name: "Telecommunications Room Assembly",
    category: "Electrical Infrastructure",
    description: "Telecommunications room with patch panels and cross-connects",
    components: ["el-118", "el-119", "el-120", "el-124"],
    basePrice: 120000,
    laborHours: 200
  },
  {
    name: "Security Camera System Assembly",
    category: "Electrical Infrastructure",
    description: "Complete security camera system with recording and monitoring",
    components: ["el-081", "el-082", "el-083", "el-084", "el-085"],
    basePrice: 250000,
    laborHours: 300
  },
  {
    name: "Access Control System Assembly",
    category: "Electrical Infrastructure",
    description: "Electronic access control with card readers and magnetic locks",
    components: ["el-086", "el-087", "el-088", "el-089", "el-090"],
    basePrice: 180000,
    laborHours: 220
  },
  {
    name: "Intrusion Detection Assembly",
    category: "Electrical Infrastructure",
    description: "Perimeter and building intrusion detection system",
    components: ["el-091", "el-092", "el-093", "el-094", "el-095"],
    basePrice: 120000,
    laborHours: 160
  },
  {
    name: "Fire Alarm System Assembly",
    category: "Electrical Infrastructure",
    description: "Addressable fire alarm system with notification devices",
    components: ["el-096", "el-097", "el-098", "el-099", "el-100"],
    basePrice: 220000,
    laborHours: 280
  },
  {
    name: "Mass Notification Assembly",
    category: "Electrical Infrastructure",
    description: "Emergency mass notification system with speakers and strobes",
    components: ["el-101", "el-102", "el-103", "el-104"],
    basePrice: 95000,
    laborHours: 140
  },
  {
    name: "Wireless Network Assembly",
    category: "Electrical Infrastructure",
    description: "Enterprise wireless network infrastructure",
    components: ["el-118", "el-119", "el-124", "el-125"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Public Address System Assembly",
    category: "Electrical Infrastructure",
    description: "Building-wide public address and paging system",
    components: ["el-101", "el-102", "el-103", "el-104"],
    basePrice: 95000,
    laborHours: 160
  },
  {
    name: "Intercom System Assembly",
    category: "Electrical Infrastructure",
    description: "Building intercom and two-way communication system",
    components: ["el-105", "el-106", "el-107", "el-108"],
    basePrice: 75000,
    laborHours: 120
  },
  {
    name: "Clock System Assembly",
    category: "Electrical Infrastructure",
    description: "Synchronized clock system throughout the facility",
    components: ["el-109", "el-110", "el-111", "el-112"],
    basePrice: 45000,
    laborHours: 80
  },
  {
    name: "Data Center Cabling Assembly",
    category: "Electrical Infrastructure",
    description: "High-density cabling for data center equipment",
    components: ["el-120", "el-121", "el-122", "el-123"],
    basePrice: 520000,
    laborHours: 600
  },
  {
    name: "Coaxial Cabling Assembly",
    category: "Electrical Infrastructure",
    description: "Coaxial cable distribution for video and RF applications",
    components: ["el-113", "el-114", "el-115", "el-116"],
    basePrice: 85000,
    laborHours: 140
  },
  {
    name: "Satellite Communication Assembly",
    category: "Electrical Infrastructure",
    description: "Satellite communication equipment and cabling",
    components: ["el-117", "el-118", "el-119", "el-120"],
    basePrice: 180000,
    laborHours: 200
  },
  {
    name: "Microwave Communication Assembly",
    category: "Electrical Infrastructure",
    description: "Point-to-point microwave communication systems",
    components: ["el-121", "el-122", "el-123", "el-124"],
    basePrice: 220000,
    laborHours: 250
  },
  {
    name: "Radio System Assembly",
    category: "Electrical Infrastructure",
    description: "Two-way radio communication infrastructure",
    components: ["el-125", "el-118", "el-119", "el-120"],
    basePrice: 125000,
    laborHours: 180
  },
  {
    name: "Network Testing Assembly",
    category: "Electrical Infrastructure",
    description: "Network testing and certification equipment",
    components: ["el-124", "el-125", "el-121", "el-122"],
    basePrice: 65000,
    laborHours: 100
  },
  {
    name: "Cable Management Assembly",
    category: "Electrical Infrastructure",
    description: "Advanced cable management and organization systems",
    components: ["el-115", "el-116", "el-117", "el-118"],
    basePrice: 95000,
    laborHours: 160
  },
  {
    name: "Telecommunications Grounding Assembly",
    category: "Electrical Infrastructure",
    description: "Telecommunications grounding and bonding infrastructure",
    components: ["el-049", "el-050", "el-051", "el-119"],
    basePrice: 85000,
    laborHours: 140
  },
  {
    name: "Entrance Facility Assembly",
    category: "Electrical Infrastructure",
    description: "Telecommunications entrance facility and demarcation",
    components: ["el-118", "el-119", "el-120", "el-124"],
    basePrice: 120000,
    laborHours: 180
  },
  {
    name: "Equipment Room Assembly",
    category: "Electrical Infrastructure",
    description: "Equipment room infrastructure for telecommunications",
    components: ["el-125", "el-118", "el-037", "el-038"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Cross-Connect Assembly",
    category: "Electrical Infrastructure",
    description: "Main and intermediate cross-connect facilities",
    components: ["el-121", "el-122", "el-123", "el-124"],
    basePrice: 95000,
    laborHours: 160
  },
  {
    name: "DAS Assembly",
    category: "Electrical Infrastructure",
    description: "Distributed antenna system for cellular coverage",
    components: ["el-119", "el-120", "el-121", "el-125"],
    basePrice: 320000,
    laborHours: 400
  },
  {
    name: "Video Surveillance Storage Assembly",
    category: "Electrical Infrastructure",
    description: "Video surveillance storage and management systems",
    components: ["el-081", "el-082", "el-124", "el-125"],
    basePrice: 180000,
    laborHours: 200
  },
  {
    name: "Perimeter Detection Assembly",
    category: "Electrical Infrastructure",
    description: "Perimeter intrusion detection and monitoring",
    components: ["el-091", "el-092", "el-093", "el-081"],
    basePrice: 220000,
    laborHours: 280
  },
  {
    name: "Biometric Access Assembly",
    category: "Electrical Infrastructure",
    description: "Biometric access control with fingerprint and facial recognition",
    components: ["el-086", "el-087", "el-088", "el-124"],
    basePrice: 280000,
    laborHours: 300
  },
  {
    name: "Visitor Management Assembly",
    category: "Electrical Infrastructure",
    description: "Visitor check-in and badging system",
    components: ["el-089", "el-090", "el-124", "el-125"],
    basePrice: 95000,
    laborHours: 140
  },
  {
    name: "Emergency Communication Assembly",
    category: "Electrical Infrastructure",
    description: "Emergency communication and notification systems",
    components: ["el-096", "el-097", "el-101", "el-102"],
    basePrice: 150000,
    laborHours: 200
  },
  {
    name: "Command Center Assembly",
    category: "Electrical Infrastructure",
    description: "Security command center with monitoring and control systems",
    components: ["el-081", "el-082", "el-086", "el-087"],
    basePrice: 420000,
    laborHours: 480
  },
  {
    name: "Integration Platform Assembly",
    category: "Electrical Infrastructure",
    description: "Integrated security platform for unified management",
    components: ["el-124", "el-125", "el-081", "el-086"],
    basePrice: 280000,
    laborHours: 350
  },
  {
    name: "Mobile Device Management Assembly",
    category: "Electrical Infrastructure",
    description: "Mobile device management and communication infrastructure",
    components: ["el-118", "el-119", "el-124", "el-125"],
    basePrice: 125000,
    laborHours: 180
  },
  {
    name: "IoT Infrastructure Assembly",
    category: "Electrical Infrastructure",
    description: "Internet of Things infrastructure and connectivity",
    components: ["el-119", "el-120", "el-124", "el-125"],
    basePrice: 220000,
    laborHours: 300
  },
  
  // Specialty Electrical Assemblies (30)
  {
    name: "Data Center PDU Assembly",
    category: "Electrical Infrastructure",
    description: "Power distribution units for server rack power delivery",
    components: ["el-105", "el-106", "el-107", "el-108", "el-109"],
    basePrice: 480000,
    laborHours: 300
  },
  {
    name: "Busway Distribution Assembly",
    category: "Electrical Infrastructure",
    description: "Busway system for high-capacity power distribution",
    components: ["el-110", "el-111", "el-112", "el-113", "el-114"],
    basePrice: 620000,
    laborHours: 400
  },
  {
    name: "Cable Tray System Assembly",
    category: "Electrical Infrastructure",
    description: "Cable tray system for organized cable management",
    components: ["el-115", "el-116", "el-117", "el-118", "el-119"],
    basePrice: 180000,
    laborHours: 320
  },
  {
    name: "Electrical Room Assembly",
    category: "Electrical Infrastructure",
    description: "Complete electrical room with panels, lighting, and ventilation",
    components: ["el-001", "el-002", "el-037", "el-038", "el-115"],
    basePrice: 350000,
    laborHours: 280
  },
  {
    name: "Generator Paralleling Assembly",
    category: "Electrical Infrastructure",
    description: "Generator paralleling switchgear for multiple generator operation",
    components: ["el-120", "el-121", "el-122", "el-123", "el-124"],
    basePrice: 420000,
    laborHours: 300
  },
  {
    name: "Harmonic Mitigation Assembly",
    category: "Electrical Infrastructure",
    description: "Harmonic filters and mitigation equipment",
    components: ["el-061", "el-062", "el-063", "el-104", "el-105"],
    basePrice: 280000,
    laborHours: 200
  },
  {
    name: "Power Factor Correction Assembly",
    category: "Electrical Infrastructure",
    description: "Automatic power factor correction equipment",
    components: ["el-046", "el-047", "el-048", "el-124", "el-125"],
    basePrice: 220000,
    laborHours: 160
  },
  {
    name: "Isolation Transformer Assembly",
    category: "Electrical Infrastructure",
    description: "Isolation transformers for sensitive equipment protection",
    components: ["el-001", "el-002", "el-003", "el-106", "el-107"],
    basePrice: 180000,
    laborHours: 140
  },
  {
    name: "Battery Monitoring Assembly",
    category: "Electrical Infrastructure",
    description: "Battery monitoring and management systems",
    components: ["el-059", "el-060", "el-124", "el-125"],
    basePrice: 95000,
    laborHours: 120
  },
  {
    name: "Energy Storage Assembly",
    category: "Electrical Infrastructure",
    description: "Battery energy storage systems for peak shaving and backup",
    components: ["el-057", "el-058", "el-059", "el-060"],
    basePrice: 850000,
    laborHours: 400
  },
  {
    name: "Solar Integration Assembly",
    category: "Electrical Infrastructure",
    description: "Solar photovoltaic integration and grid-tie equipment",
    components: ["el-004", "el-005", "el-124", "el-125"],
    basePrice: 420000,
    laborHours: 350
  },
  {
    name: "Wind Integration Assembly",
    category: "Electrical Infrastructure",
    description: "Wind energy integration and control systems",
    components: ["el-004", "el-005", "el-122", "el-123"],
    basePrice: 280000,
    laborHours: 250
  },
  {
    name: "Cogeneration Assembly",
    category: "Electrical Infrastructure",
    description: "Cogeneration equipment and electrical integration",
    components: ["el-022", "el-023", "el-120", "el-121"],
    basePrice: 650000,
    laborHours: 480
  },
  {
    name: "Micro-Grid Assembly",
    category: "Electrical Infrastructure",
    description: "Micro-grid control and switching equipment",
    components: ["el-004", "el-005", "el-124", "el-125"],
    basePrice: 520000,
    laborHours: 400
  },
  {
    name: "Arc Flash Protection Assembly",
    category: "Electrical Infrastructure",
    description: "Arc flash detection and mitigation systems",
    components: ["el-049", "el-050", "el-095", "el-096"],
    basePrice: 180000,
    laborHours: 200
  },
  {
    name: "Electrical Metering Assembly",
    category: "Electrical Infrastructure",
    description: "Revenue-grade electrical metering and sub-metering",
    components: ["el-076", "el-077", "el-078", "el-124"],
    basePrice: 125000,
    laborHours: 160
  },
  {
    name: "Motor Protection Assembly",
    category: "Electrical Infrastructure",
    description: "Motor protection relays and monitoring systems",
    components: ["el-117", "el-118", "el-124", "el-125"],
    basePrice: 95000,
    laborHours: 140
  },
  {
    name: "Heat Tracing Assembly",
    category: "Electrical Infrastructure",
    description: "Electric heat tracing for freeze protection",
    components: ["el-034", "el-035", "el-036", "el-124"],
    basePrice: 85000,
    laborHours: 160
  },
  {
    name: "Cathodic Protection Assembly",
    category: "Electrical Infrastructure",
    description: "Cathodic protection for underground metal structures",
    components: ["el-049", "el-050", "el-051", "el-125"],
    basePrice: 120000,
    laborHours: 180
  },
  {
    name: "Explosion Proof Assembly",
    category: "Electrical Infrastructure",
    description: "Explosion-proof electrical equipment for hazardous areas",
    components: ["el-037", "el-038", "el-016", "el-017"],
    basePrice: 280000,
    laborHours: 350
  },
  {
    name: "Marine Electrical Assembly",
    category: "Electrical Infrastructure",
    description: "Marine-grade electrical systems for waterfront facilities",
    components: ["el-026", "el-027", "el-037", "el-038"],
    basePrice: 220000,
    laborHours: 300
  },
  {
    name: "Railway Electrical Assembly",
    category: "Electrical Infrastructure",
    description: "Railway electrical systems and traction power",
    components: ["el-001", "el-002", "el-004", "el-005"],
    basePrice: 850000,
    laborHours: 600
  },
  {
    name: "Mining Electrical Assembly",
    category: "Electrical Infrastructure",
    description: "Mining electrical systems and safety equipment",
    components: ["el-037", "el-038", "el-049", "el-050"],
    basePrice: 420000,
    laborHours: 480
  },
  {
    name: "Oil & Gas Electrical Assembly",
    category: "Electrical Infrastructure",
    description: "Oil and gas facility electrical systems",
    components: ["el-016", "el-017", "el-037", "el-038"],
    basePrice: 520000,
    laborHours: 520
  },
  {
    name: "Hospital Electrical Assembly",
    category: "Electrical Infrastructure",
    description: "Hospital-grade electrical systems with isolated power",
    components: ["el-001", "el-002", "el-057", "el-058"],
    basePrice: 680000,
    laborHours: 600
  },
  {
    name: "Laboratory Electrical Assembly",
    category: "Electrical Infrastructure",
    description: "Laboratory electrical systems with specialized requirements",
    components: ["el-012", "el-013", "el-037", "el-038"],
    basePrice: 380000,
    laborHours: 400
  },
  {
    name: "Clean Room Electrical Assembly",
    category: "Electrical Infrastructure",
    description: "Clean room electrical systems with contamination control",
    components: ["el-037", "el-038", "el-095", "el-096"],
    basePrice: 420000,
    laborHours: 450
  },
  {
    name: "Telecommunications Tower Assembly",
    category: "Electrical Infrastructure",
    description: "Telecommunications tower electrical and grounding systems",
    components: ["el-043", "el-044", "el-049", "el-050"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Airport Electrical Assembly",
    category: "Electrical Infrastructure",
    description: "Airport electrical systems including runway lighting",
    components: ["el-043", "el-044", "el-001", "el-002"],
    basePrice: 1200000,
    laborHours: 800
  },
  {
    name: "Stadium Electrical Assembly",
    category: "Electrical Infrastructure",
    description: "Stadium electrical systems with high-intensity lighting",
    components: ["el-043", "el-044", "el-001", "el-002"],
    basePrice: 950000,
    laborHours: 700
  },
  
  // =============== PHASE 2: MECHANICAL SYSTEMS ASSEMBLIES (125) ===============
  
  // HVAC Assemblies (45)
  {
    name: "Central Chilled Water Plant Assembly",
    category: "Mechanical Systems",
    description: "Central chilled water plant with chillers, pumps, and cooling towers",
    components: ["mech-001", "mech-002", "mech-003", "mech-026", "mech-027", "mech-028", "mech-051", "mech-052"],
    basePrice: 2800000,
    laborHours: 1400
  },
  {
    name: "Computer Room Air Handler Assembly",
    category: "Mechanical Systems",
    description: "Precision computer room air handlers for data center cooling",
    components: ["mech-004", "mech-005", "mech-006", "mech-029", "mech-030", "mech-053", "mech-054"],
    basePrice: 1200000,
    laborHours: 600
  },
  {
    name: "Precision Cooling Assembly",
    category: "Mechanical Systems",
    description: "Close-coupled precision cooling units for critical spaces",
    components: ["mech-007", "mech-008", "mech-009", "mech-031", "mech-032", "mech-055", "mech-056"],
    basePrice: 850000,
    laborHours: 450
  },
  {
    name: "Supply Air Ductwork Assembly",
    category: "Mechanical Systems",
    description: "Supply air ductwork distribution system with dampers and diffusers",
    components: ["mech-010", "mech-011", "mech-012", "mech-033", "mech-034", "mech-057", "mech-058"],
    basePrice: 420000,
    laborHours: 800
  },
  {
    name: "Return Air Ductwork Assembly", 
    category: "Mechanical Systems",
    description: "Return air ductwork system with grilles and controls",
    components: ["mech-010", "mech-011", "mech-013", "mech-035", "mech-036", "mech-059", "mech-060"],
    basePrice: 380000,
    laborHours: 720
  },
  {
    name: "Exhaust Air Ductwork Assembly",
    category: "Mechanical Systems", 
    description: "Exhaust air ductwork for ventilation and smoke removal",
    components: ["mech-010", "mech-011", "mech-014", "mech-037", "mech-038", "mech-061", "mech-062"],
    basePrice: 320000,
    laborHours: 600
  },
  {
    name: "Outside Air Handling Assembly",
    category: "Mechanical Systems",
    description: "Outside air handling unit with filtration and conditioning",
    components: ["mech-015", "mech-016", "mech-017", "mech-039", "mech-040", "mech-063", "mech-064"],
    basePrice: 480000,
    laborHours: 350
  },
  {
    name: "Air Distribution Assembly",
    category: "Mechanical Systems",
    description: "Air distribution system with diffusers, grilles, and registers",
    components: ["mech-018", "mech-019", "mech-020", "mech-041", "mech-042", "mech-065", "mech-066"],
    basePrice: 180000,
    laborHours: 400
  },
  {
    name: "VAV Terminal Assembly",
    category: "Mechanical Systems",
    description: "Variable air volume terminal units with reheat coils",
    components: ["mech-021", "mech-022", "mech-023", "mech-043", "mech-044", "mech-067", "mech-068"],
    basePrice: 220000,
    laborHours: 280
  },
  {
    name: "Humidification System Assembly",
    category: "Mechanical Systems",
    description: "Steam humidification system for data center humidity control",
    components: ["mech-024", "mech-025", "mech-045", "mech-046", "mech-069", "mech-070"],
    basePrice: 280000,
    laborHours: 240
  },
  {
    name: "Heat Recovery Assembly",
    category: "Mechanical Systems",
    description: "Energy recovery ventilation with heat wheels",
    components: ["mech-047", "mech-048", "mech-049", "mech-071", "mech-072", "mech-073"],
    basePrice: 350000,
    laborHours: 300
  },
  {
    name: "Economizer Assembly",
    category: "Mechanical Systems",
    description: "Air-side economizer for free cooling when conditions permit",
    components: ["mech-050", "mech-074", "mech-075", "mech-076", "mech-077"],
    basePrice: 180000,
    laborHours: 200
  },
  {
    name: "Chiller Plant Assembly",
    category: "Mechanical Systems",
    description: "Complete chiller plant with primary and secondary loops",
    components: ["mech-001", "mech-002", "mech-003", "mech-026", "mech-027"],
    basePrice: 1800000,
    laborHours: 960
  },
  {
    name: "Cooling Tower Assembly",
    category: "Mechanical Systems",
    description: "Cooling towers with fans, pumps, and water treatment",
    components: ["mech-028", "mech-051", "mech-052", "mech-078", "mech-079"],
    basePrice: 420000,
    laborHours: 350
  },
  {
    name: "Boiler Plant Assembly",
    category: "Mechanical Systems",
    description: "Steam or hot water boiler plant with controls",
    components: ["mech-080", "mech-081", "mech-082", "mech-083", "mech-084"],
    basePrice: 680000,
    laborHours: 480
  },
  {
    name: "Air Handling Unit Assembly",
    category: "Mechanical Systems",
    description: "Custom air handling units with heating and cooling coils",
    components: ["mech-015", "mech-016", "mech-017", "mech-018", "mech-019"],
    basePrice: 320000,
    laborHours: 280
  },
  {
    name: "Fan Coil Assembly",
    category: "Mechanical Systems",
    description: "Fan coil units for individual space conditioning",
    components: ["mech-020", "mech-021", "mech-022", "mech-067", "mech-068"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Unit Heater Assembly",
    category: "Mechanical Systems",
    description: "Unit heaters for warehouse and industrial spaces",
    components: ["mech-085", "mech-086", "mech-087", "mech-088"],
    basePrice: 95000,
    laborHours: 140
  },
  {
    name: "Radiant Heating Assembly",
    category: "Mechanical Systems",
    description: "Radiant floor heating systems",
    components: ["mech-089", "mech-090", "mech-091", "mech-092"],
    basePrice: 220000,
    laborHours: 350
  },
  {
    name: "Geothermal Assembly",
    category: "Mechanical Systems",
    description: "Geothermal heat pump systems with ground loops",
    components: ["mech-093", "mech-094", "mech-095", "mech-096"],
    basePrice: 480000,
    laborHours: 400
  },
  {
    name: "VRF System Assembly",
    category: "Mechanical Systems",
    description: "Variable refrigerant flow system for flexible zoning",
    components: ["mech-097", "mech-098", "mech-099", "mech-100"],
    basePrice: 380000,
    laborHours: 320
  },
  {
    name: "Package Unit Assembly",
    category: "Mechanical Systems",
    description: "Packaged rooftop units with gas heat and electric cooling",
    components: ["mech-101", "mech-102", "mech-103", "mech-104"],
    basePrice: 220000,
    laborHours: 200
  },
  {
    name: "Split System Assembly",
    category: "Mechanical Systems",
    description: "Split system air conditioning with outdoor condensing units",
    components: ["mech-105", "mech-106", "mech-107", "mech-108"],
    basePrice: 150000,
    laborHours: 180
  },
  {
    name: "Energy Recovery Assembly",
    category: "Mechanical Systems",
    description: "Energy recovery ventilators for outside air conditioning",
    components: ["mech-047", "mech-048", "mech-049", "mech-109"],
    basePrice: 280000,
    laborHours: 240
  },
  {
    name: "Makeup Air Assembly",
    category: "Mechanical Systems",
    description: "Makeup air units for replacement air in buildings",
    components: ["mech-110", "mech-111", "mech-112", "mech-113"],
    basePrice: 180000,
    laborHours: 200
  },
  {
    name: "Exhaust Fan Assembly",
    category: "Mechanical Systems",
    description: "Exhaust fans for general and specialty ventilation",
    components: ["mech-114", "mech-115", "mech-116", "mech-117"],
    basePrice: 95000,
    laborHours: 140
  },
  {
    name: "Fume Hood Assembly",
    category: "Mechanical Systems",
    description: "Laboratory fume hoods with specialized exhaust systems",
    components: ["mech-118", "mech-119", "mech-120", "mech-121"],
    basePrice: 220000,
    laborHours: 280
  },
  {
    name: "Clean Room HVAC Assembly",
    category: "Mechanical Systems",
    description: "Clean room HVAC with HEPA filtration and pressure control",
    components: ["mech-122", "mech-123", "mech-124", "mech-125"],
    basePrice: 680000,
    laborHours: 600
  },
  {
    name: "Kitchen Ventilation Assembly",
    category: "Mechanical Systems",
    description: "Commercial kitchen ventilation with grease removal",
    components: ["mech-114", "mech-115", "mech-118", "mech-119"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Parking Garage Ventilation Assembly",
    category: "Mechanical Systems",
    description: "Parking garage ventilation with CO monitoring",
    components: ["mech-114", "mech-115", "mech-116", "mech-124"],
    basePrice: 150000,
    laborHours: 200
  },
  {
    name: "Server Room Cooling Assembly",
    category: "Mechanical Systems",
    description: "Dedicated server room cooling with redundancy",
    components: ["mech-004", "mech-005", "mech-006", "mech-007"],
    basePrice: 420000,
    laborHours: 300
  },
  {
    name: "Telecommunications Room Cooling Assembly",
    category: "Mechanical Systems",
    description: "Cooling for telecommunications equipment rooms",
    components: ["mech-008", "mech-009", "mech-105", "mech-106"],
    basePrice: 180000,
    laborHours: 160
  },
  {
    name: "UPS Room Ventilation Assembly",
    category: "Mechanical Systems",
    description: "Ventilation for UPS battery rooms with hydrogen detection",
    components: ["mech-114", "mech-115", "mech-124", "mech-125"],
    basePrice: 95000,
    laborHours: 120
  },
  {
    name: "Generator Room Ventilation Assembly",
    category: "Mechanical Systems",
    description: "Ventilation for generator rooms with combustion air",
    components: ["mech-110", "mech-111", "mech-114", "mech-115"],
    basePrice: 120000,
    laborHours: 140
  },
  {
    name: "Chemical Storage Ventilation Assembly",
    category: "Mechanical Systems",
    description: "Specialized ventilation for chemical storage areas",
    components: ["mech-118", "mech-119", "mech-120", "mech-124"],
    basePrice: 150000,
    laborHours: 180
  },
  {
    name: "Stairwell Pressurization Assembly",
    category: "Mechanical Systems",
    description: "Stairwell pressurization for smoke control",
    components: ["mech-110", "mech-111", "mech-116", "mech-117"],
    basePrice: 85000,
    laborHours: 120
  },
  {
    name: "Elevator Machine Room Ventilation Assembly",
    category: "Mechanical Systems",
    description: "Ventilation for elevator machine rooms",
    components: ["mech-114", "mech-115", "mech-112", "mech-113"],
    basePrice: 65000,
    laborHours: 100
  },
  {
    name: "Natatorium HVAC Assembly",
    category: "Mechanical Systems",
    description: "Pool facility HVAC with dehumidification",
    components: ["mech-122", "mech-123", "mech-047", "mech-048"],
    basePrice: 420000,
    laborHours: 400
  },
  {
    name: "Gymnasium HVAC Assembly",
    category: "Mechanical Systems",
    description: "Large space HVAC for gymnasiums and arenas",
    components: ["mech-101", "mech-102", "mech-110", "mech-111"],
    basePrice: 280000,
    laborHours: 250
  },
  {
    name: "Warehouse HVAC Assembly",
    category: "Mechanical Systems",
    description: "High-bay warehouse heating and ventilation",
    components: ["mech-085", "mech-086", "mech-110", "mech-111"],
    basePrice: 180000,
    laborHours: 200
  },
  {
    name: "Cold Storage Assembly",
    category: "Mechanical Systems",
    description: "Refrigerated cold storage with specialized equipment",
    components: ["mech-004", "mech-005", "mech-097", "mech-098"],
    basePrice: 680000,
    laborHours: 520
  },
  {
    name: "Freezer Assembly",
    category: "Mechanical Systems",
    description: "Freezer room refrigeration with defrost systems",
    components: ["mech-006", "mech-007", "mech-099", "mech-100"],
    basePrice: 420000,
    laborHours: 380
  },
  {
    name: "Data Center Hot Aisle Containment Assembly",
    category: "Mechanical Systems",
    description: "Hot aisle containment for data center efficiency",
    components: ["mech-004", "mech-005", "mech-029", "mech-030"],
    basePrice: 220000,
    laborHours: 200
  },
  {
    name: "Data Center Cold Aisle Containment Assembly",
    category: "Mechanical Systems",
    description: "Cold aisle containment for data center efficiency",
    components: ["mech-006", "mech-007", "mech-031", "mech-032"],
    basePrice: 180000,
    laborHours: 160
  },
  {
    name: "Liquid Cooling Assembly",
    category: "Mechanical Systems",
    description: "Direct liquid cooling for high-density computing",
    components: ["mech-008", "mech-009", "mech-078", "mech-079"],
    basePrice: 520000,
    laborHours: 400
  },
  {
    name: "Immersion Cooling Assembly",
    category: "Mechanical Systems",
    description: "Immersion cooling systems for extreme density",
    components: ["mech-001", "mech-002", "mech-080", "mech-081"],
    basePrice: 850000,
    laborHours: 500
  },
  
  // Piping Assemblies (35)
  {
    name: "Chilled Water Primary Loop Assembly",
    category: "Mechanical Systems",
    description: "Primary chilled water piping loop with variable flow controls",
    components: ["mech-078", "mech-079", "mech-080", "mech-103", "mech-104", "mech-105"],
    basePrice: 450000,
    laborHours: 600
  },
  {
    name: "Chilled Water Secondary Loop Assembly",
    category: "Mechanical Systems",
    description: "Secondary chilled water distribution to air handlers",
    components: ["mech-078", "mech-079", "mech-081", "mech-106", "mech-107", "mech-108"],
    basePrice: 380000,
    laborHours: 520
  },
  {
    name: "Condenser Water Piping Assembly",
    category: "Mechanical Systems",
    description: "Condenser water piping between chillers and cooling towers",
    components: ["mech-082", "mech-083", "mech-084", "mech-109", "mech-110", "mech-111"],
    basePrice: 320000,
    laborHours: 480
  },
  {
    name: "Hot Water Heating Assembly",
    category: "Mechanical Systems",
    description: "Hot water heating system for reheat coils and perimeter heating",
    components: ["mech-085", "mech-086", "mech-087", "mech-112", "mech-113", "mech-114"],
    basePrice: 280000,
    laborHours: 400
  },
  {
    name: "Steam Distribution Assembly",
    category: "Mechanical Systems",
    description: "Steam distribution system for humidification",
    components: ["mech-088", "mech-089", "mech-090", "mech-115", "mech-116", "mech-117"],
    basePrice: 220000,
    laborHours: 350
  },
  {
    name: "Compressed Air System Assembly",
    category: "Mechanical Systems",
    description: "Compressed air system for pneumatic controls and equipment",
    components: ["mech-091", "mech-092", "mech-093", "mech-118", "mech-119", "mech-120"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Domestic Water Distribution Assembly",
    category: "Mechanical Systems",
    description: "Domestic water distribution with fixtures and water heating",
    components: ["mech-094", "mech-095", "mech-096", "mech-121", "mech-122", "mech-123"],
    basePrice: 150000,
    laborHours: 300
  },
  {
    name: "Sanitary Drainage Assembly",
    category: "Mechanical Systems",
    description: "Sanitary drainage system with vents and cleanouts",
    components: ["mech-097", "mech-098", "mech-099", "mech-124", "mech-125"],
    basePrice: 120000,
    laborHours: 280
  },
  {
    name: "Storm Drainage Assembly",
    category: "Mechanical Systems",
    description: "Storm water drainage from roof and site",
    components: ["mech-100", "mech-101", "mech-102", "mech-078", "mech-079"],
    basePrice: 160000,
    laborHours: 320
  },
  {
    name: "Natural Gas Piping Assembly",
    category: "Mechanical Systems",
    description: "Natural gas distribution piping with regulators and meters",
    components: ["mech-103", "mech-104", "mech-105", "mech-106"],
    basePrice: 120000,
    laborHours: 200
  },
  {
    name: "Medical Gas Assembly",
    category: "Mechanical Systems",
    description: "Medical gas piping for oxygen, nitrous oxide, and vacuum",
    components: ["mech-107", "mech-108", "mech-109", "mech-110"],
    basePrice: 220000,
    laborHours: 350
  },
  {
    name: "Laboratory Gas Assembly",
    category: "Mechanical Systems",
    description: "Specialty gas piping for laboratory applications",
    components: ["mech-111", "mech-112", "mech-113", "mech-114"],
    basePrice: 180000,
    laborHours: 280
  },
  {
    name: "Process Piping Assembly",
    category: "Mechanical Systems",
    description: "Process piping for industrial applications",
    components: ["mech-115", "mech-116", "mech-117", "mech-118"],
    basePrice: 320000,
    laborHours: 450
  },
  {
    name: "Glycol System Assembly",
    category: "Mechanical Systems",
    description: "Glycol piping system for freeze protection",
    components: ["mech-119", "mech-120", "mech-121", "mech-122"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Fuel Oil Piping Assembly",
    category: "Mechanical Systems",
    description: "Fuel oil piping for boilers and generators",
    components: ["mech-123", "mech-124", "mech-125", "mech-078"],
    basePrice: 150000,
    laborHours: 220
  },
  {
    name: "Grease Waste Assembly",
    category: "Mechanical Systems",
    description: "Grease waste piping for commercial kitchen applications",
    components: ["mech-097", "mech-098", "mech-079", "mech-080"],
    basePrice: 85000,
    laborHours: 140
  },
  {
    name: "Chemical Feed Assembly",
    category: "Mechanical Systems",
    description: "Chemical feed systems for water treatment",
    components: ["mech-081", "mech-082", "mech-083", "mech-084"],
    basePrice: 95000,
    laborHours: 160
  },
  {
    name: "Pool Circulation Assembly",
    category: "Mechanical Systems",
    description: "Swimming pool circulation and filtration piping",
    components: ["mech-085", "mech-086", "mech-087", "mech-088"],
    basePrice: 180000,
    laborHours: 280
  },
  {
    name: "Fire Service Piping Assembly",
    category: "Mechanical Systems",
    description: "Fire service water piping from street to building",
    components: ["mech-089", "mech-090", "mech-091", "mech-092"],
    basePrice: 120000,
    laborHours: 200
  },
  {
    name: "Irrigation Assembly",
    category: "Mechanical Systems",
    description: "Landscape irrigation piping and controls",
    components: ["mech-093", "mech-094", "mech-095", "mech-096"],
    basePrice: 95000,
    laborHours: 180
  },
  {
    name: "Process Cooling Assembly",
    category: "Mechanical Systems",
    description: "Process cooling water piping for industrial equipment",
    components: ["mech-097", "mech-098", "mech-099", "mech-100"],
    basePrice: 220000,
    laborHours: 320
  },
  {
    name: "Vacuum System Assembly",
    category: "Mechanical Systems",
    description: "Central vacuum system piping",
    components: ["mech-101", "mech-102", "mech-103", "mech-104"],
    basePrice: 150000,
    laborHours: 200
  },
  {
    name: "Pneumatic Tube Assembly",
    category: "Mechanical Systems",
    description: "Pneumatic tube system for material transport",
    components: ["mech-105", "mech-106", "mech-107", "mech-108"],
    basePrice: 280000,
    laborHours: 350
  },
  {
    name: "Acid Waste Assembly",
    category: "Mechanical Systems",
    description: "Acid waste piping for laboratory applications",
    components: ["mech-109", "mech-110", "mech-111", "mech-112"],
    basePrice: 180000,
    laborHours: 280
  },
  {
    name: "Solvent Waste Assembly",
    category: "Mechanical Systems",
    description: "Solvent waste piping for laboratory and industrial use",
    components: ["mech-113", "mech-114", "mech-115", "mech-116"],
    basePrice: 150000,
    laborHours: 240
  },
  {
    name: "Reverse Osmosis Assembly",
    category: "Mechanical Systems",
    description: "Reverse osmosis water treatment system",
    components: ["mech-117", "mech-118", "mech-119", "mech-120"],
    basePrice: 220000,
    laborHours: 300
  },
  {
    name: "Deionized Water Assembly",
    category: "Mechanical Systems",
    description: "Deionized water production and distribution",
    components: ["mech-121", "mech-122", "mech-123", "mech-124"],
    basePrice: 180000,
    laborHours: 260
  },
  {
    name: "Cooling Tower Water Treatment Assembly",
    category: "Mechanical Systems",
    description: "Cooling tower water treatment and chemical feed",
    components: ["mech-125", "mech-078", "mech-079", "mech-080"],
    basePrice: 95000,
    laborHours: 140
  },
  {
    name: "Boiler Feed Water Assembly",
    category: "Mechanical Systems",
    description: "Boiler feed water treatment and pumping",
    components: ["mech-081", "mech-082", "mech-083", "mech-084"],
    basePrice: 150000,
    laborHours: 200
  },
  {
    name: "Condensate Return Assembly",
    category: "Mechanical Systems",
    description: "Steam condensate return piping and pumping",
    components: ["mech-085", "mech-086", "mech-087", "mech-088"],
    basePrice: 120000,
    laborHours: 180
  },
  {
    name: "Thermal Storage Assembly",
    category: "Mechanical Systems",
    description: "Thermal energy storage tanks and piping",
    components: ["mech-089", "mech-090", "mech-091", "mech-092"],
    basePrice: 420000,
    laborHours: 350
  },
  {
    name: "Hydronic Heating Assembly",
    category: "Mechanical Systems",
    description: "Hydronic radiant heating piping and controls",
    components: ["mech-093", "mech-094", "mech-095", "mech-096"],
    basePrice: 280000,
    laborHours: 400
  },
  {
    name: "Snowmelt Assembly",
    category: "Mechanical Systems",
    description: "Hydronic snowmelt system for walkways and drives",
    components: ["mech-097", "mech-098", "mech-099", "mech-100"],
    basePrice: 180000,
    laborHours: 280
  },
  {
    name: "Geothermal Loop Assembly",
    category: "Mechanical Systems",
    description: "Geothermal ground loop piping and manifolds",
    components: ["mech-101", "mech-102", "mech-103", "mech-104"],
    basePrice: 320000,
    laborHours: 450
  },
  {
    name: "Solar Thermal Assembly",
    category: "Mechanical Systems",
    description: "Solar thermal collector piping and storage",
    components: ["mech-105", "mech-106", "mech-107", "mech-108"],
    basePrice: 220000,
    laborHours: 300
  },
  
  // Fire Protection Assemblies (25)
  {
    name: "Wet Sprinkler System Assembly",
    category: "Mechanical Systems",
    description: "Wet pipe sprinkler system for general building protection",
    components: ["mech-051", "mech-052", "mech-053", "mech-078", "mech-079"],
    basePrice: 320000,
    laborHours: 480
  },
  {
    name: "Dry Sprinkler System Assembly",
    category: "Mechanical Systems",
    description: "Dry pipe sprinkler system for areas subject to freezing",
    components: ["mech-054", "mech-055", "mech-056", "mech-080", "mech-081"],
    basePrice: 380000,
    laborHours: 520
  },
  {
    name: "Clean Agent Suppression Assembly",
    category: "Mechanical Systems",
    description: "Clean agent fire suppression for critical IT equipment areas",
    components: ["mech-057", "mech-058", "mech-059", "mech-082", "mech-083"],
    basePrice: 480000,
    laborHours: 350
  },
  {
    name: "Fire Pump Assembly",
    category: "Mechanical Systems",
    description: "Fire pump system with diesel backup and controllers",
    components: ["mech-060", "mech-061", "mech-062", "mech-084", "mech-085"],
    basePrice: 220000,
    laborHours: 280
  },
  {
    name: "Fire Department Connection Assembly",
    category: "Mechanical Systems",
    description: "Fire department connection with check valves and controls",
    components: ["mech-063", "mech-064", "mech-065", "mech-086"],
    basePrice: 45000,
    laborHours: 80
  },
  {
    name: "Smoke Management Assembly",
    category: "Mechanical Systems",
    description: "Smoke management system with exhaust fans and dampers",
    components: ["mech-066", "mech-067", "mech-068", "mech-087", "mech-088"],
    basePrice: 280000,
    laborHours: 320
  },
  {
    name: "Deluge Sprinkler Assembly",
    category: "Mechanical Systems",
    description: "Deluge sprinkler system for high-hazard areas",
    components: ["mech-051", "mech-052", "mech-069", "mech-070"],
    basePrice: 420000,
    laborHours: 400
  },
  {
    name: "Foam Suppression Assembly",
    category: "Mechanical Systems",
    description: "Foam fire suppression for flammable liquid areas",
    components: ["mech-071", "mech-072", "mech-073", "mech-074"],
    basePrice: 380000,
    laborHours: 350
  },
  {
    name: "Water Mist Assembly",
    category: "Mechanical Systems",
    description: "Water mist fire suppression for sensitive areas",
    components: ["mech-075", "mech-076", "mech-077", "mech-089"],
    basePrice: 320000,
    laborHours: 300
  },
  {
    name: "Kitchen Suppression Assembly",
    category: "Mechanical Systems",
    description: "Kitchen hood fire suppression system",
    components: ["mech-090", "mech-091", "mech-092", "mech-093"],
    basePrice: 85000,
    laborHours: 120
  },
  {
    name: "Fire Sprinkler Riser Assembly",
    category: "Mechanical Systems",
    description: "Fire sprinkler riser with flow switches and alarms",
    components: ["mech-094", "mech-095", "mech-096", "mech-097"],
    basePrice: 95000,
    laborHours: 140
  },
  {
    name: "Standpipe Assembly",
    category: "Mechanical Systems",
    description: "Standpipe system for fire department use",
    components: ["mech-098", "mech-099", "mech-100", "mech-101"],
    basePrice: 120000,
    laborHours: 180
  },
  {
    name: "Fire Water Storage Assembly",
    category: "Mechanical Systems",
    description: "Fire water storage tank and distribution",
    components: ["mech-102", "mech-103", "mech-104", "mech-105"],
    basePrice: 280000,
    laborHours: 300
  },
  {
    name: "Halon Replacement Assembly",
    category: "Mechanical Systems",
    description: "Halon replacement with clean agent systems",
    components: ["mech-057", "mech-058", "mech-106", "mech-107"],
    basePrice: 420000,
    laborHours: 320
  },
  {
    name: "CO2 Suppression Assembly",
    category: "Mechanical Systems",
    description: "Carbon dioxide fire suppression for electrical rooms",
    components: ["mech-108", "mech-109", "mech-110", "mech-111"],
    basePrice: 380000,
    laborHours: 300
  },
  {
    name: "Hypoxic Air Assembly",
    category: "Mechanical Systems",
    description: "Hypoxic air fire prevention system",
    components: ["mech-112", "mech-113", "mech-114", "mech-115"],
    basePrice: 520000,
    laborHours: 400
  },
  {
    name: "Fire Curtain Assembly",
    category: "Mechanical Systems",
    description: "Fire curtain systems for large openings",
    components: ["mech-116", "mech-117", "mech-118", "mech-119"],
    basePrice: 180000,
    laborHours: 200
  },
  {
    name: "Fire Door Assembly",
    category: "Mechanical Systems",
    description: "Fire doors with automatic closing mechanisms",
    components: ["mech-120", "mech-121", "mech-122", "mech-123"],
    basePrice: 95000,
    laborHours: 140
  },
  {
    name: "Fire Damper Assembly",
    category: "Mechanical Systems",
    description: "Fire and smoke dampers in ductwork",
    components: ["mech-124", "mech-125", "mech-066", "mech-067"],
    basePrice: 85000,
    laborHours: 120
  },
  {
    name: "Emergency Responder Radio Assembly",
    category: "Mechanical Systems",
    description: "Emergency responder radio enhancement system",
    components: ["mech-068", "mech-069", "mech-070", "mech-071"],
    basePrice: 180000,
    laborHours: 220
  },
  {
    name: "Fire Command Center Assembly",
    category: "Mechanical Systems",
    description: "Fire command center with controls and communications",
    components: ["mech-072", "mech-073", "mech-074", "mech-075"],
    basePrice: 120000,
    laborHours: 160
  },
  {
    name: "Elevator Recall Assembly",
    category: "Mechanical Systems",
    description: "Elevator recall system for fire emergencies",
    components: ["mech-076", "mech-077", "mech-096", "mech-097"],
    basePrice: 65000,
    laborHours: 100
  },
  {
    name: "Fire Safety Testing Assembly",
    category: "Mechanical Systems",
    description: "Fire safety system testing and commissioning",
    components: ["mech-051", "mech-052", "mech-096", "mech-097"],
    basePrice: 85000,
    laborHours: 200
  },
  {
    name: "Marine Fire Assembly",
    category: "Mechanical Systems",
    description: "Marine fire suppression for waterfront facilities",
    components: ["mech-078", "mech-079", "mech-080", "mech-081"],
    basePrice: 320000,
    laborHours: 350
  },
  {
    name: "Aircraft Hangar Fire Assembly",
    category: "Mechanical Systems",
    description: "Aircraft hangar fire suppression with foam systems",
    components: ["mech-071", "mech-072", "mech-082", "mech-083"],
    basePrice: 850000,
    laborHours: 600
  },
  
  // Specialized Mechanical Assemblies (20)
  {
    name: "Process Cooling Assembly",
    category: "Mechanical Systems",
    description: "Dedicated process cooling for high-density equipment",
    components: ["mech-069", "mech-070", "mech-071", "mech-089", "mech-090"],
    basePrice: 650000,
    laborHours: 400
  },
  {
    name: "Glycol Cooling Assembly",
    category: "Mechanical Systems",
    description: "Glycol cooling system for freeze protection",
    components: ["mech-072", "mech-073", "mech-074", "mech-091", "mech-092"],
    basePrice: 380000,
    laborHours: 300
  },
  {
    name: "Building Automation Assembly",
    category: "Mechanical Systems",
    description: "Complete building automation and control system",
    components: ["mech-075", "mech-076", "mech-077", "mech-093", "mech-094"],
    basePrice: 450000,
    laborHours: 600
  },
  {
    name: "Energy Management Assembly",
    category: "Mechanical Systems",
    description: "Energy monitoring and management system",
    components: ["mech-095", "mech-096", "mech-097", "mech-098"],
    basePrice: 180000,
    laborHours: 240
  },
  {
    name: "Industrial Refrigeration Assembly",
    category: "Mechanical Systems",
    description: "Industrial refrigeration for cold storage and processing",
    components: ["mech-004", "mech-005", "mech-006", "mech-099"],
    basePrice: 850000,
    laborHours: 600
  },
  {
    name: "Ice Rink Assembly",
    category: "Mechanical Systems",
    description: "Ice rink refrigeration and dehumidification",
    components: ["mech-007", "mech-008", "mech-100", "mech-101"],
    basePrice: 680000,
    laborHours: 520
  },
  {
    name: "Clean Room Environmental Assembly",
    category: "Mechanical Systems",
    description: "Clean room environmental control systems",
    components: ["mech-122", "mech-123", "mech-102", "mech-103"],
    basePrice: 520000,
    laborHours: 450
  },
  {
    name: "Laboratory HVAC Assembly",
    category: "Mechanical Systems",
    description: "Laboratory HVAC with 100% outside air and fume hood controls",
    components: ["mech-118", "mech-119", "mech-104", "mech-105"],
    basePrice: 420000,
    laborHours: 400
  },
  {
    name: "Hospital HVAC Assembly",
    category: "Mechanical Systems",
    description: "Hospital HVAC with positive and negative pressure rooms",
    components: ["mech-015", "mech-016", "mech-106", "mech-107"],
    basePrice: 680000,
    laborHours: 600
  },
  {
    name: "Pharmaceutical HVAC Assembly",
    category: "Mechanical Systems",
    description: "Pharmaceutical manufacturing HVAC with containment",
    components: ["mech-122", "mech-123", "mech-108", "mech-109"],
    basePrice: 850000,
    laborHours: 700
  },
  {
    name: "Food Processing HVAC Assembly",
    category: "Mechanical Systems",
    description: "Food processing facility HVAC with sanitary design",
    components: ["mech-110", "mech-111", "mech-112", "mech-113"],
    basePrice: 420000,
    laborHours: 400
  },
  {
    name: "Brewery HVAC Assembly",
    category: "Mechanical Systems",
    description: "Brewery HVAC with fermentation temperature control",
    components: ["mech-114", "mech-115", "mech-116", "mech-117"],
    basePrice: 320000,
    laborHours: 350
  },
  {
    name: "Greenhouse Climate Assembly",
    category: "Mechanical Systems",
    description: "Greenhouse climate control with CO2 enrichment",
    components: ["mech-118", "mech-119", "mech-120", "mech-121"],
    basePrice: 280000,
    laborHours: 300
  },
  {
    name: "Mining Ventilation Assembly",
    category: "Mechanical Systems",
    description: "Mine ventilation with dust control and air monitoring",
    components: ["mech-114", "mech-115", "mech-122", "mech-123"],
    basePrice: 520000,
    laborHours: 600
  },
  {
    name: "Tunnel Ventilation Assembly",
    category: "Mechanical Systems",
    description: "Tunnel ventilation with emergency smoke removal",
    components: ["mech-110", "mech-111", "mech-124", "mech-125"],
    basePrice: 850000,
    laborHours: 700
  },
  {
    name: "Ship HVAC Assembly",
    category: "Mechanical Systems",
    description: "Marine HVAC systems for ships and offshore platforms",
    components: ["mech-097", "mech-098", "mech-099", "mech-100"],
    basePrice: 420000,
    laborHours: 450
  },
  {
    name: "Nuclear HVAC Assembly",
    category: "Mechanical Systems",
    description: "Nuclear facility HVAC with containment and filtration",
    components: ["mech-122", "mech-123", "mech-124", "mech-125"],
    basePrice: 1200000,
    laborHours: 1000
  },
  {
    name: "Oil Rig HVAC Assembly",
    category: "Mechanical Systems",
    description: "Offshore oil rig HVAC with explosion-proof equipment",
    components: ["mech-101", "mech-102", "mech-103", "mech-104"],
    basePrice: 680000,
    laborHours: 550
  },
  {
    name: "Space Facility HVAC Assembly",
    category: "Mechanical Systems",
    description: "Space facility HVAC with clean room and critical environments",
    components: ["mech-122", "mech-123", "mech-105", "mech-106"],
    basePrice: 1500000,
    laborHours: 1200
  },
  {
    name: "Semiconductor Fab HVAC Assembly",
    category: "Mechanical Systems",
    description: "Semiconductor fabrication HVAC with ultra-clean environments",
    components: ["mech-122", "mech-123", "mech-107", "mech-108"],
    basePrice: 2000000,
    laborHours: 1500
  }
];

// Quality tiers for components
const qualityTiers = {
  "Basic": { multiplier: 0.8, description: "Standard quality components" },
  "Standard": { multiplier: 1.0, description: "Industry standard components" },
  "Premium": { multiplier: 1.3, description: "High-quality enterprise components" },
  "Enterprise": { multiplier: 1.6, description: "Top-tier enterprise components" }
};

export class DataGenerationService {
  // Generate comprehensive component data
  async generateComponents(userId: string) {
    const components = [];
    const componentQualityTiers = [];
    
    for (const [category, categoryComponents] of Object.entries(dataCenterComponents)) {
      for (const component of categoryComponents) {
        // Select realistic skill level based on distribution
        const skillLevels = ['entry', 'intermediate', 'expert', 'specialist'];
        const skillDistribution = [0.3, 0.4, 0.25, 0.05]; // 30% entry, 40% intermediate, 25% expert, 5% specialist
        
        let skillLevel;
        const rand = Math.random();
        if (rand < skillDistribution[0]) {
          skillLevel = skillLevels[0];
        } else if (rand < skillDistribution[0] + skillDistribution[1]) {
          skillLevel = skillLevels[1];
        } else if (rand < skillDistribution[0] + skillDistribution[1] + skillDistribution[2]) {
          skillLevel = skillLevels[2];
        } else {
          skillLevel = skillLevels[3];
        }
        
        const fullComponent = {
          id: component.id,
          name: component.name,
          category,
          description: `Professional ${component.name.toLowerCase()} for datacenter construction`,
          unit: component.unit,
          labor_hours: component.laborHours,
          skill_level: skillLevel,
          vendor_info: {
            primary_vendor: "Enterprise Solutions Inc",
            backup_vendor: "DataCenter Components Ltd",
            lead_time: "8-12 weeks"
          },
          lead_time_days: 60,
          technical_specs: {
            operating_temperature: "-10°C to 50°C",
            humidity_range: "10% to 90%",
            certification: "UL Listed, CE Marked"
          },
          material_waste_factor: 0.05,
          installation_notes: `Professional installation required for ${component.name}`,
          power_requirements: category === "Electrical Infrastructure" ? { voltage: "480V", phases: 3 } : null,
          cooling_requirements: category === "Mechanical Systems" ? { ambient_temp: "25°C", airflow: "1000 CFM" } : null,
          physical_dimensions: { width: "24in", height: "48in", depth: "36in" },
          environmental_specs: { ip_rating: "IP54", vibration: "IEC 60068-2-6" },
          warranty_years: 5,
          maintenance_schedule: { frequency: "Annual", type: "Preventive" },
          certifications: ["UL", "CE", "FCC"],
          regional_availability: ["global"],
          user_id: userId
        };
        
        components.push(fullComponent);
        
        // Generate quality tiers for each component
        for (const [tierName, tierData] of Object.entries(qualityTiers)) {
          componentQualityTiers.push({
            id: `${component.id}-${tierName.toLowerCase()}`,
            component_id: component.id,
            name: tierName,
            unit_cost: Math.round((component.basePrice * tierData.multiplier) / 100), // Scale down by 100x to fit DB limits
            description: tierData.description
          });
        }
      }
    }
    
    return { components, componentQualityTiers };
  }
  
  // Generate assembly data
  async generateAssemblies(userId: string) {
    const assemblyData = [];
    
    // Create expanded assembly templates (150 total)
    const expandedTemplates = [...assemblyTemplates];
    
    // Generate variations of base assemblies
    for (let i = 0; i < 142; i++) {
      const baseTemplate = assemblyTemplates[i % assemblyTemplates.length];
      const variation = i % 4;
      
      expandedTemplates.push({
        ...baseTemplate,
        name: `${baseTemplate.name} - Variant ${variation + 1}`,
        description: `${baseTemplate.description} - Configuration ${variation + 1}`,
        basePrice: baseTemplate.basePrice * (0.8 + variation * 0.15),
        laborHours: baseTemplate.laborHours * (0.9 + variation * 0.1)
      });
    }
    
    for (let i = 0; i < expandedTemplates.length; i++) {
      const template = expandedTemplates[i];
      
      const assemblyToInsert = {
        name: template.name,
        description: template.description,
        category_id: null,
        labor_hours: template.laborHours,
        installation_sequence: i + 1,
        user_id: userId
      };
      
      const components = template.components.map(componentId => ({
        component_id: componentId,
        quantity: Math.floor(Math.random() * 5) + 1,
        unit: "each",
        notes: `Required for ${template.name}`,
        user_id: userId
      }));
      
      assemblyData.push({ assembly: assemblyToInsert, components });
    }
    
    return assemblyData;
  }
  
  // Generate project data
  async generateProjects(userId: string) {
    const projectData = [];
    
    for (let i = 0; i < 15; i++) {
      const projectType = projectTypes[i % projectTypes.length];
      const region = regions[i % regions.length];
      const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 18 + Math.floor(Math.random() * 18)); // 18-36 months
      
      const baseBudget = 50000000 + Math.random() * 40000000; // $50M - $90M
      const totalBudget = Math.round(baseBudget * projectType.multiplier * region.multiplier);
      
      const projectToInsert = {
        name: `${region.name} ${projectType.type} Data Center`,
        description: `100MW ${projectType.description} in ${region.name}`,
        project_type: projectType.type,
        status: i < 3 ? "completed" : i < 6 ? "construction" : i < 9 ? "procurement" : i < 12 ? "design" : "planning",
        location: region.name,
        capacity_mw: 100,
        total_budget: totalBudget,
        start_date: startDate.toISOString().split('T')[0],
        target_completion_date: endDate.toISOString().split('T')[0],
        user_id: userId
      };
      
      // Generate project phases, estimates, and related data
      const phases = [
        { name: "Site Preparation", allocation: 0.05, duration: 3 },
        { name: "Foundation & Structure", allocation: 0.15, duration: 6 },
        { name: "Electrical Infrastructure", allocation: 0.40, duration: 8 },
        { name: "Mechanical Systems", allocation: 0.25, duration: 6 },
        { name: "IT Infrastructure", allocation: 0.10, duration: 4 },
        { name: "Testing & Commissioning", allocation: 0.05, duration: 3 }
      ];
      
      const projectPhases = [];
      let phaseStartDate = new Date(startDate);
      for (let j = 0; j < phases.length; j++) {
        const phase = phases[j];
        const phaseEndDate = new Date(phaseStartDate);
        phaseEndDate.setMonth(phaseEndDate.getMonth() + phase.duration);
        
        projectPhases.push({
          name: phase.name,
          description: `${phase.name} phase for ${projectToInsert.name}`,
          budget_allocation: Math.round(totalBudget * phase.allocation),
          start_date: phaseStartDate.toISOString().split('T')[0],
          end_date: phaseEndDate.toISOString().split('T')[0],
          status: i < 5 ? (j < 3 ? "completed" : j === 3 ? "active" : "planned") : "planned",
          sort_order: j
        });
        
        phaseStartDate = new Date(phaseEndDate);
      }
      
      // Generate estimate
      const estimateToInsert = {
        name: `${projectToInsert.name} - Baseline Estimate`,
        total_cost: totalBudget,
        user_id: userId
      };
      
      // Generate estimate items (500 components per project)
      const allComponents = Object.values(dataCenterComponents).flat();
      const selectedComponents = this.selectComponentsForProject(allComponents, 500, projectType, region);
      
      const estimateItems = [];
      for (const component of selectedComponents) {
        const tierName = ["Basic", "Standard", "Premium", "Enterprise"][Math.floor(Math.random() * 4)];
        const tierMultiplier = qualityTiers[tierName].multiplier;
        const quantity = Math.floor(Math.random() * 100) + 1;
        const unitCost = Math.round(component.basePrice * tierMultiplier * region.multiplier);
        const totalCost = quantity * unitCost;
        
        estimateItems.push({
          component_id: component.id,
          component_name: component.name,
          quality_tier_id: `${component.id}-${tierName.toLowerCase()}`,
          quality_tier_name: tierName,
          quality_tier_description: qualityTiers[tierName].description,
          quality_tier_unit_cost: unitCost,
          quantity,
          unit: component.unit,
          total_cost: totalCost
        });
      }
      
      // Generate actual costs and change orders data (will be linked after project creation)
      const actualCosts = [];
      const changeOrders = [];
      
      // Generate actual costs with variance (only for projects that have started)
      if (i < 10) {
        for (const item of estimateItems) {
          if (Math.random() < 0.7) { // 70% of items have actual costs
            const varianceFactor = this.generateVarianceFactor();
            const actualUnitCost = Math.round(item.quality_tier_unit_cost * varianceFactor);
            const actualQuantity = Math.round(item.quantity * (0.95 + Math.random() * 0.1));
            
            actualCosts.push({
              component_id: item.component_id,
              actual_quantity: actualQuantity,
              actual_unit_cost: actualUnitCost,
              actual_total_cost: actualQuantity * actualUnitCost,
              cost_date: this.getRandomDateInProject(startDate, endDate),
              vendor_name: this.getRandomVendor(),
              invoice_number: `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              purchase_order_number: `PO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              notes: `Actual cost for ${item.component_name}`,
              user_id: userId
            });
          }
        }
        
        // Generate change orders
        for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
          const costImpact = (Math.random() - 0.5) * Math.min(totalBudget * 0.05, 5000000); // ±5% of budget, max $5M
          const scheduleImpact = Math.floor((Math.random() - 0.5) * 60); // ±60 days
          
          changeOrders.push({
            change_order_number: `CO-P${String(i + 1).padStart(2, '0')}-${String(j + 1).padStart(3, '0')}`,
            description: this.getRandomChangeOrderDescription(),
            cost_impact: Math.round(costImpact),
            schedule_impact_days: scheduleImpact,
            status: ["pending", "approved", "rejected"][Math.floor(Math.random() * 3)],
            requested_by: userId,
            approved_by: Math.random() > 0.5 ? userId : null,
            approved_date: Math.random() > 0.5 ? this.getRandomDateInProject(startDate, endDate) : null
          });
        }
      }
      
      projectData.push({
        project: projectToInsert,
        phases: projectPhases,
        estimate: estimateToInsert,
        estimateItems,
        actualCosts,
        changeOrders,
        projectIndex: i
      });
    }
    
    return projectData;
  }
  
  private selectComponentsForProject(allComponents: any[], count: number, projectType: any, region: any) {
    // Shuffle and select components with some logic for project type
    const shuffled = [...allComponents].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  private generateVarianceFactor() {
    const rand = Math.random();
    if (rand < 0.7) {
      // 70% within ±10%
      return 0.9 + Math.random() * 0.2;
    } else if (rand < 0.9) {
      // 20% within ±20%
      return 0.8 + Math.random() * 0.4;
    } else {
      // 10% with significant variance ±50%
      return 0.5 + Math.random() * 1.0;
    }
  }
  
  private getRandomDateInProject(startDate: Date, endDate: Date) {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime).toISOString().split('T')[0];
  }
  
  private getRandomVendor() {
    const vendors = [
      "Schneider Electric", "ABB Group", "Eaton Corporation", "General Electric",
      "Siemens AG", "Caterpillar Inc", "Cummins Inc", "Johnson Controls",
      "Trane Technologies", "Carrier Global", "York International", "Daikin",
      "Cisco Systems", "HPE", "Dell Technologies", "IBM Corporation"
    ];
    return vendors[Math.floor(Math.random() * vendors.length)];
  }
  
  private getRandomChangeOrderDescription() {
    const descriptions = [
      "Additional cooling capacity required due to higher heat loads",
      "Electrical service upgrade for increased power demand",
      "Site conditions required additional foundation work",
      "Fire suppression system upgrade per local code requirements",
      "Network infrastructure expansion for redundancy",
      "HVAC system modifications for energy efficiency",
      "Security system enhancement per client requirements",
      "Structural modifications for equipment placement",
      "Utility connection delays requiring temporary solutions",
      "Equipment substitution due to supply chain issues"
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
  
  // Main generation method
  async generateAllData(userId: string) {
    console.log("Starting comprehensive data generation...");
    
    try {
      // Step 1: Generate components and quality tiers
      console.log("Generating components and quality tiers...");
      const { components, componentQualityTiers } = await this.generateComponents(userId);
      
      // Step 2: Generate assemblies
      console.log("Generating assemblies...");
      const assemblyData = await this.generateAssemblies(userId);
      
      // Step 3: Generate projects and related data
      console.log("Generating projects and related data...");
      const projectData = await this.generateProjects(userId);
      
      // Insert data into database
      console.log("Inserting data into database...");
      
      // Insert components using upsert to handle duplicates
      const { error: componentsError } = await supabase
        .from('components')
        .upsert(components, { onConflict: 'id' });
      
      if (componentsError) {
        console.error("Error inserting components:", componentsError);
        throw componentsError;
      }
      
      // Insert quality tiers using upsert to handle duplicates
      const { error: tiersError } = await supabase
        .from('quality_tiers')
        .upsert(componentQualityTiers, { onConflict: 'id' });
      
      if (tiersError) {
        console.error("Error inserting quality tiers:", tiersError);
        throw tiersError;
      }
      
      // Clear existing user's assemblies for re-generation
      await supabase
        .from('assembly_components')
        .delete()
        .eq('user_id', userId);
        
      await supabase
        .from('assemblies')
        .delete()
        .eq('user_id', userId);
      
      // Insert assemblies and get returned UUIDs
      console.log("Inserting assemblies...");
      const insertedAssemblies = [];
      
      for (const assemblyItem of assemblyData) {
        const { data: assemblyResult, error: assemblyError } = await supabase
          .from('assemblies')
          .insert(assemblyItem.assembly)
          .select('id')
          .single();
        
        if (assemblyError) {
          console.error("Error inserting assembly:", assemblyError);
          throw assemblyError;
        }
        
        insertedAssemblies.push({
          id: assemblyResult.id,
          components: assemblyItem.components
        });
      }
      
      // Insert assembly components with proper UUID references
      const allAssemblyComponents = [];
      for (const assembly of insertedAssemblies) {
        for (const component of assembly.components) {
          allAssemblyComponents.push({
            ...component,
            assembly_id: assembly.id
          });
        }
      }
      
      if (allAssemblyComponents.length > 0) {
        const { error: assemblyComponentsError } = await supabase
          .from('assembly_components')
          .insert(allAssemblyComponents);
        
        if (assemblyComponentsError) {
          console.error("Error inserting assembly components:", assemblyComponentsError);
          throw assemblyComponentsError;
        }
      }
      
      // Clear existing user's project data for re-generation
      await supabase.from('change_orders').delete().eq('requested_by', userId);
      await supabase.from('actual_costs').delete().eq('user_id', userId);
      
      const { data: existingEstimates } = await supabase
        .from('estimates')
        .select('id')
        .eq('user_id', userId);
      
      if (existingEstimates && existingEstimates.length > 0) {
        await supabase.from('estimate_items').delete().in('estimate_id', existingEstimates.map(e => e.id));
        await supabase.from('estimates').delete().eq('user_id', userId);
      }
      
      await supabase.from('project_phases').delete().in('project_id', 
        (await supabase.from('projects').select('id').eq('user_id', userId)).data?.map(p => p.id) || []
      );
      await supabase.from('projects').delete().eq('user_id', userId);
      
      // Insert projects and related data with proper UUID handling
      console.log("Inserting projects and related data...");
      
      for (const projectItem of projectData) {
        // Insert project and get UUID
        const { data: projectResult, error: projectError } = await supabase
          .from('projects')
          .insert(projectItem.project)
          .select('id')
          .single();
        
        if (projectError) {
          console.error("Error inserting project:", projectError);
          throw projectError;
        }
        
        const projectId = projectResult.id;
        
        // Insert project phases with project UUID reference
        const phasesWithProjectId = projectItem.phases.map(phase => ({
          ...phase,
          project_id: projectId
        }));
        
        const { error: phasesError } = await supabase
          .from('project_phases')
          .insert(phasesWithProjectId);
        
        if (phasesError) {
          console.error("Error inserting project phases:", phasesError);
          throw phasesError;
        }
        
        // Insert estimate and get UUID
        const { data: estimateResult, error: estimateError } = await supabase
          .from('estimates')
          .insert(projectItem.estimate)
          .select('id')
          .single();
        
        if (estimateError) {
          console.error("Error inserting estimate:", estimateError);
          throw estimateError;
        }
        
        const estimateId = estimateResult.id;
        
        // Insert estimate items with estimate UUID reference
        const itemsWithEstimateId = projectItem.estimateItems.map(item => ({
          ...item,
          estimate_id: estimateId
        }));
        
        const { error: itemsError } = await supabase
          .from('estimate_items')
          .insert(itemsWithEstimateId);
        
        if (itemsError) {
          console.error("Error inserting estimate items:", itemsError);
          throw itemsError;
        }
        
        // Insert actual costs with project UUID reference
        if (projectItem.actualCosts.length > 0) {
          const costsWithProjectId = projectItem.actualCosts.map(cost => ({
            ...cost,
            project_id: projectId
          }));
          
          const { error: costsError } = await supabase
            .from('actual_costs')
            .insert(costsWithProjectId);
          
          if (costsError) {
            console.error("Error inserting actual costs:", costsError);
            throw costsError;
          }
        }
        
        // Insert change orders with project UUID reference
        if (projectItem.changeOrders.length > 0) {
          const ordersWithProjectId = projectItem.changeOrders.map(order => ({
            ...order,
            project_id: projectId
          }));
          
          const { error: ordersError } = await supabase
            .from('change_orders')
            .insert(ordersWithProjectId);
          
          if (ordersError) {
            console.error("Error inserting change orders:", ordersError);
            throw ordersError;
          }
        }
      }
      
      console.log("Data generation completed successfully!");
      
      // Calculate totals for summary
      const totalProjects = projectData.length;
      const totalPhases = projectData.reduce((sum, p) => sum + p.phases.length, 0);
      const totalEstimates = projectData.length; // One estimate per project
      const totalEstimateItems = projectData.reduce((sum, p) => sum + p.estimateItems.length, 0);
      const totalActualCosts = projectData.reduce((sum, p) => sum + p.actualCosts.length, 0);
      const totalChangeOrders = projectData.reduce((sum, p) => sum + p.changeOrders.length, 0);
      
      return {
        success: true,
        summary: {
          components: components.length,
          qualityTiers: componentQualityTiers.length,
          assemblies: assemblyData.length,
          assemblyComponents: allAssemblyComponents.length,
          projects: totalProjects,
          projectPhases: totalPhases,
          estimates: totalEstimates,
          estimateItems: totalEstimateItems,
          actualCosts: totalActualCosts,
          changeOrders: totalChangeOrders
        }
      };
      
    } catch (error) {
      console.error("Error in data generation:", error);
      throw error;
    }
  }
}

export const dataGenerationService = new DataGenerationService();