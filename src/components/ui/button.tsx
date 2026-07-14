import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "gold" | "ghost";
  className?: string;
};

export function Button({ href, children, variant = "gold", className }: ButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-mstry border px-5 text-center text-sm font-black transition duration-200 hover:-translate-y-0.5 sm:w-auto",
        variant === "gold"
          ? "border-mstry-gold bg-mstry-gold text-black hover:bg-[#C19D2C]"
          : "border-white/15 bg-transparent text-mstry-silver hover:border-mstry-gold/60",
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
