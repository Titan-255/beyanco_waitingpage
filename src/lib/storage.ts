import {
  Project,
  ProjectRoom,
  Generation,
  StagingJob,
  FurnitureEditorDocument,
  CreditTransaction,
  User,
  Organization,
} from "@/types";
import { SAMPLE_PROJECTS, SAMPLE_GENERATIONS } from "./sample-data";

export interface AIProviderConfig {
  provider: "demo" | "openai" | "replicate" | "stability" | "comfyui";
  apiKey?: string;
  baseUrl?: string;
  modelName?: string;
  isEnabled: boolean;
}

const STORAGE_KEYS = {
  PROJECTS: "beyanco_projects",
  GENERATIONS: "beyanco_generations",
  STAGING_JOBS: "beyanco_staging_jobs",
  EDITOR_DOCS: "beyanco_editor_docs",
  CREDITS: "beyanco_credits",
  TRANSACTIONS: "beyanco_credit_transactions",
  PROVIDER_CONFIG: "beyanco_provider_config",
  USER: "beyanco_user",
  ORG: "beyanco_organization",
};

// Initial default state
export const DEFAULT_USER: User = {
  id: "usr_tarun_01",
  name: "Tarun Sharma",
  email: "tarun@beyanco.ai",
  title: "Studio Owner",
  phone: "+1 (555) 382-9104",
  bio: "Luxury residential staging specialist and interior visualization director.",
  role: "OWNER",
  organizationId: "org_beyanco_main",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
};

export const DEFAULT_ORG: Organization = {
  id: "org_beyanco_main",
  name: "Beyanco Real Estate Studio",
  slug: "beyanco-studio",
  plan: "growth",
  creditBalance: 125,
};

export const DEFAULT_EDITOR_DOC: FurnitureEditorDocument = {
  id: "doc_gen_001",
  designId: "gen_001",
  roomTitle: "Skyline Living Room — Contemporary Staging",
  backgroundImageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400&auto=format&fit=crop",
  originalImageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
  canvasWidth: 960,
  canvasHeight: 540,
  version: 1,
  updatedAt: "2026-11-02T16:20:00Z",
  objects: [
    {
      id: "obj_sofa_init",
      productId: "SF-CURV-02",
      name: "Sienna Bouclé Curved Lounge Sofa",
      assetUrl: "/furniture/sofa_curved.svg",
      x: 340,
      y: 280,
      width: 280,
      height: 154,
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      locked: false,
      aspectRatio: 1.81,
    },
    {
      id: "obj_table_init",
      productId: "TB-COF-01",
      name: "Tivoli Fluted Travertine Coffee Table",
      assetUrl: "/furniture/table_coffee.svg",
      x: 410,
      y: 380,
      width: 170,
      height: 102,
      rotation: 0,
      zIndex: 3,
      opacity: 1,
      locked: false,
      aspectRatio: 1.66,
    },
    {
      id: "obj_plant_init",
      productId: "PL-FID-01",
      name: "Ficus Lyrata Planter",
      assetUrl: "/furniture/plant_ficus.svg",
      x: 140,
      y: 220,
      width: 90,
      height: 140,
      rotation: 0,
      zIndex: 1,
      opacity: 1,
      locked: false,
      aspectRatio: 0.64,
    },
  ],
};

class ClientStorage {
  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  private notifySync(key?: string): void {
    if (this.isClient()) {
      try {
        window.dispatchEvent(new CustomEvent("beyanco-storage-sync", { detail: { key } }));
      } catch {
        // Safe fallback in non-standard environments
      }
    }
  }

