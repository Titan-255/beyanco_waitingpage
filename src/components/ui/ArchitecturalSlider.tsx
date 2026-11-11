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
  const [collapsedHotspotIds, setCollapsedHotspotIds] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset all hotspots to visible by default when room or images change
  useEffect(() => {
    setCollapsedHotspotIds({});
  }, [beforeImage, afterImage]);

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
          "relative overflow-hidden rounded-[16px] sm:rounded-[20px] cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#A98460] bg-[#101827] shadow-architectural border border-[#D8D5CF]/40",
          aspectRatio === "aspect-[16/10]" ? "aspect-[4/3] sm:aspect-[16/10]" : aspectRatio
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
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 pointer-events-none max-w-[48%] sm:max-w-none">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-0.5 sm:py-1.5 text-[8px] sm:text-[11px] font-semibold tracking-wider uppercase bg-[#101827]/90 text-[#F6F4EF] backdrop-blur-md rounded-full shadow-sm border border-white/15">
            <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-[#A98460] shrink-0" />
            <span className="hidden sm:inline">{afterLabel}</span>
            <span className="sm:hidden truncate">{afterLabel.includes("STAGED") ? "STAGED" : afterLabel}</span>
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
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 pointer-events-none max-w-[48%] sm:max-w-none">
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-0.5 sm:py-1.5 text-[8px] sm:text-[11px] font-semibold tracking-wider uppercase bg-[#101827]/90 text-[#F6F4EF] backdrop-blur-md rounded-full shadow-sm border border-white/15">
              <span className="hidden sm:inline">{beforeLabel}</span>
              <span className="sm:hidden truncate">{beforeLabel.includes("ORIGINAL") ? "ORIGINAL" : beforeLabel}</span>
            </div>
          </div>
        </div>

        {/* Furniture Shopping Hotspots Layer (Visible BY DEFAULT on the AFTER portion) */}
        {hotspots && hotspots.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-25">
            {hotspots.map((spot) => {
              const isRevealed = spot.x >= sliderPosition;
              if (!isRevealed) return null;
              const isCollapsed = !!collapsedHotspotIds[spot.id];

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
                  {/* Anchor Pin Dot (Visible with pulse; clickable to toggle) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCollapsedHotspotIds((prev) => ({
                        ...prev,
                        [spot.id]: !prev[spot.id],
                      }));
                    }}
                    aria-label={`Toggle tag for ${spot.storeName}`}
                    className="relative flex items-center justify-center w-4 h-4 sm:w-6 sm:h-6 rounded-full cursor-pointer focus:outline-none group/pin transition-transform hover:scale-110 active:scale-95"
                  >
                    <span className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-[#101827] ring-1.5 sm:ring-2 ring-white shadow-md z-10 transition-transform group-hover/pin:scale-125" />
                    <span className="absolute inset-0 rounded-full border border-white/50 bg-[#A98460]/40 animate-ping pointer-events-none opacity-40" />
                  </button>

                  {/* Compact Information Tag (Visible by Default: Contains ONLY Store Name, Price in INR, and 'View Store' link) */}
                  {!isCollapsed && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "absolute z-30 min-w-[76px] sm:min-w-[150px] max-w-[96px] sm:max-w-[210px] p-1 sm:p-3 rounded-md sm:rounded-xl bg-white/95 backdrop-blur-md border border-[#D8D5CF] shadow-[0_4px_14px_rgba(0,0,0,0.15)] text-left transition-all duration-200 select-text hover:shadow-2xl hover:scale-[1.02]",
                        spot.x > 70
                          ? "right-0"
                          : spot.x < 30
                          ? "left-0"
                          : "left-1/2 -translate-x-1/2",
                        spot.y > 60
                          ? "bottom-full mb-1 sm:mb-2"
                          : "top-full mt-1 sm:mt-2"
                      )}
                    >
                      <div className="text-[9px] sm:text-sm font-bold font-serif text-[#101827] leading-tight">
                        {spot.priceInr}
                      </div>
                      <div className="text-[6.5px] sm:text-[10px] font-semibold tracking-wider uppercase text-[#626A75] mt-0.5 truncate">
                        {spot.storeName}
                      </div>
                      <a
                        href={spot.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1.5 text-[7.5px] sm:text-[11px] font-semibold text-[#A98460] hover:text-[#101827] transition-colors group/link"
                      >
                        <span>View Store</span>
                        <ArrowUpRight className="w-2 h-2 sm:w-3 sm:h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
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
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#101827] shadow-xl border border-[#D8D5CF] flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
            <ChevronsLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#101827]" />
          </div>
        </div>

        {/* Desktop Bottom Metadata Bar (Hidden on Mobile to prevent image/tag overlap) */}
        {(roomTitle || styleName || dimensions) && (
          <div className="hidden sm:flex absolute bottom-4 left-4 right-4 z-10 pointer-events-none items-center justify-between">
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

      {/* Mobile-Only Bottom Metadata Bar (Placed cleanly UNDER the image container: zero overlap with tags or slider) */}
      {(roomTitle || styleName || dimensions) && (
        <div className="mt-2.5 px-3 py-2 rounded-xl bg-[#101827] text-white flex sm:hidden items-center justify-between text-[11px] shadow-sm border border-[#1E293B]">
          <div className="flex items-center gap-1.5 min-w-0">
            {roomTitle && <span className="font-semibold text-white truncate">{roomTitle}</span>}
            {styleName && (
              <>
                <span className="text-white/30 shrink-0">•</span>
                <span className="text-[#A98460] font-medium truncate">{styleName}</span>
              </>
            )}
          </div>
          {dimensions && (
            <span className="text-white/70 text-[10px] shrink-0 ml-2 font-mono whitespace-nowrap bg-white/10 px-2 py-0.5 rounded">
              {dimensions}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
