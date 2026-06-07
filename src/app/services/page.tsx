import type { Metadata } from "next";
import { CTA } from "@/components/sections/cta";
import { Operations } from "@/components/sections/operations";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceGrid } from "@/components/sections/service-grid";

export const metadata: Metadata = {
  title: "Services"
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Executive solutions for strategy, operations, growth, and execution."
        body="MSTRY helps clients clarify complex objectives, build the operating structure around them, unlock strategic relationships, and execute with discipline across business, investment, partnerships, sports, and international mandates."
      />
      <ServiceGrid />
      <Operations />
      <CTA />
    </>
  );
}
