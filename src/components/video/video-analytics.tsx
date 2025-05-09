
import React from "react";
import { GlowUpCard } from "@/components/ui/glow-up-card";
import { Eye, Share, Clock } from "lucide-react";
import { Video } from "@/utils/videoUtils";
import { formatDistanceToNow } from "date-fns";

type VideoAnalyticsProps = {
  video: Video;
};

export const VideoAnalytics = ({ video }: VideoAnalyticsProps) => {
  const uploadDate = new Date(video.created_at);
  const timeAgo = formatDistanceToNow(uploadDate, { addSuffix: true });

  return (
    <GlowUpCard variant="glass" className="p-4">
      <h3 className="text-lg font-semibold mb-4">Video Analytics</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg">
          <Eye className="h-5 w-5 mb-1 text-blue-400" />
          <span className="font-bold">{video.view_count || 0}</span>
          <span className="text-xs text-white/70">Views</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg">
          <Clock className="h-5 w-5 mb-1 text-green-400" />
          <span className="font-bold">{timeAgo}</span>
          <span className="text-xs text-white/70">Uploaded</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg">
          <Share className="h-5 w-5 mb-1 text-purple-400" />
          <span className="font-bold">Share</span>
          <span className="text-xs text-white/70">Your Video</span>
        </div>
      </div>
    </GlowUpCard>
  );
};
