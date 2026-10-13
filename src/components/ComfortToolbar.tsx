import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Type,
  ZoomIn,
  ZoomOut,
  Keyboard,
  HelpCircle,
  Calculator,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { speechService } from '../services/speechService';

interface ComfortToolbarProps {
  onOpenCalculator: () => void;
  onOpenTour: () => void;
  onOpenShortcuts: () => void;
  fontSizeLevel: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (level: 'normal' | 'large' | 'xlarge') => void;
}

export const ComfortToolbar: React.FC<ComfortToolbarProps> = ({
  onOpenCalculator,
  onOpenTour,
  onOpenShortcuts,
  fontSizeLevel,
  onChangeFontSize
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = speechService.subscribe(speaking => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  const handleStopAudio = () => {
    speechService.stop();
  };

  return (
    <aside
      aria-label="Accessibility and quick tools toolbar"
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 select-none"
    >
      {/* Active Audio Narration Notification Bar */}
      {isSpeaking && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-500/30 animate-pulse border border-emerald-400"
        >
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-3 bg-slate-950 rounded-full animate-bounce" />
            <span
              className="w-1.5 h-4 bg-slate-950 rounded-full animate-bounce"
              style={{ animationDelay: '0.15s' }}
            />
            <span
              className="w-1.5 h-2 bg-slate-950 rounded-full animate-bounce"
              style={{ animationDelay: '0.3s' }}
            />
          </div>
          <span>Reading Aloud</span>
          <button
            onClick={handleStopAudio}
            className="ml-1 p-1 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950"
            title="Stop voice reading (Esc)"
            aria-label="Stop reading aloud"
          >
            <VolumeX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Comfort Capsule */}
      <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-750/90 rounded-full shadow-2xl p-1 text-slate-300">
        {/* Toggle Expand / Font Size Quick Control */}
        <div className="flex items-center">
          <button
            onClick={() => {
              if (fontSizeLevel === 'normal') onChangeFontSize('large');
              else if (fontSizeLevel === 'large') onChangeFontSize('xlarge');
              else onChangeFontSize('normal');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            title="Adjust text size for easy reading"
            aria-label="Adjust text size"
          >
            <Type className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-[11px] font-mono">
              {fontSizeLevel === 'normal' ? '100%' : fontSizeLevel === 'large' ? '110%' : '125%'}
            </span>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Quick Tools */}
        <button
          onClick={onOpenCalculator}
          className="p-1.5 rounded-full hover:bg-slate-800 text-teal-400 hover:text-teal-300 transition-colors"
          title="Engineering Calculators (Ctrl+T)"
          aria-label="Open engineering calculators"
        >
          <Calculator className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenTour}
          className="p-1.5 rounded-full hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors"
          title="Guided Walkthrough Tour (Ctrl+G)"
          aria-label="Open guided walkthrough tour"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenShortcuts}
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Keyboard Shortcuts Cheatsheet (Ctrl+/)"
          aria-label="Open keyboard shortcuts cheat sheet"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
