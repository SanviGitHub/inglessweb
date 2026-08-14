import React from 'react';
import { Volume2, Sparkles, BookOpen, PenTool, MessageSquareText, Trophy, Gauge, Moon, Sun, Monitor } from 'lucide-react';
import { MasteryState, UserVerbProgress } from '../types';

interface NavbarProps {
  currentTab: 'table' | 'practice' | 'dialogues' | 'matrix' | 'quiz' | 'notes';
  setCurrentTab: (tab: 'table' | 'practice' | 'dialogues' | 'matrix' | 'quiz' | 'notes') => void;
  audioRate: number;
  setAudioRate: (rate: number) => void;
  masteryState: MasteryState;
  totalVerbs: number;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onChangeMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  audioRate,
  setAudioRate,
  masteryState,
  totalVerbs,
  theme,
  setTheme,
  onChangeMode
}) => {
  const values = Object.values(masteryState) as UserVerbProgress[];
  const masteredCount = values.filter((v) => v.mastered).length;
  const progressPercent = Math.round((masteredCount / totalVerbs) * 100) || 0;

  const navItems = [
    { id: 'table', label: 'Tabla & Verbos', icon: BookOpen },
    { id: 'practice', label: 'Ejercicios', icon: PenTool },
    { id: 'dialogues', label: 'Diálogos Reales', icon: MessageSquareText },
    { id: 'matrix', label: 'Juego de Formas', icon: Sparkles },
    { id: 'quiz', label: 'Test de Dominio', icon: Trophy },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 gap-4 py-3 sm:py-0">
          
          {/* Brand Logo & Title */}
          <div 
            id="brand-logo-btn"
            onClick={() => setCurrentTab('table')}
            className="flex items-center gap-3 cursor-pointer group select-none self-start sm:self-auto"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform duration-200 overflow-hidden">
              <img src="/iconing.png" alt="Ingless Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  Ingless Web
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-800">
                  Verbs Of Day
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Domina las 3 formas gramaticales con audio nativo
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4 w-full sm:w-auto">
            
            {/* Mode Switcher */}
            <button
              onClick={onChangeMode}
              className="px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              title="Cambiar entre verbos básicos y extendidos"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cambiar Modo</span>
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Audio Speed Controller */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700">
              <button
                id="audio-rate-normal-btn"
                type="button"
                onClick={() => setAudioRate(1.0)}
                title="Velocidad normal (1.0x)"
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  audioRate === 1.0
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">1.0x</span>
              </button>
              <button
                id="audio-rate-slow-btn"
                type="button"
                onClick={() => setAudioRate(0.75)}
                title="Velocidad pausada para principiantes (0.75x)"
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  audioRate === 0.75
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                <span className="hidden md:inline">0.75x</span>
              </button>
            </div>

            {/* Mastery Progress Badge / Bento Metric */}
            <div 
              id="mastery-progress-indicator"
              onClick={() => setCurrentTab('quiz')}
              className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-1.5 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 shadow-xs transition-all"
              title="Progreso de dominio"
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Dominio
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  {masteredCount} / {totalVerbs} ({progressPercent}%)
                </span>
              </div>

              {/* Circular Gauge / Mini progress */}
              <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-slate-200 dark:border-t-slate-700 flex items-center justify-center font-bold text-[10px] text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40">
                {masteredCount}
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-100 dark:border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

