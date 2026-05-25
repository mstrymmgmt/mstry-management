import { SectionHeading } from "@/components/ui/section-heading";

export function GlobalMap() {
  return (
    <section className="py-24">
      <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] items-center gap-8 lg:grid-cols-2">
        <div className="relative min-h-[520px] overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_75%_62%,rgba(214,173,85,.22),transparent_30%),radial-gradient(circle_at_28%_34%,rgba(216,216,216,.09),transparent_28%),#070707] shadow-luxury">
          <div className="absolute inset-11 bg-[linear-gradient(rgba(255,255,255,.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.10)_1px,transparent_1px)] bg-[length:86px_86px] opacity-30" />
          <div className="absolute left-[8%] top-[18%] w-64 border border-white/15 bg-white/[.035] p-5 backdrop-blur">
            <strong className="block font-display text-2xl text-mstry-silver">Europe</strong>
            <p className="mt-2 text-sm text-mstry-muted">Expansion planning, company setup, accounting coordination, and multi-country administration.</p>
          </div>
          <div className="absolute bottom-[15%] right-[8%] w-64 border border-white/15 bg-white/[.035] p-5 backdrop-blur">
            <strong className="block font-display text-2xl text-mstry-silver">UAE</strong>
            <p className="mt-2 text-sm text-mstry-muted">Free Zone, Mainland, Offshore, banking preparation, licensing, PRO support, and compliance coordination.</p>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="Global expansion"
            title="One private command center for UAE and European operations."
            body="MSTRY acts like the operating office behind your international business, coordinating formation, licensing, banking readiness, compliance calendars, renewals, relocation, staffing support, and investor-facing administration."
          />
        </div>
      </div>
    </section>
  );
}
