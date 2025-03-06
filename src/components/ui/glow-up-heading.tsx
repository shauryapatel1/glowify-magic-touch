
import React from "react";
import { cn } from "@/lib/utils";

interface GlowUpHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  glowEffect?: boolean;
}

const GlowUpHeading = React.forwardRef<HTMLHeadingElement, GlowUpHeadingProps>(
  ({ className, as = "h2", glowEffect = false, children, ...props }, ref) => {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={cn(
          "text-white font-bold",
          {
            "text-4xl sm:text-5xl md:text-6xl": as === "h1",
            "text-3xl sm:text-4xl": as === "h2",
            "text-2xl sm:text-3xl": as === "h3",
            "text-xl sm:text-2xl": as === "h4",
            "glow-text": glowEffect,
          },
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlowUpHeading.displayName = "GlowUpHeading";

export { GlowUpHeading };
