import React, { useState } from 'react';
import {
  Sparkles,
  ClipboardList,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  Share2,
  Check
} from 'lucide-react';
import { GeneratedIdea } from '../types';

interface IdeaCardProps {
  idea: GeneratedIdea;
  onSendToPlanner: (idea: GeneratedIdea) => void;
  onSaveIdea: (idea: GeneratedIdea) => void;
  isSaved: boolean;
  isSelectedForCompare: boolean;
  onToggleCompare: (idea: GeneratedIdea) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onSendToPlanner,
  onSaveIdea,
  isSaved,
  isSelectedForCompare,
  onToggleCompare
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const getComplexityColor = (comp: string) => {
    switch (comp) {
      case 'Low':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'High':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  const handleCopy = () => {
    const summary = `${idea.title}\nMethod: ${idea.manufacturingMethod}\nSolution: ${idea.proposedSolution}\nMaterials: ${idea.materials.join(', ')}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`glass-panel rounded-2xl border transition-all duration-200 overflow-hidden ${
        isSelectedForCompare
          ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
      }`}
    >
      {/* Top Header Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-850">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {idea.mode}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getComplexityColor(
                idea.estimatedComplexity
              )}`}
            >
              Complexity: {idea.estimatedComplexity} ({idea.complexityScore}/10)
            </span>
            {idea.isDemo && (
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Demo Synthesis
              </span>
            )}
          </div>

          {/* Quick Actions (Save & Compare Toggle) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleCompare(idea)}
              className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-colors ${
                isSelectedForCompare
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Add to side-by-side comparison"
            >
              <input
                type="checkbox"
                checked={isSelectedForCompare}
                readOnly
                className="w-3 h-3 rounded accent-emerald-500 pointer-events-none"
              />
              <span className="hidden sm:inline">Compare</span>
            </button>

            <button
              onClick={() => onSaveIdea(idea)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title={isSaved ? 'Saved in Projects' : 'Save Idea'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-white transition-colors"
              title="Copy Summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight hover:text-emerald-300 transition-colors">
          {idea.title}
        </h3>

        {/* Problem Addressed */}
        <div className="mt-2.5 text-xs text-slate-400 flex items-start gap-1.5">
          <span className="text-slate-500 font-semibold shrink-0">Problem:</span>
          <span>{idea.problemAddressed}</span>
        </div>

        {/* Proposed Solution */}
        <div className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-850">
          <span className="font-semibold text-emerald-400 block mb-1">
            Engineered Solution:
          </span>
          {idea.proposedSolution}
        </div>
      </div>

      {/* Technical Metadata Row */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Materials */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Key Materials Specified:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {idea.materials.map((mat, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-850 text-slate-300 border border-slate-750 font-medium"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>

        {/* Manufacturing Method */}
        <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-850">
          <div className="text-[11px] font-bold uppercase text-slate-400 shrink-0 mt-0.5">
            Primary Method:
          </div>
          <div className="text-xs font-semibold text-emerald-300">
            {idea.manufacturingMethod}
          </div>
        </div>

        {/* Cost & Cycle Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>Est. Unit Cost</span>
            </div>
            <div className="text-xs font-bold text-white">
              {idea.estimatedCostPerUnit}
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Clock className="w-3 h-3 text-blue-400" />
              <span>Est. Cycle Time</span>
            </div>
            <div className="text-xs font-bold text-white">
              {idea.estimatedCycleTime}
            </div>
          </div>
        </div>

        {/* Expandable Engineering Details (Advantages, Limitations, Next Steps) */}
        {expanded && (
          <div className="space-y-4 pt-3 border-t border-slate-850 animate-in fade-in duration-150">
            {/* Advantages */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Key Engineering Advantages:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {idea.advantages.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block mb-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Known Manufacturing Limitations:
              </span>
              <ul className="space-y-1 text-xs text-slate-400">
                {idea.limitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 block mb-1.5">
                Recommended Next Engineering Steps:
              </span>
              <ol className="space-y-1 text-xs text-slate-300 list-decimal list-inside">
                {idea.nextSteps.map((step, idx) => (
                  <li key={idx} className="text-slate-300">
                    <span className="text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Toggle Expand / Collapse Details Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-850 border border-slate-850 transition-colors"
        >
          <span>{expanded ? 'Hide Technical Analysis' : 'View Full Technical Analysis & Next Steps'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Core CTA: Send to Planner */}
        <div className="pt-2">
          <button
            onClick={() => onSendToPlanner(idea)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all group"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Generate Production Plan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
