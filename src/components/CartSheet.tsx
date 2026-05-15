import { CartLine, MenuItem } from '../types/menu';
import { formatPrice } from '../utils/formatters';

interface CartSheetProps {
  open: boolean;
  lines: CartLine[];
  items: MenuItem[];
  tableLabel: string;
  onClose: () => void;
  onIncrease: (lineId: string) => void;
  onDecrease: (lineId: string) => void;
  onRemove: (lineId: string) => void;
  onCheckout: () => void;
}

function findItem(items: MenuItem[], itemId: string) {
  return items.find((item) => item.id === itemId);
}

function getLineTotal(line: CartLine, item: MenuItem) {
  const modifiersTotal = item.modifiers
    .filter((modifier) => line.modifierIds.includes(modifier.id))
    .reduce((sum, modifier) => sum + modifier.price, 0);

  return (item.price + modifiersTotal) * line.quantity;
}

export function CartSheet({
  open,
  lines,
  items,
  tableLabel,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}: CartSheetProps) {
  if (!open) {
    return null;
  }

  const total = lines.reduce((sum, line) => {
    const item = findItem(items, line.itemId);
    return item ? sum + getLineTotal(line, item) : sum;
  }, 0);

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-ink/55" aria-label="Закрыть корзину" />

      <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[32px] bg-surface p-5 shadow-float safe-bottom">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-brand-200" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-500">Корзина</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Ваш заказ</h2>
            <p className="mt-2 text-sm text-slate">Привязка: {tableLabel}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate">
            Закрыть
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-dashed border-brand-300 bg-muted px-5 py-10 text-center">
            <p className="font-display text-3xl text-ink">Корзина пока пустая</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate">
              Откройте карточку блюда, выберите модификаторы и добавьте заказ в один тап.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {lines.map((line) => {
              const item = findItem(items, line.itemId);

              if (!item) {
                return null;
              }

              const selectedModifiers = item.modifiers.filter((modifier) =>
                line.modifierIds.includes(modifier.id),
              );

              return (
                <article key={line.id} className="rounded-[24px] border border-line bg-muted/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-ink">{item.name}</h3>
                      <p className="mt-1 text-sm text-slate">{item.portion}</p>
                    </div>
                    <p className="text-base font-bold text-ink">
                      {formatPrice(getLineTotal(line, item))}
                    </p>
                  </div>

                  {selectedModifiers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedModifiers.map((modifier) => (
                        <span key={modifier.id} className="rounded-full bg-surface px-3 py-1 text-xs text-slate">
                          {modifier.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {line.comment && (
                    <p className="mt-3 rounded-2xl bg-surface px-3 py-2 text-sm text-slate">
                      {line.comment}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDecrease(line.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-lg font-bold text-ink"
                      >
                        -
                      </button>
                      <span className="min-w-[20px] text-center text-base font-semibold text-ink">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onIncrease(line.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-lg font-bold text-ink"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove(line.id)}
                      className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate"
                    >
                      Удалить
                    </button>
                  </div>
                </article>
              );
            })}

            <div className="rounded-[26px] bg-ink p-5 text-white shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-white/70">Итого</p>
                  <p className="mt-1 font-display text-4xl leading-none">
                    {formatPrice(total)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onCheckout}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink"
                >
                  Перейти к checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
