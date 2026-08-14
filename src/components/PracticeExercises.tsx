import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Volume2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  Award,
  Filter,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VerbItem, ExerciseQuestion } from '../types';
import { playSpeech } from '../utils/speech';

interface PracticeExercisesProps {
  onMasterVerb: (verbId: string) => void;
  audioRate: number;
  verbsData: VerbItem[];
}

export const PracticeExercises: React.FC<PracticeExercisesProps> = ({
  onMasterVerb,
  audioRate,
  verbsData,
}) => {
  const [selectedVerbFilter, setSelectedVerbFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const dynamicQuestions: ExerciseQuestion[] = useMemo(() => {
    return verbsData.flatMap(v => {
      return v.examples.map(ex => {
        // Generate distractors (other forms of the same verb)
        const optsSet = new Set([v.infinitive, v.past, v.participle]);
        if (v.id === 'can') optsSet.add('been able to');
        optsSet.add(`${v.infinitive}ed`);
        
        const options = Array.from(optsSet)
          .filter(opt => opt !== ex.highlightWord)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .concat(ex.highlightWord)
          .sort(() => Math.random() - 0.5);

        return {
          id: ex.id,
          type: 'fill-blank',
          verbId: v.id,
          sentencePrompt: ex.english.replace(new RegExp(`\\b${ex.highlightWord}\\b`, 'i'), '___'),
          sentenceTranslation: ex.spanish,
          correctAnswer: ex.highlightWord,
          options: options,
          explanation: `La forma correcta es "${ex.highlightWord}" porque la oración está en ${ex.tenseLabel.toLowerCase()}.`,
          targetTense: ex.tense,
          contextHint: ex.context,
        };
      });
    }).sort(() => Math.random() - 0.5);
  }, [verbsData]);

  const filteredQuestions: ExerciseQuestion[] = dynamicQuestions.filter((q) => {
    if (selectedVerbFilter === 'all') return true;
    return q.verbId === selectedVerbFilter;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const targetVerbObj = verbsData.find((v) => v.id === currentQ?.verbId);

  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(opt);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    setAnsweredCount((prev) => prev + 1);

    const isCorrect = selectedOption.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
      setScore((prev) => prev + 10 * Math.min(newStreak, 3));
      onMasterVerb(currentQ.verbId);

      if (newStreak % 3 === 0) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setAnsweredCount(0);
  };

  const handlePlaySentenceAudio = () => {
    const textToSpeak = currentQ.sentencePrompt.replace('___', currentQ.correctAnswer);
    playSpeech(textToSpeak, audioRate);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bento Header & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Header Cell */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100">
                Desafío Interactivo
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ejercicios de Aplicación Real
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Selecciona la forma correcta (Infinitivo, Pasado o Participio) para completar la oración.
            </p>
          </div>

          {/* Quick Verb Selector Pill Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-4 border-t border-slate-100 mt-4">
            <span className="text-xs font-bold text-slate-400 mr-1">Filtrar:</span>
            <button
              onClick={() => { setSelectedVerbFilter('all'); setCurrentIndex(0); setIsAnswerSubmitted(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedVerbFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({dynamicQuestions.length})
            </button>
            {verbsData.map((v) => (
              <button
                key={v.id}
                onClick={() => { setSelectedVerbFilter(v.id); setCurrentIndex(0); setIsAnswerSubmitted(false); }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all font-mono ${
                  selectedVerbFilter === v.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {v.infinitive}
              </button>
            ))}
          </div>
        </div>

        {/* Streak & Score Bento Cells */}
        <div className="md:col-span-4 grid grid-cols-2 gap-4">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
              <Flame className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Racha Actual
            </span>
            <span className="text-xl font-black text-slate-800 mt-0.5">
              {streak} seguidas 🔥
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Puntos Ganados
            </span>
            <span className="text-xl font-black text-indigo-600 mt-0.5">
              {score} pts
            </span>
          </div>

        </div>

      </div>

      {/* Main Challenge Layout: Question Bento Box + Context Sidebar */}
      {currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Question Bento Card (cols 12 -> lg:col-span-8) */}
          <div 
            id={`practice-question-card-${currentQ.id}`}
            className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  Desafío {currentIndex + 1} de {filteredQuestions.length}
                </span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">
                  Verbo a practicar: <span className="font-mono text-indigo-600">{currentQ.verbId}</span>
                </h3>
              </div>
              <div className="px-3 py-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                Pista: {currentQ.contextHint}
              </div>
            </div>

            {/* Sentence Prompt with prominent Bento blank */}
            <div className="space-y-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed">
                  {currentQ.sentencePrompt.split('___').map((part, index, arr) => (
                    <React.Fragment key={index}>
                      <span>{part}</span>
                      {index < arr.length - 1 && (
                        <span className={`inline-block mx-2 font-mono font-black border-b-4 transition-all ${
                          isAnswerSubmitted
                            ? selectedOption === currentQ.correctAnswer
                              ? 'border-emerald-500 text-emerald-600 bg-emerald-50 px-4 py-0.5 rounded-lg'
                              : 'border-rose-500 text-rose-600 bg-rose-50 px-4 py-0.5 rounded-lg line-through'
                            : selectedOption
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50 px-4 py-0.5 rounded-lg'
                            : 'border-indigo-500 text-indigo-500 px-6 py-0.5'
                        }`}>
                          {selectedOption || '_____'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>

                <button
                  type="button"
                  id="speak-sentence-btn"
                  onClick={handlePlaySentenceAudio}
                  title="Escuchar oración completa"
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white transition-all shadow-xs flex-shrink-0"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-500 italic">
                "{currentQ.sentenceTranslation}"
              </p>
            </div>

            {/* Options Bento Buttons (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let btnStyle = 'border-2 border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-500 hover:bg-indigo-50';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'border-2 border-rose-500 bg-rose-50 text-rose-800';
                  } else {
                    btnStyle = 'border-2 border-slate-100 bg-slate-50 text-slate-400 opacity-50';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-2 border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs';
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    id={`option-btn-${opt}`}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(opt)}
                    className={`py-4 px-6 rounded-2xl text-base font-bold font-mono text-left flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback alert */}
            {isAnswerSubmitted && (
              <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  {selectedOption === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>¡Correcto! Respuesta acertada.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Respuesta incorrecta. La opción correcta es "{currentQ.correctAnswer}".</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  <strong>Explicación:</strong> {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                id="reset-practice-btn"
                onClick={handleReset}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  id="submit-answer-btn"
                  disabled={!selectedOption}
                  onClick={handleSubmitAnswer}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-xs transition-all flex items-center gap-2 ${
                    selectedOption
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Verificar</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  id="next-question-btn"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-2xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Siguiente Ejercicio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Context / Verb Form Reference Dark Bento Tile (cols 12 -> lg:col-span-4) */}
          <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Ficha del Verbo
              </span>
              <h4 className="text-xl font-black text-white font-mono">
                {targetVerbObj?.infinitive.toUpperCase()}
              </h4>
              <p className="text-xs text-indigo-300 font-medium">
                {targetVerbObj?.spanish} • {targetVerbObj?.patternLabel}
              </p>
            </div>

            {/* 3 Forms summary */}
            <div className="space-y-2">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-bold">Infinitivo (V1)</span>
                <span className="font-mono font-bold text-white text-base">{targetVerbObj?.infinitive}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-bold">Pasado Simple (V2)</span>
                <span className="font-mono font-bold text-indigo-300 text-base">{targetVerbObj?.past}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-bold">Participio (V3)</span>
                <span className="font-mono font-bold text-amber-400 text-base">{targetVerbObj?.participle}</span>
              </div>
            </div>

            {/* Mnemonic reminder */}
            <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 block font-bold mb-1">💡 Truco Rápido</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {targetVerbObj?.mnemonicTip}
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

