"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, ProductIndex } from "./types";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: ProductIndex, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return {
            isOpen: true,
            items: [
              ...state.items,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                article: product.article,
                price: product.price,
                image: product.image,
                qty,
              },
            ],
          };
        });
      },
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: "ovk-cart-v1" },
  ),
);
