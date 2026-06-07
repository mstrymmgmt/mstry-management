import type { Metadata } from "next";
import { CTA } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { faqs } from "@/config/site";

export const metadata: Metadata = {
  title: "FAQ"
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions leaders ask before engaging MSTRY."
        body="These answers are designed to clarify scope, process, confidentiality, international work, and what a prospective client can expect before starting a conversation."
      />
      <section className="py-24">
        <div className="mx-auto grid w-[min(980px,calc(100%_-_40px))] gap-4">
          {faqs.map((faq, index) => (
            <details className="rounded-mstry border border-white/10 bg-[#111827]/60 p-6 open:border-mstry-gold/35 open:bg-[#111827]" key={faq.question}>
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-mstry-gold">
                Answer {String(index + 1).padStart(2, "0")}
              </span>
              <summary className="cursor-pointer font-black text-mstry-silver">{faq.question}</summary>
              <p className="mt-4 leading-7 text-mstry-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
