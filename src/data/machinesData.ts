import { Machine } from '../types';

export const MACHINES_DATA: Machine[] = [
  {
    id: 'cnc-5-axis',
    name: '5-Axis Simultaneous CNC Machining Center',
    category: 'Subtractive & CNC',
    accuracy: '±0.003 mm (3 microns)',
    speed: 'Spindle: up to 20,000 RPM; Rapid traverse: 45 m/min',
    powerConsumption: '25 - 40 kW peak',
    setupComplexity: 'High',
    costTier: '$$$$$',
    compatibleMaterials: ['Aluminum 6061/7075', 'Titanium Gr. 5', 'Stainless Steels', 'Inconel', 'Engineering Plastics (PEEK, Delrin)'],
    advantages: [
      'Machines 5 sides of a complex workpiece in a single setup, eliminating datum transfer errors',
      'Uses shorter, stiffer cutting tools for higher surface Ra quality and longer tool life',
      'Enables complex organic shapes like turbine impellers, medical prosthetics, and mold cavities'
    ],
    limitations: [
      'High initial capital cost ($200,000 - $600,000+)',
      'Requires advanced CAM programming (Hypermill, Mastercam) and collision simulation software',
      'Requires skilled machinist setup and laser tool presetting'
    ],
    maintenanceLevel: 'Rigorous: monthly spindle taper runout checks, coolant concentration monitoring, and annual kinematic ballbar calibration.'
  },
  {
    id: 'cnc-lathe-live-tooling',
    name: 'CNC Turning Center with Live Tooling & Y-Axis',
    category: 'Subtractive & CNC',
    accuracy: '±0.005 mm (5 microns)',
    speed: 'Main Spindle: 4,500 RPM; Live Tool Spindle: 6,000 RPM',
    powerConsumption: '15 - 25 kW',
    setupComplexity: 'Medium',
    costTier: '$$$$',
    compatibleMaterials: ['Brass C360', 'Carbon Steels', 'Stainless Steel 304/316', 'Aluminum 6061', 'Acetal/Delrin'],
    advantages: [
      'Combines rotational turning and milling/drilling operations in one machine cycle',
      'Sub-spindle enables automatic part handover for complete front-and-back machining',
      'Extremely fast cycle times for round shafts, threaded couplings, and cylindrical housings'
    ],
    limitations: [
      'Work envelope limited to cylindrical or prismatic stock up to 250mm diameter',
      'Live tool holders have lower horsepower than dedicated milling centers'
    ],
    maintenanceLevel: 'Moderate: turret index alignment, hydraulic chuck pressure checks, and bar-feeder synchronization.'
  },
  {
    id: 'fiber-laser-cutter',
    name: 'High-Power Fiber Laser Sheet Cutter (12 kW)',
    category: 'Forming & Sheet Metal',
    accuracy: '±0.05 mm cut positioning',
    speed: 'Positioning: 140 m/min; Cutting speeds up to 50 m/min on thin sheets',
    powerConsumption: '35 - 55 kW (including chiller and dust collector)',
    setupComplexity: 'Medium',
    costTier: '$$$$$',
    compatibleMaterials: ['Carbon Steel (0.5mm - 30mm)', 'Stainless Steel (0.5mm - 25mm)', 'Aluminum (0.5mm - 20mm)', 'Brass & Copper'],
    advantages: [
      'Narrow kerf width (0.15mm) with zero mechanical tool wear or replacement costs',
      'Extremely fast pierce and cutting speeds on sheet metal',
      'Automated shuttle table and nozzle cleaning/inspection stations'
    ],
    limitations: [
      'Requires nitrogen or oxygen assist gas tanks and dedicated high-pressure piping',
      'High reflective hazard on pure copper/brass requiring back-reflection isolators'
    ],
    maintenanceLevel: 'Regular: protective lens replacement, focus optic cleaning, assist gas pressure monitoring, and dust bag de-ashing.'
  },
  {
    id: 'cnc-press-brake',
    name: 'Servo-Hydraulic CNC Press Brake (100 Ton / 3m)',
    category: 'Forming & Sheet Metal',
    accuracy: '±0.25° angular bend repeatability; ±0.01 mm backgauge',
    speed: 'Bending speed: 10 - 20 mm/s; Approach: 180 mm/s',
    powerConsumption: '8 - 14 kW',
    setupComplexity: 'Medium',
    costTier: '$$$',
    compatibleMaterials: ['Cold Rolled Steel', 'Galvanized Sheet', 'Aluminum 5052', 'Stainless Steel 304'],
    advantages: [
      'Dynamic crowning system automatically compensates for ram deflection to keep bends straight',
      'Laser angle measuring sensors provide real-time springback compensation',
      'Quick-clamp hydraulic tool holders allow 2-minute punch and die setups'
    ],
    limitations: [
      'Subject to tonnage limits on thick materials and tight bend radiuses',
      'Operator must handle heavy sheets or incorporate robotic sheet follower arms'
    ],
    maintenanceLevel: 'Low-to-Medium: hydraulic oil filtration, proportional valve calibration, and tooling wear inspection.'
  },
  {
    id: 'metal-dmls-printer',
    name: 'Direct Metal Laser Sintering (DMLS / SLM) System',
    category: 'Additive & 3D',
    accuracy: '±0.05 mm to ±0.1 mm',
    speed: 'Build rate: 15 - 40 cm³/hour (single or quad 500W fiber lasers)',
    powerConsumption: '8 - 15 kW + Argon gas supply',
    setupComplexity: 'High',
    costTier: '$$$$$',
    compatibleMaterials: ['Titanium Ti-6Al-4V', 'Inconel 718', 'Stainless Steel 316L', 'AlSi10Mg Aluminum', 'Cobalt-Chrome'],
    advantages: [
      'Creates complex organic internal lattice structures and conformal cooling channels',
      'Consolidates multi-part assemblies into single monolithic components',
      'Direct production of certified aerospace and medical flight/implant grade parts'
    ],
    limitations: [
      'High per-part cost and slow build speed',
      'Requires stress-relieving furnace and wire-EDM to slice parts off build plate',
      'Powder handling requires inert atmosphere, sieving stations, and ATEX explosion safety'
    ],
    maintenanceLevel: 'High: optical protective window cleaning, recirculating laminar gas filter swaps, and laser calibration.'
  },
  {
    id: 'industrial-fdm',
    name: 'High-Temperature Industrial FDM 3D Printer',
    category: 'Additive & 3D',
    accuracy: '±0.127 mm (±0.005 in)',
    speed: 'Print speed: 50 - 250 mm/s; Heated chamber up to 180°C',
    powerConsumption: '3 - 6 kW',
    setupComplexity: 'Low',
    costTier: '$$$',
    compatibleMaterials: ['ULTEM 9085 / 1010', 'PEEK', 'Nylon 12 Carbon Fiber', 'ABS-M30', 'PC-ISO'],
    advantages: [
      'Heated build chamber prevents warping and delamination on high-performance thermoplastics',
      'Soluble support materials enable complex internal cavities and overhanging geometry',
      'Reliable lights-out 100-hour continuous prints for functional prototypes and tooling jigs'
    ],
    limitations: [
      'Noticeable layer lines along Z-axis requiring post-processing for aesthetic finishes',
      'Anisotropic strength in tensile Z-direction compared to injection molded parts'
    ],
    maintenanceLevel: 'Low: nozzle tip replacement, drive gear cleaning, and filament bay desiccant regeneration.'
  },
  {
    id: 'hydraulic-injection-molder',
    name: 'Servo-Hydraulic Plastic Injection Moulding Machine (180 Ton)',
    category: 'Moulding & Casting',
    accuracy: 'Shot weight repeatability within ±0.1%',
    speed: 'Dry cycle time: 1.8 seconds; Typical cycle: 12 - 35 seconds per part',
    powerConsumption: '18 - 28 kW',
    setupComplexity: 'High',
    costTier: '$$$$',
    compatibleMaterials: ['Polypropylene (PP)', 'ABS', 'Nylon PA6/66', 'Polycarbonate (PC)', 'Bio-plastics (PLA/PHA)'],
    advantages: [
      'Lowest unit cost for mass production (>10,000 units)',
      'High mechanical repeatability and multi-cavity tooling support (up to 32 cavities)',
      'Integrated mold temperature controller and robotic sprue picker automation'
    ],
    limitations: [
      'High tooling cost ($8,000 - $50,000+ for steel core/cavity tooling)',
      'Mold changeover requires 30-60 minutes without quick-die-change systems'
    ],
    maintenanceLevel: 'Medium: barrel heating band inspection, screw wear measurements, hydraulic filter changes, and tie-bar lubrication.'
  },
  {
    id: 'robotic-welding-cell',
    name: '6-Axis Articulated Robotic Welding Cell with Positioner',
    category: 'Automation & Joining',
    accuracy: 'Path repeatability: ±0.03 mm',
    speed: 'Welding travel speeds up to 1.8 m/min',
    powerConsumption: '12 - 20 kW',
    setupComplexity: 'High',
    costTier: '$$$$',
    compatibleMaterials: ['Carbon Steel', 'Stainless Steel', 'Aluminum 5000/6000 series'],
    advantages: [
      'Eliminates human fatigue and inconsistency; produces uniform AWS/ISO certified weld beads',
      'Dual-station rotary positioner allows operator to load/unload parts safely while robot welds station 2',
      'Integrated seam-tracking laser vision compensates for joint fit-up gaps'
    ],
    limitations: [
      'Requires rigid custom welding fixtures with precise repeatability',
      'Not economical for one-off repair jobs or messy fit-ups'
    ],
    maintenanceLevel: 'Moderate: torch contact tip and gas diffuser swaps, wire feeder liner blowout, and robot grease replenishment.'
  },
  {
    id: 'bridge-cmm',
    name: 'CNC Bridge Coordinate Measuring Machine (CMM)',
    category: 'Metrology & QA',
    accuracy: 'MPEE = 1.2 + L/350 µm (Micron-level volumetric accuracy)',
    speed: 'Probing speed: 300 mm/s; Vector scanning: 150 points/second',
    powerConsumption: '1.5 kW',
    setupComplexity: 'Medium',
    costTier: '$$$$',
    compatibleMaterials: ['All rigid machined metals, molded plastics, cast components, and tooling dies'],
    advantages: [
      'Gold standard for dimensional inspection, geometric dimensioning and tolerancing (GD&T)',
      'Automated CAD-guided multi-probe scanning generating full dimensional inspection reports',
      'Contact stylus and non-contact optical laser line probes'
    ],
    limitations: [
      'Requires temperature and humidity controlled metrology room (20°C ± 1°C)',
      'Cannot measure soft deformable elastomers without non-contact optical cameras'
    ],
    maintenanceLevel: 'Medium: annual calibration against traceable step gauge standards, air bearing filter cleaning, and stylus tip inspection.'
  },
  {
    id: 'ultrasonic-welder',
    name: 'Ultrasonic Plastic Welder (20 kHz / 2000W)',
    category: 'Automation & Joining',
    accuracy: 'Weld depth accuracy to ±0.01 mm via optical linear encoder',
    speed: 'Weld cycle time: 0.1 to 1.5 seconds per assembly',
    powerConsumption: '2 kW peak during weld pulse',
    setupComplexity: 'Medium',
    costTier: '$$$',
    compatibleMaterials: ['Rigid thermoplastics: ABS, Polycarbonate, Polystyrene, Acrylic, Polyamide'],
    advantages: [
      'No consumables needed: zero screws, rivets, solvents, or toxic glues',
      'Instantaneous joint bonding with hermetic seal integrity',
      'Clean aesthetic joint with no flash or heat discoloration'
    ],
    limitations: [
      'Requires custom acoustic titanium or aluminum horn (sonotrode) tailored to part geometry',
      'Limited to thermoplastic parts with engineered energy directors or shear joints'
    ],
    maintenanceLevel: 'Low: sonotrode torque checks, booster tuning, and transducer cable inspection.'
  }
];
