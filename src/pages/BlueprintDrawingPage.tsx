import React, { useState } from 'react';
import {
  Compass,
  Sliders,
  Printer,
  Download,
  Info,
  Layers,
  CheckCircle2,
  Maximize2,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface FitClass {
  code: string;
  name: string;
  type: 'Clearance' | 'Transition' | 'Interference';
  holeToleranceMicrons: [number, number]; // [min, max]
  shaftToleranceMicrons: [number, number]; // [min, max]
  application: string;
}

const FIT_CLASSES: Record<string, FitClass> = {
  'H7/g6': {
    code: 'H7/g6',
    name: 'Precision Sliding Fit',
    type: 'Clearance',
    holeToleranceMicrons: [0, 21],
    shaftToleranceMicrons: [-14, -7],
    application: 'Machine tool spindles, sliding gears, precision pistons that move freely without noticeable shake.'
  },
  'H7/h6': {
    code: 'H7/h6',
    name: 'Locational Clearance Fit',
    type: 'Clearance',
    holeToleranceMicrons: [0, 21],
    shaftToleranceMicrons: [-13, 0],
    application: 'Removable dowel pins, spigots, locating rings with zero radial play during static assembly.'
  },
  'H7/k6': {
    code: 'H7/k6',
    name: 'Locational Transition Fit',
    type: 'Transition',
    holeToleranceMicrons: [0, 21],
    shaftToleranceMicrons: [2, 15],
    application: 'Pulleys, inner bearing races on shafts with light mallet tapping; zero backlash under vibration.'
  },
  'H7/p6': {
    code: 'H7/p6',
    name: 'Light Press / Interference Fit',
    type: 'Interference',
    holeToleranceMicrons: [0, 21],
    shaftToleranceMicrons: [22, 35],
    application: 'Permanent bronze bushings, drive collars, press-fit gear hubs requiring arbor press assembly.'
  },
  'H8/f7': {
    code: 'H8/f7',
    name: 'Close Running Fit',
    type: 'Clearance',
    holeToleranceMicrons: [0, 33],
    shaftToleranceMicrons: [-41, -20],
    application: 'Rotary bearings, shaft couplings operating at elevated temperatures with continuous oil film lubrication.'
  }
};

export const BlueprintDrawingPage: React.FC = () => {
  // Part Geometry Dimensions (mm)
  const [outerDiameter, setOuterDiameter] = useState<number>(80);
  const [boreDiameter, setBoreDiameter] = useState<number>(32);
  const [overallLength, setOverallLength] = useState<number>(75);
  const [flangeDiameter, setFlangeDiameter] = useState<number>(120);
  const [flangeThickness, setFlangeThickness] = useState<number>(18);
  const [boltCirclePCD, setBoltCirclePCD] = useState<number>(100);
  const [boltHoleCount, setBoltHoleCount] = useState<number>(4);
  const [boltHoleDiameter, setBoltHoleDiameter] = useState<number>(9);
  const [chamferSize, setChamferSize] = useState<number>(2.0);

  // Selected Limits & Fits
  const [selectedFit, setSelectedFit] = useState<string>('H7/g6');
  const [generalToleranceClass, setGeneralToleranceClass] = useState<string>('ISO 2768-m (Medium)');
  const [materialGrade, setMaterialGrade] = useState<string>('Aluminum 6061-T6 (Anodized Type II)');

  // Selected Fit calculations
  const fitData = FIT_CLASSES[selectedFit] || FIT_CLASSES['H7/g6'];
  const holeMin = boreDiameter + fitData.holeToleranceMicrons[0] / 1000;
  const holeMax = boreDiameter + fitData.holeToleranceMicrons[1] / 1000;
  const shaftMin = boreDiameter + fitData.shaftToleranceMicrons[0] / 1000;
  const shaftMax = boreDiameter + fitData.shaftToleranceMicrons[1] / 1000;

  const minClearance = (holeMin - shaftMax) * 1000; // in microns
  const maxClearance = (holeMax - shaftMin) * 1000; // in microns

  // Blueprint preset parts
  const handleLoadPreset = (preset: 'flange-bushing' | 'bearing-housing' | 'pulley-hub') => {
    if (preset === 'flange-bushing') {
      setOuterDiameter(70);
      setBoreDiameter(30);
      setOverallLength(65);
      setFlangeDiameter(110);
      setFlangeThickness(16);
      setBoltCirclePCD(92);
      setBoltHoleCount(4);
      setBoltHoleDiameter(8.5);
      setSelectedFit('H7/p6');
      setMaterialGrade('Bearing Bronze SAE 660');
    } else if (preset === 'bearing-housing') {
      setOuterDiameter(95);
      setBoreDiameter(42);
      setOverallLength(85);
      setFlangeDiameter(140);
      setFlangeThickness(22);
      setBoltCirclePCD(118);
      setBoltHoleCount(6);
      setBoltHoleDiameter(11);
      setSelectedFit('H7/h6');
      setMaterialGrade('Ductile Cast Iron 65-45-12');
    } else {
      setOuterDiameter(85);
      setBoreDiameter(25);
      setOverallLength(55);
      setFlangeDiameter(130);
      setFlangeThickness(15);
      setBoltCirclePCD(105);
      setBoltHoleCount(4);
      setBoltHoleDiameter(9);
      setSelectedFit('H7/k6');
      setMaterialGrade('Steel 4140 Annealed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>2D Technical Drawing & Metrology Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            CAD Technical Blueprint & GD&T Viewer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Inspect real-time dimensioned engineering drawings with orthographic cross-sections,
            ISO 286 hole/shaft tolerance fits, geometric dimensioning & tolerancing (GD&T) feature control frames, and exportable vector blueprints.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleLoadPreset('flange-bushing')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold"
          >
            Flanged Bushing
          </button>
          <button
            onClick={() => handleLoadPreset('bearing-housing')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold"
          >
            Bearing Housing
          </button>
          <button
            onClick={() => handleLoadPreset('pulley-hub')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold"
          >
            Pulley Hub
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Blueprint</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Canvas (8 cols), Right Dimension & Tolerance Controls (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: The CAD Drawing Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0b1329] rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden p-6 relative">
            {/* Drawing Title & Sheet Info Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cyan-900/50 text-[11px] font-mono text-cyan-400">
              <div className="flex items-center gap-4">
                <span>THIRD ANGLE PROJECTION</span>
                <span>•</span>
                <span>SCALE 1:1</span>
                <span>•</span>
                <span>ALL DIMS IN MILLIMETERS (mm)</span>
              </div>
              <div className="text-slate-400">
                SHEET 1 OF 1 • REV B
              </div>
            </div>

            {/* Interactive SVG Engineering Blueprint */}
            <div className="w-full flex justify-center py-6 overflow-x-auto">
              <svg
                viewBox="0 0 720 400"
                className="w-full max-w-[720px] h-auto select-none font-mono"
              >
                {/* Blueprint Background Grid */}
                <defs>
                  <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#172554" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="hatch-pattern" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#38bdf8" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="720" height="400" fill="url(#blueprint-grid)" />

                {/* View 1: Cross-Section A-A (Left Half of Canvas, center X=200, center Y=200) */}
                <g id="section-view" transform="translate(40, 20)">
                  {/* Centerline */}
                  <line x1="20" y1="180" x2="300" y2="180" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="12,3,2,3" />

                  {/* Section A-A Label */}
                  <text x="160" y="32" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    SECTION A-A
                  </text>

                  {/* Top Solid Half of Cross-Section (with Hatching) */}
                  {/* Flange Top */}
                  <polygon
                    points="60,90 90,90 90,130 180,130 180,160 60,160"
                    fill="url(#hatch-pattern)"
                    stroke="#f8fafc"
                    strokeWidth="2"
                  />
                  {/* Bottom Solid Half of Cross-Section (with Hatching) */}
                  <polygon
                    points="60,270 90,270 90,230 180,230 180,200 60,200"
                    fill="url(#hatch-pattern)"
                    stroke="#f8fafc"
                    strokeWidth="2"
                  />

                  {/* Bore Internal Cavity Lines */}
                  <line x1="60" y1="160" x2="180" y2="160" stroke="#f8fafc" strokeWidth="2" />
                  <line x1="60" y1="200" x2="180" y2="200" stroke="#f8fafc" strokeWidth="2" />

                  {/* Outer Hub Profile */}
                  <line x1="90" y1="130" x2="180" y2="130" stroke="#f8fafc" strokeWidth="2" />
                  <line x1="90" y1="230" x2="180" y2="230" stroke="#f8fafc" strokeWidth="2" />
                  <line x1="180" y1="130" x2="180" y2="160" stroke="#f8fafc" strokeWidth="2" />
                  <line x1="180" y1="200" x2="180" y2="230" stroke="#f8fafc" strokeWidth="2" />

                  {/* Flange Faces */}
                  <line x1="60" y1="90" x2="60" y2="270" stroke="#f8fafc" strokeWidth="2" />
                  <line x1="90" y1="90" x2="90" y2="130" stroke="#f8fafc" strokeWidth="2" />
                  <line x1="90" y1="230" x2="90" y2="270" stroke="#f8fafc" strokeWidth="2" />

                  {/* Bolt Hole in Flange (Top and Bottom) */}
                  <rect x="70" y="100" width="12" height="15" fill="#0b1329" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" />
                  <rect x="70" y="245" width="12" height="15" fill="#0b1329" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" />

                  {/* Dimension Callout 1: Overall Length */}
                  <line x1="60" y1="290" x2="180" y2="290" stroke="#34d399" strokeWidth="1.2" markerEnd="url(#arrow)" />
                  <line x1="60" y1="275" x2="60" y2="300" stroke="#34d399" strokeWidth="0.8" />
                  <line x1="180" y1="235" x2="180" y2="300" stroke="#34d399" strokeWidth="0.8" />
                  <text x="120" y="306" fill="#34d399" fontSize="11" textAnchor="middle" fontWeight="bold">
                    {overallLength} ±0.1
                  </text>

                  {/* Dimension Callout 2: Flange Thickness */}
                  <line x1="60" y1="65" x2="90" y2="65" stroke="#34d399" strokeWidth="1.2" />
                  <line x1="60" y1="60" x2="60" y2="85" stroke="#34d399" strokeWidth="0.8" />
                  <line x1="90" y1="60" x2="90" y2="85" stroke="#34d399" strokeWidth="0.8" />
                  <text x="75" y="58" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">
                    {flangeThickness}
                  </text>

                  {/* Dimension Callout 3: Bore Diameter with Tolerance */}
                  <line x1="200" y1="160" x2="200" y2="200" stroke="#38bdf8" strokeWidth="1.2" />
                  <line x1="180" y1="160" x2="210" y2="160" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="180" y1="200" x2="210" y2="200" stroke="#38bdf8" strokeWidth="0.8" />
                  <text x="215" y="184" fill="#38bdf8" fontSize="11" fontWeight="bold">
                    Ø{boreDiameter} {selectedFit}
                  </text>

                  {/* Datum A Marker on Back Face */}
                  <polygon points="60,180 50,175 50,185" fill="#f59e0b" />
                  <rect x="25" y="172" width="25" height="16" fill="#0b1329" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="37" y="184" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                    A
                  </text>
                </g>

                {/* View 2: Front Orthographic Circular View (Right Half of Canvas, center X=530, center Y=200) */}
                <g id="front-view" transform="translate(480, 20)">
                  {/* View Label */}
                  <text x="100" y="32" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    FRONT VIEW
                  </text>

                  {/* Centerlines */}
                  <line x1="0" y1="180" x2="200" y2="180" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="12,3,2,3" />
                  <line x1="100" y1="80" x2="100" y2="280" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="12,3,2,3" />

                  {/* Outer Flange Circle */}
                  <circle cx="100" cy="180" r="90" fill="none" stroke="#f8fafc" strokeWidth="2" />

                  {/* Hub Outer Circle (Dashed or Hidden Line Behind Flange) */}
                  <circle cx="100" cy="180" r="55" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2" />

                  {/* Central Bore Circle */}
                  <circle cx="100" cy="180" r="30" fill="#070d1e" stroke="#f8fafc" strokeWidth="2" />

                  {/* Pitch Circle Diameter (PCD) for Bolts */}
                  <circle cx="100" cy="180" r="72" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6,3" />

                  {/* Bolt Holes on PCD */}
                  {[0, 90, 180, 270].slice(0, boltHoleCount).map((ang, i) => {
                    const rad = (ang * Math.PI) / 180;
                    const bx = 100 + 72 * Math.cos(rad);
                    const by = 180 + 72 * Math.sin(rad);
                    return (
                      <circle
                        key={i}
                        cx={bx}
                        cy={by}
                        r="6"
                        fill="#0b1329"
                        stroke="#f8fafc"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {/* Bolt Hole Spec Callout */}
                  <line x1="150" y1="130" x2="190" y2="100" stroke="#34d399" strokeWidth="1" />
                  <line x1="190" y1="100" x2="230" y2="100" stroke="#34d399" strokeWidth="1" />
                  <text x="195" y="95" fill="#34d399" fontSize="10" fontWeight="bold">
                    {boltHoleCount}× Ø{boltHoleDiameter} THRU
                  </text>
                  <text x="195" y="112" fill="#38bdf8" fontSize="9">
                    EQ SP ON Ø{boltCirclePCD} PCD
                  </text>

                  {/* Outer Flange Diameter Callout */}
                  <line x1="100" y1="270" x2="100" y2="305" stroke="#34d399" strokeWidth="0.8" />
                  <line x1="10" y1="270" x2="10" y2="305" stroke="#34d399" strokeWidth="0.8" />
                  <line x1="10" y1="300" x2="100" y2="300" stroke="#34d399" strokeWidth="1" />
                  <text x="55" y="315" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Ø{flangeDiameter}
                  </text>
                </g>

                {/* GD&T Feature Control Frame Box (Bottom Center) */}
                <g id="gdt-frame" transform="translate(240, 345)">
                  {/* Position Frame */}
                  <rect x="0" y="0" width="130" height="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                  <line x1="26" y1="0" x2="26" y2="24" stroke="#38bdf8" strokeWidth="1.2" />
                  <line x1="78" y1="0" x2="78" y2="24" stroke="#38bdf8" strokeWidth="1.2" />
                  <line x1="104" y1="0" x2="104" y2="24" stroke="#38bdf8" strokeWidth="1.2" />

                  {/* Symbol: Position ⨁ */}
                  <text x="13" y="16" fill="#f8fafc" fontSize="14" textAnchor="middle">⨁</text>
                  {/* Tolerance: Ø 0.05 Ⓜ */}
                  <text x="52" y="16" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">Ø 0.05 Ⓜ</text>
                  {/* Primary Datum: A */}
                  <text x="91" y="16" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
                  {/* Secondary Datum: B */}
                  <text x="117" y="16" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">B</text>

                  {/* Surface Roughness Callout */}
                  <g transform="translate(160, 0)">
                    <path d="M 0 18 L 6 0 L 14 0" fill="none" stroke="#f8fafc" strokeWidth="1.2" />
                    <text x="6" y="-3" fill="#f8fafc" fontSize="10" fontWeight="bold">Ra 0.8</text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Title Block on Bottom Right of Drawing */}
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[9px]">PART NAME:</span>
                <span className="text-white font-bold">PRECISION FLANGED HUB</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">MATERIAL:</span>
                <span className="text-cyan-300 font-bold truncate block">{materialGrade}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">GENERAL TOL:</span>
                <span className="text-emerald-400 font-bold">{generalToleranceClass}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">APPROVAL:</span>
                <span className="text-teal-400 font-bold">MANUGENIUS DFM ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Parametric Sliders & ISO 286 Limits and Fits (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* ISO 286 Hole & Shaft Fits Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>ISO 286 Limits & Fits Calculator</span>
              </h3>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                fitData.type === 'Clearance'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : fitData.type === 'Interference'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {fitData.type}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Fit Class Designation</label>
                <select
                  value={selectedFit}
                  onChange={e => setSelectedFit(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none focus:border-cyan-500 text-xs"
                >
                  {Object.keys(FIT_CLASSES).map(k => (
                    <option key={k} value={k}>
                      {k} — {FIT_CLASSES[k].name} ({FIT_CLASSES[k].type})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {fitData.application}
                </p>
              </div>

              {/* Exact Tolerance Range Display */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Hole Tolerance ({selectedFit.split('/')[0]})
                  </span>
                  <div className="font-mono text-cyan-300 font-bold text-xs">
                    +{fitData.holeToleranceMicrons[1]} µm / {fitData.holeToleranceMicrons[0]} µm
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Ø{holeMin.toFixed(3)} – Ø{holeMax.toFixed(3)} mm
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Shaft Tolerance ({selectedFit.split('/')[1]})
                  </span>
                  <div className="font-mono text-emerald-300 font-bold text-xs">
                    {fitData.shaftToleranceMicrons[1] >= 0 ? `+${fitData.shaftToleranceMicrons[1]}` : fitData.shaftToleranceMicrons[1]} µm / {fitData.shaftToleranceMicrons[0]} µm
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Ø{shaftMin.toFixed(3)} – Ø{shaftMax.toFixed(3)} mm
                  </span>
                </div>
              </div>

              {/* Calculated Clearance / Interference */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] flex justify-between font-mono">
                <span className="text-slate-400">
                  {fitData.type === 'Interference' ? 'Max Press Interference:' : 'Min/Max Running Clearance:'}
                </span>
                <span className="text-white font-bold">
                  {Math.abs(minClearance)} µm to {Math.abs(maxClearance)} µm
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Geometry Dimension Sliders */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4" />
              <span>Parametric Geometry Dimensions</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Central Bore Diameter</span>
                  <span className="text-cyan-400 font-mono">Ø {boreDiameter} mm</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={boreDiameter}
                  onChange={e => setBoreDiameter(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Overall Part Length</span>
                  <span className="text-emerald-400 font-mono">{overallLength} mm</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={overallLength}
                  onChange={e => setOverallLength(parseInt(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Flange Thickness</span>
                  <span className="text-teal-400 font-mono">{flangeThickness} mm</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  value={flangeThickness}
                  onChange={e => setFlangeThickness(parseInt(e.target.value))}
                  className="w-full accent-teal-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Flange Outer Diameter</span>
                  <span className="text-cyan-400 font-mono">Ø {flangeDiameter} mm</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="160"
                  value={flangeDiameter}
                  onChange={e => setFlangeDiameter(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Bolt Hole Count</span>
                  <span className="text-white font-mono">{boltHoleCount} holes</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 4, 6].map(count => (
                    <button
                      key={count}
                      onClick={() => setBoltHoleCount(count)}
                      className={`py-1 rounded-lg text-xs font-bold border transition-colors ${
                        boltHoleCount === count
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {count} Holes
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
