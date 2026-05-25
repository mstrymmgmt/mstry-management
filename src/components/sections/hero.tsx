import Image from "next/image";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="relative grid min-h-[calc(100vh-76px)] items-center overflow-hidden py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(216,216,216,.09),transparent_30%),linear-gradient(100deg,rgba(214,173,85,.09),transparent_28%)]" />
      <div className="relative mx-auto grid w-[min(1160px,calc(100%_-_40px))] items-center gap-12 lg:grid-cols-[1.04fr_.96fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">Private business infrastructure for founders and investors</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.7rem,3.8vw,3.85rem)] leading-[1.04] text-mstry-silver">
            We Build and Manage Businesses So You Don&apos;t Have To.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-mstry-muted">
            We operate the machine behind the scenes while our clients focus on growth, wealth, freedom, and expansion. MSTRY MANAGEMENT becomes the private infrastructure layer behind your business.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/book-consultation">Build Your Business Infrastructure</Button>
            <Button href="/contact" variant="ghost">Speak With MSTRY</Button>
          </div>
          <a className="mt-4 inline-flex font-black text-mstry-gold" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </div>
        <div className="relative overflow-hidden border border-white/10 bg-mstry-charcoal shadow-luxury">
          <Image src="/assets/hero-boardroom.svg" alt="Luxury international boardroom" width={1400} height={900} priority />
          <div className="grid gap-3 bg-mstry-black p-4 sm:absolute sm:inset-x-5 sm:bottom-5 sm:grid-cols-3 sm:bg-mstry-black/75 sm:backdrop-blur">
            {["24/7 VIP desk", "UAE structures", "EU expansion"].map((item) => (
              <div className="border border-white/10 p-4" key={item}>
                <strong className="block text-xl text-mstry-gold">{item.split(" ")[0]}</strong>
                <span className="text-xs text-mstry-silver">{item.split(" ").slice(1).join(" ")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
