import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Info,
  Layers,
  Cpu,
  Wrench,
  Check,
  Box,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';
import { DFMProcessType, DFMRuleCheck } from '../types';

interface PresetPart {
  id: string;
  name: string;
  process: DFMProcessType;
  material: string;
  description: string;
  inputs: Record<string, number | string | boolean>;
}

const PRESET_PARTS: PresetPart[] = [
  {
    id: 'sensor-enclosure',
    name: 'Sensor Enclosure Box',
    process: 'injection-molding',
    material: 'Polycarbonate / ABS blend',
    description: 'Rugged IoT enclosure with snap latches and o-ring groove.',
    inputs: {
      wallThickness: 2.4,
      draftAngle: 1.5,
      ribRatio: 55,
      cornerRadius: 1.2,
      hasUndercut: false,
      surfaceClass: 'SPI-B2 (Semi-Gloss)'
    }
  },
  {
    id: 'aerospace-bracket',
    name: 'Avionics Mounting Bracket',
    process: 'cnc-milling',
    material: 'Aluminum 6061-T6',
    description: 'Lightweight milled bracket with pocket cavities and mounting lugs.',
    inputs: {
      depthRatio: 3.2,
      internalRadius: 3.0,
      minWall: 1.8,
      blindHoleMargin: 2.5,
      setupAxes: '3-Axis Vertical Mill'
    }
  },
  {
    id: 'server-chassis',
    name: '1U Rackmount Server Panel',
    process: 'sheet-metal',
    material: 'Aluminum 5052-H32 (1.5mm)',
    description: 'Folded sheet metal housing with PEM fastener nuts and ventilation louvers.',
    inputs: {
      bendRadiusRatio: 1.2,
      holeToEdgeRatio: 2.5,
      hasBendRelief: true,
      minFlangeLength: 8.0,
      materialThickness: 1.5
    }
  },
  {
    id: 'drone-arm',
    name: 'Quadcopter Motor Arm',
    process: '3d-printing',
    material: 'PA-12 Carbon Fiber Nylon',
    description: 'Functional drone arm with aerodynamic hollow lattice structure.',
    inputs: {
      maxOverhangAngle: 42,
      minWallThickness: 1.6,
      maxBridgeSpan: 12,
      infillDensity: 40,
      supportType: 'Tree Supports'
    }
  },
  {
    id: 'heatsink-bell',
    name: 'Brushless Motor Stator Bell',
    process: 'die-casting',
    material: 'A380 Aluminum Alloy',
    description: 'High-pressure die cast thermal housing with cooling fins.',
    inputs: {
      draftAngle: 2.0,
      wallUniformityPct: 15,
      ejectorBossDraft: 2.5,
      filletRadius: 2.0
    }
  }
];

interface DFMAnalyzerPageProps {
  onSendToPlanner?: (blueprintData: any) => void;
}

