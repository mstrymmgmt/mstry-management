import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: "MSTRY MANAGEMENT | Global Management, Consulting and Strategic Execution",
    template: "%s | MSTRY MANAGEMENT"
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url)
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/videos/mstry-hero-poster.svg" />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
