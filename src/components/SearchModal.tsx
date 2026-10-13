import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Layers, Cpu, ArrowRight } from 'lucide-react';
import { KNOWLEDGE_TOPICS } from '../data/knowledgeTopics';
import { MATERIALS_DATA } from '../data/materialsData';
import { MACHINES_DATA } from '../data/machinesData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (category: 'knowledge' | 'material' | 'machine', id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchingTopics = cleanQuery
    ? KNOWLEDGE_TOPICS.filter(
        t =>
          t.title.toLowerCase().includes(cleanQuery) ||
          t.definition.toLowerCase().includes(cleanQuery) ||
          t.tagline.toLowerCase().includes(cleanQuery) ||
          t.suitableMaterials.some(m => m.toLowerCase().includes(cleanQuery))
      ).slice(0, 5)
    : [];

  const matchingMaterials = cleanQuery
    ? MATERIALS_DATA.filter(
        m =>
          m.name.toLowerCase().includes(cleanQuery) ||
          m.category.toLowerCase().includes(cleanQuery) ||
          m.applications.some(a => a.toLowerCase().includes(cleanQuery))
      ).slice(0, 4)
    : [];

  const matchingMachines = cleanQuery
    ? MACHINES_DATA.filter(
        m =>
          m.name.toLowerCase().includes(cleanQuery) ||
          m.category.toLowerCase().includes(cleanQuery) ||
          m.compatibleMaterials.some(c => c.toLowerCase().includes(cleanQuery))
      ).slice(0, 4)
    : [];

  const totalResults =
    matchingTopics.length + matchingMaterials.length + matchingMachines.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-850">
          <Search className="w-5 h-5 text-emerald-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search processes (e.g. CNC, 3D printing, sheet metal), materials, or machines..."
            className="w-full py-4 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-xs text-slate-400 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!cleanQuery && (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p className="font-medium text-slate-300 mb-1">
                Search the ManuGenius Engineering Knowledgebase
              </p>
              <p>Type keywords like "aluminum", "injection molding", "titanium", "safety", "tolerance", or "laser"</p>
            </div>
          )}

          {cleanQuery && totalResults === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p className="text-slate-300 font-semibold mb-1">No matching results found for "{query}"</p>
              <p>Try searching for a broader term like "casting", "polymer", "robotics", or "quality".</p>
            </div>
          )}

          {/* Knowledge Topics Results */}
          {matchingTopics.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Manufacturing Knowledge Hub ({matchingTopics.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingTopics.map(topic => (
                  <div
                    key={topic.id}
                    onClick={() => {
                      onSelectResult('knowledge', topic.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300">
                        {topic.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {topic.tagline}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Materials Results */}
          {matchingMaterials.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Materials Explorer ({matchingMaterials.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingMaterials.map(mat => (
                  <div
                    key={mat.id}
                    onClick={() => {
                      onSelectResult('material', mat.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-300">
                          {mat.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {mat.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        Density: {mat.density} • Tensile: {mat.tensileStrength}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Machines Results */}
          {matchingMachines.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>Industrial Machines ({matchingMachines.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingMachines.map(mach => (
                  <div
                    key={mach.id}
                    onClick={() => {
                      onSelectResult('machine', mach.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300">
                          {mach.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {mach.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        Accuracy: {mach.accuracy} • Complexity: {mach.setupComplexity}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
