export type RoomType =
  | 'living_room'
  | 'bedroom'
  | 'master_bedroom'
  | 'guest_bedroom'
  | 'dining_room'
  | 'kitchen'
  | 'home_office'
  | 'study_room'
  | 'bathroom'
  | 'balcony'
  | 'foyer'
  | 'hallway'
  | 'outdoor'
  | 'commercial'
  | 'other';

export type InteriorStyle =
  | 'contemporary'
  | 'modern_luxury'
  | 'scandinavian'
  | 'japandi'
  | 'minimalist'
  | 'industrial'
  | 'coastal'
  | 'contemporary_indian'
  | 'organic_modern'
  | 'traditional'
  | 'warm_minimalism'
  | 'mid_century_modern'
  | 'boutique_hotel'
  | 'art_inspired'
  | 'bespoke_eclectic'
  | 'ai_recommended';

export type BudgetTier = 'economy' | 'standard' | 'premium' | 'ultra_luxury';

export type PropertyType =
  | 'apartment'
  | 'independent_house'
  | 'villa'
  | 'studio'
  | 'penthouse'
  | 'office'
  | 'commercial'
  | 'condo'
  | 'townhouse'
  | 'other';

export type ProjectPurpose =
  | 'sell'
  | 'rent'
  | 'short_term_rental'
  | 'personal_residence'
  | 'interior_renovation'
  | 'commercial_presentation'
  | 'other';

export type TargetAudience =
  | 'families'
  | 'young_professionals'
  | 'students'
  | 'luxury_buyers'
  | 'business_clients'
  | 'general_audience'
  | 'not_sure';

export type PropertyCondition =
  | 'completely_empty'
  | 'partially_furnished'
  | 'fully_furnished'
  | 'outdated'
  | 'under_renovation'
  | 'newly_constructed'
  | 'other';

export type DesignIntensity = 'light' | 'complete' | 'premium';

export type JobStatus = 'pending' | 'analyzing' | 'designing' | 'generating' | 'completed' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  title?: string;
  phone?: string;
  bio?: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'growth' | 'business' | 'enterprise';
  creditBalance: number;
}

export interface ProjectRoom {
  id: string;
  projectId: string;
  name: string;
  type: RoomType;
  originalImageUrl?: string;
  designCount: number;
  status: 'empty' | 'staged' | 'in_progress';
  dimensions?: string;
  ceilingHeight?: string;
  condition?: PropertyCondition | string;
  intendedFunctionality?: string;
  designPreferences?: {
    style?: InteriorStyle;
    colorPalette?: string;
    furnitureRequirements?: string[];
    materials?: string;
    intensity?: DesignIntensity;
    customInstructions?: string;
    preserveFlooring?: boolean;
    preserveWallsWindows?: boolean;
    preserveDoors?: boolean;
    preserveLighting?: boolean;
    allowDecorative?: boolean;
    allowRenovation?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDesignPreferences {
  preferredStyle: InteriorStyle | string;
  colorPreferences: string;
  furnitureBudget: 'budget_friendly' | 'mid_range' | 'premium' | 'luxury' | 'no_preference' | string;
  preferredMaterials?: string;
  furniturePreferences?: string[];
  lightingPreferences?: string;
  overallAtmosphere?: string;
  itemsToPreserve?: string;
  itemsToAvoid?: string;
  specialInstructions?: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  propertyName?: string;
  address: string;
  location?: string;
  city?: string;
  neighbourhood?: string;
  propertyType: PropertyType | string;
  description?: string;
  targetBuyer?: string;
  status: 'active' | 'archived';
  thumbnailUrl?: string;
  roomCount: number;
  designCount: number;
  totalArea?: number;
  areaUnit?: 'sq.ft' | 'sq.m';
  floorsCount?: number;
  bedroomsCount?: number;
  bathroomsCount?: number;
  balconiesCount?: number;
  purpose?: ProjectPurpose | string;
  targetAudience?: TargetAudience | string;
  condition?: PropertyCondition | string;
  preserveFixtures?: boolean;
  restrictions?: string;
  designPreferences?: Partial<ProjectDesignPreferences>;
  rooms?: ProjectRoom[];
  createdAt: string;
  updatedAt: string;
}

export interface StagingJob {
  id: string;
  projectId: string;
  roomId?: string;
  roomType: RoomType;
  style: InteriorStyle;
  colorScheme: string;
  budgetLevel: BudgetTier;
  originalImageUrl: string;
  userPrompt?: string;
  finalPrompt?: string;
  negativePrompt?: string;
  status: JobStatus;
  progressPercent: number;
  statusMessage: string;
  variationsCount: number;
  creditsUsed: number;
  createdAt: string;
  completedAt?: string;
  generations: Generation[];
}

export interface Generation {
  id: string;
  jobId: string;
  projectId: string;
  roomId?: string;
  roomName?: string;
  projectName?: string;
  variationIndex: number;
  originalImageUrl: string;
  outputImageUrl: string;
  thumbnailUrl: string;
  roomType: RoomType;
  style: InteriorStyle;
  isFavorite: boolean;
  modelProvider: string;
  modelName: string;
  designIntensity?: DesignIntensity;
  furnitureRequirements?: string[];
  createdAt: string;
  hasEditorDocument?: boolean;
}

export interface FurnitureProduct {
  id: string;
  productId: string;
  name: string;
  category:
    | 'sofas'
    | 'chairs'
    | 'tables'
    | 'beds'
    | 'lighting'
    | 'rugs'
    | 'plants'
    | 'decor'
    | 'storage';
  assetUrl: string;
  previewUrl: string;
  dimensions: {
    widthCm: number;
    depthCm: number;
    heightCm: number;
  };
  style: string;
  color: string;
  material: string;
  budgetTier: BudgetTier;
}

export interface CanvasFurnitureObject {
  id: string;
  productId: string;
  name: string;
  assetUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
  locked: boolean;
  aspectRatio: number;
}

export interface FurnitureEditorDocument {
  id: string;
  designId: string;
  backgroundImageUrl: string;
  originalImageUrl?: string;
  roomTitle: string;
  objects: CanvasFurnitureObject[];
  version: number;
  canvasWidth: number;
  canvasHeight: number;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  organizationId: string;
  amount: number;
  type: 'usage' | 'purchase' | 'refund' | 'bonus';
  description: string;
  balanceAfter: number;
  createdAt: string;
}
