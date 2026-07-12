import { NextRequest, NextResponse } from "next/server";
import { bookingDurationMinutes, bookingWindowDays, generateAvailabilitySlots } from "@/lib/booking/availability";
import { emailConfigured, sendBookingEmails } from "@/lib/booking/email";
import { clientIp, rateLimited } from "@/lib/booking/rate-limit";
import {
  getAvailabilityRules,
  getBookedSlotStarts,
  getDuplicateBooking,
  releaseSlot,
  reserveSlot,
  storageConfigured,
  storeBooking
} from "@/lib/booking/storage";
import { addMinutes, customerBookingTimezone } from "@/lib/booking/time";
import type { BookingPayload, BookingRecord, ServiceInterest } from "@/lib/booking/types";
import { clean, sanitizePayload, validateBooking } from "@/lib/booking/validation";
import { createZoomMeeting, deleteZoomMeeting, zoomConfigured } from "@/lib/booking/zoom";

export const runtime = "nodejs";

const bookingUnavailableMessage =
  "Availability is currently being updated. Please contact Info@themstry.com or try again shortly.";

function submittedPageUrl(request: NextRequest, payloadUrl: string) {
  return payloadUrl || clean(request.headers.get("referer"), 500) || clean(request.headers.get("origin"), 500);
}

export async function POST(request: NextRequest) {
  let reservedStartUtc = "";
  let bookingStored = false;
  let createdZoomMeetingId = "";

  try {
    if (!storageConfigured()) {
      return NextResponse.json({ error: bookingUnavailableMessage }, { status: 500 });
    }
    if (!emailConfigured()) {
      return NextResponse.json({ error: bookingUnavailableMessage }, { status: 500 });
    }

    const payload = {
      ...sanitizePayload((await request.json()) as BookingPayload),
      timezone: customerBookingTimezone
    };
    const ip = clientIp(request);

    if (payload.website) {
      return NextResponse.json({ ok: true });
    }

    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many booking attempts. Please try again later." }, { status: 429 });
    }

    const validationError = validateBooking(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const rules = await getAvailabilityRules();
    const slots = generateAvailabilitySlots(payload.timezone, bookingWindowDays, rules);
    const matchingSlot = slots.find((slot) => slot.date === payload.selectedDate && slot.time === payload.selectedTime);

    if (!matchingSlot) {
      return NextResponse.json({ error: "The selected time is no longer available. Please choose another time." }, { status: 409 });
    }

    const bookedStarts = await getBookedSlotStarts([matchingSlot.startUtc]);
    if (bookedStarts.has(matchingSlot.startUtc)) {
      return NextResponse.json({ error: "This time has just been booked. Please choose another time." }, { status: 409 });
    }

    const duplicateBooking = await getDuplicateBooking(payload.email, matchingSlot.startUtc);
    if (duplicateBooking) {
      return NextResponse.json({ error: "A booking already exists for this email and time." }, { status: 409 });
    }

    const bookingId = crypto.randomUUID();
    const reserved = await reserveSlot(matchingSlot.startUtc, bookingId);
    if (!reserved) {
      return NextResponse.json({ error: "This time has just been booked. Please choose another time." }, { status: 409 });
    }
    reservedStartUtc = matchingSlot.startUtc;

    const configuredOnlineMeeting = process.env.BOOKING_ONLINE_MEETING_URL || "";
    const zoom = zoomConfigured()
      ? await createZoomMeeting({
          topic: "MSTRY Consultation Call",
          startUtc: matchingSlot.startUtc,
          timezone: payload.timezone,
          agenda: payload.message || "Scheduled call with the MSTRY team."
        })
      : {
          joinUrl: configuredOnlineMeeting,
          meetingId: "",
          passcode: ""
        };
    createdZoomMeetingId = zoom.meetingId;

    const now = new Date().toISOString();
    const booking: BookingRecord = {
      id: bookingId,
      fullName: payload.fullName,
      organization: payload.organization,
      email: payload.email,
      phone: payload.phone,
      serviceInterest: payload.serviceInterest as ServiceInterest,
      message: payload.message,
      selectedDate: payload.selectedDate,
      selectedTime: payload.selectedTime,
      timezone: payload.timezone,
      submittedPageUrl: submittedPageUrl(request, payload.submittedPageUrl),
      startUtc: matchingSlot.startUtc,
      endUtc: addMinutes(new Date(matchingSlot.startUtc), bookingDurationMinutes).toISOString(),
      durationMinutes: bookingDurationMinutes,
      status: "Confirmed",
      meetingStatus: zoom.meetingId ? "Created" : "Pending",
      emailStatus: "Pending",
      zoom,
      createdAt: now,
      updatedAt: now
    };

    await storeBooking(booking);
    bookingStored = true;

    try {
      await sendBookingEmails(booking);
      booking.emailStatus = "Sent";
    } catch (emailError) {
      console.error("Booking email delivery failed", {
        bookingId: booking.id,
        error: emailError instanceof Error ? emailError.message : "Unknown email delivery error"
      });
      // The appointment remains confirmed if notification delivery fails; emailStatus records the failure for admin review.
      booking.emailStatus = "Failed";
    }
    booking.updatedAt = new Date().toISOString();
    await storeBooking(booking);

    return NextResponse.json({
      ok: true,
      booking: {
        id: booking.id,
        status: booking.status,
        selectedDate: booking.selectedDate,
        selectedTime: booking.selectedTime,
        timezone: booking.timezone,
        durationMinutes: booking.durationMinutes,
        startUtc: booking.startUtc,
        endUtc: booking.endUtc,
        meetingStatus: booking.meetingStatus,
        emailStatus: booking.emailStatus,
        zoom: {
          joinUrl: booking.zoom.joinUrl,
          meetingId: booking.zoom.meetingId,
          passcode: booking.zoom.passcode
        }
      }
    });
  } catch (error) {
    if (reservedStartUtc && !bookingStored) {
      await releaseSlot(reservedStartUtc).catch(() => undefined);
    }
    if (createdZoomMeetingId && !bookingStored) {
      await deleteZoomMeeting(createdZoomMeetingId).catch(() => undefined);
    }

    console.error("Booking request failed", error);

    return NextResponse.json({ error: "We could not complete your booking. Please try again." }, { status: 500 });
  }
}
