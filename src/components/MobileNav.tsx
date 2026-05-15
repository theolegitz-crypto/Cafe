import { CartIcon, ContactsIcon, MenuIcon, SearchIcon } from './Icons';

interface MobileNavProps {
  cartCount: number;
  onSearch: () => void;
  onMenu: () => void;
  onCart: () => void;
  onContacts: () => void;
}

const items = [
  { key: 'search', label: 'Поиск', icon: SearchIcon },
  { key: 'menu', label: 'Меню', icon: MenuIcon },
  { key: 'cart', label: 'Корзина', icon: CartIcon },
  { key: 'contacts', label: 'Контакты', icon: ContactsIcon },
] as const;

export function MobileNav({
  cartCount,
  onSearch,
  onMenu,
  onCart,
  onContacts,
}: MobileNavProps) {
  const handlers = {
    search: onSearch,
    menu: onMenu,
    cart: onCart,
    contacts: onContacts,
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/96 px-4 py-3 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={handlers[item.key]}
            className="relative flex min-w-0 flex-1 flex-col items-center gap-1"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-muted text-sm font-bold text-ink">
              <item.icon className="h-5 w-5" />
            </span>
            <span className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-slate">
              {item.label}
            </span>
            {item.key === 'cart' && cartCount > 0 && (
              <span className="absolute right-[22%] top-0 min-w-[20px] rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
