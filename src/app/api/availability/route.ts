import { NextRequest, NextResponse } from "next/server";
import { bookingWindowDays, generateAvailabilitySlots } from "@/lib/booking/availability";
import { getAvailabilityRules, getBookedSlotStarts, storageConfigured } from "@/lib/booking/storage";
import { isValidTimezone } from "@/lib/booking/validation";

export const runtime = "nodejs";

const availabilityUnavailableMessage =
  "Availability is currently being updated. Please contact Info@themstry.com or try again shortly.";

export async function GET(request: NextRequest) {
  try {
    const timezone = request.nextUrl.searchParams.get("timezone") || "UTC";
    if (!isValidTimezone(timezone)) {
      return NextResponse.json({ error: "Please select a valid timezone." }, { status: 400 });
    }
    const requestedDays = Number(request.nextUrl.searchParams.get("days") || bookingWindowDays);
    const days = Math.min(Number.isFinite(requestedDays) && requestedDays > 0 ? requestedDays : bookingWindowDays, bookingWindowDays);
    const hasStorage = storageConfigured();
    const rules = hasStorage ? await getAvailabilityRules() : {};
    const slots = generateAvailabilitySlots(timezone, days, rules);
    const bookedStarts = hasStorage ? await getBookedSlotStarts(slots.map((slot) => slot.startUtc)) : new Set<string>();
    const availableSlots = slots.map((slot) => ({
      ...slot,
      available: !bookedStarts.has(slot.startUtc)
    }));

    return NextResponse.json({
      timezone,
      message: "Times shown in your local timezone",
      slots: availableSlots
    });
  } catch (error) {
    console.error("Availability request failed", error);
    return NextResponse.json({ error: availabilityUnavailableMessage }, { status: 500 });
  }
}
