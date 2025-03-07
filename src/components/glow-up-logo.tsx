
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

  // Purple gradient that represents "glow"
  const gradientId = "glow-gradient";
  
  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size], className)}
        {...props}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        
        {/* Outer glow circle */}
        <circle cx="20" cy="20" r="18" stroke={`url(#${gradientId})`} strokeWidth="2" />
        
        {/* Arrow pointing up for "Up" */}
        <path
          d="M20 10L20 30M20 10L13 17M20 10L27 17"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Central circle with gradient fill */}
        <circle cx="20" cy="20" r="5" fill={`url(#${gradientId})`} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 140 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      
      {/* G */}
      <path
        d="M18 10C14.134 10 11 13.134 11 17C11 20.866 14.134 24 18 24H22V19H16V15H22V10H18Z"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
      />
      
      {/* L */}
      <path
        d="M29 10V24H40"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* O */}
      <circle 
        cx="50" 
        cy="17" 
        r="7" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="2"
        fill="none"
      />
      
      {/* W with up arrow incorporated */}
      <path
        d="M64 10L68 24L72 17L76 24L80 10"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* U */}
      <path
        d="M89 10V20C89 22.2091 90.7909 24 93 24H97C99.2091 24 101 22.2091 101 20V10"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* P with arrow pointing up */}
      <path
        d="M109 10H114C116.761 10 119 12.2386 119 15C119 17.7614 116.761 20 114 20H109V10"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      <path
        d="M109 10V30"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Upward arrow at the end */}
      <path
        d="M130 24V14M130 14L125 19M130 14L135 19"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Sparkle effect */}
      <circle cx="130" cy="10" r="1.5" fill={`url(#${gradientId})`} />
      <circle cx="125" cy="12" r="1" fill={`url(#${gradientId})`} />
      <circle cx="135" cy="12" r="1" fill={`url(#${gradientId})`} />
    </svg>
  );
};

export { GlowUpLogo };
