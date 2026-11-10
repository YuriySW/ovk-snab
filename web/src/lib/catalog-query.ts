import type { ProductIndex } from "./types";

export type CatalogQuery = {
  q?: string;
  category?: string;
  brand?: string;
  page?: number;
  pageSize?: number;
  sort?: "price-asc" | "price-desc" | "name";
};

export function queryProducts(products: ProductIndex[], params: CatalogQuery) {
  const pageSize = params.pageSize ?? 24;
  const page = Math.max(1, params.page ?? 1);
  let items = products;

  if (params.category) {
    const slug = params.category;
    items = items.filter((p) => p.categorySlugs.includes(slug));
  }
  if (params.brand) {
    const brand = params.brand.toLowerCase();
    items = items.filter((p) => p.brand.toLowerCase() === brand);
  }
  if (params.q?.trim()) {
    const q = params.q.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.article.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q),
    );
  }

  switch (params.sort) {
    case "price-asc":
      items = [...items].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items = [...items].sort((a, b) => b.price - a.price);
      break;
    case "name":
      items = [...items].sort((a, b) => a.name.localeCompare(b.name, "ru"));
      break;
    default:
      break;
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    totalPages,
    pageSize,
  };
}
