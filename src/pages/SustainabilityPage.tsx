import React, { useState } from 'react';
import {
  Leaf,
  Calculator,
  RefreshCw,
  TrendingDown,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

export const SustainabilityPage: React.FC = () => {
  // Calculator inputs
  const [blankWeight, setBlankWeight] = useState<number>(4.2); // kg per part
  const [partWeight, setPartWeight] = useState<number>(1.8); // kg per part
  const [batchQty, setBatchQty] = useState<number>(1000); // units
  const [costPerKg, setCostPerKg] = useState<number>(5.5); // $/kg

  // Calculations
  const scrapPerPart = Math.max(0, blankWeight - partWeight);
  const scrapPercentage = blankWeight > 0 ? (scrapPerPart / blankWeight) * 100 : 0;
  const totalScrapKg = scrapPerPart * batchQty;
  const scrapLossCost = totalScrapKg * costPerKg;
  const potentialSavings = scrapLossCost * 0.35; // 35% average savings from near-net shape/nesting

  const circularBlueprints = [
    {
      title: 'In-House Thermoplastic Regrind Closed Loop',
      domain: 'Injection Moulding',
      description: 'Collect sprues, runners, and cold-slugs directly from the press, feed into an on-machine slow-speed granulator, and blend at 15-20% ratio with virgin resin.',
      impact: 'Eliminates 100% of mold startup scrap with 0% reduction in tensile performance.',
      payback: '3 to 6 Months'
    },
    {
      title: 'Metal Swarf Briquetting & Coolant Reclamation',
      domain: 'CNC Machining',
      description: 'Compact loose aluminum and steel chips under 300-bar hydraulic pressure into dense metal pucks (briquettes). Centrifuges squeeze out 98% of trapped cutting oil for reuse.',
      impact: 'Increases scrap smelter buyback value by 30% and reclaims thousands of liters of soluble oil.',
      payback: '8 to 12 Months'
    },
    {
      title: 'Agricultural Crop Residue Bio-Composites',
      domain: 'Forming & Moulded Pulp',
      description: 'Blend post-harvest rice husk and sugarcane bagasse fibers with starch binders into thermoformed protective packaging, replacing petroleum EPS styrofoam.',
      impact: '100% home compostable in 60-90 days, turning crop burning pollution into circular revenue.',
      payback: 'Immediate'
    },
    {
      title: 'Zero Liquid Discharge (ZLD) Rinse Water Recycling',
      domain: 'Electroplating & Surface Treatment',
      description: 'Counter-current cascade rinse tanks coupled with atmospheric vacuum evaporators and reverse osmosis to recycle 95% of process wash water.',
      impact: 'Slashes fresh municipal water draw by 90% and eliminates toxic chemical runoff.',
      payback: '14 Months'
    }
  ];

  const greenSubstitutions = [
    {
      conventional: 'Virgin Petroleum ABS',
      alternative: 'Post-Consumer Recycled (PCR) rABS or rPET',
      co2Cut: '72% Lower CO2e',
      tradeoff: 'Slightly tighter melt flow index monitoring needed; minor color tint requiring darker pigments.',
      idealFor: 'Enclosures, brackets, display bezels'
    },
    {
      conventional: 'Expanded Polystyrene (EPS Foam)',
      alternative: 'Mycelium / Agro-Husk Grown Bio-Cushion',
      co2Cut: '88% Lower CO2e',
      tradeoff: 'Thicker wall section required for equivalent drop shock absorption.',
      idealFor: 'Electronics protective corner packaging'
    },
    {
      conventional: 'Primary Smelted Virgin Aluminum',
      alternative: 'Secondary Recycled Hydro-Powered Green Aluminum',
      co2Cut: '95% Lower Energy & CO2',
      tradeoff: 'Identical mechanical properties (ASTM B221); verify alloy purity with mill test report.',
      idealFor: 'Structural frames, heat sinks, aerospace parts'
    },
    {
      conventional: 'Solvent-Based Wet Spray Paint',
      alternative: 'Electrostatic Powder Coating (Zero VOCs)',
      co2Cut: 'Zero VOC Emissions',
      tradeoff: 'Requires oven curing at 180°C; over-sprayed powder is 98% reclaimed and resprayed.',
      idealFor: 'Sheet metal server racks, steel machinery chassis'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Leaf className="w-3.5 h-3.5" />
          <span>Circular Economy & Clean Tech Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sustainability & Waste Reduction
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Quantify manufacturing scrap loss, improve material yield with near-net shape methods, and implement circular closed loops to reduce environmental footprints and unit costs.
        </p>
      </div>

      {/* Material Yield & Scrap Calculator */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Raw Material Yield & Scrap Loss Calculator
            </h2>
            <p className="text-xs text-slate-400">
              Calculate scrap percentage, monetary waste, and projected savings from nesting or additive manufacturing.
            </p>
          </div>
        </div>

        {/* Input sliders and fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Raw Blank Weight (kg / part)
            </label>
            <input
              type="number"
              step="0.1"
              value={blankWeight}
              onChange={e => setBlankWeight(Number(e.target.value) || 0)}
              className="w-full text-base font-bold font-mono text-white bg-slate-900 border border-slate-750 px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500">Initial billet or sheet area</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Finished Part Weight (kg / part)
            </label>
            <input
              type="number"
              step="0.1"
              value={partWeight}
              onChange={e => setPartWeight(Number(e.target.value) || 0)}
              className="w-full text-base font-bold font-mono text-white bg-slate-900 border border-slate-750 px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500">Net final component mass</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Batch Production Volume (units)
            </label>
            <input
              type="number"
              value={batchQty}
              onChange={e => setBatchQty(Number(e.target.value) || 0)}
              className="w-full text-base font-bold font-mono text-white bg-slate-900 border border-slate-750 px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500">Total run quantity</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Material Cost ($ / kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={costPerKg}
              onChange={e => setCostPerKg(Number(e.target.value) || 0)}
              className="w-full text-base font-bold font-mono text-emerald-400 bg-slate-900 border border-slate-750 px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500">Stock purchase price</span>
          </div>
        </div>

        {/* Calculated Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Scrap Ratio
            </span>
            <div className="text-2xl font-black text-rose-400 font-mono">
              {scrapPercentage.toFixed(1)}%
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {(100 - scrapPercentage).toFixed(1)}% Net Material Yield
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Total Scrap Produced
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {totalScrapKg.toLocaleString()} kg
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {(totalScrapKg / 1000).toFixed(2)} metric tonnes of swarf/flash
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Scrap Cost Loss
            </span>
            <div className="text-2xl font-black text-rose-400 font-mono">
              ${scrapLossCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Purchased raw material discarded
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
            <span className="text-[11px] font-bold text-emerald-300 block mb-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              Potential Savings (DFM)
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ${potentialSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Via sheet nesting & near-net shape
            </span>
          </div>
        </div>
      </div>

      {/* Circular Economy Blueprints */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">
            Circular Economy Factory Blueprints
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {circularBlueprints.map((bp, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {bp.domain}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Payback: <strong className="text-white">{bp.payback}</strong>
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{bp.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{bp.description}</p>
              <div className="pt-2 border-t border-slate-850 text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{bp.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Green Material Substitution Matrix */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-teal-400" />
          <h2 className="text-xl font-bold text-white">
            Green Material Substitution Advisor
          </h2>
        </div>

        <div className="overflow-x-auto bg-slate-900/90 rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-300 font-semibold border-b border-slate-750">
              <tr>
                <th className="p-3.5">Conventional Material</th>
                <th className="p-3.5">Eco-Friendly Alternative</th>
                <th className="p-3.5">Embodied Carbon Cut</th>
                <th className="p-3.5">Engineering Tradeoff & Notes</th>
                <th className="p-3.5">Ideal Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {greenSubstitutions.map((sub, i) => (
                <tr key={i} className="hover:bg-slate-850/50">
                  <td className="p-3.5 font-semibold text-rose-400">{sub.conventional}</td>
                  <td className="p-3.5 font-semibold text-emerald-300">{sub.alternative}</td>
                  <td className="p-3.5 font-mono text-teal-300 font-bold">{sub.co2Cut}</td>
                  <td className="p-3.5 text-slate-400 text-[11px] leading-relaxed max-w-xs">{sub.tradeoff}</td>
                  <td className="p-3.5 text-slate-300">{sub.idealFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
