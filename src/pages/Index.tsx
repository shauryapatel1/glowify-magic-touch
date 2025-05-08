
import React from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeatureSection } from "@/components/feature-section";
import { UploadDemoSection } from "@/components/upload-demo-section";
import { Footer } from "@/components/footer";
import { NoiseOverlay } from "@/components/noise-overlay";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GlowUpButton } from "@/components/ui/glow-up-button";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <NoiseOverlay />
      <Navbar />
      <main>
        <HeroSection />
        <div className="flex justify-center mt-8">
          <GlowUpButton onClick={handleGetStarted} size="lg" glowEffect>
            {user ? "Go to Dashboard" : "Get Started"}
          </GlowUpButton>
        </div>
        <FeatureSection />
        <UploadDemoSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
