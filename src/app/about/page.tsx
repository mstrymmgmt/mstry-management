import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/page-hero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About MSTRY"
        title="A private business infrastructure partner for global operators."
        body={`MSTRY MANAGEMENT helps entrepreneurs, investors, startups, e-commerce brands, agencies, consultants, holding companies, family offices, and international corporations set up, structure, relocate, and operate across the UAE and Europe. Contact the private desk at ${siteConfig.email}.`}
      />
      <section className="py-24">
        <div className="mx-auto grid w-[min(1160px,calc(100%_-_40px))] items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-5xl text-mstry-silver">We exist to buy back your time.</h2>
            <p className="mt-6 text-lg leading-8 text-mstry-muted">
              We operate the machine behind the scenes while clients focus on growth, wealth, freedom, and expansion.
            </p>
          </div>
          <div className="overflow-hidden border border-white/10 shadow-luxury">
            <Image src="/assets/hero-boardroom.svg" alt="Premium business boardroom" width={1400} height={900} />
          </div>
        </div>
      </section>
    </>
  );
}
