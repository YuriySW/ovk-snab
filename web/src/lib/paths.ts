export function productHref(slug: string) {
  return `/product/?slug=${encodeURIComponent(slug)}`;
}

/** Prefix public asset paths for GitHub Pages basePath. */
export function assetPath(path: string) {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
