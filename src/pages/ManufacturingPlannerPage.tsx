import React, { useState, useEffect, useRef } from 'react';
import {
  ClipboardList,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Printer,
  Download,
  Upload,
  FileSpreadsheet,
  GitBranch,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldAlert,
  Leaf,
  Layers,
  Cpu,
  Check,
  RotateCcw,
  Info,
  Volume2,
  VolumeX,
  ArrowRight,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ManufacturingPlan,
  BOMItem,
  OperationStep,
  MachineRequirement,
  QualityCheck,
  SafetyRequirement,
  PrototypeTest,
  CostSummary,
  TimelineMilestone
} from '../types';
import { SAMPLE_PLANS } from '../data/sampleProjects';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';

interface ManufacturingPlannerPageProps {
  initialPlan?: ManufacturingPlan | null;
  onPlanSaved?: (plan: ManufacturingPlan) => void;
}

export const ManufacturingPlannerPage: React.FC<ManufacturingPlannerPageProps> = ({
  initialPlan,
  onPlanSaved
}) => {
  const [plansList, setPlansList] = useState<ManufacturingPlan[]>([]);
  const [activePlan, setActivePlan] = useState<ManufacturingPlan>(
    initialPlan || SAMPLE_PLANS[0]
  );
  const [savedStatus, setSavedStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'bom' | 'flow' | 'flowchart' | 'timeline' | 'machines' | 'quality' | 'safety' | 'waste' | 'testing' | 'costs'
  >('bom');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newMilestonePhase, setNewMilestonePhase] = useState('');
  const [newMilestoneDuration, setNewMilestoneDuration] = useState('');
  const [newMilestoneDeliverable, setNewMilestoneDeliverable] = useState('');
  const [newWasteItem, setNewWasteItem] = useState('');

  // Input for quick AI plan generator from prompt
  const [promptInput, setPromptInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [isReadingPlan, setIsReadingPlan] = useState(false);


  useEffect(() => {
    const unsub = speechService.subscribe(speaking => {
      if (!speaking) setIsReadingPlan(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isReadingPlan) {
      speechService.stop();
      setIsReadingPlan(false);
    }
  }, [activePlan.id]);

  const handleToggleReadPlan = () => {
    if (isReadingPlan) {
      speechService.stop();
      setIsReadingPlan(false);
    } else {
      const ops = activePlan.processFlow.map((s, i) => `Step ${i + 1}: ${s.name}, cycle time ${s.cycleTime}`).join('. ');
      const safety = activePlan.safetyRequirements.map(s => `${s.hazard}: ${s.protocol}`).join('. ');
      const speechText = `Manufacturing Production Plan for ${activePlan.title}. Target volume is ${activePlan.targetVolume}. Lead time is ${activePlan.leadTime}. Product Overview: ${activePlan.productOverview}. Production Operations: ${ops}. Safety and compliance protocols: ${safety}.`;
      speechService.speak(speechText, {
        onStart: () => setIsReadingPlan(true),
        onEnd: () => setIsReadingPlan(false),
        onError: () => setIsReadingPlan(false)
      });
    }
  };

  useEffect(() => {
    const saved = storageService.getSavedPlans();
    setPlansList(saved);
    if (initialPlan) {
      setActivePlan(initialPlan);
    } else if (saved.length > 0) {
      setActivePlan(saved[0]);
    }
  }, [initialPlan]);

  const handleSelectPlan = (plan: ManufacturingPlan) => {
    setActivePlan(plan);
  };

  const handleSavePlan = () => {
    storageService.savePlan(activePlan);
    const updated = storageService.getSavedPlans();
    setPlansList(updated);
    setSavedStatus(true);
    if (onPlanSaved) onPlanSaved(activePlan);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleGeneratePlanFromPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setGenerating(true);
    try {
      const res = await aiService.generatePlan({
        title: promptInput.trim(),
        proposedSolution: `Engineered manufacturing roadmap for ${promptInput}`,
        materials: ['Primary Engineering Alloy/Polymer', 'Standard Hardware Fasteners'],
        manufacturingMethod: 'Automated Precision Fabrication'
      });
      setActivePlan(res.data);
      storageService.savePlan(res.data);
      setPlansList(storageService.getSavedPlans());
      setPromptInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Helper to parse cycle times into seconds for line bottleneck analysis
  const parseCycleTimeSeconds = (timeStr: string): number => {
    if (!timeStr) return 60;
    const lower = timeStr.toLowerCase();
    const num = parseFloat(lower.replace(/[^0-9.]/g, '')) || 1;
    if (lower.includes('hr') || lower.includes('hour')) return num * 3600;
    if (lower.includes('min')) return num * 60;
    if (lower.includes('sec') || lower.includes('s')) return num;
    return num * 60;
  };

  const bottleneckStep = activePlan.processFlow.length > 0
    ? activePlan.processFlow.reduce((max, step) => {
        const sec = parseCycleTimeSeconds(step.cycleTime);
        const maxSec = parseCycleTimeSeconds(max.cycleTime);
        return sec > maxSec ? step : max;
      }, activePlan.processFlow[0])
    : null;

  const bottleneckSec = bottleneckStep ? parseCycleTimeSeconds(bottleneckStep.cycleTime) : 60;
  const factoryMaxThroughputPerHour = Math.round(3600 / Math.max(1, bottleneckSec));

  // Export JSON Blueprint
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activePlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activePlan.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_blueprint.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export BOM to CSV
  const handleExportBOMCSV = () => {
    const headers = ['Item', 'Material', 'Quantity', 'Unit', 'Unit Cost ($)', 'Subtotal ($)', 'Supplier Category', 'Notes'];
    const rows = activePlan.bom.map(b => [
      `"${b.item.replace(/"/g, '""')}"`,
      `"${b.material.replace(/"/g, '""')}"`,
      b.quantity,
      `"${b.unit.replace(/"/g, '""')}"`,
      b.unitCost.toFixed(2),
      ((Number(b.quantity) || 0) * (Number(b.unitCost) || 0)).toFixed(2),
      `"${b.supplierCategory.replace(/"/g, '""')}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `${activePlan.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_BOM.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Blueprint
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.title && parsed.bom && parsed.processFlow) {
          if (!parsed.id) parsed.id = `imported-${Date.now()}`;
          setActivePlan(parsed);
          storageService.savePlan(parsed);
          setPlansList(storageService.getSavedPlans());
          if (onPlanSaved) onPlanSaved(parsed);
          alert(`Successfully loaded blueprint "${parsed.title}"!`);
        } else {
          alert('Invalid blueprint format. Please ensure the JSON contains BOM and process flow.');
        }
      } catch (err) {
        alert('Error parsing JSON blueprint file.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  // Milestone Handlers
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestonePhase.trim()) return;
    const newM: TimelineMilestone = {
      phase: newMilestonePhase.trim(),
      duration: newMilestoneDuration.trim() || '2 Weeks',
      deliverable: newMilestoneDeliverable.trim() || 'Phase Complete Sign-off'
    };
    setActivePlan({
      ...activePlan,
      timeline: [...activePlan.timeline, newM]
    });
    setNewMilestonePhase('');
    setNewMilestoneDuration('');
    setNewMilestoneDeliverable('');
  };

  const handleDeleteMilestone = (index: number) => {
    setActivePlan({
      ...activePlan,
      timeline: activePlan.timeline.filter((_, i) => i !== index)
    });
  };

  // Waste Reduction Strategy Handlers
  const handleAddWasteStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWasteItem.trim()) return;
    setActivePlan({
      ...activePlan,
      wasteManagement: [...(activePlan.wasteManagement || []), newWasteItem.trim()]
    });
    setNewWasteItem('');
  };

  const handleDeleteWasteStrategy = (index: number) => {
    setActivePlan({
      ...activePlan,
      wasteManagement: (activePlan.wasteManagement || []).filter((_, i) => i !== index)
    });
  };

  // BOM Handlers

  const handleAddBOMItem = () => {
    const newItem: BOMItem = {
      id: `bom-${Date.now()}`,
      item: 'New Component Part',
      material: 'Specified Material',
      quantity: 1,
      unit: 'pcs',
      unitCost: 1.00,
      supplierCategory: 'Standard Supplier',
      notes: 'Dimensional check required'
    };
    setActivePlan({
      ...activePlan,
      bom: [...activePlan.bom, newItem]
    });
  };

  const handleUpdateBOMItem = (id: string, field: keyof BOMItem, value: any) => {
    const updatedBOM = activePlan.bom.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setActivePlan({ ...activePlan, bom: updatedBOM });
  };

  const handleDeleteBOMItem = (id: string) => {
    setActivePlan({
      ...activePlan,
      bom: activePlan.bom.filter(item => item.id !== id)
    });
  };

  // Process Operations Handlers
  const handleAddStep = () => {
    const nextStepNum = activePlan.processFlow.length + 1;
    const newStep: OperationStep = {
      id: `step-${Date.now()}`,
      stepNumber: nextStepNum,
      name: `Operation ${nextStepNum}: Machining / Assembly`,
      machineOrTool: 'Industrial Workstation',
      cycleTime: '2 min',
      parameters: 'Standard feed & speed rate',
      safetyNotes: 'Wear PPE glasses',
      qualityCheck: 'Visual and caliper verification'
    };
    setActivePlan({
      ...activePlan,
      processFlow: [...activePlan.processFlow, newStep]
    });
  };

  const handleUpdateStep = (id: string, field: keyof OperationStep, value: any) => {
    const updated = activePlan.processFlow.map(step =>
      step.id === id ? { ...step, [field]: value } : step
    );
    setActivePlan({ ...activePlan, processFlow: updated });
  };

  const handleDeleteStep = (id: string) => {
    const remaining = activePlan.processFlow
      .filter(step => step.id !== id)
      .map((step, idx) => ({ ...step, stepNumber: idx + 1 }));
    setActivePlan({ ...activePlan, processFlow: remaining });
  };

  // Prototype Test status toggle
  const handleToggleTestStatus = (id: string) => {
    const updated = activePlan.prototypeTesting.map(t => {
      if (t.id === id) {
        const nextStatus: PrototypeTest['status'] =
          t.status === 'passed' ? 'failed' : t.status === 'failed' ? 'pending' : 'passed';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setActivePlan({ ...activePlan, prototypeTesting: updated });
  };

  // Calculate live BOM total
  const bomTotal = activePlan.bom.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitCost) || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Print Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold mb-3">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>DFM Engineering Production Blueprint</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Manufacturing Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Generate and edit a complete production workflow: BOM costs, machine selection, step-by-step cycle times, OSHA safety rules, and printable reports.
          </p>
        </div>

        {/* Global Plan Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={handleToggleReadPlan}
            className={`no-print flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              isReadingPlan
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title={isReadingPlan ? 'Stop Voice Narration' : 'Listen to this Production Plan Aloud'}
          >
            {isReadingPlan ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{isReadingPlan ? 'Stop Audio' : 'Read Aloud'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            title="Export clean printable PDF engineering report"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Print Report</span>
          </button>

          <button
            onClick={handleExportBOMCSV}
            className="no-print flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            title="Export Bill of Materials as CSV spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="no-print flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            title="Export full plan as JSON blueprint"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="no-print flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            title="Import an existing plan JSON file"
          >
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Import</span>
          </button>

          <button
            onClick={handleSavePlan}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            {savedStatus ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Plan Switcher & Quick Generator Bar */}
      <div className="no-print bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Active Plan Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">
              Active Plan:
            </span>
            <select
              value={activePlan.id}
              onChange={e => {
                const found = plansList.find(p => p.id === e.target.value);
                if (found) handleSelectPlan(found);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-teal-500 max-w-md truncate"
            >
              {plansList.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick AI Plan Generator Form */}
          <form
            onSubmit={handleGeneratePlanFromPrompt}
            className="flex items-center gap-2 flex-1 max-w-xl"
          >
            <input
              type="text"
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              placeholder="Or type a new product (e.g. 'Desktop CNC Mill Casing')..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={generating || !promptInput.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{generating ? 'Planning...' : 'Generate New'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Printable Engineering Header (Shows in print mode) */}
      <div className="print-only hidden p-6 border-b-2 border-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">ManuGenius AI</h1>
            <p className="text-xs text-slate-600">Industrial Production Specification & Process Blueprint</p>
          </div>
          <div className="text-right text-xs text-slate-600 font-mono">
            <div>Document Ref: {activePlan.id}</div>
            <div>Date Generated: {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Overview & Specs Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl print-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 inline-block mb-1.5">
              Production Specification
            </span>
            <input
              type="text"
              value={activePlan.title}
              onChange={e => setActivePlan({ ...activePlan, title: e.target.value })}
              className="text-lg sm:text-2xl font-extrabold text-white bg-transparent w-full focus:outline-none focus:border-b border-teal-500 pb-0.5"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Preliminary Engineering Draft
            </span>
          </div>
        </div>

        {/* Product Overview Textarea */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Product Overview & Engineering Requirements
          </label>
          <textarea
            value={activePlan.productOverview}
            onChange={e =>
              setActivePlan({ ...activePlan, productOverview: e.target.value })
            }
            rows={2}
            className="w-full p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 resize-none leading-relaxed"
          />
        </div>

        {/* Target Volume, Tolerances, Lead Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-850">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Target Run Volume:</span>
            <input
              type="text"
              value={activePlan.targetVolume}
              onChange={e =>
                setActivePlan({ ...activePlan, targetVolume: e.target.value })
              }
              className="text-xs font-bold text-white bg-transparent w-full focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-850">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Tolerances (GD&T):</span>
            <input
              type="text"
              value={activePlan.tolerances}
              onChange={e =>
                setActivePlan({ ...activePlan, tolerances: e.target.value })
              }
              className="text-xs font-bold text-white bg-transparent w-full focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-850">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Estimated Lead Time:</span>
            <input
              type="text"
              value={activePlan.leadTime}
              onChange={e =>
                setActivePlan({ ...activePlan, leadTime: e.target.value })
              }
              className="text-xs font-bold text-white bg-transparent w-full focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="no-print flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'bom', label: `Bill of Materials (${activePlan.bom.length})`, icon: Layers },
          { id: 'flow', label: `Operations Table (${activePlan.processFlow.length})`, icon: Clock },
          { id: 'flowchart', label: 'Factory Flow Visualizer', icon: GitBranch, badge: 'Pipeline' },
          { id: 'timeline', label: `Gantt Schedule (${activePlan.timeline.length})`, icon: Calendar },
          { id: 'machines', label: `Machines & Tooling (${activePlan.machines.length})`, icon: Cpu },
          { id: 'quality', label: `Quality Checkpoints (${activePlan.qualityCheckpoints.length})`, icon: CheckCircle2 },
          { id: 'safety', label: `Safety & OSHA (${activePlan.safetyRequirements.length})`, icon: ShieldAlert },
          { id: 'waste', label: `Waste & Circular (${(activePlan.wasteManagement || []).length})`, icon: Leaf },
          { id: 'testing', label: `Prototype Tests (${activePlan.prototypeTesting.length})`, icon: ClipboardList },
          { id: 'costs', label: 'Budget & Cost Breakdown', icon: DollarSign }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'bg-slate-900 text-teal-400 border-teal-500 shadow-sm'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 uppercase">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Bill of Materials (BOM) */}
      {activeTab === 'bom' && (
        <div className={`space-y-4 ${activeTab !== 'bom' ? 'print-only' : ''}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Bill of Materials (BOM)</span>
            </h3>
            <button
              onClick={handleAddBOMItem}
              className="no-print flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 text-xs font-semibold border border-teal-500/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Component</span>
            </button>
          </div>

          <div className="overflow-x-auto bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 text-slate-300 font-semibold border-b border-slate-750">
                <tr>
                  <th className="p-3">Component / Item</th>
                  <th className="p-3">Material Grade</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Unit Cost ($)</th>
                  <th className="p-3">Total ($)</th>
                  <th className="p-3">Supplier Category</th>
                  <th className="p-3 no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {activePlan.bom.map(item => (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.item}
                        onChange={e => handleUpdateBOMItem(item.id, 'item', e.target.value)}
                        className="bg-transparent w-full font-medium focus:outline-none"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.material}
                        onChange={e => handleUpdateBOMItem(item.id, 'material', e.target.value)}
                        className="bg-transparent w-full text-slate-400 focus:outline-none"
                      />
                    </td>
                    <td className="p-3 w-16">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e =>
                          handleUpdateBOMItem(item.id, 'quantity', Number(e.target.value))
                        }
                        className="bg-transparent w-full font-mono focus:outline-none"
                      />
                    </td>
                    <td className="p-3 w-16">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={e => handleUpdateBOMItem(item.id, 'unit', e.target.value)}
                        className="bg-transparent w-full text-slate-400 focus:outline-none"
                      />
                    </td>
                    <td className="p-3 w-24">
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitCost}
                        onChange={e =>
                          handleUpdateBOMItem(item.id, 'unitCost', Number(e.target.value))
                        }
                        className="bg-transparent w-full font-mono text-emerald-400 focus:outline-none"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-white">
                      ${((Number(item.quantity) || 0) * (Number(item.unitCost) || 0)).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.supplierCategory}
                        onChange={e =>
                          handleUpdateBOMItem(item.id, 'supplierCategory', e.target.value)
                        }
                        className="bg-transparent w-full text-slate-400 text-[11px] focus:outline-none"
                      />
                    </td>
                    <td className="p-3 no-print">
                      <button
                        onClick={() => handleDeleteBOMItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900 border-t border-slate-750 font-bold">
                <tr>
                  <td colSpan={5} className="p-3 text-right uppercase tracking-wider text-slate-400">
                    Calculated BOM Batch Total:
                  </td>
                  <td colSpan={3} className="p-3 text-emerald-400 font-mono text-sm">
                    ${bomTotal.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Operations Flow */}
      {(activeTab === 'flow' || false) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Step-by-Step Production Sequence</span>
            </h3>
            <button
              onClick={handleAddStep}
              className="no-print flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold border border-emerald-500/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Operation Step</span>
            </button>
          </div>

          <div className="space-y-3">
            {activePlan.processFlow.map(step => (
              <div
                key={step.id}
                className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs font-mono border border-emerald-500/30 shrink-0">
                      {step.stepNumber}
                    </span>
                    <input
                      type="text"
                      value={step.name}
                      onChange={e => handleUpdateStep(step.id, 'name', e.target.value)}
                      className="text-sm font-bold text-white bg-transparent w-full focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-850 px-2 py-1 rounded-lg border border-slate-750">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <input
                        type="text"
                        value={step.cycleTime}
                        onChange={e => handleUpdateStep(step.id, 'cycleTime', e.target.value)}
                        className="bg-transparent w-20 text-right focus:outline-none font-mono text-white text-xs"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteStep(step.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                      Tool / Machine Used
                    </span>
                    <input
                      type="text"
                      value={step.machineOrTool}
                      onChange={e => handleUpdateStep(step.id, 'machineOrTool', e.target.value)}
                      className="w-full bg-slate-950/60 p-2 rounded-lg border border-slate-850 text-slate-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                      Process Parameters
                    </span>
                    <input
                      type="text"
                      value={step.parameters}
                      onChange={e => handleUpdateStep(step.id, 'parameters', e.target.value)}
                      className="w-full bg-slate-950/60 p-2 rounded-lg border border-slate-850 text-slate-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-amber-400 block mb-0.5">
                      Safety Protocol
                    </span>
                    <input
                      type="text"
                      value={step.safetyNotes}
                      onChange={e => handleUpdateStep(step.id, 'safetyNotes', e.target.value)}
                      className="w-full bg-slate-950/60 p-2 rounded-lg border border-slate-850 text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Factory Flow Visualizer (Node Pipeline) */}
      {(activeTab === 'flowchart' || false) && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-teal-400" />
                <span>Interactive Factory Flow & Routing Pipeline</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visual sequential map of production steps, tool work centers, and quality control gates.
              </p>
            </div>

            {bottleneckStep && (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/40 flex items-center gap-3">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-amber-300 font-bold block">
                    Line Bottleneck: Step {bottleneckStep.stepNumber} ({bottleneckStep.name})
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Cycle: {bottleneckStep.cycleTime} • Max Throughput: ~{factoryMaxThroughputPerHour} units/hr
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Visual Node Flowchart */}
          <div className="space-y-4">
            {activePlan.processFlow.map((step, idx) => {
              const isBottleneck = bottleneckStep?.id === step.id;
              const isLast = idx === activePlan.processFlow.length - 1;

              return (
                <div key={step.id} className="relative">
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      isBottleneck
                        ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Step Info */}
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl font-mono font-black flex items-center justify-center text-sm shrink-0 border ${
                            isBottleneck
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                              : 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                          }`}
                        >
                          {step.stepNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{step.name}</h4>
                            {isBottleneck && (
                              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                Line Constraint
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1 font-semibold text-slate-300">
                              <Cpu className="w-3.5 h-3.5 text-blue-400" />
                              {step.machineOrTool}
                            </span>
                            <span>•</span>
                            <span>Params: {step.parameters}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Cycle Time & Quality Gate */}
                      <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-750 font-mono text-xs">
                          <Clock className="w-3.5 h-3.5 text-teal-400" />
                          <span className="font-bold text-white">{step.cycleTime}</span>
                        </div>

                        {step.qualityCheck && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="max-w-[200px] truncate" title={step.qualityCheck}>
                              QA: {step.qualityCheck}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {step.safetyNotes && (
                      <div className="mt-3 pt-3 border-t border-slate-850 flex items-center gap-2 text-[11px] text-amber-300/90">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Safety Requirement: {step.safetyNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Flow Arrow to next node */}
                  {!isLast && (
                    <div className="flex justify-center my-2">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <div className="w-0.5 h-4 bg-gradient-to-b from-teal-500/50 to-slate-700" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Gantt Schedule & Timeline */}
      {(activeTab === 'timeline' || false) && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>Gantt Project Schedule & Milestones</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visual timeline spanning design freeze, prototype fabrication, tooling NRE, and ramp-up.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-teal-300">
              Total Lead Time: {activePlan.leadTime}
            </div>
          </div>

          {/* Interactive Gantt Bar Visualization */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Visual Phase Progression
            </h4>

            <div className="space-y-3">
              {activePlan.timeline.map((mile, idx) => {
                const colors = [
                  'from-emerald-500 to-teal-600',
                  'from-teal-500 to-cyan-600',
                  'from-cyan-500 to-blue-600',
                  'from-blue-500 to-indigo-600',
                  'from-indigo-500 to-purple-600'
                ];
                const grad = colors[idx % colors.length];

                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-teal-400 font-bold flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-white">{mile.phase}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400 font-semibold">{mile.duration}</span>
                        <button
                          onClick={() => handleDeleteMilestone(idx)}
                          className="no-print text-slate-600 hover:text-rose-400 p-1"
                          title="Remove milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Deliverable: <strong className="text-slate-300">{mile.deliverable}</strong>
                    </p>

                    {/* Gantt Bar */}
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, 25 + idx * 22)}%` }}
                        className={`h-full bg-gradient-to-r ${grad} rounded-full transition-all`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Milestone Form */}
            <form onSubmit={handleAddMilestone} className="no-print pt-3 border-t border-slate-850 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="New Phase Name (e.g. Mold T1 Trials)"
                value={newMilestonePhase}
                onChange={e => setNewMilestonePhase(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 2 Weeks)"
                value={newMilestoneDuration}
                onChange={e => setNewMilestoneDuration(e.target.value)}
                className="w-32 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
              />
              <input
                type="text"
                placeholder="Deliverable (e.g. First 50 samples)"
                value={newMilestoneDeliverable}
                onChange={e => setNewMilestoneDeliverable(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shrink-0 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Phase</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Machines & Tooling */}
      {(activeTab === 'machines' || false) && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Machines & Tooling Infrastructure</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePlan.machines.map((mach, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{mach.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {mach.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{mach.specs}</p>
                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
                  <span>Setup: {mach.setupTime}</span>
                  <span className="text-emerald-400">Skill: {mach.operatorSkill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Quality Checkpoints */}
      {(activeTab === 'quality' || false) && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Quality Inspection Checkpoints & GD&T</span>
          </h3>
          <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 text-slate-300 font-semibold border-b border-slate-750">
                <tr>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Inspected Parameter</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Tolerance Limit</th>
                  <th className="p-3">Instrument Tool</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {activePlan.qualityCheckpoints.map((qc, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50">
                    <td className="p-3 font-semibold text-cyan-400">{qc.stage}</td>
                    <td className="p-3">{qc.parameter}</td>
                    <td className="p-3 text-slate-400">{qc.method}</td>
                    <td className="p-3 font-mono text-emerald-400">{qc.tolerance}</td>
                    <td className="p-3 text-slate-300">{qc.tool}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Safety & OSHA */}
      {(activeTab === 'safety' || false) && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Industrial Safety Protocols & PPE Requirements</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePlan.safetyRequirements.map((safe, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {safe.hazard}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {safe.oshaStandard}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {safe.protocol}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {safe.ppe.map((item, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      🛡️ {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Waste & Circular Management */}
      {(activeTab === 'waste' || false) && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Waste Reduction & Circular Manufacturing Protocols</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Zero-waste initiatives, scrap reclamation, coolant recovery, and eco-packaging specifications.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Circular Strategies ({activePlan.wasteManagement?.length || 0})
            </h4>

            <div className="space-y-2.5">
              {(activePlan.wasteManagement || []).map((strategy, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-xs text-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{strategy}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteWasteStrategy(idx)}
                    className="no-print text-slate-500 hover:text-rose-400 p-1"
                    title="Delete strategy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Waste Strategy Form */}
            <form onSubmit={handleAddWasteStrategy} className="no-print pt-3 border-t border-slate-850 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add scrap recovery loop (e.g. 'Compact CNC aluminum chips into pucks to reclaim 98% cutting fluid')..."
                value={newWasteItem}
                onChange={e => setNewWasteItem(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shrink-0 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Protocol</span>
              </button>
            </form>
          </div>

          {/* Plan Notes Editor */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              General Engineering Notes & Remarks
            </h4>
            <textarea
              rows={3}
              value={activePlan.notes}
              onChange={e => setActivePlan({ ...activePlan, notes: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              placeholder="Engineering assumptions, supplier requirements, and tooling notes..."
            />
          </div>
        </div>
      )}

      {/* Tab 6: Prototype Tests */}
      {activeTab === 'testing' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-emerald-400" />
            <span>Prototype Validation & Design Testing Protocol</span>
          </h3>
          <div className="space-y-3">
            {activePlan.prototypeTesting.map(test => (
              <div
                key={test.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{test.testName}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{test.objective}</p>
                  <p className="text-xs text-slate-300 mt-1">
                    <strong className="text-slate-400">Pass Criteria:</strong> {test.acceptanceCriteria}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleTestStatus(test.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border shrink-0 transition-colors ${
                    test.status === 'passed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : test.status === 'failed'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {test.status}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Costs & Budget Summary */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Manufacturing Cost Breakdown & Break-Even Analysis</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Tooling & NRE CapEx</span>
              <div className="text-xl font-black text-white font-mono">
                ${activePlan.costBreakdown.toolingNRE.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500">Non-recurring engineering</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Raw Material / Unit</span>
              <div className="text-xl font-black text-emerald-400 font-mono">
                ${activePlan.costBreakdown.rawMaterialPerUnit.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500">BOM feedstock</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Labor & Machine / Unit</span>
              <div className="text-xl font-black text-blue-400 font-mono">
                ${activePlan.costBreakdown.laborMachinePerUnit.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500">Cycle time overhead</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 bg-emerald-950/20">
              <span className="text-xs text-emerald-300 font-semibold block mb-1">Total Unit Cost</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                ${activePlan.costBreakdown.totalPerUnit.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400">Break-even at {activePlan.costBreakdown.breakEvenVolume} units</span>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Production Timeline & Key Milestones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {activePlan.timeline.map((mile, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 text-xs">
                  <div className="font-bold text-teal-400 mb-1">{mile.phase}</div>
                  <div className="text-slate-300 mb-1 font-mono text-[11px]">{mile.duration}</div>
                  <div className="text-[11px] text-slate-400">{mile.deliverable}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Engineering Disclaimer Footer */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5 print-card">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {activePlan.notes}
        </p>
      </div>
    </div>
  );
};
