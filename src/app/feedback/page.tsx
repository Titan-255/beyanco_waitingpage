"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  DollarSign,
  HelpCircle,
  Building2,
  Lock,
} from "lucide-react";
import { WaitlistNavbar } from "@/components/marketing/WaitlistNavbar";
import { WaitlistFooter } from "@/components/marketing/WaitlistFooter";

export default function FeedbackSurveyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Mark feedback popup as shown so visitor is never interrupted
  useEffect(() => {
    try {
      sessionStorage.setItem("beyanco_feedback_popup_shown", "true");
    } catch {
      // Ignore
    }
  }, []);

  // Step 1: About You
  const [role, setRole] = useState("Real Estate Agent / Broker");
  const [otherRole, setOtherRole] = useState("");
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [company, setCompany] = useState("");

  // Step 2: Current Workflow
  const [propertyVolume, setPropertyVolume] = useState("3–5");
  const [stagingMethod, setStagingMethod] = useState("Physical furniture staging");
  const [otherStagingMethod, setOtherStagingMethod] = useState("");
  const [painPoints, setPainPoints] = useState<string[]>([
    "Physical staging is expensive",
    "Empty rooms are difficult to present",
  ]);
  const [otherPainPoint, setOtherPainPoint] = useState("");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [currentSpending, setCurrentSpending] = useState("₹15,000–₹50,000 / month");

  // Step 3: Feature Interest
  const [featurePreferences, setFeaturePreferences] = useState<string[]>([
    "AI Virtual Staging",
    "Complete AI Interior Design",
    "Preserve Existing Furniture and Architecture",
  ]);
  const [topThreeFeatures, setTopThreeFeatures] = useState<string[]>([
    "AI Virtual Staging",
    "Preserve Existing Furniture and Architecture",
  ]);
  const [wishlistFeature, setWishlistFeature] = useState("");

  // Step 4: Purchase Intent & Pricing
  const [purchaseIntent, setPurchaseIntent] = useState("Definitely would pay");
  const [preferredPricingModel, setPreferredPricingModel] = useState("Package per property");
  const [priceExpectationPerRoom, setPriceExpectationPerRoom] = useState("₹250–₹499");
  const [comfortablePriceNotes, setComfortablePriceNotes] = useState("");

  // Step 5: Early Access & Contact
  const [earlyAccessInterest, setEarlyAccessInterest] = useState("Yes, definitely");
  const [interviewInterest, setInterviewInterest] = useState("Yes");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false); // Unchecked by default per requirement

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle multi-select helper
  const toggleSelection = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
    maxLimit?: number
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      if (maxLimit && list.length >= maxLimit) {
        return; // reached limit
      }
      setList([...list, item]);
    }
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 1) {
      if (!role) {
        setError("Please choose your professional role.");
        return;
      }
    }
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Optional email validation if provided
    if (email && (!email.includes("@") || !email.includes("."))) {
      setError("Please provide a valid email address if you want to be contacted.");
      return;
    }

    setIsSubmitting(true);

    try {
      let utm: Record<string, string> = {};
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
          const val = params.get(key);
          if (val) utm[key] = val;
        });
      }

      const finalRole = role === "Other" && otherRole.trim() ? `Other: ${otherRole.trim()}` : role;
      const finalStaging = stagingMethod === "Other" && otherStagingMethod.trim() ? `Other: ${otherStagingMethod.trim()}` : stagingMethod;
      const finalPainPoints = [...painPoints];
      if (otherPainPoint.trim() && !finalPainPoints.includes(otherPainPoint.trim())) {
        finalPainPoints.push(otherPainPoint.trim());
      }

      const payload = {
        role: finalRole,
        country: country.trim(),
        city: city.trim(),
        company: company.trim(),
        propertyVolume,
        currentWorkflow: [finalStaging],
        painPoints: finalPainPoints,
        currentSpending,
        currency,
        featurePreferences,
        topThreeFeatures,
        wishlistFeature: wishlistFeature.trim(),
        purchaseIntent,
        preferredPricingModel,
        priceExpectationPerRoom,
        comfortablePriceNotes: comfortablePriceNotes.trim(),
        earlyAccessInterest,
        interviewInterest,
        contactName: name.trim(),
        contactEmail: email.trim(),
        contactPhone: phone.trim(),
        marketingConsent,
        utm,
      };

      const res = await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit survey. Please try again.");
      }

      // Also register on waitlist if email provided
      if (email.trim() && name.trim()) {
        await fetch("/api/v1/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            professionalRole: finalRole,
            company: company.trim(),
            country: country.trim(),
            city: city.trim(),
            marketingConsent,
            source: "feedback_survey",
            utm,
          }),
        }).catch(() => {});
      }

      // Smooth navigate to thank you page
      router.push("/feedback/thank-you");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#101827]">
      <WaitlistNavbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#626A75] hover:text-[#101827] transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#101827] leading-tight">
              Help Us Build Beyanco Around <br />
              <span className="italic font-normal text-[#A98460]">What You Actually Need.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#626A75] max-w-xl mx-auto leading-relaxed">
              We want to understand how you currently present properties, what challenges you encounter and whether Beyanco could make a meaningful difference to your workflow.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8 bg-white p-4 rounded-2xl border border-[#D8D5CF] shadow-subtle">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-2">
              <span className="text-[#101827]">
                Step {currentStep} of {totalSteps}:{" "}
                {currentStep === 1 && "About You"}
                {currentStep === 2 && "Your Current Workflow"}
                {currentStep === 3 && "Feature Value & Needs"}
                {currentStep === 4 && "Willingness to Pay & Pricing"}
                {currentStep === 5 && "Early Access Program"}
              </span>
              <span className="text-[#A98460]">{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#FAF8F5] overflow-hidden border border-[#D8D5CF]/50">
              <motion.div
                className="h-full bg-[#101827]"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-[24px] border border-[#D8D5CF] shadow-architectural p-6 sm:p-10 relative">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* ================= STEP 1: ABOUT YOU ================= */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
                      Step 01 / 05
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-[#101827]">
                      Which best describes you?
                    </h2>
                    <p className="text-xs text-[#626A75]">
                      Select the primary professional perspective you are evaluating Beyanco from.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Real Estate Agent / Broker",
                      "Real Estate Agency Owner",
                      "Interior Designer",
                      "Property Photographer",
                      "Builder / Developer",
                      "Property Owner / Landlord",
                      "Other",
                    ].map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => setRole(option)}
                        className={`p-4 rounded-xl text-left border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          role === option
                            ? "bg-[#101827] text-white border-[#101827] shadow-sm"
                            : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827]"
                        }`}
                      >
                        <span>{option}</span>
                        {role === option && <Check className="w-4 h-4 text-[#A98460]" />}
                      </button>
                    ))}
                  </div>

                  {role === "Other" && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
                        Please specify your role:
                      </label>
                      <input
                        type="text"
                        value={otherRole}
                        onChange={(e) => setOtherRole(e.target.value)}
                        placeholder="e.g. 3D Architectural Visualizer, Architect, Staging Stylist"
                        className="w-full h-12 px-4 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF] text-sm text-[#101827] focus:ring-2 focus:ring-[#A98460] focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D8D5CF]/50">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. India, USA, UAE"
                        className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF] text-sm text-[#101827] focus:ring-2 focus:ring-[#A98460] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, Bengaluru, Dubai"
                        className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF] text-sm text-[#101827] focus:ring-2 focus:ring-[#A98460] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
                        Company <span className="text-[#94A3B8] lowercase">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Prime Realty"
                        className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF] text-sm text-[#101827] focus:ring-2 focus:ring-[#A98460] focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 2: YOUR CURRENT WORKFLOW ================= */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
                      Step 02 / 05
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-[#101827]">
                      Your Current Workflow & Challenges
                    </h2>
                  </div>

                  {/* Volume */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                      How many properties do you typically handle in a month?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {["1–2", "3–5", "6–10", "11–25", "26 or more", "Not applicable"].map((vol) => (
                        <button
                          type="button"
                          key={vol}
                          onClick={() => setPropertyVolume(vol)}
                          className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                            propertyVolume === vol
                              ? "bg-[#101827] text-white border-[#101827]"
                              : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827]"
                          }`}
                        >
                          {vol}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Staging Method */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                      How do you currently present or stage properties?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "Physical furniture staging",
                        "Professional interior designer",
                        "Photography and photo editing",
                        "Existing AI staging tools",
                        "Show empty properties",
                        "Other",
                      ].map((method) => (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setStagingMethod(method)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${
                            stagingMethod === method
                              ? "bg-[#101827] text-white border-[#101827]"
                              : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827]"
                          }`}
                        >
                          <span>{method}</span>
                          {stagingMethod === method && <Check className="w-3.5 h-3.5 text-[#A98460]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Biggest Challenges */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                        What are your biggest challenges? <span className="text-[#A98460] font-normal">(select all that apply)</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "Physical staging is expensive",
                        "Staging takes too much time",
                        "Empty rooms are difficult to present",
                        "Professional photography is expensive",
                        "Existing AI results look unrealistic",
                        "I cannot control the furniture",
                        "Difficult to maintain a consistent design",
                        "Multiple rooms are difficult to manage",
                      ].map((pain) => {
                        const isSelected = painPoints.includes(pain);
                        return (
                          <button
                            type="button"
                            key={pain}
                            onClick={() => toggleSelection(painPoints, setPainPoints, pain)}
                            className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-2.5 ${
                              isSelected
                                ? "bg-[#101827] text-white border-[#101827]"
                                : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827]"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-[#A98460] border-[#A98460] text-white" : "border-[#D8D5CF]"
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <span>{pain}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Spending */}
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D8D5CF] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                        Approximately how much do you currently spend on staging, photography or editing?
                      </label>
                      <div className="flex items-center gap-1 bg-white border border-[#D8D5CF] rounded-lg p-0.5 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setCurrency("INR")}
                          className={`px-2 py-0.5 rounded ${currency === "INR" ? "bg-[#101827] text-white" : "text-[#626A75]"}`}
                        >
                          INR (₹)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrency("USD")}
                          className={`px-2 py-0.5 rounded ${currency === "USD" ? "bg-[#101827] text-white" : "text-[#626A75]"}`}
                        >
                          USD ($)
                        </button>
                      </div>
                    </div>

                    <select
                      value={currentSpending}
                      onChange={(e) => setCurrentSpending(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D8D5CF] text-xs sm:text-sm text-[#101827] focus:ring-2 focus:ring-[#A98460] focus:outline-none"
                    >
                      {currency === "INR" ? (
                        <>
                          <option value="Under ₹5,000 / month">Under ₹5,000 / month</option>
                          <option value="₹5,000–₹15,000 / month">₹5,000–₹15,000 / month</option>
                          <option value="₹15,000–₹50,000 / month">₹15,000–₹50,000 / month</option>
                          <option value="₹50,000–₹1,50,000 / month">₹50,000–₹1,50,000 / month</option>
                          <option value="₹1,50,000+ / month">₹1,50,000+ / month</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </>
                      ) : (
                        <>
                          <option value="Under $100 / month">Under $100 / month</option>
                          <option value="$100–$500 / month">$100–$500 / month</option>
                          <option value="$500–$2,000 / month">$500–$2,000 / month</option>
                          <option value="$2,000–$5,000 / month">$2,000–$5,000 / month</option>
                          <option value="$5,000+ / month">$5,000+ / month</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </>
                      )}
                    </select>
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 3: FEATURE INTEREST ================= */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
                      Step 03 / 05
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-[#101827]">
                      Which Beyanco features would be most valuable to you?
                    </h2>
                    <p className="text-xs text-[#626A75]">
                      Help us determine which capabilities to develop and calibrate first.
                    </p>
                  </div>

                  {/* General feature preference */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                      Valuable Capabilities <span className="text-[#A98460] font-normal">(select all that apply)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "AI Virtual Staging",
                        "Complete AI Interior Design",
                        "Multiple Interior Design Styles",
                        "Furniture Customization",
                        "Material and Colour Selection",
                        "AI Design Refinement",
                        "Preserve Existing Furniture and Architecture",
                        "Before-and-After Comparison",
                        "Multiple Rooms Under One Property",
                        "Batch Property Staging",
                        "Team / Agency Workspaces",
                      ].map((feat) => {
                        const isSelected = featurePreferences.includes(feat);
                        return (
                          <button
                            type="button"
                            key={feat}
                            onClick={() => toggleSelection(featurePreferences, setFeaturePreferences, feat)}
                            className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-[#101827] text-white border-[#101827]"
                                : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827]"
                            }`}
                          >
                            <span>{feat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#A98460]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* TOP THREE features */}
                  <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#D8D5CF] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#101827]">
                        Which THREE features would make you most interested in using Beyanco?
                      </label>
                      <span className="text-xs font-bold text-[#A98460]">
                        {topThreeFeatures.length}/3 selected
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "AI Virtual Staging",
                        "Complete AI Interior Design",
                        "Multiple Interior Design Styles",
                        "Furniture Customization",
                        "Material and Colour Selection",
                        "AI Design Refinement",
                        "Preserve Existing Furniture and Architecture",
                        "Before-and-After Comparison",
                        "Multiple Rooms Under One Property",
                        "Batch Property Staging",
                        "Team / Agency Workspaces",
                      ].map((feat) => {
                        const isSelected = topThreeFeatures.includes(feat);
                        return (
                          <button
                            type="button"
                            key={feat}
                            onClick={() => toggleSelection(topThreeFeatures, setTopThreeFeatures, feat, 3)}
                            className={`p-2.5 rounded-lg border text-xs text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-[#A98460] text-white border-[#A98460] font-semibold"
                                : "bg-white text-[#101827] border-[#D8D5CF] hover:border-[#A98460]"
                            }`}
                          >
                            <span>{feat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Open-ended Wishlist */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                      What is the one feature you wish existing interior design or staging tools offered? <span className="text-[#94A3B8] lowercase">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={wishlistFeature}
                      onChange={(e) => setWishlistFeature(e.target.value)}
                      placeholder="e.g. Exporting actual furniture vendor links, accurate shadows from outdoor windows, preserving wall artwork while replacing sofas..."
                      className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF] text-xs sm:text-sm text-[#101827] focus:ring-2 focus:ring-[#A98460] focus:outline-none leading-relaxed"
                    />
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 4: PURCHASE INTENT ================= */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
                      Step 04 / 05 • Commercial Validation
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-[#101827]">
                      Purchase Intent & Pricing Models
                    </h2>
                    <p className="text-xs text-[#626A75]">
                      All questions in this section are exploratory customer discovery research to help us design honest, sustainable pricing.
                    </p>
                  </div>

                  {/* Willingness to pay */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                      Assuming Beyanco delivers the image quality and functionality you need, how likely are you to pay for it?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "Definitely would pay",
                        "Probably would pay",
                        "Not sure",
                        "Probably would not pay",
                        "Definitely would not pay",
                      ].map((intent) => (
                        <button
                          type="button"
                          key={intent}
                          onClick={() => setPurchaseIntent(intent)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${
                            purchaseIntent === intent
                              ? "bg-[#101827] text-white border-[#101827] font-semibold"
                              : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827]"
                          }`}
                        >
                          <span>{intent}</span>
                          {purchaseIntent === intent && <Check className="w-4 h-4 text-[#A98460]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Pricing Model */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                      Which pricing model would you prefer?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "Pay per generated room image",
                        "Package per property",
                        "Monthly individual subscription",
                        "Agency / Team subscription",
                        "One-time payment",
                        "Would not pay",
                        "Not sure",
                      ].map((model) => (
                        <button
                          type="button"
                          key={model}
                          onClick={() => setPreferredPricingModel(model)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${
                            preferredPricingModel === model
                              ? "bg-[#101827] text-white border-[#101827]"
                              : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827]"
                          }`}
                        >
                          <span>{model}</span>
                          {preferredPricingModel === model && <Check className="w-3.5 h-3.5 text-[#A98460]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Expectation */}
                  <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#D8D5CF] space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A98460] block">
                        Exploratory Research Question
                      </span>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#101827]">
                        What price would feel reasonable for one finished room visualization?
                      </label>
                      <p className="text-[11px] text-[#626A75]">
                        (Not published commercial prices. Used solely to understand market tolerance.)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        "Below ₹100",
                        "₹100–₹249",
                        "₹250–₹499",
                        "₹500–₹999",
                        "₹1,000 or more",
                        "Depends on output quality",
                        "Would not pay",
                      ].map((price) => (
                        <button
                          type="button"
                          key={price}
                          onClick={() => setPriceExpectationPerRoom(price)}
                          className={`p-3 rounded-xl border text-xs text-center transition-all ${
                            priceExpectationPerRoom === price
                              ? "bg-[#A98460] text-white border-[#A98460] font-semibold"
                              : "bg-white text-[#101827] border-[#D8D5CF] hover:border-[#A98460]"
                          }`}
                        >
                          {price}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Open text price notes */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                      What would make you comfortable paying for Beyanco? <span className="text-[#94A3B8] lowercase">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={comfortablePriceNotes}
                      onChange={(e) => setComfortablePriceNotes(e.target.value)}
                      placeholder="e.g. Free revision iterations, watermark-free 4K downloads, or client satisfaction guarantee..."
                      className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF] text-xs sm:text-sm text-[#101827] focus:ring-2 focus:ring-[#A98460] focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 5: EARLY ACCESS ================= */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
                      Step 05 / 05 • Early Access Program
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-[#101827]">
                      Join the Private Early Access Cohort
                    </h2>
                    <p className="text-xs text-[#626A75]">
                      We invite design-forward professionals to test early builds before public availability.
                    </p>
                  </div>

                  {/* Early Access interest */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                      Would you like to participate in the Beyanco early-access program?
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {["Yes, definitely", "Maybe", "Not currently"].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setEarlyAccessInterest(opt)}
                          className={`p-3 rounded-xl border text-xs sm:text-sm text-center transition-all ${
                            earlyAccessInterest === opt
                              ? "bg-[#101827] text-white border-[#101827] font-semibold"
                              : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interview interest */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#101827]">
                      Would you be open to a short 15-minute conversation to help us understand your requirements?
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {["Yes", "Maybe", "No"].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setInterviewInterest(opt)}
                          className={`p-3 rounded-xl border text-xs sm:text-sm text-center transition-all ${
                            interviewInterest === opt
                              ? "bg-[#101827] text-white border-[#101827] font-semibold"
                              : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#D8D5CF] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#101827]">
                      Your Contact Details for Early Access
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Tarun Sharma"
                          className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D8D5CF] text-sm text-[#101827] focus:ring-2 focus:ring-[#A98460] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. tarun@agency.com"
                          className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D8D5CF] text-sm text-[#101827] focus:ring-2 focus:ring-[#A98460] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1">
                        Phone / WhatsApp <span className="text-[#94A3B8] lowercase">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D8D5CF] text-sm text-[#101827] focus:ring-2 focus:ring-[#A98460] focus:outline-none"
                      />
                    </div>

                    {/* Unchecked Marketing Consent Checkbox */}
                    <div className="pt-2 flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="marketingConsent"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-[#D8D5CF] text-[#101827] focus:ring-[#A98460] cursor-pointer"
                      />
                      <label
                        htmlFor="marketingConsent"
                        className="text-xs text-[#626A75] leading-relaxed cursor-pointer select-none"
                      >
                        I agree to receive occasional updates about Beyanco AI feature launches and beta testing cohorts. (Not compulsory for submitting product feedback.)
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons (Back & Next / Submit) */}
            <div className="mt-10 pt-6 border-t border-[#D8D5CF] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-full border border-[#D8D5CF] text-xs font-semibold uppercase tracking-wider text-[#101827] hover:bg-[#FAF8F5] transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-full bg-[#101827] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A98460] transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-9 py-4 rounded-full bg-[#101827] hover:bg-[#A98460] text-white text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-all inline-flex items-center gap-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Feedback...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit My Feedback</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-[#626A75] flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#A98460]" />
            <span>Responses are private, encrypted, and evaluated solely by our founding engineering team.</span>
          </div>
        </div>
      </main>

      <WaitlistFooter />
    </div>
  );
}
