"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { storage } from "@/lib/storage";
import {
  Project,
  PropertyType,
  ProjectPurpose,
  TargetAudience,
  PropertyCondition,
  InteriorStyle,
  RoomType,
  ProjectRoom,
} from "@/types";
import { formatDate } from "@/lib/utils";
import {
  STYLE_OPTIONS,
  ROOM_TYPE_OPTIONS,
  COLOR_PALETTE_OPTIONS,
  MATERIAL_OPTIONS,
} from "@/lib/sample-data";
import {
  FolderKanban,
  Plus,
  Building2,
  Calendar,
  Sparkles,
  Images,
  MoreVertical,
  Layers,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Trash2,
  Edit,
  ExternalLink,
  MapPin,
  Home,
  Sliders,
  Paintbrush,
  Maximize2,
  X,
} from "lucide-react";

const PROPERTY_TYPES: { id: PropertyType; label: string; desc: string }[] = [
  { id: "apartment", label: "Apartment", desc: "Multi-family residential unit" },
  { id: "independent_house", label: "Independent House", desc: "Single-family standalone property" },
  { id: "villa", label: "Villa / Estate", desc: "Luxury residence with private grounds" },
  { id: "studio", label: "Studio Apartment", desc: "Compact single-volume urban space" },
  { id: "penthouse", label: "Penthouse", desc: "Top-floor luxury architectural suite" },
  { id: "office", label: "Office", desc: "Commercial office or executive suite" },
  { id: "commercial", label: "Commercial Property", desc: "Retail, lobby, or hospitality venue" },
  { id: "other", label: "Other", desc: "Custom residential or commercial architecture" },
];

const PROJECT_PURPOSES: { id: ProjectPurpose; label: string }[] = [
  { id: "sell", label: "Sell the Property (MLS / Listing)" },
  { id: "rent", label: "Rent the Property (Long-Term)" },
  { id: "short_term_rental", label: "Short-Term Rental (Airbnb / Luxury Hospitality)" },
  { id: "personal_residence", label: "Personal Residence / Homeowner Staging" },
  { id: "interior_renovation", label: "Interior Renovation & Remodel Visualization" },
  { id: "commercial_presentation", label: "Commercial Pitch / Investor Presentation" },
  { id: "other", label: "Other Purpose" },
];

const TARGET_AUDIENCES: { id: TargetAudience; label: string }[] = [
  { id: "families", label: "Families with Children" },
  { id: "young_professionals", label: "Young Professionals & Executives" },
  { id: "luxury_buyers", label: "High-Net-Worth Luxury Buyers" },
  { id: "students", label: "Students / Academic Living" },
  { id: "business_clients", label: "Corporate Tenants & Business Clients" },
  { id: "general_audience", label: "General Real Estate Market" },
  { id: "not_sure", label: "Not Sure / Undecided" },
];

