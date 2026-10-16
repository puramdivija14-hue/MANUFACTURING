import {
  IdeaGenerationInput,
  GeneratedIdea,
  ManufacturingPlan,
  BOMItem,
  OperationStep,
  MachineRequirement,
  QualityCheck,
  SafetyRequirement,
  PrototypeTest,
  CostSummary,
  TimelineMilestone
} from '../types';
import { storageService } from './storageService';

export interface GenerationResult<T> {
  data: T;
  source: 'Live Gemini AI' | 'Live OpenAI' | 'Built-in Manufacturing Expert Engine';
  isDemo: boolean;
}

export const aiService = {
  /**
   * Generates manufacturing ideas based on user requirements and chosen mode
   */
  async generateIdeas(input: IdeaGenerationInput): Promise<GenerationResult<GeneratedIdea[]>> {
    const settings = storageService.getSettings();
    const envGeminiKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY || '';
    const geminiKey = settings.geminiApiKey || envGeminiKey;

    // Check if live Gemini API is configured
    if (settings.aiProvider === 'gemini' && geminiKey) {
      try {
        const liveIdeas = await this.callGeminiForIdeas(input, geminiKey);
        if (liveIdeas && liveIdeas.length > 0) {
          return {
            data: liveIdeas,
            source: 'Live Gemini AI',
            isDemo: false
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to Built-in Expert Engine:', err);
      }
    }

    // Built-in Manufacturing Expert Engine (Domain-Driven Synthesis)
    // Simulates realistic thinking latency
    await new Promise(r => setTimeout(r, 900));
    const generated = this.synthesizeIdeas(input);
    return {
      data: generated,
      source: 'Built-in Manufacturing Expert Engine',
      isDemo: true
    };
  },

  /**
   * Generates a complete manufacturing plan from a selected idea or prompt
   */
  async generatePlan(idea: GeneratedIdea | { title: string; proposedSolution: string; materials: string[]; manufacturingMethod: string }): Promise<GenerationResult<ManufacturingPlan>> {
    const settings = storageService.getSettings();
    const envGeminiKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY || '';
    const geminiKey = settings.geminiApiKey || envGeminiKey;

    if (settings.aiProvider === 'gemini' && geminiKey) {
      try {
        const livePlan = await this.callGeminiForPlan(idea, geminiKey);
        if (livePlan) {
          return {
            data: livePlan,
            source: 'Live Gemini AI',
            isDemo: false
          };
        }
      } catch (err) {
        console.warn('Gemini Plan API failed, falling back to Built-in Expert Engine:', err);
      }
    }

    await new Promise(r => setTimeout(r, 1100));
    const plan = this.synthesizePlan(idea);
    return {
      data: plan,
      source: 'Built-in Manufacturing Expert Engine',
      isDemo: true
    };
  },

  /**
   * Built-in Expert Synthesis for ideas
   */
  synthesizeIdeas(input: IdeaGenerationInput): GeneratedIdea[] {
    const { industry, problem, budget, materials, scale, objective, mode } = input;
    const timestamp = new Date().toISOString();

    const modeLabels: Record<string, string> = {
      brainstorming: 'Creative Brainstorming',
      'low-cost': 'Low-Cost Manufacturing',
      sustainable: 'Sustainable & Eco-Friendly',
      automation: 'Automation & Smart Factory',
      'waste-to-value': 'Waste-to-Value Circularity',
      'product-improvement': 'Product Improvement & Optimization',
      'new-concept': 'New Product Concept',
      'process-optimization': 'Manufacturing Process Optimization'
    };

    // Build 3 tailored concepts based on mode and inputs
    const ideas: GeneratedIdea[] = [];

    // Concept 1: Targeted primary solution
    ideas.push({
      id: `gen-${Date.now()}-1`,
      title: this.generateIdeaTitle(mode, industry, problem, 1),
      mode: modeLabels[mode] || mode,
      problemAddressed: problem || `Addressing manufacturing inefficiencies and cost pressures in ${industry || 'general manufacturing'}.`,
      proposedSolution: this.generateSolutionText(mode, industry, materials, objective, scale, 1),
      materials: this.suggestMaterials(materials, mode, industry),
      manufacturingMethod: this.suggestPrimaryProcess(mode, scale, industry),
      estimatedComplexity: scale === 'mass-production' ? 'High' : (mode === 'automation' ? 'Medium' : 'Low'),
      complexityScore: mode === 'automation' ? 7 : (scale === 'mass-production' ? 8 : 4),
      estimatedCostPerUnit: this.estimateCostUnit(budget, scale),
      estimatedCycleTime: this.estimateCycle(scale),
      advantages: this.generateAdvantages(mode, objective),
      limitations: this.generateLimitations(mode, scale),
      nextSteps: [
        'Complete 3D CAD modeling and DFM (Design for Manufacturability) analysis',
        'Fabricate rapid functional prototype (using 3D printing or soft tooling)',
        'Conduct mechanical stress testing and BOM supplier verification'
      ],
      createdAt: timestamp,
      isDemo: true
    });

    // Concept 2: Alternative modular/low-capex approach
    ideas.push({
      id: `gen-${Date.now()}-2`,
      title: this.generateIdeaTitle(mode, industry, problem, 2),
      mode: modeLabels[mode] || mode,
      problemAddressed: `Reducing capital tooling expenditure and setup lead times for ${industry || 'production'}.`,
      proposedSolution: this.generateSolutionText(mode, industry, materials, objective, scale, 2),
      materials: this.suggestSecondaryMaterials(materials, mode),
      manufacturingMethod: scale === 'prototype' ? 'Additive Manufacturing with CNC Finish' : 'Modular Sheet Metal & Off-the-Shelf Fasteners',
      estimatedComplexity: 'Medium',
      complexityScore: 5,
      estimatedCostPerUnit: this.estimateCostUnit(budget, scale, 1.2),
      estimatedCycleTime: this.estimateCycle(scale, 1.4),
      advantages: [
        'Eliminates expensive hardened steel mold tooling ($0 NRE CapEx)',
        'Enables rapid iterative design updates without modifying stamping dies',
        'Standardized hardware components reduce supply chain single-source risks'
      ],
      limitations: [
        'Slightly higher unit raw material cost than high-tonnage monolithic die casting',
        'Requires additional modular assembly joint fasteners'
      ],
      nextSteps: [
        'Evaluate snap-fit and modular fastener torque specifications',
        'Verify structural rigidity under cyclic fatigue testing',
        'Compare supplier lead times for off-the-shelf extruded profiles'
      ],
      createdAt: timestamp,
      isDemo: true
    });

    // Concept 3: Next-Gen Circular/Smart Alternative
    ideas.push({
      id: `gen-${Date.now()}-3`,
      title: this.generateIdeaTitle(mode, industry, problem, 3),
      mode: modeLabels[mode] || mode,
      problemAddressed: `Achieving zero-waste circular loops and automated telemetry in ${industry || 'manufacturing'}.`,
      proposedSolution: this.generateSolutionText(mode, industry, materials, objective, scale, 3),
      materials: ['Post-Consumer Recycled Polymer (rPET / rHDPE)', 'Bio-composite filler', 'Lead-free brass inserts'],
      manufacturingMethod: 'Closed-Loop Injection Moulding with In-Mold Sensor Telemetry',
      estimatedComplexity: 'High',
      complexityScore: 8,
      estimatedCostPerUnit: this.estimateCostUnit(budget, scale, 0.85),
      estimatedCycleTime: this.estimateCycle(scale, 0.75),
      advantages: [
        'Integrates circular material lifecycle: 100% recyclable at product end-of-life',
        'Employs IoT machine monitoring to track cycle times and scrap rate in real time',
        'Conforms to global ESG carbon border adjustment standards'
      ],
      limitations: [
        'Requires tighter calibration on recycled resin melt-flow index (MFI)',
        'Initial sensor instrumentation integration requires skilled controls technician'
      ],
      nextSteps: [
        'Run polymer rheology analysis on regrind blend ratios',
        'Program PLC sensor communication registers (Modbus TCP/IP)',
        'Conduct life cycle carbon footprint assessment (LCA)'
      ],
      createdAt: timestamp,
      isDemo: true
    });

    return ideas;
  },

  /**
   * Synthesize detailed manufacturing plan from idea
   */
  synthesizePlan(idea: GeneratedIdea | { title: string; proposedSolution: string; materials: string[]; manufacturingMethod: string }): ManufacturingPlan {
    const timestamp = new Date().toISOString();
    const id = `plan-${Date.now()}`;
    const title = `Production Plan: ${idea.title}`;

    const bom: BOMItem[] = [
      {
        id: 'bom-item-1',
        item: idea.materials[0] || 'Primary Structural Material (Alloy/Polymer)',
        material: idea.materials[0] || 'Industrial Grade Raw Stock',
        quantity: 120,
        unit: 'kg',
        unitCost: 4.80,
        supplierCategory: 'Certified Material Stockist',
        notes: 'Mill test certificates (MTC) required upon delivery'
      },
      {
        id: 'bom-item-2',
        item: idea.materials[1] || 'Secondary Component / Core Insert',
        material: idea.materials[1] || 'Complementary Hardware',
        quantity: 50,
        unit: 'pcs',
        unitCost: 1.65,
        supplierCategory: 'Precision Hardware Supplier',
        notes: 'Dimensional tolerance ±0.05 mm'
      },
      {
        id: 'bom-item-3',
        item: 'Standardized Fasteners & Threaded Inserts',
        material: 'Stainless Steel A2-70 / Brass',
        quantity: 200,
        unit: 'pcs',
        unitCost: 0.15,
        supplierCategory: 'Standard Fasteners Vendor',
        notes: 'DIN 912 Socket Head Screws'
      },
      {
        id: 'bom-item-4',
        item: 'Protective Finish / Anodizing / Bio-Wax Sealant',
        material: 'Surface Coating Treatment',
        quantity: 10,
        unit: 'liters',
        unitCost: 18.50,
        supplierCategory: 'Finishing Chemical Co.',
        notes: 'Conforms to RoHS & REACH compliance'
      },
      {
        id: 'bom-item-5',
        item: 'Sustainable Master Carton & Protective Inserts',
        material: 'Corrugated Recycled Board',
        quantity: 50,
        unit: 'boxes',
        unitCost: 2.10,
        supplierCategory: 'Packaging Supplier',
        notes: 'Passes 1-meter drop test standard'
      }
    ];

    const machines: MachineRequirement[] = [
      {
        name: idea.manufacturingMethod || 'Primary Forming / Machining Equipment',
        type: 'Primary Processing Equipment',
        specs: 'Automated CNC/Press control, closed-loop feedback',
        setupTime: '35 minutes fixture & tool alignment',
        operatorSkill: 'Trained Machine Operator'
      },
      {
        name: 'Secondary Finishing / Deburring Station',
        type: 'Surface Preparation',
        specs: 'Rotary vibratory tumbler with ceramic media',
        setupTime: '10 minutes',
        operatorSkill: 'General Technician'
      },
      {
        name: 'Digital Metrology & Inspection Bench',
        type: 'Quality Assurance & Gauging',
        specs: 'Calibrated digital vernier, optical gauge, height micrometer',
        setupTime: '5 minutes calibration check',
        operatorSkill: 'QA Inspector'
      }
    ];

    const processFlow: OperationStep[] = [
      {
        id: 'step-1',
        stepNumber: 1,
        name: 'Raw Material Verification & Inward Staging',
        machineOrTool: 'Material Staging Bay & Digital Vernier',
        cycleTime: '15 min per batch',
        parameters: 'Check dimensions, hardness test, verify batch certification',
        safetyNotes: 'Wear steel-toe footwear and cut-resistant gloves',
        qualityCheck: 'Sample inspection against raw stock tolerance specification'
      },
      {
        id: 'step-2',
        stepNumber: 2,
        name: `Primary Processing: ${idea.manufacturingMethod.slice(0, 32)}`,
        machineOrTool: machines[0].name,
        cycleTime: '3 min 20 sec per component',
        parameters: 'Optimized feed rates, spindle speeds, temperature & pressure parameters',
        safetyNotes: 'Interlocked safety enclosure doors must remain closed',
        qualityCheck: 'First Article Inspection (FAI) dimensional check before run'
      },
      {
        id: 'step-3',
        stepNumber: 3,
        name: 'Secondary Edge Deburring & Surface Prep',
        machineOrTool: 'Vibratory Finishing Tumbler & Manual Deburring Tool',
        cycleTime: '45 seconds per component',
        parameters: 'Media ratio 3:1 ceramic stones to parts; Ra target 1.6µm',
        safetyNotes: 'Hearing protection and eye goggles required',
        qualityCheck: 'Tactile finger-swipe check: zero sharp burrs or hanging flash'
      },
      {
        id: 'step-4',
        stepNumber: 4,
        name: 'Surface Treatment & Protective Sealing',
        machineOrTool: 'Coating Tank / Anodizing / Spray Chamber',
        cycleTime: '2 minutes dip/cure time',
        parameters: 'Layer thickness: 15-25 microns uniform coating',
        safetyNotes: 'Organic vapor respirator and chemical apron in coating bay',
        qualityCheck: 'Adhesion tape test (cross-hatch ASTM D3359)'
      },
      {
        id: 'step-5',
        stepNumber: 5,
        name: 'Sub-Assembly & Fastener Torquing',
        machineOrTool: 'Ergonomic Assembly Bench & Calibrated Torque Driver',
        cycleTime: '1 min 30 sec per assembly',
        parameters: 'Torque specification: 2.4 Nm ± 0.2 Nm',
        safetyNotes: 'Anti-static ESD grounding mat on assembly surface',
        qualityCheck: '100% torque click confirmation and functional check'
      },
      {
        id: 'step-6',
        stepNumber: 6,
        name: 'Final Quality Audit, Serialization & Master Packout',
        machineOrTool: 'Barcode Labeler & Packing Station',
        cycleTime: '1 minute per unit',
        parameters: 'Pack in shock-absorbing foam with desiccant pouch',
        safetyNotes: 'Ergonomic carton handling',
        qualityCheck: 'Verify serial number barcode scan and box gross weight'
      }
    ];

    const qualityCheckpoints: QualityCheck[] = [
      {
        stage: 'Inward Goods',
        parameter: 'Raw material chemical & dimensional spec',
        method: 'Certificate review + micrometer check',
        tolerance: '±0.02 mm on stock diameter/thickness',
        tool: 'Digital Micrometer'
      },
      {
        stage: 'First Article (FAI)',
        parameter: 'Critical mounting bores and datum distances',
        method: 'Height gauge and coordinate check',
        tolerance: '±0.025 mm',
        tool: 'Height Gauge & Dial Indicator'
      },
      {
        stage: 'Post-Finishing',
        parameter: 'Coating uniformity & surface finish',
        method: 'Surface profilometer measurement',
        tolerance: 'Ra < 1.6 µm',
        tool: 'Surface Roughness Tester'
      },
      {
        stage: 'End of Line (EOL)',
        parameter: 'Functional fit, torque integrity & cosmetic check',
        method: 'Torque audit & 360° visual inspection under 1000 lux illumination',
        tolerance: 'Zero scratches, cracks, or loose hardware',
        tool: 'Calibrated Torque Wrench'
      }
    ];

    const safetyRequirements: SafetyRequirement[] = [
      {
        hazard: 'Rotating mechanical tooling and sharp metal/plastic burrs',
        ppe: ['Safety Glasses (ANSI Z87.1)', 'Level 5 Cut-Resistant Gloves', 'Steel-Toe Metatarsal Shoes'],
        protocol: 'Strictly prohibit loose clothing, long loose hair, or jewelry near rotating machinery.',
        oshaStandard: 'OSHA 1910.212 (Machine Guarding) & OSHA 1910.138 (Hand Protection)'
      },
      {
        hazard: 'Hazardous energy release during tool changing or maintenance',
        ppe: ['Safety Padlock', 'Warning Tag', 'High-Visibility Vest'],
        protocol: 'Perform comprehensive Lockout/Tagout (LOTO) and verify zero stored pneumatic/electrical energy.',
        oshaStandard: 'OSHA 1910.147 (The Control of Hazardous Energy - Lockout/Tagout)'
      },
      {
        hazard: 'Aerosolized particulate dust and mist exposure during machining/coating',
        ppe: ['Particulate Respirator N95/FFP2', 'Nitrile Gloves'],
        protocol: 'Ensure local LEV exhaust ventilation hood is operating above 100 FPM face velocity.',
        oshaStandard: 'OSHA 1910.1000 (Air Contaminants)'
      }
    ];

    const wasteManagement: string[] = [
      'Segregate clean metal chips (swarf) and polymer regrind at source into labeled color-coded bins for 100% recycler buyback.',
      'Maintain an active tramp oil skimmer and centrifugal separator on cutting fluid to extend coolant life to 12+ months.',
      'All master packaging cartons must use 100% recyclable unbleached kraft paper with starch-based water-activated tape.',
      'Off-spec prototype parts are logged for Root Cause Analysis (RCA) and routed back to local scrap remelting.'
    ];

    const prototypeTesting: PrototypeTest[] = [
      {
        id: 'pt-1',
        testName: 'Form & Fit Alignment Verification',
        objective: 'Confirm interface dimensions mate smoothly with adjacent components without binding or excessive play',
        acceptanceCriteria: 'Clearance within 0.1 mm - 0.2 mm envelope across all mating surfaces',
        status: 'passed'
      },
      {
        id: 'pt-2',
        testName: 'Drop Impact & Structural Rigidity Test',
        objective: 'Evaluate shock resilience when dropped from standard operational table height (1.0 meter)',
        acceptanceCriteria: 'No fracture, permanent deflection, or loosening of threaded fasteners after 3 drops',
        status: 'pending'
      },
      {
        id: 'pt-3',
        testName: 'Thermal & Environmental Cycling',
        objective: 'Expose assembly to thermal gradient (-10°C to +55°C) over 24 hours to check for warping or coating degradation',
        acceptanceCriteria: 'Zero delamination, cracking, or dimensional shift beyond ±0.05 mm',
        status: 'pending'
      }
    ];

    const costBreakdown: CostSummary = {
      toolingNRE: 1450, // Prototyping fixtures & tooling
      rawMaterialPerUnit: 3.40,
      laborMachinePerUnit: 2.80,
      finishingPackagingPerUnit: 1.10,
      totalPerUnit: 7.30,
      breakEvenVolume: 450
    };

    const timeline: TimelineMilestone[] = [
      {
        phase: '1. Engineering DFM & CAD Refinement',
        duration: '3 - 5 Days',
        deliverable: 'Approved 3D STEP models and 2D GD&T manufacturing drawings'
      },
      {
        phase: '2. Tooling Procurement & Soft Fixture Setup',
        duration: '5 - 7 Days',
        deliverable: 'Machined soft jaws, vacuum plates, and inspection fixtures'
      },
      {
        phase: '3. First Article Prototyping & Metrology Signoff',
        duration: '2 - 3 Days',
        deliverable: 'Initial 5 units measured on CMM with full FAI inspection report'
      },
      {
        phase: '4. Batch Production & Packaging',
        duration: '5 - 8 Days',
        deliverable: 'Completed production run inspected, packed, and boxed with CoC'
      }
    ];

    return {
      id,
      title,
      productOverview: idea.proposedSolution || `Manufacturing plan developed for ${idea.title}.`,
      targetVolume: 'Batch Run: 500 Units (Scalable to Mass Run)',
      tolerances: 'General Machining: ±0.05 mm; Critical Bores: ±0.015 mm',
      leadTime: '3 Weeks from PO release to finished dispatch',
      bom,
      machines,
      processFlow,
      qualityCheckpoints,
      safetyRequirements,
      wasteManagement,
      prototypeTesting,
      costBreakdown,
      timeline,
      notes: 'PRELIMINARY ENGINEERING ESTIMATE: All cycle times, tool wear rates, and cost figures are simulated engineering estimates intended for prototyping and planning. Professional technical review with tooling suppliers and safety auditors is strongly recommended prior to industrial commissioning.',
      createdAt: timestamp,
      updatedAt: timestamp,
      isDemo: true
    };
  },

  // Helper generators
  generateIdeaTitle(mode: string, industry: string, problem: string, variant: number): string {
    const ind = industry ? industry.replace(/\b\w/g, l => l.toUpperCase()) : 'Industrial';
    if (variant === 1) {
      if (mode === 'low-cost') return `Value-Engineered Modular ${ind} Assembly`;
      if (mode === 'sustainable' || mode === 'waste-to-value') return `Circular Bio-Based ${ind} Component`;
      if (mode === 'automation') return `Autonomous Smart-Tended ${ind} Workstation`;
      return `Optimized High-Efficiency ${ind} Solution`;
    }
    if (variant === 2) {
      return `Rapid-Deployment Flat-Pack ${ind} Architecture`;
    }
    return `Smart IoT Closed-Loop ${ind} System`;
  },

  generateSolutionText(mode: string, industry: string, materials: string, objective: string, scale: string, variant: number): string {
    if (variant === 1) {
      return `A purpose-engineered manufacturing workflow for ${industry || 'production'} that emphasizes ${objective.replace('-', ' ')}. By leveraging ${materials || 'advanced lightweight stock'} with standardized tooling, the design achieves high repeatability while minimizing scrap.`;
    }
    if (variant === 2) {
      return `A modular alternative designed for ${scale} scaling. Uses standardized off-the-shelf fasteners and extruded geometry to eliminate custom high-cost stamping dies, allowing production to begin in days rather than months.`;
    }
    return `A circular closed-loop solution featuring embedded sensor monitoring, automated quality verification at the workstation, and 100% recyclable post-consumer feedstock.`;
  },

  suggestMaterials(materials: string, mode: string, industry: string): string[] {
    if (materials && materials.length > 3) {
      return materials.split(',').map(m => m.trim()).filter(Boolean);
    }
    if (mode === 'sustainable' || mode === 'waste-to-value') {
      return ['Sugarcane bagasse / Agro-fiber', 'Recycled PET (rPET)', 'Natural starch bio-binder'];
    }
    if (industry.toLowerCase().includes('electronic')) {
      return ['5052-H32 Aluminum Sheet', 'UL94-V0 Fire-retardant ABS', 'Nickel-plated brass standoffs'];
    }
    return ['Aluminum 6061-T6', '304 Stainless Steel', 'Delrin POM engineering polymer'];
  },

  suggestSecondaryMaterials(materials: string, mode: string): string[] {
    if (mode === 'sustainable') {
      return ['Molded cellulose pulp', 'Soy-based barrier wax', 'Biodegradable PLA'];
    }
    return ['Cold Rolled Steel (CRCA Sheet)', 'Standard Grade 8.8 Hardware', 'Powder-coat epoxy'];
  },

  suggestPrimaryProcess(mode: string, scale: string, industry: string): string {
    if (scale === 'prototype') {
      return 'Hybrid Additive Prototyping (FDM/SLA) with Post-CNC Trimming';
    }
    if (mode === 'sustainable' || mode === 'waste-to-value') {
      return 'Thermoformed Slurry Dewatering & Hot-Die Compression';
    }
    if (scale === 'mass-production') {
      return 'High-Pressure Die Casting or Multi-Cavity Injection Moulding';
    }
    return 'CNC Precision 3-Axis Milling & Press Brake Bending';
  },

  estimateCostUnit(budget: string, scale: string, multiplier = 1.0): string {
    if (scale === 'prototype') return `$${(18.50 * multiplier).toFixed(2)} - $${(35.00 * multiplier).toFixed(2)} / unit`;
    if (scale === 'small-batch') return `$${(6.80 * multiplier).toFixed(2)} - $${(12.50 * multiplier).toFixed(2)} / unit`;
    return `$${(0.85 * multiplier).toFixed(2)} - $${(2.40 * multiplier).toFixed(2)} / unit (at 10k volume)`;
  },

  estimateCycle(scale: string, multiplier = 1.0): string {
    if (scale === 'prototype') return `${Math.round(45 * multiplier)} minutes per piece`;
    if (scale === 'small-batch') return `${Math.round(4.5 * multiplier)} minutes per piece`;
    return `${Math.round(22 * multiplier)} seconds per piece (automated cycle)`;
  },

  generateAdvantages(mode: string, objective: string): string[] {
    const list = [
      'Substantially slashes scrap rate by optimizing blank nesting and near-net-shape forming',
      'Significantly lowers tooling capital expenditure by utilizing modular standardized fixtures',
      'High structural integrity certified to standard industrial safety factors (SF > 2.0)'
    ];
    if (mode === 'sustainable' || objective === 'reduce-waste') {
      list[0] = 'Replaces virgin petroleum polymers with renewable circular feedstocks';
    }
    if (objective === 'automate-production') {
      list[1] = 'Reduces manual operator handling and eliminates human error through Poka-Yoke fixtures';
    }
    return list;
  },

  generateLimitations(mode: string, scale: string): string[] {
    if (scale === 'mass-production') {
      return [
        'Initial tooling die manufacturing requires 4 to 6 weeks lead time',
        'Strict tolerance verification needed across high-temperature tool runs'
      ];
    }
    return [
      'Lower production throughput compared to million-unit stamping transfer lines',
      'Requires periodic manual fixture recalibration and tool wear tracking'
    ];
  },

  /**
   * Optional Gemini Live API Integration
   */
  async callGeminiForIdeas(input: IdeaGenerationInput, apiKey: string): Promise<GeneratedIdea[]> {
    const prompt = `You are ManuGenius AI, an expert industrial manufacturing engineer and DFM specialist.
Generate 3 realistic, highly detailed manufacturing ideas/solutions for the following user request:
- Industry: ${input.industry}
- Problem to solve: ${input.problem}
- Available budget: ${input.budget}
- Materials available: ${input.materials}
- Scale: ${input.scale}
- Primary objective: ${input.objective}
- Generation Mode: ${input.mode}

Return ONLY valid JSON matching this exact typescript interface array:
[
  {
    "id": "gemini-1",
    "title": "string",
    "mode": "${input.mode}",
    "problemAddressed": "string",
    "proposedSolution": "string",
    "materials": ["string", "string"],
    "manufacturingMethod": "string",
    "estimatedComplexity": "Low" | "Medium" | "High",
    "complexityScore": number,
    "estimatedCostPerUnit": "string",
    "estimatedCycleTime": "string",
    "advantages": ["string", "string", "string"],
    "limitations": ["string", "string"],
    "nextSteps": ["string", "string", "string"],
    "createdAt": "${new Date().toISOString()}",
    "isDemo": false
  }
]
Do not wrap in markdown quotes if possible, or use standard markdown json.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini API');

    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [parsed];
  },

  async callGeminiForPlan(idea: any, apiKey: string): Promise<ManufacturingPlan> {
    const prompt = `You are ManuGenius AI, a senior manufacturing engineering planner.
Create a complete, realistic, comprehensive industrial manufacturing plan for this idea:
Title: ${idea.title}
Solution: ${idea.proposedSolution}
Materials: ${Array.isArray(idea.materials) ? idea.materials.join(', ') : idea.materials}
Method: ${idea.manufacturingMethod}

Return ONLY valid JSON conforming to a comprehensive manufacturing plan with BOM, machines, step-by-step process flow with cycle times, quality checkpoints, OSHA safety requirements, waste management, prototype tests, and cost breakdown. Ensure all values are realistic engineering estimates.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini Plan API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      id: `plan-gemini-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false
    };
  },

  async validateGeminiApiKey(apiKey: string, model: string = 'gemini-2.5-flash'): Promise<{ valid: boolean; message: string }> {
    try {
      if (!apiKey || apiKey.trim().length < 10) {
        return { valid: false, message: 'API key is too short or empty.' };
      }
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with the word OK.' }] }]
          })
        }
      );
      if (response.ok) {
        return { valid: true, message: `Connected successfully to Google Gemini (${model})!` };
      } else {
        const err = await response.json();
        return { valid: false, message: err?.error?.message || `API error (${response.status})` };
      }
    } catch (e: any) {
      return { valid: false, message: e.message || 'Network connection failed.' };
    }
  },

  async chatWithAssistant(userMessage: string, history: { sender: string; text: string }[]): Promise<{
    text: string;
    suggestedAction?: { type: 'plan' | 'generate' | 'knowledge'; payload: string; label: string };
  }> {
    const settings = storageService.getSettings();
    const envGeminiKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY || '';
    const geminiKey = settings.geminiApiKey || envGeminiKey;
    const model = settings.geminiModel || 'gemini-2.5-flash';

    // 1. If Gemini configured, call Gemini with full chat history
    if (geminiKey && settings.aiProvider === 'gemini') {
      try {
        const contents = [
          {
            role: 'user',
            parts: [{
              text: `SYSTEM INSTRUCTION: You are ManuGenius AI Copilot, a senior manufacturing engineering expert, DFM specialist, and industrial automation advisor.
Provide crisp, structured, and technically sound engineering answers. Include specific alloy/polymer names (e.g. 6061-T6, PA66-GF30, PEEK), machining feeds/speeds, tolerances (GD&T), draft angles, or OSHA safety standards when relevant. Keep answers under 180 words, highly scannable, and practical for real workshop production.`
            }]
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I am ManuGenius AI Copilot, ready to assist with manufacturing engineering, materials, machines, DFM, and production planning.' }]
          },
          ...history.slice(-6).map(h => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          })),
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ];

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return {
              text: reply,
              suggestedAction: this.inferSuggestedAction(userMessage)
            };
          }
        }
      } catch (err) {
        console.warn('Gemini chat failed, using expert domain fallback:', err);
      }
    }

    // 2. Intelligent Domain Assistant Fallback (Offline / Heuristic Engine)
    await new Promise(r => setTimeout(r, 600));
    return this.synthesizeChatResponse(userMessage);
  },

  inferSuggestedAction(message: string): { type: 'plan' | 'generate' | 'knowledge'; payload: string; label: string } | undefined {
    const lower = message.toLowerCase();
    if (lower.includes('plan') || lower.includes('produce') || lower.includes('manufacture') || lower.includes('bom')) {
      return {
        type: 'plan',
        payload: message,
        label: 'Build Production Plan in Planner'
      };
    }
    if (lower.includes('idea') || lower.includes('concept') || lower.includes('design') || lower.includes('new product')) {
      return {
        type: 'generate',
        payload: message,
        label: 'Send to AI Idea Generator'
      };
    }
    return undefined;
  },

  synthesizeChatResponse(query: string): {
    text: string;
    suggestedAction?: { type: 'plan' | 'generate' | 'knowledge'; payload: string; label: string };
  } {
    const q = query.toLowerCase();

    if (q.includes('dfm') || q.includes('rule') || q.includes('undercut') || q.includes('sink mark') || q.includes('defect')) {
      return {
        text: `### 🛡️ Design for Manufacturability (DFM) Core Principles:
* **Injection Molding**: Keep wall thickness uniform (1.5–3.5mm), apply 1.0°–1.5° draft angles per side, and limit rib base thickness to 50–60% of base wall to avoid cosmetic sink marks.
* **CNC Milling**: Maintain cavity depth-to-width ratio ≤ 3:1 to eliminate tool chatter; internal vertical corners should have fillet radius R ≥ 1.5mm (larger than cutter radius).
* **Sheet Metal**: Internal bend radius must be ≥ 1.0× sheet thickness (T); maintain hole-to-bend distance ≥ 2.5× T to prevent oval hole stretching.
* **Die Casting**: Require draft ≥ 1.5° on outside walls and ≥ 2.0° on internal cores to prevent molten alloy soldering.`,
        suggestedAction: {
          type: 'plan',
          payload: 'DFM verified engineered component',
          label: 'Run DFM Rule Analyzer'
        }
      };
    }

    if (q.includes('oee') || q.includes('throughput') || q.includes('bottleneck') || q.includes('uptime') || q.includes('losses')) {
      return {
        text: `### 📈 Overall Equipment Effectiveness (OEE) & Bottleneck Guide:
* **The 3 OEE Pillars**: **Availability** (Operating Time / Planned Time) × **Performance** (Actual Speed / Ideal Speed) × **Quality** (Good Units / Total Units).
* **World-Class Target**: OEE ≥ **85%** (Availability ≥ 90%, Performance ≥ 95%, Quality ≥ 99.9%).
* **Bottleneck Constraint**: The slowest process step dictates overall line capacity. Maximum line output = 3600 / Bottleneck Cycle Time (sec).
* **TPM 6 Big Losses**: 1) Equipment Breakdowns, 2) Setup & Adjustments, 3) Small Stops, 4) Reduced Speed, 5) Startup Rejects, 6) Production Scrap.`,
        suggestedAction: {
          type: 'plan',
          payload: 'Production cell line balancing & OEE optimization',
          label: 'Open Plant OEE Simulator'
        }
      };
    }

    if (q.includes('rfq') || q.includes('sourcing') || q.includes('offshore') || q.includes('vendor') || q.includes('landed cost')) {
      return {
        text: `### 🌐 Supplier RFQ & Sourcing Decision Framework:
