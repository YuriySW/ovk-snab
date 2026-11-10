import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  Shield,
  Truck,
  Wrench,
} from "lucide-react";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import {
  getCategories,
  getFeaturedProducts,
  getHits,
  getShopStats,
} from "@/lib/data";

const works = [
  {
    title: "Монтаж отопления",
    text: "Котельные, радиаторы, тёплый пол — проектируем и собираем под объект.",
    tone: "from-[#1a2332] to-[#2a3a4f]",
  },
  {
    title: "Водоснабжение",
    text: "Насосные группы, коллекторы и разводка без лишних стыков и простоев.",
    tone: "from-[#243044] to-[#3a4d63]",
  },
  {
    title: "Канализация",
    text: "Внутренние и наружные системы с шумопоглощением и надёжными фитингами.",
    tone: "from-[#1f2c3d] to-[#34485e]",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const hits = getHits(4);
  const { tree } = getCategories();
  const stats = getShopStats();
  const topCats = tree
    .filter((c) => c.count > 50)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <>
      <Hero />

      <section className="section-pad">
        <div className="container-wide">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">
                Каталог
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Оборудование под задачу объекта
              </h2>
            </div>
            <Link href="/catalog" className="btn btn-outline self-start">
              Все {stats.products.toLocaleString("ru-RU")} позиций
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topCats.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="group relative min-w-0 overflow-hidden rounded-[24px] border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[var(--shadow)] sm:p-6"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg font-semibold leading-tight break-words sm:text-xl">
                      {cat.name}
                    </div>
                    <div className="mt-2 text-sm text-muted">
                      {cat.count.toLocaleString("ru-RU")} товаров
                    </div>
                  </div>
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-mist text-sm font-semibold text-ink transition group-hover:bg-ink group-hover:text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-copper">
                  Открыть
                  <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="container-wide section-pad grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-white/45">
              Почему мы
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Не витрина ради витрины — поставка и монтаж в одной команде
            </h2>
            <p className="mt-4 max-w-md text-white/65 leading-relaxed">
              Подбираем позиции по спецификации, держим сроки и закрываем объект
              без посредников между складом и бригадой.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: BadgeCheck,
                title: "Прямые поставки",
                text: "Работаем с ведущими производителями — без лишней наценки цепочки.",
              },
              {
                icon: Wrench,
                title: "Монтаж любой сложности",
                text: "Отопление, ГВС, канализация: от частного дома до коммерции.",
              },
              {
                icon: Truck,
                title: "Доставка по городу",
                text: "Комплектуем заказ и привозим на объект в согласованное окно.",
              },
              {
                icon: Shield,
                title: "Гарантия на работы",
                text: "Фиксируем ответственность договором и сервисным сопровождением.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5"
              >
                <item.icon className="size-5 text-copper" />
                <div className="mt-4 font-display text-lg font-semibold">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">
                Подборка
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Сильные позиции со склада
              </h2>
            </div>
            <Link href="/catalog?sort=price-desc" className="btn btn-outline self-start">
              Смотреть ещё
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section id="works" className="bg-mist/70">
        <div className="container-wide section-pad">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">
                Наши работы
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Объекты, где инженерия видна в результате
              </h2>
            </div>
            <Link href="/nashi-raboty" className="btn btn-outline self-start">
              Смотреть все работы
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {works.map((work) => (
              <article
                key={work.title}
                className={`relative min-h-[280px] overflow-hidden rounded-[28px] bg-gradient-to-br ${work.tone} p-7 text-white`}
              >
                <div className="pointer-events-none absolute -right-6 -top-6 size-32 rounded-full bg-white/5" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 size-40 rounded-full bg-copper/15 blur-2xl" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <Clock3 className="size-5 text-copper" />
                  <div>
                    <h3 className="font-display text-2xl font-semibold">
                      {work.title}
                    </h3>
                    <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-white/70">
                      {work.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Доступный вход в заказ
            </h2>
            <Link href="/catalog?sort=price-asc" className="text-sm font-semibold text-copper sm:inline">
              Ещё по цене →
            </Link>
          </div>
          <div className="product-grid">
            {hits.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-wide overflow-hidden rounded-[32px] bg-[linear-gradient(120deg,#0b1220_0%,#1a2a3d_55%,#2a1a12_100%)] px-6 py-12 text-white md:px-12 md:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Нужен расчёт спецификации сегодня?
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Пришлите список или чертёж — подберём аналоги, наличие и сроки.
              Прототип уже работает на ваших реальных данных каталога.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="tel:+79826546773" className="btn btn-primary">
                Позвонить
              </a>
              <Link href="/catalog" className="btn btn-ghost">
                В каталог
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
