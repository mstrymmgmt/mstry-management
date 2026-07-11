import Link from "next/link";
import { renderInternalBookingEmail } from "@/lib/booking/email-previews";

export default function InternalBookingEmailPreviewPage() {
  const email = renderInternalBookingEmail();

  return (
    <section className="relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(212,175,55,.12),transparent_34%)]" />
      <div className="relative mx-auto w-[min(980px,calc(100%_-_32px))]">
        <div className="mb-6 rounded-lg border border-[#D4AF37]/30 bg-[#111827]/90 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#D4AF37]">Preview only — no email was sent.</p>
          <h1 className="mt-3 text-3xl font-black">Internal booking notification email</h1>
          <p className="mt-3 text-zinc-400">Subject: {email.subject}</p>
          <p className="mt-2 break-all text-sm text-zinc-500">Google Calendar link preview: {email.googleCalendarLink}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="rounded-lg border border-white/15 px-4 py-2 text-sm font-black text-white" href="/preview">
              All previews
            </Link>
            <Link className="rounded-lg border border-[#D4AF37] bg-[#D4AF37] px-4 py-2 text-sm font-black text-black" href="/preview/booking-confirmation-client">
              Client preview
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/40">
          <div dangerouslySetInnerHTML={{ __html: email.html }} />
        </div>
      </div>
    </section>
  );
}
