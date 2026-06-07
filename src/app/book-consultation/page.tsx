import type { Metadata } from "next";
import { CallBookingForm } from "@/components/sections/call-booking-form";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Book a Call",
  description: "Choose a date and time to book a call with a MSTRY team member."
};

export default function BookConsultationPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a call"
        title="Book a Call With MSTRY"
        body="Choose a date and time to speak with a MSTRY team member about your objectives, ideas, opportunities, or next steps."
      />
      <CallBookingForm />
    </>
  );
}
