import React, { useState } from 'react';
import { X, Volume2, Lightbulb, AlertTriangle, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { VerbItem } from '../types';
import { playSpeech } from '../utils/speech';

interface VerbDetailModalProps {
  verb: VerbItem | null;
  onClose: () => void;
  audioRate: number;
  onMasterVerb?: (verbId: string) => void;
}

export const VerbDetailModal: React.FC<VerbDetailModalProps> = ({
  verb,
  onClose,
  audioRate,
  onMasterVerb,
}) => {
  const [activeSpeechWord, setActiveSpeechWord] = useState<string | null>(null);
  const [quickTestAnswer, setQuickTestAnswer] = useState<string | null>(null);
  const [showTestResult, setShowTestResult] = useState<boolean>(false);

  if (!verb) return null;

  const handleSpeak = (text: string) => {
    setActiveSpeechWord(text);
    playSpeech(text, audioRate, () => setActiveSpeechWord(null));
  };

  const handleQuickTest = (answer: string) => {
    setQuickTestAnswer(answer);
    setShowTestResult(true);
    if (answer === verb.participle && onMasterVerb) {
      onMasterVerb(verb.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="verb-detail-modal"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900"
      >
        
        {/* Header Bento Box */}
        <div className="bg-indigo-600 p-6 sm:p-8 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 text-white">
                {verb.patternLabel}
              </span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h3 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {verb.infinitive}
              </h3>
              <span className="text-xl sm:text-2xl text-indigo-100 font-medium">
                = {verb.spanish}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-100 mt-2 font-mono">
              Pronunciación fonética: <span className="bg-white/20 px-2 py-0.5 rounded-lg text-white font-bold">{verb.phonetic.guideEs}</span>
            </p>
          </div>

          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Bento Blocks */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Explanation Banner */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-sm text-slate-700 leading-relaxed font-medium">
            {verb.explanation}
          </div>

          {/* 3 Forms Comparison Cards */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Las 3 Formas Fundamentales
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* Form 1: Infinitive */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                    1. Infinitivo (V1)
                  </span>
                  <div className="text-xl font-black font-mono text-slate-900 mt-1">
                    {verb.infinitive}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {verb.phonetic.infinitive}
                  </div>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Presente</span>
                  <button
                    type="button"
                    onClick={() => handleSpeak(verb.infinitive)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form 2: Past Simple */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                    2. Pasado Simple (V2)
                  </span>
                  <div className="text-xl font-black font-mono text-slate-900 mt-1">
                    {verb.past}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {verb.phonetic.past}
                  </div>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Acción pasada</span>
                  <button
                    type="button"
                    onClick={() => handleSpeak(verb.past.replace('/', ' or '))}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form 3: Past Participle */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                    3. Participio (V3)
                  </span>
                  <div className="text-xl font-black font-mono text-indigo-950 mt-1">
                    {verb.participle}
                  </div>
                  <div className="text-xs text-indigo-600 font-mono mt-0.5">
                    {verb.phonetic.participle}
                  </div>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-indigo-200/80 flex items-center justify-between">
                  <span className="text-xs text-indigo-700 font-medium">Con have/has</span>
                  <button
                    type="button"
                    onClick={() => handleSpeak(verb.participle)}
                    className="p-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Everyday Examples with Audio */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Ejemplos en Situaciones Cotidianas
            </h4>
            <div className="space-y-3">
              {verb.examples.map((ex) => (
                <div
                  key={ex.id}
                  id={`example-card-${ex.id}`}
                  className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-4.5 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-indigo-700 font-mono">
                      {ex.tenseLabel}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Contexto: {ex.context}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 mt-2">
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-900 leading-snug">
                        {ex.english.split(new RegExp(`(${ex.highlightWord})`, 'gi')).map((part, i) =>
                          part.toLowerCase() === ex.highlightWord.toLowerCase() ? (
                            <span key={i} className="text-indigo-600 font-black underline decoration-indigo-300 underline-offset-4">
                              {part}
                            </span>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        {ex.spanish}
                      </p>
                    </div>

                    <button
                      type="button"
                      id={`audio-example-${ex.id}`}
                      onClick={() => handleSpeak(ex.english)}
                      title="Escuchar oración completa"
                      className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-indigo-600 transition-all flex-shrink-0 cursor-pointer shadow-xs"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips and Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Mnemonic Tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900">
              <div className="flex items-center gap-2 font-bold text-amber-800 text-sm mb-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Truco Nemotécnico</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                {verb.mnemonicTip}
              </p>
            </div>

            {/* Common Mistake */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-900">
              <div className="flex items-center gap-2 font-bold text-rose-800 text-sm mb-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Error Típico a Evitar</span>
              </div>
              <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">
                {verb.commonMistake}
              </p>
            </div>

          </div>

          {/* Mini Interactive Check */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Mini Desafío: ¿Cuál es el Participio (V3) de "{verb.infinitive}"?</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3">
              {[
                verb.participle,
                verb.past,
                `${verb.infinitive}ed`,
              ].filter((val, idx, self) => self.indexOf(val) === idx).sort(() => Math.random() - 0.5).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleQuickTest(opt)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-bold font-mono border transition-all cursor-pointer ${
                    showTestResult
                      ? opt === verb.participle
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : opt === quickTestAnswer
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 shadow-xs'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {showTestResult && (
              <div className={`mt-3 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                quickTestAnswer === verb.participle
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}>
                {quickTestAnswer === verb.participle ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>¡Correcto! El participio de "{verb.infinitive}" es "{verb.participle}".</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>Incorrecto. La forma correcta es "{verb.participle}".</span>
                  </>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Presiona el altavoz en cualquier momento para escuchar
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Listo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

