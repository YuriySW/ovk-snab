"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { ProductIndex } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-store";

export function ProductCard({ product }: { product: ProductIndex }) {
  const add = useCart((s) => s.add);

  return (
    <article className="group relative flex h-full w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[14px] border border-line bg-white transition duration-300 hover:border-ink/20 hover:shadow-[var(--shadow)] sm:rounded-[18px] sm:hover:-translate-y-1">
      <Link href={`/product/${product.slug}`} className="relative block min-w-0">
        <div className="relative aspect-square overflow-hidden bg-white">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-1.5 transition duration-500 group-hover:scale-[1.03] sm:p-2"
              sizes="(max-width:720px) 45vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">
              Нет фото
            </div>
          )}
          {product.onSale ? (
            <span className="absolute left-1.5 top-1.5 rounded-full bg-copper px-1.5 py-0.5 text-[0.6rem] font-semibold text-white sm:left-2 sm:top-2 sm:px-2">
              Акция
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1 p-2.5 pt-1.5 sm:gap-1.5 sm:p-3 sm:pt-2">
        <div className="flex min-w-0 items-center justify-between gap-1.5 text-[0.58rem] uppercase tracking-[0.08em] text-muted sm:text-[0.65rem]">
          <span className="min-w-0 truncate">{product.brand || "ОВК‑Снаб"}</span>
          {product.article ? (
            <span className="min-w-0 shrink truncate">арт. {product.article}</span>
          ) : null}
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 min-w-0 break-words text-[0.78rem] font-medium leading-snug text-ink group-hover:text-copper sm:text-[0.88rem]"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex min-w-0 flex-col gap-1.5 pt-1">
          <div className="min-w-0">
            <div className="font-display text-[0.88rem] font-semibold leading-tight tracking-tight break-words sm:text-base">
              {formatPrice(product.price)}
            </div>
            {product.onSale && product.regularPrice > product.price ? (
              <div className="text-[0.65rem] text-muted line-through">
                {formatPrice(product.regularPrice)}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => add(product)}
            className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-full bg-ink px-2 text-[0.72rem] font-semibold whitespace-nowrap text-white transition hover:bg-copper sm:h-9 sm:text-[0.8rem]"
          >
            <Plus className="size-3.5 shrink-0" />
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
}
