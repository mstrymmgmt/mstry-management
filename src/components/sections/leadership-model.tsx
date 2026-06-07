"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";

const pillars = [
  ["Executive strategy", "Board-level clarity, strategic direction, and decision support for complex growth environments."],
  ["Operating control", "Back-office, project, vendor, reporting, and workflow systems managed with discipline."],
  ["Relationship capital", "Partnerships, investor access, sports networks, and international operating relationships."],
  ["Delivery governance", "Milestones, accountability, risk visibility, and execution cadence across active mandates."]
];

export function LeadershipModel() {
  return (
    <section className="py-24">
      <div className="mx-auto w-[min(1160px,calc(100%_-_40px))]">
        <SectionHeading
          eyebrow="Leadership model"
          title="A private-office standard for high-value mandates."
          body="MSTRY is built for clients who need calm senior judgment, clear operating control, credible relationships, and measured execution rather than fragmented advice or performative activity."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map(([title, body], index) => (
            <motion.article
              className="rounded-mstry border border-white/10 bg-[#111827]/60 p-6"
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">0{index + 1}</span>
              <h3 className="mt-4 font-display text-2xl text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-mstry-muted">{body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
