import { NextRequest } from "next/server";

const submissions = new Map<string, number[]>();

export function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export function rateLimited(ip: string, limit = 4, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (submissions.get(ip) || []).filter((time) => now - time < windowMs);
  recent.push(now);
  submissions.set(ip, recent);
  return recent.length > limit;
}

