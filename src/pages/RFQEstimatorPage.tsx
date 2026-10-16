import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  TrendingDown,
  Globe,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  Download,
  AlertCircle,
  Building2,
  Ship,
  Clock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const RFQEstimatorPage: React.FC = () => {
  // General Project Details
  const [partName, setPartName] = useState<string>('Custom CNC Enclosure Base');
  const [materialSpec, setMaterialSpec] = useState<string>('Aluminum 6061-T6 (Black Anodized Type II)');
  const [targetVolume, setTargetVolume] = useState<number>(5000);
  const [toleranceSpec, setToleranceSpec] = useState<string>('ISO 2768-m (±0.1 mm on critical bores)');

  // Domestic (Nearshore) Parameters
  const [domesticTooling, setDomesticTooling] = useState<number>(3500);
  const [domesticUnitCost, setDomesticUnitCost] = useState<number>(14.5);
  const [domesticLeadWeeks, setDomesticLeadWeeks] = useState<number>(3);
  const [domesticShippingPerUnit, setDomesticShippingPerUnit] = useState<number>(0.8);

  // Offshore Parameters
  const [offshoreTooling, setOffshoreTooling] = useState<number>(6800);
  const [offshoreUnitCost, setOffshoreUnitCost] = useState<number>(7.2);
  const [offshoreLeadWeeks, setOffshoreLeadWeeks] = useState<number>(10);
  const [offshoreShippingPerUnit, setOffshoreShippingPerUnit] = useState<number>(1.6);
  const [tariffPercent, setTariffPercent] = useState<number>(7.5); // % customs tariff
  const [qualityRiskPercent, setQualityRiskPercent] = useState<number>(2.0); // % scrap risk

  const [copiedStatus, setCopiedStatus] = useState(false);

  // Landed Cost Calculations for target volume
  const domesticTotalCost =
    domesticTooling + (domesticUnitCost + domesticShippingPerUnit) * targetVolume;
  const domesticLandedPerUnit = domesticTotalCost / targetVolume;

  const offshoreTariffPerUnit = (offshoreUnitCost * tariffPercent) / 100;
  const offshoreScrapPerUnit = (offshoreUnitCost * qualityRiskPercent) / 100;
  const offshoreLandedPerUnit =
    offshoreTooling / targetVolume +
    offshoreUnitCost +
    offshoreShippingPerUnit +
    offshoreTariffPerUnit +
    offshoreScrapPerUnit;
  const offshoreTotalCost = offshoreLandedPerUnit * targetVolume;

  // Break-even Volume Calculation:
  // Tooling_dom + Cost_dom * Q = Tooling_off + Cost_off * Q
  // Q = (Tooling_off - Tooling_dom) / (Cost_dom - Cost_off)
  const domesticEffectiveUnit = domesticUnitCost + domesticShippingPerUnit;
  const offshoreEffectiveUnit =
    offshoreUnitCost + offshoreShippingPerUnit + offshoreTariffPerUnit + offshoreScrapPerUnit;
  const unitCostDelta = domesticEffectiveUnit - offshoreEffectiveUnit;
  const toolingDelta = offshoreTooling - domesticTooling;
  const breakEvenVolume =
    unitCostDelta > 0 && toolingDelta > 0 ? Math.round(toolingDelta / unitCostDelta) : 0;

  // Comparison Volume Tiers
  const volumeTiers = [500, 2500, 10000, 50000];

  // RFQ Letter Text Generator
  const generateRFQText = () => {
    return `REQUEST FOR QUOTATION (RFQ) — MANUFACTURING SERVICES
Date: ${new Date().toISOString().split('T')[0]}
Document Reference: RFQ-MG-${Math.floor(100000 + Math.random() * 900000)}

1. PROJECT OVERVIEW
Part Description: ${partName}
Material Specification: ${materialSpec}
General Tolerances: ${toleranceSpec}
Target Annual Volume: ${targetVolume.toLocaleString()} units
First Batch Delivery Requirement: Within ${domesticLeadWeeks}–${offshoreLeadWeeks} weeks of PO confirmation

2. SCOPE OF SUPPLY
• Tooling & Fixturing (NRE) required for automated production.
• High-precision machining / forming / moulding as per supplied 3D CAD (.STEP) and 2D PDF drawing.
• Surface finish & plating certificate of conformity (CoC).
• First Article Inspection Report (FAIR per AS9102 or ISO 9001).

3. QUALITY & INSPECTION PROTOCOL
• Critical dimensional verification using CMM or optical comparator.
• Material Mill Test Report (MTR) must accompany each shipment lot.
• AQL 1.0 General Inspection Level II sampling plan.

4. COMMERCIAL TERMS & SUBMISSION
Please submit your quotation including:
a) Tooling NRE cost and mold/fixture lead time (weeks).
b) Tiered unit pricing for ${volumeTiers.map(v => v.toLocaleString()).join(', ')} units.
c) Recommended packaging and freight terms (Incoterms 2020: EXW, FOB, or DDP).
d) Valid quotation validity period (minimum 30 days).

Non-Disclosure Agreement (NDA) applies. Please reply to this RFQ with itemized breakdown.`;
  };

  const handleCopyRFQ = () => {
    navigator.clipboard.writeText(generateRFQText());
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const handleDownloadRFQ = () => {
    const element = document.createElement('a');
    const file = new Blob([generateRFQText()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `RFQ_${partName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>Procurement & Supply Chain Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Supplier RFQ & Sourcing Estimator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Compare total landed costs between Domestic and Offshore suppliers, calculate tooling break-even volumes,
          factor in ocean freight and tariffs, and generate formal Request-for-Quotation (RFQ) packages.
        </p>
      </div>

      {/* Break-Even Volume Highlight Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
            Sourcing Decision Analysis
          </span>
          <h2 className="text-xl font-bold text-white">
            {targetVolume >= breakEvenVolume && breakEvenVolume > 0
              ? 'Offshore Sourcing is Cost-Effective at this Volume'
              : 'Domestic Sourcing is Recommended for this Batch Size'}
          </h2>
          <p className="text-xs text-slate-400 max-w-lg">
            Break-even volume is{' '}
            <strong className="text-white font-mono">{breakEvenVolume.toLocaleString()} units</strong>. Below this
            threshold, lower domestic tooling Capex and zero customs tariffs offset higher labor costs.
          </p>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Domestic Landed</span>
            <span className="text-xl font-black text-white font-mono">
              ${domesticLandedPerUnit.toFixed(2)}
            </span>
            <span className="text-[9px] text-slate-500 block">per unit @ {targetVolume.toLocaleString()}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/40 bg-emerald-950/10">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">Offshore Landed</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              ${offshoreLandedPerUnit.toFixed(2)}
            </span>
            <span className="text-[9px] text-slate-500 block">incl. freight + {tariffPercent}% tariff</span>
          </div>
        </div>
      </div>

      {/* Main Two Columns: Sourcing Inputs & Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sourcing Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-850 p-5 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Project & Cost Parameters</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Part / Assembly Name</label>
                <input
                  type="text"
                  value={partName}
                  onChange={e => setPartName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Annual Order Volume</label>
                <input
                  type="number"
                  min="100"
                  value={targetVolume}
                  onChange={e => setTargetVolume(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Domestic Specs */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Domestic (Local / Nearshore)</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tooling / NRE ($)</span>
                    <input
                      type="number"
                      value={domesticTooling}
                      onChange={e => setDomesticTooling(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Piece Price ($/unit)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={domesticUnitCost}
                      onChange={e => setDomesticUnitCost(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Offshore Specs */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                  <Ship className="w-3.5 h-3.5" />
                  <span>Offshore (Overseas Container)</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tooling / NRE ($)</span>
                    <input
                      type="number"
                      value={offshoreTooling}
                      onChange={e => setOffshoreTooling(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Piece Price ($/unit)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={offshoreUnitCost}
                      onChange={e => setOffshoreUnitCost(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sea Freight ($/unit)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={offshoreShippingPerUnit}
                      onChange={e => setOffshoreShippingPerUnit(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tariff Duty (%)</span>
                    <input
                      type="number"
                      step="0.5"
                      value={tariffPercent}
                      onChange={e => setTariffPercent(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Volume Tier Table & RFQ Letter (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Landed Cost by Volume Table */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Landed Cost per Unit Across Volume Tiers</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Order Batch (Units)</th>
                    <th className="p-3">Domestic Landed ($)</th>
                    <th className="p-3">Offshore Landed ($)</th>
                    <th className="p-3">Cost Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {volumeTiers.map(tier => {
                    const domLanded = (domesticTooling + domesticEffectiveUnit * tier) / tier;
                    const offLanded = (offshoreTooling + offshoreEffectiveUnit * tier) / tier;
                    const isOffshoreCheaper = offLanded < domLanded;
                    const savingsPct = Math.abs(((domLanded - offLanded) / domLanded) * 100);

                    return (
                      <tr key={tier} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-white">{tier.toLocaleString()}</td>
                        <td className="p-3 font-mono text-slate-300">${domLanded.toFixed(2)}</td>
                        <td className="p-3 font-mono text-emerald-400">${offLanded.toFixed(2)}</td>
                        <td className="p-3">
                          {isOffshoreCheaper ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                              Offshore {savingsPct.toFixed(0)}% cheaper
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/30">
                              Domestic {savingsPct.toFixed(0)}% cheaper
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Generated RFQ Document Preview */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Generated Request for Quotation (RFQ)</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyRFQ}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                >
                  {copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStatus ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadRFQ}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-xs font-bold text-slate-950 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-72">
              {generateRFQText()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
