import { CTA } from "@/components/sections/cta";
import { GlobalMap } from "@/components/sections/global-map";
import { Hero } from "@/components/sections/hero";
import { Operations } from "@/components/sections/operations";
import { ServiceGrid } from "@/components/sections/service-grid";
import { Stats } from "@/components/sections/stats";
import { SectionHeading } from "@/components/ui/section-heading";

const process = [
  "Private briefing",
  "Setup roadmap",
  "Formation desk",
  "Operating layer",
  "Scale and expand"
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <GlobalMap />
      <ServiceGrid />
      <Operations />
      <section className="py-24">
        <div className="mx-auto w-[min(1160px,calc(100%_-_40px))]">
          <SectionHeading eyebrow="How it works" title="From private briefing to fully managed business infrastructure." />
          <div className="grid gap-3 md:grid-cols-5">
            {process.map((item, index) => (
              <article className="min-h-44 border border-mstry-gold/25 bg-mstry-gold/10 p-6" key={item}>
                <span className="font-black text-mstry-gold">0{index + 1}</span>
                <h3 className="mt-4 font-display text-xl text-mstry-silver">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
