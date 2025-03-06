
import React from "react";
import { cn } from "@/lib/utils";

interface GlowUpButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  glowEffect?: boolean;
}

const GlowUpButton = React.forwardRef<HTMLButtonElement, GlowUpButtonProps>(
  ({ className, variant = "primary", size = "md", glowEffect = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-white/20",
          {
            "bg-white text-black hover:bg-white/90": variant === "primary",
            "bg-secondary text-white hover:bg-secondary/90": variant === "secondary",
            "bg-transparent border border-white/20 text-white hover:bg-white/10": variant === "outline",
            "text-sm px-4 py-2": size === "sm",
            "text-base px-6 py-2.5": size === "md",
            "text-lg px-8 py-3": size === "lg",
            "after:absolute after:inset-0 after:rounded-md after:shadow-[0_0_15px_rgba(255,255,255,0.4)] after:opacity-0 hover:after:opacity-100 after:transition-opacity": glowEffect,
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlowUpButton.displayName = "GlowUpButton";

export { GlowUpButton };
