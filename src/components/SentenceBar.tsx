import React, { useRef, useEffect } from 'react';
import { Volume2, Delete, Trash2, X } from 'lucide-react';
import { AACCardItem, AACSettings } from '../types/aac';
import { CARD_COLOR_CLASSES, getFontStyles } from '../utils/theme';

interface SentenceBarProps {
  sentence: AACCardItem[];
  settings: AACSettings;
  isSpeakingAll: boolean;
  activeSpokenIndex: number | null;
  onSpeakAll: () => void;
  onRemoveLast: () => void;
  onRemoveIndex: (index: number) => void;
  onClearAll: () => void;
}

export const SentenceBar: React.FC<SentenceBarProps> = ({
  sentence,
  settings,
  isSpeakingAll,
  activeSpokenIndex,
  onSpeakAll,
  onRemoveLast,
  onRemoveIndex,
  onClearAll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fontStyles = getFontStyles(settings.fontSize);

  // Auto-scroll to end of sentence when a new word is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [sentence.length]);

  return (
    <section
      aria-label="문장 만들기 상자"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t-3 border-amber-300 shadow-2xl p-2.5 sm:p-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Sentence tiles container */}
        <div className="flex-1 flex items-center min-h-[64px] sm:min-h-[72px] bg-amber-50/70 border-2 border-dashed border-amber-300/80 rounded-2xl px-3 py-2 overflow-x-auto scrollbar-thin">
          <div
            ref={containerRef}
            className="flex items-center gap-2 sm:gap-2.5 min-w-full overflow-x-auto py-1"
          >
            {sentence.length === 0 ? (
              <p className="text-slate-400 font-medium text-base sm:text-lg flex items-center gap-2 select-none mx-auto sm:mx-0">
                <span className="text-xl sm:text-2xl">👆</span>
                <span>카드를 누르면 여기에 문장이 만들어져요</span>
              </p>
            ) : (
              sentence.map((item, idx) => {
                const colorStyles = CARD_COLOR_CLASSES[item.colorTheme || 'sky'];
                const isCurrentSpeaking = activeSpokenIndex === idx;

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className={`shrink-0 flex items-center gap-1.5 sm:gap-2 pl-3 pr-2 py-1.5 sm:py-2 rounded-xl border-2 transition-all ${
                      colorStyles.bg
                    } ${colorStyles.border} ${
                      isCurrentSpeaking
                        ? 'ring-4 ring-emerald-500 scale-105 bg-emerald-100 shadow-md font-black'
                        : 'shadow-2xs'
                    }`}
                  >
                    {/* Tile icon */}
                    <span className="text-xl sm:text-2xl leading-none" aria-hidden="true">
                      {item.icon}
                    </span>

                    {/* Tile text */}
                    <span
                      className={`text-slate-900 font-bold whitespace-nowrap ${
                        settings.fontSize === 'huge'
                          ? 'text-xl sm:text-2xl'
                          : settings.fontSize === 'large'
                          ? 'text-lg sm:text-xl'
                          : 'text-base sm:text-lg'
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Quick remove button on each tile */}
                    <button
                      type="button"
                      onClick={() => onRemoveIndex(idx)}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg hover:bg-black/10 active:scale-90 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                      title={`${item.label} 지우기`}
                      aria-label={`${item.label} 단어 지우기`}
                    >
                      <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Buttons: Speak All / Remove Last / Clear All */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 justify-end">
          {/* Read Entire Sentence Button */}
          <button
            type="button"
            onClick={onSpeakAll}
            disabled={sentence.length === 0 || isSpeakingAll}
            className={`min-h-[52px] sm:min-h-[60px] px-4 sm:px-6 rounded-2xl font-black text-base sm:text-xl border-2 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 focus-visible:ring-4 focus-visible:ring-emerald-400 select-none ${
              sentence.length > 0 && !isSpeakingAll
                ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/30'
                : isSpeakingAll
                ? 'bg-emerald-400 border-emerald-500 text-white animate-pulse'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            }`}
            aria-label="전체 문장 말하기"
          >
            <Volume2 className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="whitespace-nowrap">
              {isSpeakingAll ? '말하는 중...' : '전체 문장 말하기'}
            </span>
          </button>

          {/* Delete Last Item Button */}
          <button
            type="button"
            onClick={onRemoveLast}
            disabled={sentence.length === 0}
            className="min-h-[52px] sm:min-h-[60px] px-3.5 sm:px-4 rounded-2xl font-bold text-sm sm:text-base border-2 border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200 transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 focus-visible:ring-3 focus-visible:ring-amber-400 select-none"
            title="마지막으로 넣은 카드 하나 지우기"
            aria-label="마지막 표현 지우기"
          >
            <Delete className="w-5 h-5 text-amber-800" />
            <span className="hidden sm:inline">하나 지우기</span>
          </button>

          {/* Clear All Button */}
          <button
            type="button"
            onClick={onClearAll}
            disabled={sentence.length === 0}
            className="min-h-[52px] sm:min-h-[60px] px-3.5 sm:px-4 rounded-2xl font-bold text-sm sm:text-base border-2 border-slate-200 bg-slate-100 text-slate-700 hover:bg-rose-100 hover:text-rose-900 hover:border-rose-300 transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 focus-visible:ring-3 focus-visible:ring-rose-400 select-none"
            title="작성된 모든 문장 비우기"
            aria-label="모두 지우기"
          >
            <Trash2 className="w-5 h-5 text-slate-600" />
            <span className="hidden sm:inline">모두 지우기</span>
          </button>
        </div>
      </div>
    </section>
  );
};
