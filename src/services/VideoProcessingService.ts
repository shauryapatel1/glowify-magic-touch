
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Video, VideoEffect } from "@/utils/videoUtils";

export class VideoProcessingService {
  static async processVideo(video: Video) {
    try {
      const { data, error } = await supabase.functions.invoke('process-video', {
        body: { videoId: video.id, effect: video.effect }
      });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error: any) {
      console.error("Error processing video:", error);
      return { success: false, error: error.message || "Failed to process video" };
    }
  }

  static async shareVideo(videoId: string) {
    try {
      const shareUrl = `${window.location.origin}/shared-video/${videoId}`;
      await navigator.clipboard.writeText(shareUrl);
      return { success: true, shareUrl };
    } catch (error) {
      console.error("Error copying link:", error);
      return { success: false, error: "Failed to copy link" };
    }
  }

  static async recordView(videoId: string) {
    try {
      await supabase.functions.invoke('record-view', {
        body: { videoId }
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to record view:", error);
      return { success: false };
    }
  }
}
