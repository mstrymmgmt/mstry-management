import { NextRequest, NextResponse } from "next/server";

const destinationEmail = "onboarding@themstry.com";
const allowedServices = new Set([
  "Business Management",
  "Strategic Consulting",
  "Project Management",
  "Strategic Partnerships",
  "Business Development",
  "Sports Management",
  "Other"
]);

type ConsultationPayload = {
  fullName?: string;
  organization?: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
  message?: string;
  website?: string;
  startedAt?: string;
};

type EmailFields = {
  fullName: string;
  organization: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
};

const submissions = new Map<string, number[]>();

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 2000) : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (submissions.get(ip) || []).filter((time) => now - time < windowMs);
  recent.push(now);
  submissions.set(ip, recent);
  return recent.length > 4;
}

function buildHtml(fields: EmailFields, timestamp: string) {
  const rows = [
    ["Full Name", fields.fullName],
    ["Organization / Company", fields.organization || "Not provided"],
    ["Email Address", fields.email],
    ["Phone Number", fields.phone || "Not provided"],
    ["Service Interest", fields.serviceInterest],
    ["Message / Project Details", fields.message],
    ["Submission Timestamp", timestamp]
  ];

  return `
    <div style="font-family:Arial,sans-serif;background:#0A0A0A;color:#FFFFFF;padding:32px">
      <div style="max-width:680px;margin:0 auto;border:1px solid rgba(212,175,55,.28);background:#111827;padding:28px;border-radius:8px">
        <p style="color:#D4AF37;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;margin:0 0 12px">MSTRY MANAGEMENT</p>
        <h1 style="font-size:28px;line-height:1.2;margin:0 0 12px">New Consultation Inquiry</h1>
        <p style="color:#A1A1AA;line-height:1.6;margin:0 0 24px">A prospective client submitted a strategic consultation request.</p>
        <table style="width:100%;border-collapse:collapse">
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="width:34%;vertical-align:top;border-top:1px solid rgba(255,255,255,.1);padding:14px 12px 14px 0;color:#D4AF37;font-weight:800">${escapeHtml(label)}</td>
                  <td style="vertical-align:top;border-top:1px solid rgba(255,255,255,.1);padding:14px 0;color:#FFFFFF;line-height:1.55">${escapeHtml(value).replaceAll("\n", "<br />")}</td>
                </tr>
              `
            )
            .join("")}
        </table>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ConsultationPayload;
    const fullName = clean(payload.fullName);
    const organization = clean(payload.organization);
    const email = clean(payload.email).toLowerCase();
    const phone = clean(payload.phone);
    const serviceInterest = clean(payload.serviceInterest);
    const message = clean(payload.message);
    const website = clean(payload.website);
    const startedAt = Number(payload.startedAt || 0);
    const ip = clientIp(request);

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    if (startedAt && Date.now() - startedAt < 2500) {
      return NextResponse.json({ error: "Please review the form before submitting." }, { status: 400 });
    }

    if (!fullName || !email || !serviceInterest || !message) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!allowedServices.has(serviceInterest)) {
      return NextResponse.json({ error: "Please select a valid service interest." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONSULTATION_FROM_EMAIL || "MSTRY MANAGEMENT <onboarding@themstry.com>";

    if (!apiKey) {
      return NextResponse.json({ error: "Consultation email delivery is not configured." }, { status: 500 });
    }

    const timestamp = new Date().toISOString();
    const fields = { fullName, organization, email, phone, serviceInterest, message };
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [destinationEmail],
        reply_to: email,
        subject: `New MSTRY Consultation Inquiry - ${serviceInterest}`,
        html: buildHtml(fields, timestamp),
        text: [
          "New MSTRY MANAGEMENT Consultation Inquiry",
          `Submitted: ${timestamp}`,
          `Service Interest: ${serviceInterest}`,
          `Full Name: ${fullName}`,
          `Organization / Company: ${organization || "Not provided"}`,
          `Email Address: ${email}`,
          `Phone Number: ${phone || "Not provided"}`,
          "",
          "Message / Project Details:",
          message
        ].join("\n")
      })
    });

    if (!response.ok) {
      return NextResponse.json({ error: "We could not send your inquiry right now. Please email onboarding@themstry.com directly." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not process your request. Please try again." }, { status: 400 });
  }
}
