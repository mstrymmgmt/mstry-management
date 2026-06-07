"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedCounter } from "@/components/sections/animated-counter";
import { growthIndex } from "@/config/site";
import { SectionHeading } from "@/components/ui/section-heading";

const chartWidth = 420;
const chartHeight = 230;
const chartPadding = { top: 34, right: 34, bottom: 42, left: 38 };

function pct(value: number) {
  return Number(value.toFixed(1));
}

export function CompanyGrowthSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  const enriched = useMemo(
    () =>
      growthIndex.map((item, index) => {
        const previous = growthIndex[index - 1];
        const baseline = growthIndex[0];
        return {
          ...item,
          qoqGrowth: previous ? pct(((item.index - previous.index) / previous.index) * 100) : 0,
          cumulativeGrowth: pct(((item.index - baseline.index) / baseline.index) * 100)
        };
      }),
    []
  );
  const [activeIndex, setActiveIndex] = useState(enriched.length - 1);
  const active = enriched[activeIndex];

  const chart = useMemo(() => {
    const min = Math.min(...enriched.map((item) => item.index));
    const max = Math.max(...enriched.map((item) => item.index));
    const xStep = (chartWidth - chartPadding.left - chartPadding.right) / (enriched.length - 1);
    const points = enriched.map((item, index) => {
      const ratio = (item.index - min) / (max - min || 1);
      return {
        x: chartPadding.left + index * xStep,
        y: chartHeight - chartPadding.bottom - ratio * (chartHeight - chartPadding.top - chartPadding.bottom)
      };
    });
    return {
      points,
      path: `M ${points.map((point) => `${point.x} ${point.y}`).join(" L ")}`
    };
  }, [enriched]);

  const latest = enriched[enriched.length - 1];
  const biggestLift = enriched.slice(1).reduce((best, item) => (item.qoqGrowth > best.qoqGrowth ? item : best), enriched[1]);
  const projectLift = latest.projectsDelivered - enriched[0].projectsDelivered;
  const partnershipLift = latest.partnerships - enriched[0].partnerships;

  return (
    <section id="impact" className="border-y border-white/10 bg-[#111827]/45 py-24">
      <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            eyebrow="Client Momentum Index"
            title="Evidence of an operating model built for scale."
            body={`The displayed index moves from ${enriched[0].index} to ${latest.index}, showing how MSTRY's delivery capacity, project control, partnership reach, and market coverage compound as the management platform expands.`}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Index growth", latest.cumulativeGrowth, "%"],
              ["Project increase", projectLift, "+"],
              ["Partnership increase", partnershipLift, "+"]
            ].map(([label, value, suffix]) => (
              <div className="rounded-mstry border border-white/10 bg-black/25 p-4" key={label}>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">{label}</span>
                <strong className="mt-2 block text-3xl text-white">
                  <AnimatedCounter value={Number(value)} suffix={String(suffix)} decimals={String(value).includes(".") ? 1 : 0} />
                </strong>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          className="rounded-mstry border border-white/10 bg-[#0A0A0A] p-5 shadow-luxury"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-black text-white">Executive momentum dashboard</h3>
              <p className="mt-1 text-sm text-mstry-muted">Hover a milestone to see how capability, delivery volume, partnerships, and market coverage expand together.</p>
            </div>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">{active.quarter}</span>
          </div>

          <div className="relative min-h-[390px] overflow-hidden rounded-mstry border border-white/10 bg-[#111827]/45 p-4">
            <svg className="h-[270px] w-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="MSTRY business growth index">
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1={chartPadding.left} y1={y} x2={chartWidth - chartPadding.right} y2={y} stroke="rgba(255,255,255,.08)" />
              ))}
              <motion.path
                d={chart.path}
                fill="none"
                stroke="#D4AF37"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="5"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
              />
              {chart.points.map((point, index) => (
                <motion.g
                  key={enriched[index].quarter}
                  role="button"
                  tabIndex={0}
                  aria-label={`${enriched[index].quarter} growth milestone`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.35, delay: 0.75 + index * 0.12 }}
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={activeIndex === index ? 10 : 7}
                    fill={activeIndex === index ? "#FFFFFF" : "#D4AF37"}
                    stroke="#D4AF37"
                    strokeWidth="3"
                  />
                  <text x={point.x} y="218" textAnchor="middle" fill="rgba(255,255,255,.72)" fontSize="12" fontWeight="700">
                    {enriched[index].quarter}
                  </text>
                </motion.g>
              ))}
            </svg>

            <motion.div
              className="rounded-mstry border border-mstry-gold/30 bg-black/55 p-5"
              key={active.quarter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <strong className="font-display text-2xl text-white">{active.expansion}</strong>
                <span className="rounded-full border border-mstry-gold/30 px-3 py-1 text-xs font-black text-mstry-gold">
                  {active.qoqGrowth ? `+${active.qoqGrowth}% QoQ` : "Baseline"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-mstry-muted">{active.achievement}</p>
              <div className="mt-4 grid gap-2 text-sm text-mstry-silver sm:grid-cols-4">
                <span>Index {active.index}</span>
                <span>{active.projectsDelivered} projects</span>
                <span>{active.partnerships} partnerships</span>
                <span>{active.marketsServed} markets</span>
              </div>
            </motion.div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-mstry border border-white/10 bg-white/[.035] p-4">
              <strong className="text-white">Executive insight</strong>
              <p className="mt-2 text-sm leading-6 text-mstry-muted">
                The strongest acceleration appears in {biggestLift.quarter} at +{biggestLift.qoqGrowth}%, showing how new market support can quickly increase delivery capacity when it is connected to a disciplined operating model.
              </p>
            </div>
            <div className="rounded-mstry border border-white/10 bg-white/[.035] p-4">
              <strong className="text-white">Client value</strong>
              <p className="mt-2 text-sm leading-6 text-mstry-muted">
                The displayed data shows {latest.cumulativeGrowth}% cumulative index growth, {projectLift} additional projects, and {partnershipLift} additional partnerships, reinforcing MSTRY's ability to support larger, more complex mandates over time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
