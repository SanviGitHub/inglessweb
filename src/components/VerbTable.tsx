import React, { useState } from 'react';
import { Volume2, Search, ArrowRight, Sparkles, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { VerbItem, MasteryState, UserVerbProgress } from '../types';
import { playSpeech } from '../utils/speech';

interface VerbTableProps {
  onSelectVerb: (verb: VerbItem) => void;
  masteryState: MasteryState;
  audioRate: number;
  verbsData: VerbItem[];
}

export const VerbTable: React.FC<VerbTableProps> = ({
  onSelectVerb,
  masteryState,
  audioRate,
  verbsData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSpeechWord, setActiveSpeechWord] = useState<string | null>(null);

  const values = Object.values(masteryState) as UserVerbProgress[];
  const masteredCount = values.filter((v) => v.mastered).length;
  const progressPercent = Math.round((masteredCount / verbsData.length) * 100) || 0;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setActiveSpeechWord(text);
    playSpeech(text, audioRate, () => setActiveSpeechWord(null));
  };

  const filteredVerbs = verbsData.filter((verb) => {
    const matchesSearch =
      verb.infinitive.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verb.past.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verb.participle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verb.spanish.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || verb.patternCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Bento Grid Header Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Bento Cell 1: Indigo Hero (cols 12 -> md:col-span-7 lg:col-span-8) */}
        <div className="md:col-span-7 lg:col-span-8 bg-indigo-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="relative z-10">
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">
              Guía de Aprendizaje
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mt-1 tracking-tight text-white">
              {verbsData.length} Verbos Esenciales
            </h2>
            <p className="text-indigo-100 mt-2 text-sm sm:text-base font-normal max-w-xl opacity-90 leading-relaxed">
              Domina las 3 formas gramaticales (Infinitivo, Pasado simple y Participio) con audio nativo y ejemplos cotidianos.
            </p>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-indigo-200">Verbos incluidos:</span>
            {verbsData.map((v) => (
              <button
                key={v.id}
                onClick={() => onSelectVerb(v)}
                className="px-2.5 py-1 bg-white/15 hover:bg-white/30 text-white font-mono font-bold text-xs rounded-xl backdrop-blur-xs transition-colors"
              >
                {v.infinitive}
              </button>
            ))}
          </div>

          {/* Background Decorative SVG */}
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <svg width="220" height="220" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
        </div>

        {/* Bento Cell 2: Overall Mastery Gauge (cols 12 -> md:col-span-5 lg:col-span-4) */}
        <div className="md:col-span-5 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-center items-center text-center">
          <div className="w-18 h-18 rounded-full border-4 border-indigo-600 border-t-slate-100 flex items-center justify-center mb-3">
            <span className="text-2xl font-black text-slate-800">{progressPercent}%</span>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Dominio Global
          </span>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {masteredCount} de {verbsData.length} verbos dominados
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Bento Controls: Search & Category Filter */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">
              Explorador de Formas Verbales
            </h3>
            <p className="text-xs text-slate-500">
              Filtra por patrón fonético o busca cualquier forma o traducción
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-verbs-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar verbo o español..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {[
            { id: 'all', label: `Todos (${verbsData.length})` },
            { id: 'vowel-shift', label: 'Cambio de vocal' },
            { id: 'identical-past-participle', label: 'Pasado = Participio' },
            { id: 'modal', label: 'Modal con suplente' },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Structure in Bento Card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-4 sm:px-6 w-14 text-center">#</th>
                <th className="py-4 px-4 sm:px-6">Infinitivo (V1)</th>
                <th className="py-4 px-4 sm:px-6">Pasado Simple (V2)</th>
                <th className="py-4 px-4 sm:px-6">Participio (V3)</th>
                <th className="py-4 px-4 sm:px-6">Traducción</th>
                <th className="py-4 px-4 sm:px-6 text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm sm:text-base">
              {filteredVerbs.map((verb, index) => {
                const isMastered = masteryState[verb.id]?.mastered;
                const isCan = verb.id === 'can';

                return (
                  <tr
                    key={verb.id}
                    id={`verb-row-${verb.id}`}
                    onClick={() => onSelectVerb(verb)}
                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors group select-none"
                  >
                    {/* Index & Mastery Badge */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center">
                        {isMastered ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" title="Verbo dominado" />
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-100 group-hover:text-indigo-700">
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Infinitive Column */}
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg text-indigo-700 group-hover:text-indigo-900 font-mono">
                          {verb.infinitive}
                        </span>
                        <button
                          type="button"
                          id={`audio-btn-${verb.id}-inf`}
                          onClick={(e) => handleSpeak(e, verb.infinitive)}
                          title={`Pronunciar ${verb.infinitive}`}
                          className={`p-1.5 rounded-xl border transition-all ${
                            activeSpeechWord === verb.infinitive
                              ? 'bg-indigo-600 text-white border-indigo-600 scale-110'
                              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-indigo-700 hover:bg-white hover:border-indigo-300'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Past Simple Column */}
                    <td className="py-4 px-4 sm:px-6 text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 font-mono">
                          {verb.past}
                        </span>
                        <button
                          type="button"
                          id={`audio-btn-${verb.id}-past`}
                          onClick={(e) => handleSpeak(e, verb.past.replace('/', 'or'))}
                          title={`Pronunciar ${verb.past}`}
                          className={`p-1.5 rounded-xl border transition-all ${
                            activeSpeechWord === verb.past.replace('/', 'or')
                              ? 'bg-indigo-600 text-white border-indigo-600 scale-110'
                              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-indigo-700 hover:bg-white hover:border-indigo-300'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Past Participle Column */}
                    <td className="py-4 px-4 sm:px-6 text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold font-mono ${isCan ? 'text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200' : 'text-slate-800'}`}>
                          {verb.participle}
                        </span>
                        <button
                          type="button"
                          id={`audio-btn-${verb.id}-part`}
                          onClick={(e) => handleSpeak(e, verb.participle)}
                          title={`Pronunciar ${verb.participle}`}
                          className={`p-1.5 rounded-xl border transition-all ${
                            activeSpeechWord === verb.participle
                              ? 'bg-indigo-600 text-white border-indigo-600 scale-110'
                              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-indigo-700 hover:bg-white hover:border-indigo-300'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Spanish Translation Column */}
                    <td className="py-4 px-4 sm:px-6 text-slate-600 font-medium">
                      <span>{verb.spanish}</span>
                    </td>

                    {/* Action Column */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        id={`btn-open-detail-${verb.id}`}
                        onClick={() => onSelectVerb(verb)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Ejemplos</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredVerbs.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p>No se encontraron verbos que coincidan con la búsqueda.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-2 text-indigo-600 hover:underline text-sm font-bold"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Bento Bottom Cell: Special Note for CAN */}
      <div 
        id="can-verb-special-note"
        className="bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6 flex items-start gap-4 text-amber-900 shadow-xs"
      >
        <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0 text-amber-800">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900 text-sm sm:text-base flex items-center gap-2">
            <span>Regla clave del verbo <strong>can</strong>:</span>
            <span className="text-xs bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 font-mono font-bold">
              been able to
            </span>
          </h4>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            En el verbo <strong>can</strong>, <em>been able to</em> significa <strong>"podido"</strong> y se usa como 
            equivalente del participio (ejemplo: <em>"I have not been able to call you"</em> = <em>"No he podido llamarte"</em>).
            Al ser un verbo modal defectivo, no existe "canned" ni "have can".
          </p>
        </div>
      </div>

    </div>
  );
};

