import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-[var(--header-h)] text-center">
      <p className="text-sm uppercase tracking-[0.18em] text-muted">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">Страница не найдена</h1>
      <p className="mt-3 max-w-md text-muted">
        Возможно, товар снят с публикации или ссылка устарела.
      </p>
      <Link href="/catalog" className="btn btn-dark mt-8">
        В каталог
      </Link>
    </div>
  );
}
