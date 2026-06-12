"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/sections/animated-counter";
import { sportsCapabilities } from "@/config/site";
import { SectionHeading } from "@/components/ui/section-heading";

type Capability = (typeof sportsCapabilities)[number];

const shortLabels: Record<string, string> = {
  "Strategic Leadership": "Leadership",
  "Business Development": "Business Dev",
  "Project Management": "Projects",
  "Partnership Strategy": "Partnerships",
  "Commercial Growth": "Growth",
  "Stakeholder Management": "Stakeholders",
  "Brand Development": "Brand",
  "Global Network & Expansion": "Global"
};

const CHART_CENTER = 60;
const CHART_RADIUS = 38;
const LABEL_RADIUS = 52;
const VIEWBOX_SIZE = 120;

function polarPoint(index: number, radius: number) {
  const angle = -90 + (360 / sportsCapabilities.length) * index;
  const radians = (angle * Math.PI) / 180;
  return {
    x: CHART_CENTER + radius * Math.cos(radians),
    y: CHART_CENTER + radius * Math.sin(radians)
  };
}

function scorePoint(index: number, value: number) {
  return polarPoint(index, CHART_RADIUS * (value / 100));
}

function cssPosition(point: { x: number; y: number }) {
  return {
    left: `${(point.x / VIEWBOX_SIZE) * 100}%`,
    top: `${(point.y / VIEWBOX_SIZE) * 100}%`
  };
}

