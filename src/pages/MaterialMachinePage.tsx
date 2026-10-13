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
  Leaf
} from 'lucide-react';
import { MATERIALS_DATA } from '../data/materialsData';
import { MACHINES_DATA } from '../data/machinesData';
import { Material, Machine } from '../types';

export const MaterialMachinePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'machines'>('materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Comparison State
  const [compareMaterials, setCompareMaterials] = useState<Material[]>([]);
  const [compareMachines, setCompareMachines] = useState<Machine[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

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
            Material and Machine Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Examine engineering alloys, polymers, bio-composites, and industrial machinery. Compare tolerances, machinability, cost tiers, and process compatibility.
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

      {/* Main Tab Selector (Materials vs Machines) */}
      <div className="flex items-center space-x-2 border-b border-slate-800">
        <button
          onClick={() => {
            setActiveTab('materials');
            setSelectedCategory('all');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
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
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'machines'
              ? 'text-amber-400 border-amber-500 bg-slate-900/60 rounded-t-xl'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Machines & Equipment ({MACHINES_DATA.length})</span>
        </button>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
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

        {/* Search */}
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
                      readOnly
                      className="w-3 h-3 accent-cyan-500 pointer-events-none"
                    />
                    <span>Compare</span>
                  </button>
                </div>

                {/* Technical Specs Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Density</span>
                    <span className="font-mono text-white font-semibold">{mat.density}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Tensile Strength</span>
                    <span className="font-mono text-cyan-300 font-semibold">{mat.tensileStrength}</span>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850 text-xs">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Machinability / Formability:
                  </span>
                  <p className="text-slate-300 text-[11px]">{mat.machinability}</p>
                </div>

                {/* Suitable Processes */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Best Manufacturing Processes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mat.suitableProcesses.map((p, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-850 text-slate-300 border border-slate-800"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cost Tier & Sustainability */}
                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[11px]">Cost Tier:</span>
                    <span className="font-mono font-bold text-emerald-400">{mat.costTier}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[180px] italic">
                    {mat.sustainabilityNotes}
                  </span>
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
                      readOnly
                      className="w-3 h-3 accent-amber-500 pointer-events-none"
                    />
                    <span>Compare</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Precision Accuracy</span>
                    <span className="font-mono text-white font-semibold">{mach.accuracy}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Setup Complexity</span>
                    <span className="font-mono text-amber-300 font-semibold">{mach.setupComplexity}</span>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850 text-xs">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Speed & Power:
                  </span>
                  <p className="text-slate-300 text-[11px]">{mach.speed}</p>
                </div>

                {/* Compatible Materials */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Compatible Workpiece Materials:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mach.compatibleMaterials.map((m, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-850 text-slate-300 border border-slate-800"
                      >
                        {m}
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
