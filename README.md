# Cafe QR Menu

Современное веб-меню для кафе и ресторанов с открытием по QR-коду и передачей номера столика через URL-параметр.

Проект собран на `React + TypeScript + Vite + Tailwind CSS` и подходит для публикации как статический сайт на VPS, Vercel, Netlify или любом другом хостинге, который умеет раздавать HTML/CSS/JS.

Репозиторий проекта на GitHub:

```text
https://github.com/theolegitz-crypto/Cafe
```

## Что умеет проект

- Показывает каталог блюд и категорий.
- Поддерживает поиск по меню.
- Фильтрует блюда по категориям.
- Читает номер столика из URL-параметра `?table=`.
- Подходит для QR-кодов на каждом столике.
- Собирается в статическую папку `dist/`.

Пример ссылки:

```text
https://your-domain.ru/?table=12
```

Если гость сканирует QR с такой ссылкой, сайт откроется сразу с привязкой к столику `12`.

## Технологии

- `React 18`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `PostCSS`

## Структура проекта

```text
cafe/
├─ docs/
│  └─ README.md
├─ src/
│  ├─ components/
│  │  ├─ CategoryTabs.tsx
│  │  ├─ DishCard.tsx
│  │  ├─ Footer.tsx
│  │  ├─ HeaderBar.tsx
│  │  ├─ MenuHero.tsx
│  │  └─ SearchBar.tsx
│  ├─ data/
│  │  └─ menu.ts
│  ├─ types/
│  │  └─ menu.ts
│  ├─ utils/
│  │  └─ formatters.ts
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ index.html
├─ package.json
├─ tailwind.config.ts
├─ tsconfig.json
└─ vite.config.ts
```

## Локальный запуск

### Требования

- `Node.js 18+`
- `npm 9+`

### Установка зависимостей

```powershell
npm.cmd install
```

### Запуск в режиме разработки

```powershell
npm.cmd run dev
```

По умолчанию Vite поднимет сайт примерно на:

```text
http://localhost:5173
```

### Открытие с телефона в одной сети

Если нужно протестировать открытие с телефона по локальной сети:

```powershell
npm.cmd run dev -- --host
```

После этого откройте на телефоне:

```text
http://IP_ВАШЕГО_КОМПЬЮТЕРА:5173/?table=12
```

## Сборка проекта

```powershell
npm.cmd run build
```

Готовая версия появится в папке:

```text
dist/
```

## Как работает QR-ссылка

В приложении номер столика читается из параметра `table` в URL.

Примеры:

- `https://your-domain.ru/?table=1`
- `https://your-domain.ru/?table=7`
- `https://your-domain.ru/?table=12`

Это означает:

- для каждого столика можно сделать отдельный QR;
- после сканирования открывается один и тот же сайт;
- сайт понимает, к какому столику относится заказ или просмотр.

## Как сгенерировать QR-коды

### Вариант 1. Через любой онлайн-генератор

Нужно вставить полную ссылку, например:

```text
https://your-domain.ru/?table=12
```

### Вариант 2. Через Python

Установка библиотеки:

```powershell
pip install qrcode[pil]
```

Пример генерации QR для нескольких столиков:

```powershell
@'
import qrcode

base = "https://your-domain.ru/"

for table in range(1, 21):
    url = f"{base}?table={table}"
    img = qrcode.make(url)
    img.save(f"table-{table}.png")
    print(url)
'@ | python
```

Будут созданы файлы:

- `table-1.png`
- `table-2.png`
- ...
- `table-20.png`

## Публикация на GitHub

Текущий репозиторий проекта:

```text
https://github.com/theolegitz-crypto/Cafe
```

Если репозиторий уже создан на GitHub:

```powershell
git remote add origin https://github.com/theolegitz-crypto/Cafe.git
git push -u origin main
```

Если удалённый репозиторий уже привязан:

```powershell
git push
```

Если `origin` уже существует, но нужно перепривязать его к этому репозиторию:

```powershell
git remote set-url origin https://github.com/theolegitz-crypto/Cafe.git
git push -u origin main
```

## Деплой на VPS

