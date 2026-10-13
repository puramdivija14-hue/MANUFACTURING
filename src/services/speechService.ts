/**
 * Voice & Text-to-Speech Audio Service
 * Makes ManuGenius AI comfortable and accessible to everyone by reading
 * technical manufacturing processes, operation steps, safety warnings, and AI ideas aloud.
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isBrowserSupported: boolean = false;
  private activeListeners: Set<(isSpeaking: boolean) => void> = new Set();
  private rate: number = 1.0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isBrowserSupported = true;
    }
  }

  public isSupported(): boolean {
    return this.isBrowserSupported;
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.7, Math.min(1.5, newRate));
    if (this.currentUtterance) {
      this.currentUtterance.rate = this.rate;
    }
  }

  public getRate(): number {
    return this.rate;
  }

  public subscribe(listener: (isSpeaking: boolean) => void): () => void {
    this.activeListeners.add(listener);
    return () => {
      this.activeListeners.delete(listener);
    };
  }

  private notify(isSpeaking: boolean) {
    this.activeListeners.forEach(listener => {
      try {
        listener(isSpeaking);
      } catch (e) {
        console.error('Error in speech listener:', e);
      }
    });
  }

  /**
   * Sanitizes markdown text and emojis so speech synthesis reads cleanly
   */
  public cleanTextForSpeech(text: string): string {
    if (!text) return '';
    return text
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, ' Code snippet omitted. ')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove markdown headers
      .replace(/#{1,6}\s+/g, '')
      // Remove bold and italics
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove markdown links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove bullet asterisks or dashes at start of line
      .replace(/^[\*\-\+]\s+/gm, '')
      // Remove common emojis
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Speaks the given text aloud
   */
  public speak(
    rawText: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    }
  ): void {
    if (!this.synth || !this.isBrowserSupported) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // Stop any ongoing speech
    this.stop();

    const textToSpeak = this.cleanTextForSpeech(rawText);
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    this.currentUtterance = utterance;
    utterance.rate = this.rate;
    utterance.pitch = 1.0;

    // Pick natural English voice if available
    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(
      v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('David') ||
          v.name.includes('Zira'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.notify(true);
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.notify(false);
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      // Don't log error if user simply cancelled/stopped
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.error('Speech synthesis error:', e);
      }
      this.currentUtterance = null;
      this.notify(false);
      options?.onError?.();
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.error('Failed to trigger speech:', err);
      this.notify(false);
    }
  }

  /**
   * Stops any active speech synthesis immediately
   */
  public stop(): void {
    if (!this.synth) return;
    try {
      this.synth.cancel();
    } catch (e) {
      console.error('Error cancelling speech:', e);
    }
    this.currentUtterance = null;
    this.notify(false);
  }

  public isSpeaking(): boolean {
    return !!(this.synth && (this.synth.speaking || this.currentUtterance));
  }
}

export const speechService = new SpeechService();
