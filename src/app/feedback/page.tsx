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
  ChevronUp,
  ChevronDown,
  Phone,
  Mail,
  User,
  Sparkles,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { WaitlistNavbar } from "@/components/marketing/WaitlistNavbar";
import { WaitlistFooter } from "@/components/marketing/WaitlistFooter";

const STAGES = [
  { id: 1, name: "About You", questions: [1, 2] },
  { id: 2, name: "Shopping Behaviour", questions: [3, 4, 5] },
  { id: 3, name: "Value of Beyanco", questions: [6, 7] },
  { id: 4, name: "Trust & Decisions", questions: [8, 9] },
  { id: 5, name: "Open Feedback", questions: [10] },
];

const Q7_ALL_FEATURES = [
  "Realistic furniture visualization in my own room.",
  "AI-powered interior design recommendations.",
  "Accurate furniture dimensions and room-fit guidance.",
  "Seeing real product prices and materials.",
  "Comparing furniture across different stores.",
  "Buying furniture directly through Beyanco.",
  "Filtering by budget and delivery time.",
  "Moving, removing and rearranging furniture.",
  "Saving and sharing room designs.",
  "Exploring different interior styles.",
];

export default function FeedbackSurveyPage() {
  const router = useRouter();

  // Current screen index: 1 to 10 for survey questions, 11 for "YOUR DETAILS"
  const [currentScreen, setCurrentScreen] = useState(1);
  const totalQuestions = 10;

  // Mark feedback popup as shown so it doesn't interrupt while taking survey
  useEffect(() => {
    try {
      sessionStorage.setItem("beyanco_feedback_popup_shown", "true");
    } catch {
      // Ignore
    }
  }, []);

  // Question 1: Which best describes you? (Required)
  const [q1UserType, setQ1UserType] = useState<string>("");

  // Question 2: Are you planning to buy furniture in the next 6 months? (Optional)
  const [q2BuyingTimeline, setQ2BuyingTimeline] = useState<string>("");

  // Question 3: Where do you usually discover or buy furniture? (Optional, Multi-select)
  const [q3WhereBuy, setQ3WhereBuy] = useState<string[]>([]);

  // Question 4: What is the most frustrating part of buying furniture? (Optional, Multi-select)
  const [q4HardestPart, setQ4HardestPart] = useState<string[]>([]);

  // Question 5: Have you ever purchased furniture that looked different from what you expected? (Optional text)
  const [q5RegretExperience, setQ5RegretExperience] = useState<string>("");

  // Question 6: How useful would it be to see actual furniture products arranged in your room? (Required, 1-5)
  const [q6UsefulnessRating, setQ6UsefulnessRating] = useState<number | null>(null);

  // Question 7: Which Beyanco features would be most valuable to you? (Select & rank top 3 — Optional)
  const [q7RankedFeatures, setQ7RankedFeatures] = useState<string[]>([]);

  // Question 8: What would make you comfortable purchasing furniture through Beyanco? (Optional, Multi-select)
  const [q8ComfortFactors, setQ8ComfortFactors] = useState<string[]>([]);

  // Question 9: What is your typical budget for a major furniture purchase, such as a sofa or bed? (Optional)
  const [q9BudgetSpend, setQ9BudgetSpend] = useState<string>("");

  // Question 10: If Beyanco could solve ONE problem perfectly when buying furniture, what would you want it to solve? (Required long text)
  const [q10OneThingPerfect, setQ10OneThingPerfect] = useState<string>("");

  // Screen 11: Contact Details (All optional)
  const [contactName, setContactName] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [contactMobile, setContactMobile] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  const [interviewInterest, setInterviewInterest] = useState<string>("");

  // UI / Submission state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to toggle multi-select
  const toggleMultiSelect = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  // Helper for Q7 ranking (Select & rank top 3 without drag-and-drop)
  const toggleQ7Feature = (feat: string) => {
    if (q7RankedFeatures.includes(feat)) {
      // Remove from ranking and shift others
      setQ7RankedFeatures(q7RankedFeatures.filter((f) => f !== feat));
    } else {
      if (q7RankedFeatures.length < 3) {
        setQ7RankedFeatures([...q7RankedFeatures, feat]);
      } else {
        // Replace 3rd rank or notify
        setValidationError("You have already selected your top 3. Tap a selected item to unselect or use the arrows to reorder.");
      }
    }
  };

  const moveQ7Item = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= q7RankedFeatures.length) return;
    const newItems = [...q7RankedFeatures];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setQ7RankedFeatures(newItems);
  };

  // Find active stage name
  const getActiveStageName = (screen: number) => {
    if (screen === 11) return "Your Details";
    const stage = STAGES.find((s) => s.questions.includes(screen));
    return stage ? stage.name : "Questionnaire";
  };

  // Next / Continue button validation
  const handleNext = () => {
    setValidationError(null);

    // Validate Required Questions
    if (currentScreen === 1 && !q1UserType) {
      setValidationError("Please select the option that best describes you to continue.");
      return;
    }

    if (currentScreen === 6 && !q6UsefulnessRating) {
      setValidationError("Please select a rating from 1 to 5 to continue.");
      return;
    }

    if (currentScreen === 10 && !q10OneThingPerfect.trim()) {
      setValidationError("Please share your thoughts for this question before proceeding.");
      return;
    }

    if (currentScreen < 11) {
      setCurrentScreen((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // Skip button for optional questions
  const handleSkip = () => {
    setValidationError(null);
    if (currentScreen < 11) {
      setCurrentScreen((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // Back button
  const handleBack = () => {
    setValidationError(null);
    if (currentScreen > 1) {
      setCurrentScreen((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // Final submission on Screen 11
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate email format if provided
    if (contactEmail.trim() && (!contactEmail.includes("@") || !contactEmail.includes("."))) {
      setValidationError("Please enter a valid email address, or leave it blank.");
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

      const fullPhone = contactMobile.trim()
        ? `${countryCode} ${contactMobile.trim()}`
        : undefined;

      const payload = {
        q1_user_type: q1UserType,
        q2_buying_timeline: q2BuyingTimeline || null,
        q3_where_buy: q3WhereBuy.length > 0 ? q3WhereBuy : null,
        q4_hardest_part: q4HardestPart.length > 0 ? q4HardestPart : null,
        q5_regret_experience: q5RegretExperience.trim() || null,
        q6_usefulness_rating: q6UsefulnessRating,
        q7_ranked_features: q7RankedFeatures.length > 0 ? q7RankedFeatures : null,
        q8_comfort_factors: q8ComfortFactors.length > 0 ? q8ComfortFactors : null,
        q9_budget_spend: q9BudgetSpend || null,
        q10_one_thing_perfect: q10OneThingPerfect.trim(),
        contactName: contactName.trim() || undefined,
        contactPhone: fullPhone,
        contactEmail: contactEmail.trim().toLowerCase() || undefined,
        marketingConsent,
        interviewInterest: interviewInterest || null,
        utm,
      };

      const res = await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit feedback. Please try again.");
      }

      // Navigate to dedicated Thank You screen
      router.push("/feedback/thank-you");
    } catch (err: any) {
      setValidationError(err.message || "Something went wrong. Please check your connection.");
      setIsSubmitting(false);
    }
  };

  // Rating scale interpretations
  const ratingScaleLabels: Record<number, string> = {
    1: "1 — Not useful",
    2: "2 — Slightly useful",
    3: "3 — Moderately useful",
    4: "4 — Very useful",
    5: "5 — Extremely useful",
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#101827] overflow-x-hidden">
      <WaitlistNavbar />

      <main className="flex-1 py-8 sm:py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Form Introduction & Brand Header */}
          <div className="text-center mb-8 sm:mb-10 space-y-3 sm:space-y-4">
            <div className="flex justify-center mb-3 sm:mb-4">
              <img
                src="/beyanco-logo.jpg"
                alt="Beyanco"
                className="h-12 sm:h-16 w-auto object-contain mix-blend-multiply"
              />
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#101827] tracking-tight leading-snug">
              Help Us Understand How People Shop for Furniture.
            </h1>

            <p className="text-sm sm:text-base text-[#626A75] max-w-xl mx-auto leading-relaxed">
              Your honest feedback will help us decide what to build and how to improve the furniture-shopping experience.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#101827]/5 border border-[#101827]/10 text-xs text-[#626A75] font-medium">
              <span>Approximately 3 minutes to complete.</span>
            </div>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#D8D5CF] p-5 sm:p-8 shadow-architectural">
            
            {/* Top Indicator */}
            <div className="flex items-center justify-between mb-4 text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-[#A98460] uppercase tracking-wider truncate">
                  {getActiveStageName(currentScreen)}
                </span>
                <span className="text-[#D8D5CF]">•</span>
                <span className="text-[#626A75] shrink-0">
                  {currentScreen <= 10 ? `Question ${currentScreen} of ${totalQuestions}` : "Final Step"}
                </span>
              </div>

              {currentScreen <= 10 && (
                <span className="text-[#626A75] font-mono shrink-0 ml-2">
                  {Math.round((currentScreen / totalQuestions) * 100)}%
                </span>
              )}
            </div>

            {/* Smooth Progress Bar */}
            <div className="w-full h-2 bg-[#F6F4EF] rounded-full overflow-hidden mb-6 sm:mb-8">
              <motion.div
                className="h-full bg-[#101827]"
                initial={{ width: "10%" }}
                animate={{
                  width: `${currentScreen <= 10 ? (currentScreen / totalQuestions) * 100 : 100}%`,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>

            {/* Validation Alert */}
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{validationError}</span>
              </motion.div>
            )}

            {/* Question Screens (1 to 10) & Contact Screen (11) */}
            <AnimatePresence mode="wait">
              
              {/* ========================================================
                  QUESTION 1: Which best describes you? (REQUIRED)
                  ======================================================== */}
              {currentScreen === 1 && (
                <motion.div
                  key="screen-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#A98460] uppercase tracking-wider">
                      Single selection — Required
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#101827] mt-1">
                      1. Which best describes you?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {[
                      "Homeowner",
                      "Renter",
                      "Planning to purchase or furnish a new home",
                      "Interior Designer / Architect",
                      "Furniture Seller / Retailer",
                      "Real Estate Professional",
                      "Other",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setQ1UserType(opt);
                          setValidationError(null);
                        }}
                        className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group min-h-[56px] ${
                          q1UserType === opt
                            ? "bg-[#101827] text-white border-[#101827] shadow-sm"
                            : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827] hover:bg-white"
                        }`}
                      >
                        <span className="text-sm font-semibold tracking-wide pr-2">{opt}</span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
                            q1UserType === opt
                              ? "bg-[#A98460] border-[#A98460] text-white"
                              : "border-[#D8D5CF] text-transparent group-hover:border-[#101827]"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  QUESTION 2: Buying timeline (OPTIONAL)
                  ======================================================== */}
              {currentScreen === 2 && (
                <motion.div
                  key="screen-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#626A75] uppercase tracking-wider">
                      Single selection — Optional
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#101827] mt-1">
                      2. Are you planning to buy furniture in the next 6 months?
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Yes, actively looking",
                      "Yes, but still exploring",
                      "Maybe",
                      "Not right now",
                      "Already purchased recently",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setQ2BuyingTimeline(opt)}
                        className={`w-full p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group min-h-[56px] ${
                          q2BuyingTimeline === opt
                            ? "bg-[#101827] text-white border-[#101827] shadow-sm"
                            : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827] hover:bg-white"
                        }`}
                      >
                        <span className="text-sm font-semibold tracking-wide pr-2">{opt}</span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
                            q2BuyingTimeline === opt
                              ? "bg-[#A98460] border-[#A98460] text-white"
                              : "border-[#D8D5CF] text-transparent group-hover:border-[#101827]"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  QUESTION 3: Where do you usually discover or buy furniture? (OPTIONAL)
                  ======================================================== */}
              {currentScreen === 3 && (
                <motion.div
                  key="screen-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#626A75] uppercase tracking-wider">
                      Multiple selection — Optional
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#101827] mt-1">
                      3. Where do you usually discover or buy furniture?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {[
                      "IKEA",
                      "Amazon",
                      "Pepperfry",
                      "Urban Ladder",
                      "Local furniture stores",
                      "Brand websites",
                      "Interior designers",
                      "Instagram / Pinterest",
                      "Other",
                    ].map((opt) => {
                      const isSelected = q3WhereBuy.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleMultiSelect(opt, q3WhereBuy, setQ3WhereBuy)}
                          className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group min-h-[56px] ${
                            isSelected
                              ? "bg-[#101827] text-white border-[#101827] shadow-sm"
                              : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827] hover:bg-white"
                          }`}
                        >
                          <span className="text-sm font-semibold tracking-wide pr-2">{opt}</span>
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[#A98460] border-[#A98460] text-white"
                                : "border-[#D8D5CF] text-transparent group-hover:border-[#101827]"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  QUESTION 4: Frustrating part of buying furniture (OPTIONAL)
                  ======================================================== */}
              {currentScreen === 4 && (
                <motion.div
                  key="screen-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#626A75] uppercase tracking-wider">
                      Multiple selection — Optional
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#101827] mt-1">
                      4. What is the most frustrating part of buying furniture?
                    </h2>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3">
                    {[
                      "Not knowing whether furniture will fit my room.",
                      "Not knowing whether the furniture will match my interiors.",
                      "Difficulty imagining how products will look together.",
                      "Uncertainty about product quality.",
                      "Difficulty comparing prices between stores.",
                      "Too many choices and products.",
                      "Unclear delivery timelines.",
                      "Complicated returns and refunds.",
                      "Difficulty finding furniture within my budget.",
                      "Other.",
                    ].map((opt) => {
                      const isSelected = q4HardestPart.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleMultiSelect(opt, q4HardestPart, setQ4HardestPart)}
                          className={`w-full p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group min-h-[56px] ${
                            isSelected
                              ? "bg-[#101827] text-white border-[#101827] shadow-sm"
                              : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827] hover:bg-white"
                          }`}
                        >
                          <span className="text-sm font-semibold tracking-wide pr-3 leading-relaxed">{opt}</span>
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[#A98460] border-[#A98460] text-white"
                                : "border-[#D8D5CF] text-transparent group-hover:border-[#101827]"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  QUESTION 5: Regret experience (OPTIONAL)
                  ======================================================== */}
              {currentScreen === 5 && (
                <motion.div
                  key="screen-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#626A75] uppercase tracking-wider">
                      Short written response — Optional
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#101827] mt-1">
                      5. Have you ever purchased furniture that looked different from what you expected?
                    </h2>
                  </div>

                  <div>
                    <textarea
                      rows={5}
                      value={q5RegretExperience}
                      onChange={(e) => setQ5RegretExperience(e.target.value)}
                      placeholder="Tell us what happened. Was it the size, colour, material, quality or something else?"
                      className="w-full p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#D8D5CF] text-[#101827] text-base sm:text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all leading-relaxed"
                    />
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  QUESTION 6: 1-5 Rating Scale (REQUIRED)
                  ======================================================== */}
              {currentScreen === 6 && (
                <motion.div
                  key="screen-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#A98460] uppercase tracking-wider">
                      Rating from 1 to 5 — Required
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#101827] mt-1">
                      6. How useful would it be to see actual furniture products arranged in your own room before purchasing them?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                    {[
                      { val: 1, label: "Not useful" },
                      { val: 2, label: "Slightly useful" },
                      { val: 3, label: "Moderately useful" },
                      { val: 4, label: "Very useful" },
                      { val: 5, label: "Extremely useful" },
                    ].map(({ val, label }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setQ6UsefulnessRating(val);
                          setValidationError(null);
                        }}
                        className={`p-4 sm:p-5 rounded-2xl text-center border transition-all duration-200 flex sm:flex-col items-center justify-between sm:justify-center gap-2 min-h-[56px] sm:min-h-[110px] ${
                          q6UsefulnessRating === val
                            ? "bg-[#101827] text-white border-[#101827] shadow-md scale-[1.01]"
                            : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827] hover:bg-white"
                        }`}
                      >
                        <span className="font-serif text-xl sm:text-2xl font-bold">{val}</span>
                        <span className="text-xs font-medium opacity-90 leading-tight">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {q6UsefulnessRating && (
                    <div className="text-center text-xs text-[#A98460] font-medium pt-1">
                      Selected: {ratingScaleLabels[q6UsefulnessRating]}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ========================================================
                  QUESTION 7: Select & Rank Top Three Features (OPTIONAL)
                  ======================================================== */}
              {currentScreen === 7 && (
                <motion.div
                  key="screen-7"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#626A75] uppercase tracking-wider">
                      Select and rank your top three — Optional
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#101827] mt-1">
                      7. Which Beyanco features would be most valuable to you?
                    </h2>
                    <p className="text-xs text-[#626A75] mt-1 leading-relaxed">
                      Tap up to 3 features below to choose your top priorities (#1, #2, #3). You can use the up/down arrows to adjust the ranking or tap an item again to unselect it.
                    </p>
                  </div>

                  {/* Active Top 3 Ranked Box */}
                  {q7RankedFeatures.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border-2 border-[#101827] space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[#101827] uppercase tracking-wider mb-1">
                        <span>Your Top {q7RankedFeatures.length} {q7RankedFeatures.length === 1 ? "Priority" : "Priorities"}:</span>
                        <button
                          type="button"
                          onClick={() => setQ7RankedFeatures([])}
                          className="text-[11px] text-[#626A75] hover:text-[#101827] underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset ranking</span>
                        </button>
                      </div>

                      {q7RankedFeatures.map((feat, idx) => (
                        <div
                          key={feat}
                          className="p-3 sm:p-3.5 rounded-xl bg-white border border-[#D8D5CF] flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#101827] text-white font-mono text-xs flex items-center justify-center font-bold shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold text-[#101827] truncate">
                              {feat}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveQ7Item(idx, "up")}
                              className="p-1.5 sm:p-2 rounded-lg bg-[#F6F4EF] text-[#101827] hover:bg-[#101827] hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
                              aria-label={`Move rank up`}
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === q7RankedFeatures.length - 1}
                              onClick={() => moveQ7Item(idx, "down")}
                              className="p-1.5 sm:p-2 rounded-lg bg-[#F6F4EF] text-[#101827] hover:bg-[#101827] hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
                              aria-label={`Move rank down`}
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* All 10 Features List for Selection */}
                  <div className="space-y-2">
                    {Q7_ALL_FEATURES.map((feat) => {
                      const rankIndex = q7RankedFeatures.indexOf(feat);
                      const isRanked = rankIndex !== -1;
                      return (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => toggleQ7Feature(feat)}
                          className={`w-full p-3.5 sm:p-4 rounded-xl text-left border transition-all duration-200 flex items-center justify-between group min-h-[50px] ${
                            isRanked
                              ? "bg-[#101827] text-white border-[#101827] shadow-sm"
                              : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827] hover:bg-white"
                          }`}
                        >
                          <span className="text-xs sm:text-sm font-medium pr-3 leading-snug">{feat}</span>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                              isRanked
                                ? "bg-[#A98460] text-white"
                                : "border border-[#D8D5CF] text-[#94A3B8] group-hover:border-[#101827]"
                            }`}
                          >
                            {isRanked ? `#${rankIndex + 1}` : "+"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  QUESTION 8: Trust and Purchase Decisions (OPTIONAL)
                  ======================================================== */}
              {currentScreen === 8 && (
                <motion.div
                  key="screen-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#626A75] uppercase tracking-wider">
                      Multiple selection — Optional
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#101827] mt-1">
                      8. What would make you comfortable purchasing furniture through Beyanco?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {[
                      "Verified furniture sellers.",
                      "Genuine customer reviews and photographs.",
                      "Accurate dimensions and product descriptions.",
                      "Easy returns and refunds.",
                      "Secure payment options.",
                      "Transparent delivery charges and timelines.",
                      "Price comparison across stores.",
                      "Reliable customer support.",
                      "Accurate room visualization.",
                      "Other.",
                    ].map((opt) => {
                      const isSelected = q8ComfortFactors.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleMultiSelect(opt, q8ComfortFactors, setQ8ComfortFactors)}
                          className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group min-h-[56px] ${
                            isSelected
                              ? "bg-[#101827] text-white border-[#101827] shadow-sm"
                              : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827] hover:bg-white"
                          }`}
                        >
                          <span className="text-sm font-semibold tracking-wide pr-2">{opt}</span>
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[#A98460] border-[#A98460] text-white"
                                : "border-[#D8D5CF] text-transparent group-hover:border-[#101827]"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  QUESTION 9: Typical Budget (OPTIONAL)
                  ======================================================== */}
              {currentScreen === 9 && (
                <motion.div
                  key="screen-9"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#626A75] uppercase tracking-wider">
                      Single selection — Optional
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#101827] mt-1">
                      9. What is your typical budget for a major furniture purchase, such as a sofa or bed?
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Below ₹10,000",
                      "₹10,000–₹24,999",
                      "₹25,000–₹49,999",
                      "₹50,000–₹99,999",
                      "₹1,00,000 or more",
                      "Depends on the product and quality",
                      "Prefer not to say",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setQ9BudgetSpend(opt)}
                        className={`w-full p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group min-h-[56px] ${
                          q9BudgetSpend === opt
                            ? "bg-[#101827] text-white border-[#101827] shadow-sm"
                            : "bg-[#FAF8F5] text-[#101827] border-[#D8D5CF] hover:border-[#101827] hover:bg-white"
                        }`}
                      >
                        <span className="text-sm font-semibold tracking-wide pr-2">{opt}</span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
                            q9BudgetSpend === opt
                              ? "bg-[#A98460] border-[#A98460] text-white"
                              : "border-[#D8D5CF] text-transparent group-hover:border-[#101827]"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  QUESTION 10: One Problem Perfectly (REQUIRED)
                  ======================================================== */}
              {currentScreen === 10 && (
                <motion.div
                  key="screen-10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#A98460] uppercase tracking-wider">
                      Long written response — Required
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#101827] mt-1">
                      10. If Beyanco could solve ONE problem perfectly when buying furniture, what would you want it to solve?
                    </h2>
                    <p className="text-xs text-[#626A75] mt-1 leading-relaxed">
                      Discover ideas, problems and expectations that help us build a product you genuinely want to use.
                    </p>
                  </div>

                  <div>
                    <textarea
                      rows={6}
                      required
                      value={q10OneThingPerfect}
                      onChange={(e) => {
                        setQ10OneThingPerfect(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="Tell us what would make Beyanco a product you would genuinely want to use..."
                      className="w-full p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#D8D5CF] text-[#101827] text-base sm:text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all leading-relaxed"
                    />
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  SCREEN 11: YOUR DETAILS (CONTACT & CONSENT)
                  ======================================================== */}
              {currentScreen === 11 && (
                <motion.div
                  key="screen-11"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Logo above contact section */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#D8D5CF]/60">
                    <img
                      src="/beyanco-logo.jpg"
                      alt="Beyanco"
                      className="h-8 w-auto object-contain mix-blend-multiply"
                    />
                    <div>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-[#101827]">
                        YOUR DETAILS
                      </h2>
                      <p className="text-xs text-[#626A75]">
                        All contact details are optional. If you prefer to stay anonymous, leave them blank and click Submit.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
                        Name <span className="font-normal text-[#94A3B8]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-4 h-4 text-[#94A3B8]" />
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF] text-[#101827] text-base sm:text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Mobile Number with country calling code */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
                        Mobile Number <span className="font-normal text-[#94A3B8]">(Optional)</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="h-12 px-3 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF] text-[#101827] text-sm focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all cursor-pointer font-mono"
                        >
                          <option value="+91">+91 (IN)</option>
                          <option value="+1">+1 (US/CA)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+971">+971 (UAE)</option>
                          <option value="+65">+65 (SG)</option>
                          <option value="+61">+61 (AU)</option>
                        </select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#94A3B8]" />
                          <input
                            type="tel"
                            value={contactMobile}
                            onChange={(e) => setContactMobile(e.target.value)}
                            placeholder="Enter your mobile number"
                            className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF] text-[#101827] text-base sm:text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#626A75] mb-1.5">
                        Email Address <span className="font-normal text-[#94A3B8]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#94A3B8]" />
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#FAF8F5] border border-[#D8D5CF] text-[#101827] text-base sm:text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A98460] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Early Access Checkbox (Unchecked by default) */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#D8D5CF] flex items-start gap-3 mt-2">
                      <input
                        type="checkbox"
                        id="early-access-updates"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-[#D8D5CF] text-[#101827] focus:ring-[#A98460] cursor-pointer"
                      />
                      <label
                        htmlFor="early-access-updates"
                        className="text-xs text-[#101827] font-medium cursor-pointer select-none leading-relaxed"
                      >
                        Want early access and updates on what we build from your feedback?
                      </label>
                    </div>

                    {/* 15-Minute Call Question */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#D8D5CF] space-y-2">
                      <label className="block text-xs font-semibold text-[#101827]">
                        Would you be open to a 15-minute call with our team?
                      </label>
                      <div className="flex gap-3">
                        {["Yes", "No"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setInterviewInterest(opt)}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                              interviewInterest === opt
                                ? "bg-[#101827] text-white border-[#101827]"
                                : "bg-white text-[#626A75] border-[#D8D5CF] hover:border-[#101827]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Direct Team Contact Notice */}
                    <div className="pt-2 text-xs text-[#626A75] leading-relaxed border-t border-[#D8D5CF]/50">
                      Have questions or wish to share your thoughts directly? You can reach our founding team:
                      <div className="mt-1 font-medium text-[#101827] flex flex-col sm:flex-row sm:gap-4">
                        <span>Akash: <span className="font-mono text-[#A98460]">+91 8189833313</span></span>
                        <span>Tarun: <span className="font-mono text-[#A98460]">+91 6380644305</span></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Controls: Back, Skip, Next / Submit */}
            <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#D8D5CF]/60 flex items-center justify-between gap-3">
              
              {/* Back Button */}
              {currentScreen > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-[#D8D5CF] text-[#101827] text-xs font-semibold uppercase tracking-wider hover:border-[#101827] hover:bg-[#FAF8F5] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {/* Right actions: Skip (if optional) & Next / Submit */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Skip button for optional questions */}
                {currentScreen <= 10 && currentScreen !== 1 && currentScreen !== 6 && currentScreen !== 10 && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-full text-xs text-[#626A75] hover:text-[#101827] font-semibold uppercase tracking-wider transition-colors"
                  >
                    Skip
                  </button>
                )}

                {/* Next or Submit Button */}
                {currentScreen < 11 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#101827] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A98460] shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#101827] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A98460] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Feedback</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>

      <WaitlistFooter />
    </div>
  );
}
