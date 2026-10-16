import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Scale,
  X,
  ExternalLink,
  DollarSign,
  Zap,
  Leaf,
  Table,
  Calculator,
  Box,
  Sparkles,
  ArrowRight,
  Clock,
  Scissors,
  Check,
  Info
} from 'lucide-react';
import { MATERIALS_DATA } from '../data/materialsData';
import { MACHINES_DATA } from '../data/machinesData';
import { Material, Machine } from '../types';

// Process Decision Matrix Data Model
interface ProcessMatrixItem {
  id: string;
  name: string;
  family: 'Subtractive' | 'Forming' | 'Molding' | 'Additive' | 'Casting' | 'Extrusion';
  materialClass: 'Metals & Plastics' | 'Plastics Only' | 'Sheet Metals' | 'Metals (Al, Zn, Mg)' | 'Al & Alloys' | 'Urethanes & Resins';
  batchMin: number;
  batchMax: number;
  batchLabel: string;
  toolingCost: string;
  toolingCostVal: number; // approximate for sorting
  partCostTier: '$' | '$$' | '$$$' | '$$$$';
  toleranceStd: string;
  surfaceFinishRa: string;
  leadTimeProto: string;
  cycleTimeProd: string;
  strengths: string;
  limitations: string;
}

const PROCESS_DECISION_MATRIX: ProcessMatrixItem[] = [
  {
    id: 'cnc',
    name: 'CNC Milling & Turning',
    family: 'Subtractive',
    materialClass: 'Metals & Plastics',
    batchMin: 1,
    batchMax: 1000,
    batchLabel: '1 - 1,000 units',
    toolingCost: '$0 (Standard soft-jaw setups)',
    toolingCostVal: 0,
    partCostTier: '$$$',
    toleranceStd: '±0.025 to ±0.05 mm (ISO 2768-m)',
    surfaceFinishRa: 'Ra 0.8 - 1.6 μm (down to 0.4 μm)',
    leadTimeProto: '2 - 5 days',
    cycleTimeProd: '10 - 45 min/part',
    strengths: 'No tooling CapEx; isotropic billet strength; tightest dimensional tolerances; wide material catalog.',
    limitations: 'High unit cost for high volumes; internal radii limited by endmill diameter; significant swarf scrap.'
  },
  {
    id: 'injection',
    name: 'Plastic Injection Molding',
    family: 'Molding',
    materialClass: 'Plastics Only',
    batchMin: 2500,
    batchMax: 1000000,
    batchLabel: '2,500 - 1M+ units',
    toolingCost: '$12,000 - $65,000 (P20/H13 Steel Mold)',
    toolingCostVal: 35000,
    partCostTier: '$',
    toleranceStd: '±0.08 to ±0.15 mm (DIN 16742)',
    surfaceFinishRa: 'Ra 0.2 - 0.8 μm (SPI A2/A3 polish)',
    leadTimeProto: '4 - 8 weeks (Tooling build)',
    cycleTimeProd: '15 - 45 seconds/shot',
    strengths: 'Lowest unit cost at scale; excellent repeatable cosmetics; multi-cavity production; zero secondary operations.',
    limitations: 'High initial tooling cost; requires strict uniform wall thickness (1.5-3mm) and 1°-2° draft angles.'
  },
  {
    id: 'sheet_metal',
    name: 'Sheet Metal (Laser & Press Brake)',
    family: 'Forming',
    materialClass: 'Sheet Metals',
    batchMin: 10,
    batchMax: 50000,
    batchLabel: '10 - 50,000 units',
    toolingCost: '$0 - $3,500 (Standard V-dies)',
    toolingCostVal: 1500,
    partCostTier: '$$',
    toleranceStd: '±0.15 to ±0.3 mm (ISO 2768-c)',
    surfaceFinishRa: 'Mill finish / Powder coated',
    leadTimeProto: '3 - 7 days',
    cycleTimeProd: '1 - 5 min/part',
    strengths: 'Lightweight high strength-to-weight enclosures; minimal tooling expense; rapid design iterations.',
    limitations: 'Restricted to uniform plate thickness; minimum bend radius = 1x-2x sheet gauge; bend relief required.'
  },
  {
    id: '3d_printing',
    name: 'Industrial 3D Printing (SLS / DMLS)',
    family: 'Additive',
    materialClass: 'Metals & Plastics',
    batchMin: 1,
    batchMax: 250,
    batchLabel: '1 - 250 units',
    toolingCost: '$0 (Direct digital manufacturing)',
    toolingCostVal: 0,
    partCostTier: '$$$$',
    toleranceStd: '±0.1 to ±0.25 mm (ISO/ASTM 52920)',
    surfaceFinishRa: 'Ra 4.0 - 8.0 μm (Matte/Grainy)',
    leadTimeProto: '1 - 3 days',
    cycleTimeProd: '2 - 12 hours/build',
    strengths: 'Complete organic geometric freedom; internal lattice structures; zero tooling; consolidation of assemblies.',
    limitations: 'Slow build rate; high unit cost; anisotropic z-axis strength; rough as-printed surface finish.'
  },
  {
    id: 'die_casting',
    name: 'High-Pressure Die Casting (HPDC)',
    family: 'Casting',
    materialClass: 'Metals (Al, Zn, Mg)',
    batchMin: 5000,
    batchMax: 500000,
    batchLabel: '5,000 - 500,000+ units',
    toolingCost: '$25,000 - $90,000 (Hardened H13 Dies)',
    toolingCostVal: 50000,
    partCostTier: '$',
    toleranceStd: '±0.1 to ±0.2 mm (NADCA Standards)',
    surfaceFinishRa: 'Ra 1.2 - 2.5 μm',
    leadTimeProto: '6 - 10 weeks (Tooling)',
    cycleTimeProd: '20 - 60 seconds/shot',
    strengths: 'Very rapid metal component production; thin complex metal walls (1.2-2.5mm); high dimensional consistency.',
    limitations: 'Costly tooling; internal porosity risk; restricted to non-ferrous alloys (A380, Zamak 3, AZ91D).'
  },
  {
    id: 'extrusion',
    name: 'Aluminum Profile Extrusion',
    family: 'Extrusion',
    materialClass: 'Al & Alloys',
    batchMin: 500,
    batchMax: 100000,
    batchLabel: '500 - 100,000 kg',
    toolingCost: '$1,500 - $4,500 (Extrusion Die)',
    toolingCostVal: 2500,
    partCostTier: '$',
    toleranceStd: '±0.2 to ±0.4 mm (EN 755-9)',
    surfaceFinishRa: 'Ra 1.6 - 3.2 μm (Anodizable)',
    leadTimeProto: '2 - 4 weeks',
    cycleTimeProd: 'Continuous (m/min)',
    strengths: 'Very low tooling die cost; constant cross-sectional profiles; continuous structural lengths; easy T-slot features.',
    limitations: '2D uniform cross-section only; secondary cutting and CNC hole drilling required for completed assemblies.'
  },
  {
    id: 'investment_casting',
    name: 'Investment (Lost-Wax) Casting',
    family: 'Casting',
    materialClass: 'Metals & Plastics',
    batchMin: 100,
    batchMax: 20000,
    batchLabel: '100 - 20,000 units',
    toolingCost: '$4,000 - $14,000 (Wax Pattern Tooling)',
    toolingCostVal: 8000,
    partCostTier: '$$',
    toleranceStd: '±0.25 to ±0.4 mm (ISO 8062-3 CT6)',
    surfaceFinishRa: 'Ra 1.6 - 3.2 μm',
    leadTimeProto: '4 - 7 weeks',
    cycleTimeProd: 'Multi-stage batching',
    strengths: 'Casts virtually any metal (including titanium & stainless steel); excellent surface finish for cast parts; undercuts.',
    limitations: 'Multi-step labor intensive process; wax tool required; slower production ramp-up.'
  },
  {
    id: 'vacuum_casting',
    name: 'Silicone Vacuum Casting',
    family: 'Molding',
    materialClass: 'Urethanes & Resins',
    batchMin: 10,
    batchMax: 50,
    batchLabel: '10 - 50 units/mold',
    toolingCost: '$800 - $2,500 (Silicone Soft Tool)',
    toolingCostVal: 1500,
    partCostTier: '$$$',
    toleranceStd: '±0.25 mm (per 100mm)',
    surfaceFinishRa: 'Matches master pattern (up to high gloss)',
    leadTimeProto: '7 - 12 days',
    cycleTimeProd: '2 - 4 hours/demold',
    strengths: 'Low-cost bridge tooling for pre-series market validation; mimics production ABS, PP, and rubber overmolds.',
    limitations: 'Silicone mold degrades after 20-30 shots; higher per-part polyurethane resin cost.'
  }
];

