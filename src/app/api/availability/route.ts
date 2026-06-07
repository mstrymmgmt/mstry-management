import { NextRequest, NextResponse } from "next/server";
import { generateAvailabilitySlots } from "@/lib/booking/availability";
import { getAvailabilityRules, getBookedSlotStarts, storageConfigured } from "@/lib/booking/storage";
import { isValidTimezone } from "@/lib/booking/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    if (!storageConfigured()) {
      return NextResponse.json({ error: "Booking database is not configured." }, { status: 500 });
    }

    const timezone = request.nextUrl.searchParams.get("timezone") || "UTC";
    if (!isValidTimezone(timezone)) {
      return NextResponse.json({ error: "Please select a valid timezone." }, { status: 400 });
    }
    const requestedDays = Number(request.nextUrl.searchParams.get("days") || 21);
    const days = Math.min(Number.isFinite(requestedDays) && requestedDays > 0 ? requestedDays : 21, 60);
    const rules = await getAvailabilityRules();
    const slots = generateAvailabilitySlots(timezone, days, rules);
    const bookedStarts = await getBookedSlotStarts(slots.map((slot) => slot.startUtc));
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Availability could not be loaded." },
      { status: 500 }
    );
  }
}
