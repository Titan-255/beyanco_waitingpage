import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
  description?: string;
}

export interface StepIndicatorProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress connecting line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-beyanco-border -z-0" />
        <div
          className="absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-beyanco-blue transition-all duration-300 -z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 border-2",
                  isCompleted
                    ? "bg-beyanco-blue border-beyanco-blue text-white shadow-sm"
                    : isCurrent
                    ? "bg-white border-beyanco-blue text-beyanco-blue ring-4 ring-beyanco-paleBlue shadow-sm"
                    : "bg-white border-beyanco-border text-beyanco-muted"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium tracking-tight whitespace-nowrap",
                  isCurrent
                    ? "text-beyanco-navy font-semibold"
                    : isCompleted
                    ? "text-beyanco-slate"
                    : "text-beyanco-muted"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
