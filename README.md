# Beyanco AI — Premium Real Estate Virtual Staging & Interior Design SaaS

An enterprise-grade, minimalist AI-powered virtual staging and spatial visualization platform engineered for real estate brokerages, property photographers, architectural developers, and interior designers.

Inspired by the visual design principles of premium interior architecture studios and real-estate staging platforms: [Beyanco](https://beyanco.com/home).

---

## 🎨 Design Philosophy & Visual Tokens

The property photograph is the product's visual centerpiece. The interface supports the photographs without competing with them.

- **Primary Background**: `#F8FAFC` (Off-white)
- **Card Background**: `#FFFFFF` (Pure white)
- **Primary Text**: `#0F172A` (Deep navy)
- **Secondary Text**: `#64748B` (Slate gray)
- **Borders**: `#E2E8F0` (Soft gray)
- **Primary Action**: `#2563EB` (Royal blue)
- **Primary Hover**: `#1D4ED8` (Deep blue)
- **AI Accent**: `#7C3AED` (Selective violet highlight)
- **Light Blue Surface**: `#EFF6FF` (Pale blue)
- **Success / Status**: `#10B981` (Emerald), `#F59E0B` (Amber), `#EF4444` (Red)

---

## 🚀 Key Modules & Capabilities

### 1. Marketing Landing Page (`/`)
- **Hero Section**: Eyebrow label, punchy value proposition, and an interactive draggable Before-and-After vertical comparison slider with keyboard, touch, and mouse support.
- **Trust Strip**: Real estate speed metrics and 4K MLS compliance standards.
- **Three-Column Capabilities**: AI Virtual Staging, Spatial Interior Design, Interactive Furniture Editing, Object Inpainting, Renovation Previews, and 4K Uncompressed Export.
- **Visual 3-Step Workflow**: Upload Room ➔ Select Style ➔ Generate & Edit.
- **Transformation Gallery**: Category-filtered genuine before/after interior photography comparisons.
- **Furniture Editor Showcase**: Demonstrating manual furniture positioning and scaling.
- **Transparent Pricing**: Starter, Growth / Pro, and Business tiers with monthly/annual toggle.
- **FAQ Accordion & Compliant Footer**: Real estate AI staging disclosure notices and compliance links.

### 2. Studio Dashboard Workspace (`/dashboard`)
- **Shell**: Left collapsible sidebar, page header with breadcrumbs, real-time credit balance badge, notifications, and owner profile.
- **Overview Metrics**: Total Staged Designs, Active Projects, Available Credits, GPU Turnaround stats.
- **Recent Projects**: Property thumbnails, room counts, and direct links to stage rooms.
- **Recent Designs Gallery**: High-res previews, favorites toggling, comparison modal, and direct editor launch.

### 3. Step-by-Step Staging Wizard (`/staging/new`)
- **Step 1 — Upload Room**: Drag-and-drop file upload with live preview, dimension detection, and file validation.
- **Step 2 — Identify Room**: Living Room, Master Bedroom, Dining Area, Kitchen, Office, Bathroom, Balcony, Commercial.
- **Step 3 — Interior Style Cards**: Contemporary, Modern Luxury, Scandinavian, Japandi, Warm Minimalist, Organic Modern, Coastal, Contemporary Indian, Refined Industrial.
- **Step 4 — Preferences**: Color schemes, budget tiers, and custom architectural prompts.
- **Step 5 — Review & AI Generation**: Multi-stage progress simulation (geometry analysis, lighting calculation, material synthesis, 4K rendering).

### 4. Interactive Furniture Editor (`/design/[id]/edit`)
- **Three-Panel Layout**:
  - **Left**: Searchable Furniture Catalogue (Sofas, Chairs, Travertine Tables, Brass Lamps, Wool Rugs, Ficus Plants, Linen Art).
  - **Center**: HTML5 Canvas staging stage with background room photograph, draggable furniture layers, corner resize handles, and rotation stem.
  - **Right**: Object Properties inspector (Position X/Y, Width/Height, Rotation deg, Depth Z-Index, Opacity, Lock, Duplicate, Delete).
- **Toolbar**: Undo/Redo history stack, Zoom in/out/fit controls, Live Document Save status, and **Export Composed Image** (high-res composited PNG/JPEG download).
- **Flattened Image Transparency**: Clear disclosure explaining the difference between unified 2D background renders and independent furniture overlay layers, with a direct link to AI inpainting.

### 5. Dedicated Comparison Studio (`/comparison`)
- Dual-mode viewer: **Interactive Draggable Slider** vs. **Side-by-Side Comparison**.
- Preserves native photo aspect ratios and lighting alignment.

### 6. AI Refinement & Object Inpainting Suite (`/refine`)
- **Object & Clutter Removal**: Inpainting prompt builder to reconstruct walls, floors, and baseboards without clutter.
- **Object Replacement**: Replaces selected fixtures or furniture with target designer pieces.
- **Lighting & Material Refinement**: Adjust daylight vectors and color temperatures.

### 7. Credits, Billing & Ledger (`/credits`)
- Workspace balance card with instant top-up simulation.
- Detailed audit ledger tracking credit usage and pack additions.

### 8. Settings & Pluggable AI Engine (`/settings`)
- Configurable inference backend: **Curated Demo Mode (Zero-cost local)**, **OpenAI DALL-E 3**, **Replicate (Flux / SDXL)**, or **Local ComfyUI**.
- Developer REST API key generator for CRM and MLS integrations.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Canvas / Editing**: HTML5 2D Canvas with sub-pixel transformation and touch/mouse interaction
- **State & Storage**: Client-side resilient storage with local persistence and transaction history

---

## 💻 Localhost Execution

### Start Development Server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Production Build:
```bash
npm run build
npm run start
```

---

## 📡 REST API Endpoints (`/api/v1`)

- `GET /api/v1/projects` — List active property workspaces
- `POST /api/v1/projects` — Create a new property project
- `GET /api/v1/staging/jobs` — Retrieve staging jobs and generations
- `POST /api/v1/staging/jobs` — Submit a virtual staging generation job
- `GET /api/v1/credits` — Check organization credit balance and subscription status
- `GET /api/v1/designs/:id/editor` — Fetch saved canvas furniture document
- `PUT /api/v1/designs/:id/editor` — Update canvas furniture document
