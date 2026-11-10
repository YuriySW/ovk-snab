# ОВК‑Снаб — прототип магазина (Next.js)

Локальный интернет‑магазин на выгруженных данных с ovk-snab.com.

## Запуск

```bash
cd web
npm install
npm run dev
```

Открыть: http://localhost:3000

## Что внутри

- Главная с hero, категориями, подборками
- Каталог: поиск, фильтры, сортировка, пагинация (4209 товаров)
- Карточка товара + характеристики + SEO title/description
- Корзина (drawer + страница), persist в localStorage
- Локальные фото из `../images/products`

## Стек

Next.js 16 · React 19 · Tailwind 4 · Zustand · Lucide · Unbounded + Manrope
