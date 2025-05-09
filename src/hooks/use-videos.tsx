
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Video, VideoStatus } from "@/utils/videoUtils";

export function useVideos() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      
      // Transform the raw data into Video objects with proper typing
      const typedVideos: Video[] = data?.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        status: video.status as VideoStatus, // Explicitly cast to VideoStatus
        thumbnail_url: video.thumbnail_url,
        created_at: video.created_at || "",
        processed_url: video.processed_url,
        effect: video.effect || "enhance",
        view_count: video.view_count
      })) || [];
      
      setVideos(typedVideos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Failed to load videos",
        description: "There was a problem loading your videos. Please try again.",
        variant: "destructive",
      });
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
              video.id === payload.new.id ? {
                id: payload.new.id,
                title: payload.new.title,
                description: payload.new.description,
                status: payload.new.status as VideoStatus, // Explicitly cast to VideoStatus
                thumbnail_url: payload.new.thumbnail_url,
                created_at: payload.new.created_at || "",
                processed_url: payload.new.processed_url,
                effect: payload.new.effect || "enhance",
                view_count: payload.new.view_count
              } : video
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

  return { videos, isLoading, fetchVideos };
}
