"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronsLeftRight, Sparkles } from "lucide-react";

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
}: ArchitecturalSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(initialSliderPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
