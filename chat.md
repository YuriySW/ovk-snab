# ОВК‑Снаб — история работы (чат)

Краткий лог сессии, чтобы в следующий раз сразу было понятно, что уже сделано.

**Дата:** август 2026  
**Папка проекта:** `/Users/yuriys/Downloads/OVK`

---

## Цель

Пересобрать сайт [ovk-snab.com](https://ovk-snab.com/) на современном стеке с современным оформлением: каталог, карточки, корзина, SEO, локальный прототип.

---

## 1. Анализ старого сайта

- WordPress + WooCommerce, тема Total + WPBakery
- **~4 209 товаров**, **121 категория**, **~1 449 уникальных фото**
- Артикулы в атрибутах / названии (поле SKU пустое)
- Yoast SEO доступен через WP API
- Оценка выгрузки: ~80–200 МБ

**Вывод:** тему WP менять можно, но для «вау»-дизайна лучше новый стек. Для Amvera рекомендован **Next.js + PostgreSQL**.

---

## 2. Выгрузка данных (локально, скриптами)

| Файл / папка | Содержание |
|---|---|
| `data/catalog.json` | 4209 товаров |
| `data/categories.json` | категории (flat + tree) |
| `data/pages.json` | 6 страниц |
| `data/brands.json` | 34 бренда |
| `data/seo.json` / `seo-by-slug.json` | Yoast meta title, description, canonical, OG, schema |
| `data/page-images.json` | карта картинок со страниц |
| `images/products/` | уникальные фото товаров |
| `images/site/` | фото портфолио / UI |
| `export_catalog.py` | скрипт каталога + фото |
| `export_seo.py` | скрипт SEO |

Повторный запуск:

```bash
python3 export_catalog.py
python3 export_seo.py
```

---

## 3. Прототип магазина — `web/`

**Стек:** Next.js 16 · React 19 · Tailwind 4 · Zustand · Lucide · Unbounded + Manrope

**Запуск:**

```bash
cd web
npm install
npm run dev
# http://localhost:3000
```

### Страницы

- `/` — главная (hero, категории, подборки, УТП, CTA)
- `/catalog` — поиск, фильтры (категория / бренд / сортировка), пагинация
- `/product/[slug]` — карточка, характеристики, похожие, SEO
- `/cart` — корзина (+ drawer в шапке)

### Данные для приложения

- `web/src/data/products-index.json`
- `web/src/data/products-by-slug.json`
- `web/src/data/categories.json`
- `web/src/data/brands.json`
- Фото: `web/public/images/products` → symlink на `../images/products`

---

## 4. Дизайн и правки по ходу

- Hero full-bleed, бренд крупно, copper-акцент на cold steel
- Шапка: светлый текст на тёмном hero (через CSS `!important` — Tailwind `text-white` местами не применялся)
- Бургер-меню на главной: тёмное, как hero, белый текст
- Карточки: без внутренних «рамок»/градиента под фото, белый фон, `object-contain`
- Каталог: сайдбар со всеми категориями убран → **выпадающие фильтры**
- Нативный `<select>` на macOS открывался криво → кастомный `FilterSelect`
- Статистика в hero: `flex` + `justify-between`
- Стрелка у select: отступ от края

### Hero-изображения

- Текущий: `web/public/images/hero.jpg` (**вариант 2** — коллектор / арматура)
- Варианты: `web/public/images/hero-options/hero-option-1.jpg` … `5.jpg`
- Старый industrial: в assets Cursor / можно вернуть из `hero-options` при необходимости

---

## 5. Что ещё не сделано (следующие шаги)

- [ ] Форма заявки из корзины (сейчас телефон / localStorage)
- [ ] Импорт в PostgreSQL + деплой на **Amvera**
- [ ] Редиректы со старых URL (`permalink` / canonical)
- [ ] `sitemap.xml` на 4209 товаров
- [ ] Админка / обновление цен
- [ ] Финальный выбор hero (варианты 1–5 готовы)

---

## 6. Важно помнить

1. **Токены AI** тратятся только в чате; скрипты выгрузки и `npm run dev` локально токены не едят.
2. Белый текст на тёмном фоне лучше задавать явным CSS (`#fff !important`), иначе бывают «пустые» активные кнопки.
3. Сервер dev на `:3000` при необходимости: `npm run dev` в `web/`; остановить — убить процесс на порту 3000.

---

*Файл создан по запросу: «сохрани чат… создай chat.md».*
