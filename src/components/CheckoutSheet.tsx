import { CartLine, MenuItem, OrderMode } from '../types/menu';
import { formatModeLabel, formatPrice } from '../utils/formatters';

interface CheckoutFormState {
  name: string;
  phone: string;
  comment: string;
  address: string;
}

interface CheckoutSheetProps {
  open: boolean;
  orderMode: OrderMode;
  tableLabel: string;
  lines: CartLine[];
  items: MenuItem[];
  total: number;
  form: CheckoutFormState;
  confirmationCode: string | null;
  onClose: () => void;
  onChange: (field: keyof CheckoutFormState, value: string) => void;
  onSubmit: () => void;
}

export function CheckoutSheet({
  open,
  orderMode,
  tableLabel,
  lines,
  items,
  total,
  form,
  confirmationCode,
  onClose,
  onChange,
  onSubmit,
}: CheckoutSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-ink/55"
        aria-label="Закрыть checkout"
      />

      <div className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[32px] bg-surface p-5 shadow-float safe-bottom">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-brand-200" />

        {confirmationCode ? (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-successSoft text-2xl font-bold text-success">
              OK
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-brand-500">Заказ оформлен</p>
              <h2 className="mt-3 font-display text-4xl text-ink">{confirmationCode}</h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate">
                Это пока frontend-сценарий без backend, но экран уже готов для подключения
                отправки заказа в API, Airtable или Google Sheets.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
            >
              Вернуться в меню
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-brand-500">Checkout</p>
                <h2 className="mt-2 font-display text-3xl text-ink">Подтверждение заказа</h2>
                <p className="mt-2 text-sm text-slate">
                  Формат: {formatModeLabel(orderMode)} · {tableLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate"
              >
                Закрыть
              </button>
            </div>

            <div className="rounded-[24px] border border-line bg-muted/50 p-4">
              <p className="text-sm font-semibold text-ink">Состав заказа</p>
              <div className="mt-3 space-y-3">
                {lines.map((line) => {
                  const item = items.find((entry) => entry.id === line.itemId);

                  if (!item) {
                    return null;
                  }

                  const linePrice =
                    item.price +
                    item.modifiers
                      .filter((modifier) => line.modifierIds.includes(modifier.id))
                      .reduce((sum, modifier) => sum + modifier.price, 0);

                  return (
                    <div key={line.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-ink">
                        {item.name} x {line.quantity}
                      </span>
                      <span className="font-semibold text-ink">
                        {formatPrice(linePrice * line.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Имя</span>
                <input
                  value={form.name}
                  onChange={(event) => onChange('name', event.target.value)}
                  placeholder="Как к вам обращаться"
                  className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none placeholder:text-brand-500"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Телефон</span>
                <input
                  value={form.phone}
                  onChange={(event) => onChange('phone', event.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none placeholder:text-brand-500"
                />
              </label>

              {orderMode === 'delivery' && (
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Адрес доставки</span>
                  <input
                    value={form.address}
                    onChange={(event) => onChange('address', event.target.value)}
                    placeholder="Набережные Челны, улица, дом, подъезд"
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none placeholder:text-brand-500"
                  />
                </label>
              )}

              <label className="block">
                <span className="text-sm font-semibold text-ink">Комментарий ко всему заказу</span>
                <textarea
                  value={form.comment}
                  onChange={(event) => onChange('comment', event.target.value)}
                  rows={3}
                  placeholder="Например: позвонить за 5 минут до выдачи"
                  className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none placeholder:text-brand-500"
                />
              </label>
            </div>

            <div className="rounded-[26px] bg-ink p-5 text-white shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-white/70">Итого к подтверждению</p>
                  <p className="mt-1 font-display text-4xl leading-none">
                    {formatPrice(total)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onSubmit}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink"
                >
                  Подтвердить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
