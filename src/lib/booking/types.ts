export const bookingStatuses = ["Pending", "Confirmed", "Completed", "Cancelled", "Rescheduled"] as const;

export type BookingStatus = (typeof bookingStatuses)[number];

export const serviceOptions = [
  "Consultation Call",
  "Business Management",
  "Strategic Consulting",
  "Project Management",
  "Strategic Partnerships",
  "Business Development",
  "Sports Management",
  "Other"
] as const;

export type ServiceInterest = (typeof serviceOptions)[number];

export type BookingPayload = {
  fullName?: string;
  organization?: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
  message?: string;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  website?: string;
  startedAt?: string;
};

export type ZoomMeeting = {
  joinUrl: string;
  meetingId: string;
  passcode: string;
  startUrl?: string;
};

export type BookingRecord = {
  id: string;
  fullName: string;
  organization: string;
  email: string;
  phone: string;
  serviceInterest: ServiceInterest;
  message: string;
  selectedDate: string;
  selectedTime: string;
  timezone: string;
  startUtc: string;
  endUtc: string;
  durationMinutes: number;
  status: BookingStatus;
  meetingStatus: "Created" | "Pending" | "Failed";
  emailStatus: "Pending" | "Sent" | "Failed";
  zoom: ZoomMeeting;
  createdAt: string;
  updatedAt: string;
};

export type AvailabilitySlot = {
  date: string;
  time: string;
  businessDate?: string;
  businessTime?: string;
  startUtc: string;
  endUtc: string;
  available: boolean;
};
