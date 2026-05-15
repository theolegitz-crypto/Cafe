import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { CartSheet } from './components/CartSheet';
import { CategoryTabs } from './components/CategoryTabs';
import { CheckoutSheet } from './components/CheckoutSheet';
import { DishCard } from './components/DishCard';
import { DishDetailsSheet } from './components/DishDetailsSheet';
import { Footer } from './components/Footer';
import { HeaderBar } from './components/HeaderBar';
import { MobileNav } from './components/MobileNav';
import { SearchBar } from './components/SearchBar';
import { menuCategories, menuItems } from './data/menu';
import { CartLine, MenuCategory, MenuItem, OrderMode } from './types/menu';
import { trackEvent } from './utils/analytics';
import { formatModeLabel, formatPrice, tagStyles } from './utils/formatters';
import { loadMenu } from './utils/menuApi';
import { AdminApp } from './admin/AdminApp';

interface SessionContext {
  hasTableNumber: boolean;
  tableLabel: string;
  initialMode: OrderMode;
}

interface CheckoutFormState {
  name: string;
  phone: string;
  comment: string;
  address: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function getSessionContext(): SessionContext {
  const params = new URLSearchParams(window.location.search);
  const rawTable = params.get('table')?.trim();
  const pickup = params.get('pickup') === '1';
  const delivery = params.get('delivery') === '1';

  if (delivery) {
    return {
      hasTableNumber: false,
      tableLabel: 'Доставка по городу',
      initialMode: 'delivery',
    };
  }

  if (pickup) {
    return {
      hasTableNumber: false,
      tableLabel: 'Самовывоз из кафе',
      initialMode: 'pickup',
    };
  }

  if (!rawTable) {
    return {
      hasTableNumber: false,
      tableLabel: 'Гость зала',
      initialMode: 'table',
    };
  }

  return {
    hasTableNumber: true,
    tableLabel: `Столик ${rawTable}`,
    initialMode: 'table',
  };
}

function createCartLineId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getLineUnitPrice(line: CartLine, item: MenuItem) {
  const modifiersTotal = item.modifiers
    .filter((modifier) => line.modifierIds.includes(modifier.id))
    .reduce((sum, modifier) => sum + modifier.price, 0);

  return item.price + modifiersTotal;
}

const promoCards = [
  {
    title: 'Комбо на двоих',
    text: 'Пицца, салат и лимонады со скидкой 12% в один тап.',
    tone: 'bg-accentSoft text-accentDeep',
  },
  {
    title: 'QR у каждого столика',
    text: 'Номер стола уже читается из URL, можно сразу работать с заказом.',
    tone: 'bg-mint text-success',
  },
  {
    title: 'Самовывоз за 25 минут',
    text: 'Удобный checkout без лишних экранов и лишней информации.',
    tone: 'bg-muted text-ink',
  },
];

function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminApp />;
  }

  const [{ hasTableNumber, tableLabel, initialMode }] = useState(getSessionContext);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'Все'>('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderMode, setOrderMode] = useState<OrderMode>(initialMode);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [remoteCategories, setRemoteCategories] = useState<MenuCategory[]>(menuCategories);
  const [remoteItems, setRemoteItems] = useState<MenuItem[]>(menuItems);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormState>({
    name: '',
    phone: '',
    comment: '',
    address: '',
  });

  const searchRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const promoRef = useRef<HTMLElement | null>(null);
  const contactsRef = useRef<HTMLElement | null>(null);
  const deferredQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    loadMenu().then((payload) => {
      setRemoteCategories(payload.categories);
      setRemoteItems(payload.items);
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      activeItem || isCartOpen || isCheckoutOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [activeItem, isCartOpen, isCheckoutOpen]);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredItems = remoteItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Все' || item.category === selectedCategory;
    const searchableText = [
      item.name,
      item.description,
      item.category,
      ...item.ingredients,
      ...item.tags,
    ]
      .join(' ')
      .toLowerCase();

    return matchesCategory && (normalizedQuery.length === 0 || searchableText.includes(normalizedQuery));
  });

  const popularItems = remoteItems.filter((item) => item.popular).slice(0, 5);
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartLines.reduce((sum, line) => {
    const item = remoteItems.find((entry) => entry.id === line.itemId);
    return item ? sum + getLineUnitPrice(line, item) * line.quantity : sum;
  }, 0);

  const sectionTitle = selectedCategory === 'Все' ? 'Каталог блюд' : selectedCategory;

  function handleModeChange(mode: OrderMode) {
    setOrderMode(mode);
    trackEvent('change_mode', { mode });
  }

  function handleOpenItem(item: MenuItem) {
    setActiveItem(item);
    trackEvent('open_dish', { item_id: item.id, item_name: item.name });
  }

  function addLineToCart(item: MenuItem, options: { quantity: number; modifierIds: string[]; comment: string }) {
    setCartLines((current) => {
      const existing = current.find(
        (line) =>
          line.itemId === item.id &&
          line.comment === options.comment &&
          line.modifierIds.length === options.modifierIds.length &&
          line.modifierIds.every((modifierId) => options.modifierIds.includes(modifierId)),
      );

      if (existing) {
        return current.map((line) =>
          line.id === existing.id
            ? { ...line, quantity: line.quantity + options.quantity }
            : line,
        );
      }

      return [
        ...current,
        {
          id: createCartLineId(),
          itemId: item.id,
          quantity: options.quantity,
          modifierIds: options.modifierIds,
          comment: options.comment,
        },
      ];
    });

    trackEvent('add_to_cart', {
      item_id: item.id,
      quantity: options.quantity,
      mode: orderMode,
    });
  }

  function handleQuickAdd(item: MenuItem) {
    addLineToCart(item, { quantity: 1, modifierIds: [], comment: '' });
  }

  function updateLineQuantity(lineId: string, delta: number) {
    setCartLines((current) =>
      current.flatMap((line) => {
        if (line.id !== lineId) {
          return [line];
        }

        const nextQuantity = line.quantity + delta;
        return nextQuantity <= 0 ? [] : [{ ...line, quantity: nextQuantity }];
      }),
    );
  }

  function removeLine(lineId: string) {
    setCartLines((current) => current.filter((line) => line.id !== lineId));
  }

  function handleCheckoutSubmit() {
    const code = `AT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    setConfirmationCode(code);
    setCartLines([]);
    trackEvent('checkout_submit', {
      mode: orderMode,
      total: cartTotal,
      line_count: cartCount,
    });
  }

  async function handleInstallApp() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    setInstallPrompt(null);
    trackEvent('install_prompt_click');
  }

  function scrollToSection(target: HTMLElement | null) {
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const isQrEntry = hasTableNumber || orderMode !== 'table';

  return (
    <div className="min-h-screen bg-canvas bg-glow text-ink">
      <HeaderBar
        city="Набережные Челны"
        orderMode={orderMode}
        cartCount={cartCount}
        canInstallApp={Boolean(installPrompt)}
        onInstallApp={handleInstallApp}
        onModeChange={handleModeChange}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="safe-bottom-nav mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        {!isQrEntry && (
          <section ref={promoRef} className="grid gap-3 sm:grid-cols-3">
            {promoCards.map((card) => (
              <article
                key={card.title}
                className={`rounded-[28px] border border-line p-5 shadow-soft ${card.tone}`}
              >
                <p className="text-xs uppercase tracking-[0.2em]">Promo</p>
                <h2 className="mt-3 font-display text-3xl leading-tight">{card.title}</h2>
                <p className="mt-3 text-sm leading-7">{card.text}</p>
              </article>
            ))}
          </section>
        )}

        <section className="space-y-4" ref={searchRef}>
          {isQrEntry && (
            <div className="rounded-[24px] border border-line bg-surface px-4 py-4 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-brand-500">
                    {orderMode === 'table' ? 'Ваш столик' : 'Формат заказа'}
                  </p>
                  <p className="mt-1 text-base font-semibold text-ink">
                    {orderMode === 'table' ? tableLabel : formatModeLabel(orderMode)}
                  </p>
                </div>
                {hasTableNumber && (
                  <span className="rounded-full bg-accentSoft px-3 py-2 text-sm font-semibold text-accentDeep">
                    QR активен
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="rounded-[24px] border border-line bg-surface px-5 py-4 shadow-soft">
              <p className="text-xs uppercase tracking-[0.22em] text-brand-500">
                Быстрые сценарии
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['?table=12', '?pickup=1', '?delivery=1'].map((scenario) => (
                  <span
                    key={scenario}
                    className="rounded-full bg-muted px-3 py-2 text-sm font-semibold text-slate"
                  >
                    {scenario}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <CategoryTabs
            categories={remoteCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        <section className="space-y-5" ref={menuRef}>
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-brand-500">каталог</p>
                <h2 className="mt-2 font-display text-4xl leading-none text-ink">
                  {sectionTitle}
                </h2>
              </div>
              <div className="rounded-full bg-accentSoft px-4 py-2 text-sm font-semibold text-accentDeep">
                {filteredItems.length} позиций
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-slate">
              Сразу показываем блюда, а поиск и категории всегда под рукой. Это удобнее для
              сценария, когда гость только что отсканировал QR на столе.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item, index) => (
              <DishCard
                key={item.id}
                item={item}
                priority={index < 3}
                onOpen={handleOpenItem}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="rounded-[28px] border border-dashed border-brand-300 bg-surface px-6 py-12 text-center shadow-soft">
              <h3 className="font-display text-4xl text-ink">Ничего не найдено</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate">
                Попробуйте другой поисковый запрос или соседнюю категорию.
              </p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-brand-500">популярное</p>
              <h2 className="mt-2 font-display text-4xl leading-none text-ink">Хиты недели</h2>
            </div>
          </div>

          <div className="hide-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {popularItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleOpenItem(item)}
                className="min-w-[260px] rounded-[28px] border border-line bg-surface p-4 text-left shadow-soft"
              >
                <div className="flex items-center gap-2">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${tagStyles[tag]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-ink">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate">{item.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-lg font-bold text-ink">{formatPrice(item.price)}</span>
                  <span className="text-sm font-semibold text-accent">Открыть</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section
          ref={contactsRef}
          className="grid gap-4 rounded-[32px] border border-line bg-surface p-5 shadow-soft lg:grid-cols-[1fr_1fr]"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-brand-500">контакты</p>
            <h2 className="mt-2 font-display text-4xl leading-none text-ink">
              Набережные Челны
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate">
              Формат уже готов для города, доставки, QR-сценариев и PWA-установки.
              Следующим этапом сюда можно подключить реальную отправку заказа.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="tel:+78552391234"
                className="rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white"
              >
                +7 (8552) 39-12-34
              </a>
              <a
                href="https://wa.me/78552391234"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line px-4 py-3 text-sm font-semibold text-slate"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="space-y-3 rounded-[28px] bg-muted p-5">
            <p className="text-sm font-semibold text-ink">Точки интеграции уже готовы</p>
            <div className="grid gap-3">
              {[
                'Корзина и checkout для телефона',
                'Режимы table / pickup / delivery',
                'PWA и установка на экран',
                'Подключение аналитики через env',
              ].map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl bg-surface px-4 py-3 text-sm font-medium text-slate"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {cartCount > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="safe-fixed-bottom fixed right-4 z-40 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-float"
        >
          Корзина · {cartCount} · {formatPrice(cartTotal)}
        </button>
      )}

      <DishDetailsSheet
        item={activeItem}
        onClose={() => setActiveItem(null)}
        onAdd={(item, options) => {
          addLineToCart(item, options);
          setActiveItem(null);
          setCartOpen(true);
        }}
      />

      <CartSheet
        open={isCartOpen}
        lines={cartLines}
        items={remoteItems}
        tableLabel={orderMode === 'table' ? tableLabel : formatModeLabel(orderMode)}
        onClose={() => setCartOpen(false)}
        onIncrease={(lineId) => updateLineQuantity(lineId, 1)}
        onDecrease={(lineId) => updateLineQuantity(lineId, -1)}
        onRemove={removeLine}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutSheet
        open={isCheckoutOpen}
        orderMode={orderMode}
        tableLabel={orderMode === 'table' ? tableLabel : formatModeLabel(orderMode)}
        lines={cartLines}
        items={remoteItems}
        total={cartTotal}
        form={checkoutForm}
        confirmationCode={confirmationCode}
        onClose={() => {
          setCheckoutOpen(false);
          if (confirmationCode) {
            setConfirmationCode(null);
          }
        }}
        onChange={(field, value) =>
          setCheckoutForm((current) => ({ ...current, [field]: value }))
        }
        onSubmit={handleCheckoutSubmit}
      />

      <MobileNav
        cartCount={cartCount}
        onSearch={() => scrollToSection(searchRef.current)}
        onMenu={() => scrollToSection(menuRef.current)}
        onCart={() => setCartOpen(true)}
        onContacts={() => scrollToSection(contactsRef.current)}
      />
    </div>
  );
}

export default App;
