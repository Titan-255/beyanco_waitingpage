# BEYANCO AI — Bug & Vulnerability Audit Report

## 1. Frontend Audit Findings

### BUG-FE-01: Conflicting Parent ESLint Configuration
- **Status**: Identified
- **File**: `c:\anti gravity\model\.eslintrc.json`
- **Details**: Missing `"root": true` caused `@next/next` plugin conflict with parent workspace `.eslintrc.json`.
- **Impact**: Failed `npm run lint`.
- **Fix**: Add `"root": true` to `.eslintrc.json`.

### BUG-FE-02: Missing Keyboard Navigation on Before/After Comparison Slider
- **Status**: Identified
- **File**: `src/components/ui/BeforeAfterSlider.tsx`
- **Details**: The slider handle only responded to pointer events (`onMouseDown`, `onTouchStart`). Keyboard users navigating with Tab could not adjust the divider or inspect staging details using Arrow keys.
- **Impact**: Accessibility non-compliance (WCAG 2.1 AA Keyboard Accessible).
- **Fix**: Add `tabIndex={0}`, `role="slider"`, `aria-valuenow`, `aria-valuemin={0}`, `aria-valuemax={100}`, `onKeyDown` with ArrowLeft/ArrowRight stepping.

### BUG-FE-03: Missing Global and Not-Found Error Boundaries
- **Status**: Identified
- **File**: `src/app/not-found.tsx`, `src/app/error.tsx`
- **Details**: When a user navigated to a non-existent route or triggered a client-side exception, Next.js fell back to default generic error pages rather than a branded Beyanco luxury UI.
- **Impact**: Degraded perceived SaaS quality.
- **Fix**: Implement branded `src/app/not-found.tsx` and `src/app/error.tsx`.

### BUG-FE-04: Header Real-Time Balance Desynchronization
- **Status**: Identified
- **File**: `src/components/dashboard/Header.tsx`, `src/lib/storage.ts`
- **Details**: Updating credits on `/credits` or completing staging on `/staging/new` updated `localStorage` but did not notify other mounted components in the application tree.
- **Impact**: Header displayed stale credit count until full page refresh.
- **Fix**: Introduce a centralized browser custom event (`beyanco-storage-sync`) dispatched on storage updates.

---

## 2. Backend & API Audit Findings

### BUG-BE-01: Missing Request Body Validation on `/api/v1/staging/jobs`
- **Status**: Identified
- **File**: `src/app/api/v1/staging/jobs/route.ts`
- **Details**: Endpoint parsed `await req.json()` and created jobs even if `roomType` or `styleId` were invalid or missing, resulting in corrupted job objects.
- **Impact**: Invalid jobs in database causing rendering failures on gallery and dashboard.
- **Fix**: Implement schema validation rejecting requests missing `roomType`, `styleId`, or `originalImage` with HTTP 400.

### BUG-BE-02: Missing Bounds Checking on `/api/v1/credits`
- **Status**: Identified
- **File**: `src/app/api/v1/credits/route.ts`
- **Details**: Credit deduction did not verify that balance was sufficient before confirming debit, allowing potential negative balances.
- **Impact**: Financial logic loophole allowing unlimited free generations.
- **Fix**: Check `currentBalance >= amountToDeduct`; return HTTP 402 Payment Required / Insufficient Credits if inadequate.

### BUG-BE-03: Missing Safe HTTP Security Headers
- **Status**: Identified
- **File**: `next.config.js`
- **Details**: Responses lacked standard security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- **Impact**: Vulnerable to iframe embedding (clickjacking) and MIME-type sniffing.
- **Fix**: Configure `headers()` in `next.config.js`.

---

## 3. Core Workflow & Editor Findings

### BUG-WK-01: File Upload Lacks Binary Magic-Byte Verification
- **Status**: Identified
- **File**: `src/components/ui/ImageUploadZone.tsx`
- **Details**: Allowed any file if filename ended in `.jpg` or browser reported image MIME type.
- **Impact**: Corrupted or non-image files caused silent canvas failures.
- **Fix**: Read first 4 bytes of uploaded file to verify signature (`FF D8 FF` for JPEG, `89 50 4E 47` for PNG, `52 49 46 46` for WebP).

### BUG-WK-02: Furniture Canvas Missing Boundary Clamping
- **Status**: Identified
- **File**: `src/app/design/[id]/edit/page.tsx`
- **Details**: Furniture items could be dragged completely outside the canvas bounds, becoming unreachable.
- **Impact**: User loses track of furniture item on large displays.
- **Fix**: Add boundary clamping inside `handleDragEnd` / `dragBoundFunc` to ensure items remain visible.
