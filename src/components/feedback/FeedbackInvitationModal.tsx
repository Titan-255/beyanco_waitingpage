"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, MessageSquareQuote } from "lucide-react";

const STORAGE_KEY = "beyanco_feedback_popup_shown";
const ACTIVE_BROWSING_TARGET_MS = 15000; // 15 seconds

export function FeedbackInvitationModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const dismissModal = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage errors in restricted iframe/incognito
    }
    setIsOpen(false);
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, []);

  // 15-second active browsing tracking
  useEffect(() => {
    // Check if already shown in this browser session
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "true") {
        return;
      }
    } catch {
      return;
    }

    let accumulatedActiveMs = 0;
    let lastActiveTimestamp: number | null =
      document.visibilityState === "visible" ? Date.now() : null;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        if (lastActiveTimestamp !== null) {
          accumulatedActiveMs += now - lastActiveTimestamp;
        }
        lastActiveTimestamp = now;

        if (accumulatedActiveMs >= ACTIVE_BROWSING_TARGET_MS) {
          try {
            sessionStorage.setItem(STORAGE_KEY, "true");
          } catch {
            // Ignore
          }
          previousActiveElement.current = document.activeElement as HTMLElement;
          setIsOpen(true);
          window.clearInterval(intervalId);
        }
      } else {
        lastActiveTimestamp = null;
      }
    }, 500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        lastActiveTimestamp = Date.now();
      } else {
        if (lastActiveTimestamp !== null) {
          accumulatedActiveMs += Date.now() - lastActiveTimestamp;
        }
        lastActiveTimestamp = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Keyboard accessibility: Escape key to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismissModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dismissModal]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // Auto-focus modal container for screen reader and keyboard accessibility
      modalRef.current?.focus();
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleCtaClick = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore
    }
    setIsOpen(false);
    router.push("/feedback");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Subtle Translucent Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismissModal}
            className="fixed inset-0 bg-[#101827]/60 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Centered Editorial Modal Card */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-dialog-title"
            aria-describedby="feedback-dialog-description"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#FAF8F5] rounded-[28px] border border-[#D8D5CF] p-7 sm:p-9 md:p-10 shadow-[0_25px_60px_-15px_rgba(16,24,39,0.3)] text-center my-auto z-10 focus:outline-none"
          >
            {/* Top-Right Dismiss Icon (X) */}
            <button
              type="button"
              onClick={dismissModal}
              aria-label="Close feedback modal"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#101827] flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A98460]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* TOP: Eyebrow label with subtle architectural accent */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101827]/5 border border-[#101827]/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A98460]" />
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#101827]">
                A Quick Note From Beyanco
              </span>
            </div>

            {/* MIDDLE: Editorial Serif Heading */}
            <h2
              id="feedback-dialog-title"
              className="text-2xl sm:text-3xl font-serif font-bold text-[#101827] tracking-tight leading-snug mb-4"
            >
              Your Opinion Means a Lot to Us.
            </h2>

            {/* Supporting Paragraph */}
            <div
              id="feedback-dialog-description"
              className="text-sm sm:text-[14.5px] text-[#626A75] leading-relaxed space-y-3 mb-6"
            >
              <p>
                We&apos;re building Beyanco to rethink how people visualize and design spaces. But the best ideas come from the people who might actually use it.
              </p>
              <p>
                Take a moment to tell us what you think, what you&apos;d love to see and what would make Beyanco valuable to you.
              </p>
            </div>

            {/* BOTTOM: Primary CTA & Secondary Guidance */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleCtaClick}
                className="group w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#101827] hover:bg-[#A98460] text-white text-xs font-semibold uppercase tracking-widest shadow-md hover:shadow-xl transition-all duration-300"
              >
                <span>Share Your Opinion</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <p className="text-[11.5px] text-[#626A75] leading-normal px-2">
                It only takes a few minutes. Your feedback will help shape what comes next.
              </p>

              <div>
                <button
                  type="button"
                  onClick={dismissModal}
                  className="text-xs text-[#626A75] hover:text-[#101827] transition-colors underline underline-offset-4"
                >
                  Maybe later
                </button>
              </div>
            </div>

            {/* Closing Thank You */}
            <div className="mt-5 pt-4 border-t border-[#D8D5CF]/60 text-[11px] text-[#626A75]/70">
              Thank you for being part of Beyanco&apos;s journey.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
