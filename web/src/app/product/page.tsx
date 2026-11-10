import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductView } from "@/components/ProductView";

export const metadata: Metadata = {
  title: "Товар",
  description: "Карточка товара ОВК‑Снаб",
};

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-paper pt-[calc(var(--header-h)+1.25rem)] pb-20">
          <div className="container-wide text-muted">Загрузка товара…</div>
        </div>
      }
    >
      <ProductView />
    </Suspense>
  );
}
