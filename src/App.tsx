import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VerbTable } from './components/VerbTable';
import { VerbDetailModal } from './components/VerbDetailModal';
import { PracticeExercises } from './components/PracticeExercises';
import { EverydayDialogues } from './components/EverydayDialogues';
import { FormMatrixGame } from './components/FormMatrixGame';
import { MasteryQuiz } from './components/MasteryQuiz';
import { GrammarNotes } from './components/GrammarNotes';
import { SplashScreen } from './components/SplashScreen';
import { ModeSelection } from './components/ModeSelection';
import { AirplaneTransition } from './components/AirplaneTransition';
import { VerbItem, MasteryState } from './types';
import { VERBS_DATA } from './data/verbsData';
import { EXTENDED_VERBS_DATA } from './data/extendedVerbsData';
import { Lightbulb, Trophy } from 'lucide-react';

const STORAGE_KEY = 'ten_verbs_mastery_v1';
const THEME_KEY = 'ingless_theme';
const MODE_KEY = 'ingless_mode';

type AppPhase = 'splash' | 'modeSelection' | 'transition' | 'app';

export default function App() {
  // App Phase
  const [phase, setPhase] = useState<AppPhase>('splash');
  
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  // Mode
  const [activeMode, setActiveMode] = useState<'core' | 'extended'>(() => {
    const saved = localStorage.getItem(MODE_KEY);
    return saved === 'extended' ? 'extended' : 'core';
  });

  const [currentTab, setCurrentTab] = useState<'table' | 'practice' | 'dialogues' | 'matrix' | 'quiz' | 'notes'>('table');
  const [selectedVerb, setSelectedVerb] = useState<VerbItem | null>(null);
  const [audioRate, setAudioRate] = useState<number>(1.0);
  
  const [masteryState, setMasteryState] = useState<MasteryState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const initial: MasteryState = {};
    [...VERBS_DATA, ...EXTENDED_VERBS_DATA].forEach((v) => {
      initial[v.id] = { practicedCount: 0, correctCount: 0, mastered: false };
    });
    return initial;
  });

  const activeVerbList = activeMode === 'core' ? VERBS_DATA : [...VERBS_DATA, ...EXTENDED_VERBS_DATA];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(masteryState));
    } catch {
      // ignore
    }
  }, [masteryState]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(MODE_KEY, activeMode);
  }, [activeMode]);

  const handleMasterVerb = (verbId: string) => {
    setMasteryState((prev) => {
      const current = prev[verbId] || { practicedCount: 0, correctCount: 0, mastered: false };
      const newCorrect = current.correctCount + 1;
      const newPracticed = current.practicedCount + 1;
      return {
        ...prev,
        [verbId]: {
          practicedCount: newPracticed,
          correctCount: newCorrect,
          mastered: newCorrect >= 2, // Mastered after 2 correct usages
          lastPracticed: new Date().toISOString(),
        },
      };
    });
  };

  const handleSelectMode = (mode: 'core' | 'extended') => {
    setActiveMode(mode);
    setPhase('transition');
  };

  const handleChangeMode = () => {
    setPhase('modeSelection');
  };

  if (phase === 'splash') {
    return <SplashScreen onComplete={() => setPhase('modeSelection')} />;
  }

  if (phase === 'modeSelection') {
    return <ModeSelection onSelectMode={handleSelectMode} initialMode={activeMode} />;
  }

  if (phase === 'transition') {
    return <AirplaneTransition onComplete={() => setPhase('app')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        audioRate={audioRate}
        setAudioRate={setAudioRate}
        masteryState={masteryState}
        totalVerbs={activeVerbList.length}
        theme={theme}
        setTheme={setTheme}
        onChangeMode={handleChangeMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {currentTab === 'table' && (
          <VerbTable
            onSelectVerb={(v) => setSelectedVerb(v)}
            masteryState={masteryState}
            audioRate={audioRate}
            verbsData={activeVerbList}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeExercises
            onMasterVerb={handleMasterVerb}
            audioRate={audioRate}
            verbsData={activeVerbList}
          />
        )}

        {currentTab === 'dialogues' && (
          <EverydayDialogues
            audioRate={audioRate}
            onMasterVerb={handleMasterVerb}
            verbsData={activeVerbList}
          />
        )}

        {currentTab === 'matrix' && (
          <FormMatrixGame
            audioRate={audioRate}
            onMasterVerb={handleMasterVerb}
            verbsData={activeVerbList}
          />
        )}

        {currentTab === 'quiz' && (
          <MasteryQuiz
            onMasterVerb={handleMasterVerb}
            masteryState={masteryState}
            verbsData={activeVerbList}
            onSelectVerbForDetail={(v) => {
              setSelectedVerb(v);
              setCurrentTab('table');
            }}
          />
        )}

        {currentTab === 'notes' && (
          <GrammarNotes audioRate={audioRate} />
        )}

      </main>

      {/* Selected Verb Detail Sheet/Modal */}
      {selectedVerb && (
        <VerbDetailModal
          verb={selectedVerb}
          onClose={() => setSelectedVerb(null)}
          audioRate={audioRate}
          onMasterVerb={handleMasterVerb}
        />
      )}

      {/* Bottom Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-6 text-slate-500 dark:text-slate-400 text-xs text-center transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Ingless Web (Verbs Of Day)</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px] truncate max-w-[200px] sm:max-w-none">
              {activeMode === 'core' ? 'be, become, begin, bite, blow, break, bring, build, buy, can' : `${activeVerbList.length} verbos extendidos`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('notes')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1 font-medium"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Reglas Gramaticales</span>
            </button>
            <button
              onClick={() => setCurrentTab('quiz')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1 font-medium"
            >
              <Trophy className="w-3.5 h-3.5 text-indigo-600" />
              <span>Test de Dominio</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
