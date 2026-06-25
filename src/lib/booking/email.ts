import { bookingDurationMinutes } from "./availability";
import { displayDateTime } from "./time";
import type { BookingRecord } from "./types";
import { escapeHtml } from "./validation";

const internalEmail = process.env.BOOKING_INTERNAL_EMAIL || "Info@themstry.com";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
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
    throw new Error("Email delivery failed.");
  }
}

function brandShell(title: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;background:#0A0A0A;color:#FFFFFF;padding:32px">
      <div style="max-width:720px;margin:0 auto;border:1px solid rgba(212,175,55,.28);background:#111827;padding:30px;border-radius:10px">
        <p style="color:#D4AF37;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;margin:0 0 12px">MSTRY MANAGEMENT</p>
        <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">${escapeHtml(title)}</h1>
        ${body}
      </div>
    </div>
  `;
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="width:34%;vertical-align:top;border-top:1px solid rgba(255,255,255,.1);padding:13px 12px 13px 0;color:#D4AF37;font-weight:800">${escapeHtml(label)}</td>
      <td style="vertical-align:top;border-top:1px solid rgba(255,255,255,.1);padding:13px 0;color:#FFFFFF;line-height:1.55">${escapeHtml(value).replaceAll("\n", "<br />")}</td>
    </tr>
  `;
}

function table(rows: Array<[string, string]>) {
  return `<table style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => row(label, value)).join("")}</table>`;
}

export async function sendBookingEmails(booking: BookingRecord) {
  if (!emailConfigured()) throw new Error("Email delivery is not configured.");

  const ics = buildCalendarInvite(booking);
  const localDisplay = displayDateTime(booking.selectedDate, booking.selectedTime, booking.timezone);
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
    ["Timezone", booking.timezone],
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
    ["Timezone", booking.timezone],
    ["Meeting Format", "Zoom / Online Call"],
    ["Zoom Link", booking.zoom.joinUrl || "To be assigned"],
    ["Meeting ID", booking.zoom.meetingId || "To be assigned"],
    ["Passcode", booking.zoom.passcode || "Not required"],
    ["Meeting Duration", `${bookingDurationMinutes} minutes`],
    ["Next Steps", "Please join from a quiet setting and be prepared to discuss your objectives, timeline, stakeholders, and the type of support you are seeking."]
  ];

  await sendEmail({
    to: [booking.email],
    subject: "Your Consultation Has Been Confirmed",
    html: brandShell(
      "Your Consultation Has Been Confirmed",
      `<p style="color:#A1A1AA;line-height:1.7;margin:0 0 22px">Thank you for scheduling a strategic discussion with MSTRY MANAGEMENT. Your meeting details are below.</p>${table(clientRows)}`
    ),
    text: ["Your Consultation Has Been Confirmed", ...clientRows.map(([label, value]) => `${label}: ${value}`)].join("\n"),
    attachments: [{ filename: "mstry-consultation-call.ics", content: Buffer.from(ics).toString("base64") }]
  });
}

function formatIcsDate(value: string) {
  return value.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildCalendarInvite(booking: BookingRecord) {
  const description = [
    "Scheduled call with the MSTRY team to discuss objectives, ideas, opportunities, and next steps.",
    booking.zoom.joinUrl ? `Zoom Link: ${booking.zoom.joinUrl}` : "Meeting details will be provided by the MSTRY team."
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
