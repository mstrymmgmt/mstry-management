import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function CTA() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto grid w-[min(1160px,calc(100%_-_24px))] gap-6 rounded-mstry border border-mstry-gold/30 bg-[#111827]/70 p-5 shadow-luxury sm:w-[min(1160px,calc(100%_-_40px))] sm:gap-8 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-mstry-gold sm:text-xs sm:tracking-[0.22em]">MSTRY private desk</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,9vw,3rem)] leading-tight text-mstry-silver md:text-6xl">Request a Strategic Review.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-mstry-muted sm:text-base">
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