const PROPERTY_CONDITIONS: { id: PropertyCondition; label: string }[] = [
  { id: "completely_empty", label: "Completely Empty (Vacant Space)" },
  { id: "partially_furnished", label: "Partially Furnished (Some Key Furniture)" },
  { id: "fully_furnished", label: "Fully Furnished (Full Existing Set)" },
  { id: "outdated", label: "Old or Outdated Interiors (Requires Restyle)" },
  { id: "under_renovation", label: "Under Renovation (Bare Shell / Construction)" },
  { id: "newly_constructed", label: "Newly Constructed (Turnkey Fresh Finishes)" },
  { id: "other", label: "Other Condition" },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Wizard Step State (1 to 6)
  const [step, setStep] = useState<number>(1);

  // Step 1: Basic Property Info
  const [projectName, setProjectName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [city, setCity] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");

  // Step 2: Property Size and Rooms
  const [totalArea, setTotalArea] = useState<number | "">("");
  const [areaUnit, setAreaUnit] = useState<"sq.ft" | "sq.m">("sq.ft");
  const [floorsCount, setFloorsCount] = useState<number>(1);
  const [bedroomsCount, setBedroomsCount] = useState<number>(2);
  const [bathroomsCount, setBathroomsCount] = useState<number>(2);
  const [balconiesCount, setBalconiesCount] = useState<number>(1);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<RoomType[]>([
    "living_room",
    "master_bedroom",
    "dining_room",
    "kitchen",
  ]);
  const [customRoomInput, setCustomRoomInput] = useState<string>("");
  const [customRoomsList, setCustomRoomsList] = useState<string[]>([]);

  // Step 3: Purpose & Target Audience
  const [purpose, setPurpose] = useState<ProjectPurpose>("sell");
  const [targetAudience, setTargetAudience] = useState<TargetAudience>("young_professionals");

  // Step 4: Condition & Restrictions
  const [condition, setCondition] = useState<PropertyCondition>("completely_empty");
  const [preserveFixtures, setPreserveFixtures] = useState<boolean>(true);
  const [restrictions, setRestrictions] = useState<string>("");

  // Step 5: Design Preferences
  const [preferredStyle, setPreferredStyle] = useState<string>("contemporary");
  const [colorPreference, setColorPreference] = useState<string>("Warm neutrals & travertine");
  const [furnitureBudget, setFurnitureBudget] = useState<string>("premium");
  const [preferredMaterials, setPreferredMaterials] = useState<string[]>(["Solid White Oak", "Honed Roman Travertine"]);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");

  useEffect(() => {
    setProjects(storage.getProjects());
    const handleSync = () => setProjects(storage.getProjects());
    window.addEventListener("beyanco-storage-sync", handleSync);
    return () => window.removeEventListener("beyanco-storage-sync", handleSync);
  }, []);

  const handleAddCustomRoom = () => {
    if (customRoomInput.trim() && !customRoomsList.includes(customRoomInput.trim())) {
      setCustomRoomsList([...customRoomsList, customRoomInput.trim()]);
      setCustomRoomInput("");
    }
  };

  const toggleRoomType = (rt: RoomType) => {
    if (selectedRoomTypes.includes(rt)) {
      setSelectedRoomTypes(selectedRoomTypes.filter((r) => r !== rt));
    } else {
      setSelectedRoomTypes([...selectedRoomTypes, rt]);
    }
  };

  const toggleMaterial = (mat: string) => {
    if (preferredMaterials.includes(mat)) {
      setPreferredMaterials(preferredMaterials.filter((m) => m !== mat));
    } else {
      setPreferredMaterials([...preferredMaterials, mat]);
    }
  };

  const handleCreateProject = () => {
    if (!projectName.trim()) return;

    const projectId = `proj_${Date.now()}`;
    const now = new Date().toISOString();

    // Construct initial rooms from selections
    const rooms: ProjectRoom[] = [];
    selectedRoomTypes.forEach((rt, idx) => {
      const option = ROOM_TYPE_OPTIONS.find((r) => r.id === rt);
      rooms.push({
        id: `room_${projectId}_${idx + 1}`,
        projectId,
        name: option ? option.label : "Room",
        type: rt,
        designCount: 0,
        status: "empty",
        createdAt: now,
        updatedAt: now,
      });
    });

    customRoomsList.forEach((cr, idx) => {
      rooms.push({
        id: `room_${projectId}_c_${idx + 1}`,
        projectId,
        name: cr,
        type: "other",
        designCount: 0,
        status: "empty",
        createdAt: now,
        updatedAt: now,
      });
    });

    const newProject: Project = {
      id: projectId,
      organizationId: "org_beyanco_main",
      name: projectName.trim(),
      propertyName: propertyName.trim() || projectName.trim(),
      address: propertyLocation.trim() || `${city || "Metropolitan Area"}, ${neighbourhood || "Central"}`,
      location: propertyLocation.trim() || city.trim(),
      city: city.trim(),
      neighbourhood: neighbourhood.trim(),
      propertyType,
      description: `${propertyType.replace('_', ' ')} staged for ${purpose}. ${restrictions}`,
      targetBuyer: TARGET_AUDIENCES.find((t) => t.id === targetAudience)?.label || "Market audience",
      status: "active",
      thumbnailUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
      roomCount: rooms.length,
      designCount: 0,
      totalArea: typeof totalArea === "number" ? totalArea : undefined,
      areaUnit,
      floorsCount,
      bedroomsCount,
      bathroomsCount,
      balconiesCount,
      purpose,
      targetAudience,
      condition,
      preserveFixtures,
      restrictions,
      designPreferences: {
        preferredStyle,
        colorPreferences: colorPreference,
        furnitureBudget,
        preferredMaterials: preferredMaterials.join(", "),
        specialInstructions,
      },
      rooms,
      createdAt: now,
      updatedAt: now,
    };

    storage.saveProject(newProject);
    setProjects(storage.getProjects());
    setIsWizardOpen(false);
    resetWizard();

    // Navigate to dedicated Project Details page
    router.push(`/projects/${projectId}`);
  };

  const resetWizard = () => {
    setStep(1);
    setProjectName("");
    setPropertyName("");
    setPropertyLocation("");
    setCity("");
    setNeighbourhood("");
    setPropertyType("apartment");
    setTotalArea("");
    setSelectedRoomTypes(["living_room", "master_bedroom", "dining_room", "kitchen"]);
    setCustomRoomsList([]);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this property project? All associated room staging records will be removed.")) {
      storage.deleteProject(id);
      setProjects(storage.getProjects());
      setActiveDropdownId(null);
    }
  };

  return (
    <DashboardLayout
      title="Property Projects"
      subtitle="Organize properties, rooms, architectural photography, and AI interior designs."
    >
      <div className="space-y-6">
        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-beyanco-border shadow-card">
          <div>
            <h2 className="text-sm font-bold text-beyanco-navy uppercase tracking-wider">
              Project Portfolio Workspace
            </h2>
            <p className="text-xs text-beyanco-slate mt-0.5">
              Managing <strong>{projects.length}</strong> active property portfolios and spatial staging collections.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              resetWizard();
              setIsWizardOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <Card
              key={proj.id}
              hoverEffect
              className="p-0 overflow-hidden flex flex-col justify-between group relative"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={proj.thumbnailUrl || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop"}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                  {/* Property Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" size="sm" className="bg-white/95 backdrop-blur font-bold uppercase text-[10px] text-beyanco-navy shadow-xs">
                      {proj.propertyType?.replace("_", " ")}
                    </Badge>
                  </div>

                  {/* Dropdown Menu Trigger */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === proj.id ? null : proj.id);
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-beyanco-navy hover:bg-white shadow-xs transition-colors"
                      title="Project Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Panel */}
                    {activeDropdownId === proj.id && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-beyanco-border py-1.5 z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/projects/${proj.id}`}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-beyanco-navy hover:bg-slate-50 transition-colors"
                          onClick={() => setActiveDropdownId(null)}
                        >
                          <Building2 className="w-3.5 h-3.5 text-beyanco-blue" />
                          Open Project
                        </Link>
                        <Link
                          href={`/staging/new?projectId=${proj.id}`}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-beyanco-navy hover:bg-slate-50 transition-colors"
                          onClick={() => setActiveDropdownId(null)}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-beyanco-blue" />
                          Design
                        </Link>
                        <Link
                          href={`/projects/${proj.id}#rooms`}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-beyanco-navy hover:bg-slate-50 transition-colors"
                          onClick={() => setActiveDropdownId(null)}
                        >
                          <Layers className="w-3.5 h-3.5 text-beyanco-slate" />
                          Manage Rooms
                        </Link>
                        <Link
                          href={`/gallery?project=${proj.id}`}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-beyanco-navy hover:bg-slate-50 transition-colors"
                          onClick={() => setActiveDropdownId(null)}
                        >
                          <Images className="w-3.5 h-3.5 text-beyanco-slate" />
                          View Staged Designs
                        </Link>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={(e) => handleDeleteProject(proj.id, e)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          Delete Project
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Room count chip */}
                  <div className="absolute bottom-3 left-3 text-white text-[11px] font-medium flex items-center gap-1.5">
                    <span className="bg-black/60 backdrop-blur px-2 py-0.5 rounded-md">
                      {proj.rooms?.length || proj.roomCount || 1} Rooms
                    </span>
                    <span className="bg-black/60 backdrop-blur px-2 py-0.5 rounded-md">
                      {proj.designCount || 0} Staged
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-2.5">
                  <Link href={`/projects/${proj.id}`} className="block group/link">
                    <h3 className="text-base font-bold text-beyanco-navy tracking-tight group-hover/link:text-beyanco-blue transition-colors">
                      {proj.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-beyanco-slate flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-beyanco-muted shrink-0" />
                    <span className="truncate">{proj.address || proj.location || "Location unassigned"}</span>
                  </p>

                  {proj.designPreferences?.preferredStyle && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-beyanco-muted uppercase">Style:</span>
                      <Badge variant="blue" size="sm" className="capitalize text-[10px]">
                        {proj.designPreferences.preferredStyle.replace("_", " ")}
                      </Badge>
                    </div>
                  )}

                  {proj.targetBuyer && (
                    <p className="text-[11px] text-beyanco-muted truncate">
                      Audience: {proj.targetBuyer}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <Link
                    href={`/projects/${proj.id}`}
                    className="text-beyanco-slate hover:text-beyanco-navy font-medium flex items-center gap-1"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <Link href={`/staging/new?projectId=${proj.id}`}>
                    <Button variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                      Design
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Multi-Step Project Questionnaire Modal */}
      <Modal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title="Create Property Project"
        description="Comprehensive property questionnaire to inform AI interior design intelligence."
        maxWidth="2xl"
      >
        <div className="space-y-6">
          {/* Wizard Step Progress Tracker */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            {[
              { num: 1, label: "Basic Info" },
              { num: 2, label: "Size & Rooms" },
              { num: 3, label: "Purpose" },
              { num: 4, label: "Condition" },
              { num: 5, label: "Preferences" },
              { num: 6, label: "Review" },
            ].map((s) => (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
                className={`flex items-center gap-2 cursor-pointer ${
                  step === s.num
                    ? "text-beyanco-blue font-bold"
                    : s.num < step
                    ? "text-emerald-600 font-semibold"
                    : "text-slate-400 font-medium"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? "bg-beyanco-blue text-white shadow-xs"
                      : s.num < step
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {s.num < step ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className="text-xs hidden md:inline">{s.label}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: BASIC PROPERTY INFORMATION */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-beyanco-navy uppercase tracking-wider">
                Step 1: Basic Property Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Skyline Residences — Penthouse Suite"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                    Property Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Waterfront Residences"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                    Neighbourhood / Area (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marina District"
                    value={neighbourhood}
                    onChange={(e) => setNeighbourhood(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                    General Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 742 Evergreen Promenade"
                    value={propertyLocation}
                    onChange={(e) => setPropertyLocation(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-2">
                  Property Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PROPERTY_TYPES.map((pt) => (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => setPropertyType(pt.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        propertyType === pt.id
                          ? "bg-beyanco-paleBlue border-beyanco-blue ring-1 ring-beyanco-blue"
                          : "bg-slate-50 border-beyanco-border hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs font-bold text-beyanco-navy block">
                        {pt.label}
                      </span>
                      <span className="text-[10px] text-beyanco-muted block mt-0.5 truncate">
                        {pt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROPERTY SIZE AND ROOMS */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-beyanco-navy uppercase tracking-wider">
                Step 2: Property Size and Room Inventory
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                    Approximate Total Area
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="e.g. 2400"
                      value={totalArea}
                      onChange={(e) => setTotalArea(e.target.value ? Number(e.target.value) : "")}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                    />
                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value as any)}
                      className="p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy font-semibold focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                    >
                      <option value="sq.ft">sq. ft.</option>
                      <option value="sq.m">sq. m.</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={floorsCount}
                    onChange={(e) => setFloorsCount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={bedroomsCount}
                    onChange={(e) => setBedroomsCount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={bathroomsCount}
                    onChange={(e) => setBathroomsCount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                    Balconies / Terraces
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={balconiesCount}
                    onChange={(e) => setBalconiesCount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-2">
                  Select Room Types to Include in this Project
                </label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_TYPE_OPTIONS.map((rt) => {
                    const isSelected = selectedRoomTypes.includes(rt.id);
                    return (
                      <button
                        key={rt.id}
                        type="button"
                        onClick={() => toggleRoomType(rt.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-beyanco-navy text-white border-beyanco-navy shadow-2xs"
                            : "bg-slate-50 text-beyanco-slate border-beyanco-border hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        {rt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                  Add Custom Named Rooms
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Wine Cellar, Rooftop Deck, Nursery..."
                    value={customRoomInput}
                    onChange={(e) => setCustomRoomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomRoom();
                      }
                    }}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddCustomRoom}>
                    Add
                  </Button>
                </div>
                {customRoomsList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {customRoomsList.map((cr, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-beyanco-blue text-xs font-medium flex items-center gap-1"
                      >
                        {cr}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() => setCustomRoomsList(customRoomsList.filter((_, i) => i !== idx))}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PROJECT PURPOSE */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-beyanco-navy uppercase tracking-wider">
                Step 3: Project Purpose & Target Audience
              </h3>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-2">
                  How will this property project be used? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PROJECT_PURPOSES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPurpose(p.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        purpose === p.id
                          ? "bg-beyanco-paleBlue border-beyanco-blue text-beyanco-blue ring-1 ring-beyanco-blue"
                          : "bg-slate-50 border-beyanco-border text-beyanco-navy hover:bg-slate-100"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-2">
                  Target Audience Demographic *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TARGET_AUDIENCES.map((ta) => (
                    <button
                      key={ta.id}
                      type="button"
                      onClick={() => setTargetAudience(ta.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        targetAudience === ta.id
                          ? "bg-beyanco-paleBlue border-beyanco-blue text-beyanco-blue ring-1 ring-beyanco-blue"
                          : "bg-slate-50 border-beyanco-border text-beyanco-navy hover:bg-slate-100"
                      }`}
                    >
                      {ta.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PROPERTY CONDITION */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-beyanco-navy uppercase tracking-wider">
                Step 4: Existing Condition & Architectural Safeguards
              </h3>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-2">
                  Current Property Condition *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PROPERTY_CONDITIONS.map((cond) => (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => setCondition(cond.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        condition === cond.id
                          ? "bg-beyanco-paleBlue border-beyanco-blue text-beyanco-blue ring-1 ring-beyanco-blue"
                          : "bg-slate-50 border-beyanco-border text-beyanco-navy hover:bg-slate-100"
                      }`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-beyanco-navy block">
                      Preserve Permanent Architectural Fixtures
                    </span>
                    <span className="text-[11px] text-beyanco-slate block">
                      Instruct AI to lock windows, baseboards, doors, ceilings, and permanent heating/cooling fixtures.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preserveFixtures}
                    onChange={(e) => setPreserveFixtures(e.target.checked)}
                    className="w-4 h-4 text-beyanco-blue rounded border-slate-300 focus:ring-beyanco-blue"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                  Special Property Restrictions or Architectural Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Do not stage over the floor heating grates; keep existing dark hardwood floors untouched..."
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                />
              </div>
            </div>
          )}

          {/* STEP 5: DESIGN PREFERENCES */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-beyanco-navy uppercase tracking-wider">
                Step 5: Project-Level Design Preferences
              </h3>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-2">
                  Preferred Interior Architectural Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {STYLE_OPTIONS.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setPreferredStyle(style.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        preferredStyle === style.id
                          ? "bg-beyanco-paleBlue border-beyanco-blue ring-1 ring-beyanco-blue"
                          : "bg-slate-50 border-beyanco-border hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs font-bold text-beyanco-navy block truncate">
                        {style.label}
                      </span>
                      <span className="text-[10px] text-beyanco-muted block line-clamp-2 mt-0.5">
                        {style.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-2">
                  Color Preferences
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COLOR_PALETTE_OPTIONS.map((cp) => (
                    <button
                      key={cp.id}
                      type="button"
                      onClick={() => setColorPreference(cp.label)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        colorPreference === cp.label
                          ? "bg-beyanco-paleBlue border-beyanco-blue text-beyanco-blue"
                          : "bg-slate-50 border-beyanco-border text-beyanco-navy hover:bg-slate-100"
                      }`}
                    >
                      {cp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-2">
                  Furniture Budget Specification Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: "budget_friendly", label: "Budget-Friendly" },
                    { id: "mid_range", label: "Mid-Range" },
                    { id: "premium", label: "Premium" },
                    { id: "luxury", label: "Luxury" },
                    { id: "no_preference", label: "No Preference" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setFurnitureBudget(b.id)}
                      className={`p-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        furnitureBudget === b.id
                          ? "bg-beyanco-navy text-white border-beyanco-navy shadow-xs"
                          : "bg-slate-50 border-beyanco-border text-beyanco-navy hover:bg-slate-100"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                  Preferred Materials & Finishes
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MATERIAL_OPTIONS.map((mat) => {
                    const isSelected = preferredMaterials.includes(mat);
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

              <div>
                <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                  Special Instructions or Atmosphere Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Aim for calm, light-filled atmosphere with Scandinavian warmth and biophilic touches..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                />
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW AND CREATE */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-beyanco-navy uppercase tracking-wider">
                Step 6: Review & Finalize Project Setup
              </h3>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-beyanco-muted block text-[10px] uppercase font-semibold">Project Name</span>
                    <strong className="text-beyanco-navy text-sm">{projectName || "Untitled Project"}</strong>
                  </div>
                  <div>
                    <span className="text-beyanco-muted block text-[10px] uppercase font-semibold">Property Type</span>
                    <strong className="text-beyanco-navy capitalize">{propertyType.replace("_", " ")}</strong>
                  </div>
                  <div>
                    <span className="text-beyanco-muted block text-[10px] uppercase font-semibold">Location / City</span>
                    <span className="text-beyanco-slate">{city ? `${city}${neighbourhood ? `, ${neighbourhood}` : ""}` : "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-beyanco-muted block text-[10px] uppercase font-semibold">Area / Dimensions</span>
                    <span className="text-beyanco-slate">{totalArea ? `${totalArea} ${areaUnit}` : "Standard layout"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-beyanco-muted block text-[10px] uppercase font-semibold">Project Purpose</span>
                    <span className="text-beyanco-slate capitalize">{purpose.replace("_", " ")}</span>
                  </div>
                  <div>
                    <span className="text-beyanco-muted block text-[10px] uppercase font-semibold">Target Buyer</span>
                    <span className="text-beyanco-slate capitalize">{targetAudience.replace("_", " ")}</span>
                  </div>
                </div>

                <div className="pb-3 border-b border-slate-200">
                  <span className="text-beyanco-muted block text-[10px] uppercase font-semibold mb-1">Included Rooms ({selectedRoomTypes.length + customRoomsList.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRoomTypes.map((rt) => (
                      <span key={rt} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-beyanco-navy font-medium">
                        {ROOM_TYPE_OPTIONS.find((r) => r.id === rt)?.label || rt}
                      </span>
                    ))}
                    {customRoomsList.map((cr, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-beyanco-blue font-medium">
                        {cr}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-beyanco-muted block text-[10px] uppercase font-semibold">Design Theme</span>
                    <span className="text-beyanco-slate capitalize">{preferredStyle.replace("_", " ")}</span>
                  </div>
                  <div>
                    <span className="text-beyanco-muted block text-[10px] uppercase font-semibold">Palette & Materials</span>
                    <span className="text-beyanco-slate truncate block">{colorPreference}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(step - 1)}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsWizardOpen(false)}
              >
                Cancel
              </Button>
            )}

            {step < 6 ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={step === 1 && !projectName.trim()}
                onClick={() => setStep(step + 1)}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Step {step + 1}
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleCreateProject}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Create Project & Open Workspace
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
