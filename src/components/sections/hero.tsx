"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/sections/animated-counter";
import { companyFootprint, executiveMetrics, siteConfig } from "@/config/site";

const heroStats = executiveMetrics.slice(0, 4);
const commandRows = [
  ["Clarify the mandate", "We define the objective, decision context, stakeholders, constraints, and commercial value before work begins."],
  ["Build the operating model", "We structure the cadence, responsibilities, reporting, partners, and execution path around the goal."],
  ["Coordinate execution", "We manage the follow-through across workflows, relationships, vendors, documents, and delivery milestones."],
  ["Create visible progress", "Leadership receives clearer priorities, controlled movement, and a stronger route toward measurable outcomes."]
];

const HERO_VIDEO_START_SECONDS = 0;
const DESKTOP_HERO_VIDEO = "/videos/mstry-hero-desktop.mp4";
const MOBILE_HERO_VIDEO = "/videos/mstry-hero-mobile.mp4";

function InvestmentCounter() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 9000;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * 265);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <>{value.toFixed(1)}M+</>;
}

export function Hero() {
  const introRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroVideoMode, setHeroVideoMode] = useState<"desktop" | "mobile" | null>(null);
  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ["start start", "end start"]
  });
  const videoOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.82, 0]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const heroVideoSource = heroVideoMode === "mobile" ? MOBILE_HERO_VIDEO : DESKTOP_HERO_VIDEO;
  const heroVideoStart = heroVideoMode === "mobile" ? 0 : HERO_VIDEO_START_SECONDS;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMode = () => setHeroVideoMode(mediaQuery.matches ? "mobile" : "desktop");

    updateMode();
    mediaQuery.addEventListener("change", updateMode);
    return () => mediaQuery.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !heroVideoMode) return;

    const startFromGlobe = () => {
      if (heroVideoStart > 0 && video.currentTime < heroVideoStart - 0.05) {
        video.currentTime = heroVideoStart;
      }
      void video.play().catch(() => undefined);
    };

    const revealVideoFromGlobe = () => {
      if (heroVideoStart > 0 && video.currentTime < heroVideoStart - 0.05) {
        video.currentTime = heroVideoStart;
      }
      void video.play().catch(() => undefined);
    };

    const loopFromGlobe = () => {
      if (video.duration && video.currentTime >= video.duration - 0.18) {
        video.currentTime = heroVideoStart;
        void video.play().catch(() => undefined);
      }
    };

    video.addEventListener("loadedmetadata", startFromGlobe);
    video.addEventListener("canplay", revealVideoFromGlobe);
    video.addEventListener("seeked", revealVideoFromGlobe);
    video.addEventListener("timeupdate", loopFromGlobe);
    video.addEventListener("ended", startFromGlobe);
    startFromGlobe();

    return () => {
      video.removeEventListener("loadedmetadata", startFromGlobe);
      video.removeEventListener("canplay", revealVideoFromGlobe);
      video.removeEventListener("seeked", revealVideoFromGlobe);
      video.removeEventListener("timeupdate", loopFromGlobe);
      video.removeEventListener("ended", startFromGlobe);
    };
  }, [heroVideoMode, heroVideoStart]);

  return (
    <section id="home" className="relative overflow-hidden border-b border-white/10 bg-[#0A0A0A]">
      <div ref={introRef} className="relative h-screen min-h-[760px] overflow-hidden">
        <motion.div className="pointer-events-none absolute inset-0 z-0 bg-[#0A0A0A]" style={{ opacity: videoOpacity, y: videoY }}>
          {heroVideoMode ? (
            <video
              aria-label="MSTRY global management animation"
              autoPlay
              className="h-full w-full object-cover"
              key={heroVideoMode}
              loop
              muted
              playsInline
              preload="auto"
              ref={videoRef}
              src={`${heroVideoSource}${heroVideoStart > 0 ? `#t=${heroVideoStart}` : ""}`}
            />
          ) : null}
          <div aria-hidden="true" className="hero-globe-light absolute inset-0" />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(10,10,10,.02)_0%,rgba(10,10,10,.10)_54%,rgba(10,10,10,.78)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,.08),transparent_38%)]" />
        <motion.div
          className="pointer-events-none relative z-[5] mx-auto flex h-full w-[min(1320px,calc(100%_-_40px))] items-end justify-between gap-6 pb-8 sm:pb-10 lg:pb-14"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <div className="rounded-mstry border border-mstry-gold/25 bg-[#0A0A0A]/62 p-5 shadow-luxury backdrop-blur-md sm:p-6">
            <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/62">Global Investment Activity</span>
            <strong className="mt-2 block font-display text-[clamp(2.6rem,7vw,5.4rem)] font-black leading-none text-mstry-gold drop-shadow-[0_0_18px_rgba(212,175,55,.22)]">
              $<InvestmentCounter />
            </strong>
            <div className="mt-4 text-center">
              <p className="font-display text-[clamp(1.05rem,3vw,1.45rem)] font-semibold leading-tight text-white/82">
                From London to the World
              </p>
              <div className="mt-2 flex items-center justify-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-transparent to-mstry-gold/70 sm:w-14" />
                <span className="text-[10px] font-black uppercase tracking-[0.34em] text-mstry-gold/90 sm:text-[11px]">
                  Since {companyFootprint.operatingSince}
                </span>
                <span aria-hidden="true" className="h-px w-10 bg-gradient-to-l from-transparent to-mstry-gold/70 sm:w-14" />
              </div>
            </div>
          </div>
          <div className="hidden w-fit items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/55 sm:inline-flex">
            <span className="h-px w-10 bg-mstry-gold" />
            Scroll to enter
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-[#0A0A0A] py-14 sm:py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,.032)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.032)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_82%_12%,rgba(212,175,55,.10),transparent_34%)]" />
        <div className="relative z-10 mx-auto grid w-[min(1320px,calc(100%_-_40px))] gap-10 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">Premium management, consulting, partnerships and execution</p>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.375rem,12vw,3.875rem)] font-black leading-[.96] text-white sm:text-[clamp(3rem,6vw,6.5rem)] sm:leading-[.95]">
              Build, manage, and scale with a private execution partner.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-mstry-muted sm:text-lg sm:leading-8">
              MSTRY MANAGEMENT helps founders, investors, companies, sports organizations, talent, and international operators turn important objectives into structured strategy, managed execution, strategic partnerships, business development, and operational control.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/book-consultation">Request a Strategic Review</Button>
              <Button href="/#proof" variant="ghost">Explore Management Solutions</Button>
            </div>
            <a className="mt-5 inline-flex font-black text-mstry-gold" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-mstry border border-mstry-gold/15 bg-[#111827]/92 p-4 shadow-luxury backdrop-blur-md sm:p-7"
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(212,175,55,.12),transparent_32%)]" />
            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-mstry-gold/15 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">How MSTRY creates value</p>
                  <h2 className="mt-3 max-w-xl font-display text-[clamp(2rem,8.5vw,3rem)] font-black leading-tight text-white sm:text-4xl">
                    Senior thinking and disciplined follow-through in one engagement model.
                  </h2>
                </div>
                <div className="rounded-mstry border border-mstry-gold/25 bg-[#0B0B0B] px-4 py-3 text-right">
                  <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-mstry-muted">Inquiry path</span>
                  <strong className="mt-1 block text-mstry-gold">Strategic Review</strong>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {commandRows.map(([title, body], index) => (
                  <motion.div
                    className="rounded-mstry border border-white/10 bg-[#0A0A0A]/70 p-3.5 sm:p-4"
                    key={title}
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.15 + index * 0.07 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-black uppercase tracking-[0.18em] text-mstry-gold">0{index + 1}</span>
                        <h3 className="mt-2 font-display text-xl font-black text-white">{title}</h3>
                      </div>
                      <span className="rounded-full border border-mstry-gold/25 px-3 py-1 text-xs font-black text-mstry-gold">Client value</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-mstry-muted">{body}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Management", "Consulting", "Partnerships"].map((item) => (
                  <div className="rounded-mstry border border-mstry-gold/15 bg-mstry-gold/10 p-4 text-center" key={item}>
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-mstry-gold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto mt-12 grid w-[min(1320px,calc(100%_-_40px))] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((metric, index) => (
            <motion.article
              className="rounded-mstry border border-white/10 bg-[#111827]/72 p-5"
              key={metric.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <strong className="block text-4xl text-mstry-gold">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} decimals={metric.value % 1 ? 1 : 0} />
              </strong>
              <span className="mt-3 block font-black text-white">{metric.label}</span>
              <p className="mt-2 text-sm leading-6 text-mstry-muted">{metric.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
