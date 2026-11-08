"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronsLeftRight, Sparkles, ArrowUpRight } from "lucide-react";

export interface FurnitureHotspot {
  id: string;
  x: number; // percentage (0-100) from left
  y: number; // percentage (0-100) from top
  storeName: string;
  priceInr: string;
  storeUrl: string;
}

export interface ArchitecturalSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  roomTitle?: string;
  styleName?: string;
  dimensions?: string;
  aspectRatio?: string;
  className?: string;
  initialSliderPosition?: number;
  hotspots?: FurnitureHotspot[];
}

export function ArchitecturalSlider({
  beforeImage,
  afterImage,
  beforeLabel = "ORIGINAL PHOTOGRAPH",
  afterLabel = "BEYANCO CONCEPT",
  roomTitle,
  styleName,
  dimensions,
  aspectRatio = "aspect-[16/10]",
  className,
  initialSliderPosition = 50,
  hotspots = [],
}: ArchitecturalSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(initialSliderPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close active hotspot if category or images change
  useEffect(() => {
    setActiveHotspotId(null);
  }, [beforeImage, afterImage]);

  // If the divider is dragged past the active hotspot, dismiss the popup
  useEffect(() => {
    if (activeHotspotId && hotspots) {
      const activeSpot = hotspots.find((h) => h.id === activeHotspotId);
      if (activeSpot && sliderPosition > activeSpot.x) {
        setActiveHotspotId(null);
      }
    }
  }, [sliderPosition, activeHotspotId, hotspots]);

  // Close hotspot when clicking outside
  useEffect(() => {
    if (!activeHotspotId) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest("[data-furniture-hotspot]")) {
        setActiveHotspotId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [activeHotspotId]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleInteractionEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleInteractionEnd);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleInteractionEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleInteractionEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleInteractionEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleInteractionEnd]);

  useEffect(() => {
    setSliderPosition(initialSliderPosition);
  }, [beforeImage, afterImage, initialSliderPosition]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className={cn("relative group select-none", className)}>
      <div
        ref={containerRef}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after staging comparison slider. Use left and right arrow keys to adjust view."
        onKeyDown={handleKeyDown}
        style={{ touchAction: "pan-y" }}
        className={cn(
          "relative overflow-hidden rounded-[20px] cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#A98460] bg-[#101827] shadow-architectural border border-[#D8D5CF]/40",
          aspectRatio
        )}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* Background Image: After (Designed/Staged) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          loading="eager"
        />

        {/* After Tag (Top Right) */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold tracking-wider uppercase bg-[#101827]/85 text-[#F6F4EF] backdrop-blur-md rounded-full shadow-sm border border-white/15">
            <Sparkles className="w-3 h-3 text-[#A98460]" />
            <span>{afterLabel}</span>
          </div>
        </div>

        {/* Foreground Clipped Image: Before (Original Room) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            loading="eager"
          />

          {/* Before Tag (Top Left) */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold tracking-wider uppercase bg-[#101827]/85 text-[#F6F4EF] backdrop-blur-md rounded-full shadow-sm border border-white/15">
              <span>{beforeLabel}</span>
            </div>
          </div>
        </div>

        {/* Furniture Shopping Hotspots Layer (Visible ONLY on the AFTER portion) */}
        {hotspots && hotspots.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-25">
            {hotspots.map((spot) => {
              const isRevealed = spot.x >= sliderPosition;
              if (!isRevealed) return null;
              const isActive = activeHotspotId === spot.id;

              return (
                <div
                  key={spot.id}
                  data-furniture-hotspot
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  {/* Hotspot Marker Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspotId(isActive ? null : spot.id);
                    }}
                    aria-expanded={isActive}
                    aria-label={`View pricing from ${spot.storeName}`}
                    className={cn(
                      "relative flex items-center justify-center w-7 h-7 rounded-full shadow-lg backdrop-blur-md cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#A98460]",
                      isActive
                        ? "bg-[#101827] text-white ring-2 ring-[#A98460] scale-110"
                        : "bg-[#101827]/85 hover:bg-[#101827] text-white border border-white/50 hover:scale-110"
                    )}
                  >
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full border border-white/40 animate-ping pointer-events-none opacity-40" />
                    )}
                    <span className="w-2 h-2 rounded-full bg-white transition-transform" />
                  </button>

                  {/* Compact Information Tag: Contains ONLY Store Name, Price in INR, and 'View Store' link */}
                  {isActive && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "absolute z-30 min-w-[160px] max-w-[210px] p-3 rounded-xl bg-white/95 backdrop-blur-md border border-[#D8D5CF] shadow-[0_12px_28px_rgba(0,0,0,0.18)] text-left transition-all duration-200 animate-in fade-in zoom-in-95 select-text",
                        spot.x > 75
                          ? "right-0"
                          : spot.x < 35
                          ? "left-0"
                          : "left-1/2 -translate-x-1/2",
                        spot.y > 60
                          ? "bottom-full mb-2.5"
                          : "top-full mt-2.5"
                      )}
                    >
                      <div className="text-[10px] font-semibold tracking-wider uppercase text-[#626A75]">
                        {spot.storeName}
                      </div>
                      <div className="text-sm font-bold font-serif text-[#101827] mt-0.5">
                        {spot.priceInr}
                      </div>
                      <a
                        href={spot.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#A98460] hover:text-[#101827] transition-colors group/link"
                      >
                        <span>View Store</span>
                        <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Vertical Divider Line with Premium Minimal Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 w-[2px] bg-white pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.6)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#101827] shadow-xl border border-[#D8D5CF] flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
            <ChevronsLeftRight className="w-4 h-4 text-[#101827]" />
          </div>
        </div>

        {/* Bottom Metadata Bar if provided */}
        {(roomTitle || styleName || dimensions) && (
          <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex items-center justify-between">
            <div className="px-4 py-2 rounded-xl bg-[#101827]/80 backdrop-blur-md border border-white/15 text-white flex items-center gap-3 text-xs">
              {roomTitle && <span className="font-medium text-white">{roomTitle}</span>}
              {styleName && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-[#A98460] font-medium">{styleName}</span>
                </>
              )}
              {dimensions && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-white/70">{dimensions}</span>
                </>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white/70 uppercase tracking-widest border border-white/10">
              Drag to compare
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