// Engineering Materials for Raw Stock Estimator
interface FeedstockMaterial {
  key: string;
  name: string;
  category: 'Aluminum' | 'Steel' | 'Stainless' | 'Copper/Brass' | 'Titanium' | 'Polymer';
  density: number; // g/cm^3
  costPerKg: number; // USD per kg
  scrapReclaimMultiplier: number; // fraction of raw cost recovered for chips
  notes: string;
}

const FEEDSTOCK_MATERIALS: FeedstockMaterial[] = [
  { key: 'al6061', name: 'Aluminum 6061-T6', category: 'Aluminum', density: 2.70, costPerKg: 4.80, scrapReclaimMultiplier: 0.35, notes: 'General structural aerospace & robotics' },
  { key: 'al7075', name: 'Aluminum 7075-T6', category: 'Aluminum', density: 2.81, costPerKg: 10.50, scrapReclaimMultiplier: 0.30, notes: 'High-strength aircraft structural alloy' },
  { key: 'steel1018', name: 'Mild Carbon Steel 1018', category: 'Steel', density: 7.87, costPerKg: 1.75, scrapReclaimMultiplier: 0.20, notes: 'Economical fixtures and welded assemblies' },
  { key: 'steel4140', name: 'Alloy Steel 4140 (Pre-hard)', category: 'Steel', density: 7.85, costPerKg: 3.40, scrapReclaimMultiplier: 0.22, notes: 'Shafts, gears, high-fatigue components' },
  { key: 'ss304', name: 'Stainless Steel 304', category: 'Stainless', density: 8.00, costPerKg: 5.90, scrapReclaimMultiplier: 0.35, notes: 'Food grade, architectural, corrosion resistant' },
  { key: 'ss316l', name: 'Stainless Steel 316L (Marine)', category: 'Stainless', density: 8.00, costPerKg: 8.75, scrapReclaimMultiplier: 0.35, notes: 'Marine hardware, chemical & medical devices' },
  { key: 'brass360', name: 'Brass C360 (Free Machining)', category: 'Copper/Brass', density: 8.50, costPerKg: 9.40, scrapReclaimMultiplier: 0.45, notes: 'Fittings, bushings, electrical contacts' },
  { key: 'copper110', name: 'Pure Copper C110 (ETP)', category: 'Copper/Brass', density: 8.96, costPerKg: 11.80, scrapReclaimMultiplier: 0.50, notes: 'High thermal & electrical conductivity' },
  { key: 'ti_gr5', name: 'Titanium Ti-6Al-4V (Grade 5)', category: 'Titanium', density: 4.43, costPerKg: 48.00, scrapReclaimMultiplier: 0.25, notes: 'High strength-to-weight, biocompatible' },
  { key: 'delrin', name: 'Acetal / POM (Delrin)', category: 'Polymer', density: 1.41, costPerKg: 7.20, scrapReclaimMultiplier: 0.10, notes: 'Low friction gears, precision sliding bearings' },
  { key: 'peek', name: 'PEEK (Polyether ether ketone)', category: 'Polymer', density: 1.32, costPerKg: 115.00, scrapReclaimMultiplier: 0.05, notes: 'Ultra-high temp & chemical resistance' },
  { key: 'abs', name: 'ABS Engineering Resin', category: 'Polymer', density: 1.05, costPerKg: 3.20, scrapReclaimMultiplier: 0.10, notes: 'Housings, automotive consumer prototypes' },
  { key: 'pc', name: 'Polycarbonate (Lexan)', category: 'Polymer', density: 1.20, costPerKg: 4.90, scrapReclaimMultiplier: 0.10, notes: 'Impact resistant, optical transparency' },
  { key: 'nylon66', name: 'Nylon PA66 (Extruded)', category: 'Polymer', density: 1.14, costPerKg: 5.80, scrapReclaimMultiplier: 0.10, notes: 'Wear resistance, structural plastic rollers' }
];

