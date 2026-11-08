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
  PenLine,
} from "lucide-react";
import { WaitlistNavbar } from "@/components/marketing/WaitlistNavbar";
import { WaitlistFooter } from "@/components/marketing/WaitlistFooter";
import { ArchitecturalSlider } from "@/components/ui/ArchitecturalSlider";
import { WaitlistInlineForm } from "@/components/waitlist/WaitlistInlineForm";

// Conceptual Demonstration Showcase Rooms
const SHOWCASE_ROOMS = [
  {
    id: "living-room",
    designId: "gen_001",
    title: "Skyline Living Sanctuary",
    type: "Living Room",
    styleName: "Warm Contemporary Minimalist",
    dimensions: "6.4m × 5.1m",
    ceilingHeight: "3.4m Vaulted Ceiling",
    beforeImage: "/showcase/living-before.jpg",
    afterImage: "/showcase/living-after.jpg",
    beforeLabel: "ORIGINAL LIVING ROOM",
    afterLabel: "STAGED WARM CONTEMPORARY MINIMALIST",
    narrative: "Vacant vaulted living room with a brick hearth fireplace and natural hardwood flooring transformed into an editorial contemporary lounge with an organic wood coffee table, low-profile seating, and woven lounge accents.",
    tags: ["Custom Low Seating", "Organic Oak Surfaces", "Fireplace Hearth Staged", "Natural Light Preservation"],
    hotspots: [
      {
        id: "lr-sofa",
        x: 68,
        y: 72,
        storeName: "Urban Ladder",
        priceInr: "₹42,999",
        storeUrl: "https://www.urbanladder.com/sofas",
      },
      {
        id: "lr-table",
        x: 48,
        y: 76,
        storeName: "WoodenStreet",
        priceInr: "₹14,499",
        storeUrl: "https://www.woodenstreet.com/coffee-tables",
      },
      {
        id: "lr-side-table",
        x: 54,
        y: 86,
        storeName: "IKEA India",
        priceInr: "₹4,990",
        storeUrl: "https://www.ikea.com/in/en/cat/coffee-side-tables-10705/",
      },
      {
        id: "lr-planter",
        x: 44,
        y: 58,
        storeName: "Home Centre",
        priceInr: "₹2,499",
        storeUrl: "https://www.homecentre.in/in/en/c/homedecor-potsandplanters",
      },
    ],
  },
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

// Audiences
const AUDIENCES = [
  {
    id: "agents",
    role: "Real Estate Agents",
    summary: "Sell the lifestyle before a single piece of furniture is moved.",
    benefit: "Turn empty, cold property photos into emotive listings that generate 3x more viewing inquiries and faster buyer commitment.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "agencies",
    role: "Real Estate Agencies",
    summary: "Establish an unmistakable, premium visual standard across all listings.",
    benefit: "Arm entire brokerages with brand-aligned interior visualization that outperforms competitor portals without expensive physical staging.",
    icon: Building,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "designers",
    role: "Interior Designers",
    summary: "Iterate aesthetic concepts in minutes instead of weeks of 3D modeling.",
    benefit: "Explore layouts, timber finishes, marble choices, and bespoke furniture combinations with clients before committing to procurement.",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "photographers",
    role: "Property Photographers",
    summary: "Expand your service tier from basic photography to full virtual staging.",
    benefit: "Deliver both RAW/HDR architecture photography and ready-to-list furnished interiors to your agent clients as a high-margin add-on.",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "builders",
    role: "Builders & Developers",
    summary: "Pre-sell off-plan and newly constructed residences at peak value.",
    benefit: "Help prospective buyers visualize how raw drywall and open floorplans feel when designed into an aspirational architectural home.",
    icon: Compass,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "owners",
    role: "Property Owners & Landlords",
    summary: "Reimagine your space and maximize rental returns with clear visuals.",
    benefit: "Experiment with renovation concepts or attract premium tenants without the heavy upfront cost of physical staging.",
    icon: Maximize2,
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
  },
];

// Capabilities
const CAPABILITIES = [
  {
    number: "01",
    title: "AI Virtual Staging",
    description: "Populate vacant rooms with perspective-accurate, photorealistic furniture that aligns with natural room shadows and lighting angles.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Complete AI Interior Design",
    description: "Go beyond furniture placement. Reconceptualize wall finishes, flooring materials, ceiling details, and lighting vectors seamlessly.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Multiple Interior Styles",
    description: "Shift between Warm Minimalism, Japandi, Modern Luxury, Scandinavian, and Contemporary Eclectic with a single prompt direction.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "Furniture Customization",
    description: "Specify intentional seating arrangements, organic curved sofas, stone coffee tables, and bespoke dining layouts tailored to each room.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "05",
    title: "Material & Colour Selection",
    description: "Select tactile materials — honed travertine, bouclé fabric, smoked oak, brushed brass, and micro-cement plaster — with authentic texture reproduction.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "06",
    title: "Room-Level Refinement",
    description: "Preserve structural window mullions, outdoor vistas, molding details, and electrical fixtures while reimagining the interior aesthetic.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "07",
    title: "Before-and-After Studio",
    description: "Export high-resolution MLS-compliant split comparisons and marketing collateral for listings, proposals, and social reels.",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "08",
    title: "Multi-Room Property Projects",
    description: "Maintain a cohesive architectural language across living rooms, bedrooms, and dining spaces within the same property listing.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop",
  },
];

// Coordinated Property Showcase
const PROPERTY_ROOMS = [
  { name: "Living Sanctuary", tag: "Warm Bouclé & Travertine", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop" },
  { name: "Master Suite", tag: "Tactile Linen & Ribbed Oak", img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop" },
  { name: "Guest Bedroom", tag: "Neutral Wool & Soft Plaster", img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop" },
  { name: "Culinary Island", tag: "Honed Limestone & Bronze", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" },
  { name: "Dining Alcove", tag: "Curved Oak & Minimalist Ceramics", img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800&auto=format&fit=crop" },
  { name: "Sunset Terrace", tag: "Teak Millwork & Linear Planters", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop" },
];

// Product FAQs
const FAQS = [
  {
    q: "What is Beyanco AI?",
    a: "Beyanco AI is an architectural visualization platform designed to transform ordinary property photographs into photorealistic, professionally designed interiors. It blends spatial AI intelligence with real architectural principles so real estate agents, designers, and developers can showcase potential spaces with refined authenticity.",
  },
  {
    q: "Who is Beyanco designed for?",
    a: "Beyanco is specifically crafted for real estate agents and brokerages seeking higher listing conversion, interior designers who need rapid concept ideation, property photographers expanding their service offerings, and developers pre-selling off-plan properties.",
  },
  {
    q: "What is AI virtual staging?",
    a: "AI virtual staging takes a digital photograph of a vacant or unfurnished room and realistically places 3D furniture, area rugs, lighting, and art into the scene. Unlike physical staging which costs thousands and takes days of moving heavy furniture, virtual staging takes seconds and allows you to test multiple styles.",
  },
  {
    q: "How is interior design different from virtual staging?",
    a: "Virtual staging typically places furniture inside an existing room while keeping all wall paints, flooring, and finishes untouched. Beyanco's AI Interior Design capability goes deeper: it can reimagine the entire material palette — from replacing outdated linoleum with herringbone oak to resurfacing walls with lime-wash plaster and reconfiguring lighting fixtures.",
  },
  {
    q: "Can I customize the furniture, styles, and materials?",
    a: "Yes. Our core product vision is intentional control. Rather than giving you a random generic AI picture, Beyanco allows you to specify design styles (e.g. Warm Minimalism, Japandi, Contemporary), request specific seating arrangements, choose material textures (travertine, bouclé, walnut), and define what to keep versus replace.",
  },
  {
    q: "Can Beyanco be used for multiple rooms under one property?",
    a: "Yes. Beyanco is built around a Property-First architecture. You can organize an entire listing (Living Room, Kitchen, Master Bedroom, Balcony) under a single property project, ensuring all generated rooms share a coordinated architectural direction, lighting mood, and design language.",
  },
  {
    q: "Is Beyanco available right now?",
    a: "We are currently in private pre-launch development. This website is part of our product validation phase to gather direct requirements, feedback, and willingness-to-pay insights from real estate professionals and interior designers before our public release.",
  },
  {
    q: "How can I get early access?",
    a: "You can secure an invitation by submitting your email on our waitlist below. Completing our 3-minute Customer Opinion Questionnaire grants you priority access and an opportunity to participate in our closed beta cohort.",
  },
];

export default function WaitlistLandingPage() {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [selectedAudienceIndex, setSelectedAudienceIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const activeRoom = SHOWCASE_ROOMS[selectedRoomIndex];
  const activeAudience = AUDIENCES[selectedAudienceIndex];

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
                Architectural AI Visualization • Pre-Launch
              </span>
            </motion.div>

            {/* Headline with Editorial Serif */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-serif font-bold text-[#101827] tracking-tight leading-[1.06]"
            >
              Empty Rooms. <br />
              <span className="italic font-normal text-[#A98460]">Endless Possibilities.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-[#626A75] max-w-2xl mx-auto leading-relaxed"
            >
              Transform ordinary property photographs into beautifully designed interiors.
              Explore styles, visualize furniture and reimagine spaces with Beyanco AI.
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
                beforeImage={SHOWCASE_ROOMS[0].beforeImage}
                afterImage={SHOWCASE_ROOMS[0].afterImage}
                beforeLabel="ORIGINAL PHOTOGRAPH"
                afterLabel="BEYANCO DESIGNED INTERIOR"
                roomTitle="Skyline Waterfront Penthouse"
                styleName="Warm Contemporary Lounge"
                dimensions="6.4m × 5.1m"
                aspectRatio="aspect-[16/10]"
                initialSliderPosition={50}
              />
            </div>
            <div className="mt-4 flex items-center justify-between px-2 text-xs text-[#626A75]">
              <span>Vacant space captured on standard smartphone photo</span>
              <span className="font-serif italic text-[#A98460]">Interactive architectural comparison</span>
              <span>Rendered with spatial fidelity and true window lighting</span>
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
                See the Possibilities in Every Space.
              </h2>
            </div>
            <p className="text-sm text-[#626A75] max-w-md">
              Switch across different room environments to experience how our architectural models balance room boundaries, natural sunlight, and curated materiality.
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
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs text-[#626A75] font-medium">Furniture Layout</span>
                  <Link
                    href={`/design/${activeRoom.designId}/edit?room=${activeRoom.id}`}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101827] hover:bg-[#A98460] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow hover:scale-[1.02] active:scale-95"
                    title={`Open Furniture Editor for ${activeRoom.title}`}
                  >
                    <PenLine className="w-3.5 h-3.5 text-[#A98460] group-hover:text-white transition-transform duration-300 group-hover:rotate-12" />
                    <span>Edit</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
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
              From an Ordinary Photograph to a Designed Space.
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
                  Upload Your Space
                </h3>
                <p className="text-xs text-[#626A75] leading-relaxed mt-2">
                  Start with an existing photo of a vacant room or outdated interior taken on a smartphone or DSLR. No LiDAR or special 3D scanner required.
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
                  Choose Your Vision
                </h3>
                <p className="text-xs text-[#626A75] leading-relaxed mt-2">
                  Select your intended aesthetic direction — Warm Minimalism, Scandinavian, Modern Luxury, or Contemporary. Define target demographic and room purpose.
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
                  Personalize the Design
                </h3>
                <p className="text-xs text-[#626A75] leading-relaxed mt-2">
                  Give room-specific instructions: preserve window views, specify low-profile bouclé sofas, or swap flooring to wide-plank European oak.
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
                  Visualize Your Space
                </h3>
                <p className="text-xs text-[#626A75] leading-relaxed mt-2">
                  Receive photorealistic, full-resolution interior photographs calibrated for MLS listings, investor pitch decks, and high-end marketing collateral.
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
                  <span className="absolute top-3 left-3 text-xs font-serif font-bold text-[#A98460] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
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
          SECTION F: WHO IS BEYANCO FOR?
          ======================================================== */}
      <section className="py-24 bg-[#F6F4EF]" id="for-professionals">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
              Audience Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#101827]">
              Designed Around the People Who Shape Spaces.
            </h2>
            <p className="text-sm text-[#626A75]">
              Tailored visual workflows built for every stakeholder in real estate marketing, architecture, and interior styling.
            </p>
          </div>

          {/* Audience Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {AUDIENCES.map((aud, idx) => {
              const Icon = aud.icon;
              return (
                <button
                  key={aud.id}
                  onClick={() => setSelectedAudienceIndex(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                    selectedAudienceIndex === idx
                      ? "bg-[#101827] text-white border-[#101827] shadow-sm"
                      : "bg-white text-[#626A75] border-[#D8D5CF] hover:border-[#101827]"
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-3 ${selectedAudienceIndex === idx ? "text-[#A98460]" : "text-[#626A75]"}`} />
                  <span className="text-xs font-semibold tracking-wide">
                    {aud.role}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Audience Feature Showcase */}
          <div className="p-8 md:p-12 rounded-[28px] bg-white border border-[#D8D5CF] shadow-architectural grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A98460]/10 text-[#A98460] text-xs font-semibold uppercase tracking-wider">
                <span>Tailored for {activeAudience.role}</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#101827] leading-tight">
                {activeAudience.summary}
              </h3>
              <p className="text-base text-[#626A75] leading-relaxed">
                {activeAudience.benefit}
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="#waitlist"
                  className="px-6 py-3 rounded-full bg-[#101827] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A98460] transition-colors"
                >
                  Join as {activeAudience.role}
                </a>
                <Link
                  href="/feedback"
                  className="px-6 py-3 rounded-full bg-[#FAF8F5] border border-[#D8D5CF] text-[#101827] text-xs font-semibold uppercase tracking-wider hover:border-[#101827] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Share Your Use Case</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#A98460]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-[20px] overflow-hidden aspect-[4/3] shadow-md border border-[#D8D5CF]/60">
                <img
                  src={activeAudience.image}
                  alt={activeAudience.role}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                  <span className="font-serif font-bold text-base block">{activeAudience.role} Workflow</span>
                  <span className="text-white/80">Photorealistic staging tailored for rapid client turnaround</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION G: PROPERTY-LEVEL VISION
          ======================================================== */}
      <section className="py-24 bg-[#FAF8F5] border-t border-[#D8D5CF]/60" id="property-vision">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A98460]">
                Property-Level Cohesion
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#101827] mt-2">
                Imagine Designing an Entire Property.
              </h2>
            </div>
            <p className="text-sm text-[#626A75] max-w-md">
              Most tools stage one disconnected room at a time. Beyanco synchronizes styles, finishes, and palettes across living, sleeping, and culinary spaces into a unified listing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPERTY_ROOMS.map((room, idx) => (
              <div
                key={room.name}
                className="group rounded-[22px] overflow-hidden bg-white border border-[#D8D5CF] shadow-subtle hover:shadow-card transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={room.img}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono">
                    Room 0{idx + 1}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-base text-[#101827]">
                    {room.name}
                  </h3>
                  <span className="text-xs text-[#A98460] font-medium block mt-1">
                    {room.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white border border-[#D8D5CF] flex items-center justify-between text-xs text-[#626A75]">
            <div className="flex items-center gap-3">
              <Grid3X3 className="w-5 h-5 text-[#A98460]" />
              <span>Coordinated architectural language: Consistent travertine, oak joinery, and natural diffused light.</span>
            </div>
            <Link
              href="/feedback"
              className="text-[#101827] font-semibold uppercase tracking-wider hover:text-[#A98460] inline-flex items-center gap-1"
            >
              <span>Feedback on Multi-room staging</span>
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
              Why Beyanco?
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
                Architectural Integrity
              </h3>
              <p className="text-xs text-[#626A75] leading-relaxed">
                Existing AI tools frequently distort door frames, bend windows, and invent impossible room geometries. Beyanco preserves load-bearing walls, ceiling cornices, and window views.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-white border border-[#D8D5CF] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#101827]/5 text-[#101827] flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5 text-[#A98460]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#101827]">
                Fine Material Control
              </h3>
              <p className="text-xs text-[#626A75] leading-relaxed">
                Rather than accepting random furniture generations, choose specific materials: honed travertine, fluted oak, bouclé linen, and brushed bronze that match real-world design specifications.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-white border border-[#D8D5CF] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#101827]/5 text-[#101827] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-[#A98460]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#101827]">
                Property-First Organization
              </h3>
              <p className="text-xs text-[#626A75] leading-relaxed">
                Organize all staging assets under unified property projects. Export synchronized marketing brochures, high-res MLS photographs, and interactive before/after sliders for client presentations.
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
            Your Next Great Space Starts Here.
          </h2>

          <p className="text-base text-[#626A75] max-w-xl mx-auto leading-relaxed">
            Be among the first to explore a new way of visualizing interiors. Enter your details below to reserve early access.
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
    </div>
  );
}
