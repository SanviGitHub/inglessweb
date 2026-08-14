import React, { useState } from 'react';
import { Volume2, CheckCircle2, XCircle, Sparkles, MessageSquare, RotateCcw } from 'lucide-react';
import { DIALOGUE_SCENARIOS } from '../data/verbsData';
import { DialogueScenario, VerbItem } from '../types';
import { playSpeech } from '../utils/speech';

interface EverydayDialoguesProps {
  audioRate: number;
  onMasterVerb?: (verbId: string) => void;
  verbsData: VerbItem[];
}

export const EverydayDialogues: React.FC<EverydayDialoguesProps> = ({
  audioRate,
  onMasterVerb,
  verbsData,
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [userSelections, setUserSelections] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});

  const availableScenarios = DIALOGUE_SCENARIOS.filter(sc => 
    verbsData.some(v => v.id === sc.verbId)
  );

  const scenario: DialogueScenario | undefined = availableScenarios[selectedScenarioIndex] || availableScenarios[0];

  const handleOptionPick = (exchangeIdx: number, option: string, correctWord?: string) => {
    setUserSelections((prev) => ({ ...prev, [exchangeIdx]: option }));
    setShowFeedback((prev) => ({ ...prev, [exchangeIdx]: true }));

    if (option === correctWord && onMasterVerb && scenario) {
      onMasterVerb(scenario.verbId);
    }
  };

  const handleSpeakLine = (text: string, blankWord?: string, exchangeIdx?: number) => {
    let finalSentence = text;
    if (blankWord) {
      const chosen = exchangeIdx !== undefined ? userSelections[exchangeIdx] : null;
      finalSentence = text.replace('___', chosen || blankWord);
    }
    playSpeech(finalSentence, audioRate);
  };

  const handleResetDialogue = () => {
    setUserSelections({});
    setShowFeedback({});
  };

  if (!scenario) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 shadow-xs">
        No hay diálogos disponibles para los verbos seleccionados actualmente.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Bento Top Header */}
      <div className="bg-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">
            Práctica en Contexto
          </span>
          <h2 className="text-2xl sm:text-4xl font-black mt-1 text-white tracking-tight">
            Diálogos Cotidianos Interactivos
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base mt-2 opacity-95 leading-relaxed">
            Aprende a usar los {verbsData.length} verbos en situaciones auténticas: ordenando comida, remodelando una casa o conversando con amigos. 
            Selecciona la forma correcta del verbo para completar cada turno de la conversación.
          </p>

          {/* Scenario Selector Pills */}
          <div className="flex flex-wrap gap-2 mt-5">
            {availableScenarios.map((sc, idx) => (
              <button
                key={sc.id}
                id={`scenario-tab-${sc.id}`}
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  handleResetDialogue();
                }}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedScenarioIndex === idx
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <span>{sc.title}</span>
                <span className="text-[10px] opacity-75 font-mono">({sc.verbName})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Dialogue Chat Container Bento Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
              Escenario Actual
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">{scenario.title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{scenario.description}</p>
          </div>

          <button
            type="button"
            id="reset-dialogue-btn"
            onClick={handleResetDialogue}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>

        {/* Chat Bubbles */}
        <div className="space-y-5">
          {scenario.exchanges.map((exchange, idx) => {
            const isUserTurn = exchange.speaker === 'Tú';
            const selectedOpt = userSelections[idx];
            const isChecked = showFeedback[idx];
            const isCorrect = selectedOpt === exchange.blankWord;

            return (
              <div
                key={idx}
                id={`chat-bubble-${idx}`}
                className={`flex gap-3.5 ${isUserTurn ? 'flex-row-reverse' : 'flex-row'} items-start`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
                  {exchange.avatar}
                </div>

                {/* Message Box */}
                <div className={`max-w-xl rounded-3xl p-5 border shadow-xs ${
                  isUserTurn
                    ? 'bg-indigo-50 border-indigo-200 text-slate-900 rounded-tr-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-900 rounded-tl-xs'
                }`}>
                  
                  {/* Speaker Name and Verb Tag */}
                  <div className="flex items-center justify-between gap-3 text-xs mb-2">
                    <span className="font-extrabold text-indigo-900">{exchange.speaker}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-indigo-700 font-bold">
                      Verbo: {exchange.verbUsed}
                    </span>
                  </div>

                  {/* English Sentence */}
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base sm:text-lg font-bold leading-relaxed text-slate-900">
                      {exchange.blankWord ? (
                        exchange.english.split('___').map((part, pIdx, arr) => (
                          <React.Fragment key={pIdx}>
                            <span>{part}</span>
                            {pIdx < arr.length - 1 && (
                              <span className={`inline-block px-3 py-0.5 mx-1 rounded-xl border font-mono font-bold text-sm ${
                                isChecked
                                  ? isCorrect
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border-rose-300'
                                  : selectedOpt
                                  ? 'bg-indigo-200 text-indigo-900 border-indigo-400'
                                  : 'bg-white text-indigo-700 border-dashed border-indigo-400 min-w-[70px] text-center'
                              }`}>
                                {selectedOpt || '_____'}
                              </span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        exchange.english
                      )}
                    </p>

                    {/* Audio Play Button */}
                    <button
                      type="button"
                      id={`play-audio-dialogue-${idx}`}
                      onClick={() => handleSpeakLine(exchange.english, exchange.blankWord, idx)}
                      title="Escuchar audio"
                      className="p-2.5 rounded-2xl bg-white hover:bg-indigo-600 text-slate-600 hover:text-white border border-slate-200 transition-all flex-shrink-0 cursor-pointer shadow-xs"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Spanish Translation */}
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 italic font-medium">
                    "{exchange.spanish}"
                  </p>

                  {/* Options selection if this exchange has a blank */}
                  {exchange.options && (
                    <div className="mt-4 pt-3.5 border-t border-slate-200/80">
                      <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Selecciona la forma adecuada:</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {exchange.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleOptionPick(idx, opt, exchange.blankWord)}
                            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono border transition-all cursor-pointer ${
                              selectedOpt === opt
                                ? isChecked
                                  ? opt === exchange.blankWord
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : 'bg-rose-600 text-white border-rose-600'
                                  : 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {/* Feedback banner */}
                      {isChecked && (
                        <div className={`mt-2.5 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : 'bg-rose-50 text-rose-900 border border-rose-200'
                        }`}>
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span>¡Correcto! En este contexto se usa "{exchange.blankWord}".</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                              <span>Incorrecto. La forma adecuada es "{exchange.blankWord}".</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

