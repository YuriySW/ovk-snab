export function productHref(slug: string) {
  return `/product/?slug=${encodeURIComponent(slug)}`;
}
