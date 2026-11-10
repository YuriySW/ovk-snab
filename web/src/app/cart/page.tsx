"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, remove, total, clear } = useCart();
  const sum = total();

  return (
    <div className="bg-paper pt-[calc(var(--header-h)+1.5rem)] pb-20">
      <div className="container-x">
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Корзина
        </h1>

        {!items.length ? (
          <div className="mt-10 rounded-[28px] border border-dashed border-line bg-white p-12 text-center">
            <p className="font-display text-2xl font-semibold">Пока пусто</p>
            <p className="mt-2 text-muted">
              Добавьте товары из каталога, чтобы собрать заявку.
            </p>
            <Link href="/catalog" className="btn btn-dark mt-6">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[96px_1fr] gap-4 rounded-[24px] border border-line bg-white p-4 md:grid-cols-[120px_1fr_auto]"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-mist"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="120px"
                      />
                    ) : null}
                  </Link>
                  <div className="min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-medium leading-snug hover:text-copper"
                    >
                      {item.name}
                    </Link>
                    {item.article ? (
                      <div className="mt-1 text-sm text-muted">
                        арт. {item.article}
                      </div>
                    ) : null}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          className="px-3 py-2"
                          onClick={() => setQty(item.id, item.qty - 1)}
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="min-w-8 text-center font-semibold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          className="px-3 py-2"
                          onClick={() => setQty(item.id, item.qty + 1)}
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-copper"
                      >
                        <Trash2 className="size-4" /> Удалить
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-end justify-between md:col-span-1 md:flex-col md:items-end">
                    <div className="font-display text-xl font-semibold">
                      {formatPrice(item.price * item.qty)}
                    </div>
                    <div className="text-sm text-muted">
                      {formatPrice(item.price)} / шт
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-[28px] border border-line bg-white p-6">
              <div className="text-sm uppercase tracking-[0.14em] text-muted">
                Итого
              </div>
              <div className="mt-2 font-display text-4xl font-semibold tracking-tight">
                {formatPrice(sum)}
              </div>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Прототип: заказ сохраняется локально в браузере. На проде
                подключим отправку заявки менеджеру.
              </p>
              <a href="tel:+79826546773" className="btn btn-primary mt-6 w-full">
                Оставить заявку по телефону
              </a>
              <button
                type="button"
                onClick={clear}
                className="btn btn-outline mt-3 w-full"
              >
                Очистить корзину
              </button>
              <Link href="/catalog" className="mt-4 block text-center text-sm font-semibold text-copper">
                Продолжить покупки
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
