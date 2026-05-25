"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export function ConsultationForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="grid gap-4 border border-white/10 bg-white/[.035] p-7"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      {["Full name", "Work email"].map((label) => (
        <label className="grid gap-2 text-sm font-black text-mstry-silver" key={label}>
          {label}
          <input className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-mstry-silver outline-none focus:border-mstry-gold" required={label === "Full name"} type={label.includes("email") ? "email" : "text"} />
        </label>
      ))}
      <label className="grid gap-2 text-sm font-black text-mstry-silver">
        Primary need
        <select className="min-h-12 rounded-mstry border border-white/15 bg-mstry-black px-4 text-mstry-silver outline-none focus:border-mstry-gold">
          <option>UAE company formation</option>
          <option>European business setup</option>
          <option>Free Zone vs Mainland advice</option>
          <option>Holding company or corporate structuring</option>
          <option>Operational management outsourcing</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-black text-mstry-silver">
        Private notes
        <textarea className="min-h-32 rounded-mstry border border-white/15 bg-mstry-black px-4 py-3 text-mstry-silver outline-none focus:border-mstry-gold" placeholder="Tell us what you want built, structured, relocated, or handled behind the scenes" />
      </label>
      <a className="font-black text-mstry-gold" href={`mailto:${siteConfig.email}`}>
        {siteConfig.email}
      </a>
      <button className="min-h-12 rounded-mstry bg-gradient-to-br from-[#fff0b7] via-mstry-gold to-mstry-deepGold px-5 font-black text-black" type="submit">
        {sent ? "Request Received" : "Speak With MSTRY"}
      </button>
    </form>
  );
}
