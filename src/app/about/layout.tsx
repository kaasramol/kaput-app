import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Kaput — Making Car Repair Fair & Transparent in Vancouver",
  description:
    "Learn how Kaput is connecting Vancouver car owners with trusted, verified mechanics. Transparent pricing, real reviews, and a seamless booking experience.",
  keywords: [
    "about Kaput",
    "car repair Vancouver",
    "trusted mechanics Vancouver",
    "transparent auto repair",
    "mechanic marketplace",
  ],
  openGraph: {
    title: "About Kaput — Making Car Repair Fair & Transparent",
    description:
      "Learn how Kaput is connecting Vancouver car owners with trusted, verified mechanics.",
    url: "https://kaput.ca/about",
    type: "website",
  },
  alternates: {
    canonical: "https://kaput.ca/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
