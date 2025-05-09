
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { NoiseOverlay } from "@/components/noise-overlay";
import { GlowUpHeading } from "@/components/ui/glow-up-heading";
import { Footer } from "@/components/footer";
import { VideoList } from "@/components/video-list";
import { UploadVideo } from "@/components/upload-video";
import { GridBackground } from "@/components/grid-background";
import { ErrorBoundary } from "@/components/error-boundary";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white/10 border-t-white rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <NoiseOverlay />
      <Navbar />
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <GlowUpHeading as="h1" className="mb-12">
            Your Videos
          </GlowUpHeading>
          
          <UploadVideo />
          
          <div className="mt-16">
            <ErrorBoundary>
              <VideoList />
            </ErrorBoundary>
          </div>
        </div>
      </main>
      <GridBackground />
      <Footer />
    </div>
  );
};

export default Dashboard;
