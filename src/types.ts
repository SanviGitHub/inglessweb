export type VerbTense = 'infinitive' | 'past' | 'participle';

export interface VerbExample {
  id: string;
  tense: VerbTense;
  tenseLabel: string;
  english: string;
  spanish: string;
  context: string; // e.g. "En el trabajo", "En la cafetería", "Vida diaria"
  highlightWord: string;
}

export interface DialogueExchange {
  speaker: string;
  avatar: string;
  english: string;
  spanish: string;
  verbUsed: string;
  blankWord?: string;
  options?: string[];
}

export interface DialogueScenario {
  id: string;
  title: string;
  description: string;
  verbId: string;
  verbName: string;
  exchanges: DialogueExchange[];
}

export interface VerbItem {
  id: string;
  infinitive: string;
  past: string;
  participle: string;
  spanish: string;
  phonetic: {
    infinitive: string;
    past: string;
    participle: string;
    guideEs: string; // Pronunciación aproximada en español
  };
  explanation: string;
  mnemonicTip: string;
  commonMistake: string;
  specialNote?: string;
  examples: VerbExample[];
  patternCategory: 'vowel-shift' | 'consonant-change' | 'modal' | 'identical-past-participle';
  patternLabel: string;
}

export interface ExerciseQuestion {
  id: string;
  type: 'fill-blank' | 'choose-tense' | 'listen-spelling' | 'translate-context';
  verbId: string;
  sentencePrompt: string; // with "___" for blank
  sentenceTranslation: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  targetTense: VerbTense;
  contextHint: string;
  audioPromptText?: string;
}

export interface UserVerbProgress {
  practicedCount: number;
  correctCount: number;
  lastPracticed?: string;
  mastered: boolean;
}

export type MasteryState = Record<string, UserVerbProgress>;
