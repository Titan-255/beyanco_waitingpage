"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Layers,
  Building,
  Camera,
  Home,
  Palette,
  Compass,
  Sliders,
  Maximize2,
  Grid3X3,
  ShieldCheck,
  Eye,
  HelpCircle,
} from "lucide-react";
import { WaitlistNavbar } from "@/components/marketing/WaitlistNavbar";
import { WaitlistFooter } from "@/components/marketing/WaitlistFooter";
import { ArchitecturalSlider } from "@/components/ui/ArchitecturalSlider";
import { WaitlistInlineForm } from "@/components/waitlist/WaitlistInlineForm";
import { FeedbackInvitationModal } from "@/components/feedback/FeedbackInvitationModal";

// Conceptual Demonstration Showcase Rooms
const SHOWCASE_ROOMS = [
  {
    id: "bedroom",
    designId: "gen_003",
    title: "Belvedere Master Suite",
    type: "Master Bedroom",
    styleName: "Modern Luxury Retreat",
    dimensions: "5.6m × 4.4m",
    ceilingHeight: "3.1m Tray Ceiling",
    beforeImage: "/showcase/bedroom-before.jpg",
    afterImage: "/showcase/bedroom-after.jpg",
    beforeLabel: "ORIGINAL MASTER BEDROOM",
    afterLabel: "STAGED MODERN LUXURY RETREAT",
    narrative: "Empty primary master bedroom featuring an architectural tray ceiling and bright dual windows, staged into a serene suite with an upholstered king platform bed, warm terracotta and linen bedding, bedside nightstands, and a cozy reading alcove.",
    tags: ["King Platform Bed", "Tactile Linen Bedding", "Bouclé Reading Chair", "Architectural Tray Ceiling"],
    hotspots: [
      {
        id: "bed-bed",
        x: 58,
        y: 64,
        storeName: "Wakefit",
        priceInr: "₹24,890",
        storeUrl: "https://www.wakefit.co/beds",
      },
      {
        id: "bed-nightstand",
        x: 76,
        y: 68,
        storeName: "Urban Ladder",
        priceInr: "₹7,999",
        storeUrl: "https://www.urbanladder.com/bedside-tables",
      },
      {
        id: "bed-chair",
        x: 35,
        y: 74,
        storeName: "Home Centre",
        priceInr: "₹18,999",
        storeUrl: "https://www.homecentre.in/in/en/c/furniture-livingroom-chairs",
      },
      {
        id: "bed-rug",
        x: 52,
        y: 86,
        storeName: "Pepperfry",
        priceInr: "₹8,499",
        storeUrl: "https://www.pepperfry.com/carpets-rugs.html",
      },
    ],
  },
  {
    id: "dining-room",
    designId: "gen_004",
    title: "The Lumina Dining Atelier",
    type: "Dining Room",
    styleName: "Nordic White Oak & Stone",
    dimensions: "4.8m × 4.0m",
    ceilingHeight: "2.9m Ceiling with Medallion",
    beforeImage: "/showcase/dining-before.jpg",
    afterImage: "/showcase/dining-after.jpg",
    beforeLabel: "ORIGINAL DINING ROOM",
    afterLabel: "STAGED NORDIC WHITE OAK & STONE",
    narrative: "Sunlit vacant formal dining space with classic wainscoting paneling and bay windows staged into an intimate 6-person entertaining environment with a rich solid wood dining table, upholstered seating, and modern gallery art.",
    tags: ["Solid Walnut Table", "Wainscoting Preserved", "6-Person Place Settings", "Contemporary Wall Art"],
    hotspots: [
      {
        id: "din-table",
        x: 54,
        y: 68,
        storeName: "WoodenStreet",
        priceInr: "₹36,999",
        storeUrl: "https://www.woodenstreet.com/dining-table-sets",
      },
      {
        id: "din-chairs",
        x: 42,
        y: 72,
        storeName: "Urban Ladder",
        priceInr: "₹11,499",
        storeUrl: "https://www.urbanladder.com/dining-chairs",
      },
      {
        id: "din-console",
        x: 82,
        y: 70,
        storeName: "Pepperfry",
        priceInr: "₹14,999",
        storeUrl: "https://www.pepperfry.com/furniture-tables-console-tables.html",
      },
      {
        id: "din-rug",
        x: 56,
        y: 88,
        storeName: "IKEA India",
        priceInr: "₹9,990",
        storeUrl: "https://www.ikea.com/in/en/cat/rugs-10653/",
      },
    ],
  },
  {
    id: "kitchen",
    designId: "gen_002",
    title: "Terrace Villa Culinary Space",
    type: "Kitchen & Island",
    styleName: "Japandi Culinary Atelier",
    dimensions: "5.8m × 3.8m",
    ceilingHeight: "3.0m High Ceilings",
    beforeImage: "/showcase/kitchen-before.jpg",
    afterImage: "/showcase/kitchen-after.jpg",
    beforeLabel: "ORIGINAL KITCHEN",
    afterLabel: "STAGED JAPANDI CULINARY ATELIER",
    narrative: "Pristine empty kitchen and oversized quartz island staged for lived-in luxury with brushed metal counter barstools, fresh fruit styling, curated ceramic vessels with olive branches, and breakfast dining in the background.",
    tags: ["Island Counter Stools", "Marble Island Preserved", "Natural Greenery Styling", "Pendant Lighting Fixtures"],
    hotspots: [
      {
        id: "kit-barstool-1",
        x: 50,
        y: 74,
        storeName: "IKEA India",
        priceInr: "₹8,490",
        storeUrl: "https://www.ikea.com/in/en/cat/bar-stools-chairs-20864/",
      },
      {
        id: "kit-barstool-2",
        x: 64,
        y: 76,
        storeName: "Urban Ladder",
        priceInr: "₹5,499",
        storeUrl: "https://www.urbanladder.com/bar-stools",
      },
      {
        id: "kit-vase",
        x: 58,
        y: 48,
        storeName: "Home Centre",
        priceInr: "₹2,299",
        storeUrl: "https://www.homecentre.in/in/en/c/homedecor-potsandplanters",
      },
      {
        id: "kit-breakfast",
        x: 36,
        y: 56,
        storeName: "Wakefit",
        priceInr: "₹18,299",
        storeUrl: "https://www.wakefit.co/dining-sets",
      },
    ],
  },
];

