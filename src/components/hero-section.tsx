
import React from "react";
import { GlowUpHeading } from "@/components/ui/glow-up-heading";
import { GlowUpButton } from "@/components/ui/glow-up-button";
import { GridBackground } from "@/components/grid-background";
import { NoiseOverlay } from "@/components/noise-overlay";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      <GridBackground />
      <NoiseOverlay />
      
      <div className="flex flex-col items-center text-center z-20 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="inline-block px-4 py-1.5 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="text-sm font-medium text-white/80">Introducing GlowUp AI</span>
          </div>
        </div>
        
        <GlowUpHeading 
          as="h1" 
          glowEffect 
          className="mb-6 tracking-tight leading-[1.1] animate-fade-in"
        >
          Elevate Your Videos with
          <span className="bg-gradient-to-r from-white via-white/90 to-white/80 text-transparent bg-clip-text"> AI Magic</span>
        </GlowUpHeading>
        
        <p className="text-white/70 text-xl max-w-2xl mb-10 animate-fade-in animation-delay-100">
          Automatically add stunning gestures, effects, and animations to your videos. 
          No editing skills required — just upload and let the AI work its magic.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-200">
          <GlowUpButton size="lg" glowEffect>
            Try Free Now
          </GlowUpButton>
          <GlowUpButton size="lg" variant="outline">
            See Examples
          </GlowUpButton>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white/50"
        >
          <path 
            d="M12 5L12 19M12 19L19 12M12 19L5 12" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
};

export { HeroSection };
