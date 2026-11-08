"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";

export interface ImageUploadZoneProps {
  onImageSelected: (dataUrl: string, file: File, dimensions?: { width: number; height: number }) => void;
  initialImageUrl?: string;
  className?: string;
}

export function ImageUploadZone({
  onImageSelected,
  initialImageUrl,
  className,
}: ImageUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    sizeKb: number;
    dimensions?: { width: number; height: number };
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMessage(null);
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please upload a valid JPEG, PNG, or WebP photograph.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage("File exceeds 25MB limit. Please upload a smaller photograph.");
      return;
    }

    if (file.size < 1024) {
      setErrorMessage("File is too small or empty to be a valid room photograph.");
      return;
    }

    // Binary Magic-Byte Header Verification
    try {
      const headerBuffer = await file.slice(0, 12).arrayBuffer();
      const bytes = new Uint8Array(headerBuffer);
      const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
      const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
      const isRiff = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
      const isWebp = isRiff && bytes[8] === 0x57 && bytes[9] === 0x41 && bytes[10] === 0x56 && bytes[11] === 0x50; // 'WEVP' or 'WEBP'
      const isWebpAlt = isRiff && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50; // 'WEBP'

      if (!isJpeg && !isPng && !isWebp && !isWebpAlt) {
        setErrorMessage("File signature is invalid. Please select an authentic JPEG, PNG, or WebP image.");
        return;
      }
    } catch {
      // Fallback gracefully if arrayBuffer inspection fails on older environments
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setErrorMessage("Could not read image file. Please check file permissions.");
    };
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onerror = () => {
        setErrorMessage("Image decoding failed. File may be corrupted.");
      };
      img.onload = () => {
        if (img.naturalWidth < 200 || img.naturalHeight < 200) {
          setErrorMessage("Image resolution is too low. Please upload a photo at least 200×200 pixels.");
          return;
        }
        if (img.naturalWidth > 8192 || img.naturalHeight > 8192) {
          setErrorMessage("Image resolution exceeds maximum 8192×8192 pixels.");
          return;
        }

        const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
        setPreviewUrl(dataUrl);
        setFileDetails({
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
          dimensions,
        });
        onImageSelected(dataUrl, file, dimensions);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setFileDetails(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={inputRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
      />

      {!previewUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 text-center",
            isDragOver
              ? "border-beyanco-blue bg-beyanco-paleBlue/80 ring-4 ring-beyanco-blue/10 scale-[1.005]"
              : "border-beyanco-border bg-white hover:bg-slate-50/80 hover:border-slate-300"
          )}
        >
          <div className="w-16 h-16 rounded-full bg-beyanco-paleBlue text-beyanco-blue flex items-center justify-center mb-4 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-semibold text-beyanco-navy mb-1.5">
            Bring Your Space to Life
          </h3>
          <p className="text-sm text-beyanco-slate max-w-md mb-5 leading-relaxed">
            Upload a photograph of your empty or existing interior to begin intelligent staging.
          </p>

          <Button
            type="button"
            variant="secondary"
            size="md"
            icon={<ImageIcon className="w-4 h-4 text-beyanco-blue" />}
          >
            Browse Property Photos
          </Button>

          <div className="mt-6 flex items-center gap-4 text-xs text-beyanco-muted">
            <span>Supports JPEG, PNG, WebP</span>
            <span>•</span>
            <span>Up to 15 MB</span>
            <span>•</span>
            <span>High-resolution recommended</span>
          </div>

          {errorMessage && (
            <p className="mt-4 text-sm text-beyanco-red font-medium">{errorMessage}</p>
          )}
        </div>
      ) : (
        <div className="bg-white border border-beyanco-border rounded-2xl p-4 shadow-card">
          <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 group">
            <img
              src={previewUrl}
              alt="Uploaded room photograph"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-beyanco-emerald shrink-0" />
                <div>
                  <p className="text-sm font-medium truncate max-w-xs">
                    {fileDetails?.name || "Uploaded Room Photograph"}
                  </p>
                  <p className="text-xs text-slate-300">
                    {fileDetails?.dimensions
                      ? `${fileDetails.dimensions.width} × ${fileDetails.dimensions.height}px • ${fileDetails.sizeKb} KB`
                      : "Verified Interior Image"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 backdrop-blur text-xs h-8"
                  onClick={() => inputRef.current?.click()}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Replace
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="h-8 px-2.5"
                  onClick={handleClear}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