export const DFMAnalyzerPage: React.FC<DFMAnalyzerPageProps> = ({ onSendToPlanner }) => {
  const [selectedProcess, setSelectedProcess] = useState<DFMProcessType>('injection-molding');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sensor-enclosure');

  // Injection Molding State
  const [imWall, setImWall] = useState<number>(2.4);
  const [imDraft, setImDraft] = useState<number>(1.5);
  const [imRibRatio, setImRibRatio] = useState<number>(55);
  const [imCornerRadius, setImCornerRadius] = useState<number>(1.2);
  const [imUndercut, setImUndercut] = useState<boolean>(false);

  // CNC Milling State
  const [cncDepthRatio, setCncDepthRatio] = useState<number>(3.2);
  const [cncInternalRadius, setCncInternalRadius] = useState<number>(3.0);
  const [cncMinWall, setCncMinWall] = useState<number>(1.8);
  const [cncBlindMargin, setCncBlindMargin] = useState<number>(2.5);

  // Sheet Metal State
  const [smBendRadiusRatio, setSmBendRadiusRatio] = useState<number>(1.2);
  const [smHoleEdgeRatio, setSmHoleEdgeRatio] = useState<number>(2.5);
  const [smBendRelief, setSmBendRelief] = useState<boolean>(true);
  const [smFlangeLength, setSmFlangeLength] = useState<number>(8.0);
  const [smThickness, setSmThickness] = useState<number>(1.5);

  // 3D Printing State
  const [amOverhang, setAmOverhang] = useState<number>(42);
  const [amWall, setAmWall] = useState<number>(1.6);
  const [amBridge, setAmBridge] = useState<number>(12);
  const [amInfill, setAmInfill] = useState<number>(40);

  // Die Casting State
  const [dcDraft, setDcDraft] = useState<number>(2.0);
  const [dcWallVariation, setDcWallVariation] = useState<number>(15);
  const [dcEjectorDraft, setDcEjectorDraft] = useState<number>(2.5);
  const [dcFillet, setDcFillet] = useState<number>(2.0);

  // Load Preset
  const handleLoadPreset = (preset: PresetPart) => {
    setSelectedPresetId(preset.id);
    setSelectedProcess(preset.process);

    if (preset.process === 'injection-molding') {
      setImWall(Number(preset.inputs.wallThickness) || 2.4);
      setImDraft(Number(preset.inputs.draftAngle) || 1.5);
      setImRibRatio(Number(preset.inputs.ribRatio) || 55);
      setImCornerRadius(Number(preset.inputs.cornerRadius) || 1.2);
      setImUndercut(Boolean(preset.inputs.hasUndercut));
    } else if (preset.process === 'cnc-milling') {
      setCncDepthRatio(Number(preset.inputs.depthRatio) || 3.2);
      setCncInternalRadius(Number(preset.inputs.internalRadius) || 3.0);
      setCncMinWall(Number(preset.inputs.minWall) || 1.8);
      setCncBlindMargin(Number(preset.inputs.blindHoleMargin) || 2.5);
    } else if (preset.process === 'sheet-metal') {
      setSmBendRadiusRatio(Number(preset.inputs.bendRadiusRatio) || 1.2);
      setSmHoleEdgeRatio(Number(preset.inputs.holeToEdgeRatio) || 2.5);
      setSmBendRelief(Boolean(preset.inputs.hasBendRelief));
      setSmFlangeLength(Number(preset.inputs.minFlangeLength) || 8.0);
      setSmThickness(Number(preset.inputs.materialThickness) || 1.5);
    } else if (preset.process === '3d-printing') {
      setAmOverhang(Number(preset.inputs.maxOverhangAngle) || 42);
      setAmWall(Number(preset.inputs.minWallThickness) || 1.6);
      setAmBridge(Number(preset.inputs.maxBridgeSpan) || 12);
      setAmInfill(Number(preset.inputs.infillDensity) || 40);
    } else if (preset.process === 'die-casting') {
      setDcDraft(Number(preset.inputs.draftAngle) || 2.0);
      setDcWallVariation(Number(preset.inputs.wallUniformityPct) || 15);
      setDcEjectorDraft(Number(preset.inputs.ejectorBossDraft) || 2.5);
      setDcFillet(Number(preset.inputs.filletRadius) || 2.0);
    }
  };

  // Evaluate Rules Based on Current Process
  const evaluateRules = (): { rules: DFMRuleCheck[]; score: number; defectRisks: string[]; remedies: string[] } => {
    const rules: DFMRuleCheck[] = [];
    const defectRisks: string[] = [];
    const remedies: string[] = [];
    let scoreDeduction = 0;

    if (selectedProcess === 'injection-molding') {
      // Wall Thickness Rule
      if (imWall >= 1.5 && imWall <= 3.5) {
        rules.push({
          id: 'im-wall',
          name: 'Nominal Wall Thickness',
          parameter: 'Wall Thickness',
          value: `${imWall} mm`,
          recommendedRange: '1.5 – 3.5 mm',
          status: 'pass',
          risk: 'Low thermal shrinkage risk.',
          remediation: 'Complies with standard resin flow length and cooling rates.'
        });
      } else if (imWall < 1.5) {
        scoreDeduction += 20;
        rules.push({
          id: 'im-wall',
          name: 'Nominal Wall Thickness',
          parameter: 'Wall Thickness',
          value: `${imWall} mm`,
          recommendedRange: '1.5 – 3.5 mm',
          status: 'fail',
          risk: 'Short-shot risk (melt freezes before mold cavity fills completely).',
          remediation: 'Increase wall thickness to at least 1.5 mm or increase injection speed/pressure.'
        });
        defectRisks.push('Short Shot (incomplete fill under standard injection pressure)');
        remedies.push('Increase wall thickness to >= 1.6 mm to avoid freezing off polymer gate.');
      } else {
        scoreDeduction += 15;
        rules.push({
          id: 'im-wall',
          name: 'Nominal Wall Thickness',
          parameter: 'Wall Thickness',
          value: `${imWall} mm`,
          recommendedRange: '1.5 – 3.5 mm',
          status: 'warning',
          risk: 'High cooling cycle times and internal void / sink formation.',
          remediation: 'Core out thick sections to maintain uniform 2.5mm wall with structural ribs.'
        });
        defectRisks.push('Sink Marks & Internal Cavity Voids');
        remedies.push('Core out solid blocks to create hollow shells with reinforcing gussets.');
      }

      // Draft Angle Rule
      if (imDraft >= 1.0) {
        rules.push({
          id: 'im-draft',
          name: 'Part Release Draft Angle',
          parameter: 'Draft Angle',
          value: `${imDraft}°`,
          recommendedRange: '≥ 1.0° (add 1° per 0.025mm texture)',
          status: 'pass',
          risk: 'Clean mold ejection without drag marks.',
          remediation: 'Adequate draft ensures parts do not scuff against polished cavity walls.'
        });
      } else if (imDraft >= 0.5) {
        scoreDeduction += 10;
        rules.push({
          id: 'im-draft',
          name: 'Part Release Draft Angle',
          parameter: 'Draft Angle',
          value: `${imDraft}°`,
          recommendedRange: '≥ 1.0°',
          status: 'warning',
          risk: 'Marginal release force; risk of pin punch-through or scuff marks.',
          remediation: 'Increase draft to 1.5° or apply Teflon / mirror EDM finish on shutoffs.'
        });
        defectRisks.push('Ejector Pin Punch-Through & Cosmetic Drag Marks');
        remedies.push('Increase vertical shutoff draft to >= 1.2° for smooth ejection.');
      } else {
        scoreDeduction += 25;
        rules.push({
          id: 'im-draft',
          name: 'Part Release Draft Angle',
          parameter: 'Draft Angle',
          value: `${imDraft}°`,
          recommendedRange: '≥ 1.0°',
          status: 'fail',
          risk: 'Critical: Part will stick in the stationary half, causing machine jams.',
          remediation: 'Apply at least 1.0° draft on all exterior and interior shutoff walls.'
        });
        defectRisks.push('Mold Lock-Up (Part stuck in cavity)');
        remedies.push('Redesign vertical surfaces with positive taper draft.');
      }

      // Rib to Wall Ratio Rule
      if (imRibRatio <= 60) {
        rules.push({
          id: 'im-rib',
          name: 'Rib-to-Wall Thickness Ratio',
          parameter: 'Rib Ratio',
          value: `${imRibRatio}%`,
          recommendedRange: '40% – 60% of base wall',
          status: 'pass',
          risk: 'Minimal sink mark indentation on the cosmetic Class-A surface.',
          remediation: 'Maintains stiffness without excessive localized mass.'
        });
      } else {
        scoreDeduction += 15;
        rules.push({
          id: 'im-rib',
          name: 'Rib-to-Wall Thickness Ratio',
          parameter: 'Rib Ratio',
          value: `${imRibRatio}%`,
          recommendedRange: '40% – 60% of base wall',
          status: 'fail',
          risk: 'Severe sink shadow lines visible on the external cosmetic exterior.',
          remediation: 'Reduce rib root thickness to 50% of the nominal wall and add draft.'
        });
        defectRisks.push('Cosmetic Sink Mark Shadows on Opposite Face');
        remedies.push('Thin rib base thickness to 50% of wall and compensate with taller ribs.');
      }

      // Undercut Check
      if (!imUndercut) {
        rules.push({
          id: 'im-undercut',
          name: 'Tool Undercuts & Side Actions',
          parameter: 'Undercut Presence',
          value: 'None (Straight-Pull)',
          recommendedRange: 'Zero undercuts preferred',
          status: 'pass',
          risk: 'Economical 2-plate straight-pull mold tooling.',
          remediation: 'Standard tooling keeps mold manufacturing costs minimal.'
        });
      } else {
        scoreDeduction += 15;
        rules.push({
          id: 'im-undercut',
          name: 'Tool Undercuts & Side Actions',
          parameter: 'Undercut Presence',
          value: 'Side-Action Required',
          recommendedRange: 'Zero undercuts preferred',
          status: 'warning',
          risk: 'Requires hydraulic or cam side-actions, increasing mold cost by $4,000–$8,000.',
          remediation: 'Consider pass-through shutoff holes in the parting plane to eliminate slides.'
        });
        remedies.push('Use bypass shutoffs to create snaps without needing hydraulic side cams.');
      }
    } else if (selectedProcess === 'cnc-milling') {
      // Cavity Depth to Width Ratio
      if (cncDepthRatio <= 3.0) {
        rules.push({
          id: 'cnc-depth',
          name: 'Pocket Depth-to-Width Ratio',
          parameter: 'Depth Ratio (L/D)',
          value: `${cncDepthRatio}:1`,
          recommendedRange: '≤ 3:1 (optimal ≤ 2:1)',
          status: 'pass',
          risk: 'Standard endmill rigidity with zero chatter.',
          remediation: 'Allows aggressive feeds and speeds with standard tooling.'
        });
      } else if (cncDepthRatio <= 4.5) {
        scoreDeduction += 15;
        rules.push({
          id: 'cnc-depth',
          name: 'Pocket Depth-to-Width Ratio',
          parameter: 'Depth Ratio (L/D)',
          value: `${cncDepthRatio}:1`,
          recommendedRange: '≤ 3:1',
          status: 'warning',
          risk: 'Requires extended-reach endmills with reduced feed rate to prevent tool deflection.',
          remediation: 'Increase floor pocket width or add stepped depth transitions.'
        });
        defectRisks.push('Tool Chatter & Surface Ripple in Deep Pockets');
        remedies.push('Use stepped depth geometry or ball-nose high-feed indexable cutters.');
      } else {
        scoreDeduction += 30;
        rules.push({
          id: 'cnc-depth',
          name: 'Pocket Depth-to-Width Ratio',
          parameter: 'Depth Ratio (L/D)',
          value: `${cncDepthRatio}:1`,
          recommendedRange: '≤ 3:1',
          status: 'fail',
          risk: 'Extreme tool deflection, taper error, and cutter breakage risk.',
          remediation: 'Severe DFM penalty. Redesign pocket with split two-piece assembly or EDM.'
        });
        defectRisks.push('Endmill Breakage & Wall Taper Distortion');
        remedies.push('Split component into bolted assembly or shallow pocket pockets.');
      }

      // Internal Corner Radius
      if (cncInternalRadius >= 2.0) {
        rules.push({
          id: 'cnc-radius',
          name: 'Internal Corner Fillet Radius',
          parameter: 'Fillet Radius',
          value: `R ${cncInternalRadius} mm`,
          recommendedRange: '≥ R 1.5 mm (preferably > R 3.0 mm)',
          status: 'pass',
          risk: 'Standard round endmill sweeps smoothly into internal vertical corners.',
          remediation: 'Ideal corner radius is 10-15% larger than tool radius to prevent corner dwell.'
        });
      } else if (cncInternalRadius > 0.5) {
        scoreDeduction += 15;
        rules.push({
          id: 'cnc-radius',
          name: 'Internal Corner Fillet Radius',
          parameter: 'Fillet Radius',
          value: `R ${cncInternalRadius} mm`,
          recommendedRange: '≥ R 1.5 mm',
          status: 'warning',
          risk: 'Requires very small micro-endmills with long machining cycle times.',
          remediation: 'Increase corner radius to R 2.5mm or add corner relief dogbones for mating parts.'
        });
        defectRisks.push('Slow Machining Cycle & Micro-Tool Breakage');
        remedies.push('Add dogbone corner reliefs if square mating components must slide in.');
      } else {
        scoreDeduction += 30;
        rules.push({
          id: 'cnc-radius',
          name: 'Internal Corner Fillet Radius',
          parameter: 'Fillet Radius',
          value: 'Sharp Corner (R ~ 0)',
          recommendedRange: '≥ R 1.5 mm',
          status: 'fail',
          risk: 'Impossible to mill directly with rotary tools. Requires Sinker EDM electrode.',
          remediation: 'Add internal corner radius R >= 1.5 mm or specify wire/sinker EDM.'
        });
        defectRisks.push('Unmachinable Sharp Internal Corners');
        remedies.push('Change sharp corners to rounded fillets or dogbone relief cuts.');
      }

      // Minimum Wall Thickness
      if (cncMinWall >= 1.5) {
        rules.push({
          id: 'cnc-wall',
          name: 'Free-Standing Wall Thickness',
          parameter: 'Wall Thickness',
          value: `${cncMinWall} mm`,
          recommendedRange: '≥ 1.2 mm for metal / ≥ 2.0 mm for plastic',
          status: 'pass',
          risk: 'Rigid walls withstand cutting pressure without vibration.',
          remediation: 'Complies with standard machining stability parameters.'
        });
      } else {
        scoreDeduction += 20;
        rules.push({
          id: 'cnc-wall',
          name: 'Free-Standing Wall Thickness',
          parameter: 'Wall Thickness',
          value: `${cncMinWall} mm`,
          recommendedRange: '≥ 1.5 mm',
          status: 'fail',
          risk: 'Cutting forces will bow thin walls, causing chatter marks and tolerance deviation.',
          remediation: 'Increase wall thickness to at least 1.5 mm or machine in stepped roughing passes.'
        });
        defectRisks.push('Thin Wall Flexion & Out-of-Tolerance Bowing');
        remedies.push('Increase thin web walls to >= 1.8mm to prevent chatter.');
      }
    } else if (selectedProcess === 'sheet-metal') {
      // Bend Radius Ratio
      if (smBendRadiusRatio >= 1.0) {
        rules.push({
          id: 'sm-radius',
          name: 'Inside Bend Radius vs Thickness (R/T)',
          parameter: 'R / T Ratio',
          value: `${smBendRadiusRatio} × T`,
          recommendedRange: '≥ 1.0 × Sheet Thickness (T)',
          status: 'pass',
          risk: 'Zero grain cracking along outer tension zone.',
          remediation: 'Conforms to standard air-bending press brake V-die geometry.'
        });
      } else {
        scoreDeduction += 25;
        rules.push({
          id: 'sm-radius',
          name: 'Inside Bend Radius vs Thickness (R/T)',
          parameter: 'R / T Ratio',
          value: `${smBendRadiusRatio} × T`,
          recommendedRange: '≥ 1.0 × T',
          status: 'fail',
          risk: 'Tearing and micro-fractures along outer bend radius, especially across sheet grain.',
          remediation: 'Set internal bend radius equal to or greater than material thickness (R >= T).'
        });
        defectRisks.push('Outer Tensile Surface Cracking on Bend');
        remedies.push('Increase inside bend radius to >= 1.2 * sheet thickness.');
      }

      // Hole to Edge Distance
      if (smHoleEdgeRatio >= 2.0) {
        rules.push({
          id: 'sm-hole',
          name: 'Hole-to-Edge Distance',
          parameter: 'Edge Margin',
          value: `${smHoleEdgeRatio} × T`,
          recommendedRange: '≥ 2.0 × Sheet Thickness (T)',
          status: 'pass',
          risk: 'Prevents hole elongation and edge bulging during punch or laser cutting.',
          remediation: 'Allows full punch die clearance without wall blowout.'
        });
      } else {
        scoreDeduction += 20;
        rules.push({
          id: 'sm-hole',
          name: 'Hole-to-Edge Distance',
          parameter: 'Edge Margin',
          value: `${smHoleEdgeRatio} × T`,
          recommendedRange: '≥ 2.0 × T',
          status: 'fail',
          risk: 'Hole will distort into oval shape during bending or punch die will push out edge.',
          remediation: 'Maintain at least 2.5 × T distance between hole edge and bend tangent line.'
        });
        defectRisks.push('Hole Ovality & Edge Bulge Deformation');
        remedies.push('Offset hole further from bend tangent line or punch post-bend.');
      }

      // Bend Relief Check
      if (smBendRelief) {
        rules.push({
          id: 'sm-relief',
          name: 'Bend Relief Slots',
          parameter: 'Relief Geometry',
          value: 'Included (Relief notches active)',
          recommendedRange: 'Width & depth ≥ 1.0 × T',
          status: 'pass',
          risk: 'Prevents uncontrolled metal tearing at flange edges.',
          remediation: 'Standard relief notches allow clean 90° flange brake forming.'
        });
      } else {
        scoreDeduction += 20;
        rules.push({
          id: 'sm-relief',
          name: 'Bend Relief Slots',
          parameter: 'Relief Geometry',
          value: 'Missing Relief',
          recommendedRange: 'Width & depth ≥ 1.0 × T',
          status: 'fail',
          risk: 'Tearing and puckering at corner corners where bend terminates into adjacent material.',
          remediation: 'Add rectangular or circular bend relief slots with depth >= thickness.'
        });
        defectRisks.push('Corner Flange Tearing & Puckering');
        remedies.push('Add bend relief notches with width equal to sheet thickness.');
      }
    } else if (selectedProcess === '3d-printing') {
      // Overhang Angle
      if (amOverhang <= 45) {
        rules.push({
          id: 'am-overhang',
          name: 'Overhang Angle (from vertical)',
          parameter: 'Overhang Angle',
          value: `${amOverhang}°`,
          recommendedRange: '≤ 45° for supportless printing',
          status: 'pass',
          risk: 'Crisp downward surface without support scarring.',
          remediation: 'Self-supporting geometry minimizes post-processing time.'
        });
      } else {
        scoreDeduction += 20;
        rules.push({
          id: 'am-overhang',
          name: 'Overhang Angle (from vertical)',
          parameter: 'Overhang Angle',
          value: `${amOverhang}°`,
          recommendedRange: '≤ 45°',
          status: 'warning',
          risk: 'Filament sagging or droop; requires sacrificial support structures.',
          remediation: 'Chamfer bottom edges to 45° or orient build plate to minimize overhang.'
        });
        defectRisks.push('Drooping Strands & Support Removal Scarring');
        remedies.push('Chamfer downward faces at 45 degrees or use breakaway tree supports.');
      }

      // Bridge Span
      if (amBridge <= 10) {
        rules.push({
          id: 'am-bridge',
          name: 'Unsupported Horizontal Bridge',
          parameter: 'Bridge Span',
          value: `${amBridge} mm`,
          recommendedRange: '≤ 10 mm (or up to 15 mm with cooling)',
          status: 'pass',
          risk: 'Fan air cures bridging strands quickly across gap.',
          remediation: 'Safe horizontal span.'
        });
      } else {
        scoreDeduction += 15;
        rules.push({
          id: 'am-bridge',
          name: 'Unsupported Horizontal Bridge',
          parameter: 'Bridge Span',
          value: `${amBridge} mm`,
          recommendedRange: '≤ 10 mm',
          status: 'warning',
          risk: 'Sagging strings on underside of bridge span.',
          remediation: 'Add center support rib or arch the bridge ceiling.'
        });
        defectRisks.push('Underside Bridge Sagging & Stringing');
        remedies.push('Arch top ceiling or add a temporary breakaway rib pillar.');
      }

      // Min Wall Thickness
      if (amWall >= 1.2) {
        rules.push({
          id: 'am-wall',
          name: 'Minimum Vertical Shell Wall',
          parameter: 'Wall Thickness',
          value: `${amWall} mm`,
          recommendedRange: '≥ 1.2 mm (3 perimeters with 0.4mm nozzle)',
          status: 'pass',
          risk: 'Watertight, robust perimeters with good inter-layer bond.',
          remediation: 'Allows at least 3 concentric extrusion beads.'
        });
      } else {
        scoreDeduction += 25;
        rules.push({
          id: 'am-wall',
          name: 'Minimum Vertical Shell Wall',
          parameter: 'Wall Thickness',
          value: `${amWall} mm`,
          recommendedRange: '≥ 1.2 mm',
          status: 'fail',
          risk: 'Fragile single-wall shell; high risk of delamination under load.',
          remediation: 'Increase wall thickness to at least 1.2mm (or 3x nozzle diameter).'
        });
        defectRisks.push('Layer Delamination & Perforation');
        remedies.push('Thicken wall to >= 1.6 mm to allow solid concentric shells.');
      }
    } else if (selectedProcess === 'die-casting') {
      // Draft Angle
      if (dcDraft >= 1.5) {
        rules.push({
          id: 'dc-draft',
          name: 'Die Cavity Draft Angle',
          parameter: 'Draft Angle',
          value: `${dcDraft}°`,
          recommendedRange: '≥ 1.5° (2.0° on internal cores)',
          status: 'pass',
          risk: 'Fast die release with minimal die soldering.',
          remediation: 'Ensures high tool life across 100,000+ shots.'
        });
      } else {
        scoreDeduction += 25;
        rules.push({
          id: 'dc-draft',
          name: 'Die Cavity Draft Angle',
          parameter: 'Draft Angle',
          value: `${dcDraft}°`,
          recommendedRange: '≥ 1.5°',
          status: 'fail',
          risk: 'Molten metal galling against steel die; high ejection force damage.',
          remediation: 'Increase draft angle to >= 2.0° especially on core pins.'
        });
        defectRisks.push('Die Soldering & Pin Seizure');
        remedies.push('Increase draft on core steel surfaces to >= 2.0°.');
      }

      // Wall Uniformity
      if (dcWallVariation <= 20) {
        rules.push({
          id: 'dc-uniformity',
          name: 'Cross-Section Wall Uniformity',
          parameter: 'Wall Variation',
          value: `±${dcWallVariation}%`,
          recommendedRange: '≤ 20% variation',
          status: 'pass',
          risk: 'Balanced solidification front without hot spots.',
          remediation: 'Prevents shrinkage porosity in heavy isolated sections.'
        });
      } else {
        scoreDeduction += 20;
        rules.push({
          id: 'dc-uniformity',
          name: 'Cross-Section Wall Uniformity',
          parameter: 'Wall Variation',
          value: `±${dcWallVariation}%`,
          recommendedRange: '≤ 20% variation',
          status: 'fail',
          risk: 'Heavy shrinkage porosity in thick sections as thin sections solidify first.',
          remediation: 'Core out thick bosses to achieve uniform wall thickness throughout.'
        });
        defectRisks.push('Subsurface Shrinkage Porosity & Hot Tearing');
        remedies.push('Core out isolated thick bosses to equalize cooling rates.');
      }
    }

    const finalScore = Math.max(10, Math.min(100, 100 - scoreDeduction));
    return { rules, score: finalScore, defectRisks, remedies };
  };

  const { rules, score, defectRisks } = evaluateRules();

  const getScoreColor = (sc: number) => {
    if (sc >= 85) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
    if (sc >= 65) return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/50 bg-rose-500/10';
  };

  const getStatusBadge = (sc: number) => {
    if (sc >= 85)
      return {
        label: 'Optimal DFM Ready',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      };
    if (sc >= 65)
      return {
        label: 'Moderate DFM Risk',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      };
    return {
      label: 'High Tooling & Defect Risk',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    };
  };

  const statusBadge = getStatusBadge(score);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Design for Manufacturability (DFM) Rule Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            DFM Analyzer & Defect Predictor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Verify your part geometry against industry manufacturing design rules before tooling.
            Detect sink marks, tool chatter, warpage, and mold lockups with instant remediation advice.
          </p>
        </div>

        {/* Quick Presets Dropdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Sample Preset:</span>
          <select
            value={selectedPresetId}
            onChange={e => {
              const found = PRESET_PARTS.find(p => p.id === e.target.value);
              if (found) handleLoadPreset(found);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
          >
            {PRESET_PARTS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.process.replace('-', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Process Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {[
          { id: 'injection-molding', label: 'Injection Molding', icon: Box },
          { id: 'cnc-milling', label: 'CNC Milling', icon: Cpu },
          { id: 'sheet-metal', label: 'Sheet Metal', icon: Layers },
          { id: '3d-printing', label: '3D Printing (Additive)', icon: Sparkles },
          { id: 'die-casting', label: 'High-Pressure Casting', icon: Wrench }
        ].map(item => {
          const Icon = item.icon;
          const isActive = selectedProcess === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedProcess(item.id as DFMProcessType)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                isActive
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Geometry Parameter Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-850 p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Part Geometry Parameters</span>
              </h3>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">
                {selectedProcess.replace('-', ' ')}
              </span>
            </div>

            {/* Injection Molding Controls */}
            {selectedProcess === 'injection-molding' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Nominal Wall Thickness</span>
                    <span className="text-cyan-400 font-mono">{imWall.toFixed(1)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="6.0"
                    step="0.1"
                    value={imWall}
                    onChange={e => setImWall(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Standard range: 1.5 – 3.5 mm</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Draft Angle per Side</span>
                    <span className="text-cyan-400 font-mono">{imDraft.toFixed(1)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="5.0"
                    step="0.5"
                    value={imDraft}
                    onChange={e => setImDraft(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Minimum recommended: ≥ 1.0°</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Rib-to-Wall Ratio</span>
                    <span className="text-cyan-400 font-mono">{imRibRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="5"
                    value={imRibRatio}
                    onChange={e => setImRibRatio(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Target 40% – 60% to prevent cosmetic sink</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-300 block">Undercut / Side Holes</span>
                    <span className="text-[10px] text-slate-500">Requires hydraulic slide action in mold</span>
                  </div>
                  <button
                    onClick={() => setImUndercut(!imUndercut)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      imUndercut
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {imUndercut ? 'Yes (Side Cams)' : 'None (Straight Pull)'}
                  </button>
                </div>
              </div>
            )}

            {/* CNC Milling Controls */}
            {selectedProcess === 'cnc-milling' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Cavity Depth-to-Width (L/D)</span>
                    <span className="text-cyan-400 font-mono">{cncDepthRatio.toFixed(1)}:1</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.2"
                    value={cncDepthRatio}
                    onChange={e => setCncDepthRatio(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Ratio &gt; 3:1 causes tool chatter & deflection</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Internal Corner Fillet Radius</span>
                    <span className="text-cyan-400 font-mono">R {cncInternalRadius.toFixed(1)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="8.0"
                    step="0.5"
                    value={cncInternalRadius}
                    onChange={e => setCncInternalRadius(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Sharp corners (R ~ 0) require costly EDM</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Minimum Wall Thickness</span>
                    <span className="text-cyan-400 font-mono">{cncMinWall.toFixed(1)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={cncMinWall}
                    onChange={e => setCncMinWall(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Keep ≥ 1.5mm to avoid chatter vibration</span>
                </div>
              </div>
            )}

            {/* Sheet Metal Controls */}
            {selectedProcess === 'sheet-metal' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Inside Bend Radius Ratio (R / T)</span>
                    <span className="text-cyan-400 font-mono">{smBendRadiusRatio.toFixed(1)} × T</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="3.0"
                    step="0.1"
                    value={smBendRadiusRatio}
                    onChange={e => setSmBendRadiusRatio(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Keep ≥ 1.0 × T to prevent metal cracking</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Hole Distance to Bend Line</span>
                    <span className="text-cyan-400 font-mono">{smHoleEdgeRatio.toFixed(1)} × T</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="4.0"
                    step="0.2"
                    value={smHoleEdgeRatio}
                    onChange={e => setSmHoleEdgeRatio(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Keep ≥ 2.0 × T to prevent hole oval distortion</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-300 block">Bend Relief Notches</span>
                    <span className="text-[10px] text-slate-500">Prevents tearing at flange edges</span>
                  </div>
                  <button
                    onClick={() => setSmBendRelief(!smBendRelief)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      smBendRelief
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {smBendRelief ? 'Included' : 'Missing Relief'}
                  </button>
                </div>
              </div>
            )}

            {/* 3D Printing Controls */}
            {selectedProcess === '3d-printing' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Max Overhang Angle</span>
                    <span className="text-cyan-400 font-mono">{amOverhang}°</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="70"
                    step="1"
                    value={amOverhang}
                    onChange={e => setAmOverhang(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Angles &gt; 45° require support generation</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Unsupported Bridge Span</span>
                    <span className="text-cyan-400 font-mono">{amBridge} mm</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={amBridge}
                    onChange={e => setAmBridge(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Spans &gt; 10mm may sag without fan cooling</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Minimum Wall Shell Thickness</span>
                    <span className="text-cyan-400 font-mono">{amWall.toFixed(1)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="3.0"
                    step="0.2"
                    value={amWall}
                    onChange={e => setAmWall(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Keep ≥ 1.2mm (3 perimeter perimeters)</span>
                </div>
              </div>
            )}

            {/* Die Casting Controls */}
            {selectedProcess === 'die-casting' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Die Cavity Draft Angle</span>
                    <span className="text-cyan-400 font-mono">{dcDraft.toFixed(1)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.5"
                    value={dcDraft}
                    onChange={e => setDcDraft(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Keep ≥ 1.5° to prevent die soldering</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Cross-Section Wall Variation</span>
                    <span className="text-cyan-400 font-mono">±{dcWallVariation}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={dcWallVariation}
                    onChange={e => setDcWallVariation(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Variations &gt; 25% cause internal shrinkage porosity</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Real-Time Score Gauge & Defect Prediction (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* DFM Score Gauge Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center font-mono ${getScoreColor(
                  score
                )}`}
              >
                <span className="text-3xl font-black">{score}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">/ 100</span>
              </div>
              <div>
                <span
                  className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1.5 ${statusBadge.color}`}
                >
                  {statusBadge.label}
                </span>
                <h3 className="text-lg font-bold text-white">Manufacturability Rating</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  {score >= 85
                    ? 'Part geometry meets high-yield standard tolerances with minimal tooling risk.'
                    : score >= 65
                    ? 'Moderate tooling complexity detected. Minor modifications will lower cycle time and piece cost.'
                    : 'Critical DFM blockers detected. High risk of tooling failure, machine jams, or high scrap.'}
                </p>
              </div>
            </div>

            {onSendToPlanner && (
              <button
                onClick={() =>
                  onSendToPlanner({
                    title: `DFM Optimized ${selectedProcess.replace('-', ' ').toUpperCase()} Component`,
                    process: selectedProcess,
                    score
                  })
                }
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
              >
                <span>Export to Planner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Defect Risk Predictions (if any) */}
          {defectRisks.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Predicted Manufacturing Defects ({defectRisks.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {defectRisks.map((defect, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-950/70 border border-rose-500/30 text-rose-200 flex items-start gap-2"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{defect}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evaluated DFM Rules List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Evaluated Process Design Rules
            </h4>
            <div className="space-y-2.5">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-xl border transition-all ${
                    rule.status === 'pass'
                      ? 'bg-slate-900/60 border-slate-800'
                      : rule.status === 'warning'
                      ? 'bg-amber-950/15 border-amber-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      {rule.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : rule.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className="text-xs font-bold text-white">{rule.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-slate-400">{rule.value}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          rule.status === 'pass'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : rule.status === 'warning'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {rule.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                    <strong className="text-slate-300">Analysis:</strong> {rule.risk}
                  </p>
                  <p className="text-xs text-cyan-400/90 pl-6 mt-1 font-medium">
                    ↳ <span className="underline">Remedy:</span> {rule.remediation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
