import React from 'react';
import { BookOpen, Monitor } from 'lucide-react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'core' | 'extended') => void;
  initialMode: 'core' | 'extended';
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode, initialMode }) => {
  return (
    <div className="fixed inset-0 z-40 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="max-w-2xl w-full space-y-8">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-sm overflow-hidden">
             <img src="/iconing.png" alt="Ingless Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Seleccione su modo interactivo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Elige qué lista de verbos irregulares deseas practicar hoy
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8">
          
          {/* Option 1 */}
          <button
            onClick={() => onSelectMode('core')}
            className={`flex flex-col text-left p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer shadow-xs group ${
              initialMode === 'core'
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Opción 1 — 10 Verbos (Lección Oral)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Lista original de 10 verbos esenciales preparada específicamente para la presentación oral en clase.
            </p>
          </button>

          {/* Option 2 */}
          <button
            onClick={() => onSelectMode('extended')}
            className={`flex flex-col text-left p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer shadow-xs group ${
              initialMode === 'extended'
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Monitor className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Opción 2 — Verbos Extendidos
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Lista extendida con más verbos irregulares para expandir tu vocabulario y nivel de dominio.
            </p>
          </button>

        </div>
      </div>
    </div>
  );
};
