import React, { useState } from 'react';
import { Trophy, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VerbItem, MasteryState } from '../types';

interface QuizQuestion {
  id: number;
  verb: VerbItem;
  questionText: string;
  questionSubtitle: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  formTested: 'past' | 'participle' | 'meaning' | 'modal-rule';
}

interface MasteryQuizProps {
  onMasterVerb: (verbId: string) => void;
  masteryState: MasteryState;
  onSelectVerbForDetail: (verb: VerbItem) => void;
  verbsData: VerbItem[];
}

export const MasteryQuiz: React.FC<MasteryQuizProps> = ({
  onMasterVerb,
  masteryState,
  onSelectVerbForDetail,
  verbsData,
}) => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ question: QuizQuestion; answer: string; isCorrect: boolean }[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const generateQuiz = () => {
    const generated: QuizQuestion[] = verbsData.map((v, index) => {
      if (v.id === 'can') {
        return {
          id: index,
          verb: v,
          questionText: '¿Cuál es el equivalente del pasado participio ("podido") para el verbo modal CAN?',
          questionSubtitle: 'Ej: "No he ___ asistir a la reunión."',
          correctAnswer: 'been able to',
          options: ['been able to', 'canned', 'could', 'was able'],
          explanation: 'El verbo "can" no tiene participio propio. Para decir "podido" con have/has se utiliza "been able to".',
          formTested: 'modal-rule',
        };
      }

      if (v.id === 'bring' || v.id === 'buy') {
        const isBring = v.id === 'bring';
        return {
          id: index,
          verb: v,
          questionText: `¿Cuál es el pasado simple del verbo "${v.infinitive}" (${v.spanish})?`,
          questionSubtitle: isBring ? 'Ojo con la letra "R" en bring -> brought' : 'Sin la "R" en buy -> bought',
          correctAnswer: v.past,
          options: [v.past, isBring ? 'bought' : 'brought', `${v.infinitive}ed`, v.participle + 'ed'].filter((val, i, arr) => arr.indexOf(val) === i).slice(0, 4),
          explanation: `El pasado de "${v.infinitive}" es "${v.past}". ${v.mnemonicTip}`,
          formTested: 'past',
        };
      }

      if (v.id === 'begin' || v.id === 'bite' || v.id === 'break' || v.id === 'blow') {
        return {
          id: index,
          verb: v,
          questionText: `¿Cuál es el PASADO PARTICIPIO (V3) de "${v.infinitive}"?`,
          questionSubtitle: `Forma que acompaña a "have / has" (ej. "I have ${v.participle}")`,
          correctAnswer: v.participle,
          options: [v.participle, v.past, `${v.infinitive}ed`, v.infinitive].filter((val, i, arr) => arr.indexOf(val) === i).sort(() => Math.random() - 0.5),
          explanation: `El participio de "${v.infinitive}" es "${v.participle}". ${v.mnemonicTip}`,
          formTested: 'participle',
        };
      }

      return {
        id: index,
        verb: v,
        questionText: `¿Cuáles son las 3 formas en orden (Infinitivo - Pasado - Participio) de "${v.spanish}"?`,
        questionSubtitle: `Selecciona la secuencia correcta:`,
        correctAnswer: `${v.infinitive} - ${v.past} - ${v.participle}`,
        options: [
          `${v.infinitive} - ${v.past} - ${v.participle}`,
          `${v.infinitive} - ${v.participle} - ${v.past}`,
          `${v.infinitive} - ${v.infinitive}ed - ${v.infinitive}ed`,
          `${v.infinitive} - ${v.past} - ${v.infinitive}`,
        ].filter((val, i, arr) => arr.indexOf(val) === i).sort(() => Math.random() - 0.5),
        explanation: `La secuencia correcta es: ${v.infinitive} (infinitivo) -> ${v.past} (pasado) -> ${v.participle} (participio).`,
        formTested: 'past',
      };
    });

    setQuestions(generated.sort(() => Math.random() - 0.5));
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setIsQuizFinished(false);
    setIsQuizStarted(true);
  };

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(opt);
  };

  const handleSubmitQuestion = () => {
    if (!selectedAnswer || isSubmitted) return;
    setIsSubmitted(true);

    const currentQ = questions[currentIdx];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    setUserAnswers((prev) => [
      ...prev,
      { question: currentQ, answer: selectedAnswer, isCorrect },
    ]);

    if (isCorrect) {
      onMasterVerb(currentQ.verb.id);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setIsQuizFinished(true);
      const correctTotal = userAnswers.filter((a) => a.isCorrect).length + (selectedAnswer === questions[currentIdx]?.correctAnswer ? 1 : 0);
      const passingScore = Math.floor(questions.length * 0.8);
      if (correctTotal >= passingScore) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const currentQ = questions[currentIdx];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {!isQuizStarted ? (
        /* Welcome Bento Grid */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xs text-center space-y-7">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 inline-block">
              Evaluación Final
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Test de Dominio de los {verbsData.length} Verbos
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Pon a prueba tu conocimiento de las 3 formas (Infinitivo, Pasado Simple y Pasado Participio) de los verbos irregulares seleccionados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">{verbsData.length} Preguntas</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">1 pregunta por cada verbo</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Feedback Inmediato</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Explicaciones claras en español</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Diagnóstico</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Evaluación de maestría final</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="start-quiz-btn"
              type="button"
              onClick={generateQuiz}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-xs transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <span>Comenzar Evaluación</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : !isQuizFinished && currentQ ? (
        /* Question Bento Box */
        <div key={`question-wrapper-${currentQ.id}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                Pregunta {currentIdx + 1} / {questions.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Aciertos: <strong className="text-emerald-600 dark:text-emerald-500">{correctCount}</strong>
              </span>
            </div>

            <div className="w-32 sm:w-48 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
              Verbo: {currentQ.verb.infinitive} ({currentQ.verb.spanish})
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
              {currentQ.questionText}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {currentQ.questionSubtitle}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let style = 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20';

              if (isSubmitted) {
                if (isCorrect) {
                  style = 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-600 text-white border-rose-600';
                } else {
                  style = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-600 dark:border-indigo-500 text-indigo-900 dark:text-indigo-100';
              }

              return (
                <button
                  key={`${currentQ.id}-opt-${optIdx}`}
                  type="button"
                  id={`quiz-opt-${optIdx}`}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-sm sm:text-base font-black font-mono text-left flex items-center justify-between transition-all cursor-pointer ${style}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Explanation on submit */}
          {isSubmitted && (
            <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
              selectedAnswer === currentQ.correctAnswer
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/30 text-rose-900 dark:text-rose-300'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                    <span>¡Correcto!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-500" />
                    <span>Respuesta incorrecta.</span>
                  </>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-300">{currentQ.explanation}</p>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            {!isSubmitted ? (
              <button
                type="button"
                id="submit-quiz-q-btn"
                disabled={!selectedAnswer}
                onClick={handleSubmitQuestion}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  selectedAnswer
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                }`}
              >
                Comprobar
              </button>
            ) : (
              <button
                type="button"
                id="next-quiz-q-btn"
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-2xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>{currentIdx < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados Finales'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Results Bento Box */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xs space-y-8 text-center">
          
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase">
              Diagnóstico de Dominio
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Puntuación Final: {correctCount} / {questions.length} ({Math.round((correctCount / questions.length) * 100)}%)
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              {correctCount === questions.length
                ? '¡Dominio perfecto! Conoces con exactitud las 3 formas y la aplicación de los verbos.'
                : correctCount >= questions.length * 0.7
                ? '¡Muy buen trabajo! Tienes una base sólida, solo necesitas repasar un par de detalles.'
                : 'Buen intento. Te recomendamos repasar los verbos en la tabla y practicar con los ejemplos cotidianos.'}
            </p>
          </div>

          {/* Breakdown Table / List */}
          <div className="text-left space-y-3 pt-2">
            <h4 className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
              Revisión detallada de cada verbo:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {userAnswers.map((ans, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectVerbForDetail(ans.question.verb)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-all ${
                    ans.isCorrect
                      ? 'bg-emerald-50/60 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-300'
                      : 'bg-rose-50/60 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/30 text-rose-900 dark:text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-500 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {ans.question.verb.infinitive} ({ans.question.verb.past} / {ans.question.verb.participle})
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {ans.question.verb.spanish}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline">
                    Repasar
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              id="retake-quiz-btn"
              onClick={generateQuiz}
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Volver a Intentar</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

