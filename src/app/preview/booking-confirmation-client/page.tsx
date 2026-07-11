import Link from "next/link";
import { getSampleBooking, renderClientBookingEmail } from "@/lib/booking/email-previews";

export default function ClientBookingEmailPreviewPage() {
  const email = renderClientBookingEmail();
  const booking = getSampleBooking();

  return (
    <section className="relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(212,175,55,.12),transparent_34%)]" />
      <div className="relative mx-auto w-[min(980px,calc(100%_-_32px))]">
        <div className="mb-6 rounded-lg border border-[#D4AF37]/30 bg-[#111827]/90 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#D4AF37]">Preview only — no email was sent.</p>
          <h1 className="mt-3 text-3xl font-black">Client booking confirmation email</h1>
          <p className="mt-3 text-zinc-400">Subject: {email.subject}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="rounded-lg border border-white/15 px-4 py-2 text-sm font-black text-white" href="/preview">
              All previews
            </Link>
            <Link className="rounded-lg border border-[#D4AF37] bg-[#D4AF37] px-4 py-2 text-sm font-black text-black" href="/preview/booking-confirmation-internal">
              Internal preview
            </Link>
          </div>
        </div>
        <div className="mb-6 rounded-lg border border-white/10 bg-[#0A0A0A] p-5 text-sm text-zinc-300">
          <h2 className="text-lg font-black text-white">Sample booking data used in this preview</h2>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">
            <div><dt className="font-black text-[#D4AF37]">Client</dt><dd>{booking.fullName}</dd></div>
            <div><dt className="font-black text-[#D4AF37]">Email</dt><dd>{booking.email}</dd></div>
            <div><dt className="font-black text-[#D4AF37]">Phone</dt><dd>{booking.phone}</dd></div>
            <div><dt className="font-black text-[#D4AF37]">Organization</dt><dd>{booking.organization}</dd></div>
            <div><dt className="font-black text-[#D4AF37]">Service Interest</dt><dd>{booking.serviceInterest}</dd></div>
            <div><dt className="font-black text-[#D4AF37]">Booking ID / Status</dt><dd>{booking.id} / {booking.status}</dd></div>
            <div><dt className="font-black text-[#D4AF37]">Timestamp</dt><dd>{booking.createdAt}</dd></div>
            <div><dt className="font-black text-[#D4AF37]">Meeting Details</dt><dd>{booking.zoom.joinUrl} / {booking.zoom.meetingId} / {booking.zoom.passcode}</dd></div>
            <div className="md:col-span-2"><dt className="font-black text-[#D4AF37]">Notes</dt><dd>{booking.message}</dd></div>
          </dl>
        </div>
        <div className="overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/40">
          <div dangerouslySetInnerHTML={{ __html: email.html }} />
        </div>
      </div>
    </section>
  );
}
