import { operations } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function Operations() {
  return (
    <section className="border-y border-white/10 bg-gradient-to-r from-mstry-gold/10 via-white/[.02] to-white/[.04] py-24">
      <div className="mx-auto w-[min(1160px,calc(100%_-_40px))]">
        <SectionHeading
          eyebrow="Operational infrastructure"
          title="Outsource the stressful side while keeping full ownership and control."
          body="Clients remain in control of strategy and ownership. MSTRY manages the execution layer: tasks, deadlines, renewals, documents, people, workflows, and follow-ups."
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {operations.map((item) => (
            <div className="rounded-mstry border border-white/10 bg-mstry-black/50 p-5 text-mstry-silver" key={item}>
              {item}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/contact">Let MSTRY Handle Operations</Button>
          <Button href="/services" variant="ghost">View Services</Button>
        </div>
      </div>
    </section>
  );
}
