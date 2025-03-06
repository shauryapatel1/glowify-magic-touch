
import React from "react";
import { cn } from "@/lib/utils";

interface NoiseOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  opacity?: string;
}

const NoiseOverlay = ({ className, opacity = "opacity-[0.03]", ...props }: NoiseOverlayProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full noise-bg pointer-events-none z-10",
        opacity,
        className
      )}
      {...props}
    />
  );
};

export { NoiseOverlay };
