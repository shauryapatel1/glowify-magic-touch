
import React, { useState } from "react";
import { useVideos } from "@/hooks/use-videos";
import { useToast } from "@/hooks/use-toast";
import { GlowUpCard } from "@/components/ui/glow-up-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoGrid } from "./video/video-grid";
import { VideoPlayerDialog } from "./video/video-player-dialog";
import { Video, VideoStatus } from "@/utils/videoUtils";
import { VideoProcessingService } from "@/services/VideoProcessingService";

export const VideoList = () => {
  const { videos, isLoading } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcessVideo = async (video: Video) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await VideoProcessingService.processVideo(video);
      
      if (!result.success) throw new Error(result.error);
      
      toast({
        title: "Processing Started",
        description: "Your video is being enhanced with AI effects.",
      });
    } catch (error: any) {
      console.error("Error processing video:", error);
      toast({
        title: "Processing Failed",
        description: error.message || "There was an error processing your video.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareVideo = async (video: Video) => {
    const result = await VideoProcessingService.shareVideo(video.id);
    
    if (result.success) {
      toast({
        title: "Link Copied",
        description: "Video sharing link copied to clipboard!",
      });
    }
  };

  const handleViewVideo = (video: Video) => {
    // Record view when a video is watched
    VideoProcessingService.recordView(video.id);
    
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-white/10 border-t-white rounded-full"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <GlowUpCard variant="glass" className="p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">No videos yet</h3>
        <p className="text-white/70 mb-6">
          Upload your first video to start using GlowUp effects.
        </p>
      </GlowUpCard>
    );
  }

  return (
    <div>
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <VideoGrid 
            videos={videos}
            onProcess={handleProcessVideo}
            onShare={handleShareVideo}
            onView={handleViewVideo}
          />
        </TabsContent>
        
        <TabsContent value="processing" className="space-y-4">
          <VideoGrid 
            videos={videos.filter(v => v.status === 'pending' || v.status === 'processing')}
            onProcess={handleProcessVideo}
            onShare={handleShareVideo}
            onView={handleViewVideo}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <VideoGrid 
            videos={videos.filter(v => v.status === 'completed')}
            onProcess={handleProcessVideo}
            onShare={handleShareVideo}
            onView={handleViewVideo}
          />
        </TabsContent>
      </Tabs>

      <VideoPlayerDialog 
        isOpen={isPlayerOpen} 
        setIsOpen={setIsPlayerOpen} 
        video={selectedVideo}
        onShare={handleShareVideo}
      />
    </div>
  );
};
