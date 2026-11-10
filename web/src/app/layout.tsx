import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Providers } from "@/components/Providers";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "ОВК‑Снаб — отопление, водоснабжение, арматура",
    template: "%s · ОВК‑Снаб",
  },
  description:
    "Продажа сантехнической продукции и монтаж систем отопления, канализации и водоснабжения в Екатеринбурге. Каталог Danfoss и сопутствующего оборудования.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${display.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Providers>
          <Header />
          <CartDrawer />
          <div className="flex min-h-full min-w-0 flex-col">
            <main className="min-w-0 flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
