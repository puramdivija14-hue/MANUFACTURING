import React from 'react';
import {
  Sparkles,
  BookOpen,
  ClipboardList,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  Sliders,
  Search,
  Factory,
  Zap,
  Box,
  Activity,
  Globe,
  Compass
} from 'lucide-react';
import { SAMPLE_CHALLENGES } from '../data/sampleProjects';
import { ManufacturingPlan, GeneratedIdea } from '../types';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenSearch: () => void;
  savedPlans: ManufacturingPlan[];
  savedIdeas: GeneratedIdea[];
  onSelectChallenge: (challenge: typeof SAMPLE_CHALLENGES[0]) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenSearch,
  savedPlans,
  savedIdeas,
  onSelectChallenge
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-900 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
        {/* Subtle background tech glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Platform • Smart Manufacturing • Smarter Ideas</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Transform Manufacturing Ideas into{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Reality.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Turn your concept into practical manufacturing knowledge, a structured production workflow, a verified bill of materials, and a working prototype.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('generator')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate Ideas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('knowledge')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Explore Manufacturing</span>
            </button>

            <button
              onClick={() => onNavigate('planner')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-0.5"
            >
              <ClipboardList className="w-4 h-4 text-cyan-400" />
              <span>Create a Plan</span>
            </button>
          </div>

          {/* Search Bar Prompt */}
          <div className="mt-10 max-w-xl mx-auto">
            <div
              onClick={onOpenSearch}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer shadow-xl transition-all group"
            >
              <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 text-xs sm:text-sm">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Search 12 manufacturing processes, materials, or machines...</span>
              </div>
              <kbd className="hidden sm:inline text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-1 rounded-md font-mono">
                Ctrl + K
              </kbd>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-850/80">
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-white font-mono">12</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Core Process Blueprints</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-emerald-400 font-mono">8 Modes</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">AI Ideation Frameworks</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-cyan-400 font-mono">25+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Materials & Machines</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-teal-300 font-mono">End-to-End</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Idea → Plan → Prototype</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The Complete Idea-to-Manufacturing Engine
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            More than a chatbot. A practical engineering suite built to take your product from napkin sketch to verified factory run.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('generator')}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              AI Idea Generator
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Explore 8 generation modes: low-cost fabrication, eco-friendly materials, smart factories, automation, and waste-to-value products.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 gap-1">
              <span>Generate Concepts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate('knowledge')}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
              Knowledge Hub
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Deep technical breakdowns of 12 processes: CNC, casting, 3D printing, injection moulding, sheet metal, welding, and GD&T metrology.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-400 gap-1">
              <span>Learn Processes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('planner')}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
              <ClipboardList className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
              Manufacturing Planner
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Generate structured BOMs, machine requirements, step-by-step production flow, OSHA safety requirements, and printable PDF reports.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-400 gap-1">
              <span>Build Production Plan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onNavigate('sustainability')}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Circular Sustainability
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Calculate raw material scrap yield, evaluate carbon footprints, and swap petroleum resins with bio-materials and recycled feedstocks.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 gap-1">
              <span>Analyze Scrap & Yield</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Specialized Production & Engineering Studios */}
        <div className="mt-8 pt-8 border-t border-slate-850">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Advanced Production Studios
              </span>
              <h3 className="text-lg font-bold text-white">Engineering Decision Engines</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">Ctrl + 7 / 8 / 9 / 0</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Studio 1: DFM Analyzer */}
            <div
              onClick={() => onNavigate('dfm')}
              className="p-5 rounded-2xl bg-gradient-to-b from-cyan-950/20 to-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/25 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Rule Checker
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                DFM Analyzer & Defect Predictor
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Check geometry rules across CNC, Molding, Sheet Metal & 3D printing. Catch sink marks and tool chatter.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-cyan-400">
                <span>Run DFM Audit</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Studio 2: Plant OEE Simulator */}
            <div
              onClick={() => onNavigate('simulator')}
              className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/20 to-slate-900/60 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/25 transition-colors">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Digital Twin
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Plant OEE & Shift Simulator
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Simulate shop floor shift throughput, calculate Availability × Performance × Quality, and identify line bottlenecks.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <span>Simulate Shift</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Studio 3: Supplier RFQ Estimator */}
            <div
              onClick={() => onNavigate('rfq')}
              className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/20 to-slate-900/60 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/25 transition-colors">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Sourcing
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                Supplier RFQ & Sourcing Estimator
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Compare Domestic vs Offshore landed unit costs, find tooling break-even volumes, and generate formal RFQ packages.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-400">
                <span>Compare Sourcing</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Studio 4: 2D CAD Blueprint & GD&T Viewer */}
            <div
              onClick={() => onNavigate('blueprint')}
              className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/20 to-slate-900/60 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/25 transition-colors">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  2D CAD & GD&T
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Technical Blueprint & Fits
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Render ISO 128 engineering blueprints with cross-hatch section views, PCD bolt patterns, GD&T frames, and ISO 286 tolerance limits.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-400">
                <span>Open CAD Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Manufacturing Challenges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Project & Hackathon Accelerators</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Suggested Manufacturing Challenges</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any challenge to instantly load its engineering problem into the AI Idea Generator.
            </p>
          </div>
          <button
            onClick={() => onNavigate('generator')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start md:self-auto"
          >
            <span>Custom Idea Prompt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_CHALLENGES.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => onSelectChallenge(challenge)}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all hover:bg-slate-900/60 group"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {challenge.category}
                </span>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                  Target: {challenge.targetCost}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {challenge.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {challenge.objective}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-slate-500">Materials:</span>
                  <span>{challenge.suggestedMaterials.join(', ')}</span>
                </div>
                <div className="text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Solve</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Projects Section */}
      {(savedPlans.length > 0 || savedIdeas.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Active Projects in Workspace</h2>
              <p className="text-xs text-slate-400">
                Continue working on your saved manufacturing production plans and ideas.
              </p>
            </div>
            <button
              onClick={() => onNavigate('saved')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPlans.slice(0, 3).map((plan) => (
              <div
                key={plan.id}
                onClick={() => onNavigate('planner', { planId: plan.id })}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-teal-500/40 cursor-pointer transition-all hover:bg-slate-900/60 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    Production Plan
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {plan.bom.length} BOM Items
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                  {plan.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {plan.productOverview}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-mono font-semibold">
                    ${plan.costBreakdown.totalPerUnit.toFixed(2)} / unit
                  </span>
                  <span className="text-slate-400 group-hover:text-white flex items-center gap-1 text-[11px]">
                    Open in Planner
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
