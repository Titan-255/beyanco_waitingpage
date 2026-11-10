"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Share2,
  Home,
  Copy,
  Check,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { WaitlistNavbar } from "@/components/marketing/WaitlistNavbar";
import { WaitlistFooter } from "@/components/marketing/WaitlistFooter";

export default function FeedbackThankYouPage() {
  const [copied, setCopied] = useState(false);

  const waitlistUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://beyanco-waitingpage.vercel.app";

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Beyanco AI — Waitlist",
          text: "Furnish empty rooms with real, buyable furniture using AI. Join the Beyanco waitlist!",
          url: waitlistUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(waitlistUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#101827] overflow-x-hidden">
      <WaitlistNavbar />

      <main className="flex-1 py-10 sm:py-16 md:py-24 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6">

          {/* Official Beyanco Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/beyanco-logo.jpg"
              alt="Beyanco"
              className="h-12 sm:h-16 w-auto object-contain mix-blend-multiply"
            />
          </div>

          {/* Subtle Success Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm"
          >
            <CheckCircle2 className="w-8 h-8" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-serif font-bold text-[#101827] tracking-tight leading-tight"
          >
            Thank you!
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl font-medium text-[#101827] max-w-lg mx-auto leading-relaxed"
          >
            You’re helping shape Beyanco. We’ll keep you posted.
          </motion.p>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-sm sm:text-base text-[#626A75] max-w-lg mx-auto leading-relaxed"
          >
            Your feedback will help us understand what matters most and build a better furniture shopping experience.
          </motion.p>

          {/* Next Steps & Action Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-6 sm:p-8 rounded-[24px] bg-white border border-[#D8D5CF] shadow-architectural text-left space-y-5"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#A98460] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#101827]">
                  What happens next?
                </h3>
                <p className="text-xs text-[#626A75] leading-relaxed mt-1">
                  Our product team will evaluate all responses to prioritize upcoming spatial features, local store integrations, and early-access invitations.
                </p>
              </div>
            </div>

            {/* Direct Contact from user prompt */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF]/70 text-xs text-[#626A75] space-y-1">
              <div className="font-semibold text-[#101827] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#A98460]" />
                <span>Founding Team Direct Contact:</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[13px]">
                <span>
                  Akash: <a href="tel:+918189833313" className="font-mono text-[#A98460] font-semibold hover:underline">+91 8189833313</a>
                </span>
                <span>
                  Tarun: <a href="tel:+916380644305" className="font-mono text-[#A98460] font-semibold hover:underline">+91 6380644305</a>
                </span>
              </div>
            </div>

            {/* Share and Return Actions */}
            <div className="pt-4 border-t border-[#D8D5CF]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#101827] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A98460] transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>SHARE BEYANCO WITH FRIENDS</span>
                  </>
                )}
              </button>

              {/* Homepage Link */}
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FAF8F5] border border-[#D8D5CF] text-[#101827] text-xs font-semibold uppercase tracking-wider hover:border-[#101827] transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-[#A98460]" />
                <span>Return to Homepage</span>
              </Link>
            </div>

            {copied && (
              <p className="text-[11px] text-center text-emerald-600 font-medium pt-1">
                Waitlist link copied to your clipboard! Share it with friends and colleagues.
              </p>
            )}
          </motion.div>

        </div>
      </main>

      <WaitlistFooter />
    </div>
  );
}
