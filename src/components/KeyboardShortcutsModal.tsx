import React from 'react';
import { X, Command, Keyboard, ArrowRight } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Global Navigation & Tools',
      items: [
        { keys: ['Ctrl', 'K'], desc: 'Open Quick Search modal across all topics & materials' },
        { keys: ['Ctrl', 'T'], desc: 'Open Engineering Tools & Speeds/Feeds Calculator' },
        { keys: ['Ctrl', 'G'], desc: 'Open Interactive Guided Tour' },
        { keys: ['Ctrl', '/'], desc: 'Show this Keyboard Shortcuts help cheatsheet' },
        { keys: ['Esc'], desc: 'Close open modal, drawer, or stop voice narration' }
      ]
    },
    {
      category: 'Comfort & Voice Reading',
      items: [
        { keys: ['Space / Click'], desc: 'Toggle Text-to-Speech audio reading on topics & plans' },
        { keys: ['Voice Button'], desc: 'Dictate manufacturing challenges by speaking into your mic' }
      ]
    },
    {
      category: 'Pages & Blueprints',
      items: [
        { keys: ['Ctrl', '1'], desc: 'Jump to Dashboard' },
        { keys: ['Ctrl', '2'], desc: 'Jump to AI Idea Generator' },
        { keys: ['Ctrl', '3'], desc: 'Jump to Knowledge Hub' },
        { keys: ['Ctrl', '4'], desc: 'Jump to Manufacturing Planner' },
        { keys: ['Ctrl', '5'], desc: 'Jump to Materials & Machines Explorer' },
        { keys: ['Ctrl', '6'], desc: 'Jump to Sustainability & Scrap Calculator' },
        { keys: ['Ctrl', '7'], desc: 'Jump to DFM Analyzer & Defect Predictor' },
        { keys: ['Ctrl', '8'], desc: 'Jump to Plant OEE & Shift Simulator' },
        { keys: ['Ctrl', '9'], desc: 'Jump to Supplier RFQ & Sourcing Estimator' },
        { keys: ['Ctrl', '0'], desc: 'Jump to 2D CAD Blueprint & GD&T Studio' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Keyboard Shortcuts & Accessibility
              </h3>
              <p className="text-xs text-slate-400">
                Quick keys designed to make navigation lightning-fast and effortless
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {shortcuts.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {group.category}
              </h4>
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                {group.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="flex items-center justify-between py-1.5 border-b border-slate-850 last:border-0"
                  >
                    <span className="text-xs text-slate-300">{item.desc}</span>
                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono font-bold text-slate-300 border border-slate-700 shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Tip: Press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[10px] text-slate-300">Esc</kbd> anytime to dismiss overlays
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
