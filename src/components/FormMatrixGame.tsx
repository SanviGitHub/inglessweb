import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw, CheckCircle2, Volume2, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VerbItem } from '../types';
import { playSpeech } from '../utils/speech';

interface MatrixCard {
  id: string;
  verbId: string;
  type: 'infinitive' | 'past' | 'participle' | 'spanish';
  typeLabel: string;
  text: string;
  matched: boolean;
}

interface FormMatrixGameProps {
  audioRate: number;
  onMasterVerb?: (verbId: string) => void;
  verbsData: VerbItem[];
}

export const FormMatrixGame: React.FC<FormMatrixGameProps> = ({
  audioRate,
  onMasterVerb,
  verbsData,
}) => {
  const [cards, setCards] = useState<MatrixCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MatrixCard[]>([]);
  const [matchedVerbIds, setMatchedVerbIds] = useState<string[]>([]);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);

  // Group verbs into chunks of 5
  const chunkSize = 5;
  const groups: VerbItem[][] = [];
  for (let i = 0; i < verbsData.length; i += chunkSize) {
    groups.push(verbsData.slice(i, i + chunkSize));
  }

  const initializeCards = () => {
    let subset: VerbItem[] = [];
    if (selectedGroupIndex === -1) {
      subset = verbsData; // all
    } else {
      subset = groups[selectedGroupIndex] || [];
    }

    const generated: MatrixCard[] = [];
    subset.forEach((v) => {
      generated.push({
        id: `${v.id}-inf`,
        verbId: v.id,
        type: 'infinitive',
        typeLabel: 'Infinitivo (V1)',
        text: v.infinitive,
        matched: false,
      });
      generated.push({
        id: `${v.id}-past`,
        verbId: v.id,
        type: 'past',
        typeLabel: 'Pasado (V2)',
        text: v.past,
        matched: false,
      });
      generated.push({
        id: `${v.id}-part`,
        verbId: v.id,
        type: 'participle',
        typeLabel: 'Participio (V3)',
        text: v.participle,
        matched: false,
      });
      generated.push({
        id: `${v.id}-es`,
        verbId: v.id,
        type: 'spanish',
        typeLabel: 'Traducción',
        text: v.spanish,
        matched: false,
      });
    });

    // Shuffle
    setCards(generated.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchedVerbIds([]);
    setMistakeCount(0);
    setRoundCompleted(false);
  };

  useEffect(() => {
    initializeCards();
  }, [selectedGroupIndex, verbsData]);

  const handleCardClick = (card: MatrixCard) => {
    if (card.matched || selectedCards.some((c) => c.id === card.id)) return;

    if (card.type !== 'spanish') {
      playSpeech(card.text.replace('/', ' or '), audioRate);
    }

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    // If cards from different verbs are picked, check compatibility
    const firstVerbId = newSelected[0].verbId;
    const sameVerb = newSelected.every((c) => c.verbId === firstVerbId);

    if (!sameVerb) {
      // Mistake!
      setMistakeCount((prev) => prev + 1);
      setTimeout(() => {
        setSelectedCards([]);
      }, 700);
      return;
    }

    // If 4 cards of the same verb are selected (all forms: inf, past, part, spanish)
    const typesSelected = new Set(newSelected.map((c) => c.type));
    if (newSelected.length === 4 && typesSelected.size === 4) {
      // Completed full verb set!
      const verbId = firstVerbId;
      setMatchedVerbIds((prev) => [...prev, verbId]);
      setCards((prev) =>
        prev.map((c) => (c.verbId === verbId ? { ...c, matched: true } : c))
      );
      setSelectedCards([]);

      if (onMasterVerb) {
        onMasterVerb(verbId);
      }

      // Check if all matched
      const totalVerbsInRound = selectedGroupIndex === -1 ? verbsData.length : groups[selectedGroupIndex].length;
      if (matchedVerbIds.length + 1 >= totalVerbsInRound) {
        setRoundCompleted(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Bento Header & Set Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 mb-1.5 inline-block">
            Memoria & Asociación
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Rompecabezas de las 3 Formas
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Une las 4 fichas del mismo verbo: <strong>Infinitivo</strong> + <strong>Pasado</strong> + <strong>Participio</strong> + <strong>Traducción</strong>.
          </p>
        </div>

        {/* Set Selector Pills */}
        <div className="flex flex-wrap items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          {groups.map((grp, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedGroupIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedGroupIndex === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Verbos {idx * chunkSize + 1} al {idx * chunkSize + grp.length}
            </button>
          ))}
          <button
            onClick={() => setSelectedGroupIndex(-1)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedGroupIndex === -1
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Todos ({verbsData.length})
          </button>
        </div>
      </div>

      {/* Game Stats Bento Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 text-xs sm:text-sm shadow-xs gap-3">
        <div className="flex items-center gap-6 text-slate-700 dark:text-slate-300">
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider block">Progreso ronda</span>
            <span className="font-extrabold text-indigo-700 dark:text-indigo-400 text-sm">
              {matchedVerbIds.length} / {selectedGroupIndex === -1 ? verbsData.length : groups[selectedGroupIndex]?.length || 0} verbos
            </span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider block">Intentos fallidos</span>
            <span className={`font-extrabold text-sm ${mistakeCount > 0 ? 'text-rose-600 dark:text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {mistakeCount}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={initializeCards}
          className="flex items-center justify-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Barajar de nuevo</span>
        </button>
      </div>

      {/* Cards Bento Grid */}
      {!roundCompleted ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {cards.map((card) => {
            const isSelected = selectedCards.some((c) => c.id === card.id);
            const isMatched = card.matched;

            let cardStyle = 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/30 shadow-xs';
            if (isMatched) {
              cardStyle = 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 opacity-60 pointer-events-none';
            } else if (isSelected) {
              cardStyle = 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-600 dark:border-indigo-500 text-indigo-900 dark:text-indigo-100 shadow-sm scale-102';
            }

            return (
              <button
                key={card.id}
                type="button"
                id={`matrix-card-${card.id}`}
                onClick={() => handleCardClick(card)}
                className={`p-4 rounded-2xl text-center flex flex-col justify-center items-center gap-1 min-h-[95px] transition-all duration-150 select-none cursor-pointer ${cardStyle}`}
              >
                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                  isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {card.typeLabel}
                </span>
                <span className={`text-base sm:text-lg font-black ${
                  card.type !== 'spanish' ? 'font-mono' : ''
                }`}>
                  {card.text}
                </span>
                {isMatched && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Victory Bento Card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-800">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              ¡Felicitaciones! Has completado el set
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mt-1">
              Conectaste exitosamente las 3 formas gramaticales y la traducción con solo {mistakeCount} fallos.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={initializeCards}
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-xs cursor-pointer"
            >
              Jugar otra ronda
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

