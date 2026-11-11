"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronsLeftRight } from "lucide-react";

export interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string; // e.g. "aspect-[16/10.5]" or "aspect-[16/10]"
  className?: string;
  initialSliderPosition?: number; // 0 to 100
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE: ORIGINAL ROOM",
  afterLabel = "AFTER: STAGED INTERIOR",
  aspectRatio = "aspect-[16/10.5]",
  className,
  initialSliderPosition = 50,
}: BeforeAfterSliderProps) {
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Before and after staging comparison slider"
      onKeyDown={handleKeyDown}
      style={{ touchAction: "pan-y" }}
      className={cn(
        "relative overflow-hidden rounded-[16px] select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-beyanco-blue bg-slate-900",
        aspectRatio,
        className
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
      {/* Background Image: After (Staged) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        loading="eager"
      />

      {/* After Tag (Top Right) */}
      <div className="absolute top-2 sm:top-3.5 right-2 sm:right-3.5 z-10 pointer-events-none">
        <span className="px-2 sm:px-3 py-0.5 sm:py-1.5 text-[8px] sm:text-[11px] font-bold tracking-wider uppercase bg-slate-900/80 text-white backdrop-blur-md rounded-full shadow-sm border border-white/20">
          {afterLabel}
        </span>
      </div>

      {/* Foreground Clipped Image: Before (Original Room) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          loading="eager"
        />

        {/* Before Tag (Top Left) */}
        <div className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 z-10 pointer-events-none">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1.5 text-[8px] sm:text-[11px] font-bold tracking-wider uppercase bg-slate-900/80 text-white backdrop-blur-md rounded-full shadow-sm border border-white/20">
            {beforeLabel}
          </span>
        </div>
      </div>

      {/* Vertical Slider Line & Floating Center Button */}
      <div
        className="absolute top-0 bottom-0 z-20 w-[2.5px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-beyanco-blue shadow-elevated border-2 border-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
          <ChevronsLeftRight className="w-5 h-5 text-beyanco-blue" />
        </div>
      </div>
    </div>
  );
}
