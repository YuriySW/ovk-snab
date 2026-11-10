"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/format";
import { productHref } from "@/lib/paths";
import type { Product, ProductIndex } from "@/lib/types";

type SlugMap = Record<string, Product>;

function withBase(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${path}`;
}

export function ProductView() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<ProductIndex[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    if (!slug) {
      setStatus("missing");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    (async () => {
      try {
        const [bySlug, index] = await Promise.all([
          fetch(withBase("/data/products-by-slug.json")).then((r) => r.json() as Promise<SlugMap>),
          fetch(withBase("/data/products-index.json")).then(
            (r) => r.json() as Promise<ProductIndex[]>,
          ),
        ]);
        if (cancelled) return;
        const current = bySlug[slug] ?? null;
        if (!current) {
          setProduct(null);
          setRelated([]);
          setStatus("missing");
          return;
        }
        const ids = new Set(current.categoryIds);
        const rel = index
          .filter(
            (p) =>
              p.id !== current.id &&
              p.image &&
              p.categoryIds.some((id) => ids.has(id)),
          )
          .slice(0, 4);
        setProduct(current);
        setRelated(rel);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("missing");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const attrs = useMemo(
    () => Object.entries(product?.attributes || {}),
    [product],
  );

  if (status === "loading") {
    return (
      <div className="bg-paper pt-[calc(var(--header-h)+1.25rem)] pb-20">
        <div className="container-wide text-muted">Загрузка товара…</div>
      </div>
    );
  }

  if (status === "missing" || !product) {
    return (
      <div className="bg-paper pt-[calc(var(--header-h)+1.25rem)] pb-20">
        <div className="container-wide">
          <h1 className="font-display text-3xl font-semibold">Товар не найден</h1>
          <Link href="/catalog" className="btn btn-dark mt-6">
            В каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper pt-[calc(var(--header-h)+1.25rem)] pb-20">
      <div className="container-wide">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-ink">
            Главная
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-ink">
            Каталог
          </Link>
          {product.categories[0] ? (
            <>
              <span>/</span>
              <Link
                href={`/catalog?category=${product.categories[0].slug}`}
                className="hover:text-ink"
              >
                {product.categories[0].name}
              </Link>
            </>
          ) : null}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="relative overflow-hidden rounded-[32px] border border-line bg-white">
            <div className="relative aspect-square bg-white">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">
                  Нет изображения
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.14em] text-muted">
              {product.brand ? <span>{product.brand}</span> : null}
              {product.article ? <span>арт. {product.article}</span> : null}
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-6 font-display text-3xl font-semibold">
              {formatPrice(product.price)}
            </div>
            {product.onSale && product.regularPrice > product.price ? (
              <div className="mt-1 text-muted line-through">
                {formatPrice(product.regularPrice)}
              </div>
            ) : null}
            <div className="mt-8">
              <AddToCartButton product={product} large />
            </div>
            {product.shortDescription ? (
              <p className="mt-8 leading-relaxed text-muted">
                {product.shortDescription}
              </p>
            ) : null}
          </div>
        </div>

        {attrs.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Характеристики</h2>
            <dl className="mt-6 divide-y divide-line rounded-[24px] border border-line bg-white">
              {attrs.map(([key, value]) => (
                <div
                  key={key}
                  className="grid gap-1 px-5 py-3 sm:grid-cols-[220px_1fr] sm:gap-6"
                >
                  <dt className="text-sm text-muted">{key}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Похожие позиции</h2>
            <div className="product-grid mt-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-10 text-sm text-muted">
          Прямая ссылка:{" "}
          <Link href={productHref(product.slug)} className="text-copper">
            {productHref(product.slug)}
          </Link>
        </p>
      </div>
    </div>
  );
}
