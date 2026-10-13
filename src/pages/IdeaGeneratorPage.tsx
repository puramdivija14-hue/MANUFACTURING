import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  DollarSign,
  Layers,
  Cpu,
  RefreshCw,
  Scale,
  ClipboardList,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
  Info,
  Mic,
  MicOff
} from 'lucide-react';
import {
  IdeaGenerationInput,
  GeneratedIdea,
  UserSettings
} from '../types';
import { aiService, GenerationResult } from '../services/aiService';
import { IdeaCard } from '../components/IdeaCard';
import { IdeaComparisonModal } from '../components/IdeaComparisonModal';

interface IdeaGeneratorPageProps {
  initialForm?: Partial<IdeaGenerationInput>;
  onSendToPlanner: (idea: GeneratedIdea) => void;
  onSaveIdea: (idea: GeneratedIdea) => void;
  savedIdeaIds: string[];
  settings: UserSettings;
}

export const IdeaGeneratorPage: React.FC<IdeaGeneratorPageProps> = ({
  initialForm,
  onSendToPlanner,
  onSaveIdea,
  savedIdeaIds,
  settings
}) => {
  const [form, setForm] = useState<IdeaGenerationInput>({
    industry: initialForm?.industry || 'Eco-Friendly Agriculture & Home Goods',
    problem: initialForm?.problem || 'Excessive plastic nursery pot waste and local agricultural rice husk burning.',
    budget: initialForm?.budget || '$500 - $2,500 Pilot Run',
    materials: initialForm?.materials || 'Rice husks, sugarcane bagasse, potato starch binder, natural wax',
    scale: initialForm?.scale || 'small-batch',
    objective: initialForm?.objective || 'reduce-waste',
    mode: initialForm?.mode || 'waste-to-value'
  });

  const [loading, setLoading] = useState(false);
  const [generationMeta, setGenerationMeta] = useState<{
    source: string;
    isDemo: boolean;
  } | null>(null);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [compareList, setCompareList] = useState<GeneratedIdea[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleToggleVoiceProblem = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setForm(prev => ({
            ...prev,
            problem: prev.problem ? `${prev.problem} ${transcript}` : transcript
          }));
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const generationModes = [
    { id: 'brainstorming', label: 'Creative Brainstorming', desc: 'Divergent thinking for unconventional manufacturing forms' },
    { id: 'low-cost', label: 'Low-Cost Manufacturing', desc: 'Minimal tooling CapEx and value-engineered components' },
    { id: 'sustainable', label: 'Sustainable & Eco-Friendly', desc: 'Renewable biomaterials, PCR feedstocks, and zero-toxic finishes' },
    { id: 'automation', label: 'Automation & Smart Factory', desc: 'Cobot integration, sensor telemetry, and automated cycle loops' },
    { id: 'waste-to-value', label: 'Waste-to-Value Circularity', desc: 'Transforming industrial byproducts into high-value items' },
    { id: 'product-improvement', label: 'Product Improvement', desc: 'Lightweighting, ergonomics, and structural optimization' },
    { id: 'new-concept', label: 'New Product Concepts', desc: 'Novel patent-ready product architectures from scratch' },
    { id: 'process-optimization', label: 'Process Optimization', desc: 'Slashing cycle time, tool wear, and scrap percentage' }
  ];

  const handleGenerate = async (e?: React.FormEvent, customForm?: IdeaGenerationInput) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const inputToUse = customForm || form;
      const result: GenerationResult<GeneratedIdea[]> = await aiService.generateIdeas(inputToUse);
      setIdeas(result.data);
      setGenerationMeta({
        source: result.source,
        isDemo: result.isDemo
      });
    } catch (err) {
      console.error('Error generating ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompare = (idea: GeneratedIdea) => {
    if (compareList.some(item => item.id === idea.id)) {
      setCompareList(compareList.filter(item => item.id !== idea.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 concepts at a time.');
        return;
      }
      setCompareList([...compareList, idea]);
    }
  };

  const starterPresets = [
    {
      name: '🌱 Agro-Waste Planter',
      desc: 'Eco biomaterials & compression molding',
      data: {
        industry: 'Eco-Friendly Agriculture & Home Goods',
        problem: 'Single-use plastic nursery pot waste and unutilized rice husk farm residues.',
        budget: '$1,000 - $5,000 Pilot',
        materials: 'Rice husks, sugarcane bagasse, potato starch binder, natural wax',
        scale: 'small-batch' as const,
        objective: 'reduce-waste' as const,
        mode: 'waste-to-value' as const
      }
    },
    {
      name: '⚡ Precision Enclosure',
      desc: 'Sheet metal CNC punch & press brake',
      data: {
        industry: 'Consumer Electronics & Lab Equipment',
        problem: 'High electromagnetic interference (EMI) and costly tooling for low-volume metal enclosures.',
        budget: '$3,000 - $10,000 Batch',
        materials: '5052-H32 Aluminum sheet, extruded heatsink, captive M3 fasteners',
        scale: 'small-batch' as const,
        objective: 'reduce-cost' as const,
        mode: 'low-cost' as const
      }
    },
    {
      name: '🤖 Automated Dispenser',
      desc: 'Precision peristaltic fluid rig',
      data: {
        industry: 'Artisanal Food & Skincare Bottling',
        problem: 'Inconsistent manual bottle filling causing liquid spills and slow takt times.',
        budget: '$800 - $2,500 Machine Rig',
        materials: '304 Stainless chassis, silicone Norprene tubing, NEMA stepper motor',
        scale: 'prototype' as const,
        objective: 'automate-production' as const,
        mode: 'automation' as const
      }
    },
    {
      name: '🚁 Carbon Drone Frame',
      desc: 'Lightweight aerospace composite',
      data: {
        industry: 'Aerospace & Industrial Robotics',
        problem: 'Heavy aluminum frame payload reducing drone battery flight time below 20 minutes.',
        budget: '$2,500 - $8,000 Prototype',
        materials: '3K Twill Carbon Fiber sheet, CNC Ti-6Al-4V motor mounts, nylon standoffs',
        scale: 'small-batch' as const,
        objective: 'new-product' as const,
        mode: 'product-improvement' as const
      }
    },
    {
      name: '🩺 Titanium Bone Plate',
      desc: 'Orthopedic biocompatible implant',
      data: {
        industry: 'Biomedical & Surgical Hardware',
        problem: 'Micro-stress shielding and biocompatibility failure in conventional stainless implants.',
        budget: '$10,000 - $35,000 Pilot',
        materials: 'Grade 5 Titanium (Ti-6Al-4V ELI), medical silicone coating',
        scale: 'prototype' as const,
        objective: 'improve-quality' as const,
        mode: 'process-optimization' as const
      }
    },
    {
      name: '🔋 EV Heat Sink',
      desc: 'Automotive battery thermal cooler',
      data: {
        industry: 'Automotive & CleanTech Storage',
        problem: 'Uneven battery cell heat dissipation causing thermal runaway risks during fast DC charging.',
        budget: '$5,000 - $20,000 Batch',
        materials: '6063-T6 Aluminum extrusion, micro-channel copper heatpipes, thermal paste',
        scale: 'small-batch' as const,
        objective: 'save-energy' as const,
        mode: 'process-optimization' as const
      }
    }
  ];

  const handleApplyPreset = (presetData: IdeaGenerationInput, autoRun = false) => {
    setForm(presetData);
    if (autoRun) {
      handleGenerate(undefined, presetData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Industrial Engineering AI Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Manufacturing Idea Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Formulate engineering solutions across 8 specialized modes. Generate detailed technical proposals with specified alloys/polymers, primary machines, estimated unit costs, cycle times, and direct export to the Manufacturing Planner.
        </p>
      </div>

      {/* Main Grid: Form Left, Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
          {/* Preset Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Project Templates ({starterPresets.length})
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">Instant Setup</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {starterPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset.data, false)}
                  className="text-left p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-750 hover:border-emerald-500/50 transition-all group"
                  title={`${preset.desc} — Click to load template`}
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-emerald-300 truncate">
                    {preset.name}
                  </div>
                  <div className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">
                    {preset.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* 1. Industry / Product Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Manufacturing Industry / Product Category
              </label>
              <input
                type="text"
                value={form.industry}
                onChange={e => setForm({ ...form, industry: e.target.value })}
                placeholder="e.g. CleanTech, Automotive, Medical Devices, Consumer Packaging..."
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* 2. Problem to Solve */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Manufacturing Challenge / Problem to Solve
                </label>
                <button
                  type="button"
                  onClick={handleToggleVoiceProblem}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg border transition-colors ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                  }`}
                  title="Voice dictation (speech-to-text)"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3 h-3 text-rose-400" />
                      <span>Listening...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3 text-emerald-400" />
                      <span>Voice Dictate</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={form.problem}
                onChange={e => setForm({ ...form, problem: e.target.value })}
                rows={3}
                placeholder={isListening ? "Listening to your voice... speak now..." : "Describe the defect, high cost factor, waste material, or performance bottleneck..."}
                required
                className={`w-full px-3 py-2 rounded-xl bg-slate-850 border text-xs text-white placeholder-slate-500 focus:outline-none resize-none transition-colors ${
                  isListening
                    ? 'border-rose-500 ring-2 ring-rose-500/20'
                    : 'border-slate-750 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* 3. Budget & Materials in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Available Budget Tier
                </label>
                <input
                  type="text"
                  value={form.budget}
                  onChange={e => setForm({ ...form, budget: e.target.value })}
                  placeholder="e.g. $500 - $3,000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Materials Available / Desired
                </label>
                <input
                  type="text"
                  value={form.materials}
                  onChange={e => setForm({ ...form, materials: e.target.value })}
                  placeholder="e.g. Aluminum 6061, Recycled PET, Agro-biomass..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 4. Production Scale & Primary Objective */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Desired Production Scale
                </label>
                <select
                  value={form.scale}
                  onChange={e =>
                    setForm({
                      ...form,
                      scale: e.target.value as IdeaGenerationInput['scale']
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="prototype">Rapid Prototype (1 - 10 Units)</option>
                  <option value="small-batch">Small Batch Pilot (50 - 500 Units)</option>
                  <option value="mass-production">Mass Production (10,000+ Units)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Objective
                </label>
                <select
                  value={form.objective}
                  onChange={e =>
                    setForm({
                      ...form,
                      objective: e.target.value as IdeaGenerationInput['objective']
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="reduce-cost">Reduce Manufacturing Cost</option>
                  <option value="reduce-waste">Reduce Waste / Circularity</option>
                  <option value="save-energy">Save Electricity & Energy</option>
                  <option value="improve-quality">Improve Tolerances & Quality</option>
                  <option value="automate-production">Automate Production Line</option>
                  <option value="new-product">Create Completely New Product</option>
                </select>
              </div>
            </div>

            {/* 5. 8 Idea Generation Modes Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Idea Generation Mode ({generationModes.length} Modes)
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {generationModes.map(mode => (
                  <div
                    key={mode.id}
                    onClick={() =>
                      setForm({
                        ...form,
                        mode: mode.id as IdeaGenerationInput['mode']
                      })
                    }
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      form.mode === mode.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{mode.label}</span>
                      {form.mode === mode.id && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {mode.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Engineering Proposals...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Manufacturing Ideas</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Generated Ideas Stream (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Results Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Generated Concepts
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {ideas.length} Ideas
                </span>
              </div>
              {generationMeta && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                  <Info className="w-3 h-3 text-emerald-400" />
                  <span>
                    Generated via: <strong className="text-slate-300">{generationMeta.source}</strong>
                  </span>
                  {generationMeta.isDemo && (
                    <span className="text-amber-400 font-medium">(Heuristic Synthesis Mode)</span>
                  )}
                </div>
              )}
            </div>

            {/* Compare Trigger Button */}
            {compareList.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Selected ({compareList.length})</span>
              </button>
            )}
          </div>

          {/* Empty State */}
          {ideas.length === 0 && !loading && (
            <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Ready to Synthesize Ideas
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Fill in your problem statement on the left, pick an objective, or select one of the Quick Industry Presets, then click <strong>"Generate Manufacturing Ideas"</strong>.
              </p>
              <button
                onClick={() => handleGenerate()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-400 font-semibold text-xs border border-emerald-500/30"
              >
                Run Sample Synthesis Now
              </button>
            </div>
          )}

          {/* Loading State Skeleton */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map(n => (
                <div
                  key={n}
                  className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-3"
                >
                  <div className="h-5 bg-slate-800 rounded w-1/3" />
                  <div className="h-4 bg-slate-800/80 rounded w-3/4" />
                  <div className="h-16 bg-slate-800/50 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Ideas List */}
          {ideas.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onSendToPlanner={onSendToPlanner}
              onSaveIdea={onSaveIdea}
              isSaved={savedIdeaIds.includes(idea.id)}
              isSelectedForCompare={compareList.some(item => item.id === idea.id)}
              onToggleCompare={handleToggleCompare}
            />
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      <IdeaComparisonModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        ideas={compareList}
        onRemoveFromCompare={id =>
          setCompareList(compareList.filter(item => item.id !== id))
        }
        onSendToPlanner={onSendToPlanner}
      />
    </div>
  );
};