Ниже пример для `Ubuntu + nginx`, если проект хранится в `/opt/cafe`.

### 1. Установить базовые пакеты

```bash
sudo apt update
sudo apt install -y git nginx
```

### 2. Установить Node.js

Пример для `Node.js 20`:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. Клонировать проект из GitHub

```bash
cd /opt
sudo git clone https://github.com/theolegitz-crypto/Cafe.git cafe
sudo chown -R $USER:$USER /opt/cafe
cd /opt/cafe
```

### 4. Установить зависимости и собрать сайт

```bash
npm install
npm run build
```

После этого готовая версия будет лежать здесь:

```text
/opt/cafe/dist
```

### 5. Настроить nginx

Создайте конфиг:

```bash
sudo nano /etc/nginx/sites-available/cafe
```

Пример конфига для домена:

```nginx
server {
    listen 80;
    server_name your-domain.ru www.your-domain.ru;

    root /opt/cafe/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Если домена пока нет и нужен запуск по IP:

```nginx
server {
    listen 80 default_server;
    server_name _;

    root /opt/cafe/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 6. Включить сайт

```bash
sudo ln -s /etc/nginx/sites-available/cafe /etc/nginx/sites-enabled/cafe
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Проверить открытие

Сайт должен быть доступен по одному из адресов:

- `http://IP_СЕРВЕРА`
- `http://your-domain.ru`

## HTTPS через Let's Encrypt

Для QR и реального использования лучше сразу включить `HTTPS`.

Установка Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Выпуск сертификата:

```bash
sudo certbot --nginx -d your-domain.ru -d www.your-domain.ru
```

После этого сайт будет открываться по:

```text
https://your-domain.ru
```

И QR уже лучше делать именно на такой адрес:

```text
https://your-domain.ru/?table=12
```

## Обновление сайта на VPS после изменений

Если код обновился на GitHub:

```bash
cd /opt/cafe
git pull
npm install
npm run build
```

Источник обновления:

```text
https://github.com/theolegitz-crypto/Cafe
```

Обычно для статического сайта этого достаточно.

Если меняли конфиг nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Частые сценарии

### Открыть меню для конкретного столика

Пример:

```text
https://your-domain.ru/?table=18
```

### Распечатать QR на стол

Для каждого столика делается отдельная ссылка:

- стол 1: `https://your-domain.ru/?table=1`
- стол 2: `https://your-domain.ru/?table=2`
- стол 3: `https://your-domain.ru/?table=3`

### Проверить, что всё работает

1. Открыть ссылку в браузере вручную.
2. Проверить, что сайт загружается.
3. Проверить, что номер столика виден корректно.
4. Только после этого печатать QR.

## Возможные улучшения

- Корзина и оформление заказа.
- Отправка заказа на сервер или в Telegram.
- Админка для редактирования меню.
- Загрузка фото блюд вместо placeholder-изображений.
- Мультиязычность.
- Разделение меню на завтраки, основное, бар и сезонные предложения.

## Полезные команды

### Локальная разработка

```powershell
npm.cmd run dev
```

### Сборка

```powershell
npm.cmd run build
```

### Предпросмотр production-сборки

```powershell
npm.cmd run preview
```

### Git

```powershell
git status
git add .
git commit -m "Update cafe menu"
git push
```

### Первый push именно в этот репозиторий

```powershell
git remote add origin https://github.com/theolegitz-crypto/Cafe.git
git push -u origin main
```

## Примечания

- Проект статический, поэтому для базового запуска база данных не нужна.
- `dist/` не нужно хранить в GitHub, он собирается на сервере или локально.
- Для QR-кодов лучше использовать короткий и понятный домен.
- Для реального ресторана почти всегда лучше использовать `https`, а не `http`.

## Контрольный чек-лист перед запуском

- Проект собирается через `npm run build`.
- Репозиторий залит на GitHub.
- VPS доступен из интернета.
- `nginx` настроен на `/opt/cafe/dist`.
- Домен направлен на VPS.
- `HTTPS` включён.
- QR-коды содержат полные ссылки вида `https://domain.ru/?table=12`.
