import type { Metadata } from "next";
import { ConsultationForm } from "@/components/sections/consultation-form";
import { PageHero } from "@/components/sections/page-hero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact MSTRY MANAGEMENT to discuss management, consulting, partnerships, project leadership, business development, and sports management objectives."
};

export default function ContactPage() {
  const benefits = [
    "Strategic guidance for complex objectives",
    "Tailored management and operating solutions",
    "Partnership, growth, and development support",
    "International network and market access"
  ];

  const nextSteps = [
    ["Inquiry review", "A senior team member reviews your objective, service area, urgency, and required level of support."],
    ["Strategic qualification", "We identify whether the mandate is best supported through management, consulting, partnerships, project leadership, business development, or sports management."],
    ["Private response", "If there is a fit, MSTRY responds with recommended next steps and the most appropriate discussion path."],
    ["Engagement planning", "Qualified opportunities move into a defined scope, communication rhythm, responsibilities, and execution structure."]
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Discuss Your Objectives"
        body={`Whether you're seeking management support, strategic partnerships, business development, project leadership, or sports management solutions, our team is ready to explore how we can help. For direct enquiries, reach MSTRY at ${siteConfig.email}.`}
      />
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_8%,rgba(212,175,55,.10),transparent_34%)]" />
        <div className="relative mx-auto grid w-[min(1320px,calc(100%_-_40px))] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ConsultationForm />

          <div className="grid gap-5">
            <div className="rounded-mstry border border-mstry-gold/20 bg-[#111827]/70 p-8 shadow-luxury">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-mstry-gold">Why contact MSTRY</p>
              <h2 className="mt-3 font-display text-3xl font-black text-white">A focused path into a professional client engagement.</h2>
              <p className="mt-4 text-sm leading-7 text-mstry-muted">
                The contact request helps MSTRY understand your objective before proposing a discussion, structure, or engagement route. It is designed for qualified inquiries where discretion, clarity, and execution matter.
              </p>
              <div className="mt-6 grid gap-3">
                {benefits.map((benefit) => (
                  <div className="rounded-mstry border border-white/10 bg-[#0A0A0A]/50 px-4 py-3 text-sm font-bold text-mstry-silver" key={benefit}>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-mstry border border-white/10 bg-[#0A0A0A]/70 p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-mstry-gold">What happens next</p>
              {nextSteps.map(([item, body], index) => (
                <div className="border-b border-white/10 py-5 last:border-b-0" key={item}>
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">Step 0{index + 1}</span>
                  <h3 className="mt-2 font-display text-2xl text-mstry-silver">{item}</h3>
                  <p className="mt-2 text-sm leading-6 text-mstry-muted">{body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-mstry border border-mstry-gold/20 bg-mstry-gold/10 p-6 text-sm leading-7 text-mstry-silver">
              <strong className="text-white">Confidential by design.</strong> Submit only what is necessary for an initial review. Commercial details, stakeholder names, and sensitive project information can be shared during a private discussion when appropriate.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
