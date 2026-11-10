import "server-only";
import { readFileSync } from "fs";
import { join } from "path";
import type { CategoryFlat, CategoryNode, Product, ProductIndex } from "./types";
import { queryProducts, type CatalogQuery } from "./catalog-query";

export type { CatalogQuery };

const dataDir = join(process.cwd(), "src/data");

let indexCache: ProductIndex[] | null = null;
let bySlugCache: Record<string, Product> | null = null;
let categoriesCache: { flat: CategoryFlat[]; tree: CategoryNode[] } | null = null;
let brandsCache: string[] | null = null;

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(dataDir, name), "utf-8")) as T;
}

export function getProducts(): ProductIndex[] {
  if (!indexCache) indexCache = readJson("products-index.json");
  return indexCache!;
}

export function getProductBySlug(slug: string): Product | null {
  if (!bySlugCache) bySlugCache = readJson("products-by-slug.json");
  return bySlugCache![slug] ?? null;
}

export function getCategories() {
  if (!categoriesCache) categoriesCache = readJson("categories.json");
  return categoriesCache!;
}

export function getBrands(): string[] {
  if (!brandsCache) brandsCache = readJson("brands.json");
  return brandsCache!;
}

export function getCategoryBySlug(slug: string): CategoryFlat | null {
  return getCategories().flat.find((c) => c.slug === slug) ?? null;
}

export function getFeaturedProducts(limit = 8): ProductIndex[] {
  const products = getProducts().filter((p) => p.price > 0 && p.image);
  const preferred = products.filter(
    (p) =>
      p.brand.toLowerCase().includes("danfoss") ||
      p.brand.toLowerCase().includes("ридан") ||
      /danfoss|ridan|ридан/i.test(p.name),
  );
  const pool = preferred.length >= limit ? preferred : products;
  return [...pool].sort((a, b) => b.price - a.price).slice(0, limit);
}

export function getHits(limit = 8): ProductIndex[] {
  return getProducts()
    .filter((p) => p.price > 1000 && p.image)
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);
}

export function queryCatalog(params: CatalogQuery) {
  return queryProducts(getProducts(), params);
}

export function getRelated(product: Product, limit = 4): ProductIndex[] {
  const ids = new Set(product.categoryIds);
  return getProducts()
    .filter(
      (p) =>
        p.id !== product.id &&
        p.image &&
        p.categoryIds.some((id) => ids.has(id)),
    )
    .slice(0, limit);
}

export function getShopStats() {
  const products = getProducts();
  const { tree } = getCategories();
  return {
    products: products.length,
    categories: tree.length,
    brands: getBrands().length,
    withPrice: products.filter((p) => p.price > 0).length,
  };
}
