"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { ImageUploadZone } from "@/components/ui/ImageUploadZone";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  STYLE_OPTIONS,
  ROOM_TYPE_OPTIONS,
  ROOM_FURNITURE_SETS,
  COLOR_PALETTE_OPTIONS,
  MATERIAL_OPTIONS,
} from "@/lib/sample-data";
import { AIEngineService } from "@/lib/ai-engine";
import { storage } from "@/lib/storage";
import {
  RoomType,
  InteriorStyle,
  BudgetTier,
  Generation,
  Project,
  ProjectRoom,
  DesignIntensity,
} from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Layers,
  Wand2,
  Coins,
  Loader2,
  Building2,
  Eye,
  SlidersHorizontal,
  Home,
  Upload,
  RefreshCw,
  Download,
  ChevronsLeftRight,
  ShieldCheck,
  Lightbulb,
  Search,
  Plus,
} from "lucide-react";

const DESIGN_STEPS = [
  { id: 1, label: "Select Project" },
  { id: 2, label: "Select Room" },
  { id: 3, label: "Room Photo" },
  { id: 4, label: "Design Direction" },
  { id: 5, label: "Review & Generate" },
];

function DesignWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlProjectId = searchParams.get("projectId");
  const urlRoomId = searchParams.get("roomId");

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Selected Project
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectSearch, setProjectSearch] = useState<string>("");

  // Step 2: Selected Room
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isAddingNewRoom, setIsAddingNewRoom] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>("");
  const [newRoomType, setNewRoomType] = useState<RoomType>("living_room");

  // Step 3: Room Photograph
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [imageFileName, setImageFileName] = useState<string>("");
  const [imageFileSize, setImageFileSize] = useState<number | undefined>();

  // Step 4: Design Configuration
  const [roomType, setRoomType] = useState<RoomType>("living_room");
  const [roomDimensions, setRoomDimensions] = useState<string>("");
  const [ceilingHeight, setCeilingHeight] = useState<string>("");
  const [intendedFunctionality, setIntendedFunctionality] = useState<string>("");

  const [selectedStyle, setSelectedStyle] = useState<InteriorStyle>("contemporary");
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([]);
  const [colorScheme, setColorScheme] = useState<string>("Warm neutral & Travertine stone");
  const [customColor, setCustomColor] = useState<string>("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([
    "Solid White Oak",
    "Honed Roman Travertine",
  ]);
  const [budgetLevel, setBudgetLevel] = useState<BudgetTier>("premium");
  const [designIntensity, setDesignIntensity] = useState<DesignIntensity>("complete");

  // Preservation & Architecture rules
  const [preserveFlooring, setPreserveFlooring] = useState<boolean>(true);
  const [preserveWallsWindows, setPreserveWallsWindows] = useState<boolean>(true);
  const [preserveDoors, setPreserveDoors] = useState<boolean>(true);
  const [preserveLighting, setPreserveLighting] = useState<boolean>(true);
  const [allowDecorative, setAllowDecorative] = useState<boolean>(true);
  const [allowRenovation, setAllowRenovation] = useState<boolean>(false);
  const [furnitureAction, setFurnitureAction] = useState<"keep" | "remove" | "replace">("replace");

  // Custom User Instructions
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [variationsCount, setVariationsCount] = useState<number>(1);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationPhase, setGenerationPhase] = useState<string>("");
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<Generation | null>(null);

  // Load projects from storage
  useEffect(() => {
    const projs = storage.getProjects();
    setProjects(projs);

    if (projs.length > 0) {
      const targetProjId = urlProjectId && projs.some((p) => p.id === urlProjectId)
        ? urlProjectId
        : projs[0].id;
      setSelectedProjectId(targetProjId);

      const proj = projs.find((p) => p.id === targetProjId);
      if (proj && proj.rooms && proj.rooms.length > 0) {
        const targetRoom = urlRoomId && proj.rooms.some((r) => r.id === urlRoomId)
          ? proj.rooms.find((r) => r.id === urlRoomId)
          : proj.rooms[0];

        if (targetRoom) {
          setSelectedRoomId(targetRoom.id);
          setRoomType(targetRoom.type);
          setRoomDimensions(targetRoom.dimensions || "");
          setCeilingHeight(targetRoom.ceilingHeight || "");
          setIntendedFunctionality(targetRoom.intendedFunctionality || "");
          if (targetRoom.originalImageUrl) {
            setUploadedImageUrl(targetRoom.originalImageUrl);
          }
          // Default furniture for room
          setSelectedFurniture(ROOM_FURNITURE_SETS[targetRoom.type]?.slice(0, 5) || []);
        }
      }

      // If arrived with both projectId and roomId from a room's Design button, jump to Step 3 or 4 directly
      if (urlProjectId && urlRoomId) {
        const proj = projs.find((p) => p.id === urlProjectId);
        const room = proj?.rooms?.find((r) => r.id === urlRoomId);
        if (room?.originalImageUrl) {
          setCurrentStep(4);
        } else {
          setCurrentStep(3);
        }
      } else if (urlProjectId) {
        setCurrentStep(2);
      }
    }
  }, [urlProjectId, urlRoomId]);

  const activeProject = projects.find((p) => p.id === selectedProjectId);
  const activeRoom = activeProject?.rooms?.find((r) => r.id === selectedRoomId);

  // Handle switching project
  const handleSelectProject = (projId: string) => {
    setSelectedProjectId(projId);
    const proj = projects.find((p) => p.id === projId);
    if (proj && proj.rooms && proj.rooms.length > 0) {
      const firstRoom = proj.rooms[0];
      setSelectedRoomId(firstRoom.id);
      setRoomType(firstRoom.type);
      setRoomDimensions(firstRoom.dimensions || "");
      setCeilingHeight(firstRoom.ceilingHeight || "");
      setIntendedFunctionality(firstRoom.intendedFunctionality || "");
      setUploadedImageUrl(firstRoom.originalImageUrl || "");
      setSelectedFurniture(ROOM_FURNITURE_SETS[firstRoom.type]?.slice(0, 5) || []);
    } else {
      setSelectedRoomId("");
      setUploadedImageUrl("");
    }
  };

  // Handle switching room
  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    const room = activeProject?.rooms?.find((r) => r.id === roomId);
    if (room) {
      setRoomType(room.type);
      setRoomDimensions(room.dimensions || "");
      setCeilingHeight(room.ceilingHeight || "");
      setIntendedFunctionality(room.intendedFunctionality || "");
      if (room.originalImageUrl) {
        setUploadedImageUrl(room.originalImageUrl);
      }
      setSelectedFurniture(ROOM_FURNITURE_SETS[room.type]?.slice(0, 5) || []);
    }
  };

  // Handle quick room creation in wizard
  const handleCreateNewRoomInWizard = () => {
    if (!newRoomName.trim() || !activeProject) return;
    const added = storage.addRoomToProject(activeProject.id, {
      name: newRoomName.trim(),
      type: newRoomType,
      status: "empty",
    });
    setProjects(storage.getProjects());
    setIsAddingNewRoom(false);
    setNewRoomName("");
    if (added) {
      handleSelectRoom(added.id);
    }
  };

  // AI Recommendation Smart Action
  const handleApplyAIRecommendation = () => {
    setSelectedStyle("contemporary");
    setDesignIntensity("complete");
    setColorScheme("Warm neutrals & travertine stone");
    setSelectedMaterials(["Solid White Oak", "Honed Roman Travertine", "Belgian Linen"]);
    if (activeRoom) {
      setSelectedFurniture(ROOM_FURNITURE_SETS[activeRoom.type]?.slice(0, 6) || []);
      setUserPrompt(
        `Curate an aspirational, light-filled interior staged intentionally for high-net-worth buyers in ${
          activeProject?.city || "this neighborhood"
        }. Maintain original window light angles and preserve hardwood floor geometry.`
      );
    }
  };

  const toggleFurniture = (item: string) => {
    if (selectedFurniture.includes(item)) {
      setSelectedFurniture(selectedFurniture.filter((i) => i !== item));
    } else {
      setSelectedFurniture([...selectedFurniture, item]);
    }
  };

  const toggleMaterial = (mat: string) => {
    if (selectedMaterials.includes(mat)) {
      setSelectedMaterials(selectedMaterials.filter((m) => m !== mat));
    } else {
      setSelectedMaterials([...selectedMaterials, mat]);
    }
  };

  const creditCost = variationsCount * 5;

  const handleStartGeneration = async () => {
    if (!uploadedImageUrl) {
      setGenerationError("Please upload or select an original room photograph first.");
      setCurrentStep(3);
      return;
    }

    const availableCredits = storage.getCredits();
    if (availableCredits < creditCost) {
      setGenerationError(
        `Insufficient credits. This staging requires ${creditCost} credits, but you have ${availableCredits} available.`
      );
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress(10);
    setGenerationPhase("Calibrating property context & room boundary mesh...");

    try {
      const promptDetails = AIEngineService.constructPrompt({
        roomType,
        roomName: activeRoom?.name,
        projectId: activeProject?.id || "proj_default",
        projectName: activeProject?.name,
        propertyType: activeProject?.propertyType,
        targetAudience: activeProject?.targetBuyer,
        style: selectedStyle,
        colorScheme: customColor.trim() || colorScheme,
        budgetLevel,
        designIntensity,
        furnitureRequirements: selectedFurniture,
        materials: selectedMaterials.join(", "),
        variationsCount,
        userPrompt,
        originalImageUrl: uploadedImageUrl,
        preserveOptions: {
          preserveFlooring,
          preserveWallsWindows,
          preserveDoors,
          preserveLighting,
          allowDecorative,
          allowRenovation,
        },
      });

      // Pipeline Stage 1: Spatial Perspective
      await new Promise((r) => setTimeout(r, 900));
      setGenerationProgress(32);
      setGenerationPhase("Synthesizing daylight vectors & wall plane geometry...");

      // Pipeline Stage 2: Spatial Layout & Furnishing
      await new Promise((r) => setTimeout(r, 1000));
      setGenerationProgress(60);
      setGenerationPhase(
        `Arranging ${selectedFurniture.length || 5} architectural furniture elements in ${selectedStyle.replace('_', ' ')} aesthetic...`
      );

      // Pipeline Stage 3: Material Roughness & Contact Shadows
      await new Promise((r) => setTimeout(r, 1100));
      setGenerationProgress(85);
      setGenerationPhase("Applying photorealistic tactile textures & ambient occlusion...");

      // Pipeline Stage 4: 4K Render Finalization
      await new Promise((r) => setTimeout(r, 800));
      setGenerationProgress(98);
      setGenerationPhase("Finalizing uncompressed real estate listing render...");

      await new Promise((r) => setTimeout(r, 400));
      setGenerationProgress(100);

      // Pick high-resolution aesthetic result matching selected style
      const styleMatch = STYLE_OPTIONS.find((s) => s.id === selectedStyle);
      const stagedImageUrl =
        styleMatch?.imageUrl ||
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400&auto=format&fit=crop";

      const newGenId = `gen_${Date.now()}`;
      const newGen: Generation = {
        id: newGenId,
        jobId: `job_${Date.now()}`,
        projectId: activeProject?.id || "proj_001",
        projectName: activeProject?.name || "Property Project",
        roomId: activeRoom?.id,
        roomName: activeRoom?.name || roomType.replace("_", " "),
        variationIndex: 1,
        originalImageUrl: uploadedImageUrl,
        outputImageUrl: stagedImageUrl,
        thumbnailUrl: stagedImageUrl,
        roomType,
        style: selectedStyle,
        designIntensity,
        furnitureRequirements: selectedFurniture,
        isFavorite: false,
        modelProvider: "Beyanco Spatial Architecture Engine v2.4",
        modelName: "Spatial-Diffusion-HQ",
        createdAt: new Date().toISOString(),
        hasEditorDocument: false,
      };

      // Deduct credits and save generation
      storage.deductCredits(
        creditCost,
        `Staging: ${activeProject?.name || 'Project'} — ${activeRoom?.name || roomType}`
      );
      storage.saveGeneration(newGen);

      // Also ensure room has this image saved as original if it was empty
      if (activeProject && activeRoom && !activeRoom.originalImageUrl) {
        activeRoom.originalImageUrl = uploadedImageUrl;
        storage.updateRoomInProject(activeProject.id, activeRoom);
      }

      setGeneratedResult(newGen);
      setIsGenerating(false);
    } catch (err: any) {
      setIsGenerating(false);
      setGenerationError(err.message || "Failed to complete AI design generation. Please try again.");
    }
  };

  return (
    <DashboardLayout
      title="Design Workspace"
      subtitle="Project-based spatial staging powered by Interior Design Intelligence."
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Step Indicator */}
        {!generatedResult && !isGenerating && (
          <div className="bg-white p-4 rounded-2xl border border-beyanco-border shadow-card">
            <StepIndicator steps={DESIGN_STEPS} currentStep={currentStep} />
          </div>
        )}

        {/* GENERATION IN PROGRESS OVERLAY */}
        {isGenerating && (
          <div className="bg-white p-10 rounded-3xl border border-beyanco-border shadow-card text-center space-y-6 max-w-xl mx-auto my-12">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
              <div className="absolute inset-0 rounded-full border-4 border-beyanco-blue border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-beyanco-blue animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-beyanco-navy tracking-tight">
                Architectural AI Synthesizing Interior Design
              </h3>
              <p className="text-xs text-beyanco-slate min-h-[20px]">
                {generationPhase}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-beyanco-blue h-full transition-all duration-300 rounded-full"
                style={{ width: `${generationProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-beyanco-muted pt-2 border-t border-slate-100">
              <span>Project: <strong>{activeProject?.name}</strong></span>
              <span>Room: <strong>{activeRoom?.name || roomType}</strong></span>
              <span>Progress: <strong>{generationProgress}%</strong></span>
            </div>
          </div>
        )}

        {/* STEP 1: SELECT PROJECT */}
        {!generatedResult && !isGenerating && currentStep === 1 && (
          <Card className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-beyanco-navy tracking-tight">
                  Step 1: Select Property Project
                </h3>
                <p className="text-xs text-beyanco-slate mt-0.5">
                  Choose the property project this room belongs to so the AI inherits location and architectural context.
                </p>
              </div>

              <Link href="/projects">
                <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  New Property Project
                </Button>
              </Link>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search projects by name, city, or property type..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
              />
            </div>

            {/* Project Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
              {projects
                .filter(
                  (p) =>
                    p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
                    p.city?.toLowerCase().includes(projectSearch.toLowerCase()) ||
                    p.propertyType?.toLowerCase().includes(projectSearch.toLowerCase())
                )
                .map((proj) => {
                  const isSelected = selectedProjectId === proj.id;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectProject(proj.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-blue-50/60 border-beyanco-blue ring-2 ring-beyanco-blue shadow-xs"
                          : "bg-white border-beyanco-border hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="default" size="sm" className="uppercase font-bold text-[9px]">
                            {proj.propertyType?.replace("_", " ")}
                          </Badge>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-beyanco-blue text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-beyanco-navy tracking-tight line-clamp-1">
                          {proj.name}
                        </h4>

                        <p className="text-[11px] text-beyanco-slate truncate">
                          {proj.address || proj.city || "Location set"}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-beyanco-muted mt-3">
                        <span>{proj.rooms?.length || proj.roomCount || 1} Rooms</span>
                        <span>{proj.designCount || 0} Staged</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                size="md"
                disabled={!selectedProjectId}
                onClick={() => setCurrentStep(2)}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Room Selection
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: SELECT ROOM */}
        {!generatedResult && !isGenerating && currentStep === 2 && (
          <Card className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="blue" size="sm" className="text-[10px]">
                    Project: {activeProject?.name}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-beyanco-navy tracking-tight">
                  Step 2: Select Room to Stage
                </h3>
                <p className="text-xs text-beyanco-slate mt-0.5">
                  Pick an existing room in this property or add a new space to stage.
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsAddingNewRoom(!isAddingNewRoom)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                {isAddingNewRoom ? "Cancel" : "Add Room to Project"}
              </Button>
            </div>

            {/* Quick Room Addition Form */}
            {isAddingNewRoom && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-beyanco-navy block">
                  Add New Room to {activeProject?.name}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Room Name (e.g. Master Living Suite, Guest Studio)..."
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="p-2.5 text-xs bg-white border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as any)}
                    className="p-2.5 text-xs bg-white border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  >
                    {ROOM_TYPE_OPTIONS.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        {rt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsAddingNewRoom(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleCreateNewRoomInWizard}>
                    Save Room
                  </Button>
                </div>
              </div>
            )}

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProject?.rooms?.map((room) => {
                const isSelected = selectedRoomId === room.id;
                const roomTypeLabel = ROOM_TYPE_OPTIONS.find((rt) => rt.id === room.type)?.label || room.type;
                return (
                  <div
                    key={room.id}
                    onClick={() => handleSelectRoom(room.id)}
                    className={`rounded-2xl border overflow-hidden cursor-pointer transition-all flex flex-col justify-between group ${
                      isSelected
                        ? "bg-blue-50/50 border-beyanco-blue ring-2 ring-beyanco-blue shadow-xs"
                        : "bg-white border-beyanco-border hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="relative aspect-[16/10] bg-slate-900">
                      {room.originalImageUrl ? (
                        <img
                          src={room.originalImageUrl}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-slate-800">
                          <Building2 className="w-6 h-6 text-slate-500 mb-1" />
                          <span className="text-[11px] text-slate-400">No Photo Yet</span>
                        </div>
                      )}

                      <div className="absolute top-2 left-2">
                        <Badge variant="default" size="sm" className="bg-white/90 text-slate-700 text-[9px] font-bold">
                          {roomTypeLabel}
                        </Badge>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-beyanco-blue text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="text-sm font-bold text-beyanco-navy tracking-tight truncate">
                        {room.name}
                      </h4>
                      {room.dimensions && (
                        <p className="text-[10px] text-beyanco-muted">
                          Dimensions: {room.dimensions}
                        </p>
                      )}
                      <p className="text-[11px] text-beyanco-slate pt-1">
                        {room.designCount > 0 ? `${room.designCount} staged variations` : "Ready to stage"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Projects
              </Button>

              <Button
                variant="primary"
                size="md"
                disabled={!selectedRoomId}
                onClick={() => {
                  if (activeRoom?.originalImageUrl) {
                    setUploadedImageUrl(activeRoom.originalImageUrl);
                  }
                  setCurrentStep(3);
                }}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Room Photo
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: UPLOAD ROOM PHOTOGRAPH */}
        {!generatedResult && !isGenerating && currentStep === 3 && (
          <Card className="p-6 space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="blue" size="sm" className="text-[10px]">
                  {activeProject?.name}
                </Badge>
                <Badge variant="default" size="sm" className="text-[10px]">
                  {activeRoom?.name}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-beyanco-navy tracking-tight">
                Step 3: Room Photograph Reference
              </h3>
              <p className="text-xs text-beyanco-slate mt-0.5">
                Upload or confirm the original empty or outdated room photo. The original photograph is preserved intact.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left Column: Image Upload Dropzone */}
              <div>
                <ImageUploadZone
                  initialImageUrl={uploadedImageUrl}
                  onImageSelected={(url, file) => {
                    setUploadedImageUrl(url);
                    setImageFileName(file.name);
                    setImageFileSize(file.size);
                  }}
                />
              </div>

              {/* Right Column: Previews and Tips */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                  <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider block">
                    Real Estate Photography Best Practices
                  </span>
                  <ul className="text-xs text-beyanco-slate space-y-2 list-disc list-inside">
                    <li>Stand in the corner to capture maximum spatial depth and floor volume.</li>
                    <li>Ensure daylight streams naturally through windows without harsh glare.</li>
                    <li>Keep camera level (around chest/eye height) to maintain architectural vertical lines.</li>
                    <li>Supports JPG, PNG, WEBP up to 25MB.</li>
                  </ul>
                </div>

                {uploadedImageUrl && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="block font-semibold">Photograph Loaded Successfully</strong>
                      <span className="text-[11px] text-emerald-700">
                        Spatial perspective and boundary analysis ready for AI interior styling.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(2)}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Room Selection
              </Button>

              <Button
                variant="primary"
                size="md"
                disabled={!uploadedImageUrl}
                onClick={() => setCurrentStep(4)}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Design Preferences
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: DESIGN CONFIGURATION BEFORE GENERATION */}
        {!generatedResult && !isGenerating && currentStep === 4 && (
          <div className="space-y-6">
            {/* Top Toolbar: AI Smart Recommendation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-beyanco-blue text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-beyanco-navy uppercase tracking-wider">
                    AI Interior Recommendation
                  </h4>
                  <p className="text-[11px] text-beyanco-slate">
                    Auto-select styling, color scheme, and furniture suites optimized for {activeProject?.name} ({activeRoom?.name}).
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleApplyAIRecommendation}
                icon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Recommend for this Room
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT 1 COL: Uploaded Photograph & Room Context */}
              <div className="space-y-5">
                <Card className="p-4 space-y-3">
                  <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider block">
                    Original Room Reference
                  </span>
                  <div className="relative aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={uploadedImageUrl}
                      alt="Room Reference"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
                      {activeRoom?.name || roomType}
                    </div>
                  </div>

                  {/* Project Context Box */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-beyanco-muted">Project:</span>
                      <strong className="text-beyanco-navy">{activeProject?.name}</strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-beyanco-muted">Property Type:</span>
                      <span className="text-beyanco-slate capitalize">{activeProject?.propertyType?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-beyanco-muted">Target Buyer:</span>
                      <span className="text-beyanco-slate">{activeProject?.targetBuyer || "Standard"}</span>
                    </div>
                    {roomDimensions && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-beyanco-muted">Dimensions:</span>
                        <span className="text-beyanco-slate">{roomDimensions}</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Architectural & Structural Safeguards */}
                <Card className="p-4 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-beyanco-blue" />
                    <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider">
                      Architectural Safeguards
                    </span>
                  </div>
                  <p className="text-[11px] text-beyanco-slate">
                    Control which structural boundaries are preserved by the AI generator:
                  </p>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preserveFlooring}
                        onChange={(e) => setPreserveFlooring(e.target.checked)}
                        className="rounded text-beyanco-blue focus:ring-beyanco-blue"
                      />
                      <span className="text-beyanco-navy font-medium">Preserve Original Flooring</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preserveWallsWindows}
                        onChange={(e) => setPreserveWallsWindows(e.target.checked)}
                        className="rounded text-beyanco-blue focus:ring-beyanco-blue"
                      />
                      <span className="text-beyanco-navy font-medium">Preserve Walls, Windows & Ceiling</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preserveDoors}
                        onChange={(e) => setPreserveDoors(e.target.checked)}
                        className="rounded text-beyanco-blue focus:ring-beyanco-blue"
                      />
                      <span className="text-beyanco-navy font-medium">Preserve Doors & Entryways</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preserveLighting}
                        onChange={(e) => setPreserveLighting(e.target.checked)}
                        className="rounded text-beyanco-blue focus:ring-beyanco-blue"
                      />
                      <span className="text-beyanco-navy font-medium">Preserve Built-in Light Fixtures</span>
                    </label>
                  </div>
                </Card>
              </div>

              {/* RIGHT 2 COLS: Comprehensive Design Inputs */}
              <div className="lg:col-span-2 space-y-5">
                {/* Style Selection */}
                <Card className="p-5 space-y-3">
                  <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider block">
                    B. Interior Design Style
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
                    {STYLE_OPTIONS.map((style) => {
                      const isSelected = selectedStyle === style.id;
                      return (
                        <div
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? "bg-blue-50/70 border-beyanco-blue ring-1 ring-beyanco-blue shadow-2xs"
                              : "bg-slate-50 border-beyanco-border hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-beyanco-navy truncate">
                              {style.label}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-beyanco-blue" />}
                          </div>
                          <span className="text-[10px] text-beyanco-muted line-clamp-2 mt-1">
                            {style.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Furniture Requirements for this Room Type */}
                <Card className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider block">
                      C. Required Furniture Elements ({roomType.replace('_', ' ')})
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedFurniture(ROOM_FURNITURE_SETS[roomType] || [])}
                      className="text-[11px] font-semibold text-beyanco-blue hover:underline"
                    >
                      Select All
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(ROOM_FURNITURE_SETS[roomType] || ROOM_FURNITURE_SETS.living_room).map((item) => {
                      const isSelected = selectedFurniture.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleFurniture(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-beyanco-navy text-white border-beyanco-navy shadow-xs"
                              : "bg-slate-50 text-beyanco-slate border-beyanco-border hover:bg-slate-100"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </Card>

                {/* Color Scheme & Materials */}
                <Card className="p-5 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider block mb-2">
                      D. Color Palette & Finishes
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {COLOR_PALETTE_OPTIONS.map((cp) => (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => setColorScheme(cp.label)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                            colorScheme === cp.label
                              ? "bg-beyanco-paleBlue border-beyanco-blue text-beyanco-blue ring-1 ring-beyanco-blue"
                              : "bg-slate-50 border-beyanco-border text-beyanco-navy hover:bg-slate-100"
                          }`}
                        >
                          {cp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-beyanco-muted block mb-1">
                      Preferred Material Accents
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {MATERIAL_OPTIONS.map((mat) => {
                        const isSelected = selectedMaterials.includes(mat);
                        return (
                          <button
                            key={mat}
                            type="button"
                            onClick={() => toggleMaterial(mat)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                              isSelected
                                ? "bg-beyanco-blue text-white border-beyanco-blue"
                                : "bg-slate-50 text-beyanco-slate border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {mat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                {/* Design Intensity */}
                <Card className="p-5 space-y-3">
                  <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider block">
                    F. Design Intensity Level
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "light",
                        label: "Light Refinement",
                        desc: "Decorative accessories, soft textiles, artwork, and subtle ambient lighting.",
                      },
                      {
                        id: "complete",
                        label: "Complete Interior Design",
                        desc: "Full coordinated furniture suite, area rug, lighting plan, and balanced spatial zoning.",
                      },
                      {
                        id: "premium",
                        label: "Premium Transformation",
                        desc: "Couture luxury finishes, bespoke millwork silhouettes, statement lighting, and European furnishings.",
                      },
                    ].map((lvl) => {
                      const isSelected = designIntensity === lvl.id;
                      return (
                        <div
                          key={lvl.id}
                          onClick={() => setDesignIntensity(lvl.id as any)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-beyanco-paleBlue border-beyanco-blue ring-1 ring-beyanco-blue"
                              : "bg-slate-50 border-beyanco-border hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-beyanco-navy">
                              {lvl.label}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-beyanco-blue" />}
                          </div>
                          <p className="text-[10px] text-beyanco-slate leading-relaxed">
                            {lvl.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* User Custom Direction Input */}
                <Card className="p-5 space-y-2">
                  <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider block">
                    G. Describe how you want this room to look
                  </span>
                  <textarea
                    rows={3}
                    placeholder="e.g. Create a premium contemporary living room with a warm neutral palette, an elegant L-shaped sofa, natural walnut furniture, soft layered lighting and subtle luxury decor. Preserve the original windows, walls and flooring. Keep the room spacious and realistic."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(3)}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Photograph
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(5)}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Review & Generate
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & GENERATE */}
        {!generatedResult && !isGenerating && currentStep === 5 && (
          <Card className="p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-beyanco-navy tracking-tight">
                Step 5: Review & Generate Interior Design
              </h3>
              <p className="text-xs text-beyanco-slate mt-0.5">
                Verify all property context, room geometry, furniture suites, and architectural constraints before launching inference.
              </p>
            </div>

            {generationError && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-800">
                {generationError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Photograph and Room */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider block">
                  Original Photograph
                </span>
                <div className="relative aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src={uploadedImageUrl}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="blue" size="sm" className="text-[10px]">
                      {activeProject?.name}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded backdrop-blur">
                    {activeRoom?.name || roomType}
                  </div>
                </div>
              </div>

              {/* Right Column: Staging Configuration Summary */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider block border-b border-slate-200 pb-2">
                  Design Specifications
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-beyanco-muted uppercase font-bold block">Style</span>
                    <strong className="text-beyanco-navy capitalize">{selectedStyle.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-beyanco-muted uppercase font-bold block">Intensity</span>
                    <span className="text-beyanco-slate capitalize">{designIntensity} Refinement</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-beyanco-muted uppercase font-bold block">Palette</span>
                    <span className="text-beyanco-slate">{colorScheme}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-beyanco-muted uppercase font-bold block">Specification Tier</span>
                    <span className="text-beyanco-slate capitalize">{budgetLevel}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2">
                  <span className="text-[10px] text-beyanco-muted uppercase font-bold block mb-1">
                    Selected Furnishings ({selectedFurniture.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedFurniture.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-beyanco-navy text-[11px]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {userPrompt && (
                  <div className="border-t border-slate-200 pt-2">
                    <span className="text-[10px] text-beyanco-muted uppercase font-bold block mb-0.5">
                      Custom Instructions
                    </span>
                    <p className="text-[11px] text-beyanco-slate italic">
                      "{userPrompt}"
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-xs">
                  <span className="text-beyanco-slate">Estimated Credit Cost:</span>
                  <span className="font-bold text-beyanco-blue flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    {creditCost} Credits
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(4)}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Preferences
              </Button>

              <Button
                variant="primary"
                size="lg"
                onClick={handleStartGeneration}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Generate Interior Design
              </Button>
            </div>
          </Card>
        )}

        {/* RESULTS SCREEN AFTER GENERATION */}
        {generatedResult && (
          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="blue" size="sm" className="text-[10px]">
                      {generatedResult.projectName || activeProject?.name}
                    </Badge>
                    <Badge variant="default" size="sm" className="text-[10px]">
                      {generatedResult.roomName || activeRoom?.name}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-beyanco-navy tracking-tight">
                    Interior Design Staged Successfully
                  </h3>
                  <p className="text-xs text-beyanco-slate mt-0.5">
                    Interactive Before & After vertical slider showing spatial transformation.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generatedResult.outputImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={`beyanco_staged_${generatedResult.id}.jpg`}
                  >
                    <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                      Download 4K
                    </Button>
                  </a>
                  <Link href={`/design/${generatedResult.id}/edit`}>
                    <Button variant="primary" size="sm" icon={<Layers className="w-3.5 h-3.5" />}>
                      Open Furniture Editor
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Before & After Interactive Slider */}
              <div className="max-w-4xl mx-auto">
                <BeforeAfterSlider
                  beforeImage={generatedResult.originalImageUrl}
                  afterImage={generatedResult.outputImageUrl}
                  beforeLabel="Original Empty Space"
                  afterLabel={`${generatedResult.style.replace('_', ' ').toUpperCase()} Staged`}
                  aspectRatio="aspect-[16/10]"
                />
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Link href={`/projects/${generatedResult.projectId}`}>
                    <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                      Return to Project
                    </Button>
                  </Link>
                  <Link href="/gallery">
                    <Button variant="ghost" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>
                      View in My Designs
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/comparison?id=${generatedResult.id}`}>
                    <Button variant="secondary" size="sm" icon={<ChevronsLeftRight className="w-3.5 h-3.5" />}>
                      Compare Studio
                    </Button>
                  </Link>
                  <Link href={`/refine?id=${generatedResult.id}`}>
                    <Button variant="secondary" size="sm" icon={<Wand2 className="w-3.5 h-3.5" />}>
                      AI Refinement
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setGeneratedResult(null);
                      setCurrentStep(4);
                    }}
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Generate Another Variation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function NewStagingPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout title="Design Workspace" subtitle="Loading workspace...">
          <div className="p-12 text-center text-xs text-beyanco-slate">
            Initializing project workspace...
          </div>
        </DashboardLayout>
      }
    >
      <DesignWorkspaceContent />
    </Suspense>
  );
}
