import type { Metadata } from "next";
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
        title="Business infrastructure for setup, structure, operations, and expansion."
        body="MSTRY is a full-service operational partner for entrepreneurs, investors, startups, e-commerce brands, agencies, consultants, holding companies, family offices, and international corporations entering the UAE and Europe."
      />
      <ServiceGrid />
      <Operations />
    </>
  );
}
