"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/sections/animated-counter";

const stats = [
  { value: 18, suffix: "+", label: "Markets supported across business, advisory, sports, partnership, and execution mandates" },
  { value: 42, suffix: "+", label: "Active relationship channels across corporate, investment, sports, consulting, and operating networks" },
  { value: 120, suffix: "+", label: "Projects delivered through structured planning, coordination, reporting, and stakeholder management" },
  { value: 6, suffix: "", label: "Core service divisions covering management, consulting, partnerships, sports, talent, and project execution" }
];

export function Stats() {
  return (
    <section className="py-20">
      <div className="mx-auto mb-8 w-[min(1160px,calc(100%_-_40px))]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">Trust indicators</p>
        <h2 className="mt-3 max-w-4xl font-display text-4xl font-black text-white md:text-5xl">
          Built for clients who need clarity, discretion, relationship access, and accountable execution.
        </h2>
      </div>
      <div className="mx-auto grid w-[min(1160px,calc(100%_-_40px))] overflow-hidden rounded-mstry border border-mstry-gold/15 bg-[#111827]/70 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            className="border-b border-white/10 p-8 md:border-b-0 md:border-r md:last:border-r-0"
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <strong className="block text-5xl leading-none text-mstry-gold">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </strong>
            <span className="mt-3 block font-bold text-mstry-muted">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
