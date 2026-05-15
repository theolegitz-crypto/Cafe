import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { MenuItem, MenuTag } from '../types/menu';
import { formatPrice } from '../utils/formatters';

interface AdminMenuPayload {
  categories: string[];
  items: MenuItem[];
}

const tagOptions: MenuTag[] = ['Хит', 'Новинка', 'Острое', 'Вегетарианское'];

const blankItem = (): MenuItem => ({
  id: `item-${Date.now()}`,
  category: 'Закуски',
  name: 'Новое блюдо',
  description: '',
  price: 0,
  portion: '',
  imageLabel: 'New Dish',
  accentFrom: '#ff7a59',
  accentTo: '#ffb28f',
  imageUrl: null,
  tags: [],
  ingredients: [],
  modifiers: [],
  calories: '',
  popular: false,
  promoText: '',
  isAvailable: true,
});

function parseLines(value: string) {
  return value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function stringifyModifiers(item: MenuItem) {
  return item.modifiers
    .map((modifier) =>
      [modifier.id, modifier.name, modifier.price, modifier.defaultSelected ? '1' : '0'].join('|'),
    )
    .join('\n');
}

function parseModifiers(value: string) {
  return value
    .split('\n')
    .map((line, index) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [id, name, price, defaultSelected] = line.split('|');

      return {
        id: id?.trim() || `modifier-${index + 1}`,
        name: name?.trim() || `Опция ${index + 1}`,
        price: Number(price || 0),
        defaultSelected: defaultSelected === '1',
      };
    });
}

