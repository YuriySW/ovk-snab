"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { queryProducts } from "@/lib/catalog-query";
import { pluralRu } from "@/lib/format";
import type { CategoryFlat, CategoryNode, ProductIndex } from "@/lib/types";

export function CatalogView({
  products,
  tree,
  flat,
  brands,
}: {
  products: ProductIndex[];
  tree: CategoryNode[];
  flat: CategoryFlat[];
  brands: string[];
}) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const sortRaw = searchParams.get("sort") || "";
  const sort =
    sortRaw === "price-asc" || sortRaw === "price-desc" || sortRaw === "name"
      ? sortRaw
      : undefined;
  const page = Number(searchParams.get("page") || 1);

  const result = useMemo(
    () => queryProducts(products, { q, category, brand, page, sort }),
    [products, q, category, brand, page, sort],
  );

  const activeCategory = flat.find((c) => c.slug === category);

  const makeHref = (patch: Record<string, string | undefined>) => {
    const next = {
      q,
      category,
      brand,
      sort: sortRaw,
      page: undefined as string | undefined,
      ...patch,
    };
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return qs ? `/catalog?${qs}` : "/catalog";
  };

  return (
    <div className="bg-paper pt-[calc(var(--header-h)+1.5rem)] pb-16">
      <div className="container-wide">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">
            Каталог
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {activeCategory?.name || "Всё оборудование"}
          </h1>
          <p className="mt-3 text-muted">
            {result.total.toLocaleString("ru-RU")}{" "}
            {pluralRu(result.total, "позиция", "позиции", "позиций")}
            {q ? ` по запросу «${q}»` : ""}
          </p>
        </div>

        <CatalogFilters
          q={q}
          category={category}
          brand={brand}
          sort={sortRaw}
          categories={tree.map((c) => ({
            value: c.slug,
            label: `${c.name} (${c.count})`,
          }))}
          brands={brands.filter(Boolean).map((b) => ({ value: b, label: b }))}
        />

        {result.items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-line bg-white p-12 text-center">
            <p className="font-display text-2xl font-semibold">Ничего не найдено</p>
            <p className="mt-2 text-muted">Попробуйте другой запрос или категорию</p>
            <Link href="/catalog" className="btn btn-dark mt-6">
              Сбросить фильтры
            </Link>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {result.items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {result.totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: result.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (result.totalPages <= 9) return true;
                    return (
                      p === 1 ||
                      p === result.totalPages ||
                      Math.abs(p - result.page) <= 2
                    );
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;
                    return (
                      <span key={p} className="contents">
                        {showEllipsis ? (
                          <span className="px-1 text-muted">…</span>
                        ) : null}
                        <Link
                          href={makeHref({ page: String(p) })}
                          className={`catalog-page inline-flex size-10 items-center justify-center rounded-full border text-sm font-semibold ${
                            p === result.page ? "catalog-page--active" : ""
                          }`}
                        >
                          {p}
                        </Link>
                      </span>
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
