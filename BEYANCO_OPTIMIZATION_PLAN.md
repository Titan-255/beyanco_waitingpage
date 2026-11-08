# BEYANCO AI — Comprehensive Optimization & Engineering Plan

## Priority Matrix

1. **P0 (Critical)**: Error boundaries, lint root isolation, file upload validation & security, session token setting.
2. **P1 (High)**: API request payload validation, canvas boundary clamping & state serialization, credit balance transaction locking.
3. **P2 (Medium)**: Responsive touch ergonomics on furniture canvas, keyboard navigation on Before/After slider, image asset lazy-loading.
4. **P3 (Polish & Maintainability)**: Branded 404/Error fallbacks, structured logger, accessibility ARIA roles, automated test suite.

---

## Detailed Issue Registry

### Issue OPT-01: ESLint Root Directory Conflict
- **Location**: `.eslintrc.json`
- **Severity**: P0 (Blocks CI/CD and lint verification)
- **User Impact**: Developer friction, potential build pipeline failures.
- **Root Cause**: Next.js ESLint searches parent directories and finds `c:\anti gravity\.eslintrc.json`.
- **Recommended Fix**: Add `"root": true` to `.eslintrc.json`.
- **Files Affected**: `.eslintrc.json`
- **Regression Risk**: None.
- **Verification Method**: Run `npm run lint` and verify clean exit code 0.

---

### Issue OPT-02: Missing Global Error Boundary & 404 Handler
- **Location**: `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/global-error.tsx`
- **Severity**: P0 (User experience crash risk)
- **User Impact**: Uncaught exceptions in client components render raw Next.js error overlays or white screens.
- **Root Cause**: Next.js App Router requires `error.tsx` and `not-found.tsx` for graceful failure handling.
- **Recommended Fix**: Create custom, branded luxury interior design error boundaries with recovery buttons.
- **Files Affected**: `src/app/error.tsx`, `src/app/not-found.tsx`
- **Regression Risk**: Low.
- **Verification Method**: Trigger intentional runtime error; verify branded recovery screen appears with "Try Again" and "Return Home".

---

### Issue OPT-03: Security & Magic-Byte Validation for Image Uploads
- **Location**: `src/components/ui/ImageUploadZone.tsx`, `src/lib/storage.ts`
- **Severity**: P1 (Security & stability)
- **User Impact**: Corrupted or malicious non-image files renamed with `.jpg` could cause canvas crash or memory exhaustion.
- **Root Cause**: Only checking `file.type.startsWith('image/')` and file extension.
- **Recommended Fix**: Implement client-side binary header verification (magic bytes for JPEG `FF D8 FF`, PNG `89 50 4E 47`, WEBP `52 49 46 46`), maximum dimensions limit (e.g. 8000x8000px), and file size guard (max 25MB).
- **Files Affected**: `src/components/ui/ImageUploadZone.tsx`, `src/lib/utils.ts`
- **Regression Risk**: Low.
- **Verification Method**: Test uploading valid JPEG, PNG, WEBP, and invalid renamed files; verify clear rejection message.

---

### Issue OPT-04: API Request Schema & Type Validation
- **Location**: `src/app/api/v1/staging/jobs/route.ts`, `src/app/api/v1/credits/route.ts`, `src/app/api/v1/designs/[id]/editor/route.ts`
- **Severity**: P1 (Data integrity & security)
- **User Impact**: Malformed API calls could corrupt storage or trigger unhandled server exceptions (500).
- **Root Cause**: Direct parsing of `await req.json()` without field assertion or bounds checking.
- **Recommended Fix**: Add robust runtime validation functions that verify required fields, enums (roomType, styleId), positive numbers, and string bounds.
- **Files Affected**: `src/app/api/v1/staging/jobs/route.ts`, `src/app/api/v1/credits/route.ts`, `src/app/api/v1/designs/[id]/editor/route.ts`
- **Regression Risk**: Low.
- **Verification Method**: Send POST with missing/invalid fields and verify HTTP 400 Bad Request with explanatory JSON error.

