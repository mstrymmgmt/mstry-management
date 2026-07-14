"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { customerBookingTimezone, customerBookingTimezoneLabel } from "@/lib/booking/time";
import { serviceOptions } from "@/lib/booking/types";

const benefits = [
  {
    title: "Strategic Guidance",
    summary: "Receive executive-level guidance designed to align operations, partnerships, growth initiatives, and long-term objectives.",
    strategicValue: "Provides clarity, direction, and decision-making support during periods of growth, transition, or opportunity.",
    clientBenefit: "Helps organizations make informed decisions while reducing risk and improving execution."
  },
  {
    title: "Tailored Management Solutions",
    summary: "Every organization faces unique challenges. We develop customized management frameworks aligned with your goals, stakeholders, and operating environment.",
    strategicValue: "Creates practical solutions that fit your specific needs rather than generic recommendations.",
    clientBenefit: "Improves efficiency, accountability, and long-term organizational performance."
  },
  {
    title: "Partnership Opportunities",
    summary: "Leverage strategic relationships, commercial opportunities, and collaborative networks that support growth and long-term value creation.",
    strategicValue: "Strengthens market positioning through mutually beneficial partnerships.",
    clientBenefit: "Unlocks new opportunities, expands reach, and accelerates growth."
  },
  {
    title: "Growth & Development Support",
    summary: "Support for organizational growth, capability development, expansion planning, and performance improvement initiatives.",
    strategicValue: "Creates a foundation for sustainable and scalable growth.",
    clientBenefit: "Helps organizations strengthen operations while preparing for future opportunities."
  },
  {
    title: "International Network Access",
    summary: "Benefit from global relationships, cross-border opportunities, and international strategic connections.",
    strategicValue: "Expands access to markets, partnerships, and growth opportunities.",
    clientBenefit: "Supports international expansion and broader business development initiatives."
  }
];

type Status = "idle" | "loading" | "success" | "error";
type AvailabilityStatus = "idle" | "loading" | "ready" | "error";
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
  durationMinutes: number;
  emailStatus?: "Pending" | "Sent" | "Failed";
  zoom: {
    joinUrl: string;
    meetingId: string;
    passcode: string;
  };
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const availabilityUnavailableMessage =
  "Availability is currently being updated. Please contact Info@themstry.com or try again shortly.";

