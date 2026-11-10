export type ProductIndex = {
  id: number;
  slug: string;
  name: string;
  article: string;
  brand: string;
  price: number;
  regularPrice: number;
  onSale: boolean;
  image: string;
  categoryIds: number[];
  categorySlugs: string[];
};

export type Product = ProductIndex & {
  salePrice: number | null;
  description: string;
  shortDescription: string;
  attributes: Record<string, string>;
  categories: { id: number; name: string; slug: string }[];
  permalink: string;
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
};

export type CategoryNode = {
  id: number;
  name: string;
  slug: string;
  count: number;
  children: CategoryNode[];
};

export type CategoryFlat = {
  id: number;
  name: string;
  slug: string;
  parentId: number;
  count: number;
  seoTitle: string;
  seoDescription: string;
};

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  article: string;
  price: number;
  image: string;
  qty: number;
};
