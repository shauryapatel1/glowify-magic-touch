
import React from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}

const GridBackground = ({ className, animate = true, ...props }: GridBackgroundProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full opacity-[0.05]",
        animate && "animate-pulse-subtle",
        className
      )}
      style={{
        backgroundSize: "40px 40px",
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundPosition: "center",
      }}
      {...props}
    />
  );
};

export { GridBackground };
