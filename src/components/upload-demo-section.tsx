
import React, { useState } from "react";
import { GlowUpHeading } from "@/components/ui/glow-up-heading";
import { GlowUpCard } from "@/components/ui/glow-up-card";
import { GlowUpButton } from "@/components/ui/glow-up-button";
import { GridBackground } from "@/components/grid-background";
import { NoiseOverlay } from "@/components/noise-overlay";

const UploadDemoSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessing(true);
    
    // Simulate processing
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setProgress(0);
        }, 1000);
      }
    }, 30);
  };

  const handleClick = () => {
    setIsProcessing(true);
    
    // Simulate processing
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setProgress(0);
        }, 1000);
      }
    }, 30);
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <GridBackground />
      <NoiseOverlay />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <GlowUpHeading as="h2" className="mb-6">
            Experience the Magic
          </GlowUpHeading>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Upload your video and watch as our AI adds the perfect effects.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <GlowUpCard 
            variant="glass" 
            className={`
              p-10 aspect-video flex flex-col items-center justify-center border transition-all duration-300
              ${isDragging ? 'border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'border-white/10'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isProcessing ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-6">
                  <svg className="animate-spin-slow w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth="8" 
                      fill="none" 
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="white" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * progress) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">{progress}%</span>
                  </div>
                </div>
                <p className="text-white/80 text-xl mb-2 animate-pulse-subtle">Enhancing...</p>
                <p className="text-white/50 text-sm">Our AI is adding effects to your video</p>
              </div>
            ) : (
              <>
                <svg 
                  className="w-16 h-16 mb-6 text-white/50" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10M12 14V17M8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.7202 10 16.8802 10 15.2 10H8.8C7.11984 10 6.27976 10 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-white mb-3">Drop Your Clip</h3>
                <p className="text-white/70 text-center mb-6">
                  Drag and drop your video here, or click to browse
                </p>
                <GlowUpButton onClick={handleClick} glowEffect>
                  Upload Video
                </GlowUpButton>
              </>
            )}
          </GlowUpCard>
        </div>
      </div>
    </section>
  );
};

export { UploadDemoSection };
