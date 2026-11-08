import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Compass, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-beyanco-bg flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-beyanco-paleBlue text-beyanco-blue flex items-center justify-center mb-6 shadow-xs border border-blue-100">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-widest text-beyanco-blue mb-2">
        Error 404 — Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-beyanco-navy max-w-md">
        This Room Visualization Does Not Exist
      </h1>

      <p className="mt-3 text-sm text-beyanco-slate max-w-md leading-relaxed">
        The architectural layout or workspace route you are looking for has been moved, renamed, or is unavailable in the current listing.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link href="/">
          <Button
            variant="secondary"
            size="md"
            icon={<Home className="w-4 h-4" />}
            className="rounded-[12px] h-11 px-5"
          >
            Return to Homepage
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button
            variant="primary"
            size="md"
            icon={<Sparkles className="w-4 h-4" />}
            className="rounded-[12px] h-11 px-5 bg-beyanco-blue hover:bg-beyanco-blueHover text-white"
          >
            Open Workspace
          </Button>
        </Link>
      </div>
    </div>
  );
}
