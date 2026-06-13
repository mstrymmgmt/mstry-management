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
        <link rel="preload" as="video" href="/videos/mstry-hero-desktop.mp4" type="video/mp4" media="(min-width: 768px)" />
        <link rel="preload" as="video" href="/videos/mstry-hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
