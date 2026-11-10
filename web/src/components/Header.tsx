"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";

const nav = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?category=nasosnoe-oborudovanie", label: "Насосы" },
  { href: "/catalog?category=truboprovodnye-sistemy", label: "Трубы" },
  { href: "/nashi-raboty", label: "Наши работы" },
  { href: "/#contacts", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const openCart = useCart((s) => s.open);
  const isHome = pathname === "/";
  const solid = !isHome || scrolled;
  const menuDark = isHome && !scrolled;

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      data-solid={solid ? "true" : "false"}
      className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "is-solid bg-[color-mix(in_srgb,var(--paper)_92%,white)]/95 backdrop-blur-md border-b border-line shadow-[0_8px_30px_rgba(11,18,32,0.06)]"
          : "is-transparent bg-transparent"
      }`}
    >
      <div className="container-wide flex h-[64px] items-center justify-between gap-2 md:h-[72px] md:gap-4">
        <Link href="/" className="group flex min-w-0 items-baseline gap-2 shrink-0">
          <span className="site-header__brand font-display text-[1.35rem] font-bold tracking-tight leading-none transition-colors md:text-[1.55rem]">
            ОВК<span className="text-copper">‑Снаб</span>
          </span>
          <span className="site-header__city hidden xl:inline text-[0.7rem] uppercase tracking-[0.18em] transition-colors">
            Екатеринбург
          </span>
        </Link>

        <nav className="site-header__nav hidden lg:flex items-center gap-6 xl:gap-7">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="site-header__link text-[0.95rem] font-semibold transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href="tel:+79826546773"
            className="site-header__phone hidden xl:inline-flex items-center gap-2 text-sm font-semibold"
          >
            <Phone className="size-4 text-copper" />
            +7 982 654‑67‑73
          </a>
          <a
            href="tel:+79826546773"
            aria-label="Позвонить"
            className="site-header__icon xl:hidden inline-flex size-9 items-center justify-center rounded-full border transition-colors sm:size-10"
          >
            <Phone className="size-4 text-copper" />
          </a>
          <Link
            href="/catalog"
            aria-label="Поиск"
            className="site-header__icon inline-flex size-9 items-center justify-center rounded-full border transition-colors sm:size-10"
          >
            <Search className="size-4" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label="Корзина"
            className="site-header__icon relative inline-flex size-9 items-center justify-center rounded-full border transition-colors sm:size-10"
          >
            <ShoppingBag className="size-4" />
            {mounted && count > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-copper text-[0.65rem] font-bold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="site-header__icon lg:hidden inline-flex size-9 items-center justify-center rounded-full border sm:size-10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className={`mobile-menu lg:hidden border-t ${
            menuDark
              ? "mobile-menu--dark border-white/10 bg-[#0b1220]/96 backdrop-blur-md"
              : "mobile-menu--light border-line bg-paper"
          }`}
        >
          <div className="container-wide flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-menu__link rounded-xl px-3 py-3 text-base font-semibold"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+79826546773"
              className="mobile-menu__phone rounded-xl px-3 py-3 text-base font-semibold"
            >
              +7 982 654‑67‑73
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
