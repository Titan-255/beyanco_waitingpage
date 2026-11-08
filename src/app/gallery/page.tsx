"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { storage } from "@/lib/storage";
import { Generation, RoomType, InteriorStyle, Project } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Sparkles,
  Heart,
  Download,
  Layers,
  Eye,
  Filter,
  Calendar,
  Building2,
  ExternalLink,
  MapPin,
} from "lucide-react";

function GalleryContent() {
  const searchParams = useSearchParams();
  const filterProjectParam = searchParams.get("project");
  const filterRoomParam = searchParams.get("room");

  const [generations, setGenerations] = useState<Generation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>("all");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [inspectGen, setInspectGen] = useState<Generation | null>(null);

  useEffect(() => {
    setGenerations(storage.getGenerations());
    setProjects(storage.getProjects());
    if (filterProjectParam) {
      setSelectedProjectFilter(filterProjectParam);
    }
    const handleSync = () => {
      setGenerations(storage.getGenerations());
      setProjects(storage.getProjects());
    };
    window.addEventListener("beyanco-storage-sync", handleSync);
    return () => window.removeEventListener("beyanco-storage-sync", handleSync);
  }, [filterProjectParam]);

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.toggleFavorite(id);
    setGenerations([...storage.getGenerations()]);
  };

  const filteredGenerations = generations.filter((g) => {
    const matchProject = selectedProjectFilter === "all" || g.projectId === selectedProjectFilter;
    const matchRoom = selectedFilter === "all" || g.roomType === selectedFilter;
    const matchSpecificRoom = !filterRoomParam || g.roomId === filterRoomParam;
    const matchFav = !favoritesOnly || g.isFavorite;
    return matchProject && matchRoom && matchSpecificRoom && matchFav;
  });

  return (
    <DashboardLayout
      title="My Designs & Staging Gallery"
      subtitle="Photorealistic architectural interiors staged for your real estate property portfolios."
    >
      <div className="space-y-6">
        {/* Filters and Controls */}
        <div className="bg-white p-4 rounded-2xl border border-beyanco-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Project Filter Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider">
                Project:
              </span>
              <select
                value={selectedProjectFilter}
                onChange={(e) => setSelectedProjectFilter(e.target.value)}
                className="p-1.5 text-xs bg-slate-50 border border-beyanco-border rounded-lg text-beyanco-navy font-semibold focus:outline-none focus:ring-1 focus:ring-beyanco-blue"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 border-l border-slate-200 pl-3">
              {[
                { id: "all", label: "All Spaces" },
                { id: "living_room", label: "Living Room" },
                { id: "bedroom", label: "Bedrooms" },
                { id: "dining_room", label: "Dining Area" },
                { id: "home_office", label: "Office" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedFilter === tab.id
                      ? "bg-beyanco-navy text-white shadow-xs"
                      : "bg-slate-50 text-beyanco-slate hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                favoritesOnly
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-white border-beyanco-border text-beyanco-slate hover:bg-slate-50"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? "fill-red-500 text-red-500" : ""}`} />
              Favorites Only
            </button>

            <Link href="/staging/new">
              <Button size="sm" variant="primary" icon={<Sparkles className="w-3.5 h-3.5" />}>
                Design Room
              </Button>
            </Link>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGenerations.map((gen) => {
            const projectMatch = projects.find((p) => p.id === gen.projectId);
            const projectName = gen.projectName || projectMatch?.name || "Property Project";
            const roomDisplayName = gen.roomName || gen.roomType.replace("_", " ");

            return (
              <div
                key={gen.id}
                onClick={() => setInspectGen(gen)}
                className="group bg-white border border-beyanco-border rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover transition-all cursor-pointer flex flex-col"
              >
                {/* Image Preview Container */}
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                  <img
                    src={gen.outputImageUrl}
                    alt={gen.roomType}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Top Left: Project and Room Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur px-2 py-0.5 rounded-md truncate max-w-[180px]">
                      {projectName}
                    </span>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => handleToggleFav(gen.id, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        gen.isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>

                  {/* Bottom Overlay Buttons */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-medium text-white bg-black/60 backdrop-blur px-2.5 py-1 rounded-md">
                      Click to Compare
                    </span>
                    <Link
                      href={`/design/${gen.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="px-3 py-1 text-xs font-bold rounded-lg bg-beyanco-blue text-white shadow-sm flex items-center gap-1.5 hover:bg-blue-600 transition-colors">
                        <Layers className="w-3.5 h-3.5" />
                        Edit Furniture
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Card Meta Footer */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-beyanco-navy capitalize truncate">
                        {roomDisplayName}
                      </h3>
                      {projectMatch && (
                        <Link
                          href={`/projects/${projectMatch.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-beyanco-blue hover:underline flex items-center gap-1"
                        >
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">{projectMatch.name}</span>
                        </Link>
                      )}
                    </div>

                    <Badge variant="blue" size="sm" className="shrink-0 capitalize">
                      {gen.style.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-beyanco-slate pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-beyanco-muted text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {formatDate(gen.createdAt)}
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={gen.outputImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        download={`staging_${gen.id}.jpg`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-beyanco-slate hover:text-beyanco-navy"
                        title="Download Image"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compare Modal */}
      {inspectGen && (
        <Modal
          isOpen={!!inspectGen}
          onClose={() => setInspectGen(null)}
          title={`Before & After Staging — ${(inspectGen.roomName || inspectGen.roomType).toUpperCase()}`}
          description={`Photorealistic transformation for ${inspectGen.projectName || 'Property'}.`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <BeforeAfterSlider
              beforeImage={inspectGen.originalImageUrl}
              afterImage={inspectGen.outputImageUrl}
              beforeLabel="Original Empty Room"
              afterLabel={`${inspectGen.style.replace('_', ' ').toUpperCase()} Staged`}
              aspectRatio="aspect-[16/10]"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-beyanco-slate">
                Model: {inspectGen.modelProvider} ({inspectGen.modelName})
              </span>
              <div className="flex items-center gap-2">
                <Link href={`/projects/${inspectGen.projectId}`}>
                  <Button variant="ghost" size="sm" icon={<Building2 className="w-3.5 h-3.5" />}>
                    View Project
                  </Button>
                </Link>
                <a
                  href={inspectGen.outputImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download="beyanco_staged.jpg"
                >
                  <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                    Download 4K
                  </Button>
                </a>
                <Link href={`/design/${inspectGen.id}/edit`}>
                  <Button variant="primary" size="sm" icon={<Layers className="w-3.5 h-3.5" />}>
                    Open in Furniture Editor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout title="My Designs Gallery" subtitle="Loading gallery...">
          <div className="p-12 text-center text-xs text-beyanco-slate">
            Loading staged designs...
          </div>
        </DashboardLayout>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}
