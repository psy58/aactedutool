import React from 'react';
import { Volume2, VolumeX, Settings, Home, Sparkles } from 'lucide-react';
import { AACSettings } from '../types/aac';

interface HeaderProps {
  settings: AACSettings;
  onToggleSpeech: () => void;
  onTestSpeech: () => void;
  onGoHome: () => void;
  onOpenSettings: () => void;
  isTestingVoice: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onToggleSpeech,
  onTestSpeech,
  onGoHome,
  onOpenSettings,
  isTestingVoice,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
        {/* Left: App Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 text-left group focus-visible:ring-3 focus-visible:ring-amber-500 rounded-xl p-1 -m-1 transition-transform active:scale-95"
            aria-label="홈으로 이동 및 첫 번째 카테고리 보기"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl sm:text-3xl shadow-xs group-hover:scale-105 transition-transform">
              💬
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                내 마음을 전해요
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 hidden sm:block">
                특수학급 학생을 위한 AAC 의사소통판
              </p>
            </div>
          </button>
        </div>

        {/* Right: Quick Accessibility & Teacher Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Home Button */}
          <button
            onClick={onGoHome}
            type="button"
            className="h-11 px-3 sm:px-4 rounded-xl font-bold text-sm sm:text-base border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1.5 focus-visible:ring-3 focus-visible:ring-slate-400"
            title="첫 번째 화면으로 이동"
            aria-label="처음 카테고리로 이동"
          >
            <Home className="w-5 h-5 text-slate-600" />
            <span className="hidden md:inline">처음으로</span>
          </button>

          {/* Voice Toggle Button */}
          <button
            onClick={onToggleSpeech}
            type="button"
            className={`h-11 px-3 sm:px-4 rounded-xl font-bold text-sm sm:text-base border transition-all flex items-center gap-2 active:scale-95 focus-visible:ring-3 ${
              settings.speechEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 focus-visible:ring-emerald-400'
                : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100 focus-visible:ring-rose-400'
            }`}
            aria-label={settings.speechEnabled ? '소리 켜짐 (누르면 끕니다)' : '소리 꺼짐 (누르면 켭니다)'}
          >
            {settings.speechEnabled ? (
              <>
                <Volume2 className="w-5 h-5 text-emerald-600 animate-pulse" />
                <span className="hidden sm:inline">소리 켬</span>
              </>
            ) : (
              <>
                <VolumeX className="w-5 h-5 text-rose-600" />
                <span className="hidden sm:inline">소리 끔</span>
              </>
            )}
          </button>

          {/* Voice Test Button */}
          {settings.speechEnabled && (
            <button
              onClick={onTestSpeech}
              disabled={isTestingVoice}
              type="button"
              className="h-11 px-3 sm:px-3.5 rounded-xl font-bold text-xs sm:text-sm border border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100 active:scale-95 transition-all hidden lg:flex items-center gap-1.5 focus-visible:ring-3 focus-visible:ring-sky-400 disabled:opacity-50"
              title="한국어 발음 소리 테스트"
              aria-label="음성 테스트 버튼"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>{isTestingVoice ? '말하는 중...' : '소리 시험'}</span>
            </button>
          )}

          {/* Teacher Settings Button */}
          <button
            onClick={onOpenSettings}
            type="button"
            className="h-11 px-3 sm:px-4 rounded-xl font-bold text-sm sm:text-base border-2 border-amber-300 bg-amber-400 text-amber-950 hover:bg-amber-300 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs focus-visible:ring-3 focus-visible:ring-amber-500"
            aria-label="교사용 편집 및 맞춤 설정 모달 열기"
          >
            <Settings className="w-5 h-5 text-amber-950" />
            <span className="font-extrabold">교사 설정</span>
          </button>
        </div>
      </div>
    </header>
  );
};
