
import React from "react";
import { GlowUpLogo } from "@/components/glow-up-logo";
import { GlowUpButton } from "@/components/ui/glow-up-button";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <GlowUpLogo className="mr-8" />
          
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-white/70 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-white/70 hover:text-white transition-colors">
              Pricing
            </a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="#" className="hidden sm:inline-block text-white/70 hover:text-white transition-colors">
            Sign In
          </a>
          <GlowUpButton size="sm">Try Free</GlowUpButton>
        </div>
      </div>
    </header>
  );
};

export { Navbar };
