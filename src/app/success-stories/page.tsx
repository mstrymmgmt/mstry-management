import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Client Success Stories"
};

const stories = [
  ["International market entry", "Created a structured route into a priority market through jurisdiction review, partner mapping, operating priorities, and leadership reporting."],
  ["Strategic partnership program", "Built a relationship pipeline with commercial logic, outreach sequencing, stakeholder positioning, and follow-up cadence."],
  ["Private investment readiness", "Prepared an opportunity narrative, structure options, diligence priorities, and decision materials for a private mandate."],
  ["Sports talent pathway", "Organized a development and positioning framework around talent progression, club conversations, brand readiness, and performance context."],
  ["Operational scale-up", "Introduced reporting cadence, vendor control, workflow ownership, and executive visibility across a growing operating model."],
  ["Project delivery office", "Turned a complex initiative into milestones, responsibilities, risk visibility, stakeholder updates, and measurable execution."]
];

export default function StoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Client success stories"
        title="Examples of the outcomes MSTRY is built to support."
        body="These representative scenarios show how strategy, operations, partnerships, investment readiness, sports management, and execution discipline can create clarity and momentum."
      />
      <section className="py-24">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stories.map(([story, body], index) => (
            <article className="min-h-72 rounded-mstry border border-white/10 bg-[#111827]/60 p-7 transition hover:border-mstry-gold/35" key={story}>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-mstry-gold">Scenario 0{index + 1}</span>
              <h2 className="mt-4 font-display text-2xl font-black text-white">{story}</h2>
              <p className="mt-4 text-sm leading-7 text-mstry-muted">{body}</p>
              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="font-black text-mstry-gold">Structured outcome</span>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-muted">Private mandate</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