* **Total Landed Cost**: Tooling CapEx + Piece Price + Sea/Air Freight + Customs Tariffs + Inventory Buffer Cost + Scrap Risk Margin.
* **Break-Even Crossover Volume**: Offshore tooling ($6k–$15k) pays off only when piece savings surpass higher tooling, sea freight, and import tariffs.
* **Lead Time Tradeoff**: Domestic delivery takes 2–3 weeks (agile iteration) vs 8–12 weeks offshore (requires safety stock and working capital).
* **Quality Assurance**: Require First Article Inspection (FAIR AS9102 / PPAP Level 3) and Mill Test Reports (MTR) before issuing balance payments.`,
        suggestedAction: {
          type: 'plan',
          payload: 'Supplier RFQ package and procurement specification',
          label: 'Open Supplier RFQ Estimator'
        }
      };
    }

    if (q.includes('cnc') || q.includes('machin') || q.includes('milling') || q.includes('lathe')) {
      return {
        text: `### ⚙️ CNC Machining & Milling Engineering Recommendations:
* **Tool Overhang Rule**: Keep tool stick-out under 3×–4× cutter diameter to eliminate chatter resonance.
* **Tolerances**: Standard precision CNC achieves **±0.025 mm (±0.001")**; critical bores with reamers/boring heads reach **±0.005 mm**.
* **Surface Roughness**: Target **Ra 1.6 µm** for typical parts, or **Ra 0.8 µm** for precision fluid sealing faces.
* **Coolant Protocol**: Flood coolant with 7-10% water-soluble emulsion for aluminum; high-pressure MQL (minimum quantity lubrication) for titanium/Inconel.`,
        suggestedAction: {
          type: 'knowledge',
          payload: 'machining-cnc',
          label: 'View Machining Guide in Knowledge Hub'
        }
      };
    }

    if (q.includes('3d print') || q.includes('additive') || q.includes('fdm') || q.includes('sla') || q.includes('dmls')) {
      return {
        text: `### 🖨️ Additive Manufacturing Guidelines:
* **FDM Prototyping**: Best with **PLA** for form checks ($0.03/g) and **PA-CF (Carbon-filled Nylon)** or **Onyx** for functional jigs and structural brackets.
* **Orientation Tip**: Tensile strength is anisotropic — orient critical load vectors parallel to the X-Y build plate, never across the Z-axis layer interface.
* **Wall & Infill**: Set minimum 4 perimeter perimeters and 25-35% gyroid infill for maximum stiffness-to-weight ratio.
* **Direct Metal (DMLS)**: Ideal for generative brackets in **Ti-6Al-4V** or **AlSi10Mg** with internal conformal cooling passages.`,
        suggestedAction: {
          type: 'knowledge',
          payload: 'additive-3d',
          label: 'View 3D Printing in Knowledge Hub'
        }
      };
    }

    if (q.includes('plastic') || q.includes('mold') || q.includes('injection') || q.includes('shrinkage') || q.includes('draft')) {
      return {
        text: `### 🧪 Injection Moulding & Tooling Rules:
* **Draft Angles**: Provide **1° to 1.5°** draft on all vertical cavity walls. For EDM textured finishes (VDI 3400), add 1° draft per 0.02 mm texture depth.
* **Uniform Wall**: Maintain uniform nominal thickness between **1.5 mm to 3.0 mm**. Thick sections cause vacuum voids and unsightly surface sink marks.
* **Rib Design**: Rib base thickness should be **50% to 60%** of the nominal wall, with a maximum rib height of 3× nominal wall.
* **Shrinkage Allowance**: PP/HDPE shrinks ~1.5–2.0%; ABS/PC shrinks ~0.4–0.7% during mold cooling.`,
        suggestedAction: {
          type: 'knowledge',
          payload: 'injection-moulding',
          label: 'View Injection Moulding Details'
        }
      };
    }

    if (q.includes('material') || q.includes('aluminum') || q.includes('steel') || q.includes('titanium') || q.includes('alloy')) {
      return {
        text: `### 🔩 Engineering Material Selection Advisor:
* **General Structural & Enclosures**: **Aluminum 6061-T6** offers the sweet spot of strength (310 MPa), lightweight density (2.7 g/cm³), and anodizability.
* **High Chemical & Food Resistance**: **Stainless Steel 304 or 316L** (505 MPa tensile, sanitary food-grade cleanability).
* **Extreme Specific Strength**: **Titanium Ti-6Al-4V Gr.5** (950 MPa) — cuts weight by 45% compared to steel with zero corrosion.
* **Ultra-Performance Polymer**: **PEEK** replaces metals at 70% weight reduction with continuous use up to 250°C.`,
        suggestedAction: {
          type: 'knowledge',
          payload: 'machining-cnc',
          label: 'Compare Materials in Explorer'
        }
      };
    }

    if (q.includes('sustainab') || q.includes('scrap') || q.includes('eco') || q.includes('waste') || q.includes('recycled')) {
      return {
        text: `### 🌿 Circular & Zero-Waste Manufacturing:
* **Scrap Reclamation**: Implement closed-loop sprues/runner granulators in injection moulding to recycle up to **20% regrind** with 0% tensile loss.
* **Metal Briquetting**: Squeeze loose CNC chips into solid pucks to reclaim 98% of coolant oil and boost scrap smelter buyback value by 30%.
* **Bio-Substitutions**: Replace single-use polystyrene foam with **mycelium agro-waste composites** (100% compostable in 60 days).`,
        suggestedAction: {
          type: 'plan',
          payload: 'Circular eco-friendly product with zero-waste closed loop',
          label: 'Launch Scrap Calculator'
        }
      };
    }

    // Default general assistant response
    return {
      text: `### 🏭 ManuGenius Engineering Copilot:
I can assist you across any stage of manufacturing:
1. **Material Selection**: Recommend alloys, polymers, or composites for your stress, thermal, or cost targets.
2. **Process Selection**: Determine whether CNC, 3D printing, sheet metal stamping, or injection molding fits your volume.
3. **DFM & Tolerances**: GD&T limits, wall thickness rules, draft angles, and fillet radiuses.
4. **Safety & Standards**: OSHA machine guarding (1910.212), Lockout/Tagout (LOTO), and AWS welding codes.

What component or manufacturing challenge are you currently building?`,
      suggestedAction: {
        type: 'generate',
        payload: query,
        label: 'Synthesize Solutions in Idea Generator'
      }
    };
  }
};
