import type { Metadata } from "next";
import Image from "next/image";
import { ConsultationForm } from "@/components/sections/consultation-form";
import { PageHero } from "@/components/sections/page-hero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Book Consultation"
};

export default function BookConsultationPage() {
  return (
    <>
      <PageHero
        eyebrow="Book consultation"
        title="Build Your Business Infrastructure."
        body={`Use this consultation to clarify UAE or European setup, Free Zone vs Mainland, holding company architecture, visas, banking, compliance, relocation, and outsourced operations management. Reach MSTRY directly at ${siteConfig.email}.`}
      />
      <section className="py-24">
        <div className="mx-auto grid w-[min(1160px,calc(100%_-_40px))] gap-8 lg:grid-cols-2">
          <ConsultationForm />
          <div>
            <div className="overflow-hidden border border-white/10 shadow-luxury">
              <Image src="/assets/global-network.svg" alt="International business setup network" width={1200} height={760} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
