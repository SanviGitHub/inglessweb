import React from 'react';
import { Volume2, Sparkles, BookOpen, PenTool, MessageSquareText, Trophy, Gauge, Flame } from 'lucide-react';
import { MasteryState, UserVerbProgress } from '../types';

interface NavbarProps {
  currentTab: 'table' | 'practice' | 'dialogues' | 'matrix' | 'quiz' | 'notes';
  setCurrentTab: (tab: 'table' | 'practice' | 'dialogues' | 'matrix' | 'quiz' | 'notes') => void;
  audioRate: number;
  setAudioRate: (rate: number) => void;
  masteryState: MasteryState;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  audioRate,
  setAudioRate,
  masteryState,
}) => {
  const values = Object.values(masteryState) as UserVerbProgress[];
  const masteredCount = values.filter((v) => v.mastered).length;
  const progressPercent = Math.round((masteredCount / 10) * 100);

  const navItems = [
    { id: 'table', label: 'Tabla & Verbos', icon: BookOpen },
    { id: 'practice', label: 'Ejercicios', icon: PenTool },
    { id: 'dialogues', label: 'Diálogos Reales', icon: MessageSquareText },
    { id: 'matrix', label: 'Juego de Formas', icon: Sparkles },
    { id: 'quiz', label: 'Test de Dominio', icon: Trophy },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            id="brand-logo-btn"
            onClick={() => setCurrentTab('table')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
              10
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-800 flex items-center gap-1">
                  10 Verbos <span className="text-indigo-600 font-extrabold">Pro</span>
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  Esenciales
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Domina las 3 formas gramaticales con audio nativo
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Audio Speed Controller */}
            <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
              <button
                id="audio-rate-normal-btn"
                type="button"
                onClick={() => setAudioRate(1.0)}
                title="Velocidad normal (1.0x)"
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  audioRate === 1.0
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Audio</span> 1.0x
              </button>
              <button
                id="audio-rate-slow-btn"
                type="button"
                onClick={() => setAudioRate(0.75)}
                title="Velocidad pausada para principiantes (0.75x)"
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  audioRate === 0.75
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Lento</span> 0.75x
              </button>
            </div>

            {/* Mastery Progress Badge / Bento Metric */}
            <div 
              id="mastery-progress-indicator"
              onClick={() => setCurrentTab('quiz')}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-3.5 py-1.5 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 shadow-xs transition-all"
              title="Progreso de dominio de los 10 verbos"
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Dominio
                </span>
                <span className="text-xs font-extrabold text-slate-800">
                  {masteredCount} / 10 ({progressPercent}%)
                </span>
              </div>

              {/* Circular Gauge / Mini progress */}
              <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-slate-200 flex items-center justify-center font-bold text-[10px] text-indigo-700 bg-indigo-50">
                {masteredCount}
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-100">
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
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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

