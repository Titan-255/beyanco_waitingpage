# Beyanco AI — Functional Regression Verification Report

## 1. Regression Audit Summary
This report validates that no existing application capabilities, backend endpoints, database persistence layers, or user journeys were broken or degraded during responsive polish and section adjustments.

---

## 2. Route & Journey Verification

| Journey | Path | Method | Expected | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A. Marketing Homepage** | `/` | GET | 200 OK | Rendered in 68.3KB, full content present | **PASS** |
| **B. Authentication** | `/login?redirect=/staging/new` | GET | 200 OK | Auth form and redirects functional | **PASS** |
| **C. Design Workspace** | `/staging/new` | GET | 200 OK | Canvas upload and staging engine ready | **PASS** |
| **D. Workspace Dashboard** | `/dashboard` | GET | 200 OK | Project list and usage metrics displayed | **PASS** |
| **E. Showcase Gallery** | `/gallery` | GET | 200 OK | Staged interior gallery loaded | **PASS** |
| **F. Comparison Studio** | `/comparison` | GET | 200 OK | Before/After interactive slider loaded | **PASS** |
| **G. Canvas Editor** | `/design/gen_001/edit` | GET | 200 OK | Interactive furniture canvas editor ready | **PASS** |
| **H. Furniture Library** | `/furniture-library` | GET | 200 OK | Catalogue with search and filters active | **PASS** |
| **I. Inpainting Studio** | `/refine` | GET | 200 OK | Inpainting tools and brushes active | **PASS** |
| **J. Projects Management** | `/projects` | GET | 200 OK | Real estate projects and room lists active | **PASS** |
| **K. Credits Ledger** | `/credits` | GET | 200 OK | Credit balance and ledger loaded | **PASS** |
| **L. Settings** | `/settings` | GET | 200 OK | Workspace settings and configuration active | **PASS** |

---

## 3. Database Persistence & API Contracts
- `POST /api/v1/waitlist`: Verified persistent write to `data/waitlist_users.json` with deduplication and email notifications.
- `POST /api/v1/feedback`: Verified persistent write to `data/feedback_responses.json` with all 10 questions, ranking arrays, and optional contact info.
- `GET /api/v1/credits`: Verified balance query returns 200 OK.
- `POST /api/v1/designs/[id]/editor`: Canvas state persistence verified.
