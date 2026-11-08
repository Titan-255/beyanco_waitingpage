import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "blue" | "violet" | "emerald" | "amber" | "red" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-beyanco-navy border-slate-200",
    blue: "bg-beyanco-paleBlue text-beyanco-blue border-blue-200",
    violet: "bg-purple-50 text-beyanco-violet border-purple-200",
    emerald: "bg-emerald-50 text-beyanco-emerald border-emerald-200",
    amber: "bg-amber-50 text-beyanco-amber border-amber-200",
    red: "bg-red-50 text-beyanco-red border-red-200",
    outline: "bg-transparent text-beyanco-slate border-beyanco-border",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium rounded-full border",
    md: "px-2.5 py-1 text-xs font-medium rounded-full border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
