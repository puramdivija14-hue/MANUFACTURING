import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  ClipboardList,
  Bot,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Factory
} from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPage: (page: string) => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPage
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to ManuGenius AI',
      subtitle: 'The Idea-to-Manufacturing Engine for Everyone',
      badge: 'Step 1 of 4',
      icon: Factory,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description:
        'ManuGenius AI helps students, engineers, founders, and small manufacturers go from a rough product idea to a verified factory plan and prototype. It provides 12 process blueprints, 8 AI ideation modes, and an automated bill-of-materials builder.',
      actionText: 'Explore Knowledge Hub',
      targetPage: 'knowledge'
    },
    {
      title: 'AI Idea Generator (8 Specialized Modes)',
      subtitle: 'From Low-Cost to Circular Waste-to-Value',
      badge: 'Step 2 of 4',
      icon: Sparkles,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      description:
        'Have a manufacturing problem? Enter your industry, budget, and materials. ManuGenius formulates 3 tailored technical proposals with specified alloys, primary machines, estimated unit costs, cycle times, and a side-by-side comparison matrix.',
      actionText: 'Try AI Idea Generator',
      targetPage: 'generator'
    },
    {
      title: 'Manufacturing & BOM Planner',
      subtitle: 'Structured Factory Blueprints & Printable Reports',
      badge: 'Step 3 of 4',
      icon: ClipboardList,
      iconColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      description:
        'Convert any idea into a real factory plan. Customize your Bill of Materials (BOM) with live automatic cost calculation, edit machine operations and cycle times, review OSHA safety protocols, and export a clean printable PDF report with one click.',
      actionText: 'Open Production Planner',
      targetPage: 'planner'
    },
    {
      title: 'Copilot AI Assistant & Engineering Tools',
      subtitle: 'Instant Answers, Unit Conversions, Speeds & Feeds',
      badge: 'Step 4 of 4',
      icon: Bot,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description:
        'Need quick guidance? The floating Copilot AI answers workshop questions 24/7 (with optional voice speech-to-text). Use the built-in engineering calculators to compute CNC speeds, feeds, and cycle times anytime.',
      actionText: 'Start Exploring Now',
      targetPage: 'home'
    }
  ];

  const active = steps[currentStep];
  const Icon = active.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAction = () => {
    onNavigateToPage(active.targetPage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {active.badge}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-5 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${active.iconColor}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                {active.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {active.subtitle}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-850">
            {active.description}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx
                    ? 'w-7 bg-emerald-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAction}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs border border-slate-700"
            >
              {active.actionText}
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20"
            >
              <span>{currentStep === steps.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
