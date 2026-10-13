import { GeneratedIdea, ManufacturingPlan } from '../types';

export const SAMPLE_CHALLENGES = [
  {
    id: 'c1',
    title: 'Biodegradable Plant Pot from Agro-Waste',
    category: 'Bio-materials & Eco-Tech',
    difficulty: 'Accessible',
    objective: 'Replace single-use petroleum plastic nursery pots with rice husk & mycelium composite pots that naturally compost into soil.',
    targetCost: '< $0.40 / unit',
    suggestedMaterials: ['Rice husk', 'Wheat straw', 'Mycelium binder', 'Natural wax seal']
  },
  {
    id: 'c2',
    title: 'Micro-Factory Automated Liquid Filling Station',
    category: 'Automation & Robotics',
    difficulty: 'Intermediate',
    objective: 'Design a low-cost, food-grade peristaltic filling and capping rig for local artisanal juice and sanitizing fluid bottlers.',
    targetCost: '< $1,200 rig CapEx',
    suggestedMaterials: ['304 Stainless sheet', 'Food-grade silicone tubing', 'NEMA 23 steppers', 'Arduino/ESP32 PLC']
  },
  {
    id: 'c3',
    title: 'Modular Aluminum Electronic Test Bench Enclosure',
    category: 'Sheet Metal & CNC',
    difficulty: 'Intermediate',
    objective: 'Create a flat-pack, high-shielding EMI enclosure for lab power supplies with integrated heat sinks and tool-less access panels.',
    targetCost: '< $18.50 / unit at 200 qty',
    suggestedMaterials: ['5052-H32 Aluminum sheet', 'Extruded heatsink profile', 'Captive thumb screws']
  },
  {
    id: 'c4',
    title: 'Ultra-Lightweight Drone Arm Chassis',
    category: 'Aerospace & Composites',
    difficulty: 'Advanced',
    objective: 'Optimize a quadcopter arm using generative design topology, balancing vibration damping and crash impact resistance.',
    targetCost: '< $28.00 / unit',
    suggestedMaterials: ['Toray 3K Carbon fiber weave', 'CNC milled 7075-T6 aluminum clamps', 'Titanium M3 hardware']
  }
];

