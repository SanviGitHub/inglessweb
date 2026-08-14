/**
 * Web Speech API Utility for clear native English pronunciation
 */

let speechSynth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynth = window.speechSynthesis;
}

let preferredVoice: SpeechSynthesisVoice | null = null;

function loadVoices() {
  if (!speechSynth) return;
  const voices = speechSynth.getVoices();
  // Try to find a high quality English voice (US or UK)
  preferredVoice =
    voices.find(v => v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Premium'))) ||
    voices.find(v => v.lang.startsWith('en')) ||
    null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (speechSynth?.onvoiceschanged !== undefined) {
    speechSynth.onvoiceschanged = loadVoices;
  }
}

export function playSpeech(text: string, rate: number = 0.9, onEnd?: () => void): boolean {
  if (!speechSynth || typeof window === 'undefined') {
    return false;
  }

  try {
    // Cancel any previous speaking
    speechSynth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate; // 0.75 for slow, 1.0 for normal
    utterance.pitch = 1.0;

    if (!preferredVoice) {
      loadVoices();
    }
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    speechSynth.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeech() {
  if (speechSynth) {
    speechSynth.cancel();
  }
}
