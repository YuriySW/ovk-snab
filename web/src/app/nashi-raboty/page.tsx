import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, PhoneCall } from "lucide-react";
import { WorksGallery } from "@/components/WorksGallery";
import works from "@/data/works.json";

export const metadata: Metadata = {
  title: "Наши работы",
  description:
    "Примеры монтажа отопления, водоснабжения и тёплого пола от ОВК‑Снаб в Екатеринбурге.",
};

export default function WorksPage() {
  return (
    <div className="bg-paper pt-[calc(var(--header-h)+1.25rem)] pb-20">
      <section className="container-wide">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Портфолио</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Наши работы
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Только большой опыт монтажа систем отопления даёт стабильный результат.
            Планируем эффективную разводку, сокращаем теплопотери и сдаём объект
            под ключ — с гарантией качества.
          </p>
        </div>

        <WorksGallery works={works} />
      </section>

      <section className="container-wide mt-16 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Проект и обмеры",
            text: "Снимаем объект, считаем нагрузку и подбираем оборудование без лишнего.",
          },
          {
            title: "Монтаж под ключ",
            text: "Полный спектр работ на объекте — от узла ввода до пусконаладки.",
          },
          {
            title: "Гарантия на работы",
            text: "Клиент принимает готовый результат: контролируем качество сами.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 rounded-[22px] border border-line bg-white p-5"
          >
            <BadgeCheck className="mt-0.5 size-5 shrink-0 text-copper" />
            <div>
              <div className="font-display text-lg font-semibold">{item.title}</div>
              <p className="mt-1 text-sm text-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="container-wide mt-14">
        <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(120deg,#0b1220_0%,#1a2a3d_55%,#2a1a12_100%)] px-6 py-12 text-white md:px-12">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Нужен монтаж на вашем объекте?
          </h2>
          <p className="mt-3 max-w-xl text-white/70">
            Оставьте заявку или позвоните — подберём схему, комплектацию и сроки
            под ваш объект в Екатеринбурге.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:+79826546773" className="btn btn-primary">
              <PhoneCall className="size-4" />
              Позвонить
            </a>
            <Link href="/catalog" className="btn btn-ghost">
              В каталог
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
