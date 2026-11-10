"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { productHref } from "@/lib/paths";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, total } = useCart();
  const sum = total();
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
  }, [isOpen]);

  if (!render) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden={!visible}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-[70] flex h-dvh w-full max-w-[420px] flex-col bg-paper shadow-[var(--shadow)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!visible}
        onTransitionEnd={(e) => {
          if (e.propertyName === "transform" && !isOpen) setRender(false);
        }}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <div className="font-display text-xl font-semibold">Корзина</div>
            <div className="text-sm text-muted">
              {items.length
                ? `${items.reduce((n, i) => n + i.qty, 0)} поз.`
                : "Пока пусто"}
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line"
            aria-label="Закрыть"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
          {!items.length ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-mist">
                <ShoppingBag className="size-6 text-muted" />
              </div>
              <p className="max-w-[220px] text-muted">
                Добавьте оборудование из каталога — оформим поставку или монтаж.
              </p>
              <Link href="/catalog" onClick={close} className="btn btn-dark">
                Открыть каталог
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-2xl border border-line bg-white p-3"
                >
                  <Link
                    href={productHref(item.slug)}
                    onClick={close}
                    className="relative aspect-square overflow-hidden rounded-xl bg-mist"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="72px"
                      />
                    ) : null}
                  </Link>
                  <div className="min-w-0">
                    <Link
                      href={productHref(item.slug)}
                      onClick={close}
                      className="line-clamp-2 text-sm font-medium leading-snug hover:text-copper"
                    >
                      {item.name}
                    </Link>
                    {item.article ? (
                      <div className="mt-1 truncate text-xs text-muted">
                        арт. {item.article}
                      </div>
                    ) : null}
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          className="px-2.5 py-1.5"
                          onClick={() => setQty(item.id, item.qty - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          className="px-2.5 py-1.5"
                          onClick={() => setQty(item.id, item.qty + 1)}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <div className="shrink-0 text-sm font-semibold">
                        {formatPrice(item.price * item.qty)}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-muted hover:text-copper"
                        aria-label="Удалить"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line bg-white px-5 py-5">
            <div className="mb-4 flex items-end justify-between gap-3">
              <span className="text-muted">Итого</span>
              <span className="font-display text-2xl font-semibold">
                {formatPrice(sum)}
              </span>
            </div>
            <Link href="/cart" onClick={close} className="btn btn-primary w-full">
              Перейти в корзину
            </Link>
            <p className="mt-3 text-center text-xs text-muted">
              Прототип: оформление заявки локально
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
