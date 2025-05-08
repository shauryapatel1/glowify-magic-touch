
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Share, Download } from "lucide-react";
import { Video } from "@/utils/videoUtils";

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
        
        <div className="relative aspect-video bg-black rounded-md overflow-hidden">
          <video 
            src={video.processed_url || ''} 
            controls 
            className="w-full h-full object-contain"
            poster={video.thumbnail_url || undefined}
          />
        </div>
        
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
