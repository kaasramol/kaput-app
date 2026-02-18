"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Target,
  Eye,
  Users,
  Shield,
  Lightbulb,
  ArrowRight,
  MapPin,
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

const values = [
  {
    icon: Shield,
    title: "Trust First",
    description:
      "We verify mechanics, moderate reviews, and ensure transparent pricing. Trust is the foundation of every interaction on Kaput.",
  },
  {
    icon: Heart,
    title: "Customer Obsession",
    description:
      "We build for both car owners and mechanics. When both sides succeed, the whole platform thrives.",
  },
  {
    icon: Lightbulb,
    title: "Radical Simplicity",
    description:
      "Car repair is already stressful. We obsess over making every step — from search to payment — as simple as possible.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Kaput is built on real relationships between real people. We're strengthening the bond between Vancouver car owners and local shops.",
  },
];

const timeline = [
  {
    label: "The Problem",
    description:
      "Finding a trustworthy mechanic in Vancouver meant relying on word-of-mouth, calling around for quotes, and hoping for the best.",
  },
  {
    label: "The Idea",
    description:
      "What if you could search for mechanics on a map, get quotes from multiple shops, compare them side-by-side, and book in minutes?",
  },
  {
    label: "The Build",
    description:
      "We talked to hundreds of car owners and mechanics in Vancouver to understand exactly what both sides need.",
  },
  {
    label: "The Launch",
    description:
      "Kaput launched in Vancouver with a simple mission: make car repair transparent, convenient, and fair for everyone.",
  },
];

export default function About() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              <MapPin className="h-3.5 w-3.5" />
              Vancouver, BC
            </motion.span>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl"
            >
              We&apos;re making car repair
              <br />
              <span className="text-accent">fair and transparent.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary"
            >
              Kaput was born out of a simple frustration: getting your car fixed
              shouldn&apos;t feel like a gamble. We&apos;re building the
              platform we wish existed when our own cars broke down.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="border-t border-border bg-bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid gap-12 md:grid-cols-2"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border bg-bg-card p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-text-primary">
                Our Mission
              </h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                To connect every car owner in Vancouver with a trusted mechanic
                through transparent pricing, verified reviews, and a seamless
                booking experience. No guesswork. No surprises.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border bg-bg-card p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-text-primary">
                Our Vision
              </h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                A world where car repair is as easy as booking a restaurant.
                Where mechanics are valued for their expertise and car owners
                can make informed decisions with confidence.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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
              Our Story
            </motion.span>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl"
            >
              How Kaput came to be
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mt-16 space-y-8"
          >
            {timeline.map((item, index) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="mt-2 h-full w-px bg-border" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {item.label}
                  </h3>
                  <p className="mt-2 leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
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
              Our Values
            </motion.span>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl"
            >
              What drives us
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mt-16 grid gap-6 sm:grid-cols-2"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-bg-card p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-text-primary">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-24">
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
              Got questions? Let&apos;s talk.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-4 text-text-secondary"
            >
              Whether you&apos;re a car owner, a mechanic, or just curious about
              Kaput — we&apos;d love to hear from you.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <Link
                href="mailto:hello@kaput.ca"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
              >
                Get In Touch
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
