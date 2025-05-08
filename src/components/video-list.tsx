
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GlowUpCard } from "@/components/ui/glow-up-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { VideoGrid } from "./video/video-grid";
import { VideoPlayerDialog } from "./video/video-player-dialog";
import { Video, VideoStatus, processVideo, shareVideo } from "@/utils/videoUtils";

export const VideoList = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const fetchVideos = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    fetchVideos();
    
    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('videos-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'videos' },
        (payload) => {
          // Update the video in the list when its status changes
          setVideos(currentVideos => 
            currentVideos.map(video => 
              video.id === payload.new.id ? payload.new as Video : video
            )
          );
          
          // Show toast notification for completed videos
          if (payload.new.status === 'completed' && payload.old.status === 'processing') {
            toast({
              title: "Video Processing Complete",
              description: `"${payload.new.title}" is ready to view!`,
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const handleProcessVideo = async (video: Video) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await processVideo(video.id, video.effect || "enhance");
      
      if (!result.success) throw new Error(result.error);
      
      toast({
        title: "Processing Started",
        description: "Your video is being enhanced with AI effects.",
      });
      
      // Refresh the videos list
      fetchVideos();
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
    const result = await shareVideo(video.id);
    
    if (result.success) {
      toast({
        title: "Link Copied",
        description: "Video sharing link copied to clipboard!",
      });
    }
  };

  const handleViewVideo = (video: Video) => {
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
