export type CardColorTheme =
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'sky'
  | 'indigo'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'slate';

export interface AACCardItem {
  id: string;
  categoryId: string;
  icon: string;
  label: string;
  speechText: string;
  colorTheme?: CardColorTheme;
  isSelfDetermination?: boolean; // For "아니요", "싫어요", "그만할래요", "도와주세요" etc.
}

export interface AACCategory {
  id: string;
  name: string;
  icon: string;
  themeColor: CardColorTheme;
  description?: string;
}

export type GridColumns = 2 | 3 | 4 | 'auto';
export type AACFontSize = 'normal' | 'large' | 'huge';
export type SpeechSpeed = 'slow' | 'normal';
export type DisplayMode = 'both' | 'textOnly';
export type ThemePalette = 'pastel' | 'warm' | 'mint' | 'highContrast';

export interface AACSettings {
  columns: GridColumns;
  fontSize: AACFontSize;
  speechSpeed: SpeechSpeed;
  speechEnabled: boolean;
  displayMode: DisplayMode;
  selectedVoiceURI?: string;
  themePalette: ThemePalette;
  speakOnCardClick: boolean;
  repeatCardEnabled: boolean;
}

export interface AACBackupData {
  version: string;
  exportedAt: string;
  categories: AACCategory[];
  cards: AACCardItem[];
  settings: AACSettings;
}
