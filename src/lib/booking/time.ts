const timeFormatterCache = new Map<string, Intl.DateTimeFormat>();

function formatter(timezone: string) {
  const existing = timeFormatterCache.get(timezone);
  if (existing) return existing;
  const created = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  timeFormatterCache.set(timezone, created);
  return created;
}

function partsInTimezone(date: Date, timezone: string) {
  const parts = formatter(timezone).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour === "24" ? "0" : values.hour),
    minute: Number(values.minute),
    second: Number(values.second)
  };
}

export function timezoneOffsetMs(date: Date, timezone: string) {
  const parts = partsInTimezone(date, timezone);
  const utcFromParts = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return utcFromParts - date.getTime();
}

export function zonedTimeToUtc(date: string, time: string, timezone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset = timezoneOffsetMs(utcGuess, timezone);
  return new Date(utcGuess.getTime() - offset);
}

export function utcToZonedParts(date: Date, timezone: string) {
  const parts = partsInTimezone(date, timezone);
  return {
    date: `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`,
    time: `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`
  };
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function displayDateTime(date: string, time: string, timezone: string) {
  const start = zonedTimeToUtc(date, time, timezone);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    dateStyle: "full",
    timeStyle: "short"
  }).format(start);
}

