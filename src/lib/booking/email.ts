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

function actionLink(href: string, label: string) {
  return `
    <p style="margin:22px 0 0">
      <a href="${escapeHtml(href)}" style="display:inline-block;border:1px solid #D4AF37;background:#D4AF37;color:#0A0A0A;text-decoration:none;border-radius:8px;padding:12px 18px;font-weight:800">${escapeHtml(label)}</a>
    </p>
  `;
}

function calendarDescription(booking: BookingRecord) {
  return [
    `MSTRY call with ${booking.fullName}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone || "Not provided"}`,
    `Organization/company: ${booking.organization || "Not provided"}`,
    `Service interest: ${booking.serviceInterest}`,
    `Notes: ${booking.message || "Not provided"}`,
    "Meeting joining details will be provided approximately 15 minutes before the scheduled meeting time."
  ].join("\n");
}

function googleCalendarLink(booking: BookingRecord) {
  const title = encodeURIComponent(`MSTRY Call - ${booking.fullName}`);
  const dates = `${formatIcsDate(booking.startUtc)}/${formatIcsDate(booking.endUtc)}`;
  const details = encodeURIComponent(calendarDescription(booking));
  const location = encodeURIComponent("Zoom / Online Meeting");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export async function sendBookingEmails(booking: BookingRecord) {
  if (!emailConfigured()) throw new Error("Email delivery is not configured.");

  const ics = buildCalendarInvite(booking);
  const localDisplay = displayInstantDateTime(booking.startUtc, customerBookingTimezone);
  const timestamp = booking.createdAt;
  const calendarLink = googleCalendarLink(booking);
  const internalRows: Array<[string, string]> = [
    ["Client Name", booking.fullName],
    ["Email", booking.email],
    ["Phone", booking.phone || "Not provided"],
    ["Organization / Company", booking.organization || "Not provided"],
    ["Service Interest", booking.serviceInterest],
    ["Notes", booking.message || "Not provided"],
    ["Selected Date / Time", localDisplay],
    ["Timezone", customerBookingTimezoneLabel],
    ["Meeting Format", "Zoom / Online Call"],
    ["Booking ID", booking.id],
    ["Status", booking.status],
    ["Submitted At", timestamp]
  ];
  const calendarRows: Array<[string, string]> = [
    ["Event Title", `MSTRY Call - ${booking.fullName}`],
    ["Start Time", booking.startUtc],
    ["End Time", booking.endUtc],
    ["Timezone", customerBookingTimezoneLabel],
    ["Description", calendarDescription(booking)]
  ];

  await sendEmail({
    to: [internalEmail],
    replyTo: booking.email,
    subject: "New MSTRY Call Booking",
    html: brandShell(
      "New MSTRY Call Booking",
      `
        <p style="color:#A1A1AA;line-height:1.7;margin:0 0 22px">A new MSTRY call booking has been confirmed.</p>
        ${table(internalRows)}
        ${section("Meeting Joining Details", "A member of our team will provide the meeting joining details approximately 15 minutes before the scheduled meeting time.")}
        <h2 style="color:#FFFFFF;font-size:20px;line-height:1.3;margin:28px 0 12px">Calendar-ready section</h2>
        ${table(calendarRows)}
        ${actionLink(calendarLink, "Open Google Calendar Draft")}
      `
    ),
    text: [
      "New MSTRY Call Booking",
      ...internalRows.map(([label, value]) => `${label}: ${value}`),
      "Meeting Joining Details: A member of our team will provide the meeting joining details approximately 15 minutes before the scheduled meeting time.",
      ...calendarRows.map(([label, value]) => `${label}: ${value}`),
      `Google Calendar Draft: ${calendarLink}`
    ].join("\n"),
    attachments: [{ filename: "mstry-consultation-call.ics", content: Buffer.from(ics).toString("base64") }]
  });

  const clientRows: Array<[string, string]> = [
    ["Client Name", booking.fullName],
    ["Date & Time", localDisplay],
    ["Timezone", customerBookingTimezoneLabel],
    ["Meeting Format", "Zoom / Online Call"],
    ["Meeting Duration", `${bookingDurationMinutes} minutes`],
    ["Next Steps", "Please join from a quiet setting and be prepared to discuss your objectives, timeline, stakeholders, and the type of support you are seeking."]
  ];

  await sendEmail({
    to: [booking.email],
    subject: "Your MSTRY Management Call Is Confirmed",
    html: brandShell(
      "Your MSTRY Management Call Is Confirmed",
      `
        <p style="color:#E5E7EB;line-height:1.7;margin:0 0 18px">Hello ${escapeHtml(booking.fullName)},</p>
        <p style="color:#A1A1AA;line-height:1.7;margin:0 0 22px">Your MSTRY Management call is confirmed. We look forward to speaking with you about your objectives, priorities, and next steps.</p>
        ${table(clientRows)}
        ${section("Meeting Joining Details", "A member of our team will provide the meeting joining details approximately 15 minutes before the scheduled meeting time.")}
        <p style="color:#A1A1AA;line-height:1.7;margin:22px 0 0">If you need to reschedule or update any details before the call, you can reply directly to this email.</p>
        <p style="color:#FFFFFF;line-height:1.7;margin:22px 0 0">MSTRY Management</p>
      `
    ),
    text: [
      "Your MSTRY Management Call Is Confirmed",
      `Hello ${booking.fullName},`,
      "Your MSTRY Management call is confirmed. We look forward to speaking with you about your objectives, priorities, and next steps.",
      ...clientRows.map(([label, value]) => `${label}: ${value}`),
      "Meeting Joining Details: A member of our team will provide the meeting joining details approximately 15 minutes before the scheduled meeting time.",
      "If you need to reschedule or update any details before the call, you can reply directly to this email.",
      "MSTRY Management"
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