export function ConsultationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>("idle");
  const [error, setError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [timezone] = useState(customerBookingTimezone);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const availableSlots = useMemo(() => slots.filter((slot) => slot.available), [slots]);
  const availableDates = useMemo(() => [...new Set(availableSlots.map((slot) => slot.date))], [availableSlots]);
  const timesForSelectedDate = useMemo(
    () => availableSlots.filter((slot) => slot.date === selectedDate),
    [availableSlots, selectedDate]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      setAvailabilityStatus("loading");
      setAvailabilityError("");

      try {
        const response = await fetch(`/api/availability?timezone=${encodeURIComponent(timezone)}&days=30`);
        const data = (await response.json()) as { slots?: AvailabilitySlot[]; error?: string };
        if (!response.ok) throw new Error(data.error || "Availability could not be loaded.");
        if (cancelled) return;
        setSlots(data.slots || []);
        setAvailabilityStatus("ready");
      } catch (availabilityRequestError) {
        if (cancelled) return;
        setAvailabilityStatus("error");
        setAvailabilityError(availabilityUnavailableMessage);
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [timezone]);

  useEffect(() => {
    if (!availableDates.length) {
      setSelectedDate("");
      setSelectedTime("");
      return;
    }

    setSelectedDate((current) => (current && availableDates.includes(current) ? current : availableDates[0]));
  }, [availableDates]);

  useEffect(() => {
    if (!timesForSelectedDate.length) {
      setSelectedTime("");
      return;
    }

    setSelectedTime((current) => (current && timesForSelectedDate.some((slot) => slot.time === current) ? current : timesForSelectedDate[0].time));
  }, [timesForSelectedDate]);

  function dateLabel(date: string) {
    const slot = availableSlots.find((item) => item.date === date);
    if (!slot) return date;
    return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeZone: timezone }).format(new Date(slot.startUtc));
  }

  function timeLabel(slot: AvailabilitySlot) {
    return new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: timezone }).format(new Date(slot.startUtc));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") || ""),
      organization: String(formData.get("organization") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      serviceInterest: String(formData.get("serviceInterest") || ""),
      selectedDate,
      selectedTime,
      timezone,
      submittedPageUrl: window.location.href,
      message: String(formData.get("message") || ""),
      website: String(formData.get("website") || ""),
      startedAt: String(formData.get("startedAt") || startedAt)
    };
    const requiredFields = [
      ["fullName", "Please enter your full name."],
      ["email", "Please enter your email address."],
      ["serviceInterest", "Please select a service interest."],
      ["selectedDate", "Please select a consultation date."],
      ["selectedTime", "Please select a consultation time."],
      ["message", "Please describe your objective or project details."]
    ];

    for (const [field, message] of requiredFields) {
      if (!payload[field as keyof typeof payload].trim()) {
        setStatus("error");
        setError(message);
        form.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
        return;
      }
    }

    if (!emailPattern.test(payload.email.trim())) {
      setStatus("error");
      setError("Please enter a valid email address.");
      form.querySelector<HTMLElement>("[name='email']")?.focus();
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { booking?: BookingConfirmation; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "We could not send your request. Please try again.");
      }

      form.reset();
      setConfirmation(data.booking || null);
      setStatus("success");
      const availabilityResponse = await fetch(`/api/availability?timezone=${encodeURIComponent(timezone)}&days=30`);
      const availabilityData = (await availabilityResponse.json()) as { slots?: AvailabilitySlot[] };
      if (availabilityResponse.ok) {
        setSlots(availabilityData.slots || []);
      } else {
        setSlots((current) => current.map((slot) => (slot.date === selectedDate && slot.time === selectedTime ? { ...slot, available: false } : slot)));
      }
    } catch (requestError) {
      setStatus("error");
      setError(requestError instanceof Error ? requestError.message : "We could not send your request. Please try again.");
    }
  }

  return (
    <form
      className="relative grid min-w-0 gap-5 overflow-hidden rounded-mstry border border-mstry-gold/20 bg-[#111827] p-4 shadow-luxury sm:gap-6 sm:p-8"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(212,175,55,.12),transparent_34%)]" />
      <div className="relative">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-mstry-gold sm:text-xs sm:tracking-[0.22em]">Private consultation request</p>
        <h2 className="mt-3 font-display text-[clamp(1.9rem,9vw,2.5rem)] font-black leading-tight text-white">Let&apos;s Discuss Your Objectives</h2>
        <p className="mt-4 text-sm leading-7 text-mstry-muted">
          Whether you&apos;re seeking management support, strategic partnerships, business development, project leadership, or sports management solutions, our team is ready to explore how we can help.
        </p>
      </div>

      <ConsultationBenefits />

      <input type="hidden" name="startedAt" defaultValue={startedAt} />
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="relative grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-mstry-silver">
          Full Name <span className="sr-only">required</span>
          <input className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-base text-mstry-silver outline-none transition focus:border-mstry-gold" name="fullName" required type="text" autoComplete="name" />
        </label>
        <label className="grid gap-2 text-sm font-black text-mstry-silver">
          Organization / Company
          <input className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-base text-mstry-silver outline-none transition focus:border-mstry-gold" name="organization" type="text" autoComplete="organization" />
        </label>
        <label className="grid gap-2 text-sm font-black text-mstry-silver">
          Email Address <span className="sr-only">required</span>
          <input className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-base text-mstry-silver outline-none transition focus:border-mstry-gold" name="email" required type="email" autoComplete="email" />
        </label>
        <label className="grid gap-2 text-sm font-black text-mstry-silver">
          Phone Number <span className="text-xs text-mstry-muted">(optional)</span>
          <input className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-base text-mstry-silver outline-none transition focus:border-mstry-gold" name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>

      <label className="relative grid gap-2 text-sm font-black text-mstry-silver">
        Service Interest <span className="sr-only">required</span>
        <select className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-base text-mstry-silver outline-none transition focus:border-mstry-gold" name="serviceInterest" required defaultValue="">
          <option value="" disabled>Select a service area</option>
          {serviceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>

      <div className="relative rounded-mstry border border-mstry-gold/15 bg-[#0A0A0A]/55 p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-mstry-gold sm:text-xs sm:tracking-[0.18em]">Schedule consultation</p>
            <p className="mt-1 text-sm leading-6 text-mstry-muted">Times shown in {customerBookingTimezoneLabel}.</p>
          </div>
          {availabilityStatus === "loading" ? (
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-mstry-muted">
              <Loader2 className="animate-spin" size={14} />
              Loading times
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-black text-mstry-silver">
            Selected Date <span className="sr-only">required</span>
            <select
              className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-base text-mstry-silver outline-none transition focus:border-mstry-gold"
              disabled={availabilityStatus !== "ready" || !availableDates.length}
              name="selectedDate"
              onChange={(event) => setSelectedDate(event.target.value)}
              required
              value={selectedDate}
            >
              {availableDates.length ? null : <option value="">No available dates</option>}
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {dateLabel(date)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-black text-mstry-silver">
            Selected Time <span className="sr-only">required</span>
            <select
              className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-base text-mstry-silver outline-none transition focus:border-mstry-gold"
              disabled={availabilityStatus !== "ready" || !timesForSelectedDate.length}
              name="selectedTime"
              onChange={(event) => setSelectedTime(event.target.value)}
              required
              value={selectedTime}
            >
              {timesForSelectedDate.length ? null : <option value="">No available times</option>}
              {timesForSelectedDate.map((slot) => (
                <option key={slot.startUtc} value={slot.time}>
                  {timeLabel(slot)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {availabilityStatus === "error" ? (
          <p className="mt-4 rounded-mstry border border-red-400/30 bg-red-950/30 p-3 text-sm leading-6 text-red-100">
            {availabilityError}
          </p>
        ) : null}
      </div>

      <label className="relative grid gap-2 text-sm font-black text-mstry-silver">
        Message / Project Details <span className="sr-only">required</span>
        <textarea
          className="min-h-40 rounded-mstry border border-white/15 bg-mstry-black px-4 py-3 text-base text-mstry-silver outline-none transition focus:border-mstry-gold"
          name="message"
          required
          placeholder="Briefly describe your objective, timeline, market, organization, and the type of support you are seeking."
        />
      </label>

      <div className="relative rounded-mstry border border-white/10 bg-[#0A0A0A]/60 p-4 text-sm leading-6 text-mstry-muted">
        Prefer direct email? Contact the private desk at{" "}
        <a className="font-black text-mstry-gold" href="mailto:onboarding@themstry.com">
          onboarding@themstry.com
        </a>{" "}
        or general enquiries at{" "}
        <a className="font-black text-mstry-gold" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
      </div>

      <button
        className="relative inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-mstry border border-mstry-gold bg-mstry-gold px-5 text-center font-black text-black transition hover:-translate-y-0.5 hover:bg-[#C19D2C] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        disabled={status === "loading" || availabilityStatus !== "ready" || !selectedDate || !selectedTime}
        type="submit"
      >
        {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : null}
        {status === "loading" ? "Confirming Booking" : "Schedule a Strategic Discussion"}
      </button>

      {status === "success" ? (
        <div className="relative rounded-mstry border border-mstry-gold/25 bg-mstry-gold/10 p-4 text-sm leading-6 text-mstry-muted" aria-live="polite">
          <p className="font-black text-white">Your consultation has been confirmed.</p>
          <p className="mt-2">
            {confirmation?.emailStatus === "Failed"
              ? "Your booking is reserved. Email delivery may be delayed, so please save the booking details below."
              : "A confirmation email has been sent with your booking details."}
          </p>
          {confirmation ? (
            <div className="mt-3 grid gap-2">
              <span>Booking ID: {confirmation.id}</span>
              <span>
                Time: {confirmation.selectedDate} at {confirmation.selectedTime} ({customerBookingTimezoneLabel})
              </span>
              <span>Meeting joining details will be provided approximately 15 minutes before the scheduled meeting time.</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {status === "error" ? (
        <p className="relative rounded-mstry border border-red-400/30 bg-red-950/30 p-4 text-sm leading-6 text-red-100" aria-live="polite">
          {error}
        </p>
      ) : null}
    </form>
  );
}

function ConsultationBenefits() {
  const [hoveredBenefit, setHoveredBenefit] = useState<string | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);
  const activeBenefit = hoveredBenefit || selectedBenefit;

  return (
    <motion.div
      className="relative overflow-hidden rounded-mstry border border-mstry-gold/15 bg-[#0A0A0A]/55 p-4"
      initial={{ opacity: 0, y: 16 }}
      viewport={{ once: true, amount: 0.35 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 backdrop-blur-0"
        animate={{ opacity: activeBenefit ? 1 : 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(212,175,55,.18),transparent_46%)]" />
      </motion.div>

      <div className="relative mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-mstry-gold sm:text-xs sm:tracking-[0.18em]">Consultation capabilities</p>
          <p className="mt-1 text-sm leading-6 text-mstry-muted">Explore the value behind each advisory capability.</p>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-mstry-muted sm:text-xs sm:tracking-[0.14em]">Hover or tap to expand</span>
      </div>

      <div className="relative grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit, index) => {
          const isActive = activeBenefit === benefit.title;
          const isDimmed = Boolean(activeBenefit && !isActive);

          return (
            <motion.button
              aria-expanded={isActive}
              className="group relative overflow-hidden rounded-mstry border border-white/10 bg-[#111827]/80 p-4 text-left outline-none transition focus-visible:border-mstry-gold focus-visible:ring-2 focus-visible:ring-mstry-gold/30"
              key={benefit.title}
              layout
              onBlur={() => setHoveredBenefit(null)}
              onClick={() => setSelectedBenefit((current) => (current === benefit.title ? null : benefit.title))}
              onFocus={() => setHoveredBenefit(benefit.title)}
              onMouseEnter={() => setHoveredBenefit(benefit.title)}
              onMouseLeave={() => setHoveredBenefit(null)}
              style={{ transformOrigin: "center" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              type="button"
              whileHover={{ scale: 1.04 }}
              animate={{
                opacity: isDimmed ? 0.65 : 1,
                boxShadow: isActive ? "0 26px 70px rgba(0,0,0,.45), 0 0 34px rgba(212,175,55,.18)" : "0 12px 34px rgba(0,0,0,.22)",
                borderColor: isActive ? "rgba(212,175,55,.48)" : "rgba(255,255,255,.10)"
              }}
            >
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,.26),transparent_52%)]" />
                <div className="absolute inset-0 rounded-mstry border border-mstry-gold/40" />
              </motion.div>

              <div className="relative">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <CheckCircle2 className={isActive ? "text-[#E6C35C]" : "text-mstry-gold"} size={18} />
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-muted">0{index + 1}</span>
                </div>
                <h3 className="text-base font-black leading-tight text-mstry-silver">{benefit.title}</h3>

                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.div
                      className="mt-4 grid gap-3 text-sm leading-6 text-mstry-muted"
                      initial={{ height: 0, opacity: 0, y: -6 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -6 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <p>{benefit.summary}</p>
                      <div className="rounded-mstry border border-mstry-gold/15 bg-mstry-gold/10 p-3">
                        <strong className="block text-xs uppercase tracking-[0.14em] text-mstry-gold">Strategic Value</strong>
                        <span>{benefit.strategicValue}</span>
                      </div>
                      <div className="rounded-mstry border border-white/10 bg-[#0A0A0A]/50 p-3">
                        <strong className="block text-xs uppercase tracking-[0.14em] text-mstry-silver">Client Benefit</strong>
                        <span>{benefit.clientBenefit}</span>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
