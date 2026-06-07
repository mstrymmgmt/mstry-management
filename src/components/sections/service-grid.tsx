"use client";

import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { serviceNarratives } from "@/config/site";
import { SectionHeading } from "@/components/ui/section-heading";

export function ServiceGrid() {
  return (
    <section id="services" className="py-24">
      <div className="mx-auto w-[min(1320px,calc(100%_-_40px))]">
        <SectionHeading
          eyebrow="What we do"
          title="Services built around the problems leaders actually need solved."
          body="Each service connects a clear challenge to a practical solution and a business outcome. The focus is not activity. The focus is clarity, execution, relationships, growth, and control."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceNarratives.map((service, index) => (
            <motion.article
              className="group flex min-h-[520px] flex-col rounded-mstry border border-white/10 bg-[#111827]/58 p-6 transition hover:-translate-y-1 hover:border-mstry-gold/45 hover:bg-[#111827]/80"
              key={service.title}
              initial={{ opacity: 0, y: 22, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.04 }}
            >
              <div className="flex items-start justify-between gap-5">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">Division 0{index + 1}</span>
                <ArrowUpRight className="text-mstry-gold transition group-hover:translate-x-1 group-hover:-translate-y-1" size={22} />
              </div>
              <h3 className="mt-5 font-display text-3xl font-black text-white">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-mstry-muted">{service.solution}</p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-mstry border border-white/10 bg-[#0A0A0A]/65 p-4">
                  <strong className="text-sm text-white">Client challenge</strong>
                  <p className="mt-2 text-sm leading-6 text-mstry-muted">{service.challenge}</p>
                </div>
                <div className="rounded-mstry border border-mstry-gold/20 bg-mstry-gold/10 p-4">
                  <strong className="text-sm text-white">Business value</strong>
                  <p className="mt-2 text-sm leading-6 text-mstry-muted">{service.strategicValue}</p>
                </div>
              </div>
              <div className="mt-auto grid gap-2 pt-6">
                {service.outcomes.map((point) => (
                  <div className="flex items-center gap-2 text-sm font-bold text-mstry-silver" key={point}>
                    <CheckCircle2 size={16} className="text-mstry-gold" />
                    {point}
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
