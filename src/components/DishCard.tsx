import { MenuItem } from '../types/menu';
import { buildPlaceholderImage, formatPrice } from '../utils/formatters';

interface DishCardProps {
  item: MenuItem;
  priority?: boolean;
}

export function DishCard({ item, priority = false }: DishCardProps) {
  const imageSrc = buildPlaceholderImage(
    item.imageLabel,
    item.accentFrom,
    item.accentTo,
  );

  return (
    <article className="group overflow-hidden rounded-[28px] border border-line bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-float">
      <div className="relative bg-muted p-4">
        <img
          src={imageSrc}
          alt={item.name}
          className="h-64 w-full rounded-[20px] object-cover transition duration-500 group-hover:scale-[1.02]"
          loading={priority ? 'eager' : 'lazy'}
        />
        <span className="absolute left-6 top-6 rounded-full bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent shadow-soft">
          new
        </span>
      </div>

      <div className="space-y-3 px-4 pb-4 pt-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-brand-500">{item.category}</p>
          <h3 className="mt-2 text-xl font-semibold leading-7 text-ink">{item.name}</h3>
          <p className="mt-1 text-sm text-brand-500">{item.portion}</p>
        </div>

        <p className="line-clamp-2 min-h-[3rem] text-sm leading-6 text-slate">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            className="flex items-center gap-3 rounded-full bg-ink px-4 py-2 text-left text-white transition hover:bg-brand-800"
          >
            <span className="text-lg font-bold">{formatPrice(item.price)}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg leading-none text-ink shadow-soft">
              +
            </span>
          </button>
          <span className="text-[11px] uppercase tracking-[0.18em] text-brand-500">
            к заказу
          </span>
        </div>
      </div>
    </article>
  );
}
