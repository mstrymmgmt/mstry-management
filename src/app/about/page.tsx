import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CTA } from "@/components/sections/cta";
import { companyFootprint, siteConfig } from "@/config/site";

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
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_24px))] items-start gap-8 sm:w-[min(1320px,calc(100%_-_40px))] lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-mstry-gold sm:text-xs sm:tracking-[0.22em]">Mission</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,9vw,3rem)] font-black leading-tight text-mstry-silver sm:text-5xl">Make important work easier to lead and harder to derail.</h2>
            <p className="mt-6 text-base leading-7 text-mstry-muted sm:text-lg sm:leading-8">
              We support decision-makers with discreet advisory, structured operating systems, executive reporting, partnership development, project control, and international growth discipline. The client remains in control. MSTRY strengthens the system around the objective.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map(([title, body], index) => (
              <article className="rounded-mstry border border-white/10 bg-[#111827]/65 p-5 shadow-luxury sm:p-6" key={title}>
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-mstry-gold sm:text-xs sm:tracking-[0.18em]">Principle 0{index + 1}</span>
                <h3 className="mt-3 font-display text-2xl font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-mstry-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-[#111827]/45 py-14 sm:py-20">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_24px))] gap-4 sm:w-[min(1320px,calc(100%_-_40px))] md:grid-cols-3">
          {["Business management", "Strategic consulting", "Partnerships and growth", "Investment readiness", "Sports management", "Project execution"].map((item, index) => (
            <div className="rounded-mstry border border-mstry-gold/15 bg-[#0A0A0A]/60 p-5" key={item}>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-mstry-gold">Capability {index + 1}</span>
              <h3 className="mt-3 font-display text-2xl font-black text-white">{item}</h3>
            </div>
          ))}
        </div>
      </section>
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_24px))] gap-8 border-t border-mstry-gold/20 pt-10 sm:w-[min(1320px,calc(100%_-_40px))] sm:gap-10 sm:pt-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">Company footprint</p>
            <h2 className="mt-3 font-display text-4xl font-black text-white">A London head office with international operating reach.</h2>
            <p className="mt-4 text-sm leading-7 text-mstry-muted">
              From London to the world since {companyFootprint.operatingSince}, MSTRY operates from {companyFootprint.headOffice.address}, supporting client mandates across Europe, North America, and Asia.
            </p>
          </div>
          <div className="space-y-7">
            <div className="border-b border-white/10 pb-7">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">Active Clients</span>
                <strong className="mt-3 block font-display text-4xl font-black text-white">{companyFootprint.activeClients.toLocaleString("en-US")}+</strong>
                <p className="mt-2 text-sm leading-6 text-mstry-muted">
                  Approximately {companyFootprint.activeClients.toLocaleString("en-US")} active clients supported through the operating network.
                </p>
              </div>
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">Operations & Projects Across</span>
              <p className="mt-3 text-sm leading-7 text-mstry-muted">
                {companyFootprint.operationsProjectsAcross.join(" • ")}
              </p>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
