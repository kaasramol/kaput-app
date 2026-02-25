import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import {
  JsonLd,
  websiteSchema,
  organizationSchema,
  localBusinessSchema,
} from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaput.ca"),
  title: {
    default: "Kaput — Find Trusted Mechanics in Vancouver | Compare Quotes & Book Online",
    template: "%s | Kaput",
  },
  description:
    "Find verified mechanics near you in Vancouver. Compare transparent quotes side-by-side, book appointments online, chat directly with your mechanic, and pay securely — all in one place. Save an average of $350 per repair.",
  keywords: [
    "car mechanic Vancouver",
    "auto repair Vancouver",
    "mechanic near me",
    "car repair quotes",
    "book mechanic online",
    "compare mechanic prices",
    "trusted auto repair",
    "mobile mechanic Vancouver",
    "brake repair Vancouver",
    "oil change Vancouver",
    "engine diagnostic Vancouver",
    "transmission repair Vancouver",
    "car maintenance Vancouver",
    "affordable mechanic",
    "verified mechanic reviews",
    "transparent car repair pricing",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://kaput.ca",
    siteName: "Kaput",
    title: "Kaput — Find Trusted Mechanics in Vancouver",
    description:
      "Compare transparent quotes from verified mechanics, book online, and pay securely. Trusted by car owners across Vancouver.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaput — Find Trusted Mechanics in Vancouver",
    description:
      "Compare transparent quotes from verified mechanics, book online, and pay securely.",
  },
  alternates: {
    canonical: "https://kaput.ca",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
        <JsonLd data={localBusinessSchema} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
