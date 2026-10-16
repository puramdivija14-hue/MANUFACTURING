import React, { useState } from 'react';
import {
  Activity,
  Gauge,
  Clock,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Cpu,
  RotateCcw,
  Sliders,
  Layers,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';

interface Station {
  id: string;
  name: string;
  cycleTimeSec: number;
  machine: string;
}

export const ProductionSimulatorPage: React.FC = () => {
  // Shift Controls
  const [shiftHours, setShiftHours] = useState<number>(8);
  const [plannedDowntimeMin, setPlannedDowntimeMin] = useState<number>(45); // breaks, meeting, changeover
  const [unplannedDowntimeMin, setUnplannedDowntimeMin] = useState<number>(35); // breakdowns, jams
  const [idealCycleTimeSec, setIdealCycleTimeSec] = useState<number>(10.0); // nameplate speed
  const [totalPartsProduced, setTotalPartsProduced] = useState<number>(2250);
  const [defectiveParts, setDefectiveParts] = useState<number>(75);

  // Financial Parameters
  const [partSalePrice, setPartSalePrice] = useState<number>(18.5);
  const [rawMaterialCost, setRawMaterialCost] = useState<number>(6.2);
  const [hourlyLaborRate, setHourlyLaborRate] = useState<number>(35.0);
  const [operatorCount, setOperatorCount] = useState<number>(3);

  // Line Balance Simulation Stations
  const [stations, setStations] = useState<Station[]>([
    { id: 'st-1', name: 'Raw Material Blank Slicing', cycleTimeSec: 8.0, machine: 'Automatic Cold Saw' },
    { id: 'st-2', name: 'Primary 5-Axis CNC Milling', cycleTimeSec: 24.0, machine: '5-Axis Vertical Mill' },
    { id: 'st-3', name: 'Vibratory Deburr & Clean', cycleTimeSec: 12.0, machine: 'Centrifugal Barrel Finisher' },
    { id: 'st-4', name: 'Laser Etch & Final CMM QA', cycleTimeSec: 10.0, machine: 'CMM Bridge & Fiber Laser' }
  ]);

  // Calculations
  const totalShiftMin = shiftHours * 60;
  const plannedProductionMin = Math.max(1, totalShiftMin - plannedDowntimeMin);
  const operatingTimeMin = Math.max(0, plannedProductionMin - unplannedDowntimeMin);
  const operatingTimeSec = operatingTimeMin * 60;

  // 1. Availability: Operating Time / Planned Production Time
  const availability = plannedProductionMin > 0 ? (operatingTimeMin / plannedProductionMin) * 100 : 0;

  // 2. Performance: (Ideal Cycle Time * Total Parts) / Operating Time
  const idealOperatingSec = totalPartsProduced * idealCycleTimeSec;
  const performance = operatingTimeSec > 0 ? Math.min(100, (idealOperatingSec / operatingTimeSec) * 100) : 0;

  // 3. Quality: Good Parts / Total Parts Produced
  const goodParts = Math.max(0, totalPartsProduced - defectiveParts);
  const quality = totalPartsProduced > 0 ? (goodParts / totalPartsProduced) * 100 : 0;

  // Overall Equipment Effectiveness (OEE)
  const oee = (availability * performance * quality) / 10000;

  // Financial Metrics
  const totalProducedRevenue = goodParts * partSalePrice;
  const scrapLossCost = defectiveParts * rawMaterialCost;
  const laborCostTotal = shiftHours * hourlyLaborRate * operatorCount;
  const materialCostTotal = totalPartsProduced * rawMaterialCost;
  const downtimeLostUnits = Math.round((unplannedDowntimeMin * 60) / Math.max(1, idealCycleTimeSec));
  const lostDowntimeRevenue = downtimeLostUnits * (partSalePrice - rawMaterialCost);
  const netShiftGrossMargin = totalProducedRevenue - laborCostTotal - materialCostTotal;

  // Bottleneck Station in Multi-Stage Line
  const bottleneckStation = stations.reduce(
    (max, s) => (s.cycleTimeSec > max.cycleTimeSec ? s : max),
    stations[0]
  );
  const maxLineThroughputPerHour = Math.round(3600 / bottleneckStation.cycleTimeSec);
  const lineCycleTimeSum = stations.reduce((acc, s) => acc + s.cycleTimeSec, 0);
  const lineBalancingEfficiency = (lineCycleTimeSum / (stations.length * bottleneckStation.cycleTimeSec)) * 100;

  const handleUpdateStationCycle = (id: string, newSec: number) => {
    setStations(
      stations.map(st => (st.id === id ? { ...st, cycleTimeSec: Math.max(1, newSec) } : st))
    );
  };

  const getOEEColor = (val: number) => {
    if (val >= 85) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
    if (val >= 65) return 'text-teal-400 border-teal-500/50 bg-teal-500/10';
    if (val >= 50) return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/50 bg-rose-500/10';
  };

  const getOEEBadge = (val: number) => {
    if (val >= 85) return { label: 'World-Class OEE (≥ 85%)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (val >= 65) return { label: 'Typical Factory Standard (65–84%)', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
    if (val >= 50) return { label: 'Moderate Loss (50–64%)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    return { label: 'Critical Factory Downtime (< 50%)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
  };

  const oeeBadge = getOEEBadge(oee);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Shop Floor Digital Twin & Throughput Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Plant OEE & Production Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Simulate shift throughput, Overall Equipment Effectiveness (Availability × Performance × Quality),
          identify production line bottlenecks, and quantify the exact financial cost of machine downtime and scrap.
        </p>
      </div>

      {/* Big Top Status Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center font-mono ${getOEEColor(
              oee
            )}`}
          >
            <span className="text-3xl font-black">{oee.toFixed(1)}%</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">OEE Score</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <span
              className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${oeeBadge.color}`}
            >
              {oeeBadge.label}
            </span>
            <h2 className="text-xl font-bold text-white">Shift Production Performance</h2>
            <p className="text-xs text-slate-400 max-w-md">
              {oee >= 85
                ? 'Excellent equipment utilization with minimal unprogrammed stops and near-zero scrap.'
                : oee >= 65
                ? 'Standard industrial plant benchmark. Focus on reducing minor jams and setup changeover times.'
                : 'Heavy productivity leakages. Unplanned breakdown and scrap rate are eroding gross margins.'}
            </p>
          </div>
        </div>

        {/* 3 Pillars Summary */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Availability</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{availability.toFixed(1)}%</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Uptime / Planned</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Performance</span>
            <span className="text-lg font-black text-cyan-400 font-mono">{performance.toFixed(1)}%</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Speed / Nameplate</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Quality</span>
            <span className="text-lg font-black text-teal-300 font-mono">{quality.toFixed(1)}%</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Good / Total Parts</span>
          </div>
        </div>
      </div>

      {/* Main Two Columns: Shift Controls & Line Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shift Inputs & Financial Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-850 p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Shift Operation Variables</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">
                {shiftHours}h Shift ({plannedProductionMin} min net)
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Shift Duration</span>
                  <span className="text-emerald-400 font-mono">{shiftHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="1"
                  value={shiftHours}
                  onChange={e => setShiftHours(parseInt(e.target.value))}
                  className="w-full accent-emerald-400"
                />
                <span className="text-[10px] text-slate-500">8h single shift, 12h heavy, or 24h continuous</span>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Planned Downtime (Breaks, Changeovers)</span>
                  <span className="text-teal-400 font-mono">{plannedDowntimeMin} min</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={plannedDowntimeMin}
                  onChange={e => setPlannedDowntimeMin(parseInt(e.target.value))}
                  className="w-full accent-teal-400"
                />
                <span className="text-[10px] text-slate-500">Scheduled operator rest, tool change, cleanup</span>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span className="text-rose-300 font-semibold">Unplanned Machine Breakdown / Jams</span>
                  <span className="text-rose-400 font-mono font-bold">{unplannedDowntimeMin} min</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={unplannedDowntimeMin}
                  onChange={e => setUnplannedDowntimeMin(parseInt(e.target.value))}
                  className="w-full accent-rose-400"
                />
                <span className="text-[10px] text-slate-500">Stoppages due to tool breakage, sensor fault, jams</span>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Ideal Nameplate Cycle Time</span>
                  <span className="text-cyan-400 font-mono">{idealCycleTimeSec.toFixed(1)} sec / part</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="60.0"
                  step="0.5"
                  value={idealCycleTimeSec}
                  onChange={e => setIdealCycleTimeSec(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <span className="text-[10px] text-slate-500">Theoretical maximum machine speed</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Total Parts Run</span>
                  <input
                    type="number"
                    min="1"
                    value={totalPartsProduced}
                    onChange={e => setTotalPartsProduced(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-transparent font-mono text-white text-sm font-bold focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Gross produced</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30">
                  <span className="text-rose-400 text-[10px] uppercase font-bold block mb-1">Scrap / Defective</span>
                  <input
                    type="number"
                    min="0"
                    value={defectiveParts}
                    onChange={e => setDefectiveParts(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-transparent font-mono text-rose-400 text-sm font-bold focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Quality rejects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shift Financial Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-850 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Shift Economic Impact & Losses</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60">
                <span className="text-slate-400">Total Valid Output Revenue:</span>
                <span className="font-mono font-bold text-emerald-400">${totalProducedRevenue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 text-rose-300">
                <span>Scrap Material Waste Loss:</span>
                <span className="font-mono font-bold text-rose-400">-${scrapLossCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 text-amber-300">
                <span>Downtime Opportunity Cost ({downtimeLostUnits} parts):</span>
                <span className="font-mono font-bold text-amber-400">-${lostDowntimeRevenue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-emerald-500/30 font-bold">
                <span className="text-white">Estimated Shift Gross Margin:</span>
                <span className="font-mono text-emerald-400 text-sm">${netShiftGrossMargin.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Line Balancing & Bottleneck Analyzer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Multi-Station Assembly Line Balancing */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Interactive Cell Bottleneck & Line Balance</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust individual station cycle times to observe line starvation and bottleneck constraints.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Line Efficiency</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  {lineBalancingEfficiency.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Bottleneck Warning Alert */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block">
                  Critical Bottleneck: {bottleneckStation.name} ({bottleneckStation.cycleTimeSec}s / unit)
                </span>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  The entire manufacturing line throughput is constrained to{' '}
                  <strong className="text-white font-mono">{maxLineThroughputPerHour} units/hr</strong> by this station.
                  Subsequent stations are starved of work for{' '}
                  {Math.round(bottleneckStation.cycleTimeSec - 10)} seconds every cycle.
                </p>
              </div>
            </div>

            {/* Station Cards */}
            <div className="space-y-3">
              {stations.map((st, idx) => {
                const isBottleneck = st.id === bottleneckStation.id;
                return (
                  <div
                    key={st.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isBottleneck
                        ? 'bg-amber-950/15 border-amber-500/50 shadow-md shadow-amber-500/5'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg font-mono font-bold flex items-center justify-center text-xs shrink-0 ${
                            isBottleneck
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{st.name}</span>
                            {isBottleneck && (
                              <span className="text-[9px] uppercase font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                BOTTLENECK
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{st.machine}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-400">Cycle Time:</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={st.cycleTimeSec}
                            onChange={e => handleUpdateStationCycle(st.id, parseFloat(e.target.value) || 1)}
                            className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white text-center focus:outline-none focus:border-amber-400"
                          />
                          <span className="text-xs font-mono text-slate-400">sec</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar visual representation of station load */}
                    <div className="mt-3">
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                          style={{
                            width: `${Math.min(100, (st.cycleTimeSec / bottleneckStation.cycleTimeSec) * 100)}%`
                          }}
                          className={`h-full transition-all ${
                            isBottleneck ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6 Big Losses Breakdown */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>TPM (Total Productive Maintenance) 6 Big Losses Breakdown</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-rose-400 block mb-1">1. Equipment Failure</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Loss of {unplannedDowntimeMin} min unplanned breakdown.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-amber-400 block mb-1">2. Setup & Adjustments</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tool change & clean consumes {plannedDowntimeMin} min.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-teal-400 block mb-1">3. Process Defects</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {defectiveParts} parts rejected in QA inspection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