export function AdminApp() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MenuItem | null>(null);
  const [ingredientsText, setIngredientsText] = useState('');
  const [modifiersText, setModifiersText] = useState('');

  async function loadAdminMenu() {
    const response = await fetch('/api/admin/menu', {
      credentials: 'include',
    });

    if (response.status === 401) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    if (!response.ok) {
      throw new Error('Не удалось загрузить меню');
    }

    const payload = (await response.json()) as AdminMenuPayload;
    setItems(payload.items);
    setCategories(payload.categories);
    const first = payload.items[0] ?? blankItem();
    setSelectedId(first.id);
    setDraft(first);
    setIngredientsText(first.ingredients.join('\n'));
    setModifiersText(stringifyModifiers(first));
    setAuthenticated(true);
    setLoading(false);
  }

  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('no_session');
        }

        return loadAdminMenu();
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const selected = items.find((item) => item.id === selectedId);

    if (!selected) {
      return;
    }

    setDraft(selected);
    setIngredientsText(selected.ingredients.join('\n'));
    setModifiersText(stringifyModifiers(selected));
  }, [selectedId, items]);

  const selectedPreviewPrice = useMemo(() => {
    if (!draft) {
      return formatPrice(0);
    }

    return formatPrice(draft.price);
  }, [draft]);

  async function handleLogin() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Неверный пароль');
      }

      await loadAdminMenu();
    } catch (loginError) {
      setLoading(false);
      setError(loginError instanceof Error ? loginError.message : 'Ошибка входа');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    });

    setAuthenticated(false);
    setPassword('');
    setItems([]);
    setDraft(null);
    setSelectedId(null);
  }

  function updateDraft<K extends keyof MenuItem>(key: K, value: MenuItem[K]) {
    if (!draft) {
      return;
    }

    setDraft({
      ...draft,
      [key]: value,
    });
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!draft) {
      return;
    }

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить изображение');
      }

      const payload = (await response.json()) as { url: string };
      updateDraft('imageUrl', payload.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Ошибка загрузки');
    } finally {
      setSaving(false);
      event.target.value = '';
    }
  }

  async function handleSave() {
    if (!draft) {
      return;
    }

    setSaving(true);
    setError(null);

    const payload: MenuItem = {
      ...draft,
      ingredients: parseLines(ingredientsText),
      modifiers: parseModifiers(modifiersText),
      promoText: draft.promoText?.trim() || '',
    };

    try {
      const method = items.some((item) => item.id === payload.id) ? 'PUT' : 'POST';
      const url =
        method === 'PUT'
          ? `/api/admin/items/${payload.id}`
          : '/api/admin/items';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Не удалось сохранить карточку');
      }

      await loadAdminMenu();
      setSelectedId(payload.id);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!draft) {
      return;
    }

    if (!window.confirm(`Удалить карточку "${draft.name}"?`)) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/items/${draft.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить карточку');
      }

      await loadAdminMenu();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Ошибка удаления');
    } finally {
      setSaving(false);
    }
  }

  function handleCreate() {
    const item = blankItem();
    setDraft(item);
    setSelectedId(item.id);
    setIngredientsText('');
    setModifiersText('');
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="rounded-[28px] border border-line bg-surface px-6 py-8 text-center shadow-soft">
          <p className="font-display text-3xl text-ink">Загрузка админки</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="w-full max-w-md rounded-[32px] border border-line bg-surface p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.22em] text-brand-500">/admin</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Вход в админ-панель</h1>
          <p className="mt-3 text-sm leading-7 text-slate">
            После входа можно загружать фотографии, менять цены, описания, категории и теги карточек.
          </p>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-ink">Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
              placeholder="Введите ADMIN_PASSWORD"
            />
          </label>

          {error && <p className="mt-3 text-sm font-medium text-accentDeep">{error}</p>}

          <button
            type="button"
            onClick={handleLogin}
            className="mt-5 w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-[30px] border border-line bg-surface p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-500">Админка</p>
              <h1 className="mt-2 font-display text-4xl text-ink">Меню и карточки</h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate"
            >
              Выйти
            </button>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="mt-5 w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Новая карточка
          </button>

          <div className="mt-5 space-y-3">
            {items.map((item) => {
              const selected = item.id === selectedId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                    selected
                      ? 'border-transparent bg-ink text-white shadow-soft'
                      : 'border-line bg-muted text-ink'
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.18em] opacity-70">{item.category}</p>
                  <p className="mt-2 text-base font-semibold">{item.name}</p>
                  <p className="mt-2 text-sm opacity-80">{formatPrice(item.price)}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-[30px] border border-line bg-surface p-5 shadow-soft">
          {draft && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-500">Редактирование</p>
                  <h2 className="mt-2 font-display text-4xl text-ink">{draft.name}</h2>
                  <p className="mt-2 text-sm text-slate">Предпросмотр цены: {selectedPreviewPrice}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-slate disabled:opacity-60"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              {error && <p className="text-sm font-medium text-accentDeep">{error}</p>}

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-ink">ID</span>
                  <input
                    value={draft.id}
                    onChange={(event) => updateDraft('id', event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-ink">Название</span>
                  <input
                    value={draft.name}
                    onChange={(event) => updateDraft('name', event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-ink">Категория</span>
                  <input
                    list="admin-categories"
                    value={draft.category}
                    onChange={(event) => updateDraft('category', event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                  />
                  <datalist id="admin-categories">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-ink">Цена</span>
                  <input
                    type="number"
                    value={draft.price}
                    onChange={(event) => updateDraft('price', Number(event.target.value))}
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-ink">Порция</span>
                  <input
                    value={draft.portion}
                    onChange={(event) => updateDraft('portion', event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-ink">Калорийность</span>
                  <input
                    value={draft.calories}
                    onChange={(event) => updateDraft('calories', event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                  />
                </label>

                <label className="block lg:col-span-2">
                  <span className="text-sm font-semibold text-ink">Описание</span>
                  <textarea
                    value={draft.description}
                    onChange={(event) => updateDraft('description', event.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                  />
                </label>

                <label className="block lg:col-span-2">
                  <span className="text-sm font-semibold text-ink">Promo текст</span>
                  <input
                    value={draft.promoText ?? ''}
                    onChange={(event) => updateDraft('promoText', event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                  />
                </label>

                <label className="block lg:col-span-2">
                  <span className="text-sm font-semibold text-ink">Изображение</span>
                  <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <input
                      value={draft.imageUrl ?? ''}
                      onChange={(event) => updateDraft('imageUrl', event.target.value)}
                      placeholder="/uploads/your-image.jpg"
                      className="w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                    />
                    <label className="flex cursor-pointer items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-slate">
                      Загрузить файл
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {draft.imageUrl && (
                    <img
                      src={draft.imageUrl}
                      alt={draft.name}
                      className="mt-3 h-40 w-full rounded-2xl object-cover sm:w-72"
                    />
                  )}
                </label>

                <label className="block lg:col-span-2">
                  <span className="text-sm font-semibold text-ink">Ингредиенты</span>
                  <textarea
                    value={ingredientsText}
                    onChange={(event) => setIngredientsText(event.target.value)}
                    rows={6}
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                    placeholder="Один ингредиент на строку"
                  />
                </label>

                <label className="block lg:col-span-2">
                  <span className="text-sm font-semibold text-ink">Модификаторы</span>
                  <textarea
                    value={modifiersText}
                    onChange={(event) => setModifiersText(event.target.value)}
                    rows={6}
                    className="mt-2 w-full rounded-2xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none"
                    placeholder="id|Название|Цена|1 или 0"
                  />
                </label>
              </div>

              <div className="rounded-[28px] border border-line bg-muted/50 p-5">
                <p className="text-sm font-semibold text-ink">Теги и публикация</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {tagOptions.map((tag) => {
                    const active = draft.tags.includes(tag);

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          updateDraft(
                            'tags',
                            active
                              ? draft.tags.filter((entry) => entry !== tag)
                              : [...draft.tags, tag],
                          )
                        }
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          active
                            ? 'bg-ink text-white'
                            : 'border border-line bg-surface text-slate'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-medium text-ink">
                    <input
                      type="checkbox"
                      checked={Boolean(draft.popular)}
                      onChange={(event) => updateDraft('popular', event.target.checked)}
                      className="h-4 w-4 accent-[rgb(20,32,51)]"
                    />
                    Показывать в хитах
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-medium text-ink">
                    <input
                      type="checkbox"
                      checked={draft.isAvailable !== false}
                      onChange={(event) => updateDraft('isAvailable', event.target.checked)}
                      className="h-4 w-4 accent-[rgb(20,32,51)]"
                    />
                    Доступно в меню
                  </label>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
