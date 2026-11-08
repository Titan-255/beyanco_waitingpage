"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to diagnostic console
    console.error("[Beyanco AI Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-beyanco-bg flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 shadow-xs border border-amber-200">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
        System Notice — Rendering Interrupted
      </span>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-beyanco-navy max-w-lg">
        An Unexpected Issue Occurred
      </h1>

      <p className="mt-3 text-sm text-beyanco-slate max-w-md leading-relaxed">
        The workspace encountered an unexpected issue while rendering this view. Your design data and uploaded images remain safe.
      </p>

      {error.message && (
        <div className="mt-4 max-w-md p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 text-left overflow-x-auto">
          {error.message}
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Button
          onClick={() => reset()}
          variant="primary"
          size="md"
          icon={<RotateCcw className="w-4 h-4" />}
          className="rounded-[12px] h-11 px-6 bg-beyanco-blue hover:bg-beyanco-blueHover text-white"
        >
          Try Again
        </Button>
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
      </div>
    </div>
  );
}
