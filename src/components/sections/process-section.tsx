"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function ProcessSection() {
  return (
    <section id="process" className="py-16 sm:py-24">
      <div className="mx-auto w-[min(1160px,calc(100%_-_24px))] sm:w-[min(1160px,calc(100%_-_40px))]">
        <SectionHeading
          eyebrow="Engagement model"
          title="A simple path from inquiry to managed execution."
          body="The process is built to reduce uncertainty before a client commits time, capital, or reputation. Each stage clarifies the mandate, defines responsibility, and moves the work toward visible progress."
        />
        <div className="relative grid gap-4">
          <div className="absolute left-5 top-0 hidden h-full w-px bg-mstry-gold/25 md:block" />
          {processSteps.map((step, index) => (
            <motion.article
              className="relative rounded-mstry border border-white/10 bg-[#111827]/58 p-5 transition hover:border-mstry-gold/35 sm:p-6 md:ml-16"
              key={step.title}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.04 }}
            >
              <span className="absolute -left-[3.35rem] top-7 hidden h-4 w-4 rounded-full bg-mstry-gold shadow-[0_0_20px_rgba(212,175,55,.65)] md:block" />
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-mstry-gold sm:text-xs sm:tracking-[0.18em]">Step 0{index + 1}</span>
              <h3 className="mt-3 font-display text-xl font-black leading-tight text-white sm:text-2xl">{step.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-mstry-muted">{step.body}</p>
              <div className="mt-4 inline-flex rounded-full border border-mstry-gold/20 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-mstry-gold">
                Decision ready
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-8 rounded-mstry border border-mstry-gold/20 bg-mstry-gold/10 p-5 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <strong className="text-white">Not sure where your mandate fits?</strong>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-mstry-muted">
                Share the objective. MSTRY will identify whether the work is best handled as management, consulting, partnerships, business development, sports management, project execution, or an integrated engagement.
              </p>
            </div>
            <Button href="/book-consultation">Schedule a Consultation</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
