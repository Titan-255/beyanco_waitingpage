import { RoomType, InteriorStyle, BudgetTier, Generation, DesignIntensity } from "@/types";

export interface StagingRequest {
  roomType: RoomType;
  style: InteriorStyle;
  colorScheme: string;
  budgetLevel: BudgetTier;
  variationsCount: number;
  userPrompt?: string;
  originalImageUrl: string;
  projectId: string;
  roomId?: string;
  roomName?: string;
  projectName?: string;
  propertyType?: string;
  projectPurpose?: string;
  targetAudience?: string;
  designIntensity?: DesignIntensity;
  furnitureRequirements?: string[];
  materials?: string;
  preserveOptions?: {
    keepExistingFurniture?: boolean;
    removeSelectedFurniture?: boolean;
    replaceExistingFurniture?: boolean;
    preserveFlooring?: boolean;
    preserveWallsWindows?: boolean;
    preserveDoors?: boolean;
    preserveLighting?: boolean;
    allowDecorative?: boolean;
    allowRenovation?: boolean;
  };
}

export interface PromptBuildResult {
  systemPrompt: string;
  finalPrompt: string;
  negativePrompt: string;
  estimatedCredits: number;
}

export const MASTER_SYSTEM_PROMPT = `You are Beyanco AI's Premium Interior Design Intelligence Engine.
You are an elite interior architect, luxury interior designer, spatial-planning expert, real estate visual-merchandising specialist, and photorealistic virtual-staging artist.
Your task is to transform an empty, outdated, or cluttered interior photograph into an extraordinary, professionally designed living space.
You do not create generic room designs.
You develop distinctive, intentional interiors that appear to have been designed by an experienced human interior architect for a real property and a specific audience.
Every design must have a clear creative concept, purposeful furniture placement, sophisticated material combinations, balanced composition, and realistic architectural integration.
The final image must look like a genuine, professionally photographed interior rather than an artificial AI-generated scene.`;

export const STANDARD_NEGATIVE_PROMPT = `people, humans, hands, pets, animals, text, watermark, logo, signature, cartoon, anime, painting, illustration, 3D render look, plastic-looking furniture, distorted furniture, warped walls, changed window position, changed door position, changed room shape, extra windows, extra doors, unrealistic perspective, incorrect scale, floating furniture, duplicated objects, blurry image, low resolution, oversaturated colors, harsh artificial lighting, clutter, wires, cables, messy room.`;

