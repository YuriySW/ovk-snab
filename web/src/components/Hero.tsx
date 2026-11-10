import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { assetPath } from "@/lib/paths";

const stats = [
  ["4 200+", "позиций на складе"],
  ["12 лет", "опыта монтажа"],
  ["Danfoss", "и ведущие бренды"],
  ["5 мин", "на обратный звонок"],
] as const;

export function Hero() {
  return (
    <section
      className="hero relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white"
      style={
        {
          ["--hero-image" as string]: `url("${assetPath("/images/hero.jpg")}")`,
        } as React.CSSProperties
      }
    >
      {/* Background: cover always fills the whole section (no transform clipping) */}
      <div className="hero-media pointer-events-none absolute inset-0" aria-hidden>
        <div className="hero-media__image absolute inset-0" />
        <div className="hero-media__shade absolute inset-0" />
        <div className="hero-media__vignette absolute inset-0" />
      </div>

      <div className="noise relative z-10 flex min-h-[100svh] flex-1 flex-col">
        <div className="container-wide flex flex-1 flex-col justify-end pb-10 pt-[calc(var(--header-h)+1.5rem)] sm:pb-14 md:justify-center md:pb-20 md:pt-28">
          <div className="max-w-[38rem]">
            <p className="animate-rise font-display text-[clamp(2.4rem,9vw,5.6rem)] font-bold leading-[0.92] tracking-[-0.03em]">
              ОВК<span className="text-copper">‑Снаб</span>
            </p>
            <h1 className="animate-rise delay-1 mt-4 max-w-[18ch] font-display text-[clamp(1.45rem,4.5vw,2.85rem)] font-semibold leading-[1.08] tracking-[-0.02em] sm:mt-6">
              Инженерные системы, которые держат объект
            </h1>
            <p className="hero-lead animate-rise delay-2 mt-4 max-w-[34ch] text-[0.98rem] leading-relaxed sm:mt-5 sm:text-[1.05rem] md:text-lg">
              Арматура, насосы и трубопроводы со склада — плюс монтаж отопления
              и водоснабжения в Екатеринбурге.
            </p>
            <div className="animate-rise delay-3 mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link href="/catalog" className="btn btn-primary w-full sm:w-auto">
                Смотреть каталог
                <ArrowRight className="size-4" />
              </Link>
              <a href="tel:+79826546773" className="btn btn-ghost w-full sm:w-auto">
                <PhoneCall className="size-4" />
                Получить расчёт
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/25 backdrop-blur-sm">
          <div className="hero-stats container-wide py-5 lg:py-6">
            {stats.map(([value, label]) => (
              <div key={label} className="hero-stats__item animate-fade delay-2 min-w-0">
                <div className="font-display text-xl font-semibold leading-none tracking-tight sm:text-2xl lg:text-3xl">
                  {value}
                </div>
                <div className="mt-1.5 text-xs leading-snug text-white/55 sm:text-sm">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
