import { serviceOptions, type BookingPayload, type ServiceInterest } from "./types";

export function clean(value: unknown, maxLength = 2000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidService(value: string): value is ServiceInterest {
  return serviceOptions.includes(value as ServiceInterest);
}

export function isValidTimezone(value: string) {
  try {
    Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export function sanitizePayload(payload: BookingPayload) {
  return {
    fullName: clean(payload.fullName, 160),
    organization: clean(payload.organization, 180),
    email: clean(payload.email, 220).toLowerCase(),
    phone: clean(payload.phone, 80),
    serviceInterest: clean(payload.serviceInterest, 120),
    message: clean(payload.message, 2500),
    selectedDate: clean(payload.selectedDate, 20),
    selectedTime: clean(payload.selectedTime, 10),
    timezone: clean(payload.timezone, 80) || "UTC",
    submittedPageUrl: clean(payload.submittedPageUrl, 500),
    website: clean(payload.website, 100),
    startedAt: Number(payload.startedAt || 0)
  };
}

export function validateBooking(payload: ReturnType<typeof sanitizePayload>) {
  if (!payload.fullName || !payload.email || !payload.serviceInterest || !payload.selectedDate || !payload.selectedTime) {
    return "Please complete all required fields and select a consultation time.";
  }

  if (!isValidEmail(payload.email)) {
    return "Please enter a valid email address.";
  }

  if (!isValidService(payload.serviceInterest)) {
    return "Please select a valid service interest.";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.selectedDate) || !/^\d{2}:\d{2}$/.test(payload.selectedTime)) {
    return "Please select a valid consultation date and time.";
  }

  if (!isValidTimezone(payload.timezone)) {
    return "Please select a valid timezone.";
  }

  if (payload.startedAt && Date.now() - payload.startedAt < 2500) {
    return "Please review the form before submitting.";
  }

  return "";
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
