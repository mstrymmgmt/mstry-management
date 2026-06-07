"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  decimals?: number;
};

export function AnimatedCounter({ value, suffix = "", decimals = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 24, stiffness: 90 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
    return unsubscribe;
  }, [decimals, spring]);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return (
    <motion.span ref={ref} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {display}
      {suffix}
    </motion.span>
  );
}
