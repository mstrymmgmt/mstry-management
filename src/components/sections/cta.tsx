import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto grid w-[min(1160px,calc(100%_-_40px))] gap-8 rounded-mstry border border-mstry-gold/30 bg-gradient-to-br from-mstry-gold/15 to-white/[.025] p-8 shadow-luxury md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">MSTRY command desk</p>
          <h2 className="mt-3 font-display text-4xl text-mstry-silver md:text-6xl">Scale Without Operational Stress.</h2>
          <p className="mt-4 max-w-3xl text-mstry-muted">
            Speak with MSTRY and build the infrastructure behind your UAE or European business.
          </p>
          <a className="mt-4 inline-flex font-black text-mstry-gold" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </div>
        <Button href="/book-consultation">Speak With MSTRY</Button>
      </div>
    </section>
  );
}
