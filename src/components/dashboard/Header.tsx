"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { storage, DEFAULT_USER } from "@/lib/storage";
import { User } from "@/types";
import { formatCredits } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Sparkles, Coins, Bell, Plus, Settings2 } from "lucide-react";

export interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [credits, setCredits] = useState<number>(125);
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);

  useEffect(() => {
    const updateHeaderState = () => {
      setCredits(storage.getCredits());
      setCurrentUser(storage.getUser());
    };
    updateHeaderState();

    window.addEventListener("beyanco-storage-sync", updateHeaderState);
    window.addEventListener("storage", updateHeaderState);
    return () => {
      window.removeEventListener("beyanco-storage-sync", updateHeaderState);
      window.removeEventListener("storage", updateHeaderState);
    };
  }, []);

  return (
    <header className="h-18 bg-white border-b border-beyanco-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Title / Breadcrumbs */}
      <div>
        {title && (
          <h1 className="text-xl font-bold text-beyanco-navy tracking-tight">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xs text-beyanco-slate">{subtitle}</p>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Credits Balance Pill */}
        <Link
          href="/credits"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-beyanco-paleBlue border border-blue-200/60 hover:bg-blue-100/60 transition-colors"
          title="Available staging generation credits"
        >
          <Coins className="w-4 h-4 text-beyanco-blue" />
          <span className="text-xs font-bold text-beyanco-blue">
            {formatCredits(credits)}
          </span>
          <span className="text-[11px] font-medium text-slate-500">credits</span>
          <span className="w-4 h-4 rounded-full bg-beyanco-blue text-white flex items-center justify-center text-[10px] ml-0.5">
            <Plus className="w-2.5 h-2.5" />
          </span>
        </Link>

        {/* Quick New Staging Action */}
        <Link href="/staging/new" className="hidden sm:inline-flex">
          <Button
            size="sm"
            variant="primary"
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            New Staging
          </Button>
        </Link>

        {/* Notifications */}
        <button
          className="p-2 text-beyanco-slate hover:text-beyanco-navy hover:bg-slate-100 rounded-lg relative transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-beyanco-blue" />
        </button>

        {/* Customizable User Profile Pill */}
        <Link
          href="/settings#profile"
          className="flex items-center gap-2.5 pl-2.5 py-1 pr-2 border-l border-beyanco-border rounded-xl hover:bg-slate-50 transition-all duration-150 group"
          title="Edit Profile, Title, and Studio Workspace"
        >
          <div className="relative">
            <img
              src={currentUser.avatarUrl || DEFAULT_USER.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 group-hover:border-beyanco-blue transition-colors shadow-2xs"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
              <Settings2 className="w-2 h-2 text-beyanco-blue" />
            </div>
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-beyanco-navy leading-none group-hover:text-beyanco-blue transition-colors">
                {currentUser.name}
              </span>
            </div>
            <span className="text-[10px] text-beyanco-muted mt-0.5 leading-none">
              {currentUser.title || "Studio Owner"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