// Capabilities
const CAPABILITIES = [
  {
    number: "01",
    title: "Shoppable Interiors",
    description: "Every item in the image is a real product you can buy.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Shop Near You",
    description: "Find pieces from stores in your area and across online platforms.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Single-Store Shopping",
    description: "Furnish the whole room from one store to simplify delivery.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "Quick Delivery Filter",
    description: "Get your room set up faster.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "05",
    title: "Add or Remove Furniture",
    description: "Search and choose exactly which pieces appear in your room.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "06",
    title: "Drag and Rearrange",
    description: "Move furniture anywhere in the room until it feels right.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "07",
    title: "3D Arrangement",
    description: "See your layout from different angles before you buy.",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "08",
    title: "Multiple Styles",
    description: "Switch themes and compare looks in seconds.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop",
  },
];

// Product FAQs
const FAQS = [
  {
    q: "What is Beyanco AI?",
    a: "Beyanco AI turns a photo of your empty room into a furnished design made of real, buyable furniture. Click any piece to see its details and add it to your cart.",
  },
  {
    q: "Can I buy the furniture?",
    a: "Yes, that's the idea. Each item links to a real product from stores near you or online.",
  },
  {
    q: "Can I change the furniture?",
    a: "Yes. Add or remove pieces using the search bar, and drag items around your room.",
  },
  {
    q: "Is it available now?",
    a: "Not yet. We're building it, and waitlist members get early access.",
  },
];

