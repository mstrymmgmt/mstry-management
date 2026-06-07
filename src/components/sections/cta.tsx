import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto grid w-[min(1160px,calc(100%_-_40px))] gap-8 rounded-mstry border border-mstry-gold/30 bg-[#111827]/70 p-8 shadow-luxury md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">MSTRY private desk</p>
          <h2 className="mt-3 font-display text-4xl text-mstry-silver md:text-6xl">Request a Strategic Review.</h2>
          <p className="mt-4 max-w-3xl text-mstry-muted">
            Tell us what you are trying to build, fix, enter, scale, structure, or execute. MSTRY will review the objective and identify whether a management, consulting, partnership, business development, sports, advisory, or project mandate can create value.
          </p>
          <a className="mt-4 inline-flex font-black text-mstry-gold" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </div>
        <Button href="/book-consultation">Discuss Your Objectives</Button>
      </div>
    </section>
  );
}
