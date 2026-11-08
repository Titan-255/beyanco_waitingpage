"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { FURNITURE_CATALOG } from "@/lib/sample-data";
import {
  FurnitureEditorDocument,
  CanvasFurnitureObject,
  FurnitureProduct,
} from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Save,
  Download,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Layers,
  Search,
  Wand2,
  Info,
  Check,
  ChevronRight,
  Move,
  RotateCw,
} from "lucide-react";

export default function FurnitureEditorPage() {
  const params = useParams();
  const router = useRouter();
  const designId = (params?.id as string) || "gen_001";

  // Document State
  const [doc, setDoc] = useState<FurnitureEditorDocument | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showFlattenedNotice, setShowFlattenedNotice] = useState<boolean>(true);

  // Undo/Redo history stack
  const [history, setHistory] = useState<CanvasFurnitureObject[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Canvas element ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Interaction tracking
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragMode, setDragMode] = useState<"move" | "resize" | "rotate" | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragInitialObject, setDragInitialObject] = useState<CanvasFurnitureObject | null>(null);

  // Cached Image elements for fast rendering
  const imagesCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Load document on mount
  useEffect(() => {
    const loadedDoc = storage.getEditorDocument(designId);
    setDoc(loadedDoc);
    setHistory([loadedDoc.objects]);
    setHistoryIndex(0);
  }, [designId]);

  // Push new state to history
  const pushHistory = (newObjects: CanvasFurnitureObject[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newObjects)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSaveStatus("unsaved");
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      if (doc) {
        setDoc({ ...doc, objects: JSON.parse(JSON.stringify(history[newIndex])) });
      }
      setSaveStatus("unsaved");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      if (doc) {
        setDoc({ ...doc, objects: JSON.parse(JSON.stringify(history[newIndex])) });
      }
      setSaveStatus("unsaved");
    }
  };

  // Helper to load image into cache
  const getImage = useCallback((url: string): Promise<HTMLImageElement> => {
    if (imagesCacheRef.current.has(url)) {
      return Promise.resolve(imagesCacheRef.current.get(url)!);
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imagesCacheRef.current.set(url, img);
        resolve(img);
      };
      img.onerror = () => {
        resolve(img);
      };
      img.src = url;
    });
  }, []);

  // Redraw canvas whenever doc, selectedObjectId, or zoomLevel changes
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !doc) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = doc.canvasWidth || 960;
    const height = doc.canvasHeight || 540;

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background Room Photograph
    if (doc.backgroundImageUrl) {
      const bgImg = await getImage(doc.backgroundImageUrl);
      ctx.drawImage(bgImg, 0, 0, width, height);
    } else {
      ctx.fillStyle = "#F1F5F9";
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Sort furniture objects by zIndex
    const sortedObjects = [...doc.objects].sort((a, b) => a.zIndex - b.zIndex);

    // 3. Render each furniture object
    for (const obj of sortedObjects) {
      ctx.save();
      ctx.globalAlpha = obj.opacity;

      // Translate to object center for rotation
      const centerX = obj.x + obj.width / 2;
      const centerY = obj.y + obj.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((obj.rotation * Math.PI) / 180);

      const furnImg = await getImage(obj.assetUrl);
      ctx.drawImage(furnImg, -obj.width / 2, -obj.height / 2, obj.width, obj.height);

      // If selected, draw transformation bounding box and handles
      if (obj.id === selectedObjectId) {
        ctx.restore();
        ctx.save();

        ctx.translate(centerX, centerY);
        ctx.rotate((obj.rotation * Math.PI) / 180);

        // Bounding outline
        ctx.strokeStyle = "#2563EB";
        ctx.lineWidth = 2;
        ctx.strokeRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);

        // 4 Corner scale handles
        const handleSize = 8;
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#2563EB";
        ctx.lineWidth = 2;

        const corners = [
          { x: -obj.width / 2, y: -obj.height / 2 },
          { x: obj.width / 2, y: -obj.height / 2 },
          { x: -obj.width / 2, y: obj.height / 2 },
          { x: obj.width / 2, y: obj.height / 2 },
        ];

        corners.forEach((c) => {
          ctx.fillRect(c.x - handleSize / 2, c.y - handleSize / 2, handleSize, handleSize);
          ctx.strokeRect(c.x - handleSize / 2, c.y - handleSize / 2, handleSize, handleSize);
        });

        // Rotation Stem and Handle (Top Center)
        ctx.beginPath();
        ctx.moveTo(0, -obj.height / 2);
        ctx.lineTo(0, -obj.height / 2 - 20);
        ctx.strokeStyle = "#2563EB";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -obj.height / 2 - 20, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }
  }, [doc, selectedObjectId, getImage]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Add Product from Catalog to Canvas
  const handleAddProductToCanvas = (product: FurnitureProduct) => {
    if (!doc) return;

    // Calculate initial dimensions respecting aspect ratio
    const initialWidth = 200;
    const initialHeight = 120;

    const newObj: CanvasFurnitureObject = {
      id: `obj_${Date.now()}`,
      productId: product.productId,
      name: product.name,
      assetUrl: product.assetUrl,
      x: doc.canvasWidth / 2 - initialWidth / 2,
      y: doc.canvasHeight / 2 - initialHeight / 2,
      width: initialWidth,
      height: initialHeight,
      rotation: 0,
      zIndex: doc.objects.length + 1,
      opacity: 1,
      locked: false,
      aspectRatio: initialWidth / initialHeight,
    };

    const newObjects = [...doc.objects, newObj];
    setDoc({ ...doc, objects: newObjects });
    setSelectedObjectId(newObj.id);
    pushHistory(newObjects);
  };

  // Canvas Mouse & Touch Interactions
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const getCanvasTouchCoords = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY,
    };
  };

  const handlePointerStart = (coords: { x: number; y: number }) => {
    if (!doc) return;

    // Check if clicked inside selected object rotation handle
    const selectedObj = doc.objects.find((o) => o.id === selectedObjectId);
    if (selectedObj) {
      const centerX = selectedObj.x + selectedObj.width / 2;
      const centerY = selectedObj.y + selectedObj.height / 2;
      const rad = (selectedObj.rotation * Math.PI) / 180;

      // Local handle pos (0, -height/2 - 20) rotated
      const handleLocalX = 0;
      const handleLocalY = -selectedObj.height / 2 - 20;
      const rotHandleX = centerX + (handleLocalX * Math.cos(rad) - handleLocalY * Math.sin(rad));
      const rotHandleY = centerY + (handleLocalX * Math.sin(rad) + handleLocalY * Math.cos(rad));

      const distRot = Math.hypot(coords.x - rotHandleX, coords.y - rotHandleY);
      if (distRot < 16) {
        setIsDragging(true);
        setDragMode("rotate");
        setDragStartPos(coords);
        setDragInitialObject({ ...selectedObj });
        return;
      }

      // Check corner scale handles
      const corners = [
        { x: selectedObj.x, y: selectedObj.y },
        { x: selectedObj.x + selectedObj.width, y: selectedObj.y },
        { x: selectedObj.x, y: selectedObj.y + selectedObj.height },
        { x: selectedObj.x + selectedObj.width, y: selectedObj.y + selectedObj.height },
      ];

      for (const c of corners) {
        if (Math.hypot(coords.x - c.x, coords.y - c.y) < 16) {
          setIsDragging(true);
          setDragMode("resize");
          setDragStartPos(coords);
          setDragInitialObject({ ...selectedObj });
          return;
        }
      }
    }

    // Check hit test against objects from highest zIndex to lowest
    const sorted = [...doc.objects].sort((a, b) => b.zIndex - a.zIndex);
    let hitObject: CanvasFurnitureObject | null = null;

    for (const obj of sorted) {
      if (
        coords.x >= obj.x &&
        coords.x <= obj.x + obj.width &&
        coords.y >= obj.y &&
        coords.y <= obj.y + obj.height
      ) {
        hitObject = obj;
        break;
      }
    }

    if (hitObject) {
      setSelectedObjectId(hitObject.id);
      setIsDragging(true);
      setDragMode("move");
      setDragStartPos(coords);
      setDragInitialObject({ ...hitObject });
    } else {
      setSelectedObjectId(null);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    handlePointerStart(coords);
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCanvasTouchCoords(e);
    handlePointerStart(coords);
  };

  const handlePointerMove = (coords: { x: number; y: number }) => {
    if (!isDragging || !dragMode || !dragInitialObject || !doc) return;
    const dx = coords.x - dragStartPos.x;
    const dy = coords.y - dragStartPos.y;

    if (dragMode === "move") {
      const canvasW = doc.canvasWidth || 960;
      const canvasH = doc.canvasHeight || 540;
      const updatedObjects = doc.objects.map((obj) => {
        if (obj.id === dragInitialObject.id && !obj.locked) {
          const rawX = Math.round(dragInitialObject.x + dx);
          const rawY = Math.round(dragInitialObject.y + dy);
          // Boundary clamping: ensure at least 25% remains visible on canvas
          const minX = -Math.round(obj.width * 0.75);
          const maxX = Math.round(canvasW - obj.width * 0.25);
          const minY = -Math.round(obj.height * 0.75);
          const maxY = Math.round(canvasH - obj.height * 0.25);
          return {
            ...obj,
            x: Math.max(minX, Math.min(maxX, rawX)),
            y: Math.max(minY, Math.min(maxY, rawY)),
          };
        }
        return obj;
      });
      setDoc({ ...doc, objects: updatedObjects });
    } else if (dragMode === "resize") {
      const updatedObjects = doc.objects.map((obj) => {
        if (obj.id === dragInitialObject.id && !obj.locked) {
          const newWidth = Math.max(40, Math.round(dragInitialObject.width + dx));
          const newHeight = Math.max(30, Math.round(newWidth / dragInitialObject.aspectRatio));
          return {
            ...obj,
            width: newWidth,
            height: newHeight,
          };
        }
        return obj;
      });
      setDoc({ ...doc, objects: updatedObjects });
    } else if (dragMode === "rotate") {
      const centerX = dragInitialObject.x + dragInitialObject.width / 2;
      const centerY = dragInitialObject.y + dragInitialObject.height / 2;
      const angleRad = Math.atan2(coords.y - centerY, coords.x - centerX);
      let angleDeg = Math.round((angleRad * 180) / Math.PI) + 90;
      if (angleDeg < 0) angleDeg += 360;

      const updatedObjects = doc.objects.map((obj) => {
        if (obj.id === dragInitialObject.id && !obj.locked) {
          return {
            ...obj,
            rotation: angleDeg,
          };
        }
        return obj;
      });
      setDoc({ ...doc, objects: updatedObjects });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    handlePointerMove(coords);
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCanvasTouchCoords(e);
    handlePointerMove(coords);
  };

  const handlePointerEnd = () => {
    if (isDragging && doc) {
      setIsDragging(false);
      setDragMode(null);
      pushHistory(doc.objects);
    }
  };

  const handleCanvasMouseUp = () => {
    handlePointerEnd();
  };

  const handleCanvasTouchEnd = () => {
    handlePointerEnd();
  };

  // Property Inspector updates
  const updateSelectedObject = (updates: Partial<CanvasFurnitureObject>) => {
    if (!doc || !selectedObjectId) return;
    const updated = doc.objects.map((obj) => {
      if (obj.id === selectedObjectId) {
        return { ...obj, ...updates };
      }
      return obj;
    });
    setDoc({ ...doc, objects: updated });
    pushHistory(updated);
  };

  // Delete selected
  const handleDeleteSelected = () => {
    if (!doc || !selectedObjectId) return;
    const filtered = doc.objects.filter((o) => o.id !== selectedObjectId);
    setDoc({ ...doc, objects: filtered });
    setSelectedObjectId(null);
    pushHistory(filtered);
  };

  // Duplicate selected
  const handleDuplicateSelected = () => {
    const selected = doc?.objects.find((o) => o.id === selectedObjectId);
    if (!selected || !doc) return;
    const duplicate: CanvasFurnitureObject = {
      ...selected,
      id: `obj_${Date.now()}`,
      x: selected.x + 20,
      y: selected.y + 20,
      zIndex: doc.objects.length + 1,
    };
    const updated = [...doc.objects, duplicate];
    setDoc({ ...doc, objects: updated });
    setSelectedObjectId(duplicate.id);
    pushHistory(updated);
  };

  // Save document
  const handleSave = () => {
    if (!doc) return;
    setSaveStatus("saving");
    setTimeout(() => {
      storage.saveEditorDocument(doc);
      setSaveStatus("saved");
    }, 400);
  };

  // Export Final High-Resolution Composite Image
  const handleExportFinal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Deselect object to export clean without transformation bounding box
    setSelectedObjectId(null);

    setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.download = `beyanco_staged_export_${designId}.jpg`;
      link.href = dataUrl;
      link.click();
    }, 100);
  };

  const selectedObject = doc?.objects.find((o) => o.id === selectedObjectId);

  // Filter catalogue items
  const filteredCatalog = FURNITURE_CATALOG.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] text-beyanco-navy overflow-hidden">
      {/* 1. TOP EDITOR TOOLBAR */}
      <header className="h-16 bg-white border-b border-beyanco-border px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/gallery">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>

          <div className="h-6 w-px bg-beyanco-border" />

          <div>
            <h1 className="text-sm font-bold text-beyanco-navy tracking-tight truncate max-w-xs">
              {doc?.roomTitle || "Virtual Staging Workspace"}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-beyanco-slate">
              <span>{doc?.objects.length || 0} Catalogue Layers</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                {saveStatus === "saving" && (
                  <span className="text-beyanco-blue">Saving changes...</span>
                )}
                {saveStatus === "saved" && (
                  <span className="text-beyanco-emerald flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved
                  </span>
                )}
                {saveStatus === "unsaved" && (
                  <span className="text-beyanco-amber font-semibold">Unsaved edits</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Center Canvas Tools */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-white disabled:opacity-40 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-white disabled:opacity-40 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-medium px-1 text-slate-600">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(2, z + 0.1))}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-white transition-colors"
            title="Fit to Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            icon={<Save className="w-3.5 h-3.5" />}
          >
            Save Document
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportFinal}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Composed Image
          </Button>
        </div>
      </header>

      {/* 2. THREE-PANEL EDITOR WORKSPACE */}
      <div className="flex-1 flex min-h-0 relative">
        {/* LEFT PANEL: Furniture Library */}
        <aside className="w-72 bg-white border-r border-beyanco-border flex flex-col shrink-0">
          <div className="p-4 border-b border-beyanco-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider">
                FURNITURE CATALOGUE
              </span>
              <Badge variant="blue" size="sm">
                11+ Models
              </Badge>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-beyanco-muted" />
              <input
                type="text"
                placeholder="Search sofas, lamps, chairs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-beyanco-border rounded-lg text-beyanco-navy focus:outline-none focus:ring-1 focus:ring-beyanco-blue"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "All" },
                { id: "sofas", label: "Sofas" },
                { id: "chairs", label: "Chairs" },
                { id: "tables", label: "Tables" },
                { id: "lighting", label: "Lighting" },
                { id: "rugs", label: "Rugs" },
                { id: "plants", label: "Plants" },
                { id: "decor", label: "Art" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-beyanco-navy text-white"
                      : "bg-slate-100 text-beyanco-slate hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredCatalog.map((product) => (
              <div
                key={product.id}
                onClick={() => handleAddProductToCanvas(product)}
                className="group p-2.5 rounded-xl border border-beyanco-border hover:border-beyanco-blue bg-white hover:bg-slate-50/70 transition-all cursor-pointer flex items-center gap-3 shadow-xs"
              >
                <div className="w-16 h-14 rounded-lg bg-slate-100 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={product.previewUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-beyanco-navy truncate">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-beyanco-slate mt-0.5 truncate">
                    {product.material}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-beyanco-muted">
                    <span>{product.dimensions.widthCm}cm</span>
                    <span className="text-beyanco-blue font-semibold group-hover:underline">
                      + Add to Canvas
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTRE: Room Canvas */}
        <main
          ref={canvasContainerRef}
          className="flex-1 bg-slate-200/60 overflow-auto flex flex-col items-center justify-center p-6 relative select-none"
        >
          {/* Honest Flattened-Image Notice Banner */}
          {showFlattenedNotice && (
            <div className="absolute top-4 left-6 right-6 z-20 bg-white/95 backdrop-blur-md border border-beyanco-border rounded-xl p-3 shadow-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-beyanco-navy">
                <Info className="w-4 h-4 text-beyanco-blue shrink-0" />
                <span>
                  <strong>Flattened Spatial Background:</strong> The photorealistic background is a unified 2D render. Added catalogue pieces are independent movable layers. Use{" "}
                  <Link href="/refine" className="text-beyanco-blue font-bold underline">
                    AI Object Inpainting
                  </Link>{" "}
                  if you need to remove furniture already embedded in the source photograph.
                </span>
              </div>
              <button
                onClick={() => setShowFlattenedNotice(false)}
                className="text-beyanco-slate hover:text-beyanco-navy font-bold text-xs ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* HTML5 Canvas Stage */}
          <div
            className="relative shadow-elevated rounded-xl overflow-hidden border-2 border-white bg-slate-900 transition-transform duration-100"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={handleCanvasTouchEnd}
              style={{ touchAction: "none" }}
              className="cursor-crosshair block"
            />
          </div>

          <div className="mt-3 text-[11px] text-beyanco-slate font-medium">
            Tip: Click to select an object. Drag corner handles to scale, or top handle to rotate.
          </div>
        </main>

        {/* RIGHT PANEL: Object Properties Inspector */}
        <aside className="w-72 bg-white border-l border-beyanco-border flex flex-col shrink-0">
          <div className="p-4 border-b border-beyanco-border">
            <span className="text-xs font-bold text-beyanco-navy uppercase tracking-wider">
              PROPERTIES INSPECTOR
            </span>
          </div>

          {selectedObject ? (
            <div className="p-4 flex-1 overflow-y-auto space-y-5 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-beyanco-muted">
                  SELECTED PRODUCT
                </span>
                <h3 className="text-sm font-bold text-beyanco-navy mt-0.5">
                  {selectedObject.name}
                </h3>
                <p className="text-beyanco-slate font-mono text-[11px]">
                  ID: {selectedObject.productId}
                </p>
              </div>

              {/* Position Coordinates */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="font-semibold text-beyanco-navy block">
                  Canvas Position (X, Y)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-beyanco-muted block">X (px)</label>
                    <input
                      type="number"
                      value={selectedObject.x}
                      onChange={(e) =>
                        updateSelectedObject({ x: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2 bg-slate-50 border border-beyanco-border rounded-lg text-beyanco-navy font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-beyanco-muted block">Y (px)</label>
                    <input
                      type="number"
                      value={selectedObject.y}
                      onChange={(e) =>
                        updateSelectedObject({ y: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2 bg-slate-50 border border-beyanco-border rounded-lg text-beyanco-navy font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="font-semibold text-beyanco-navy block">
                  Dimensions (W × H)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-beyanco-muted block">Width</label>
                    <input
                      type="number"
                      value={selectedObject.width}
                      onChange={(e) => {
                        const w = parseInt(e.target.value) || 40;
                        updateSelectedObject({
                          width: w,
                          height: Math.round(w / selectedObject.aspectRatio),
                        });
                      }}
                      className="w-full p-2 bg-slate-50 border border-beyanco-border rounded-lg text-beyanco-navy font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-beyanco-muted block">Height</label>
                    <input
                      type="number"
                      value={selectedObject.height}
                      onChange={(e) =>
                        updateSelectedObject({ height: parseInt(e.target.value) || 30 })
                      }
                      className="w-full p-2 bg-slate-50 border border-beyanco-border rounded-lg text-beyanco-navy font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-beyanco-navy">Rotation Angle</span>
                  <span className="font-mono text-beyanco-slate">{selectedObject.rotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedObject.rotation}
                  onChange={(e) =>
                    updateSelectedObject({ rotation: parseInt(e.target.value) })
                  }
                  className="w-full accent-beyanco-blue"
                />
              </div>

              {/* Opacity */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-beyanco-navy">Layer Opacity</span>
                  <span className="font-mono text-beyanco-slate">
                    {Math.round(selectedObject.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={selectedObject.opacity}
                  onChange={(e) =>
                    updateSelectedObject({ opacity: parseFloat(e.target.value) })
                  }
                  className="w-full accent-beyanco-blue"
                />
              </div>

              {/* Layer Ordering & Lock */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="font-semibold text-beyanco-navy block">
                  Depth & Ordering
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      updateSelectedObject({ zIndex: selectedObject.zIndex + 1 })
                    }
                  >
                    Bring Forward
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      updateSelectedObject({
                        zIndex: Math.max(1, selectedObject.zIndex - 1),
                      })
                    }
                  >
                    Send Backward
                  </Button>
                </div>
              </div>

              {/* Action Buttons: Duplicate & Delete */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDuplicateSelected}
                  icon={<Copy className="w-3.5 h-3.5" />}
                  className="flex-1"
                >
                  Duplicate
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteSelected}
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  className="px-3"
                />
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-beyanco-muted flex-1 flex flex-col items-center justify-center space-y-2">
              <Move className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-semibold text-beyanco-slate">
                No Object Selected
              </p>
              <p className="text-[11px] leading-relaxed">
                Click on any furniture item on the room canvas or choose a product from the left catalogue to inspect and transform.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