export default function WaitlistLandingPage() {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const activeRoom = SHOWCASE_ROOMS[selectedRoomIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#101827]">
      <WaitlistNavbar />

      {/* ========================================================
          SECTION B: CINEMATIC HERO
          ======================================================== */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden" id="vision">
        {/* Subtle architectural grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#101827_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Architectural Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101827]/5 border border-[#101827]/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A98460] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#101827]">
                Pre-launch • Join the waitlist
              </span>
            </motion.div>

            {/* Headline with Editorial Serif */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] font-serif font-bold text-[#101827] tracking-tight leading-[1.08] sm:leading-[1.06]"
            >
              Redesign your space in seconds. <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#A98460]">Buy exactly what you see.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-[#626A75] max-w-2xl mx-auto leading-relaxed"
            >
              Upload a photo of your empty room and Beyanco AI furnishes it with real furniture you can actually buy. Click any piece to see its price, size and material, then add it to your cart.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <a
                href="#waitlist"
                className="px-8 py-4 rounded-full bg-[#101827] text-white font-medium text-xs uppercase tracking-widest hover:bg-[#A98460] shadow-md hover:shadow-xl transition-all duration-200"
              >
                Join the Waitlist
              </a>
              <Link
                href="/feedback"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white border border-[#D8D5CF] text-[#101827] font-medium text-xs uppercase tracking-widest hover:border-[#101827] hover:bg-[#FAF8F5] transition-all duration-200"
              >
                <span>Help Shape Beyanco</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#A98460]" />
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual: Large Immersive Architectural Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-14 max-w-5xl mx-auto"
          >
            <div className="relative p-2 md:p-3 rounded-[24px] bg-white border border-[#D8D5CF]/70 shadow-architectural-lg">
              <ArchitecturalSlider
                beforeImage="/showcase/living-before.jpg"
                afterImage="/showcase/living-after.jpg"
                beforeLabel="ORIGINAL LIVING ROOM"
                afterLabel="STAGED WARM CONTEMPORARY MINIMALIST"
                roomTitle="Skyline Living Sanctuary"
                styleName="Warm Contemporary Minimalist"
                dimensions="6.4m × 5.1m"
                aspectRatio="aspect-[16/10]"
                initialSliderPosition={50}
                hotspots={[
                  {
                    id: "lr-sofa",
                    x: 74,
                    y: 52,
                    storeName: "Pepperfry",
                    priceInr: "₹42,999",
                    storeUrl: "https://www.pepperfry.com/furniture-sofas.html",
                  },
                  {
                    id: "lr-table",
                    x: 52,
                    y: 78,
                    storeName: "WoodenStreet",
                    priceInr: "₹14,499",
                    storeUrl: "https://www.woodenstreet.com/coffee-tables",
                  },
                  {
                    id: "lr-side-table",
                    x: 84,
                    y: 84,
                    storeName: "IKEA India",
                    priceInr: "₹4,990",
                    storeUrl: "https://www.ikea.com/in/en/cat/coffee-side-tables-10705/",
                  },
                  {
                    id: "lr-planter",
                    x: 36,
                    y: 55,
                    storeName: "Home Centre",
                    priceInr: "₹2,499",
                    storeUrl: "https://www.homecentre.in/in/en/c/homedecor-potsandplanters",
                  },
                ]}
              />
            </div>
            <div className="mt-4 flex items-center justify-center px-2 text-xs text-[#626A75]">
              <span>Every piece in this room is real, in stock and one click from your cart.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          SECTION C: INTERACTIVE ROOM SHOWCASE
          ======================================================== */}
      <section className="py-24 bg-[#FAF8F5] border-y border-[#D8D5CF]/60" id="showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
                Interactive Exploration
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#101827] mt-2">
                Click any piece. Know everything. Buy it.
              </h2>
            </div>
            <p className="text-sm text-[#626A75] max-w-md">
              Tap a sofa, a lamp or a rug in the generated image to see its colour, size, material, price and the store selling it.
            </p>
          </div>

          {/* Room Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {SHOWCASE_ROOMS.map((room, idx) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomIndex(idx)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  selectedRoomIndex === idx
                    ? "bg-[#101827] text-white shadow-sm"
                    : "bg-white text-[#626A75] border border-[#D8D5CF] hover:border-[#101827]"
                }`}
              >
                {room.type}
              </button>
            ))}
          </div>

          {/* Active Room Comparison Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 p-2 rounded-[24px] bg-white border border-[#D8D5CF] shadow-architectural">
              <ArchitecturalSlider
                key={activeRoom.id}
                beforeImage={activeRoom.beforeImage}
                afterImage={activeRoom.afterImage}
                beforeLabel={activeRoom.beforeLabel || `ORIGINAL ${activeRoom.type.toUpperCase()}`}
                afterLabel={activeRoom.afterLabel || `STAGED ${activeRoom.styleName.toUpperCase()}`}
                roomTitle={activeRoom.title}
                styleName={activeRoom.styleName}
                dimensions={activeRoom.dimensions}
                aspectRatio="aspect-[16/10]"
                initialSliderPosition={50}
                hotspots={activeRoom.hotspots}
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A98460]">
                  Architectural Narrative
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#101827]">
                  {activeRoom.title}
                </h3>
                <p className="text-sm text-[#626A75] leading-relaxed">
                  {activeRoom.narrative}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#D8D5CF]/80 space-y-3">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-[#D8D5CF]/60">
                  <span className="text-[#626A75]">Spatial Dimensions</span>
                  <span className="font-semibold text-[#101827]">{activeRoom.dimensions}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-3 border-b border-[#D8D5CF]/60">
                  <span className="text-[#626A75]">Ceiling Height</span>
                  <span className="font-semibold text-[#101827]">{activeRoom.ceilingHeight}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#626A75]">Aesthetic Style</span>
                  <span className="font-semibold text-[#A98460]">{activeRoom.styleName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#626A75]">
                  Curated Architectural Elements:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeRoom.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-[#101827]/5 text-[#101827] border border-[#101827]/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/feedback"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#101827] hover:text-[#A98460] transition-colors"
                >
                  <span>Request specific room types in our survey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION D: HOW BEYANCO WORKS
          ======================================================== */}
      <section className="py-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
              The Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#101827]">
              From an empty room to a furnished home in 4 steps.
            </h2>
            <p className="text-sm text-[#626A75]">
              Designed around how real estate professionals and architects actually work. Four simple steps to transform vacant property images into finished listing visuals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-[24px] bg-white border border-[#D8D5CF] shadow-subtle space-y-5 flex flex-col justify-between">
              <div>
                <span className="font-serif text-3xl font-bold text-[#A98460]">01</span>
                <h3 className="text-lg font-serif font-bold text-[#101827] mt-3">
                  Upload your space
                </h3>
                <p className="text-xs text-[#626A75] leading-relaxed mt-2">
                  Add a photo of your empty room along with its dimensions.
                </p>
              </div>
              <div className="pt-4 border-t border-[#D8D5CF]/50 text-[11px] text-[#A98460] font-medium uppercase tracking-wider">
                Raw Photo Ingestion
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-[24px] bg-white border border-[#D8D5CF] shadow-subtle space-y-5 flex flex-col justify-between">
              <div>
                <span className="font-serif text-3xl font-bold text-[#A98460]">02</span>
                <h3 className="text-lg font-serif font-bold text-[#101827] mt-3">
                  Pick your style
                </h3>
                <p className="text-xs text-[#626A75] leading-relaxed mt-2">
                  Choose a room type and a design theme, then hit Generate.
                </p>
              </div>
              <div className="pt-4 border-t border-[#D8D5CF]/50 text-[11px] text-[#A98460] font-medium uppercase tracking-wider">
                Style & Palettes
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-[24px] bg-white border border-[#D8D5CF] shadow-subtle space-y-5 flex flex-col justify-between">
              <div>
                <span className="font-serif text-3xl font-bold text-[#A98460]">03</span>
                <h3 className="text-lg font-serif font-bold text-[#101827] mt-3">
                  Click to shop
                </h3>
                <p className="text-xs text-[#626A75] leading-relaxed mt-2">
                  Tap any furniture in the image to see its colour, price, size and material. Add what you love to your cart.
                </p>
              </div>
              <div className="pt-4 border-t border-[#D8D5CF]/50 text-[11px] text-[#A98460] font-medium uppercase tracking-wider">
                Fine Architectural Control
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-8 rounded-[24px] bg-white border border-[#D8D5CF] shadow-subtle space-y-5 flex flex-col justify-between">
              <div>
                <span className="font-serif text-3xl font-bold text-[#A98460]">04</span>
                <h3 className="text-lg font-serif font-bold text-[#101827] mt-3">
                  Fine-tune with filters
                </h3>
                <p className="text-xs text-[#626A75] leading-relaxed mt-2">
                  Use the search bar to add or remove specific furniture. Filter by stores near you, a single store, quick delivery and more.
                </p>
              </div>
              <div className="pt-4 border-t border-[#D8D5CF]/50 text-[11px] text-[#A98460] font-medium uppercase tracking-wider">
                MLS & Print Ready
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <span className="text-xs text-[#8E97A4] italic">
              Note: The workflow above depicts Beyanco&apos;s planned product experience currently undergoing pre-launch user validation.
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION E: WHAT BEYANCO CAN HELP YOU DO
          ======================================================== */}
      <section className="py-24 bg-[#101827] text-white" id="capabilities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
                Product Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mt-2">
                More Than Virtual Staging.
              </h2>
            </div>
            <p className="text-sm text-[#8E97A4] max-w-md">
              Virtual staging is just the starting point. Beyanco is built as a complete interior architecture and spatial reimagination workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.number}
                className="group relative rounded-[20px] overflow-hidden bg-[#1E293B]/70 border border-white/10 hover:border-[#A98460]/60 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[16/11] overflow-hidden relative">
                  <img
                    src={cap.image}
                    alt={cap.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101827] via-transparent to-transparent opacity-90" />
                  <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 text-[10px] sm:text-xs font-serif font-bold text-[#A98460] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                    {cap.number}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-[#A98460] transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-[#8E97A4] leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Validation Survey Callout within Capabilities */}
          <div className="mt-16 p-8 rounded-[24px] bg-[#1E293B] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h4 className="text-lg font-serif font-bold text-white">
                Which capabilities matter most to your workflow?
              </h4>
              <p className="text-xs text-[#8E97A4]">
                Help us prioritize whether we should focus first on multi-room batch staging, custom materials, or high-definition MLS compliance.
              </p>
            </div>
            <Link
              href="/feedback"
              className="shrink-0 px-6 py-3 rounded-full bg-[#A98460] text-white hover:bg-[#C4A482] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
            >
              <span>Rank Your Top Features</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION H: WHY BEYANCO?
          ======================================================== */}
      <section className="py-24 bg-[#F6F4EF]" id="why-beyanco">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
              Architectural Differentiation
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#101827]">
              Not just inspiration. A room you can actually buy.
            </h2>
            <p className="text-sm text-[#626A75]">
              We don&apos;t build generic AI filters that distort room architecture. We build an interior visualization system anchored in spatial realism.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[24px] bg-white border border-[#D8D5CF] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#101827]/5 text-[#101827] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-[#A98460]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#101827]">
                Real furniture, not fantasy
              </h3>
              <p className="text-xs text-[#626A75] leading-relaxed">
                Other AI tools show you pretty pictures you can&apos;t buy. Everything in a Beyanco image is a real product.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-white border border-[#D8D5CF] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#101827]/5 text-[#101827] flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5 text-[#A98460]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#101827]">
                Fit your space
              </h3>
              <p className="text-xs text-[#626A75] leading-relaxed">
                Your room&apos;s dimensions guide what gets placed.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-white border border-[#D8D5CF] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#101827]/5 text-[#101827] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-[#A98460]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#101827]">
                Shop your way
              </h3>
              <p className="text-xs text-[#626A75] leading-relaxed">
                Filter by location, store, delivery speed and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION I: HELP SHAPE BEYANCO (CONVERSION CALLOUT)
          ======================================================== */}
      <section className="py-20 bg-[#101827] text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#A98460]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/15 text-[#A98460] text-xs font-semibold uppercase tracking-wider">
            <span>Customer Discovery & Research</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
            We&apos;re Building Beyanco. <br />
            <span className="italic font-normal text-[#A98460]">Help Us Build It Right.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#8E97A4] max-w-2xl mx-auto leading-relaxed">
            We believe every space has possibilities. But we also believe the best product starts by understanding the people who will actually use it.
            Tell us what matters to you, what frustrates you about existing solutions and what you would genuinely pay for.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/feedback"
              className="px-8 py-4 rounded-full bg-[#A98460] hover:bg-[#C4A482] text-[#101827] font-semibold text-xs uppercase tracking-widest transition-all duration-200 inline-flex items-center gap-2 shadow-lg"
            >
              <span>Share Your Opinion (3 Mins)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#waitlist"
              className="px-8 py-4 rounded-full bg-transparent border border-white/20 hover:border-white text-white text-xs uppercase tracking-widest transition-colors"
            >
              Just Join Waitlist
            </a>
          </div>

          <p className="text-xs text-[#626A75] pt-2">
            Your responses directly influence our 2026 feature roadmap and pricing models.
          </p>
        </div>
      </section>

      {/* ========================================================
          SECTION J: PRODUCT FAQ
          ======================================================== */}
      <section className="py-24 bg-[#FAF8F5]" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#101827]">
              Beyanco Product FAQs
            </h2>
            <p className="text-sm text-[#626A75]">
              Everything you need to know about our upcoming platform, pre-launch testing, and early access.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#D8D5CF] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-serif font-bold text-[#101827]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#A98460] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-[#626A75] leading-relaxed border-t border-[#D8D5CF]/40 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION K: FINAL WAITLIST CONVERSION
          ======================================================== */}
      <section className="py-24 bg-[#F6F4EF]" id="waitlist">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
            Early Access Registration
          </span>

          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#101827]">
            Your next great space starts here.
          </h2>

          <p className="text-base text-[#626A75] max-w-xl mx-auto leading-relaxed">
            Join the waitlist and be among the first to furnish your room with real furniture in seconds.
          </p>

          <div className="pt-4">
            <WaitlistInlineForm source="final_cta" />
          </div>

          <div className="pt-4 text-xs text-[#626A75]">
            Already signed up?{" "}
            <Link
              href="/feedback"
              className="text-[#101827] font-semibold underline hover:text-[#A98460] transition-colors"
            >
              Take our 3-minute customer discovery survey
            </Link>{" "}
            to gain priority onboarding.
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION L: FOOTER
          ======================================================== */}
      <WaitlistFooter />

      {/* 15-Second Customer Feedback Invitation Modal */}
      <FeedbackInvitationModal />
    </div>
  );
}
