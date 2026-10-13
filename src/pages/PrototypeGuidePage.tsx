import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  Plus,
  Trash2,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  Square,
  ArrowRight
} from 'lucide-react';

interface CustomTest {
  id: string;
  name: string;
  objective: string;
  criteria: string;
  status: 'passed' | 'failed' | 'pending';
}

export const PrototypeGuidePage: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(1);

  // Interactive Checklist
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    cad: true,
    dfm: true,
    print3d: false,
    calipers: true,
    feaSweep: false,
    assemblyJig: false,
    thermalTest: false,
    dropTest: false
  });

  const toggleCheck = (id: string) => {
    setChecklist({ ...checklist, [id]: !checklist[id] });
  };

  // Interactive Custom Test Suite
  const [tests, setTests] = useState<CustomTest[]>([
    {
      id: 't-1',
      name: '1.2 Meter Drop Test',
      objective: 'Verify chassis does not shatter or dislodge battery contacts when dropped on concrete',
      criteria: 'Zero structural fractures after 3 perpendicular impacts',
      status: 'passed'
    },
    {
      id: 't-2',
      name: 'Thermal Soak @ 55°C',
      objective: 'Ensure polymer housing does not creep or warp under sustained high temperature',
      criteria: 'Deflection remains under 0.15 mm over 48 hours continuous soak',
      status: 'pending'
    },
    {
      id: 't-3',
      name: 'Continuous Cycling (1,000 actuations)',
      objective: 'Validate snap-fit latch fatigue and hinge wear',
      criteria: 'Retains > 85% of original retention force without crack formation',
      status: 'pending'
    }
  ]);

  const [newTestName, setNewTestName] = useState('');
  const [newTestObj, setNewTestObj] = useState('');
  const [newTestCrit, setNewTestCrit] = useState('');

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;
    const test: CustomTest = {
      id: `test-${Date.now()}`,
      name: newTestName.trim(),
      objective: newTestObj.trim() || 'Functional verification',
      criteria: newTestCrit.trim() || 'Conforms to drawing tolerance',
      status: 'pending'
    };
    setTests([...tests, test]);
    setNewTestName('');
    setNewTestObj('');
    setNewTestCrit('');
  };

  const handleToggleTestStatus = (id: string) => {
    setTests(
      tests.map(t => {
        if (t.id === id) {
          const next =
            t.status === 'passed' ? 'failed' : t.status === 'failed' ? 'pending' : 'passed';
          return { ...t, status: next };
        }
        return t;
      })
    );
  };

  const handleDeleteTest = (id: string) => {
    setTests(tests.filter(t => t.id !== id));
  };

  const phases = [
    {
      num: 1,
      title: 'Concept & DFM Feasibility',
      focus: 'Virtual validation before spending a dollar on raw stock or 3D filament.',
      steps: [
        '3D CAD parametric modeling in SolidWorks, Fusion 360, or FreeCAD',
        'DFM (Design for Manufacturability) thickness, draft, and radius audits',
        'FEA structural stress simulation under maximum operational load factors',
        'Preliminary Bill of Materials (BOM) cost and supplier lead-time estimate'
      ],
      tools: 'CAD Software, FEA Solvers, Digital Calipers'
    },
    {
      num: 2,
      title: 'Form, Fit & Ergonomics Study',
      focus: 'Tangible physical models to test human hands, port alignment, and clearances.',
      steps: [
        'Rapid FDM / SLA 3D printing (0.2mm layer height, fast draft mode)',
        'Check snap fits, threaded insert holes, and mating clearances',
        'Ergonomic grip and weight balance testing with test users',
        'Iterate 3D geometry immediately within 24 hours based on findings'
      ],
      tools: 'Desktop 3D Printers, Sanding paper, M3 hardware kit'
    },
    {
      num: 3,
      title: 'Functional Working Prototype',
      focus: 'Real engineering materials with working mechanics and embedded electronics.',
      steps: [
        'CNC machining or soft-tooled urethane vacuum casting',
        'Custom PCB integration, wire harness routing, and firmware bench flashing',
        'Thermal dissipation verification under operational current load',
        'Mechanical torque check on all fasteners using calibrated torque driver'
      ],
      tools: '3-Axis CNC Mill, Oscilloscope, Thermal IR Camera'
    },
    {
      num: 4,
      title: 'Engineering Validation (EVT)',
      focus: 'Stress testing to failure to establish real safety factors and limits.',
      steps: [
        'Drop shock testing from 1.0 to 1.5 meters onto hard concrete surface',
        'Thermal cycling in environmental chamber (-20°C to +60°C)',
        'Ingress Protection (IP rating) water mist and dust penetration testing',
        'Failure Mode and Effects Analysis (FMEA) documentation'
      ],
      tools: 'Environmental Chamber, Drop Tester, Torque Meter'
    },
    {
      num: 5,
      title: 'Pre-Production Pilot Batch',
      focus: 'Tuning production line assembly jigs and training line operators.',
      steps: [
        'Fabricate dedicated assembly holding jigs and Poka-Yoke error-proofing fixtures',
        'Produce pilot batch of 50 to 100 units at production speed',
        'Conduct First Article Inspection (FAI) on all dimensions using CMM',
        'Lock Standard Operating Procedures (SOPs) and release to mass manufacturing'
      ],
      tools: 'Assembly Fixtures, Coordinate Measuring Machine (CMM), Barcode Scanners'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
          <Wrench className="w-3.5 h-3.5" />
          <span>Rapid Prototyping & DFM Playbook</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Prototype Development Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Master the 5-phase prototype roadmap from initial CAD concept to pilot batch validation. Apply DFM rules, track test results, and de-risk your product before investing in hard tooling.
        </p>
      </div>

      {/* 5-Phase Roadmap Stepper */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-white">The 5-Phase Prototyping Roadmap</h2>

        {/* Phase buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-slate-800 pb-4">
          {phases.map(p => (
            <button
              key={p.num}
              onClick={() => setActivePhase(p.num)}
              className={`p-3 rounded-xl text-left transition-all ${
                activePhase === p.num
                  ? 'bg-blue-600/20 text-white border border-blue-500/50 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-850'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase text-blue-400 mb-0.5">
                Phase {p.num}
              </div>
              <div className="text-xs font-bold truncate">{p.title}</div>
            </button>
          ))}
        </div>

        {/* Active Phase Details */}
        {(() => {
          const current = phases.find(p => p.num === activePhase) || phases[0];
          return (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white">
                  Phase {current.num}: {current.title}
                </h3>
                <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30">
                  Tools: {current.tools}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 italic">{current.focus}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {current.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-850 text-xs flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px] font-mono border border-slate-700">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* DFM Golden Rules Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          Design for Manufacturability (DFM) Golden Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Rule 1: Uniform Wall Thickness
            </span>
            <h4 className="text-sm font-bold text-white">Avoid Thermal Sink Marks</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintain consistent nominal wall thickness (typically 1.5 - 3.0 mm for plastics). Where ribs or bosses meet the wall, make them 50% to 60% of the nominal thickness to prevent unsightly sink depressions on the outer cosmetic surface.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              Rule 2: Draft Angles (1° - 2°)
            </span>
            <h4 className="text-sm font-bold text-white">Mold Ejection Without Scratches</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Always apply minimum 1° of draft angle per inch of depth on all vertical walls parallel to the mold draw direction. Heavily textured EDM finishes require 1.5° additional draft per 0.025 mm of texture depth.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              Rule 3: Internal Fillet Radiuses
            </span>
            <h4 className="text-sm font-bold text-white">Eliminate Stress Concentrations</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sharp internal 90° corners act as severe stress risers leading to fatigue cracks. Apply internal corner radiuses of at least 0.5x wall thickness (minimum R1.0 mm). Sharp inside corners are also impossible to mill on CNC without expensive EDM.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Prototyping Test Planner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Interactive Prototype Test Suite
            </h2>
            <p className="text-xs text-slate-400">
              Track drop tests, environmental soak, and mechanical stress cycles. Click status pill to toggle Pass / Fail.
            </p>
          </div>
        </div>

        {/* Existing Tests List */}
        <div className="space-y-3">
          {tests.map(test => (
            <div
              key={test.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-sm font-bold text-white">{test.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{test.objective}</p>
                <div className="text-xs text-slate-300 mt-1">
                  <strong className="text-slate-400">Criteria:</strong> {test.criteria}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleTestStatus(test.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                    test.status === 'passed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : test.status === 'failed'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {test.status}
                </button>
                <button
                  onClick={() => handleDeleteTest(test.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Test Form */}
        <form
          onSubmit={handleAddTest}
          className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Add Custom Prototype Test Case
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newTestName}
              onChange={e => setNewTestName(e.target.value)}
              placeholder="Test Name (e.g. Ingress IP54 Test)"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={newTestObj}
              onChange={e => setNewTestObj(e.target.value)}
              placeholder="Objective (e.g. Check water sealing)"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTestCrit}
                onChange={e => setNewTestCrit(e.target.value)}
                placeholder="Pass Criteria (e.g. Zero moisture inside)"
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0"
              >
                Add Test
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
