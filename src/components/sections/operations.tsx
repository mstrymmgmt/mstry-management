import { operations } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function Operations() {
  return (
    <section className="border-y border-white/10 bg-[#111827]/50 py-24">
      <div className="mx-auto w-[min(1160px,calc(100%_-_40px))]">
        <SectionHeading
          eyebrow="Strategic advantages"
          title="The operating layer behind better decisions and cleaner execution."
          body="MSTRY gives clients a single point of coordination around the work that usually becomes fragmented: reporting, partnerships, vendors, documents, stakeholders, workflows, and execution follow-up."
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {operations.map((item, index) => (
            <div className="rounded-mstry border border-white/10 bg-mstry-black/50 p-5 text-mstry-silver transition hover:border-mstry-gold/35 hover:bg-[#111827]/70" key={item}>
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-mstry-gold">
                Capability {String(index + 1).padStart(2, "0")}
              </span>
              {item}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/contact">Speak With Our Team</Button>
          <Button href="/services" variant="ghost">Review the Service Frameworks</Button>
        </div>
      </div>
    </section>
  );
}
