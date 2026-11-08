"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SAMPLE_TRANSFORMATIONS } from "@/lib/sample-data";
import {
  Sparkles,
  ArrowRight,
  Layers,
  Download,
  Check,
  ChevronDown,
  Clock,
  ShieldCheck,
  Maximize2,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const [selectedGalleryTab, setSelectedGalleryTab] = useState<string>("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const heroTransformation = SAMPLE_TRANSFORMATIONS[0];

  const filteredTransformations =
    selectedGalleryTab === "all"
      ? SAMPLE_TRANSFORMATIONS
      : SAMPLE_TRANSFORMATIONS.filter(
          (t) => t.roomType === selectedGalleryTab
        );

  const faqs = [
    {
      q: "How does Beyanco AI virtual staging work?",
      a: "Upload a photo of an empty or outdated room. Our Interior Design Intelligence Engine analyzes the architectural geometry, ceiling height, natural lighting vectors, and spatial boundaries, then renders a photorealistic, fully furnished interior within seconds while preserving your property's exact walls, windows, and floors.",
    },
    {
      q: "Can I adjust or reposition furniture after generation?",
      a: "Yes! Beyanco AI features an interactive Furniture Editor. Unlike standard AI tools that return a static picture, you can open any staging design in our canvas editor to place, rotate, resize, and fine-tune catalogue furniture items on top of the space.",
    },
    {
      q: "Can I remove existing clutter or old furniture?",
      a: "Absolutely. Our AI Inpainting & Object Removal tool allows you to brush over unwanted clutter, old furniture, or wall fixtures. The model reconstructs the hidden wall and flooring texture naturally.",
    },
    {
      q: "Are the generated photographs high-resolution for MLS and print?",
      a: "Yes. All completed designs can be downloaded at full high-resolution (up to 4K crisp definition), fully formatted and color-calibrated for MLS listings, Zillow, Realtor.com, brochures, and print signage.",
    },
    {
      q: "Does the platform comply with real estate advertising regulations?",
      a: "Yes. In accordance with major real estate board guidelines and MLS compliance standards, Beyanco AI exports include standard virtual staging metadata and optional discreet disclosure badges.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-beyanco-bg text-beyanco-navy antialiased">
      <Navbar />

      {/* 1. HERO SECTION — BALANCED TWO-COLUMN (48% / 52%) */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-14">
            
            {/* Left Column (48% on desktop) */}
            <div className="w-full lg:w-[48%] space-y-7 text-left shrink-0">
              {/* Eyebrow Label */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-beyanco-paleBlue border border-blue-200/80 shadow-[0_1px_2px_rgba(37,99,235,0.06)]">
                <Sparkles className="w-3.5 h-3.5 text-beyanco-blue" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-beyanco-blue">
                  AI-POWERED REAL ESTATE VISUALIZATION
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-bold tracking-tight text-beyanco-navy leading-[1.08]">
                Transform Empty Spaces Into{" "}
                <span className="text-beyanco-blue">Beautiful Interiors.</span>
              </h1>

              {/* Description */}
              <p className="text-[17px] sm:text-[18px] text-beyanco-slate leading-relaxed max-w-[540px]">
                Turn ordinary property photographs into professionally staged interiors with AI-powered visualization. Create compelling real estate listings without physically furnishing the space.
              </p>

              {/* Hero CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link href="/login?redirect=/staging/new">
                  <Button
                    variant="primary"
                    size="lg"
                    className="h-[50px] px-8 rounded-[12px] text-base font-semibold bg-beyanco-blue hover:bg-beyanco-blueHover shadow-subtle hover:shadow-card active:scale-[0.98] transition-all"
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    Start Staging
                  </Button>
                </Link>
                <Link href="#gallery">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-[50px] px-8 rounded-[12px] text-base font-semibold bg-white text-beyanco-navy border border-beyanco-border hover:bg-slate-50 shadow-subtle active:scale-[0.98] transition-all"
                  >
                    Explore Transformations
                  </Button>
                </Link>
              </div>

              {/* Compact Three-Step Supporting Flow */}
              <div className="pt-7 mt-8 border-t border-beyanco-border/80 grid grid-cols-3 gap-4 sm:gap-6">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-bold text-beyanco-navy tracking-tight">
                    01 — Upload
                  </span>
                  <span className="text-xs text-beyanco-slate font-normal leading-snug">
                    Room photograph
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-bold text-beyanco-navy tracking-tight">
                    02 — Design
                  </span>
                  <span className="text-xs text-beyanco-slate font-normal leading-snug">
                    Style and preferences
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-bold text-beyanco-navy tracking-tight">
                    03 — Stage & Edit
                  </span>
                  <span className="text-xs text-beyanco-slate font-normal leading-snug">
                    Download your staged photo
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (52% on desktop) — Prominent Hero Image Showcase */}
            <div className="w-full lg:w-[52%]">
              <div className="bg-white p-3 sm:p-4 rounded-[20px] shadow-[0_16px_36px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] border border-beyanco-border transition-all">
                <BeforeAfterSlider
                  beforeImage={heroTransformation.beforeImage}
                  afterImage={heroTransformation.afterImage}
                  beforeLabel="BEFORE: ORIGINAL ROOM"
                  afterLabel="AFTER: STAGED INTERIOR"
                  aspectRatio="aspect-[16/10.5]"
                />
                
                {/* Image Card Footer */}
                <div className="mt-3.5 px-2 flex items-center justify-between text-xs text-beyanco-slate">
                  <span className="font-medium text-beyanco-navy flex items-center gap-1.5">
                    Interactive Comparison — Drag slider to view staging.
                  </span>
                  <Badge variant="blue" size="sm" className="font-semibold">
                    Contemporary Elegance
                  </Badge>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3-STEP WORKFLOW) */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white border-y border-beyanco-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="blue" size="md">
              EFFORTLESS PROCESS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-beyanco-navy tracking-tight">
              Three Steps from Empty Room to Finished Listing
            </h2>
            <p className="text-base text-beyanco-slate">
              No complex 3D software or physical staging crews required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-[18px] bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-beyanco-blue text-white flex items-center justify-center font-bold text-lg shadow-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-beyanco-navy">Upload Your Photo</h3>
              <p className="text-sm text-beyanco-slate leading-relaxed">
                Upload a JPEG or PNG of an empty, unfinished, or cluttered property room directly from your camera or listing archive.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-[18px] bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-beyanco-blue text-white flex items-center justify-center font-bold text-lg shadow-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-beyanco-navy">Choose Your Design Direction</h3>
              <p className="text-sm text-beyanco-slate leading-relaxed">
                Select your room type, curated interior style (Contemporary, Modern Luxury, Scandinavian, Japandi), and desired color palette.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-[18px] bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-beyanco-blue text-white flex items-center justify-center font-bold text-lg shadow-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-beyanco-navy">Generate, Edit & Export</h3>
              <p className="text-sm text-beyanco-slate leading-relaxed">
                Receive photorealistic staged variations in seconds, fine-tune individual furniture placements in the editor, and download for MLS.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/login?redirect=/staging/new">
              <Button size="lg" variant="primary" className="h-12 px-8 rounded-[12px]" icon={<ArrowRight className="w-4 h-4" />}>
                Try Staging A Room Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. BEFORE-AND-AFTER GALLERY SHOWCASE */}
      <section id="gallery" className="py-20 md:py-28 bg-beyanco-bg">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <Badge variant="blue" size="md" className="mb-2">
                REAL ESTATE GALLERY
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-beyanco-navy tracking-tight">
                Explore True Spatial Transformations
              </h2>
              <p className="text-sm text-beyanco-slate mt-2 max-w-xl">
                Notice how window frames, baseboard heights, and daylight angles remain authentic to each property.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Rooms" },
                { id: "living_room", label: "Living Rooms" },
                { id: "bedroom", label: "Master Suites" },
                { id: "dining_room", label: "Dining Areas" },
                { id: "home_office", label: "Home Offices" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGalleryTab(tab.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                    selectedGalleryTab === tab.id
                      ? "bg-beyanco-navy text-white shadow-sm"
                      : "bg-white text-beyanco-slate border border-beyanco-border hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transformation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredTransformations.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-beyanco-border rounded-[18px] p-4 shadow-card hover:shadow-cardHover transition-all space-y-4"
              >
                <BeforeAfterSlider
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  beforeLabel="BEFORE: ORIGINAL ROOM"
                  afterLabel="AFTER: STAGED INTERIOR"
                  aspectRatio="aspect-[16/10]"
                />

                <div className="px-2 pt-1 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-beyanco-navy">
                      {item.title}
                    </h3>
                    <Badge variant="blue" size="sm">
                      {item.styleName}
                    </Badge>
                  </div>
                  <p className="text-xs text-beyanco-slate leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-beyanco-muted">
                    <span>Room: {item.dimensions}</span>
                    <Link
                      href="/login?redirect=/staging/new"
                      className="text-beyanco-blue font-semibold hover:text-beyanco-blueHover inline-flex items-center gap-1"
                    >
                      Stage similar room <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE FURNITURE EDITOR SHOWCASE */}
      <section
        id="editor-showcase"
        className="py-20 md:py-28 bg-white border-y border-beyanco-border"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-beyanco-violet border border-purple-200">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  EXCLUSIVE FEATURE
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-beyanco-navy tracking-tight leading-tight">
                Your Design. <br />
                Your Complete Control.
              </h2>

              <p className="text-base text-beyanco-slate leading-relaxed">
                Move beyond pure AI generation. Fine-tune your interior by repositioning, resizing, rotating, and rearranging individual furniture elements with our dedicated canvas editor.
              </p>

              <div className="space-y-3 pt-2 text-sm text-beyanco-slate">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Real furniture catalogue pieces (Sofas, Lamps, Dining, Rugs, Plants)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Full transformation handles: drag, corner scale, free rotation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Layer management: bring forward, send backward, opacity slider</span>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/design/gen_001/edit">
                  <Button
                    variant="primary"
                    size="lg"
                    className="h-12 px-7 rounded-[12px]"
                    icon={<Layers className="w-4 h-4" />}
                  >
                    Open Live Furniture Editor
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Editor Preview Workspace Visual */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 rounded-[20px] p-4 shadow-elevated border border-slate-700 overflow-hidden">
                {/* Editor Header Bar mock */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-slate-400">Beyanco Canvas Editor</span>
                  </div>
                  <Badge variant="blue" size="sm">
                    Interactive Workspace
                  </Badge>
                </div>

                {/* Editor Canvas mock */}
                <div className="relative mt-3 rounded-xl overflow-hidden aspect-[16/10] bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop"
                    alt="Editor preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Selection bounding box mock */}
                  <div className="absolute top-[52%] left-[42%] -translate-x-1/2 -translate-y-1/2 w-[38%] h-[32%] border-2 border-beyanco-blue rounded-lg bg-blue-500/10 pointer-events-none">
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-beyanco-blue rounded-sm" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-beyanco-blue rounded-sm" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-beyanco-blue rounded-sm" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-beyanco-blue rounded-sm" />
                    {/* Rotation stem */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-beyanco-blue" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-beyanco-blue rounded-full" />
                    <span className="absolute -bottom-6 left-0 px-2 py-0.5 text-[10px] font-mono bg-beyanco-navy text-white rounded">
                      Curved Bouclé Sofa • 215cm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-20 md:py-28 bg-beyanco-bg">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <Badge variant="blue" size="md">
              FLEXIBLE PLANS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-beyanco-navy tracking-tight">
              Invest in Staging that Sells Faster
            </h2>
            <p className="text-base text-beyanco-slate">
              Physical staging costs $2,000 to $5,000 per home. Beyanco AI provides photorealistic staging for a fraction of the cost.
            </p>

            {/* Monthly / Annual toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-beyanco-navy font-bold" : "text-beyanco-slate"}`}>
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")
                }
                className="w-12 h-6 bg-slate-200 rounded-full p-0.5 transition-colors relative"
              >
                <div
                  className={`w-5 h-5 bg-beyanco-blue rounded-full transition-transform ${
                    billingPeriod === "annual" ? "translate-x-6" : ""
                  }`}
                />
              </button>
              <span className={`text-sm font-medium flex items-center gap-1.5 ${billingPeriod === "annual" ? "text-beyanco-navy font-bold" : "text-beyanco-slate"}`}>
                Annual <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <Card className="flex flex-col justify-between space-y-6 rounded-[18px]">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-beyanco-navy">Starter</h3>
                <p className="text-xs text-beyanco-slate">
                  For individual photographers and solo agents with occasional listings.
                </p>
                <div className="pt-2">
                  <span className="text-4xl font-bold text-beyanco-navy">
                    {billingPeriod === "monthly" ? "$11.99" : "$9.50"}
                  </span>
                  <span className="text-xs text-beyanco-slate"> / month</span>
                </div>
                <div className="space-y-2.5 pt-4 text-xs text-beyanco-slate border-t border-slate-100">
                  <div className="flex items-center gap-2 text-beyanco-navy">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span><strong>30 Staging Credits</strong> / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span>High-Resolution Photo Downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span>5 Core Interior Styles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span>Standard Generation Speed</span>
                  </div>
                </div>
              </div>
              <Link href="/login?redirect=/staging/new" className="w-full">
                <Button variant="secondary" size="md" className="w-full h-11 rounded-[12px]">
                  Get Started
                </Button>
              </Link>
            </Card>

            {/* Growth / Professional Plan (Highlighted) */}
            <Card className="flex flex-col justify-between space-y-6 border-2 border-beyanco-blue relative shadow-elevated rounded-[18px]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-beyanco-blue text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-beyanco-navy">Growth / Pro</h3>
                <p className="text-xs text-beyanco-slate">
                  For active real estate agencies, interior designers, and high-volume stagers.
                </p>
                <div className="pt-2">
                  <span className="text-4xl font-bold text-beyanco-navy">
                    {billingPeriod === "monthly" ? "$29.99" : "$23.90"}
                  </span>
                  <span className="text-xs text-beyanco-slate"> / month</span>
                </div>
                <div className="space-y-2.5 pt-4 text-xs text-beyanco-slate border-t border-slate-100">
                  <div className="flex items-center gap-2 text-beyanco-navy font-semibold">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span><strong>150 Staging Credits</strong> / month</span>
                  </div>
                  <div className="flex items-center gap-2 text-beyanco-navy">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span>Full Interactive Furniture Editor Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span>All 10+ Curated Architectural Styles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span>AI Object Inpainting & Decluttering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span>4K Ultra-Resolution Uncompressed Exports</span>
                  </div>
                </div>
              </div>
              <Link href="/login?redirect=/staging/new" className="w-full">
                <Button variant="primary" size="md" className="w-full h-11 rounded-[12px]">
                  Start Growth Staging
                </Button>
              </Link>
            </Card>

            {/* Business / Enterprise Plan */}
            <Card className="flex flex-col justify-between space-y-6 rounded-[18px]">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-beyanco-navy">Business / Agency</h3>
                <p className="text-xs text-beyanco-slate">
                  For large brokerages, real estate franchises, and architectural developers.
                </p>
                <div className="pt-2">
                  <span className="text-4xl font-bold text-beyanco-navy">
                    {billingPeriod === "monthly" ? "$59.99" : "$47.50"}
                  </span>
                  <span className="text-xs text-beyanco-slate"> / month</span>
                </div>
                <div className="space-y-2.5 pt-4 text-xs text-beyanco-slate border-t border-slate-100">
                  <div className="flex items-center gap-2 text-beyanco-navy">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span><strong>400 Staging Credits</strong> / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span>Multi-Seat Team Collaboration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span>Developer REST API Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-beyanco-emerald shrink-0" />
                    <span>Dedicated Architecture Support</span>
                  </div>
                </div>
              </div>
              <Link href="/login?redirect=/staging/new" className="w-full">
                <Button variant="secondary" size="md" className="w-full h-11 rounded-[12px]">
                  Contact Enterprise
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="py-20 md:py-28 bg-white border-y border-beyanco-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <Badge variant="blue" size="md">
              FREQUENTLY ASKED QUESTIONS
            </Badge>
            <h2 className="text-3xl font-bold text-beyanco-navy tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-beyanco-border rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-beyanco-navy hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-beyanco-slate transition-transform ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="p-5 pt-0 text-sm text-beyanco-slate leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-beyanco-navy via-slate-900 to-beyanco-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to Stage Your Next Listing with Beyanco AI?
          </h2>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Upload your first room photo right now. Experience photorealistic spatial staging and interactive furniture control.
          </p>
          <div className="pt-2">
            <Link href="/login?redirect=/staging/new">
              <Button
                variant="primary"
                size="lg"
                icon={<Sparkles className="w-5 h-5" />}
                className="bg-beyanco-blue hover:bg-blue-600 text-white h-12 px-8 rounded-[12px]"
              >
                Start Virtual Staging Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
