"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/sections/animated-counter";
import { companyFootprint } from "@/config/site";

const stats = [
  { value: 18, suffix: "+", label: "Markets supported across business, advisory, sports, partnership, and execution mandates" },
  { value: 42, suffix: "+", label: "Active relationship channels across corporate, investment, sports, consulting, and operating networks" },
  { value: 11000, suffix: "+", label: "Active clients supported through the operating network" },
  { value: 7956, suffix: "+", label: "Projects delivered through structured planning, coordination, reporting, and stakeholder management" },
  { value: 6, suffix: "", label: "Core service divisions covering management, consulting, partnerships, sports, talent, and project execution" }
];

export function Stats() {
  const countries = companyFootprint.operationsProjectsAcross.join(", ");

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto mb-8 w-[min(1160px,calc(100%_-_24px))] sm:w-[min(1160px,calc(100%_-_40px))]">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-mstry-gold sm:text-xs sm:tracking-[0.22em]">Trust indicators</p>
        <h2 className="mt-3 max-w-4xl font-display text-[clamp(2rem,9vw,3rem)] font-black leading-tight text-white md:text-5xl">
          Built for clients who need clarity, discretion, relationship access, and accountable execution.
        </h2>
      </div>
      <div className="mx-auto grid w-[min(1160px,calc(100%_-_24px))] overflow-hidden rounded-mstry border border-mstry-gold/15 bg-[#111827]/70 sm:w-[min(1160px,calc(100%_-_40px))] md:grid-cols-5">
        {stats.map((stat, index) => (
          <motion.div
            className="border-b border-white/10 p-5 sm:p-8 md:border-b-0 md:border-r md:last:border-r-0"
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <strong className="block text-4xl leading-none text-mstry-gold sm:text-5xl">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </strong>
            <span className="mt-3 block font-bold text-mstry-muted">{stat.label}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mx-auto mt-10 w-[min(1160px,calc(100%_-_24px))] border-t border-mstry-gold/20 pt-8 sm:w-[min(1160px,calc(100%_-_40px))]"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-mstry-gold sm:text-xs sm:tracking-[0.2em]">Head Office</span>
            <p className="mt-3 font-display text-2xl font-black text-white">{companyFootprint.headOffice.address}</p>
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-mstry-gold sm:text-xs sm:tracking-[0.2em]">Global Operating Footprint</span>
            <p className="mt-3 text-sm leading-7 text-mstry-muted">{countries}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
