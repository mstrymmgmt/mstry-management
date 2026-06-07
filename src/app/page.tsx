import { CTA } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { HomepageProof } from "@/components/sections/homepage-proof";
import { Operations } from "@/components/sections/operations";
import { ProcessSection } from "@/components/sections/process-section";
import { ServiceGrid } from "@/components/sections/service-grid";
import { SportsManagementSection } from "@/components/sections/sports-management-section";
import { Stats } from "@/components/sections/stats";
import { StrategicOverview } from "@/components/sections/strategic-overview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ServiceGrid />
      <SportsManagementSection />
      <StrategicOverview />
      <Operations />
      <HomepageProof />
      <ProcessSection />
      <CTA />
    </>
  );
}
