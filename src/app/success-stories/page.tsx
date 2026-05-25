import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Client Success Stories"
};

const stories = [
  "UAE launch desk",
  "European expansion",
  "Managed operations",
  "E-commerce infrastructure",
  "Private holding company",
  "Business relocation"
];

export default function StoriesPage() {
  return (
    <>
      <PageHero eyebrow="Client success stories" title="Calm, private execution for complex business goals." />
      <section className="py-24">
        <div className="mx-auto grid w-[min(1160px,calc(100%_-_40px))] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <article className="min-h-56 border border-white/10 bg-white/[.035] p-7" key={story}>
              <p className="text-lg text-mstry-silver">MSTRY created a structured operating rhythm around setup, banking readiness, documentation, and ongoing management.</p>
              <div className="mt-6 font-black text-mstry-gold">{story}</div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
