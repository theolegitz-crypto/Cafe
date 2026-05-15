import { useState } from 'react';
import { CategoryTabs } from './components/CategoryTabs';
import { DishCard } from './components/DishCard';
import { Footer } from './components/Footer';
import { HeaderBar } from './components/HeaderBar';
import { MenuHero } from './components/MenuHero';
import { SearchBar } from './components/SearchBar';
import { menuCategories, menuItems } from './data/menu';
import { MenuCategory } from './types/menu';

function getTableLabel() {
  const params = new URLSearchParams(window.location.search);
  const rawTable = params.get('table')?.trim();

  if (!rawTable) {
    return {
      hasTableNumber: false,
      tableLabel: 'гость зала',
    };
  }

  return {
    hasTableNumber: true,
    tableLabel: `столик ${rawTable}`,
  };
}

function App() {
  const [{ hasTableNumber, tableLabel }] = useState(getTableLabel);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'Все'>(
    'Все',
  );
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Все' || item.category === selectedCategory;
    const searchableText = `${item.name} ${item.description} ${item.category}`.toLowerCase();
    const matchesSearch =
      normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  const sectionTitle = selectedCategory === 'Все' ? 'Новинки' : selectedCategory;

  return (
    <div className="min-h-screen bg-canvas bg-glow text-ink">
      <HeaderBar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <MenuHero tableLabel={tableLabel} hasTableNumber={hasTableNumber} />

        <section className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="flex items-center justify-between rounded-[24px] border border-line bg-surface px-5 py-3 shadow-soft">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-500">
                  Новая система
                </p>
                <p className="mt-1 text-sm text-slate">
                  Светлая продуктовая подача, чище структура и современный каталог
                </p>
              </div>
              <div className="hidden rounded-full bg-accentSoft px-4 py-2 text-sm font-semibold text-accentDeep sm:block">
                {filteredItems.length} позиций
              </div>
            </div>
          </div>

          <CategoryTabs
            categories={menuCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-brand-500">каталог</p>
              <h2 className="mt-2 font-display text-4xl leading-none text-ink sm:text-5xl">
                {sectionTitle}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate sm:text-right">
              Интерфейс теперь ближе к современному food-tech продукту, но без
              агрессивных цветов и перегруженных декоративных деталей.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filteredItems.map((item, index) => (
              <DishCard key={item.id} item={item} priority={index < 4} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="rounded-[28px] border border-dashed border-brand-300 bg-surface px-6 py-12 text-center shadow-soft">
              <h3 className="font-display text-4xl text-ink">Ничего не найдено</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate">
                Попробуйте другой поисковый запрос или переключитесь на соседнюю
                категорию. Основа каталога уже готова для дальнейшего роста.
              </p>
            </div>
          )}
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default App;
