import { displayDateTime } from "./time";
import type { BookingRecord } from "./types";
import { escapeHtml } from "./validation";

const sampleBooking: BookingRecord = {
  id: "mstry-preview-20260710-001",
  fullName: "Amara Laurent",
  organization: "Laurent Global Ventures",
  email: "amara.laurent@example.com",
  phone: "+44 20 7946 0182",
  serviceInterest: "Strategic Consulting",
  message:
    "We are evaluating a cross-border expansion and want to discuss operating structure, partner selection, and execution support.",
  selectedDate: "2026-07-16",
  selectedTime: "14:30",
  timezone: "Europe/London",
  submittedPageUrl: "https://themstry.com/book-consultation",
  startUtc: "2026-07-16T13:30:00.000Z",
  endUtc: "2026-07-16T14:00:00.000Z",
  durationMinutes: 30,
  status: "Confirmed",
  meetingStatus: "Created",
  emailStatus: "Pending",
  zoom: {
    joinUrl: "https://zoom.us/j/98765432100?pwd=preview",
    meetingId: "987 6543 2100",
    passcode: "MSTRY2026"
  },
  createdAt: "2026-07-10T08:45:00.000Z",
  updatedAt: "2026-07-10T08:45:00.000Z"
};

function emailShell(title: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;background:#0A0A0A;color:#FFFFFF;padding:32px">
      <div style="max-width:720px;margin:0 auto;border:1px solid rgba(212,175,55,.28);background:#111827;padding:30px;border-radius:10px;box-shadow:0 28px 80px rgba(0,0,0,.38)">
        <p style="color:#D4AF37;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;margin:0 0 12px">MSTRY MANAGEMENT</p>
        <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px;color:#FFFFFF">${escapeHtml(title)}</h1>
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
    `Meeting link: ${booking.zoom.joinUrl || "To be assigned"}`
  ].join("\n");
}

function googleCalendarLink(booking: BookingRecord) {
  const title = encodeURIComponent(`MSTRY Call - ${booking.fullName}`);
  const dates = `${booking.startUtc.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}/${booking.endUtc.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`;
  const details = encodeURIComponent(calendarDescription(booking));
  const location = encodeURIComponent(booking.zoom.joinUrl || "Zoom / Online Meeting");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export function getSampleBooking() {
  return sampleBooking;
}

export function renderClientBookingEmail(booking: BookingRecord = sampleBooking) {
  const localDisplay = displayDateTime(booking.selectedDate, booking.selectedTime, booking.timezone);
  const rows: Array<[string, string]> = [
    ["Client Name", booking.fullName],
    ["Date & Time", localDisplay],
    ["Timezone", booking.timezone],
    ["Meeting Format", "Zoom / Online Call"],
    ["Meeting Link", booking.zoom.joinUrl || "To be assigned"],
    ["Meeting ID", booking.zoom.meetingId || "To be assigned"],
    ["Passcode", booking.zoom.passcode || "Not required"]
  ];

  return {
    subject: "Your MSTRY Management Call Is Confirmed",
    html: emailShell(
      "Your MSTRY Management Call Is Confirmed",
      `
        <p style="color:#E5E7EB;line-height:1.7;margin:0 0 18px">Hello ${escapeHtml(booking.fullName)},</p>
        <p style="color:#A1A1AA;line-height:1.7;margin:0 0 22px">Your MSTRY Management call is confirmed. We look forward to speaking with you about your objectives, priorities, and next steps.</p>
        ${table(rows)}
        <p style="color:#A1A1AA;line-height:1.7;margin:22px 0 0">If you need to reschedule or update any details before the call, you can reply directly to this email.</p>
        <p style="color:#FFFFFF;line-height:1.7;margin:22px 0 0">MSTRY Management</p>
      `
    )
  };
}

export function renderInternalBookingEmail(booking: BookingRecord = sampleBooking) {
  const localDisplay = displayDateTime(booking.selectedDate, booking.selectedTime, booking.timezone);
  const calendarLink = googleCalendarLink(booking);
  const rows: Array<[string, string]> = [
    ["Client Name", booking.fullName],
    ["Email", booking.email],
    ["Phone", booking.phone || "Not provided"],
    ["Organization / Company", booking.organization || "Not provided"],
    ["Service Interest", booking.serviceInterest],
    ["Notes", booking.message || "Not provided"],
    ["Selected Date / Time", localDisplay],
    ["Timezone", booking.timezone],
    ["Meeting Format", "Zoom / Online Call"],
    ["Booking ID", booking.id],
    ["Status", booking.status],
    ["Submitted At", booking.createdAt],
    ["Meeting Link", booking.zoom.joinUrl || "To be assigned"],
    ["Meeting ID", booking.zoom.meetingId || "To be assigned"],
    ["Passcode", booking.zoom.passcode || "Not required"]
  ];
  const calendarRows: Array<[string, string]> = [
    ["Event Title", `MSTRY Call - ${booking.fullName}`],
    ["Start Time", booking.startUtc],
    ["End Time", booking.endUtc],
    ["Timezone", booking.timezone],
    ["Description", calendarDescription(booking)],
    ["Meeting Link", booking.zoom.joinUrl || "To be assigned"]
  ];

  return {
    subject: "New MSTRY Call Booking",
    googleCalendarLink: calendarLink,
    html: emailShell(
      "New MSTRY Call Booking",
      `
        <p style="color:#A1A1AA;line-height:1.7;margin:0 0 22px">A new MSTRY call booking has been confirmed.</p>
        ${table(rows)}
        <h2 style="color:#FFFFFF;font-size:20px;line-height:1.3;margin:28px 0 12px">Calendar-ready section</h2>
        ${table(calendarRows)}
        ${actionLink(calendarLink, "Open Google Calendar Draft")}
        <p style="color:#A1A1AA;line-height:1.7;margin:18px 0 0">An .ics calendar file is planned for the final Resend email attachment.</p>
      `
    )
  };
}
