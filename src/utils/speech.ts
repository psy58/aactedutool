export interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  default: boolean;
  isKorean: boolean;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSupported: boolean = false;
  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    } else {
      this.isSupported = false;
    }
  }

  public checkSupport(): boolean {
    return this.isSupported && !!this.synth;
  }

  public loadVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    try {
      this.voices = this.synth.getVoices();
      // Auto pick best Korean voice
      const koreanVoices = this.voices.filter(
        (v) => v.lang.toLowerCase().startsWith('ko') || v.lang.includes('KR')
      );
      if (koreanVoices.length > 0) {
        // Prefer Google or high quality voices if present
        const googleKo = koreanVoices.find((v) =>
          v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('korean')
        );
        this.preferredVoice = googleKo || koreanVoices[0];
      }
      return this.voices;
    } catch {
      return [];
    }
  }

  public getKoreanVoices(): VoiceOption[] {
    this.loadVoices();
    return this.voices.map((v) => ({
      name: v.name,
      lang: v.lang,
      voiceURI: v.voiceURI,
      default: v.default,
      isKorean: v.lang.toLowerCase().startsWith('ko') || v.lang.includes('KR'),
    }));
  }

  public setVoiceByURI(uri?: string) {
    if (!uri) return;
    const found = this.voices.find((v) => v.voiceURI === uri);
    if (found) {
      this.preferredVoice = found;
    }
  }

  public cancel() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // Ignore cancellation error
      }
    }
  }

  public speak(
    text: string,
    options: {
      rate?: number; // 0.7 to 1.0
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): boolean {
    if (!this.checkSupport() || !this.synth) {
      if (options.onError) {
        options.onError(new Error('음성 합성을 지원하지 않는 브라우저입니다.'));
      }
      return false;
    }

    try {
      // Cancel any ongoing speech so rapid clicks don't queue endlessly or overlap
      this.synth.cancel();

      // Some browsers (like Chrome) pause synthesis if idle, calling resume helps unfreeze
      if (this.synth.paused) {
        this.synth.resume();
      }

      const cleanText = text.trim();
      if (!cleanText) return false;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ko-KR';
      utterance.rate = options.rate ?? 0.8; // Default slightly slower for clarity
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      // Assign voice
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      } else {
        const koVoice = this.voices.find(
          (v) => v.lang.toLowerCase().startsWith('ko') || v.lang.includes('KR')
        );
        if (koVoice) {
          utterance.voice = koVoice;
        }
      }

      utterance.onstart = () => {
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = (e) => {
        if (options.onError) options.onError(e);
      };

      this.synth.speak(utterance);
      return true;
    } catch (e) {
      if (options.onError) options.onError(e);
      return false;
    }
  }
}

export const speechService = new SpeechService();
