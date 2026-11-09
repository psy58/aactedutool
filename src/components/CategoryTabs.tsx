import React from 'react';
import { AACCategory } from '../types/aac';

interface CategoryTabsProps {
  categories: AACCategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  return (
    <nav
      aria-label="의사소통 표현 카테고리 선택"
      className="bg-white/80 border-b border-amber-100/80 px-2 sm:px-6 py-2 sticky top-[65px] sm:top-[73px] z-20 shadow-xs backdrop-blur-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-bold transition-all border-2 text-base sm:text-lg focus-visible:ring-4 focus-visible:ring-amber-400 select-none cursor-pointer ${
                isActive
                  ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm scale-102 font-black'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-200 active:scale-98'
              }`}
            >
              <span className="text-xl sm:text-2xl" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
