import React, { useState } from 'react';
import { X, Calculator, ArrowRightLeft, Cpu, RotateCcw } from 'lucide-react';

interface EngineeringCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EngineeringCalculatorModal: React.FC<EngineeringCalculatorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'speeds-feeds' | 'unit-converter' | 'cycle-time'>('speeds-feeds');

  // Speeds & Feeds State
  const [cuttingSpeed, setCuttingSpeed] = useState<number>(180); // Vc in m/min (e.g. 180 for aluminum)
  const [toolDiameter, setToolDiameter] = useState<number>(10); // D in mm
  const [numFlutes, setNumFlutes] = useState<number>(3); // z
  const [feedPerTooth, setFeedPerTooth] = useState<number>(0.05); // fz in mm/tooth

  // Speeds & Feeds Calculations
  // RPM = (Vc * 1000) / (pi * D)
  const rpm = toolDiameter > 0 ? Math.round((cuttingSpeed * 1000) / (Math.PI * toolDiameter)) : 0;
  // Feed Rate Vf = RPM * z * fz (mm/min)
  const feedRate = Math.round(rpm * numFlutes * feedPerTooth);

  // Unit Converter State
  const [unitType, setUnitType] = useState<'length' | 'pressure' | 'temp' | 'weight'>('length');
  const [inputValue, setInputValue] = useState<number>(25.4);

  // Calculations for Unit Converter
  const getConvertedUnits = () => {
    switch (unitType) {
      case 'length':
        return [
          { label: 'Millimeters (mm)', val: `${inputValue} mm` },
          { label: 'Inches (in)', val: `${(inputValue / 25.4).toFixed(4)} in` },
          { label: 'Centimeters (cm)', val: `${(inputValue / 10).toFixed(3)} cm` },
          { label: 'Microns (µm)', val: `${(inputValue * 1000).toFixed(0)} µm` }
        ];
      case 'pressure':
        return [
          { label: 'Megapascals (MPa)', val: `${inputValue} MPa` },
          { label: 'Pounds/Sq Inch (PSI)', val: `${(inputValue * 145.038).toFixed(1)} PSI` },
          { label: 'Bar', val: `${(inputValue * 10).toFixed(2)} bar` },
          { label: 'Gigapascals (GPa)', val: `${(inputValue / 1000).toFixed(4)} GPa` }
        ];
      case 'temp':
        return [
          { label: 'Celsius (°C)', val: `${inputValue} °C` },
          { label: 'Fahrenheit (°F)', val: `${((inputValue * 9) / 5 + 32).toFixed(1)} °F` },
          { label: 'Kelvin (K)', val: `${(inputValue + 273.15).toFixed(1)} K` }
        ];
      case 'weight':
        return [
          { label: 'Kilograms (kg)', val: `${inputValue} kg` },
          { label: 'Pounds (lbs)', val: `${(inputValue * 2.20462).toFixed(3)} lbs` },
          { label: 'Grams (g)', val: `${(inputValue * 1000).toFixed(1)} g` },
          { label: 'Ounces (oz)', val: `${(inputValue * 35.274).toFixed(2)} oz` }
        ];
    }
  };

  // Cycle Time Estimator State
  const [cutDistance, setCutDistance] = useState<number>(850); // mm
  const [rapidDistance, setRapidDistance] = useState<number>(300); // mm
  const [rapidRate, setRapidRate] = useState<number>(15000); // mm/min
  const [toolChanges, setToolChanges] = useState<number>(2); // count
  const [toolChangeSec, setToolChangeSec] = useState<number>(8); // sec/change

  const cutTimeMin = feedRate > 0 ? cutDistance / feedRate : 0;
  const rapidTimeMin = rapidRate > 0 ? rapidDistance / rapidRate : 0;
  const toolChangeMin = (toolChanges * toolChangeSec) / 60;
  const totalCycleMin = cutTimeMin + rapidTimeMin + toolChangeMin;
  const totalCycleSec = Math.round(totalCycleMin * 60);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Engineering Tools & Machining Calculators
              </h3>
              <p className="text-xs text-slate-400">
                Instant calculations for speeds, feeds, unit conversions & cycle times
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 px-6 pt-3 border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => setActiveTab('speeds-feeds')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'speeds-feeds'
                ? 'text-teal-400 border-teal-500 bg-slate-850 rounded-t-xl'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>CNC Speeds & Feeds</span>
          </button>

          <button
            onClick={() => setActiveTab('unit-converter')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'unit-converter'
                ? 'text-emerald-400 border-emerald-500 bg-slate-850 rounded-t-xl'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Unit Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('cycle-time')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'cycle-time'
                ? 'text-cyan-400 border-cyan-500 bg-slate-850 rounded-t-xl'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Cycle Time Estimator</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Tab 1: Speeds & Feeds */}
          {activeTab === 'speeds-feeds' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">
                    Surface Cutting Speed (Vc in m/min)
                  </label>
                  <input
                    type="number"
                    value={cuttingSpeed}
                    onChange={e => setCuttingSpeed(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-750 px-3 py-1.5 rounded-lg font-mono font-bold text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>Steel: ~90</span>
                    <span>Alu: ~200-350</span>
                    <span>Titanium: ~50</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">
                    End Mill / Tool Diameter (mm)
                  </label>
                  <input
                    type="number"
                    value={toolDiameter}
                    onChange={e => setToolDiameter(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-750 px-3 py-1.5 rounded-lg font-mono font-bold text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                  <span className="text-[10px] text-slate-500">e.g. 6mm, 10mm, 12mm cutter</span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">
                    Number of Flutes (z)
                  </label>
                  <input
                    type="number"
                    value={numFlutes}
                    onChange={e => setNumFlutes(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-750 px-3 py-1.5 rounded-lg font-mono font-bold text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                  <span className="text-[10px] text-slate-500">Typically 2 or 3 flutes for Alu; 4 for Steel</span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">
                    Feed per Tooth (fz in mm/tooth)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={feedPerTooth}
                    onChange={e => setFeedPerTooth(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-750 px-3 py-1.5 rounded-lg font-mono font-bold text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                  <span className="text-[10px] text-slate-500">Chip load (typically 0.03 - 0.08 mm)</span>
                </div>
              </div>

              {/* Live Output KPI Cards */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/40">
                  <span className="text-[11px] font-bold text-teal-300 uppercase block mb-1">
                    Spindle Speed (RPM)
                  </span>
                  <div className="text-2xl font-black text-teal-400 font-mono">
                    {rpm.toLocaleString()} RPM
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    n = (Vc × 1000) / (π × D)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase block mb-1">
                    Feed Rate (Vf)
                  </span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {feedRate.toLocaleString()} mm/min
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Vf = RPM × z × fz
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Unit Converter */}
          {activeTab === 'unit-converter' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
                {[
                  { id: 'length', label: 'Length & Dimensions' },
                  { id: 'pressure', label: 'Pressure & Tensile (MPa/PSI)' },
                  { id: 'temp', label: 'Temperature (°C/°F)' },
                  { id: 'weight', label: 'Weight & Mass (kg/lbs)' }
                ].map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setUnitType(u.id as any);
                      if (u.id === 'pressure') setInputValue(310);
                      if (u.id === 'temp') setInputValue(140);
                      if (u.id === 'weight') setInputValue(5);
                      if (u.id === 'length') setInputValue(25.4);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors whitespace-nowrap ${
                      unitType === u.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-850'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Input Value to Convert
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={e => setInputValue(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-750 px-3 py-2 rounded-xl text-base font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Converted values grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {getConvertedUnits().map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-850 space-y-0.5"
                  >
                    <span className="text-[10px] text-slate-400 block">{item.label}</span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Cycle Time Estimator */}
          {activeTab === 'cycle-time' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Cutting Path Distance (mm)
                  </label>
                  <input
                    type="number"
                    value={cutDistance}
                    onChange={e => setCutDistance(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-750 px-2.5 py-1 rounded-lg font-mono text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Rapid Traverse Distance (mm)
                  </label>
                  <input
                    type="number"
                    value={rapidDistance}
                    onChange={e => setRapidDistance(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-750 px-2.5 py-1 rounded-lg font-mono text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Number of Tool Changes
                  </label>
                  <input
                    type="number"
                    value={toolChanges}
                    onChange={e => setToolChanges(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-750 px-2.5 py-1 rounded-lg font-mono text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    ATC Tool Change Time (seconds)
                  </label>
                  <input
                    type="number"
                    value={toolChangeSec}
                    onChange={e => setToolChangeSec(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-750 px-2.5 py-1 rounded-lg font-mono text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
                <span className="text-[11px] font-bold text-cyan-300 uppercase block mb-1">
                  Estimated Total Cycle Time
                </span>
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {totalCycleSec} seconds ({totalCycleMin.toFixed(2)} mins)
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-cyan-900/40">
                  <span>Cutting: {(cutTimeMin * 60).toFixed(0)}s</span>
                  <span>Rapid: {(rapidTimeMin * 60).toFixed(0)}s</span>
                  <span>Tool Swaps: {(toolChangeMin * 60).toFixed(0)}s</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
