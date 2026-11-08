"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface WaitlistInlineFormProps {
  source?: string;
  className?: string;
  compact?: boolean;
}

export function WaitlistInlineForm({
  source = "landing_page",
  className = "",
  compact = false,
}: WaitlistInlineFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Real Estate Agent / Broker");
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Gather UTM params from URL
      let utm: Record<string, string> = {};
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
          const val = params.get(key);
          if (val) utm[key] = val;
        });
      }

      const res = await fetch("/api/v1/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          professionalRole: role,
          marketingConsent: consent,
          source,
          utm,
          website_trap: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setIsSuccess(true);
      setIsDuplicate(Boolean(data.isDuplicate));
      setMessage(data.message || "You have been added to the early-access list.");
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`p-8 rounded-[20px] bg-white border border-[#D8D5CF] shadow-architectural text-left ${className}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-serif text-[#101827]">
              {isDuplicate ? "Welcome back!" : "You're on the Beyanco Waitlist."}
            </h3>
            <p className="text-sm text-[#626A75] leading-relaxed">
              {message} We prioritize invites for professionals who help us evaluate product requirements.
            </p>
          </div>
        </div>

        {/* Opinion survey nudge */}
        <div className="mt-6 pt-6 border-t border-[#D8D5CF]/60 bg-[#FAF8F5] -mx-8 -mb-8 p-6 rounded-b-[20px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A98460]">
              Unlock Priority Access
            </span>
            <p className="text-sm font-medium text-[#101827]">
              Help shape which rooms, furniture and styles we build first.
            </p>
          </div>
          <Link
            href="/feedback"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#101827] text-white hover:bg-[#A98460] transition-colors"
          >
            <span>Share Your Opinion</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 sm:p-8 rounded-[20px] bg-white border border-[#D8D5CF]/70 shadow-architectural text-left ${className}`}
      noValidate
    >
      {/* Honeypot for anti-spam */}
      <input
        type="text"
        name="website_trap"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elena Rostova"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-[#F6F4EF] border border-[#D8D5CF] text-[#101827] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
              Work / Business Email
            </label>
            <input
              type="email"
              required
              placeholder="elena@studioarchitects.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-[#F6F4EF] border border-[#D8D5CF] text-[#101827] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
            Your Professional Role <span className="text-[#94A3B8] font-normal lowercase">(optional)</span>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-[#F6F4EF] border border-[#D8D5CF] text-[#101827] text-sm focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all cursor-pointer"
          >
            <option value="Real Estate Agent / Broker">Real Estate Agent / Broker</option>
            <option value="Real Estate Agency Owner">Real Estate Agency Owner</option>
            <option value="Interior Designer">Interior Designer / Decorator</option>
            <option value="Property Photographer">Property Photographer</option>
            <option value="Builder / Developer">Builder / Property Developer</option>
            <option value="Property Owner / Landlord">Property Owner / Landlord</option>
            <option value="Other">Other Creative Professional</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id={`consent-${source}`}
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4 rounded border-[#D8D5CF] text-[#101827] focus:ring-[#A98460] cursor-pointer"
          />
          <label
            htmlFor={`consent-${source}`}
            className="text-xs text-[#626A75] cursor-pointer select-none"
          >
            Notify me with private release invitations and product benchmarks.
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-13 px-6 rounded-full bg-[#101827] text-white font-medium text-sm uppercase tracking-wider hover:bg-[#A98460] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Securing Early Access...</span>
              </>
            ) : (
              <>
                <span>Join the Beyanco Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
