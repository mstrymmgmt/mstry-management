"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";

type AvailabilitySlot = {
  date: string;
  time: string;
  startUtc: string;
  endUtc: string;
  available: boolean;
};

type BookingConfirmation = {
  id: string;
  status: string;
  selectedDate: string;
  selectedTime: string;
  timezone: string;
  startUtc: string;
  endUtc: string;
  durationMinutes: number;
  meetingStatus: "Created" | "Pending" | "Failed";
  emailStatus?: "Pending" | "Sent" | "Failed";
  zoom: {
    joinUrl: string;
    meetingId: string;
    passcode: string;
  };
};

type Status = "idle" | "loading" | "success" | "error";
type AvailabilityStatus = "idle" | "loading" | "ready" | "error";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function calendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function formatIcsDate(value: string) {
  return value.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function calendarDescription(zoomUrl?: string) {
  return [
    "Scheduled call with the MSTRY team to discuss objectives, ideas, opportunities, and next steps.",
    zoomUrl ? `Zoom Link: ${zoomUrl}` : "Meeting format: Zoom / Online Call"
  ].join("\\n");
}

function createIcs(booking: BookingConfirmation) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MSTRY MANAGEMENT//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@themstry.com`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${formatIcsDate(booking.startUtc)}`,
    `DTEND:${formatIcsDate(booking.endUtc)}`,
    "SUMMARY:MSTRY Consultation Call",
    `DESCRIPTION:${calendarDescription(booking.zoom.joinUrl)}`,
    "LOCATION:Zoom / Online Meeting",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

function calendarLinks(booking: BookingConfirmation) {
  const title = encodeURIComponent("MSTRY Consultation Call");
  const details = encodeURIComponent(calendarDescription(booking.zoom.joinUrl));
  const location = encodeURIComponent("Zoom / Online Meeting");
  const googleDates = `${formatIcsDate(booking.startUtc)}/${formatIcsDate(booking.endUtc)}`;

  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${googleDates}&details=${details}&location=${location}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${encodeURIComponent(booking.startUtc)}&enddt=${encodeURIComponent(booking.endUtc)}&body=${details}&location=${location}`
  };
}

export function CallBookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>("idle");
  const [error, setError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [month, setMonth] = useState(() => new Date());
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const startedAt = useMemo(() => Date.now(), []);

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      setAvailabilityStatus("loading");
      setAvailabilityError("");

      try {
        const response = await fetch(`/api/availability?timezone=${encodeURIComponent(timezone)}&days=60`);
        const data = (await response.json()) as { slots?: AvailabilitySlot[]; error?: string };
        if (!response.ok) throw new Error(data.error || "Availability could not be loaded.");
        if (cancelled) return;
        setSlots(data.slots || []);
        setAvailabilityStatus("ready");
      } catch (requestError) {
        if (cancelled) return;
        setAvailabilityStatus("error");
        setAvailabilityError(requestError instanceof Error ? requestError.message : "Availability could not be loaded.");
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [timezone]);

  const slotsByDate = useMemo(() => {
    const grouped = new Map<string, AvailabilitySlot[]>();
    for (const slot of slots) {
      grouped.set(slot.date, [...(grouped.get(slot.date) || []), slot]);
    }
    return grouped;
  }, [slots]);

  const selectedSlots = useMemo(
    () => (slotsByDate.get(selectedDate) || []).filter((slot) => slot.available),
    [selectedDate, slotsByDate]
  );
  const selectedSlot = selectedSlots.find((slot) => slot.time === selectedTime);
  const days = useMemo(() => calendarDays(month), [month]);
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(month);

  function moveMonth(direction: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  }

  function moveYear(direction: number) {
    setMonth((current) => new Date(current.getFullYear() + direction, current.getMonth(), 1));
  }

  function selectDate(day: Date) {
    const key = dateKey(day);
    const available = (slotsByDate.get(key) || []).some((slot) => slot.available);
    if (!available) return;
    setSelectedDate(key);
    setSelectedTime("");
  }

  function formatTime(slot: AvailabilitySlot) {
    return new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: timezone }).format(new Date(slot.startUtc));
  }

  function formatSelectedTime() {
    if (!selectedSlot) return "";
    return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short", timeZone: timezone }).format(new Date(selectedSlot.startUtc));
  }

  function formatConfirmationTime(booking: BookingConfirmation) {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short", timeZone: booking.timezone }).format(new Date(booking.startUtc));
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
      serviceInterest: "Consultation Call",
      selectedDate,
      selectedTime,
      timezone,
      website: String(formData.get("website") || ""),
      startedAt: String(formData.get("startedAt") || startedAt)
    };

    if (!payload.fullName.trim()) {
      setStatus("error");
      setError("Please enter your full name.");
      return;
    }

    if (!emailPattern.test(payload.email.trim())) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    if (!selectedDate || !selectedTime || !selectedSlot) {
      setStatus("error");
      setError("Please select an available date and time.");
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { booking?: BookingConfirmation; error?: string };
      if (!response.ok || !data.booking) throw new Error(data.error || "We could not confirm your booking.");

      setConfirmation(data.booking);
      setSlots((current) => current.map((slot) => (slot.startUtc === data.booking?.startUtc ? { ...slot, available: false } : slot)));
      setStatus("success");
    } catch (requestError) {
      setStatus("error");
      setError(requestError instanceof Error ? requestError.message : "We could not confirm your booking.");
    }
  }

  function downloadIcs() {
    if (!confirmation) return;
    const blob = new Blob([createIcs(confirmation)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mstry-consultation-call.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  const links = confirmation ? calendarLinks(confirmation) : null;

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(212,175,55,.12),transparent_34%)]" />
      <div className="relative mx-auto grid w-[min(1320px,calc(100%_-_40px))] gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div
          className="rounded-mstry border border-mstry-gold/20 bg-[#111827]/82 p-5 shadow-luxury sm:p-7"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-mstry-gold">Calendar</p>
              <h2 className="mt-2 font-display text-3xl font-black text-white">{monthLabel}</h2>
              <p className="mt-2 text-sm leading-6 text-mstry-muted">Times shown in your local timezone: {timezone}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-mstry border border-white/10 bg-[#0A0A0A] px-3 py-3 text-xs font-black text-white transition hover:border-mstry-gold" onClick={() => moveYear(-1)} type="button" aria-label="Previous year">
                YY-
              </button>
              <button className="rounded-mstry border border-white/10 bg-[#0A0A0A] p-3 text-white transition hover:border-mstry-gold" onClick={() => moveMonth(-1)} type="button" aria-label="Previous month">
                <ChevronLeft size={18} />
              </button>
              <button className="rounded-mstry border border-white/10 bg-[#0A0A0A] p-3 text-white transition hover:border-mstry-gold" onClick={() => moveMonth(1)} type="button" aria-label="Next month">
                <ChevronRight size={18} />
              </button>
              <button className="rounded-mstry border border-white/10 bg-[#0A0A0A] px-3 py-3 text-xs font-black text-white transition hover:border-mstry-gold" onClick={() => moveYear(1)} type="button" aria-label="Next year">
                YY+
              </button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-7 gap-2 text-center text-xs font-black uppercase tracking-[0.12em] text-mstry-muted">
            {weekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <motion.div className="mt-3 grid grid-cols-7 gap-2" key={`${month.getFullYear()}-${month.getMonth()}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28 }}>
            {days.map((day) => {
              const key = dateKey(day);
              const daySlots = slotsByDate.get(key) || [];
              const hasAvailable = daySlots.some((slot) => slot.available);
              const isBooked = daySlots.length > 0 && !hasAvailable;
              const isCurrentMonth = day.getMonth() === month.getMonth();
              const isSelected = selectedDate === key;

              return (
                <motion.button
                  className={[
                    "min-h-14 rounded-mstry border p-2 text-sm font-black transition sm:min-h-16",
                    isSelected ? "border-mstry-gold bg-mstry-gold text-black" : "",
                    !isSelected && hasAvailable ? "border-white/10 bg-[#0A0A0A] text-white hover:border-mstry-gold hover:bg-mstry-gold/10" : "",
                    !hasAvailable ? "cursor-not-allowed border-white/5 bg-white/[.03] text-mstry-muted opacity-55" : "",
                    !isCurrentMonth ? "opacity-30" : ""
                  ].join(" ")}
                  disabled={!hasAvailable}
                  key={key}
                  onClick={() => selectDate(day)}
                  type="button"
                  whileHover={hasAvailable ? { scale: 1.04 } : undefined}
                  whileTap={hasAvailable ? { scale: 0.98 } : undefined}
                >
                  <span>{day.getDate()}</span>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.08em]">
                    {hasAvailable ? "Open" : isBooked ? "Booked" : "Closed"}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {availabilityStatus === "loading" ? (
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-mstry-muted"><Loader2 className="animate-spin" size={16} /> Loading live availability</p>
          ) : null}
          {availabilityStatus === "error" ? <p className="mt-5 rounded-mstry border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">{availabilityError}</p> : null}
        </motion.div>

        <motion.form
          className="rounded-mstry border border-mstry-gold/20 bg-[#111827] p-5 shadow-luxury sm:p-7"
          onSubmit={submitBooking}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          noValidate
        >
          <input type="hidden" name="startedAt" defaultValue={startedAt} />
          <label className="hidden" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>

          <p className="text-xs font-black uppercase tracking-[0.2em] text-mstry-gold">Available times</p>
          <h2 className="mt-2 font-display text-3xl font-black text-white">Select a call time.</h2>
          <p className="mt-2 text-sm leading-6 text-mstry-muted">Meeting format: Zoom / Online Call. Duration: 30 minutes.</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {selectedDate ? (
              selectedSlots.length ? (
                selectedSlots.map((slot) => (
                  <motion.button
                    className={`min-h-12 rounded-mstry border px-3 text-sm font-black transition ${selectedTime === slot.time ? "border-mstry-gold bg-mstry-gold text-black" : "border-white/10 bg-[#0A0A0A] text-white hover:border-mstry-gold"}`}
                    key={slot.startUtc}
                    onClick={() => setSelectedTime(slot.time)}
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {formatTime(slot)}
                  </motion.button>
                ))
              ) : (
                <p className="col-span-full rounded-mstry border border-white/10 bg-[#0A0A0A] p-4 text-sm text-mstry-muted">No open times are available for this date.</p>
              )
            ) : (
              <p className="col-span-full rounded-mstry border border-white/10 bg-[#0A0A0A] p-4 text-sm text-mstry-muted">Select an available date first.</p>
            )}
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-black text-mstry-silver">
              Full name
              <input className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-mstry-silver outline-none transition focus:border-mstry-gold" name="fullName" type="text" autoComplete="name" required />
            </label>
            <label className="grid gap-2 text-sm font-black text-mstry-silver">
              Email address
              <input className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-mstry-silver outline-none transition focus:border-mstry-gold" name="email" type="email" autoComplete="email" required />
            </label>
            <label className="grid gap-2 text-sm font-black text-mstry-silver">
              Phone number <span className="text-xs text-mstry-muted">(optional)</span>
              <input className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-mstry-silver outline-none transition focus:border-mstry-gold" name="phone" type="tel" autoComplete="tel" />
            </label>
            <label className="grid gap-2 text-sm font-black text-mstry-silver">
              Short note <span className="text-xs text-mstry-muted">(optional)</span>
              <textarea className="min-h-24 rounded-mstry border border-white/15 bg-mstry-black px-4 py-3 text-mstry-silver outline-none transition focus:border-mstry-gold" name="message" placeholder="Optional context for the call." />
            </label>
          </div>

          <div className="mt-5 rounded-mstry border border-white/10 bg-[#0A0A0A]/60 p-4 text-sm leading-6 text-mstry-muted">
            {selectedSlot ? `Selected time: ${formatSelectedTime()}` : "Choose a date and time to continue."}
          </div>

          <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-mstry border border-mstry-gold bg-mstry-gold px-5 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#C19D2C] disabled:cursor-not-allowed disabled:opacity-70" disabled={status === "loading" || !selectedSlot} type="submit">
            {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : null}
            {status === "loading" ? "Confirming Call" : "Confirm Call"}
          </button>

          {status === "error" ? <p className="mt-4 rounded-mstry border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">{error}</p> : null}

          {confirmation && links ? (
            <motion.div className="mt-5 rounded-mstry border border-mstry-gold/25 bg-mstry-gold/10 p-5 text-sm leading-6 text-mstry-muted" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="font-display text-2xl font-black text-white">Your call is booked.</h3>
              <p className="mt-2">Your selected time: {formatConfirmationTime(confirmation)}</p>
              <p className="mt-1">You can now add this meeting to your calendar.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a className="rounded-mstry border border-mstry-gold bg-mstry-gold px-4 py-3 text-center font-black text-black" href={links.google} rel="noreferrer" target="_blank">Add to Google Calendar</a>
                <a className="rounded-mstry border border-white/15 px-4 py-3 text-center font-black text-white transition hover:border-mstry-gold" href={links.outlook} rel="noreferrer" target="_blank">Add to Outlook Calendar</a>
                <button className="inline-flex items-center justify-center gap-2 rounded-mstry border border-white/15 px-4 py-3 font-black text-white transition hover:border-mstry-gold sm:col-span-2" onClick={downloadIcs} type="button">
                  <Download size={16} />
                  Download Calendar Invite
                </button>
              </div>
              {confirmation.zoom.joinUrl ? <a className="mt-4 block font-black text-mstry-gold" href={confirmation.zoom.joinUrl}>Open Zoom Meeting</a> : <p className="mt-4">Meeting link will be provided by the MSTRY team.</p>}
            </motion.div>
          ) : null}
        </motion.form>
      </div>
    </section>
  );
}
