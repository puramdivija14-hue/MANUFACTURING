import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { SettingsModal } from './components/SettingsModal';
import { EngineeringCopilot } from './components/EngineeringCopilot';
import { HomePage } from './pages/HomePage';
import { IdeaGeneratorPage } from './pages/IdeaGeneratorPage';
import { KnowledgeHubPage } from './pages/KnowledgeHubPage';
import { ManufacturingPlannerPage } from './pages/ManufacturingPlannerPage';
import { MaterialMachinePage } from './pages/MaterialMachinePage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { PrototypeGuidePage } from './pages/PrototypeGuidePage';
import { SavedProjectsPage } from './pages/SavedProjectsPage';
import {
  GeneratedIdea,
  ManufacturingPlan,
  UserSettings,
  IdeaGenerationInput
} from './types';
import { storageService } from './services/storageService';
import { aiService } from './services/aiService';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [settings, setSettings] = useState<UserSettings>(storageService.getSettings());
  const [savedIdeas, setSavedIdeas] = useState<GeneratedIdea[]>(storageService.getSavedIdeas());
  const [savedPlans, setSavedPlans] = useState<ManufacturingPlan[]>(storageService.getSavedPlans());

  // Navigation payload states
  const [generatorInitialForm, setGeneratorInitialForm] = useState<Partial<IdeaGenerationInput> | undefined>();
  const [plannerActivePlan, setPlannerActivePlan] = useState<ManufacturingPlan | null>(null);
  const [knowledgeInitialTopic, setKnowledgeInitialTopic] = useState<string | undefined>();

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Global hotkey: Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshStorage = () => {
    setSavedIdeas(storageService.getSavedIdeas());
    setSavedPlans(storageService.getSavedPlans());
    setSettings(storageService.getSettings());
  };

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (params) {
      if (params.planId) {
        const found = storageService.getPlanById(params.planId);
        if (found) setPlannerActivePlan(found);
      }
      if (params.topicId) {
        setKnowledgeInitialTopic(params.topicId);
      }
    }
  };

  // Convert an Idea directly into a Production Plan in the Planner
  const handleSendIdeaToPlanner = (idea: GeneratedIdea) => {
    const plan = aiService.synthesizePlan(idea);
    setPlannerActivePlan(plan);
    storageService.savePlan(plan);
    refreshStorage();
    setCurrentPage('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Challenge Launcher from Home
  const handleSelectChallenge = (challenge: any) => {
    setGeneratorInitialForm({
      industry: challenge.category,
      problem: challenge.objective,
      budget: challenge.targetCost,
      materials: challenge.suggestedMaterials.join(', '),
      scale: 'small-batch',
      objective: 'reduce-waste',
      mode: 'waste-to-value'
    });
    setCurrentPage('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveIdea = (idea: GeneratedIdea) => {
    storageService.saveIdea(idea);
    refreshStorage();
  };

  const handleSearchResultSelect = (category: 'knowledge' | 'material' | 'machine', id: string) => {
    if (category === 'knowledge') {
      setKnowledgeInitialTopic(id);
      setCurrentPage('knowledge');
    } else {
      setCurrentPage('explorer');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        savedCount={savedPlans.length + savedIdeas.length}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
            savedPlans={savedPlans}
            savedIdeas={savedIdeas}
            onSelectChallenge={handleSelectChallenge}
          />
        )}

        {currentPage === 'generator' && (
          <IdeaGeneratorPage
            initialForm={generatorInitialForm}
            onSendToPlanner={handleSendIdeaToPlanner}
            onSaveIdea={handleSaveIdea}
            savedIdeaIds={savedIdeas.map(i => i.id)}
            settings={settings}
          />
        )}

        {currentPage === 'knowledge' && (
          <KnowledgeHubPage
            initialTopicId={knowledgeInitialTopic}
            onNavigateToPlanner={(prompt) => {
              setGeneratorInitialForm({
                industry: 'Advanced Manufacturing',
                problem: prompt,
                scale: 'small-batch',
                objective: 'improve-quality',
                mode: 'process-optimization'
              });
              setCurrentPage('generator');
            }}
            onNavigateToExplorer={() => setCurrentPage('explorer')}
          />
        )}

        {currentPage === 'planner' && (
          <ManufacturingPlannerPage
            initialPlan={plannerActivePlan}
            onPlanSaved={() => refreshStorage()}
          />
        )}

        {currentPage === 'explorer' && <MaterialMachinePage />}

        {currentPage === 'sustainability' && <SustainabilityPage />}

        {currentPage === 'prototyping' && <PrototypeGuidePage />}

        {currentPage === 'saved' && (
          <SavedProjectsPage
            onNavigateToPlanner={(planId) => {
              if (planId) {
                const found = storageService.getPlanById(planId);
                if (found) setPlannerActivePlan(found);
              }
              setCurrentPage('planner');
            }}
            onNavigateToGenerator={() => setCurrentPage('generator')}
          />
        )}
      </main>

      {/* Floating Engineering Copilot Chatbot */}
      <EngineeringCopilot
        settings={settings}
        onNavigateToPlanner={(prompt) => {
          if (prompt) {
            handleNavigate('planner');
          } else {
            handleNavigate('planner');
          }
        }}
        onNavigateToGenerator={(prompt) => {
          if (prompt) {
            setGeneratorInitialForm({
              industry: 'Custom Manufacturing Inquiry',
              problem: prompt,
              scale: 'small-batch',
              objective: 'new-product',
              mode: 'creative-brainstorming' as any
            });
          }
          handleNavigate('generator');
        }}
        onNavigateToKnowledge={(topicId) => {
          if (topicId) setKnowledgeInitialTopic(topicId);
          handleNavigate('knowledge');
        }}
      />

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSearchResultSelect}
      />

      {/* Global Settings & AI Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          storageService.saveSettings(newSettings);
          setSettings(newSettings);
        }}
        onDataReset={() => refreshStorage()}
      />
    </div>
  );
}

export default App;
