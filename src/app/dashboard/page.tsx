"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { storage } from "@/lib/storage";
import { Project, Generation } from "@/types";
import { formatCredits, formatDate } from "@/lib/utils";
import {
  Sparkles,
  Images,
  FolderKanban,
  Coins,
  ArrowRight,
  Eye,
  Download,
  Layers,
  Heart,
  Calendar,
  Building2,
  ExternalLink,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [credits, setCredits] = useState<number>(125);
  const [previewGen, setPreviewGen] = useState<Generation | null>(null);

  useEffect(() => {
    setProjects(storage.getProjects());
    setGenerations(storage.getGenerations());
    setCredits(storage.getCredits());
  }, []);

  const handleToggleFavorite = (genId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.toggleFavorite(genId);
    setGenerations([...storage.getGenerations()]);
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <DashboardLayout
      title={`${getGreeting()}, Tarun`}
      subtitle="Manage your real estate listings and craft photorealistic staging transformations."
    >
      <div className="space-y-8">
        {/* Top Hero Action Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-beyanco-navy via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-card">
          <div className="relative z-10 max-w-2xl space-y-3">
            <Badge variant="blue" size="sm" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
              AI Interior Engine v2.4 Active
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Ready to Stage a New Property?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Upload empty or cluttered room photographs and transform them into photorealistic, MLS-compliant staged interiors in under 60 seconds.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/staging/new">
                <Button
                  variant="primary"
                  size="md"
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Create New Staging
                </Button>
              </Link>
              <Link href="/design/gen_001/edit">
                <Button
                  variant="secondary"
                  size="md"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  icon={<Layers className="w-4 h-4" />}
                >
                  Launch Furniture Editor
                </Button>
              </Link>
            </div>
          </div>
          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-beyanco-slate uppercase tracking-wider">
                Total Designs
              </p>
              <p className="text-2xl font-bold text-beyanco-navy">
                {generations.length}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium">
                All high-resolution
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-beyanco-paleBlue text-beyanco-blue flex items-center justify-center">
              <Images className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-beyanco-slate uppercase tracking-wider">
                Active Projects
              </p>
              <p className="text-2xl font-bold text-beyanco-navy">
                {projects.length}
              </p>
              <p className="text-[11px] text-beyanco-slate">
                Properties managed
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-beyanco-violet flex items-center justify-center">
              <FolderKanban className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-beyanco-slate uppercase tracking-wider">
                Available Credits
              </p>
              <p className="text-2xl font-bold text-beyanco-navy">
                {formatCredits(credits)}
              </p>
              <p className="text-[11px] text-beyanco-blue font-medium">
                Growth Plan tier
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-beyanco-emerald flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-beyanco-slate uppercase tracking-wider">
                Turnaround Time
              </p>
              <p className="text-2xl font-bold text-beyanco-navy">42s</p>
              <p className="text-[11px] text-emerald-600 font-medium">
                GPU accelerated
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-beyanco-amber flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Recent Generated Designs Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-beyanco-navy tracking-tight">
                Recent Generated Designs
              </h3>
              <p className="text-xs text-beyanco-slate">
                High-fidelity photorealistic interiors staged for your listings.
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-xs font-semibold text-beyanco-blue hover:text-beyanco-blueHover flex items-center gap-1"
            >
              View Full Gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {generations.slice(0, 4).map((gen) => (
              <div
                key={gen.id}
                onClick={() => setPreviewGen(gen)}
                className="group relative bg-white border border-beyanco-border rounded-xl overflow-hidden shadow-card hover:shadow-cardHover transition-all cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={gen.thumbnailUrl || gen.outputImageUrl}
                    alt={gen.roomType}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(gen.id, e)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        gen.isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>

                  {/* Overlay Quick Action Buttons on Hover */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-medium text-white bg-black/60 backdrop-blur px-2 py-0.5 rounded">
                      Click to inspect
                    </span>
                    <Link
                      href={`/design/${gen.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="px-2.5 py-1 text-xs font-semibold rounded-md bg-beyanco-blue text-white shadow-sm flex items-center gap-1 hover:bg-blue-600 transition-colors">
                        <Layers className="w-3 h-3" />
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-beyanco-navy capitalize">
                      {gen.roomType.replace("_", " ")}
                    </span>
                    <Badge variant="blue" size="sm">
                      {gen.style.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-beyanco-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(gen.createdAt)}
                    </span>
                    {gen.hasEditorDocument && (
                      <span className="text-beyanco-violet font-semibold flex items-center gap-0.5">
                        <Layers className="w-3 h-3" />
                        Editor Stage
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Property Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-beyanco-navy tracking-tight">
                Recent Projects
              </h3>
              <p className="text-xs text-beyanco-slate">
                Property workspaces with staged photography sets.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-beyanco-blue hover:text-beyanco-blueHover flex items-center gap-1"
            >
              All Projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((proj) => (
              <Card
                key={proj.id}
                hoverEffect
                className="p-0 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/9] w-full bg-slate-100">
                  <img
                    src={proj.thumbnailUrl}
                    alt={proj.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" size="sm" className="bg-white/90 backdrop-blur text-beyanco-navy font-semibold">
                      {proj.propertyType.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-beyanco-navy text-base leading-snug">
                      {proj.name}
                    </h4>
                    <p className="text-xs text-beyanco-slate mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-beyanco-muted" />
                      <span className="truncate">{proj.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-beyanco-slate">
                      <strong>{proj.designCount}</strong> staged designs
                    </span>
                    <Link
                      href={`/projects/${proj.id}`}
                      className="font-semibold text-beyanco-blue hover:text-beyanco-blueHover inline-flex items-center gap-1"
                    >
                      Open Project <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Full Preview & Comparison Modal */}
      {previewGen && (
        <Modal
          isOpen={!!previewGen}
          onClose={() => setPreviewGen(null)}
          title={`${previewGen.roomType.replace('_', ' ').toUpperCase()} — ${previewGen.style.replace('_', ' ').toUpperCase()}`}
          description={`Generated on ${formatDate(previewGen.createdAt)} with ${previewGen.modelProvider}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <BeforeAfterSlider
              beforeImage={previewGen.originalImageUrl}
              afterImage={previewGen.outputImageUrl}
              beforeLabel="Original Empty Space"
              afterLabel="AI Virtual Staged Result"
              aspectRatio="aspect-[16/10]"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-beyanco-slate">
                Drag the center slider to inspect architectural boundary preservation.
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewGen.outputImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={`beyanco_staging_${previewGen.id}.jpg`}
                >
                  <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                    Download 4K
                  </Button>
                </a>
                <Link href={`/design/${previewGen.id}/edit`}>
                  <Button variant="primary" size="sm" icon={<Layers className="w-3.5 h-3.5" />}>
                    Edit in Furniture Canvas
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
