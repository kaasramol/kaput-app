import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaput — Your Car Is Kaput? We've Got You.",
  description:
    "Find trusted mechanics in Vancouver. Get quotes, compare prices, book appointments, and pay — all in one place.",
  keywords: [
    "car mechanic",
    "auto repair",
    "Vancouver",
    "mechanic near me",
    "car repair quotes",
    "book mechanic",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
