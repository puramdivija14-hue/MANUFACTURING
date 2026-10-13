import React from 'react';
import { X, ArrowRight, ClipboardList, CheckCircle2, AlertTriangle, Layers, Clock, DollarSign } from 'lucide-react';
import { GeneratedIdea } from '../types';

interface IdeaComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: GeneratedIdea[];
  onRemoveFromCompare: (id: string) => void;
  onSendToPlanner: (idea: GeneratedIdea) => void;
}

export const IdeaComparisonModal: React.FC<IdeaComparisonModalProps> = ({
  isOpen,
  onClose,
  ideas,
  onRemoveFromCompare,
  onSendToPlanner
}) => {
  if (!isOpen || ideas.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        className="w-full max-w-6xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Side-by-Side Manufacturing Concepts Comparison</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                {ideas.length} of 3 selected
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluate technical feasibility, cycle times, costs, and tooling complexity head-to-head.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table Scroll Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[650px]">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-slate-850 bg-slate-900/50 relative">
                  <button
                    onClick={() => onRemoveFromCompare(idea.id)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 inline-block mb-1.5">
                    {idea.mode}
                  </span>
                  <h4 className="font-bold text-sm text-white pr-6">
                    {idea.title}
                  </h4>
                </div>

                {/* Content Rows */}
                <div className="p-4 space-y-4 flex-1 text-xs">
                  {/* Solution Summary */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Engineered Solution
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-900/40 p-2.5 rounded-lg border border-slate-850">
                      {idea.proposedSolution}
                    </p>
                  </div>

                  {/* Primary Method */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Primary Process
                    </span>
                    <div className="font-semibold text-emerald-400 text-xs">
                      {idea.manufacturingMethod}
                    </div>
                  </div>

                  {/* Key Materials */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Specified Materials
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {idea.materials.map((mat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-850 text-slate-300 text-[10px] border border-slate-800"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850">
                    <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-400 block">Est. Unit Cost</span>
                      <span className="font-bold text-white text-[11px]">{idea.estimatedCostPerUnit}</span>
                    </div>
                    <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-400 block">Est. Cycle Time</span>
                      <span className="font-bold text-white text-[11px]">{idea.estimatedCycleTime}</span>
                    </div>
                  </div>

                  {/* Complexity */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-850">
                    <span className="text-[10px] text-slate-400">Tooling Complexity</span>
                    <span className="font-semibold text-emerald-300 text-xs">
                      {idea.estimatedComplexity} ({idea.complexityScore}/10)
                    </span>
                  </div>

                  {/* Advantages */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-emerald-400 block mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Key Advantages
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {idea.advantages.slice(0, 2).map((a, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-amber-400 block mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Engineering Limitations
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-400">
                      {idea.limitations.slice(0, 2).map((l, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3 border-t border-slate-850 bg-slate-900/50">
                  <button
                    onClick={() => {
                      onSendToPlanner(idea);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-colors"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Select & Plan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
