import React from 'react';
import { BookOpen, Volume2 } from 'lucide-react';
import { playSpeech } from '../utils/speech';

interface GrammarNotesProps {
  audioRate: number;
}

export const GrammarNotes: React.FC<GrammarNotesProps> = ({ audioRate }) => {
  const handleSpeak = (text: string) => {
    playSpeech(text, audioRate);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Bento Header */}
      <div className="bg-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xs">
        <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">
          Estrategias de Aprendizaje
        </span>
        <h2 className="text-2xl sm:text-4xl font-black mt-1 text-white tracking-tight">
          Guía de Patrones de los 10 Verbos
        </h2>
        <p className="text-indigo-100 text-sm sm:text-base mt-2 opacity-95 leading-relaxed">
          Aprende a memorizar estos 10 verbos irregulares agrupándolos por sus patrones fonéticos y lógicos.
        </p>
      </div>

      {/* Pattern 1: Special Alert for CAN Bento Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-black font-mono text-lg">
            ⭐
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 block">
              Regla Exclusiva
            </span>
            <h3 className="text-xl font-black text-slate-900">
              1. El Caso Especial de CAN (Verbo Modal)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              ¿Por qué el participio es "been able to" y no "canned"?
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong className="text-slate-900">Can</strong> es un verbo modal "defectivo", lo que significa que no tiene todas las formas verbales que tienen otros verbos (no tiene infinitivo con "to", no tiene gerundio "-ing", ni participio propio).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Presente (Habilidad)</span>
              <span className="text-base font-mono font-bold text-slate-900">I can swim</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">"Puedo nadar"</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Pasado simple</span>
              <span className="text-base font-mono font-bold text-slate-900">I could swim</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">"Podía / pude nadar"</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
              <span className="text-[10px] text-indigo-700 font-extrabold uppercase tracking-wider block">Participio (Con have/has)</span>
              <span className="text-base font-mono font-bold text-indigo-900">I have been able to swim</span>
              <p className="text-xs text-indigo-700 mt-1 font-medium">"He podido nadar"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern 2: Bring vs Buy Bento Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-black font-mono text-lg">
            2
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 block">
              Contraste Fonético
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Bring (Traer) vs Buy (Comprar)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              El truco infalible de la letra "R" en -ought (/ɔːt/)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 text-lg">b<span className="text-indigo-600 font-black">r</span>ing → b<span className="text-indigo-600 font-black">r</span>ought</span>
              <button 
                onClick={() => handleSpeak('bring, brought, brought')}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Como <strong className="text-slate-900">bRing</strong> tiene una <strong className="text-indigo-600 font-black">"R"</strong>, su pasado y participio también conservan la <strong className="text-indigo-600 font-black">"R"</strong>: <em>b-R-ought</em>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 text-lg">buy → bought</span>
              <button 
                onClick={() => handleSpeak('buy, bought, bought')}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Como <strong className="text-slate-900">buy</strong> NO tiene "R", su pasado y participio tampoco tienen "R": <em>bought</em> (se pronuncia "bot").
            </p>
          </div>
        </div>
      </div>

      {/* Pattern 3: Vowel shifts Bento Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-black font-mono text-lg">
            3
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 block">
              Regla I → A → U
            </span>
            <h3 className="text-xl font-black text-slate-900">
              El Patrón de Cambio Vocálico I → A → U
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              begin (i) → began (a) → begun (u)
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          En verbos como <strong className="text-slate-900">begin</strong>, la vocal interna sigue el orden alfabético estricto:
        </p>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-around font-mono text-sm sm:text-base font-bold">
          <span className="text-slate-900">beg<span className="text-indigo-600 font-black text-lg">i</span>n (Infinitivo)</span>
          <span className="text-slate-400">→</span>
          <span className="text-slate-900">beg<span className="text-indigo-600 font-black text-lg">a</span>n (Pasado)</span>
          <span className="text-slate-400">→</span>
          <span className="text-slate-900">beg<span className="text-indigo-600 font-black text-lg">u</span>n (Participio)</span>
        </div>
      </div>

      {/* Pattern 4: Build Bento Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-black font-mono text-lg">
            4
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 block">
              Terminación Consonántica
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Cambio de Consonante Final: D → T
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              build (d) → built (t) → built (t)
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          En <strong className="text-slate-900">build</strong>, únicamente se sustituye la última letra <strong className="text-indigo-600 font-black">"d"</strong> por una <strong className="text-indigo-600 font-black">"t"</strong> en el pasado y participio. ¡Nunca agregues "-ed"! (No existe "builded").
        </p>
      </div>

    </div>
  );
};

