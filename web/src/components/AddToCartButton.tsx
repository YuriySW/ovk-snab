"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import type { ProductIndex } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

export function AddToCartButton({
  product,
  large,
}: {
  product: ProductIndex;
  large?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${large ? "" : ""}`}>
      <div className="inline-flex items-center rounded-full border border-line bg-white">
        <button
          type="button"
          className="px-3.5 py-3"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          <Minus className="size-4" />
        </button>
        <span className="min-w-8 text-center font-semibold">{qty}</span>
        <button
          type="button"
          className="px-3.5 py-3"
          onClick={() => setQty((q) => q + 1)}
        >
          <Plus className="size-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className={`btn btn-primary ${large ? "min-w-[220px]" : ""}`}
      >
        {added ? (
          <>
            <Check className="size-4" /> В корзине
          </>
        ) : (
          <>
            <ShoppingBag className="size-4" /> В корзину
          </>
        )}
      </button>
    </div>
  );
}
