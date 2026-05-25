import type { Metadata } from "next";
import { ConsultationForm } from "@/components/sections/consultation-form";
import { PageHero } from "@/components/sections/page-hero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Speak With MSTRY." body={`Tell us what you want to build and which responsibilities you want removed from your desk. For direct contact, email ${siteConfig.email}.`} />
      <section className="py-24">
        <div className="mx-auto grid w-[min(1160px,calc(100%_-_40px))] gap-8 lg:grid-cols-2">
          <ConsultationForm />
          <div className="border border-mstry-gold/30 bg-mstry-gold/10 p-8">
            <h2 className="font-display text-5xl text-mstry-silver">Build Your Business Infrastructure.</h2>
            <p className="mt-6 text-mstry-muted">The MSTRY private desk reviews each enquiry with clarity, discretion, and speed.</p>
            <a className="mt-6 inline-flex font-black text-mstry-gold" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
