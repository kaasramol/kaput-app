"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, HelpCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const plans = [
  {
    name: "Starter",
    price: 49,
    description: "Perfect for independent mechanics just getting started.",
    features: [
      "Business profile listing",
      "Up to 10 quote requests/month",
      "Basic calendar & booking",
      "In-app messaging",
      "Secure Stripe payments",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: 99,
    description: "For established shops ready to grow their customer base.",
    features: [
      "Everything in Starter",
      "Unlimited quote requests",
      "Priority listing in search results",
      "Full analytics dashboard",
      "Portfolio & certification badges",
      "Push notifications",
      "Review management tools",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For multi-location shops and high-volume operations.",
    features: [
      "Everything in Professional",
      "Multiple location support",
      "Team member accounts",
      "Advanced analytics & reporting",
      "Custom branding on profile",
      "API access",
      "Dedicated account manager",
      "Phone support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes! Every plan comes with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.",
  },
  {
    q: "How do I get paid?",
    a: "Customer payments are processed through Stripe and deposited directly into your bank account. Payouts happen within 2-3 business days.",
  },
  {
    q: "What percentage does Kaput take?",
    a: "Kaput charges a flat monthly subscription — we don't take a cut of your jobs. Standard Stripe processing fees apply (2.9% + 30¢).",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no long-term contracts. Cancel your subscription at any time and you'll retain access until the end of your billing period.",
  },
  {
    q: "What happens if I exceed my quote limit on Starter?",
    a: "We'll notify you when you're approaching your limit. You can upgrade to Professional at any time for unlimited quote requests.",
  },
];

export default function Pricing() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold uppercase tracking-wider text-accent"
            >
              Pricing
            </motion.span>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-3 text-4xl font-extrabold text-text-primary sm:text-5xl"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mx-auto mt-4 max-w-xl text-lg text-text-secondary"
            >
              No hidden fees. No commission on your jobs. Just a flat monthly
              subscription to grow your business.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid gap-6 lg:grid-cols-3"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                    : "border-border bg-bg-card"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-semibold text-text-primary">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-text-primary">
                    ${plan.price}
                  </span>
                  <span className="text-text-muted">/month</span>
                </div>

                <Link
                  href="/signup"
                  className={`mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-accent text-white hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
                      : "border border-border text-text-primary hover:border-text-muted"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          plan.highlighted ? "text-accent" : "text-success"
                        }`}
                      />
                      <span className="text-sm text-text-secondary">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-bg-secondary py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2"
            >
              <HelpCircle className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                FAQ
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-3 text-3xl font-bold text-text-primary"
            >
              Frequently asked questions
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mt-12 space-y-6"
          >
            {faqs.map((faq) => (
              <motion.div
                key={faq.q}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-border bg-bg-card p-6"
              >
                <h3 className="text-base font-semibold text-text-primary">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
