"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, AlertCircle, Phone } from "lucide-react";

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
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [role, setRole] = useState("Homeowner / Property Owner");
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

      const fullMobile = phone.trim() ? `${countryCode} ${phone.trim()}` : undefined;

      const res = await fetch("/api/v1/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          mobile_number: fullMobile,
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
      <div className={`p-6 sm:p-8 rounded-[20px] bg-white border border-[#D8D5CF] shadow-architectural text-left ${className}`}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#101827]">
              {isDuplicate ? "Welcome back!" : "You're on the Beyanco Waitlist."}
            </h3>
            <p className="text-xs sm:text-sm text-[#626A75] leading-relaxed">
              {message} We prioritize invites for customers and professionals who help us evaluate product requirements.
            </p>
          </div>
        </div>

        {/* Opinion survey nudge */}
        <div className="mt-6 pt-5 sm:pt-6 border-t border-[#D8D5CF]/60 bg-[#FAF8F5] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-5 sm:p-6 rounded-b-[20px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A98460]">
              Unlock Priority Access
            </span>
            <p className="text-xs sm:text-sm font-medium text-[#101827] mt-0.5">
              Help shape which furniture and spatial features we build first.
            </p>
          </div>
          <Link
            href="/feedback"
            className="w-full sm:w-auto text-center shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#101827] text-white hover:bg-[#A98460] transition-colors"
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
      className={`p-5 sm:p-8 rounded-[20px] bg-white border border-[#D8D5CF]/70 shadow-architectural text-left ${className}`}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
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
              className="w-full h-12 px-4 rounded-xl bg-[#F6F4EF] border border-[#D8D5CF] text-[#101827] text-base sm:text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="elena@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-[#F6F4EF] border border-[#D8D5CF] text-[#101827] text-base sm:text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
              Mobile Number <span className="text-[#94A3B8] font-normal lowercase">(optional)</span>
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-12 px-2 sm:px-3 rounded-xl bg-[#F6F4EF] border border-[#D8D5CF] text-[#101827] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all cursor-pointer font-mono shrink-0"
              >
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+971">+971 (UAE)</option>
                <option value="+65">+65 (SG)</option>
                <option value="+61">+61 (AU)</option>
              </select>
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-12 px-3 sm:px-4 rounded-xl bg-[#F6F4EF] border border-[#D8D5CF] text-[#101827] text-base sm:text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
              Your Profile / Role <span className="text-[#94A3B8] font-normal lowercase">(optional)</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-[#F6F4EF] border border-[#D8D5CF] text-[#101827] text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all cursor-pointer"
            >
              <option value="Homeowner / Property Owner">Homeowner / Property Owner</option>
              <option value="Renter">Renter</option>
              <option value="Planning to purchase a home">Planning to purchase a home</option>
              <option value="Interior Designer / Architect">Interior Designer / Architect</option>
              <option value="Furniture Seller / Retailer">Furniture Seller / Retailer</option>
              <option value="Real Estate Agent / Broker">Real Estate Agent / Broker</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id={`consent-${source}`}
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-[#D8D5CF] text-[#101827] focus:ring-[#A98460] cursor-pointer shrink-0"
          />
          <label
            htmlFor={`consent-${source}`}
            className="text-xs text-[#626A75] cursor-pointer select-none leading-relaxed"
          >
            Notify me with early access invitations and launch updates.
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 sm:h-13 px-6 rounded-full bg-[#101827] text-white font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-[#A98460] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
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
