import Link from "next/link";
import { companyFootprint, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0A0A] py-10 text-sm text-mstry-muted sm:py-12">
      <div className="mx-auto grid w-[min(1320px,calc(100%_-_24px))] gap-7 sm:w-[min(1320px,calc(100%_-_40px))] sm:gap-8 md:grid-cols-2 lg:grid-cols-[1.15fr_0.8fr_0.8fr_0.95fr]">
        <div>
          <div className="font-display text-3xl font-black tracking-[0.14em] text-white sm:tracking-[0.16em]">MSTRY</div>
          <div className="mt-2 text-xs font-black uppercase tracking-[0.22em] text-mstry-gold sm:tracking-[0.32em]">Management</div>
          <p className="mt-4 max-w-md leading-6">
            Premium management, consulting, partnerships, business development, sports management, talent capability, and project execution.
          </p>
        </div>
        <div>
          <strong className="text-white">Contact</strong>
          <a className="mt-3 block text-mstry-gold" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          <Link className="mt-3 block text-mstry-gold" href="/book-consultation">
            Request a Strategic Review
          </Link>
        </div>
        <div>
          <strong className="text-white">Focus</strong>
          <p className="mt-3 leading-6">Business management, strategic consulting, partnerships, international operations, project execution, and sports management.</p>
        </div>
        <div>
          <strong className="text-white">Head Office</strong>
          <p className="mt-3 leading-6">
            {companyFootprint.headOffice.lines.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 flex w-[min(1320px,calc(100%_-_24px))] flex-col gap-4 border-t border-white/10 pt-6 sm:w-[min(1320px,calc(100%_-_40px))] sm:flex-row sm:flex-wrap sm:justify-between">
        <span>MSTRY MANAGEMENT © 2026</span>
        <Link className="text-mstry-gold" href="/contact">
          Start the Conversation
        </Link>
      </div>
    </footer>
  );
}
