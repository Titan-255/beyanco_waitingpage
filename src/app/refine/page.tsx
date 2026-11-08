"use client";

import React, { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ImageUploadZone } from "@/components/ui/ImageUploadZone";
import { AIEngineService } from "@/lib/ai-engine";
import {
  Wand2,
  Trash2,
  RefreshCw,
  Sparkles,
  Paintbrush,
  Check,
  Undo2,
  Layers,
  Info,
} from "lucide-react";

export default function RefinePage() {
  const [activeTab, setActiveTab] = useState<"removal" | "replacement" | "refinement">("removal");
  const [sourceImage, setSourceImage] = useState<string>(
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop"
  );
  const [objectToTarget, setObjectToTarget] = useState<string>("cluttered wires and boxes in corner");
  const [replacementDescription, setReplacementDescription] = useState<string>("sculptural travertine plinth with ceramic vase");
  const [refinementInstruction, setRefinementInstruction] = useState<string>("Make the natural sunlight through the windows warmer and softer.");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [generatedResultUrl, setGeneratedResultUrl] = useState<string | null>(null);

  const handleExecuteRefine = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));

    // Show refined result
    setGeneratedResultUrl(
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400&auto=format&fit=crop"
    );
    setIsProcessing(false);
  };

  return (
    <DashboardLayout
      title="AI Refinement & Object Inpainting"
      subtitle="Remove tenant clutter, replace unwanted fixtures, and reconstruct architectural surfaces."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Mode Selector Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-beyanco-border shadow-card flex items-center gap-2">
          {[
            { id: "removal", label: "Object & Clutter Removal", icon: Trash2 },
            { id: "replacement", label: "Smart Object Replacement", icon: RefreshCw },
            { id: "refinement", label: "Lighting & Architectural Refinement", icon: Wand2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setGeneratedResultUrl(null);
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? "bg-beyanco-navy text-white shadow-xs"
                    : "text-beyanco-slate hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Workspace Card */}
        <Card className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Source Photo Container */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-beyanco-navy block">
                Target Room Photograph:
              </span>
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-beyanco-border">
                <img
                  src={sourceImage}
                  alt="Source"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded backdrop-blur">
                  Source Image
                </div>
              </div>
              <p className="text-[11px] text-beyanco-muted">
                Tip: Clean architectural lines are reconstructed according to adjacent floorboards and walls.
              </p>
            </div>

            {/* Inpainting Configuration Controls */}
            <div className="space-y-4">
              {activeTab === "removal" && (
                <div className="space-y-3">
                  <Badge variant="blue" size="sm">
                    Inpainting Prompt Builder
                  </Badge>
                  <h3 className="text-base font-bold text-beyanco-navy">
                    Select Target Object for Removal
                  </h3>
                  <p className="text-xs text-beyanco-slate leading-relaxed">
                    The AI reconstructs the underlying wall, baseboard, or flooring texture naturally without introducing visual artifacts.
                  </p>
                  <div>
                    <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                      Object Description to Inpaint
                    </label>
                    <input
                      type="text"
                      value={objectToTarget}
                      onChange={(e) => setObjectToTarget(e.target.value)}
                      placeholder="e.g. wall air conditioner, cluttered cables, old ceiling fan..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-beyanco-slate space-y-1">
                    <span className="font-semibold text-beyanco-navy block">Constructed Inpaint Directive:</span>
                    <p className="italic">
                      &ldquo;{AIEngineService.constructRemovalPrompt(objectToTarget)}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "replacement" && (
                <div className="space-y-3">
                  <Badge variant="violet" size="sm">
                    Perspective Replacement
                  </Badge>
                  <h3 className="text-base font-bold text-beyanco-navy">
                    Replace Target Object
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                      Desired Replacement Furnishing
                    </label>
                    <input
                      type="text"
                      value={replacementDescription}
                      onChange={(e) => setReplacementDescription(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-beyanco-slate space-y-1">
                    <span className="font-semibold text-beyanco-navy block">Constructed Replacement Directive:</span>
                    <p className="italic">
                      &ldquo;{AIEngineService.constructReplacementPrompt(replacementDescription)}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "refinement" && (
                <div className="space-y-3">
                  <Badge variant="emerald" size="sm">
                    Lighting & Materials
                  </Badge>
                  <h3 className="text-base font-bold text-beyanco-navy">
                    Subtle Room Refinement
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                      Refinement Instruction
                    </label>
                    <textarea
                      rows={3}
                      value={refinementInstruction}
                      onChange={(e) => setRefinementInstruction(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                    />
                  </div>
                </div>
              )}

              <Button
                variant="ai"
                size="md"
                className="w-full"
                isLoading={isProcessing}
                onClick={handleExecuteRefine}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Execute AI Refinement (5 Credits)
              </Button>
            </div>
          </div>

          {/* Result Output Preview */}
          {generatedResultUrl && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="emerald" size="md">
                  <Check className="w-3.5 h-3.5" /> Refinement Applied Successfully
                </Badge>
                <a
                  href={generatedResultUrl}
                  target="_blank"
                  rel="noreferrer"
                  download="refined_interior.jpg"
                >
                  <Button variant="secondary" size="sm">
                    Download Refined Image
                  </Button>
                </a>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-beyanco-border shadow-card">
                <img
                  src={generatedResultUrl}
                  alt="Refined result"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
