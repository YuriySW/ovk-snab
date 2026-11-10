import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-wide section-pad grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="font-display text-3xl font-bold tracking-tight">
            ОВК<span className="text-copper">‑Снаб</span>
          </div>
          <p className="mt-4 max-w-md text-white/65 leading-relaxed">
            Поставка арматуры и оборудования для отопления, водоснабжения и
            канализации. Монтаж под ключ в Екатеринбурге и области.
          </p>
        </div>
        <div>
          <div className="text-sm uppercase tracking-[0.16em] text-white/45">
            Каталог
          </div>
          <ul className="mt-4 space-y-3 text-white/80">
            <li>
              <Link href="/catalog?category=zapornaya-armatura" className="hover:text-white">
                Запорная арматура
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=nasosnoe-oborudovanie" className="hover:text-white">
                Насосное оборудование
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=truboprovodnye-sistemy" className="hover:text-white">
                Трубопроводные системы
              </Link>
            </li>
            <li>
              <Link href="/catalog" className="hover:text-white">
                Весь каталог
              </Link>
            </li>
            <li>
              <Link href="/nashi-raboty" className="hover:text-white">
                Наши работы
              </Link>
            </li>
          </ul>
        </div>
        <div id="contacts">
          <div className="text-sm uppercase tracking-[0.16em] text-white/45">
            Контакты
          </div>
          <ul className="mt-4 space-y-4 text-white/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-copper" />
              г. Екатеринбург, ул. Серафимы Дерябиной 30А, оф. 103
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-copper" />
              <div>
                <a href="tel:+79826546773" className="block hover:text-white">
                  +7 982 654‑67‑73
                </a>
                <a href="tel:+73432716722" className="block hover:text-white">
                  +7 343 271‑67‑22
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-copper" />
              <a href="mailto:info@ovk-snab.com" className="hover:text-white">
                info@ovk-snab.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col gap-2 py-5 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ООО «ОВК‑Снаб»</span>
          <span>Прототип на Next.js · локальные данные</span>
        </div>
      </div>
    </footer>
  );
}
