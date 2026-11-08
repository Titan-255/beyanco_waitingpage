import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ai" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-[12px] gap-2",
      lg: "h-[50px] px-8 text-base rounded-[12px] gap-2.5",
      icon: "h-10 w-10 p-0 rounded-lg justify-center",
    };

    const variantStyles = {
      primary:
        "bg-beyanco-blue text-white hover:bg-beyanco-blueHover focus:ring-beyanco-blue shadow-subtle hover:shadow-card",
      secondary:
        "bg-white text-beyanco-navy border border-beyanco-border hover:bg-slate-50 focus:ring-beyanco-slate shadow-subtle",
      ai: "bg-gradient-to-r from-beyanco-blue via-indigo-600 to-beyanco-violet text-white hover:opacity-95 focus:ring-beyanco-violet shadow-md hover:shadow-cardHover",
      ghost:
        "bg-transparent text-beyanco-slate hover:text-beyanco-navy hover:bg-slate-100/70 focus:ring-beyanco-slate",
      danger:
        "bg-beyanco-red text-white hover:bg-red-600 focus:ring-beyanco-red shadow-subtle",
      outline:
        "bg-transparent text-beyanco-blue border border-beyanco-blue/30 hover:bg-beyanco-paleBlue focus:ring-beyanco-blue",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          icon && <span className="inline-flex shrink-0">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
