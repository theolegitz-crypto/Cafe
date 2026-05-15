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
    <nav aria-label="Категории меню" className="sticky top-[112px] z-20">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {filters.map((category) => {
          const isActive = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'border-transparent bg-ink text-white shadow-soft'
                  : 'border-line bg-surface text-slate hover:border-brand-300 hover:text-ink'
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
