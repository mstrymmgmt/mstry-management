"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const ids = ["about", "services", "capabilities", "process", "impact", "partnerships"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0.01 }
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="relative z-50 border-b border-white/10 bg-mstry-black/80 backdrop-blur-xl md:sticky md:top-0">
      <div className="mx-auto flex h-[68px] w-[min(1320px,calc(100%_-_24px))] items-center justify-between gap-3 sm:h-[76px] sm:w-[min(1320px,calc(100%_-_40px))] sm:gap-6">
        <Link className="relative min-w-0 overflow-hidden transition duration-300 hover:-translate-y-0.5" href="/" aria-label="MSTRY MANAGEMENT home">
          <Image src="/assets/mstry-logo.png" alt="MSTRY MANAGEMENT" width={760} height={540} className="h-11 w-auto max-w-[150px] object-contain sm:h-16 sm:max-w-none" priority />
        </Link>
        <button
          className="grid h-11 w-11 shrink-0 place-items-center border border-white/15 text-mstry-silver md:hidden"
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          <Menu size={18} />
        </button>
        <nav
          className={`${
            open ? "flex" : "hidden"
          } fixed left-3 right-3 top-[76px] max-h-[calc(100dvh-92px)] flex-col gap-2 overflow-y-auto border border-white/10 bg-mstry-black/95 p-3 text-sm text-mstry-muted shadow-luxury md:static md:flex md:max-h-none md:flex-row md:items-center md:gap-5 md:overflow-visible md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {siteConfig.nav.map((item) => (
            <Link
              className={`min-h-11 rounded-mstry px-3 py-3 transition hover:bg-white/[.035] hover:text-mstry-silver md:min-h-0 md:px-0 md:py-0 md:hover:bg-transparent ${
                item.href.includes(`#${active}`) ? "text-mstry-gold" : ""
              }`}
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a className="min-h-11 rounded-mstry px-3 py-3 text-xs font-black text-mstry-gold md:min-h-0 md:px-0 md:py-0 lg:inline-flex" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          <Link className="inline-flex min-h-11 items-center justify-center rounded-mstry border border-mstry-gold bg-mstry-gold px-5 py-3 text-center font-black text-black transition hover:bg-[#C19D2C]" href="/book-consultation">
            Strategic Review
          </Link>
        </nav>
      </div>
    </header>
  );
}
