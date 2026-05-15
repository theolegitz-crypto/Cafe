const links = ['О нас', 'Акции', 'Доставка', 'Контакты', 'Поддержка'];

const actions = [
  { badge: 'S', label: 'Поиск' },
  { badge: 'B', label: 'Бонусы' },
  { badge: 'P', label: 'Профиль' },
  { badge: 'K', label: 'Корзина' },
];

export function HeaderBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/88 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3 text-sm text-slate">
          <div className="flex items-center gap-2 font-semibold text-ink">
            <span className="rounded-full bg-accentSoft px-2 py-0.5 text-xs text-accentDeep">RU</span>
            <span>Казань</span>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            {links.map((link) => (
              <a key={link} href="#" className="transition hover:text-ink">
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-lg font-bold text-white shadow-soft">
              AT
            </div>
            <div>
              <p className="font-display text-2xl leading-none text-ink">Amber Table</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate">
                modern cafe menu
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:mx-6 lg:max-w-3xl lg:flex-row lg:items-center">
            <div className="flex rounded-full bg-muted p-1.5">
              <button
                type="button"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate transition hover:text-ink"
              >
                Доставка
              </button>
              <button
                type="button"
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-soft"
              >
                Самовывоз
              </button>
            </div>

            <div className="flex flex-1 items-center justify-between rounded-full border border-line bg-surface px-5 py-3 text-sm text-slate shadow-soft">
              <span className="truncate">Выберите столик, адрес или формат заказа</span>
              <span className="ml-4 text-lg text-brand-400">›</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {actions.map((action) => (
              <button key={action.label} type="button" className="group flex flex-col items-center gap-1">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-sm font-bold text-ink shadow-soft transition group-hover:border-accent group-hover:text-accent">
                  {action.badge}
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
