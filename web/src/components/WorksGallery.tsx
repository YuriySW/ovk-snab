"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Work = {
  id: string;
  title: string;
  category: string;
  image: string;
  text: string;
};

export function WorksGallery({ works }: { works: Work[] }) {
  const categories = useMemo(
    () => ["Все", ...Array.from(new Set(works.map((w) => w.category)))],
    [works],
  );
  const [active, setActive] = useState("Все");
  const filtered =
    active === "Все" ? works : works.filter((w) => w.category === active);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`works-chip ${active === cat ? "works-chip--active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((work, i) => (
          <article
            key={work.id}
            className={`group overflow-hidden rounded-[28px] border border-line bg-white ${
              i % 5 === 0 ? "sm:col-span-2 lg:col-span-2" : ""
            }`}
          >
            <div
              className={`relative overflow-hidden bg-mist ${
                i % 5 === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={work.image}
                alt={work.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                sizes={
                  i % 5 === 0
                    ? "(max-width:1024px) 100vw, 66vw"
                    : "(max-width:1024px) 50vw, 33vw"
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-6">
                <div className="text-xs uppercase tracking-[0.16em] text-white/70">
                  {work.category}
                </div>
                <h2 className="mt-1 font-display text-xl font-semibold md:text-2xl">
                  {work.title}
                </h2>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <p className="text-[0.98rem] leading-relaxed text-muted">{work.text}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
