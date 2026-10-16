import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ChevronDown,
  Mic,
  MicOff,
  PanelRight,
  Wrench,
  Calculator,
  Compass,
  Table,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { ChatMessage, UserSettings } from '../types';
import { aiService } from '../services/aiService';

interface EngineeringCopilotProps {
  settings: UserSettings;
  onNavigateToPlanner: (prompt?: string) => void;
  onNavigateToGenerator: (prompt?: string) => void;
  onNavigateToKnowledge: (topicId?: string) => void;
}

// Preset speeds & feeds workpiece surface speeds (m/min)
const CUTTING_SPEED_PRESETS = [
  { name: 'Aluminum 6061-T6 (Carbide)', vc: 320, fz: 0.08 },
  { name: 'Mild Steel 1018 (Carbide)', vc: 140, fz: 0.06 },
  { name: 'Alloy Steel 4140 (Carbide)', vc: 95, fz: 0.05 },
  { name: 'Stainless 304 (Carbide)', vc: 75, fz: 0.04 },
  { name: 'Brass C360 (Carbide/HSS)', vc: 260, fz: 0.09 },
  { name: 'POM / Delrin Plastic', vc: 450, fz: 0.12 },
  { name: 'Titanium Grade 5 (Carbide)', vc: 45, fz: 0.03 }
];

// ISO Metric Tap Drill Pilot Sizes
const TAP_DRILL_TABLE = [
  { tap: 'M2 × 0.4', pitch: 0.4, drill: 1.6, closeFitHole: 2.4 },
  { tap: 'M3 × 0.5', pitch: 0.5, drill: 2.5, closeFitHole: 3.4 },
  { tap: 'M4 × 0.7', pitch: 0.7, drill: 3.3, closeFitHole: 4.5 },
  { tap: 'M5 × 0.8', pitch: 0.8, drill: 4.2, closeFitHole: 5.5 },
  { tap: 'M6 × 1.0', pitch: 1.0, drill: 5.0, closeFitHole: 6.6 },
  { tap: 'M8 × 1.25', pitch: 1.25, drill: 6.8, closeFitHole: 9.0 },
  { tap: 'M10 × 1.5', pitch: 1.5, drill: 8.5, closeFitHole: 11.0 },
  { tap: 'M12 × 1.75', pitch: 1.75, drill: 10.2, closeFitHole: 13.5 },
  { tap: 'M16 × 2.0', pitch: 2.0, drill: 14.0, closeFitHole: 17.5 },
  { tap: 'M20 × 2.5', pitch: 2.5, drill: 17.5, closeFitHole: 22.0 }
];

// ISO 286 Fits Quick Reference
const FITS_PRESETS: Record<string, { type: string; hole: string; shaft: string; desc: string }> = {
  'H7/g6': { type: 'Clearance', hole: '+0.021 / 0', shaft: '-0.007 / -0.014', desc: 'Precision sliding fit, moves freely without shake.' },
  'H7/h6': { type: 'Clearance', hole: '+0.021 / 0', shaft: '0 / -0.013', desc: 'Locational spigot/dowel fit, zero radial play.' },
  'H7/k6': { type: 'Transition', hole: '+0.021 / 0', shaft: '+0.015 / +0.002', desc: 'Light mallet tap assembly, anti-vibration.' },
  'H7/p6': { type: 'Interference', hole: '+0.021 / 0', shaft: '+0.035 / +0.022', desc: 'Press-fit bronze bushings, permanent joint.' },
  'H8/f7': { type: 'Clearance', hole: '+0.033 / 0', shaft: '-0.016 / -0.034', desc: 'Normal running clearance, grease lubed shafts.' }
};

