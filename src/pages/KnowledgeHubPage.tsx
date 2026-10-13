import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Cpu,
  Zap,
  Box,
  Layers,
  Droplet,
  Workflow,
  Bot,
  TrendingUp,
  ShieldAlert,
  Leaf,
  ChevronRight,
  ExternalLink,
  Printer,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { KNOWLEDGE_TOPICS } from '../data/knowledgeTopics';
import { KnowledgeCategory } from '../types';
import { speechService } from '../services/speechService';

interface KnowledgeHubPageProps {
  initialTopicId?: string;
  onNavigateToPlanner: (prompt: string) => void;
  onNavigateToExplorer: (category: string) => void;
}

export const KnowledgeHubPage: React.FC<KnowledgeHubPageProps> = ({
  initialTopicId,
  onNavigateToPlanner,
  onNavigateToExplorer
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || KNOWLEDGE_TOPICS[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isReadingTopic, setIsReadingTopic] = useState(false);

  useEffect(() => {
    const unsub = speechService.subscribe(speaking => {
      if (!speaking) setIsReadingTopic(false);
    });
    return () => unsub();
  }, []);

  // Stop reading if user switches topics
  useEffect(() => {
    if (isReadingTopic) {
      speechService.stop();
      setIsReadingTopic(false);
    }
  }, [selectedTopicId]);

  const activeTopic =
    KNOWLEDGE_TOPICS.find(t => t.id === selectedTopicId) || KNOWLEDGE_TOPICS[0];

  const handleToggleReadTopic = () => {
    if (isReadingTopic) {
      speechService.stop();
      setIsReadingTopic(false);
    } else {
      const speechText = `${activeTopic.title}. ${activeTopic.tagline}. Definition: ${activeTopic.definition}. Working Principle: ${activeTopic.workingPrinciple}. Recommended safety guidelines: ${activeTopic.safetyConsiderations.join('. ')}.`;
      speechService.speak(speechText, {
        onStart: () => setIsReadingTopic(true),
        onEnd: () => setIsReadingTopic(false),
        onError: () => setIsReadingTopic(false)
      });
    }
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return Flame;
      case 'Cpu':
        return Cpu;
      case 'Zap':
        return Zap;
      case 'Box':
        return Box;
      case 'Layers':
        return Layers;
      case 'Droplet':
        return Droplet;
      case 'Workflow':
        return Workflow;
      case 'Bot':
        return Bot;
      case 'TrendingUp':
        return TrendingUp;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Leaf':
        return Leaf;
      default:
        return CheckCircle2;
    }
  };

  const filteredTopics = KNOWLEDGE_TOPICS.filter(
    t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ActiveIcon = getTopicIcon(activeTopic.iconName);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Industrial Engineering Curriculum & Standards</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Manufacturing Knowledge Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Understand working principles, machine setups, suitable materials, GD&T quality verification, and OSHA safety considerations across 12 core production domains.
          </p>
        </div>

        {/* Quick Search */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter 12 processes..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Main Layout: Sidebar navigation left, Detailed topic article right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar List of Topics (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-3 space-y-1.5 max-h-[82vh] overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Process Blueprints</span>
            <span className="font-mono text-slate-500">{filteredTopics.length} Categories</span>
          </div>

          {filteredTopics.map(topic => {
            const Icon = getTopicIcon(topic.iconName);
            const isSelected = topic.id === activeTopic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 text-white border border-blue-500/50 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-850 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">
                      {topic.title}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {topic.tagline}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'text-blue-400 translate-x-0.5' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Article Container (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-8 shadow-xl">
          {/* Article Header */}
          <div className="border-b border-slate-800 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Technical Guide & Process Standard
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleReadTopic}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    isReadingTopic
                      ? 'bg-blue-500 text-white border-blue-400 animate-pulse font-bold'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                  }`}
                  title={isReadingTopic ? 'Stop Voice Narration' : 'Listen to this Process Blueprint Aloud'}
                >
                  {isReadingTopic ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span>{isReadingTopic ? 'Stop Audio' : 'Read Aloud'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs border border-slate-700"
                  title="Print topic cheatsheet"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Print Cheatsheet</span>
                </button>

                <button
                  onClick={() =>
                    onNavigateToPlanner(`I want to build a project using ${activeTopic.title}`)
                  }
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan with This Process</span>
                </button>
              </div>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeTopic.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              {activeTopic.tagline}
            </p>
          </div>

          {/* Definition & Working Principle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Definition
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeTopic.definition}
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Working Principle
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeTopic.workingPrinciple}
              </p>
            </div>
          </div>

          {/* Process Workflow Steps */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-emerald-400" />
              Standard Process Flow & Operations Sequence
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeTopic.processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-850 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px] font-mono border border-slate-700">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment & Suitable Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                Common Equipment & Machinery
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeTopic.equipment.map((eq, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suitable Materials */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Suitable & Compatible Materials
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeTopic.suitableMaterials.map((mat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">•</span>
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
              {activeTopic.incompatibleMaterials.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-850 text-[11px] text-slate-400">
                  <span className="text-rose-400 font-semibold block mb-0.5">Incompatible:</span>
                  <span>{activeTopic.incompatibleMaterials.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Applications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Common Industrial Applications
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeTopic.applications.map((app, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs border border-slate-700 font-medium"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          {/* Advantages vs Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Key Engineering Advantages
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeTopic.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Engineering Limitations & Challenges
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {activeTopic.limitations.map((lim, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Safety Considerations */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Essential Industrial Safety & OSHA Controls
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {activeTopic.safetyConsiderations.map((safe, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{safe}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Real World Case Study */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-900/50">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2 inline-block">
              Real-World Industry Case
            </span>
            <h4 className="text-sm sm:text-base font-bold text-white mb-1">
              {activeTopic.realWorldExample.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              {activeTopic.realWorldExample.description}
            </p>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <span>Impact: {activeTopic.realWorldExample.impact}</span>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start gap-3">
            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 text-[10px] uppercase shrink-0">
              Engineer's Pro Tip
            </span>
            <p className="text-slate-300 italic leading-relaxed">
              "{activeTopic.proTip}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
