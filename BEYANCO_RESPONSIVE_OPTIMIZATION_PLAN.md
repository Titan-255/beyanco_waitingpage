# Beyanco AI — Responsive Optimization & Defect Resolution Plan

## 1. Objectives & Guardrails
- **Preserve 100% of Brand Identity**: No alterations to logos, color palette (`#101827`, `#A98460`, `#F6F4EF`), typography (`Inter`, `Playfair Display`), existing photography, or marketing copy.
- **Support All 7 Viewport Categories**:
  - Mobile portrait (320px – 430px)
  - Mobile landscape (568px – 932px with height 320px – 430px)
  - Tablet portrait (600px – 820px)
  - Tablet landscape (800px – 1180px)
  - Laptop (1280px – 1440px)
  - Desktop (1600px – 1920px)
  - Ultra-wide desktop (2560px+)

---

## 2. Prioritized Implementation Slices

### Slice 1: Header & Navigation Responsiveness (`WaitlistNavbar.tsx`)
- Adapt navbar height: `h-16 sm:h-20` so mobile landscape screens (320px–375px height) retain maximum viewable canvas area.
- Enhance mobile menu container with `max-h-[calc(100vh-4rem)] overflow-y-auto` to prevent navigation cutoff on small landscape viewports.
- Ensure all tap targets are >= 44px with active focus outlines for accessibility.

### Slice 2: Architectural Comparison Slider & Hotspot Popups (`ArchitecturalSlider.tsx`)
- Optimize hotspot positioning calculations on narrow viewports:
  - Constrain hotspot tag widths: `min-w-[130px] sm:min-w-[160px] max-w-[180px] sm:max-w-[220px]`.
  - Dynamically align edge tags (`spot.x > 65 ? "right-0" : spot.x < 35 ? "left-0" : "left-1/2 -translate-x-1/2"`).
  - Add landscape viewport height checks so tags don't overflow the slider card boundary.
  - Retain touch gestures, keyboard arrows (Left/Right/Home/End), and focus indicators.

### Slice 3: Hero & Landing Page Typography & Card Flow (`src/app/page.tsx`)
- Refine responsive heading sizing: `text-3xl sm:text-5xl md:text-6xl lg:text-[76px]` with balanced line height.
- Ensure horizontal scroll containers (such as room pills) have smooth touch momentum (`-webkit-overflow-scrolling: touch`) and clear affordances.
- Maintain full aspect ratios on showcase photographs without stretching or distortion.

### Slice 4: Share Your Opinion Modal (`FeedbackInvitationModal.tsx`)
- Optimize for mobile landscape:
  - Container padding: `p-4 sm:p-8 md:p-10`.
  - Max height: `max-h-[88vh]`.
  - Compact typography in landscape orientation (`@media (max-height: 500px)` or Tailwind responsive classes).
  - Lock page body scroll while modal is active; safely restore on dismiss.

### Slice 5: Customer Discovery Questionnaire (`src/app/feedback/page.tsx`)
- Refine Question 6 rating buttons: Ensure 1–5 scale flexes cleanly on 320px screens without text truncation.
- Refine Question 7 ranking UI: Up/down ordering buttons with comfortable touch padding.
- Refine Contact form inputs: Prevent iOS Safari auto-zoom by ensuring input font size is >= 16px on mobile viewports (`text-base sm:text-sm`).
- Safe-area insets: `pb-[calc(1rem+env(safe-area-inset-bottom))]`.

### Slice 6: Thank-You Screen (`src/app/feedback/thank-you/page.tsx`)
- Button stacking on mobile portrait (`flex flex-col sm:flex-row`), horizontal alignment on landscape and desktop.
- Responsive direct contact callouts.
