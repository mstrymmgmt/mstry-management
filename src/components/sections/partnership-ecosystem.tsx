"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { partnershipLinks, partnershipNodes } from "@/config/site";
import { SectionHeading } from "@/components/ui/section-heading";

export function PartnershipEcosystem() {
  const [activeId, setActiveId] = useState(partnershipNodes[0].id);
  const active = partnershipNodes.find((node) => node.id === activeId) ?? partnershipNodes[0];
  const activeLinks = partnershipLinks.filter((link) => link.from === activeId || link.to === activeId);
  const strongestLink = partnershipLinks.reduce((best, link) => (link.strength > best.strength ? link : best), partnershipLinks[0]);
  const averageStrength = Math.round(partnershipLinks.reduce((sum, link) => sum + link.strength, 0) / partnershipLinks.length);
  const strongestFrom = partnershipNodes.find((node) => node.id === strongestLink.from)?.label ?? strongestLink.from;
  const strongestTo = partnershipNodes.find((node) => node.id === strongestLink.to)?.label ?? strongestLink.to;
  const relatedIds = useMemo(() => {
    const related = new Set([activeId]);
    partnershipLinks.forEach(({ from, to }) => {
      if (from === activeId) related.add(to);
      if (to === activeId) related.add(from);
    });
    return related;
  }, [activeId]);

  return (
    <section id="partnerships" className="border-y border-white/10 bg-[#111827]/45 py-24">
      <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            eyebrow="Strategic Partnership Network"
            title="Relationship capital that can be structured into client advantage."
            body={`The network maps ${partnershipNodes.length} relationship categories and ${partnershipLinks.length} active connection paths across business, sports, investment, consulting, corporate, international, and government-adjacent channels.`}
          />
          <div className="rounded-mstry border border-white/10 bg-black/25 p-5">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">Selected relationship channel</span>
            <h3 className="mt-3 font-display text-2xl font-black text-white">{active.label}</h3>
            <p className="mt-3 text-sm leading-6 text-mstry-muted">{active.detail}</p>
            <div className="mt-4 grid gap-2 text-sm text-mstry-silver">
              {activeLinks.map((link) => {
                const otherId = link.from === activeId ? link.to : link.from;
                const other = partnershipNodes.find((node) => node.id === otherId);
                return (
                  <span key={`${link.from}-${link.to}`}>
                    {other?.label ?? otherId}: {link.strength}/100
                  </span>
                );
              })}
            </div>
            <div className="mt-4 rounded-mstry border border-mstry-gold/25 bg-mstry-gold/10 p-4">
              <strong className="text-white">Strategic value</strong>
              <p className="mt-2 text-sm leading-6 text-mstry-muted">{active.insight}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative min-h-[540px] rounded-mstry border border-white/10 bg-[#0A0A0A] p-4 shadow-luxury"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-label="MSTRY strategic partnership network">
            {partnershipLinks.map((link, index) => {
              const from = partnershipNodes.find((node) => node.id === link.from);
              const to = partnershipNodes.find((node) => node.id === link.to);
              if (!from || !to) return null;
              const highlighted = from.id === activeId || to.id === activeId;
              const strokeWidth = highlighted ? 0.55 + link.strength / 150 : 0.25 + link.strength / 300;
              return (
                <motion.line
                  key={`${link.from}-${link.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={highlighted ? "#D4AF37" : "rgba(255,255,255,.18)"}
                  strokeWidth={strokeWidth}
                  strokeDasharray="1.5 1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: highlighted ? 1 : 0.65 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: index * 0.07 }}
                />
              );
            })}
          </svg>

          <motion.div
            className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-mstry-gold/60 bg-[#111827] text-center text-xs font-black uppercase tracking-[0.16em] text-mstry-gold"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            MSTRY
          </motion.div>

          {partnershipNodes.map((node, index) => {
            const selected = node.id === activeId;
            const related = relatedIds.has(node.id);
            return (
              <motion.button
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-3 text-sm font-black transition ${
                  selected
                    ? "border-mstry-gold bg-mstry-gold text-black"
                    : related
                      ? "border-mstry-gold/50 bg-[#111827] text-white"
                      : "border-white/10 bg-[#0A0A0A]/90 text-mstry-muted hover:border-mstry-gold hover:text-white"
                }`}
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                type="button"
                initial={{ opacity: 0, scale: 0.75 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.25 + index * 0.05 }}
                onMouseEnter={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
                onClick={() => setActiveId(node.id)}
              >
                {node.label}
              </motion.button>
            );
          })}
        </motion.div>
        <div className="lg:col-start-2">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-mstry border border-white/10 bg-black/25 p-4">
              <strong className="text-white">Executive insight</strong>
              <p className="mt-2 text-sm leading-6 text-mstry-muted">
                The strongest connection is {strongestFrom} to {strongestTo} at {strongestLink.strength}/100, showing where relationship strength most directly supports client delivery and business development leverage.
              </p>
            </div>
            <div className="rounded-mstry border border-white/10 bg-black/25 p-4">
              <strong className="text-white">Client value</strong>
              <p className="mt-2 text-sm leading-6 text-mstry-muted">
                Clients do not need disconnected introductions. They need relationship strategy, credible positioning, commercial logic, and follow-through. The average network strength is {averageStrength}/100 across the displayed connection paths.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
