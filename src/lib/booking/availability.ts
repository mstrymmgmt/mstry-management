import { addMinutes, utcToZonedParts, zonedTimeToUtc } from "./time";
import type { AvailabilitySlot } from "./types";

function numberFromEnv(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function buildWeekdaySlots(startHour = 9, endHour = 17, intervalMinutes = 30) {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }
  return slots;
}

export const bookingDurationMinutes = numberFromEnv(process.env.BOOKING_DURATION_MINUTES, 30);
export const bookingWindowDays = numberFromEnv(process.env.BOOKING_WINDOW_DAYS, 30);
export const bookingMinimumNoticeHours = numberFromEnv(process.env.BOOKING_MIN_NOTICE_HOURS, 24);
export const businessTimezone = process.env.BOOKING_BUSINESS_TIMEZONE || "Europe/London";

const defaultRecurringAvailability: Record<number, string[]> = {
  1: buildWeekdaySlots(),
  2: buildWeekdaySlots(),
  3: buildWeekdaySlots(),
  4: buildWeekdaySlots(),
  5: buildWeekdaySlots()
};

export type AvailabilityRules = {
  recurringAvailability?: Record<string, string[]>;
  unavailableDates?: string[];
  unavailableSlots?: string[];
  holidays?: string[];
};

function ruleSlotsForWeekday(weekday: number, rules?: AvailabilityRules) {
  const custom = rules?.recurringAvailability?.[String(weekday)];
  return custom || defaultRecurringAvailability[weekday] || [];
}

function dateFromBusinessDayOffset(offset: number) {
  const now = new Date();
  const businessNow = utcToZonedParts(now, businessTimezone);
  const base = zonedTimeToUtc(businessNow.date, "00:00", businessTimezone);
  return addMinutes(base, offset * 24 * 60);
}

export function isSlotAllowed(slot: AvailabilitySlot, rules?: AvailabilityRules) {
  const operatingDate = slot.businessDate || slot.date;
  if (rules?.unavailableDates?.includes(operatingDate)) return false;
  if (rules?.holidays?.includes(operatingDate)) return false;
  if (rules?.unavailableSlots?.includes(slot.startUtc)) return false;
  return true;
}

export function generateAvailabilitySlots(timezone: string, days = bookingWindowDays, rules?: AvailabilityRules) {
  const now = new Date();
  const minimumStart = addMinutes(now, bookingMinimumNoticeHours * 60);
  const slots: AvailabilitySlot[] = [];

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const businessDay = dateFromBusinessDayOffset(dayOffset);
    const businessParts = utcToZonedParts(businessDay, businessTimezone);
    const weekday = new Date(`${businessParts.date}T00:00:00.000Z`).getUTCDay();
    const times = ruleSlotsForWeekday(weekday, rules);

    for (const businessTime of times) {
      const start = zonedTimeToUtc(businessParts.date, businessTime, businessTimezone);
      if (start < minimumStart) continue;
      const end = addMinutes(start, bookingDurationMinutes);
      const local = utcToZonedParts(start, timezone);
      const slot: AvailabilitySlot = {
        date: local.date,
        time: local.time,
        businessDate: businessParts.date,
        businessTime,
        startUtc: start.toISOString(),
        endUtc: end.toISOString(),
        available: true
      };
      if (isSlotAllowed(slot, rules)) slots.push(slot);
    }
  }

  return slots;
}
