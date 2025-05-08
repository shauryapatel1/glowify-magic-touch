
import React from "react";
import { Video } from "@/utils/videoUtils";
import { VideoCard } from "./video-card";

type VideoGridProps = {
  videos: Video[];
  onProcess: (video: Video) => void;
  onShare: (video: Video) => void;
  onView: (video: Video) => void;
};

export const VideoGrid = ({ videos, onProcess, onShare, onView }: VideoGridProps) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        <p>No videos in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          onProcess={onProcess}
          onShare={onShare}
          onView={() => onView(video)}
        />
      ))}
    </div>
  );
};
