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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-mstry-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-[min(1320px,calc(100%_-_32px))] items-center justify-between gap-5 sm:h-[76px] sm:w-[min(1320px,calc(100%_-_40px))] sm:gap-6">
        <Link className="relative overflow-hidden transition duration-300 hover:-translate-y-0.5" href="/" aria-label="MSTRY MANAGEMENT home">
          <Image src="/assets/mstry-logo.png" alt="MSTRY MANAGEMENT" width={760} height={540} className="h-12 w-auto object-contain sm:h-16" priority />
        </Link>
        <button
          className="grid h-11 w-11 place-items-center border border-white/15 text-mstry-silver md:hidden"
          type="button"
          aria-label="Open navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <Menu size={18} />
        </button>
        <nav
          className={`${
            open ? "flex" : "hidden"
          } fixed left-4 right-4 top-[82px] flex-col gap-5 border border-white/10 bg-mstry-black/95 p-5 text-sm text-mstry-muted md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}
        >
          {siteConfig.nav.map((item) => (
            <Link
              className={`transition hover:text-mstry-silver ${
                item.href.includes(`#${active}`) ? "text-mstry-gold" : ""
              }`}
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a className="text-xs font-black text-mstry-gold lg:inline-flex" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          <Link className="rounded-mstry border border-mstry-gold bg-mstry-gold px-5 py-3 font-black text-black transition hover:bg-[#C19D2C]" href="/book-consultation">
            Strategic Review
          </Link>
        </nav>
      </div>
    </header>
  );
}
