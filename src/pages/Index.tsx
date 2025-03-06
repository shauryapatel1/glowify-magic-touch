
import React from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeatureSection } from "@/components/feature-section";
import { UploadDemoSection } from "@/components/upload-demo-section";
import { Footer } from "@/components/footer";
import { NoiseOverlay } from "@/components/noise-overlay";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <NoiseOverlay />
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        <UploadDemoSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
