# Финальный аудит Beauty Supply

**Дата:** 13 августа 2026  
**Репозиторий:** `BEAUTYSUPPLYMSK/s`  
**Ветка:** `arena/019ffd3a-s`  
**Живой сайт:** https://beautysupplymsk.github.io/s/

---

## Вердикт

Критический регресс из PR #2 ломал весь `scripts/main.js` (каталог, карточка товара, предзаказ).  
Дефект устранён, сопутствующие ошибки исправлены, синтаксис JS проверен (`node --check`).

---

## P0 — блокеры (исправлено)

| # | Дефект | Файл | Суть |
|---|--------|------|------|
| 1 | `SyntaxError: Identifier 'rawImage' has already been declared` | `scripts/main.js` | Повторный `const rawImage` в одном блоке после добавления динамических OG-тегов. Браузер не парсил **весь** `main.js`: не работали `initCatalogPage`, `initProductDetailPage`, `getQueryParam`. |
| 2 | Битые относительные ссылки на кастомной 404 | `404.html` | GitHub Pages отдаёт `404.html` по URL отсутствующей страницы. Ссылки `./index.html` с `/s/pages/foo` вели на `/s/pages/index.html`. Добавлен `<base href="https://beautysupplymsk.github.io/s/">`. |

## P1 — важное (исправлено)

| # | Дефект | Исправление |
|---|--------|-------------|
| 3 | Фильтр `goal` писался в URL, но не читался при загрузке | Восстановление `brand` / `category` / `goal` / `q` из query + проверка, что значение есть в `<select>` |
| 4 | Карточка товара всегда показывала «В наличии в Москве» | Бейдж зависит от `product.inStock` |
| 5 | Форма предзаказа собирала текст заявки и **не отправляла** его | Сообщение копируется в буфер, открывается Telegram с `start` + `text`, есть статус для пользователя |
| 6 | `localStorage` в cookie-баннере без try/catch | Падение в Safari Private / запрете storage. Централизованный `initCookieBanner()` + защита в `404.html` |
| 7 | Inline `onclick` галереи | Заменено на `data-src` + addEventListener (без инъекции пути в JS) |

## P2 — полировка (исправлено)

| # | Дефект | Исправление |
|---|--------|-------------|
| 8 | Опечатка «Все назначение» | «Все назначения» + недостающие цели фильтра |
| 9 | Escape закрывал меню только с фокуса на кнопке | Обработчик на `document` |
| 10 | `aria-current="false"` у неактивных ссылок | Атрибут только у текущей страницы |
| 11 | `telegramLink` без экранирования в `href` | `escapeHtml` + fallback на официального бота |
| 12 | `formatPrice(undefined)` → «NaN ₽» | «Цена по запросу» |
| 13 | Пустой блок «Рекомендуемые товары» | Секция скрывается, если нет релевантных позиций |
| 14 | JSON-LD `price` как число | Строка, как требует schema.org |
| 15 | `window.open` без `noopener` в предзаказе | `noopener,noreferrer` |

---

## Что проверено и оказалось в порядке

- 13 товаров в `products.json`: уникальные slug, все `hero.webp` / `hero-400.webp` / gallery-файлы на диске существуют.
- `reviews.json` валиден.
- `getBasePath()` корректен для `/`, `/pages/`, `/pages/legal/`.
- Все 11 HTML: doctype, `lang="ru"`, charset, viewport, ровно один `<h1>`.
- `sitemap.xml` покрывает 9 статичных URL + 13 товарных slug.
- Секретов / API-ключей в коде нет.
- Внешние ссылки с `target="_blank"` имеют `rel="noopener noreferrer"`.

---

## Заблокировано (нужны данные заказчика)

Не выдумывалось и не заполнялось:

1. **ИНН / ОГРН / юридический адрес** — футер, контакты, оферта (TODO в коде).
2. **Счётчик аналитики** — Яндекс.Метрика / GA4 (TODO в `<head>`).
3. **Полный текст оферты и реквизиты ИП.**

---

## Инфраструктурное замечание (не код)

GitHub Pages сейчас в режиме **legacy** (`source: main /`).  
Workflow `.github/workflows/pages.yml` (исключает `original-product-images`, `product-card-assets`, `AUDIT_REPORT.md`) **не является активным источником деплоя**.  
Внутренние рабочие папки сейчас публикуются вместе с сайтом. Чтобы включить фильтрацию артефакта, в настройках репозитория нужно переключить Pages на GitHub Actions.

---

## Изменённые файлы

- `scripts/main.js`
- `scripts/components.js`
- `pages/catalog.html`
- `pages/preorder.html`
- `404.html`
- `FINAL_AUDIT.md` (этот отчёт)

---

**Статус:** дефекты закрыты, ветка готова к merge в `main`.