export const SAMPLE_IDEAS: GeneratedIdea[] = [
  {
    id: 'idea-agro-pot',
    title: 'Bio-Circular Agro-Waste Planter Pot',
    mode: 'waste-to-value',
    problemAddressed: 'Millions of single-use black plastic nursery pots end up in landfills, while tons of agricultural rice husks and sugarcane bagasse are burned as waste.',
    proposedSolution: 'A pressure-molded biodegradable nursery pot utilizing crushed agricultural waste and non-toxic potato starch binder with a water-resistant soy-wax barrier.',
    materials: ['Rice husk fibers (65%)', 'Sugarcane bagasse (20%)', 'Modified potato starch binder (12%)', 'Soybean wax emulsion (3%)'],
    manufacturingMethod: 'Pulp Slurry Wet-Press Thermoforming with Heated Compression Dies (140°C)',
    estimatedComplexity: 'Low',
    complexityScore: 3,
    estimatedCostPerUnit: '$0.32 - $0.45 per unit (at 10,000 run)',
    estimatedCycleTime: '28 seconds per 4-cavity press cycle',
    advantages: [
      'Decomposes completely in garden soil within 90 days after transplanting (plant-in-ground design)',
      'Raw agricultural feedstock cost is near-zero from local farming cooperatives',
      'Negative carbon footprint compared to petroleum polypropylene pots',
      'High root aeration prevents root spiraling'
    ],
    limitations: [
      'Moisture barrier lasts approximately 60-90 days in wet greenhouse nursery environments before softening begins',
      'Lower drop impact resistance compared to injection-molded flexible plastic'
    ],
    nextSteps: [
      'Conduct moisture retention and root permeability trials',
      'CNC mill aluminum 2-cavity thermoforming prototype die',
      'Validate soil biodegradation toxicity via seed germination testing'
    ],
    createdAt: '2026-10-13T10:00:00Z',
    isDemo: true
  },
  {
    id: 'idea-drone-arm',
    title: 'Topology-Optimized Lightweight Drone Arm',
    mode: 'product-improvement',
    problemAddressed: 'Standard carbon fiber tube drone arms suffer from high motor vibration resonance and require heavy CNC aluminum clamping blocks.',
    proposedSolution: 'Monocoque generative hollow arm with internal ribbing 3D-printed using Continuous Carbon Fiber FDM or DMLS Aluminum with integrated motor mount.',
    materials: ['Onyx (Nylon with chopped carbon fiber)', 'Continuous Carbon Fiber Strand Infill', 'Titanium M3 Helicoil Inserts'],
    manufacturingMethod: 'Continuous Fiber Fabrication (CFF) Additive Manufacturing followed by precision reaming',
    estimatedComplexity: 'Medium',
    complexityScore: 6,
    estimatedCostPerUnit: '$14.20 per unit (prototyping) / $8.50 (batch of 100)',
    estimatedCycleTime: '2 hours 15 mins per dual-part build platform',
    advantages: [
      '38% lighter than conventional carbon tube + aluminum clamp assemblies',
      'Internal wire routing channels protect motor ESC cables from propeller strikes',
      'Anisotropic carbon layups specifically absorb high-frequency motor harmonics'
    ],
    limitations: [
      'Slower production throughput compared to high-pressure injection molding',
      'Requires dedicated industrial continuous fiber printing hardware'
    ],
    nextSteps: [
      'Run Finite Element Analysis (FEA) under 4G motor thrust loading',
      'Perform accelerometer vibration sweep test across 0 - 20,000 RPM',
      'Drop test arm from 5 meters onto concrete surface'
    ],
    createdAt: '2026-10-13T11:30:00Z',
    isDemo: true
  },
  {
    id: 'idea-liquid-filler',
    title: 'Smart Automated Peristaltic Benchtop Dispenser',
    mode: 'automation',
    problemAddressed: 'Small batch skincare and craft beverage producers struggle with slow manual syringe filling, inconsistent fill levels, and bottle spillage.',
    proposedSolution: 'A compact table-top twin-head peristaltic dispensing system with closed-loop optical bottle detection and digital stepper dosing accuracy to ±0.2 mL.',
    materials: ['304 Stainless steel 1.5mm chassis', 'Food-grade silicone Norprene tubing', 'NEMA 23 closed-loop steppers', 'Optocoupled microcontroller PCB'],
    manufacturingMethod: 'Sheet metal laser cutting and press brake bending, CNC turned pump rollers, and modular bench assembly',
    estimatedComplexity: 'Medium',
    complexityScore: 5,
    estimatedCostPerUnit: '$380 BOM cost per completed machine',
    estimatedCycleTime: '4 hours total assembly & calibration time per unit',
    advantages: [
      'Fluid contacts only the sterilizable disposable silicone tubing (zero cross-contamination)',
      'Calibrated for viscosity from water up to thick essential oils and syrups',
      'Affordable CapEx for micro-entrepreneurs and college research labs'
    ],
    limitations: [
      'Silicone tubing requires replacement every 500 operating hours due to fatigue wear',
      'Not suitable for high-viscosity pastes without positive displacement booster'
    ],
    nextSteps: [
      'Test dosing repeatability across 100 consecutive 50mL cycle shots',
      'Draft DFM review on stainless chassis bends to reduce part count',
      'Create user quick-start manual and calibration firmware'
    ],
    createdAt: '2026-10-13T12:15:00Z',
    isDemo: true
  }
];

