
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Share, Download } from "lucide-react";
import { Video } from "@/utils/videoUtils";
import { EnhancedVideoPlayer } from "./enhanced-video-player";
import { VideoProcessingService } from "@/services/VideoProcessingService";

type VideoPlayerDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  video: Video | null;
  onShare: (video: Video) => void;
};

export const VideoPlayerDialog = ({ 
  isOpen, 
  setIsOpen, 
  video,
  onShare
}: VideoPlayerDialogProps) => {
  useEffect(() => {
    // Record view when dialog opens with a valid video
    if (isOpen && video) {
      VideoProcessingService.recordView(video.id);
    }
  }, [isOpen, video]);

  if (!video) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{video.title}</DialogTitle>
          {video.description && (
            <DialogDescription>{video.description}</DialogDescription>
          )}
        </DialogHeader>
        
        <EnhancedVideoPlayer video={video} autoPlay={true} />
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-white/50">
            Processed with GlowUp AI
          </span>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onShare(video)}
            >
              <Share className="w-4 h-4 mr-2" /> Share Video
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <a href={video.processed_url || '#'} download target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" /> Download
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
