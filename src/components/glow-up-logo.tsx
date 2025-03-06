
import React from "react";
import { cn } from "@/lib/utils";

interface GlowUpLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
}

const GlowUpLogo = ({ 
  className, 
  variant = "full", 
  size = "md", 
  ...props 
}: GlowUpLogoProps) => {
  const sizeClasses = {
    sm: variant === "icon" ? "h-8 w-8" : "h-8",
    md: variant === "icon" ? "h-12 w-12" : "h-10",
    lg: variant === "icon" ? "h-16 w-16" : "h-12",
  };

  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-white", sizeClasses[size], className)}
        {...props}
      >
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
        <path
          d="M20 10V30M10 20H30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="5" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", sizeClasses[size], className)}
      {...props}
    >
      <path
        d="M13 10H18C21.866 10 25 13.134 25 17V17C25 20.866 21.866 24 18 24H13V10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M13 17H21" stroke="currentColor" strokeWidth="2" />
      <path d="M13 10V30" stroke="currentColor" strokeWidth="2" />
      <path
        d="M35 10H40C43.866 10 47 13.134 47 17V23C47 26.866 43.866 30 40 30H35V10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="41" cy="15" r="2" fill="currentColor" />
      <path d="M58 10L63 30M63 30H68M63 30L58 30" stroke="currentColor" strokeWidth="2" />
      <path
        d="M73 10V25C73 27.7614 75.2386 30 78 30H83C85.7614 30 88 27.7614 88 25V10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M97 10L97 30M97 10H102C104.761 10 107 12.2386 107 15V15C107 17.7614 104.761 20 102 20H97"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M115 14C115 11.7909 113.209 10 111 10C108.791 10 107 11.7909 107 14C107 16.2091 108.791 18 111 18"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M115 30V26C115 23.7909 113.209 22 111 22C108.791 22 107 23.7909 107 26V30"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};

export { GlowUpLogo };
