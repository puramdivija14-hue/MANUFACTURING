import React from 'react';
import { Factory, ShieldCheck, AlertTriangle, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="no-print bg-slate-950 border-t border-slate-900 text-slate-400 mt-auto">
      {/* Engineering Responsible Use Alert Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-200">
              Responsible Engineering Notice:
            </span>
            <span className="text-slate-400">
              All generated cycle times, machine specs, and BOM costs are preliminary design estimates. Professional engineering review and supplier validation are required before production.
            </span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 shrink-0 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Educational & Prototyping Platform</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Factory className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">ManuGenius AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students, startup founders, and engineers to turn ideas into manufacturing knowledge, practical production plans, and validated prototypes.
            </p>
            <div className="text-[11px] text-slate-500">
              Built with Antigravity • Modern Industrial Tech Stack
            </div>
          </div>

          {/* Core Platform Modules */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('generator')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  AI Idea Generator (8 Modes)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('knowledge')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Manufacturing Knowledge Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Production & BOM Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explorer')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Material & Machine Explorer
                </button>
              </li>
            </ul>
          </div>

          {/* Engineering Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Specialized Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('sustainability')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Sustainability & Scrap Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('prototyping')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Prototype Development Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('saved')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Saved Projects & Exports
                </button>
              </li>
              <li>
                <span className="text-slate-500">
                  ISO 9001 / OSHA 1910 Guidelines
                </span>
              </li>
            </ul>
          </div>

          {/* Reference Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Technical Standards
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>• ASME Y14.5 Geometric Dimensioning & Tolerancing (GD&T)</p>
              <p>• ISO/ASTM 52900 Additive Manufacturing</p>
              <p>• AWS D1.1 Structural Welding Standards</p>
              <p>• Six Sigma Statistical Quality Control</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ManuGenius AI. All rights reserved. Industrial Engineering Prototyping Platform.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered for Hackathons & Manufacturing Innovation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
