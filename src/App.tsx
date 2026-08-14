import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VerbTable } from './components/VerbTable';
import { VerbDetailModal } from './components/VerbDetailModal';
import { PracticeExercises } from './components/PracticeExercises';
import { EverydayDialogues } from './components/EverydayDialogues';
import { FormMatrixGame } from './components/FormMatrixGame';
import { MasteryQuiz } from './components/MasteryQuiz';
import { GrammarNotes } from './components/GrammarNotes';
import { VerbItem, MasteryState } from './types';
import { VERBS_DATA } from './data/verbsData';
import { BookOpen, PenTool, MessageSquareText, Sparkles, Trophy, Lightbulb } from 'lucide-react';

const STORAGE_KEY = 'ten_verbs_mastery_v1';

export default function App() {
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
    VERBS_DATA.forEach((v) => {
      initial[v.id] = { practicedCount: 0, correctCount: 0, mastered: false };
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(masteryState));
    } catch {
      // ignore
    }
  }, [masteryState]);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        audioRate={audioRate}
        setAudioRate={setAudioRate}
        masteryState={masteryState}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {currentTab === 'table' && (
          <VerbTable
            onSelectVerb={(v) => setSelectedVerb(v)}
            masteryState={masteryState}
            audioRate={audioRate}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeExercises
            onMasterVerb={handleMasterVerb}
            audioRate={audioRate}
          />
        )}

        {currentTab === 'dialogues' && (
          <EverydayDialogues
            audioRate={audioRate}
            onMasterVerb={handleMasterVerb}
          />
        )}

        {currentTab === 'matrix' && (
          <FormMatrixGame
            audioRate={audioRate}
            onMasterVerb={handleMasterVerb}
          />
        )}

        {currentTab === 'quiz' && (
          <MasteryQuiz
            onMasterVerb={handleMasterVerb}
            masteryState={masteryState}
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
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-md py-6 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">10 Verbos Esenciales en Inglés</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-mono text-[11px]">be, become, begin, bite, blow, break, bring, build, buy, can</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('notes')}
              className="hover:text-indigo-600 text-slate-600 transition-colors flex items-center gap-1 font-medium"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Reglas Gramaticales</span>
            </button>
            <button
              onClick={() => setCurrentTab('quiz')}
              className="hover:text-indigo-600 text-slate-600 transition-colors flex items-center gap-1 font-medium"
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
