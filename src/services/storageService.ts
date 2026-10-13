import { GeneratedIdea, ManufacturingPlan, UserSettings } from '../types';
import { SAMPLE_IDEAS, SAMPLE_PLANS } from '../data/sampleProjects';

const IDEAS_KEY = 'manugenius_saved_ideas_v1';
const PLANS_KEY = 'manugenius_saved_plans_v1';
const SETTINGS_KEY = 'manugenius_settings_v1';

const DEFAULT_SETTINGS: UserSettings = {
  aiProvider: 'built-in',
  geminiApiKey: '',
  geminiModel: 'gemini-2.5-flash',
  temperature: 0.7,
  openaiApiKey: '',
  currency: 'USD ($)'
};

export const storageService = {
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  getSavedIdeas(): GeneratedIdea[] {
    try {
      const data = localStorage.getItem(IDEAS_KEY);
      if (!data) {
        // Initialize with rich sample ideas
        localStorage.setItem(IDEAS_KEY, JSON.stringify(SAMPLE_IDEAS));
        return SAMPLE_IDEAS;
      }
      return JSON.parse(data);
    } catch {
      return SAMPLE_IDEAS;
    }
  },

  saveIdea(idea: GeneratedIdea): void {
    const ideas = this.getSavedIdeas();
    const existingIndex = ideas.findIndex(i => i.id === idea.id);
    if (existingIndex >= 0) {
      ideas[existingIndex] = idea;
    } else {
      ideas.unshift(idea);
    }
    localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
  },

  deleteIdea(id: string): void {
    const ideas = this.getSavedIdeas().filter(i => i.id !== id);
    localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
  },

  getSavedPlans(): ManufacturingPlan[] {
    try {
      const data = localStorage.getItem(PLANS_KEY);
      if (!data) {
        // Initialize with rich sample plans
        localStorage.setItem(PLANS_KEY, JSON.stringify(SAMPLE_PLANS));
        return SAMPLE_PLANS;
      }
      return JSON.parse(data);
    } catch {
      return SAMPLE_PLANS;
    }
  },

  getPlanById(id: string): ManufacturingPlan | undefined {
    const plans = this.getSavedPlans();
    return plans.find(p => p.id === id);
  },

  savePlan(plan: ManufacturingPlan): void {
    const plans = this.getSavedPlans();
    const existingIndex = plans.findIndex(p => p.id === plan.id);
    if (existingIndex >= 0) {
      plans[existingIndex] = { ...plan, updatedAt: new Date().toISOString() };
    } else {
      plans.unshift({ ...plan, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  },

  deletePlan(id: string): void {
    const plans = this.getSavedPlans().filter(p => p.id !== id);
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  },

  exportAllData(): string {
    const exportObject = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      ideas: this.getSavedIdeas(),
      plans: this.getSavedPlans(),
      settings: this.getSettings()
    };
    return JSON.stringify(exportObject, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.ideas)) {
        localStorage.setItem(IDEAS_KEY, JSON.stringify(data.ideas));
      }
      if (Array.isArray(data.plans)) {
        localStorage.setItem(PLANS_KEY, JSON.stringify(data.plans));
      }
      return true;
    } catch (e) {
      console.error('Failed to parse imported JSON', e);
      return false;
    }
  },

  resetToDefault(): void {
    localStorage.setItem(IDEAS_KEY, JSON.stringify(SAMPLE_IDEAS));
    localStorage.setItem(PLANS_KEY, JSON.stringify(SAMPLE_PLANS));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  }
};
