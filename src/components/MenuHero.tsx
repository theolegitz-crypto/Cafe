interface MenuHeroProps {
  tableLabel: string;
  hasTableNumber: boolean;
}

const heroStats = [
  { value: '25 мин', label: 'среднее ожидание' },
  { value: '4.9', label: 'оценка гостей' },
  { value: '0%', label: 'визуального шума' },
];

export function MenuHero({ tableLabel, hasTableNumber }: MenuHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-line bg-surface px-6 py-6 shadow-float sm:px-8 sm:py-8">
      <div className="absolute inset-0 bg-glow opacity-80" />
      <div className="absolute -right-12 top-8 h-40 w-40 rounded-full bg-accentSoft blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-mint blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="animate-rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate">
            Обновленный интерфейс
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
            Современное меню
            <br />
            с чистой подачей
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate sm:text-lg">
            Убрали винтажный характер и сделали экран легче: светлые поверхности,
            чёткая иерархия, мягкие акценты и каталог, который выглядит как современный продукт.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink shadow-soft">
              {hasTableNumber ? `Ваш ${tableLabel}` : 'Откройте ссылку с ?table=12'}
            </div>
            <div className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-soft">
              Minimal UI
            </div>
          </div>
        </div>

        <div className="grid gap-4 animate-rise sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-[28px] border border-line bg-[linear-gradient(135deg,#152033_0%,#24324a_100%)] p-6 text-white shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Текущий режим</p>
            <p className="mt-3 font-display text-3xl leading-none">Самовывоз</p>
            <p className="mt-3 text-sm leading-6 text-white/78">
              Быстрая выдача, современная витрина и каталог с акцентом на понятный заказ.
            </p>
          </div>

          {heroStats.map((stat) => (
            <div key={stat.label} className="rounded-[24px] border border-line bg-surface p-5 shadow-soft">
              <p className="font-display text-3xl leading-none text-ink">{stat.value}</p>
              <p className="mt-2 text-sm text-slate">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
