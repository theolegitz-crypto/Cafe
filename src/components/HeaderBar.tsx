import { OrderMode } from '../types/menu';
import { CartIcon, InstallIcon } from './Icons';
import { formatModeLabel } from '../utils/formatters';

interface HeaderBarProps {
  city: string;
  orderMode: OrderMode;
  cartCount: number;
  canInstallApp: boolean;
  onInstallApp: () => void;
  onModeChange: (mode: OrderMode) => void;
  onOpenCart: () => void;
}

const modes: OrderMode[] = ['table', 'pickup', 'delivery'];

export function HeaderBar({
  city,
  orderMode,
  cartCount,
  canInstallApp,
  onInstallApp,
  onModeChange,
  onOpenCart,
}: HeaderBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/92 backdrop-blur-xl">
      <div className="safe-top">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white shadow-soft">
                AT
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-xl leading-none text-ink">
                  Amber Table
                </p>
                <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-slate">
                  {city}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canInstallApp && (
                <button
                  type="button"
                  onClick={onInstallApp}
                  className="inline-flex items-center gap-2 rounded-full bg-accentSoft px-3 py-2 text-xs font-semibold text-accentDeep"
                >
                  <InstallIcon className="h-4 w-4" />
                  Установить
                </button>
              )}

              <button
                type="button"
                onClick={onOpenCart}
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-bold text-white shadow-soft"
              >
                <CartIcon className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-[20px] rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="hide-scrollbar flex gap-2 overflow-x-auto">
            {modes.map((mode) => {
              const active = mode === orderMode;

              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onModeChange(mode)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-ink text-white shadow-soft'
                      : 'border border-line bg-surface text-slate'
                  }`}
                >
                  {formatModeLabel(mode)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
