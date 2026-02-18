"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  TrendingUp,
  CreditCard,
  Star,
  Bell,
  BarChart3,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const benefits = [
  {
    icon: Users,
    title: "Reach New Customers",
    description:
      "Get discovered by car owners actively searching for mechanics in your area. No more relying solely on word-of-mouth.",
  },
  {
    icon: CalendarCheck,
    title: "Streamlined Bookings",
    description:
      "Receive quote requests and manage your entire calendar online. No more missed calls or double-bookings.",
  },
  {
    icon: CreditCard,
    title: "Guaranteed Payments",
    description:
      "All payments are processed securely through Stripe. Get paid on time, every time, directly to your account.",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Track your earnings, view customer trends, and make data-driven decisions with your mechanic dashboard.",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description:
      "Collect verified reviews from real customers. Showcase your certifications, portfolio, and expertise.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description:
      "Chat with customers in real time. Discuss repairs, share updates, and request approvals for extra work.",
  },
];

const dashboardFeatures = [
  "Incoming quote requests with details & photos",
  "Calendar view for all upcoming appointments",
  "Earnings overview and payout tracking",
  "Customer history and repeat client data",
  "Review management and response tools",
  "Real-time push notifications for new requests",
];

export default function ForMechanics() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-accent/8 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-light"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Grow Your Business
            </motion.span>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
            >
              Fill your bays.
              <br />
              <span className="text-accent">Grow your shop.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary"
            >
              Join Kaput and connect with car owners in Vancouver who are
              actively looking for trusted mechanics. Get quote requests, manage
              bookings, and get paid — all from one dashboard.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/signup"
                className="group flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
              >
                List Your Shop
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-border px-8 text-base font-semibold text-text-secondary transition-colors hover:border-text-muted hover:text-text-primary"
              >
                See Pricing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
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
              Why Kaput
            </motion.span>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl"
            >
              Everything your shop needs to thrive
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {benefits.map((b) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="group rounded-2xl border border-border bg-bg-card p-8 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-text-primary">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {b.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.span
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="text-sm font-semibold uppercase tracking-wider text-accent"
              >
                Your Dashboard
              </motion.span>
              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl"
              >
                Run your shop from
                <br /> one place
              </motion.h2>
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="mt-4 text-text-secondary"
              >
                Your Kaput dashboard gives you everything you need to manage
                requests, schedule appointments, track earnings, and
                communicate with customers.
              </motion.p>

              <motion.ul
                variants={stagger}
                className="mt-8 space-y-3"
              >
                {dashboardFeatures.map((feature) => (
                  <motion.li
                    key={feature}
                    variants={fadeUp}
                    transition={{ duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                    <span className="text-sm text-text-secondary">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Dashboard Mock */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border bg-bg-card p-6"
            >
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <div className="h-3 w-3 rounded-full bg-error" />
                <div className="h-3 w-3 rounded-full bg-warning" />
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="ml-2 text-xs text-text-muted">
                  Kaput Mechanic Dashboard
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-bg-elevated p-4">
                  <p className="text-xs text-text-muted">This Month</p>
                  <p className="mt-1 text-2xl font-bold text-text-primary">$8,420</p>
                  <p className="mt-1 text-xs text-success">+12% from last month</p>
                </div>
                <div className="rounded-xl bg-bg-elevated p-4">
                  <p className="text-xs text-text-muted">Open Requests</p>
                  <p className="mt-1 text-2xl font-bold text-accent">7</p>
                  <p className="mt-1 text-xs text-text-muted">3 new today</p>
                </div>
                <div className="rounded-xl bg-bg-elevated p-4">
                  <p className="text-xs text-text-muted">Rating</p>
                  <p className="mt-1 text-2xl font-bold text-warning">4.9</p>
                  <p className="mt-1 text-xs text-text-muted">142 reviews</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { service: "Brake Pad Replacement", car: "2019 Honda Civic", time: "2h ago" },
                  { service: "Oil Change + Filter", car: "2021 Toyota RAV4", time: "4h ago" },
                  { service: "Engine Diagnostic", car: "2018 BMW 328i", time: "6h ago" },
                ].map((req) => (
                  <div
                    key={req.service}
                    className="flex items-center justify-between rounded-xl bg-bg-elevated p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {req.service}
                      </p>
                      <p className="text-xs text-text-muted">{req.car}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted">{req.time}</span>
                      <Bell className="h-4 w-4 text-accent" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-bg-secondary py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-text-primary sm:text-4xl"
            >
              Start getting customers today
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-4 text-text-secondary"
            >
              Create your profile, set your services and pricing, and start
              receiving quote requests from car owners in Vancouver.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                href="/signup"
                className="group flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
              >
                Sign Up as a Mechanic
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="flex h-12 items-center gap-2 rounded-full border border-border px-8 text-base font-semibold text-text-secondary transition-colors hover:border-text-muted hover:text-text-primary"
              >
                View Pricing Plans
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
