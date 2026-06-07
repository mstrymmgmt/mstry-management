"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { globalMarkets } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function GlobalMap() {
  const [active, setActive] = useState(globalMarkets[0]);

  return (
    <section id="global" className="border-y border-white/10 bg-[#111827]/55 py-24">
      <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[560px] overflow-hidden rounded-mstry border border-white/10 bg-[#0A0A0A] p-4 shadow-luxury">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:54px_54px]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" role="img" aria-label="MSTRY global operations map">
            <defs>
              <linearGradient id="goldLine" x1="0" x2="1">
                <stop stopColor="#D4AF37" stopOpacity=".2" />
                <stop offset="1" stopColor="#D4AF37" stopOpacity=".85" />
              </linearGradient>
            </defs>
            <path d="M9 30 C22 14, 37 18, 49 34 S75 54, 91 29" fill="none" stroke="url(#goldLine)" strokeWidth=".35" strokeDasharray="1.4 1.4" />
            <path d="M14 21 C28 34, 43 30, 61 48 S79 45, 88 20" fill="none" stroke="url(#goldLine)" strokeWidth=".25" strokeDasharray="1 1.2" />
            <path d="M15 18 L28 15 L38 19 L33 27 L20 28 Z" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)" strokeWidth=".2" />
            <path d="M43 20 L55 18 L63 26 L58 37 L46 34 Z" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)" strokeWidth=".2" />
            <path d="M61 35 L76 31 L87 41 L82 52 L67 49 Z" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.16)" strokeWidth=".2" />
            <path d="M68 17 L88 19 L91 31 L77 35 L64 28 Z" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.16)" strokeWidth=".2" />
          </svg>
          {globalMarkets.map((market) => (
            <button
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-mstry-gold/60 bg-mstry-gold/20 p-2 backdrop-blur transition hover:scale-110 hover:bg-mstry-gold/35"
              key={market.region}
              style={{ left: `${market.x}%`, top: `${market.y}%` }}
              type="button"
              onMouseEnter={() => setActive(market)}
              onFocus={() => setActive(market)}
              aria-label={market.region}
            >
              <span className="block h-3 w-3 rounded-full bg-mstry-gold shadow-[0_0_22px_rgba(212,175,55,.8)]" />
            </button>
          ))}
          <motion.div
            className="absolute bottom-6 left-6 right-6 rounded-mstry border border-white/10 bg-black/75 p-6 backdrop-blur"
            key={active.region}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">Selected market</span>
            <strong className="mt-2 block font-display text-3xl text-white">{active.region}</strong>
            <p className="mt-2 text-sm leading-6 text-mstry-muted">{active.focus}</p>
          </motion.div>
        </div>
        <div>
          <SectionHeading
            eyebrow="Global operations"
            title="International support without fragmented coordination."
            body="MSTRY helps clients evaluate and coordinate opportunities across priority markets by connecting strategy, local requirements, professional relationships, partnerships, and operating follow-through into one management view."
          />
          <div className="grid gap-3">
            {globalMarkets.map((market) => (
              <button
                className={`rounded-mstry border p-4 text-left transition ${
                  active.region === market.region ? "border-mstry-gold bg-mstry-gold/10" : "border-white/10 bg-white/[.035] hover:border-mstry-gold/40"
                }`}
                key={market.region}
                onClick={() => setActive(market)}
                type="button"
              >
                <span className="font-black text-white">{market.region}</span>
                <span className="mt-1 block text-xs leading-5 text-mstry-muted">{market.focus}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-mstry border border-mstry-gold/20 bg-mstry-gold/10 p-5">
            <strong className="text-white">Strategic value</strong>
            <p className="mt-2 text-sm leading-6 text-mstry-muted">
              Clients gain a more controlled route into new markets, with fewer disconnected conversations and clearer accountability around execution.
            </p>
            <div className="mt-4">
              <Button href="/contact">Explore Strategic Opportunities</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
