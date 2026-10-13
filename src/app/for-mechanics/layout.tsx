import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "List Your Auto Shop on Kaput — Get More Customers in Vancouver",
  description:
    "Join Kaput and reach car owners actively searching for mechanics in Vancouver. Manage bookings, receive quote requests, get paid securely, and grow your auto repair business.",
  keywords: [
    "list mechanic shop Vancouver",
    "auto repair business growth",
    "mechanic booking platform",
    "get more auto repair customers",
    "mechanic marketplace Vancouver",
    "auto shop marketing",
  ],
  openGraph: {
    title: "Grow Your Auto Shop with Kaput",
    description:
      "Join Kaput and reach car owners actively searching for mechanics in Vancouver. Manage bookings, get paid securely.",
    url: `${SITE_URL}/for-mechanics`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/for-mechanics`,
  },
};

export default function ForMechanicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
