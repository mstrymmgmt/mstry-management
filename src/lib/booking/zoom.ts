import { bookingDurationMinutes } from "./availability";
import type { ZoomMeeting } from "./types";

export function zoomConfigured() {
  return Boolean(process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET);
}

async function getZoomAccessToken() {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error("Zoom integration is not configured.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`
    },
    cache: "no-store"
  });
  const data = (await response.json()) as { access_token?: string; reason?: string; message?: string };

  if (!response.ok || !data.access_token) {
    throw new Error(data.reason || data.message || "Zoom access token request failed.");
  }

  return data.access_token;
}

export async function createZoomMeeting({
  topic,
  startUtc,
  timezone,
  agenda
}: {
  topic: string;
  startUtc: string;
  timezone: string;
  agenda: string;
}): Promise<ZoomMeeting> {
  const token = await getZoomAccessToken();
  const hostUser = process.env.ZOOM_HOST_USER_ID || "me";
  const response = await fetch(`https://api.zoom.us/v2/users/${encodeURIComponent(hostUser)}/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      topic,
      type: 2,
      start_time: startUtc,
      duration: bookingDurationMinutes,
      timezone,
      agenda,
      settings: {
        waiting_room: true,
        join_before_host: false,
        approval_type: 0,
        meeting_authentication: false,
        audio: "voip",
        auto_recording: "none"
      }
    }),
    cache: "no-store"
  });
  const data = (await response.json()) as {
    join_url?: string;
    start_url?: string;
    id?: number | string;
    password?: string;
    message?: string;
  };

  if (!response.ok || !data.join_url || !data.id) {
    throw new Error(data.message || "Zoom meeting creation failed.");
  }

  return {
    joinUrl: data.join_url,
    startUrl: data.start_url,
    meetingId: String(data.id),
    passcode: data.password || ""
  };
}

export async function deleteZoomMeeting(meetingId: string) {
  const token = await getZoomAccessToken();
  await fetch(`https://api.zoom.us/v2/meetings/${encodeURIComponent(meetingId)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });
}
