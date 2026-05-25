import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { faqs } from "@/config/site";

export const metadata: Metadata = {
  title: "FAQ"
};

export default function FAQPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Questions founders ask before handing over the hard work." />
      <section className="py-24">
        <div className="mx-auto grid w-[min(900px,calc(100%_-_40px))] gap-4">
          {faqs.map((faq) => (
            <details className="border border-white/10 bg-white/[.03] p-6" key={faq.question}>
              <summary className="cursor-pointer font-black text-mstry-silver">{faq.question}</summary>
              <p className="mt-4 text-mstry-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
