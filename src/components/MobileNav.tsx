interface MobileNavProps {
  cartCount: number;
  onMenu: () => void;
  onPromo: () => void;
  onCart: () => void;
  onContacts: () => void;
}

const items = [
  { key: 'menu', label: 'Меню', badge: 'M' },
  { key: 'promo', label: 'Акции', badge: 'A' },
  { key: 'cart', label: 'Корзина', badge: 'K' },
  { key: 'contacts', label: 'Контакты', badge: 'C' },
] as const;

export function MobileNav({
  cartCount,
  onMenu,
  onPromo,
  onCart,
  onContacts,
}: MobileNavProps) {
  const handlers = {
    menu: onMenu,
    promo: onPromo,
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
              {item.badge}
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
