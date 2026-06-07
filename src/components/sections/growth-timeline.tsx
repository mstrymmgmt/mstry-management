"use client";

import { motion } from "framer-motion";
import { milestones } from "@/config/site";
import { SectionHeading } from "@/components/ui/section-heading";

export function GrowthTimeline() {
  return (
    <section className="py-24">
      <div className="mx-auto w-[min(1160px,calc(100%_-_40px))]">
        <SectionHeading
          eyebrow="Capability evolution"
          title="A management platform designed to compound value."
          body="MSTRY's model expands from private operating support into a broader platform for strategy, investment readiness, partnerships, sports management, and project execution."
        />
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-mstry-gold/30 md:left-1/2" />
          <div className="grid gap-6">
            {milestones.map((item, index) => (
              <motion.article
                className={`relative grid gap-4 md:grid-cols-2 ${index % 2 ? "md:text-right" : ""}`}
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ duration: 0.45 }}
              >
                <div className={`${index % 2 ? "md:col-start-1" : "md:col-start-2"} ml-12 rounded-mstry border border-white/10 bg-[#111827]/65 p-6 md:ml-0`}>
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">{item.year}</span>
                  <h3 className="mt-3 font-display text-2xl text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-mstry-muted">{item.body}</p>
                </div>
                <span className="absolute left-4 top-8 h-3 w-3 -translate-x-1/2 rounded-full bg-mstry-gold shadow-[0_0_18px_rgba(212,175,55,.7)] md:left-1/2" />
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
