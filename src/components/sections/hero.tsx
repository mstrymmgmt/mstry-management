"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/sections/animated-counter";
import { executiveMetrics, siteConfig } from "@/config/site";

const heroStats = executiveMetrics.slice(0, 4);
const commandRows = [
  ["Clarify the mandate", "We define the objective, decision context, stakeholders, constraints, and commercial value before work begins."],
  ["Build the operating model", "We structure the cadence, responsibilities, reporting, partners, and execution path around the goal."],
  ["Coordinate execution", "We manage the follow-through across workflows, relationships, vendors, documents, and delivery milestones."],
  ["Create visible progress", "Leadership receives clearer priorities, controlled movement, and a stronger route toward measurable outcomes."]
];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden border-b border-white/10 bg-[#0A0A0A] py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,.12),transparent_34%)]" />
      <div className="relative mx-auto grid w-[min(1320px,calc(100%_-_40px))] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">Premium management, consulting, partnerships and execution</p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(3rem,6vw,6.5rem)] font-black leading-[.95] text-white">
            Build, manage, and scale with a private execution partner.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-mstry-muted">
            MSTRY MANAGEMENT helps founders, investors, companies, sports organizations, talent, and international operators turn important objectives into structured strategy, managed execution, strategic partnerships, business development, and operational control.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/book-consultation">Request a Strategic Review</Button>
            <Button href="/#proof" variant="ghost">Explore Management Solutions</Button>
          </div>
          <a className="mt-5 inline-flex font-black text-mstry-gold" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-mstry border border-mstry-gold/15 bg-[#111827] p-5 shadow-luxury sm:p-7"
          initial={{ opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(212,175,55,.12),transparent_32%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-mstry-gold/15 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">How MSTRY creates value</p>
                <h2 className="mt-3 max-w-xl font-display text-3xl font-black text-white sm:text-4xl">
                  Senior thinking and disciplined follow-through in one engagement model.
                </h2>
              </div>
              <div className="rounded-mstry border border-mstry-gold/25 bg-[#0B0B0B] px-4 py-3 text-right">
                <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-mstry-muted">Inquiry path</span>
                <strong className="mt-1 block text-mstry-gold">Strategic Review</strong>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {commandRows.map(([title, body], index) => (
                <motion.div
                  className="rounded-mstry border border-white/10 bg-[#0A0A0A]/70 p-4"
                  key={title}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.25 + index * 0.07 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">0{index + 1}</span>
                      <h3 className="mt-2 font-display text-xl font-black text-white">{title}</h3>
                    </div>
                    <span className="rounded-full border border-mstry-gold/25 px-3 py-1 text-xs font-black text-mstry-gold">Client value</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-mstry-muted">{body}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Management", "Consulting", "Partnerships"].map((item) => (
                <div className="rounded-mstry border border-mstry-gold/15 bg-mstry-gold/10 p-4 text-center" key={item}>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-mstry-gold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-12 grid w-[min(1320px,calc(100%_-_40px))] gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {heroStats.map((metric, index) => (
          <motion.article
            className="rounded-mstry border border-white/10 bg-[#111827]/72 p-5"
            key={metric.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <strong className="block text-4xl text-mstry-gold">
              <AnimatedCounter value={metric.value} suffix={metric.suffix} decimals={metric.value % 1 ? 1 : 0} />
            </strong>
            <span className="mt-3 block font-black text-white">{metric.label}</span>
            <p className="mt-2 text-sm leading-6 text-mstry-muted">{metric.detail}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
