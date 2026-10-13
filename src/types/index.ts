export interface IdeaGenerationInput {
  industry: string;
  problem: string;
  budget: string;
  materials: string;
  scale: 'prototype' | 'small-batch' | 'mass-production';
  objective: 'reduce-cost' | 'save-energy' | 'reduce-waste' | 'improve-quality' | 'automate-production' | 'new-product';
  mode: 'brainstorming' | 'low-cost' | 'sustainable' | 'automation' | 'waste-to-value' | 'product-improvement' | 'new-concept' | 'process-optimization';
}

export interface GeneratedIdea {
  id: string;
  title: string;
  mode: string;
  problemAddressed: string;
  proposedSolution: string;
  materials: string[];
  manufacturingMethod: string;
  estimatedComplexity: 'Low' | 'Medium' | 'High';
  complexityScore: number; // 1 to 10
  estimatedCostPerUnit: string;
  estimatedCycleTime: string;
  advantages: string[];
  limitations: string[];
  nextSteps: string[];
  createdAt: string;
  isDemo: boolean;
}

export interface BOMItem {
  id: string;
  item: string;
  material: string;
  quantity: number;
  unit: string;
  unitCost: number;
  supplierCategory: string;
  notes: string;
}

export interface OperationStep {
  id: string;
  stepNumber: number;
  name: string;
  machineOrTool: string;
  cycleTime: string;
  parameters: string;
  safetyNotes: string;
  qualityCheck: string;
}

export interface MachineRequirement {
  name: string;
  type: string;
  specs: string;
  setupTime: string;
  operatorSkill: string;
}

export interface QualityCheck {
  stage: string;
  parameter: string;
  method: string;
  tolerance: string;
  tool: string;
}

export interface SafetyRequirement {
  hazard: string;
  ppe: string[];
  protocol: string;
  oshaStandard: string;
}

export interface PrototypeTest {
  id: string;
  testName: string;
  objective: string;
  acceptanceCriteria: string;
  status: 'pending' | 'passed' | 'failed';
}

export interface CostSummary {
  toolingNRE: number;
  rawMaterialPerUnit: number;
  laborMachinePerUnit: number;
  finishingPackagingPerUnit: number;
  totalPerUnit: number;
  breakEvenVolume: number;
}

export interface TimelineMilestone {
  phase: string;
  duration: string;
  deliverable: string;
}

export interface ManufacturingPlan {
  id: string;
  title: string;
  sourceIdeaId?: string;
  productOverview: string;
  targetVolume: string;
  tolerances: string;
  leadTime: string;
  bom: BOMItem[];
  machines: MachineRequirement[];
  processFlow: OperationStep[];
  qualityCheckpoints: QualityCheck[];
  safetyRequirements: SafetyRequirement[];
  wasteManagement: string[];
  prototypeTesting: PrototypeTest[];
  costBreakdown: CostSummary;
  timeline: TimelineMilestone[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

export interface KnowledgeCategory {
  id: string;
  title: string;
  tagline: string;
  iconName: string;
  definition: string;
  workingPrinciple: string;
  processSteps: string[];
  equipment: string[];
  suitableMaterials: string[];
  incompatibleMaterials: string[];
  applications: string[];
  advantages: string[];
  limitations: string[];
  safetyConsiderations: string[];
  realWorldExample: {
    title: string;
    description: string;
    impact: string;
  };
  proTip: string;
}

export interface Material {
  id: string;
  name: string;
  category: 'Metals & Alloys' | 'Polymers & Plastics' | 'Composites' | 'Ceramics' | 'Bio-materials & Sustainable';
  density: string;
  tensileStrength: string;
  machinability: string;
  costTier: '$' | '$$' | '$$$' | '$$$$' | '$$$$$';
  applications: string[];
  suitableProcesses: string[];
  pros: string[];
  cons: string[];
  sustainabilityNotes: string;
}

export interface Machine {
  id: string;
  name: string;
  category: 'Subtractive & CNC' | 'Additive & 3D' | 'Forming & Sheet Metal' | 'Moulding & Casting' | 'Automation & Joining' | 'Metrology & QA';
  accuracy: string;
  speed: string;
  powerConsumption: string;
  setupComplexity: 'Low' | 'Medium' | 'High';
  costTier: '$' | '$$' | '$$$' | '$$$$' | '$$$$$';
  compatibleMaterials: string[];
  advantages: string[];
  limitations: string[];
  maintenanceLevel: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'plan' | 'generate' | 'knowledge';
    payload: string;
    label: string;
  };
}

export interface UserSettings {
  aiProvider: 'built-in' | 'gemini' | 'openai';
  geminiApiKey: string;
  geminiModel: string;
  temperature: number;
  openaiApiKey: string;
  currency: string;
}
