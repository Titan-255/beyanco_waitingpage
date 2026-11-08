"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FURNITURE_CATALOG } from "@/lib/sample-data";
import { FurnitureProduct } from "@/types";
import {
  Armchair,
  Search,
  Layers,
  ArrowRight,
  Maximize2,
  Tag,
} from "lucide-react";

export default function FurnitureLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filtered = FURNITURE_CATALOG.filter((item) => {
    const matchCat =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.material.toLowerCase().includes(search.toLowerCase()) ||
      item.style.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <DashboardLayout
      title="Furniture & Decor Library"
      subtitle="Curated designer furnishings ready for 2D staging placement and spatial editing."
    >
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-beyanco-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: "all", label: "All Items" },
              { id: "sofas", label: "Sofas" },
              { id: "chairs", label: "Chairs" },
              { id: "tables", label: "Tables" },
              { id: "lighting", label: "Lighting" },
              { id: "rugs", label: "Rugs" },
              { id: "plants", label: "Botanicals" },
              { id: "decor", label: "Artwork" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-beyanco-navy text-white shadow-xs"
                    : "bg-slate-50 text-beyanco-slate hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-beyanco-muted" />
            <input
              type="text"
              placeholder="Search by material, style..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-1 focus:ring-beyanco-blue"
            />
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Card
              key={product.id}
              hoverEffect
              className="p-0 overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-center aspect-[4/3] overflow-hidden">
                <img
                  src={product.previewUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-200"
                />
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-beyanco-muted uppercase tracking-wider">
                      {product.category}
                    </span>
                    <Badge variant="blue" size="sm">
                      {product.style}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-beyanco-navy mt-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-beyanco-slate mt-0.5">
                    {product.material}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-beyanco-muted font-mono text-[11px]">
                    {product.dimensions.widthCm}×{product.dimensions.depthCm}×{product.dimensions.heightCm}cm
                  </span>

                  <Link href="/design/gen_001/edit">
                    <Button variant="ghost" size="sm" icon={<Layers className="w-3 h-3" />}>
                      Place on Canvas
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
