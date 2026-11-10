"use client";

import { useRouter } from "next/navigation";
import { FilterSelect } from "@/components/FilterSelect";

type Option = { value: string; label: string };

export function CatalogFilters({
  q,
  category,
  brand,
  sort,
  categories,
  brands,
}: {
  q: string;
  category: string;
  brand: string;
  sort: string;
  categories: Option[];
  brands: Option[];
}) {
  const router = useRouter();

  const go = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    const next = {
      q,
      category,
      brand,
      sort,
      ...patch,
    };
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog");
  };

  const sortOptions = [
    { value: "price-asc", label: "Сначала дешевле" },
    { value: "price-desc", label: "Сначала дороже" },
    { value: "name", label: "По названию" },
  ];

  return (
    <form
      action="/catalog"
      className="catalog-filters mb-8 rounded-[24px] border border-line bg-white p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        go({
          q: String(fd.get("q") || ""),
          category: String(fd.get("category") || ""),
          brand: String(fd.get("brand") || ""),
          sort: String(fd.get("sort") || ""),
        });
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Поиск по названию, артикулу или бренду"
          className="h-12 min-w-0 flex-1 rounded-full border border-line bg-paper px-5 outline-none focus:border-ink"
        />
        <button type="submit" className="btn btn-dark h-12 shrink-0 sm:px-8">
          Найти
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FilterSelect
          name="category"
          value={category}
          placeholder="Все категории"
          options={categories}
          onChange={(value) => go({ category: value, q, brand, sort })}
        />
        <FilterSelect
          name="brand"
          value={brand}
          placeholder="Все бренды"
          options={brands}
          onChange={(value) => go({ brand: value, q, category, sort })}
        />
        <FilterSelect
          name="sort"
          value={sort}
          placeholder="Сортировка"
          options={sortOptions}
          onChange={(value) => go({ sort: value, q, category, brand })}
        />
      </div>
    </form>
  );
}