export const MaterialMachinePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'machines' | 'matrix' | 'feedstock'>('materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Comparison State
  const [compareMaterials, setCompareMaterials] = useState<Material[]>([]);
  const [compareMachines, setCompareMachines] = useState<Machine[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Process Decision Matrix State
  const [matrixFamilyFilter, setMatrixFamilyFilter] = useState<string>('all');
  const [expandedProcessId, setExpandedProcessId] = useState<string | null>(null);

  // Stock Weight & Feedstock Cost Estimator State
  const [stockShape, setStockShape] = useState<'rectangular' | 'round' | 'tube' | 'sheet'>('rectangular');
  const [selectedMaterialKey, setSelectedMaterialKey] = useState<string>('al6061');
  const [lengthMm, setLengthMm] = useState<number>(150);
  const [widthMm, setWidthMm] = useState<number>(80);
  const [heightMm, setHeightMm] = useState<number>(40);
  const [diameterMm, setDiameterMm] = useState<number>(60);
  const [wallThicknessMm, setWallThicknessMm] = useState<number>(5);
  const [sheetThicknessMm, setSheetThicknessMm] = useState<number>(3);
  const [finishedPartWeightKg, setFinishedPartWeightKg] = useState<number>(0.45);
  const [batchQuantity, setBatchQuantity] = useState<number>(100);

  // Filter Materials
  const materialCategories = [
    'all',
    'Metals & Alloys',
    'Polymers & Plastics',
    'Composites',
    'Bio-materials & Sustainable'
  ];

  const filteredMaterials = MATERIALS_DATA.filter(mat => {
    const matchesCat =
      selectedCategory === 'all' || mat.category === selectedCategory;
    const matchesQuery =
      mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.applications.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mat.suitableProcesses.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  // Filter Machines
  const machineCategories = [
    'all',
    'Subtractive & CNC',
    'Additive & 3D',
    'Forming & Sheet Metal',
    'Moulding & Casting',
    'Automation & Joining',
    'Metrology & QA'
  ];

  const filteredMachines = MACHINES_DATA.filter(mach => {
    const matchesCat =
      selectedCategory === 'all' || mach.category === selectedCategory;
    const matchesQuery =
      mach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mach.compatibleMaterials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleToggleMaterialCompare = (mat: Material) => {
    if (compareMaterials.some(m => m.id === mat.id)) {
      setCompareMaterials(compareMaterials.filter(m => m.id !== mat.id));
    } else {
      if (compareMaterials.length >= 3) {
        alert('You can compare up to 3 materials at once.');
        return;
      }
      setCompareMaterials([...compareMaterials, mat]);
    }
  };

  const handleToggleMachineCompare = (mach: Machine) => {
    if (compareMachines.some(m => m.id === mach.id)) {
      setCompareMachines(compareMachines.filter(m => m.id !== mach.id));
    } else {
      if (compareMachines.length >= 3) {
        alert('You can compare up to 3 machines at once.');
        return;
      }
      setCompareMachines([...compareMachines, mach]);
    }
  };

  // Stock Volume Calculation (in cm^3)
  const currentMaterial = FEEDSTOCK_MATERIALS.find(m => m.key === selectedMaterialKey) || FEEDSTOCK_MATERIALS[0];

  let rawVolumeCm3 = 0;
  if (stockShape === 'rectangular') {
    rawVolumeCm3 = (lengthMm * widthMm * heightMm) / 1000;
  } else if (stockShape === 'round') {
    const radiusCm = (diameterMm / 2) / 10;
    const lengthCm = lengthMm / 10;
    rawVolumeCm3 = Math.PI * radiusCm * radiusCm * lengthCm;
  } else if (stockShape === 'tube') {
    const outerRadiusCm = (diameterMm / 2) / 10;
    const innerRadiusCm = Math.max(0, (diameterMm / 2 - wallThicknessMm) / 10);
    const lengthCm = lengthMm / 10;
    rawVolumeCm3 = Math.PI * (outerRadiusCm * outerRadiusCm - innerRadiusCm * innerRadiusCm) * lengthCm;
  } else if (stockShape === 'sheet') {
    rawVolumeCm3 = (lengthMm * widthMm * sheetThicknessMm) / 1000;
  }

  // Stock Weight (kg) = Volume(cm^3) * Density(g/cm^3) / 1000
  const rawStockWeightKg = (rawVolumeCm3 * currentMaterial.density) / 1000;
  const safeFinishedWeightKg = Math.min(finishedPartWeightKg, rawStockWeightKg);
  const swarfWeightKg = Math.max(0, rawStockWeightKg - safeFinishedWeightKg);
  const swarfRatioPercent = rawStockWeightKg > 0 ? (swarfWeightKg / rawStockWeightKg) * 100 : 0;

  // Costs
  const grossBilletCost = rawStockWeightKg * currentMaterial.costPerKg;
  const scrapCreditPerPart = swarfWeightKg * (currentMaterial.costPerKg * currentMaterial.scrapReclaimMultiplier);
  const netFeedstockCostPerPart = Math.max(0, grossBilletCost - scrapCreditPerPart);

  const totalBatchGrossCost = grossBilletCost * batchQuantity;
  const totalBatchScrapCredit = scrapCreditPerPart * batchQuantity;
  const totalBatchNetCost = netFeedstockCostPerPart * batchQuantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Industrial Specifications & Standards</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Materials, Machines & Process Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Examine engineering alloys, equipment specifications, process decision trade-offs, and stock billet weight calculations for real production lines.
          </p>
        </div>

        {/* Compare Trigger Button */}
        {((activeTab === 'materials' && compareMaterials.length > 0) ||
          (activeTab === 'machines' && compareMachines.length > 0)) && (
          <button
            onClick={() => setShowCompareModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Scale className="w-4 h-4" />
            <span>
              Compare Selected (
              {activeTab === 'materials'
                ? compareMaterials.length
                : compareMachines.length}
              )
            </span>
          </button>
        )}
      </div>

      {/* 4 Main Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-0.5">
        <button
          onClick={() => {
            setActiveTab('materials');
            setSelectedCategory('all');
          }}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'materials'
              ? 'text-cyan-400 border-cyan-500 bg-slate-900/60 rounded-t-xl'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Materials Catalog ({MATERIALS_DATA.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('machines');
            setSelectedCategory('all');
          }}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'machines'
              ? 'text-amber-400 border-amber-500 bg-slate-900/60 rounded-t-xl'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Machines & Equipment ({MACHINES_DATA.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('matrix');
          }}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'text-emerald-400 border-emerald-500 bg-slate-900/60 rounded-t-xl'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Process Decision Matrix (8 Methods)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('feedstock');
          }}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'feedstock'
              ? 'text-blue-400 border-blue-500 bg-slate-900/60 rounded-t-xl'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Raw Stock & Swarf Estimator</span>
        </button>
      </div>

      {/* TAB 1 & 2: Search & Filter Pills */}
      {(activeTab === 'materials' || activeTab === 'machines') && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl">
            {(activeTab === 'materials' ? materialCategories : machineCategories).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? activeTab === 'materials'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-64 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}

      {/* Materials Cards Grid */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(mat => {
            const isComparing = compareMaterials.some(m => m.id === mat.id);
            return (
              <div
                key={mat.id}
                className={`glass-panel rounded-2xl border p-5 space-y-4 transition-all ${
                  isComparing
                    ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {mat.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {mat.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleToggleMaterialCompare(mat)}
                    className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-colors ${
                      isComparing
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isComparing}
                      onChange={() => {}}
                      className="rounded border-slate-700 text-cyan-500 pointer-events-none"
                    />
                    <span>Compare</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Density:</span>
                    <span className="font-mono text-slate-200">{mat.density}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Tensile Strength:</span>
                    <span className="font-mono text-slate-200">{mat.tensileStrength}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Machinability:</span>
                    <span className="font-mono text-slate-200">{mat.machinability}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Relative Cost:</span>
                    <span className="font-mono font-bold text-cyan-400">{mat.costTier}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Suitable Processes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mat.suitableProcesses.map((proc, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
                      >
                        {proc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-850">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Pros:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {mat.pros.slice(0, 2).map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Machines Cards Grid */}
      {activeTab === 'machines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map(mach => {
            const isComparing = compareMachines.some(m => m.id === mach.id);
            return (
              <div
                key={mach.id}
                className={`glass-panel rounded-2xl border p-5 space-y-4 transition-all ${
                  isComparing
                    ? 'border-amber-500 ring-2 ring-amber-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {mach.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {mach.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleToggleMachineCompare(mach)}
                    className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-colors ${
                      isComparing
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isComparing}
                      onChange={() => {}}
                      className="rounded border-slate-700 text-amber-500 pointer-events-none"
                    />
                    <span>Compare</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Tolerance/Accuracy:</span>
                    <span className="font-mono text-slate-200">{mach.accuracy}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Power Consumption:</span>
                    <span className="font-mono text-slate-200">{mach.powerConsumption}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Speed/Throughput:</span>
                    <span className="font-mono text-slate-200">{mach.speed}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Setup Complexity:</span>
                    <span className="font-mono text-slate-200">{mach.setupComplexity}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Compatible Materials:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mach.compatibleMaterials.map((mat, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[11px]">Investment Tier:</span>
                    <span className="font-mono font-bold text-amber-400">{mach.costTier}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Power: {mach.powerConsumption}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: PROCESS DECISION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-emerald-400" />
                <span>Manufacturing Process Selection Guide</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Compare primary manufacturing methods by break-even volume, tooling NRE, achievable tolerance, and cycle times to make rapid capital allocation choices.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'Subtractive', 'Molding', 'Forming', 'Additive', 'Casting', 'Extrusion'].map(fam => (
                <button
                  key={fam}
                  onClick={() => setMatrixFamilyFilter(fam)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    matrixFamilyFilter === fam
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {fam === 'all' ? 'All Processes' : fam}
                </button>
              ))}
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-300 uppercase tracking-wider font-bold text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Process Name & Family</th>
                    <th className="py-3.5 px-4">Economic Batch Range</th>
                    <th className="py-3.5 px-4">Tooling NRE (CapEx)</th>
                    <th className="py-3.5 px-4">Unit Part Cost</th>
                    <th className="py-3.5 px-4">Linear Tolerance</th>
                    <th className="py-3.5 px-4">Surface Finish (Ra)</th>
                    <th className="py-3.5 px-4">Proto Lead Time</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {PROCESS_DECISION_MATRIX.filter(p => matrixFamilyFilter === 'all' || p.family === matrixFamilyFilter).map((proc) => {
                    const isExpanded = expandedProcessId === proc.id;
                    return (
                      <React.Fragment key={proc.id}>
                        <tr className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">{proc.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {proc.family}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {proc.materialClass}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-emerald-300 font-mono">
                              {proc.batchLabel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {proc.toolingCost}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`font-mono font-extrabold ${
                              proc.partCostTier === '$' ? 'text-emerald-400' :
                              proc.partCostTier === '$$' ? 'text-cyan-400' :
                              proc.partCostTier === '$$$' ? 'text-amber-400' : 'text-rose-400'
                            }`}>
                              {proc.partCostTier}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-200">
                            {proc.toleranceStd}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {proc.surfaceFinishRa}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-mono">
                            {proc.leadTimeProto}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => setExpandedProcessId(isExpanded ? null : proc.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                                isExpanded
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                              }`}
                            >
                              {isExpanded ? 'Hide' : 'Details'}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-slate-900/80 border-b border-emerald-500/30">
                            <td colSpan={8} className="p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                  <span className="text-emerald-400 font-bold block mb-1">Key Strengths & Ideal Geometry:</span>
                                  <p className="text-slate-300 leading-relaxed">{proc.strengths}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                  <span className="text-amber-400 font-bold block mb-1">Critical Design Limitations:</span>
                                  <p className="text-slate-300 leading-relaxed">{proc.limitations}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                                <span>Typical Production Cycle Time: <strong className="text-white font-mono">{proc.cycleTimeProd}</strong></span>
                                <span>Material Family: <strong className="text-cyan-300">{proc.materialClass}</strong></span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RAW STOCK WEIGHT & FEEDSTOCK ESTIMATOR */}
      {activeTab === 'feedstock' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-blue-950/20 via-slate-900/40 to-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span>Raw Stock Billet & Swarf Loss Estimator</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Calculate starting stock billet weight, swarf chip scrap loss percentage, raw material spend, and scrap credit reclaim based on real material physical densities.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono">
              Density: {currentMaterial.density} g/cm³ • ${currentMaterial.costPerKg.toFixed(2)}/kg
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form Inputs */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              {/* Shape Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Select Stock Billet Geometry
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'rectangular', label: 'Rectangular Billet' },
                    { id: 'round', label: 'Solid Round Bar' },
                    { id: 'tube', label: 'Hollow Tube / Pipe' },
                    { id: 'sheet', label: 'Sheet / Plate' }
                  ].map(shape => (
                    <button
                      key={shape.id}
                      onClick={() => setStockShape(shape.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        stockShape === shape.id
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 ring-2 ring-blue-500/20'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Engineering Material & Grade
                </label>
                <select
                  value={selectedMaterialKey}
                  onChange={e => setSelectedMaterialKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-750 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  {FEEDSTOCK_MATERIALS.map(m => (
                    <option key={m.key} value={m.key}>
                      {m.name} ({m.category}) — {m.density} g/cm³ — ${m.costPerKg.toFixed(2)}/kg
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  {currentMaterial.notes}. Est. scrap chip reclaim factor: {(currentMaterial.scrapReclaimMultiplier * 100)}% of virgin metal value.
                </p>
              </div>

              {/* Dimensions Inputs */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Starting Stock Dimensions (mm)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Length (mm)</label>
                    <input
                      type="number"
                      value={lengthMm}
                      onChange={e => setLengthMm(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-900 border border-slate-750 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {(stockShape === 'rectangular' || stockShape === 'sheet') && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Width (mm)</label>
                      <input
                        type="number"
                        value={widthMm}
                        onChange={e => setWidthMm(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-900 border border-slate-750 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  {stockShape === 'rectangular' && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Height / Depth (mm)</label>
                      <input
                        type="number"
                        value={heightMm}
                        onChange={e => setHeightMm(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-900 border border-slate-750 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  {(stockShape === 'round' || stockShape === 'tube') && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Outer Diameter (OD mm)</label>
                      <input
                        type="number"
                        value={diameterMm}
                        onChange={e => setDiameterMm(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-900 border border-slate-750 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  {stockShape === 'tube' && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Wall Thickness (mm)</label>
                      <input
                        type="number"
                        value={wallThicknessMm}
                        onChange={e => setWallThicknessMm(Math.max(0.5, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-900 border border-slate-750 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  {stockShape === 'sheet' && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Sheet Thickness (mm)</label>
                      <input
                        type="number"
                        value={sheetThicknessMm}
                        onChange={e => setSheetThicknessMm(Math.max(0.2, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-900 border border-slate-750 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Finished Part Target & Batch Size */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Finished Part Solid Weight (kg)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">Net solid part weight from your CAD model.</p>
                  <input
                    type="number"
                    step="0.01"
                    value={finishedPartWeightKg}
                    onChange={e => setFinishedPartWeightKg(Math.max(0.01, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-900 border border-slate-750 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Production Batch Quantity
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">Total finished units in this production run.</p>
                  <input
                    type="number"
                    value={batchQuantity}
                    onChange={e => setBatchQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-900 border border-slate-750 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Cost & Swarf Loss Summary Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Box className="w-4 h-4 text-blue-400" />
                  <span>Feedstock & Swarf Summary</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Raw Billet Volume:</span>
                    <span className="font-mono font-bold text-white">{rawVolumeCm3.toFixed(1)} cm³</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Raw Stock Weight (Gross):</span>
                    <span className="font-mono font-bold text-cyan-300">{rawStockWeightKg.toFixed(3)} kg</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Finished Part Weight (Net):</span>
                    <span className="font-mono font-bold text-emerald-300">{safeFinishedWeightKg.toFixed(3)} kg</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Swarf / Chip Removal:</span>
                    <span className="font-mono font-bold text-amber-400">{swarfWeightKg.toFixed(3)} kg ({swarfRatioPercent.toFixed(1)}%)</span>
                  </div>
                </div>

                {/* Visual Ratio Bar */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex justify-between text-[11px] mb-1.5 font-semibold">
                    <span className="text-emerald-400">Finished Solid ({(100 - swarfRatioPercent).toFixed(1)}%)</span>
                    <span className="text-amber-400">Machined Chips ({swarfRatioPercent.toFixed(1)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${Math.max(5, 100 - swarfRatioPercent)}%` }}
                      className="bg-emerald-500 h-full transition-all"
                    />
                    <div
                      style={{ width: `${Math.min(95, swarfRatioPercent)}%` }}
                      className="bg-amber-500 h-full transition-all"
                    />
                  </div>
                </div>

                {/* Per Part Financials */}
                <div className="mt-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Billet Cost:</span>
                    <span className="font-mono text-white">${grossBilletCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Scrap Reclaim Credit:</span>
                    <span className="font-mono text-emerald-400">-${scrapCreditPerPart.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-850">
                    <span>Net Feedstock / Part:</span>
                    <span className="font-mono text-cyan-300 text-sm">${netFeedstockCostPerPart.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Total Batch Totals */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
                  Batch Total ({batchQuantity} units)
                </span>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">Net Feedstock Spend:</span>
                  <span className="text-lg font-black font-mono text-white">
                    ${totalBatchNetCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Gross Stock: ${(totalBatchGrossCost).toFixed(2)}</span>
                  <span>Scrap Credit: -${(totalBatchScrapCredit).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal (Materials or Machines) */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                <span>
                  Head-to-Head {activeTab === 'materials' ? 'Materials' : 'Machines'} Comparison
                </span>
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTab === 'materials' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {compareMaterials.map(mat => (
                  <div key={mat.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <h4 className="font-bold text-sm text-white">{mat.name}</h4>
                    <div className="space-y-1 text-slate-300">
                      <div><strong className="text-slate-400">Category:</strong> {mat.category}</div>
                      <div><strong className="text-slate-400">Density:</strong> {mat.density}</div>
                      <div><strong className="text-slate-400">Tensile:</strong> {mat.tensileStrength}</div>
                      <div><strong className="text-slate-400">Machinability:</strong> {mat.machinability}</div>
                      <div><strong className="text-slate-400">Cost:</strong> {mat.costTier}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-850">
                      <span className="text-[10px] text-emerald-400 font-bold block mb-1">Key Pros:</span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {mat.pros.slice(0, 2).map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'machines' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {compareMachines.map(mach => (
                  <div key={mach.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <h4 className="font-bold text-sm text-white">{mach.name}</h4>
                    <div className="space-y-1 text-slate-300">
                      <div><strong className="text-slate-400">Category:</strong> {mach.category}</div>
                      <div><strong className="text-slate-400">Accuracy:</strong> {mach.accuracy}</div>
                      <div><strong className="text-slate-400">Speed:</strong> {mach.speed}</div>
                      <div><strong className="text-slate-400">Complexity:</strong> {mach.setupComplexity}</div>
                      <div><strong className="text-slate-400">Cost Tier:</strong> {mach.costTier}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-850">
                      <span className="text-[10px] text-amber-400 font-bold block mb-1">Key Advantages:</span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {mach.advantages.slice(0, 2).map((a, i) => (
                          <li key={i}>• {a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
