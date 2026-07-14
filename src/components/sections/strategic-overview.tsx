"use client";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const pillars = [
  ["Assess", "Clarify the objective, pressure points, commercial opportunity, stakeholders, and required level of support."],
  ["Design", "Create the management structure, service pathway, partner logic, cadence, and decision framework."],
  ["Execute", "Coordinate the work across people, partners, vendors, documentation, reporting, and delivery milestones."],
  ["Optimize", "Improve the operating rhythm, strengthen relationships, track outcomes, and adjust the path as the mandate evolves."]
];

export function StrategicOverview() {
  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="mx-auto grid w-[min(1320px,calc(100%_-_24px))] items-center gap-8 sm:w-[min(1320px,calc(100%_-_40px))] sm:gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Who we help"
            title="A management partner for leaders who need outcomes, not noise."
            body="MSTRY works with entrepreneurs, investors, startups, agencies, consultants, holding companies, sports organizations, talent, and international operators who need strategic clarity and execution support around important growth mandates."
          />
          <div className="rounded-mstry border border-mstry-gold/15 bg-[#111827]/70 p-5">
            <p className="text-sm leading-7 text-mstry-muted">
              Clients bring the objective. MSTRY builds the structure around it: the priorities, operating rhythm, reporting, partnerships, project control, and delivery discipline required to move from intention to progress.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-mstry border border-mstry-gold/15 bg-[#111827] p-5 shadow-luxury sm:p-7">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-mstry-gold sm:text-xs sm:tracking-[0.22em]">Management framework</p>
                <h3 className="mt-3 font-display text-[clamp(1.9rem,8vw,2.5rem)] font-black leading-tight text-white">How an objective becomes a controlled mandate.</h3>
              </div>
              <span className="rounded-full border border-mstry-gold/25 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-mstry-gold sm:px-4 sm:text-xs sm:tracking-[0.16em]">
                Client-facing model
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {pillars.map(([title, body], index) => (
                <div className="rounded-mstry border border-white/10 bg-[#0A0A0A]/70 p-5" key={title}>
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-mstry-gold sm:text-xs sm:tracking-[0.18em]">0{index + 1}</span>
                  <h4 className="mt-3 font-display text-xl font-black text-white sm:text-2xl">{title}</h4>
                  <p className="mt-3 text-sm leading-6 text-mstry-muted">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-mstry border border-mstry-gold/25 bg-mstry-gold/10 p-5">
              <strong className="text-white">Why clients engage MSTRY</strong>
              <p className="mt-2 text-sm leading-6 text-mstry-muted">
                To reduce operational pressure, improve decision quality, unlock strategic relationships, and keep important work moving with a discreet partner built for follow-through.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
