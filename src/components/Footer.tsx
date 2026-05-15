export function Footer() {
  return (
    <footer className="rounded-[32px] border border-line bg-surface px-5 py-6 shadow-soft sm:px-6">
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brand-500">Режим работы</p>
          <p className="mt-2 font-display text-3xl leading-none text-ink">10:00 - 23:00</p>
          <p className="mt-3 text-sm leading-6 text-slate">
            Ежедневно, с быстрой выдачей и понятной навигацией по меню.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brand-500">Телефон</p>
          <a href="tel:+74951234567" className="mt-2 block font-display text-3xl leading-none text-ink">
            +7 (495) 123-45-67
          </a>
          <p className="mt-3 text-sm leading-6 text-slate">
            Бронь столов, самовывоз и помощь с заказом.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brand-500">Адрес</p>
          <p className="mt-2 font-display text-3xl leading-none text-ink">Москва</p>
          <p className="mt-3 text-sm leading-6 text-slate">
            Примерный переулок, 7. Светлый зал, чистая подача и спокойный интерфейс.
          </p>
        </div>
      </div>
    </footer>
  );
}