export const SAMPLE_PLANS: ManufacturingPlan[] = [
  {
    id: 'plan-agro-pot',
    title: 'Production Plan: Bio-Circular Agro-Waste Planter Pot (10,000 Units)',
    sourceIdeaId: 'idea-agro-pot',
    productOverview: 'Commercial pilot manufacturing plan for biodegradable 4-inch nursery seedling pots produced from regional agricultural byproducts (rice husks and bagasse) with non-toxic bio-starch binder and water-resistant soy seal.',
    targetVolume: '10,000 Units / Month (Pilot Production)',
    tolerances: 'Wall thickness: 2.2 mm ± 0.3 mm; Rim diameter: 102 mm ± 0.5 mm',
    leadTime: '3 Weeks for Prototype Die; 12 Working Days for Pilot 10K Run',
    bom: [
      {
        id: 'bom-1',
        item: 'Milled Rice Husk & Sugarcane Bagasse Fiber (80 mesh)',
        material: 'Agro-biomass byproduct',
        quantity: 450,
        unit: 'kg',
        unitCost: 0.18,
        supplierCategory: 'Regional Agricultural Co-op',
        notes: 'Pre-washed and dried to <10% moisture content'
      },
      {
        id: 'bom-2',
        item: 'Modified Food-Grade Potato Starch Binder',
        material: 'Bio-adhesive starch powder',
        quantity: 65,
        unit: 'kg',
        unitCost: 0.85,
        supplierCategory: 'Bio-Chemical Supplier',
        notes: 'Soluble in hot water slurry at 75°C'
      },
      {
        id: 'bom-3',
        item: 'Soybean Oil Wax Emulsion (Water Barrier Coating)',
        material: 'Natural lipid emulsion',
        quantity: 20,
        unit: 'kg',
        unitCost: 2.40,
        supplierCategory: 'Eco-Coatings Ltd',
        notes: 'Applied via automated dip or spray mist station'
      },
      {
        id: 'bom-4',
        item: 'Recycled Kraft Master Carton Packaging (Pack of 100)',
        material: 'Corrugated Cardboard',
        quantity: 100,
        unit: 'boxes',
        unitCost: 1.25,
        supplierCategory: 'Local Packaging Supplier',
        notes: 'Fits 100 nested pots per box'
      }
    ],
    machines: [
      {
        name: 'High-Shear Slurry Mixing Tank (500L)',
        type: 'Fluid Preparation & Blending',
        specs: '5.5 kW motor with thermal heating jacket up to 85°C',
        setupTime: '25 minutes',
        operatorSkill: 'Basic Machine Operator'
      },
      {
        name: 'Pulp Slurry Hydraulic Thermoforming Press (4-Cavity, 60T)',
        type: 'Compression & Dewatering Press',
        specs: 'Dual-heated platen dies (140°C), vacuum suction drainage pump',
        setupTime: '45 minutes die alignment',
        operatorSkill: 'Trained Press Technician'
      },
      {
        name: 'Continuous Mesh Tunnel Drying Oven',
        type: 'Convection Moisture Removal',
        specs: 'Electric infrared 12 kW, 6-meter tunnel length',
        setupTime: '15 minutes preheat',
        operatorSkill: 'Basic Machine Operator'
      },
      {
        name: 'Automated Conveyor Dip Coating Station',
        type: 'Surface Barrier Finishing',
        specs: 'Spray mist enclosure with recovery tank',
        setupTime: '10 minutes',
        operatorSkill: 'Basic Machine Operator'
      }
    ],
    processFlow: [
      {
        id: 'step-1',
        stepNumber: 1,
        name: 'Raw Fiber Milling and Particle Size Sieving',
        machineOrTool: 'Industrial Hammer Mill with 80-mesh screen',
        cycleTime: '15 min per 50kg batch',
        parameters: 'Particle size: 150-250 microns; moisture < 10%',
        safetyNotes: 'Respirator N95 required for combustible organic dust',
        qualityCheck: 'Sample sieve test check every 3 batches'
      },
      {
        id: 'step-2',
        stepNumber: 2,
        name: 'Slurry Blending and Gelatinization',
        machineOrTool: '500L High-Shear Mixing Tank',
        cycleTime: '20 min mix cycle',
        parameters: 'Temperature: 75°C; Solid ratio: 6.5% solids in water',
        safetyNotes: 'Hot liquid splash hazard: face shield and apron',
        qualityCheck: 'Viscosity cup check (Zahn cup #4 at 25s)'
      },
      {
        id: 'step-3',
        stepNumber: 3,
        name: 'Vacuum Dewatering and Hydraulic Hot-Pressing',
        machineOrTool: '60-Ton 4-Cavity Thermoforming Press',
        cycleTime: '28 seconds per press shot',
        parameters: 'Die temp: 140°C top / 135°C bottom; Clamping force: 40 Ton',
        safetyNotes: 'Pinch hazard: dual optoelectronic light curtains active',
        qualityCheck: 'Inspect 1 part per 50 for flash or density voids'
      },
      {
        id: 'step-4',
        stepNumber: 4,
        name: 'Tunnel Convection Dehydration',
        machineOrTool: 'Mesh Belt Infrared Drying Oven',
        cycleTime: '8 minutes belt transit',
        parameters: 'Chamber temperature: 110°C; Belt speed: 0.75 m/min',
        safetyNotes: 'Surface burn hazard on oven exit tray',
        qualityCheck: 'Pin moisture meter check: target < 6% moisture content'
      },
      {
        id: 'step-5',
        stepNumber: 5,
        name: 'Eco-Wax Spray Mist Coating & Flash Cure',
        machineOrTool: 'Conveyor Dip/Spray Station',
        cycleTime: '3 seconds per pot',
        parameters: 'Coating thickness: 15 microns uniform',
        safetyNotes: 'Ensure ventilation exhaust fan is running',
        qualityCheck: 'Water drop bead contact angle test'
      },
      {
        id: 'step-6',
        stepNumber: 6,
        name: 'Nesting, Final QA, and Master Packout',
        machineOrTool: 'Automated Counting & Packing Bench',
        cycleTime: '1 minute per carton of 100',
        parameters: '100 pots per carton with paper layer dividers',
        safetyNotes: 'Ergonomic lifting techniques for 15kg cartons',
        qualityCheck: 'Verify carton weight on digital scale (14.2 kg ± 0.3 kg)'
      }
    ],
    qualityCheckpoints: [
      {
        stage: 'Raw Material Intake',
        parameter: 'Fiber moisture and cleanliness',
        method: 'Moisture analyzer scale',
        tolerance: '< 10% moisture, zero foreign metal/dirt',
        tool: 'Halogen Moisture Analyzer'
      },
      {
        stage: 'Forming Stage',
        parameter: 'Wall thickness uniformity & rim diameter',
        method: 'Vernier caliper at 4 cardinal points',
        tolerance: '2.2 mm ± 0.3 mm',
        tool: 'Digital Calipers'
      },
      {
        stage: 'Post-Drying Stage',
        parameter: 'Crush resistance / compressive load',
        method: 'Vertical compression bench test',
        tolerance: '> 180 N top rim crush resistance',
        tool: 'Universal Load Cell Gauge'
      },
      {
        stage: 'Finished Product',
        parameter: 'Soil biodegradation & water resistance',
        method: 'Water immersion bead test',
        tolerance: 'Zero wall softening after 48 hrs standing water',
        tool: 'Immersion Test Chamber'
      }
    ],
    safetyRequirements: [
      {
        hazard: 'Combustible organic agro-dust explosion during milling',
        ppe: ['N95 dust respirator', 'Anti-static safety shoes', 'Eye protection'],
        protocol: 'Explosion-proof grounding on hammer mill and NFPA vent ducting',
        oshaStandard: 'OSHA 1910.22 & NFPA 652 Combustible Dust Standard'
      },
      {
        hazard: 'Hydraulic press high-tonnage pinch and hot platens (140°C)',
        ppe: ['Heat-resistant Kevlar gloves', 'Safety glasses ANSI Z87+'],
        protocol: 'Dual-hand simultaneous button start and Category 4 optical light curtains',
        oshaStandard: 'OSHA 1910.212 General Requirements for Machine Guarding'
      },
      {
        hazard: 'Hot water and slurry steam burns (75°C - 85°C)',
        ppe: ['Chemical/heat apron', 'Full face splash shield', 'Neoprene gauntlets'],
        protocol: 'Slow-vent lid interlock on 500L slurry tank prior to inspection',
        oshaStandard: 'OSHA 1910.132 Personal Protective Equipment'
      }
    ],
    wasteManagement: [
      'Slurry drain water is recycled through 5-micron particulate filtration back into batch tank (85% water circularity)',
      'Any off-spec or misformed damp pots before oven curing are thrown directly back into mixing tank with zero waste loss',
      'Cardboard packing boxes use 100% recycled paper tape with water-activated starch adhesive'
    ],
    prototypeTesting: [
      {
        id: 'test-1',
        testName: 'Drop Impact Resistance',
        objective: 'Determine if pot fractures when dropped from workbench height with wet soil',
        acceptanceCriteria: 'Withstand 1.2 meter drop onto compacted earth without structural cracks',
        status: 'passed'
      },
      {
        id: 'test-2',
        testName: 'Greenhouse Water Saturation 30-Day Trial',
        objective: 'Test whether daily watering causes premature wall sag in nursery conditions',
        acceptanceCriteria: 'Pot maintains rigid form and stands upright for minimum 45 days',
        status: 'passed'
      },
      {
        id: 'test-3',
        testName: 'Soil Root Permeability Test',
        objective: 'Ensure seedling roots can penetrate pot walls when planted into open garden ground',
        acceptanceCriteria: 'Tomato seedling roots penetrate outer wall within 14 days of soil burial',
        status: 'passed'
      }
    ],
    costBreakdown: {
      toolingNRE: 2800, // Aluminum 4-cavity tooling die
      rawMaterialPerUnit: 0.14,
      laborMachinePerUnit: 0.12,
      finishingPackagingPerUnit: 0.06,
      totalPerUnit: 0.32,
      breakEvenVolume: 12500
    },
    timeline: [
      {
        phase: 'Phase 1: Tooling Design & CNC Die Machining',
        duration: '14 Days',
        deliverable: '4-Cavity hardened aluminum thermoforming die with vacuum ports'
      },
      {
        phase: 'Phase 2: Slurry Recipe Tuning & First Article Inspection (FAI)',
        duration: '4 Days',
        deliverable: '50 Sample pots verified for crush resistance and moisture barrier'
      },
      {
        phase: 'Phase 3: Pilot Production Run (10,000 Units)',
        duration: '6 Days',
        deliverable: '100 Master cartons packed and palletized for nursery distribution'
      },
      {
        phase: 'Phase 4: Field Testing & Customer Nursery Feedback',
        duration: '30 Days',
        deliverable: 'Agronomy performance sign-off and order expansion'
      }
    ],
    notes: 'Preliminary estimates prepared for college hackathon prototype validation. Supplier quotes for fiber and starch reflect regional averages in Q1 2026. Prior to commercial food-contact scaling, FDA/EC migration certifications are required.',
    createdAt: '2026-10-13T10:30:00Z',
    updatedAt: '2026-10-13T10:30:00Z',
    isDemo: true
  }
];
