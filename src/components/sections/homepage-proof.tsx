"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { sportsCapabilities } from "@/config/site";

const whyItMatters: Record<string, string> = {
  "Strategic Leadership":
    "Clear leadership structure reduces hesitation, aligns stakeholders, and gives important objectives a stronger chance of becoming managed progress.",
  "Business Development":
    "Growth depends on turning opportunity into practical action, relationship logic, and commercial movement instead of leaving potential unstructured.",
  "Project Management":
    "Strong execution control protects momentum when priorities, vendors, documents, timelines, and stakeholders become complex.",
  "Partnership Strategy":
    "The right partnerships can create access, credibility, commercial leverage, and opportunities that take years to build independently.",
  "Commercial Growth":
    "Commercial discipline helps organizations connect positioning, relationships, and operations to measurable growth rather than activity alone.",
  "Stakeholder Management":
    "Important relationships require professional communication, timing, and follow-through to build trust and unlock long-term value.",
  "Brand Development":
    "A stronger market presence improves credibility before the first meeting, helping clients attract partners, investors, talent, and opportunities.",
  "Global Network & Expansion":
    "International growth requires local understanding, relationship access, and execution discipline across markets."
};

function radarPoint(index: number, value: number, radius = 42) {
  const angle = -90 + (360 / sportsCapabilities.length) * index;
  const radians = (Math.PI / 180) * angle;
  const scaledRadius = radius * (value / 100);
  return {
    x: 50 + Math.cos(radians) * scaledRadius,
    y: 50 + Math.sin(radians) * scaledRadius
  };
}

function outerPoint(index: number, radius = 45) {
  const angle = -90 + (360 / sportsCapabilities.length) * index;
  const radians = (Math.PI / 180) * angle;
  return {
    x: 50 + Math.cos(radians) * radius,
    y: 50 + Math.sin(radians) * radius
  };
}