---

### Issue OPT-05: Canvas Furniture Editor Boundary Clamping & History Integrity
- **Location**: `src/app/design/[id]/edit/page.tsx`
- **Severity**: P1 (Core user workflow)
- **User Impact**: Dragging furniture off-canvas can lose items in unreachable coordinates; undo/redo stack can become out of sync.
- **Root Cause**: `dragBoundFunc` not constraining items within canvas dimensions; deep-cloning in history could reference mutating objects.
- **Recommended Fix**: Add coordinate clamping to keep at least 25% of furniture visible within canvas viewport; ensure immutable state snapshotting for undo/redo.
- **Files Affected**: `src/app/design/[id]/edit/page.tsx`
- **Regression Risk**: Medium (must ensure smooth drag feel).
- **Verification Method**: Drag items to all 4 edges; trigger Undo and Redo; verify object remains within visible bounds.

---

### Issue OPT-06: Interactive Before/After Slider Accessibility & Touch Ergonomics
- **Location**: `src/components/ui/BeforeAfterSlider.tsx`
- **Severity**: P2 (Accessibility & mobile UX)
- **User Impact**: Keyboard users cannot adjust the comparison slider; touch users on mobile may experience page scroll conflicts.
- **Root Cause**: Missing ARIA slider roles (`role="slider"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`) and arrow key event handlers (`ArrowLeft`, `ArrowRight`).
- **Recommended Fix**: Add full ARIA accessibility attributes, `tabIndex={0}`, keyboard handlers, and `touch-action: pan-y` CSS property.
- **Files Affected**: `src/components/ui/BeforeAfterSlider.tsx`
- **Regression Risk**: Low.
- **Verification Method**: Focus slider handle, press Left/Right arrows, inspect accessibility tree.

---

### Issue OPT-07: Real Estate Project & Credit Balance Synchronization
- **Location**: `src/lib/storage.ts`, `src/app/dashboard/page.tsx`
- **Severity**: P2 (Data consistency)
- **User Impact**: Spending credits on `/staging/new` should immediately reflect on dashboard header and credits page without requiring hard refresh.
- **Root Cause**: Component states initialize from localStorage once without cross-tab/cross-page custom event dispatching.
- **Recommended Fix**: Dispatch `window.dispatchEvent(new CustomEvent('beyanco-storage-sync'))` whenever credits or jobs update, and subscribe in `Header.tsx` and `DashboardLayout.tsx`.
- **Files Affected**: `src/lib/storage.ts`, `src/components/dashboard/Header.tsx`
- **Regression Risk**: Low.
- **Verification Method**: Deduct credits in staging wizard; navigate to dashboard; verify credit counter updates seamlessly.

---

### Issue OPT-08: Production Security Headers & Content Security Policy
- **Location**: `next.config.js`
- **Severity**: P1 (Security hardening)
- **User Impact**: Protects real estate photos and user workspace from XSS, clickjacking, and MIME sniffing attacks.
- **Root Cause**: Default Next.js configuration without explicit HTTP security response headers.
- **Recommended Fix**: Configure `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Files Affected**: `next.config.js`
- **Regression Risk**: Low.
- **Verification Method**: Probe HTTP response headers and verify security headers are present.

---

### Issue OPT-09: Automated Quality Test Suite
- **Location**: `tests/`
- **Severity**: P2 (Quality assurance & regressions)
- **User Impact**: Ensures continuous confidence in virtual staging calculations, AI job status transitions, and data integrity.
- **Recommended Fix**: Implement automated test script verifying core business logic: credit calculations, room type validation, canvas object serialization, and API endpoints.
- **Files Affected**: `tests/unit-and-integration.test.js`, `package.json`
- **Regression Risk**: None.
- **Verification Method**: Run test suite via `npm test` and assert all tests pass.
