import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Sliders,
  FolderPlus,
  Check,
  Volume2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  AACCardItem,
  AACCategory,
  AACSettings,
  CardColorTheme,
  GridColumns,
  AACFontSize,
  SpeechSpeed,
  DisplayMode,
  ThemePalette,
} from '../types/aac';
import { speechService, VoiceOption } from '../utils/speech';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: AACCategory[];
  cards: AACCardItem[];
  settings: AACSettings;
  onAddCard: (card: Omit<AACCardItem, 'id'>) => void;
  onUpdateCard: (card: AACCardItem) => void;
  onDeleteCard: (cardId: string) => void;
  onAddCategory: (category: Omit<AACCategory, 'id'>) => void;
  onUpdateCategory: (category: AACCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateSettings: (settings: Partial<AACSettings>) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => Promise<void>;
  onResetToDefault: () => void;
}

type ActiveTab = 'cards' | 'categories' | 'settings' | 'backup';

const PRESET_EMOJIS = [
  '✅', '❌', '🙏', '🙅', '🛑', '💬', '💧', '🍚', '🚻', '🛋️', '🎲', '🧸',
  '😊', '😢', '😠', '😨', '😴', '😟', '📚', '✏️', '📖', '👩‍🏫', '🧑‍🤝‍🧑', '🏫',
  '🙋', '🤒', '🔊', '😣', '🫷', '🆘', '🥛', '🍎', '💗', '➕', '🍎', '🥪',
  '⚽', '🎨', '🎵', '🚗', '🚶', '🌞', '🌧️', '🧣', '👟', '💊', '🩹', '👍',
];