export const EngineeringCopilot: React.FC<EngineeringCopilotProps> = ({
  settings,
  onNavigateToPlanner,
  onNavigateToGenerator,
  onNavigateToKnowledge
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'tools'>('chat');

  // Chat State
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Shop Tools State
  const [toolSubTab, setToolSubTab] = useState<'speeds' | 'taps' | 'fits' | 'kfactor'>('speeds');
  
  // Speeds & Feeds
  const [selectedSpeedPreset, setSelectedSpeedPreset] = useState<number>(0);
  const [toolDiameterMm, setToolDiameterMm] = useState<number>(10);
  const [fluteCount, setFluteCount] = useState<number>(4);

  // Taps
  const [tapSearchQuery, setTapSearchQuery] = useState('');

  // Fits
  const [selectedFitClass, setSelectedFitClass] = useState<string>('H7/g6');
  const [fitDiameterMm, setFitDiameterMm] = useState<number>(25);

  // K-Factor
  const [sheetThickMm, setSheetThickMm] = useState<number>(2);
  const [bendAngleDeg, setBendAngleDeg] = useState<number>(90);
  const [insideRadiusMm, setInsideRadiusMm] = useState<number>(2);
  const [kFactor, setKFactor] = useState<number>(0.33);

  const handleToggleVoiceInput = () => {
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
          setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `👋 **Engineering Companion Active**
      
I provide instant shop-floor formulas, DFM checklists, and manufacturing advice.
      
* **Quick Reference Tools**: Switch to the **Shop Tools** tab above for instant Speeds & Feeds (RPM/feed rate), Tap Drill charts, ISO 286 Fits, and K-Factor formulas.
* **Side-Docking**: Click the **Dock** icon at top-right to pin this companion to the right screen edge while you design or review blueprints.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab]);

  const quickPrompts = [
    'Recommend an alloy for high-stress aerospace brackets',
    'What are the DFM rules for plastic injection moulding?',
    'How do I calculate scrap loss and material yield?',
    'Explain the difference between 3-axis and 5-axis CNC'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ sender: m.sender, text: m.text }));
      const response = await aiService.chatWithAssistant(text, history);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: response.suggestedAction
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered an error processing your engineering request. Please try again or check your API key in Settings.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Conversation cleared. How can I assist with your manufacturing project today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleActionClick = (action: NonNullable<ChatMessage['suggestedAction']>) => {
    if (action.type === 'plan') {
      onNavigateToPlanner(action.payload);
      setIsOpen(false);
    } else if (action.type === 'generate') {
      onNavigateToGenerator(action.payload);
      setIsOpen(false);
    } else if (action.type === 'knowledge') {
      onNavigateToKnowledge(action.payload);
      setIsOpen(false);
    }
  };

  const isGeminiActive = settings.aiProvider === 'gemini' && !!settings.geminiApiKey;

  // Speeds & Feeds Calculation
  const currentSpeed = CUTTING_SPEED_PRESETS[selectedSpeedPreset];
  const calculatedRpm = Math.round((currentSpeed.vc * 1000) / (Math.PI * Math.max(0.5, toolDiameterMm)));
  const calculatedFeedRate = Math.round(calculatedRpm * fluteCount * currentSpeed.fz);

  // K-Factor Bend Allowance: BA = (pi / 180) * (R + K * T) * Angle
  const calculatedBendAllowanceMm = ((Math.PI / 180) * (insideRadiusMm + kFactor * sheetThickMm) * bendAngleDeg);

  return (
    <>
      {/* Launcher Button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all group"
          title="Open Engineering Companion & Copilot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          <span className="font-extrabold tracking-tight">Engineering Companion</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 text-emerald-300 border border-emerald-400/30 uppercase">
            Tools & AI
          </span>
        </button>
      )}

      {/* Main Companion Container (Docked Sidebar vs Floating Modal) */}
      {isOpen && (
        <div
          className={`z-50 bg-slate-900 border border-slate-750 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isDocked
              ? 'fixed right-0 top-16 bottom-0 w-[420px] max-w-full border-l border-slate-750 shadow-2xl'
              : isExpanded
              ? 'fixed bottom-4 right-4 w-[94vw] sm:w-[680px] h-[85vh] rounded-2xl'
              : 'fixed bottom-4 right-4 w-[94vw] sm:w-[420px] h-[580px] rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-850 border-b border-slate-750 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    Engineering Companion
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Pro
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isGeminiActive ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`}
                  />
                  <span>
                    {activeTab === 'tools'
                      ? 'Shop Floor Calculators'
                      : isGeminiActive
                      ? `Gemini Live (${settings.geminiModel || '2.5-flash'})`
                      : 'Built-in Manufacturing Engine'}
                  </span>
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              {/* Dock to side toggle */}
              <button
                onClick={() => setIsDocked(!isDocked)}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  isDocked
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={isDocked ? 'Undock to floating window' : 'Dock alongside pages'}
              >
                <PanelRight className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">{isDocked ? 'Docked' : 'Dock'}</span>
              </button>

              {!isDocked && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:block p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title={isExpanded ? 'Restore size' : 'Expand window'}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              {activeTab === 'chat' && (
                <button
                  onClick={handleClear}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Minimize Companion"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-Tabs: Copilot Chat vs Shop Floor Quick Tools */}
          <div className="flex border-b border-slate-800 bg-slate-900/90 text-xs font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'text-emerald-400 border-emerald-500 bg-slate-850/50'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Advisory Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'tools'
                  ? 'text-cyan-400 border-cyan-500 bg-slate-850/50'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Shop Reference Tools</span>
            </button>
          </div>

          {/* TAB 1: ADVISORY CHAT */}
          {activeTab === 'chat' && (
            <>
              {/* Quick Starter Prompt Chips */}
              <div className="px-3 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                <span className="text-slate-500 text-[10px] uppercase font-bold shrink-0">
                  Quick:
                </span>
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1 rounded-full bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 shrink-0 transition-colors whitespace-nowrap text-[10px]"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed relative group ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-xs shadow-md'
                          : 'bg-slate-850 border border-slate-750 text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap space-y-1 font-sans">
                        {msg.text}
                      </div>

                      {msg.suggestedAction && (
                        <div className="mt-2.5 pt-2 border-t border-slate-750">
                          <button
                            onClick={() => handleActionClick(msg.suggestedAction!)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/40 transition-colors w-full justify-between"
                          >
                            <span>{msg.suggestedAction.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {msg.sender === 'assistant' && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-white"
                            title="Copy answer"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2.5 items-center text-slate-400">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-850 px-3 py-2 rounded-2xl border border-slate-750 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-slate-400 ml-1">Computing engineering response...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-slate-850 border-t border-slate-750 flex items-center gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={isListening ? "Listening... speak now..." : "Ask an engineering question..."}
                    className={`w-full bg-slate-900 border text-xs text-white placeholder-slate-500 pl-3 pr-9 py-2 rounded-xl focus:outline-none transition-colors ${
                      isListening
                        ? 'border-rose-500 ring-2 ring-rose-500/30'
                        : 'border-slate-750 focus:border-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleToggleVoiceInput}
                    className={`absolute right-2 p-1 rounded-lg transition-colors ${
                      isListening
                        ? 'text-rose-400 bg-rose-500/20 animate-pulse'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={isListening ? 'Stop listening' : 'Voice Input'}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold disabled:opacity-40 transition-colors shrink-0 shadow-sm"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: SHOP FLOOR QUICK TOOLS */}
          {activeTab === 'tools' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Tool Pill Selectors */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold">
                <button
                  onClick={() => setToolSubTab('speeds')}
                  className={`py-1.5 rounded-lg transition-colors ${
                    toolSubTab === 'speeds' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Speeds
                </button>
                <button
                  onClick={() => setToolSubTab('taps')}
                  className={`py-1.5 rounded-lg transition-colors ${
                    toolSubTab === 'taps' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tap Chart
                </button>
                <button
                  onClick={() => setToolSubTab('fits')}
                  className={`py-1.5 rounded-lg transition-colors ${
                    toolSubTab === 'fits' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ISO Fits
                </button>
                <button
                  onClick={() => setToolSubTab('kfactor')}
                  className={`py-1.5 rounded-lg transition-colors ${
                    toolSubTab === 'kfactor' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  K-Factor
                </button>
              </div>

              {/* SUBTOOL 1: SPEEDS & FEEDS */}
              {toolSubTab === 'speeds' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                      Workpiece Material & Surface Speed (Vc)
                    </span>
                    <select
                      value={selectedSpeedPreset}
                      onChange={e => setSelectedSpeedPreset(parseInt(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs font-semibold focus:outline-none"
                    >
                      {CUTTING_SPEED_PRESETS.map((p, idx) => (
                        <option key={idx} value={idx}>
                          {p.name} — Vc = {p.vc} m/min
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                      <label className="text-[10px] text-slate-400 block mb-1">Cutter Dia (mm)</label>
                      <input
                        type="number"
                        value={toolDiameterMm}
                        onChange={e => setToolDiameterMm(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                      <label className="text-[10px] text-slate-400 block mb-1">Flute Count (z)</label>
                      <input
                        type="number"
                        value={fluteCount}
                        onChange={e => setFluteCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Calculated Results */}
                  <div className="p-4 bg-gradient-to-br from-cyan-950/40 to-slate-900 rounded-xl border border-cyan-500/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-semibold">Spindle Speed:</span>
                      <span className="text-lg font-black font-mono text-cyan-300">{calculatedRpm.toLocaleString()} RPM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-semibold">Feed Rate (F):</span>
                      <span className="text-lg font-black font-mono text-emerald-300">{calculatedFeedRate.toLocaleString()} mm/min</span>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      Formula: N = (1000 × Vc) / (π × D) • F = N × z × fz
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTOOL 2: TAP DRILL CHART */}
              {toolSubTab === 'taps' && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tap (e.g. M4, M6)..."
                      value={tapSearchQuery}
                      onChange={e => setTapSearchQuery(e.target.value)}
                      className="w-full bg-slate-850 border border-slate-750 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold">
                        <tr>
                          <th className="p-2">Tap</th>
                          <th className="p-2">Pitch</th>
                          <th className="p-2">Pilot Drill</th>
                          <th className="p-2">Clearance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {TAP_DRILL_TABLE.filter(t => t.tap.toLowerCase().includes(tapSearchQuery.toLowerCase())).map(t => (
                          <tr key={t.tap} className="hover:bg-slate-850/60 transition-colors">
                            <td className="p-2 font-bold text-white">{t.tap}</td>
                            <td className="p-2 font-mono text-slate-400">{t.pitch} mm</td>
                            <td className="p-2 font-mono font-bold text-cyan-300">Ø {t.drill} mm</td>
                            <td className="p-2 font-mono text-slate-300">Ø {t.closeFitHole} mm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTOOL 3: ISO 286 FITS */}
              {toolSubTab === 'fits' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                      Select ISO Fit Class
                    </span>
                    <select
                      value={selectedFitClass}
                      onChange={e => setSelectedFitClass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs font-semibold focus:outline-none"
                    >
                      {Object.keys(FITS_PRESETS).map(key => (
                        <option key={key} value={key}>
                          {key} — {FITS_PRESETS[key].type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Fit Classification:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        FITS_PRESETS[selectedFitClass].type === 'Clearance'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : FITS_PRESETS[selectedFitClass].type === 'Interference'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {FITS_PRESETS[selectedFitClass].type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Hole (H7) Deviation:</span>
                      <span className="font-mono text-cyan-300 font-bold">{FITS_PRESETS[selectedFitClass].hole} mm</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Shaft Deviation:</span>
                      <span className="font-mono text-amber-300 font-bold">{FITS_PRESETS[selectedFitClass].shaft} mm</span>
                    </div>
                    <p className="text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                      {FITS_PRESETS[selectedFitClass].desc}
                    </p>
                  </div>
                </div>
              )}

              {/* SUBTOOL 4: K-FACTOR BEND ALLOWANCE */}
              {toolSubTab === 'kfactor' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-850 rounded-xl border border-slate-750">
                      <label className="text-[10px] text-slate-400 block mb-1">Sheet Thickness (mm)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={sheetThickMm}
                        onChange={e => setSheetThickMm(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="p-2.5 bg-slate-850 rounded-xl border border-slate-750">
                      <label className="text-[10px] text-slate-400 block mb-1">Inside Radius (mm)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={insideRadiusMm}
                        onChange={e => setInsideRadiusMm(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-850 rounded-xl border border-slate-750">
                      <label className="text-[10px] text-slate-400 block mb-1">Bend Angle (°)</label>
                      <input
                        type="number"
                        value={bendAngleDeg}
                        onChange={e => setBendAngleDeg(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="p-2.5 bg-slate-850 rounded-xl border border-slate-750">
                      <label className="text-[10px] text-slate-400 block mb-1">K-Factor (0.33 - 0.50)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={kFactor}
                        onChange={e => setKFactor(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-950/40 to-slate-900 rounded-xl border border-blue-500/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-semibold">Bend Allowance (BA):</span>
                      <span className="text-lg font-black font-mono text-cyan-300">{calculatedBendAllowanceMm.toFixed(2)} mm</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      Neutral axis position: BA = (π / 180) × (R + K × T) × θ
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
