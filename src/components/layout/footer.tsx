import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 text-sm text-mstry-muted">
      <div className="mx-auto flex w-[min(1160px,calc(100%_-_40px))] flex-wrap justify-between gap-5">
        <div>MSTRY MANAGEMENT © 2026</div>
        <a className="text-mstry-gold" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        <Link className="text-mstry-gold" href="/contact">
          Speak With MSTRY
        </Link>
      </div>
    </footer>
  );
}
