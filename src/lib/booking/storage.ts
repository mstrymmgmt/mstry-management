import type { AvailabilityRules } from "./availability";
import type { BookingRecord, BookingStatus } from "./types";

type RedisResponse<T> = {
  result?: T;
  error?: string;
};

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export function storageConfigured() {
  return Boolean(redisUrl && redisToken);
}

async function redisCommand<T>(command: Array<string | number>) {
  if (!redisUrl || !redisToken) {
    throw new Error("Booking database is not configured.");
  }

  const response = await fetch(redisUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });
  const data = (await response.json()) as RedisResponse<T>;

  if (!response.ok || data.error) {
    throw new Error(data.error || "Booking database request failed.");
  }

  return data.result as T;
}

export function slotKey(startUtc: string) {
  return `booking:slot:${startUtc}`;
}

export function bookingKey(id: string) {
  return `booking:record:${id}`;
}

export async function reserveSlot(startUtc: string, bookingId: string) {
  const result = await redisCommand<"OK" | null>(["SET", slotKey(startUtc), bookingId, "NX"]);
  return result === "OK";
}

export async function releaseSlot(startUtc: string) {
  await redisCommand<number>(["DEL", slotKey(startUtc)]);
}

export async function storeBooking(booking: BookingRecord) {
  await redisCommand<"OK">(["SET", bookingKey(booking.id), JSON.stringify(booking)]);
  await redisCommand<number>(["ZADD", "booking:index", Date.parse(booking.createdAt), booking.id]);
  await redisCommand<"OK">(["SET", `booking:client:${booking.email}:${booking.startUtc}`, booking.id]);
}

export async function getBooking(id: string) {
  const value = await redisCommand<string | null>(["GET", bookingKey(id)]);
  return value ? (JSON.parse(value) as BookingRecord) : null;
}

export async function listBookingIds(offset = 0, limit = 50) {
  return redisCommand<string[]>(["ZREVRANGE", "booking:index", offset, offset + limit - 1]);
}

export async function listBookings(offset = 0, limit = 50) {
  const ids = await listBookingIds(offset, limit);
  if (!ids.length) return [];
  const values = await redisCommand<Array<string | null>>(["MGET", ...ids.map(bookingKey)]);
  return values.filter(Boolean).map((value) => JSON.parse(value as string) as BookingRecord);
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const booking = await getBooking(id);
  if (!booking) return null;
  const updated = { ...booking, status, updatedAt: new Date().toISOString() };
  await storeBooking(updated);
  return updated;
}

export async function getBookedSlotStarts(starts: string[]) {
  if (!starts.length) return new Set<string>();
  const values = await redisCommand<Array<string | null>>(["MGET", ...starts.map(slotKey)]);
  return new Set(starts.filter((start, index) => Boolean(values[index])));
}

export async function getAvailabilityRules() {
  const value = await redisCommand<string | null>(["GET", "booking:availability:rules"]);
  return value ? (JSON.parse(value) as AvailabilityRules) : {};
}

export async function getDuplicateBooking(email: string, startUtc: string) {
  const id = await redisCommand<string | null>(["GET", `booking:client:${email}:${startUtc}`]);
  return id;
}
