import { addMinutes, utcToZonedParts, zonedTimeToUtc } from "./time";
import type { AvailabilitySlot } from "./types";

export const bookingDurationMinutes = 30;
export const businessTimezone = process.env.BOOKING_BUSINESS_TIMEZONE || "Asia/Dubai";

const defaultRecurringAvailability: Record<number, string[]> = {
  1: ["10:00", "11:00", "14:00", "15:00"],
  2: ["10:00", "11:00", "14:00", "15:00"],
  3: ["10:00", "11:00", "14:00", "15:00"],
  4: ["10:00", "11:00", "14:00", "15:00"],
  5: ["10:00", "11:00", "14:00"]
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

export function generateAvailabilitySlots(timezone: string, days = 21, rules?: AvailabilityRules) {
  const now = new Date();
  const slots: AvailabilitySlot[] = [];

  for (let dayOffset = 1; dayOffset <= days; dayOffset += 1) {
    const businessDay = dateFromBusinessDayOffset(dayOffset);
    const businessParts = utcToZonedParts(businessDay, businessTimezone);
    const weekday = new Date(`${businessParts.date}T00:00:00.000Z`).getUTCDay();
    const times = ruleSlotsForWeekday(weekday, rules);

    for (const businessTime of times) {
      const start = zonedTimeToUtc(businessParts.date, businessTime, businessTimezone);
      if (start <= now) continue;
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
