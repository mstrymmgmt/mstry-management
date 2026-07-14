"use client";

import { motion } from "framer-motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
};

export function SectionHeading({ eyebrow, title, body }: SectionHeadingProps) {
  return (
    <motion.div
      className="mb-8 flex flex-col gap-4 sm:mb-9 md:flex-row md:items-end md:justify-between"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-mstry-gold sm:text-xs sm:tracking-[0.22em]">{eyebrow}</p>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2rem,9vw,3rem)] leading-[1.06] text-mstry-silver md:text-6xl">
          {title}
        </h2>
      </div>
      {body ? <p className="max-w-xl text-sm leading-7 text-mstry-muted sm:text-base">{body}</p> : null}
    </motion.div>
  );
}
