"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Home,
  Sparkles,
  ShieldCheck,
  Building,
  Mail,
} from "lucide-react";
import { WaitlistNavbar } from "@/components/marketing/WaitlistNavbar";
import { WaitlistFooter } from "@/components/marketing/WaitlistFooter";
import { WaitlistInlineForm } from "@/components/waitlist/WaitlistInlineForm";

export default function FeedbackThankYouPage() {
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#101827]">
      <WaitlistNavbar />

      <main className="flex-1 py-16 md:py-28 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Subtle Success Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-sm"
          >
            <CheckCircle2 className="w-8 h-8" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-serif font-bold text-[#101827] tracking-tight leading-tight"
          >
            Your Opinion Matters.
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#626A75] max-w-lg mx-auto mt-4 leading-relaxed"
          >
            Thank you for helping shape Beyanco. Your feedback will help us understand what matters most to the people who may use it.
          </motion.p>

          {/* Summary Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 p-8 rounded-[24px] bg-white border border-[#D8D5CF] shadow-architectural text-left space-y-4"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#A98460] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#101827]">
                  What happens next?
                </h3>
                <p className="text-xs text-[#626A75] leading-relaxed mt-1">
                  Our engineering and design teams will review your feature rankings and workflow insights. If you expressed interest in early testing or a short discussion, we will contact you personally as cohorts unlock.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D8D5CF]/60 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#101827] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A98460] transition-colors shadow-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Homepage</span>
              </Link>

              {!showWaitlistForm && (
                <button
                  type="button"
                  onClick={() => setShowWaitlistForm(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A98460] hover:text-[#101827] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Not on the waitlist yet? Register here</span>
                </button>
              )}
            </div>

            {/* Optional Waitlist Registration if user skipped email in survey */}
            {showWaitlistForm && (
              <div className="pt-6 border-t border-[#D8D5CF]/60">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A98460] block mb-2">
                  Direct Waitlist Registration
                </span>
                <WaitlistInlineForm source="thank_you_page" compact />
              </div>
            )}
          </motion.div>

          <p className="text-xs text-[#94A3B8] mt-8">
            Beyanco AI • Architectural Interior Transformation
          </p>
        </div>
      </main>

      <WaitlistFooter />
    </div>
  );
}
