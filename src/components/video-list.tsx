
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GlowUpCard } from "@/components/ui/glow-up-card";
import { GlowUpButton } from "@/components/ui/glow-up-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, PlayCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

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

  useEffect(() => {
    if (!user) return;

    const fetchVideos = async () => {
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

    fetchVideos();
  }, [user]);

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
          {renderVideoGrid(videos)}
        </TabsContent>
        
        <TabsContent value="processing" className="space-y-4">
          {renderVideoGrid(videos.filter(v => v.status === 'pending' || v.status === 'processing'))}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {renderVideoGrid(videos.filter(v => v.status === 'completed'))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const renderVideoGrid = (videos: Video[]) => {
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
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

const VideoCard = ({ video }: { video: Video }) => {
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
      <div className="relative aspect-video bg-gray-800 flex items-center justify-center">
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
          
          {video.status === 'completed' && (
            <GlowUpButton size="sm" variant="link" className="p-0">
              <Eye className="w-4 h-4 mr-1" /> View
            </GlowUpButton>
          )}
        </div>
      </div>
    </GlowUpCard>
  );
};
