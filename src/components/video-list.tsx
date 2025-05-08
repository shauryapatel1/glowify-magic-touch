import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GlowUpCard } from "@/components/ui/glow-up-card";
import { GlowUpButton } from "@/components/ui/glow-up-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, PlayCircle, CheckCircle2, Clock, AlertTriangle, Share, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type Video = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  thumbnail_url: string | null;
  created_at: string;
  processed_url: string | null;
};

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
      // Call the process-video edge function
      const { data, error } = await supabase.functions.invoke('process-video', {
        body: { videoId: video.id, effect: 'enhance' }
      });
      
      if (error) throw error;
      
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
    // Update to use the shared-video route
    try {
      const shareUrl = `${window.location.origin}/shared-video/${video.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Video sharing link copied to clipboard!",
      });
    } catch (error) {
      console.error("Error copying link:", error);
    }
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
          {renderVideoGrid(videos, handleProcessVideo, handleShareVideo, setSelectedVideo, setIsPlayerOpen)}
        </TabsContent>
        
        <TabsContent value="processing" className="space-y-4">
          {renderVideoGrid(videos.filter(v => v.status === 'pending' || v.status === 'processing'), handleProcessVideo, handleShareVideo, setSelectedVideo, setIsPlayerOpen)}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {renderVideoGrid(videos.filter(v => v.status === 'completed'), handleProcessVideo, handleShareVideo, setSelectedVideo, setIsPlayerOpen)}
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

const renderVideoGrid = (
  videos: Video[], 
  onProcess: (video: Video) => void,
  onShare: (video: Video) => void,
  setSelectedVideo: (video: Video) => void,
  setIsPlayerOpen: (open: boolean) => void
) => {
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
          onView={() => {
            setSelectedVideo(video);
            setIsPlayerOpen(true);
          }}
        />
      ))}
    </div>
  );
};

const VideoCard = ({ 
  video, 
  onProcess, 
  onShare,
  onView
}: { 
  video: Video,
  onProcess: (video: Video) => void,
  onShare: (video: Video) => void,
  onView: () => void
}) => {
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

const VideoPlayerDialog = ({ 
  isOpen, 
  setIsOpen, 
  video,
  onShare
}: { 
  isOpen: boolean, 
  setIsOpen: (open: boolean) => void, 
  video: Video | null,
  onShare: (video: Video) => void
}) => {
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
