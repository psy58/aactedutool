import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { AACCard } from './components/AACCard';
import { SentenceBar } from './components/SentenceBar';
import { TeacherModal } from './components/TeacherModal';
import { SpeechStatusBanner } from './components/SpeechStatusBanner';
import { AACCardItem, AACCategory, AACSettings } from './types/aac';
import { storage } from './utils/storage';
import { speechService } from './utils/speech';
import { getGridColumnClass, getGlobalPaletteClasses } from './utils/theme';
import { ShieldAlert, Sparkles, MessageCircleQuestion } from 'lucide-react';

export default function App() {
  // Application Data States
  const [categories, setCategories] = useState<AACCategory[]>(() => storage.loadCategories());
  const [cards, setCards] = useState<AACCardItem[]>(() => storage.loadCards());
  const [settings, setSettings] = useState<AACSettings>(() => storage.loadSettings());

  // Interactive States
  const [activeCategoryId, setActiveCategoryId] = useState<string>(() => {
    const loaded = storage.loadCategories();
    return loaded[0]?.id || 'cat-basic';
  });
  const [sentence, setSentence] = useState<AACCardItem[]>([]);
  const [isSpeakingAll, setIsSpeakingAll] = useState<boolean>(false);
  const [activeSpokenIndex, setActiveSpokenIndex] = useState<number | null>(null);
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isSpeechBannerDismissed, setIsSpeechBannerDismissed] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [quickFeedbackMessage, setQuickFeedbackMessage] = useState<string | null>(null);

  // Check speech synthesis support on mount
  useEffect(() => {
    const supported = speechService.checkSupport();
    setSpeechSupported(supported);
    if (settings.selectedVoiceURI) {
      speechService.setVoiceByURI(settings.selectedVoiceURI);
    }
  }, [settings.selectedVoiceURI]);

  // Persist categories when changed
  useEffect(() => {
    storage.saveCategories(categories);
  }, [categories]);

  // Persist cards when changed
  useEffect(() => {
    storage.saveCards(cards);
  }, [cards]);

  // Persist settings when changed
  useEffect(() => {
    storage.saveSettings(settings);
  }, [settings]);

  // Active category cards
  const currentCards = useMemo(() => {
    return cards.filter((c) => c.categoryId === activeCategoryId);
  }, [cards, activeCategoryId]);

  // Active category info
  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId) || categories[0];
  }, [categories, activeCategoryId]);

  // Self-determination & emergency quick cards
  const quickRefusalCards = useMemo(() => {
    return cards.filter((c) => c.isSelfDetermination).slice(0, 5);
  }, [cards]);

  // Quick feedback toast helper
  const showFeedback = (msg: string) => {
    setQuickFeedbackMessage(msg);
    const timer = setTimeout(() => setQuickFeedbackMessage(null), 1800);
    return () => clearTimeout(timer);
  };

  // 1. Handle Card Selection
  const handleCardClick = useCallback(
    (card: AACCardItem) => {
      // 1. Voice playback
      if (settings.speechEnabled) {
        speechService.speak(card.speechText, {
          rate: settings.speechSpeed === 'slow' ? 0.75 : 1.0,
          onError: () => {
            setSpeechSupported(false);
          },
        });
      }

      // 2. Append to sentence
      setSentence((prev) => [...prev, card]);
      showFeedback(`"${card.label}" 추가됨`);
    },
    [settings.speechEnabled, settings.speechSpeed]
  );

  // 2. Read entire combined sentence
  const handleSpeakAll = useCallback(() => {
    if (sentence.length === 0) return;

    if (!settings.speechEnabled) {
      showFeedback('상단에서 소리를 먼저 켜주세요');
      return;
    }

    setIsSpeakingAll(true);
    setActiveSpokenIndex(null);

    // Form complete sentence text
    const fullText = sentence.map((item) => item.speechText).join(' ');

    // Sequence word highlighting simulation during speech
    let currentIdx = 0;
    const wordInterval = setInterval(() => {
      if (currentIdx < sentence.length) {
        setActiveSpokenIndex(currentIdx);
        currentIdx++;
      } else {
        clearInterval(wordInterval);
      }
    }, (settings.speechSpeed === 'slow' ? 850 : 650));

    speechService.speak(fullText, {
      rate: settings.speechSpeed === 'slow' ? 0.75 : 1.0,
      onStart: () => {
        setIsSpeakingAll(true);
      },
      onEnd: () => {
        clearInterval(wordInterval);
        setIsSpeakingAll(false);
        setActiveSpokenIndex(null);
      },
      onError: () => {
        clearInterval(wordInterval);
        setIsSpeakingAll(false);
        setActiveSpokenIndex(null);
      },
    });
  }, [sentence, settings.speechEnabled, settings.speechSpeed]);

  // 3. Remove last item
  const handleRemoveLast = useCallback(() => {
    setSentence((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  // 4. Remove by index
  const handleRemoveIndex = useCallback((indexToRemove: number) => {
    setSentence((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }, []);

  // 5. Clear all items
  const handleClearAll = useCallback(() => {
    speechService.cancel();
    setSentence([]);
    setIsSpeakingAll(false);
    setActiveSpokenIndex(null);
  }, []);

  // 6. Test speech button
  const handleTestSpeech = useCallback(() => {
    setIsTestingVoice(true);
    speechService.speak('안녕하세요! 내 마음을 전해요 의사소통판입니다.', {
      rate: settings.speechSpeed === 'slow' ? 0.75 : 1.0,
      onEnd: () => setIsTestingVoice(false),
      onError: () => {
        setIsTestingVoice(false);
        alert('이 기기에서는 음성 합성을 지원하지 않거나 소리가 차단되어 있습니다.');
      },
    });
  }, [settings.speechSpeed]);

  // 7. Toggle speech on/off
  const handleToggleSpeech = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.speechEnabled;
      if (!next) {
        speechService.cancel();
      }
      return { ...prev, speechEnabled: next };
    });
  }, []);

  // 8. Go Home
  const handleGoHome = useCallback(() => {
    if (categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categories]);

  // Teacher CRUD Handlers
  const handleAddCard = (newCardData: Omit<AACCardItem, 'id'>) => {
    const newCard: AACCardItem = {
      ...newCardData,
      id: `custom-card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setCards((prev) => [newCard, ...prev]);
  };

  const handleUpdateCard = (updatedCard: AACCardItem) => {
    setCards((prev) => prev.map((c) => (c.id === updatedCard.id ? updatedCard : c)));
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setSentence((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleAddCategory = (newCatData: Omit<AACCategory, 'id'>) => {
    const newCat: AACCategory = {
      ...newCatData,
      id: `custom-cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    setActiveCategoryId(newCat.id);
  };

  const handleUpdateCategory = (updatedCat: AACCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => {
      const filtered = prev.filter((c) => c.id !== categoryId);
      if (activeCategoryId === categoryId && filtered.length > 0) {
        setActiveCategoryId(filtered[0].id);
      }
      return filtered;
    });
    setCards((prev) => prev.filter((c) => c.categoryId !== categoryId));
  };

  const handleUpdateSettings = (partial: Partial<AACSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const handleExportBackup = () => {
    storage.exportJSON(categories, cards, settings);
  };

  const handleImportBackup = async (file: File) => {
    const data = await storage.parseJSONFile(file);
    if (data.categories) setCategories(data.categories);
    if (data.cards) setCards(data.cards);
    if (data.settings) setSettings(data.settings);
    if (data.categories && data.categories.length > 0) {
      setActiveCategoryId(data.categories[0].id);
    }
  };

  const handleResetToDefault = () => {
    const def = storage.resetAll();
    setCategories(def.categories);
    setCards(def.cards);
    setSettings(def.settings);
    setActiveCategoryId(def.categories[0].id);
    setSentence([]);
  };

  const paletteStyles = getGlobalPaletteClasses(settings.themePalette);
  const gridColClass = getGridColumnClass(settings.columns);

  return (
    <div
      className={`min-h-screen ${paletteStyles.pageBg} text-slate-900 flex flex-col font-sans transition-colors duration-200 pb-32 sm:pb-36`}
    >
      {/* Fallback Audio Notice Banner if Web Speech unsupported or blocked */}
      <SpeechStatusBanner
        isSupported={speechSupported}
        onTestVoice={handleTestSpeech}
        onDismiss={() => setIsSpeechBannerDismissed(true)}
        isDismissed={isSpeechBannerDismissed}
      />

      {/* Top Header */}
      <Header
        settings={settings}
        onToggleSpeech={handleToggleSpeech}
        onTestSpeech={handleTestSpeech}
        onGoHome={handleGoHome}
        onOpenSettings={() => setIsTeacherModalOpen(true)}
        isTestingVoice={isTestingVoice}
      />

      {/* Category Navigation Bar */}
      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={(id) => setActiveCategoryId(id)}
      />

      {/* Quick Access Bar for Self-Determination & Urgent Requests */}
      {/* Provides immediate 1-tap access to '네', '아니요', '그만할래요', '도와주세요', '쉬고 싶어요' regardless of category */}
      <aside
        aria-label="빠른 자기표현 및 도움 요청"
        className="max-w-7xl mx-auto w-full px-3 sm:px-6 pt-3 sm:pt-4"
      >
        <div className="bg-amber-100/90 border-2 border-amber-300 rounded-2xl p-2 sm:p-2.5 flex items-center justify-between gap-2 overflow-x-auto shadow-2xs">
          <div className="flex items-center gap-1.5 shrink-0 pl-1">
            <ShieldAlert className="w-4 h-4 text-amber-800" />
            <span className="text-xs sm:text-sm font-black text-amber-950 whitespace-nowrap">
              빠른 표현:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
            {quickRefusalCards.map((qc) => (
              <button
                key={`quick-${qc.id}`}
                type="button"
                onClick={() => handleCardClick(qc)}
                className="shrink-0 h-9 sm:h-10 px-3 rounded-xl bg-white hover:bg-amber-200/90 border border-amber-400 font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer focus-visible:ring-3 focus-visible:ring-amber-500"
                aria-label={`빠른 표현: ${qc.label}`}
              >
                <span>{qc.icon}</span>
                <span>{qc.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Expression Cards Area */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 flex-1">
        {/* Category Header Label */}
        <div className="flex items-center justify-between gap-3 mb-3.5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{activeCategory?.icon}</span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              {activeCategory?.name}
            </h2>
            <span className="text-xs sm:text-sm font-bold text-slate-500">
              ({currentCards.length}개 표현)
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            카드를 누르면 소리가 나고 문장에 더해져요
          </span>
        </div>

        {/* Expression Cards Grid */}
        {currentCards.length === 0 ? (
          <div className="bg-white/80 border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center space-y-3">
            <MessageCircleQuestion className="w-12 h-12 text-slate-400 mx-auto" />
            <p className="text-base sm:text-lg font-bold text-slate-600">
              이 카테고리에는 아직 표현 카드가 없습니다.
            </p>
            <button
              type="button"
              onClick={() => setIsTeacherModalOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 font-black rounded-xl text-amber-950 text-sm shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>새 표현 카드 추가하기</span>
            </button>
          </div>
        ) : (
          <div className={`grid ${gridColClass} gap-3 sm:gap-4 md:gap-5`}>
            {currentCards.map((card) => (
              <AACCard
                key={card.id}
                card={card}
                settings={settings}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Gentle Feedback Toast */}
      {quickFeedbackMessage && (
        <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900/90 text-white font-bold text-sm px-4 py-2 rounded-2xl shadow-lg pointer-events-none animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2">
          <span>✓</span>
          <span>{quickFeedbackMessage}</span>
        </div>
      )}

      {/* Bottom Fixed Sentence Bar */}
      <SentenceBar
        sentence={sentence}
        settings={settings}
        isSpeakingAll={isSpeakingAll}
        activeSpokenIndex={activeSpokenIndex}
        onSpeakAll={handleSpeakAll}
        onRemoveLast={handleRemoveLast}
        onRemoveIndex={handleRemoveIndex}
        onClearAll={handleClearAll}
      />

      {/* Teacher Settings & Expression Customization Modal */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        categories={categories}
        cards={cards}
        settings={settings}
        onAddCard={handleAddCard}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onUpdateSettings={handleUpdateSettings}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
