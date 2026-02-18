"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  MessageSquare,
  Shield,
  Star,
  Clock,
  CreditCard,
  Search,
  FileText,
  CalendarCheck,
  Wrench,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

/* ───────────────────────────── Hero ───────────────────────────── */
function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-light">
              <MapPin className="h-3.5 w-3.5" />
              Now serving Vancouver, BC
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-8 text-5xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-6xl lg:text-7xl"
          >
            Your car is kaput?
            <br />
            <span className="text-accent">We&apos;ve got you.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl"
          >
            Find trusted mechanics near you, compare transparent quotes
            side-by-side, book appointments, and pay — all in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/signup"
              className="group flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
            >
              Find a Mechanic
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/for-mechanics"
              className="flex h-12 items-center gap-2 rounded-full border border-border px-8 text-base font-semibold text-text-secondary transition-colors hover:border-text-muted hover:text-text-primary"
            >
              I&apos;m a Mechanic
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
          >
            {/* Avatars */}
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-bg-elevated text-xs font-bold text-text-muted"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center gap-1 sm:justify-start">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-warning text-warning"
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-text-muted">
                Trusted by car owners across Vancouver
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Features ─────────────────────────── */
const features = [
  {
    icon: MapPin,
    title: "Map-Based Search",
    description:
      "Find mechanics near you on an interactive map. Filter by service type, distance, rating, and availability.",
  },
  {
    icon: FileText,
    title: "Transparent Quotes",
    description:
      "Get itemized quotes with parts, labor, and taxes broken down. Compare side-by-side from multiple shops.",
  },
  {
    icon: Shield,
    title: "Verified Mechanics",
    description:
      "Every mechanic is vetted with verified certifications, real reviews, and portfolio photos of past work.",
  },
  {
    icon: MessageSquare,
    title: "In-App Chat",
    description:
      "Communicate directly with your mechanic. Ask questions, share photos, and get updates in real time.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description:
      "Book immediately or schedule at your convenience. Get appointment confirmations and reminders.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Pay through the platform with Stripe. Get itemized receipts and never worry about surprise charges.",
  },
];

function Features() {
  return (
    <section id="features" className="border-t border-border bg-bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wider text-accent"
          >
            Features
          </motion.span>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl"
          >
            Everything you need to get
            <br className="hidden sm:block" /> your car fixed right
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-4 max-w-2xl text-text-secondary"
          >
            From finding a mechanic to paying for the repair, Kaput handles
            every step of the process.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="group rounded-2xl border border-border bg-bg-card p-8 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-text-primary">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── How It Works ──────────────────────── */
const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search & Discover",
    description:
      "Open the map and find mechanics near you. Browse profiles, read reviews, and check certifications.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Request Quotes",
    description:
      "Describe your issue, upload photos, and send a quote request. Multiple mechanics respond with itemized pricing.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Compare & Book",
    description:
      "Compare quotes side-by-side. Pick the best offer and book an appointment that fits your schedule.",
  },
  {
    number: "04",
    icon: Wrench,
    title: "Get It Fixed",
    description:
      "Drop off your car, stay updated via chat, approve any extra work, and pay securely through the platform.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wider text-accent"
          >
            How It Works
          </motion.span>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl"
          >
            Four simple steps to a
            <br className="hidden sm:block" /> stress-free repair
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="relative text-center"
            >
              <span className="text-6xl font-extrabold text-bg-elevated">
                {step.number}
              </span>
              <div className="mt-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <step.icon className="h-7 w-7" />
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────── Testimonials ─────────────────────────── */
const testimonials = [
  {
    name: "Sarah M.",
    role: "Car Owner",
    quote:
      "I saved over $400 by comparing quotes from three different shops. The whole process took less than an hour.",
    rating: 5,
  },
  {
    name: "Dave's Auto Repair",
    role: "Mechanic Shop",
    quote:
      "Kaput brought us 15 new customers in the first month. The booking system saves us hours of phone calls every week.",
    rating: 5,
  },
  {
    name: "Michael T.",
    role: "Car Owner",
    quote:
      "Being able to chat directly with the mechanic and approve extra work from my phone gave me total peace of mind.",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section className="border-t border-border bg-bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wider text-accent"
          >
            Testimonials
          </motion.span>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl"
          >
            Loved by car owners
            <br className="hidden sm:block" /> and mechanics alike
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border bg-bg-card p-8"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-warning text-warning"
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated text-sm font-bold text-text-muted">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {t.name}
                  </p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────── Stats Section ────────────────────────── */
const stats = [
  { value: "200+", label: "Verified Mechanics" },
  { value: "10K+", label: "Quotes Compared" },
  { value: "4.8", label: "Average Rating" },
  { value: "$350", label: "Avg. Savings Per Repair" },
];

function Stats() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-4xl font-extrabold text-accent">{stat.value}</p>
              <p className="mt-2 text-sm text-text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── Final CTA ──────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="relative overflow-hidden rounded-3xl bg-accent px-8 py-20 text-center sm:px-16"
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="relative text-3xl font-bold text-white sm:text-4xl"
          >
            Ready to find your mechanic?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="relative mx-auto mt-4 max-w-xl text-lg text-blue-100"
          >
            Join thousands of Vancouver car owners who save time and money with
            Kaput. Sign up for free and get your first quote in minutes.
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="relative mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/signup"
              className="group flex h-12 items-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-accent transition-all hover:bg-blue-50"
            >
              Get Started Free
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/for-mechanics"
              className="flex h-12 items-center gap-2 rounded-full border border-white/30 px-8 text-base font-semibold text-white transition-colors hover:border-white/60"
            >
              List Your Shop
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────── Page ───────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </>
  );
}
