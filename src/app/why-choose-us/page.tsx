import type { Metadata } from "next";
import { CTA } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Why Choose Us"
};

const reasons = [
  ["Full-service operating infrastructure", "Strategy, coordination, reporting, partnerships, and execution can be managed through one accountable operating layer."],
  ["Private office standard", "The engagement model is discreet, senior, direct, and built for clients where trust and timing matter."],
  ["International market intelligence", "MSTRY supports cross-border decisions with market logic, relationship mapping, and execution awareness."],
  ["Strategic partnership clarity", "Relationship development is structured around value, positioning, commercial logic, and follow-through."],
  ["Investment and growth discipline", "Opportunities are reviewed through structure, readiness, decision quality, and long-term value creation."],
  ["Built for global execution", "The model connects business management, consulting, sports, partnerships, and project delivery without fragmenting the client experience."]
];

export default function WhyChooseUsPage() {
  return (
    <>
      <PageHero eyebrow="Why leaders choose us" title="A private operating office for serious international decisions." body="MSTRY combines business management, strategic consulting, investment readiness, partnership development, sports management, and execution discipline into one premium client experience." />
      <section className="py-24">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map(([reason, body], index) => (
            <article className="min-h-60 rounded-mstry border border-white/10 bg-[#111827]/60 p-7 transition hover:border-mstry-gold/35" key={reason}>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-mstry-gold">Advantage 0{index + 1}</span>
              <h2 className="mt-4 font-display text-2xl font-black text-mstry-silver">{reason}</h2>
              <p className="mt-4 text-sm leading-7 text-mstry-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
