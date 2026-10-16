import React, { useState } from 'react';
import {
  Factory,
  Sparkles,
  BookOpen,
  ClipboardList,
  Search,
  Settings,
  Bookmark,
  Layers,
  Leaf,
  Wrench,
  Menu,
  X,
  Cpu,
  Calculator,
  HelpCircle,
  ShieldCheck,
  Activity,
  Globe
} from 'lucide-react';
import { UserSettings } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  savedCount: number;
  settings: UserSettings;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  onOpenCalculator: () => void;
  onOpenTour: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  savedCount,
  settings,
  onOpenSettings,
  onOpenSearch,
  onOpenCalculator,
  onOpenTour
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Dashboard', icon: Factory },
    { id: 'generator', label: 'AI Idea Generator', icon: Sparkles, badge: 'AI' },
    { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
    { id: 'planner', label: 'Manufacturing Planner', icon: ClipboardList },
    { id: 'dfm', label: 'DFM Analyzer', icon: ShieldCheck, badge: 'New' },
    { id: 'simulator', label: 'Plant OEE', icon: Activity, badge: 'New' },
    { id: 'rfq', label: 'Supplier RFQ', icon: Globe, badge: 'New' },
    { id: 'explorer', label: 'Materials & Machines', icon: Layers },
    { id: 'sustainability', label: 'Sustainability', icon: Leaf },
    { id: 'prototyping', label: 'Prototype Guide', icon: Wrench },
    { id: 'saved', label: 'Saved Projects', icon: Bookmark, count: savedCount }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-700 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Factory className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  ManuGenius
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider hidden sm:block">
                Smart Manufacturing • Smarter Ideas
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors shadow-inner"
              title="Quick Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Quick Search...</span>
              <kbd className="hidden md:inline text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Engineering Calculators Tool */}
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-slate-300 hover:text-white text-xs transition-colors shadow-inner"
              title="Engineering Tools & CNC Calculators"
            >
              <Calculator className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden lg:inline text-[11px] font-medium">Tools</span>
            </button>

            {/* Guided Tour / Help */}
            <button
              onClick={onOpenTour}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs transition-colors"
              title="Platform Tour & How-to-use Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline text-[11px] font-medium">Guide</span>
            </button>

            {/* AI Provider Status Pill */}
            <button
              onClick={onOpenSettings}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-xs transition-colors"
              title="AI & Engine Settings"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-300 font-medium">
                {settings.aiProvider === 'gemini' && settings.geminiApiKey
                  ? 'Gemini Live'
                  : 'Domain AI Engine'}
              </span>
              <Settings className="w-3 h-3 text-slate-400 hover:text-white ml-0.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-950/98 px-4 pt-2 pb-5 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onOpenSettings();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Configure AI & Platform Settings</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
