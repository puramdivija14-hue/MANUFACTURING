import React, { useState } from 'react';
import {
  X,
  Cpu,
  Key,
  Download,
  Upload,
  RotateCcw,
  Check,
  Shield,
  AlertCircle,
  ExternalLink,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { UserSettings } from '../types';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onDataReset
}) => {
  const [formData, setFormData] = useState<UserSettings>({
    ...settings,
    geminiModel: settings.geminiModel || 'gemini-2.5-flash',
    temperature: typeof settings.temperature === 'number' ? settings.temperature : 0.7
  });
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Live API Key testing state
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestApiKey = async () => {
    if (!formData.geminiApiKey.trim()) {
      setTestResult({ valid: false, message: 'Please enter a Gemini API key first.' });
      return;
    }
    setTestingKey(true);
    setTestResult(null);
    try {
      const res = await aiService.validateGeminiApiKey(
        formData.geminiApiKey,
        formData.geminiModel || 'gemini-2.5-flash'
      );
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ valid: false, message: e.message || 'Connection test failed.' });
    } finally {
      setTestingKey(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleExport = () => {
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manugenius_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = storageService.importData(content);
      if (success) {
        setImportStatus('Data imported successfully! Refreshing...');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setImportStatus('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all saved projects and settings to default factory demo state?')) {
      storageService.resetToDefault();
      onDataReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div
        className="w-full max-w-xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Platform & AI Configuration</h3>
              <p className="text-xs text-slate-400">Settings, model selection & live key test</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* AI Provider Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              AI Generation Engine
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setFormData({ ...formData, aiProvider: 'built-in' })}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.aiProvider === 'built-in'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${formData.aiProvider === 'built-in' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span className="text-xs font-bold">Built-in Domain Engine</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Instant offline synthesis with 50+ industrial heuristics. No API key required.
                </p>
              </div>

              <div
                onClick={() => setFormData({ ...formData, aiProvider: 'gemini' })}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.aiProvider === 'gemini'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${formData.aiProvider === 'gemini' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span className="text-xs font-bold">Google Gemini API</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Connect live Gemini 2.5 Flash for customized dynamic reasoning & copilot chat.
                </p>
              </div>
            </div>
          </div>

          {/* Gemini API Key & Advanced Configuration */}
          {formData.aiProvider === 'gemini' && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  Gemini API Configuration
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* API Key Input */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={formData.geminiApiKey}
                    onChange={e => {
                      setFormData({ ...formData, geminiApiKey: e.target.value });
                      setTestResult(null);
                    }}
                    placeholder="Paste your Gemini API key (AIzaSy...)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800"
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Model Selector & Live Test Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Gemini Model
                  </label>
                  <select
                    value={formData.geminiModel || 'gemini-2.5-flash'}
                    onChange={e => {
                      setFormData({ ...formData, geminiModel: e.target.value });
                      setTestResult(null);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={handleTestApiKey}
                    disabled={testingKey || !formData.geminiApiKey}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 disabled:opacity-40 transition-colors"
                  >
                    {testingKey ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        <span>Verifying Key...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Test API Key Connection</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Temperature (Precision vs Creativity):</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {formData.temperature || 0.7}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.1"
                  value={formData.temperature || 0.7}
                  onChange={e => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>0.2 (Rigid Engineering)</span>
                  <span>1.0 (Creative Ideation)</span>
                </div>
              </div>

              {/* Test Result Message Banner */}
              {testResult && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
                    testResult.valid
                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-950/30 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {testResult.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{testResult.message}</span>
                </div>
              )}

              <div className="flex items-start gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Stored strictly in your local browser storage. If Gemini API reaches quota or encounters a network issue, ManuGenius AI automatically falls back to its offline domain engine seamlessly.
                </span>
              </div>
            </div>
          )}

          {/* Currency Preference */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Default Currency Display
            </label>
            <select
              value={formData.currency}
              onChange={e => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
              <option value="GBP (£)">GBP (£) - British Pound</option>
              <option value="INR (₹)">INR (₹) - Indian Rupee</option>
              <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
              <option value="AUD ($)">AUD ($) - Australian Dollar</option>
            </select>
          </div>

          {/* Backup & Data Actions */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
              Data Backup & Project Persistence
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs text-slate-300 border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Data (JSON)</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs text-slate-300 border border-slate-700 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-xs text-red-300 border border-red-800/60 ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
            {importStatus && (
              <p className="text-xs text-emerald-400 mt-2 font-medium">
                {importStatus}
              </p>
            )}
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
