import { CardColorTheme, AACFontSize, GridColumns, ThemePalette } from '../types/aac';

export const CARD_COLOR_CLASSES: Record<
  CardColorTheme,
  {
    bg: string;
    border: string;
    activeBorder: string;
    badgeBg: string;
    badgeText: string;
    text: string;
  }
> = {
  sky: {
    bg: 'bg-sky-50 hover:bg-sky-100/80 active:bg-sky-200/80',
    border: 'border-sky-300',
    activeBorder: 'ring-4 ring-sky-400',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
    text: 'text-sky-950',
  },
  amber: {
    bg: 'bg-amber-50 hover:bg-amber-100/80 active:bg-amber-200/80',
    border: 'border-amber-300',
    activeBorder: 'ring-4 ring-amber-400',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    text: 'text-amber-950',
  },
  rose: {
    bg: 'bg-rose-50 hover:bg-rose-100/80 active:bg-rose-200/80',
    border: 'border-rose-300',
    activeBorder: 'ring-4 ring-rose-400',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    text: 'text-rose-950',
  },
  emerald: {
    bg: 'bg-emerald-50 hover:bg-emerald-100/80 active:bg-emerald-200/80',
    border: 'border-emerald-300',
    activeBorder: 'ring-4 ring-emerald-400',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    text: 'text-emerald-950',
  },
  indigo: {
    bg: 'bg-indigo-50 hover:bg-indigo-100/80 active:bg-indigo-200/80',
    border: 'border-indigo-300',
    activeBorder: 'ring-4 ring-indigo-400',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    text: 'text-indigo-950',
  },
  purple: {
    bg: 'bg-purple-50 hover:bg-purple-100/80 active:bg-purple-200/80',
    border: 'border-purple-300',
    activeBorder: 'ring-4 ring-purple-400',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    text: 'text-purple-950',
  },
  orange: {
    bg: 'bg-orange-50 hover:bg-orange-100/80 active:bg-orange-200/80',
    border: 'border-orange-300',
    activeBorder: 'ring-4 ring-orange-400',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800',
    text: 'text-orange-950',
  },
  teal: {
    bg: 'bg-teal-50 hover:bg-teal-100/80 active:bg-teal-200/80',
    border: 'border-teal-300',
    activeBorder: 'ring-4 ring-teal-400',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-800',
    text: 'text-teal-950',
  },
  slate: {
    bg: 'bg-slate-50 hover:bg-slate-100/80 active:bg-slate-200/80',
    border: 'border-slate-300',
    activeBorder: 'ring-4 ring-slate-400',
    badgeBg: 'bg-slate-200',
    badgeText: 'text-slate-800',
    text: 'text-slate-950',
  },
};

export function getGridColumnClass(cols: GridColumns): string {
  switch (cols) {
    case 2:
      return 'grid-cols-2';
    case 3:
      return 'grid-cols-2 sm:grid-cols-3';
    case 4:
      return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
    case 'auto':
    default:
      return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
  }
}

export function getFontStyles(size: AACFontSize): {
  cardText: string;
  cardIcon: string;
  sentenceText: string;
} {
  switch (size) {
    case 'huge':
      return {
        cardText: 'text-2xl sm:text-3xl font-bold tracking-tight',
        cardIcon: 'text-5xl sm:text-6xl',
        sentenceText: 'text-2xl sm:text-3xl font-extrabold',
      };
    case 'large':
      return {
        cardText: 'text-xl sm:text-2xl font-bold tracking-tight',
        cardIcon: 'text-4xl sm:text-5xl',
        sentenceText: 'text-xl sm:text-2xl font-bold',
      };
    case 'normal':
    default:
      return {
        cardText: 'text-lg sm:text-xl font-bold tracking-tight',
        cardIcon: 'text-3xl sm:text-4xl',
        sentenceText: 'text-lg sm:text-xl font-bold',
      };
  }
}

export function getGlobalPaletteClasses(palette: ThemePalette): {
  pageBg: string;
  cardShadow: string;
} {
  switch (palette) {
    case 'warm':
      return {
        pageBg: 'bg-[#FCF8F2]',
        cardShadow: 'shadow-sm shadow-amber-900/5',
      };
    case 'mint':
      return {
        pageBg: 'bg-[#F2F8F5]',
        cardShadow: 'shadow-sm shadow-emerald-900/5',
      };
    case 'highContrast':
      return {
        pageBg: 'bg-white',
        cardShadow: 'shadow-md border-2',
      };
    case 'pastel':
    default:
      return {
        pageBg: 'bg-[#FAF9F5]',
        cardShadow: 'shadow-sm shadow-slate-900/5',
      };
  }
}
