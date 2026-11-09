import React, { useState } from 'react';
import { AACCardItem, AACSettings } from '../types/aac';
import { CARD_COLOR_CLASSES, getFontStyles } from '../utils/theme';

interface AACCardProps {
  card: AACCardItem;
  settings: AACSettings;
  onClick: (card: AACCardItem) => void;
}

export const AACCard: React.FC<AACCardProps> = ({ card, settings, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const colorTheme = card.colorTheme || 'sky';
  const colorStyles = CARD_COLOR_CLASSES[colorTheme];
  const fontStyles = getFontStyles(settings.fontSize);

  const handleClick = () => {
    setIsPressed(true);
    onClick(card);
    setTimeout(() => setIsPressed(false), 260);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${card.label} 선택하기`}
      className={`relative group w-full min-h-[110px] sm:min-h-[140px] md:min-h-[160px] p-3 sm:p-5 rounded-3xl border-2 sm:border-3 transition-all duration-150 flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 text-center shadow-xs select-none cursor-pointer focus-visible:outline-hidden ${
        colorStyles.bg
      } ${colorStyles.border} ${
        isPressed ? 'scale-95 ring-4 ring-amber-400 bg-amber-100/90' : 'hover:scale-[1.02] hover:shadow-md'
      }`}
    >
      {/* Self-determination badge for vital refusal/safety/assistance phrases */}
      {card.isSelfDetermination && (
        <span
          className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/90 text-rose-700 border border-rose-200 shadow-2xs"
          title="자기결정 및 도움 요청 표현"
        >
          자기표현
        </span>
      )}

      {/* Card Icon/Emoji (if displayMode is 'both') */}
      {settings.displayMode === 'both' && (
        <span
          className={`${fontStyles.cardIcon} transition-transform group-hover:scale-110 shrink-0 leading-none`}
          role="img"
          aria-hidden="true"
        >
          {card.icon}
        </span>
      )}

      {/* Card Text Label */}
      <span
        className={`${fontStyles.cardText} ${colorStyles.text} leading-tight text-center break-keep px-1`}
      >
        {card.label}
      </span>

      {/* Spoken indicator ripple effect on press */}
      {isPressed && (
        <span className="absolute inset-0 rounded-3xl bg-amber-300/20 pointer-events-none animate-ping" />
      )}
    </button>
  );
};
