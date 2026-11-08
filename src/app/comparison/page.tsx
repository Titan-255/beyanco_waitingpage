"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { storage } from "@/lib/storage";
import { Generation } from "@/types";
import {
  ChevronsLeftRight,
  Columns2,
  Download,
  Layers,
  Sparkles,
  Maximize2,
  ArrowLeft,
} from "lucide-react";

export default function ComparisonStudioPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGenId, setSelectedGenId] = useState<string>("gen_001");
  const [viewMode, setViewMode] = useState<"slider" | "side_by_side">("slider");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const list = storage.getGenerations();
    setGenerations(list);
    if (list.length > 0) {
      setSelectedGenId(list[0].id);
    }
  }, []);

  const activeGen = generations.find((g) => g.id === selectedGenId) || generations[0];

  if (!activeGen) {
    return (
      <DashboardLayout title="Comparison Studio">
        <div className="p-12 text-center text-beyanco-slate">Loading staging designs...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Before-and-After Comparison Studio"
      subtitle="Inspect spatial alignment, lighting fidelity, and architectural preservation."
    >
      <div className="space-y-6">
        {/* Top Controls & View Mode Bar */}
        <div className="bg-white p-4 rounded-2xl border border-beyanco-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Design Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider">
              Select Design:
            </span>
            <select
              value={selectedGenId}
              onChange={(e) => setSelectedGenId(e.target.value)}
              className="bg-slate-50 border border-beyanco-border rounded-xl px-3.5 py-2 text-xs font-bold text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
            >
              {generations.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.roomType.replace("_", " ").toUpperCase()} — {g.style.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher & Actions */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button
                onClick={() => setViewMode("slider")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "slider"
                    ? "bg-white text-beyanco-blue shadow-xs font-bold"
                    : "text-beyanco-slate hover:text-beyanco-navy"
                }`}
              >
                <ChevronsLeftRight className="w-3.5 h-3.5" />
                Interactive Slider
              </button>
              <button
                onClick={() => setViewMode("side_by_side")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "side_by_side"
                    ? "bg-white text-beyanco-blue shadow-xs font-bold"
                    : "text-beyanco-slate hover:text-beyanco-navy"
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                Side-by-Side
              </button>
            </div>

            <a
              href={activeGen.outputImageUrl}
              target="_blank"
              rel="noreferrer"
              download="staged_comparison.jpg"
            >
              <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                Export
              </Button>
            </a>

            <Link href={`/design/${activeGen.id}/edit`}>
              <Button variant="primary" size="sm" icon={<Layers className="w-3.5 h-3.5" />}>
                Edit Furniture
              </Button>
            </Link>
          </div>
        </div>

        {/* Comparison Display */}
        {viewMode === "slider" ? (
          <Card className="p-4 bg-white border border-beyanco-border">
            <BeforeAfterSlider
              beforeImage={activeGen.originalImageUrl}
              afterImage={activeGen.outputImageUrl}
              beforeLabel="Original Empty Space"
              afterLabel="Staged Interior Render"
              aspectRatio="aspect-[16/10]"
            />
            <div className="mt-4 px-2 flex items-center justify-between text-xs text-beyanco-slate">
              <span className="font-medium text-beyanco-navy">
                Drag divider horizontally or use keyboard Left / Right arrows
              </span>
              <div className="flex items-center gap-3">
                <Badge variant="blue" size="sm">
                  {activeGen.style.replace("_", " ").toUpperCase()}
                </Badge>
                <span>{activeGen.modelProvider}</span>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Card */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="default" size="sm">
                  Original Photograph
                </Badge>
                <span className="text-xs text-beyanco-slate font-medium">Unfurnished</span>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-200">
                <img
                  src={activeGen.originalImageUrl}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            {/* After Card */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="blue" size="sm">
                  AI Virtual Staging
                </Badge>
                <span className="text-xs text-beyanco-blue font-semibold">
                  {activeGen.style.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-200">
                <img
                  src={activeGen.outputImageUrl}
                  alt="Staged"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
