import { Component } from '@/types/estimate';

export const unitRateLibrary: Component[] = [
  // Foundation
  {
    id: 'foundation-concrete-slab',
    name: 'Concrete Slab Foundation',
    category: 'Foundation',
    description: 'Reinforced concrete slab foundation with vapor barrier',
    unit: 'sq ft',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 4.50,
        description: '4" thick concrete slab, basic finish'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 6.25,
        description: '6" thick concrete slab, smooth finish, rebar reinforcement'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 8.75,
        description: '6" thick concrete slab, polished finish, fiber mesh reinforcement'
      }
    ]
  },
  {
    id: 'foundation-crawlspace',
    name: 'Crawlspace Foundation',
    category: 'Foundation',
    description: 'Concrete block crawlspace with footings',
    unit: 'lin ft',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 28.50,
        description: 'Standard concrete block, basic waterproofing'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 35.75,
        description: 'Reinforced concrete block, improved waterproofing'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 45.25,
        description: 'Insulated concrete forms, premium waterproofing system'
      }
    ]
  },

  // Framing
  {
    id: 'framing-wall',
    name: 'Wall Framing',
    category: 'Framing',
    description: 'Wood frame wall construction with plates and studs',
    unit: 'sq ft',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 3.25,
        description: '2x4 construction grade lumber, 16" on center'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 4.50,
        description: '2x6 construction grade lumber, 16" on center'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 6.75,
        description: '2x6 engineered lumber, advanced framing techniques'
      }
    ]
  },
  {
    id: 'framing-roof',
    name: 'Roof Framing',
    category: 'Framing',
    description: 'Roof truss or rafter construction',
    unit: 'sq ft',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 2.85,
        description: 'Standard roof trusses, 24" on center'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 4.25,
        description: 'Engineered roof trusses, 16" on center'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 6.50,
        description: 'Custom engineered trusses with cathedral ceiling'
      }
    ]
  },

  // Roofing
  {
    id: 'roofing-asphalt-shingles',
    name: 'Asphalt Shingles',
    category: 'Roofing',
    description: 'Asphalt shingle roofing system with underlayment',
    unit: 'sq ft',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 3.75,
        description: '25-year architectural shingles, felt underlayment'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 5.50,
        description: '30-year dimensional shingles, synthetic underlayment'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 7.95,
        description: '50-year designer shingles, ice & water shield'
      }
    ]
  },

  // Electrical
  {
    id: 'electrical-rough-in',
    name: 'Electrical Rough-In',
    category: 'Electrical',
    description: 'Electrical wiring rough-in with panel and circuits',
    unit: 'sq ft',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 2.25,
        description: '100 amp panel, standard outlets and switches'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 3.15,
        description: '200 amp panel, GFCI outlets, upgraded fixtures'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 4.75,
        description: '400 amp panel, smart switches, whole-house surge protection'
      }
    ]
  },

  // Plumbing
  {
    id: 'plumbing-rough-in',
    name: 'Plumbing Rough-In',
    category: 'Plumbing',
    description: 'Water supply and drain lines rough-in',
    unit: 'sq ft',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 2.85,
        description: 'PEX supply lines, PVC drain lines'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 3.75,
        description: 'PEX-A supply lines, ABS drain lines, shut-off valves'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 5.25,
        description: 'Copper supply lines, cast iron drains, manifold system'
      }
    ]
  },

  // HVAC
  {
    id: 'hvac-system',
    name: 'HVAC System',
    category: 'HVAC',
    description: 'Heating, ventilation, and air conditioning system',
    unit: 'sq ft',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 4.50,
        description: 'Standard efficiency unit, metal ductwork'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 6.75,
        description: 'High efficiency unit, insulated ductwork'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 9.25,
        description: 'Variable speed system, zoned controls, air filtration'
      }
    ]
  },

  // Flooring
  {
    id: 'flooring-hardwood',
    name: 'Hardwood Flooring',
    category: 'Flooring',
    description: 'Solid hardwood flooring installation',
    unit: 'sq ft',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 6.50,
        description: 'Oak strip flooring, basic finish'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 8.75,
        description: 'Select grade hardwood, site-finished'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 12.50,
        description: 'Exotic hardwood, pre-finished, custom stain'
      }
    ]
  },

  // Windows & Doors
  {
    id: 'windows-vinyl',
    name: 'Vinyl Windows',
    category: 'Windows & Doors',
    description: 'Double-hung vinyl windows with screens',
    unit: 'each',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 285.00,
        description: 'Single-hung, basic hardware'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 425.00,
        description: 'Double-hung, low-E glass, upgraded hardware'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 675.00,
        description: 'Triple-pane, argon fill, lifetime warranty'
      }
    ]
  },

  // Insulation
  {
    id: 'insulation-fiberglass',
    name: 'Fiberglass Insulation',
    category: 'Insulation',
    description: 'Fiberglass batt insulation for walls and attic',
    unit: 'sq ft',
    qualityTiers: [
      {
        id: 'basic',
        name: 'Basic',
        unitCost: 0.75,
        description: 'R-13 wall, R-30 attic insulation'
      },
      {
        id: 'standard',
        name: 'Standard',
        unitCost: 1.25,
        description: 'R-15 wall, R-38 attic insulation'
      },
      {
        id: 'premium',
        name: 'Premium',
        unitCost: 1.85,
        description: 'R-21 wall, R-49 attic, blown-in application'
      }
    ]
  }
];

export const componentCategories = [
  'Foundation',
  'Framing', 
  'Roofing',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Flooring',
  'Windows & Doors',
  'Insulation',
  'Drywall',
  'Painting',
  'Exterior'
] as const;