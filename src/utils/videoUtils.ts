
import { supabase } from "@/integrations/supabase/client";

// Types
export type VideoEffect = "enhance" | "cinematic" | "portrait" | "vintage";

export type VideoStatus = "pending" | "processing" | "completed" | "error";

export type Video = {
  id: string;
  title: string;
  description: string | null;
  status: VideoStatus;
  thumbnail_url: string | null;
  created_at: string;
  processed_url: string | null;
  effect: VideoEffect | string; // Allow string for database compatibility
  view_count?: number;
};

// Functions
export const processVideo = async (videoId: string, effect: VideoEffect) => {
  try {
    const { data, error } = await supabase.functions.invoke('process-video', {
      body: { videoId, effect }
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error processing video:", error);
    return { success: false, error: error.message || "Failed to process video" };
  }
};

export const shareVideo = async (videoId: string) => {
  try {
    const shareUrl = `${window.location.origin}/shared-video/${videoId}`;
    await navigator.clipboard.writeText(shareUrl);
    return { success: true, shareUrl };
  } catch (error) {
    console.error("Error copying link:", error);
    return { success: false, error: "Failed to copy link" };
  }
};

export const fetchUserVideos = async () => {
  try {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, videos: data || [] };
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    return { success: false, error: error.message || "Failed to fetch videos" };
  }
};

export const recordVideoView = async (videoId: string) => {
  try {
    await supabase.functions.invoke('record-view', {
      body: { videoId }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to record view:", error);
    return { success: false };
  }
};

export const getEffectLabel = (effect: VideoEffect): string => {
  switch (effect) {
    case "enhance": return "Enhanced";
    case "cinematic": return "Cinematic";
    case "portrait": return "Portrait Focus";
    case "vintage": return "Vintage";
    default: return "Enhanced";
  }
};
