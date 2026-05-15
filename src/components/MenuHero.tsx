import { OrderMode } from '../types/menu';
import { formatModeLabel } from '../utils/formatters';

interface MenuHeroProps {
  city: string;
  orderMode: OrderMode;
  tableLabel: string;
  hasTableNumber: boolean;
  canInstallApp: boolean;
  onInstallApp: () => void;
}

const heroStats = [
  { value: '25 мин', label: 'среднее ожидание' },
  { value: '4.9', label: 'оценка гостей' },
  { value: '24/7', label: 'доступ к меню по QR' },
];

export function MenuHero({
  city,
  orderMode,
  tableLabel,
  hasTableNumber,
  canInstallApp,
  onInstallApp,
}: MenuHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-line bg-[linear-gradient(135deg,#142033_0%,#23314b_52%,#1d5d76_100%)] px-5 py-6 text-white shadow-float sm:px-7 sm:py-8">
      <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
            mobile-first
          </span>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            {formatModeLabel(orderMode)}
          </span>
          {hasTableNumber && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
              {tableLabel}
            </span>
          )}
        </div>

        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.24em] text-white/65">{city}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            Меню, которое удобно
            <br />
            открывать с телефона
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/80 sm:text-base">
            QR за столиком, самовывоз, доставка и checkout без лишних экранов.
            Приложение теперь собрано вокруг мобильного сценария, а не вокруг десктопной сетки.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="font-display text-3xl leading-none">{stat.value}</p>
              <p className="mt-2 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="tel:+78552391234"
            className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-ink"
          >
            Позвонить
          </a>
          <a
            href="https://yandex.ru/maps/?text=%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D1%8B%D0%B5%20%D0%A7%D0%B5%D0%BB%D0%BD%D1%8B%20Amber%20Table"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white"
          >
            Маршрут
          </a>
          {canInstallApp && (
            <button
              type="button"
              onClick={onInstallApp}
              className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white"
            >
              На экран телефона
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
