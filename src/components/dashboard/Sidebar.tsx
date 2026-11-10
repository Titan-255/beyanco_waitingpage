"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { storage, DEFAULT_USER } from "@/lib/storage";
import { User } from "@/types";
import {
  LayoutDashboard,
  FolderKanban,
  Images,
  Sparkles,
  Armchair,
  ChevronsLeftRight,
  Wand2,
  CreditCard,
  Settings,
  Layers,
  ExternalLink,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);

  useEffect(() => {
    const updateUser = () => {
      setCurrentUser(storage.getUser());
    };
    updateUser();

    window.addEventListener("beyanco-storage-sync", updateUser);
    window.addEventListener("storage", updateUser);
    return () => {
      window.removeEventListener("beyanco-storage-sync", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: FolderKanban,
    },
    {
      label: "My Designs",
      href: "/gallery",
      icon: Images,
    },
    {
      label: "Design",
      href: "/staging/new",
      icon: Sparkles,
      highlight: true,
    },
    {
      label: "Furniture Editor",
      href: "/design/gen_001/edit",
      icon: Layers,
    },
    {
      label: "Furniture Library",
      href: "/furniture-library",
      icon: Armchair,
    },
    {
      label: "Compare Studio",
      href: "/comparison",
      icon: ChevronsLeftRight,
    },
    {
      label: "AI Refinement",
      href: "/refine",
      icon: Wand2,
    },
    {
      label: "Credits & Billing",
      href: "/credits",
      icon: CreditCard,
    },
    {
      label: "Settings & API",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-beyanco-border flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-beyanco-border">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/beyanco-logo.jpg"
            alt="Beyanco"
            className="h-8 w-auto object-contain"
          />
          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-beyanco-paleBlue text-beyanco-blue rounded">
            AI
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-beyanco-muted uppercase">
          WORKSPACE
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-beyanco-paleBlue text-beyanco-blue font-semibold shadow-xs"
                  : "text-beyanco-slate hover:text-beyanco-navy hover:bg-slate-50",
                item.highlight && !isActive && "text-beyanco-blue font-semibold"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive
                    ? "text-beyanco-blue"
                    : item.highlight
                    ? "text-beyanco-blue"
                    : "text-beyanco-muted"
                )}
              />
              <span className="truncate">{item.label}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-beyanco-blue" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Workspace Plan Footer Card */}
      <div className="p-4 border-t border-beyanco-border space-y-3">
        {/* Customizable Studio Owner Card */}
        <Link
          href="/settings#profile"
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
          title="Customize Studio Profile & Title"
        >
          <img
            src={currentUser.avatarUrl || DEFAULT_USER.avatarUrl}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 group-hover:border-beyanco-blue transition-colors shrink-0 shadow-2xs"
          />
          <div className="flex flex-col text-left overflow-hidden min-w-0">
            <span className="text-xs font-semibold text-beyanco-navy truncate group-hover:text-beyanco-blue transition-colors">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-beyanco-muted truncate">
              {currentUser.title || "Studio Owner"}
            </span>
          </div>
          <span className="ml-auto text-[10px] font-semibold text-beyanco-blue opacity-0 group-hover:opacity-100 transition-opacity">
            Edit
          </span>
        </Link>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-beyanco-navy">Growth Plan</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>
          <p className="text-[11px] text-beyanco-slate mb-2.5">
            125 generation credits remaining this billing cycle.
          </p>
          <Link
            href="/credits"
            className="flex items-center justify-between text-xs font-semibold text-beyanco-blue hover:text-beyanco-blueHover"
          >
            <span>Top up Credits</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
