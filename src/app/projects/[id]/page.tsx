"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { storage } from "@/lib/storage";
import { Project, ProjectRoom, RoomType, Generation } from "@/types";
import { formatDate } from "@/lib/utils";
import { ROOM_TYPE_OPTIONS, STYLE_OPTIONS } from "@/lib/sample-data";
import {
  FolderKanban,
  Building2,
  Calendar,
  Sparkles,
  Images,
  Plus,
  Upload,
  Edit,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Layers,
  MapPin,
  CheckCircle2,
  Clock,
  Home,
  Check,
  ChevronRight,
} from "lucide-react";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<ProjectRoom | null>(null);

  // New / Edit Room form state
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("living_room");
  const [dimensions, setDimensions] = useState("");
  const [ceilingHeight, setCeilingHeight] = useState("");
  const [intendedFunctionality, setIntendedFunctionality] = useState("");
  const [roomImageUrl, setRoomImageUrl] = useState("");

  const refreshProject = useCallback(() => {
    if (!projectId) return;
    const proj = storage.getProjectById(projectId);
    if (proj) {
      setProject(proj);
      const gens = storage.getGenerations().filter((g) => g.projectId === projectId);
      setGenerations(gens);
    }
  }, [projectId]);

  useEffect(() => {
    refreshProject();
    const handleSync = () => refreshProject();
    window.addEventListener("beyanco-storage-sync", handleSync);
    return () => window.removeEventListener("beyanco-storage-sync", handleSync);
  }, [refreshProject]);

  const handleOpenAddRoom = () => {
    setEditingRoom(null);
    setRoomName("");
    setRoomType("living_room");
    setDimensions("");
    setCeilingHeight("");
    setIntendedFunctionality("");
    setRoomImageUrl("");
    setIsAddRoomModalOpen(true);
  };

  const handleOpenEditRoom = (room: ProjectRoom) => {
    setEditingRoom(room);
    setRoomName(room.name);
    setRoomType(room.type);
    setDimensions(room.dimensions || "");
    setCeilingHeight(room.ceilingHeight || "");
    setIntendedFunctionality(room.intendedFunctionality || "");
    setRoomImageUrl(room.originalImageUrl || "");
    setIsAddRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !project) return;

    if (editingRoom) {
      // Update room
      const updatedRoom: ProjectRoom = {
        ...editingRoom,
        name: roomName.trim(),
        type: roomType,
        dimensions: dimensions.trim(),
        ceilingHeight: ceilingHeight.trim(),
        intendedFunctionality: intendedFunctionality.trim(),
        originalImageUrl: roomImageUrl.trim() || editingRoom.originalImageUrl,
        status: (roomImageUrl.trim() || editingRoom.originalImageUrl) ? (editingRoom.designCount > 0 ? "staged" : "in_progress") : "empty",
        updatedAt: new Date().toISOString(),
      };
      storage.updateRoomInProject(project.id, updatedRoom);
    } else {
      // Add room
      storage.addRoomToProject(project.id, {
        name: roomName.trim(),
        type: roomType,
        dimensions: dimensions.trim(),
        ceilingHeight: ceilingHeight.trim(),
        intendedFunctionality: intendedFunctionality.trim(),
        originalImageUrl: roomImageUrl.trim() || undefined,
        status: roomImageUrl.trim() ? "in_progress" : "empty",
      });
    }

    setIsAddRoomModalOpen(false);
    refreshProject();
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm("Are you sure you want to remove this room from the project?")) {
      storage.deleteRoomFromProject(project!.id, roomId);
      refreshProject();
    }
  };

  // Image Upload handler for a room
  const handleRoomImageUpload = (roomId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const room = project.rooms?.find((r) => r.id === roomId);
      if (room) {
        room.originalImageUrl = dataUrl;
        room.status = room.designCount > 0 ? "staged" : "in_progress";
        room.updatedAt = new Date().toISOString();
        storage.updateRoomInProject(project.id, room);
        refreshProject();
      }
    };
    reader.readAsDataURL(file);
  };

  if (!project) {
    return (
      <DashboardLayout title="Property Project" subtitle="Loading project details...">
        <div className="p-12 text-center">
          <p className="text-sm text-beyanco-slate mb-4">Project not found or loading...</p>
          <Link href="/projects">
            <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Projects
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const roomsList = project.rooms || [];

  return (
    <DashboardLayout
      title={project.name}
      subtitle={`Property workspace in ${project.city || project.location || "Central Location"}`}
    >
      <div className="space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-beyanco-muted">
          <Link href="/projects" className="hover:text-beyanco-navy transition-colors">
            Projects
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-beyanco-navy font-semibold truncate">{project.name}</span>
        </div>

        {/* Project Overview Hero Card */}
        <div className="bg-white rounded-3xl border border-beyanco-border p-6 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="blue" size="sm" className="uppercase font-bold text-[10px]">
                  {project.propertyType?.replace("_", " ")}
                </Badge>
                {project.purpose && (
                  <Badge variant="default" size="sm" className="bg-slate-100 text-slate-700 capitalize text-[10px]">
                    Purpose: {project.purpose.replace("_", " ")}
                  </Badge>
                )}
                {project.condition && (
                  <Badge variant="default" size="sm" className="bg-slate-100 text-slate-700 capitalize text-[10px]">
                    Condition: {project.condition.replace("_", " ")}
                  </Badge>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-beyanco-navy tracking-tight">
                  {project.propertyName || project.name}
                </h1>
                <p className="text-xs text-beyanco-slate flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-beyanco-blue shrink-0" />
                  <span>{project.address || project.location || "Location unassigned"}</span>
                </p>
              </div>

              {project.description && (
                <p className="text-xs text-beyanco-slate leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {project.description}
                </p>
              )}

              {/* Metric stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-beyanco-muted uppercase font-bold block">Total Area</span>
                  <span className="text-sm font-bold text-beyanco-navy">
                    {project.totalArea ? `${project.totalArea} ${project.areaUnit || 'sq.ft'}` : "Custom Layout"}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-beyanco-muted uppercase font-bold block">Rooms</span>
                  <span className="text-sm font-bold text-beyanco-navy">
                    {roomsList.length} Spaces
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-beyanco-muted uppercase font-bold block">Staged Designs</span>
                  <span className="text-sm font-bold text-beyanco-blue">
                    {project.designCount || generations.length || 0} Generated
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-beyanco-muted uppercase font-bold block">Created</span>
                  <span className="text-xs font-semibold text-beyanco-navy truncate block">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>

              {/* Design preferences tags */}
              {project.designPreferences && (
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-beyanco-muted font-bold text-[11px] uppercase">Design Direction:</span>
                  {project.designPreferences.preferredStyle && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-beyanco-blue font-semibold">
                      Style: {project.designPreferences.preferredStyle.replace("_", " ")}
                    </span>
                  )}
                  {project.designPreferences.furnitureBudget && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium capitalize">
                      Budget: {project.designPreferences.furnitureBudget.replace("_", " ")}
                    </span>
                  )}
                  {project.designPreferences.colorPreferences && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                      Palette: {project.designPreferences.colorPreferences}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right 1 Col: Quick Actions Card */}
            <div className="flex flex-col justify-between bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70">
              <div className="space-y-3">
                <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider block">
                  Project Actions
                </span>
                <p className="text-xs text-beyanco-slate leading-relaxed">
                  Start an AI interior staging session for this property or manage room photographs.
                </p>
              </div>

              <div className="space-y-2.5 pt-4">
                <Link href={`/staging/new?projectId=${project.id}`} className="block">
                  <Button variant="primary" size="md" className="w-full justify-center" icon={<Sparkles className="w-4 h-4" />}>
                    Design Room in this Property
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleOpenAddRoom}
                  className="w-full justify-center"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Room Space
                </Button>

                {generations.length > 0 && (
                  <Link href={`/gallery?project=${project.id}`} className="block">
                    <Button variant="ghost" size="sm" className="w-full justify-center text-beyanco-slate" icon={<Images className="w-3.5 h-3.5" />}>
                      View {generations.length} Staged Interiors
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Room Management Section */}
        <div id="rooms" className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-beyanco-navy tracking-tight">
                Property Rooms & Spaces ({roomsList.length})
              </h2>
              <p className="text-xs text-beyanco-slate">
                Upload room photographs, configure individual specifications, and run AI staging.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenAddRoom}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Room
            </Button>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsList.map((room) => {
              const roomTypeLabel = ROOM_TYPE_OPTIONS.find((rt) => rt.id === room.type)?.label || room.type;
              return (
                <Card
                  key={room.id}
                  hoverEffect
                  className="p-0 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Room Photograph Container */}
                    <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                      {room.originalImageUrl ? (
                        <img
                          src={room.originalImageUrl}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-800">
                          <Building2 className="w-8 h-8 text-slate-500 mb-2" />
                          <span className="text-xs font-semibold text-slate-300">
                            No photograph uploaded
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            Upload an original empty room image to stage
                          </span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        {room.status === "staged" ? (
                          <Badge variant="blue" size="sm" className="bg-emerald-600 text-white font-bold text-[10px] shadow-xs">
                            Staged ({room.designCount} designs)
                          </Badge>
                        ) : room.status === "in_progress" ? (
                          <Badge variant="blue" size="sm" className="bg-blue-600 text-white font-bold text-[10px] shadow-xs">
                            Image Ready
                          </Badge>
                        ) : (
                          <Badge variant="default" size="sm" className="bg-white/90 text-slate-700 font-bold text-[10px] shadow-xs">
                            Empty Space
                          </Badge>
                        )}
                      </div>

                      {/* Upload Photo Overlay Button */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <label
                          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-beyanco-navy hover:bg-white shadow-xs transition-colors cursor-pointer"
                          title="Upload / Replace Room Image"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleRoomImageUpload(room.id, e)}
                          />
                        </label>
                      </div>

                      {/* Bottom Chip */}
                      <div className="absolute bottom-3 left-3 text-white text-[10px] font-medium bg-black/60 backdrop-blur px-2 py-0.5 rounded-md">
                        {roomTypeLabel}
                      </div>
                    </div>

                    {/* Room Metadata */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-beyanco-navy">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditRoom(room)}
                            className="p-1 text-slate-400 hover:text-beyanco-blue transition-colors"
                            title="Edit Room Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete Room"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {room.dimensions && (
                        <p className="text-[11px] text-beyanco-slate">
                          Dimensions: <strong>{room.dimensions}</strong>
                          {room.ceilingHeight && ` • Ceiling: ${room.ceilingHeight}`}
                        </p>
                      )}

                      {room.intendedFunctionality && (
                        <p className="text-[11px] text-beyanco-muted line-clamp-2">
                          {room.intendedFunctionality}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Room Card Footer Actions */}
                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <span className="text-[11px] text-beyanco-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(room.updatedAt || room.createdAt)}
                      </span>

                      <div className="flex items-center gap-2">
                        {room.designCount > 0 && (
                          <Link href={`/gallery?project=${project.id}&room=${room.id}`}>
                            <Button variant="ghost" size="sm" icon={<Images className="w-3 h-3" />}>
                              View ({room.designCount})
                            </Button>
                          </Link>
                        )}
                        <Link href={`/staging/new?projectId=${project.id}&roomId=${room.id}`}>
                          <Button variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                            Design Room
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add / Edit Room Modal */}
      <Modal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        title={editingRoom ? `Edit ${editingRoom.name}` : "Add Room to Property"}
        description="Specify room category, dimensions, and optional photo reference."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveRoom} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-beyanco-navy block mb-1">
              Room Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Waterfront Living Lounge, Master Retreat..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                Room Category *
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
              >
                {ROOM_TYPE_OPTIONS.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                Dimensions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 6.2m × 4.8m"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                Ceiling Height (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 3.2m / 10.5 ft"
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                Room Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://... or upload in room card"
                value={roomImageUrl}
                onChange={(e) => setRoomImageUrl(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-beyanco-navy block mb-1">
              Intended Functionality or Architectural Features
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Main social gathering zone with fireplace and sliding floor-to-ceiling balcony doors..."
              value={intendedFunctionality}
              onChange={(e) => setIntendedFunctionality(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddRoomModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              {editingRoom ? "Save Changes" : "Add Room"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
