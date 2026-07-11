import Link from "next/link";

const previews = [
  {
    href: "/preview/booking-confirmation-client",
    title: "Client booking confirmation",
    description: "Preview the confirmation email sent to the person booking the call."
  },
  {
    href: "/preview/booking-confirmation-internal",
    title: "Internal booking notification",
    description: "Preview the Themstry team notification with calendar-ready details."
  }
];

export default function PreviewIndexPage() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(212,175,55,.14),transparent_34%)]" />
      <div className="relative mx-auto w-[min(1040px,calc(100%_-_40px))]">
        <p className="text-xs font-black uppercase tracking-[.22em] text-[#D4AF37]">Preview only</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-black leading-none tracking-tight text-white md:text-7xl">
          Booking email previews
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          These pages render sample MSTRY booking emails for visual approval. No email is sent, no API key is required, and booking behavior is unchanged.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {previews.map((preview) => (
            <Link
              key={preview.href}
              href={preview.href}
              className="rounded-lg border border-white/10 bg-[#111827]/80 p-6 text-white transition hover:-translate-y-1 hover:border-[#D4AF37]/60"
            >
              <h2 className="text-2xl font-black">{preview.title}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{preview.description}</p>
              <span className="mt-6 inline-flex rounded-lg border border-[#D4AF37] bg-[#D4AF37] px-4 py-3 text-sm font-black text-black">
                Open preview
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
