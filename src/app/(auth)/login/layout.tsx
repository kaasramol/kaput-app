import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In — Kaput",
  description:
    "Log in to your Kaput account to find mechanics, manage bookings, and track your car repairs in Vancouver.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://kaput.ca/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
