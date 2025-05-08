
import React from "react";
import { GlowUpCard } from "@/components/ui/glow-up-card";
import { GlowUpButton } from "@/components/ui/glow-up-button";
import { Progress } from "@/components/ui/progress";
import { Eye, Share, CheckCircle2, Clock, AlertTriangle, PlayCircle } from "lucide-react";
import { Video, VideoStatus } from "@/utils/videoUtils";

type VideoCardProps = {
  video: Video;
  onProcess: (video: Video) => void;
  onShare: (video: Video) => void;
  onView: () => void;
};

export const VideoCard = ({ video, onProcess, onShare, onView }: VideoCardProps) => {
  const getStatusIcon = () => {
    switch (video.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <GlowUpCard variant="glass" className="overflow-hidden">
      <div 
        className="relative aspect-video bg-gray-800 flex items-center justify-center cursor-pointer" 
        onClick={video.status === 'completed' ? onView : undefined}
      >
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url} 
            alt={video.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-900 to-gray-800">
            <PlayCircle className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/70 rounded-md px-2 py-1 text-xs flex items-center gap-1">
          {getStatusIcon()}
          <span className="capitalize">{video.status}</span>
        </div>
        
        {video.view_count !== undefined && video.view_count > 0 && (
          <div className="absolute top-2 left-2 bg-black/70 rounded-md px-2 py-1 text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{video.view_count}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{video.title}</h3>
        {video.description && (
          <p className="text-white/70 text-sm mb-3 line-clamp-2">{video.description}</p>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-white/50">
            {new Date(video.created_at).toLocaleDateString()}
          </span>
          
          <div className="flex gap-2">
            {video.status === 'completed' ? (
              <>
                <GlowUpButton size="sm" variant="outline" onClick={() => onShare(video)}>
                  <Share className="w-4 h-4 mr-1" /> Share
                </GlowUpButton>
                <GlowUpButton size="sm" variant="outline" onClick={onView}>
                  <Eye className="w-4 h-4 mr-1" /> View
                </GlowUpButton>
              </>
            ) : video.status === 'pending' ? (
              <GlowUpButton size="sm" variant="outline" onClick={() => onProcess(video)}>
                Process
              </GlowUpButton>
            ) : null}
          </div>
        </div>

        {video.status === 'processing' && (
          <div className="mt-3">
            <Progress value={45} className="h-1" />
            <p className="text-xs text-white/50 mt-1 text-center">Processing with AI...</p>
          </div>
        )}
      </div>
    </GlowUpCard>
  );
};