function polygonPoints(radius: number) {
  return sportsCapabilities
    .map((_, pointIndex) => {
      const point = polarPoint(pointIndex, radius);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

export function SportsManagementSection() {
  const [hovered, setHovered] = useState<Capability | null>(null);
  const [locked, setLocked] = useState<Capability | null>(sportsCapabilities[0]);
  const active = hovered ?? locked ?? sportsCapabilities[0];

  const summary = useMemo(() => {
    const total = sportsCapabilities.reduce((sum, item) => sum + item.value, 0);
    const average = Number((total / sportsCapabilities.length).toFixed(1));
    const strongest = sportsCapabilities.reduce((best, item) => (item.value > best.value ? item : best), sportsCapabilities[0]);
    const developing = sportsCapabilities.reduce((lowest, item) => (item.value < lowest.value ? item : lowest), sportsCapabilities[0]);
    return {
      average,
      strongest,
      developing,
      spread: strongest.value - developing.value
    };
  }, []);

  return (
    <section id="capabilities" className="bg-[#0B0B0B] py-16 sm:py-24">
      <div className="mx-auto w-[min(1400px,calc(100%_-_32px))]">
        <SectionHeading
          eyebrow="Management Excellence Framework"
          title="Explore the management capabilities that support client success."
          body={`Discover how MSTRY's integrated approach strengthens strategy, growth, partnerships, project execution, stakeholder confidence, brand position, and international expansion. The ${summary.average}/100 index reflects demonstrated capability strength across ${sportsCapabilities.length} client-facing pillars.`}
        />

        <motion.div
          className="grid gap-8 rounded-mstry border border-mstry-gold/15 bg-[#111827] p-5 shadow-luxury sm:p-8 xl:grid-cols-[minmax(0,1.85fr)_minmax(360px,1fr)]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-[clamp(1.625rem,7vw,2.25rem)] font-black leading-tight text-white sm:text-2xl">Integrated Management Capability Framework</h3>
                <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
                  This dashboard is interactive. Hover or click any pillar to see the client benefit, strategic value, and business impact behind the capability.
                </p>
              </div>
              <span className="rounded-full border border-mstry-gold/30 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">
                Capability strength
              </span>
            </div>

            <motion.div
              className="relative mx-auto aspect-square w-full max-w-[min(650px,calc(100vw_-_48px))] overflow-visible rounded-full sm:max-w-[650px]"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.svg
                className="absolute inset-0 h-full w-full"
                viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
                aria-hidden="true"
                initial={{ opacity: 0, rotate: -4, scale: 0.9 }}
                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {[14, 23, 32, CHART_RADIUS].map((radius, index) => (
                  <motion.polygon
                    key={radius}
                    points={polygonPoints(radius)}
                    fill={index === 3 ? "rgba(212,175,55,.035)" : "none"}
                    stroke={index === 3 ? "rgba(212,175,55,.28)" : "rgba(255,255,255,.08)"}
                    strokeWidth={index === 3 ? ".65" : ".32"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.75, delay: index * 0.08 }}
                  />
                ))}

                {sportsCapabilities.map((item, index) => {
                  const point = polarPoint(index, CHART_RADIUS);
                  const selected = item.subject === active.subject;
                  return (
                    <motion.line
                      key={item.subject}
                      x1={CHART_CENTER}
                      y1={CHART_CENTER}
                      x2={point.x}
                      y2={point.y}
                      stroke={selected ? "#D4AF37" : "rgba(255,255,255,.08)"}
                      strokeWidth={selected ? ".55" : ".22"}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: selected ? 1 : 0.75 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.65, delay: 0.18 + index * 0.04 }}
                    />
                  );
                })}

                <motion.polygon
                  fill="rgba(212,175,55,.22)"
                  stroke="#D4AF37"
                  strokeWidth="1.05"
                  points={sportsCapabilities
                    .map((item, index) => {
                      const point = scorePoint(index, item.value);
                      return `${point.x},${point.y}`;
                    })
                    .join(" ")}
                  initial={{ opacity: 0, scale: 0.72 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                />

                {sportsCapabilities.map((item, index) => {
                  const axisEnd = polarPoint(index, CHART_RADIUS);
                  const selected = item.subject === active.subject;
                  return (
                    <motion.line
                      key={`${item.subject}-active-axis`}
                      x1={CHART_CENTER}
                      y1={CHART_CENTER}
                      x2={axisEnd.x}
                      y2={axisEnd.y}
                      stroke="rgba(230,195,92,.92)"
                      strokeLinecap="round"
                      strokeWidth="1.1"
                      animate={{ opacity: selected ? 1 : 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  );
                })}

                {sportsCapabilities.map((item, index) => {
                  const point = scorePoint(index, item.value);
                  const selected = item.subject === active.subject;
                  return (
                    <motion.circle
                      key={`${item.subject}-svg-point`}
                      cx={point.x}
                      cy={point.y}
                      r={selected ? 2.5 : 1.65}
                      fill={selected ? "#E6C35C" : "#D4AF37"}
                      stroke={selected ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.32)"}
                      strokeWidth="0.55"
                      animate={{ opacity: selected ? 1 : 0.82 }}
                      transition={{ duration: 0.25 }}
                    />
                  );
                })}
              </motion.svg>

              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-mstry-gold/30 bg-[#0B0B0B]/86 text-center shadow-luxury backdrop-blur sm:h-32 sm:w-32"
                key={active.subject}
                initial={{ opacity: 0, scale: 0.84 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#A1A1AA]">Strength</span>
                  <strong className="mt-1 block text-4xl leading-none text-mstry-gold">{active.value}</strong>
                  <span className="block text-xs font-black uppercase tracking-[0.16em] text-white">/100</span>
                </div>
              </motion.div>

              {sportsCapabilities.map((item, index) => {
                const label = polarPoint(index, LABEL_RADIUS);
                const selected = item.subject === active.subject;
                return (
                  <motion.button
                    key={item.subject}
                    type="button"
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-center outline-none"
                    style={cssPosition(label)}
                    aria-label={`${item.subject}, ${item.value} out of 100`}
                    initial={{ opacity: 0, scale: 0.82 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.45, delay: 0.35 + index * 0.05 }}
                    onMouseEnter={() => setHovered(item)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(item)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setLocked(item)}
                  >
                    <span
                      className={`mb-1 block max-w-[92px] rounded-mstry border px-2 py-1 text-[9px] font-black uppercase tracking-[0.07em] transition sm:mb-2 sm:max-w-none sm:text-[11px] ${
                        selected
                          ? "border-mstry-gold bg-mstry-gold text-black"
                          : "border-mstry-gold/15 bg-[#0B0B0B]/80 text-white hover:border-mstry-gold/60"
                      }`}
                    >
                      {shortLabels[item.subject]}
                    </span>
                    <span className={`block text-xs font-black sm:text-sm ${selected ? "text-mstry-gold" : "text-[#E6C35C]"}`}>
                      {item.value}
                    </span>
                  </motion.button>
                );
              })}

              {sportsCapabilities.map((item, index) => {
                const point = scorePoint(index, item.value);
                const selected = item.subject === active.subject;
                return (
                  <motion.button
                    key={`${item.subject}-point`}
                    type="button"
                    className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-mstry-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] sm:h-6 sm:w-6"
                    style={cssPosition(point)}
                    aria-label={`Select ${item.subject}`}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    whileHover={{ scale: 1.3 }}
                    transition={{ duration: 0.25, delay: 0.45 + index * 0.04 }}
                    onMouseEnter={() => setHovered(item)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(item)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setLocked(item)}
                  >
                    <span
                      className={`mx-auto block h-4 w-4 rounded-full border transition sm:h-5 sm:w-5 ${
                        selected
                          ? "border-white bg-mstry-gold shadow-[0_0_28px_rgba(212,175,55,.9)]"
                          : "border-mstry-gold/70 bg-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,.35)]"
                      }`}
                    />
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          <aside className="rounded-mstry border border-mstry-gold/15 bg-[#0B0B0B] p-5 shadow-luxury">
            <div className="border-b border-mstry-gold/15 pb-5">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">Management Excellence Index</span>
              <div className="mt-3 flex items-end gap-2">
                <strong className="text-7xl leading-none text-white">
                  <AnimatedCounter value={summary.average} decimals={1} />
                </strong>
                <span className="pb-2 text-xl font-black text-[#A1A1AA]">/100</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#A1A1AA]">
                A reflection of MSTRY&apos;s ability to deliver integrated management solutions across strategy, business development, partnerships, project execution, commercial growth, stakeholder management, brand, and international expansion.
              </p>
            </div>

            <div className="border-b border-mstry-gold/15 py-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-black text-white">Capability pillars</h3>
                <span className="text-xs font-black text-mstry-gold">Click to explore</span>
              </div>
              <div className="grid gap-3">
                {sportsCapabilities.map((item) => {
                  const selected = item.subject === active.subject;
                  return (
                    <button
                      className={`group rounded-mstry border p-3 text-left transition ${
                        selected
                          ? "border-mstry-gold/60 bg-mstry-gold/10"
                          : "border-white/10 bg-white/[.03] hover:border-mstry-gold/40"
                      }`}
                      key={item.subject}
                      type="button"
                      onMouseEnter={() => setHovered(item)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(item)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setLocked(item)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 text-sm font-black leading-5 text-white">{item.subject}</span>
                        <span className="shrink-0 text-sm font-black text-mstry-gold">{item.value}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-mstry-gold"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.75 }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.div
              className="pt-5"
              key={active.subject}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">Selected capability</span>
              <h3 className="mt-3 font-display text-3xl font-black text-white">{active.subject}</h3>
              <strong className="mt-2 block text-4xl text-mstry-gold">{active.value}/100</strong>
              <span className="mt-1 block text-xs font-black uppercase tracking-[0.16em] text-[#A1A1AA]">
                Capability Strength Indicator
              </span>
              <p className="mt-4 text-sm leading-6 text-[#A1A1AA]">{active.description}</p>
              <div className="mt-4 rounded-mstry border border-white/10 bg-white/[.035] p-4">
                <strong className="text-white">Strategic Value</strong>
                <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">{active.valueText}</p>
              </div>
              <div className="mt-4 rounded-mstry border border-white/10 bg-white/[.035] p-4">
                <strong className="text-white">Client Benefit</strong>
                <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">{active.clientBenefit}</p>
              </div>
              <div className="mt-4 rounded-mstry border border-mstry-gold/25 bg-mstry-gold/10 p-4">
                <strong className="text-white">Business Impact</strong>
                <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">{active.businessImpact}</p>
              </div>
              <div className="mt-5 rounded-mstry border border-mstry-gold/25 bg-[#111827] p-4">
                <p className="text-sm leading-6 text-[#A1A1AA]">
                  Looking to strengthen strategy, growth, partnerships, project execution, or international expansion?
                </p>
                <Link
                  className="mt-3 inline-flex font-black text-mstry-gold transition hover:text-[#E6C35C]"
                  href="/book-consultation"
                >
                  Discuss Your Objectives
                </Link>
              </div>
            </motion.div>
          </aside>
        </motion.div>

        <motion.div
          className="mt-6 rounded-mstry border border-mstry-gold/15 bg-[#111827] p-6"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <strong className="text-white">Executive Insight</strong>
              <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
                MSTRY&apos;s capability profile demonstrates balanced expertise across strategic leadership, business development, project management, partnership strategy, commercial growth, stakeholder management, brand development, and international expansion.
              </p>
            </div>
            <div>
              <strong className="text-white">Client Value</strong>
              <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
                The {summary.spread}-point capability range shows an integrated management model rather than a single-service offering, helping clients align strategy, growth, partnerships, execution, market presence, and expansion through one trusted operating partner.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
