
import React, { useEffect, useRef } from "react";
import { Video } from "@/utils/videoUtils";
import { VideoAnalytics } from "./video-analytics";

type EnhancedVideoPlayerProps = {
  video: Video;
  onPlay?: () => void;
  autoPlay?: boolean;
};

export const EnhancedVideoPlayer = ({ 
  video, 
  onPlay,
  autoPlay = false
}: EnhancedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Autoplay failed:", error);
      });
    }
  }, [autoPlay]);

  const handlePlay = () => {
    if (onPlay) onPlay();
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-md overflow-hidden">
        <video 
          ref={videoRef}
          src={video.processed_url || ''} 
          controls 
          className="w-full h-full object-contain"
          poster={video.thumbnail_url || undefined}
          onPlay={handlePlay}
        />
      </div>
      
      <VideoAnalytics video={video} />
    </div>
  );
};
