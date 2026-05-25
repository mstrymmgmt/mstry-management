import type { Metadata } from "next";
import { CTA } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Why Choose Us"
};

const reasons = [
  "Full-service infrastructure",
  "Private office standard",
  "International intelligence",
  "Operational control",
  "AI-powered workflows",
  "Built for scale"
];

export default function WhyChooseUsPage() {
  return (
    <>
      <PageHero eyebrow="Why entrepreneurs choose us" title="A private operating office for people building serious companies." body="You keep control. MSTRY manages the machine." />
      <section className="py-24">
        <div className="mx-auto grid w-[min(1160px,calc(100%_-_40px))] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <article className="min-h-48 border border-white/10 bg-white/[.035] p-7" key={reason}>
              <h2 className="font-display text-2xl text-mstry-silver">{reason}</h2>
              <p className="mt-4 text-mstry-muted">Discreet, high-status execution for founders, investors, and international operators.</p>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
