import { Suspense } from "react";
import { CatalogView } from "@/components/CatalogView";
import { getBrands, getCategories, getProducts } from "@/lib/data";

export const metadata = {
  title: "Каталог",
  description: "Каталог арматуры, насосов и трубопроводных систем ОВК‑Снаб",
};

export default function CatalogPage() {
  const products = getProducts();
  const { tree, flat } = getCategories();
  const brands = getBrands();

  return (
    <Suspense
      fallback={
        <div className="bg-paper pt-[calc(var(--header-h)+1.5rem)] pb-16">
          <div className="container-wide text-muted">Загрузка каталога…</div>
        </div>
      }
    >
      <CatalogView
        products={products}
        tree={tree}
        flat={flat}
        brands={brands}
      />
    </Suspense>
  );
}
