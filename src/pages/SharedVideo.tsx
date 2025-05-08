
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NoiseOverlay } from "@/components/noise-overlay";
import { GridBackground } from "@/components/grid-background";
import { GlowUpHeading } from "@/components/ui/glow-up-heading";
import { GlowUpCard } from "@/components/ui/glow-up-card";
import { Button } from "@/components/ui/button";
import { Download, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const SharedVideo = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .eq("id", videoId)
          .eq("status", "completed")
          .single();
          
        if (error) throw error;
        
        if (!data) {
          setError("Video not found or still processing");
          return;
        }
        
        setVideo(data);
        
        // Record view analytics
        await supabase.functions.invoke('record-view', {
          body: { videoId }
        }).catch(err => {
          // Don't show errors to the user for analytics
          console.error("Failed to record view:", err);
        });
      } catch (err: any) {
        console.error("Error fetching video:", err);
        setError(err.message || "Failed to load video");
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const handleShareVideo = async () => {
    if (!video) return;
    
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Video sharing link copied to clipboard!",
      });
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white/10 border-t-white rounded-full"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black text-white relative">
        <NoiseOverlay />
        <Navbar />
        <main className="container mx-auto px-4 py-24 relative z-10">
          <GlowUpCard variant="glass" className="p-8 text-center max-w-2xl mx-auto">
            <GlowUpHeading as="h2" className="mb-4">Video Not Available</GlowUpHeading>
            <p className="text-white/70 mb-6">
              {error || "This video is either private, has been removed, or is still being processed."}
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Back to Home
            </Button>
          </GlowUpCard>
        </main>
        <GridBackground />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <NoiseOverlay />
      <Navbar />
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <GlowUpHeading as="h1" className="mb-6">{video.title}</GlowUpHeading>
          
          {video.description && (
            <p className="text-white/70 text-lg mb-8">{video.description}</p>
          )}
          
          <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden mb-6">
            <div className="aspect-video w-full">
              <video 
                src={video.processed_url} 
                poster={video.thumbnail_url}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-white/50">
              Processed with GlowUp AI
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleShareVideo}
              >
                <Share className="mr-2 h-4 w-4" /> Share
              </Button>
              
              <Button 
                variant="outline"
                asChild
              >
                <a 
                  href={video.processed_url} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <GridBackground />
      <Footer />
    </div>
  );
};

export default SharedVideo;
