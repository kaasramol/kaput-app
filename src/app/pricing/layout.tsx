import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Kaput Mechanic Plans | No Commission, Flat Monthly Fee",
  description:
    "Simple, transparent pricing for auto shops on Kaput. No commission on your jobs — just a flat monthly subscription starting at $49/month. 14-day free trial included.",
  keywords: [
    "mechanic platform pricing",
    "auto shop subscription",
    "Kaput pricing",
    "mechanic booking cost",
    "auto repair platform fees",
  ],
  openGraph: {
    title: "Kaput Pricing — Simple Plans for Auto Shops",
    description:
      "No commission, no hidden fees. Flat monthly subscription starting at $49/month with a 14-day free trial.",
    url: "https://kaput.ca/pricing",
    type: "website",
  },
  alternates: {
    canonical: "https://kaput.ca/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
