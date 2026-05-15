export function Footer() {
  return (
    <footer className="rounded-[32px] border border-line bg-surface px-5 py-6 shadow-soft sm:px-6">
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brand-500">Город</p>
          <p className="mt-2 font-display text-3xl leading-none text-ink">
            Набережные Челны
          </p>
          <p className="mt-3 text-sm leading-6 text-slate">
            Mobile-first меню для заказов по QR, самовывозу и доставке.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brand-500">Контакты</p>
          <a href="tel:+78552391234" className="mt-2 block font-display text-3xl leading-none text-ink">
            +7 (8552) 39-12-34
          </a>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://2gis.ru/nabchelny/search/Amber%20Table"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-3 py-2 text-sm font-semibold text-slate"
            >
              2GIS
            </a>
            <a
              href="https://yandex.ru/maps/?text=%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D1%8B%D0%B5%20%D0%A7%D0%B5%D0%BB%D0%BD%D1%8B%20Amber%20Table"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-3 py-2 text-sm font-semibold text-slate"
            >
              Яндекс Карты
            </a>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brand-500">Адрес и режим</p>
          <p className="mt-2 text-base font-semibold text-ink">проспект Мира, 18А</p>
          <p className="mt-2 text-sm leading-6 text-slate">
            Ежедневно с 10:00 до 23:00. Самовывоз, доставка и посадка в зале.
          </p>
        </div>
      </div>
    </footer>
  );
}
