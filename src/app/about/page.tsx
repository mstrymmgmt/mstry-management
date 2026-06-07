import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CTA } from "@/components/sections/cta";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  const principles = [
    ["Client-first strategy", "We start with the client's objective, constraints, risk, stakeholders, and desired outcome."],
    ["Operational discipline", "We convert ambition into cadence, reporting, ownership, and controlled execution."],
    ["Relationship intelligence", "We treat partnerships, introductions, and networks as strategic assets, not casual conversations."],
    ["Measurable progress", "Every engagement is designed around clarity, follow-through, and visible movement toward the mandate."]
  ];

  return (
    <>
      <PageHero
        eyebrow="About MSTRY"
        title="A private management partner built around client outcomes."
        body={`MSTRY MANAGEMENT exists to help leaders solve complex business, growth, partnership, talent, sports, and execution challenges with greater clarity and control. Contact the private desk at ${siteConfig.email}.`}
      />
      <section className="py-24">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">Mission</p>
            <h2 className="mt-3 font-display text-5xl font-black text-mstry-silver">Make important work easier to lead and harder to derail.</h2>
            <p className="mt-6 text-lg leading-8 text-mstry-muted">
              We support decision-makers with discreet advisory, structured operating systems, executive reporting, partnership development, project control, and international growth discipline. The client remains in control. MSTRY strengthens the system around the objective.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map(([title, body], index) => (
              <article className="rounded-mstry border border-white/10 bg-[#111827]/65 p-6 shadow-luxury" key={title}>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">Principle 0{index + 1}</span>
                <h3 className="mt-3 font-display text-2xl font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-mstry-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-[#111827]/45 py-20">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] gap-4 md:grid-cols-3">
          {["Business management", "Strategic consulting", "Partnerships and growth", "Investment readiness", "Sports management", "Project execution"].map((item, index) => (
            <div className="rounded-mstry border border-mstry-gold/15 bg-[#0A0A0A]/60 p-5" key={item}>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-mstry-gold">Capability {index + 1}</span>
              <h3 className="mt-3 font-display text-2xl font-black text-white">{item}</h3>
            </div>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
