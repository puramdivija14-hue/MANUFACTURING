import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  ClipboardList,
  Sparkles,
  Trash2,
  ArrowRight,
  Download,
  Upload,
  RotateCcw,
  Clock,
  Layers,
  Search,
  CheckCircle2
} from 'lucide-react';
import { GeneratedIdea, ManufacturingPlan } from '../types';
import { storageService } from '../services/storageService';

interface SavedProjectsPageProps {
  onNavigateToPlanner: (planId?: string) => void;
  onNavigateToGenerator: () => void;
}

export const SavedProjectsPage: React.FC<SavedProjectsPageProps> = ({
  onNavigateToPlanner,
  onNavigateToGenerator
}) => {
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [plans, setPlans] = useState<ManufacturingPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'plans' | 'ideas'>('plans');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIdeas(storageService.getSavedIdeas());
    setPlans(storageService.getSavedPlans());
  };

  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this production plan from your workspace?')) {
      storageService.deletePlan(id);
      loadData();
    }
  };

  const handleDeleteIdea = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this saved idea from your workspace?')) {
      storageService.deleteIdea(id);
      loadData();
    }
  };

  const handleExportJSON = () => {
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manugenius_projects_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPlans = plans.filter(
    p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productOverview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIdeas = ideas.filter(
    i =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.problemAddressed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.proposedSolution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Workspace Storage & Projects</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Saved Projects & Blueprints
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Manage your saved manufacturing production plans, BOM estimates, and generated engineering concepts. Export full backups or open directly in the planner.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Projects (JSON)</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'plans'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Production Plans ({plans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'ideas'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saved Ideas ({ideas.length})</span>
          </button>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search saved projects..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          {filteredPlans.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center space-y-3">
              <ClipboardList className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Production Plans Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Generate a new production plan in the Manufacturing Planner or save one from the AI Idea Generator.
              </p>
              <button
                onClick={() => onNavigateToPlanner()}
                className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
              >
                Go to Planner
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlans.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => onNavigateToPlanner(plan.id)}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:bg-slate-900/60 group relative space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                        Production Plan
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-teal-300 transition-colors">
                        {plan.title}
                      </h3>
                    </div>
                    <button
                      onClick={e => handleDeletePlan(plan.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-850 transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {plan.productOverview}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">BOM Items</span>
                      <span className="font-bold text-white">{plan.bom.length} items</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Steps</span>
                      <span className="font-bold text-white">{plan.processFlow.length} steps</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Unit Cost</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        ${plan.costBreakdown.totalPerUnit.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Lead Time: {plan.leadTime}
                    </span>
                    <span className="text-teal-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Open in Planner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ideas Tab */}
      {activeTab === 'ideas' && (
        <div className="space-y-4">
          {filteredIdeas.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Saved Ideas Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Generate creative concepts in the AI Idea Generator and click the bookmark icon to save them here.
              </p>
              <button
                onClick={onNavigateToGenerator}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Generate Ideas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIdeas.map(idea => (
                <div
                  key={idea.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {idea.mode}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">
                        {idea.title}
                      </h3>
                    </div>
                    <button
                      onClick={e => handleDeleteIdea(idea.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-850 transition-colors"
                      title="Delete Idea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {idea.proposedSolution}
                  </p>

                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Method:</span>{' '}
                    {idea.manufacturingMethod}
                  </div>

                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-mono font-semibold">
                      {idea.estimatedCostPerUnit}
                    </span>
                    <button
                      onClick={() => onNavigateToPlanner()}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <span>Plan This Idea</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