export function HomepageProof() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sportsCapabilities[activeIndex];

  const average = useMemo(() => {
    const total = sportsCapabilities.reduce((sum, item) => sum + item.value, 0);
    return Number((total / sportsCapabilities.length).toFixed(1));
  }, []);

  const radarPoints = useMemo(
    () =>
      sportsCapabilities
        .map((item, index) => {
          const point = radarPoint(index, item.value);
          return `${point.x},${point.y}`;
        })
        .join(" "),
    []
  );

  const activeOuter = outerPoint(activeIndex, 45);

  return (
    <section id="proof" className="relative overflow-hidden border-y border-white/10 bg-[#0B0B0B] py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(212,175,55,.12),transparent_30%),radial-gradient(circle_at_78%_70%,rgba(212,175,55,.08),transparent_34%)]" />
      <div className="relative mx-auto w-[min(1400px,calc(100%_-_24px))] sm:w-[min(1400px,calc(100%_-_40px))]">
        <SectionHeading
          eyebrow="Proof of capability"
          title="An interactive view of the capabilities clients gain access to."
          body="Explore the management capabilities that support client success. Each pillar explains how MSTRY creates clarity, growth, stronger relationships, and controlled execution across business, consulting, partnerships, project management, sports, and international mandates."
        />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,.85fr)] xl:items-start">
          <motion.div
            className="grid gap-3 md:grid-cols-2 md:gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-90px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {sportsCapabilities.map((item, index) => {
              const isActive = active.subject === item.subject;
              return (
                <motion.article
                  aria-label={`${item.subject} capability, ${item.value} out of 100`}
                  className="group relative cursor-pointer overflow-hidden rounded-mstry border bg-[#111827]/80 p-4 outline-none sm:p-5"
                  key={item.subject}
                  layout
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0.65,
                    scale: isActive ? 1.03 : 1,
                    borderColor: isActive ? "rgba(212,175,55,0.58)" : "rgba(255,255,255,0.1)",
                    boxShadow: isActive ? "0 28px 80px rgba(0,0,0,.42), 0 0 34px rgba(212,175,55,.18)" : "0 0 0 rgba(0,0,0,0)"
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 22 },
                    show: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,.18),transparent_42%)]"
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-mstry-gold sm:text-[11px] sm:tracking-[0.18em]">
                          Capability pillar
                        </span>
                        <h3 className="mt-3 font-display text-xl font-black leading-tight text-white sm:text-2xl">{item.subject}</h3>
                      </div>
                      <div className="rounded-mstry border border-mstry-gold/25 bg-[#0A0A0A] px-3 py-2 text-right">
                        <strong className="block text-2xl leading-none text-mstry-gold">{item.value}</strong>
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-mstry-muted">strength</span>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-mstry-muted">{item.valueText}</p>

                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.div
                          className="mt-5 grid gap-3"
                          initial={{ height: 0, opacity: 0, y: -8 }}
                          animate={{ height: "auto", opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {[
                            ["Executive Summary", item.description],
                            ["Strategic Value", item.valueText],
                            ["Client Benefit", item.clientBenefit],
                            ["Business Impact", item.businessImpact],
                            ["Why It Matters", whyItMatters[item.subject]]
                          ].map(([label, body]) => (
                            <div className="rounded-mstry border border-white/10 bg-[#0A0A0A]/70 p-4" key={label}>
                              <strong className="text-sm text-white">{label}</strong>
                              <p className="mt-2 text-sm leading-6 text-mstry-muted">{body}</p>
                            </div>
                          ))}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <motion.aside
            className="overflow-hidden rounded-mstry border border-mstry-gold/20 bg-[#111827] p-4 shadow-luxury sm:p-6 xl:sticky xl:top-28"
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,.14),transparent_38%)]" />
            <div className="relative">
              <div className="grid gap-4 border-b border-mstry-gold/15 pb-5 sm:flex sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-mstry-gold sm:text-xs sm:tracking-[0.18em]">Management Excellence Index</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-mstry-muted">
                    A client-facing measure of integrated capability across strategy, growth, partnerships, execution, brand, and expansion.
                  </p>
                </div>
                <div className="text-right">
                  <strong className="block text-4xl leading-none text-white sm:text-5xl">{average}</strong>
                  <span className="text-sm font-black text-mstry-muted">/100</span>
                </div>
              </div>

              <div className="mx-auto mt-6 aspect-square max-w-[min(440px,calc(100vw_-_72px))] sm:max-w-[440px]">
                <motion.svg viewBox="0 0 100 100" aria-label="Integrated management capability radar" className="h-full w-full">
                  {[18, 30, 42].map((radius) => {
                    const points = sportsCapabilities
                      .map((_, index) => {
                        const point = outerPoint(index, radius);
                        return `${point.x},${point.y}`;
                      })
                      .join(" ");
                    return (
                      <polygon
                        fill="none"
                        key={radius}
                        points={points}
                        stroke="rgba(255,255,255,.09)"
                        strokeWidth="0.45"
                      />
                    );
                  })}
                  {sportsCapabilities.map((_, index) => {
                    const point = outerPoint(index, 45);
                    return (
                      <line
                        key={index}
                        stroke={index === activeIndex ? "rgba(212,175,55,.75)" : "rgba(255,255,255,.08)"}
                        strokeWidth={index === activeIndex ? "0.85" : "0.35"}
                        x1="50"
                        x2={point.x}
                        y1="50"
                        y2={point.y}
                      />
                    );
                  })}
                  <motion.polygon
                    animate={{ opacity: 1, scale: 1 }}
                    fill="rgba(212,175,55,.20)"
                    initial={{ opacity: 0, scale: 0.85 }}
                    points={radarPoints}
                    stroke="#D4AF37"
                    strokeWidth="0.95"
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.line
                    animate={{ x2: activeOuter.x, y2: activeOuter.y }}
                    stroke="rgba(230,195,92,.9)"
                    strokeLinecap="round"
                    strokeWidth="1"
                    x1="50"
                    y1="50"
                    transition={{ duration: 0.28 }}
                  />
                  {sportsCapabilities.map((item, index) => {
                    const point = radarPoint(index, item.value);
                    const isActive = index === activeIndex;
                    return (
                      <motion.circle
                        animate={{ r: isActive ? 2.15 : 1.15, opacity: isActive ? 1 : 0.65 }}
                        cx={point.x}
                        cy={point.y}
                        fill={isActive ? "#E6C35C" : "#D4AF37"}
                        key={item.subject}
                        stroke={isActive ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.25)"}
                        strokeWidth="0.45"
                        transition={{ duration: 0.25 }}
                      />
                    );
                  })}
                  <circle cx="50" cy="50" fill="#0B0B0B" r="10.5" stroke="rgba(212,175,55,.28)" strokeWidth="0.5" />
                  <text fill="#D4AF37" fontSize="8" fontWeight="900" textAnchor="middle" x="50" y="49">
                    {active.value}
                  </text>
                  <text fill="#A1A1AA" fontSize="2.6" fontWeight="900" letterSpacing=".18em" textAnchor="middle" x="50" y="54.5">
                    STRENGTH
                  </text>
                </motion.svg>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.subject}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mt-5 rounded-mstry border border-mstry-gold/25 bg-mstry-gold/10 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-mstry-gold sm:text-xs sm:tracking-[0.18em]">
                      Active capability
                    </p>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <h3 className="font-display text-2xl font-black leading-tight text-white sm:text-3xl">{active.subject}</h3>
                      <strong className="text-3xl text-mstry-gold">{active.value}</strong>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-mstry-muted">{active.valueText}</p>
                  </div>

                  <div className="mt-4 rounded-mstry border border-white/10 bg-[#0A0A0A]/65 p-5">
                    <strong className="text-white">Executive Insight</strong>
                    <p className="mt-2 text-sm leading-6 text-mstry-muted">{whyItMatters[active.subject]}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/book-consultation">Request a Strategic Review</Button>
                <Button href="/services" variant="ghost">Explore Services</Button>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
