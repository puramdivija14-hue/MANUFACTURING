import { KnowledgeCategory } from '../types';

export const KNOWLEDGE_TOPICS: KnowledgeCategory[] = [
  {
    id: 'casting-moulding',
    title: 'Casting and Moulding',
    tagline: 'Liquid metal & slurry solidification into intricate near-net shapes',
    iconName: 'Flame',
    definition: 'A manufacturing process in which a liquid material (such as molten metal, polyurethane, or plaster) is poured into a mold containing a hollow cavity of the desired shape, and then allowed to solidify.',
    workingPrinciple: 'Molten metal is superheated above its melting point, de-gassed, and introduced via a gating system into an engineered mold cavity. As it loses heat through thermal conduction to the mold walls, grain boundaries crystallize into solid microstructure.',
    processSteps: [
      'Pattern and core making (wood, metal, or 3D-printed sand binder)',
      'Mold preparation with gating, runners, and risers to feed shrinkage',
      'Metal melting, alloying, and slag skimming in induction or cupola furnace',
      'Controlled pouring at monitored temperature (pyrometry)',
      'Solidification, cooling cycle, and shakeout / knockout',
      'Fettling, riser cutoff, shot blasting, and dimensional inspection'
    ],
    equipment: [
      'Electric Induction Furnaces (Medium Frequency)',
      'Sand Mullers and Core Blowers',
      'High-pressure Die Casting Presses (500T - 3000T)',
      'Investment Casting Slurry Tanks and Autoclave Dewaxers',
      'Rotary Shot Blasting Cabinets'
    ],
    suitableMaterials: [
      'Grey Cast Iron & Ductile Iron',
      'Cast Aluminum Alloys (A356, A380)',
      'Bronze and Brass Alloys (C83600)',
      'Cast Steels and Superalloys (Inconel for turbine blades)'
    ],
    incompatibleMaterials: [
      'Refractory metals like pure Tungsten/Molybdenum (due to extreme melting points >3000°C)',
      'Highly reactive materials in open atmospheric molds without vacuum or inert argon blanket'
    ],
    applications: [
      'Engine blocks and cylinder heads',
      'Pump housings and industrial valve bodies',
      'Automotive suspension knuckles and transmission casings',
      'Heavy equipment counterweights and turbine impellers'
    ],
    advantages: [
      'Can produce extremely complex internal geometry using sand cores',
      'Virtually no limit on component size (grams to 200+ tonnes)',
      'High scrap recycling rate: sprues and runners remelted directly',
      'Lower tooling startup cost for sand casting compared to forging dies'
    ],
    limitations: [
      'Porosity and shrinkage cavities require X-ray NDT inspection',
      'Lower surface finish and looser dimensional tolerances than CNC machining',
      'Secondary machining required on precision mating surfaces'
    ],
    safetyConsiderations: [
      'Extreme molten splash hazards: aluminized coats, face shields, and spats mandatory',
      'Silica dust exposure during sand preparation requires HEPA air filtration and respirators',
      'Moisture control: even 1 drop of water in molten metal causes explosive steam eruption'
    ],
    realWorldExample: {
      title: 'Automotive Aluminum Engine Block Casting',
      description: 'Tesla and legacy OEMs transitioned from sand-cast iron to high-pressure aluminum gigacasting, consolidating 70+ welded sheet metal parts into a single monolithic die-cast rear underbody.',
      impact: 'Reduced body weight by 35% and eliminated 300+ robotic welding stations on the production line.'
    },
    proTip: 'Always incorporate a minimum 1° to 2° draft angle on vertical walls and radius all internal sharp corners (minimum R3mm) to prevent hot-tearing stresses during thermal shrinkage.'
  },
  {
    id: 'machining-cnc',
    title: 'Machining and CNC',
    tagline: 'High-precision subtractive shaping down to micron tolerances',
    iconName: 'Cpu',
    definition: 'A family of subtractive manufacturing processes where material is progressively removed from a workpiece in the form of chips using specialized cutting tools driven by computer numerical control (CNC).',
    workingPrinciple: 'A cutting tool with defined edge geometry (carbide, PCD, or ceramic) shears workpiece material along primary and secondary shear zones through relative rotary or linear motion under flood or MQL coolant.',
    processSteps: [
      'CAM programming (generating G-code from 3D CAD step files)',
      'Stock fixture selection (vises, soft jaws, vacuum chucks, zero-point fixtures)',
      'Tool setup, probe calibration (touch probes for workpiece WCS and laser tool presetter)',
      'Roughing passes for bulk material removal (high-efficiency trochoidal milling)',
      'Semi-finishing and high-speed finishing passes for target surface roughness (Ra 0.8µm)',
      'Deburring and CMM / air gauge verification'
    ],
    equipment: [
      '3-Axis and 5-Axis Simultaneous CNC Machining Centers',
      'CNC Turning Centers with Live Tooling & Sub-spindles',
      'Wire and Sinker Electrical Discharge Machines (EDM)',
      'Surface Grinders and Cylindrical Grinders'
    ],
    suitableMaterials: [
      'Aluminum 6061-T6, 7075-T6',
      'Stainless Steels (304, 316L, 17-4 PH)',
      'Titanium Gr. 5 (Ti-6Al-4V)',
      'Brass, Bronze, Tool Steels (D2, H13)',
      'Engineering Plastics (Delrin POM, PEEK, UHMW-PE)'
    ],
    incompatibleMaterials: [
      'Unfired green ceramics (shatter easily without diamond grinding)',
      'Very thin elastomer membranes (deflect away from cutters)'
    ],
    applications: [
      'Aerospace structural bulkheads and impellers',
      'Medical orthopedic implants and surgical instruments',
      'Custom automotive turbocharger housings and crankshafts',
      'Injection mold core and cavity inserts'
    ],
    advantages: [
      'Tolerances down to ±0.005 mm (±5 microns) achievable consistently',
      'Exceptional surface finish (mirror finish with grinding/diamond turning)',
      'Applicable to virtually all rigid metals and engineering polymers',
      'No expensive dedicated tooling dies required for single prototypes'
    ],
    limitations: [
      'Subtractive process produces significant swarf/chip waste (often 60-80% scrap ratio)',
      'Higher unit cost for large production runs compared to stamping or moulding',
      'Tool wear on abrasive materials (e.g. titanium or carbon composites)'
    ],
    safetyConsiderations: [
      'High-speed rotating spindles (up to 24,000 RPM) require interlocked safety door enclosures',
      'Aerosolized oil mist hazards necessitate mist collectors on machine enclosures',
      'Flying chip protection and strict ban on loose clothing or gloves around open rotating spindles'
    ],
    realWorldExample: {
      title: '5-Axis Machining of Jet Engine Blisks',
      description: 'Single-piece bladed disks (blisks) milled directly from forged titanium alloy billets rather than slotting individual blades onto rotor hubs.',
      impact: 'Eliminated aerodynamic drag gaps and reduced turbine rotating mass by 30%, increasing fuel efficiency.'
    },
    proTip: 'Follow the rule of thumb: tool overhang length should never exceed 3x to 4x the tool diameter to avoid chatter vibrations and poor surface Ra.'
  },
  {
    id: 'welding-joining',
    title: 'Welding and Joining',
    tagline: 'Permanent metallurgical and mechanical coalescence of structural parts',
    iconName: 'Zap',
    definition: 'A fabrication process that joins materials—usually metals or thermoplastics—by causing coalescence, typically done by melting the workpieces and adding a filler material to form a molten pool that cools to form a joint.',
    workingPrinciple: 'An electric arc, laser beam, friction, or ultrasonic vibration creates localized heating exceeding the base material’s melting temperature or plastic deformation state, creating metallic atomic bonding across crystalline lattices.',
    processSteps: [
      'Joint edge beveling and chemical cleaning (degreasing, acetone, oxide wire brushing)',
      'Fit-up and clamping in precision welding jigs or robotic fixtures',
      'Tack welding to lock alignment and prevent thermal warping',
      'Root pass, fill passes, and cap pass with monitored shielding gas flow (Ar/CO2)',
      'Post-weld heat treatment (PWHT) or stress relieving if required',
      'NDT inspection (dye penetrant, ultrasonic flaw detection, or radiography)'
    ],
    equipment: [
      'MIG/GMAW (Gas Metal Arc Welding) Inverter Power Sources',
      'TIG/GTAW (Gas Tungsten Arc Welding) with High Frequency Arc Start',
      'Fiber Laser Handheld and Robotic Welding Cells',
      'Ultrasonic Plastic and Wire Welders',
      'Friction Stir Welding (FSW) Gantry Machines'
    ],
    suitableMaterials: [
      'Carbon Steels (A36, 1018)',
      'Stainless Steels (304L, 316L)',
      'Aluminum Alloys (5000 and 6000 series with 4043/5356 filler)',
      'Thermoplastics (PP, HDPE, ABS via hot-gas or ultrasonic)'
    ],
    incompatibleMaterials: [
      'High carbon steels without preheat (risk of brittle martensite cracking)',
      'Dissimilar metals with drastic electrochemical or melting differentials (e.g. Copper to Aluminum without friction/explosive bonding)'
    ],
    applications: [
      'Automotive BIW (Body-In-White) robotic spot-welded frames',
      'High-pressure chemical pipelines and ASME boiler pressure vessels',
      'Structural steel building columns and bridge girders',
      'Battery pack busbar ultrasonic wire bonding in EVs'
    ],
    advantages: [
      'Creates monolithic structural strength equal to or exceeding base metal',
      'Watertight and hermetically sealed seams',
      'Cost-effective for large structural assemblies without casting molds'
    ],
    limitations: [
      'Heat-Affected Zone (HAZ) alters metal hardness and grain structure',
      'Residual thermal stresses cause warpage and angular distortion',
      'Requires certified welders (AWS/ISO 9606) or automated robotic cells'
    ],
    safetyConsiderations: [
      'Intense UV radiation causes flash burn ("arc eye"): auto-darkening shade 10-13 helmets required',
      'Hexavalent chromium and ozone fumes require source-capture extraction hoods',
      'Fire watch protocol: hot work permits and dry powder extinguishers ready within 10 meters'
    ],
    realWorldExample: {
      title: 'Robotic Laser-Welded Battery Enclosures',
      description: 'EV manufacturers utilize automated fiber-laser seam welding on extruded 6000-series aluminum battery trays to achieve IP67 immersion ratings without messy silicone gaskets.',
      impact: 'Cycle time cut from 4 minutes per tray down to 38 seconds with zero seal degradation over 10-year vehicle life.'
    },
    proTip: 'Alternate your weld sequencing (back-step welding and stitch welding) to distribute thermal inputs symmetrically and minimize distortion on thin sheet parts.'
  },
  {
    id: 'additive-3d',
    title: 'Additive Manufacturing & 3D Printing',
    tagline: 'Layer-by-layer digital fabrication from generative CAD geometry',
    iconName: 'Box',
    definition: 'Processes that synthesize three-dimensional objects by adding material layer upon layer, guided directly by computer-aided design (CAD) slice data without cutting tools or shaping dies.',
    workingPrinciple: 'Thermoplastic filaments are extruded through heated nozzles (FDM), photosensitive liquid resins are photopolymerized by UV lasers/DLP (SLA), or metal powders are selectively fused by high-power fiber lasers (SLS/DMLS).',
    processSteps: [
      'DFAM (Design for Additive Manufacturing): optimizing orientation and topology optimization',
      'Slicing software setup (infill patterns, support structures, layer height 0.05 - 0.2mm)',
      'Machine pre-heating and build platform bed leveling / leveling calibration',
      'Layer-by-layer automated fabrication (hours to days depending on build envelope)',
      'Part extraction, support removal, and uncured resin wash / metal powder depowdering',
      'Post-curing (UV chamber for resin) or HIP (Hot Isostatic Pressing for metal DMLS)'
    ],
    equipment: [
      'Industrial FDM 3D Printers (Dual Extruder, Heated Chamber >90°C)',
      'SLA and DLP Photopolymer Resin Printers',
      'Direct Metal Laser Sintering (DMLS / SLM) Systems',
      'Selective Laser Sintering (SLS) Nylon Powder Beds',
      'Post-processing wash and thermal UV cure stations'
    ],
    suitableMaterials: [
      'Polymers: PLA, PETG, ABS, Nylon PA12, PEEK, Ultem 9085',
      'Photopolymer Resins (Tough, Rigid, Bio-compatible, Dental)',
      'Metal Powders: Ti-6Al-4V Gr.23, 316L Stainless Steel, AlSi10Mg Aluminum, Inconel 718'
    ],
    incompatibleMaterials: [
      'Brittle unalloyed glasses (without specialized binder jetting)',
      'Wood lumber (though wood-fiber filled filament composites exist)'
    ],
    applications: [
      'Rapid prototype validation and functional form-fit ergonomics',
      'Low-volume customized medical prosthetics and dental aligners',
      'Lightweight aerospace fuel nozzles with internal generative flow channels',
      'Factory floor robotic end-of-arm grippers and assembly jigs'
    ],
    advantages: [
      'Zero tooling startup cost: design changes take hours, not months',
      'Complexity is free: internal lattices, conformal cooling channels impossible with CNC',
      'On-demand distributed manufacturing: print replacement spare parts locally',
      'Substantial raw material waste reduction compared to subtractive milling'
    ],
    limitations: [
      'Anisotropic mechanical properties (weaker strength along the Z-axis layer line)',
      'Slow throughput: not economical for mass production exceeding 5,000 units',
      'Layer line surface texture requires secondary vapor smoothing or sanding'
    ],
    safetyConsiderations: [
      'Metal powder handling (DMLS) poses severe explosive dust and inhalation risks (argon/Class D powder protocols)',
      'Ultraviolet photopolymer resins are skin sensitizers requiring nitrile gloves and fume ventilation',
      'Hot ends reaching 300°C - 450°C and heated print beds require thermal runaway protections'
    ],
    realWorldExample: {
      title: 'GE Aviation LEAP Jet Fuel Nozzle',
      description: 'GE consolidated a fuel nozzle assembly previously fabricated from 20 separate brazed parts into a single 3D-printed DMLS cobalt-chrome component.',
      impact: '25% lighter, 5x more durable, and reduced fuel burn across commercial aircraft fleets.'
    },
    proTip: 'Orient your critical load-bearing axes along the X and Y build directions rather than Z to avoid inter-layer delamination failures under tensile stresses.'
  },
  {
    id: 'sheet-metal',
    title: 'Sheet Metal Fabrication',
    tagline: 'High-speed cutting, punching, and CNC press-brake bending of plates',
    iconName: 'Layers',
    definition: 'The process of transforming flat sheets of metal into functional enclosures, brackets, and chassis through shearing, laser cutting, CNC punching, stamping, and precision press-brake folding.',
    workingPrinciple: 'Flat metal coil or sheet is cut using focused laser beam vaporizing or punch shearing, then deformed plastically beyond its yield point over tooling dies to form permanent bends without fracturing.',
    processSteps: [
      'Flat pattern unfolding in CAD (calculating K-factor and bend deduction)',
      'Nesting software optimization to maximize raw sheet yield (>85%)',
      'CNC fiber laser cutting or turret punch press profiling',
      'Deburring, edge conditioning, and tapping screw threads',
      'CNC press brake bending with V-die and punch tooling',
      'Fastener insertion (PEM self-clinching nuts and standoffs)',
      'Surface finishing: powder coating, anodizing, or electroplating'
    ],
    equipment: [
      'High-Power Fiber Laser Cutters (3kW - 20kW)',
      'CNC Turret Punch Presses with Automated Sheet Loaders',
      'Hydraulic and Electric CNC Press Brakes (50T - 300T)',
      'Automated Hardware Insertion Presses (Haeger machines)',
      'Powder Coating Conveyor Lines with Infrared Curing Ovens'
    ],
    suitableMaterials: [
      'Cold Rolled Carbon Steel (CRCA / SPCC)',
      'Galvanized & Electrogalvanized Steel (GI / SECC)',
      'Aluminum Sheets (5052-H32, 6061-T6)',
      'Stainless Steel (304, 316, 430)',
      'Copper and Brass sheets'
    ],
    incompatibleMaterials: [
      'Brittle cast metals with zero ductility',
      'Spring steel in hardened state (must be bent annealed, then heat treated)'
    ],
    applications: [
      'Computer server racks and industrial electrical control panels',
      'Consumer appliance chassis (washing machines, refrigerators)',
      'Automotive body panels and EV battery skid plates',
      'Medical diagnostics console housings'
    ],
    advantages: [
      'High strength-to-weight ratio with rigid formed ribs and hems',
      'Exceptional speed for medium-to-high volumes',
      'Rapid design iteration using standard press-brake tooling without custom molds',
      'Clean aesthetic when finished with electrostatic powder coating'
    ],
    limitations: [
      'Uniform thickness constraint across the entire part',
      'Limited to 2.5D bend geometry (cannot create organic compound curves without stamping dies)',
      'Springback must be compensated for during press-brake over-bending'
    ],
    safetyConsiderations: [
      'Extremely sharp sheared metal edges require cut-resistant Level 5 Kevlar gloves',
      'Pinch hazards at press brake dies: light curtains and dual-hand control activation mandatory',
      'Class 4 enclosed laser cutting cabins with interlocks to prevent scattered eye damage'
    ],
    realWorldExample: {
      title: 'Hyperscale Data Center Server Enclosures',
      description: 'Manufactured by the millions using automated laser-punch combination machines and robotic bending cells that fold a complete server chassis in under 45 seconds.',
      impact: 'Yields high EMI shielding, optimized airflow ducting, and lightweight stackability.'
    },
    proTip: 'Never place a hole closer to a bend line than 2.5x the sheet thickness, or the hole will deform into an egg shape during bending.'
  },
  {
    id: 'injection-moulding',
    title: 'Injection Moulding',
    tagline: 'High-speed mass production of complex precision plastic components',
    iconName: 'Droplet',
    definition: 'A manufacturing process for producing parts by injecting molten plastic resin under massive pressure into a hardened steel or aluminum mold cavity where it chills and hardens into the final product.',
    workingPrinciple: 'Thermoplastic pellets are fed from a hopper into a reciprocating screw barrel, heated to melt, compressed, and shot under 500-1500 bar pressure into a clamped water-cooled mold cavity.',
    processSteps: [
      'DFM moldability analysis (draft angles, wall thickness, gate locations)',
      'Tooling design & CNC EDM machining of hardened tool steel (P20, H13, S136)',
      'Resin drying (dehumidifying hygroscopic pellets like Nylon/PC)',
      'Clamping, injection, pack & hold phase to counteract volumetric shrinkage',
      'Cooling phase (accounts for 70% of total cycle time)',
      'Mold opening, ejector pin actuation, and robot sprue pick-and-place'
    ],
    equipment: [
      'Electric and Hydraulic Injection Moulding Machines (50T - 1500T clamping force)',
      'Dehumidifying Hopper Dryers and Material Loaders',
      'Mold Temperature Controllers (MTC) and Water Chillers',
      'Hot Runner Temperature Controllers',
      'Automated 3-Axis Servo Sprue Pickers'
    ],
    suitableMaterials: [
      'Polypropylene (PP), Polyethylene (HDPE/LDPE)',
      'ABS, Polycarbonate (PC), PC/ABS blends',
      'Polyamide (Nylon 6/66 with glass fiber reinforcement)',
      'Thermoplastic Polyurethane (TPU / TPE elastomers)',
      'Biodegradable PLA and PHA bioplastics'
    ],
    incompatibleMaterials: [
      'Thermoset rubbers (require compression or reaction injection molding instead)',
      'High melting metals (unless utilizing Metal Injection Molding MIM with binder)'
    ],
    applications: [
      'Smartphone cases, laptop frames, and electronics housings',
      'Automotive dashboards, door panels, and lighting lenses',
      'Medical syringes, petri dishes, and inhaler nozzles',
      'Consumer bottle caps, toys (LEGO bricks), and food containers'
    ],
    advantages: [
      'Extremely low unit cost at volume ($0.05 - $0.50 per part)',
      'Lightning-fast cycle times (5 to 45 seconds per multi-cavity shot)',
      'Phenomenal repeatability and fine feature detail with textured EDM finishes',
      'Minimal post-processing required; colored pellets eliminate painting'
    ],
    limitations: [
      'High initial tooling investment ($5,000 to $100,000+ for steel tooling)',
      'Strict design rules: uniform wall thickness (1.5 - 3.5mm) and draft angles required',
      'Tool modifications are slow and costly once steel is cut'
    ],
    safetyConsiderations: [
      'Massive clamping tonnage hazards: hydraulic and electrical safety gate interlocks',
      'High-pressure hot plastic purge fires: thermal burn protection during purging',
      'Mold hoist and crane rigging procedures when swapping multi-ton steel mold dies'
    ],
    realWorldExample: {
      title: 'LEGO Precision Bricks',
      description: 'Manufactured with high-grade hardened steel molds held to ±0.002 mm tolerances, ensuring bricks molded today clutch seamlessly with bricks made in 1958.',
      impact: 'Produces over 36 billion pieces annually with a scrap rate below 18 parts per million.'
    },
    proTip: 'Maintain uniform wall thickness across your entire part. Where thick sections are needed (like bosses or ribs), keep rib thickness at 50% to 60% of the nominal wall to avoid unsightly surface sink marks.'
  },
  {
    id: 'assembly-production',
    title: 'Assembly & Production Lines',
    tagline: 'Flow balancing, modular cellular manufacturing, and Poka-Yoke error proofing',
    iconName: 'Workflow',
    definition: 'The organized sequence of manufacturing operations where sub-components, fasteners, and functional modules are progressively joined together to build a completed, tested finished product.',
    workingPrinciple: 'Synchronizing cycle times (Takt time) across sequential workstations to achieve single-piece flow or balanced batch flow, eliminating line bottlenecks and Work-In-Progress (WIP) buildup.',
    processSteps: [
      'Standard Operating Procedure (SOP) work instruction design',
      'Line balancing and Takt time calculation based on customer demand',
      'Kitting and point-of-use parts delivery (Kanban two-bin replenishment)',
      'Mechanical fastening, adhesive dispensing, and harness routing',
      'Poka-Yoke (mistake-proofing) physical sensor and vision checks',
      'End-of-Line (EOL) functional testing, packaging, and serialization'
    ],
    equipment: [
      'Powered Roller and Friction Drive Assembly Conveyors',
      'Smart Torque Screwdrivers with Angle and Torque Telemetry Recording',
      'Automated Liquid Dispensing Robots (RTV silicone, Cyanoacrylate)',
      'Pick-to-Light Guided Parts Shelving Racks',
      'Automated Guided Vehicles (AGVs) and Autonomous Mobile Robots (AMRs)'
    ],
    suitableMaterials: [
      'Assembled modules of all materials (metals, plastics, PCBs, wire harnesses, glass)'
    ],
    incompatibleMaterials: [
      'N/A (assembly handles integrated multi-material components)'
    ],
    applications: [
      'Consumer smartphone and laptop final packout lines',
      'Automotive vehicle final assembly plants (trim, chassis, engine marry)',
      'Medical diagnostics instrument assembly in cleanrooms',
      'Commercial aircraft fuselage integration'
    ],
    advantages: [
      'High throughput with specialized, ergonomic division of labor',
      'Real-time traceability: every screw torque and serial number logged to MES',
      'Scalable output by adding parallel workstations or shifts'
    ],
    limitations: [
      'A line stoppage at any critical station halts downstream operations without buffer',
      'Product changeovers require retooling and re-training line operators'
    ],
    safetyConsiderations: [
      'Repetitive Strain Injury (RSI) ergonomics: height-adjustable anti-fatigue stations',
      'Pinch hazards on moving conveyor belts and transfer tables',
      'ESD (Electrostatic Discharge) grounded wrist straps and conductive flooring around electronics'
    ],
    realWorldExample: {
      title: 'Automotive Marriage Station',
      description: 'The automated workstation where the pre-assembled chassis, battery, and suspension are joined to the painted vehicle body using 24 synchronous multi-spindle torque guns in 42 seconds.',
      impact: 'Guarantees 100% torque compliance on safety-critical chassis bolts.'
    },
    proTip: 'Implement physical Poka-Yoke fixtures: design asymmetrical locating pins or tabs so that parts physically cannot be inserted upside down or backward.'
  },
  {
    id: 'robotics-automation',
    title: 'Robotics and Industrial Automation',
    tagline: 'Cobots, multi-axis articulate arms, PLCs, and AI-driven machine vision',
    iconName: 'Bot',
    definition: 'The application of programmable mechanical manipulators, programmable logic controllers (PLCs), sensors, and vision systems to perform manufacturing tasks with minimal human intervention.',
    workingPrinciple: 'Closed-loop motion control: sensors feed position and environmental data to PLCs or industrial IPCs, which compute kinematic algorithms and command servo drives to actuate brushless motors with millimeter accuracy.',
    processSteps: [
      'Automation feasibility study and cycle time simulation (e.g. RobotStudio, RoboDK)',
      'End-of-Arm Tooling (EOAT) design (vacuum cups, pneumatic grippers, magnetic chucks)',
      'Cell safety enclosure design (interlocks, area safety scanners, light curtains)',
      'PLC ladder logic programming (IEC 61131-3) and robot path teach pendant coding',
      'Vision system lighting and camera calibration (part localization and flaw grading)',
      'Commissioning, factory acceptance testing (FAT), and continuous OEE tracking'
    ],
    equipment: [
      '6-Axis Articulated Industrial Robots (Fanuc, KUKA, ABB)',
      'Collaborative Robots (Cobots - Universal Robots, Techman)',
      'SCARA Robots for High-Speed Pick and Place (Epson, Stäubli)',
      'Delta Robots for Packaging lines',
      'Industrial PLCs (Siemens S7-1500, Allen Bradley ControlLogix)',
      'Machine Vision Systems (Cognex, Keyence 2D/3D lasers)'
    ],
    suitableMaterials: [
      'Compatible with all manufacturing parts (handling, machining, welding, packaging)'
    ],
    incompatibleMaterials: [
      'Unpredictably deformable limp fabrics or gel substances without specialized compliant grippers'
    ],
    applications: [
      'Automotive spot welding and spray painting cells',
      'High-speed packaging, kitting, and palletizing',
      'Machine tending: loading billets into CNC lathes and unloading finished parts',
      'Automated optical inspection (AOI) for circuit board PCB assembly'
    ],
    advantages: [
      '24/7 continuous operation with predictable takt times and zero fatigue',
      'Elevates human operators away from hazardous, dull, or toxic tasks',
      'Precision repeatability down to ±0.02 mm over millions of operational cycles'
    ],
    limitations: [
      'High initial capital expenditure (CapEx) requiring 12-24 month payback ROI',
      'Requires skilled automation engineers for troubleshooting and program updates'
    ],
    safetyConsiderations: [
      'ISO 10218 and ISO/TS 15066 safety standards compliance',
      'E-Stop category 4 dual-channel safety relays',
      'Strict separation of manual zones; Cobots require torque-sensing force limits'
    ],
    realWorldExample: {
      title: 'CNC Machine Tending by Collaborative Robots',
      description: 'A single Cobot mounted on a linear slide rail tends three CNC milling machines, loading raw billets and deburring parts while blowing chips off fixtures.',
      impact: 'Increased machine utilization from 62% to 94% through lights-out night shifts.'
    },
    proTip: 'For high-mix low-volume operations, use Cobots with hand-guiding teaching modes; they cut redeployment and programming time from days down to 30 minutes per new SKU.'
  },
  {
    id: 'quality-control',
    title: 'Quality Control & Metrology',
    tagline: 'Defect prevention, GD&T dimensional verification, and Six Sigma capability',
    iconName: 'CheckCircle2',
    definition: 'The operational techniques and engineering activities used to verify that manufactured products conform to specified geometric tolerances, metallurgical properties, and functional reliability standards.',
    workingPrinciple: 'Measurement science (metrology) using calibrated contact probes, laser interferometry, and statistical sampling methods (Cp, Cpk) to detect process drift before out-of-spec defects are produced.',
    processSteps: [
      'Quality inspection plan development based on 2D engineering drawings and GD&T datum frames',
      'First Article Inspection (FAI) on setup pieces before granting production run release',
      'In-process sampling inspection (X-bar and R charts for statistical process control)',
      'Gauge R&R (Repeatability & Reproducibility) measurement system analysis',
      'Non-Destructive Testing (NDT) for internal structural flaws',
      'Final QA sign-off, Certificate of Conformance (CoC), and traceability archiving'
    ],
    equipment: [
      'Bridge Coordinate Measuring Machines (CMM) with Renishaw touch/laser probes',
      'Optical Profile Projectors and Digital Measuring Microscopes',
      'Surface Roughness Testers (Stylus Profilometers measuring Ra, Rz)',
      'Hardness Testers (Rockwell HRC, Vickers, Brinell)',
      'Ultrasonic Thickness Gauges and Eddy Current Crack Detectors'
    ],
    suitableMaterials: [
      'Applicable across all machined, cast, molded, and fabricated engineering materials'
    ],
    incompatibleMaterials: ['N/A'],
    applications: [
      'Aerospace turbine blade dimensional tolerance auditing (tight tolerances to ±3µm)',
      'Medical implant surface finish Ra verification for bio-integration',
      'Automotive crash structure weld integrity ultrasonic inspection',
      'Consumer electronics cosmetic inspection (color spectrophotometers)'
    ],
    advantages: [
      'Prevents catastrophic field failures and costly warranty recalls',
      'Provides empirical data for continuous process improvement (reducing scrap rate)',
      'Required for industry certifications (ISO 9001, AS9100, IATF 16949)'
    ],
    limitations: [
      'Inspection is non-value-adding labor: aim should be process capability (Cpk > 1.33) rather than sorting defects at the end',
      'High-end CMM and metrology equipment requires temperature-controlled clean labs (20°C ± 1°C)'
    ],
    safetyConsiderations: [
      'Radiation safety protocols when operating industrial X-ray or CT scanning cabinets',
      'Laser safety when utilizing high-power 3D laser scanning heads'
    ],
    realWorldExample: {
      title: 'Real-time Closed-Loop Tool Compensation on CNC Machines',
      description: 'An on-machine touch probe measures critical bores directly in the machining center and feeds deviation data to the CNC controller to adjust tool wear offsets automatically.',
      impact: 'Maintained Cpk of 1.67 across 10,000 components with zero operator manual offset entries.'
    },
    proTip: 'Follow the 10:1 Gauge Rule: the measuring instrument should be at least 10 times more precise than the tolerance you are trying to verify (e.g. measuring ±0.01mm requires a tool accurate to ±0.001mm).'
  },
  {
    id: 'lean-manufacturing',
    title: 'Lean Manufacturing & Operational Excellence',
    tagline: 'Systematic elimination of the 8 Wastes (Muda) and continuous improvement (Kaizen)',
    iconName: 'TrendingUp',
    definition: 'A production philosophy derived primarily from the Toyota Production System (TPS) focused on maximizing customer value while minimizing waste and non-value-adding activities across the entire value stream.',
    workingPrinciple: 'Pull-system production: goods are manufactured only as downstream customers consume them, guided by Visual Management, Standardized Work, and systematic elimination of Muda (waste), Muri (overburden), and Mura (unevenness).',
    processSteps: [
      'Value Stream Mapping (VSM): charting current state vs future state timelines',
      '5S workplace organization: Sort, Set in order, Shine, Standardize, Sustain',
      'Identification of the 8 Wastes: Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory, Motion, Extra-processing (DOWNTIME)',
      'SMED (Single-Minute Exchange of Die) quick changeover workshops',
      'Kanban pull-card loop implementation to govern WIP levels',
      'Daily Gemba walks and Kaizen suggestion blitzes'
    ],
    equipment: [
      'Visual Andon light boards and digital production dashboards',
      'Shadow boards for tools and color-coded floor marking systems',
      'Gravity-fed flow racks for ergonomic parts presentation',
      'SMED quick-clamp pneumatic couplers on stamping presses'
    ],
    suitableMaterials: ['Universal operational methodology across all production facilities'],
    incompatibleMaterials: ['N/A'],
    applications: [
      'High-volume automotive and electronics manufacturing plants',
      'Low-volume, high-mix job shops seeking to slash setup changeover times',
      'Pharmaceutical cleanroom packaging lines',
      'Warehouse logistics and order fulfillment fulfillment hubs'
    ],
    advantages: [
      'Drastically slashes lead times (often 50% to 80% reduction in dock-to-dock time)',
      'Frees up floor space by eliminating stagnant inventory piles',
      'Empowers frontline shop-floor workers to solve problems collaboratively'
    ],
    limitations: [
      'Fragile in the face of sudden supply chain disruptions if Just-In-Time buffers are set to zero without regional safety stock',
      'Requires sustained cultural leadership commitment; 70% of superficial rollouts falter'
    ],
    safetyConsiderations: [
      '5S directly improves physical safety: eliminates tripping hazards, spills, and blocked fire exits'
    ],
    realWorldExample: {
      title: 'SMED Setup Time Reduction on a 400-Ton Stamping Press',
      description: 'By converting internal setup steps (searching for bolts, adjusting die height) into external prep steps done while the prior job is still running, die changeover dropped from 95 minutes to 7 minutes.',
      impact: 'Allowed the factory to run small batches twice a day instead of massive weekly inventory runs.'
    },
    proTip: 'When implementing 5S, don’t just paint lines on the floor: assign specific ownership to individual team members and hold 3-minute daily audits to make habits stick.'
  },
  {
    id: 'industrial-safety',
    title: 'Industrial Safety & OSH Compliance',
    tagline: 'Zero-harm engineering controls, Lockout/Tagout, and hazard risk mitigation',
    iconName: 'ShieldAlert',
    definition: 'The multidisciplinary field concerned with the safety, health, and welfare of workers in factories, workshops, and processing plants through hierarchy of hazard controls, equipment guarding, and safety management systems.',
    workingPrinciple: 'Hierarchy of Controls: Elimination → Substitution → Engineering Controls (guards, interlocks) → Administrative Controls (training, permits) → Personal Protective Equipment (PPE).',
    processSteps: [
      'Job Safety Analysis (JSA) and Hazard Identification & Risk Assessment (HIRA)',
      'Machine safeguarding installation (light curtains, interlocking interlock switches, emergency trips)',
      'Hazardous energy control: Lockout / Tagout (LOTO) protocol certification',
      'Chemical management: Safety Data Sheet (SDS) availability and secondary containment',
      'Emergency response drills (fire, chemical spill, first aid responder squads)',
      'Incident and near-miss investigation with root-cause analysis (5-Whys)'
    ],
    equipment: [
      'Lockout/Tagout padlocks, hasps, cable lockouts, and breaker lockouts',
      'Optical Safety Light Curtains (Type 4) and Area Laser Scanners',
      'Emergency Stop (E-Stop) push buttons and cable pull switches',
      'Chemical eyewash and safety deluge shower stations',
      'Personal Protective Equipment: Steel-toe metatarsal boots, ANSI Z87+ safety glasses, hearing protection'
    ],
    suitableMaterials: ['Mandatory across all heavy manufacturing and prototyping environments'],
    incompatibleMaterials: ['N/A'],
    applications: [
      'Heavy stamping press and shearing cells',
      'Chemical processing, electroplating, and painting lines',
      'Confined space vessel maintenance in breweries and oil refineries',
      'High-voltage electrical substations and automated robotic enclosures'
    ],
    advantages: [
      'Saves human lives and prevents disabling amputations and chronic illnesses',
      'Prevents multimillion-dollar regulatory fines and catastrophic plant shutdowns',
      'Builds high morale and lower worker turnover'
    ],
    limitations: [
      'Safety devices bypassed by shortcutting operators if not properly engineered for ergonomic ease of work'
    ],
    safetyConsiderations: [
      'Never allow working alone during high-hazard operations (molten metal, high voltage, chemical tanks)',
      'Verify zero-energy state physically after LOTO before placing hands inside machine envelope'
    ],
    realWorldExample: {
      title: 'Digital LOTO Management Implementation',
      description: 'A Tier-1 metal stamping facility replaced paper lock tags with IoT Bluetooth padlocks that require smartphone RFID scans of the specific hydraulic bleed valve before releasing the master key.',
      impact: 'Zero energy-release incidents in 4 consecutive years and audit compliance up to 100%.'
    },
    proTip: 'The best safety designs are "fail-safe": if power, air pressure, or sensor wiring is cut, the machine must default to a stopped, locked, de-energized position by gravity or mechanical springs.'
  },
  {
    id: 'sustainable-manufacturing',
    title: 'Sustainable & Circular Manufacturing',
    tagline: 'Net-zero carbon, closed-loop waste recycling, and circular economy lifecycles',
    iconName: 'Leaf',
    definition: 'The creation of manufactured products through economically sound processes that minimize negative environmental impacts while conserving energy and natural resources through closed loops.',
    workingPrinciple: 'Circular Economy model (Reduce, Reuse, Remanufacture, Recycle): designing products for disassembly (DFD), substituting fossil-based inputs with bio-based alternatives, and capturing manufacturing byproducts as secondary feedstock.',
    processSteps: [
      'Life Cycle Assessment (LCA) from cradle to gate (energy, water, embodied CO2)',
      'Material selection: maximizing post-consumer recycled (PCR) and renewable bio-composites',
      'Internal scrap loop: on-machine granulators for immediate runner regrind in injection molding',
      'Coolant and lubricant recovery: centrifugal oil separators and filtration units',
      'Energy efficiency retrofits: variable frequency drives (VFD) on compressors and heat recovery pumps',
      'Design for Disassembly: snap-fits and standardized fasteners to ease end-of-life recycling'
    ],
    equipment: [
      'On-line Plastic Granulators and Regrind Proportioners',
      'Metal Swarf / Chip Briquetting Hydraulic Presses',
      'Industrial Coolant Recycling and Centrifugal Tramp Oil Skimmers',
      'Solar Rooftop PV arrays with Smart Microgrid Energy Monitoring',
      'Wastewater Evaporators and Reverse Osmosis Zero-Liquid-Discharge (ZLD) Systems'
    ],
    suitableMaterials: [
      'Post-Consumer Recycled Plastics (R-PET, R-HDPE, R-PP)',
      'Bio-based Polymers (PLA, PHA, Bio-PE)',
      'Agricultural Biomass Composites (rice husk, sugarcane bagasse, hemp fiber, mycelium)',
      'Infinitely recyclable metals (Aluminum, Copper, Steel)'
    ],
    incompatibleMaterials: [
      'Multi-layer laminated packaging with inseparable glued plastic/foil barrier films (difficult to recycle mechanically)'
    ],
    applications: [
      'Eco-friendly packaging replacing single-use styrofoam with molded pulp/mycelium',
      'Automotive interiors using natural flax fibers and recycled ocean plastic upholstery',
      'Remanufactured diesel engines and heavy machinery components (Caterpillar Reman)',
      'Zero-landfill consumer electronics assembly'
    ],
    advantages: [
      'Substantial cost savings from scrap reuse and lower electricity bills',
      'Compliance with strict carbon boundary adjustments and ESG investor mandates',
      'Resilience against raw material price volatility and geopolitical supply pinches'
    ],
    limitations: [
      'Recycled plastics may have wider melt flow index (MFI) variance requiring tighter process monitoring',
      'Bio-resins may have lower thermal deflection temperatures (HDT) than high-performance virgin polymers'
    ],
    safetyConsiderations: [
      'Fine biomass dust (wood flour, starch) poses deflagration hazards requiring NFPA explosion venting',
      'Biological feedstock storage must be kept dry to prevent spontaneous decomposition'
    ],
    realWorldExample: {
      title: 'Closed-Loop Aluminum Scrap Recycling at Ford F-150 Plant',
      description: 'Stamping lines feature underground vacuum tubes that suck off-spec aluminum scrap directly back to supplier smelting furnaces within the same day.',
      impact: 'Recycles 20 million pounds of military-grade aluminum alloy monthly, enough to build 30,000 new truck cabs without mining bauxite.'
    },
    proTip: 'In plastic injection molding, blending up to 20% to 30% clean in-house regrind into virgin resin usually yields zero perceptible drop in tensile strength while saving 15-25% in material purchasing costs.'
  }
];
