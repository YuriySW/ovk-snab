import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, getProducts, getRelated } from "@/lib/data";
import { formatPrice } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Товар не найден" };
  return {
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.shortDescription || product.name,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelated(product, 4);
  const attrs = Object.entries(product.attributes || {});

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
            <h1 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[1.08] tracking-tight">
              {product.name}
            </h1>

            <div className="mt-6 flex items-end gap-3">
              <div className="font-display text-4xl font-semibold tracking-tight">
                {formatPrice(product.price)}
              </div>
              {product.onSale &&
              product.regularPrice &&
              product.regularPrice > product.price ? (
                <div className="pb-1 text-lg text-muted line-through">
                  {formatPrice(product.regularPrice)}
                </div>
              ) : null}
            </div>

            <p className="mt-4 text-muted leading-relaxed">
              В наличии на складе ОВК‑Снаб. Поможем с подбором аналогов и
              комплектацией под спецификацию объекта.
            </p>

            <div className="mt-8">
              <AddToCartButton product={product} large />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Доставка по Екатеринбургу", "Консультация инженера", "Гарантия на поставку"].map(
                (t) => (
                  <div
                    key={t}
                    className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium"
                  >
                    {t}
                  </div>
                ),
              )}
            </div>

            {attrs.length > 0 && (
              <div className="mt-10 overflow-hidden rounded-[24px] border border-line bg-white">
                <div className="border-b border-line px-5 py-4 font-display text-lg font-semibold">
                  Характеристики
                </div>
                <dl className="divide-y divide-line">
                  {attrs.slice(0, 16).map(([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-[0.9fr_1.1fr] gap-3 px-5 py-3 text-sm"
                    >
                      <dt className="text-muted">{key}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {product.description ? (
          <section className="mt-14 rounded-[28px] border border-line bg-white p-6 md:p-10">
            <h2 className="font-display text-2xl font-semibold">Описание</h2>
            <div
              className="prose-ovk mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-slate [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </section>
        ) : null}

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-3xl font-semibold tracking-tight">
              Похожие позиции
            </h2>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
