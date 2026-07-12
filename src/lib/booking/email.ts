import { bookingDurationMinutes } from "./availability";
import { customerBookingTimezone, customerBookingTimezoneLabel, displayInstantDateTime } from "./time";
import type { BookingRecord } from "./types";
import { escapeHtml } from "./validation";

const internalEmail = process.env.BOOKING_INTERNAL_EMAIL || "Info@themstry.com";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function resendErrorDetails(status: number, value: unknown) {
  if (!value || typeof value !== "object") {
    return `Email delivery failed with status ${status}.`;
  }

  const error = value as { name?: unknown; message?: unknown };
  const fields = [
    `status ${status}`,
    typeof error.name === "string" && error.name ? `name: ${error.name}` : "",
    typeof error.message === "string" && error.message ? `message: ${error.message}` : ""
  ].filter(Boolean);

  return `Email delivery failed with ${fields.join(", ")}.`;
}

async function sendEmail({
  to,
  replyTo,
  subject,
  html,
  text,
  attachments
}: {
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  attachments?: Array<{ filename: string; content: string }>;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONSULTATION_FROM_EMAIL || "MSTRY MANAGEMENT <onboarding@themstry.com>";

  if (!apiKey) {
    throw new Error("Email delivery is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      reply_to: replyTo,
      subject,
      html,
      text,
      attachments
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(resendErrorDetails(response.status, errorBody));
  }
}

function brandShell(title: string, body: string) {
  return `
    <div style="margin:0;padding:0;background:#0A0A0A;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif">
      <style>
        @media only screen and (max-width: 480px) {
          .mstry-shell { padding: 18px 12px !important; }
          .mstry-card { padding: 22px 18px !important; }
          .mstry-title { font-size: 23px !important; line-height: 1.22 !important; }
          .mstry-row-label, .mstry-row-value { display: block !important; width: 100% !important; padding-right: 0 !important; }
          .mstry-row-value { padding-top: 2px !important; }
        }
      </style>
      <div class="mstry-shell" style="background:#0A0A0A;color:#FFFFFF;padding:32px 16px">
        <div class="mstry-card" style="max-width:720px;margin:0 auto;border:1px solid rgba(212,175,55,.28);background:#111827;padding:30px;border-radius:10px">
        <p style="color:#D4AF37;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;margin:0 0 12px">MSTRY MANAGEMENT</p>
        <h1 class="mstry-title" style="font-size:28px;line-height:1.2;margin:0 0 16px;color:#FFFFFF">${escapeHtml(title)}</h1>
        ${body}
        </div>
      </div>
    </div>
  `;
}

function row(label: string, value: string) {
  return `
    <tr>
      <td class="mstry-row-label" style="width:34%;vertical-align:top;border-top:1px solid rgba(255,255,255,.1);padding:13px 12px 13px 0;color:#D4AF37;font-weight:800;word-break:break-word">${escapeHtml(label)}</td>
      <td class="mstry-row-value" style="vertical-align:top;border-top:1px solid rgba(255,255,255,.1);padding:13px 0;color:#FFFFFF;line-height:1.55;word-break:break-word;overflow-wrap:anywhere">${escapeHtml(value).replaceAll("\n", "<br />")}</td>
    </tr>
  `;
}

function table(rows: Array<[string, string]>) {
  return `<table style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => row(label, value)).join("")}</table>`;
}

function section(title: string, body: string) {
  return `
    <div style="border:1px solid rgba(212,175,55,.24);background:rgba(212,175,55,.08);border-radius:10px;padding:18px;margin:22px 0 0">
      <h2 style="color:#FFFFFF;font-size:18px;line-height:1.3;margin:0 0 8px">${escapeHtml(title)}</h2>
      <p style="color:#D9D9DE;line-height:1.65;margin:0">${escapeHtml(body)}</p>
    </div>
  `;
}

export async function sendBookingEmails(booking: BookingRecord) {
  if (!emailConfigured()) throw new Error("Email delivery is not configured.");

  const ics = buildCalendarInvite(booking);
  const localDisplay = displayInstantDateTime(booking.startUtc, customerBookingTimezone);
  const timestamp = booking.createdAt;
  const commonRows: Array<[string, string]> = [
    ["Booking ID", booking.id],
    ["Booking Status", booking.status],
    ["Name", booking.fullName],
    ["Organization", booking.organization || "Not provided"],
    ["Email", booking.email],
    ["Phone", booking.phone || "Not provided"],
    ["Service Interest", booking.serviceInterest],
    ["Consultation Notes", booking.message || "Not provided"],
    ["Meeting Type", "Zoom / Online Call"],
    ["Date & Time", localDisplay],
    ["Selected Date", booking.selectedDate],
    ["Selected Time", booking.selectedTime],
    ["Timezone", customerBookingTimezoneLabel],
    ["Meeting Duration", `${booking.durationMinutes} minutes`],
    ["Start Time UTC", booking.startUtc],
    ["End Time UTC", booking.endUtc],
    ["Zoom Meeting Link", booking.zoom.joinUrl || "To be assigned"],
    ["Meeting ID", booking.zoom.meetingId || "To be assigned"],
    ["Passcode", booking.zoom.passcode || "Not required"],
    ["Submitted Page URL", booking.submittedPageUrl || "Not provided"],
    ["Submission Timestamp", timestamp]
  ];

  await sendEmail({
    to: [internalEmail],
    replyTo: booking.email,
    subject: "New Themstry Appointment Booking",
    html: brandShell("New Themstry Appointment Booking", table(commonRows)),
    text: commonRows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    attachments: [{ filename: "mstry-consultation-call.ics", content: Buffer.from(ics).toString("base64") }]
  });

  const clientRows: Array<[string, string]> = [
    ["Date & Time", localDisplay],
    ["Timezone", customerBookingTimezoneLabel],
    ["Meeting Format", "Zoom / Online Call"],
    ["Meeting Duration", `${bookingDurationMinutes} minutes`],
    ["Next Steps", "Please join from a quiet setting and be prepared to discuss your objectives, timeline, stakeholders, and the type of support you are seeking."]
  ];

  await sendEmail({
    to: [booking.email],
    subject: "Your Consultation Has Been Confirmed",
    html: brandShell(
      "Your Consultation Has Been Confirmed",
      `<p style="color:#A1A1AA;line-height:1.7;margin:0 0 22px">Thank you for scheduling a strategic discussion with MSTRY Management. Your meeting details are below.</p>${table(clientRows)}${section("Meeting Joining Details", "A member of our team will provide the meeting joining details approximately 15 minutes before the scheduled meeting time.")}`
    ),
    text: [
      "Your Consultation Has Been Confirmed",
      ...clientRows.map(([label, value]) => `${label}: ${value}`),
      "Meeting Joining Details: A member of our team will provide the meeting joining details approximately 15 minutes before the scheduled meeting time."
    ].join("\n"),
    attachments: [{ filename: "mstry-consultation-call.ics", content: Buffer.from(ics).toString("base64") }]
  });
}

function formatIcsDate(value: string) {
  return value.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildCalendarInvite(booking: BookingRecord) {
  const description = [
    "Scheduled call with the MSTRY team to discuss objectives, ideas, opportunities, and next steps.",
    "Meeting joining details will be provided approximately 15 minutes before the scheduled meeting time."
  ].join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MSTRY MANAGEMENT//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@themstry.com`,
    `DTSTAMP:${formatIcsDate(booking.createdAt)}`,
    `DTSTART:${formatIcsDate(booking.startUtc)}`,
    `DTEND:${formatIcsDate(booking.endUtc)}`,
    "SUMMARY:MSTRY Consultation Call",
    `DESCRIPTION:${description}`,
    "LOCATION:Zoom / Online Meeting",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
