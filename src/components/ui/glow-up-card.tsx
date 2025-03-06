
import React from "react";
import { cn } from "@/lib/utils";

interface GlowUpCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "outline";
  hoverable?: boolean;
}

const GlowUpCard = React.forwardRef<HTMLDivElement, GlowUpCardProps>(
  ({ className, variant = "glass", hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-300",
          {
            "backdrop-blur-lg bg-black/60 border border-white/10": variant === "glass",
            "bg-secondary": variant === "solid",
            "bg-transparent border border-white/20": variant === "outline",
            "hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]": hoverable,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlowUpCard.displayName = "GlowUpCard";

export { GlowUpCard };
