import React from 'react';
import { VolumeX, X, Sparkles } from 'lucide-react';

interface SpeechStatusBannerProps {
  isSupported: boolean;
  onTestVoice: () => void;
  onDismiss: () => void;
  isDismissed: boolean;
}

export const SpeechStatusBanner: React.FC<SpeechStatusBannerProps> = ({
  isSupported,
  onTestVoice,
  onDismiss,
  isDismissed,
}) => {
  if (isDismissed || isSupported) return null;

  return (
    <div
      role="alert"
      className="bg-amber-100 border-b border-amber-300 px-4 py-2.5 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-medium z-40 relative"
    >
      <div className="flex items-center gap-2">
        <VolumeX className="w-5 h-5 text-amber-800 shrink-0" />
        <span>
          <strong>안내:</strong> 현재 브라우저 또는 실행 환경에서는 자동 음성 재생이 제한되어
          있거나 지원되지 않습니다. 소리 없이도 화면 터치와 문장 만들기는 정상적으로 이용하실 수
          있습니다.
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onTestVoice}
          className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded-lg font-bold text-amber-950 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>소리 다시 테스트</span>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="w-7 h-7 rounded-lg hover:bg-amber-200 flex items-center justify-center text-amber-800"
          aria-label="안내 닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
