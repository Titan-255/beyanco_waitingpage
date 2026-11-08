# BEYANCO AI — Complete Feature Inventory

| Feature | Existing Route / Component | Current Status | Issues Identified | Must Preserve |
|---|---|---|---|---|
| **Marketing Homepage** | `/` (`src/app/page.tsx`) | Working | Hero Before/After slider working; needs optimized asset loading and clean metadata | Yes |
| **Authentication & Credentials** | `/login` (`src/app/login/page.tsx`) | Working | Functional form with email/password; needs persistent session state and CSRF/input sanitization | Yes |
| **Virtual Staging Wizard** | `/staging/new` (`src/app/staging/new/page.tsx`) | Working | 4-step wizard (Upload, Style, Preferences, Review & Generate); needs robust file validation and error handling | Yes |
| **Workspace Dashboard** | `/dashboard` (`src/app/dashboard/page.tsx`) | Working | Real estate metrics, recent renders table, quick actions; needs dynamic sync with local storage | Yes |
| **Staged Gallery** | `/gallery` (`src/app/gallery/page.tsx`) | Working | Filter by room/style, search; links to canvas editor and comparison studio | Yes |
| **Before/After Studio** | `/comparison` (`src/app/comparison/page.tsx`) | Working | Interactive split slider and side-by-side mode with room metadata; needs keyboard arrow controls | Yes |
| **Interactive Furniture Canvas** | `/design/[id]/edit` (`src/app/design/[id]/edit/page.tsx`) | Working | Konva/Canvas multi-layer editor (move, resize, rotate, layers, undo/redo, export, save) | Yes |
| **Furniture Catalogue** | `/furniture-library` (`src/app/furniture-library/page.tsx`) | Working | Category and style filters, dimensions specs, "Add to Canvas" triggers | Yes |
| **Project Management** | `/projects` (`src/app/projects/page.tsx`) | Working | Listing address grouping, new project modal, client review links | Yes |
| **AI Inpainting & Decluttering** | `/refine` (`src/app/refine/page.tsx`) | Working | Object removal brush canvas, before/after preview | Yes |
| **Billing & Credits Management** | `/credits` (`src/app/credits/page.tsx`) | Working | Credit balance, tier purchase modals, auto-recharge, transaction ledger | Yes |
| **AI & Workspace Settings** | `/settings` (`src/app/settings/page.tsx`) | Working | AI provider switcher (Demo, OpenAI, Replicate, Stability, ComfyUI), API key management, defaults | Yes |
| **Credits API** | `/api/v1/credits` (`src/app/api/v1/credits/route.ts`) | Working | GET balance & ledger, POST purchase credits | Yes |
| **Projects API** | `/api/v1/projects` (`src/app/api/v1/projects/route.ts`) | Working | GET projects, POST create listing project | Yes |
| **Staging Jobs API** | `/api/v1/staging/jobs` (`src/app/api/v1/staging/jobs/route.ts`) | Working | GET jobs, POST queue AI staging job | Yes |
| **Canvas Editor API** | `/api/v1/designs/[id]/editor` (`src/app/api/v1/designs/[id]/editor/route.ts`) | Working | GET/POST persistent canvas furniture layers | Yes |

---

## Detailed Architectural Discovery

### 1. Framework & Infrastructure
- **Frontend Framework**: Next.js 14.2.24 (App Router)
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.1 with custom Beyanco palette (`#F8FAFC`, `#FFFFFF`, `#0F172A`, `#64748B`, `#2563EB`, `#7C3AED`, `#EFF6FF`)
- **Canvas / 2D Engine**: Konva 9.3.6 & react-konva 18.2.10
- **Icons**: Lucide React 0.344.0
- **State & Storage**: Client-side localStorage persistence layer (`src/lib/storage.ts`) with fallback sample data (`src/lib/sample-data.ts`) and mock/real REST API endpoints in App Router
- **Active Dev Server**: Running on `http://localhost:3000` (PID 2472)

### 2. External Integrations & Capabilities
- Multi-provider AI Gateway (`src/lib/ai-engine.ts`):
  - Local Demo / Instant Synthesis
  - OpenAI DALL-E 3
  - Replicate (SDXL / Flux Interior LoRA)
  - Stability AI (Stable Diffusion XL Inpainting)
  - Local ComfyUI (HTTP API `http://127.0.0.1:8188`)
- Furniture Vector Library (`public/furniture/*.svg`):
  - Contemporary Sofa, Curved Sofa, Oak Chair, Leather Chair, Dining Table, Coffee Table, Pendant Lamp, Floor Lamp, Geometric Rug, Ficus Plant, Canvas Art
- Realistic Showcases (`public/showcase-*.jpg`):
  - High-res living room originals and staged comparisons
