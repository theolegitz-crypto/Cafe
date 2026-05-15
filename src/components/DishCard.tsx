import { MenuItem } from '../types/menu';
import { buildPlaceholderImage, formatPrice, tagStyles } from '../utils/formatters';

interface DishCardProps {
  item: MenuItem;
  priority?: boolean;
  onOpen: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export function DishCard({
  item,
  priority = false,
  onOpen,
  onQuickAdd,
}: DishCardProps) {
  const imageSrc =
    item.imageUrl ||
    buildPlaceholderImage(item.imageLabel, item.accentFrom, item.accentTo);

  return (
    <article className="overflow-hidden rounded-[28px] border border-line bg-surface shadow-card">
      <button type="button" onClick={() => onOpen(item)} className="block w-full text-left">
        <div className="relative bg-muted p-4">
          <img
            src={imageSrc}
            alt={item.name}
            className="h-56 w-full rounded-[20px] object-cover"
            loading={priority ? 'eager' : 'lazy'}
          />
          <div className="absolute left-6 top-6 flex flex-wrap gap-2">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${tagStyles[tag]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 px-4 pb-4 pt-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-500">
              {item.category}
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-7 text-ink">{item.name}</h3>
            <p className="mt-1 text-sm text-brand-500">
              {item.portion} · {item.calories}
            </p>
          </div>

          <p className="line-clamp-2 min-h-[3rem] text-sm leading-6 text-slate">
            {item.description}
          </p>

          {item.promoText && (
            <div className="rounded-2xl bg-accentSoft px-3 py-2 text-xs font-medium text-accentDeep">
              {item.promoText}
            </div>
          )}
        </div>
      </button>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-4">
        <button
          type="button"
          onClick={() => onQuickAdd(item)}
          className="flex items-center gap-3 rounded-full bg-ink px-4 py-2 text-left text-white transition hover:bg-brand-800"
        >
          <span className="text-lg font-bold">{formatPrice(item.price)}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg leading-none text-ink">
            +
          </span>
        </button>

        <button
          type="button"
          onClick={() => onOpen(item)}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate"
        >
          Подробнее
        </button>
      </div>
    </article>
  );
}
