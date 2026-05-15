import { useEffect, useState } from 'react';
import { MenuItem } from '../types/menu';
import { buildPlaceholderImage, formatPrice, tagStyles } from '../utils/formatters';

interface DishDetailsSheetProps {
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (
    item: MenuItem,
    options: { quantity: number; modifierIds: string[]; comment: string },
  ) => void;
}

export function DishDetailsSheet({
  item,
  onClose,
  onAdd,
}: DishDetailsSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const [modifierIds, setModifierIds] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!item) {
      return;
    }

    setQuantity(1);
    setComment('');
    setModifierIds(
      item.modifiers.filter((modifier) => modifier.defaultSelected).map((modifier) => modifier.id),
    );
  }, [item]);

  if (!item) {
    return null;
  }

  const imageSrc = buildPlaceholderImage(
    item.imageLabel,
    item.accentFrom,
    item.accentTo,
  );

  const modifiersTotal = item.modifiers
    .filter((modifier) => modifierIds.includes(modifier.id))
    .reduce((sum, modifier) => sum + modifier.price, 0);

  const total = (item.price + modifiersTotal) * quantity;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-ink/55"
      />

      <div className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[32px] bg-surface p-5 shadow-float safe-bottom">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-brand-200" />

        <div className="relative overflow-hidden rounded-[28px] bg-muted p-4">
          <img src={imageSrc} alt={item.name} className="h-64 w-full rounded-[24px] object-cover" />
          <div className="absolute left-6 top-6 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className={`rounded-full px-3 py-1 text-[11px] font-semibold ${tagStyles[tag]}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brand-500">{item.category}</p>
            <h2 className="mt-2 font-display text-3xl leading-tight text-ink">{item.name}</h2>
            <p className="mt-2 text-sm leading-7 text-slate">{item.description}</p>
            <p className="mt-3 text-sm font-medium text-brand-600">
              {item.portion} · {item.calories}
            </p>
          </div>

          <section className="rounded-[24px] border border-line bg-muted/50 p-4">
            <p className="text-sm font-semibold text-ink">Состав</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="rounded-full border border-line bg-surface px-3 py-2 text-sm text-slate"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-line bg-surface p-4">
            <p className="text-sm font-semibold text-ink">Модификаторы</p>
            <div className="mt-3 space-y-3">
              {item.modifiers.map((modifier) => {
                const checked = modifierIds.includes(modifier.id);

                return (
                  <label
                    key={modifier.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-line px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{modifier.name}</p>
                      <p className="mt-1 text-sm text-slate">
                        {modifier.price === 0 ? 'Без доплаты' : `+ ${formatPrice(modifier.price)}`}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setModifierIds((current) =>
                          checked
                            ? current.filter((id) => id !== modifier.id)
                            : [...current, modifier.id],
                        )
                      }
                      className="h-5 w-5 accent-[rgb(255,122,89)]"
                    />
                  </label>
                );
              })}
            </div>
          </section>

          <section className="rounded-[24px] border border-line bg-surface p-4">
            <label className="block text-sm font-semibold text-ink" htmlFor="dish-comment">
              Комментарий к блюду
            </label>
            <textarea
              id="dish-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              placeholder="Например: без лука, соус отдельно"
              className="mt-3 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none placeholder:text-brand-500"
            />
          </section>

          <div className="flex items-center justify-between gap-4 rounded-[24px] border border-line bg-surface p-4">
            <div>
              <p className="text-sm text-slate">Количество</p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-lg font-bold text-ink"
                >
                  -
                </button>
                <span className="min-w-[24px] text-center text-lg font-bold text-ink">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-lg font-bold text-ink"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAdd(item, { quantity, modifierIds, comment })}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft"
            >
              В корзину · {formatPrice(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
