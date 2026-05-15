import { MenuCategory } from '../types/menu';

interface CategoryTabsProps {
  categories: MenuCategory[];
  selectedCategory: MenuCategory | 'Все';
  onSelectCategory: (category: MenuCategory | 'Все') => void;
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const filters: Array<MenuCategory | 'Все'> = ['Все', ...categories];

  return (
    <nav aria-label="Категории меню" className="sticky top-[122px] z-20">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {filters.map((category) => {
          const isActive = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-ink text-white shadow-soft'
                  : 'border border-line bg-surface text-slate'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
