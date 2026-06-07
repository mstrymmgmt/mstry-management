"use client";

import dynamic from "next/dynamic";

const CompanyGrowthSection = dynamic(() =>
  import("@/components/sections/company-growth-section").then((mod) => mod.CompanyGrowthSection)
);
const SportsManagementSection = dynamic(() =>
  import("@/components/sections/sports-management-section").then((mod) => mod.SportsManagementSection)
);
const PartnershipEcosystem = dynamic(() =>
  import("@/components/sections/partnership-ecosystem").then((mod) => mod.PartnershipEcosystem)
);

export function IntelligenceSuite() {
  return (
    <>
      <CompanyGrowthSection />
      <SportsManagementSection />
      <PartnershipEcosystem />
    </>
  );
}