export class AIEngineService {
  /**
   * Dynamically constructs the photorealistic interior staging prompt
   */
  static constructPrompt(req: StagingRequest): PromptBuildResult {
    const roomNames: Record<string, string> = {
      living_room: "living room and lounge area",
      bedroom: "master bedroom suite",
      master_bedroom: "grand master bedroom sanctuary",
      guest_bedroom: "refined guest bedroom retreat",
      dining_room: "dining room and entertaining zone",
      kitchen: "architectural kitchen and breakfast bar",
      home_office: "executive home office and library",
      study_room: "focused study and library space",
      bathroom: "spa-inspired luxury bathroom",
      balcony: "outdoor living terrace and balcony",
      foyer: "inviting entrance foyer",
      hallway: "curated gallery hallway",
      outdoor: "alfresco outdoor living lounge",
      commercial: "executive reception lobby and commercial lounge",
      other: "custom interior architectural space",
    };

    const styleDescriptions: Record<string, string> = {
      contemporary:
        "Contemporary design with bespoke architectural silhouettes, low-profile custom upholstered seating, natural travertine stone coffee table, layered warm lighting, and museum-grade tactile materials.",
      modern_luxury:
        "Modern luxury interior featuring tailored velvet and bouclé upholstery, fluted dark timber millwork, brushed brass hardware accents, recessed cove lighting, and polished stone finishes.",
      scandinavian:
        "Refined Scandinavian aesthetic utilizing solid white-oak joinery, woven textured textiles, airy daylight diffusion, organic wishbone chairs, and muted earth tones.",
      japandi:
        "Japandi interior synthesizing Japanese wabi-sabi minimalism and Danish functional warmth, with low-slung wooden frames, paper lantern lighting, and uncluttered negative space.",
      minimalist:
        "Warm minimalist space prioritizing architectural geometry, monolithic stone tables, sculptural accent chairs, textured linen drapery, and intentional breathing room.",
      warm_minimalism:
        "Warm minimalism highlighting clean geometric masses, limewash walls, textured ceramic pottery, tactile linen upholstery, and calm negative space.",
      organic_modern:
        "Organic modern atmosphere with rounded cloud silhouettes, cream bouclé fabrics, live-edge timber elements, terracotta planters, and biophilic botanical styling.",
      mid_century_modern:
        "Mid-century modern aesthetic with warm teak cabinetry, tapered brass-capped legs, iconic accent chairs, and organic geometric patterns.",
      coastal:
        "Contemporary coastal interior featuring crisp bleached linens, washed white-oak flooring, natural woven jute rugs, brass nautical accents, and sea-salt neutral tones.",
      contemporary_indian:
        "Contemporary Indian luxury interior highlighting hand-beaten brass details, rich teak wood architecture, understated hand-woven raw silk textiles, and warm ambient glow.",
      industrial:
        "Refined modern industrial space pairing authentic architectural steel and concrete with rich cognac leather club seating, matte black fixtures, and reclaimed timber.",
      traditional:
        "Elevated classic transitional design with symmetrical furniture arrangements, tailored linen upholstery, antiqued brass sconces, and rich crown molding preservation.",
      boutique_hotel:
        "Boutique hotel elegance with dramatic architectural lighting, plush velvet headboards, integrated mini bar joinery, and sensory hospitality styling.",
      art_inspired:
        "Art-inspired gallery aesthetic with pedestal sculpture stands, large-format abstract canvases, museum spotlighting, and minimalist furniture silhouettes.",
      bespoke_eclectic:
        "Bespoke eclectic harmony balancing heirloom vintage accents with cutting-edge Italian contemporary design.",
      ai_recommended:
        "Intelligently curated interior architecture calibrated to the natural light vectors, spatial proportions, and target buyer profile of this listing.",
    };

    const budgetDescriptions: Record<BudgetTier, string> = {
      economy: "smart, accessible, clean contemporary furniture pieces arranged efficiently.",
      standard: "designer-grade residential furnishings with balanced textures and durability.",
      premium: "luxury bespoke furniture with handcrafted materials, natural stone, and designer lighting.",
      ultra_luxury: "couture-level architectural furnishings, Italian leather, custom joinery, and gallery art.",
    };

    const intensityDescriptions: Record<DesignIntensity, string> = {
      light: "Light Refinement: focus on styling enhancements, soft textiles, statement lighting, and tasteful decor while leaving core room spaces open.",
      complete: "Complete Interior Design: introduce full coordinated furniture suites, bespoke spatial layouts, tailored area rugs, wall art, and ambient illumination.",
      premium: "Premium Transformation: couture-level architectural interior with rich material pairings, custom millwork, statement seating, and luxury hospitality finishes.",
    };

    const roomDesc = roomNames[req.roomType] || req.roomName || "interior room";
    const styleDesc = styleDescriptions[req.style] || "contemporary interior";
    const budgetDesc = budgetDescriptions[req.budgetLevel] || "premium furnishings";
    const intensityDesc = req.designIntensity ? intensityDescriptions[req.designIntensity] : intensityDescriptions.complete;

    let finalPrompt = `Professional real estate architectural photograph of a fully staged ${roomDesc}. `;
    if (req.projectName) {
      finalPrompt += `Property: ${req.projectName}. `;
    }
    if (req.targetAudience) {
      finalPrompt += `Target demographic: ${req.targetAudience}. `;
    }
    finalPrompt += `Design Style: ${styleDesc} `;
    finalPrompt += `Color Palette: ${req.colorScheme}. `;
    if (req.materials) {
      finalPrompt += `Selected Finishes & Materials: ${req.materials}. `;
    }
    if (req.furnitureRequirements && req.furnitureRequirements.length > 0) {
      finalPrompt += `Required Furniture Elements: ${req.furnitureRequirements.join(", ")}. `;
    }
    finalPrompt += `Intensity Level: ${intensityDesc} `;
    finalPrompt += `Specification Level: ${budgetDesc} `;

    // Preservation Rules
    finalPrompt += `Architectural Preservation Constraints: Maintain original window placements, ceiling beams, wall geometry, floor perspective, and room proportions exactly. `;
    if (req.preserveOptions?.preserveFlooring !== false) {
      finalPrompt += `Strictly preserve the original flooring material, color, and texture. `;
    }
    if (req.preserveOptions?.preserveWallsWindows !== false) {
      finalPrompt += `Do not alter, move, or add windows or doors. `;
    }

    finalPrompt += `Lighting: Balanced daylight streaming through windows with soft, photorealistic contact shadows on the floor and realistic material roughness. `;

    if (req.userPrompt && req.userPrompt.trim().length > 0) {
      finalPrompt += `Specific user architectural instruction: ${req.userPrompt.trim()}`;
    }

    return {
      systemPrompt: MASTER_SYSTEM_PROMPT,
      finalPrompt,
      negativePrompt: STANDARD_NEGATIVE_PROMPT,
      estimatedCredits: req.variationsCount * 5,
    };
  }

  /**
   * Constructs prompt for object removal / inpainting
   */
  static constructRemovalPrompt(objectName?: string): string {
    const target = objectName ? `the ${objectName}` : "the selected object";
    return `Remove only ${target} from this real estate interior photograph. Reconstruct the hidden wall, floor, baseboard, ceiling, or background naturally. Preserve original lighting, shadows, texture, perspective, and camera angle. Do not add new furniture, people, text, or artifacts. The result must look like a clean, professionally photographed empty space.`;
  }

  /**
   * Constructs prompt for object replacement
   */
  static constructReplacementPrompt(replacementDescription: string): string {
    return `Replace only the object inside the provided mask with: ${replacementDescription}. Match the original room's perspective, scale, floor contact point, lighting direction, shadow softness, material reflections, and colour temperature. Preserve all unaffected regions as closely as possible.`;
  }

  /**
   * Constructs prompt for staged room refinement
   */
  static constructRefinementPrompt(refinementInstruction: string): string {
    return `Refine the previously generated staged room. Apply this instruction: ${refinementInstruction}. Preserve the existing architecture, camera angle, window and door positions, flooring, and overall furniture layout unless the instruction explicitly requires a change. Make only the requested change. Keep the result photorealistic and suitable for a real estate listing.`;
  }
}
