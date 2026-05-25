import { setupStructures } from "@/config/site";
import { SectionHeading } from "@/components/ui/section-heading";

export function ServiceGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto w-[min(1160px,calc(100%_-_40px))]">
        <SectionHeading
          eyebrow="UAE business structures"
          title="Designed around ownership, banking, visas, tax, and operational freedom."
          body="Every structure has a different purpose. MSTRY helps clients choose the setup that fits revenue model, hiring plan, banking profile, licensing risk, substance requirements, and international expansion strategy."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {setupStructures.map((service) => (
            <article className="min-h-52 rounded-mstry border border-white/10 bg-white/[.035] p-6 transition hover:-translate-y-1 hover:border-mstry-gold/50" key={service.title}>
              <h3 className="font-display text-xl text-mstry-silver">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-mstry-muted">{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
