"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export interface DashboardLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function DashboardLayout({
  title,
  subtitle,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-beyanco-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
