import { AACCardItem, AACCategory, AACSettings, AACBackupData } from '../types/aac';
import { DEFAULT_CATEGORIES, DEFAULT_CARDS, DEFAULT_SETTINGS } from '../data/defaultData';

const STORAGE_KEYS = {
  CATEGORIES: 'aac_app_categories_v1',
  CARDS: 'aac_app_cards_v1',
  SETTINGS: 'aac_app_settings_v1',
};

export const storage = {
  loadCategories(): AACCategory[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load categories from localStorage:', e);
    }
    return DEFAULT_CATEGORIES;
  },

  saveCategories(categories: AACCategory[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to save categories to localStorage:', e);
    }
  },

  loadCards(): AACCardItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CARDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load cards from localStorage:', e);
    }
    return DEFAULT_CARDS;
  },

  saveCards(cards: AACCardItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    } catch (e) {
      console.warn('Failed to save cards to localStorage:', e);
    }
  },

  loadSettings(): AACSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AACSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage:', e);
    }
  },

  resetAll(): { categories: AACCategory[]; cards: AACCardItem[]; settings: AACSettings } {
    try {
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.CARDS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
    return {
      categories: DEFAULT_CATEGORIES,
      cards: DEFAULT_CARDS,
      settings: DEFAULT_SETTINGS,
    };
  },

  exportJSON(categories: AACCategory[], cards: AACCardItem[], settings: AACSettings) {
    const backup: AACBackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      categories,
      cards,
      settings,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `내마음을전해요_AAC_데이터_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  parseJSONFile(file: File): Promise<AACBackupData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (!parsed.categories || !parsed.cards) {
            throw new Error('올바른 AAC 백업 파일 형식이 아닙니다.');
          }
          resolve(parsed as AACBackupData);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      reader.readAsText(file);
    });
  },
};