  // Projects
  getProjects(): Project[] {
    if (!this.isClient()) return SAMPLE_PROJECTS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SAMPLE_PROJECTS));
        return SAMPLE_PROJECTS;
      }
      const parsed: Project[] = JSON.parse(data);
      // Ensure sample projects or legacy projects have rooms
      let updated = false;
      parsed.forEach((proj) => {
        if (!proj.rooms || proj.rooms.length === 0) {
          const sampleMatch = SAMPLE_PROJECTS.find((sp) => sp.id === proj.id);
          if (sampleMatch && sampleMatch.rooms) {
            proj.rooms = [...sampleMatch.rooms];
            proj.propertyName = proj.propertyName || sampleMatch.propertyName;
            proj.location = proj.location || sampleMatch.location;
            proj.city = proj.city || sampleMatch.city;
            proj.totalArea = proj.totalArea || sampleMatch.totalArea;
            proj.areaUnit = proj.areaUnit || sampleMatch.areaUnit;
            proj.purpose = proj.purpose || sampleMatch.purpose;
            proj.targetAudience = proj.targetAudience || sampleMatch.targetAudience;
            proj.condition = proj.condition || sampleMatch.condition;
            proj.designPreferences = proj.designPreferences || sampleMatch.designPreferences;
            updated = true;
          } else {
            proj.rooms = [
              {
                id: `room_${proj.id}_1`,
                projectId: proj.id,
                name: "Main Room",
                type: "living_room",
                originalImageUrl: proj.thumbnailUrl,
                designCount: proj.designCount || 0,
                status: proj.designCount > 0 ? "staged" : "empty",
                createdAt: proj.createdAt,
                updatedAt: proj.updatedAt,
              },
            ];
            updated = true;
          }
        }
      });
      if (updated) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return SAMPLE_PROJECTS;
    }
  }

  saveProject(project: Project): void {
    if (!this.isClient()) return;
    const projects = this.getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...projects[existingIndex], ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift(project);
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    this.notifySync("projects");
  }

  getProjectById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  deleteProject(id: string): boolean {
    if (!this.isClient()) return false;
    const projects = this.getProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    this.notifySync("projects");
    return true;
  }

  // Room Management
  getProjectRooms(projectId: string): ProjectRoom[] {
    const proj = this.getProjectById(projectId);
    return proj?.rooms || [];
  }

  addRoomToProject(projectId: string, roomData: Partial<ProjectRoom>): ProjectRoom | null {
    if (!this.isClient()) return null;
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const newRoom: ProjectRoom = {
      id: `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId,
      name: roomData.name || "New Space",
      type: roomData.type || "living_room",
      originalImageUrl: roomData.originalImageUrl,
      designCount: 0,
      status: roomData.originalImageUrl ? "in_progress" : "empty",
      dimensions: roomData.dimensions || "",
      ceilingHeight: roomData.ceilingHeight || "",
      intendedFunctionality: roomData.intendedFunctionality || "",
      designPreferences: roomData.designPreferences,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    project.rooms = [...(project.rooms || []), newRoom];
    project.roomCount = project.rooms.length;
    this.saveProject(project);
    return newRoom;
  }

  updateRoomInProject(projectId: string, updatedRoom: ProjectRoom): void {
    if (!this.isClient()) return;
    const project = this.getProjectById(projectId);
    if (!project || !project.rooms) return;

    const index = project.rooms.findIndex((r) => r.id === updatedRoom.id);
    if (index >= 0) {
      project.rooms[index] = { ...updatedRoom, updatedAt: new Date().toISOString() };
      this.saveProject(project);
    }
  }

  deleteRoomFromProject(projectId: string, roomId: string): void {
    if (!this.isClient()) return;
    const project = this.getProjectById(projectId);
    if (!project || !project.rooms) return;

    project.rooms = project.rooms.filter((r) => r.id !== roomId);
    project.roomCount = project.rooms.length;
    this.saveProject(project);
  }

  // Generations
  getGenerations(): Generation[] {
    if (!this.isClient()) return SAMPLE_GENERATIONS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GENERATIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(SAMPLE_GENERATIONS));
        return SAMPLE_GENERATIONS;
      }
      return JSON.parse(data);
    } catch {
      return SAMPLE_GENERATIONS;
    }
  }

  getGenerationById(id: string): Generation | undefined {
    return this.getGenerations().find((g) => g.id === id);
  }

  saveGeneration(generation: Generation): void {
    if (!this.isClient()) return;
    const generations = this.getGenerations();
    const index = generations.findIndex((g) => g.id === generation.id);
    if (index >= 0) {
      generations[index] = generation;
    } else {
      generations.unshift(generation);
    }
    localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(generations));

    // Update project and room design counts
    if (generation.projectId) {
      const project = this.getProjectById(generation.projectId);
      if (project) {
        project.designCount = (project.designCount || 0) + 1;
        if (generation.roomId && project.rooms) {
          const room = project.rooms.find((r) => r.id === generation.roomId);
          if (room) {
            room.designCount = (room.designCount || 0) + 1;
            room.status = "staged";
            room.updatedAt = new Date().toISOString();
          }
        }
        this.saveProject(project);
      }
    }

    this.notifySync("generations");
  }

  toggleFavorite(generationId: string): boolean {
    if (!this.isClient()) return false;
    const generations = this.getGenerations();
    const gen = generations.find((g) => g.id === generationId);
    if (gen) {
      gen.isFavorite = !gen.isFavorite;
      localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(generations));
      this.notifySync("generations");
      return gen.isFavorite;
    }
    return false;
  }

  // Furniture Editor Documents
  getEditorDocument(designId: string): FurnitureEditorDocument {
    if (!this.isClient()) {
      return designId === "gen_001" ? DEFAULT_EDITOR_DOC : this.createNewDocForDesign(designId);
    }
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.EDITOR_DOCS}_${designId}`);
      if (data) {
        return JSON.parse(data);
      }
      if (designId === "gen_001") {
        localStorage.setItem(`${STORAGE_KEYS.EDITOR_DOCS}_${designId}`, JSON.stringify(DEFAULT_EDITOR_DOC));
        return DEFAULT_EDITOR_DOC;
      }
      const newDoc = this.createNewDocForDesign(designId);
      localStorage.setItem(`${STORAGE_KEYS.EDITOR_DOCS}_${designId}`, JSON.stringify(newDoc));
      return newDoc;
    } catch {
      return this.createNewDocForDesign(designId);
    }
  }

  private createNewDocForDesign(designId: string): FurnitureEditorDocument {
    const gen = this.getGenerationById(designId);
    return {
      id: `doc_${designId}`,
      designId,
      roomTitle: gen ? `${gen.roomType.replace('_', ' ')} Staging` : "Room Furniture Stage",
      backgroundImageUrl: gen?.outputImageUrl || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400&auto=format&fit=crop",
      originalImageUrl: gen?.originalImageUrl,
      canvasWidth: 960,
      canvasHeight: 540,
      version: 1,
      updatedAt: new Date().toISOString(),
      objects: [],
    };
  }

  saveEditorDocument(doc: FurnitureEditorDocument): void {
    if (!this.isClient()) return;
    doc.updatedAt = new Date().toISOString();
    doc.version += 1;
    localStorage.setItem(`${STORAGE_KEYS.EDITOR_DOCS}_${doc.designId}`, JSON.stringify(doc));
    
    // Mark generation as having editor document
    const gen = this.getGenerationById(doc.designId);
    if (gen && !gen.hasEditorDocument) {
      gen.hasEditorDocument = true;
      this.saveGeneration(gen);
    }
    this.notifySync("editor");
  }

  // Credits & Balance
  getCredits(): number {
    if (!this.isClient()) return DEFAULT_ORG.creditBalance;
    try {
      const balance = localStorage.getItem(STORAGE_KEYS.CREDITS);
      if (balance !== null) return parseInt(balance, 10);
      localStorage.setItem(STORAGE_KEYS.CREDITS, DEFAULT_ORG.creditBalance.toString());
      return DEFAULT_ORG.creditBalance;
    } catch {
      return DEFAULT_ORG.creditBalance;
    }
  }

  deductCredits(amount: number, description: string): boolean {
    if (!this.isClient()) return true;
    const current = this.getCredits();
    if (current < amount) return false;
    const newBalance = current - amount;
    localStorage.setItem(STORAGE_KEYS.CREDITS, newBalance.toString());
    this.addTransaction({
      id: `tx_${Date.now()}`,
      organizationId: DEFAULT_ORG.id,
      amount: -amount,
      type: "usage",
      description,
      balanceAfter: newBalance,
      createdAt: new Date().toISOString(),
    });
    this.notifySync("credits");
    return true;
  }

  addCredits(amount: number, description: string): number {
    if (!this.isClient()) return DEFAULT_ORG.creditBalance + amount;
    const current = this.getCredits();
    const newBalance = current + amount;
    localStorage.setItem(STORAGE_KEYS.CREDITS, newBalance.toString());
    this.addTransaction({
      id: `tx_${Date.now()}`,
      organizationId: DEFAULT_ORG.id,
      amount,
      type: "purchase",
      description,
      balanceAfter: newBalance,
      createdAt: new Date().toISOString(),
    });
    this.notifySync("credits");
    return newBalance;
  }

  getTransactions(): CreditTransaction[] {
    if (!this.isClient()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [
        {
          id: "tx_init_01",
          organizationId: DEFAULT_ORG.id,
          amount: 150,
          type: "purchase",
          description: "Monthly Growth Plan Allowance (150 Credits)",
          balanceAfter: 150,
          createdAt: "2026-10-15T00:00:00Z",
        },
        {
          id: "tx_init_02",
          organizationId: DEFAULT_ORG.id,
          amount: -25,
          type: "usage",
          description: "Staged Living Room & Master Suite (5 Variations)",
          balanceAfter: 125,
          createdAt: "2026-11-01T14:30:00Z",
        },
      ];
    } catch {
      return [];
    }
  }

  private addTransaction(tx: CreditTransaction): void {
    const list = this.getTransactions();
    list.unshift(tx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
  }

  // AI Provider Settings
  getProviderConfig(): AIProviderConfig {
    if (!this.isClient()) return { provider: "demo", isEnabled: true };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROVIDER_CONFIG);
      return data ? JSON.parse(data) : { provider: "demo", isEnabled: true };
    } catch {
      return { provider: "demo", isEnabled: true };
    }
  }

  saveProviderConfig(config: AIProviderConfig): void {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEYS.PROVIDER_CONFIG, JSON.stringify(config));
    this.notifySync("provider");
  }

  // User Profile
  getUser(): User {
    if (!this.isClient()) return DEFAULT_USER;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? { ...DEFAULT_USER, ...JSON.parse(data) } : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  }

  saveUser(updatedUser: Partial<User>): User {
    const current = this.getUser();
    const merged = { ...current, ...updatedUser };
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
      this.notifySync("user");
    }
    return merged;
  }

  // Organization
  getOrganization(): Organization {
    if (!this.isClient()) return DEFAULT_ORG;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORG);
      return data ? { ...DEFAULT_ORG, ...JSON.parse(data) } : DEFAULT_ORG;
    } catch {
      return DEFAULT_ORG;
    }
  }

  saveOrganization(updatedOrg: Partial<Organization>): Organization {
    const current = this.getOrganization();
    const merged = { ...current, ...updatedOrg };
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.ORG, JSON.stringify(merged));
      this.notifySync("org");
    }
    return merged;
  }
}

export const storage = new ClientStorage();