const COLOR_THEMES: { label: string; value: CardColorTheme; bg: string }[] = [
  { label: '하늘색', value: 'sky', bg: 'bg-sky-200' },
  { label: '노란색', value: 'amber', bg: 'bg-amber-200' },
  { label: '분홍색', value: 'rose', bg: 'bg-rose-200' },
  { label: '초록색', value: 'emerald', bg: 'bg-emerald-200' },
  { label: '보라색', value: 'purple', bg: 'bg-purple-200' },
  { label: '주황색', value: 'orange', bg: 'bg-orange-200' },
  { label: '청록색', value: 'teal', bg: 'bg-teal-200' },
  { label: '남색', value: 'indigo', bg: 'bg-indigo-200' },
  { label: '회색', value: 'slate', bg: 'bg-slate-200' },
];

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  categories,
  cards,
  settings,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onUpdateSettings,
  onExportBackup,
  onImportBackup,
  onResetToDefault,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cards');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  // Card Add/Edit Form State
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardFormCatId, setCardFormCatId] = useState<string>(categories[0]?.id || '');
  const [cardFormLabel, setCardFormLabel] = useState<string>('');
  const [cardFormSpeech, setCardFormSpeech] = useState<string>('');
  const [cardFormIcon, setCardFormIcon] = useState<string>('💬');
  const [cardFormTheme, setCardFormTheme] = useState<CardColorTheme>('sky');
  const [cardFormIsSelf, setCardFormIsSelf] = useState<boolean>(false);
  const [showCardForm, setShowCardForm] = useState<boolean>(false);

  // Category Add/Edit Form State
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormName, setCatFormName] = useState<string>('');
  const [catFormIcon, setCatFormIcon] = useState<string>('📁');
  const [catFormTheme, setCatFormTheme] = useState<CardColorTheme>('amber');
  const [showCatForm, setShowCatForm] = useState<boolean>(false);

  // Backup file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupStatusMessage, setBackupStatusMessage] = useState<string | null>(null);

  // Available Voices
  const koreanVoices: VoiceOption[] = speechService.getKoreanVoices();

  if (!isOpen) return null;

  // Open Create Card Form
  const handleOpenAddCard = () => {
    setEditingCardId(null);
    setCardFormCatId(selectedFilterCategory === 'all' ? (categories[0]?.id || '') : selectedFilterCategory);
    setCardFormLabel('');
    setCardFormSpeech('');
    setCardFormIcon('💬');
    setCardFormTheme('sky');
    setCardFormIsSelf(false);
    setShowCardForm(true);
  };

  // Open Edit Card Form
  const handleOpenEditCard = (card: AACCardItem) => {
    setEditingCardId(card.id);
    setCardFormCatId(card.categoryId);
    setCardFormLabel(card.label);
    setCardFormSpeech(card.speechText);
    setCardFormIcon(card.icon);
    setCardFormTheme(card.colorTheme || 'sky');
    setCardFormIsSelf(!!card.isSelfDetermination);
    setShowCardForm(true);
  };

  // Save Card
  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardFormLabel.trim()) return;

    if (editingCardId) {
      onUpdateCard({
        id: editingCardId,
        categoryId: cardFormCatId,
        label: cardFormLabel.trim(),
        speechText: cardFormSpeech.trim() || cardFormLabel.trim(),
        icon: cardFormIcon.trim() || '💬',
        colorTheme: cardFormTheme,
        isSelfDetermination: cardFormIsSelf,
      });
    } else {
      onAddCard({
        categoryId: cardFormCatId,
        label: cardFormLabel.trim(),
        speechText: cardFormSpeech.trim() || cardFormLabel.trim(),
        icon: cardFormIcon.trim() || '💬',
        colorTheme: cardFormTheme,
        isSelfDetermination: cardFormIsSelf,
      });
    }

    setShowCardForm(false);
    setEditingCardId(null);
  };

  // Delete Card with prompt
  const handleDeleteCardConfirm = (card: AACCardItem) => {
    if (window.confirm(`"${card.label}" 표현 카드를 정말 삭제하시겠습니까?`)) {
      onDeleteCard(card.id);
    }
  };

  // Category Actions
  const handleOpenAddCategory = () => {
    setEditingCatId(null);
    setCatFormName('');
    setCatFormIcon('📁');
    setCatFormTheme('amber');
    setShowCatForm(true);
  };

  const handleOpenEditCategory = (cat: AACCategory) => {
    setEditingCatId(cat.id);
    setCatFormName(cat.name);
    setCatFormIcon(cat.icon);
    setCatFormTheme(cat.themeColor);
    setShowCatForm(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim()) return;

    if (editingCatId) {
      onUpdateCategory({
        id: editingCatId,
        name: catFormName.trim(),
        icon: catFormIcon.trim() || '📁',
        themeColor: catFormTheme,
      });
    } else {
      onAddCategory({
        name: catFormName.trim(),
        icon: catFormIcon.trim() || '📁',
        themeColor: catFormTheme,
      });
    }

    setShowCatForm(false);
    setEditingCatId(null);
  };

  const handleDeleteCategoryConfirm = (cat: AACCategory) => {
    const cardCount = cards.filter((c) => c.categoryId === cat.id).length;
    if (
      window.confirm(
        `"${cat.name}" 카테고리를 삭제하시겠습니까?\n이 카테고리에 속한 ${cardCount}개의 카드도 함께 정리됩니다.`
      )
    ) {
      onDeleteCategory(cat.id);
    }
  };

  // File import handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await onImportBackup(file);
      setBackupStatusMessage('백업 데이터를 성공적으로 불러왔습니다!');
      setTimeout(() => setBackupStatusMessage(null), 3500);
    } catch (err: any) {
      setBackupStatusMessage(`불러오기 실패: ${err.message || '파일을 확인해주세요'}`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredCards =
    selectedFilterCategory === 'all'
      ? cards
      : cards.filter((c) => c.categoryId === selectedFilterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border-3 border-amber-300 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-modal-title"
      >
        {/* Header Bar */}
        <div className="bg-amber-400 px-5 sm:px-6 py-4 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">⚙️</span>
            <div>
              <h2 id="teacher-modal-title" className="text-xl sm:text-2xl font-black text-amber-950">
                교사용 설정 및 표현 관리
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-amber-900/80">
                학생의 특성에 맞게 표현을 추가·수정하고 글자 크기, 음성을 조절하세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-10 h-10 rounded-2xl bg-amber-500/80 hover:bg-amber-600 text-amber-950 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="설정 닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('cards')}
            type="button"
            className={`py-3.5 px-4 font-bold text-sm sm:text-base border-b-3 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cards'
                ? 'border-amber-500 text-amber-950 font-black bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>💬 표현 카드 관리 ({cards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            type="button"
            className={`py-3.5 px-4 font-bold text-sm sm:text-base border-b-3 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-amber-500 text-amber-950 font-black bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📁 카테고리 관리 ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            type="button"
            className={`py-3.5 px-4 font-bold text-sm sm:text-base border-b-3 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-950 font-black bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>맞춤 환경 설정</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            type="button"
            className={`py-3.5 px-4 font-bold text-sm sm:text-base border-b-3 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-amber-500 text-amber-950 font-black bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>백업 및 초기화</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* TAB 1: EXPRESSION CARDS */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
                {/* Category filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600 shrink-0">카테고리:</span>
                  <select
                    value={selectedFilterCategory}
                    onChange={(e) => setSelectedFilterCategory(e.target.value)}
                    className="border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-bold bg-white focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <option value="all">전체 표현 보기 ({cards.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name} ({cards.filter((x) => x.categoryId === c.id).length})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add New Card Button */}
                <button
                  type="button"
                  onClick={handleOpenAddCard}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-sm flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 표현 카드 추가</span>
                </button>
              </div>

              {/* Add / Edit Card Drawer Form */}
              {showCardForm && (
                <form
                  onSubmit={handleSaveCard}
                  className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <h3 className="text-base sm:text-lg font-black text-amber-950 flex items-center gap-2">
                      <span>{editingCardId ? '✏️ 표현 카드 수정' : '✨ 새 표현 카드 추가'}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCardForm(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        어느 카테고리에 넣을까요? *
                      </label>
                      <select
                        value={cardFormCatId}
                        onChange={(e) => setCardFormCatId(e.target.value)}
                        required
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.icon} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Card Color Theme */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        카드 배경 색상
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {COLOR_THEMES.map((theme) => (
                          <button
                            key={theme.value}
                            type="button"
                            onClick={() => setCardFormTheme(theme.value)}
                            className={`w-7 h-7 rounded-lg ${theme.bg} border-2 transition-all flex items-center justify-center ${
                              cardFormTheme === theme.value
                                ? 'border-amber-600 scale-110 ring-2 ring-amber-400'
                                : 'border-slate-300'
                            }`}
                            title={theme.label}
                          >
                            {cardFormTheme === theme.value && (
                              <Check className="w-3.5 h-3.5 text-amber-900" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Label Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        화면에 표시할 글자 *
                      </label>
                      <input
                        type="text"
                        value={cardFormLabel}
                        onChange={(e) => {
                          setCardFormLabel(e.target.value);
                          if (!cardFormSpeech || cardFormSpeech === cardFormLabel) {
                            setCardFormSpeech(e.target.value);
                          }
                        }}
                        placeholder="예: 물 마시고 싶어요"
                        required
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold bg-white"
                      />
                    </div>

                    {/* Speech Text Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        소리로 읽을 문구 (비워두면 표시 글자와 동일)
                      </label>
                      <input
                        type="text"
                        value={cardFormSpeech}
                        onChange={(e) => setCardFormSpeech(e.target.value)}
                        placeholder="음성으로 출력할 한글 문구"
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold bg-white"
                      />
                    </div>

                    {/* Icon / Emoji Input & Picker */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        이모지 / 아이콘 선택 (직접 입력도 가능)
                      </label>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={cardFormIcon}
                          onChange={(e) => setCardFormIcon(e.target.value)}
                          maxLength={4}
                          className="w-16 border border-slate-300 rounded-xl p-2 text-center text-2xl font-bold bg-white"
                        />
                        <span className="text-xs text-slate-500">
                          아래 자주 쓰는 이모지를 누르면 바로 입력돼요
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200">
                        {PRESET_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setCardFormIcon(emoji)}
                            className="w-8 h-8 rounded-lg hover:bg-amber-100 flex items-center justify-center text-lg active:scale-90 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Self-determination toggle */}
                    <div className="sm:col-span-2 flex items-center gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="isSelfDet"
                        checked={cardFormIsSelf}
                        onChange={(e) => setCardFormIsSelf(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                      />
                      <label htmlFor="isSelfDet" className="text-sm font-bold text-slate-800">
                        🚨 중요 표현/자기결정/거절 표현으로 강조하기 (도와주세요, 싫어요, 그만할래요 등)
                      </label>
                    </div>
                  </div>

                  {/* Form Submit / Cancel */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
                    <button
                      type="button"
                      onClick={() => setShowCardForm(false)}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-100"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl text-sm shadow-xs"
                    >
                      {editingCardId ? '카드 수정 완료' : '카드 추가하기'}
                    </button>
                  </div>
                </form>
              )}

              {/* Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredCards.map((card) => {
                  const cat = categories.find((c) => c.id === card.categoryId);

                  return (
                    <div
                      key={card.id}
                      className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-amber-300 shadow-2xs flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl sm:text-3xl shrink-0">{card.icon}</span>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate text-base">{card.label}</p>
                          <p className="text-xs text-slate-400 truncate">
                            {cat?.name || '미분류'} {card.isSelfDetermination && '· 중요'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Audio test speak button */}
                        <button
                          type="button"
                          onClick={() =>
                            speechService.speak(card.speechText, {
                              rate: settings.speechSpeed === 'slow' ? 0.75 : 1.0,
                            })
                          }
                          className="w-8 h-8 rounded-lg hover:bg-emerald-50 text-emerald-700 flex items-center justify-center transition-colors"
                          title="발음 듣기"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        {/* Edit card */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditCard(card)}
                          className="w-8 h-8 rounded-lg hover:bg-amber-100 text-amber-900 flex items-center justify-center transition-colors"
                          title="수정하기"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete card */}
                        <button
                          type="button"
                          onClick={() => handleDeleteCardConfirm(card)}
                          className="w-8 h-8 rounded-lg hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-colors"
                          title="삭제하기"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
                <p className="text-sm font-bold text-slate-700">
                  총 {categories.length}개의 카테고리가 등록되어 있습니다.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-sm flex items-center gap-1.5 shadow-xs"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>새 카테고리 추가</span>
                </button>
              </div>

              {/* Add/Edit Category Form */}
              {showCatForm && (
                <form
                  onSubmit={handleSaveCategory}
                  className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <h3 className="text-base font-black text-amber-950">
                      {editingCatId ? '📁 카테고리 수정' : '📁 새 카테고리 추가'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCatForm(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        카테고리 이름 *
                      </label>
                      <input
                        type="text"
                        value={catFormName}
                        onChange={(e) => setCatFormName(e.target.value)}
                        placeholder="예: 놀이와 휴식"
                        required
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        대표 아이콘/이모지
                      </label>
                      <input
                        type="text"
                        value={catFormIcon}
                        onChange={(e) => setCatFormIcon(e.target.value)}
                        maxLength={3}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold bg-white text-center text-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        테마 색상
                      </label>
                      <select
                        value={catFormTheme}
                        onChange={(e) => setCatFormTheme(e.target.value as CardColorTheme)}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold bg-white"
                      >
                        {COLOR_THEMES.map((theme) => (
                          <option key={theme.value} value={theme.value}>
                            {theme.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
                    <button
                      type="button"
                      onClick={() => setShowCatForm(false)}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-100"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl text-sm shadow-xs"
                    >
                      {editingCatId ? '카테고리 수정 완료' : '카테고리 생성'}
                    </button>
                  </div>
                </form>
              )}

              {/* Categories list */}
              <div className="space-y-2">
                {categories.map((cat) => {
                  const count = cards.filter((c) => c.categoryId === cat.id).length;

                  return (
                    <div
                      key={cat.id}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{cat.icon}</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-base">{cat.name}</h4>
                          <p className="text-xs text-slate-500">
                            포함된 카드: {count}개 {cat.description ? `· ${cat.description}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCategory(cat)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-amber-50 text-slate-800 font-bold text-xs flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>이름 수정</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategoryConfirm(cat)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMIZATION SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Card Grid Layout */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <span>📱 화면 카드 배열 (열 개수)</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  학생의 인지 상태 및 손가락 운동 발달에 맞춰 한 화면에 보이는 카드의 개수를 조절할 수 있습니다.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {([2, 3, 4, 'auto'] as GridColumns[]).map((col) => (
                    <button
                      key={String(col)}
                      type="button"
                      onClick={() => onUpdateSettings({ columns: col })}
                      className={`p-3 rounded-xl border-2 font-black text-sm text-center transition-all cursor-pointer ${
                        settings.columns === col
                          ? 'border-amber-500 bg-amber-100 text-amber-950 scale-102 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {col === 'auto' ? '자동 반응형' : `${col}열 배열`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Size */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <span>🔤 글자 및 아이콘 크기</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  시각적 주의집중이 필요한 학생을 위해 글자를 매우 크게 설정할 수 있습니다.
                </p>
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { label: '보통', value: 'normal' as AACFontSize, desc: '기본 크기' },
                    { label: '크게', value: 'large' as AACFontSize, desc: '권장 크기' },
                    { label: '매우 크게', value: 'huge' as AACFontSize, desc: '최대 가독성' },
                  ].map((sizeOpt) => (
                    <button
                      key={sizeOpt.value}
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: sizeOpt.value })}
                      className={`p-3 rounded-xl border-2 font-black text-sm text-center transition-all cursor-pointer ${
                        settings.fontSize === sizeOpt.value
                          ? 'border-amber-500 bg-amber-100 text-amber-950 scale-102 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-base">{sizeOpt.label}</p>
                      <p className="text-xs font-normal text-slate-500">{sizeOpt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Mode (Both vs Text Only) */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <span>🖼️ 표현 카드 표시 방식</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {[
                    {
                      label: '그림과 텍스트 함께 표시',
                      value: 'both' as DisplayMode,
                      desc: '아이콘 그림과 한국어 텍스트가 함께 보입니다 (권장)',
                    },
                    {
                      label: '텍스트 중심 표시',
                      value: 'textOnly' as DisplayMode,
                      desc: '그림 없이 큰 글자 위주로 카드를 구성합니다',
                    },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => onUpdateSettings({ displayMode: mode.value })}
                      className={`p-3.5 rounded-xl border-2 text-left font-black text-sm transition-all cursor-pointer ${
                        settings.displayMode === mode.value
                          ? 'border-amber-500 bg-amber-100 text-amber-950 scale-102 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-base font-black">{mode.label}</p>
                      <p className="text-xs font-medium text-slate-600 mt-1">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speech Output & Speed Settings */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <span>🗣️ 음성 출력 및 말하기 속도</span>
                </h4>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">소리 출력 활성화</span>
                    <span className="text-xs text-slate-500">
                      카드 선택 및 전체 문장 읽기 시 음성을 재생합니다
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ speechEnabled: !settings.speechEnabled })}
                    className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                      settings.speechEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                        settings.speechEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">말하기 속도</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      {
                        label: '느리게 (0.75배속)',
                        value: 'slow' as SpeechSpeed,
                        desc: '발음 청취 및 인지 지원용 (기본)',
                      },
                      {
                        label: '보통 (1.0배속)',
                        value: 'normal' as SpeechSpeed,
                        desc: '일반 말하기 속도',
                      },
                    ].map((spd) => (
                      <button
                        key={spd.value}
                        type="button"
                        onClick={() => onUpdateSettings({ speechSpeed: spd.value })}
                        className={`p-3 rounded-xl border-2 font-black text-sm text-center transition-all cursor-pointer ${
                          settings.speechSpeed === spd.value
                            ? 'border-amber-500 bg-amber-100 text-amber-950 scale-102 shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <p className="text-sm font-black">{spd.label}</p>
                        <p className="text-xs font-normal text-slate-500">{spd.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice Selection if system has voices */}
                {koreanVoices.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700 block">
                      설치된 음성 목소리 선택
                    </label>
                    <select
                      value={settings.selectedVoiceURI || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdateSettings({ selectedVoiceURI: val });
                        speechService.setVoiceByURI(val);
                      }}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold bg-white"
                    >
                      <option value="">기본 한국어 음성 (자동 선택)</option>
                      {koreanVoices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Theme Palette */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <span>🎨 화면 테마 색상</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {[
                    { label: '파스텔 아이보리', value: 'pastel' as ThemePalette, bg: 'bg-[#FAF9F5]' },
                    { label: '따뜻한 피치', value: 'warm' as ThemePalette, bg: 'bg-[#FCF8F2]' },
                    { label: '부드러운 민트', value: 'mint' as ThemePalette, bg: 'bg-[#F2F8F5]' },
                    { label: '고대비 모드', value: 'highContrast' as ThemePalette, bg: 'bg-white' },
                  ].map((themeOpt) => (
                    <button
                      key={themeOpt.value}
                      type="button"
                      onClick={() => onUpdateSettings({ themePalette: themeOpt.value })}
                      className={`p-3 rounded-xl border-2 font-black text-sm text-center transition-all cursor-pointer ${
                        settings.themePalette === themeOpt.value
                          ? 'border-amber-500 bg-amber-100 text-amber-950 scale-102 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {themeOpt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Privacy and Local Storage Notice */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-emerald-950 font-medium space-y-1">
                  <p className="font-bold">학생 개인정보 안전 보장</p>
                  <p>
                    이 앱은 학생 이름, 학번, 장애 정보 등 어떠한 개인정보도 입력받지 않으며 외부
                    서버나 클라우드로 전송하지 않습니다. 모든 수정 데이터는 현재 기기의 브라우저
                    저장소(localStorage)에만 안전하게 보관됩니다.
                  </p>
                </div>
              </div>

              {backupStatusMessage && (
                <div className="p-3.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-bold text-sm">
                  {backupStatusMessage}
                </div>
              )}

              {/* Export JSON */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-slate-900 text-base">
                    📥 표현 데이터 파일로 내보내기 (백업)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500">
                    현재 교사가 수정한 모든 표현 카드와 카테고리를 JSON 파일로 저장합니다. 다른 기기나
                    새 학기에 그대로 옮겨 쓸 수 있습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl text-sm flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>백업 파일 저장</span>
                </button>
              </div>

              {/* Import JSON */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-slate-900 text-base">
                    📤 이전 백업 파일 불러오기 (복원)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500">
                    컴퓨터에 저장해 둔 JSON 백업 파일을 선택하여 모든 표현과 설정을 복원합니다.
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                    id="backup-file-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-xl text-sm flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>백업 파일 선택</span>
                  </button>
                </div>
              </div>

              {/* Reset to Default */}
              <div className="bg-rose-50/60 p-4 sm:p-5 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-rose-950 text-base flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>초기 기본 상태로 복원</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-800">
                    모든 수정 사항을 지우고 앱 설치 당시의 6개 카테고리와 기본 표현 카드로 되돌립니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        '정말로 모든 카드를 처음 기본 상태로 되돌리시겠습니까?\n이 작업은 취소할 수 없습니다.'
                      )
                    ) {
                      onResetToDefault();
                      setBackupStatusMessage('초기 기본 상태로 복원되었습니다.');
                      setTimeout(() => setBackupStatusMessage(null), 3500);
                    }
                  }}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-sm flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>초기화하기</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal Actions */}
        <div className="bg-slate-100 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 hidden sm:flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>설정이 끝나면 '학생용 화면으로 돌아가기'를 누르세요</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl text-base shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            학생용 화면으로 돌아가기 ✓
          </button>
        </div>
      </div>
    </div>
  );
};
